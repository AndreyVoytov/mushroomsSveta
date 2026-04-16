Add-Type -AssemblyName System.Drawing

$sourceFontPath = Join-Path $PSScriptRoot "..\assets\base\fonts\bitmap\bm_arial.fnt"
$sourceImagePath = Join-Path $PSScriptRoot "..\assets\base\fonts\bitmap\bm_arial.png"
$destFontPath = Join-Path $PSScriptRoot "..\assets\base\fonts\bitmap\bm_panel_digits_brown.fnt"
$destImagePath = Join-Path $PSScriptRoot "..\assets\base\fonts\bitmap\bm_panel_digits_brown.png"

$outlineColor = [System.Drawing.ColorTranslator]::FromHtml("#62321c")
$fillColor = [System.Drawing.Color]::White
# Safe knob: change only this value to make the outline thinner or thicker.
$outlineThickness = 2
$outlinePad = $outlineThickness + 1
$pageBorder = 2
$pageWidth = 256
$characters = @(
    [char]32,
    [char]37,
    [char]43,
    [char]44,
    [char]45,
    [char]46,
    [char]47,
    [char]48,
    [char]49,
    [char]50,
    [char]51,
    [char]52,
    [char]53,
    [char]54,
    [char]55,
    [char]56,
    [char]57,
    [char]58,
    [char]88,
    [char]120
)

function Get-OutlineRadius([int]$thickness) {
    return [Math]::Max(1, $thickness)
}

function Get-OutlineDistanceSq([int]$thickness) {
    return [Math]::Max(2, 2 * $thickness * $thickness)
}

$outlineRadius = Get-OutlineRadius $outlineThickness
$outlineDistanceSq = Get-OutlineDistanceSq $outlineThickness

function New-ImageAttributes([System.Drawing.Color]$color) {
    $attributes = New-Object System.Drawing.Imaging.ImageAttributes
    $matrix = New-Object System.Drawing.Imaging.ColorMatrix
    $matrix.Matrix00 = $color.R / 255.0
    $matrix.Matrix11 = $color.G / 255.0
    $matrix.Matrix22 = $color.B / 255.0
    $matrix.Matrix33 = 1.0
    $matrix.Matrix44 = 1.0
    $attributes.SetColorMatrix($matrix)
    return $attributes
}

function Draw-TintedImage(
    [System.Drawing.Graphics]$graphics,
    [System.Drawing.Bitmap]$image,
    [int]$x,
    [int]$y,
    [System.Drawing.Imaging.ImageAttributes]$attributes
) {
    $destRect = New-Object System.Drawing.Rectangle($x, $y, $image.Width, $image.Height)
    $graphics.DrawImage(
        $image,
        $destRect,
        0,
        0,
        $image.Width,
        $image.Height,
        [System.Drawing.GraphicsUnit]::Pixel,
        $attributes
    )
}

[xml]$fontXml = Get-Content -Raw $sourceFontPath
$sourceBitmap = [System.Drawing.Bitmap]::FromFile($sourceImagePath)
$outlineAttributes = New-ImageAttributes $outlineColor
$fillAttributes = New-ImageAttributes $fillColor

$charNodes = @{}
foreach ($charNode in $fontXml.font.chars.char) {
    $charNodes[[int]$charNode.id] = $charNode
}

$glyphs = @()
$cursorX = $pageBorder
$cursorY = $pageBorder
$rowHeight = 0

foreach ($character in $characters) {
    $charId = [int][char]$character
    if (-not $charNodes.ContainsKey($charId)) {
        throw "Character id $charId is missing in bm_arial.fnt"
    }

    $sourceNode = $charNodes[$charId]
    $isSpace = $charId -eq 32
    $glyphWidth = if ($isSpace) { 1 } else { [int]$sourceNode.width + $outlinePad * 2 }
    $glyphHeight = if ($isSpace) { 1 } else { [int]$sourceNode.height + $outlinePad * 2 }

    if ($cursorX + $glyphWidth + $pageBorder -gt $pageWidth) {
        $cursorX = $pageBorder
        $cursorY += $rowHeight + $pageBorder
        $rowHeight = 0
    }

    $glyphs += [PSCustomObject]@{
        Id = $charId
        Node = $sourceNode
        X = $cursorX
        Y = $cursorY
        Width = $glyphWidth
        Height = $glyphHeight
        XOffset = if ($isSpace) { [int]$sourceNode.xoffset } else { [int]$sourceNode.xoffset - $outlinePad }
        YOffset = if ($isSpace) { [int]$sourceNode.yoffset } else { [int]$sourceNode.yoffset - $outlinePad }
        XAdvance = [int]$sourceNode.xadvance
        IsSpace = $isSpace
    }

    $cursorX += $glyphWidth + $pageBorder
    $rowHeight = [Math]::Max($rowHeight, $glyphHeight)
}

