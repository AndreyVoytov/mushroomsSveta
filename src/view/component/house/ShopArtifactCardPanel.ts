import ShopArtifactSkillsConfiguration from '../../../core/configuration/ShopArtifactSkillsConfiguration';
import LocalizationService from '../../../core/localization/LocalizationService';
import { ShopArtifactItemConfig, ShopArtifactSkillId } from '../../../core/model/shop/ShopArtifactModels';
import ShopArtifactService from '../../../core/service/ShopArtifactService';
import BasePanel from '../panel/BasePanel';
import Label from '../panel/Label';

export default class ShopArtifactCardPanel extends BasePanel {
    private item: ShopArtifactItemConfig;
    private sortIndex: number;
    private onBuy?: (item: ShopArtifactItemConfig) => void;
    private skillLabels: { skillId: ShopArtifactSkillId, label: Label }[] = [];
    private levelLabel: Label;
    private panel: Phaser.Sprite;
    private buyButton: Phaser.Sprite;
    private priceLabel: Label;
    private priceGemIcon: Phaser.Sprite;
    private itemBackground: Phaser.Sprite;
    private itemSplash: Phaser.Sprite;
    private itemIcon: Phaser.Sprite;
    private disabledShade: Phaser.Sprite;
    private purchasedCheck: Phaser.Sprite;

    constructor(game: Phaser.Game, name: string, item: ShopArtifactItemConfig, sortIndex: number, onBuy?: (item: ShopArtifactItemConfig) => void) {
        super(game, 0, 0, name, "blank");
        this.item = item;
        this.sortIndex = sortIndex;
        this.onBuy = onBuy;

        this.panel = this.attachSprite("panel2", "panel");
        this.panel.scale.set(0.515, 0.54);
        this.panel.inputEnabled = true;
        if (this.panel.input) {
            this.panel.input.useHandCursor = true;
        }
        this.panel.events.onInputDown.add(() => this.handleBuy(), this);

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(0.5, 0.79);
        helperPanel.y = 22;
        helperPanel.alpha = 0.98;

        const title = this.attachText("title", LocalizationService.get(item.name), {
            font: "bold 31px Bookman Old Style",
            fill: "#5f2d11",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 305
        });
        title.anchor.set(0.5);
        title.y = -105;

        this.item.skillIds.slice(0, 2).forEach((skillId, index) => {
            const skill = ShopArtifactSkillsConfiguration.getById(skillId);
            if (!skill) {
                return;
            }

            const rowY = -52 + index * 44;

            const icon = this.attachSprite(skill.icon, "skillIcon" + index);
            icon.x = -133;
            icon.y = rowY;
            icon.scale.set(0.3);

            const label = this.attachText("skillLabel" + index, "", {
                font: "bold 28px Arial",
                fill: "#0b6e22",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 220
            });
            label.anchor.set(0, 0.5);
            label.x = -107;
            label.y = rowY - 1;
            this.skillLabels.push({ skillId: skillId, label: label });

            const infoButton = this.attachSprite("shopInfoButton", "skillInfo" + index);
            infoButton.x = 134;
            infoButton.y = rowY;
            infoButton.scale.set(1.08);
        });

        const usageLabel = this.attachText("usage", LocalizationService.get(item.usageText), {
            font: "bold 20px Arial",
            fill: "#7f187e",
            align: "right",
            wordWrap: true,
            wordWrapWidth: 180
        });
        usageLabel.lineSpacing = 26;
        usageLabel.anchor.set(1, 1);
        usageLabel.x = 138;
        usageLabel.y = 63;

        this.levelLabel = this.attachText("level", "", {
            font: "bold 20px Arial",
            fill: "#5f2d11",
            align: "right",
            wordWrap: true
        });
        this.levelLabel.anchor.set(1, 0.5);
        this.levelLabel.x = 138;
        this.levelLabel.y = 80;

        this.itemBackground = this.attachSprite("shopItemBg", "itemBackground");
        this.itemBackground.x = -110;
        this.itemBackground.y = 92;
        this.itemBackground.scale.set(1.02);
        this.itemBackground.alpha = 0.95;
        this.game.add.tween(this.itemBackground).to({ angle: 360 }, 40000, Phaser.Easing.Linear.None, true, 0, -1, false);

        this.itemSplash = this.attachSprite("splashY", "itemSplash");
        this.itemSplash.x = -110;
        this.itemSplash.y = 90;
        this.itemSplash.scale.set(1);
        this.itemSplash.alpha = 0.8;

        this.itemIcon = this.attachSprite(item.icon, "itemIcon");
        this.itemIcon.x = -110;
        this.itemIcon.y = 82;
        this.itemIcon.scale.set((item.iconScale || 0.52) * 1.12);

        this.buyButton = this.attachSprite("shopBuyItemButton", "buyButton");
        this.buyButton.x = 66;
        this.buyButton.y = 136;
        this.buyButton.scale.set(1.03);
        this.buyButton.inputEnabled = true;
        if (this.buyButton.input) {
            this.buyButton.input.useHandCursor = true;
        }
        this.buyButton.events.onInputDown.add(() => this.handleBuy(), this);

        this.priceGemIcon = this.attachSprite("gems", "priceGemIcon");
        this.priceGemIcon.x = 12;
        this.priceGemIcon.y = 137;
        this.priceGemIcon.scale.set(0.34);

        this.priceLabel = this.attachText("price", "" + item.price, {
            font: "bold 36px Gilroy",
            fill: "#ffffff",
            align: "left"
        });
        this.priceLabel.anchor.set(0, 0.5);
        this.priceLabel.x = 76;
        this.priceLabel.y = 137;

        this.disabledShade = this.attachSprite("panel2", "disabledShade");
        this.disabledShade.scale.set(this.panel.scale.x, this.panel.scale.y);
        this.disabledShade.alpha = 0.34;
        this.disabledShade.tint = 0x6f6258;
        this.disabledShade.visible = false;

        this.purchasedCheck = this.attachSprite("check", "purchasedCheck");
        this.purchasedCheck.x = 0;
        this.purchasedCheck.y = 18;
        this.purchasedCheck.scale.set(1.05);
        this.purchasedCheck.visible = false;

        this.refreshState();
    }

