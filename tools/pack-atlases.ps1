param(
    [string]$ConfigPath = "",
    [string]$AtlasesDir = "",
    [string]$ManifestPath = "",
    [switch]$SkipWebp
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($ConfigPath)) {
    $ConfigPath = Join-Path $PSScriptRoot "atlas-groups.json"
}
if ([string]::IsNullOrWhiteSpace($AtlasesDir)) {
    $AtlasesDir = Join-Path $projectRoot "assets/atlases"
}
if ([string]::IsNullOrWhiteSpace($ManifestPath)) {
    $ManifestPath = Join-Path $projectRoot "src/generated/atlasManifest.ts"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$magickCommand = Get-Command magick.exe, magick -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $SkipWebp -and -not $magickCommand) {
    throw "magick.exe is required to generate WEBP atlases. Install ImageMagick or run with -SkipWebp."
}
$magickExe = if ($magickCommand) { $magickCommand.Source } else { $null }

function Ensure-Directory([string]$Path) {
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Force -Path $Path | Out-Null
    }
}

function Write-TextFile([string]$Path, [string]$Content) {
    $dir = Split-Path -Parent $Path
    if ($dir) {
        Ensure-Directory $dir
    }
    [IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Get-RelativePath([string]$BasePath, [string]$TargetPath) {
    $baseFullPath = (Resolve-Path $BasePath).Path.TrimEnd('\')
    $targetFullPath = (Resolve-Path $TargetPath).Path

    if ($targetFullPath.Equals($baseFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        return ''
    }

    $basePrefix = $baseFullPath + '\'
    if ($targetFullPath.StartsWith($basePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $targetFullPath.Substring($basePrefix.Length)
    }

    $baseUri = New-Object System.Uri(($basePrefix))
    $targetUri = New-Object System.Uri($targetFullPath)
    return [System.Uri]::UnescapeDataString($baseUri.MakeRelativeUri($targetUri).ToString())
}

function Get-ForwardPath([string]$Path) {
    return $Path.Replace('\', '/')
}

function Get-ImageSize([string]$Path) {
    $image = [System.Drawing.Image]::FromFile($Path)
    try {
        return [pscustomobject]@{
            Width = $image.Width
            Height = $image.Height
        }
    }
    finally {
        $image.Dispose()
    }
}

function Get-OutputName([object]$Group, [int]$Index, [int]$PageCount) {
    $pattern = [string]($Group.outputPattern)
    if ($pattern.Contains('{index}')) {
        return $pattern.Replace('{index}', [string]$Index)
    }
    if ($PageCount -eq 1 -and $Index -eq 0) {
        return $pattern
    }
    return "$pattern-$Index"
}

function Get-CleanupPrefix([object]$Group) {
    $pattern = [string]($Group.outputPattern)
    if ($pattern.Contains('{index}')) {
        return $pattern.Substring(0, $pattern.IndexOf('{index}'))
    }
    return $pattern
}

function Get-AtlasItems([object]$Group) {
    $sourceRoot = Join-Path $projectRoot $Group.sourceDir
    if (-not (Test-Path $sourceRoot)) {
        return @()
    }

    $excludePatterns = @()
    if ($Group.PSObject.Properties.Name -contains 'exclude') {
        $excludePatterns = @($Group.exclude)
    }

    $items = @()
    Get-ChildItem -Path $sourceRoot -File -Recurse |
        Where-Object { $_.Extension.ToLowerInvariant() -in @('.png', '.jpg', '.jpeg') } |
        ForEach-Object {
            $sourceRelative = Get-ForwardPath (Get-RelativePath $sourceRoot $_.FullName)
            $skip = $false
            foreach ($pattern in $excludePatterns) {
                if ($sourceRelative -like $pattern) {
                    $skip = $true
                    break
                }
            }

            if (-not $skip) {
                $assetRelative = Get-ForwardPath (Get-RelativePath (Join-Path $projectRoot 'assets') $_.FullName)
                $size = Get-ImageSize $_.FullName
                $items += [pscustomobject]@{
                    FullPath = $_.FullName
                    FrameName = $assetRelative
                    Width = $size.Width
                    Height = $size.Height
                }
            }
        }

    return @($items | Sort-Object @{ Expression = 'Height'; Descending = $true }, @{ Expression = 'Width'; Descending = $true }, @{ Expression = 'FrameName'; Descending = $false })
}

function New-AtlasPages([object[]]$Items, [int]$MaxWidth, [int]$MaxHeight) {
    $padding = 2
    $border = 1
    $pages = @()
    if ($Items.Count -eq 0) {
        return @()
    }

    $pageItems = @()
    $x = $border
    $y = $border
    $rowHeight = 0
    $usedWidth = $border * 2
    $usedHeight = $border * 2

    foreach ($item in $Items) {
        if (($item.Width + ($border * 2)) -gt $MaxWidth -or ($item.Height + ($border * 2)) -gt $MaxHeight) {
            throw "Image $($item.FrameName) does not fit inside ${MaxWidth}x${MaxHeight}."
        }

        if ($pageItems.Count -gt 0 -and ($x + $item.Width + $border) -gt $MaxWidth) {
            $x = $border
            $y += $rowHeight + $padding
            $rowHeight = 0
        }

        if ($pageItems.Count -gt 0 -and ($y + $item.Height + $border) -gt $MaxHeight) {
            $pages += [pscustomobject]@{
                Width = [Math]::Max($usedWidth, $border * 2)
                Height = [Math]::Max($usedHeight, $border * 2)
                Items = @($pageItems)
            }
            $pageItems = @()
            $x = $border
            $y = $border
            $rowHeight = 0
            $usedWidth = $border * 2
            $usedHeight = $border * 2
        }

        if (($x + $item.Width + $border) -gt $MaxWidth -or ($y + $item.Height + $border) -gt $MaxHeight) {
            throw "Could not place $($item.FrameName) into atlas page."
        }

        $pageItems += [pscustomobject]@{
            FullPath = $item.FullPath
            FrameName = $item.FrameName
            Width = $item.Width
            Height = $item.Height
            X = $x
            Y = $y
        }

        $usedWidth = [Math]::Max($usedWidth, $x + $item.Width + $border)
        $usedHeight = [Math]::Max($usedHeight, $y + $item.Height + $border)
        $rowHeight = [Math]::Max($rowHeight, $item.Height)
        $x += $item.Width + $padding
    }

    if ($pageItems.Count -gt 0) {
        $pages += [pscustomobject]@{
            Width = [Math]::Max($usedWidth, $border * 2)
            Height = [Math]::Max($usedHeight, $border * 2)
            Items = @($pageItems)
        }
    }

    return @($pages)
}

function Remove-StaleOutputs([string]$OutputDir, [string]$Prefix, [string[]]$AtlasNames) {
    $keep = @{}
    foreach ($name in $AtlasNames) {
        $keep["$name.png"] = $true
        $keep["$name.json"] = $true
        $keep["$name.webp"] = $true
    }

    Get-ChildItem -Path $OutputDir -File -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name.StartsWith($Prefix) -and $_.Extension.ToLowerInvariant() -in @('.png', '.json', '.webp')
        } |
        ForEach-Object {
            if (-not $keep.ContainsKey($_.Name)) {
                Remove-Item -Force $_.FullName
            }
        }
}

function Save-AtlasPng([object]$Page, [string]$PngPath) {
    $bitmap = New-Object System.Drawing.Bitmap $Page.Width, $Page.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

        foreach ($item in $Page.Items) {
            $image = [System.Drawing.Image]::FromFile($item.FullPath)
            try {
                $graphics.DrawImage($image, $item.X, $item.Y, $item.Width, $item.Height)
            }
            finally {
                $image.Dispose()
            }
        }

        $bitmap.Save($PngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

function Save-Webp([string]$PngPath, [string]$WebpPath) {
    if ($SkipWebp) {
        return
    }

    & $magickExe $PngPath '-define' 'webp:lossless=true' $WebpPath | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "magick.exe failed while generating $WebpPath."
    }
}

function Save-AtlasJson([object]$Page, [string]$AtlasName, [string]$JsonPath) {
    $frames = [ordered]@{}
    foreach ($item in ($Page.Items | Sort-Object FrameName)) {
        $frames[$item.FrameName] = [ordered]@{
            frame = [ordered]@{
                x = $item.X
                y = $item.Y
                w = $item.Width
                h = $item.Height
            }
            rotated = $false
            trimmed = $false
            spriteSourceSize = [ordered]@{
                x = 0
                y = 0
                w = $item.Width
                h = $item.Height
            }
            sourceSize = [ordered]@{
                w = $item.Width
                h = $item.Height
            }
            pivot = [ordered]@{
                x = 0.5
                y = 0.5
            }
        }
    }

    $doc = [ordered]@{
        frames = $frames
        meta = [ordered]@{
            app = 'codex-atlas-packer'
            version = '1.0'
            image = "$AtlasName.png"
            format = 'RGBA8888'
            size = [ordered]@{
                w = $Page.Width
                h = $Page.Height
            }
            scale = 1
        }
    }

    $json = ($doc | ConvertTo-Json -Depth 12)
    Write-TextFile $JsonPath ($json + "`n")
}

function Sync-Screens([string]$SourceDir, [string]$OutputDir) {
    Ensure-Directory $OutputDir
    $keep = @{}

    Get-ChildItem -Path $SourceDir -File |
        Where-Object { $_.Extension.ToLowerInvariant() -in @('.png', '.jpg', '.jpeg') } |
        ForEach-Object {
            $name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
            $pngPath = Join-Path $OutputDir "$name.png"
            $webpPath = Join-Path $OutputDir "$name.webp"

            $image = [System.Drawing.Image]::FromFile($_.FullName)
            try {
                $bitmap = New-Object System.Drawing.Bitmap $image.Width, $image.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
                $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
                try {
                    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
                    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
                }
                finally {
                    $graphics.Dispose()
                    $bitmap.Dispose()
                }
            }
            finally {
                $image.Dispose()
            }

            Save-Webp $pngPath $webpPath
            $keep["$name.png"] = $true
            $keep["$name.webp"] = $true
        }

    Get-ChildItem -Path $OutputDir -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension.ToLowerInvariant() -in @('.png', '.webp') } |
        ForEach-Object {
            if (-not $keep.ContainsKey($_.Name)) {
                Remove-Item -Force $_.FullName
            }
        }
}

function Save-Manifest([System.Collections.Specialized.OrderedDictionary]$Manifest, [string]$Path) {
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('// Generated by tools/pack-atlases.ps1. Do not edit manually.')
    $lines.Add('')
    $lines.Add('export const ATLAS_GROUPS: { [key: string]: string[] } = {')
    foreach ($groupId in $Manifest.Keys) {
        $names = @($Manifest[$groupId])
        $quoted = @($names | ForEach-Object { "'$_'" }) -join ', '
        $lines.Add("    '$groupId': [$quoted],")
    }
    $lines.Add('};')
    $lines.Add('')
    $lines.Add('export function getAtlasGroupNames(groupId: string): string[] {')
    $lines.Add('    return ATLAS_GROUPS[groupId] || [groupId];')
    $lines.Add('}')
    Write-TextFile $Path (($lines -join "`n") + "`n")
}

$config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
Ensure-Directory $AtlasesDir
Ensure-Directory (Join-Path $AtlasesDir 'screens')

$manifest = New-Object System.Collections.Specialized.OrderedDictionary

foreach ($group in $config.atlasGroups) {
    $items = @(Get-AtlasItems $group)
    $pages = @(New-AtlasPages $items ([int]$group.maxWidth) ([int]$group.maxHeight))
    if ($pages.Count -eq 0) {
        $manifest.Add([string]$group.id, @())
        continue
    }

    $atlasNames = @()
    for ($pageIndex = 0; $pageIndex -lt $pages.Count; $pageIndex++) {
        $atlasNames += Get-OutputName $group $pageIndex $pages.Count
    }

    Remove-StaleOutputs $AtlasesDir (Get-CleanupPrefix $group) $atlasNames

    for ($pageIndex = 0; $pageIndex -lt $pages.Count; $pageIndex++) {
        $atlasName = $atlasNames[$pageIndex]
        $pngPath = Join-Path $AtlasesDir "$atlasName.png"
        $jsonPath = Join-Path $AtlasesDir "$atlasName.json"
        $webpPath = Join-Path $AtlasesDir "$atlasName.webp"
        Save-AtlasPng $pages[$pageIndex] $pngPath
        Save-AtlasJson $pages[$pageIndex] $atlasName $jsonPath
        Save-Webp $pngPath $webpPath
    }

    $manifest.Add([string]$group.id, $atlasNames)
    Write-Host ("Packed {0}: {1} frame(s) -> {2}" -f $group.id, $items.Count, ($atlasNames -join ', '))
}

Sync-Screens (Join-Path $projectRoot $config.screens.sourceDir) (Join-Path $AtlasesDir 'screens')
Save-Manifest $manifest $ManifestPath
Write-Host "Updated atlas manifest: $ManifestPath"