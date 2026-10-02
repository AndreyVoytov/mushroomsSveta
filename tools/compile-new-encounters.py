"""Compile the marked source videos; segment the snail's changing studio backdrop."""
from pathlib import Path
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / '.local-workbench/raw-assets/animals/video'
OUT = ROOT / '.local-workbench/animal-previews'
SPECS = {
    'butterfly2': ('*Р‘Р°Р±РѕС‡РєР°*', np.r_[np.linspace(0, 1.94, 16), np.linspace(2.05, 3.55, 16)]),
    'crab': ('*РєСЂР°Р±*', np.linspace(0, 2.0, 32)),
    'bird': ('*РїС‚РёС†Р°*', np.linspace(0, 4.15, 32)),
    # Later frames leave the source canvas. Only use the complete wingbeat.
    'owl': ('*СЃРѕРІР°*', np.r_[np.linspace(0, .30, 8), np.linspace(1.15, 1.80, 12), np.linspace(1.80, 1.15, 12)]),
    'snail': ('Wan*', np.linspace(0, 2.92, 40)),
}

def largest(mask):
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask.astype('uint8'), 8)
    if count <= 1: raise ValueError('Empty character mask')
    idx = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    return (labels == idx).astype('uint8')

def fill(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(mask, contours, -1, 1, -1)
    return mask

def segment(rgb, snail):
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    h, w = rgb.shape[:2]
    if snail:
        # Warm body and purple shell are the large saturated central region;
        # isolated stars and the reflection below the feet are background.
        seed = ((hsv[:,:,1] > 95) & (hsv[:,:,2] > 70)).astype('uint8')
        seed[:int(h*.10)] = 0; seed[int(h*.81):] = 0
        seed[:,:int(w*.15)] = 0; seed[:,int(w*.84):] = 0
        seed = largest(cv2.morphologyEx(seed, cv2.MORPH_CLOSE, np.ones((9,9),np.uint8)))
        seed = fill(seed)
        area = cv2.dilate(seed, np.ones((21,21),np.uint8))
        mask = np.where(area, cv2.GC_PR_FGD, cv2.GC_BGD).astype('uint8')
        mask[cv2.erode(seed,np.ones((7,7),np.uint8)) > 0] = cv2.GC_FGD
        cv2.grabCut(rgb, mask, None, np.zeros((1,65)), np.zeros((1,65)), 3, cv2.GC_INIT_WITH_MASK)
        alpha = fill(largest(((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype('uint8')))
    else:
        # Match only the almost pure screen colour; keep the butterfly's
        # pink wing panels, which have lower red/blue intensity and outlines.
        r,g,b = [rgb[:,:,i].astype('int16') for i in range(3)]
        key = (r > 170) & (b > 115) & (g < 80) & (r-g > 100) & (b-g > 80)
        # Only border-connected magenta is screen. Pink wing panels enclosed
        # by dark veins must not become holes in the butterfly.
        _, labels = cv2.connectedComponents(key.astype('uint8'), 8)
        border = np.unique(np.r_[labels[0],labels[-1],labels[:,0],labels[:,-1]])
        border = border[border != 0]
        candidate = (~np.isin(labels,border)).astype('uint8')
        alpha = largest(candidate)
    alpha = cv2.GaussianBlur(alpha.astype('float32'),(3,3),.55)
    return (np.clip(alpha,0,1)*255).astype('uint8')

def compile_one(name, pattern, times):
    cap=cv2.VideoCapture(str(next(RAW.glob(pattern))))
    frames=[]; bounds=[]
    for t in times:
        cap.set(cv2.CAP_PROP_POS_MSEC,float(t)*1000); ok,bgr=cap.read()
        if not ok: raise ValueError((name,t))
        # Work at a consistent resolution; GrabCut stays inexpensive.
        bgr=cv2.resize(bgr,(512,512)); rgb=cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB)
        alpha=segment(rgb,name=='snail')
        x,y,w,h=cv2.boundingRect((alpha>24).astype('uint8'))
        if name in ('owl','bird') and (x<2 or y<2 or x+w>510 or y+h>510):
            continue
        bounds.append((x,y,x+w,y+h))
        frames.append(Image.fromarray(np.dstack([rgb,alpha]),'RGBA'))
    cap.release()
    # Preserve the declared frame count after rejecting cropped source poses.
    if len(frames) != len(times):
        if not frames: raise ValueError('No complete poses: '+name)
        frames=[frames[round(i*(len(frames)-1)/(len(times)-1))] for i in range(len(times))]
    box=(min(b[0] for b in bounds),min(b[1] for b in bounds),max(b[2] for b in bounds),max(b[3] for b in bounds))
    scale=min(150/(box[2]-box[0]),160/(box[3]-box[1])); size=(round((box[2]-box[0])*scale),round((box[3]-box[1])*scale))
    sheet=Image.new('RGBA',(160*8,170*((len(frames)+7)//8)))
    for i,frame in enumerate(frames):
        cut=frame.crop(box).resize(size,Image.Resampling.LANCZOS)
        sheet.alpha_composite(cut,((i%8)*160+(160-size[0])//2,(i//8)*170+(170-size[1])//2))
    target=ROOT/'assets/base/items/animals'/('snailBooster.png' if name=='snail' else name+'Escape.png')
    sheet.save(target)
    preview=Image.new('RGBA',sheet.size,'#35492e');preview.alpha_composite(sheet);preview.convert('RGB').save(OUT/(name+'-integrated.jpg'))
    print(name,len(frames),box,flush=True)

if __name__=='__main__':
    OUT.mkdir(exist_ok=True)
    import sys
    for name,(pattern,times) in SPECS.items():
        if len(sys.argv) < 2 or name == sys.argv[1]: compile_one(name,pattern,times)
