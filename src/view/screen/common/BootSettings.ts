/// <reference path="BaseScreen.ts" />

import Settings from "../../../core/service/Settings";
import Game from "../../game/Game";
import BaseScreen from "./BaseScreen";

export default class BootSettings extends BaseScreen {

    preload() {
        this.time.desiredFps = 60;
        this.game.time.advancedTiming = true;

        // this.game.renderer.renderSession.roundPixels = true; // Округление пикселей для лучшего рендеринга

        (this.game as Game).overrideTweenMethod();
        this.loadScreenSprite("forestHouseBg")

        if (Settings.isGraphicsFromAtlases()) {
            this.loadAtlas("load", "assets/atlases/load")
        }

        this.loadImage('preloadBar', 'assets/load/loader.png');
        this.loadImage('preloadBarBg', 'assets/load/loaderBg.png');
        this.loadImage('preloadBarFooter', 'assets/load/loaderFooter.png');

        //screen settings
        // this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.trackParentInterval = 1;

        if (window.innerHeight < window.innerWidth) {
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            if (Game.isSmallDesktopForOk()) {
                let ratio = window.innerHeight / this.game.height;
                this.game.scale.setUserScale(ratio, ratio, 0, 0);
            } else {
                let ratio = Game.DESKTOP_WIDTH / this.game.width;
                this.game.scale.setUserScale(ratio, ratio, 0, 0);
            }
        }
    }

    create() {

        //  Unless you specifically need to support multitouch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            // TODO change canvas width
            //  If you have any desktop specific settings, they can go in here
            //this.stage.scale.pageAlignHorizontally = true;
        }
        else {
            //  Same goes for mobile settings.
        }

        // this.startScreen(LoadingScreen);
        this.startScreen("LoadingScreen");

    }

}
