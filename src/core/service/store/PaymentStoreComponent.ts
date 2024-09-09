import ServerStoreComponent from "./ServerStoreComponent";
import PaymentDto from "../../model/shop/PaymentDto";
import UserService from "../UserService";
import ShopService from "../ShopService";
import Settings from "../Settings";
import Buy from "../../model/shop/Buy";
import AnalyticUtils from "../../utils/AnalyticUtils";
import Game from "../../../view/game/Game";
import ForestScreen from "../../../view/screen/ForestScreen";
import ConfirmPanel from "../../../view/component/house/ConfirmPanel";
import BuyConfirmPanel from "../../../view/component/house/BuyConfirmPanel";

export default class PaymentStoreComponent extends ServerStoreComponent {

    private static NEW_PAYMENTS_PATH = "/../payment/new";
    private static COMMIT_PAYMENTS_PATH(productCodes: string[]){
        return "/../payment/commit/" + productCodes.join(",") + "/" + Settings.PLAIN_MODE;
    } 

    public static getAndApplyNewPayments(silentMode?: boolean): void{
        let applyedBuys:Buy[] = [];

        this.httpGet(this.NEW_PAYMENTS_PATH).then((paymentsData:string)=>{
            //TODO typesafe json parsing 
            let payments = JSON.parse(paymentsData);
                
            payments.forEach(p => {
                if(p.product_code === undefined) throw new Error("wrong response from server: payments not defined")
            })

            if (payments.length > 0) {
                if (ShopService.callbackOnBuy) ShopService.callbackOnBuy();
            }

            let actualPayments = payments.filter(payment => Settings.BUYS.filter(b => b.id == payment.product_code).shift())

            actualPayments.forEach(payment => {
                let b = Settings.BUYS.filter(b => b.id == payment.product_code).shift();
                Buy.applyToUser(b, UserService.getUser());
                applyedBuys.push(b);
            })  

            if(actualPayments.length == 0){
                throw "no payments";
            }

            let userData = JSON.stringify(UserService.getUser())
            if(!Settings.PLAIN_MODE){
                userData = this.encryptUserData(userData, this.getLocalUserId())
            }

            return this.httpPost(this.COMMIT_PAYMENTS_PATH(actualPayments.map(p=> p.id)), userData); 

        }).then((response:string)=>{
            if(response != "true") throw new Error("wrong response from server: payments not commited");
            
            ShopService.onFinishPaymentProcessing();

            applyedBuys.forEach(b=>{
                AnalyticUtils.logPurchase(b, Game.getInstance().state.getCurrentState() instanceof ForestScreen ? "forestScreen" : "houseScreen");  

                let info = new BuyConfirmPanel(Game.getInstance(), "Покупка получена!", "Ok", "Вам достается\n ~" + Buy.getName(b) + "~", b.name != undefined)
                Game.getInstance().add.existing(info);
                info.show();
            })

        }).catch((e)=>{
            console.log(e)

            if(e == "no payments" && silentMode){
                return;
            }

            ShopService.onFinishPaymentProcessing();

            applyedBuys.forEach(b => {
                Buy.takeFromUser(b, UserService.getUser())
            })

            if(!silentMode && AnalyticUtils.canPlayWithoutInternet()){
                let info = new ConfirmPanel(Game.getInstance(), "Сервер не доступен", "Ok",
                     AnalyticUtils.haveLocalStorage() ? "Проверьте ваше \n интернет-соединение!" : "Платеж будет начислен \n в течение суток.")
                Game.getInstance().add.existing(info);
                info.show();
            }
        })
    }
}