export type YandexRewardedVideoFinishReason = 'rewarded' | 'closed' | 'error' | 'offline' | 'unavailable';

import GameClock from '../GameClock';
import LiveConfig from '../LiveConfig';
import CloudProfileService from '../CloudProfileService';
export default class YandexGamesHelper {

    private static ysdk: any = null;
    private static payments: any = null;
    private static initPromise: Promise<void> | null = null;
    private static readySent = false;
    private static gameplayActive = false;
    private static adInProgress=false;
    private static catalogById: { [id: string]: any } = {};
    private static player: any;
    private static profileReady=false;
    private static profileQueue: Promise<void> = Promise.resolve();
    private static profileTimer:any;
    private static snapshot:any;

    public static init(): Promise<void> {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise<void>((resolve) => {
            const yaGames = (window as any).YaGames;
            if (!yaGames || typeof yaGames.init !== 'function') {
                console.log('YandexGamesHelper: YaGames SDK is unavailable');
                resolve();
                return;
            }

            yaGames.init()
                .then((ysdk: any) => {
                    this.ysdk = ysdk;
                    if(typeof ysdk.serverTime==='function')GameClock.useSource(()=>ysdk.serverTime());
                    if(typeof ysdk.getFlags==='function')ysdk.getFlags().then(flags=>LiveConfig.apply(flags)).catch(()=>{});
                    return this.initPayments();
                })
                .catch((error: any) => {
                    console.log('YandexGamesHelper: init failed');
                    console.log(error);
                })
                .then(() => resolve());
        });

        return this.initPromise;
    }

    public static isInitialized(): boolean {
        return this.ysdk != null;
    }
    public static canPurchase(id:string):boolean {return !!(this.payments&&this.payments.purchase&&this.catalogById[id]);}
    public static getPlayerSignature():Promise<string>{return this.init().then(()=>this.ysdk.getPlayer({signed:true})).then(player=>{if(!player.signature)throw new Error('YANDEX_SIGNED_AUTH_REQUIRED');return player.signature;});}

    public static loadProfile():Promise<any> {
        return this.init().then(()=>{
            if(!this.ysdk||typeof this.ysdk.getPlayer!=='function')throw new Error('Облачное сохранение недоступно');
            return this.ysdk.getPlayer();
        }).then(player=>{this.player=player;return player.getData(['profile']);}).then(data=>{this.profileReady=true;return data.profile||null;});
    }
    public static saveProfile(profile:any):Promise<void> {
        const snapshot=JSON.parse(JSON.stringify(profile));
        if(new Blob([JSON.stringify(snapshot)]).size>190000)return Promise.reject(new Error('Профиль превышает лимит сохранения'));
        const work=()=>{
            if(!this.player||!this.profileReady)throw new Error('Сначала восстановите облачный профиль');
            return this.player.setData({profile:snapshot},true);
        };
        const next=this.profileQueue.then(work,work);this.profileQueue=next.catch(()=>{});return next;
    }
    public static queueProfile(profile:any):void {
        if(!this.profileReady)return;
        this.snapshot=JSON.parse(JSON.stringify(profile));
        clearTimeout(this.profileTimer);
        this.profileTimer=setTimeout(()=>this.saveProfile(this.snapshot).catch(()=>{}),2500);
    }

    public static markReady(): void {
        if (this.readySent || !this.ysdk || !this.ysdk.features || !this.ysdk.features.LoadingAPI) {
            return;
        }

        this.readySent = true;
        this.ysdk.features.LoadingAPI.ready();
    }

    public static startGameplay(): void {
        if (this.gameplayActive || !this.ysdk || !this.ysdk.features || !this.ysdk.features.GameplayAPI) {
            return;
        }

        this.gameplayActive = true;
        this.ysdk.features.GameplayAPI.start();
    }

    public static stopGameplay(): void {
        if (!this.gameplayActive || !this.ysdk || !this.ysdk.features || !this.ysdk.features.GameplayAPI) {
            return;
        }

        this.gameplayActive = false;
        this.ysdk.features.GameplayAPI.stop();
    }

