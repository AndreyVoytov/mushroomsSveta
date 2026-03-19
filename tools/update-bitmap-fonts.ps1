param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$magickExe = (Get-Command magick.exe -ErrorAction Stop).Source
$tmpRoot = Join-Path $root '.bitmap-font-tmp'
New-Item -ItemType Directory -Force -Path $tmpRoot | Out-Null

$fontConfigs = @(
    @{ Name = 'bm_arial'; Font = 'Arial-Bold' },
    @{ Name = 'bm_bookman'; Font = 'Bookman-Old-Style' },
    @{ Name = 'bm_gilroy'; Font = (Resolve-Path (Join-Path $root 'assets/other/fonts/Gilroy-ExtraBold.woff')).Path },
    @{ Name = 'bm_times'; Font = 'Times-New-Roman' }
)

$targetCharacters = @('Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü', 'ç', 'ğ', 'ı', 'ö', 'ş', 'ü')

function Invoke-MagickCapture([string[]]$Arguments) {
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $magickExe
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true

    $escapedArguments = @()
    foreach ($argument in $Arguments) {
        $escapedArguments += ('"' + ([string]$argument).Replace('"', '\"') + '"')
    }
    $startInfo.Arguments = $escapedArguments -join ' '

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    $process.Start() | Out-Null
    $stdOut = $process.StandardOutput.ReadToEnd()
    $stdErr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()

    if ($process.ExitCode -ne 0) {
        throw "magick.exe failed: $stdOut`n$stdErr"
    }

    return ($stdOut + $stdErr)
}

function Get-GlyphDefinition([string]$FontSpec, [int]$PointSize, [int]$BaseLine, [string]$Character, [string]$WorkingDirectory) {
    $charCode = [int][char]$Character
    $canvasPath = Join-Path $WorkingDirectory ("canvas_{0}.png" -f $charCode)
    $glyphPath = Join-Path $WorkingDirectory ("glyph_{0}.png" -f $charCode)

    $debugOutput = Invoke-MagickCapture @(
        '-debug', 'annotate',
        '-size', '256x256',
        'xc:none',
        '-font', $FontSpec,
        '-pointsize', [string]$PointSize,
        '-fill', 'white',
        '-gravity', 'northwest',
        '-annotate', "+0+$BaseLine",
        $Character,
        $canvasPath
    )

    $metricsLine = ($debugOutput -split "`r?`n" | Where-Object { $_ -match 'Metrics:' } | Select-Object -First 1)
    if (-not $metricsLine) {
        throw "Could not read metrics for '$Character'."
    }

    $bbox = (Invoke-MagickCapture @($canvasPath, '-format', '%@', 'info:')).Trim()
    if ($bbox -notmatch '^(\d+)x(\d+)\+(-?\d+)\+(-?\d+)$') {
        throw "Unexpected bounding box '$bbox' for '$Character'."
    }

    $width = [int]$Matches[1]
    $height = [int]$Matches[2]
    $bboxX = [int]$Matches[3]
    $bboxY = [int]$Matches[4]

    Invoke-MagickCapture @(
        $canvasPath,
        '-crop', ("{0}x{1}+{2}+{3}" -f $width, $height, $bboxX, $bboxY),
        '+repage',
        $glyphPath
    ) | Out-Null

    if ($metricsLine -notmatch 'origin:\s*([0-9.\-]+),') {
        throw "Could not parse xadvance for '$Character'."
    }

    $xAdvance = [int][Math]::Round([double]$Matches[1])
    $yOffset = [int]($bboxY - $BaseLine)

    return [PSCustomObject]@{
        Character = $Character
        CharCode = $charCode
        GlyphPath = $glyphPath
        Width = $width
        Height = $height
        XOffset = $bboxX
        YOffset = $yOffset
        XAdvance = $xAdvance
    }
}

function Add-XmlCharNode([xml]$Xml, $CharsNode, $Glyph, [int]$X, [int]$Y) {
    $node = $Xml.CreateElement('char')
    $node.SetAttribute('id', [string]$Glyph.CharCode)
    $node.SetAttribute('x', [string]$X)
    $node.SetAttribute('y', [string]$Y)
    $node.SetAttribute('width', [string]$Glyph.Width)
    $node.SetAttribute('height', [string]$Glyph.Height)
    $node.SetAttribute('xoffset', [string]$Glyph.XOffset)
    $node.SetAttribute('yoffset', [string]$Glyph.YOffset)
    $node.SetAttribute('xadvance', [string]$Glyph.XAdvance)
    $node.SetAttribute('page', '0')
    $node.SetAttribute('chnl', '0')
    $CharsNode.AppendChild($node) | Out-Null
}

