import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import LocationUtils from './../../../core/utils/LocationUtils';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import ForestAim from '../../../core/model/forest/ForestAim';
import Label from './../../component/panel/Label';
import ForestScreen from './../../screen/ForestScreen';
import HouseScreen from './../../screen/HouseScreen';
import ClosablePanel from './../panel/ClosablePanel';
import TreesTransitionPanel from './../panel/TreesTransitionPanel';
import PreboosterPanel from './PreboosterPanel';
import Utils from '../../../core/utils/Utils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BoosterType from '../../../core/model/enum/BoosterType';
import AdminService from '../../../core/service/AdminService';
import ForestDao from '../../../core/dao/ForestDao';
import { Sprite } from 'phaser-ce';
import SoundUtils from '../../../core/utils/SoundUtils';
import ForestUtils from './../../../core/utils/ForestUtils';
import EventUtils from './../../../core/utils/EventUtils';
import EventType from '../../../core/model/event/EventType';
import GameText from '../../../core/localization/GameText';

export default class StartLevelPanel extends ClosablePanel {
    public static hardLevelAwardAddition = 25;
    public static PREBOOSTERS_TO_SPEND:BoosterType[] = [];

    private hardLevelPrizeInfo: Sprite;
    private bushes:Phaser.Sprite[] = [];

    private screen: HouseScreen;
    private playButton: Phaser.Button;
    private header: Phaser.Sprite;
    private headerText: Label;

