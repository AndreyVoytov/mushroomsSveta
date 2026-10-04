"""Inspect and compile the locally supplied animal videos into keyed sprite sheets."""
from pathlib import Path
import argparse
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / '.local-workbench/raw-assets/animals/video'
OUT = ROOT / '.local-workbench/animal-previews'

def frame_at(cap, t):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f'Cannot decode frame at {t}')
    return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

def inspect():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ['rabbit', 'butterfly', 'bat', 'duck', 'fish', 'ram']:
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

def compile_sheets(only=None):
    OUT.mkdir(parents=True, exist_ok=True)
    specs = {
        # Skip the source's first leap: its ears leave the video frame.
        'rabbit': np.r_[np.linspace(0.25, 1.85, 12), np.linspace(2.62, 4.35, 20)],
        'butterfly': np.r_[np.linspace(0, 0.7, 4), np.linspace(1.98, 2.95, 20)],
        'bat': np.r_[np.linspace(0.15, 2.65, 12), np.linspace(2.8, 4.35, 20)],
        # The new clips are short; keep the full readable action and avoid
        # the fish's final tiny, distant frames.
        'fish': np.linspace(0.0, 2.22, 32),
        'ram': np.linspace(0.0, 4.35, 32),
        # Play the water takeoff once, then loop only the airborne wingbeat.
        'duck': np.r_[np.linspace(0.0, 0.46, 5), np.linspace(0.85, 2.25, 11),
                      np.linspace(2.48, 2.94, 16)],
    }
    for name, times in specs.items():
        if only and name != only:
            continue
        cap = cv2.VideoCapture(str(RAW / f'video_{name}.mp4'))
        frames, bounds = [], []
        for t in times:
            rgb = frame_at(cap, float(t))
            hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
            if name != 'duck' or t < 0.62:
                # Magenta screen used by the animation clips. The butterfly
                # has a pale pink glow, so use a softer saturation threshold.
                key = ((hsv[:, :, 0] > 130) & (hsv[:, :, 0] < 179)
                       & (hsv[:, :, 1] > (16 if name == 'butterfly' else 45 if name == 'duck' else 135))
                       & (hsv[:, :, 2] > (0 if name == 'butterfly' else 110)))
                mask = (~key).astype(np.uint8)
                count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
                # Keep the character and nearby water effects, while dropping
                # the tiny source watermark and isolated background flecks.
                areas = stats[:, cv2.CC_STAT_AREA]
                areas[0] = 0  # label zero is keyed-out background, not a subject
                mask = np.isin(labels, np.flatnonzero(areas > 90)).astype(np.uint8)
            else:
                # Lake frames have no solid-color key. Keep the duck's warm
                # plumage/bill, its dark green head and white feathers, then
                # retain nearby white/cyan water rings and takeoff spray.
                hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
                h, w = hsv.shape[:2]
                yy, xx = np.mgrid[:h, :w]
                r, g, b = [rgb[:,:,i].astype(np.int16) for i in range(3)]
                warm = (r > g*1.04) & (r > b*1.06) & (hsv[:,:,1] > 45)
                neutral = (np.max(rgb, axis=2).astype(np.int16) - np.min(rgb, axis=2).astype(np.int16) < 40) & (np.mean(rgb, axis=2) > 145) & (yy > h*.28)
                green_head = (hsv[:,:,0] > 38) & (hsv[:,:,0] < 94) & (hsv[:,:,1] > 75) & (hsv[:,:,2] < 155) & (xx > w*.18) & (xx < w*.75) & (yy > h*.16) & (yy < h*.7)
                dark_detail = (np.max(rgb, axis=2) < 105) & (xx > w*.18) & (xx < w*.82) & (yy > h*.15) & (yy < h*.86)
                mask = (warm | neutral | green_head | dark_detail).astype(np.uint8)
                # Join feather details and the head to the body without
                # filling the gaps between the concentric water rings.
                mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5,5),np.uint8))
                count, labels, stats, centers = cv2.connectedComponentsWithStats(mask, 8)
                warm_y, warm_x = np.where(warm)
                if len(warm_x):
                    cx, cy = float(np.mean(warm_x)), float(np.mean(warm_y))
                    kept = np.zeros(count, dtype=np.uint8)
                    for label in range(1, count):
                        if stats[label, cv2.CC_STAT_AREA] < 100:
                            continue
                        dx, dy = centers[label][0]-cx, centers[label][1]-cy
                        if np.any(labels[warm] == label) or dx*dx + dy*dy < (w*.29)**2:
                            kept[label] = 1
                    mask = kept[labels]
                if t >= 2.48:
                    # In flight the lake rings are separate from the bird.
                    # Keep the component containing its green head, not water.
                    head_labels = labels[green_head & (mask > 0)]
                    head_labels = head_labels[head_labels != 0]
                    if not len(head_labels):
                        raise RuntimeError(f'Cannot isolate airborne duck at {t}')
                    bird_label = np.bincount(head_labels).argmax()
                    mask = (labels == bird_label).astype(np.uint8)
            # Source clips have a small creator watermark at the lower right.
            # Clear just that margin, outside the character's usable bounds.
            mask[int(mask.shape[0]*.89):, int(mask.shape[1]*.58):] = 0
            # Keep the mask edge clean while preserving the smaller splashes.
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3,3),np.uint8))
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
    parser.add_argument('--only', choices=['rabbit', 'butterfly', 'bat', 'duck', 'fish', 'ram'])
    args = parser.parse_args()
    compile_sheets(args.only) if args.compile else inspect()