try {
    foreach ($config in $fontConfigs) {
        $fntPath = Join-Path $root ("assets/base/fonts/bitmap/{0}.fnt" -f $config.Name)
        $pngPath = Join-Path $root ("assets/base/fonts/bitmap/{0}.png" -f $config.Name)
        [xml]$fontXml = Get-Content -Raw -Encoding utf8 $fntPath

        $charsNode = $fontXml.font.chars
        $existingIds = @{}
        foreach ($charNode in $charsNode.char) {
            $existingIds[[int]$charNode.id] = $true
        }

        $missingCharacters = @()
        foreach ($character in $targetCharacters) {
            $charCode = [int][char]$character
            if (-not $existingIds.ContainsKey($charCode)) {
                $missingCharacters += $character
            }
        }

        if ($missingCharacters.Count -eq 0) {
            Write-Output "Bitmap font $($config.Name) already contains all requested characters."
            continue
        }

        $workingDirectory = Join-Path $tmpRoot $config.Name
        New-Item -ItemType Directory -Force -Path $workingDirectory | Out-Null

        $pointSize = [int]$fontXml.font.info.size
        $baseLine = [int]$fontXml.font.common.base
        $glyphs = @()

        foreach ($character in $missingCharacters) {
            $glyphs += Get-GlyphDefinition -FontSpec $config.Font -PointSize $pointSize -BaseLine $baseLine -Character $character -WorkingDirectory $workingDirectory
        }

                $sourceStream = [System.IO.File]::OpenRead($pngPath)
        try {
            $sourceBitmapRaw = [System.Drawing.Bitmap]::FromStream($sourceStream)
            try {
                $sourceBitmap = New-Object System.Drawing.Bitmap $sourceBitmapRaw
            }
            finally {
                $sourceBitmapRaw.Dispose()
            }
        }
        finally {
            $sourceStream.Dispose()
        }
        try {
            $packX = 2
            $packY = $sourceBitmap.Height + 2
            $rowHeight = 0
            $placements = @()

            foreach ($glyph in $glyphs) {
                if ($packX + $glyph.Width + 2 -gt $sourceBitmap.Width) {
                    $packX = 2
                    $packY += $rowHeight + 2
                    $rowHeight = 0
                }

                $placements += [PSCustomObject]@{ Glyph = $glyph; X = $packX; Y = $packY }
                $packX += $glyph.Width + 4
                $rowHeight = [Math]::Max($rowHeight, $glyph.Height)
            }

            $newHeight = $packY + $rowHeight + 2
            $newBitmap = New-Object System.Drawing.Bitmap $sourceBitmap.Width, $newHeight, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
            try {
                $graphics.Clear([System.Drawing.Color]::Transparent)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
                $graphics.DrawImage($sourceBitmap, 0, 0, $sourceBitmap.Width, $sourceBitmap.Height)

                foreach ($placement in $placements) {
                    $glyphBitmap = [System.Drawing.Bitmap]::FromFile($placement.Glyph.GlyphPath)
                    try {
                        $graphics.DrawImage($glyphBitmap, $placement.X, $placement.Y, $placement.Glyph.Width, $placement.Glyph.Height)
                    }
                    finally {
                        $glyphBitmap.Dispose()
                    }

                    Add-XmlCharNode -Xml $fontXml -CharsNode $charsNode -Glyph $placement.Glyph -X $placement.X -Y $placement.Y
                }

                $charsNode.SetAttribute('count', [string]$charsNode.char.Count)
                $fontXml.font.common.SetAttribute('scaleH', [string]$newHeight)

                $tmpPngPath = "$pngPath.tmp.png"
                $tmpFntPath = "$fntPath.tmp"
                $newBitmap.Save($tmpPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
                $fontXml.Save($tmpFntPath)
                Copy-Item -Force $tmpPngPath $pngPath
                Copy-Item -Force $tmpFntPath $fntPath
                Remove-Item -Force $tmpPngPath, $tmpFntPath
            }
            finally {
                $graphics.Dispose()
                $newBitmap.Dispose()
            }
        }
        finally {
            $sourceBitmap.Dispose()
        }

        Write-Output ("Updated bitmap font {0}: added {1}" -f $config.Name, ($missingCharacters -join ' '))
    }
}
finally {
    if (Test-Path $tmpRoot) {
        Remove-Item -Recurse -Force $tmpRoot
    }
}


