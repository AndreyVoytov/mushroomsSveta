import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { ShopArtifactSkillId } from "../../../core/model/shop/ShopArtifactModels";
import ClosablePanel from "../panel/ClosablePanel";
import Label from '../panel/Label';

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
        panel.width = 820;panel.height = 600;
        panel.inputEnabled = true;

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(1.02, 1.2);
        helperPanel.y = 18;
        helperPanel.visible = false;

        const closeButton = this.attachButton("closeButton", () => this.close(), "closeButton");
        closeButton.x = 350;
        closeButton.y = -244;

        if (skill) {
            const icon = this.attachSprite(skill.icon, "icon");
            icon.y = -236;
            icon.width = 100;icon.height = 110;
        }

        const title = this.attachText("title", skill ? this.capitalize(LocalizationService.get(skill.name)) : "", {
            font: "bold 42px Bookman Old Style",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });
        title.anchor.set(0.5);
        title.y = -143;
        title.strokeThickness = 4;
        title.addStrokeColor("#b6691b", 0);

        this.bodyText = new Phaser.Text(this.game, 0, -70, "", {
            font: "bold 32px Gilroy",
            fill: Label.INK,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });
        this.bodyText.name = "bodyText";
        this.bodyText.anchor.set(0.5, 0);
        this.bodyText.lineSpacing = 8;
        this.addSprite(this.bodyText);

        this.applyBodyLines(this.buildBodyLines(skillId, safeOptions));
        this.bodyText.fill = '#343c35';
        this.bodyText.scale.set(Math.min(1, 560 / Math.max(1, this.bodyText.width), 280 / Math.max(1, this.bodyText.height)));
    }

    private buildBodyLines(skillId: ShopArtifactSkillId, options: SkillInfoPanelOptions): SkillInfoTextLine[] {
        const skill = ShopArtifactSkillsConfiguration.getById(skillId);
        if (!skill) {
            return [];
        }

        const lines: SkillInfoTextLine[] = [{
            text: LocalizationService.get(skill.descriptionText, ""),
            color: Label.INK
        }];

        if (options.currentValue != null) {
            lines.push({
                text: LocalizationService.get("ui.character.currentValue", "Current value: {value}", {
                    value: options.currentValue
                }),
                color: Label.INK
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
                colorRanges.push({ start: text.length, color: Label.INK });
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
