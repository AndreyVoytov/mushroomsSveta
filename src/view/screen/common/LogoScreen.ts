import ForestScreen from './../ForestScreen';
import BaseScreen from "./BaseScreen";
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';

export default class LogoScreen extends BaseScreen {

    //TODO здесь можно показать лого, а также загрузить необходимые ресурсы для загрузочного экрана

    public static getId(): string {
        return 'logo';
    }

    background: Phaser.Sprite;
    logo: Phaser.Sprite;

    create() {

        this.background = SpriteUtils.createSprite(this.game, 0, 0, 'titlepage');
        this.game.add.existing(this.background);

        this.background.alpha = 0;

        this.logo = SpriteUtils.createSprite(this.game, this.world.centerX, -300, 'logo');
        this.game.add.existing(this.logo);
        this.logo.anchor.setTo(0.5, 0.5);

        this.add.tween(this.background).to({ alpha: 1 }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Bounce.InOut, true);
        this.add.tween(this.logo).to({ y: 320 }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Elastic.Out, true, 2000);

        this.input.onDown.addOnce(this.fadeOut, this);

    }

    fadeOut() {
        this.darken(this.background, 2000);
        var tween = this.darken(this.logo, 1700);
        this.add.tween(this.logo).to({ y: this.world.centerY + 300 }, 2000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.startGame, this);

    }

    darken(sprite: Phaser.Sprite, duration: number): Phaser.Tween {
        return this.add.tween(sprite).to({ alpha: 0 }, duration, Phaser.Easing.Linear.None, true);
    }

    startGame() {
        this.startScreen(ForestScreen);
    }

}