import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UserService from '../../../core/service/UserService';
import LifeUtils from '../../../core/utils/LifeUtils';
import ShopPanel from './ShopPanel';
import BaseScreen from '../../screen/common/BaseScreen';
import HouseScreen from '../../screen/HouseScreen';
import LifeDetailsPanel from './LifeDetailsPanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import SoundUtils from '../../../core/utils/SoundUtils';

export default class NoLifesPanel extends ClosablePanel {

    private actionButton:Phaser.Button | Phaser.Sprite;
    private screen: HouseScreen;

    constructor(game: Phaser.Game, screen: HouseScreen, action: ()=>void) {
        super(game, game.width/2, game.height/2, true, "blank", 1.1);
        this.screen = screen;

        this.visible = false;
        this.fixedToCamera = true;

        let panel = this.attachSprite('panel2', 'panel');
        panel.inputEnabled = true;
        this.attachSprite("helperPanel")
        let helperPanel2 = this.attachSprite("helperPanel", "helperPanel2")
        helperPanel2.tint = 0x000000;
        helperPanel2.alpha = 0.5;

        let keyAndRect = SpriteUtils.getKeyAndRect(game, "helperPanel");
        let bmd = game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
        bmd.alphaMask(SpriteUtils.createBitmapData(game, "forestHeader1", -50, -200), SpriteUtils.createBitmapData(game, "helperPanel"));
            
        let bg = new Phaser.Sprite(this.game, 0, 0, bmd);
        bg.name = "bg";
        bg.anchor.set(0.5);
        this.addSprite(bg);

        let ribbon = this.attachSprite('ribbon')
        ribbon.tint = 0xFF9999;

        // let closeButton = this.attachSprite('closeButtonViolet')
        let closeButton = this.attachButton('closeButtonViolet', () => { this.close()})
        closeButton.tint = 0xFF9999;
        this.attachText("title", "Жизни закончились!", { font: "46px Bookman Old Style", fill: "#ffffff" })


        // this.actionButton = this.attachSprite("pnlButton");
        this.actionButton = this.attachButton("pnlButton", () => {
            let user = UserService.getUser()
            let price = LifeUtils.getCurrentRestorationPrice()
            if(user.getSupermoney() > price){
                //TODO звук траты монет
                user.setSupermoney(user.getSupermoney() - price);
                user.setLifes(LifeUtils.getLifesMaximum())
                
                AnimationUtils.jelly(this.game, this.actionButton, 0, true);

                SoundUtils.restoreLifes();

                AnimationUtils.heartsBurst(this.game, this.x + this.actionButton.x, this.y + this.actionButton.y)
                AnimationUtils.highlight(this.game, this.x + this.actionButton.x, this.y + this.actionButton.y, "splashY")

                this.game.time.events.add(1000, ()=>{
                    this.screen.hideUI(0,false, false, true);
                    this.close();
                    action();
                })
            } else {
                this.close();
                let shopPanel = new ShopPanel(this.game, screen);
                shopPanel.show()
                this.game.add.existing(shopPanel);
            }
        });

        this.attachSprite("gems")

        this.attachSprite("heart")
        this.attachText("heartCount", "" + UserService.getUser().getLifes(), { font: "bold 70px Bookman Old Style", fill: "#ffffff" })
        
        this.attachSprite("heart", "heartSmall")
        this.attachText("heartsLimit", "Текущий лимит: " + LifeUtils.getLifesMaximum(), { font: "36px Bookman Old Style", fill: "#572a24" })
        
        let titlePanel = this.attachButton("titlePnl", ()=>{
            let detailsPanel = new LifeDetailsPanel(this.game, screen, action);
            this.close();
            detailsPanel.show()
            this.game.add.existing(detailsPanel);
        });
        
        let enlagreLabel = new Label(game, 0, 0, "Увеличить", { font: "bold 40px Arial", fill: "#ffffff"});
        enlagreLabel.anchor.set(0.5);
        titlePanel.addChild(enlagreLabel);
        titlePanel.visible = UserService.getUser().getFriendsInGame() < LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS;

        let continueLabel = new Label(this.game, 0, 0, "Восстановить за " + LifeUtils.getFullRestorationPrice() + "     ", { font: "bolder 45px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);
        
        this.applyPreset([{"spriteId":"panel","x":0,"y":-5,"scaleX":1.08,"scaleY":1.1400000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":-5.600206611570229,"scaleX":1.07,"scaleY":1.6200000000000006,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel2","x":0,"y":-42,"scaleX":1.068,"scaleY":1.1600000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"bg","x":0,"y":-36.89566115702473,"scaleX":1.05,"scaleY":1.08,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"ribbon","x":0,"y":-191.06301652892557,"scaleX":1.07,"scaleY":1.3200000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButtonViolet","x":332.68965517241384,"y":-225.21487603305798,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"title","x":13.241379310344769,"y":-219.9349173553719,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
        {"spriteId":"pnlButton","x":2,"y":265,"scaleX":1.2400000000000002,"scaleY":1.04,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"gems","x":242.00000000000006,"y":264.02272727272725,"scaleX":0.8799999999999999/ 1.5,"scaleY":0.8999999999999999/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"heart","x":16.965517241379303,"y":-38.42355371900817,"scaleX":1.7400000000000007/1.5,"scaleY":1.7200000000000006/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"heartCount","x":19.862068965517267,"y":-36.679752066115725,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":70},
        {"spriteId":"heartSmall","x":36.9655172413793,"y":147.21590909090912,"scaleX":0.5399999999999996/1.5,"scaleY":0.5599999999999996/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"heartsLimit","x":-166.68965517241384,"y":148.3274793388431,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":36},
        {"spriteId":"titlePnl","x":208.06896551724128,"y":145.95144628099183,"scaleX":0.8799999999999999,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])
        
        continueLabel.scale.set(1/this.actionButton.scale.x, 1/this.actionButton.scale.y)
    }

    protected onClose() {
        //нельзя отсюда убирать, иначе при клике по экрану не вернется UI
        this.screen.showUI(true);
    }

    protected onShow() {
        this.screen.hideUI(0, true);
    }
};