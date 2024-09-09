
import ShopService from './../../../core/service/ShopService';
import BasePanel from '../../component/panel/BasePanel';
import Buy from '../../../core/model/shop/Buy';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
export default class ShopSmallPanel extends BasePanel {

    constructor(game: Phaser.Game, name: string, x: number, y: number, buy: Buy, callbackOnBuy: () => void) {
        super(game, x, y, name, "blank");

        this.inputEnabled = true;

        let panel2 = this.attachSprite("panel2")
        let helperPanel =this.attachSprite("helperPanel")
        helperPanel.alpha = 0.8;
        helperPanel.inputEnabled = false;

        this.attachText("gemsCount", "" + buy.gems, {font: "bold 43px Gilroy", fill: "#804119"})
        
        // if(AnalyticUtils.getCustomization() == CustomizationType.android){
            let btn0 = this.attachSprite("pnlButton", "pnlButton0");
            btn0.tint = 0x00FF00;
            let btn = this.attachSprite("pnlButton");
            btn.alpha = 0.5;
            this.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
            btn.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
            panel2.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
            // this.events.onInputDown.add(() => ShopService.processPayment(this.game, buy, callbackOnBuy), this);
        // } else {
            //В Одноклассниках повторный платеж срабатывает без подтверждения
            // let btn0 = this.attachSprite("pnlButton", "pnlButton0");
            // btn0.tint = 0x00FF00;
            // let btn = this.attachButton("pnlButton", () => {
            //     console.log("Shop button clicked")
            //     ShopService.processPayment(this.game, buy, callbackOnBuy);
            // })
            // btn.alpha = 0.5;
        // }

        let gems = this.attachSprite("gems", "gemsBig")
        gems.inputEnabled = false;

        let price = this.attachText("price", buy.price + " " + AnalyticUtils.getValuteName(),  { font: "bold 40px Arial", fill: "#ffffff"} );
        price.inputEnabled = false;

        this.applyPreset([{"spriteId":"panel2","x":6,"y":-7,"scaleX":0.4199999999999995,"scaleY":0.5799999999999996,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"helperPanel","x":6,"y":-8,"scaleX":0.37999999999999945,"scaleY":0.8599999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"gemsCount","x":8.448275862068954,"y":-88.03202479338842,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":43},
        {"spriteId":"pnlButton","x":7,"y":85,"scaleX":0.49999999999999956,"scaleY":0.7199999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"pnlButton0","x":7,"y":85,"scaleX":0.49999999999999956,"scaleY":0.7199999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"gemsBig","x":6,"y":1,"scaleX":1.3800000000000003/ 1.5,"scaleY":1.3600000000000003/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"price","x":10,"y":85,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40}])
    }
}