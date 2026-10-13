import fitz
from pathlib import Path
from PIL import Image, ImageDraw
folder=Path('tmp/mechanics_batches_07-08')
for pdf in sorted(folder.glob('*.pdf')):
    doc=fitz.open(pdf)
    images=[]
    for i,page in enumerate(doc):
        pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),alpha=False)
        image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        output=folder/f'{pdf.stem}_page_{i+1:02}.png'
        image.save(output)
        images.append((i+1,image.copy()))
    cell_w,cell_h=390,560
    cols=3
    rows=(len(images)+cols-1)//cols
    sheet=Image.new('RGB',(cols*cell_w,rows*cell_h),'#ddd8ce')
    draw=ImageDraw.Draw(sheet)
    for idx,(number,image) in enumerate(images):
        x=(idx%cols)*cell_w; y=(idx//cols)*cell_h
        thumb=image.copy(); thumb.thumbnail((cell_w-20,cell_h-35))
        sheet.paste(thumb,(x+(cell_w-thumb.width)//2,y+25))
        draw.text((x+10,y+5),f'{pdf.stem} — page {number}',fill='#222')
    sheet.save(folder/f'{pdf.stem}_contact.png')
