import ShopArtifactItemsConfiguration from "../../../core/configuration/ShopArtifactItemsConfiguration";
import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { CharacterArtifactSlotId } from "../../../core/model/character/CharacterModels";
import { ShopArtifactBackpackEntry, ShopArtifactItemConfig, ShopArtifactSkillId } from "../../../core/model/shop/ShopArtifactModels";
import ShopArtifactService from "../../../core/service/ShopArtifactService";
import UserService from "../../../core/service/UserService";
import SoundUtils from "../../../core/utils/SoundUtils";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import HouseScreen from "../../screen/HouseScreen";
import ClosablePanel from "../panel/ClosablePanel";
import Label from "../panel/Label";
import ArtifactEquipPanel from "./ArtifactEquipPanel";
import SkillInfoPanel from "./SkillInfoPanel";

interface BackpackCellView {
    bg: Phaser.Sprite;
    highlight: Phaser.Sprite;
    icon: Phaser.Sprite;
    hitArea: Phaser.Button;
}

interface RichTextLine {
    text: string;
    color?: string;
}

export default class ArtifactBackpackPanel extends ClosablePanel {
    private static readonly PSD_WIDTH = 960;
    private static readonly PSD_HEIGHT = 1669;
    private static readonly ACTION_LINK_CENTER_Y = 1409;
    private static readonly GRID_POSITIONS: { x: number, y: number }[] = [
        { x: 244, y: 339 },
        { x: 480, y: 339 },
        { x: 716, y: 339 },
        { x: 244, y: 530 },
        { x: 480, y: 530 },
        { x: 716, y: 530 },
        { x: 244, y: 721 },
        { x: 480, y: 721 },
        { x: 716, y: 721 }
    ];

    private screen: HouseScreen;
    private returnCharacterId: string;
    private openCharacterIdOnClose: string;
    private openCharacterSlotOnClose: CharacterArtifactSlotId = null;
    private panelHitArea: Phaser.Sprite;
    private bannerTitle: Label;
    private contentTitle: Label;
    private contentBody: Label;
    private contentBodyRich: Phaser.Text;
    private actionLinkText: Phaser.Text;
    private actionLinkUnderline: Phaser.Graphics;
    private actionLinkHitArea: Phaser.Button;
    private closeButton: Phaser.Button;
    private closeButtonLabel: Label;
    private artifactBonusLabels: Label[] = [];
    private artifactBonusInfoButtons: Phaser.Button[] = [];
    private cells: BackpackCellView[] = [];
    private selectedArtifactId: string = null;

    constructor(game: Phaser.Game, screen: HouseScreen, returnCharacterId?: string) {
        super(
            game,
            game.width / 2,
            game.height / 2,
            true,
            "blank",
            Math.min(1, game.width / ArtifactBackpackPanel.PSD_WIDTH, game.height / ArtifactBackpackPanel.PSD_HEIGHT)
        );
        this.screen = screen;
        this.returnCharacterId = returnCharacterId || UserService.getUser().getCurrentCharacterId();
        this.visible = false;
        this.fixedToCamera = true;

        this.createLayout();
    }

    protected onShow(): void {
        this.screen.hideUI(0, true);
        this.refreshStaticTexts();
        this.refreshGrid();
    }

    protected onClose(): void {
        if (this.screen && this.screen.characterPanel) {
            const targetCharacterId = this.openCharacterIdOnClose || this.returnCharacterId || UserService.getUser().getCurrentCharacterId();
            this.screen.characterPanel.queueCharacterFocus(targetCharacterId, this.openCharacterSlotOnClose);
            this.game.time.events.add(360, () => {
                this.screen.characterPanel.show();
            });
            return;
        }

        this.screen.showUI(true);
    }

