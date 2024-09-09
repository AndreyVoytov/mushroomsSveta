import ShopService from './../../../core/service/ShopService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../../component/panel/BasePanel';
import ClosablePanel from './../../component/panel/ClosablePanel';
import ShopBigPanel from './ShopBigPanel';
import ShopSmallPanel from './ShopSmallPanel';
import Settings from '../../../core/service/Settings';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';

export default class ShopPanel extends ClosablePanel {
    private screen: Phaser.State;

    private panels: BasePanel[] = [];
    private shopLabel: Phaser.Sprite;
    private closeButton: Phaser.Button;


    constructor(game: Phaser.Game, screen: Phaser.State, callbackOnBuy?: () => void) {
        super(game, game.width / 2 - 1, game.height / 2 - 45, true, "blank", 1.04);
        this.game = game;
        this.screen = screen;

        this.fixedToCamera = true;

        this.attachSprite("mushroom3", "m1")
        this.attachSprite("mushroom3", "m2")
        this.attachSprite("mushroom3", "m3")
        this.attachSprite("mushroom3", "m4")

        
        this.shopLabel = this.attachSprite("statusPanel")
        let shopTitle = new Label(game, 0, 0, "Магазин", { font: "58px Bookman Old Style", fill: "#f0f1ec" })
        shopTitle.name = 'shopTitle';
        shopTitle.anchor = new Phaser.Point(0.5, 0.5);
        // shopTitle.strokeThickness = 4;
        // shopTitle.addStrokeColor('#4c1903', 0);
        this.addSprite(shopTitle);
        // shopLabel2.tint = 0x996025;
        this.shopLabel.tint = 0xaa5577;
        
        // this.closeButton = this.attachButton("closeButton", () => this.close())
        this.closeButton = this.attachButton("circleOrange", () => this.close())
        this.closeButton.name = "closeButton";
        this.closeButton.tint = 0xCC7777;
        let cross = SpriteUtils.createSprite(game,  0, 0, "closeButton", "cross");
        cross.anchor.set(0.5)
        cross.scale.set(1/1.34 *2)
        cross.alpha = 0.5;
        // cross.tint = 0x994444;
        cross.tint = 0x333333;
        this.closeButton.addChild(cross);
        
        this.attachSprite("horn", "t331")
        this.attachSprite("horn", "t332")

        Settings.BUYS.forEach ((b, i) => {
            let panel: BasePanel;
            let callback = ()=>{
                if(this && this.opened && !this.processing) this.close();
                if(callbackOnBuy) callbackOnBuy();
            }

            if (b.name) {
                panel = new ShopBigPanel(this.game, "buy" + (i + 1), 0, 0, b, callback);
            } else {
                panel = new ShopSmallPanel(this.game, "buy" + (i + 1), 0, 0, b, callback);
            }
            this.addSprite(panel);
            panel.alpha = 0;
            this.panels.push(panel);
        })

        this.applyPreset([{"spriteId":"m1","x":119.82758620689651,"y":-519.4772727272727,"scaleX":-0.760000000000001,"scaleY":0.94,"anchorX":0.5,"anchorY":0.5,"rotation":0.07},
        {"spriteId":"m2","x":62.413793103448256,"y":-511.1012396694214,"scaleX":-0.5600000000000008,"scaleY":0.6199999999999997,"anchorX":0.5,"anchorY":0.5,"rotation":-0.10999999999999999},
        {"spriteId":"m3","x":-74.58620689655174,"y":-513.6053719008264,"scaleX":0.8399999999999999,"scaleY":0.7799999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0.05},
        {"spriteId":"m4","x":-132.1034482758621,"y":-533.8853305785124,"scaleX":0.98,"scaleY":0.9199999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"statusPanel","x":0,"y":-439,"scaleX":1.6200000000000006,"scaleY":1.5800000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"shopTitle","x":-2.275862068965523,"y":-442.77376033057845,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":57},
        {"spriteId":"closeButton","x":347,"y":-425,"scaleX":1.800000000000003/2,"scaleY": 1.800000000000003/2,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"t331","x":-198.75862068965517,"y":-415.1900826446281,"scaleX":-1.6200000000000017/2,"scaleY":1.6200000000000006/2,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"t332","x":196.48275862068965,"y":-414.8140495867768,"scaleX":1.6000000000000005/2,"scaleY":1.6600000000000006/2,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy1","x":-313,"y":-182,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy2","x":-6,"y":-181,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy3","x":302,"y":-181,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy4","x":-313,"y":111,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy5","x":151-5,"y":107,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy6","x":-311,"y":404,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"buy7","x":151-5,"y":402,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])
    }

    protected onClose() {
        if (this.screen instanceof HouseScreen) {
            //TODO add parameter "active" for ClosablePanel
            if (this.screen.startLevelPanel.alpha == 0 || !this.screen.startLevelPanel.visible || this.screen.startLevelPanel.scale.x == 0) {
                this.screen.showUI(true)
            }
            this.screen.shopShown = false;
        }
    }

    protected onShow() {
        console.log("SHOP PANEL!")

        AnimationUtils.appear2(this.game, this.shopLabel, 0);
        AnimationUtils.appear2(this.game, this.closeButton, 0, 1, 1);//0.7);

        super.show(true);
        for (let i = 0; i < 3; i++) {
            let p = this.panels[i];
            AnimationUtils.appear2(this.game, p, 200, 1, 1, p instanceof ShopBigPanel? 0.985 : 1);
            // p.alpha = 1;
        }

        for (let i = 3; i < 5; i++) {
            let p = this.panels[i];
            AnimationUtils.appear2(this.game, p, 400, 1, 1, p instanceof ShopBigPanel? 0.985 : 1);
            // p.alpha = 1;
        }

        for (let i = 5; i < 7; i++) {
            let p = this.panels[i];
            AnimationUtils.appear2(this.game, p, 600, 1, 1, p instanceof ShopBigPanel? 0.985 : 1);
            // p.alpha = 1;
        }

        if (this.screen instanceof HouseScreen) {
            this.screen.hideUI(0, true)
            this.screen.shopShown = true;
        }
    }

};