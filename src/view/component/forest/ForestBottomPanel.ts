import BaseForestScreen from '../../screen/BaseForestScreen';
import UserService from '../../../core/service/UserService';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import InGameSettingsPanel from './InGameSettingsPanel';
import ForestDao from '../../../core/dao/ForestDao';
import EventUtils from '../../../core/utils/EventUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BoosterType from '../../../core/model/enum/BoosterType';
import { Easing } from 'phaser-ce';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
import WorldService from '../../../core/service/WorldService';
import WorldPanel from '../house/WorldPanel';
import HeroTeamPanel from './HeroTeamPanel';
export default class ForestBottomPanel extends BasePanel {
    private bottomPanel: Phaser.Sprite;
    public heroes: HeroTeamPanel;
    public settingsPanel:InGameSettingsPanel;

    constructor(game: Phaser.Game, forestType: ForestType, screen: BaseForestScreen) {
        super(game, 0, 0, "blank");
        this.game = game;

        this.bottomPanel = SpriteUtils.createSprite(this.game, this.game.width / 2, this.game.height, 'topPanel');
        this.bottomPanel.anchor = new Phaser.Point(0.5, 0);
        this.bottomPanel.scale = new Phaser.Point(1, -1);
        this.addSprite(this.bottomPanel);

        this.addChild(this.heroes = new HeroTeamPanel(game,game.width/2,game.height-72,true));

        let forestsTotal = ForestDao.getAllForests().length;
        const user=UserService.getUser(),adventure=WorldService.activeAdventure;
        let currentForest = adventure ? user.world.adventures[adventure].progress+1 : WorldService.expedition ? user.world.expeditionsCompleted+1 : EventUtils.hasActiveLevelSession()
            ? Number(EventUtils.getActiveLevelOrder())
            : Math.min(ForestDao.indexOf(forestType) + 1, forestsTotal);
        let levelLabel = new Label(this.game, 155, this.game.height + 3 , "" + currentForest, { font: "bold 45px Arial", fill: "#fff5bc"});
        levelLabel.strokeThickness = 4;
        levelLabel.addStrokeColor("#924d1d", 0);
        levelLabel.anchor = new Phaser.Point(0.5, 1);
        this.addSprite(levelLabel);
        let levelLabel2 = new Label(this.game, 80, this.game.height - 50, adventure?'история':WorldService.expedition?'поход':LocalizationService.get(LocalizationKey.ui('levelLower')), { font: "bold 35px Arial", fill: "#fff0ab"});
        levelLabel2.anchor = new Phaser.Point(0, 1);
        levelLabel2.strokeThickness = 4;
        levelLabel2.addStrokeColor("#924d1d", 0);
        this.addSprite(levelLabel2);
        if(adventure){
            const note=new Label(this.game,this.game.width/2,this.game.height-65,'Прочитать записку',{font:'22px Arial',fill:'#fff0ab'});
            note.anchor.set(0.5);note.inputEnabled=true;note.events.onInputDown.add(()=>WorldPanel.show('journey'));this.addSprite(note);
        }

        

        
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
        this.heroes.refresh();
    }

    public refresh():void{
        this.heroes.refresh();
    }
}
