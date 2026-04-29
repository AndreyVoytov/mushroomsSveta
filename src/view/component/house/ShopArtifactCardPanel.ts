import ShopArtifactSkillsConfiguration from '../../../core/configuration/ShopArtifactSkillsConfiguration';
import LocalizationService from '../../../core/localization/LocalizationService';
import { ShopArtifactItemConfig } from '../../../core/model/shop/ShopArtifactModels';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import BasePanel from '../panel/BasePanel';

export default class ShopArtifactCardPanel extends BasePanel {

    constructor(game: Phaser.Game, name: string, item: ShopArtifactItemConfig) {
        super(game, 0, 0, name, "blank");

        const panel = this.attachSprite("panel2", "panel");
        panel.scale.set(0.515, 0.54);

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

        item.skillIds.slice(0, 2).forEach((skillId, index) => {
            const skill = ShopArtifactSkillsConfiguration.getById(skillId);
            if (!skill) {
                return;
            }

            const rowY = -52 + index * 44;
            const value = item.currentLevel * skill.valuePerLevel;

            const icon = this.attachSprite(skill.icon, "skillIcon" + index);
            icon.x = -133;
            icon.y = rowY;
            icon.scale.set(0.3);

            const label = this.attachText("skillLabel" + index, LocalizationService.get(skill.name) + " +" + value, {
                font: "bold 28px Arial",
                fill: "#0b6e22",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 220
            });
            label.anchor.set(0, 0.5);
            label.x = -107;
            label.y = rowY - 1;

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

        const levelLabel = this.attachText("level", LocalizationService.get('shop.item.level', 'Level {level} of {max}', {
            level: item.currentLevel,
            max: item.maxLevel
        }), {
            font: "bold 20px Arial",
            fill: "#5f2d11",
            align: "right",
            wordWrap: true,
            // wordWrapWidth: 190
        });
        levelLabel.anchor.set(1, 0.5);
        levelLabel.x = 138;
        levelLabel.y = 80;

        const itemBackground = this.attachSprite("shopItemBg", "itemBackground");
        itemBackground.x = -110;
        itemBackground.y = 92;
        itemBackground.scale.set(0.95);
        itemBackground.alpha = 0.95;
        this.game.add.tween(itemBackground).to({ angle: 360 }, 40000, Phaser.Easing.Linear.None, true, 0, -1, false);

        const itemSplash = this.attachSprite("splashY", "itemSplash");
        itemSplash.x = -110;
        itemSplash.y = 90;
        itemSplash.scale.set(1);
        itemSplash.alpha = 0.8;

        const itemIcon = this.attachSprite(item.icon, "itemIcon");
        itemIcon.x = -110;
        itemIcon.y = 82;
        itemIcon.scale.set((item.iconScale || 0.52) * 1.12);

        const buyButton = this.attachSprite("shopBuyItemButton", "buyButton");
        buyButton.x = 66;
        buyButton.y = 136;
        buyButton.scale.set(1.03);

        const priceLabel = this.attachText("price", item.price + " " + AnalyticUtils.getValuteName(), {
            font: "bold 38px Gilroy",
            fill: "#ffffff",
            align: "center"
        });
        priceLabel.anchor.set(0.5);
        priceLabel.x = 66;
        priceLabel.y = 137;
    }
}
