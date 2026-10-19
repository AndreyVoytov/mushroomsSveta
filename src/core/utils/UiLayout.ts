import Label from '../../view/component/panel/Label';

/** Text boxes are measured independently of the painted sprite's decorative bounds. */
export default class UiLayout {
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
