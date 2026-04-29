import AnimationUtils from '../../../core/utils/AnimationUtils';
import Settings from '../../../core/service/Settings';
import BasePanel from '../../component/panel/BasePanel';
import ShopBigPanel from './ShopBigPanel';
import ShopSectionPanel from './ShopSectionPanel';
import ShopSmallPanel from './ShopSmallPanel';

export default class ShopBankSectionPanel extends ShopSectionPanel {
    private static readonly PANEL_POSITIONS = [
        { x: -313, y: -182 },
        { x: -6, y: -181 },
        { x: 302, y: -181 },
        { x: -313, y: 111 },
        { x: 146, y: 107 },
        { x: -311, y: 404 },
        { x: 146, y: 402 }
    ];

    private panels: BasePanel[] = [];

    constructor(game: Phaser.Game, callbackOnBuy?: () => void) {
        super(game, "bankSection");

        Settings.BUYS.filter(buy => !buy.artifactId).forEach((buy, index) => {
            let panel: BasePanel;
            const callback = () => callbackOnBuy && callbackOnBuy();

            if (buy.name) {
                panel = new ShopBigPanel(this.game, "buy" + (index + 1), 0, 0, buy, callback);
            } else {
                panel = new ShopSmallPanel(this.game, "buy" + (index + 1), 0, 0, buy, callback);
            }

            const position = ShopBankSectionPanel.PANEL_POSITIONS[index];
            panel.x = position ? position.x : 0;
            panel.y = position ? position.y : 0;
            panel.alpha = 0;
            this.addSprite(panel);
            this.panels.push(panel);
        });
    }

    public showSection(animate?: boolean): void {
        super.showSection(animate);

        if (!animate) {
            this.panels.forEach(panel => panel.alpha = 1);
            return;
        }

        this.panels.forEach(panel => panel.alpha = 0);
        this.animateRange(0, 3, 200);
        this.animateRange(3, 5, 400);
        this.animateRange(5, this.panels.length, 600);
    }

    public hideSection(): void {
        super.hideSection();
        this.panels.forEach(panel => panel.alpha = 0);
    }

    private animateRange(start: number, end: number, delay: number): void {
        for (let i = start; i < end && i < this.panels.length; i++) {
            const panel = this.panels[i];
            AnimationUtils.appear2(this.game, panel, delay, 1, 1, panel instanceof ShopBigPanel ? 0.985 : 1);
        }
    }
}
