import ShopService from './../../../core/service/ShopService';
import Buy from '../../../core/model/shop/Buy';
import BasePanel from '../../component/panel/BasePanel';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import CustomizationType from '../../../core/model/enum/CustomizationType';
import BoosterType from '../../../core/model/enum/BoosterType';
import { Easing } from 'phaser-ce';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Label from '../panel/Label';
export default class ShopBigPanel extends BasePanel {

    constructor(game: Phaser.Game, name: string, x: number, y: number, buy: Buy, callbackOnBuy: () => void) {
        super(game, x, y, name, "blank");
        this.game = game;

        let haveDiscount : boolean = buy.oldPrice? true : false ;

        this.inputEnabled = true;

        let panel2 = this.attachSprite("panel2")
        let helperPanel =this.attachSprite("helperPanel")
        helperPanel.alpha = 0.8;
        helperPanel.inputEnabled = false;
        
        let flashHolder = this.attachSprite("blank", "flash")
        flashHolder.inputEnabled = false;

        let flash = SpriteUtils.createSprite(game, 0,0, "flash")
        flash.inputEnabled = false;
        flash.anchor.set(0.5)
        flash.scale.set(0.5)
        flashHolder.addChild(flash);
        this.game.add.tween(flash).to({angle:360}, 20000, Easing.Linear.None, true, 0, -1)

        let ribbon = this.attachSprite("ribbon2")
        // ribbon.tint  = 0xff5544;
        ribbon.inputEnabled = false;
        ribbon.tint  = 0xAA7755;
        this.attachSprite("chest1").inputEnabled = false;
        this.attachSprite("gems").inputEnabled = false;
        
        let boosterCounts:Label[] = [];

        this.attachText("shopSetName", buy.name,  {font: "35px Bookman Old Style", fill: "#ffffff"}).inputEnabled = false;
        let gemsCount =  this.attachText("gemsCount", "" + buy.gems, {font: "bold 35px Gilroy", fill: "#804119"});
        gemsCount.inputEnabled = false;
        boosterCounts.push(gemsCount);

        if(buy.boosters.length == 2){
            buy.boosters.forEach((b, i) => {
                this.attachSprite(b.type, "b2_"+(i+1)).inputEnabled = false;
                let lbl = this.attachText("bName2_"+(i+1), "" + b.count, {font: "bold 35px Gilroy", fill: "#804119"});
                lbl.inputEnabled = false;
                boosterCounts.push(lbl);
            })
        } else if (buy.boosters.length == 3){
            buy.boosters.forEach((b, i) => {
                this.attachSprite(b.type, "b1_"+(i+1)).inputEnabled = false;
                let lbl = this.attachText("bName1_"+(i+1), "" + b.count, {font: "bold 35px Gilroy", fill: "#804119"});
                lbl.inputEnabled = false;
                boosterCounts.push(lbl);
            })
        }
        
        // if(AnalyticUtils.getCustomization() == CustomizationType.android){
            let btn0 = this.attachSprite("pnlButton", "pnlButton0");
            btn0.tint = 0x00FF00;
            let btn = this.attachSprite("pnlButton");
            btn.alpha = 0.5;
            this.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
            btn.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
            panel2.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
        // } else {
        //     //В Одноклассниках повторный платеж срабатывает без подтверждения
        //     let btn0 = this.attachSprite("pnlButton", "pnlButton0");
        //     btn0.tint = 0x00FF00;
        //     let btn = this.attachButton("pnlButton", () => {
        //         console.log("Shop button clicked")
        //         ShopService.processPayment(this.game, buy, callbackOnBuy);
        //     })
        //     btn.alpha = 0.5;
        // }

        let price = this.attachText("price", buy.price  + " " + AnalyticUtils.getValuteName(),  { font: "bold 40px Arial", fill: "#ffffff"})
        price.inputEnabled = false;

        let priceOld;
        if(haveDiscount){
            priceOld = this.attachText("priceOld", buy.oldPrice + " " + AnalyticUtils.getValuteName(),  { font: "bold 30px Arial", fill: "#ffffff"})
            priceOld.inputEnabled = false;
            priceOld.alpha = 0.6;
        }

        this.applyPreset([{"spriteId":"panel2","x":9,"y":-5,"scaleX":0.8799999999999999,"scaleY":0.5799999999999996,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":114,"y":-5,"scaleX":0.5399999999999996,"scaleY":0.8599999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"flash","x":-164.27586206896558,"y":22.991735537190152,"scaleX":4.479999999999992,"scaleY":3.060000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"ribbon2","x":-123,"y":-98,"scaleX":-1.3400000000000014,"scaleY":1.8600000000000008,"anchorX":0.5,"anchorY":0.5,"rotation":-3.469446951953614e-18},
        {"spriteId":"chest1","x":-176,"y":29,"scaleX":1.4200000000000004,"scaleY":1.4000000000000004,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"gems","x":89.72413793103453,"y":-77,"scaleX":0.6799999999999997/ 1.5,"scaleY":0.6799999999999997/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"b1_1","x":-11.275862068965353,"y":3.0640495867767186,"scaleX":0.8399999999999998,"scaleY":0.7999999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"b1_2","x":100.58620689655163,"y":3.0640082644626727,"scaleX":0.8399999999999999,"scaleY":0.8399999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"b1_3","x":211.37931034482733,"y":3.0640082644627864,"scaleX":0.8399999999999999,"scaleY":0.8399999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"shopSetName","x":-125,"y":-86,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":1,"rotation":0,"fontSize":35},
        {"spriteId":"gemsCount","x":179.8965517241379,"y":-72.87190082644634,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
        {"spriteId":"bName1_1","x":41.034482758620584,"y":4.344008264462786,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
        {"spriteId":"bName1_2","x":152.06896551724162,"y":4.816115702479237,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
        {"spriteId":"bName1_3","x":263.5172413793106,"y":6.128099173553551,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
        {"spriteId":"pnlButton0","x":125,"y":86,"scaleX":0.5399999999999996,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"pnlButton","x":125,"y":86,"scaleX":0.5399999999999996,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"price","x":130,"y":86,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40},
        {"spriteId":"priceOld","x":130,"y":106,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40},
        {"spriteId":"b2_1","x":36.34482758620709,"y":3.0640495867767186,"scaleX":0.8399999999999998,"scaleY":0.7999999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"b2_2","x":166.79310344827582,"y":3.06480165289254592,"scaleX":0.8399999999999999,"scaleY":0.8399999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"bName2_1","x":88.65517241379303,"y":4.344008264462786,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
        {"spriteId":"bName2_2","x":218.51724137931058,"y":4.816115702479237,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
    ])

    if(haveDiscount){
        let gr = game.add.graphics(priceOld.x-priceOld.width/2, priceOld.y);
        gr.lineStyle(2, 0xffffff, 1);
        gr.lineTo(priceOld.width, 0);
        gr.alpha = 0.5;
        this.addChild(gr);

        price.y = 76;

        btn.tint = 0x7700FF;
        btn0.tint = 0x7700FF;
        panel2.tint = 0x6600FF;
        helperPanel.alpha = 0.5;// = 0x222255;

        boosterCounts.forEach(b => {
            b.fill = "#3a001e";
        })

        ribbon.tint  = 0x774455;
    }


       
    }
}