    public static canShowRewardedVideo(): boolean {
        return !!(this.ysdk && this.ysdk.adv && this.ysdk.adv.showRewardedVideo);
    }

    public static showFullscreenAdv(onFinished?: (wasShown: boolean) => void, resumeGameplayAfterClose?: boolean): void {
        if(this.adInProgress)return;
        this.stopGameplay();
        let finished=false;

        if (!this.ysdk || !this.ysdk.adv || !this.ysdk.adv.showFullscreenAdv) {
            if (resumeGameplayAfterClose) {
                this.startGameplay();
            }
            if (onFinished) {
                onFinished(false);
            }
            return;
        }

        this.adInProgress=true;
        this.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: (wasShown: boolean) => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(!!wasShown);
                    }
                },
                onError: (error: any) => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    console.log('YandexGamesHelper: fullscreen adv failed');
                    console.log(error);
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(false);
                    }
                },
                onOffline: () => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(false);
                    }
                }
            }
        });
    }

    public static showRewardedVideo(onRewarded: () => void, onFinished?: (rewarded: boolean, reason: YandexRewardedVideoFinishReason) => void, resumeGameplayAfterClose?: boolean): void {
        if(this.adInProgress)return;
        this.stopGameplay();

        if (!this.canShowRewardedVideo()) {
            if (resumeGameplayAfterClose) {
                this.startGameplay();
            }
            if (onFinished) {
                onFinished(false, 'unavailable');
            }
            return;
        }

        let rewarded = false,finished=false;

        this.adInProgress=true;
        this.ysdk.adv.showRewardedVideo({
            callbacks: {
                onRewarded: () => {
                    if(finished||rewarded)return;
                    rewarded = true;
                    onRewarded();
                },
                onClose: () => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(rewarded, rewarded ? 'rewarded' : 'closed');
                    }
                },
                onError: (error: any) => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    console.log('YandexGamesHelper: rewarded video failed');
                    console.log(error);
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(rewarded, rewarded?'rewarded':'error');
                    }
                },
                onOffline: () => {
                    if(finished)return;finished=true;this.adInProgress=false;
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(rewarded, rewarded?'rewarded':'offline');
                    }
                }
            }
        });
    }

    public static getCatalogPrice(productId: string, fallback: string): string {
        let product = this.catalogById[productId];
        return product && product.price ? product.price : fallback;
    }

    public static purchase(productId: string, developerPayload?:string): Promise<any> {
        return this.init().then(() => {
            if (!this.payments || typeof this.payments.purchase !== 'function') {
                throw new Error('YandexGamesHelper: payments are unavailable');
            }

            return this.payments.purchase({ id: productId,developerPayload });
        });
    }

    public static getPurchases(): Promise<any> {
        return this.init().then(() => {
            if (!this.payments || typeof this.payments.getPurchases !== 'function') {
                return [];
            }

            return this.payments.getPurchases();
        });
    }

    public static consumePurchase(purchaseToken: string): Promise<void> {
        return this.init().then(() => {
            if (!this.payments || typeof this.payments.consumePurchase !== 'function' || !purchaseToken) {
                return;
            }

            return this.payments.consumePurchase(purchaseToken);
        });
    }

    private static initPayments(): Promise<void> {
        if (!this.ysdk || typeof this.ysdk.getPayments !== 'function') {
            return Promise.resolve();
        }

        return this.ysdk.getPayments({ signed: true })
            .then((payments: any) => {
                this.payments = payments;
                if (!payments || typeof payments.getCatalog !== 'function') {
                    return;
                }

                return payments.getCatalog().then((products: any[]) => {
                    this.catalogById = {};
                    (products || []).forEach(product => {
                        if (product && product.id) {
                            this.catalogById[product.id] = product;
                        }
                    });
                });
            })
            .catch((error: any) => {
                console.log('YandexGamesHelper: payments init failed');
                console.log(error);
                this.payments = null;
            });
    }
}
