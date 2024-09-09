import BaseForestScreen from '../../screen/BaseForestScreen';
import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import ForestUtils from './../../../core/utils/ForestUtils';
import LocationUtils from './../../../core/utils/LocationUtils';
import ForestAim from '../../../core/model/forest/ForestAim';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from '../panel/BasePanel';
import StartLevelPanel from '../house/StartLevelPanel';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
export default class LevelCompletePanel extends BasePanel {

    private screen: BaseForestScreen;
    private gemsCloud: Phaser.Sprite;

    constructor(game: Phaser.Game, screen: BaseForestScreen, x: number, y: number, aims: ForestAim[], forestType: ForestType) {
        super(game, x, y);
        this.game = game;
        this.screen = screen;

        let environment = forestType.environment;
        let level = ForestDao.indexOf(forestType);

        let background = SpriteUtils.createSprite(this.game, 0, 23, LocationUtils.getBanner(environment));
        background.anchor = new Phaser.Point(0, 0.5);
        this.addChild(background);

        let catHelper : boolean = level >= LocationUtils.CAT_FROM_LEVEL;

        let helper = SpriteUtils.createSprite(this.game, 10, background.height / 2 - 69 + (catHelper? 30:0), catHelper ? 'cat4' : 'sveta5');
        helper.anchor = new Phaser.Point(0, 1);
        // helper.scale.set(0.8)
        this.addChild(helper);

        if (UserService.getUser().getCurrentForest() >= LocationUtils.SKIP_DIALOG_BUTTON_FROM_LEVEL) {
            let hardLevelAddition = forestType.isHardLevel? StartLevelPanel.hardLevelAwardAddition : 0;
            console.log(forestType)
            let gemsCount = ForestUtils.getPrizeGemsCount(this.screen.topPanel.getStepsLeft()) + hardLevelAddition;

            this.gemsCloud = SpriteUtils.createSprite(this.game, 10, helper.y - helper.height + 80, 'gemsCloud');
            this.gemsCloud.anchor.set(0, 1);
            this.addChild(this.gemsCloud);

            let gemsLabel = new Label(this.game, 140, -135, "+" + gemsCount, { font: "bold 50px Arial", fill: "#8c2d84", wordWrap: true, wordWrapWidth: 500, align: "center" });
            this.gemsCloud.addChild(gemsLabel);
            this.gemsCloud.alpha = 0;
        }

        let label = new Label(this.game, 700, 3, ForestAim.getCompleteInfo(aims), { font: "bold 50px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, align: "center" });
        this.addChild(label);
        label.anchor = new Phaser.Point(0.5, 0.5);
        label.strokeThickness = 4;
        label.addStrokeColor("#62321c", 0);
    }

    public show(delay: number, animationTime: number, showFor: number) {
        // let deltaY = 0;
        // if (this.parent && this.parent instanceof Phaser.State) {
        //     deltaY = this.parent.camera.y;
        //     this.y += deltaY;
        // }

        let deltaY = this.screen.camera.y;

        SoundUtils.fastPanelWhooshIn()
        

        this.bringToTop();
        this.game.add.tween(this).to({ y: [this.game.height / 2 + 50 + deltaY, this.game.height / 2 + deltaY] }, animationTime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, delay, 0, false);
        this.game.time.events.add(animationTime + delay, () => {
            this.game.add.tween(this).to({ y: [this.game.height / 2 + 50 + deltaY, -220 + deltaY] }, animationTime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, showFor, 0, false);
            SoundUtils.fastPanelWhooshOut(showFor);
        }, this);

        if (this.gemsCloud) {
            this.gemsCloud.alpha = 1;
            AnimationUtils.disappear(this.game, this.gemsCloud, animationTime + delay + showFor)
            AnimationUtils.appear(this.game, this.gemsCloud, animationTime + delay)
        }
    }
}