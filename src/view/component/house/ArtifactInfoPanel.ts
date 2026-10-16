import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { ShopArtifactItemConfig, ShopArtifactSkillId } from "../../../core/model/shop/ShopArtifactModels";
import ShopArtifactService from "../../../core/service/ShopArtifactService";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import UiLayout from '../../../core/utils/UiLayout';
import BasePanel from "../panel/BasePanel";
import Label from "../panel/Label";

export interface ArtifactInfoLine {
    text: string;
    color?: string;
}

export interface ArtifactInfoDetailsOptions {
    title: string;
    description: string;
    level: number;
    maxLevel: number;
    slotText: string;
    usageText: string;
    usageKey?: string;
    skillIds: ShopArtifactSkillId[];
    bonusLines: ArtifactInfoLine[];
}

interface ArtifactInfoPanelOptions {
    onAction?: () => void;
    onUpgrade?: () => void;
    onSkillInfo?: (skillId: ShopArtifactSkillId) => void;
    maxBonusLines?: number;
    compactDetails?: boolean;
}

interface ArtifactSkillRowView {
    icon: Phaser.Sprite;
    label: Label;
    infoButton: Phaser.Button;
}

export default class ArtifactInfoPanel extends BasePanel {
    private static readonly TITLE_CENTER_Y = -18;
    private static readonly PLAIN_BODY_TOP_Y = 42;
    private static readonly RESTRICTION_CENTER_Y = 39;
    private static readonly PROGRESS_LEFT_X = -77;
    private static readonly PROGRESS_CENTER_Y = 100;
    private static readonly SKILLS_BG_CENTER_Y = 215;
    private static readonly DESCRIPTION_TOP_Y = 285;
    private static readonly UPGRADE_BUTTON_CENTER_Y = 450;
    private static readonly ACTION_LINK_TOP_Y = 528;
    private static readonly BODY_WORD_WRAP_WIDTH = 430;

    private contentTitle: Label;
    private contentBody: Label;
    private restrictionLabel: Label;
    private progressEmpty: Phaser.Sprite;
    private progressFull: Phaser.Sprite;
    private progressLabel: Label;
    private skillsBg: Phaser.Sprite;
    private descriptionLabel: Label;
    private upgradeButton: Phaser.Button;
    private upgradeButtonLabel: Label;
    private upgradeButtonGemIcon: Phaser.Sprite;
    private actionLinkText: Label;
    private actionLinkUnderline: Phaser.Graphics;
    private actionLinkHitArea: Phaser.Button;
    private skillRows: ArtifactSkillRowView[] = [];
    private actionHandler: () => void;
    private upgradeHandler: () => void;
    private skillInfoHandler: (skillId: ShopArtifactSkillId) => void;
    private maxBonusLines: number;
    private compactDetails: boolean;

    constructor(game: Phaser.Game, x: number, y: number, options?: ArtifactInfoPanelOptions) {
        super(game, x, y, "artifactInfoPanel");
        this.actionHandler = options && options.onAction ? options.onAction : null;
        this.upgradeHandler = options && options.onUpgrade ? options.onUpgrade : null;
        this.skillInfoHandler = options && options.onSkillInfo ? options.onSkillInfo : null;
        this.maxBonusLines = options && options.maxBonusLines ? options.maxBonusLines : 2;

        this.compactDetails = !!(options && options.compactDetails);
        this.createLayout();
    }

    public setTitle(text: string): void {
        this.contentTitle.text = text || "";
        UiLayout.fit(this.contentTitle, 380, 52);
    }

    public setBodyPlain(text: string): void {
        this.contentBody.visible = true;
        this.contentBody.text = text || "";
        UiLayout.fit(this.contentBody, 430, 460, true);
        this.hideArtifactDetails();
        this.hideActionLink();
        this.setUpgradeButtonVisible(false);
    }

    public setBodyRich(lines: ArtifactInfoLine[]): void {
        const plainText = (lines || [])
            .filter(line => !!line && !!line.text)
            .map(line => line.text)
            .join("\n");
        this.setBodyPlain(plainText);
    }

