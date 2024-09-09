import Settings from "../../../core/service/Settings";
import BasePanel from "./BasePanel";

export default class ColorTransitionPanel extends BasePanel {

    private black;

    constructor(game: Phaser.Game, color: number, time: number, delay: number, from: boolean, to?:boolean) {
        super(game, 0, 0);
        this.game = game;

        this.fixedToCamera = true;

        this.black = new Phaser.Graphics(this.game, 0, 0);
        this.black.beginFill(color, 1);
        this.black.drawRect(0, 0, this.game.width, this.game.height);
        this.black.endFill();
        this.black.alpha = 0;
        this.game.add.existing(this.black);

        if (from) {
            this.game.add.tween(this.black).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay);
            if(to){
                this.black.alpha = 1;
                this.game.add.tween(this.black).to({ alpha: 0 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + time);
            }
            this.black.alpha = 0;
        } else {
            this.black.alpha = 1;
            this.game.add.tween(this.black).to({ alpha: 0 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay);
        }
    }
}

