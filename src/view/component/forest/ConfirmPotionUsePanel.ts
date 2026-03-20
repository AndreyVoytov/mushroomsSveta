import AnimationUtils from '../../../core/utils/AnimationUtils';
import Label from '../../component/panel/Label';
import ClosablePanel from '../../component/panel/ClosablePanel';
import LocalizationService from '../../../core/localization/LocalizationService';
export default class ConfirmPotionUsePanel extends ClosablePanel {

    constructor(game: Phaser.Game, x: number, y: number, okCallback: () => void) {
        super(game, x, y, false, "confirmPanel");
        this.game = game;
        this.inputEnabled = true;
        this.fixedToCamera = true;

        this.attachSprite("panel")
        this.attachText("label", LocalizationService.get('ui.confirmPotionUse'), { font: "50px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500 })

        let okButton = this.attachButton("pnlButton", () => {
            AnimationUtils.jelly(this.game, okButton);
            okCallback();
        }, "okButton")
        let okLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.applyLower'));
        okLabel.anchor.set(0.5)
        okLabel.scale.set(1.2, 1)
        okButton.addChild(okLabel)

        let noButton = this.attachButton("pnlButton", () => {
            AnimationUtils.jelly(this.game, noButton);
            this.close();
        }, "noButton")
        let noLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.backLower'));
        noLabel.scale.set(1.2 * 1.2, 1 * 1.2)
        noLabel.anchor.set(0.5)
        noButton.addChild(noLabel)
        noButton.tint = 0xff0000;

        this.attachButton("closeButton", () => {
            this.close();
        })

        this.alpha = 0;

        this.applyPreset([{ "spriteId": "panel", "x": 0, "y": 0, "scaleX": 0.94, "scaleY": 0.7399999999999998, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "label", "x": 13, "y": -130, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 50 },
        { "spriteId": "okButton", "x": 4, "y": 54, "scaleX": 0.98, "scaleY": 1.1600000000000001, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "noButton", "x": 4, "y": 177, "scaleX": 0.7199999999999998, "scaleY": 0.8599999999999999, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "closeButton", "x": 280, "y": -222, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])

    }

}