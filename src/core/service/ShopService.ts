import GameText from '../localization/GameText';

import Buy from '../model/shop/Buy';
import ForestScreen from './../../view/screen/ForestScreen';
import AnalyticUtils from '../utils/AnalyticUtils';
import CustomizationType from '../model/enum/CustomizationType';
import UserService from './UserService';
import Telemetry from './Telemetry';
import NeverError from '../utils/NeverError';
import OkHelper from './integration/OkHelper';
import YandexGamesHelper from './integration/YandexGamesHelper';
import PaymentStoreComponent from './store/PaymentStoreComponent';
import TestPaymentStoreComponent from './store/TestPaymentStoreComponent';
import CircleProgressPanel from '../../view/component/panel/CircleProgressPanel';
import Game from '../../view/game/Game';
import Settings from './Settings';
import CloudProfileService from './CloudProfileService';
import BuyConfirmPanel from '../../view/component/house/BuyConfirmPanel';
import LocalizationService from '../localization/LocalizationService';

export default class ShopService {

    public static paymentsLoaded = false;
    public static paymentInProgress=false;
    public static callbackOnBuy:() => void;
    private static circle:CircleProgressPanel;
    private static purchaseQueue:Promise<void>=Promise.resolve();

    public static processPayment(game: Phaser.Game, buy: Buy, callbackOnBuy: () => void) {
        if(this.paymentInProgress)return;
        if(!this.canPurchase(buy)){const panel=new BuyConfirmPanel(game,LocalizationService.get('ui.shop.unavailableTitle'),LocalizationService.get('ui.ok'),LocalizationService.get('ui.shop.unavailableBody'),false);game.add.existing(panel);panel.show();return;}
        this.paymentInProgress=true;
        Telemetry.track('purchase_start',{productId:buy.id});
        this.paymentsLoaded = false;
        this.callbackOnBuy = callbackOnBuy;

        if (AnalyticUtils.getCustomization() == CustomizationType.yandexGames) {
            this.showProgress(game);
            this.processYandexPayment(buy);
            return;
        }

        if (AnalyticUtils.getCustomization() == CustomizationType.webDev) {
            if(CloudProfileService.isTestPaymentMode()){this.initiatePayment(buy);this.checkAndApplyLastBuys(true);}
            else{this.showProgress(game);CloudProfileService.intent('web',buy.id).then(intent=>CloudProfileService.call('web_checkout',{intentId:intent.intentId})).then(result=>{
                const url=new URL(result.checkoutUrl);if(url.protocol!=='https:')throw new Error('INVALID_CHECKOUT');window.location.assign(url.href);
            }).catch(()=>{Telemetry.track('purchase_failed',{productId:buy.id,reason:'checkout_unavailable'});this.onFinishPaymentProcessing();});}
            return;
        }

        this.initiatePayment(buy);

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
        if(!this.canPurchase(buy))return LocalizationService.get('ui.shop.unavailableShort');
        let fallback = buy.price + " " + AnalyticUtils.getValuteName();
        if (AnalyticUtils.getCustomization() == CustomizationType.yandexGames) {
            return YandexGamesHelper.getCatalogPrice(buy.id, fallback);
        }
        return fallback;
    }

    public static canPurchase(buy:Buy):boolean {
        const platform=AnalyticUtils.getCustomization();
        if(platform===CustomizationType.yandexGames)return CloudProfileService.isReady()&&YandexGamesHelper.canPurchase(buy.id);
        if(platform===CustomizationType.webDev)return CloudProfileService.isTestPaymentMode()||(CloudProfileService.isReady()&&CloudProfileService.config().webPaymentsEnabled===true);
        return true;
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
                if(CloudProfileService.isTestPaymentMode())this.applyTestBuy();
                break;
            case CustomizationType.android:
                //TODO add payment checking with server
                this.applyTestBuy();
                break;
            case CustomizationType.odkl:
                this.applyBuys(silentMode);
                break;
            case CustomizationType.yandexGames:
                if(CloudProfileService.isReady())this.applyYandexBuys(silentMode);
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
            .then(proof => this.applySignedYandexPurchases(proof,appliedBuys))
            .then(() => {
                if (appliedBuys.length > 0 && ShopService.callbackOnBuy) {
                    ShopService.callbackOnBuy();
                }
                this.onFinishPaymentProcessing();
                appliedBuys.forEach(buy => this.showBuyConfirmation(buy));
            })
            .catch((error: any) => {
                console.log('ShopService: Yandex purchases sync failed');
                this.onFinishPaymentProcessing();
            });
    }

