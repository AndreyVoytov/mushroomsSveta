import Label from '../../view/component/panel/Label';

/** Text boxes are measured independently of the painted sprite's decorative bounds. */
export default class UiLayout {
    public static fit(label: Label, width: number, height: number, wrap: boolean = false): void {
        if (wrap && label.anchor.x === 0.5) label.align = 'center';
        label.maxWidth = wrap ? width : 0;
        // Use glyph widths once. Legacy character-count wrapping followed by
        // BitmapText wrapping can add a third line and shrink an otherwise short label.
        label.setPreparedText(label.sourceText.replace(/[~@]/g, ''));
        label.updateText();
        const scale = Math.min(1, width / Math.max(1, label.textWidth), height / Math.max(1, label.textHeight));
        label.scale.set(scale, scale);
    }
}
