import BaseForestScreen from '../../screen/BaseForestScreen';
import LocationUtils from './../../../core/utils/LocationUtils';
import ForestAim from '../../../core/model/forest/ForestAim';
import Label from './../../component/panel/Label';
import ClosablePanel from './../../component/panel/ClosablePanel';
import PreboosterPanel from './../house/PreboosterPanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import BubblePanel from '../dialog/BubblePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
export default class GiveUpPanel extends ClosablePanel {

    private helper: Phaser.Sprite;
    private bubblePanel: BubblePanel;
    private playButton: Phaser.Button;
    private preboosterPanel: PreboosterPanel;

    private screen: BaseForestScreen;
    private level:number;
    private closeButton:Phaser.Button;

    constructor(game: Phaser.Game, screen: BaseForestScreen, x: number, y: number, aims: ForestAim[], level: number, callbackOnClose: ()=> void, callbackOnContinue: ()=> void) {
        super(game, x, y, false, "blank");
        this.game = game;
        this.screen = screen;
        this.alpha = 0;
        this.inputEnabled = false;
        this.visible = false;
        this.level = level;

        let currentForest = screen.getForestType();
        let isHard = currentForest ? currentForest.isHardLevel : false;

        let panel = this.attachSprite('panel');
        panel.inputEnabled = true;
        let helperPanel = this.attachSprite("helperPanel")
        this.closeButton = this.attachButton('closeButton', callbackOnClose)

        // let label = this.attachText("levelLabel", "Уровень " + level, { font: "bold 45px Gilroy", fill: "#e8c38f" })
        // label.strokeThickness = 4;
        // label.addStrokeColor("#b6691b", 0);

        let label = this.attachText("levelLabel", isHard? "Сложный уровень " + level : "Уровень " + level,
             isHard? { font: "bold 45px Gilroy", fill: "#fbb7f4" } :{ font: "bold 45px Gilroy", fill: "#e8c38f" })
        label.strokeThickness = 4;
        label.addStrokeColor(isHard? "#7b037c" : "#b6691b", 0);

        // let chooseBostersLabel = this.attachText("chooseBostersLabel", "Выберите бустеры:", { font: "bold 45px Gilroy", fill: "#e8c38f" })
        // chooseBostersLabel.strokeThickness = 4;
        // chooseBostersLabel.addStrokeColor("#b6691b", 0);
        let chooseBostersLabel = this.attachText("chooseBostersLabel", "Выберите бустеры:", isHard? { font: "bold 45px Gilroy", fill: "#fbac7a" } : { font: "bold 45px Gilroy", fill: "#e8c38f" })
        // let chooseBostersLabel = this.attachText("chooseBostersLabel", "Выберите бустеры:", isHard? { font: "bold 45px Gilroy", fill: "#e39cf7" } : { font: "bold 45px Gilroy", fill: "#e8c38f" })
        chooseBostersLabel.strokeThickness = 4;
        chooseBostersLabel.addStrokeColor(isHard? "#7b037c" : "#b6691b", 0);

        let slot1 = this.attachSprite('slotOpened', 'slotOpened1')
        let slot2 = this.attachSprite('slotOpened', 'slotOpened2')
        let slot3 = this.attachSprite('slotOpened', 'slotOpened3')

        let clicked = false;
        this.playButton = this.attachButton("pnlButton", () => {
            this.playButton.inputEnabled = false; callbackOnContinue();
            AnimationUtils.jelly(this.game, this.playButton, 0, true)
        }, "playButton");

        let continueLabel = new Label(this.game, 0, 0, "ИГРАТЬ", { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.playButton.addChild(continueLabel);

        let step = 222;
        let startShift = aims.length == 1 ? 0 : (aims.length == 2 ? -108 : -220);
        aims.forEach((aim, i) => {
            let shiftX = startShift + i * step;
            let image = SpriteUtils.createSprite(this.game, shiftX, -160, aim.image);
            image.anchor = new Phaser.Point(0.5, 0.5);
            // image.scale = new Phaser.Point(2.5, 2.5);
            image.scale = new Phaser.Point(1.7, 1.7);
            this.addChild(image);

            // let statusImage = SpriteUtils.createSprite(this.game, 7 + shiftX, -160, aim.count == 0? "check":"cross");
            // this.addChild(statusImage);

            // let label = new Label(this.game, shiftX, -160 + 80, "" + aim.count, Label.WHITE_STYLE_SMALLEST);
            let label = new Label(this.game, shiftX, -160 + 115, "" + aim.count, { font: "bold 45px Gilroy", fill: "#ffffff" });
            label.anchor = new Phaser.Point(0.5, 0.5);
            this.addChild(label);
            label.strokeThickness = 4;
            label.addStrokeColor("#b6691b", 0);
        })

        let isLowHeight = this.game.height / 2 < 700;
        let normalHeightRatio = Math.max(0, Math.min(1, (this.game.height/2 - 700)/200));

        let dy = this.isHelperCat()? 30:0;

        // console.log("LOW HEIGHT: " + isLowHeight)
        // console.log("HEight: " + this.game.height)
        // console.log("normalHeightRatio: " + normalHeightRatio)

        this.helper = SpriteUtils.createSprite(this.game, -this.game.width / 2 - 600, (isLowHeight ? 700 : this.game.height / 2) + dy,
            this.isHelperCat()? "cat2" : "sveta2");
        this.helper.scale.set(isLowHeight? 1 : 1 + 0.1 * normalHeightRatio / 0.8)

        if(this.isHelperCat()){
            this.helper.scale.set(this.helper.scale.x * 1.2);
        }

        this.helper.anchor = new Phaser.Point(0, 1)
        this.helper.alpha = 0;
        this.addSprite(this.helper);

        // this.bubblePanel = new BubblePanel(this.game, -this.game.width / 2 + 200-20, -60, 'brokenHeart', 1.2);
        this.bubblePanel = new BubblePanel(this.game, -this.game.width / 2 + 200-20, -60, 'brokenHeart', isLowHeight? 1 : 1 + 0.2 * normalHeightRatio);
        this.bubblePanel.name = "bubblePanel";
        this.bubblePanel.scale.set(-1.2, 1.2);
        this.bubblePanel.angle = 50;
        this.addChild(this.bubblePanel);
       
        this.applyPreset([{ "spriteId": "panel", "x": 0, "y": 0, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "helperPanel", "x": 0, "y": -140, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "closeButton", "x": 297, "y": -310, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "levelLabel", "x": 0, "y": -308, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 },
        { "spriteId": "chooseBostersLabel", "x": 0, "y": 49, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 },
        { "spriteId": "slotOpened1", "x": -194, "y": 184, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "slotOpened2", "x": 0, "y": 181, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "slotOpened3", "x": 195, "y": 180, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "playButton", "x": 0, "y": 344, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "fastPlayButton", "x": 0, "y": 465, "scaleX": 0.7199999999999998, "scaleY": 0.8199999999999998, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])

        this.addSprite(this.preboosterPanel = new PreboosterPanel(this.game, screen, slot1.x, slot1.y))
        this.bringChildToTop(this.helper);

        if(isHard){
            let panel2 = this.attachSprite('panel', 'panelColor');
            panel2.anchor.set(panel.anchor.x, panel.anchor.y)
            panel.addChild(panel2);
            panel2.tint = 0xAA00FF;
            // panel2.tint = 0x4455FF;
            panel2.alpha = 0.7;

            helperPanel.alpha = 0.7;
            if(this.preboosterPanel){
                this.preboosterPanel.alpha = 0.85
            }

            this.playButton.tint = 0xAADDAA;

            this.closeButton.tint = 0x9900FF;
        }
    }

    private isHelperCat():boolean{
        return LocationUtils.CAT_FROM_LEVEL < this.level;
        // return true;
    }

    public show(): void {
        super.show();
        SoundUtils.looseLevel();
        this.preboosterPanel.refresh();

        let dx = this.isHelperCat()? -60:0;

        this.game.add.tween(this.helper).to({ alpha: 1, x: -this.game.width / 2 -30 + dx }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 400, 0, false);
        this.bubblePanel.show(700);
    }

    public close(): void {
        this.closeButton.inputEnabled = false;
        super.close();
        this.game.add.tween(this.helper).to({ alpha: 1, x: -this.game.width / 2 }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 400, 0, false);
        this.bubblePanel.hide();
    }
}