import { Sprite } from 'phaser-ce';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import BasePanel from './BasePanel';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
export default class ClosablePanel extends BasePanel {

    public blackTransparent: Phaser.Graphics;
    private closeByTapBeside: boolean;
    public processing: boolean = false;
    public opened:boolean = false;
    public fadeTransition:boolean = false;

    private maxScale:number;

    constructor(game: Phaser.Game, x: number, y: number, closeByTapBeside: boolean, name?: string, maxScale?:number, fadeTransition?:boolean) {
        super(game, x, y, name);
        this.closeByTapBeside = closeByTapBeside;
        this.maxScale = maxScale || 1;
        this.fadeTransition = fadeTransition || false;

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
    }

    public show(instantly?: boolean) {
        if (this.processing) {
            return;
        }

        this.opened = true;

        this.processing = true;
        this.game.time.events.add(500, () => this.processing = false)

        this.game.world.bringToTop(this.blackTransparent);

        this.onShow();

        this.blackTransparent.inputEnabled = true;

        if (this.closeByTapBeside) {
            this.blackTransparent.events.onInputDown.add(this.close, this);
        }

        this.game.add.tween(this.blackTransparent).to({ alpha: 0.5 }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, instantly ? 0 : 300, 0, false);
        this.blackTransparent.inputEnabled = true;



        this.game.time.events.add(100, () => {
            this.bringToTop();
        })

        this.visible = true;


        if (instantly) {
            this.alpha = 0;
            this.game.add.tween(this).to({ alpha: 1 }, 100, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 0, 0, false);
            this.scale = new Phaser.Point(0.9, 0.9);
            if(!this.fadeTransition){
                this.game.add.tween(this.scale).to({ x: this.maxScale, y: this.maxScale }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
            }
        } else {
            // this.alpha = 0;
            // this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Exponential.Out, true, 300, 0, false);
            // this.scale = new Phaser.Point(0.9, 0.9);
            // this.game.add.tween(this.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true, 300, 0, false);
            this.scale.set(1);
            if(!this.fadeTransition){
                AnimationUtils.appear2(this.game, this, 200, 1, 1, this.maxScale);
            }
        }

        SoundUtils.panelOpen();
      

    }
    
    public close(instantly?: boolean) {
        if (this.processing) {
            return;
        }

        SoundUtils.panelClose();

        this.opened = false;

        this.processing = true;
        this.game.time.events.add(500, () => this.processing = false)

        this.onClose();

        this.inputEnabled = false;
        this.game.tweens.removeFrom(this.blackTransparent);
        this.game.tweens.removeFrom(this);
        this.game.add.tween(this.blackTransparent).to({ alpha: 0 }, instantly ? 200 : 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.add.tween(this).to({ alpha: 0 }, instantly ? 200 : 100, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, 0, 0, false);
        // this.game.add.tween(this.scale).to({ x: 0.8, y: 0.8 }, instantly ? 200 : 500, Phaser.Easing.Bounce.Out, true, 0, 0, false);

        if(!this.fadeTransition){
            this.game.add.tween(this.scale).to({ x: 0.8, y: 0.8 }, instantly ? 200 : 100, Phaser.Easing.Linear.None, true, 0, 0, false);
        }
        this.game.time.events.add(instantly ? 250 : 350, function () {
            this.sendToBack();
            this.visible = false;
            this.blackTransparent.inputEnabled = false;
        }, this);
    }

    protected onClose() { }

    protected onShow() { }

    public bringToTop(): Sprite {
        this.game.world.bringToTop(this.blackTransparent);
        return super.bringToTop();
    }
}