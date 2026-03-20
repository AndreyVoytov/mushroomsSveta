import LocationUtils from './../../../core/utils/LocationUtils';
import ForestAim from './../../../core/model/forest/ForestAim';
import ForestType from './../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import ClosablePanel from './../../component/panel/ClosablePanel';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import ForestUtils from '../../../core/utils/ForestUtils';
import { Easing } from 'phaser-ce';
import SoundUtils from '../../../core/utils/SoundUtils';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import Settings from '../../../core/service/Settings';
import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class FailPanel extends ClosablePanel {

    private forestType: ForestType;
    private helper: Phaser.Sprite;
    private playButton: Phaser.Button;

    private closeButton: Phaser.Button;

    constructor(game: Phaser.Game, forestType: ForestType, x: number, y: number, aims: ForestAim[], callbackOnClose: ()=> void, callbackOnContinue: () => void) {
        super(game, x, y, false, "blank");
        this.game = game;
        this.forestType = forestType;
        this.alpha = 0;
        this.inputEnabled = false;
        this.visible = false;

        this.helper = this.attachSprite("cat2")
        this.helper.alpha = 0;

        let panel = this.attachSprite('panel');
        panel.inputEnabled = true;
        this.attachSprite("helperPanel")
        
        let ribbon = this.attachSprite("ribbon2")
        // ribbon.tint = 0xaa99ff;
        ribbon.tint = 0xddeeff;

        this.closeButton = this.attachButton('closeButtonViolet', callbackOnClose)
        // this.closeButton.tint = 0xaa99ff;
        this.closeButton.tint = 0xddeeff;

        let label = this.attachText("levelLabel", LocalizationService.get(LocalizationKey.ui('noMovesLeft')),{ font: "46px Bookman Old Style", fill: "#ffffff" })
        // let label = this.attachText("levelLabel", "Ходы закончились!",{ font: "46px Bookman Old Style", fill: "#ffffff" })
        //Ходов не осталось vs почти получилось!

        let lightFrame = SpriteUtils.createTileSprite(this.game, 50, 50, 500, 0, "frameLight")
        lightFrame.name = "lightFrame";
        this.addSprite(lightFrame);
        
        // let label = this.attachText("levelLabel", "Ходы закончились!", { font: "bold 45px Gilroy", fill: "#e8c38f" })
        // label.strokeThickness = 4;
        // label.addStrokeColor("#b6691b", 0);

        this.playButton = this.attachButton("pnlButton", () => {
            callbackOnContinue();
            AnimationUtils.jelly(this.game, this.playButton, 0, true)
        }, "playButton");

        let plusMoves = this.attachSprite('plusSteps');

        let continueLabel = new Label(this.game, -24, 0, LocalizationService.get(LocalizationKey.ui('playFor100')), { font: "bolder 40px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.playButton.addChild(continueLabel);

        let itemsLeft = this.attachText("itemsLeft", LocalizationService.get(LocalizationKey.ui('itemsLeft')), { font: "bold 35px Arial", fill: "#a88f68", align:"center", wordWrap: true, wordWrapWidth: 400})
        let info = this.attachText("info", GameText.extraMovesInfo(ForestUtils.ADDITIONAL_STEPS_COUNT), { font: "bold 45px Arial", fill: "#78512c", align:"center", wordWrap: true, wordWrapWidth: 400})

        let gems = SpriteUtils.createSprite(this.game, this.playButton.width / 2 - 20, 0, 'gems');
        gems.anchor = new Phaser.Point(1, 0.5);
        gems.scale = new Phaser.Point(0.8 / 1.5, 0.8 / 1.5)
        this.playButton.addChild(gems);

        let step = 222;
        let startShift = aims.length == 1 ? 0 : (aims.length == 2 ? -108 : -220);
        console.log("aims count: " + aims.length)
        aims.forEach((aim, i) => {
            console.log("aim type: " + aim.image)
            let shiftX = startShift + i * step;
            let image = SpriteUtils.createSprite(this.game, shiftX, -160 + 30, aim.image);
            image.anchor = new Phaser.Point(0.5, 0.5);
            // image.scale = new Phaser.Point(2.5, 2.5);
            image.scale = new Phaser.Point(1.7, 1.7);
            this.addChild(image);

            let statusImage = SpriteUtils.createSprite(this.game, 7 + shiftX, -160+ 30, aim.countLeft <= 0 ? "check" : "cross");
            statusImage.scale.set(1.5 * (aim.countLeft <= 0 ? 0.5 : 1))
            this.addChild(statusImage);
            statusImage.visible = aim.countLeft <= 0;

            // console.log("aim.count: " + aim.count)
            // let label = new Label(this.game, shiftX, -160 + 115, "" + (aim.startCount - aim.count) + "/" + aim.startCount, { font: "bold 45px Gilroy", fill: "#ffffff" });
            // label.anchor = new Phaser.Point(0.5, 0.5);
            // this.addChild(label);
            // label.strokeThickness = 4;
            // label.addStrokeColor("#b6691b", 0);
            console.log("aim.count: " + aim.countLeft)
            let label = new Label(this.game, shiftX + 40, -160 + 50+ 30, "" + aim.countLeft, { font: "bold 50px Gilroy", fill: "#ffffff" });
            label.anchor = new Phaser.Point(0.5, 0.5);
            this.addChild(label);
            label.strokeThickness = 4;
            // label.addStrokeColor("#b6691b", 0);
            label.addStrokeColor("#78512c", 0);
            label.visible = aim.countLeft > 0;
        })

        // this.applyPreset([{ "spriteId": "panel", "x": 0, "y": 0, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "helperPanel", "x": 0, "y": -140, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "closeButton", "x": 297, "y": -310, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "levelLabel", "x": 0, "y": -308, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 },
        // { "spriteId": "chooseBostersLabel", "x": 0, "y": 49, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 },
        // { "spriteId": "slotOpened1", "x": -194, "y": 184, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "slotOpened2", "x": 0, "y": 181, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "slotOpened3", "x": 195, "y": 180, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "playButton", "x": 0, "y": 344, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "fastPlayButton", "x": 0, "y": 465, "scaleX": 0.7199999999999998, "scaleY": 0.8199999999999998, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "cat2", "x": 23, "y": -270, "scaleX": 1.0599999999999996 / 0.8, "scaleY": 1.0599999999999996 / 0.8, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])
        this.applyPreset([{"spriteId":"cat2","x":23,"y":-270,"scaleX":1.3249999999999995,"scaleY":1.3249999999999995,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"panel","x":0,"y":-21,"scaleX":1,"scaleY":0.9199999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":-140,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"ribbon2","x":16.413793103448256,"y":-321.6064049586777,"scaleX":2.4000000000000012,"scaleY":2.100000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButtonViolet","x":284,"y":-341,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"levelLabel","x":7,"y":-333,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
        {"spriteId":"lightFrame","x":-345.58620689655174,"y":-16.23966942148752,"scaleX":1.3800000000000003,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
        {"spriteId":"playButton","x":0,"y":282,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"plusSteps","x":-226.75862068965512,"y":115.91942148760347,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"info","x":94.34482758620686-10,"y":117.57541322314057,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
        {"spriteId":"itemsLeft","x":0,"y":-240,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35}

        ])
    }

    public show(): void {
        super.show();

        SoundUtils.noStepsLeft()

        if (ForestDao.indexOf(this.forestType) > LocationUtils.CAT_FROM_LEVEL) {
            this.game.add.tween(this.helper).to({ alpha: 1, y: - 400 }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 800, 0, false);
        }
    }

    public close(): void {
        this.closeButton.inputEnabled = false;
        super.close();

        this.hideHelper();
    }
    
    public hideHelper():void{
        if (this.helper.alpha != 0) {
            this.game.add.tween(this.helper).to({ alpha: 0, y: - 250 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 150, 0, false);
        }
    }
}