    public refreshState(): void {
        const purchased = this.isPurchased();
        const level = ShopArtifactService.getItemLevel(this.item);

        this.skillLabels.forEach(skillLabel => {
            const skill = ShopArtifactSkillsConfiguration.getById(skillLabel.skillId);
            if (!skill) {
                return;
            }

            skillLabel.label.text = LocalizationService.get(skill.name) + " +" + level * skill.valuePerLevel;
        });

        this.levelLabel.text = LocalizationService.get('shop.item.level', 'Level {level} of {max}', {
            level: level,
            max: this.item.maxLevel
        });

        this.disabledShade.visible = purchased;
        this.purchasedCheck.visible = purchased;
        this.buyButton.visible = !purchased;
        this.priceLabel.visible = !purchased;
        this.priceGemIcon.visible = !purchased;
        this.itemBackground.alpha = purchased ? 0.5 : 0.95;
        this.itemSplash.alpha = purchased ? 0.35 : 0.8;
        this.itemIcon.alpha = purchased ? 0.72 : 1;
        this.panel.inputEnabled = !purchased;
        this.buyButton.inputEnabled = !purchased;
        if (this.panel.input) {
            this.panel.input.useHandCursor = !purchased;
        }
        if (this.buyButton.input) {
            this.buyButton.input.useHandCursor = !purchased;
        }
    }

    public isPurchased(): boolean {
        return ShopArtifactService.isPurchased(this.item.id);
    }

    public getSortIndex(): number {
        return this.sortIndex;
    }

    private handleBuy(): void {
        if (this.isPurchased()) {
            return;
        }

        if (this.onBuy) {
            this.onBuy(this.item);
        }
    }
}
