import ShopService from '../../../core/service/ShopService';
import Buy from '../../../core/model/shop/Buy';
import BasePanel from '../panel/BasePanel';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UiLayout from '../../../core/utils/UiLayout';
import Label from '../panel/Label';

export default class ShopBigPanel extends BasePanel {
    constructor(game: Phaser.Game, name: string, x: number, y: number, buy: Buy, callbackOnBuy: () => void) {
        super(game, x, y, name, 'blank');
        const panel = this.attachSprite('uiShopBundle', 'display');
        panel.width = 600;panel.height = 282;
        const title = this.attachText('shopSetName', Buy.getName(buy), {font:'32px Lora',fill:Label.INK});
        title.position.set(0, -91);UiLayout.fit(title, 480, 44);
        const chest = this.attachSprite('chest1');chest.position.set(-185, 37);
        SpriteUtils.fitIcon(chest, 180, 170);
        const gems = this.attachSprite('gems');gems.position.set(38, -34);SpriteUtils.fitIcon(gems, 42, 42);
        const gemsCount = this.attachText('gemsCount', '' + buy.gems, {font:'bold 32px Manrope',fill:'#142b2d'});
        gemsCount.position.set(115, -34);UiLayout.fit(gemsCount, 130, 44);
        buy.boosters.forEach((booster, i) => {
            const bx = -20 + i * 106 + (buy.boosters.length === 2 ? 44 : 0);
            const icon = this.attachSprite(booster.type, 'booster' + i);
            icon.position.set(bx, 22);SpriteUtils.fitIcon(icon, 52, 54);
            const count = this.attachText('boosterCount' + i, '' + booster.count, {font:'bold 28px Manrope',fill:'#071d20'});
            count.position.set(bx + 37, 22);UiLayout.fit(count, 35, 38);
        });
        const button = this.attachButton('pnlButton', () => ShopService.processPayment(this.game, buy, callbackOnBuy), 'purchase');
        button.position.set(110, 99);button.width = 280;button.height = 70;
        const price = this.attachText('price', ShopService.getPriceLabel(buy), {font:'bold 32px Manrope',fill:Label.INK});
        price.position.set(110, 99);UiLayout.fit(price, 210, 45);price.inputEnabled = false;
        if (buy.oldPrice) {
            const old = this.attachText('priceOld', buy.oldPrice + ' ' + AnalyticUtils.getValuteName(), {font:'24px Manrope',fill:Label.INK});
            old.position.set(-186, 118);UiLayout.fit(old, 150, 30);
            const strike = this.game.make.graphics(old.x - old.width / 2, old.y);
            strike.lineStyle(2, 0x343c35, 1);strike.lineTo(old.width, 0);this.addChild(strike);
        }
    }
}
