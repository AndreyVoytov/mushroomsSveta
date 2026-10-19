import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import InfoPanel from './../../component/panel/InfoPanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
import UiLayout from '../../../core/utils/UiLayout';
export default class HelperPanel extends BasePanel {

    private personImage: Phaser.Sprite;
    private dialogPnl: Phaser.Sprite;
    private text: Label;

    private fromLeft: boolean = false;
    private canCloseAt: number = 0;

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

        const textWidth = 450;
        const hasImages = images && images.length > 0;
        this.text = new Label(this.game, -130, 0, text, { font: "bold 34px Arial", fill: Label.INK, wordWrap: true, wordWrapWidth: textWidth });
        this.text.anchor = new Phaser.Point(0.5, 0.5);
        this.text.lineSpacing = -5;
        this.addChild(this.text);
        UiLayout.fit(this.text, textWidth, 1000, true);
        const baseHeight = okButton ? (hasImages ? 480 : 440) : (hasImages ? 430 : 350);
        const bodyBudget = hasImages ? 170 : 220;
        const panelHeight = Math.min(800, baseHeight + Math.max(0, this.text.textHeight - bodyBudget));
        this.dialogPnl.anchor.set(0.5);this.dialogPnl.position.set(0, 0);
        this.dialogPnl.width = 880;this.dialogPnl.height = panelHeight;
        const contentTop = -panelHeight / 2 + 96;
        const contentBottom = panelHeight / 2 - (okButton ? 124 : 72);
        const textBottom = contentBottom - (hasImages ? 138 : 0);
        this.text.y = (contentTop + textBottom) / 2;
        UiLayout.fit(this.text, textWidth, textBottom - contentTop, true);
        this.personImage.anchor.set(0.5, 1);
        // The painted parchment ends before the texture's transparent margins.
        // Keep the illustration inside that visible edge, including its feet.
        this.personImage.position.set(240, panelHeight / 2 - 88);
        SpriteUtils.fitIcon(this.personImage, 284, panelHeight - 144);

        if (images && images.length > 0) {
            const icons = new InfoPanel(this.game, 0, 0, [], images, true);
            // Sprite.getLocalBounds describes the blank root texture in CE.
            // Measure the actual children so the row cannot drift onto OK.
            let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
            icons.children.forEach((child: any) => {
                left = Math.min(left, child.x - child.anchor.x * child.width);
                right = Math.max(right, child.x + (1 - child.anchor.x) * child.width);
                top = Math.min(top, child.y - child.anchor.y * child.height);
                bottom = Math.max(bottom, child.y + (1 - child.anchor.y) * child.height);
            });
            const bounds = {x:left,y:top,width:right-left,height:bottom-top};
            const scale = Math.min(1, textWidth / Math.max(1, bounds.width), 112 / Math.max(1, bounds.height));
            icons.scale.set(scale);
            const ink = this.text.getInkBounds();
            const textHeight = (ink ? ink.height : this.text.textHeight) * this.text.scale.y;
            const iconsHeight = bounds.height * scale;
            const totalHeight = textHeight + 26 + iconsHeight;
            this.text.y = (contentTop + contentBottom - totalHeight + textHeight) / 2;
            icons.position.set(this.text.x - (bounds.x + bounds.width / 2) * scale,
                this.text.y + textHeight / 2 + 26 + iconsHeight / 2 - (bounds.y + bounds.height / 2) * scale);
            this.addChild(icons);
        }

        if (okButton) {
            const okButtonY = panelHeight / 2 - 60;
            const okArtwork = SpriteUtils.createSprite(this.game, -135, okButtonY, 'pnlButton');
            okArtwork.anchor.set(0.5);
            okArtwork.width = 300;okArtwork.height = 84;
            this.addChild(okArtwork);

            const okLabel = new Label(this.game, -135, okButtonY, LocalizationService.get('ui.goodLower'), {
                font: 'bold 40px Arial', fill: Label.INK
            });
            okLabel.anchor.set(0.5);
            UiLayout.fit(okLabel, 242, 48);
            this.addChild(okLabel);
        }
    }

    show(delay: number) {
        this.canCloseAt = this.game.time.now + (delay || 0) + 500;
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

    public canClose(): boolean {
        return this.game.time.now >= this.canCloseAt;
    }

    hide(delay: number) {
        if (this.fromLeft) {
            this.game.add.tween(this).to({ x: -this.dialogPnl.width * 1.5 }, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        } else {
            this.game.add.tween(this).to({ y: -this.dialogPnl.height }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        }
    }

}
