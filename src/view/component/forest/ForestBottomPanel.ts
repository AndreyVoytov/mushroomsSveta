import BaseForestScreen from '../../screen/BaseForestScreen';
import UserService from '../../../core/service/UserService';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import BoostersProvider from '../../../core/service/provider/BoosterProvider';
import BasePanel from '../../component/panel/BasePanel';
import PreboosterPanel from './../house/PreboosterPanel';
import ShopPanel from './../house/ShopPanel';
import InGameSettingsPanel from './InGameSettingsPanel';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BoosterType from '../../../core/model/enum/BoosterType';
import InGameBoostersPanel from '../house/InGameBoostersPanel';
import ForestScreen from '../../screen/ForestScreen';
import { Easing } from 'phaser-ce';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class ForestBottomPanel extends BasePanel {
    private bottomPanel: Phaser.Sprite;
    private boosterpanel:InGameBoostersPanel;
    public settingsPanel:InGameSettingsPanel;

    constructor(game: Phaser.Game, forestType: ForestType, screen: BaseForestScreen) {
        super(game, 0, 0, "blank");
        this.game = game;

        this.bottomPanel = SpriteUtils.createSprite(this.game, this.game.width / 2, this.game.height, 'topPanel');
        this.bottomPanel.anchor = new Phaser.Point(0.5, 0);
        this.bottomPanel.scale = new Phaser.Point(1, -1);
        this.addSprite(this.bottomPanel);

        // if (UserService.getUser().getCurrentForest() > PreboosterPanel.LEVEL_WITH_PRIZE_COMPASSES) {
        this.addSprite(this.boosterpanel = new InGameBoostersPanel(game, <ForestScreen>screen));

        let forestsTotal = ForestDao.getAllForests().length;
        let currentForest = Math.min(ForestDao.indexOf(forestType) + 1, forestsTotal);
        let levelLabel = new Label(this.game, 155, this.game.height + 3 , "" + currentForest, { font: "bold 45px Arial", fill: "#fff5bc"});
        levelLabel.strokeThickness = 4;
        levelLabel.addStrokeColor("#924d1d", 0);
        levelLabel.anchor = new Phaser.Point(0.5, 1);
        this.addSprite(levelLabel);
        let levelLabel2 = new Label(this.game, 80, this.game.height - 50, LocalizationService.get(LocalizationKey.ui('levelLower'), 'уровень'), { font: "bold 35px Arial", fill: "#fff0ab"});
        levelLabel2.anchor = new Phaser.Point(0, 1);
        levelLabel2.strokeThickness = 4;
        levelLabel2.addStrokeColor("#924d1d", 0);
        this.addSprite(levelLabel2);

        

        
            // let exitButton = this.attachButton("settingsButton", () => {
            let exitButton = this.attachButton("settingsMain", () => {
                this.settingsPanel = new InGameSettingsPanel(this.game, screen, exitButton);
                screen.addPanel(this.settingsPanel);
                this.game.add.tween(exitButton).to({angle: exitButton.angle - 120}, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Sinusoidal.InOut, true)
                
                this.settingsPanel.show();
            });

            exitButton.anchor.y = 1;
            exitButton.y = this.game.height - 12;
            exitButton.x = this.game.width - 120 + 17;

            exitButton.anchor.set(0.5)
            exitButton.scale.set(1.3)
            exitButton.alpha = 0.8;
            exitButton.y += 10 -5 - 45;
            exitButton.x += 5;
    }

    public getHeight(): number {
        return this.bottomPanel.height;
    }

    public spendCompass(): void {
        let user = UserService.getUser();
        user.increaseBoostersCount(BoosterType.compass, - 1);
        this.boosterpanel.refresh();
    }

    public refresh():void{
        this.boosterpanel.refresh();
    }
}
