import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../panel/BasePanel';
import Label from '../panel/Label';
import ShopPanel from './ShopPanel';
import LifeUtils from '../../../core/utils/LifeUtils';
import LifeDetailsPanel from './LifeDetailsPanel';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class LifesPanel extends BasePanel {

    private lifesLabel: Label;
    private lifesStatus: Label;
    public startX: number;

    constructor(game: Phaser.Game, houseScreen: HouseScreen) {
        super(game, 60, 50, 'lifesPanel');
        this.startX = this.x;

        this.attachSprite('statusPanel')
        let heart = this.attachSprite('heart')
        this.game.time.events.add(10, ()=>{
            AnimationUtils.heartBeat4(this.game, heart, 300, false)
        })

        this.lifesLabel = this.attachText("lifesLabel", "" + UserService.getUser().getLifes(), { "font": "bold 48px Arial", "fill": "#ffffff" })
        this.lifesLabel.addStrokeColor("#a60107", 0)
        this.lifesLabel.strokeThickness = 4;
        this.lifesStatus = this.attachText("lifesStatus", LocalizationService.get(LocalizationKey.ui('full'), 'Все'), { "font": "bold 36px Arial ", "fill": "#d6b08b" })
        let plusButton = this.attachButton('plusButton', () => {
            if(!houseScreen.lifeDetailsShown){
                let detailsPanel = new LifeDetailsPanel(this.game, houseScreen, ()=>{houseScreen.startLevelPanel.show()});
                houseScreen.addPanel(detailsPanel);
                detailsPanel.show()
                AnimationUtils.jelly(game, plusButton, 0, true);
            }
        })
        // plusButton.visible = false;

        this.applyPreset([{ "spriteId": "statusPanel", "x": 127, "y": 20, "scaleX": 0.8399999999999999, "scaleY": 0.8999999999999999, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "heart", "x": 19, "y": 19, "scaleX": 1.0278155792126697/1.5, "scaleY": 1.0278155792126697/1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "lifesLabel", "x": 3, "y": -10, "scaleX": 1, "scaleY": 1, "anchorX": 0, "anchorY": 0, "rotation": 0, "fontSize": 45 },
        { "spriteId": "lifesStatus", "x": 111, "y": -3, "scaleX": 1, "scaleY": 1, "anchorX": 0, "anchorY": 0, "rotation": 0, "fontSize": 36 },
        // { "spriteId": "plusButton", "x": -22, "y": 61, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        {"spriteId":"plusButton","x":243,"y":19,"scaleX":0.94,"scaleY":0.96,"anchorX":0.5,"anchorY":0.5,"rotation":0}
    ])

        this.game.time.events.loop(1000, ()=>{
            this.updateLabels();
        })
    }

    private updateLabels(): void {
        let user = UserService.getUser();
        if (user.getLifes() >= LifeUtils.getLifesMaximum()) {
            this.lifesStatus.text = LocalizationService.get(LocalizationKey.ui('full'), 'Все');
        } else {
            let remain = LifeUtils.MILLIS_FOR_LIFE - (Date.now() - user.getLastRegenerationAt());
            let secondsOfRemain = Math.floor(remain / 1000 % 60);
            let minutesOfRemain = Math.floor(remain / 1000 / 60);

            let secondsText = secondsOfRemain >= 10 ? "" + secondsOfRemain : "0" + secondsOfRemain;
            let minutesText = minutesOfRemain >= 10 ? "" + minutesOfRemain : "0" + minutesOfRemain;

            this.lifesStatus.text = minutesText + ":" + secondsText;
        }
        this.lifesLabel.text = "" + user.getLifes();
    }

}