$pageHeight = $cursorY + $rowHeight + $pageBorder
$atlasBitmap = New-Object System.Drawing.Bitmap($pageWidth, $pageHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$atlasGraphics = [System.Drawing.Graphics]::FromImage($atlasBitmap)
$atlasGraphics.Clear([System.Drawing.Color]::Transparent)
$atlasGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$atlasGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$atlasGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

$outlineOffsets = @()
for ($dx = -$outlineRadius; $dx -le $outlineRadius; $dx++) {
    for ($dy = -$outlineRadius; $dy -le $outlineRadius; $dy++) {
        if ($dx -eq 0 -and $dy -eq 0) {
            continue
        }

        if (($dx * $dx) + ($dy * $dy) -le $outlineDistanceSq) {
            $outlineOffsets += [PSCustomObject]@{ X = $dx; Y = $dy }
        }
    }
}

foreach ($glyph in $glyphs) {
    if ($glyph.IsSpace) {
        continue
    }

    $sourceRect = New-Object System.Drawing.Rectangle(
        [int]$glyph.Node.x,
        [int]$glyph.Node.y,
        [int]$glyph.Node.width,
        [int]$glyph.Node.height
    )

    $glyphBitmap = $sourceBitmap.Clone($sourceRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $glyphCanvas = New-Object System.Drawing.Bitmap($glyph.Width, $glyph.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $glyphGraphics = [System.Drawing.Graphics]::FromImage($glyphCanvas)
    $glyphGraphics.Clear([System.Drawing.Color]::Transparent)
    $glyphGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $glyphGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $glyphGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None

    foreach ($offset in $outlineOffsets) {
        Draw-TintedImage $glyphGraphics $glyphBitmap ($outlinePad + $offset.X) ($outlinePad + $offset.Y) $outlineAttributes
    }

    Draw-TintedImage $glyphGraphics $glyphBitmap $outlinePad $outlinePad $fillAttributes
    $atlasGraphics.DrawImageUnscaled($glyphCanvas, $glyph.X, $glyph.Y)

    $glyphGraphics.Dispose()
    $glyphCanvas.Dispose()
    $glyphBitmap.Dispose()
}

$atlasBitmap.Save($destImagePath, [System.Drawing.Imaging.ImageFormat]::Png)

$common = $fontXml.font.common
$fontText = New-Object System.Text.StringBuilder
[void]$fontText.AppendLine('<?xml version="1.0"?>')
[void]$fontText.AppendLine('<font>')
[void]$fontText.AppendLine('  <info face="bm_panel_digits_brown" size="72" bold="1" italic="0" charset="" unicode="1" stretchH="100" smooth="1" aa="1" padding="0,0,0,0" spacing="0,0" />')
[void]$fontText.AppendLine(([string]::Format('  <common lineHeight="{0}" base="{1}" scaleW="{2}" scaleH="{3}" pages="1" packed="0" />', ([int]$common.lineHeight + $outlinePad * 2), ([int]$common.base + $outlinePad), $pageWidth, $pageHeight)))
[void]$fontText.AppendLine('  <pages>')
[void]$fontText.AppendLine('    <page id="0" file="bm_panel_digits_brown.png" />')
[void]$fontText.AppendLine('  </pages>')
[void]$fontText.AppendLine(([string]::Format('  <chars count="{0}">', $glyphs.Count)))

foreach ($glyph in $glyphs) {
    [void]$fontText.AppendLine(
        ([string]::Format('    <char id="{0}" x="{1}" y="{2}" width="{3}" height="{4}" xoffset="{5}" yoffset="{6}" xadvance="{7}" page="0" chnl="0" />', $glyph.Id, $glyph.X, $glyph.Y, $glyph.Width, $glyph.Height, $glyph.XOffset, $glyph.YOffset, $glyph.XAdvance))
    )
}

[void]$fontText.AppendLine('  </chars>')
[void]$fontText.AppendLine('</font>')
[System.IO.File]::WriteAllText($destFontPath, $fontText.ToString(), [System.Text.UTF8Encoding]::new($false))

$atlasGraphics.Dispose()
$atlasBitmap.Dispose()
$sourceBitmap.Dispose()
$outlineAttributes.Dispose()
$fillAttributes.Dispose()

Write-Output "Generated $destImagePath"
Write-Output "Generated $destFontPath"