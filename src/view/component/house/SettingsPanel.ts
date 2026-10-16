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
import UiLayout from '../../../core/utils/UiLayout';

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
        const aboutDescription = LocalizationService.get(LocalizationKey.ui('settings.aboutText'));
        const okText = LocalizationService.get(LocalizationKey.ui('ok'));

        const board = this.attachSprite('uiSettingsBoard', 'settingsBoard');
        board.width = 720;board.height = 840;board.inputEnabled = true;
        const title = this.attachText('title', settingsTitle, {font:'48px Lora', fill:Label.ON_DARK});
        title.position.set(0, -311);UiLayout.fit(title, 470, 62);

        this.closeButton = this.attachButton("closeButton", () => this.close())
        this.closeButton.name = "closeButton";
        this.addButton(this.closeButton);

        const soundText = this.attachText('soundText', settingsSound, {font:'36px Manrope', fill:Label.INK});
        soundText.position.set(-88, -161);UiLayout.fit(soundText, 310, 58);


        let soundButton = this.attachSprite(Game.SOUND_ENABLED ? "sound1" : "sound2")
        soundButton.position.set(178, -161);soundButton.width = soundButton.height = 90;
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

        
        let supportButton = this.attachButton("uiSecondaryControl", ()=>{
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

        let groupButton = this.attachButton("uiSecondaryControl", ()=>{
            window.open(Settings.OK_GROUP_URL, "_blank");
        }, "groupButton")
        
        let groupButtonLabel = new Label(this.game, 0, -1, groupText, { font: "bold 34px Arial", fill: "#ffffff" });
        groupButtonLabel.anchor.set(0.5)
        
        groupButton.addChild(groupButtonLabel)


        let creditsButton =  this.attachButton("uiSecondaryControl", ()=>{
            this.close();
            let info = new ConfirmPanel(this.game, aboutText, okText, aboutDescription, ()=>{}, true);
            Game.getInstance().add.existing(info); 
            info.show();
        },"creditsButton")
        
        let creditsButtonLabel = new Label(this.game, 0, -1, aboutText, { font: "bold 30px Arial", fill: "#ffffff" });
        creditsButtonLabel.anchor.set(0.5)
        
        creditsButton.addChild(creditsButtonLabel)

        this.closeButton.position.set(286, -292);this.closeButton.width = this.closeButton.height = 64;
        [supportButton, groupButton, creditsButton].forEach((button, i) => {
            button.position.set(0, -12 + i * 120);button.width = 490;button.height = 98;
        });
        [supportButtonLabel, groupButtonLabel, creditsButtonLabel].forEach(label => {
            label.fontSize = 36;label.fill = Label.INK;UiLayout.fit(label, 340, 55);
        });
    }

    protected onClose() {
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }


};
