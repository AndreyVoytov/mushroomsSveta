from pathlib import Path
root = Path(r'C:\proj\mushroomsSveta')
for rel in ['docs/mechanics/batch-seed.js', '.pages-deploy/mechanics/batch-seed.js']:
    path = root / rel
    text = path.read_text(encoding='utf-8')
    old = 'превращает рыхлую кучку песка на липкий комок'
    assert old in text
    path.write_text(text.replace(old, 'превращает рыхлую кучку песка в липкий комок'), encoding='utf-8')
print('Corrected the Russian wording in both copies.')
