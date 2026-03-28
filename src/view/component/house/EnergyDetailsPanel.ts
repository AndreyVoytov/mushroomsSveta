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

        this.attachSprite("helperPanel");
        this.attachSprite("statusPanel", "titleBg");
        this.attachButton('closeButtonViolet', () => this.close());

        this.attachText("title", LocalizationService.get('ui.energy.title', 'Энергия'), {
            font: "46px Bookman Old Style",
            fill: "#ffffff"
        });

        const lightning = this.attachSprite("lightning");
        lightning.name = "lightning";

        this.energyLabel = this.attachText("energyCount", "" + UserService.getUser().getEnergy(), {
            font: "bold 72px Gilroy",
            fill: "#ffffff"
        });

        this.statusLabel = this.attachText("energyStatus", "", {
            font: "bold 34px Arial",
            fill: "#e6d2a8"
        });

        this.resetLabel = this.attachText("energyReset", "", {
            font: "bold 28px Arial",
            fill: "#8f6130",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });

        const actionButton = this.attachButton("pnlButton", () => this.tryBuyEnergy(), "buyButton");
        this.attachSprite("gems", "gemsIcon");

        this.actionLabel = new Label(this.game, 0, 0, "", {
            font: "bolder 42px Gilroy",
            fill: "#f0f1ec"
        });
        this.actionLabel.name = "buyLabel";
        this.actionLabel.anchor.set(0.5);
        this.actionLabel.strokeThickness = 4;
        this.actionLabel.addStrokeColor('#61b019', 0);
        actionButton.addChild(this.actionLabel);

        const hint = this.attachText("energyHint", LocalizationService.get('ui.energy.hint', '100 энергии за самоцветы. Цена растёт с каждой покупкой за день.'), {
            font: "bold 32px Arial",
            fill: "#7b4037",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });

        this.applyPreset([
            {"spriteId":"panel","x":0,"y":-20,"scaleX":1.02,"scaleY":0.95,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"helperPanel","x":0,"y":-55,"scaleX":0.98,"scaleY":0.62,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"titleBg","x":0,"y":-280,"scaleX":1.34,"scaleY":1.18,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"closeButtonViolet","x":322,"y":-285,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"title","x":0,"y":-286,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
            {"spriteId":"lightning","x":-108,"y":-56,"scaleX":0.66,"scaleY":0.66,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"energyCount","x":36,"y":-63,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":72},
            {"spriteId":"energyStatus","x":0,"y":39,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":34},
            {"spriteId":"energyHint","x":0,"y":145,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":32},
            {"spriteId":"buyButton","x":0,"y":265,"scaleX":1.12,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"gemsIcon","x":170,"y":265,"scaleX":0.64,"scaleY":0.64,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"energyReset","x":0,"y":362,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":28}
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
        const hoursToReset = Math.floor(millisToMidnight / 1000 / 60 / 60);
        const minutesToReset = Math.floor(millisToMidnight / 1000 / 60) % 60;

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
            'Сброс цены: {hours}ч {minutes}м до 00:00 МСК'
        )
            .replace('{hours}', "" + hoursToReset)
            .replace('{minutes}', minutesToReset >= 10 ? "" + minutesToReset : "0" + minutesToReset);
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
