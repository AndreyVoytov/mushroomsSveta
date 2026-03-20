import GameText from '../localization/GameText';

import Buy from '../model/shop/Buy';
import ForestScreen from './../../view/screen/ForestScreen';
import AnalyticUtils from '../utils/AnalyticUtils';
import CustomizationType from '../model/enum/CustomizationType';
import UserService from './UserService';
import NeverError from '../utils/NeverError';
import OkHelper from './integration/OkHelper';
import PaymentStoreComponent from './store/PaymentStoreComponent';
import TestPaymentStoreComponent from './store/TestPaymentStoreComponent';
import CircleProgressPanel from '../../view/component/panel/CircleProgressPanel';
import Game from '../../view/game/Game';
import Settings from './Settings';
import BuyConfirmPanel from '../../view/component/house/BuyConfirmPanel';
import LocalizationService from '../localization/LocalizationService';
export default class ShopService {

    public static paymentsLoaded = false;
    public static callbackOnBuy:() => void;
    private static circle:CircleProgressPanel;

    public static processPayment(game: Phaser.Game, buy: Buy, callbackOnBuy: () => void) {
        
        this.initiatePayment(buy);

        this.paymentsLoaded = false;
        this.callbackOnBuy = callbackOnBuy;

        //Подстраховка: 10 минут пытаемся получить платеж напрямую с сервера
        let loop = game.time.events.repeat(3000, 400, () => {
            if(!this.paymentsLoaded){
                ShopService.checkAndApplyLastBuys(true);
            } else {
                loop.timer.remove(loop);
            }
        })
    }

    private static initiatePayment(buy: Buy){
        let cust = AnalyticUtils.getCustomization()

        switch(cust){
            case CustomizationType.webDev:
                //instantly successful payment 
                TestPaymentStoreComponent.setNewBuyProductCode(buy.id);
                break;
            case CustomizationType.android:
                //webview will process this url
                window.location.href = "buy.do?id=" + buy.id;
                break;
            case CustomizationType.odkl:
                OkHelper.showPayment(buy.id, Buy.getName(buy), Buy.getDesc(buy), buy.price, "")
                // OkHelper.postToWall("111", "test", "https://stran.mobi/style/icons/ruby24.png");
                // OkHelper.showInvite("test", "111");
                break;
            default:
                throw new NeverError(cust);
        }
    }

    public static checkAndApplyLastBuys(silentMode?: boolean): void {
        let cust = AnalyticUtils.getCustomization()
        
        switch(cust){
            case CustomizationType.webDev:
                this.applyTestBuy();
                break;
            case CustomizationType.android:
                //TODO add payment checking with server
                this.applyTestBuy();
                break;
            case CustomizationType.odkl:
                this.applyBuys(silentMode);
                break;
            default:
                throw new NeverError(cust);
        }
    }

    private static applyBuys(silentMode?: boolean): void {
        let game = Game.getInstance();

        if(!silentMode){
            this.circle = new CircleProgressPanel(game);
            game.add.existing(this.circle);
            this.circle.show();
        }

        PaymentStoreComponent.getAndApplyNewPayments(silentMode);
        
    }

    private static applyTestBuy():void{
        let productCode = TestPaymentStoreComponent.getNewBuyProductCode();
        TestPaymentStoreComponent.setNewBuyProductCode("");
        let buy = Settings.BUYS.filter(b => b.id == productCode).shift();
        if(buy) {
            Buy.applyToUser(buy, UserService.getUser());
            if (ShopService.callbackOnBuy) this.callbackOnBuy();
            this.onFinishPaymentProcessing();

            let info = new BuyConfirmPanel(Game.getInstance(), LocalizationService.get('ui.purchaseReceived'), LocalizationService.get('ui.ok'), GameText.purchaseReward(Buy.getName(buy)), buy.name != undefined)
            Game.getInstance().add.existing(info);
            info.show();
        }
    }

    public static onFinishPaymentProcessing():void{
        ShopService.paymentsLoaded = true;
        if(this.circle) {
            this.circle.hide();
            this.circle = null;
        }
    }
}