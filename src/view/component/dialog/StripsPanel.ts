import DialogScreen from '../../screen/common/DialogScreen';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../panel/BasePanel';
import DialogPanel from './DialogPanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class StripsPanel extends BasePanel {

    private stripTop: Phaser.Graphics;
    private stripBottom: Phaser.Graphics;

    private screen: DialogScreen;

    public static BOTTOM_STRIP_HEIGHT = 215 + DialogPanel.BOTTOM_PADDING;
    private TOP_STRIP_HEIGHT = 215;
    public static SHOW_DURATION = 500;

    constructor(game: Phaser.Game, screen: DialogScreen) {
        super(game, 0, 0);
        this.game = game;
        this.screen = screen;

        // this.fixedToCamera = true;

        let stripsHolder = SpriteUtils.createSprite(this.game, 0, 0, 'blank');
        // stripsHolder.fixedToCamera = true;
        this.addChild(stripsHolder);

        this.stripTop = new Phaser.Graphics(this.game, 0, 0);
        this.stripTop.beginFill(0x000000, 1);
        this.stripTop.drawRect(0, 0, this.game.width, this.TOP_STRIP_HEIGHT);
        this.stripTop.endFill();
        this.stripTop.alpha = 1;
        // this.stripTop.fixedToCamera = true;
        stripsHolder.addChild(this.stripTop);
        this.stripTop.y = -this.TOP_STRIP_HEIGHT;

        this.stripBottom = new Phaser.Graphics(this.game, 0, 0);
        this.stripBottom.beginFill(0x000000, 1);
        this.stripBottom.drawRect(0, 0, this.game.width, StripsPanel.BOTTOM_STRIP_HEIGHT);
        this.stripBottom.endFill();
        this.stripBottom.alpha = 1;
        // this.stripBottom.fixedToCamera = true;
        stripsHolder.addChild(this.stripBottom);
        this.stripBottom.y = this.game.height;
    }

    isActive(): boolean {
        return this.stripTop.y == 0;
    }

    showStrips(delay: number) {
        if (this.screen instanceof HouseScreen) {
            this.screen.hideUI();
        }
        this.game.world.bringToTop(this.stripTop);
        this.game.world.bringToTop(this.stripBottom);
        console.log("STRIPS TO TOP")
        // this.game.kineticScrolling.stop();
        if (this.stripTop.y == 0) {
            return;
        }
        console.log("SHOW STRIPS!")
        this.game.add.tween(this.stripTop).to({ y: 0 }, StripsPanel.SHOW_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.add.tween(this.stripBottom).to({ y: this.game.height - StripsPanel.BOTTOM_STRIP_HEIGHT }, StripsPanel.SHOW_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
    }

    hideStrips(delay: number) {
        if (this.screen instanceof HouseScreen) {
            this.game.time.events.add(StripsPanel.SHOW_DURATION + delay, () => (<HouseScreen>this.screen).showUI())
        }
        console.log("HIDE STRIPS!")
        this.game.add.tween(this.stripTop).to({ y: -this.TOP_STRIP_HEIGHT }, StripsPanel.SHOW_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.add.tween(this.stripBottom).to({ y: this.game.height }, StripsPanel.SHOW_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, delay, 0, false);
    }

}