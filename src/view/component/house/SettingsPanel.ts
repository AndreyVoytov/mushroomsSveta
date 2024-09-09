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

export default class SettingsPanel extends ClosablePanel {

    private screen: HouseScreen;
    private closeButton: Phaser.Button;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number, aims: ForestAim[], level: number) {
        super(game, x, y, true, "blank");
        this.game = game;
        this.screen = screen;

        this.attachSprite("panel2")
        this.attachSprite("helperPanel")
        let titleBg = this.attachSprite("statusPanel")
        titleBg.tint = 0xaa5577;
        this.attachText("title", "Настройки",  { font: "58px Bookman Old Style", fill: "#f0f1ec" })

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

        this.attachText("soundText", "Звук:", { font: "40px Arial bold", fill: "#6b2e06", wordWrap: true, wordWrapWidth: 800 })


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
            let info = new ConfirmPanel(this.game, "Поддержка", "Ок", "Пожалуйста, сообщайте об \n ошибках в игре на почту \n ~" + Settings.SUPPORT_MAIL + "~");
            Game.getInstance().add.existing(info);
            info.show();

            // window.open("foo.html", "_blank");
            //TODO
        }, "supportButton")
        
        let supportButtonLabel = new Label(this.game, 0,0, "Поддержка");
        supportButtonLabel.anchor.set(0.5)
        
        supportButton.addChild(supportButtonLabel)

        let groupButton = this.attachButton("statusPanel", ()=>{
            window.open(Settings.OK_GROUP_URL, "_blank");
        }, "groupButton")
        
        let groupButtonLabel = new Label(this.game, 0,0, "Группа");
        groupButtonLabel.anchor.set(0.5)
        
        groupButton.addChild(groupButtonLabel)


        let creditsButton =  this.attachButton("statusPanel", ()=>{
            this.close();
            let info = new ConfirmPanel(this.game, "Об игре", "Ок", Settings.MUSIC_CREDITS, ()=>{}, true);
            Game.getInstance().add.existing(info); 
            info.show();
        },"creditsButton")
        
        let creditsButtonLabel = new Label(this.game, 0,0, "Об игре");
        creditsButtonLabel.anchor.set(0.5)
        
        creditsButton.addChild(creditsButtonLabel)

        this.applyPreset([{"spriteId":"panel2","x":0,"y":-25,"scaleX":0.8999999999999999,"scaleY":1.2400000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":1.57},
        {"spriteId":"helperPanel","x":0,"y":-24,"scaleX":0.8199999999999998,"scaleY":1.7800000000000007,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"statusPanel","x":-52,"y":-339,"scaleX":1.4600000000000004,"scaleY":1.4000000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"title","x":-53,"y":-343,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":58},
        {"spriteId":"closeButton","x":204,"y":-341,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"soundText","x":-81,"y":-187,"scaleX":1.3,"scaleY":1.3,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40},
        {"spriteId":"sound1","x":80,"y":-205,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"supportButton","x":0,"y":-92,"scaleX":1.4000000000000004,"scaleY":1.4200000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"groupButton","x":0,"y":20,"scaleX":1.400000000000003,"scaleY":1.4200000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"creditsButton","x":0,"y":132.0619834710743,"scaleX":1.400000000000003,"scaleY":1.4200000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0}])
    }

    protected onClose() {
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }


};