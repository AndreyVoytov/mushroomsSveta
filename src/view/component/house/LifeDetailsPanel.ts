import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UserService from '../../../core/service/UserService';
import LifeUtils from '../../../core/utils/LifeUtils';
import ShopPanel from './ShopPanel';
import BaseScreen from '../../screen/common/BaseScreen';
import HouseScreen from '../../screen/HouseScreen';
import Utils from '../../../core/utils/Utils';
import User from '../../../core/model/user/User';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import SoundUtils from '../../../core/utils/SoundUtils';
import OkHelper from '../../../core/service/integration/OkHelper';

export default class LifeDetailsPanel extends ClosablePanel {

    private actionButton:Phaser.Button | Phaser.Sprite;
    private screen: HouseScreen;

    constructor(game: Phaser.Game, screen: HouseScreen, action: ()=>void) {
        super(game, game.width/2, game.height/2, true, "blank");

        //TODO: эта деревяшка может быть в 4 состояниях!
        //TODO: кнопку на LifesPanel можно несколько раз нажать
        //TODO: текст приглашения варьировать!
        
        this.screen = screen;
        
        this.visible = false;
        this.fixedToCamera = true;
        
        let panel = this.attachSprite('panel');
        panel.inputEnabled = true;
        this.attachSprite("helperPanel")
        let helperPanel2 = this.attachSprite("helperPanel", "helperPanel2")
        helperPanel2.alpha = 0.5;
        let helperPanel3 = this.attachSprite("helperPanel", "helperPanel3")
        // helperPanel3.tint = 0x00AA00;
        helperPanel3.tint = 0xAA0000;
        let helperPanel4 = this.attachSprite("helperPanel", "helperPanel4")
        // helperPanel4.alpha = 0.7;
        helperPanel4.alpha = 0.25;
        
        // let heartsRatio = 2.37;
        let heartsRatio = 1.2;
        let hearts =  SpriteUtils.createTileSprite(game, 0,0, helperPanel3.width * heartsRatio, helperPanel3.height* heartsRatio / 1.2, "strawberry"); 
        hearts.name = "hearts";
        hearts.alpha = 0.5;
        this.addChild(hearts);
        this.attachSprite("flash")
        let ribbon = this.attachSprite('ribbon')
        ribbon.tint = 0xFF9999;

        // let closeButton = this.attachSprite('closeButtonViolet')
        let closeButton = this.attachButton('closeButtonViolet', () => this.close())
        closeButton.tint = 0xFF9999;
        this.attachText("title", "Восстановление жизней", { font: "46px Bookman Old Style", fill: "#ffffff" })


        // this.actionButton = this.attachSprite("pnlButton");
        this.actionButton = this.attachButton("pnlButton", () => {
            let user = UserService.getUser()
            let price = LifeUtils.getCurrentRestorationPrice();
            if(user.getSupermoney() > price){
                //TODO звук траты монет
                user.setSupermoney(user.getSupermoney() - price);
                user.setLifes(LifeUtils.getLifesMaximum())

                SoundUtils.restoreLifes();

                AnimationUtils.heartsBurst(this.game, this.x + this.actionButton.x, this.y + this.actionButton.y)
                AnimationUtils.highlight(this.game, this.x + this.actionButton.x, this.y + this.actionButton.y, "splashY")

                this.game.time.events.add(1000, ()=>{
                    this.screen.hideUI(0,false, false, true);
                    action();
                    this.close();
                })
            } else {
                this.close();
                let shopPanel = new ShopPanel(this.game, screen);
                shopPanel.show()
                this.game.add.existing(shopPanel);
            }
        });
        let gems = this.attachSprite("gems")

        let cat4 = this.attachSprite("cat4")
        this.attachSprite("heart")
        this.attachText("heartCount", "" + UserService.getUser().getLifes(), { font: "bold 70px Bookman Old Style", fill: "#ffffff" })
        
        this.attachSprite("heart", "heartSmall")
        // this.attachText("heartsLimit", "Текущий лимит: " + LifeUtils.getLifesMaximum(), { font: "36px Bookman Old Style", fill: "#572a24" })
        this.attachText("heartsLimit", "Текущий лимит: " + LifeUtils.getLifesMaximum(), { font: "bold 36px Arial ", fill: "#7b4037" })
        this.attachText("friendsCount", "Друзей в игре: " + UserService.getUser().getFriendsInGame(), { font: "bold 36px Arial", fill: "#00a854" })

        let titlePanel = this.attachButton("titlePnl", ()=>{
            OkHelper.showInvite("Привет! Прими участие в приключениях в новой игре!", "forLifes");
            this.close();
        });

        let inviteText = this.attachText("friendsInfo", this.getInviteFriendsInfo(), { font: "bold 36px Bookman Old Style", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, align: "center" })
        inviteText.addStrokeColor("#8b1e15", 0)
        inviteText.strokeThickness = 6;

        let enlagreLabel = new Label(game, 0, 0, "Пригласить", { font: "bold 38px Arial", fill: "#ffffff"});
        enlagreLabel.anchor.set(0.5);
        titlePanel.addChild(enlagreLabel);

        let continueLabel = new Label(this.game, 0, 0, "Восстановить за " + LifeUtils.getFullRestorationPrice() + "     ", { font: "bolder 45px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);
        
        this.applyPreset([{"spriteId":"panel","x":0,"y":56,"scaleX":1.08,"scaleY":1.3000000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"helperPanel","x":1.6551724137931387,"y":-134.76756198347096,"scaleX":1.07,"scaleY":1.6200000000000006,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            // {"spriteId":"helperPanel2","x":6.6206896551723275,"y":152.4545454545455,"scaleX":1.068,"scaleY":0.5399999999999996,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"hearts","x":25.241379310344712,"y":350.28615702479306,"scaleX":1,"scaleY":0.8799999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"helperPanel3","x":25.241379310344712,"y":350.28615702479306,"scaleX":1,"scaleY":0.8799999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"helperPanel4","x":25.241379310344712,"y":350.28615702479306,"scaleX":1,"scaleY":0.8799999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"flash","x":9.482758620689651,"y":-168.3512396694215,"scaleX":8.219999999999914/2,"scaleY":5.4599999999999715/2,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"ribbon","x":-3.3103448275862775,"y":-321.5743801652892,"scaleX":1.07,"scaleY":1.3200000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"closeButtonViolet","x":332.68965517241384,"y":-352.214876033058,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"title","x":-5.448275862069067,"y":-348.13429752066116,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
            // {"spriteId":"pnlButton","x":12,"y":150,"scaleX":1.2400000000000002,"scaleY":1.04,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"gems","x":248.1034482758622,"y":144.79132231404947,"scaleX":0.8799999999999999/ 1.5,"scaleY":0.8999999999999999/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"cat4","x":-298.2758620689656,"y":335.7334710743802,"scaleX":0.6799999999999997,"scaleY":0.6399999999999997,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"heart","x":11.999999999999886,"y":-172.55888429752076,"scaleX":1.7400000000000007/1.5,"scaleY":1.7200000000000006/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"heartCount","x":12.620689655172498,"y":-168.47107438016542,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":70},
            {"spriteId":"heartSmall","x":180.9655172413792,"y":-39.9111570247934,"scaleX":0.5399999999999996/1.5,"scaleY":0.5599999999999996/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"heartsLimit","x":-24.344827586207032,"y":-32.175619834710574,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":36},
            {"spriteId":"friendsCount","x":3.9310344827587187,"y":20.839876033057863,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":36},
            {"spriteId":"friendsInfo","x":72.82758620689657,"y":336.1663223140499,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":36},
            {"spriteId":"titlePnl","x":14.689655172413723,"y":452.7427685950413,"scaleX":1.04,"scaleY":1.1400000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"helperPanel2","x":1.6206896551723275,"y":152.4545454545455,"scaleX":1.068,"scaleY":0.5399999999999996,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"pnlButton","x":7,"y":150,"scaleX":1.2400000000000002,"scaleY":1.04,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        ])


        hearts.x = 0;
        hearts.y = 0;
        hearts.scale.set(hearts.scale.x /heartsRatio, hearts.scale.y / heartsRatio * 1.2)
        helperPanel3.addChild(hearts);
        
        continueLabel.scale.set(1/this.actionButton.scale.x, 1/this.actionButton.scale.y)

        if(!this.getInviteFriendsInfo()){
            //case 2 of 4
            inviteText.visible = false;
            cat4.visible = false;
            helperPanel3.visible = false;
            helperPanel4.visible = false;
            titlePanel.visible = false;
        }
        
        let user = UserService.getUser();
        if(user.getLifes() != 0){
            helperPanel2.visible = false;
            this.actionButton.visible = false;
            gems.visible = false;

            if(this.getInviteFriendsInfo()){
                inviteText.y -= 136;
                cat4.y -= 136;
                helperPanel3.y -= 136;
                helperPanel4.y -= 136;
                titlePanel.y -= 136;
            }
        }

        if(!this.getInviteFriendsInfo() && user.getLifes() == 0){
            Utils.applyPreset(panel, {"spriteId":"panel","x":0,"y":-79,"scaleX":1.08,"scaleY":0.9199999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0});
            this.fixedToCamera = false;
            this.y +=50;
            this.fixedToCamera = true;
        } else if (!this.getInviteFriendsInfo()){
            Utils.applyPreset(panel, {"spriteId":"panel","x":0,"y":-142,"scaleX":1.08,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0});
            this.fixedToCamera = false;
            this.y +=150;
            this.fixedToCamera = true;
        } else if (user.getLifes() != 0){
            Utils.applyPreset(panel, {"spriteId":"panel","x":0,"y":-10,"scaleX":1.08,"scaleY":1.12,"anchorX":0.5,"anchorY":0.5,"rotation":0});
        }
    }

    private getInviteFriendsInfo():string{
        let user = UserService.getUser();

        if(user.getFriendsInGame() < LifeUtils.PLUS_LIFE_AT_FRIENDS){
            // return "Пригласите в игру ~" + 
            //     LifeUtils.PLUS_LIFE_AT_FRIENDS + Utils.chooseRussianWord(LifeUtils.PLUS_LIFE_AT_FRIENDS, " друга", " друга", " друзей") 
            //     + "~ и лимит жизней возрастёт до ~" + (LifeUtils.LIFES_BASE + 1) + "~!";
            return "Пригласите в игру " + 
                LifeUtils.PLUS_LIFE_AT_FRIENDS + Utils.chooseRussianWord(LifeUtils.PLUS_LIFE_AT_FRIENDS, " друга", " друга", " друзей") 
                + " и лимит жизней возрастёт до " + (LifeUtils.LIFES_BASE + 1) + "!";
        } 
        
        if(user.getFriendsInGame() < LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS){
            // return "Пригласите в игру ~" + 
            //     LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS + Utils.chooseRussianWord(LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS, " друга", " друга", " друзей") 
            //     + "~ и лимит жизней возрастёт до ~" + (LifeUtils.LIFES_BASE + 2) + "~!";
            return "Пригласите в игру " + 
                LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS + Utils.chooseRussianWord(LifeUtils.SECOND_PLUS_LIFE_AT_FRIENDS, " друга", " друга", " друзей") 
                + " и лимит жизней возрастёт до " + (LifeUtils.LIFES_BASE + 2) + "!";
        }

        return "";

    }

    protected onClose() {
        this.screen.showUI(true);
        this.screen.lifeDetailsShown = false;
    }

    protected onShow() {
        this.screen.hideUI(0, true);
        this.screen.lifeDetailsShown = true;
    }
};