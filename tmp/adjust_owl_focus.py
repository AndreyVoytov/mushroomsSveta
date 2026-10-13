from pathlib import Path
import shutil
root = Path(r'C:\proj\mushroomsSveta')
file = root / 'docs' / 'mechanics' / 'batch-seed.js'
text = file.read_text(encoding='utf-8')
item_id = 'base-b08-10'
pos = text.index(f'"id": "{item_id}"')
start = text.rfind('"focus": {', 0, pos)
end = text.index('}', start)
block = text[start:end]
assert '"x": 50,' in block and '"y": 48' in block
block = block.replace('"x": 50,', '"x": 71,').replace('"y": 48', '"y": 47')
text = text[:start] + block + text[end:]
file.write_text(text, encoding='utf-8')
shutil.copy2(file, root / '.pages-deploy' / 'mechanics' / 'batch-seed.js')
print('Updated owl focus and synchronized the seed.')
