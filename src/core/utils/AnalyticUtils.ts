import { EGAProgressionStatus, GameAnalytics } from 'gameanalytics';
import Buy from '../model/shop/Buy';
import CustomizationType from '../model/enum/CustomizationType';
import UserService from '../service/UserService';
import Settings from '../service/Settings';
import NeverError from './NeverError';
import LocalizationService from '../localization/LocalizationService';
import LocalizationKey from '../localization/LocalizationKey';
export default class AnalyticUtils {


    public static getCustomization(): CustomizationType {
        let href = window.location.href.toLowerCase();
        let referrer = (document.referrer || '').toLowerCase();
        let yandexPlatform = this.getUrlParameter("platform");

        if (yandexPlatform == 'yandex-games' || yandexPlatform == 'yandex' || yandexPlatform == 'yg'
            || href.indexOf("yandex.ru/games") != -1 || href.indexOf("yandex.com/games") != -1
            || referrer.indexOf("yandex.ru/games") != -1 || referrer.indexOf("yandex.com/games") != -1
            || referrer.indexOf("games.s3.yandex.net") != -1) {
            return CustomizationType.yandexGames;
        }

        if(window.location.href.indexOf("ok.") != -1){ 
            return CustomizationType.odkl;
        } else if (window.location.href.indexOf("localhost") != -1) {
            return CustomizationType.webDev;
        // } else {
        //     return CustomizationType.android;
        }
        return CustomizationType.webDev;
    }

    private static needLogging():boolean{
        let c = AnalyticUtils.getCustomization();
        switch(c){
            case CustomizationType.odkl: 
            case CustomizationType.android:
                return true;
            case CustomizationType.yandexGames:
            case CustomizationType.webDev: 
                return true;
                return false;
            default:
                throw new NeverError(c);
        }
    }

    public static haveLocalStorage():boolean{
        return true;
        // let c = AnalyticUtils.getCustomization();
        // switch(c){
        //     case CustomizationType.odkl:
        //         return false;
        //     case CustomizationType.webDev:
        //     case CustomizationType.android:
        //         return true;
        //     default:
        //         throw new NeverError(c);
        // }
    }

    public static canPlayWithoutInternet():boolean{
        return true;
        // let c = AnalyticUtils.getCustomization();
        // switch(c){
        //     case CustomizationType.odkl:
        //         case CustomizationType.webDev:
        //         return false;
        //     case CustomizationType.android:
        //         return true;
        //     default:
        //         throw new NeverError(c);
        // }
    }

    public static init(): void {
        if (!this.needLogging()) { return; }
        GameAnalytics.setEnabledInfoLog(true);
        GameAnalytics.setEnabledVerboseLog(true);
        GameAnalytics.configureBuild(Settings.ANALYTICS_BUILD_VERSION);
        GameAnalytics.initialize(Settings.ANALYTICS_GAME_KEY, Settings.ANALYTICS_GAME_SECRET)
    }

    public static logPurchase(b: Buy, location: string) {
        if(!this.needLogging()) return; 

        GameAnalytics.addDesignEvent("purschase:level" + this.toFourNumbers(UserService.getUser().getCurrentForest() + 1), b.price)
        GameAnalytics.addBusinessEvent("RUB", b.price * 100, b.id, b.id, "shop");
    }

    public static logLevelStart() {
        if(!this.needLogging()) return;

        let user = UserService.getUser();
        GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, "level" + this.toFourNumbers(user.getCurrentForest() + 1));
    }

    public static logLevelComplete(steps: number) {
        if(!this.needLogging()) return;

        GameAnalytics.addProgressionEvent(EGAProgressionStatus.Complete, "level" + this.toFourNumbers(UserService.getUser().getCurrentForest() + 1),
            "", "", steps);
    }

    public static logLevelFail(aims: number) {
        if(!this.needLogging()) return;

        GameAnalytics.addProgressionEvent(EGAProgressionStatus.Fail, "level" + this.toFourNumbers(UserService.getUser().getCurrentForest()+ 1),
            "", "", aims);
    }

    public static logContinueLevelComplete(aims: number) {
        if(!this.needLogging()) return;

        GameAnalytics.addDesignEvent("continueLevel:level" + this.toFourNumbers(UserService.getUser().getCurrentForest()+ 1), aims)
    }

    private static toFourNumbers(n:number){
        let nstr = "" + n;
        let zerosToAdd = Math.max(0, 4 - nstr.length);
        for(let i=0; i < zerosToAdd; i++){
            nstr = "0"+nstr;
        }
        return nstr;
    }

    public static getValuteName():string{
        let cust = AnalyticUtils.getCustomization();
        switch(cust){
            case CustomizationType.odkl:
                return LocalizationService.get(LocalizationKey.ui('currency.ok'))
            case CustomizationType.yandexGames:
                return LocalizationService.get(LocalizationKey.ui('currency.yan'), 'YAN');
            case CustomizationType.android:
            case CustomizationType.webDev:
                return LocalizationService.get(LocalizationKey.ui('currency.rub'));
            default:
                throw new NeverError(cust);
        }
    }

    private static getUrlParameter(name:string) : string {
        name = name.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
        let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        let results = regex.exec(window.location.href);
        return results == null ? null : results[1];
    }

    


}