    public showArtifactDetails(options: ArtifactInfoDetailsOptions): void {
        this.setTitle(options.title);
        this.contentBody.visible = false;
        this.setArtifactDetailsVisible(true);

        this.restrictionLabel.text = this.getRestrictionText(options.slotText, options.usageText, options.usageKey);
        this.progressLabel.text = Math.max(0, options.level) + "/" + Math.max(1, options.maxLevel);
        this.updateProgressCrop(options.level, options.maxLevel);
        this.descriptionLabel.text = options.description || "";
        UiLayout.fit(this.restrictionLabel, 410, 44);
        UiLayout.fit(this.descriptionLabel, 420, 128, true);
        this.showArtifactBonusLines(options.skillIds, options.bonusLines);
    }

    public showArtifactBonusLines(skillIds: ShopArtifactSkillId[], lines: ArtifactInfoLine[]): void {
        this.hideSkillRows();

        if (!skillIds || skillIds.length == 0 || !lines || lines.length == 0) {
            return;
        }

        skillIds.slice(0, this.maxBonusLines).forEach((skillId, index) => {
            const line = lines[index];
            const row = this.skillRows[index];
            const skill = ShopArtifactSkillsConfiguration.getById(skillId);
            if (!line || !row || !skill) {
                return;
            }

            SpriteUtils.loadTexture(row.icon, skill.icon);
            row.icon.visible = true;
            row.label.text = line.text;
            UiLayout.fit(row.label, 250, 42);
            row.label.visible = true;

            (<any>row.infoButton).skillId = skillId;
            row.infoButton.visible = true;
            row.infoButton.inputEnabled = true;
        });
    }

    public hideArtifactDetails(): void {
        this.setArtifactDetailsVisible(false);
        this.hideSkillRows();
    }

    public showActionLink(text: string): void {
        if (!text) {
            this.hideActionLink();
            return;
        }

        this.actionLinkText.text = text;
        UiLayout.fit(this.actionLinkText, 400, 52);
        this.actionLinkText.visible = true;

        const textWidth = Math.ceil(this.actionLinkText.width);
        const textHeight = Math.ceil(this.actionLinkText.height);

        this.actionLinkUnderline.clear();
        this.actionLinkUnderline.lineStyle(2, 0x315e49, 1);
        this.actionLinkUnderline.moveTo(this.actionLinkText.x - textWidth / 2, this.actionLinkText.y + textHeight + 2);
        this.actionLinkUnderline.lineTo(this.actionLinkText.x + textWidth / 2, this.actionLinkText.y + textHeight + 2);
        this.actionLinkUnderline.visible = true;

        this.actionLinkHitArea.x = this.actionLinkText.x;
        this.actionLinkHitArea.y = this.actionLinkText.y;
        this.actionLinkHitArea.width = textWidth + 18;
        this.actionLinkHitArea.height = textHeight + 10;
        this.actionLinkHitArea.visible = true;
        this.actionLinkHitArea.inputEnabled = true;
    }

    public hideActionLink(): void {
        this.actionLinkText.visible = false;
        this.actionLinkText.text = "";

        this.actionLinkUnderline.clear();
        this.actionLinkUnderline.visible = false;

        this.actionLinkHitArea.visible = false;
        this.actionLinkHitArea.inputEnabled = false;
    }

    public refreshUpgradeButton(item: ShopArtifactItemConfig, currentLevel: number): void {
        if (!item) {
            this.setUpgradeButtonVisible(false);
            return;
        }

        this.setUpgradeButtonVisible(true);

        if (currentLevel >= item.maxLevel) {
            this.upgradeButton.tint = 0xebe9e6;
            this.upgradeButton.alpha = 1;
            this.upgradeButton.inputEnabled = false;
            this.upgradeButtonLabel.text = LocalizationService.get("ui.character.maxLevel", "Max level");
            this.layoutUpgradeCaption(false);
            this.upgradeButtonGemIcon.alpha = 0;
            return;
        }

        this.upgradeButton.tint = 0xffffff;
        this.upgradeButton.alpha = 1;
        this.upgradeButton.inputEnabled = true;
        this.upgradeButtonGemIcon.alpha = 1;
        this.upgradeButtonLabel.text = LocalizationService.get("ui.character.upgrade", "Upgrade for {price}", {
            price: ShopArtifactService.getUpgradePrice(item, currentLevel)
        });
        this.layoutUpgradeCaption(true);
    }

