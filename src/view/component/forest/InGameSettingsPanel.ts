import ClosablePanel from '../panel/ClosablePanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import Label from '../panel/Label';
import SoundUtils from '../../../core/utils/SoundUtils';
import Game from '../../game/Game';
import ForestScreen from '../../screen/ForestScreen';
import BaseForestScreen from '../../screen/BaseForestScreen';
import ConfirmPanel from '../house/ConfirmPanel';
import Settings from '../../../core/service/Settings';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import { Easing } from 'phaser-ce';
import UserService from '../../../core/service/UserService';
import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class InGameSettingsPanel extends ClosablePanel {

    private settingsButton: Phaser.Button;
    public static shown:boolean;

    constructor(game: Phaser.Game, screen:BaseForestScreen, settingsButton:Phaser.Button) {
        super(game, 0, 0, true, 'settings', 1, true);
        this.game = game;
        this.settingsButton = settingsButton;
        this.inputEnabled = true;
        const supportText = LocalizationService.get(LocalizationKey.ui('settings.support'), '\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430');
        const okText = LocalizationService.get(LocalizationKey.ui('ok'), '\u041e\u043a');
        this.fixedToCamera = true;

        let closeButton = this.attachButton("settingsMain", ()=>{
            this.close();
        })
        closeButton.x = this.game.width - 98;
        closeButton.y = this.game.height - 52;
        closeButton.scale.set(1.3)
        // closeButton.alpha = 0.5;

        this.game.add.tween(closeButton).to({angle: this.settingsButton.angle - 120}, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Easing.Sinusoidal.InOut, true)
        // this.game.add.tween(closeButton).to({alpha: 1}, 300, Easing.Linear.None, true)

        let support = this.attachButton("support", ()=>{
            this.close();
            let info = new ConfirmPanel(this.game, supportText, okText, GameText.supportMessage(Settings.SUPPORT_MAIL));
            Game.getInstance().add.existing(info);
            info.show();

        })
        support.x = this.game.width - 98;
        support.y = this.game.height - 45*3 - 8;

       
        let soundButton = this.attachSprite(Game.SOUND_ENABLED ? "sound1" : "sound2")
        soundButton.inputEnabled = true;
        soundButton.events.onInputDown.add(()=>{
            console.log("sound clicked! " + Game.SOUND_ENABLED)
            if(Game.SOUND_ENABLED){
                SoundUtils.disableSound();
                // this.game.time.events.add(50, ()=>{
                    SpriteUtils.loadTexture(soundButton, "sound2")
                // })
            } else {
                SoundUtils.enableSound();
                SoundUtils.simpleCellOpen();
                // this.game.time.events.add(50, ()=>{
                    SpriteUtils.loadTexture(soundButton, "sound1")
                // })
            }
        });
        soundButton.x = this.game.width - 98;
        soundButton.y = this.game.height - 45*5- 8;


        let exit = this.attachButton("turnOff", ()=>{
            this.close();
            screen.confirmPanel.show();
        })

        exit.x = this.game.width - 98;
        exit.y = this.game.height - 45*7- 8;

        // this.applyPreset([{"spriteId":"panel","x":0,"y":0,"scaleX":0.94,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        // {"spriteId":"helperPanel","x":0,"y":-91,"scaleX":0.9199999999999999,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        // {"spriteId":"label","x":13,"y":-99,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":43},
        // {"spriteId":"okButton","x":4,"y":77,"scaleX":0.98,"scaleY":1.1600000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        // {"spriteId":"noButton","x":4,"y":192,"scaleX":0.7199999999999998,"scaleY":0.8599999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        // {"spriteId":"closeButton","x":280,"y":-222,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])

        // if (UserService.getUser().getCurrentForest() == 0) {
        //         closeButton.visible = false;
        // }

    }

    protected onShow():void{
        this.game.time.events.add(200, ()=>{
            InGameSettingsPanel.shown = true;
        })
    }

    protected onClose():void{
        this.game.add.tween(this.settingsButton).to({angle: this.settingsButton.angle + 120}, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Sinusoidal.InOut, true)
        this.game.time.events.add(200, ()=>{
            InGameSettingsPanel.shown = false;
        })
    }
}