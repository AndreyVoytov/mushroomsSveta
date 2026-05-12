export default class Label extends Phaser.BitmapText {
    private static GREEN_ESCAPE_SYMBOL = '~';
    private static VIOLET_ESCAPE_SYMBOL = '@';

    public static AIM_STYLE: Phaser.PhaserTextStyle = { font: 'bold 40px PanelDigitsBrown', fill: '#ffffff' };

    public static INFO_GREEN_STYLE: Phaser.PhaserTextStyle = { font: 'bold 60px Arial', fill: '#00ff00', wordWrap: true, wordWrapWidth: 800 };
    public static INFO_BLACK_STYLE: Phaser.PhaserTextStyle = { font: '50px Arial', fill: '#000000', wordWrap: true, wordWrapWidth: 800 };
    public static CLICK_TO_SKIP_YELLOW_STYLE: Phaser.PhaserTextStyle = { font: 'bold 40px Arial', fill: '#f8c600' };

    public static VIOLET_STYLE: Phaser.PhaserTextStyle = { font: 'bold 70px Bookman Old Style', fill: '#f293fd', wordWrap: true, wordWrapWidth: 800 };
    public static WHITE_STYLE: Phaser.PhaserTextStyle = { font: 'bold 70px Bookman Old Style', fill: '#ffffff', wordWrap: true, wordWrapWidth: 800 };

    public static COMMON_BIG_STYLE: Phaser.PhaserTextStyle = { font: 'bold 55px Arial', fill: '#fff5bc', wordWrap: true, wordWrapWidth: 600 };
    public static COMMON_MEDIUM_STYLE: Phaser.PhaserTextStyle = { font: 'bold 50px Arial', fill: '#ffffff', wordWrap: true, wordWrapWidth: 800 };
    public static COMMON_SMALL_STYLE: Phaser.PhaserTextStyle = { font: 'bold 40px Arial', fill: '#fff0ab', wordWrap: true, wordWrapWidth: 800 };

    public static MAP_POINT_STYLE: Phaser.PhaserTextStyle = { font: 'bold 40px Bookman Old Style', fill: '#000000', wordWrap: true, wordWrapWidth: 800 };
    public static MAP_POINT_STYLE2: Phaser.PhaserTextStyle = { font: 'bold 27px Bookman Old Style', fill: '#9a4848', wordWrap: true, wordWrapWidth: 800 };

    public static TASK_TITLE_STYLE: Phaser.PhaserTextStyle = { font: 'bold 45px Bookman Old Style', fill: '#000000', fontStyle: 'italic', align: 'center', wordWrap: true, wordWrapWidth: 430 };
    public static TASK_STYLE: Phaser.PhaserTextStyle = { font: '35px Bookman Old Style', fill: '#000000', fontStyle: 'italic', align: 'center', wordWrap: true, wordWrapWidth: 510 };
    public static DIALOG_STYLE: Phaser.PhaserTextStyle = { font: 'bold 40px Arial', fill: '#734f3f' };
    public static DIALOG_TITLE_STYLE: Phaser.PhaserTextStyle = { font: '45px Arial', fill: '#FFFFFF', wordWrap: true, wordWrapWidth: 880 };

    private static DEFAULT_STYLE: Phaser.PhaserTextStyle = { font: '40px Arial', fill: '#ffffff', wordWrap: true, wordWrapWidth: 800 };

    private styleDef: Phaser.PhaserTextStyle;
    public strokeThickness: number;
    public lineSpacing: number;
    private ignoreVioletHighlight: boolean;
    private symbolsInRow: number;
    private sourceTextValue: string = '';

    public static BalsamiqSansBold(size: number, color?: string, width?: number): Phaser.PhaserTextStyle {
        return { font: '' + size + 'px BalsamiqSansBold', fill: color || '#ffffff', wordWrap: width ? true : false, wordWrapWidth: width || 5000 };
    }

    public static BalsamiqSansBoldBold(size: number, color?: string, width?: number): Phaser.PhaserTextStyle {
        return { font: 'bold ' + size + 'px BalsamiqSansBold', fill: color || '#ffffff', wordWrap: width ? true : false, wordWrapWidth: width || 5000 };
    }

    public static HiveDigitsLegacy(size: number): Phaser.PhaserTextStyle {
        return { font: 'bold ' + size + 'px HiveDigitsLegacy', fill: '#ffffff' };
    }

    public static PanelDigitsBrown(size: number): Phaser.PhaserTextStyle {
        return { font: 'bold ' + size + 'px PanelDigitsBrown', fill: '#ffffff' };
    }

    constructor(game: Phaser.Game, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle, ignoreVioletHighlight?: boolean, symbolsInRow?: number) {
        super(
            game,
            x,
            y,
            Label.parseFont((style || Label.DEFAULT_STYLE).font ? (style || Label.DEFAULT_STYLE).font.toString() : Label.DEFAULT_STYLE.font.toString()).key,
            '',
            Label.parseFont((style || Label.DEFAULT_STYLE).font ? (style || Label.DEFAULT_STYLE).font.toString() : Label.DEFAULT_STYLE.font.toString()).size
        );

        const styleDef = style || Label.DEFAULT_STYLE;
        const parsed = Label.parseFont(styleDef.font ? styleDef.font.toString() : Label.DEFAULT_STYLE.font.toString());

        this.styleDef = styleDef;
        this.ignoreVioletHighlight = !!ignoreVioletHighlight;
        this.symbolsInRow = symbolsInRow || 0;
        this.strokeThickness = 0;
        this.lineSpacing = 0;
        (<any>this).letterSpacing = parsed.letterSpacing;
        this.tint = Label.toTint(styleDef.fill || '#ffffff');
        (<any>this).align = styleDef.align || 'left';
        this.anchor = new Phaser.Point(0.5, 0);
        this.text = text;
    }

    public setStyle(style: Phaser.PhaserTextStyle): Label {
        this.styleDef = style || Label.DEFAULT_STYLE;

        const parsed = Label.parseFont(this.styleDef.font ? this.styleDef.font.toString() : Label.DEFAULT_STYLE.font.toString());
        this.font = parsed.key;
        this.fontSize = parsed.size;
        (<any>this).letterSpacing = parsed.letterSpacing;
        this.tint = Label.toTint(this.styleDef.fill || '#ffffff');
        (<any>this).align = this.styleDef.align || 'left';
        this.text = this.sourceTextValue;
        return this;
    }

    public addStrokeColor(_color: string, _position: number): Label {
        return this;
    }

    public addColor(_color: string, _position: number): Label {
        return this;
    }

    public bringToTop(): Label {
        const parentAny: any = (this as any).parent;
        if (!parentAny) {
            return this;
        }

        if (typeof parentAny.bringChildToTop === 'function') {
            parentAny.bringChildToTop(this);
            return this;
        }

        if (typeof parentAny.removeChild === 'function' && typeof parentAny.addChild === 'function') {
            parentAny.removeChild(this);
            parentAny.addChild(this);
        }

        return this;
    }

    public set fill(value: any) {
        this.tint = Label.toTint(value);
    }

    public get fill(): any {
        let hex = this.tint.toString(16);
        while (hex.length < 6) {
            hex = '0' + hex;
        }
        return '#' + hex;
    }

    //@ts-ignore
    public set text(value: string) {
        this.applyLocalizedText(value);
    }

    public get text(): string {
        return (this as any)._text;
    }

    public get sourceText(): string {
        return this.sourceTextValue;
    }

    public setPreparedText(value: string): void {
        const prepared = value || '';
        const bitmapText: any = this as any;

        if (prepared !== bitmapText._text) {
            bitmapText._text = prepared;
            bitmapText.updateText();
        }
    }

    private applyLocalizedText(value: string): void {
        this.sourceTextValue = value || '';

        const parsed = Label.parseFont(this.styleDef.font ? this.styleDef.font.toString() : Label.DEFAULT_STYLE.font.toString());
        const prepared = Label.prepareText(this.sourceTextValue, this.styleDef, this.ignoreVioletHighlight, this.symbolsInRow, parsed.size);
        const bitmapText: any = this as any;

        if (prepared !== bitmapText._text) {
            bitmapText._text = prepared;
            bitmapText.updateText();
        }
    }

    private static parseFont(fontSpec: string): { key: string, size: number, letterSpacing: number } {
        let size = 40;
        const match = fontSpec.match(/(\d+)px/i);
        if (match && match[1]) {
            size = Number(match[1]);
        }

        const lowered = fontSpec.toLowerCase();
        if (lowered.indexOf('hivedigitslegacy') >= 0) return { key: 'bm_hive_digits_legacy', size: size, letterSpacing: -1 };
        if (lowered.indexOf('paneldigitsbrown') >= 0) return { key: 'bm_panel_digits_brown', size: size, letterSpacing: -1 };
        if (lowered.indexOf('diarydigits') >= 0) return { key: 'bm_diary_digits', size: size, letterSpacing: -1 };
        if (lowered.indexOf('bookman') >= 0) return { key: 'bm_bookman', size: size, letterSpacing: -1 };
        if (lowered.indexOf('gilroy') >= 0) return { key: 'bm_gilroy', size: size, letterSpacing: -2 };
        if (lowered.indexOf('balsamiq') >= 0) return { key: 'bm_balsamiq', size: size, letterSpacing: -1 };
        if (lowered.indexOf('italic') >= 0 && lowered.indexOf('times') >= 0) return { key: 'bm_times_italic', size: size, letterSpacing: -1 };
        if (lowered.indexOf('times') >= 0) return { key: 'bm_times', size: size, letterSpacing: -1 };
        return { key: 'bm_arial', size: size, letterSpacing: -1 };
    }

    private static prepareText(text: string, style: Phaser.PhaserTextStyle, ignoreVioletHighlight?: boolean, symbolsInRow?: number, size?: number): string {
        let prepared = Label.splitRows(text || '', symbolsInRow);
        prepared = prepared.split(Label.GREEN_ESCAPE_SYMBOL).join('');
        prepared = prepared.split(ignoreVioletHighlight ? '*' : Label.VIOLET_ESCAPE_SYMBOL).join('');
        prepared = prepared.split('*').join('');

        if (style && style.wordWrap && style.wordWrapWidth) {
            prepared = Label.wrapByWidth(prepared, style.wordWrapWidth, size || 40);
        }

        return prepared;
    }

    private static wrapByWidth(text: string, width: number, size: number): string {
        const maxChars = Math.max(1, Math.floor(width / Math.max(1, Math.floor(size * 0.56))));
        const lines: string[] = [];
        let line = '';

        text.split('\n').forEach(rawLine => {
            rawLine.split(' ').forEach(word => {
                const candidate = line.length ? line + ' ' + word : word;
                if (candidate.length > maxChars && line.length > 0) {
                    lines.push(line);
                    line = word;
                } else {
                    line = candidate;
                }
            });
            lines.push(line);
            line = '';
        });

        return lines.join('\n');
    }

    private static toTint(value: any): number {
        if (!value) return 0xffffff;
        if (typeof value === 'number') return value;

        let normalized = value.toString().trim();
        if (normalized.charAt(0) === '#') {
            normalized = normalized.substring(1);
        }
        if (normalized.length === 3) {
            normalized = normalized[0] + normalized[0] + normalized[1] + normalized[1] + normalized[2] + normalized[2];
        }

        const parsed = parseInt(normalized, 16);
        return isNaN(parsed) ? 0xffffff : parsed;
    }

    private static splitRows(text: string, symbolsInRow?: number): string {
        if (!symbolsInRow) {
            return text;
        }

        let currentLength = 0;
        const words = text.split(' ');
        words.forEach((word, index) => {
            if (currentLength + word.length >= symbolsInRow) {
                currentLength = 0;
                if (index > 0) {
                    words[index - 1] = words[index - 1].concat('\n');
                }
            }
            words[index] = word.concat(' ');
            currentLength += word.length + 1;
        });

        return words.join('');
    }
}
