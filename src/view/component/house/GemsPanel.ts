import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../panel/BasePanel';
import Label from '../panel/Label';
import ShopPanel from './ShopPanel';
export default class GemsPanel extends BasePanel {

    private gemsLabel: Label;

    public startX: number;

    constructor(game: Phaser.Game, houseScreen: HouseScreen) {
        super(game, 808, 50, 'gemsPanel');
        this.startX = this.x;

        this.scale.set(0.9)

        this.attachSprite('statusPanel')
        this.attachSprite('gems')
        let plusButton = this.attachButton('plusButton', () => {
            if (houseScreen.isTasksPanelBlockingUI()) {
                return;
            }

            if (!houseScreen.shopShown) {
                let shopPanel = new ShopPanel(this.game, houseScreen, undefined, 'items');
                shopPanel.show();

                houseScreen.addPanel(shopPanel);
                AnimationUtils.jelly(game, plusButton, 0, true);
            }
        })
        this.gemsLabel = this.attachText('gemsLabel', "" + UserService.getUser().getSupermoney(), { "font": "bold 45px Arial", "fill": "#ffffff" })


        this.applyPreset([{ "spriteId": "statusPanel", "x": 5, "y": 14, "scaleX": 1.04, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "gems", "x": 98, "y": 10, "scaleX": 1/ 1.5, "scaleY": 1/ 1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "plusButton", "x": -103, "y": 14, "scaleX": 1.08, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "gemsLabel", "x": -6, "y": 16, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 }])


        this.game.time.events.loop(1000, ()=>{
            this.gemsLabel.text = "" + UserService.getUser().getSupermoney();
        })
    }

}
