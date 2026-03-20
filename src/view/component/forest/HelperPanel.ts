import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import InfoPanel from './../../component/panel/InfoPanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
export default class HelperPanel extends BasePanel {

    private personImage: Phaser.Sprite;
    private dialogPnl: Phaser.Sprite;
    private text: Label;

    private fromLeft: boolean = false;

    constructor(game: Phaser.Game, x: number, y: number, text: string, character: string, images?: string[],
        fromLeft?: boolean, okButton?: boolean) {
        super(game, x, y);
        this.game = game;
        this.fromLeft = fromLeft;
        this.alpha = 0;

        this.dialogPnl = SpriteUtils.createSprite(this.game, 0, -500, 'helperPanel2');
        this.dialogPnl.anchor = new Phaser.Point(okButton ? 0.5 : 0.5, okButton ? 0.4 : 0.5);
        this.dialogPnl.y += 500 - (okButton? 0 : 15);
        this.dialogPnl.scale = new Phaser.Point(okButton ? 1.3 : 1.35, okButton ? (images && images.length > 0 ? 1.53 : 1.33) : 0.95);
        this.addChild(this.dialogPnl);

        console.log("HELPER PANEL!")

        this.personImage = SpriteUtils.createSprite(this.game, this.dialogPnl.width / 2 ,
            (1 - this.dialogPnl.anchor.y) * this.dialogPnl.height - 20, character);
        this.personImage.anchor = new Phaser.Point(1, 1);
        this.personImage.scale.set(0.7);
        this.addChild(this.personImage);

        let textWidth = 656*1.1 - 80 - 200;// this.dialogPnl.width - 80 - 200-60;
        this.text = new Label(this.game, -110, okButton? 0: -7, text, { font: "bold 40px Arial", fill: "#804119", wordWrap: true, wordWrapWidth: textWidth });
        this.text.anchor = new Phaser.Point(0.5, 0.5);
        this.text.lineSpacing = -5;
        this.addChild(this.text);

        if (images && images.length > 0) {
            this.text.y -= 60;
            let imagesLength = images.filter(i => !i.startsWith("-")).length
            this.addChild(new InfoPanel(this.game, this.text.x - 58 * imagesLength, this.text.y + 50 + (okButton ? 20 : 0), [], images, true))
        }

        if (okButton) {
            let okButtin = SpriteUtils.createSprite(this.game, -135, this.dialogPnl.height / 2 - 27, 'pnlButton');
            okButtin.anchor = new Phaser.Point(0.5, 0.5);
            okButtin.scale = new Phaser.Point(0.7, 0.7);
            this.addChild(okButtin);

            let okLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.goodLower'), { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
            okLabel.anchor = new Phaser.Point(0.5, 0.5);
            okLabel.strokeThickness = 4;
            okLabel.addStrokeColor('#61b019', 0);
            okButtin.addChild(okLabel);
        }
    }

    show(delay: number) {
        let toX = this.x;
        let toY = this.y;

        if (this.fromLeft) {
            this.x = -this.dialogPnl.width * 1.5;
        } else {
            this.y = -this.dialogPnl.height;
        }

        this.game.add.tween(this).to({ y: toY, x: toX }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.add.tween(this).to({alpha:1 }, 50, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, delay, 0, false);
    }

    hide(delay: number) {
        if (this.fromLeft) {
            this.game.add.tween(this).to({ x: -this.dialogPnl.width * 1.5 }, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        } else {
            this.game.add.tween(this).to({ y: -this.dialogPnl.height }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        }
    }

}