    private layoutUpgradeCaption(withPrice: boolean): void {
        const sx = this.upgradeButton.scale.x, sy = this.upgradeButton.scale.y;
        this.upgradeButtonLabel.position.set((withPrice ? -22 : 0) / sx, 0);
        UiLayout.fit(this.upgradeButtonLabel, withPrice ? 300 : 330, 58);
        this.upgradeButtonLabel.scale.x /= sx;this.upgradeButtonLabel.scale.y /= sy;
        this.upgradeButtonGemIcon.position.set(158 / sx, 0);
        this.upgradeButtonGemIcon.width = 38 / sx;this.upgradeButtonGemIcon.height = 38 / sy;
    }

    public setUpgradeButtonVisible(visible: boolean): void {
        this.upgradeButton.alpha = visible ? 1 : 0;
        this.upgradeButton.inputEnabled = visible;
        this.upgradeButtonGemIcon.alpha = visible ? 1 : 0;
    }

    public showUpgradeSuccessFeedback(): void {
        const label = new Label(this.game, this.upgradeButton.x, this.upgradeButton.y - 74, LocalizationService.get("ui.character.upgradedSuccess", "Upgraded!"), {
            font: "bold 34px Gilroy",
            fill: "#214634",
            align: "center"
        });
        label.anchor.set(0.5);
        this.addChild(label);
        this.game.add.tween(label).to({ y: label.y - 55, alpha: 0 }, 800, Phaser.Easing.Quadratic.Out, true);
        this.game.time.events.add(820, () => {
            if (label.parent) {
                label.parent.removeChild(label);
            }
            label.destroy(true);
        });
    }

    public setActionHandler(actionHandler: () => void): void {
        this.actionHandler = actionHandler;
    }

    public setUpgradeHandler(upgradeHandler: () => void): void {
        this.upgradeHandler = upgradeHandler;
    }

    public setSkillInfoHandler(skillInfoHandler: (skillId: ShopArtifactSkillId) => void): void {
        this.skillInfoHandler = skillInfoHandler;
    }

