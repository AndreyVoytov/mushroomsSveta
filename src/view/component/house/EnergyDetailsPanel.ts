import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UserService from '../../../core/service/UserService';
import EnergyUtils from '../../../core/utils/EnergyUtils';
import ShopPanel from './ShopPanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import SoundUtils from '../../../core/utils/SoundUtils';
import LocalizationService from '../../../core/localization/LocalizationService';

type EnergyPanelHooks = {
    onShow?: () => void;
    onClose?: () => void;
    onBought?: () => void;
};

export default class EnergyDetailsPanel extends ClosablePanel {
    private screen: Phaser.State;
    private hooks: EnergyPanelHooks;
    private energyLabel: Label;
    private statusLabel: Label;
    private resetLabel: Label;
    private actionLabel: Label;

    constructor(game: Phaser.Game, screen: Phaser.State, hooks?: EnergyPanelHooks) {
        super(game, game.width / 2, game.height / 2, true, "blank");
        this.screen = screen;
        this.hooks = hooks || {};
        this.visible = false;
        this.fixedToCamera = true;

        const panel = this.attachSprite('panel2', 'panel');
        panel.inputEnabled = true;
        panel.x = 0;
        panel.y = -20;
        panel.scale.set(1.02, 0.95);

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(0.98, 0.72);

        const titleBg = this.attachSprite("statusPanel", "titleBg");
        titleBg.scale.set(1.34, 1.18);

        const closeButton = this.attachButton('closeButtonViolet', () => this.close());
        closeButton.scale.set(1);

        this.attachText("title", LocalizationService.get('ui.energy.title', 'Энергия'), {
            font: "46px Bookman Old Style",
            fill: "#ffffff"
        });

        const lightning = this.attachSprite("lightning");
        lightning.name = "lightning";
        lightning.scale.set(0.66);

        this.energyLabel = this.attachText("energyCount", "" + UserService.getUser().getEnergy(), {
            font: "bold 72px Gilroy",
            fill: "#ffffff"
        });

        this.statusLabel = this.attachText("energyStatus", "", {
            font: "bold 32px Arial",
            fill: "#8f6130",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 500
        });

        this.resetLabel = this.attachText("energyReset", "", {
            font: "bold 28px Arial",
            fill: "#9b6536",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });

        const actionButton = this.attachButton("pnlButton", () => this.tryBuyEnergy(), "buyButton");
        actionButton.scale.set(1.12, 1);

        const gemsIcon = SpriteUtils.createSprite(this.game, 0, 0, "gems");
        gemsIcon.name = "gemsIcon";
        gemsIcon.anchor.set(0.5);
        gemsIcon.scale.set(0.57);
        actionButton.addChild(gemsIcon);

        this.actionLabel = new Label(this.game, 0, 0, "", {
            font: "bolder 42px Gilroy",
            fill: "#f0f1ec"
        });
        this.actionLabel.name = "buyLabel";
        this.actionLabel.anchor.set(0.5);
        this.actionLabel.strokeThickness = 4;
        this.actionLabel.addStrokeColor('#61b019', 0);
        actionButton.addChild(this.actionLabel);

        this.attachText("energyHint", LocalizationService.get('ui.energy.hint', '100 энергии за самоцветы. Цена растёт с каждой покупкой за день.'), {
            font: "bold 30px Arial",
            fill: "#7b4037",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 660
        });

        this.applyHtmlPreset([
            { "spriteId": "titleBg", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": -54 },
            { "spriteId": "closeButtonViolet", "parentId": "panel", "horizontalAlign": "right", "verticalAlign": "top", "offsetX": 18, "offsetY": -44 },
            { "spriteId": "title", "parentId": "titleBg", "horizontalAlign": "center", "verticalAlign": "center", "width": "86%", "offsetY": -4, "fontSize": 46 },
            { "spriteId": "helperPanel", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": 86 },
            { "spriteId": "lightning", "parentId": "helperPanel", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": -88, "offsetY": -12 },
            { "spriteId": "energyCount", "parentId": "helperPanel", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": 38, "offsetY": -12, "fontSize": 72 },
            { "spriteId": "energyStatus", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "88%", "offsetY": 248, "fontSize": 32 },
            { "spriteId": "buyButton", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "bottom", "offsetY": 74 },
            { "spriteId": "energyHint", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "88%", "offsetY": 302, "fontSize": 30 },
            { "spriteId": "energyReset", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "72%", "offsetY": 432, "fontSize": 24 },
            { "spriteId": "buyLabel", "parentId": "buyButton", "horizontalAlign": "center", "verticalAlign": "center", "width": "68%", "offsetX": -34, "offsetY": 2, "fontSize": 42 },
            { "spriteId": "gemsIcon", "parentId": "buyButton", "horizontalAlign": "right", "verticalAlign": "center", "offsetX": -26, "offsetY": 2 }
        ]);

        this.actionLabel.scale.set(1 / actionButton.scale.x, 1 / actionButton.scale.y);

        this.game.time.events.loop(1000, () => this.refreshTexts());
        this.refreshTexts();
    }

    private tryBuyEnergy(): void {
        const user = UserService.getUser();
        if (!user.buyEnergyPack()) {
            this.close();

            const shopPanel = new ShopPanel(this.game, this.screen);
            shopPanel.show();
            this.game.add.existing(shopPanel);
            return;
        }

        SoundUtils.successfulBuy();
        AnimationUtils.highlight(this.game, this.x, this.y + 260, "splashY");
        this.refreshTexts();

        if (this.hooks.onBought) {
            this.hooks.onBought();
        }
    }

    private refreshTexts(): void {
        const user = UserService.getUser();
        const energy = user.getEnergy();
        const maxEnergy = EnergyUtils.MAX_ENERGY;
        const currentPrice = user.getCurrentEnergyPurchasePrice();
        const millisToMidnight = EnergyUtils.getMillisToNextMoscowMidnight();

        this.energyLabel.text = "" + energy;

        if (energy > maxEnergy) {
            this.statusLabel.text = LocalizationService.get('ui.energy.overLimit', 'Сверх лимита. Регенерация возобновится после расхода.');
        } else if (energy >= maxEnergy) {
            this.statusLabel.text = LocalizationService.get('ui.energy.full', 'Энергия полная');
        } else {
            const remain = Math.max(0, EnergyUtils.MILLIS_FOR_ENERGY - (Date.now() - user.getLastEnergyRegenerationAt()));
            const seconds = Math.floor(remain / 1000) % 60;
            const minutes = Math.floor(remain / 1000 / 60);
            const secondsText = seconds >= 10 ? "" + seconds : "0" + seconds;
            const minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;
            this.statusLabel.text = LocalizationService.get('ui.energy.restoreIn', 'До +1 энергии: {time}')
                .replace('{time}', minutesText + ":" + secondsText);
        }

        this.actionLabel.text = LocalizationService.get('ui.energy.buyPack', '+100 за {price}')
            .replace('{price}', "" + currentPrice);

        this.resetLabel.text = LocalizationService.get(
            'ui.energy.reset',
            'Сброс цены через {time}'
        )
            .replace('{time}', this.formatResetTime(millisToMidnight));
    }

    private formatResetTime(millisToReset: number): string {
        const hours = Math.floor(millisToReset / 1000 / 60 / 60);
        const minutes = Math.floor(millisToReset / 1000 / 60) % 60;
        const minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;

        if (hours > 0) {
            return hours + "ч " + minutesText + "м";
        }

        return Math.max(1, minutes) + "м";
    }

    protected onClose(): void {
        if (this.hooks.onClose) {
            this.hooks.onClose();
        }
    }

    protected onShow(): void {
        this.refreshTexts();
        if (this.hooks.onShow) {
            this.hooks.onShow();
        }
    }
}
