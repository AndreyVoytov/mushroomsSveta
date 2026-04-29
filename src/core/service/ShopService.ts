import GameText from '../localization/GameText';

import Buy from '../model/shop/Buy';
import ForestScreen from './../../view/screen/ForestScreen';
import AnalyticUtils from '../utils/AnalyticUtils';
import CustomizationType from '../model/enum/CustomizationType';
import UserService from './UserService';
import NeverError from '../utils/NeverError';
import OkHelper from './integration/OkHelper';
import YandexGamesHelper from './integration/YandexGamesHelper';
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
    private static YANDEX_PROCESSED_PURCHASES_LS = "yandexProcessedPurchases";

    public static processPayment(game: Phaser.Game, buy: Buy, callbackOnBuy: () => void) {
        this.paymentsLoaded = false;
        this.callbackOnBuy = callbackOnBuy;

        if (AnalyticUtils.getCustomization() == CustomizationType.yandexGames) {
            this.showProgress(game);
            this.processYandexPayment(buy);
            return;
        }

        this.initiatePayment(buy);

        if (AnalyticUtils.getCustomization() == CustomizationType.webDev) {
            this.checkAndApplyLastBuys(true);
            return;
        }

        //РџРѕРґСЃС‚СЂР°С…РѕРІРєР°: 10 РјРёРЅСѓС‚ РїС‹С‚Р°РµРјСЃСЏ РїРѕР»СѓС‡РёС‚СЊ РїР»Р°С‚РµР¶ РЅР°РїСЂСЏРјСѓСЋ СЃ СЃРµСЂРІРµСЂР°
        let loop = game.time.events.repeat(3000, 400, () => {
            if(!this.paymentsLoaded){
                ShopService.checkAndApplyLastBuys(true);
            } else {
                loop.timer.remove(loop);
            }
        })
    }

    public static getPriceLabel(buy: Buy): string {
        let fallback = buy.price + " " + AnalyticUtils.getValuteName();
        if (AnalyticUtils.getCustomization() == CustomizationType.yandexGames) {
            return YandexGamesHelper.getCatalogPrice(buy.id, fallback);
        }
        return fallback;
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
            case CustomizationType.yandexGames:
                this.processYandexPayment(buy);
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
            case CustomizationType.yandexGames:
                this.applyYandexBuys(silentMode);
                break;
            default:
                throw new NeverError(cust);
        }
    }

    private static applyBuys(silentMode?: boolean): void {
        let game = Game.getInstance();

        if(!silentMode){
            this.showProgress(game);
        }

        PaymentStoreComponent.getAndApplyNewPayments(silentMode);
        
    }

    private static applyYandexBuys(silentMode?: boolean): void {
        if(!silentMode){
            this.showProgress(Game.getInstance());
        }

        let appliedBuys: Buy[] = [];

        YandexGamesHelper.getPurchases()
            .then((purchases: any[]) => {
                let actualPurchases = (purchases || []).filter(purchase => this.findBuy(this.getYandexProductId(purchase)));

                return actualPurchases.reduce((chain, purchase) => {
                    return chain.then(() => this.applyYandexPurchase(purchase, appliedBuys));
                }, Promise.resolve());
            })
            .then(() => {
                if (appliedBuys.length > 0 && ShopService.callbackOnBuy) {
                    ShopService.callbackOnBuy();
                }
                this.onFinishPaymentProcessing();
                appliedBuys.forEach(buy => this.showBuyConfirmation(buy));
            })
            .catch((error: any) => {
                console.log('ShopService: Yandex purchases sync failed');
                console.log(error);
                this.onFinishPaymentProcessing();
            });
    }

    private static applyTestBuy():void{
        let productCode = TestPaymentStoreComponent.getNewBuyProductCode();
        TestPaymentStoreComponent.setNewBuyProductCode("");
        let buy = Settings.BUYS.filter(b => b.id == productCode).shift();
        if(buy) {
            Buy.applyToUser(buy, UserService.getUser());
            if (ShopService.callbackOnBuy) this.callbackOnBuy();
            this.onFinishPaymentProcessing();
            this.showBuyConfirmation(buy);
        }
    }

    public static onFinishPaymentProcessing():void{
        ShopService.paymentsLoaded = true;
        ShopService.callbackOnBuy = null;
        if(this.circle) {
            this.circle.hide();
            this.circle = null;
        }
    }

    private static processYandexPayment(buy: Buy): void {
        let appliedBuys: Buy[] = [];

        YandexGamesHelper.purchase(buy.id)
            .then((purchase: any) => this.applyYandexPurchase(purchase, appliedBuys))
            .then(() => {
                if (appliedBuys.length > 0 && ShopService.callbackOnBuy) {
                    ShopService.callbackOnBuy();
                }

                this.onFinishPaymentProcessing();
                appliedBuys.forEach(appliedBuy => this.showBuyConfirmation(appliedBuy));
            })
            .catch((error: any) => {
                console.log('ShopService: Yandex payment failed');
                console.log(error);
                this.onFinishPaymentProcessing();
            });
    }

    private static applyYandexPurchase(purchase: any, appliedBuys: Buy[]): Promise<void> {
        let buy = this.findBuy(this.getYandexProductId(purchase));
        let purchaseToken = this.getYandexPurchaseToken(purchase);

        if (!buy) {
            return this.consumeYandexPurchase(purchaseToken);
        }

        if (purchaseToken && this.isProcessedYandexPurchase(purchaseToken)) {
            return this.consumeYandexPurchase(purchaseToken);
        }

        Buy.applyToUser(buy, UserService.getUser());
        appliedBuys.push(buy);

        if (purchaseToken) {
            this.markYandexPurchaseProcessed(purchaseToken);
        }

        AnalyticUtils.logPurchase(buy, Game.getInstance().state.getCurrentState() instanceof ForestScreen ? "forestScreen" : "houseScreen");

        return this.consumeYandexPurchase(purchaseToken).catch((error: any) => {
            console.log('ShopService: failed to consume Yandex purchase');
            console.log(error);
        });
    }

    private static consumeYandexPurchase(purchaseToken: string): Promise<void> {
        if (!purchaseToken) {
            return Promise.resolve();
        }

        return YandexGamesHelper.consumePurchase(purchaseToken);
    }

    private static showBuyConfirmation(buy: Buy): void {
        let info = new BuyConfirmPanel(
            Game.getInstance(),
            LocalizationService.get('ui.purchaseReceived'),
            LocalizationService.get('ui.ok'),
            GameText.purchaseReward(Buy.getName(buy)),
            buy.name != undefined && !buy.artifactId
        )
        Game.getInstance().add.existing(info);
        info.show();
    }

    private static showProgress(game: Phaser.Game): void {
        if (this.circle) {
            return;
        }

        this.circle = new CircleProgressPanel(game);
        game.add.existing(this.circle);
        this.circle.show();
    }

    private static findBuy(productId: string): Buy {
        return Settings.BUYS.filter(b => b.id == productId).shift();
    }

    private static getYandexProductId(purchase: any): string {
        return purchase ? (purchase.productID || purchase.productId || purchase.id) : null;
    }

    private static getYandexPurchaseToken(purchase: any): string {
        return purchase ? (purchase.purchaseToken || purchase.token) : null;
    }

    private static isProcessedYandexPurchase(purchaseToken: string): boolean {
        return this.getProcessedYandexPurchases().indexOf(purchaseToken) != -1;
    }

    private static markYandexPurchaseProcessed(purchaseToken: string): void {
        let purchases = this.getProcessedYandexPurchases();
        if (purchases.indexOf(purchaseToken) != -1) {
            return;
        }

        purchases.push(purchaseToken);
        localStorage.setItem(this.YANDEX_PROCESSED_PURCHASES_LS, JSON.stringify(purchases));
    }

    private static getProcessedYandexPurchases(): string[] {
        let raw = localStorage.getItem(this.YANDEX_PROCESSED_PURCHASES_LS);
        if (!raw) {
            return [];
        }

        try {
            let parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }
}