    private createLayout(): void {
        const titlePaper = this.attachSprite('uiSecondaryControl', 'contentTitlePaper');
        titlePaper.position.set(0, ArtifactInfoPanel.TITLE_CENTER_Y);
        titlePaper.width = 420;titlePaper.height = 68;
        this.contentTitle = this.attachText("contentTitle", "", {
            font: "bold 40px Bookman Old Style",
            fill: Label.INK,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 380
        });
        this.contentTitle.anchor.set(0.5);
        this.contentTitle.x = 0;
        this.contentTitle.y = ArtifactInfoPanel.TITLE_CENTER_Y;

        this.restrictionLabel = this.attachText("restrictionLabel", "", {
            font: "bold 34px Gilroy",
            fill: "#7f187e",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 390
        });
        this.restrictionLabel.anchor.set(0.5);
        this.restrictionLabel.x = 0;
        this.restrictionLabel.y = ArtifactInfoPanel.RESTRICTION_CENTER_Y;

        this.progressEmpty = this.attachSprite("characterLevelProgressEmpty", "progressEmpty");
        this.progressEmpty.x = 0;
        this.progressEmpty.y = ArtifactInfoPanel.PROGRESS_CENTER_Y;

        this.progressFull = this.attachSprite("characterLevelProgressFull", "progressFull");
        this.progressFull.anchor.set(0, 0.5);
        this.progressFull.x = ArtifactInfoPanel.PROGRESS_LEFT_X;
        this.progressFull.y = ArtifactInfoPanel.PROGRESS_CENTER_Y;

        this.progressLabel = this.attachText("progressLabel", "", {
            font: "bold 34px Gilroy",
            fill: "#fff1cf",
            align: "center"
        });
        this.progressLabel.anchor.set(0.5);
        this.progressLabel.x = 0;
        this.progressLabel.y = ArtifactInfoPanel.PROGRESS_CENTER_Y + 1;

        this.skillsBg = this.attachSprite("characterItemSkillsDetailsBg", "skillsDetailsBg");
        this.skillsBg.x = 0;
        this.skillsBg.y = ArtifactInfoPanel.SKILLS_BG_CENTER_Y - (this.compactDetails ? 16 : 0);
        this.skillsBg.width = 400;this.skillsBg.height = 132;

        for (let i = 0; i < this.maxBonusLines; i++) {
            const rowY = this.skillsBg.y - 24 + i * 45;
            const icon = this.attachSprite("shopSkillEnergy", "skillIcon" + i);
            icon.x = -156;
            icon.y = rowY;
            icon.scale.set(0.22);
            icon.visible = false;

            const label = this.attachText("skillLabel" + i, "", {
                font: "38px Bookman Old Style",
                fill: Label.INK,
                align: "left"
            });
            label.anchor.set(0, 0.5);
            label.x = -124;
            label.y = rowY + 1;
            label.visible = false;

            const infoButton = this.attachButton("characterItemInfoDetailsButton", () => this.showArtifactBonusSkillInfo(i), "artifactBonusInfo" + i);
            infoButton.x = 156;infoButton.width = 38;infoButton.height = 40;
            infoButton.y = rowY;
            infoButton.visible = false;
            infoButton.inputEnabled = false;

            this.skillRows.push({
                icon: icon,
                label: label,
                infoButton: infoButton
            });
        }

        this.descriptionLabel = new Label(this.game, 0, ArtifactInfoPanel.DESCRIPTION_TOP_Y - (this.compactDetails ? 24 : 0), "", {
            font: "italic 38px Times New Roman",
            fill: Label.INK,
            align: "center",
            wordWrap: true,
            wordWrapWidth: 390
        });
        this.descriptionLabel.name = "descriptionLabel";
        this.descriptionLabel.anchor.set(0.5, 0);
        this.descriptionLabel.lineGap = -8;
        this.addSprite(this.descriptionLabel);

        this.contentBody = this.attachText("contentBody", "", {
            font: "bold 36px Arial",
            fill: Label.INK,
            align: "center",
            wordWrap: true,
            wordWrapWidth: ArtifactInfoPanel.BODY_WORD_WRAP_WIDTH
        });
        this.contentBody.anchor.set(0.5, 0);
        this.contentBody.lineSpacing = 10;
        this.contentBody.x = 0;
        this.contentBody.y = ArtifactInfoPanel.PLAIN_BODY_TOP_Y;

        this.upgradeButton = this.attachButton("characterCloseButton", () => this.handleUpgrade(), "upgradeButton");
        this.upgradeButton.x = 0;
        this.upgradeButton.y = ArtifactInfoPanel.UPGRADE_BUTTON_CENTER_Y - (this.compactDetails ? 36 : 0);
        this.upgradeButton.width = 400;this.upgradeButton.height = 116;
        this.upgradeButton.alpha = 0;
        this.upgradeButton.inputEnabled = false;

        this.upgradeButtonLabel = this.addButtonText(this.upgradeButton, "", {
            font: "bold 34px Gilroy",
            fill: "#efffdd",
            align: "center"
        }, -2);

        this.upgradeButtonGemIcon = SpriteUtils.createSprite(this.game, 118, -1, "gems");
        this.upgradeButtonGemIcon.anchor.set(0.5);
        this.upgradeButtonGemIcon.scale.set(0.35);
        SpriteUtils.fitIcon(this.upgradeButtonGemIcon, 38, 38);
        this.upgradeButtonGemIcon.alpha = 0;
        this.upgradeButton.addChild(this.upgradeButtonGemIcon);

        this.actionLinkText = new Label(this.game, 0, ArtifactInfoPanel.ACTION_LINK_TOP_Y - (this.compactDetails ? 48 : 0), "", {
            font: "bold 36px Arial",
            fill: "#315e49",
            align: "center"
        });
        this.actionLinkText.name = "actionLinkText";
        this.actionLinkText.anchor.set(0.5, 0);
        this.actionLinkText.visible = false;
        this.addSprite(this.actionLinkText);

        this.actionLinkUnderline = new Phaser.Graphics(this.game, 0, 0);
        this.actionLinkUnderline.name = "actionLinkUnderline";
        this.actionLinkUnderline.visible = false;
        this.addChild(this.actionLinkUnderline);

        this.actionLinkHitArea = this.attachButton("blank", () => this.handleAction(), "actionLinkHitArea");
        this.actionLinkHitArea.anchor.set(0.5, 0);
        this.actionLinkHitArea.alpha = 0.001;
        this.actionLinkHitArea.visible = false;
        this.actionLinkHitArea.inputEnabled = false;
        if (this.actionLinkHitArea.input) {
            this.actionLinkHitArea.input.useHandCursor = true;
        }

        this.hideArtifactDetails();
    }

