import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UserService from '../../../core/service/UserService';
import EnergyUtils from '../../../core/utils/EnergyUtils';
import ShopPanel from './ShopPanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import SoundUtils from '../../../core/utils/SoundUtils';
import LocalizationService from '../../../core/localization/LocalizationService';
import UiLayout from '../../../core/utils/UiLayout';

type EnergyPanelHooks = {
    onShow?: () => void;
    onClose?: () => void;
    onBought?: () => void;
    onDeclined?: () => void;
};

export default class EnergyDetailsPanel extends ClosablePanel {
    private screen: Phaser.State;
    private hooks: EnergyPanelHooks;
    private energyLabel: Label;
    private statusLabel: Label;
    private resetLabel: Label;
    private actionLabel: Label;
    private openingShop: boolean = false;
    private purchaseInProgress: boolean = false;

    constructor(game: Phaser.Game, screen: Phaser.State, hooks?: EnergyPanelHooks) {
        super(game, game.width / 2, game.height / 2, true, "blank");
        this.screen = screen;
        this.hooks = hooks || {};
        this.visible = false;
        this.fixedToCamera = true;
        this.backdropAlpha = 0.55;

        const panel = this.attachSprite('energyPanelFrame', 'panel');
        panel.inputEnabled = true;
        panel.x = 0;
        panel.y = 0;
        panel.width = 840;
        panel.height = 660;

        const closeIcon = this.attachSprite('closeButton', 'energyCloseIcon');
        closeIcon.position.set(334, -250);
        closeIcon.width = closeIcon.height = 64;
        const closeHitArea = new Phaser.Graphics(this.game, 334, -250);
        closeHitArea.beginFill(0xffffff, 0.001);
        closeHitArea.drawCircle(0, 0, 78);
        closeHitArea.endFill();
        closeHitArea.inputEnabled = true;
        closeHitArea.events.onInputDown.add(() => this.close());
        this.addChild(closeHitArea);

        const title = this.attachText("title", LocalizationService.get('ui.energy.title', 'Energy'), {
            font: "bold 46px Arial",
            fill: Label.ON_DARK,
            stroke: "#fff0bd",
            strokeThickness: 3
        });
        title.position.set(0, -214);UiLayout.fit(title, 500, 62);

        const energyOrb = this.attachSprite('energyPanelOrb', 'energyOrb');
        energyOrb.position.set(-90, -98);
        energyOrb.width = 96;
        energyOrb.height = 90;

        this.energyLabel = this.attachText("energyCount", "" + UserService.getUser().getEnergy(), {
            font: "bold 54px Gilroy",
            fill: "#fff3c2",
            stroke: "#713a12",
            strokeThickness: 5
        });
        this.energyLabel.position.set(40, -98);this.energyLabel.fill = Label.INK;

        this.statusLabel = this.attachText("energyStatus", "", {
            font: "bold 28px Arial",
            fill: "#70401d",
            stroke: "#603014",
            strokeThickness: 0,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });
        this.statusLabel.position.set(32, -15);UiLayout.fit(this.statusLabel, 560, 76, true);
        this.statusLabel.fill = Label.INK;

        this.resetLabel = this.attachText("energyReset", "", {
            font: "bold 24px Arial",
            fill: "#70401d",
            stroke: "#603014",
            strokeThickness: 0,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });
        this.resetLabel.position.set(25, 173);this.resetLabel.fill = Label.INK;

        const actionButton = this.attachButton('energyPanelBuyButton', () => this.tryBuyEnergy(), 'buyButton');
        actionButton.position.set(24, 80);
        actionButton.width = 360;
        actionButton.height = 94;

        const gemsIcon = SpriteUtils.createSprite(this.game, 0, 0, "gems");
        gemsIcon.name = "gemsIcon";
        gemsIcon.anchor.set(0.5);
        gemsIcon.position.set(148, 80);
        SpriteUtils.fitIcon(gemsIcon, 40, 40);
        this.addChild(gemsIcon);

        this.actionLabel = new Label(this.game, 0, 0, "", {
            font: "bolder 28px Gilroy",
            fill: "#fff8db"
        });
        this.actionLabel.name = "buyLabel";
        this.actionLabel.anchor.set(0.5);
        this.actionLabel.strokeThickness = 4;
        this.actionLabel.addStrokeColor('#34751a', 0);
        this.actionLabel.position.set(2, 80);this.actionLabel.fill = Label.INK;
        this.addChild(this.actionLabel);

        const energyHint = this.attachText("energyHint", LocalizationService.get('ui.energy.hint', '100 energy for gems. The price increases with each purchase per day.'), {
            font: "bold 24px Arial",
            fill: "#70401d",
            stroke: "#603014",
            strokeThickness: 0,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 620
        });
        energyHint.fontSize = 26;energyHint.fill = Label.INK;
        energyHint.position.set(26, 239);UiLayout.fit(energyHint, 580, 76, true);

        const refreshTimer = this.game.time.events.loop(1000, () => {
            if (this.visible) this.refreshTexts();
        });
        this.events.onDestroy.addOnce(() => this.game.time.events.remove(refreshTimer));
        this.refreshTexts();
    }

