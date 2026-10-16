import ShopService from '../../../core/service/ShopService';
import BasePanel from '../panel/BasePanel';
import Buy from '../../../core/model/shop/Buy';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UiLayout from '../../../core/utils/UiLayout';
import Label from '../panel/Label';

export default class ShopSmallPanel extends BasePanel {
    constructor(game: Phaser.Game, name: string, x: number, y: number, buy: Buy, callbackOnBuy: () => void) {
        super(game, x, y, name, 'blank');
        const panel = this.attachSprite('uiShopCard', 'display');
        panel.width = 294;panel.height = 282;
        const count = this.attachText('gemsCount', '' + buy.gems, {font:'bold 40px Manrope',fill:Label.INK});
        count.y = -65;UiLayout.fit(count, 200, 50);
        const gems = this.attachSprite('gems', 'gemsBig');
        gems.y = 8;SpriteUtils.fitIcon(gems, 104, 100);
        const button = this.attachButton('pnlButton', () => ShopService.processPayment(this.game, buy, callbackOnBuy), 'purchase');
        button.position.set(0, 95);button.width = 240;button.height = 72;
        const price = this.attachText('price', ShopService.getPriceLabel(buy), {font:'bold 34px Manrope',fill:Label.INK});
        price.position.set(0, 95);UiLayout.fit(price, 180, 46);price.inputEnabled = false;
    }
}
