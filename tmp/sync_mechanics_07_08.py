from pathlib import Path
import shutil
root = Path(r'C:\proj\mushroomsSveta')
source = root / 'docs' / 'mechanics'
deploy = root / '.pages-deploy' / 'mechanics'
index = source / 'index.html'
text = index.read_text(encoding='utf-8-sig')
old = 'batch-seed.js?v=20261007-03'
new = 'batch-seed.js?v=20261007-04'
if old in text:
    text = text.replace(old, new)
assert new in text
index.write_text(text, encoding='utf-8')
shutil.copy2(source / 'batch-seed.js', deploy / 'batch-seed.js')
shutil.copy2(index, deploy / 'index.html')
for batch in (7, 8):
    for i in range(1, 11):
        name = f'batch-{batch:02}-{i:02}.webp'
        shutil.copy2(source / 'images' / 'batches' / name, deploy / 'images' / 'batches' / name)
print('Synchronized seed, page cache version, and 20 images to Pages deployment tree.')
