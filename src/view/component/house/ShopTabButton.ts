import BasePanel from '../panel/BasePanel';
import Label from '../panel/Label';

export type ShopTabId = 'bank' | 'items' | 'heroes';

export default class ShopTabButton extends BasePanel {
    private static readonly ACTIVE_LABEL_STYLE: Phaser.PhaserTextStyle = {
        font: "46px Bookman Old Style",
        fill: "#7f3113",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 250
    };

    private static readonly INACTIVE_LABEL_STYLE: Phaser.PhaserTextStyle = {
        font: "46px Bookman Old Style",
        fill: "#7e5523",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 250
    };

    private hitButton: Phaser.Button;
    private label: Label;

    constructor(game: Phaser.Game, name: string, text: string, callback: () => void) {
        super(game, 0, 0, name, "blank");

        this.hitButton = this.attachButton("blank", callback, "hitArea");
        this.hitButton.alpha = 0.001;

        this.label = this.attachText("label", text, ShopTabButton.INACTIVE_LABEL_STYLE);
        this.label.anchor.set(0.5);
        this.label.y = -3;

        this.setHitAreaSize(290, 94);
    }

    public setHitAreaSize(width: number, height: number): void {
        this.hitButton.width = width;
        this.hitButton.height = height;
    }

    public setActive(active: boolean): void {
        this.label.setStyle(active ? ShopTabButton.ACTIVE_LABEL_STYLE : ShopTabButton.INACTIVE_LABEL_STYLE);
        this.label.y = -3;
    }
}
