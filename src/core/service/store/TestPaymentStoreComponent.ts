
export default class TestPaymentStoreComponent {

    private static LS_NEW_BUY_PRODUCT_CODE = "newBuyProductCode";

    public static getNewBuyProductCode(): string {
        return localStorage.getItem(this.LS_NEW_BUY_PRODUCT_CODE);
    }

    public static setNewBuyProductCode(productCode: string): void {
        return localStorage.setItem(this.LS_NEW_BUY_PRODUCT_CODE, productCode);
    }


}