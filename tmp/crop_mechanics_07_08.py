from pathlib import Path
from PIL import Image

root = Path(r'C:\proj\mushroomsSveta')
src = root / 'tmp' / 'mechanics_batches_07-08'
out = root / 'docs' / 'mechanics' / 'images' / 'batches'
out.mkdir(parents=True, exist_ok=True)
for batch, stem in [(7, '11_base_cell_mechanics_batch_07'), (8, '12_base_cell_mechanics_batch_08')]:
    for offset in range(1, 11):
        page_no = offset + 1
        image_path = src / f'{stem}_page_{page_no:02}.png'
        target = out / f'batch-{batch:02}-{offset:02}.webp'
        with Image.open(image_path) as page:
            # Keep the main illustrated mechanic, excluding page title and explanatory text.
            crop = page.crop((54, 102, 1242, 894)).convert('RGB')
            crop.save(target, 'WEBP', quality=88, method=6)
        print(target.name, Image.open(target).size, target.stat().st_size)
