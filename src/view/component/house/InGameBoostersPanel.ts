import BasePanel from '../panel/BasePanel';
import BoosterSlot from './BoosterSlot';
import BoosterType from '../../../core/model/enum/BoosterType';
import UserService from '../../../core/service/UserService';
import Utils from '../../../core/utils/Utils';
import StartLevelPanel from './StartLevelPanel';
import ShopPanel from './ShopPanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import ForestScreen from '../../screen/ForestScreen';
import BoosterInfoPanel from '../forest/BoosterInfoPanel';
import User from '../../../core/model/user/User';
import ForestUtils from '../../../core/utils/ForestUtils';
import Label from '../panel/Label';
import { ContentType } from '../../../core/model/enum/ContentType';
import SoundUtils from '../../../core/utils/SoundUtils';
import Game from '../../game/Game';
import Settings from '../../../core/service/Settings';

export default class InGameBoostersPanel extends BasePanel {

    private slot1: BoosterSlot;
    private slot2: BoosterSlot;
    private slot3: BoosterSlot;

    private cornerLeft: Phaser.Sprite;
    private cornerRight: Phaser.Sprite;
    private panelBody: Phaser.TileSprite;

    private screen: ForestScreen;

    constructor(game: Phaser.Game, screen: ForestScreen) {
        super(game, game.width/2, game.height - 250);
        this.game = game;
        this.screen = screen;

        this.scale.set(0.9, 0.9)

        //TODO
        this.addSprite(this.slot1 = new BoosterSlot(game, -174 , 200, BoosterType.glove, (type)=> {this.pickBooster(type)}, true));
        this.addSprite(this.slot2 = new BoosterSlot(game, 0, 200, BoosterType.beans, (type)=> {this.pickBooster(type)}, true));
        this.addSprite(this.slot3 = new BoosterSlot(game, 175, 200, BoosterType.rainbow, (type)=> {this.pickBooster(type)}, true));

        this.refresh();
        
        this.bringChildToTop(this.slot1);
        this.bringChildToTop(this.slot2);
        this.bringChildToTop(this.slot3);
        
    }

    private pickBooster(type:BoosterType) {
        let user = UserService.getUser();

        if (user.getBoostersCount(type) > 0) {

            if(type == BoosterType.beans && this.screen.cellsProvider.getCells().filter(c => c.state.content == ContentType.empty).length == 0){
                let label = new Label(this.game, this.game.width/2, this.game.height/5*4, "Некуда посадить бобы!", { font: "bold 50px Arial", fill:  "#ffffff"});
                label.anchor.set(0.5)
                label.strokeThickness = 4;
                label.addStrokeColor("#5a3415", 0);
                label.alpha = 0;
                this.screen.add.existing(label);
                this.game.add.tween(label).to({  y: label.y - 360}, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
                this.game.add.tween(label).to({  alpha: [1, 1, 1, 1, 1, 1, 0.5, 0 ] }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                this.game.time.events.add(2000, () => {label.destroy()}, this);
            } else {
                let p = new BoosterInfoPanel(this.game, this.screen, this.screen.getForestType(), type);
                this.screen.boosterInfoPanel = p;
                this.screen.addPanel(p)
                SoundUtils.inGameBoosterSelect();
            }

        } else {
            let shopPanel = new ShopPanel(this.game, this.screen, () => { this.refresh() });
            this.screen.add.existing(shopPanel);
            shopPanel.show()
        }
    }

    public refresh() {
        this.slot1.refresh();
        this.slot2.refresh();
        this.slot3.refresh();

        this.slot1.visible = false;
        this.slot2.visible = false;
        this.slot3.visible = false;

        if (ForestUtils.isBoosterSeen(BoosterType.rainbow)){
            this.slot1.visible = true;
            this.slot2.visible = true;
            this.slot3.visible = true;
        } else if (ForestUtils.isBoosterSeen(BoosterType.beans)){
            this.slot1.visible = true;
            this.slot2.visible = true;
        } else if(ForestUtils.isBoosterSeen(BoosterType.glove)){
            this.slot1.visible = true;
        } 

        let slotsVisible = (this.slot1.visible?1:0) + (this.slot2.visible?1:0) + (this.slot3.visible?1:0); 
        this.x = this.game.width/2 + 138/2 * (3-slotsVisible) + 10 * Math.max(0, 3-slotsVisible); 

        if(slotsVisible == 0){
            this.visible =false;
        } else {
            let width = slotsVisible * 174;

            if(!this.cornerLeft){
                this.cornerLeft = SpriteUtils.createSprite(this.game, -174 - 174/2 - 20, 200 - 100, "panelCorner");
                this.addSprite(this.cornerLeft);
                this.cornerRight = SpriteUtils.createSprite(this.game, -174 - 174/2  + width + 20, 200 - 100, "panelCorner");
                this.cornerRight.scale.set(-1, 1);
                this.addSprite(this.cornerRight);
                this.panelBody = SpriteUtils.createTileSprite(this.game, -174 - 100 + 50, 200 - 100, width-100, 75, "panelBody");
                this.addSprite(this.panelBody);
            }
            this.cornerRight.x = -174 - 174/2  + width + 20;
            this.panelBody.width = width-100;
        }
    }

}