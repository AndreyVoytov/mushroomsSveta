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
$cacheVersion = "atlas-cache-v1"

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

function Write-TextFileIfChanged([string]$Path, [string]$Content) {
    if (Test-Path $Path) {
        $existing = [IO.File]::ReadAllText((Resolve-Path $Path).Path)
        if ($existing -eq $Content) {
            return $false
        }
    }

    Write-TextFile $Path $Content
    return $true
}

function Read-JsonObject([string]$Path) {
    if (-not (Test-Path $Path)) {
        return $null
    }

    $raw = Get-Content -Path $Path -Raw
    if ([string]::IsNullOrWhiteSpace($raw)) {
        return $null
    }

    return $raw | ConvertFrom-Json
}

function Get-PropertyValue([object]$Object, [string]$Name) {
    if ($null -eq $Object) {
        return $null
    }

    $property = $Object.PSObject.Properties | Where-Object { $_.Name -eq $Name } | Select-Object -First 1
    if ($property) {
        return $property.Value
    }

    return $null
}

function Get-DictionaryValue([object]$Object, [string]$Name) {
    if ($null -eq $Object) {
        return $null
    }

    if ($Object -is [System.Collections.IDictionary]) {
        if ($Object.Contains($Name)) {
            return $Object[$Name]
        }

        return $null
    }

    return Get-PropertyValue $Object $Name
}

function Get-NamedChildKeys([object]$Object) {
    if ($null -eq $Object) {
        return @()
    }

    if ($Object -is [System.Collections.IDictionary]) {
        return @($Object.Keys)
    }

    return @($Object.PSObject.Properties | Select-Object -ExpandProperty Name)
}

function Set-OrderedValue([System.Collections.Specialized.OrderedDictionary]$Dictionary, [string]$Name, $Value) {
    if ($Dictionary.Contains($Name)) {
        $Dictionary[$Name] = $Value
    }
    else {
        $Dictionary.Add($Name, $Value)
    }
}

function Get-StringArray([object]$Value) {
    if ($null -eq $Value) {
        return @()
    }

    $result = @()
    foreach ($item in @($Value)) {
        if ($null -ne $item -and -not [string]::IsNullOrWhiteSpace([string]$item)) {
            $result += [string]$item
        }
    }

    return @($result)
}

function ConvertTo-HexString([byte[]]$Bytes) {
    return ([BitConverter]::ToString($Bytes)).Replace('-', '').ToLowerInvariant()
}

function Get-StringHash([string]$Text) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
        return ConvertTo-HexString ($sha.ComputeHash($bytes))
    }
    finally {
        $sha.Dispose()
    }
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

function Get-ProjectRelativePath([string]$Path) {
    return Get-ForwardPath (Get-RelativePath $projectRoot $Path)
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

function Get-AtlasSourceFiles([object]$Group) {
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
                $items += [pscustomobject]@{
                    FullPath = $_.FullName
                    FrameName = $assetRelative
                }
            }
        }

    return @($items | Sort-Object FrameName)
}

function Get-AtlasItems([object[]]$SourceFiles) {
    $items = @()
    foreach ($sourceFile in $SourceFiles) {
        $size = Get-ImageSize $sourceFile.FullPath
        $items += [pscustomobject]@{
            FullPath = $sourceFile.FullPath
            FrameName = $sourceFile.FrameName
            Width = $size.Width
            Height = $size.Height
        }
    }

    return @($items | Sort-Object @{ Expression = 'Height'; Descending = $true }, @{ Expression = 'Width'; Descending = $true }, @{ Expression = 'FrameName'; Descending = $false })
}

function Get-ScreenSourceFiles([string]$SourceDir) {
    if (-not (Test-Path $SourceDir)) {
        return @()
    }

    $items = @()
    Get-ChildItem -Path $SourceDir -File |
        Where-Object { $_.Extension.ToLowerInvariant() -in @('.png', '.jpg', '.jpeg') } |
        ForEach-Object {
            $items += [pscustomobject]@{
                FullPath = $_.FullName
                Name = [IO.Path]::GetFileNameWithoutExtension($_.Name)
            }
        }

    return @($items | Sort-Object Name)
}

function Get-FileContentHash([string]$Path, [object]$ExistingFileHashes, [System.Collections.Specialized.OrderedDictionary]$NextFileHashes) {
    $relativePath = Get-ProjectRelativePath $Path
    $current = Get-DictionaryValue $NextFileHashes $relativePath
    if ($current) {
        return [string](Get-DictionaryValue $current 'hash')
    }

    $file = Get-Item $Path
    $stamp = "{0}|{1}" -f $file.Length, $file.LastWriteTimeUtc.Ticks
    $cached = Get-DictionaryValue $ExistingFileHashes $relativePath
    $cachedStamp = [string](Get-DictionaryValue $cached 'stamp')
    $hash = [string](Get-DictionaryValue $cached 'hash')

    if ($cachedStamp -ne $stamp -or [string]::IsNullOrWhiteSpace($hash)) {
        $stream = [IO.File]::OpenRead($Path)
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try {
            $hash = ConvertTo-HexString ($sha.ComputeHash($stream))
        }
        finally {
            $sha.Dispose()
            $stream.Dispose()
        }
    }

    Set-OrderedValue $NextFileHashes $relativePath ([ordered]@{
        stamp = $stamp
        hash = $hash
    })

    return $hash
}

