"""Inspect and compile the locally supplied animal videos into keyed sprite sheets."""
from pathlib import Path
import argparse
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / '.local-workbench/raw-assets/animals'
OUT = ROOT / '.local-workbench/animal-previews'

def frame_at(cap, t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f'Cannot decode frame at {t}')
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

def inspect():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ['rabbit', 'butterfly', 'bat']:
        cap = cv2.VideoCapture(str(RAW / f'video_{name}.mp4'))
        duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
        sheet = Image.new('RGB', (1000, 640), '#263c35')
        draw = ImageDraw.Draw(sheet)
        for i, t in enumerate(np.linspace(0, duration - 0.15, 15)):
            im = Image.fromarray(frame_at(cap, float(t)))
            im.thumbnail((200, 185))
            x, y = (i % 5) * 200, (i // 5) * 213
            sheet.paste(im, (x, y))
            draw.text((x + 5, y + 188), f'{t:.2f}s', fill='white')
        sheet.save(OUT / f'{name}-source.jpg')
        print(name, duration, cap.get(cv2.CAP_PROP_FPS))
        cap.release()

def compile_sheets():
    OUT.mkdir(parents=True, exist_ok=True)
    specs = {
        # Skip the source's first leap: its ears leave the video frame.
        'rabbit': np.r_[np.linspace(0.25, 1.85, 12), np.linspace(2.62, 4.35, 20)],
        'butterfly': np.r_[np.linspace(0, 0.7, 4), np.linspace(1.98, 2.95, 20)],
        'bat': np.r_[np.linspace(0.15, 2.65, 12), np.linspace(2.8, 4.35, 20)],
    }
    for name, times in specs.items():
        cap = cv2.VideoCapture(str(RAW / f'video_{name}.mp4'))
        frames, bounds = [], []
        for t in times:
            rgb = frame_at(cap, float(t))
            hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
            # Includes the pale pink glow added by the butterfly video model.
            key = ((hsv[:, :, 0] > 130) & (hsv[:, :, 0] < 179)
                   & (hsv[:, :, 1] > (16 if name == 'butterfly' else 160))
                   & (hsv[:, :, 2] > (0 if name == 'butterfly' else 140)))
            mask = (~key).astype(np.uint8)
            count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
            largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
            mask = (labels == largest).astype(np.uint8)
            # Other components (watermark, hearts, sparkles) are background.
            x, y, w, h = cv2.boundingRect(mask)
            bounds.append((x, y, x+w, y+h))
            alpha = mask * 255
            edge = cv2.dilate(1-mask, np.ones((5, 5), np.uint8)) > 0
            # Neutralize chroma spill only along the silhouette.
            p = rgb.astype(np.float32)
            spill = np.maximum(0, np.minimum(p[:, :, 0], p[:, :, 2]) - p[:, :, 1])
            amount = spill * edge
            p[:, :, 0] -= amount
            p[:, :, 2] -= amount
            frames.append(Image.fromarray(np.dstack((np.clip(p, 0, 255).astype(np.uint8), alpha)), 'RGBA'))
        cap.release()
        box = (min(b[0] for b in bounds), min(b[1] for b in bounds),
               max(b[2] for b in bounds), max(b[3] for b in bounds))
        ratio = min(112/(box[2]-box[0]), 117/(box[3]-box[1]))
        size = (round((box[2]-box[0])*ratio), round((box[3]-box[1])*ratio))
        sheet = Image.new('RGBA', (120*8, 127*((len(frames)+7)//8)))
        preview = Image.new('RGBA', sheet.size, '#527747')
        for i, frame in enumerate(frames):
            cut = frame.crop(box).resize(size, Image.Resampling.LANCZOS)
            tile = Image.new('RGBA', (120,127))
            tile.alpha_composite(cut, ((120-size[0])//2, (127-size[1])//2))
            xy = ((i%8)*120, (i//8)*127)
            sheet.alpha_composite(tile, xy)
            preview.alpha_composite(tile, xy)
        target = ROOT / f'assets/base/items/animals/{name}Escape.png'
        sheet.save(target)
        preview.convert('RGB').save(OUT / f'{name}-sheet.jpg')
        print(target.name, len(frames), sheet.size)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--compile', action='store_true')
    args = parser.parse_args()
    compile_sheets() if args.compile else inspect()
