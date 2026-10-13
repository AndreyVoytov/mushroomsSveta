from pathlib import Path
from PIL import Image
root = Path(r'C:\proj\mushroomsSveta')
src = root / 'tmp' / 'mechanics_batches_07-08'
out = root / 'docs' / 'mechanics' / 'images' / 'batches'
for offset in (5, 6):
    page = src / f'11_base_cell_mechanics_batch_07_page_{offset+1:02}.png'
    target = out / f'batch-07-{offset:02}.webp'
    with Image.open(page) as im:
        im.crop((54, 102, 1242, 500)).convert('RGB').save(target, 'WEBP', quality=88, method=6)
    print(target.name, Image.open(target).size)
