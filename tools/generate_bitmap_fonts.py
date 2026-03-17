from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple
from xml.sax.saxutils import escape

from PIL import Image, ImageDraw, ImageFont


CYR_UPPER = ''.join(chr(c) for c in range(0x0410, 0x042F + 1)) + chr(0x0401)
CYR_LOWER = ''.join(chr(c) for c in range(0x0430, 0x044F + 1)) + chr(0x0451)
PUNCT = '.,:;!?"\'`-–—_+=*/\\|()[]{}<>@#$%^&№~'

CHARSET = (
    ' '
    + '0123456789'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + 'abcdefghijklmnopqrstuvwxyz'
    + CYR_UPPER
    + CYR_LOWER
    + PUNCT
)
DIGITS_CHARSET = '0123456789'


@dataclass
class Glyph:
    ch: str
    code: int
    image: Image.Image
    width: int
    height: int
    xoffset: int
    yoffset: int
    xadvance: int
    x: int = 0
    y: int = 0


def uniq_chars(s: str) -> List[str]:
    out: List[str] = []
    seen = set()
    for ch in s:
        if ch not in seen:
            out.append(ch)
            seen.add(ch)
    return out


def render_glyph(font: ImageFont.FreeTypeFont, ch: str, line_height: int) -> Glyph:
    advance = int(round(font.getlength(ch)))
    if ch == ' ':
        return Glyph(ch, ord(ch), Image.new('L', (1, 1), 0), 1, 1, 0, 0, max(1, advance))

    pad = 12
    w = max(advance + pad * 3, font.size * 2)
    h = line_height + pad * 2
    temp = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(temp)
    draw.text((pad, pad), ch, font=font, fill=255)

    bbox = temp.getbbox()
    if bbox is None:
        return Glyph(ch, ord(ch), Image.new('L', (1, 1), 0), 1, 1, 0, 0, max(1, advance))

    crop = temp.crop(bbox)
    x0, y0, _, _ = bbox
    return Glyph(
        ch=ch,
        code=ord(ch),
        image=crop,
        width=crop.width,
        height=crop.height,
        xoffset=x0 - pad,
        yoffset=y0 - pad,
        xadvance=max(1, advance),
    )


def pack_glyphs(glyphs: List[Glyph], sheet_width: int = 1024, margin: int = 2) -> Tuple[int, int]:
    x = margin
    y = margin
    row_h = 0
    for g in glyphs:
        gw = max(1, g.width)
        gh = max(1, g.height)
        if x + gw + margin > sheet_width:
            x = margin
            y += row_h + margin
            row_h = 0
        g.x = x
        g.y = y
        x += gw + margin
        row_h = max(row_h, gh)
    sheet_h = y + row_h + margin
    return sheet_width, sheet_h


def save_bitmap_font(
    output_dir: Path,
    key: str,
    font_path: Path,
    size: int,
    bold: int,
    charset: str = CHARSET,
) -> None:
    font = ImageFont.truetype(str(font_path), size=size)
    ascent, descent = font.getmetrics()
    line_height = ascent + descent + 4

    glyphs = [render_glyph(font, ch, line_height) for ch in uniq_chars(charset)]
    sheet_w, sheet_h = pack_glyphs(glyphs, sheet_width=1024, margin=2)

    atlas = Image.new('RGBA', (sheet_w, sheet_h), (0, 0, 0, 0))
    for g in glyphs:
        if g.width <= 1 and g.height <= 1:
            continue
        rgba = Image.new('RGBA', (g.width, g.height), (255, 255, 255, 0))
        rgba.putalpha(g.image)
        atlas.alpha_composite(rgba, (g.x, g.y))

    png_path = output_dir / f'{key}.png'
    fnt_path = output_dir / f'{key}.fnt'
    atlas.save(png_path)

    lines: List[str] = []
    lines.append('<?xml version="1.0"?>')
    lines.append('<font>')
    lines.append(
        f'  <info face="{escape(key)}" size="{size}" bold="{bold}" italic="0" charset="" unicode="1" stretchH="100" smooth="1" aa="1" padding="0,0,0,0" spacing="0,0" />'
    )
    lines.append(
        f'  <common lineHeight="{line_height}" base="{ascent}" scaleW="{sheet_w}" scaleH="{sheet_h}" pages="1" packed="0" />'
    )
    lines.append('  <pages>')
    lines.append(f'    <page id="0" file="{escape(png_path.name)}" />')
    lines.append('  </pages>')
    lines.append(f'  <chars count="{len(glyphs)}">')
    for g in glyphs:
        lines.append(
            f'    <char id="{g.code}" x="{g.x}" y="{g.y}" width="{max(1, g.width)}" height="{max(1, g.height)}" '
            f'xoffset="{g.xoffset}" yoffset="{g.yoffset}" xadvance="{g.xadvance}" page="0" chnl="0" />'
        )
    lines.append('  </chars>')
    lines.append('</font>')

    fnt_path.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Generated {key}: {png_path} + {fnt_path}')


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / 'assets' / 'base' / 'fonts' / 'bitmap'
    out_dir.mkdir(parents=True, exist_ok=True)

    fonts: Dict[str, Tuple[Path, int, int]] = {
        'bm_arial': (Path('C:/Windows/Fonts/arialbd.ttf'), 72, 1),
        'bm_bookman': (root / 'assets' / 'other' / 'fonts' / 'bookman.woff', 72, 0),
        'bm_gilroy': (root / 'assets' / 'other' / 'fonts' / 'Gilroy-ExtraBold.woff', 72, 1),
        'bm_balsamiq': (Path('C:/Windows/Fonts/arialbd.ttf'), 72, 1),
        'bm_times': (Path('C:/Windows/Fonts/times.ttf'), 72, 0),
    }

    for key, (path, size, bold) in fonts.items():
        save_bitmap_font(out_dir, key, path, size, bold)

    save_bitmap_font(
        out_dir,
        'bm_diary_digits',
        Path('C:/Windows/Fonts/BOOKOSB.TTF'),
        72,
        1,
        DIGITS_CHARSET,
    )


if __name__ == '__main__':
    main()



