import ShopArtifactItemsConfiguration from "../../../core/configuration/ShopArtifactItemsConfiguration";
import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import GameText from "../../../core/localization/GameText";
import LocalizationService from "../../../core/localization/LocalizationService";
import { CharacterArtifactSlotId } from "../../../core/model/character/CharacterModels";
import { ShopArtifactBackpackEntry, ShopArtifactItemConfig, ShopArtifactSkillId } from "../../../core/model/shop/ShopArtifactModels";
import ShopArtifactService from "../../../core/service/ShopArtifactService";
import UserService from "../../../core/service/UserService";
import AnimationUtils from "../../../core/utils/AnimationUtils";
import SoundUtils from "../../../core/utils/SoundUtils";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import HouseScreen from "../../screen/HouseScreen";
import ClosablePanel from "../panel/ClosablePanel";
import Label from "../panel/Label";
import ArtifactEquipPanel from "./ArtifactEquipPanel";
import ArtifactInfoPanel, { ArtifactInfoLine } from "./ArtifactInfoPanel";
import ConfirmPanel from "./ConfirmPanel";
import SkillInfoPanel from "./SkillInfoPanel";

interface BackpackCellView {
    highlight: Phaser.Sprite;
    icon: Phaser.Sprite;
    hitArea: Phaser.Button;
}

export default class ArtifactBackpackPanel extends ClosablePanel {
    private static readonly PSD_WIDTH = 960;
    private static readonly PSD_HEIGHT = 1669;
    private static readonly GRID_POSITIONS: { x: number, y: number }[] = [
        { x: 178, y: 373 },
        { x: 379, y: 373 },
        { x: 580, y: 373 },
        { x: 781, y: 373 },
        { x: 178, y: 573 },
        { x: 379, y: 573 },
        { x: 580, y: 573 },
        { x: 781, y: 573 },
        { x: 178, y: 773 },
        { x: 379, y: 773 },
        { x: 580, y: 773 },
        { x: 781, y: 773 }
    ];

    private screen: HouseScreen;
    private returnCharacterId: string;
    private openCharacterIdOnClose: string;
    private openCharacterSlotOnClose: CharacterArtifactSlotId = null;
    private panelHitArea: Phaser.Sprite;
    private bannerTitle: Label;
    private artifactInfoPanel: ArtifactInfoPanel;
    private closeButton: Phaser.Button;
    private closeButtonLabel: Label;
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

        const background = this.attachSprite("backpackPanelBg", "backpackPanelBg");
        this.placeAtPsdCenter(background, 480, 835);

        this.bannerTitle = this.attachText("bannerTitle", "", {
            font: "bold 42px Bookman Old Style",
            fill: "#f6fdff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });
        this.bannerTitle.anchor.set(0.5);
        this.placeAtPsdCenter(this.bannerTitle, 490, 117);

        this.artifactInfoPanel = new ArtifactInfoPanel(this.game, 0, 0, {
            onAction: () => this.openEquipPanel(),
            onUpgrade: () => this.tryUpgradeSelectedArtifact(),
            onSkillInfo: skillId => this.openSkillInfoPanel(skillId)
        });
        this.artifactInfoPanel.y = 112;
        this.addSprite(this.artifactInfoPanel);

        ArtifactBackpackPanel.GRID_POSITIONS.forEach((position, index) => {
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
        this.artifactInfoPanel.setUpgradeButtonVisible(false);
        this.artifactInfoPanel.setTitle(LocalizationService.get("ui.character.backpackTitle", "Backpack"));
        this.artifactInfoPanel.setBodyPlain(LocalizationService.get("ui.character.backpackEmpty", "Backpack is empty for now."));
    }

    private showArtifactInfo(entry: ShopArtifactBackpackEntry): void {
        const item = ShopArtifactItemsConfiguration.getById(entry.id);
        if (!item) {
            this.artifactInfoPanel.setUpgradeButtonVisible(false);
            this.showEmptyBackpackInfo();
            return;
        }

        const bonusSkillIds = item.skillIds
            .filter(skillId => !!ShopArtifactSkillsConfiguration.getById(skillId));

        const bonusLines = <ArtifactInfoLine[]>bonusSkillIds
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

        this.artifactInfoPanel.showArtifactDetails({
            title: LocalizationService.get(item.name),
            description: LocalizationService.get(item.descriptionText, ""),
            level: entry.level,
            maxLevel: item.maxLevel,
            slotText: this.getAllowedSlotText(item),
            usageText: ShopArtifactService.getUsageText(item),
            usageKey: item.usageText,
            skillIds: bonusSkillIds,
            bonusLines: bonusLines
        });
        this.artifactInfoPanel.refreshUpgradeButton(item, entry.level);
        this.refreshActionLink();
    }

    private tryUpgradeSelectedArtifact(): void {
        if (!this.selectedArtifactId) {
            return;
        }

        const entry = UserService.getUser().getArtifactBackpackEntry(this.selectedArtifactId);
        if (!entry) {
            this.artifactInfoPanel.setUpgradeButtonVisible(false);
            return;
        }

        const item = ShopArtifactItemsConfiguration.getById(entry.id);
        if (!item) {
            this.artifactInfoPanel.setUpgradeButtonVisible(false);
            return;
        }

        const result = ShopArtifactService.upgradeOwnedItem(item.id, UserService.getUser());
        if (result == 'success') {
            SoundUtils.successfulBuy();
            AnimationUtils.highlight(this.game, this.game.width / 2, this.game.height / 2 + 185, "splashY", 0, 1.3, 900);
            this.artifactInfoPanel.showUpgradeSuccessFeedback();
            this.refreshGrid();
            return;
        }

        if (result == 'notEnoughGems') {
            this.showNotEnoughGems(item, entry.level);
        }
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

    private showNotEnoughGems(item: ShopArtifactItemConfig, currentLevel: number): void {
        const missingGems = Math.max(0, ShopArtifactService.getUpgradePrice(item, currentLevel) - UserService.getUser().getSupermoney());
        let info = new ConfirmPanel(
            this.game,
            LocalizationService.get('ui.shop.notEnoughGemsTitle', 'Not enough gems'),
            LocalizationService.get('ui.ok', 'OK'),
            LocalizationService.get('ui.shop.notEnoughGemsText', 'You are short of ~{gems}~ for this purchase.', {
                gems: GameText.gems(missingGems)
            })
        );
        this.game.add.existing(info);
        info.show();
    }

    private refreshActionLink(): void {
        this.artifactInfoPanel.showActionLink(LocalizationService.get("ui.character.wear", "Wear"));
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