function Get-AtlasGroupSignature([object]$Group, [object[]]$SourceFiles, [object]$ExistingFileHashes, [System.Collections.Specialized.OrderedDictionary]$NextFileHashes) {
    $parts = New-Object System.Collections.Generic.List[string]
    $parts.Add("version=$cacheVersion")
    $parts.Add("skipWebp=$([int](-not $SkipWebp))")
    $parts.Add("id=$([string]$Group.id)")
    $parts.Add("sourceDir=$([string]$Group.sourceDir)")
    $parts.Add("outputPattern=$([string]$Group.outputPattern)")
    $parts.Add("maxWidth=$([int]$Group.maxWidth)")
    $parts.Add("maxHeight=$([int]$Group.maxHeight)")

    if ($Group.PSObject.Properties.Name -contains 'exclude') {
        foreach ($pattern in @($Group.exclude)) {
            $parts.Add("exclude=$pattern")
        }
    }

    foreach ($sourceFile in $SourceFiles) {
        $fileHash = Get-FileContentHash $sourceFile.FullPath $ExistingFileHashes $NextFileHashes
        $parts.Add("$($sourceFile.FrameName)|$fileHash")
    }

    return Get-StringHash ($parts -join "`n")
}

function Get-ScreensSignature([string]$SourceDirConfig, [object[]]$SourceFiles, [object]$ExistingFileHashes, [System.Collections.Specialized.OrderedDictionary]$NextFileHashes) {
    $parts = New-Object System.Collections.Generic.List[string]
    $parts.Add("version=$cacheVersion")
    $parts.Add("skipWebp=$([int](-not $SkipWebp))")
    $parts.Add("sourceDir=$SourceDirConfig")

    foreach ($sourceFile in $SourceFiles) {
        $fileHash = Get-FileContentHash $sourceFile.FullPath $ExistingFileHashes $NextFileHashes
        $parts.Add("$($sourceFile.Name)|$fileHash")
    }

    return Get-StringHash ($parts -join "`n")
}

function Test-AtlasOutputsExist([string]$OutputDir, [string[]]$AtlasNames) {
    foreach ($name in $AtlasNames) {
        if (-not (Test-Path (Join-Path $OutputDir "$name.png"))) {
            return $false
        }

        if (-not (Test-Path (Join-Path $OutputDir "$name.json"))) {
            return $false
        }

        if (-not $SkipWebp -and -not (Test-Path (Join-Path $OutputDir "$name.webp"))) {
            return $false
        }
    }

    return $true
}

