import ShopArtifactSkillsConfiguration from '../../../core/configuration/ShopArtifactSkillsConfiguration';
import LocalizationService from '../../../core/localization/LocalizationService';
import { ShopArtifactItemConfig } from '../../../core/model/shop/ShopArtifactModels';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import BasePanel from '../panel/BasePanel';

export default class ShopArtifactCardPanel extends BasePanel {

    constructor(game: Phaser.Game, name: string, item: ShopArtifactItemConfig) {
        super(game, 0, 0, name, "blank");

        const panel = this.attachSprite("panel2", "panel");
        panel.scale.set(0.47, 0.46);

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(0.48, 0.74);
        helperPanel.y = 7;
        helperPanel.alpha = 0.98;

        const title = this.attachText("title", LocalizationService.get(item.name), {
            font: "bold 29px Bookman Old Style",
            fill: "#5f2d11",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 270
        });
        title.anchor.set(0.5);
        title.y = -95;

        item.skillIds.slice(0, 2).forEach((skillId, index) => {
            const skill = ShopArtifactSkillsConfiguration.getById(skillId);
            if (!skill) {
                return;
            }

            const rowY = -41 + index * 42;
            const value = item.currentLevel * skill.valuePerLevel;

            const icon = this.attachSprite(skill.icon, "skillIcon" + index);
            icon.x = -131;
            icon.y = rowY;
            icon.scale.set(0.18);

            const label = this.attachText("skillLabel" + index, LocalizationService.get(skill.name) + " +" + value, {
                font: "bold 26px Arial",
                fill: "#0b6e22",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 185
            });
            label.anchor.set(0, 0.5);
            label.x = -103;
            label.y = rowY - 1;

            const infoButton = this.attachSprite("shopInfoButton", "skillInfo" + index);
            infoButton.x = 113;
            infoButton.y = rowY;
        });

        const usageLabel = this.attachText("usage", LocalizationService.get(item.usageText), {
            font: "bold 24px Arial",
            fill: "#7f187e",
            align: "right",
            wordWrap: true,
            wordWrapWidth: 180
        });
        usageLabel.anchor.set(1, 0.5);
        usageLabel.x = 117;
        usageLabel.y = 43;

        const levelLabel = this.attachText("level", LocalizationService.get('shop.item.level', 'Level {level} of {max}', {
            level: item.currentLevel,
            max: item.maxLevel
        }), {
            font: "bold 26px Arial",
            fill: "#5f2d11",
            align: "right",
            wordWrap: true,
            wordWrapWidth: 180
        });
        levelLabel.anchor.set(1, 0.5);
        levelLabel.x = 117;
        levelLabel.y = 82;

        const itemIcon = this.attachSprite(item.icon, "itemIcon");
        itemIcon.x = -108;
        itemIcon.y = 77;
        itemIcon.scale.set(item.iconScale || 0.52);

        const buyButton = this.attachSprite("shopBuyItemButton", "buyButton");
        buyButton.x = 70;
        buyButton.y = 118;

        const priceLabel = this.attachText("price", item.price + " " + AnalyticUtils.getValuteName(), {
            font: "bold 34px Gilroy",
            fill: "#ffffff",
            align: "center"
        });
        priceLabel.anchor.set(0.5);
        priceLabel.x = 70;
        priceLabel.y = 118;
    }
}
