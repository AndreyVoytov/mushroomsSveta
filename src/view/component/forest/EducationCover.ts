import BasePanel from '../../component/panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class EducationCover extends BasePanel {

    private cover: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number, width: number, height: number) {
        super(game, 0, 0);
        this.game = game;
        this.alpha = 0;

        let graphics = new Phaser.Graphics(this.game, 0, 0);

        let k = 1;

        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, this.game.width, y - height);
        graphics.drawRect(0, y + height, this.game.width, this.game.height - (y + height));

        graphics.endFill();
        for (let i = 0; i < 15; i++) {
            graphics.lineStyle(height / 3 * k, 0x000000, 1);
            graphics.drawEllipse(x, y, width * k, height * k);
            k *= 1.1;
        }

        this.cover = new Phaser.Sprite(this.game, this.game.width / 2, this.game.height-500, graphics.generateTexture());
        this.cover.anchor = new Phaser.Point(0.5, 1);
        this.cover.y += 500;
        this.cover.inputEnabled = true;
        this.addSprite(this.cover);

        graphics.destroy();
     
    }

    show(delay: number) {
        this.game.add.tween(this).to({ alpha: 0.5 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
    }

    hide(delay: number) {
        this.cover.inputEnabled = false;
        this.game.add.tween(this).to({ alpha: 0 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.time.events.add(300, ()=>{
            this.visible = false;
            this.kill();
        })
    }

}