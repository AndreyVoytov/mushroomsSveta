from pathlib import Path
root = Path(r'C:\proj\mushroomsSveta')
for rel, item_id, focus in [
    ('docs/mechanics/batch-seed.js', 'base-b08-08', (68, 48)),
    ('docs/mechanics/batch-seed.js', 'base-b08-10', (71, 47)),
]:
    path = root / rel
    text = path.read_text(encoding='utf-8')
    pos = text.index(f'"id": "{item_id}"')
    start = text.rfind('\n  {', 0, pos)
    end = text.find('\n  },', pos)
    assert start >= 0 and end >= 0
    block = text[start:end]
    old = '"x": 50,\n      "y": 50'
    assert old in block, item_id
    block = block.replace(old, f'"x": {focus[0]},\n      "y": {focus[1]}', 1)
    text = text[:start] + block + text[end:]
    path.write_text(text, encoding='utf-8')
import shutil
source = root / 'docs' / 'mechanics'
deploy = root / '.pages-deploy' / 'mechanics'
shutil.copy2(source / 'batch-seed.js', deploy / 'batch-seed.js')
print('Adjusted focus points for the snail and owl, then synchronized the seed.')
