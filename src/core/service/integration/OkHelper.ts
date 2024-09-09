import ShopService from "../ShopService";
import Game from './../../../view/game/Game';

export default class OkHelper {

    private static okApiInitialized = false;

    public static init() {
        OkHelper.okApiInitialized = false;

        var okScript = OkHelper.loadScript('//api.ok.ru/js/fapi5.js');
        okScript.onload = function () {
            var rParams = (window as any).FAPI.Util.getRequestParameters();

            var apiServer = rParams['api_server'];
            var apiConnection = rParams['apiconnection'];

            if (apiServer != null && apiServer != '' && apiConnection != null && apiServer != null) {
                (window as any).FAPI.init(apiServer, apiConnection, function () {
                    OkHelper.okApiInitialized = true;
                    if (Game.isSmallDesktopForOk()) {
                        (window as any).FAPI.UI.scrollTo(0, 28 + 48);
                        (window as any).FAPI.UI.setWindowSize(1200, window.innerHeight);
                    }
                }, function (error) {
                    alert('Ошибка загрузки API одноклассников. Попробуйте перезагрузить страницу. Ошибка: {' + error + '}');
                });
            } else {
                console.log('WARNING!!! okJsApi was not initialized due to absent init parameters');
            }
        };

        (window as any).API_callback = function (method: string, result: string, data: string) {
            if (method == 'showPayment') {
                // API_callback можно дёргать прямо из браузера, поэтому тут платеж не обрабатываем
                console.log("OkHelper: show payment callback:" + result)

                if (result == "ok") {
                    ShopService.checkAndApplyLastBuys();
                } else {
                    ShopService.onFinishPaymentProcessing();
                }

            } else if (method == 'showInvite') {
                if (result == "ok") {
                    let friendIds = data.split(",");
                    //TODO
                    //Табличка: "Приглашения отправлены. Когда 10 твоих друзей будут играть в игру, ты получишь +жизнь."
                }
                console.log("OkHelper: show invite callback: " + result)
            } else if (method == 'postMediatopic') {
                if (result == "ok") {
                    //TODO
                    //Вручить награду за постинг на стену
                }
                console.log("OkHelper: postMediatopic callback: " + result)
            }
        }
    }

    public static showInvite(inviteText: string, promo: string) {
        if (!OkHelper.okApiInitialized) {
            alert('Система приглашения друзей чуть-чуть не успела загрузиться. Дайте ей 5 сек!');
            return;
        }

        (window as any).FAPI.UI.showInvite(inviteText, 'promo=' + promo);
    }

    public static showPayment(code: string, name: string, desc: string, price: number, checkUrl: string): void {
        if (!OkHelper.okApiInitialized) {
            alert('Система платежей чуть-чуть не успела загрузиться. Дайте ей 5 сек!');
            return;
        }

        (window as any).FAPI.UI.showPayment(name, desc, code, price, null, null, 'ok', 'true');
    }

    public static postToWall(mark: string, text: string, imageUrl: string) {
        if (!OkHelper.okApiInitialized) {
            alert('Система постинга в ленту чуть-чуть не успела загрузиться. Дайте ей 5 сек!');
            return;
        }
        (window as any).FAPI.UI.postMediatopic(OkHelper.createAttachment(mark, text, imageUrl), false);
    }

    private static createAttachment(mark, text, imageUrl) {
        return {
            "media": [{
                "type": "text",
                "text": text
            },
            {
                "type": "app",
                "images": [{
                    "mark": mark,
                    "title": "Присоединяйся к игре!",
                    "url": imageUrl
                }]
            }]
        };
    }

    private static loadScript(path) {
        var script = document.createElement('script');
        script.setAttribute('defer', 'defer');
        script.setAttribute('src', path);
        document.head.appendChild(script);
        return script;
    }
}