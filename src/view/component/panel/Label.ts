export default class Label extends Phaser.BitmapText {
    private static GREEN_ESCAPE_SYMBOL = "~";
    private static VIOLET_ESCAPE_SYMBOL = "@";

    public static AIM_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#ffffff" };

    public static INFO_GREEN_STYLE: Phaser.PhaserTextStyle = { font: "bold 60px Arial", fill: "#00ff00", wordWrap: true, wordWrapWidth: 800 };
    public static INFO_BLACK_STYLE: Phaser.PhaserTextStyle = { font: "50px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: 800 };
    public static CLICK_TO_SKIP_YELLOW_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#f8c600" };

    public static VIOLET_STYLE: Phaser.PhaserTextStyle = { font: "bold 70px Bookman Old Style", fill: "#f293fd", wordWrap: true, wordWrapWidth: 800 };
    public static WHITE_STYLE: Phaser.PhaserTextStyle = { font: "bold 70px Bookman Old Style", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 };

    public static COMMON_BIG_STYLE: Phaser.PhaserTextStyle = { font: "bold 55px Arial", fill: "#fff5bc", wordWrap: true, wordWrapWidth: 600 };
    public static COMMON_MEDIUM_STYLE: Phaser.PhaserTextStyle = { font: "bold 50px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 };
    public static COMMON_SMALL_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#fff0ab", wordWrap: true, wordWrapWidth: 800 };

    public static MAP_POINT_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Bookman Old Style", fill: "#000000", wordWrap: true, wordWrapWidth: 800 };
    public static MAP_POINT_STYLE2: Phaser.PhaserTextStyle = { font: "bold 27px Bookman Old Style", fill: "#9a4848", wordWrap: true, wordWrapWidth: 800 };

    public static TASK_TITLE_STYLE: Phaser.PhaserTextStyle = { font: "bold 45px Bookman Old Style", fill: "#000000", fontStyle: "italic", align: "center", wordWrap: true, wordWrapWidth: 430 };
    public static TASK_STYLE: Phaser.PhaserTextStyle = { font: "35px Bookman Old Style", fill: "#000000", fontStyle: "italic", align: "center", wordWrap: true, wordWrapWidth: 510 };
    public static DIALOG_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#734f3f" };
    public static DIALOG_TITLE_STYLE: Phaser.PhaserTextStyle = { font: "45px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 880 };

    private static DEFAULT_STYLE: Phaser.PhaserTextStyle = { font: "40px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 };

    private styleDef: Phaser.PhaserTextStyle;
    public strokeThickness: number;
    public lineSpacing: number;

    public static BalsamiqSansBold(size: number, color?: string, width?: number): Phaser.PhaserTextStyle {
        return { font: "" + size + "px BalsamiqSansBold", fill: color || "#ffffff", wordWrap: width ? true : false, wordWrapWidth: width || 5000 };
    }

    public static BalsamiqSansBoldBold(size: number, color?: string, width?: number): Phaser.PhaserTextStyle {
        return { font: "bold " + size + "px BalsamiqSansBold", fill: color || "#ffffff", wordWrap: width ? true : false, wordWrapWidth: width || 5000 };
    }

    constructor(game: Phaser.Game, x: number, y: number, text: string, style?: Phaser.PhaserTextStyle, ignoreVioletHighlight?: boolean, symbolsInRow?: number) {
        let styleDef = style || Label.DEFAULT_STYLE;
        let parsed = Label.parseFont(styleDef.font ? styleDef.font.toString() : Label.DEFAULT_STYLE.font.toString());
        let cleanText = Label.prepareText(text, styleDef, ignoreVioletHighlight, symbolsInRow, parsed.size);

        super(game, x, y, parsed.key, cleanText, parsed.size);

        this.styleDef = styleDef;
        this.strokeThickness = 0;
        this.lineSpacing = 0;
        (<any>this).letterSpacing = parsed.letterSpacing;
        this.tint = Label.toTint(styleDef.fill || "#ffffff");
        (<any>this).align = styleDef.align || "left";
        this.anchor = new Phaser.Point(0.5, 0);
    }

    public setStyle(style: Phaser.PhaserTextStyle): Label {
        this.styleDef = style || Label.DEFAULT_STYLE;
        let parsed = Label.parseFont(this.styleDef.font ? this.styleDef.font.toString() : Label.DEFAULT_STYLE.font.toString());
        this.font = parsed.key;
        this.fontSize = parsed.size;
        (<any>this).letterSpacing = parsed.letterSpacing;
        this.tint = Label.toTint(this.styleDef.fill || "#ffffff");
        (<any>this).align = this.styleDef.align || "left";
        this.text = Label.prepareText(this.text, this.styleDef, false, 0, parsed.size);
        return this;
    }

    public addStrokeColor(_color: string, _position: number): Label {
        return this;
    }

    public addColor(_color: string, _position: number): Label {
        return this;
    }

    public set fill(value: any) {
        this.tint = Label.toTint(value);
    }

    public get fill(): any {
        let hex = this.tint.toString(16);
        while (hex.length < 6) {
            hex = "0" + hex;
        }
        return "#" + hex;
    }

    private static parseFont(fontSpec: string): { key: string, size: number, letterSpacing: number } {
        let size = 40;
        let m = fontSpec.match(/(\d+)px/i);
        if (m && m[1]) {
            size = Number(m[1]);
        }

        let f = fontSpec.toLowerCase();
        if (f.indexOf("diarydigits") >= 0) return { key: "bm_diary_digits", size: size, letterSpacing: -1 };
        if (f.indexOf("bookman") >= 0) return { key: "bm_bookman", size: size, letterSpacing: -1 };
        if (f.indexOf("gilroy") >= 0) return { key: "bm_gilroy", size: size, letterSpacing: -2 };
        if (f.indexOf("balsamiq") >= 0) return { key: "bm_balsamiq", size: size, letterSpacing: -1 };
        if (f.indexOf("times") >= 0) return { key: "bm_times", size: size, letterSpacing: -1 };
        return { key: "bm_arial", size: size, letterSpacing: -1 };
    }

    private static prepareText(text: string, style: Phaser.PhaserTextStyle, ignoreVioletHighlight?: boolean, symbolsInRow?: number, size?: number): string {
        let t = Label.splitRows(text || "", symbolsInRow);
        t = t.split(Label.GREEN_ESCAPE_SYMBOL).join("");
        t = t.split(ignoreVioletHighlight ? "*" : Label.VIOLET_ESCAPE_SYMBOL).join("");
        t = t.split("*").join("");
        if (style && style.wordWrap && style.wordWrapWidth) {
            t = Label.wrapByWidth(t, style.wordWrapWidth, size || 40);
        }
        return t;
    }

    private static wrapByWidth(text: string, width: number, size: number): string {
        let maxChars = Math.max(1, Math.floor(width / Math.max(1, Math.floor(size * 0.56))));
        let lines: string[] = [];
        let line = "";
        text.split("\n").forEach(rawLine => {
            rawLine.split(" ").forEach(word => {
                let candidate = line.length ? line + " " + word : word;
                if (candidate.length > maxChars && line.length > 0) {
                    lines.push(line);
                    line = word;
                } else {
                    line = candidate;
                }
            });
            lines.push(line);
            line = "";
        });
        return lines.join("\n");
    }

    private static toTint(value: any): number {
        if (!value) return 0xffffff;
        if (typeof value === "number") return value;
        let s = value.toString().trim();
        if (s.charAt(0) === "#") {
            s = s.substring(1);
        }
        if (s.length === 3) {
            s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
        }
        let n = parseInt(s, 16);
        return isNaN(n) ? 0xffffff : n;
    }

    private static splitRows(text: string, symbolsInRow?: number): string {
        if (!symbolsInRow) {
            return text;
        }

        let currentLength = 0;
        let words = text.split(" ");
        words.forEach((w, i) => {
            if (currentLength + w.length >= symbolsInRow) {
                currentLength = 0;
                if (i > 0) {
                    words[i - 1] = words[i - 1].concat("\n");
                }
            }
            words[i] = w.concat(" ");
            currentLength += w.length + 1;
        });

        return words.join("");
    }
}

