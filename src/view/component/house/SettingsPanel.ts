import { Sound } from 'phaser-ce';
import ForestAim from '../../../core/model/forest/ForestAim';
import Settings from '../../../core/service/Settings';
import SoundUtils from '../../../core/utils/SoundUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Game from '../../game/Game';
import HouseScreen from '../../screen/HouseScreen';
import ClosablePanel from '../panel/ClosablePanel';
import InfoPanel from '../panel/InfoPanel';
import Label from '../panel/Label';
import ConfirmPanel from './ConfirmPanel';
import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';

export default class SettingsPanel extends ClosablePanel {

    private screen: HouseScreen;
    private closeButton: Phaser.Button;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number, aims: ForestAim[], level: number) {
        super(game, x, y, true, "blank");
        this.game = game;
        this.screen = screen;

        const settingsTitle = LocalizationService.get(LocalizationKey.ui('settings.title'));
        const settingsSound = LocalizationService.get(LocalizationKey.ui('settings.sound'));
        const supportText = LocalizationService.get(LocalizationKey.ui('settings.support'));
        const groupText = LocalizationService.get(LocalizationKey.ui('settings.group'));
        const aboutText = LocalizationService.get(LocalizationKey.ui('settings.about'));
        const okText = LocalizationService.get(LocalizationKey.ui('ok'));

        this.attachSprite("panel2")
        this.attachSprite("helperPanel")
        let titleBg = this.attachSprite("statusPanel")
        titleBg.tint = 0xaa5577;
        this.attachText("title", settingsTitle,  { font: "58px Bookman Old Style", fill: "#f0f1ec" })

        this.closeButton = this.attachButton("circleOrange", () => this.close())
        this.closeButton.name = "closeButton";
        this.closeButton.tint = 0xCC7777;
        let cross = SpriteUtils.createSprite(game,  0, 0, "closeButton", "cross");
        cross.anchor.set(0.5)
        cross.scale.set(1/1.34 *2)
        cross.alpha = 0.5;
        // cross.tint = 0x994444;
        cross.tint = 0x333333;
        this.closeButton.addChild(cross);
        this.addButton(this.closeButton);

        this.attachText("soundText", settingsSound, { font: "40px Arial bold", fill: "#6b2e06", wordWrap: true, wordWrapWidth: 800 })


        let soundButton = this.attachSprite("sound1")
        soundButton.inputEnabled = true;
        soundButton.events.onInputDown.add(()=>{
            if(Game.SOUND_ENABLED){
                SoundUtils.disableSound();
                SpriteUtils.loadTexture(soundButton, "sound2")
            } else {
                SoundUtils.enableSound();
                SoundUtils.simpleCellOpen();
                SpriteUtils.loadTexture(soundButton, "sound1")
            }
        })

        
        let supportButton = this.attachButton("statusPanel", ()=>{
            this.close();
            let info = new ConfirmPanel(this.game, supportText, okText, GameText.supportMessage(Settings.SUPPORT_MAIL));
            Game.getInstance().add.existing(info);
            info.show();

            // window.open("foo.html", "_blank");
            //TODO
        }, "supportButton")
        
        let supportButtonLabel = new Label(this.game, 0, -1, supportText, { font: "bold 34px Arial", fill: "#ffffff" });
        supportButtonLabel.anchor.set(0.5)
        
        supportButton.addChild(supportButtonLabel)

        let groupButton = this.attachButton("statusPanel", ()=>{
            window.open(Settings.OK_GROUP_URL, "_blank");
        }, "groupButton")
        
        let groupButtonLabel = new Label(this.game, 0, -1, groupText, { font: "bold 34px Arial", fill: "#ffffff" });
        groupButtonLabel.anchor.set(0.5)
        
        groupButton.addChild(groupButtonLabel)


        let creditsButton =  this.attachButton("statusPanel", ()=>{
            this.close();
            let info = new ConfirmPanel(this.game, aboutText, okText, Settings.MUSIC_CREDITS, ()=>{}, true);
            Game.getInstance().add.existing(info); 
            info.show();
        },"creditsButton")
        
        let creditsButtonLabel = new Label(this.game, 0, -1, aboutText, { font: "bold 30px Arial", fill: "#ffffff" });
        creditsButtonLabel.anchor.set(0.5)
        
        creditsButton.addChild(creditsButtonLabel)

        this.applyPreset([{"spriteId":"panel2","x":0,"y":-28,"scaleX":1.0200000000000002,"scaleY":1.4200000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":1.57},
        {"spriteId":"helperPanel","x":0,"y":-26,"scaleX":0.9399999999999998,"scaleY":2.0600000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"statusPanel","x":-58,"y":-381,"scaleX":1.5800000000000005,"scaleY":1.4600000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"title","x":-60,"y":-385,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":58},
        {"spriteId":"closeButton","x":236,"y":-381,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"soundText","x":-72,"y":-214,"scaleX":1.12,"scaleY":1.12,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":38},
        {"spriteId":"sound1","x":106,"y":-229,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"supportButton","x":0,"y":-108,"scaleX":1.5800000000000005,"scaleY":1.3400000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"groupButton","x":0,"y":24,"scaleX":1.5800000000000005,"scaleY":1.3400000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"creditsButton","x":0,"y":156,"scaleX":1.5800000000000005,"scaleY":1.3400000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0}])
    }

    protected onClose() {
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }


};
