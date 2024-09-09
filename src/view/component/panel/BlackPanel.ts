import Label from './../../component/panel/Label';
import BasePanel from './BasePanel';
export default class BlackPanel extends BasePanel {

    private black: Phaser.Graphics;

    private static ANIMATION_TIME = 500;

    constructor(game: Phaser.Game) {
        super(game, 0, 0);

        this.black = new Phaser.Graphics(this.game, 0, 0);
        this.black.beginFill(0x000000, 1);
        this.black.drawRect(0, 0, this.game.width, this.game.height);
        this.black.endFill();
        this.black.alpha = 0;
        this.black.inputEnabled = false;
        this.black.fixedToCamera = true;
        this.addChild(this.black);

        this.inputEnabled = false;
    }

    public fadeIn(delay?: number) {
        this.game.add.tween(this.black).to({ alpha: 1 }, BlackPanel.ANIMATION_TIME, Phaser.Easing.Linear.None, true, delay || 0, 0, false);
    }

    public fadeOut(delay?: number) {
        this.game.add.tween(this.black).to({ alpha: 0 }, BlackPanel.ANIMATION_TIME, Phaser.Easing.Linear.None, true, delay || 0, 0, false);
    }

    public showMessage(text: string, delay: number, waitTime: number, style?: Phaser.PhaserTextStyle): void {
        let animationTime = 500;

        this.game.add.tween(this.black).to({ alpha: 1 }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);
        this.black.alpha = 1;
        this.game.add.tween(this.black).to({ alpha: 0 }, animationTime, Phaser.Easing.Linear.None, true, delay + animationTime + waitTime, 0, false);
        this.black.alpha = 0;

        let label = new Label(this.game, this.game.width / 2, this.game.height / 2, text, style || Label.WHITE_STYLE);
        label.fixedToCamera = true;
        label.alpha = 0;
        label.anchor = new Phaser.Point(0.5, 0.5);
        this.addChild(label);

        this.game.add.tween(label).to({ alpha: 1 }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);
        label.alpha = 1;
        this.game.add.tween(label).to({ alpha: 0 }, animationTime, Phaser.Easing.Linear.None, true, delay + animationTime + waitTime, 0, false);
        label.alpha = 0;
    }

}