    private preboosterPanel: PreboosterPanel;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number, aims: ForestAim[], level: number) {
        super(game, x, y, true, "blank");
        this.game = game;
        this.screen = screen;

        StartLevelPanel.PREBOOSTERS_TO_SPEND = [];

        let showBoosters = UserService.getUser().getCurrentForest() > PreboosterPanel.LEVEL_WITH_PRIZE_COMPASSES;

        let currentForest = ForestDao.getForestType(UserService.getUser().getCurrentForest());
        let isHard = currentForest ? currentForest.hardLevel : false;

        let panel = this.attachSprite(showBoosters? 'panel' : 'panel2', 'panel');
        panel.inputEnabled = true;

        let helperPanel = this.attachSprite("helperPanel")

        let user = UserService.getUser()
        if (user.getCurrentForest() > LocationUtils.DIARY_AFTER_LEVEL) {
            let currentTask = DiaryConfiguration.getCurrentRecipe(UserService.getUser().getCurrentForest());
            this.header = this.attachSprite(currentTask.mapPreset ? 'forestHeader' : 'potionHeader', "header");
            this.attachSprite('ribbon')
            this.headerText = new Label(this.game, 0, 0, currentTask.titleForProgress || currentTask.title, { font: "46px Bookman Old Style", fill: "#ffffff" })
            this.headerText.name = "taskText";
            this.addSprite(this.headerText);
            this.attachButton('closeButtonViolet', () => this.close())
        } else {
            this.attachButton('closeButton', () => this.close())
        }

        let label = this.attachText("levelLabel", GameText.level(level, isHard),
             isHard? { font: "bold 45px Gilroy", fill: "#fbb7f4" } :{ font: "bold 45px Gilroy", fill: "#e8c38f" })
        label.strokeThickness = 4;
        label.addStrokeColor(isHard? "#7b037c" : "#b6691b", 0);

        


        this.playButton = this.attachButton("pnlButton", () => this.startLevel(), "playButton");

        let continueLabel = new Label(this.game, 0, 0, "ИГРАТЬ", { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.playButton.addChild(continueLabel);

        let fastPlayButton;
        if (AdminService.isEditMode()) {
            fastPlayButton = this.attachButton("pnlButton", () => this.startLevelFast(), "fastPlayButton");

            let fastPlayLabel = new Label(this.game, 0, 0, "Пройти быстро", Label.COMMON_MEDIUM_STYLE);
            fastPlayLabel.name = 'fastPlayLabel'
            fastPlayLabel.anchor = new Phaser.Point(0.5, 0.5);
            fastPlayButton.addChild(fastPlayLabel);
        }

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
            let label = new Label(this.game, shiftX, -160 + 115, "" + aim.countLeft, { font: "bold 45px Gilroy", fill: "#ffffff" });
            label.anchor = new Phaser.Point(0.5, 0.5);
            this.addChild(label);
            label.strokeThickness = 4;
            label.addStrokeColor("#b6691b", 0);
        })

        this.applyPreset([{ "spriteId": "panel", "x": 0, "y": -765/2, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0 },
        { "spriteId": "helperPanel", "x": 0, "y": -140, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "header", "x": 0, "y": -521, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "ribbon", "x": 0, "y": -350, "scaleX": 1, "scaleY": 1.08, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "taskText", "x": 0, "y": -398, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 48 },
        { "spriteId": "closeButtonViolet", "x": 317, "y": -377, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "closeButton", "x": 294, "y": -312, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "levelLabel", "x": 0, "y": -308, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 },
       
        { "spriteId": "playButton", "x": 0, "y": 344, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "fastPlayButton", "x": 0, "y": 474, "scaleX": 0.8, "scaleY": 0.8, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])

        this.playButton.y -= showBoosters?0:233;
        if(fastPlayButton) fastPlayButton.y -= showBoosters?0:233;

        if (user.getCurrentForest() > LocationUtils.DIARY_AFTER_LEVEL) {
            this.applyPreset([{ "spriteId": "panel", "x": 0, "y": -36 -765*1.1/2, "scaleX": 1, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0, "rotation": 0 }]);
            this.y += 100;
        }

        if (showBoosters) {
            this.addSprite(this.preboosterPanel = new PreboosterPanel(this.game, screen, -194, 184))

            let chooseBostersLabel = this.attachText("chooseBostersLabel", GameText.chooseBoosters(), isHard? { font: "bold 45px Gilroy", fill: "#fbac7a" } : { font: "bold 45px Gilroy", fill: "#e8c38f" })
            // let chooseBostersLabel = this.attachText("chooseBostersLabel", "Выберите бустеры:", isHard? { font: "bold 45px Gilroy", fill: "#e39cf7" } : { font: "bold 45px Gilroy", fill: "#e8c38f" })
            chooseBostersLabel.strokeThickness = 4;
            chooseBostersLabel.addStrokeColor(isHard? "#7b037c" : "#b6691b", 0);

            Utils.applyPreset(chooseBostersLabel, { "spriteId": "chooseBostersLabel", "x": 0, "y": 49, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 });
        }

        if(isHard){
            let panel2 = this.attachSprite(showBoosters? 'panel' : 'panel2', 'panelColor');
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

            let pnl = this.attachSprite("circleBoosterBlue")
            pnl.tint =  0xFF55FF;
            let gms = this.attachSprite("gems")
            let x2 = this.attachText("x2", "+" + StartLevelPanel.hardLevelAwardAddition, {font: "bold 45px Gilroy", fill: "#ffffff" })      
            this.applyPreset([{"spriteId":"circleBoosterBlue","x":374.51724137931024,"y":-225.27995867768595,"scaleX":3.040000000000002/2,"scaleY":3.040000000000002/2,"anchorX":0.5,"anchorY":0.5,"rotation":4.569999999999947},
            {"spriteId":"gems","x":371.96551724137896,"y":-261.3026859504133,"scaleX":1.12/3,"scaleY":1.12/3,"anchorX":0.5,"anchorY":0.5,"rotation":-4.57},
            {"spriteId":"x2","x":373.7931034482755,"y":-186.7190082644629,"scaleX":3/4,"scaleY":3/4,"anchorX":0.5,"anchorY":0.5,"rotation":-4.57,"fontSize":45}
            ])

            pnl.addChild(gms)
            pnl.addChild(x2)
            gms.x=+12;
            gms.y=2;

            x2.x=-14;
            x2.y=-2;
            // gms.x -= pnl.x
            // gms.y -= pnl.y
            // gms.x/=4;
            // gms.y/=4;
            // x2.x -= pnl.x
            // x2.y -= pnl.y
            // x2.x/=4
            // x2.y/=4
            this.hardLevelPrizeInfo = pnl;

            this.bushes.push(this.attachSprite("bushes", "bushes1"))
            this.bushes.push(this.attachSprite("bushes", "bushes2"))
            this.bushes.push(this.attachSprite("bushes", "bushes3"))
            this.bushes.push(this.attachSprite("bushes", "bushes4"))
            this.bushes.push(this.attachSprite("bushes2", "bushes5"))
            this.bushes.push(this.attachSprite("bushes2", "bushes6"))

            this.applyPreset([
            {"spriteId":"bushes3","x":379.655172413793,"y":-(this.game.height - 1600)/2-934.4514462809918,"scaleX":1.4800000000000004/1.5,"scaleY":1.4600000000000004/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":1.7900000000000011},
            {"spriteId":"bushes4","x":-298.8965517241379,"y":-(this.game.height - 1600)/2-845.2128099173553,"scaleX":1.5200000000000005/1.5,"scaleY":-1.7800000000000018/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":1.5300000000000011},
            {"spriteId":"bushes5","x":472,"y":-(this.game.height - 1600)/2-440,"scaleX":-1.5600000000000016,"scaleY":1.4600000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            
            {"spriteId":"bushes2","x":292.03448275862064,"y":(this.game.height - 1600)/2 + 678.845041322314,"scaleX":1.6400000000000006/1.5,"scaleY":-1.6400000000000017/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":-1.480000000000001},
            {"spriteId":"bushes1","x":-365,"y":(this.game.height - 1600)/2 +733,"scaleX":1.5200000000000005/1.5,"scaleY":1.4200000000000004/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":-1.370000000000001},
            {"spriteId":"bushes6","x":-452,"y":(this.game.height - 1600)/2 +39,"scaleX":1.4400000000000004,"scaleY":1.4000000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":-0.5600000000000003}])
            
                // this.playButton.addChild(pnl)
                // this.playButton.addChild(gms)
                // this.playButton.addChild(x2)

                // let dx = -274 + 220;
                // let dy = 225;
                // pnl.x+= dx;gms.x+=dx;x2.x+=dx;
                // pnl.y+= dy;gms.y+=dy;x2.y+=dy;
        }

        let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
        if(eventInfo){
            let c1 = this.attachSprite("circleViolet")
            let c2 = this.attachSprite("circleViolet", "circleViolet2")
            let c3 = this.attachSprite("circleViolet", "circleViolet3")

            let compass = this.attachSprite("compass")
            let rocket1 = this.attachSprite("rocket1")
            let plusSteps = this.attachSprite("steps")

            let lukoshko = this.attachSprite("lukoshkoIcon");

            let user = UserService.getUser();
            let winsInRow = user.getWinsInRow() || 0;
            if(winsInRow < 3){
                c2.visible = false;
                compass.visible = false;
            }
            if(winsInRow < 2){
                c1.visible = false;
                plusSteps.visible = false;
            }
            if(winsInRow < 1){
                c3.visible = false;
                rocket1.visible = false;
            }

            this.applyPreset([{"spriteId":"circleViolet","x":-254,"y":-42 + 97,"scaleX":0.8*1.1,"scaleY":0.8*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"circleViolet2","x":-409,"y":-41+ 97,"scaleX":0.8*1.1,"scaleY":0.8*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":0.5300000000000002},
            {"spriteId":"circleViolet3","x":-332,"y":-11+ 97,"scaleX":0.8*1.1,"scaleY":0.8*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":0.08999999999999991},
            {"spriteId":"compass","x":-411,"y":-39+ 97,"scaleX":0.7*1.1,"scaleY":0.7*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"rocket1","x":-332 ,"y":-9+ 97 ,"scaleX":0.6399999999999999*1.1,"scaleY":0.6199999999999999*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":-0.6600000000000005},
            {"spriteId":"steps","x":-254,"y":-44+ 97,"scaleX":0.7*1.1,"scaleY":0.7*1.1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"lukoshkoIcon","x":-334,"y":-141+ 97,"scaleX":1.1400000000000001,"scaleY":1.2800000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":0}]);

            this.onShowAdditionalAnimation = () => {
                let delta = -400;

                AnimationUtils.appear3(this.game, lukoshko, 1000 + delta);

                AnimationUtils.appear3(this.game, c3, 1300 + delta)
                AnimationUtils.appear3(this.game, rocket1, 1300 + delta)
                AnimationUtils.appear3(this.game, c1, 1600 + delta)
                AnimationUtils.appear3(this.game, plusSteps, 1600 + delta)
                AnimationUtils.appear3(this.game, c2, 1900 + delta)
                AnimationUtils.appear3(this.game, compass, 1900 + delta)
            }
        };
    }

    private onShowAdditionalAnimation: ()=> void = null;

    public startLevel() {
        this.playButton.inputEnabled = false;
        AnimationUtils.jelly(this.game, this.playButton, 0, true);
        let time = 500;
        let trees = new TreesTransitionPanel(this.game, true, time, 0);
        trees.fixedToCamera = true;
        this.screen.add.existing(trees);
        this.game.time.events.add(time * 2, () => {
            let user = UserService.getUser();
            user.spendLife();
            AnalyticUtils.logLevelStart()
            this.screen.startScreen(ForestScreen, true, false);
        }, this)
    }
    public startLevelFast() {
        let time = 500;
        let trees = new TreesTransitionPanel(this.game, true, time, 0);
        trees.fixedToCamera = true;
        this.screen.add.existing(trees);
        ForestScreen.skipNextTime = true;
        this.game.time.events.add(time*2, function () {
            UserService.getUser().spendLife();
            this.screen.startScreen(ForestScreen, true, false);
        }, this)
    }

    protected onClose() {
        this.bushes.forEach(b => {
            AnimationUtils.fadeOut(this.game, b, 0)
            // AnimationUtils.disappear(this.game, b, 0)
        })
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }

    public show() {
        if(this.preboosterPanel){
            this.preboosterPanel.refresh();
        }
        if (this.header) {
            let currentTask = DiaryConfiguration.getCurrentRecipe(UserService.getUser().getCurrentForest());
            if (currentTask) {
                let texture = currentTask.mapPreset ? 'forestHeader' : 'potionHeader';
                this.header.loadTexture(SpriteUtils.key(texture), SpriteUtils.frame(texture));
                if (this.headerText) {
                    this.headerText.text = currentTask.titleForProgress || currentTask.title;
                }
            }
        }

        if(this.hardLevelPrizeInfo){
            AnimationUtils.appear3(this.game, this.hardLevelPrizeInfo, 500)

            this.bushes.forEach(b => {
                b.alpha = 1;
                AnimationUtils.appear3(this.game, b, 500)
            })
        }

        if(this.onShowAdditionalAnimation) this.onShowAdditionalAnimation();
        super.show();
    }

};