    private createLayout(): void {
        this.panelHitArea = this.attachSprite("blank", "panelHitArea");
        this.panelHitArea.width = ArtifactBackpackPanel.PSD_WIDTH;
        this.panelHitArea.height = ArtifactBackpackPanel.PSD_HEIGHT;
        this.panelHitArea.alpha = 0.001;
        this.panelHitArea.inputEnabled = true;

        const gridPanel = this.attachSprite("helperPanel", "gridPanel");
        this.placeAtPsdCenter(gridPanel, 480, 497);
        gridPanel.scale.set(1.08, 1.28);
        gridPanel.alpha = 0.98;

        const board = this.attachSprite("characterPanelBg", "board");
        this.placeAtPsdCenter(board, 480, 1121.5);

        const banner = this.attachSprite("characterPanelBanner", "banner");
        this.placeAtPsdCenter(banner, 490, 108);

        this.bannerTitle = this.attachText("bannerTitle", "", {
            font: "bold 42px Bookman Old Style",
            fill: "#f6fdff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });
        this.bannerTitle.anchor.set(0.5);
        this.placeAtPsdCenter(this.bannerTitle, 490, 117);

        this.contentTitle = this.attachText("contentTitle", "", {
            font: "bold 34px Bookman Old Style",
            fill: "#8e5532",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 430
        });
        this.contentTitle.anchor.set(0.5);
        this.placeAtPsdCenter(this.contentTitle, 480, 885);

        this.contentBody = this.attachText("contentBody", "", {
            font: "bold 23px Arial",
            fill: "#855331",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 430
        });
        this.contentBody.anchor.set(0.5, 0);
        this.contentBody.lineSpacing = 10;
        this.contentBody.x = this.psdX(480);
        this.contentBody.y = this.psdY(922);

        this.contentBodyRich = new Phaser.Text(this.game, this.psdX(480), this.psdY(922), "", {
            font: "bold 23px Arial",
            fill: "#855331",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 430
        });
        this.contentBodyRich.name = "contentBodyRich";
        this.contentBodyRich.anchor.set(0.5, 0);
        this.contentBodyRich.lineSpacing = 10;
        this.contentBodyRich.visible = false;
        this.addSprite(this.contentBodyRich);

        for (let i = 0; i < 2; i++) {
            const bonusLabel = this.attachText("artifactBonusLabel" + i, "", {
                font: "bold 23px Arial",
                fill: "#0b6e22",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 430
            });
            bonusLabel.anchor.set(0.5, 0);
            bonusLabel.visible = false;
            bonusLabel.x = this.contentBodyRich.x;
            this.artifactBonusLabels.push(bonusLabel);
        }

        for (let i = 0; i < 2; i++) {
            const infoButton = this.attachButton("characterArtifactInfoButton", () => this.showArtifactBonusSkillInfo(i), "artifactBonusInfo" + i);
            infoButton.visible = false;
            infoButton.inputEnabled = false;
            infoButton.scale.set(0.72);
            infoButton.anchor.set(0.5);
            this.artifactBonusInfoButtons.push(infoButton);
        }

        this.actionLinkText = new Phaser.Text(this.game, this.psdX(480), this.psdY(ArtifactBackpackPanel.ACTION_LINK_CENTER_Y), "", {
            font: "bold 28px Arial",
            fill: "#3f82ff",
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

        this.actionLinkHitArea = this.attachButton("blank", () => this.openEquipPanel(), "actionLinkHitArea");
        this.actionLinkHitArea.anchor.set(0.5, 0);
        this.actionLinkHitArea.alpha = 0.001;
        this.actionLinkHitArea.visible = false;
        this.actionLinkHitArea.inputEnabled = false;
        if (this.actionLinkHitArea.input) {
            this.actionLinkHitArea.input.useHandCursor = true;
        }

        ArtifactBackpackPanel.GRID_POSITIONS.forEach((position, index) => {
            const bg = this.attachSprite("shopItemBg", "cellBg" + index);
            this.placeAtPsdCenter(bg, position.x, position.y);
            bg.scale.set(1.02);
            bg.alpha = 0.94;

            const highlight = this.attachSprite("characterArtifactHighlight", "cellHighlight" + index);
            this.placeAtPsdCenter(highlight, position.x, position.y);
            highlight.visible = false;

            const icon = this.attachSprite("shopItem1", "cellIcon" + index);
            this.placeAtPsdCenter(icon, position.x, position.y);
            icon.visible = false;

            const hitArea = this.attachButton("blank", () => this.selectBackpackCell(index), "cellHitArea" + index);
            this.placeAtPsdCenter(hitArea, position.x, position.y);
            hitArea.width = 160;
            hitArea.height = 160;
            hitArea.alpha = 0.001;

            this.cells.push({
                bg: bg,
                highlight: highlight,
                icon: icon,
                hitArea: hitArea
            });
        });

        this.closeButton = this.attachButton("characterCloseButton", () => this.close(), "closeButton");
        this.placeAtPsdCenter(this.closeButton, 481.5, 1549.5);
        this.closeButtonLabel = this.addButtonText(this.closeButton, "", {
            font: "bold 40px Gilroy",
            fill: "#efffdd",
            align: "center"
        }, -1);
    }

    private refreshStaticTexts(): void {
        this.bannerTitle.text = LocalizationService.get("ui.character.backpackTitle", "Backpack");
        this.closeButtonLabel.text = LocalizationService.get("ui.character.close", "Close");
    }

    private refreshGrid(): void {
        const backpack = UserService.getUser().getArtifactBackpack();

        if (backpack.length == 0) {
            this.selectedArtifactId = null;
        } else if (!this.selectedArtifactId || !UserService.getUser().hasArtifactInBackpack(this.selectedArtifactId)) {
            this.selectedArtifactId = backpack[0].id;
        }

        this.cells.forEach((cell, index) => {
            const entry = backpack[index];
            if (!entry) {
                cell.icon.visible = false;
                cell.hitArea.inputEnabled = false;
                cell.highlight.visible = false;
                return;
            }

            const item = ShopArtifactItemsConfiguration.getById(entry.id);
            if (!item) {
                cell.icon.visible = false;
                cell.hitArea.inputEnabled = false;
                cell.highlight.visible = false;
                return;
            }

            SpriteUtils.loadTexture(cell.icon, item.icon);
            cell.icon.visible = true;
            cell.icon.scale.set((item.iconScale || 0.52) * 1.32);
            cell.hitArea.inputEnabled = true;
            cell.highlight.visible = entry.id == this.selectedArtifactId;
        });

        if (backpack.length == 0) {
            this.showEmptyBackpackInfo();
            return;
        }

        const selectedEntry = UserService.getUser().getArtifactBackpackEntry(this.selectedArtifactId);
        if (!selectedEntry) {
            this.showEmptyBackpackInfo();
            return;
        }

        this.showArtifactInfo(selectedEntry);
    }

    private selectBackpackCell(index: number): void {
        const backpack = UserService.getUser().getArtifactBackpack();
        const entry = backpack[index];
        if (!entry) {
            return;
        }

        this.selectedArtifactId = entry.id;
        this.refreshGrid();
    }

    private showEmptyBackpackInfo(): void {
        this.contentTitle.text = LocalizationService.get("ui.character.backpackTitle", "Backpack");
        this.setContentBodyPlain(LocalizationService.get("ui.character.backpackEmpty", "Backpack is empty for now."));
    }

    private showArtifactInfo(entry: ShopArtifactBackpackEntry): void {
        const item = ShopArtifactItemsConfiguration.getById(entry.id);
        if (!item) {
            this.showEmptyBackpackInfo();
            return;
        }

        const bonusSkillIds = item.skillIds
            .filter(skillId => !!ShopArtifactSkillsConfiguration.getById(skillId));

        const bonusLines = <RichTextLine[]>bonusSkillIds
            .map(skillId => {
                const skillConfig = ShopArtifactSkillsConfiguration.getById(skillId);
                if (!skillConfig) {
                    return null;
                }

                return {
                    text: this.capitalize(LocalizationService.get(skillConfig.name)) + " +" + entry.level * skillConfig.valuePerLevel,
                    color: "#0b6e22"
                };
            })
            .filter(line => !!line);

        this.contentTitle.text = LocalizationService.get(item.name);
        this.setContentBodyRich([
            {
                text: LocalizationService.get(item.descriptionText, ""),
                color: "#855331"
            },
            {
                text: LocalizationService.get("shop.item.level", "Level {level} of {max}", {
                    level: entry.level,
                    max: item.maxLevel
                }),
                color: "#855331"
            },
            {
                text: LocalizationService.get("ui.character.artifactSlot", "Slot: {slot}", {
                    slot: this.getAllowedSlotText(item)
                }),
                color: "#855331"
            },
            {
                text: ShopArtifactService.getUsageText(item),
                color: "#7f187e"
            }
        ]);
        this.showArtifactBonusLines(bonusSkillIds, bonusLines);
        this.refreshActionLink();
    }

    private openEquipPanel(): void {
        if (!this.selectedArtifactId) {
            return;
        }

        const item = ShopArtifactItemsConfiguration.getById(this.selectedArtifactId);
        if (!item) {
            return;
        }

        const equipPanel = new ArtifactEquipPanel(this.game, this.selectedArtifactId, target => {
            const result = ShopArtifactService.equipBackpackItemToCharacter(this.selectedArtifactId, target.characterId);
            if (!result) {
                this.refreshGrid();
                return;
            }

            SoundUtils.successfulBuy();
            this.openCharacterIdOnClose = result.characterId;
            this.openCharacterSlotOnClose = result.slot;
            this.close();
        });
        this.screen.addPanel(equipPanel);
        equipPanel.show();
    }

    private openSkillInfoPanel(skillId: ShopArtifactSkillId): void {
        const info = new SkillInfoPanel(this.game, skillId);
        this.game.add.existing(info);
        info.show();
    }

    private setContentBodyPlain(text: string): void {
        this.contentBody.visible = true;
        this.contentBodyRich.visible = false;
        this.hideArtifactBonusDetails();
        this.hideActionLink();
        this.contentBody.text = text;
        this.contentBodyRich.clearColors();
        this.contentBodyRich.text = "";
    }

    private setContentBodyRich(lines: RichTextLine[]): void {
        this.contentBody.visible = false;
        this.contentBodyRich.visible = true;
        this.hideArtifactBonusDetails();
        this.hideActionLink();

        let text = "";
        let ranges: { start: number, color: string }[] = [];

        lines.forEach(line => {
            if (!line || !line.text) {
                return;
            }

            if (text.length > 0) {
                text += "\n";
            }

            if (line.color) {
                ranges.push({ start: text.length, color: line.color });
            }

            text += line.text;

            if (line.color) {
                ranges.push({ start: text.length, color: "#855331" });
            }
        });

        this.contentBodyRich.clearColors();
        this.contentBodyRich.text = text;
        ranges.forEach(range => this.contentBodyRich.addColor(range.color, range.start));
    }

    private showArtifactBonusLines(skillIds: ShopArtifactSkillId[], lines: RichTextLine[]): void {
        this.hideArtifactBonusDetails();

        if (!skillIds || skillIds.length == 0 || !lines || lines.length == 0) {
            return;
        }

        const bonusButtonX = this.psdX(632);
        let nextLabelY = this.contentBodyRich.y + this.contentBodyRich.height + 6;

        skillIds.forEach((skillId, index) => {
            const line = lines[index];
            const label = this.artifactBonusLabels[index];
            const button = this.artifactBonusInfoButtons[index];
            if (!line || !label || !button) {
                return;
            }

            label.text = line.text;
            label.x = this.contentBodyRich.x;
            label.y = nextLabelY;
            label.visible = true;
            label.updateText();

            (<any>button).skillId = skillId;
            button.x = bonusButtonX;
            button.y = label.y + label.height / 2;
            button.visible = true;
            button.inputEnabled = true;

            nextLabelY = label.y + label.height + 2;
        });
    }

    private hideArtifactBonusDetails(): void {
        this.artifactBonusLabels.forEach(label => {
            label.visible = false;
            label.text = "";
        });

        this.artifactBonusInfoButtons.forEach(button => {
            (<any>button).skillId = null;
            button.visible = false;
            button.inputEnabled = false;
        });
    }

    private showArtifactBonusSkillInfo(index: number): void {
        const button = this.artifactBonusInfoButtons[index];
        const skillId = button ? <ShopArtifactSkillId>(<any>button).skillId : null;
        if (!skillId) {
            return;
        }

        this.openSkillInfoPanel(skillId);
    }

    private refreshActionLink(): void {
        this.actionLinkText.text = LocalizationService.get("ui.character.wear", "Wear");
        this.actionLinkText.visible = true;

        const textWidth = Math.ceil(this.actionLinkText.width);
        const textHeight = Math.ceil(this.actionLinkText.height);

        this.actionLinkUnderline.clear();
        this.actionLinkUnderline.lineStyle(2, 0x3f82ff, 1);
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

    private hideActionLink(): void {
        this.actionLinkText.visible = false;
        this.actionLinkText.text = "";

        this.actionLinkUnderline.clear();
        this.actionLinkUnderline.visible = false;

        this.actionLinkHitArea.visible = false;
        this.actionLinkHitArea.inputEnabled = false;
    }

    private getAllowedSlotText(item: ShopArtifactItemConfig): string {
        const safeSlots = item && item.allowedSlots ? item.allowedSlots : [];
        if (safeSlots.length == 0) {
            return "";
        }

        return safeSlots
            .map(slot => LocalizationService.get("ui.character.slot." + slot, slot))
            .join(", ");
    }

    private addButtonText(button: Phaser.Button, text: string, style: Phaser.PhaserTextStyle, offsetY?: number): Label {
        const label = new Label(this.game, 0, offsetY || 0, text, style);
        label.anchor.set(0.5);
        button.addChild(label);
        return label;
    }

    private placeAtPsdCenter(displayObject: PIXI.DisplayObject, centerX: number, centerY: number): void {
        (<any>displayObject).x = this.psdX(centerX);
        (<any>displayObject).y = this.psdY(centerY);
    }

    private psdX(value: number): number {
        return value - ArtifactBackpackPanel.PSD_WIDTH / 2;
    }

    private psdY(value: number): number {
        return value - ArtifactBackpackPanel.PSD_HEIGHT / 2;
    }

    private capitalize(value: string): string {
        if (!value) {
            return "";
        }

        return value.charAt(0).toUpperCase() + value.substring(1);
    }
}