function Test-ScreenOutputsExist([string]$OutputDir, [string[]]$Names) {
    foreach ($name in $Names) {
        if (-not (Test-Path (Join-Path $OutputDir "$name.png"))) {
            return $false
        }

        if (-not $SkipWebp -and -not (Test-Path (Join-Path $OutputDir "$name.webp"))) {
            return $false
        }
    }

    return $true
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
        if (-not $SkipWebp) {
            $keep["$name.webp"] = $true
        }
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

function Sync-Screens([object[]]$SourceFiles, [string]$OutputDir) {
    Ensure-Directory $OutputDir
    $keep = @{}

    foreach ($sourceFile in $SourceFiles) {
            $name = $sourceFile.Name
            $pngPath = Join-Path $OutputDir "$name.png"
            $webpPath = Join-Path $OutputDir "$name.webp"

            $image = [System.Drawing.Image]::FromFile($sourceFile.FullPath)
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
            if (-not $SkipWebp) {
                $keep["$name.webp"] = $true
            }
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
    return Write-TextFileIfChanged $Path (($lines -join "`n") + "`n")
}

$config = Get-Content -Path $ConfigPath -Raw | ConvertFrom-Json
Ensure-Directory $AtlasesDir
Ensure-Directory (Join-Path $AtlasesDir 'screens')
$cachePath = Join-Path $AtlasesDir '.atlas-cache.json'
$screensOutputDir = Join-Path $AtlasesDir 'screens'
$cacheState = Read-JsonObject $cachePath
$cacheStateVersion = [string](Get-PropertyValue $cacheState 'toolVersion')
$cachedFileHashes = if ($cacheStateVersion -eq $cacheVersion) { Get-PropertyValue $cacheState 'fileHashes' } else { $null }
$cachedGroups = if ($cacheStateVersion -eq $cacheVersion) { Get-PropertyValue $cacheState 'groups' } else { $null }
$cachedScreens = if ($cacheStateVersion -eq $cacheVersion) { Get-PropertyValue $cacheState 'screens' } else { $null }

$manifest = New-Object System.Collections.Specialized.OrderedDictionary
$nextFileHashes = New-Object System.Collections.Specialized.OrderedDictionary
$nextGroups = New-Object System.Collections.Specialized.OrderedDictionary
$currentGroupIds = @()
$packedGroupsCount = 0
$skippedGroupsCount = 0

foreach ($group in $config.atlasGroups) {
    $groupId = [string]$group.id
    $currentGroupIds += $groupId

    $sourceFiles = @(Get-AtlasSourceFiles $group)
    $signature = Get-AtlasGroupSignature $group $sourceFiles $cachedFileHashes $nextFileHashes
    $cleanupPrefix = Get-CleanupPrefix $group
    $cachedGroupState = Get-DictionaryValue $cachedGroups $groupId
    $cachedOutputs = Get-StringArray (Get-DictionaryValue $cachedGroupState 'outputs')
    $cachedSignature = [string](Get-DictionaryValue $cachedGroupState 'signature')
    $cachedCleanupPrefix = [string](Get-DictionaryValue $cachedGroupState 'cleanupPrefix')

    if (-not [string]::IsNullOrWhiteSpace($cachedCleanupPrefix) -and $cachedCleanupPrefix -ne $cleanupPrefix) {
        Remove-StaleOutputs $AtlasesDir $cachedCleanupPrefix @()
    }

    if ($sourceFiles.Count -eq 0) {
        Remove-StaleOutputs $AtlasesDir $cleanupPrefix @()
        $manifest.Add($groupId, @())
        Set-OrderedValue $nextGroups $groupId ([ordered]@{
            signature = $signature
            outputs = @()
            cleanupPrefix = $cleanupPrefix
        })
        Write-Host ("Packed {0}: 0 frame(s) -> none" -f $groupId)
        $packedGroupsCount++
        continue
    }

    if ($cachedSignature -eq $signature -and $cachedOutputs.Count -gt 0 -and (Test-AtlasOutputsExist $AtlasesDir $cachedOutputs)) {
        $manifest.Add($groupId, $cachedOutputs)
        Set-OrderedValue $nextGroups $groupId ([ordered]@{
            signature = $signature
            outputs = $cachedOutputs
            cleanupPrefix = $cleanupPrefix
        })
        Write-Host ("Skipped {0}: unchanged -> {1}" -f $groupId, ($cachedOutputs -join ', '))
        $skippedGroupsCount++
        continue
    }

    $items = @(Get-AtlasItems $sourceFiles)
    $pages = @(New-AtlasPages $items ([int]$group.maxWidth) ([int]$group.maxHeight))
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

    $manifest.Add($groupId, $atlasNames)
    Set-OrderedValue $nextGroups $groupId ([ordered]@{
        signature = $signature
        outputs = @($atlasNames)
        cleanupPrefix = $cleanupPrefix
    })
    Write-Host ("Packed {0}: {1} frame(s) -> {2}" -f $groupId, $items.Count, ($atlasNames -join ', '))
    $packedGroupsCount++
}

foreach ($oldGroupId in (Get-NamedChildKeys $cachedGroups)) {
    if ($currentGroupIds -notcontains [string]$oldGroupId) {
        $oldGroupState = Get-DictionaryValue $cachedGroups ([string]$oldGroupId)
        $oldCleanupPrefix = [string](Get-DictionaryValue $oldGroupState 'cleanupPrefix')
        if (-not [string]::IsNullOrWhiteSpace($oldCleanupPrefix)) {
            Remove-StaleOutputs $AtlasesDir $oldCleanupPrefix @()
        }
    }
}

$screensSourceDir = Join-Path $projectRoot $config.screens.sourceDir
$screenSourceFiles = @(Get-ScreenSourceFiles $screensSourceDir)
$screensSignature = Get-ScreensSignature $config.screens.sourceDir $screenSourceFiles $cachedFileHashes $nextFileHashes
$cachedScreenSignature = [string](Get-DictionaryValue $cachedScreens 'signature')
$cachedScreenNames = Get-StringArray (Get-DictionaryValue $cachedScreens 'names')
$screensSkipped = $false

if ($cachedScreenSignature -eq $screensSignature -and (Test-ScreenOutputsExist $screensOutputDir $cachedScreenNames)) {
    $screensSkipped = $true
    Write-Host ("Skipped screens: unchanged ({0} file(s))" -f $cachedScreenNames.Count)
    $screenNames = $cachedScreenNames
}
else {
    Sync-Screens $screenSourceFiles $screensOutputDir
    $screenNames = @($screenSourceFiles | ForEach-Object { $_.Name })
    Write-Host ("Packed screens: {0} file(s)" -f $screenNames.Count)
}

$nextCacheState = [ordered]@{
    toolVersion = $cacheVersion
    fileHashes = $nextFileHashes
    groups = $nextGroups
    screens = [ordered]@{
        signature = $screensSignature
        names = @($screenNames)
    }
}

$cacheJson = ($nextCacheState | ConvertTo-Json -Depth 12)
[void](Write-TextFileIfChanged $cachePath ($cacheJson + "`n"))
[void](Save-Manifest $manifest $ManifestPath)
Write-Host "Updated atlas manifest: $ManifestPath"
Write-Host ("Atlas summary: packed={0}, skipped={1}, screens={2}" -f $packedGroupsCount, $skippedGroupsCount, ($(if ($screensSkipped) { 'skipped' } else { 'packed' })))
