import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { ShopArtifactSkillId } from "../../../core/model/shop/ShopArtifactModels";
import ClosablePanel from "../panel/ClosablePanel";

export interface SkillInfoPanelOptions {
    currentValue?: number;
    artifactBonus?: number;
}

interface SkillInfoTextLine {
    text: string;
    color?: string;
}

export default class SkillInfoPanel extends ClosablePanel {
    private bodyText: Phaser.Text;

    constructor(game: Phaser.Game, skillId: ShopArtifactSkillId, options?: SkillInfoPanelOptions) {
        super(game, game.width / 2, game.height / 2, true, "blank");

        const skill = ShopArtifactSkillsConfiguration.getById(skillId);
        const safeOptions = options || {};

        this.visible = false;
        this.fixedToCamera = true;

        const panel = this.attachSprite("panel2", "panel");
        panel.scale.set(1.08, 0.84);
        panel.inputEnabled = true;

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(1.02, 1.02);
        helperPanel.y = 18;

        const closeButton = this.attachButton("closeButton", () => this.close(), "closeButton");
        closeButton.x = 314;
        closeButton.y = -246;

        if (skill) {
            const icon = this.attachSprite(skill.icon, "icon");
            icon.y = -160;
            icon.scale.set(0.62);
        }

        const title = this.attachText("title", skill ? this.capitalize(LocalizationService.get(skill.name)) : "", {
            font: "bold 42px Bookman Old Style",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });
        title.anchor.set(0.5);
        title.y = -74;
        title.strokeThickness = 4;
        title.addStrokeColor("#b6691b", 0);

        this.bodyText = new Phaser.Text(this.game, 0, -18, "", {
            font: "bold 31px Arial",
            fill: "#855331",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });
        this.bodyText.name = "bodyText";
        this.bodyText.anchor.set(0.5, 0);
        this.bodyText.lineSpacing = 8;
        this.addSprite(this.bodyText);

        this.applyBodyLines(this.buildBodyLines(skillId, safeOptions));
    }

    private buildBodyLines(skillId: ShopArtifactSkillId, options: SkillInfoPanelOptions): SkillInfoTextLine[] {
        const skill = ShopArtifactSkillsConfiguration.getById(skillId);
        if (!skill) {
            return [];
        }

        const lines: SkillInfoTextLine[] = [{
            text: LocalizationService.get(skill.descriptionText, ""),
            color: "#855331"
        }];

        if (options.currentValue != null) {
            lines.push({
                text: LocalizationService.get("ui.character.currentValue", "Current value: {value}", {
                    value: options.currentValue
                }),
                color: "#855331"
            });
        }

        if ((options.artifactBonus || 0) > 0) {
            lines.push({
                text: LocalizationService.get("ui.skillInfo.artifactBonus", "From equipped artifacts: +{value}", {
                    value: options.artifactBonus
                }),
                color: "#0b6e22"
            });
        }

        lines.push({
            text: LocalizationService.get("ui.character.effectPerLevel", "One artifact level gives +{value}.", {
                value: skill.valuePerLevel
            }),
            color: "#0b6e22"
        });

        if (options.currentValue != null) {
            lines.push({
                text: LocalizationService.get("ui.character.upgradeCost", "Upgrade cost +1: {price}", {
                    price: ShopArtifactSkillsConfiguration.getUpgradePrice(skillId, options.currentValue)
                }),
                color: "#7f187e"
            });
        }

        return lines;
    }

    private applyBodyLines(lines: SkillInfoTextLine[]): void {
        let text = "";
        let colorRanges: { start: number, color: string }[] = [];

        lines.forEach((line, index) => {
            if (!line || !line.text) {
                return;
            }

            if (text.length > 0) {
                text += "\n";
            }

            if (line.color) {
                colorRanges.push({ start: text.length, color: line.color });
            }

            text += line.text;

            if (line.color) {
                colorRanges.push({ start: text.length, color: "#855331" });
            }
        });

        this.bodyText.clearColors();
        this.bodyText.text = text;
        colorRanges.forEach(range => this.bodyText.addColor(range.color, range.start));
    }

    private capitalize(value: string): string {
        if (!value) {
            return "";
        }

        return value.charAt(0).toUpperCase() + value.substring(1);
    }
}
