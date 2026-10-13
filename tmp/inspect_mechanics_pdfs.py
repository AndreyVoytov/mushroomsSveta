import fitz
from pathlib import Path
folder = Path('tmp/mechanics_batches_07-08')
for source in sorted(folder.glob('*.pdf')):
    doc = fitz.open(source)
    print('PDF', source.name, 'pages', len(doc))
    for index, page in enumerate(doc):
        text = page.get_text()
        print('PAGE', index + 1, 'chars', len(text), repr(text[:700]))
