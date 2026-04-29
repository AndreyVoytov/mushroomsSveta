import HouseScreen from './../../screen/HouseScreen';
import ClosablePanel from './../../component/panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import LocalizationService from '../../../core/localization/LocalizationService';
import ShopBankSectionPanel from './ShopBankSectionPanel';
import ShopHeroesSectionPanel from './ShopHeroesSectionPanel';
import ShopItemsSectionPanel from './ShopItemsSectionPanel';
import ShopSectionPanel from './ShopSectionPanel';
import ShopTabButton, { ShopTabId } from './ShopTabButton';

export default class ShopPanel extends ClosablePanel {
    private screen: Phaser.State;

    private header: Phaser.Sprite;
    private navBackground: Phaser.Sprite;
    private activeTabSprite: Phaser.Sprite;
    private titleLabel: Label;
    private closeButton: Phaser.Button;
    private activeTab: ShopTabId = 'bank';
    private defaultTab: ShopTabId = 'bank';
    private tabs: { [key: string]: ShopTabButton } = {};
    private sections: { [key: string]: ShopSectionPanel } = {};

    constructor(game: Phaser.Game, screen: Phaser.State, callbackOnBuy?: () => void, defaultTab: ShopTabId = 'bank') {
        super(game, game.width / 2 - 1, game.height / 2 - 45, true, "blank", 1.04);
        this.game = game;
        this.screen = screen;
        this.defaultTab = defaultTab;
        this.activeTab = defaultTab;
        this.fixedToCamera = true;

        this.createSections(callbackOnBuy);
        this.createNavigation();

        this.header = this.attachSprite("shopHeader");
        this.header.scale.set(0.78);

        this.titleLabel = this.attachText("shopTitle", LocalizationService.get('ui.shopTitle', 'Shop'), {
            font: "50px Bookman Old Style",
            fill: "#f7efe8",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 360
        });
        this.titleLabel.anchor.set(0.5);

        this.closeButton = this.attachButton("circleOrange", () => this.close());
        this.closeButton.name = "closeButton";
        this.closeButton.tint = 0xCC7777;

        const cross = SpriteUtils.createSprite(game, 0, 0, "closeButton", "cross");
        cross.anchor.set(0.5);
        cross.scale.set(1 / 1.34 * 2);
        cross.alpha = 0.5;
        cross.tint = 0x333333;
        this.closeButton.addChild(cross);

        this.layout();
        this.selectTab(this.defaultTab, false, false);
    }

    protected onClose() {
        if (this.screen instanceof HouseScreen) {
            if (this.screen.startLevelPanel.alpha == 0 || !this.screen.startLevelPanel.visible || this.screen.startLevelPanel.scale.x == 0) {
                this.screen.showUI(true);
            }
            this.screen.shopShown = false;
        }
    }

    protected onShow() {
        this.selectTab(this.defaultTab, false, true);

        if (this.screen instanceof HouseScreen) {
            this.screen.hideUI(0, true);
            this.screen.shopShown = true;
        }
    }

    public setDefaultTab(tab: ShopTabId, switchImmediately?: boolean): ShopPanel {
        this.defaultTab = tab;

        if (switchImmediately || this.opened) {
            this.selectTab(tab, false, this.opened);
        }

        return this;
    }

    private createSections(callbackOnBuy?: () => void): void {
        this.sections.bank = new ShopBankSectionPanel(this.game, () => {
            if (this.opened && !this.processing) {
                this.close();
            }
            if (callbackOnBuy) {
                callbackOnBuy();
            }
        });
        this.sections.items = new ShopItemsSectionPanel(this.game);
        this.sections.heroes = new ShopHeroesSectionPanel(this.game);

        this.addSprite(this.sections.bank);
        this.addSprite(this.sections.items);
        this.addSprite(this.sections.heroes);
    }

    private createNavigation(): void {
        this.navBackground = this.attachSprite("shopNavBg");
        this.navBackground.scale.set(0.96, 0.94);

        this.activeTabSprite = this.attachSprite("shopNavSelected");
        this.activeTabSprite.scale.set(0.93);

        this.tabs.bank = new ShopTabButton(this.game, "bankTab", this.getTabLabel('bank'), () => this.selectTab('bank', true, false));
        this.tabs.items = new ShopTabButton(this.game, "itemsTab", this.getTabLabel('items'), () => this.selectTab('items', true, false));
        this.tabs.heroes = new ShopTabButton(this.game, "heroesTab", this.getTabLabel('heroes'), () => this.selectTab('heroes', true, false));

        this.addSprite(this.tabs.bank);
        this.addSprite(this.tabs.items);
        this.addSprite(this.tabs.heroes);
    }

    private layout(): void {
        this.sections.bank.y = 124;
        this.sections.items.y = 124;
        this.sections.heroes.y = 124;

        this.navBackground.x = 0;
        this.navBackground.y = -283;

        this.activeTabSprite.y = -283;

        this.header.x = 0;
        this.header.y = -385;

        this.titleLabel.x = 0;
        this.titleLabel.y = -402;

        this.closeButton.x = 382;
        this.closeButton.y = -405;
        this.closeButton.scale.set(0.9);

        this.layoutTab(this.tabs.bank, 'bank');
        this.layoutTab(this.tabs.items, 'items');
        this.layoutTab(this.tabs.heroes, 'heroes');
    }

    private layoutTab(tab: ShopTabButton, id: ShopTabId): void {
        tab.x = this.getTabCenterX(id);
        tab.y = -286;
        tab.setHitAreaSize(292, 94);
    }

    private getTabCenterX(tab: ShopTabId): number {
        switch (tab) {
            case 'bank':
                return -291;
            case 'items':
                return 0;
            case 'heroes':
                return 291;
            default:
                return 0;
        }
    }

    private selectTab(tab: ShopTabId, animateSelector: boolean, animateSection: boolean): void {
        this.activeTab = tab;

        Object.keys(this.tabs).forEach(tabId => {
            this.tabs[tabId].setActive(tabId == tab);
        });

        Object.keys(this.sections).forEach(sectionId => {
            if (sectionId == tab) {
                this.sections[sectionId].showSection(animateSection);
            } else {
                this.sections[sectionId].hideSection();
            }
        });

        const targetX = this.getTabCenterX(tab);
        this.game.tweens.removeFrom(this.activeTabSprite);
        if (animateSelector) {
            this.game.add.tween(this.activeTabSprite).to({ x: targetX }, 140, Phaser.Easing.Quadratic.Out, true);
        } else {
            this.activeTabSprite.x = targetX;
        }
    }

    private getTabLabel(tab: ShopTabId): string {
        const fallback = LocalizationService.isRussian()
            ? (tab == 'bank' ? 'Банк' : (tab == 'items' ? 'Предметы' : 'Герои'))
            : (tab == 'bank' ? 'Bank' : (tab == 'items' ? 'Items' : 'Heroes'));
        return LocalizationService.get('ui.shopTab.' + tab, fallback);
    }
}