    private setArtifactDetailsVisible(visible: boolean): void {
        this.restrictionLabel.visible = visible;
        this.progressEmpty.visible = visible;
        this.progressFull.visible = visible;
        this.progressLabel.visible = visible;
        this.skillsBg.visible = visible;
        this.descriptionLabel.visible = visible;
    }

    private hideSkillRows(): void {
        this.skillRows.forEach(row => {
            row.icon.visible = false;
            row.label.visible = false;
            row.label.text = "";
            (<any>row.infoButton).skillId = null;
            row.infoButton.visible = false;
            row.infoButton.inputEnabled = false;
        });
    }

    private updateProgressCrop(level: number, maxLevel: number): void {
        const width = 154;
        const height = 48;
        const ratio = Math.max(0, Math.min(1, maxLevel > 0 ? level / maxLevel : 0));
        const cropWidth = Math.max(1, Math.round(width * ratio));

        this.progressFull.crop(new Phaser.Rectangle(0, 0, cropWidth, height), false);
        this.progressFull.updateCrop();
    }

    private getRestrictionText(slotText: string, usageText: string, usageKey?: string): string {
        const slot = slotText || "";
        let usage = usageText || "";
        const normalizedUsage = usage.toLowerCase();

        if (usageKey == "shop.item.universal.usage" || normalizedUsage.indexOf("подходит всем") != -1 || normalizedUsage.indexOf("fits all") != -1) {
            const universalText = LocalizationService.isRussian() ? "Универсальный" : "Universal";
            return slot ? universalText + " " + this.lowercaseFirst(slot) : universalText;
        }

        usage = usage.replace(/^Только\s+/i, "");
        usage = usage.replace(/^Only\s+/i, "");

        if (!slot) {
            return usage;
        }

        if (!usage) {
            return slot;
        }

        return slot + " " + this.lowercaseFirst(usage);
    }

    private lowercaseFirst(text: string): string {
        if (!text) {
            return "";
        }

        return text.charAt(0).toLowerCase() + text.substring(1);
    }

    private handleAction(): void {
        if (this.actionHandler) {
            this.actionHandler();
        }
    }

    private handleUpgrade(): void {
        if (this.upgradeHandler) {
            this.upgradeHandler();
        }
    }

    private addButtonText(button: Phaser.Button, text: string, style: Phaser.PhaserTextStyle, offsetY?: number): Label {
        const label = new Label(this.game, 0, offsetY || 0, text, style);
        label.anchor.set(0.5);
        button.addChild(label);
        return label;
    }

    private showArtifactBonusSkillInfo(index: number): void {
        const row = this.skillRows[index];
        const skillId = row ? <ShopArtifactSkillId>(<any>row.infoButton).skillId : null;
        if (!skillId || !this.skillInfoHandler) {
            return;
        }

        this.skillInfoHandler(skillId);
    }
}
