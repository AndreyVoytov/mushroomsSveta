import UserService from '../../../core/service/UserService';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import HouseScreen from '../../screen/HouseScreen';
import BasePanel from '../../component/panel/BasePanel';
import Label from '../../component/panel/Label';
import ShopPanel from './ShopPanel';
export default class KeysPanel extends BasePanel {

    private keysLabel: Label;

    public startX: number;

    constructor(game: Phaser.Game, houseScreen: HouseScreen) {
        super(game, 808, 150, 'keysPanel');
        this.startX = this.x;

        this.scale.set(0.9)

        this.attachSprite('statusPanel')
        this.attachSprite('keyUI')
        let plusButton = this.attachButton('plusButton', () => {
            let shopPanel = new ShopPanel(this.game, houseScreen);
            shopPanel.show()
            this.game.add.existing(shopPanel);
            AnimationUtils.jelly(game, plusButton, 0, true);
        })
        this.keysLabel = this.attachText('keysLabel', "" + UserService.getUser().getKeys(), { "font": "bold 45px Arial", "fill": "#ffffff" })
        if (this.keysLabel.text == "0") {
            this.visible = false;
        }

        this.applyPreset([{ "spriteId": "statusPanel", "x": 5, "y": 14, "scaleX": 1.04, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "keyUI", "x": 98, "y": 10, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "plusButton", "x": -103, "y": 14, "scaleX": 1.08, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "keysLabel", "x": -6, "y": 16, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 45 }])

        this.game.time.events.loop(1000, ()=>{
            this.keysLabel.text = "" + UserService.getUser().getKeys();
        })

    }

}
