import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import UserService from '../../../core/service/UserService';
import ForestUtils from '../../../core/utils/ForestUtils';
import EventUtils from '../../../core/utils/EventUtils';
import EventInfo from '../../../core/model/event/EventInfo';
import EventType from '../../../core/model/event/EventType';
import HouseScreen from './../../screen/HouseScreen';
import LocalizationService from '../../../core/localization/LocalizationService';

export default class EventPanel extends ClosablePanel {

    private actionButton:Phaser.Button;

    public static RUBIES_COUNT = 50;

    constructor(game: Phaser.Game, eventInfo: EventInfo) {
        super(game, game.width/2, game.height/2, true, "blank");

        let eventType = eventInfo.eventType;
        let header = EventUtils.getName(eventType);
        let text = EventUtils.getDesc(eventType);
        let actionName = LocalizationService.get('ui.good');

        this.visible = false;
        this.fixedToCamera = true;

        let panel = this.attachSprite('panel', 'panel');
        this.attachSprite('panel', 'panel2');
        panel.inputEnabled = true;

        let helperPanel =  this.attachSprite("helperPanel")

        let headerImage =  this.attachSprite(EventUtils.getMainImage(eventType), "headerImage")

        this.attachSprite("leshiiSign")

        this.attachSprite("leaf1")
        this.attachSprite("leaf2")
        this.attachSprite("leaf3")
        this.attachSprite("leaf4")

        this.attachSprite("leaf1", "leaf1_2")
        this.attachSprite("leaf2", "leaf2_2")
        this.attachSprite("leaf3", "leaf3_2")
        this.attachSprite("leaf4", "leaf4_2")

         this.attachSprite("titlePnl")
        this.attachSprite("statusPanel")
        let clock =  this.attachSprite("clock")

        let timeLabel = this.attachText("timeLabel", EventUtils.getRemainTime(eventInfo.eventEndAt), { font: "bold 42px Arial", fill: "#e7c593", align:"center" })
        this.game.time.events.loop(1000, ()=>{
            timeLabel.text = EventUtils.getRemainTime(eventInfo.eventEndAt);
        })

        this.attachSprite('ribbon')
        let closeButton = this.attachButton('closeButtonViolet', () => this.close())

        let label = this.attachText("levelLabel", header, { font: "46px Bookman Old Style", fill: "#ffffff" })

        let labelText = this.attachText("textLabel", text, { font: "bold 45px Arial", fill: "#804119", align:"center" })
        labelText.alpha = 0.8;

        this.actionButton = this.attachButton("pnlButton", () => {
            this.close();
        }, "actionButton");

        let continueLabel = new Label(this.game, 0, 0, actionName, { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);

        this.applyPreset([{"spriteId":"panel","x":0,"y":-5.5,"scaleX":1.04,"scaleY":0.5999999999999999,"anchorX":0.5,"anchorY":0,"rotation":0},
        {"spriteId":"panel2","x":2,"y":-165,"scaleX":0.94,"scaleY":0.98,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":260,"scaleX":1.0139999999999998,"scaleY":1.08,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"headerImage","x":0,"y":-196,"scaleX":1.5200000000000005,"scaleY":1.5600000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"leaf1","x":-320,"y":-416,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":-1.4300000000000006},
        {"spriteId":"leaf2","x":-248,"y":20,"scaleX":1.5000000000000004,"scaleY":1.5400000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":1.0800000000000007},
        {"spriteId":"leaf3","x":-323,"y":-42,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0.2700000000000001},
        {"spriteId":"leaf4","x":-316,"y":32,"scaleX":-1.6800000000000017,"scaleY":1.5600000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"leaf1_2","x":231,"y":-508,"scaleX":0.94,"scaleY":0.8799999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0.05999999999999998},
        {"spriteId":"leaf2_2","x":259,"y":-1,"scaleX":1.4600000000000004,"scaleY":1.5800000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0.4300000000000002},
        {"spriteId":"leaf3_2","x":219,"y":46,"scaleX":1.0400000000000005,"scaleY":0.9199999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":6.349999999999973},
        {"spriteId":"leaf4_2","x":323,"y":23,"scaleX":1.4200000000000004,"scaleY":1.5600000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0.03999999999999997},
        {"spriteId":"titlePnl","x":-2,"y":-501,"scaleX":1.06,"scaleY":1.7400000000000007,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"statusPanel","x":2,"y":-507,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"clock","x":-88,"y":-506,"scaleX":1.5600000000000005,"scaleY":1.4400000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":-0.2700000000000001},
        {"spriteId":"timeLabel","x":29,"y":-503,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
        {"spriteId":"ribbon","x":1,"y":125,"scaleX":1.02,"scaleY":1.2600000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":-3.469446951953614e-18},
        {"spriteId":"closeButtonViolet","x":309,"y":91,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"levelLabel","x":0,"y":98,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
        {"spriteId":"textLabel","x":2,"y":250,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
        {"spriteId":"actionButton","x":0,"y":414,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},{"spriteId":"leshiiSign","x":-276,"y":-493,"scaleX":1.2800000000000002,"scaleY":1.2400000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":-0.7600000000000005}])

    }

    protected onClose() {
        (<HouseScreen>(this.game.state.getCurrentState())).showUI();
    }

    protected onShow() {
        (<HouseScreen>(this.game.state.getCurrentState())).hideUI();
    }

};