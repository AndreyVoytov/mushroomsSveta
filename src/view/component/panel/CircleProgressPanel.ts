import { Sprite, Easing } from 'phaser-ce';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import BasePanel from './BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class CircleProgressPanel extends BasePanel {

    protected blackTransparent: Phaser.Graphics;

    constructor(game: Phaser.Game) {
        super(game, 0, 0, name);

        this.blackTransparent = new Phaser.Graphics(this.game, 0, 0);
        this.blackTransparent.beginFill(0x000000, 1);
        this.blackTransparent.drawRect(0, 0, this.game.width, this.game.height);
        this.blackTransparent.endFill();
        this.blackTransparent.alpha = 0;
        this.blackTransparent.inputEnabled = false;
        this.blackTransparent.fixedToCamera = true;
        this.game.add.existing(this.blackTransparent);

        game.time.events.add(100, () => {
            this.sendToBack();
        })

        let circle = SpriteUtils.createSprite(game, this.game.width/2, this.game.height/2, "progressCircle")
        circle.anchor.set(0.5);
        circle.scale.set(2);
        this.game.add.tween(circle).to({angle: 360}, 5000, Easing.Linear.None, true, 0, -1)

        this.addSprite(circle)

        this.visible = false;
    }

    public show() {
        this.game.world.bringToTop(this.blackTransparent);
        this.bringToTop();
        this.blackTransparent.inputEnabled = true;
        this.blackTransparent.events.onInputDown.add(this.hide, this);

        this.game.add.tween(this.blackTransparent).to({ alpha: 0.5 }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 300, 0, false);
        this.blackTransparent.inputEnabled = true;

        this.game.time.events.add(100, () => {
            this.bringToTop();
        })

        this.visible = true;
        this.scale.set(1);
        AnimationUtils.fadeIn(this.game, this, 200);
    }

    public hide() {
        this.inputEnabled = false;
        this.blackTransparent.inputEnabled = false;
        this.game.tweens.removeFrom(this.blackTransparent);
        this.game.tweens.removeFrom(this);
        this.game.add.tween(this.blackTransparent).to({ alpha: 0 }, 200, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.add.tween(this).to({ alpha: 0 }, 200, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.time.events.add(250, ()=> {
            this.sendToBack();
            this.visible = false;
            this.blackTransparent.visible = false;
        });
    }

    public bringToTop(): Sprite {
        this.game.world.bringToTop(this.blackTransparent);
        return super.bringToTop();
    }
}