    private static applyTestBuy():void{
        let productCode = TestPaymentStoreComponent.getNewBuyProductCode();
        TestPaymentStoreComponent.setNewBuyProductCode("");
        let buy = Settings.BUYS.filter(b => b.id == productCode).shift();
        if(buy) {
            Buy.applyToUser(buy, UserService.getUser(), 'test_purchase_grant');
            if (ShopService.callbackOnBuy) this.callbackOnBuy();
            this.onFinishPaymentProcessing();
            this.showBuyConfirmation(buy);
        }
    }

    public static onFinishPaymentProcessing():void{
        ShopService.paymentInProgress=false;
        ShopService.paymentsLoaded = true;
        ShopService.callbackOnBuy = null;
        if(this.circle) {
            this.circle.hide();
            this.circle = null;
        }
        if(typeof window.dispatchEvent==='function')window.dispatchEvent(new Event('mushrooms-payment-updated'));
    }

    private static processYandexPayment(buy: Buy): void {
        let appliedBuys: Buy[] = [];

        CloudProfileService.intent('yandex',buy.id)
            .then(intent=>YandexGamesHelper.purchase(buy.id,intent.intentId))
            .then(proof => this.applySignedYandexPurchases(proof,appliedBuys))
            .then(() => {
                if (appliedBuys.length > 0 && ShopService.callbackOnBuy) {
                    ShopService.callbackOnBuy();
                }

                this.onFinishPaymentProcessing();
                appliedBuys.forEach(appliedBuy => this.showBuyConfirmation(appliedBuy));
            })
            .catch((error: any) => {
                console.log('ShopService: Yandex payment failed');
                Telemetry.track('purchase_failed',{productId:buy.id,reason:'platform_or_save'});
                this.onFinishPaymentProcessing();
            });
    }

    private static applySignedYandexPurchases(proof:any,appliedBuys:Buy[]):Promise<void> {
        const work=async()=>{
            if(!proof||typeof proof.signature!=='string')throw new Error('SIGNED_RECEIPT_REQUIRED');
            const reply=await CloudProfileService.claimYandex(proof.signature),user=UserService.getUser();
            if(!reply.results.length){CloudProfileService.claiming=false;await CloudProfileService.flush();return;}
            try{
                PaymentStoreComponent.atomic(user,()=>{
                    reply.results.forEach(result=>{
                        if(user.processedPurchaseTokens.indexOf(result.tokenHash)>=0)return;
                        Buy.applyServerGrant(result.grantData,result.seasonId,user);
                        user.processedPurchaseTokens.push(result.tokenHash);
                        const buy=this.findBuy(result.productId);if(buy)appliedBuys.push(buy);
                        Telemetry.track('purchase_granted',{productId:result.productId,verified:true});
                    });
                });
                CloudProfileService.claiming=false;CloudProfileService.queueProfile(user);await CloudProfileService.flush();
            }catch(error){CloudProfileService.claiming=false;CloudProfileService.backup(user);CloudProfileService.conflict(reply);throw error;}
            // Consume only after the local write and versioned cloud acknowledgement.
            for(const result of reply.results)await this.consumeYandexPurchase(result.token);
        };
        const next=this.purchaseQueue.then(work,work);this.purchaseQueue=next.catch(()=>{});return next;
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

}
