import Label from '../../view/component/panel/Label';

/** Text boxes are measured independently of the painted sprite's decorative bounds. */
export default class UiLayout {
    /** Center the visible icon and glyphs together, including trimmed atlas art. */
    public static goalPair(icon: Phaser.Sprite, count: Label, center: number, y: number, gap: number): void {
        const texture = icon.texture, frame = texture.frame, crop = texture.crop;
        const trim: any = texture.trim;
        const art = UiLayout.iconInk(icon);
        const iconLeft = ((trim ? trim.x : 0) + art.x - icon.anchor.x * (trim ? trim.width : frame.width)) * icon.scale.x;
        const iconTop = ((trim ? trim.y : 0) + art.y - icon.anchor.y * (trim ? trim.height : frame.height)) * icon.scale.y;
        const iconWidth = art.width * icon.scale.x, iconHeight = art.height * icon.scale.y;
        const ink = count.getInkBounds();
        const countLeft = ink ? ink.x * count.scale.x : -count.width / 2;
        const countWidth = ink ? ink.width * count.scale.x : count.width;
        const start = center - (iconWidth + gap + countWidth) / 2;
        icon.x = start - iconLeft;icon.y = y - iconTop - iconHeight / 2;
        count.x = start + iconWidth + gap - countLeft;
        count.y = y - (ink ? (ink.y + ink.height / 2) * count.scale.y : 0);
    }

    private static iconInk(icon: Phaser.Sprite): {x: number, y: number, width: number, height: number} {
        const texture: any = icon.texture;
        if (texture.uiInkBounds) return texture.uiInkBounds;
        const crop = texture.crop;
        const bitmap = icon.game.make.bitmapData(crop.width, crop.height);
        bitmap.context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        const pixels = bitmap.context.getImageData(0, 0, crop.width, crop.height).data;
        let left = crop.width, top = crop.height, right = -1, bottom = -1;
        for (let y = 0; y < crop.height; y++) for (let x = 0; x < crop.width; x++) {
            if (pixels[(y * crop.width + x) * 4 + 3] <= 16) continue;
            left = Math.min(left, x);top = Math.min(top, y);right = Math.max(right, x);bottom = Math.max(bottom, y);
        }
        bitmap.destroy();
        texture.uiInkBounds = right < left ? {x: 0, y: 0, width: crop.width, height: crop.height}
            : {x: left, y: top, width: right - left + 1, height: bottom - top + 1};
        return texture.uiInkBounds;
    }

    public static touchTarget(sprite: Phaser.Sprite | Phaser.Button, width: number = 96, height: number = 96): void {
        const frame = sprite.texture.frame;
        const localWidth = Math.max(frame.width, width / Math.max(0.001, Math.abs(sprite.scale.x)));
        const localHeight = Math.max(frame.height, height / Math.max(0.001, Math.abs(sprite.scale.y)));
        sprite.hitArea = new Phaser.Rectangle(frame.width * (0.5 - sprite.anchor.x) - localWidth / 2,
            frame.height * (0.5 - sprite.anchor.y) - localHeight / 2, localWidth, localHeight);
    }

    public static fit(label: Label, width: number, height: number, wrap: boolean = false): void {
        if (wrap && label.anchor.x === 0.5) label.align = 'center';
        label.maxWidth = wrap ? width : 0;
        // Use glyph widths once. Legacy character-count wrapping followed by
        // BitmapText wrapping can add a third line and shrink an otherwise short label.
        label.setPreparedText(label.layoutText);
        label.updateText();
        const ink = label.getInkBounds();
        // A centered box constrains visible letters. Counting the font's empty
        // ascent/descent padding used to shrink two-line captions unnecessarily.
        const contentHeight = label.anchor.y === 0.5 && ink ? ink.height : label.textHeight;
        const scale = Math.min(1, width / Math.max(1, label.textWidth), height / Math.max(1, contentHeight));
        label.scale.set(scale, scale);
    }
}
