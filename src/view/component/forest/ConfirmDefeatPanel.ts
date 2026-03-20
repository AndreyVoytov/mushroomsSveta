import ClosablePanel from '../panel/ClosablePanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import Label from '../panel/Label';
import InGameSettingsPanel from './InGameSettingsPanel';
import ForestUtils from './../../../core/utils/ForestUtils';
import UserService from './../../../core/service/UserService';
import EventUtils from './../../../core/utils/EventUtils';
import EventType from '../../../core/model/event/EventType';
import LocalizationService from '../../../core/localization/LocalizationService';
export default class ConfirmDefeatPanel extends ClosablePanel {

    constructor(game: Phaser.Game, x: number, y: number, okCallback: () => void) {
        super(game, x, y, false, "confirmPanel");
        this.game = game;
        this.inputEnabled = true;
        this.fixedToCamera = true;

        this.attachSprite("panel")
        let textBg = this.attachSprite("helperPanel")
        textBg.alpha = 0.8;

        let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
        let user = UserService.getUser();
        
        if(eventInfo && user.getWinsInRow() > 0){
            this.attachText("label", LocalizationService.get('ui.confirmDefeat.withBonus'), { /*font: "50px Arial", fill: "#572424"*/  font: "bold 41px Arial", fill: "#804119", wordWrap: true, wordWrapWidth: 530, align: "center"})
        } else {
            this.attachText("label", LocalizationService.get('ui.confirmDefeat.default'), { /*font: "50px Arial", fill: "#572424"*/  font: "bold 43px Arial", fill: "#804119", wordWrap: true, wordWrapWidth: 500, align: "center"})
        }

        let clicked = false;

        let okButton = this.attachButton("pnlButton", () => {
            if(!clicked){
                clicked = true;
                AnimationUtils.jelly(this.game, okButton);
                okCallback();
            }
        }, "okButton")
        let okLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.surrender'), { font: "bolder 40px Gilroy", fill: "#f0f1ec" });
        okLabel.anchor.set(0.5)
        okLabel.scale.set(1.2, 1)
        okButton.addChild(okLabel)
        okButton.tint = 0xff0000;
        okLabel.strokeThickness = 4;
        okLabel.addStrokeColor('#b72b2b', 0);

        let noButton = this.attachButton("pnlButton", () => {
            AnimationUtils.jelly(this.game, noButton);
            this.close();
        }, "noButton")
        let noLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.backUpper'), { font: "bolder 35px Gilroy", fill: "#f0f1ec" });
        noLabel.scale.set(1.2 * 1.2, 1 * 1.2)
        noLabel.anchor.set(0.5)
        noButton.addChild(noLabel)
        noLabel.strokeThickness = 4;
        noLabel.addStrokeColor('#61b019', 0);

        this.attachButton("closeButton", () => {
            this.close();
        })

        this.alpha = 0;

        this.applyPreset([{"spriteId":"panel","x":0,"y":0,"scaleX":0.94,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":-91,"scaleX":0.9199999999999999,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"label","x":13,"y":-99,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":43},
        {"spriteId":"okButton","x":4,"y":77,"scaleX":0.98,"scaleY":1.1600000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"noButton","x":4,"y":192,"scaleX":0.7199999999999998,"scaleY":0.8599999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButton","x":280,"y":-222,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])

    }

    protected onClose():void{
        this.game.time.events.add(200, ()=>{
            InGameSettingsPanel.shown = false;
        })
    }
    
    protected onShow():void{
        this.game.time.events.add(210, ()=>{
            InGameSettingsPanel.shown = true;
        })
        
    }

}