    private tryBuyEnergy(): void {
        if (this.purchaseInProgress || this.processing) {
            return;
        }
        this.purchaseInProgress = true;
        const user = UserService.getUser();
        const energyBefore = user.getEnergy();
        if (!user.buyEnergyPack()) {
            this.purchaseInProgress = false;
            this.openingShop = true;
            this.close();

            const shopPanel = new ShopPanel(this.game, this.screen, undefined, 'bank', undefined, () => {
                if (this.hooks.onDeclined) {
                    this.hooks.onDeclined();
                }
            });
            shopPanel.show();
            this.game.add.existing(shopPanel);
            return;
        }

        SoundUtils.successfulBuy();
        AnimationUtils.highlight(this.game, this.x, this.y + 260, "splashY");
        this.animateEnergySymbols(Math.max(0, user.getEnergy() - energyBefore));
        this.refreshTexts();

        if (this.hooks.onBought) {
            this.hooks.onBought();
        }
        // One confirmed press equals one pack.  Closing also prevents a
        // second pointer event from buying several packs behind the panel.
        this.game.time.events.add(300, () => this.close());
    }

    private animateEnergySymbols(amount: number): void {
        const count = Math.min(9, Math.max(4, Math.ceil(amount / 12)));
        const sourceX = this.game.width / 2;
        const sourceY = this.game.camera.y + this.game.height / 2 + 150;
        const targetX = 193;
        const targetY = this.game.camera.y + 62;
        for (let i = 0; i < count; i++) {
            const offset = (i - (count - 1) / 2) * 18;
            const spark = SpriteUtils.createSprite(this.game, sourceX + offset, sourceY, 'lightning');
            spark.anchor.set(0.5);
            spark.width = 30;
            spark.height = 32;
            spark.inputEnabled = false;
            this.game.add.existing(spark);
            const delay = i * 34;
            const flight = this.game.add.tween(spark).to({
                x: [sourceX + offset * 1.5, targetX + offset * 0.5, targetX],
                y: [sourceY - 75 - (i % 3) * 18, targetY + 48, targetY]
            }, 570, Phaser.Easing.Quadratic.In, true, delay);
            flight.interpolation(Phaser.Math.bezierInterpolation);
            this.game.add.tween(spark).to({ alpha: 0 },
                180, Phaser.Easing.Quadratic.In, true, delay + 390)
                .onComplete.addOnce(() => spark.destroy());
            this.game.add.tween(spark.scale).to({ x: spark.scale.x * 0.45, y: spark.scale.y * 0.45 },
                480, Phaser.Easing.Quadratic.In, true, delay + 90);
        }
    }

    private refreshTexts(): void {
        const user = UserService.getUser();
        const energy = user.getEnergy();
        const maxEnergy = EnergyUtils.MAX_ENERGY;
        const currentPrice = user.getCurrentEnergyPurchasePrice();
        const millisToMidnight = EnergyUtils.getMillisToNextMoscowMidnight();

        this.energyLabel.text = "" + energy;
        this.energyLabel.scale.set(1, 1);
        if (this.energyLabel.width > 100) {
            const scale = 100 / this.energyLabel.width;
            this.energyLabel.scale.set(scale, scale);
        }

        if (energy > maxEnergy) {
            this.statusLabel.text = LocalizationService.get('ui.energy.overLimit', 'Above the limit. Regeneration will resume after you spend some energy.');
        } else if (energy >= maxEnergy) {
            this.statusLabel.text = LocalizationService.get('ui.energy.full', 'Energy is full');
        } else {
            const remain = Math.max(0, EnergyUtils.MILLIS_FOR_ENERGY - (Date.now() - user.getLastEnergyRegenerationAt()));
            const seconds = Math.floor(remain / 1000) % 60;
            const minutes = Math.floor(remain / 1000 / 60);
            const secondsText = seconds >= 10 ? "" + seconds : "0" + seconds;
            const minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;
            this.statusLabel.text = LocalizationService.get('ui.energy.restoreIn', 'Next +1 energy in: {time}')
                .replace('{time}', minutesText + ":" + secondsText);
        }

        this.actionLabel.text = LocalizationService.get('ui.energy.buyPack', '+100 for {price}')
            .replace('{price}', "" + currentPrice);

        this.actionLabel.scale.set(1, 1);
        if (this.actionLabel.width > 220) this.actionLabel.scale.set(220 / this.actionLabel.width, 220 / this.actionLabel.width);

        this.resetLabel.text = LocalizationService.get(
            'ui.energy.reset',
            'Price resets in {time}'
        )
            .replace('{time}', this.formatResetTime(millisToMidnight));
        UiLayout.fit(this.statusLabel, 560, 76, true);
        UiLayout.fit(this.resetLabel, 600, 40);
    }

    private formatResetTime(millisToReset: number): string {
        const hours = Math.floor(millisToReset / 1000 / 60 / 60);
        const minutes = Math.floor(millisToReset / 1000 / 60) % 60;
        const minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;

        if (hours > 0) {
            return LocalizationService.get('text.remain.hourCompact', '{hours}h. {minutes}m.')
                .replace('{hours}', '' + hours)
                .replace('{minutes}', minutesText);
        }

        return LocalizationService.get('text.remain.minuteCompact', '{minutes}m. {seconds}s.')
            .replace('{minutes}', '' + Math.max(1, minutes))
            .replace('{seconds}', '00');
    }

    protected onClose(): void {
        if (this.hooks.onClose) {
            this.hooks.onClose();
        }
        if (!this.openingShop && !this.purchaseInProgress && this.hooks.onDeclined) {
            this.hooks.onDeclined();
        }
    }

    protected onShow(): void {
        this.openingShop = false;
        this.purchaseInProgress = false;
        this.refreshTexts();
        if (UserService.getUser().getEnergy() <= 0) {
            SoundUtils.looseLevel();
        }
        if (this.hooks.onShow) {
            this.hooks.onShow();
        }
    }
}
