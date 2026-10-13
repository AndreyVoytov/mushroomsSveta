from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
root = Path(r'C:\proj\mushroomsSveta\docs\mechanics\images\batches')
for batch in (7, 8):
    files = [root / f'batch-{batch:02}-{i:02}.webp' for i in range(1, 11)]
    thumbs = []
    for p in files:
        im = Image.open(p).convert('RGB')
        im.thumbnail((360, 240))
        tile = Image.new('RGB', (380, 272), 'white')
        tile.paste(im, ((380-im.width)//2, 22))
        ImageDraw.Draw(tile).text((10, 4), p.stem, fill='black')
        thumbs.append(tile)
    sheet = Image.new('RGB', (380*2, 272*5), '#ece8dd')
    for ix, im in enumerate(thumbs): sheet.paste(im, ((ix%2)*380, (ix//2)*272))
    sheet.save(root.parent.parent.parent / f'batch-07-08-contact-{batch:02}.jpg', quality=88)
