export type YandexRewardedVideoFinishReason = 'rewarded' | 'closed' | 'error' | 'offline' | 'unavailable';

export default class YandexGamesHelper {

    private static ysdk: any = null;
    private static payments: any = null;
    private static initPromise: Promise<void> = null;
    private static readySent = false;
    private static gameplayActive = false;
    private static catalogById: { [id: string]: any } = {};

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
        this.stopGameplay();

        if (!this.ysdk || !this.ysdk.adv || !this.ysdk.adv.showFullscreenAdv) {
            if (resumeGameplayAfterClose) {
                this.startGameplay();
            }
            if (onFinished) {
                onFinished(false);
            }
            return;
        }

        this.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: (wasShown: boolean) => {
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(!!wasShown);
                    }
                },
                onError: (error: any) => {
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

        let rewarded = false;

        this.ysdk.adv.showRewardedVideo({
            callbacks: {
                onRewarded: () => {
                    rewarded = true;
                    onRewarded();
                },
                onClose: () => {
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(rewarded, rewarded ? 'rewarded' : 'closed');
                    }
                },
                onError: (error: any) => {
                    console.log('YandexGamesHelper: rewarded video failed');
                    console.log(error);
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(false, 'error');
                    }
                },
                onOffline: () => {
                    if (resumeGameplayAfterClose) {
                        this.startGameplay();
                    }
                    if (onFinished) {
                        onFinished(false, 'offline');
                    }
                }
            }
        });
    }

    public static getCatalogPrice(productId: string, fallback: string): string {
        let product = this.catalogById[productId];
        return product && product.price ? product.price : fallback;
    }

    public static purchase(productId: string): Promise<any> {
        return this.init().then(() => {
            if (!this.payments || typeof this.payments.purchase !== 'function') {
                throw new Error('YandexGamesHelper: payments are unavailable');
            }

            return this.payments.purchase({ id: productId });
        });
    }

    public static getPurchases(): Promise<any[]> {
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

        return this.ysdk.getPayments({ signed: false })
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
