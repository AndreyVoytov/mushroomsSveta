import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UserService from '../../../core/service/UserService';
import LifeUtils from '../../../core/utils/LifeUtils';
import ShopPanel from './ShopPanel';
import BaseScreen from '../../screen/common/BaseScreen';
import HouseScreen from '../../screen/HouseScreen';

export default class AllLevelsCompletePanel extends ClosablePanel {

    private actionButton:Phaser.Button | Phaser.Sprite;
    private screen: HouseScreen;

    constructor(game: Phaser.Game, screen: HouseScreen) {
        super(game, game.width/2, game.height/2, true, "blank");
        this.screen = screen;

        this.visible = false;
        this.fixedToCamera = true;

        let panel = this.attachSprite('panel2', 'panel');
        panel.inputEnabled = true;
        this.attachSprite("helperPanel")
        let helperPanel2 = this.attachSprite("helperPanel", "helperPanel2")
        helperPanel2.tint = 0x000000;
        helperPanel2.alpha = 0.2;

        let keyAndRect = SpriteUtils.getKeyAndRect(game, "helperPanel");
        let bmd = game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
        bmd.alphaMask(SpriteUtils.createBitmapData(game, "flowersFieldHeader", -50, -200), SpriteUtils.createBitmapData(game, "helperPanel"));
            
        let bg = new Phaser.Sprite(this.game, 0, 0, bmd);
        bg.name = "bg";
        bg.anchor.set(0.5);
        this.addSprite(bg);

        this.attachText("label", "Поздравляем! Вы прошли все доступные уровни. Вступите в ~группу игры~, чтобы не пропустить продолжение.",
         { /*font: "50px Arial", fill: "#572424"*/  font: "bolder 38px Bookman Old Style", fill: "#804119", wordWrap: true, wordWrapWidth: 700, align: "center"})

        let ribbon = this.attachSprite('ribbon')
        ribbon.tint = 0xFF9999;

        let closeButton = this.attachButton('closeButtonViolet', () => this.close())
        closeButton.tint = 0xFF9999;
        this.attachText("title", "Продолжение следует!", { font: "46px Bookman Old Style", fill: "#ffffff" })

        // this.actionButton = this.attachSprite("titlePnl");
        this.actionButton = this.attachButton("titlePnl", () => {
            //TODO
            this.close();
        });

        //TODO
        // let enlagreLabel = new Label(game, 0, 0, "Вступить в группу", { font: "bold 40px Arial", fill: "#ffffff"});
        let enlagreLabel = new Label(game, 0, 0, "Хорошо", { font: "30px Gilroy", fill: "#ffffff"});
        enlagreLabel.anchor.set(0.5);
        this.actionButton.addChild(enlagreLabel);
        
        this.applyPreset([{"spriteId":"panel","x":0,"y":-5,"scaleX":1.08,"scaleY":1.4000000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":23.39979338842977,"scaleX":1.07,"scaleY":1.9000000000000008,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel2","x":0,"y":-92,"scaleX":1.068,"scaleY":1.1600000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"bg","x":0,"y":-99.89566115702473,"scaleX":1.05,"scaleY":1.1800000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"label","x":0,"y":152,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":38},
        {"spriteId":"ribbon","x":0,"y":-256.0630165289256,"scaleX":1.07,"scaleY":1.3200000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButtonViolet","x":332.68965517241384,"y":-289.214876033058,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"title","x":13.241379310344769,"y":-283.9349173553719,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
        {"spriteId":"titlePnl","x":-3.9310344827587187,"y":323.95144628099183,"scaleX":1.5800000000000005,"scaleY":1.5400000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0}])
    }

    protected onClose() {
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }
};