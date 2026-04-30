import CharactersConfiguration from "../../../core/configuration/CharactersConfiguration";
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
import ConfirmPanel from "./ConfirmPanel";
import SkillInfoPanel from "./SkillInfoPanel";
import ShopPanel from "./ShopPanel";

interface SkillRowView {
    icon: Phaser.Sprite;
    valueLabel: Label;
    infoButton: Phaser.Button;
}

interface SlotView {
    equippedBg: Phaser.Sprite;
    highlight: Phaser.Sprite;
    icon: Phaser.Sprite;
    hitArea: Phaser.Button;
    infoButton: Phaser.Button;
}

interface RichTextLine {
    text: string;
    color?: string;
}

export default class CharacterPanel extends ClosablePanel {
    private static readonly PSD_WIDTH = 960;
    private static readonly PSD_HEIGHT = 1669;
    private static readonly MAX_VISIBLE_SKILLS = 3;
    private static readonly ACTION_BUTTON_HIDDEN_OFFSET = 240;
    private static readonly ACTION_BUTTON_OPEN_DELAY = 220;
    private static readonly ACTION_BUTTON_OPEN_DURATION = 260;
    private static readonly ACTION_BUTTON_CLOSE_DURATION = 120;

    private static readonly SKILL_ROWS = [
        { iconX: 551, iconY: 410.5, valueX: 663.5, valueY: 409.5, infoX: 774.5, infoY: 408 },
        { iconX: 551, iconY: 549.5, valueX: 663.5, valueY: 539.5, infoX: 774.5, infoY: 548 },
        { iconX: 558.5, iconY: 669, valueX: 663.5, valueY: 668.5, infoX: 774.5, infoY: 672 }
    ];

    private static readonly SLOT_LAYOUT: { slotId: CharacterArtifactSlotId, x: number, y: number, infoX: number, infoY: number }[] = [
        { slotId: 'helmet', x: 123.5, y: 912, infoX: 167.5, infoY: 972 },
        { slotId: 'weapon', x: 112, y: 1116.5, infoX: 156, infoY: 1176.5 },
        { slotId: 'boots', x: 112.5, y: 1318.5, infoX: 156.5, infoY: 1378.5 },
        { slotId: 'amulet', x: 848.5, y: 914.5, infoX: 804.5, infoY: 974.5 },
        { slotId: 'armor', x: 849, y: 1116.5, infoX: 805, infoY: 1176.5 },
        { slotId: 'ring', x: 847, y: 1317, infoX: 803, infoY: 1377 }
    ];

    private screen: HouseScreen;
    private panelScale: number;
    private panelHitArea: Phaser.Sprite;
    private portrait: Phaser.Sprite;
    private portraitHitArea: Phaser.Button;
    private bannerTitle: Label;
    private contentTitle: Label;
    private contentBody: Label;
    private contentBodyRich: Phaser.Text;
    private artifactBonusLabels: Label[] = [];
    private arrowLeftButton: Phaser.Button;
    private arrowRightButton: Phaser.Button;
    private backpackButton: Phaser.Button;
    private backpackButtonLabel: Label;
    private shopButton: Phaser.Button;
    private shopButtonLabel: Label;
    private closeButton: Phaser.Button;
    private closeButtonLabel: Label;
    private backpackButtonShownY: number;
    private shopButtonShownY: number;
    private upgradeButton: Phaser.Button;
    private upgradeButtonLabel: Label;
    private upgradeButtonGemIcon: Phaser.Sprite;
    private artifactBonusInfoButtons: Phaser.Button[] = [];
    private skillRows: SkillRowView[] = [];
    private slotViews: { [slotId: string]: SlotView } = {};
    private currentCharacterIndex: number = 0;
    private openingShop: boolean = false;
    private selectedArtifactSlot: CharacterArtifactSlotId = null;

    constructor(game: Phaser.Game, screen: HouseScreen) {
        super(
            game,
            game.width / 2,
            game.height / 2,
            true,
            "blank",
            Math.min(1, game.width / CharacterPanel.PSD_WIDTH, game.height / CharacterPanel.PSD_HEIGHT)
        );
        this.screen = screen;
        this.panelScale = Math.min(1, game.width / CharacterPanel.PSD_WIDTH, game.height / CharacterPanel.PSD_HEIGHT);
        this.visible = false;
        this.fixedToCamera = true;

        this.createLayout();
    }

    protected onShow(): void {
        this.openingShop = false;
        this.prepareBottomActionButtonsForShow();
        this.syncSelectedCharacter();
        this.refreshStaticTexts();
        this.refreshView();
        this.screen.hideUI(0, true);
        this.bringDetachedActionButtonsToTop();
        this.game.time.events.add(140, () => {
            if (this.visible) {
                this.bringDetachedActionButtonsToTop();
            }
        });
        this.animateBottomActionButtonsIn();
    }

    protected onClose(): void {
        this.animateBottomActionButtonsOut();

        if (this.openingShop) {
            this.game.time.events.add(360, () => {
                let shopPanel = new ShopPanel(this.game, this.screen, undefined, 'items');
                this.screen.addPanel(shopPanel);
                shopPanel.show();
            });
            return;
        }

        this.screen.showUI(true);
    }

    private createLayout(): void {
        this.panelHitArea = this.attachSprite("blank", "panelHitArea");
        this.panelHitArea.width = CharacterPanel.PSD_WIDTH;
        this.panelHitArea.height = CharacterPanel.PSD_HEIGHT;
        this.panelHitArea.alpha = 0.001;
        this.panelHitArea.inputEnabled = true;

        const skillsBg = this.attachSprite("characterSkillsBg", "skillsBg");
        this.placeAtPsdCenter(skillsBg, 645.5, 550);

        this.portrait = this.attachSprite("sveta1", "portrait");
        this.placeAtPsdCenter(this.portrait, 290.5, 534.5);

        this.portraitHitArea = this.attachButton("blank", () => this.showCharacterDescription(), "portraitHitArea");
        this.placeAtPsdCenter(this.portraitHitArea, 286, 532);
        this.portraitHitArea.width = 360;
        this.portraitHitArea.height = 600;
        this.portraitHitArea.alpha = 0.001;

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

        this.arrowLeftButton = this.attachButton("characterArrowLeft", () => this.shiftCharacter(-1), "arrowLeftButton");
        this.placeAtPsdCenter(this.arrowLeftButton, 81, 731);

        this.arrowRightButton = this.attachButton("characterArrowRight", () => this.shiftCharacter(1), "arrowRightButton");
        this.placeAtPsdCenter(this.arrowRightButton, 877, 728.5);

        CharacterPanel.SKILL_ROWS.forEach((row, index) => {
            const icon = this.attachSprite("shopSkillEnergy", "skillIcon" + index);
            this.placeAtPsdCenter(icon, row.iconX, row.iconY);
            icon.scale.set(0.88);

            const valueLabel = this.attachText("skillValue" + index, "", {
                font: "bold 48px Gilroy",
                fill: "#fff6dd",
                align: "center"
            });
            valueLabel.anchor.set(0.5);
            this.placeAtPsdCenter(valueLabel, row.valueX, row.valueY);

            const infoButton = this.attachButton("characterSkillInfoButton", () => this.showSkillInfo(index), "skillInfo" + index);
            this.placeAtPsdCenter(infoButton, row.infoX, row.infoY);

            this.skillRows.push({
                icon: icon,
                valueLabel: valueLabel,
                infoButton: infoButton
            });
        });

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

        this.upgradeButton = this.attachButton("characterCloseButton", () => this.tryUpgradeSelectedArtifact(), "upgradeButton");
        this.placeAtPsdCenter(this.upgradeButton, 480, 1318);
        this.upgradeButton.alpha = 0;
        this.upgradeButton.inputEnabled = false;

        this.upgradeButtonLabel = this.addButtonText(this.upgradeButton, "", {
            font: "bold 28px Gilroy",
            fill: "#efffdd",
            align: "center"
        }, -2);

        this.upgradeButtonGemIcon = SpriteUtils.createSprite(this.game, 118, -1, "gems");
        this.upgradeButtonGemIcon.anchor.set(0.5);
        this.upgradeButtonGemIcon.scale.set(0.35);
        this.upgradeButtonGemIcon.alpha = 0;
        this.upgradeButton.addChild(this.upgradeButtonGemIcon);

        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const equippedBg = this.attachSprite("characterEquippedBg", layout.slotId + "EquippedBg");
            this.placeAtPsdCenter(equippedBg, layout.x, layout.y);
            equippedBg.visible = false;

            const highlight = this.attachSprite("characterArtifactHighlight", layout.slotId + "Highlight");
            this.placeAtPsdCenter(highlight, layout.x, layout.y);
            highlight.visible = false;

            const icon = this.attachSprite("shopItem1", layout.slotId + "Icon");
            this.placeAtPsdCenter(icon, layout.x, layout.y);
            icon.visible = false;

            const hitArea = this.attachButton("blank", () => this.showArtifactInfo(layout.slotId), layout.slotId + "HitArea");
            this.placeAtPsdCenter(hitArea, layout.x, layout.y);
            hitArea.width = 160;
            hitArea.height = 160;
            hitArea.alpha = 0.001;
            hitArea.visible = false;
            hitArea.inputEnabled = false;

            const infoButton = this.attachButton("characterArtifactInfoButton", () => this.showArtifactInfo(layout.slotId), layout.slotId + "Info");
            this.placeAtPsdCenter(infoButton, layout.infoX, layout.infoY);
            infoButton.visible = false;
            infoButton.inputEnabled = false;

            this.slotViews[layout.slotId] = {
                equippedBg: equippedBg,
                highlight: highlight,
                icon: icon,
                hitArea: hitArea,
                infoButton: infoButton
            };
        });

        this.backpackButton = this.createDetachedActionButton("characterBackpackButton", () => this.showBackpackInfo(), "backpackButton");
        this.placeDetachedActionButtonAtPsdCenter(this.backpackButton, 120.5, 1559);
        this.backpackButtonLabel = this.addButtonText(this.backpackButton, "", {
            font: "bold 30px Gilroy",
            fill: "#fff1d7",
            align: "center"
        }, 58);
        this.backpackButtonShownY = this.backpackButton.cameraOffset.y;

        this.shopButton = this.createDetachedActionButton("characterShopButton", () => this.openShop(), "shopButton");
        this.placeDetachedActionButtonAtPsdCenter(this.shopButton, 842.5, 1554.5);
        this.shopButtonLabel = this.addButtonText(this.shopButton, "", {
            font: "bold 30px Gilroy",
            fill: "#fff1d7",
            align: "center"
        }, 62);
        this.shopButtonShownY = this.shopButton.cameraOffset.y;
        this.setBottomActionButtonsHiddenState();

        this.closeButton = this.attachButton("characterCloseButton", () => this.close(), "closeButton");
        this.placeAtPsdCenter(this.closeButton, 481.5, 1549.5);
        this.closeButtonLabel = this.addButtonText(this.closeButton, "", {
            font: "bold 40px Gilroy",
            fill: "#efffdd",
            align: "center"
        }, -1);
    }

    private prepareBottomActionButtonsForShow(): void {
        this.stopBottomActionButtonTweens();
        this.setBottomActionButtonsVisible(true);

        if (this.openingWithoutAnimation) {
            this.setBottomActionButtonsShownState();
            this.setBottomActionButtonsInteractive(true);
            return;
        }

        this.setBottomActionButtonsInteractive(false);
        this.setBottomActionButtonsHiddenState();
    }

    private animateBottomActionButtonsIn(): void {
        if (this.openingWithoutAnimation) {
            this.setBottomActionButtonsShownState();
            this.setBottomActionButtonsInteractive(true);
            return;
        }

        this.game.add.tween(this.backpackButton).to({
            alpha: 1
        }, CharacterPanel.ACTION_BUTTON_OPEN_DURATION, Phaser.Easing.Back.Out, true, CharacterPanel.ACTION_BUTTON_OPEN_DELAY);
        this.game.add.tween(this.backpackButton.cameraOffset).to({
            y: this.backpackButtonShownY
        }, CharacterPanel.ACTION_BUTTON_OPEN_DURATION, Phaser.Easing.Back.Out, true, CharacterPanel.ACTION_BUTTON_OPEN_DELAY);

        this.game.add.tween(this.shopButton).to({
            alpha: 1
        }, CharacterPanel.ACTION_BUTTON_OPEN_DURATION, Phaser.Easing.Back.Out, true, CharacterPanel.ACTION_BUTTON_OPEN_DELAY + 40);
        this.game.add.tween(this.shopButton.cameraOffset).to({
            y: this.shopButtonShownY
        }, CharacterPanel.ACTION_BUTTON_OPEN_DURATION, Phaser.Easing.Back.Out, true, CharacterPanel.ACTION_BUTTON_OPEN_DELAY + 40);

        this.game.time.events.add(CharacterPanel.ACTION_BUTTON_OPEN_DELAY + CharacterPanel.ACTION_BUTTON_OPEN_DURATION + 50, () => {
            if (this.visible && this.opened) {
                this.setBottomActionButtonsInteractive(true);
            }
        });
    }

    private animateBottomActionButtonsOut(): void {
        this.stopBottomActionButtonTweens();
        this.setBottomActionButtonsInteractive(false);

        this.game.add.tween(this.backpackButton).to({
            alpha: 0
        }, CharacterPanel.ACTION_BUTTON_CLOSE_DURATION, Phaser.Easing.Quadratic.In, true);
        this.game.add.tween(this.backpackButton.cameraOffset).to({
            y: this.backpackButtonShownY + CharacterPanel.ACTION_BUTTON_HIDDEN_OFFSET
        }, CharacterPanel.ACTION_BUTTON_CLOSE_DURATION, Phaser.Easing.Quadratic.In, true);

        this.game.add.tween(this.shopButton).to({
            alpha: 0
        }, CharacterPanel.ACTION_BUTTON_CLOSE_DURATION, Phaser.Easing.Quadratic.In, true);
        this.game.add.tween(this.shopButton.cameraOffset).to({
            y: this.shopButtonShownY + CharacterPanel.ACTION_BUTTON_HIDDEN_OFFSET
        }, CharacterPanel.ACTION_BUTTON_CLOSE_DURATION, Phaser.Easing.Quadratic.In, true);

        this.game.time.events.add(CharacterPanel.ACTION_BUTTON_CLOSE_DURATION + 20, () => {
            if (!this.opened) {
                this.setBottomActionButtonsVisible(false);
            }
        });
    }

    private setBottomActionButtonsShownState(): void {
        this.backpackButton.cameraOffset.y = this.backpackButtonShownY;
        this.backpackButton.alpha = 1;
        this.shopButton.cameraOffset.y = this.shopButtonShownY;
        this.shopButton.alpha = 1;
    }

    private setBottomActionButtonsHiddenState(): void {
        this.backpackButton.cameraOffset.y = this.backpackButtonShownY + CharacterPanel.ACTION_BUTTON_HIDDEN_OFFSET;
        this.backpackButton.alpha = 0;
        this.shopButton.cameraOffset.y = this.shopButtonShownY + CharacterPanel.ACTION_BUTTON_HIDDEN_OFFSET;
        this.shopButton.alpha = 0;
    }

    private setBottomActionButtonsVisible(visible: boolean): void {
        this.backpackButton.visible = visible;
        this.shopButton.visible = visible;
    }

    private setBottomActionButtonsInteractive(enabled: boolean): void {
        this.backpackButton.inputEnabled = enabled;
        this.shopButton.inputEnabled = enabled;
    }

    private stopBottomActionButtonTweens(): void {
        this.game.tweens.removeFrom(this.backpackButton);
        this.game.tweens.removeFrom(this.shopButton);
        this.game.tweens.removeFrom(this.backpackButton.cameraOffset);
        this.game.tweens.removeFrom(this.shopButton.cameraOffset);
    }

    private refreshSlotSelectionVisuals(): void {
        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const slotView = this.slotViews[layout.slotId];
            const hasArtifact = slotView.icon.visible;
            slotView.equippedBg.visible = hasArtifact;
            slotView.highlight.visible = hasArtifact && this.selectedArtifactSlot == layout.slotId;
        });
    }

    private bringDetachedActionButtonsToTop(): void {
        this.game.world.bringToTop(this.backpackButton);
        this.game.world.bringToTop(this.shopButton);
    }

    private refreshStaticTexts(): void {
        this.backpackButtonLabel.text = LocalizationService.get("ui.character.backpack", "Backpack");
        this.shopButtonLabel.text = LocalizationService.get("ui.character.shop", "Shop");
        this.closeButtonLabel.text = LocalizationService.get("ui.character.close", "Close");
    }

    private refreshView(): void {
        const user = UserService.getUser();
        const characters = user.getCharacters();
        if (characters.length == 0) {
            return;
        }

        if (this.currentCharacterIndex >= characters.length) {
            this.currentCharacterIndex = 0;
        }

        const character = characters[this.currentCharacterIndex];
        const config = CharactersConfiguration.getById(character.id);
        if (!config) {
            return;
        }

        user.setCurrentCharacterId(character.id);
        this.bannerTitle.text = config.name;
        const artifactBonuses = this.getArtifactBonusesBySkill(character.id);

        if (config.imageKey) {
            SpriteUtils.loadTexture(this.portrait, config.imageKey);
            this.portrait.visible = true;
            this.portrait.scale.set(1);
        } else {
            this.portrait.visible = false;
        }

        const skills = (character.skills || []).slice(0, CharacterPanel.MAX_VISIBLE_SKILLS);
        this.skillRows.forEach((row, index) => {
            const skillValue = skills[index];
            if (!skillValue) {
                row.icon.visible = false;
                row.valueLabel.visible = false;
                row.infoButton.visible = false;
                row.infoButton.inputEnabled = false;
                return;
            }

            const skillConfig = ShopArtifactSkillsConfiguration.getById(skillValue.skillId);
            if (!skillConfig) {
                row.icon.visible = false;
                row.valueLabel.visible = false;
                row.infoButton.visible = false;
                row.infoButton.inputEnabled = false;
                return;
            }

            SpriteUtils.loadTexture(row.icon, skillConfig.icon);
            row.icon.visible = true;
            row.valueLabel.visible = true;
            const showInfoButton = this.isArtifactSkill(skillValue.skillId);
            row.infoButton.visible = showInfoButton;
            row.infoButton.inputEnabled = showInfoButton;
            row.valueLabel.text = "" + skillValue.value;
        });

        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const slotView = this.slotViews[layout.slotId];
            const artifactEntry = user.getCharacterEquippedArtifact(character.id, layout.slotId);
            if (!artifactEntry) {
                slotView.equippedBg.visible = false;
                slotView.highlight.visible = false;
                slotView.icon.visible = false;
                slotView.hitArea.visible = false;
                slotView.hitArea.inputEnabled = false;
                slotView.infoButton.visible = false;
                slotView.infoButton.inputEnabled = false;
                return;
            }

            const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
            if (!item) {
                slotView.equippedBg.visible = false;
                slotView.highlight.visible = false;
                slotView.icon.visible = false;
                slotView.hitArea.visible = false;
                slotView.hitArea.inputEnabled = false;
                slotView.infoButton.visible = false;
                slotView.infoButton.inputEnabled = false;
                return;
            }

            SpriteUtils.loadTexture(slotView.icon, item.icon);
            slotView.icon.visible = true;
            slotView.icon.scale.set((item.iconScale || 0.52) * 1.45);
            slotView.hitArea.visible = true;
            slotView.hitArea.inputEnabled = true;
            slotView.infoButton.visible = true;
            slotView.infoButton.inputEnabled = true;
        });
        this.refreshSlotSelectionVisuals();

        const showArrows = characters.length > 1;
        this.arrowLeftButton.visible = showArrows;
        this.arrowLeftButton.inputEnabled = showArrows;
        this.arrowRightButton.visible = showArrows;
        this.arrowRightButton.inputEnabled = showArrows;

        this.showCharacterDescription();
    }

    private syncSelectedCharacter(): void {
        const user = UserService.getUser();
        const characters = user.getCharacters();
        if (characters.length == 0) {
            this.currentCharacterIndex = 0;
            return;
        }

        const currentCharacterId = user.getCurrentCharacterId();
        const nextIndex = characters.findIndex(character => character.id == currentCharacterId);
        this.currentCharacterIndex = nextIndex >= 0 ? nextIndex : 0;
    }

    private shiftCharacter(offset: number): void {
        const user = UserService.getUser();
        const characters = user.getCharacters();
        if (characters.length <= 1) {
            return;
        }

        this.currentCharacterIndex += offset;
        if (this.currentCharacterIndex < 0) {
            this.currentCharacterIndex = characters.length - 1;
        } else if (this.currentCharacterIndex >= characters.length) {
            this.currentCharacterIndex = 0;
        }

        user.setCurrentCharacterId(characters[this.currentCharacterIndex].id);
        this.refreshView();
    }

    private showCharacterDescription(): void {
        const user = UserService.getUser();
        const character = user.getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const config = CharactersConfiguration.getById(character.id);
        this.selectedArtifactSlot = null;
        this.setUpgradeButtonVisible(false);
        this.refreshSlotSelectionVisuals();
        this.contentTitle.text = config ? config.name : LocalizationService.get("ui.character.title", "Character");
        this.setContentBodyPlain(config ? LocalizationService.get(config.descriptionText, config.descriptionText) : "");
    }

    private showSkillInfo(index: number): void {
        const character = UserService.getUser().getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const skillValue = (character.skills || [])[index];
        if (!skillValue) {
            return;
        }

        const skillConfig = ShopArtifactSkillsConfiguration.getById(skillValue.skillId);
        if (!skillConfig) {
            return;
        }

        const artifactBonuses = this.getArtifactBonusesBySkill(character.id);
        this.openSkillInfoPanel(skillValue.skillId, skillValue.value, artifactBonuses[skillValue.skillId] || 0);
    }

    private showArtifactInfo(slotId: CharacterArtifactSlotId): void {
        const user = UserService.getUser();
        const character = user.getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const artifactEntry = user.getCharacterEquippedArtifact(character.id, slotId);
        if (!artifactEntry) {
            this.selectedArtifactSlot = null;
            this.setUpgradeButtonVisible(false);
            this.refreshSlotSelectionVisuals();
            this.contentTitle.text = this.getSlotName(slotId);
            this.setContentBodyPlain(LocalizationService.get("ui.character.noArtifact", "No artifact equipped."));
            return;
        }

        const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
        if (!item) {
            this.selectedArtifactSlot = null;
            this.setUpgradeButtonVisible(false);
            this.refreshSlotSelectionVisuals();
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
                    text: this.capitalize(LocalizationService.get(skillConfig.name)) + " +" + artifactEntry.level * skillConfig.valuePerLevel,
                    color: "#0b6e22"
                };
            })
            .filter(text => !!text);

        this.selectedArtifactSlot = slotId;
        this.refreshSlotSelectionVisuals();
        this.contentTitle.text = LocalizationService.get(item.name);
        const richLines: RichTextLine[] = [
            {
                text: LocalizationService.get(item.descriptionText, ""),
                color: "#855331"
            },
            {
                text: LocalizationService.get("shop.item.level", "Level {level} of {max}", {
                    level: artifactEntry.level,
                    max: item.maxLevel
                }),
                color: "#855331"
            },
            {
                text: LocalizationService.get("ui.character.artifactSlot", "Slot: {slot}", {
                    slot: this.getSlotName(slotId)
                }),
                color: "#855331"
            },
            {
                text: LocalizationService.get(item.usageText),
                color: "#7f187e"
            }
        ];
        this.setContentBodyRich(richLines);
        this.showArtifactBonusLines(bonusSkillIds, bonusLines);
        this.refreshUpgradeButton(item, artifactEntry.level);
    }

    private showBackpackInfo(): void {
        const backpack = UserService.getUser().getArtifactBackpack();
        this.selectedArtifactSlot = null;
        this.setUpgradeButtonVisible(false);
        this.refreshSlotSelectionVisuals();
        this.contentTitle.text = LocalizationService.get("ui.character.backpackTitle", "Backpack");

        if (backpack.length == 0) {
            this.setContentBodyPlain(LocalizationService.get("ui.character.backpackEmpty", "Backpack is empty for now."));
            return;
        }

        this.setContentBodyPlain(backpack
            .map(entry => this.formatBackpackEntry(entry))
            .filter(text => !!text)
            .join("\n"));
    }

    private tryUpgradeSelectedArtifact(): void {
        if (!this.selectedArtifactSlot) {
            return;
        }

        const selectedSlot = this.selectedArtifactSlot;
        const user = UserService.getUser();
        const character = user.getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const artifactEntry = user.getCharacterEquippedArtifact(character.id, selectedSlot);
        if (!artifactEntry) {
            return;
        }

        const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
        if (!item) {
            return;
        }

        const result = ShopArtifactService.upgradeOwnedItem(item.id, user);
        if (result == 'success') {
            SoundUtils.successfulBuy();
            AnimationUtils.highlight(this.game, this.game.width / 2, this.game.height / 2 + 185, "splashY", 0, 1.3, 900);
            this.showUpgradeSuccessFeedback();
            this.refreshView();
            this.showArtifactInfo(selectedSlot);
            return;
        }

        if (result == 'notEnoughGems') {
            this.showNotEnoughGems(item, artifactEntry.level);
        }
    }

    private refreshUpgradeButton(item: ShopArtifactItemConfig, currentLevel: number): void {
        this.setUpgradeButtonVisible(true);

        if (currentLevel >= item.maxLevel) {
            this.upgradeButton.tint = 0x8f8f8f;
            this.upgradeButton.alpha = 0.92;
            this.upgradeButton.inputEnabled = false;
            this.upgradeButtonLabel.text = LocalizationService.get("ui.character.maxLevel", "Max level");
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
    }

    private setUpgradeButtonVisible(visible: boolean): void {
        this.upgradeButton.alpha = visible ? 1 : 0;
        this.upgradeButton.inputEnabled = visible;
        this.upgradeButtonGemIcon.alpha = visible ? 1 : 0;
    }

    private showUpgradeSuccessFeedback(): void {
        const label = new Label(this.game, this.upgradeButton.x, this.upgradeButton.y - 74, LocalizationService.get("ui.character.upgradedSuccess", "Upgraded!"), {
            font: "bold 34px Gilroy",
            fill: "#8ef26d",
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

    private openShop(): void {
        if (this.processing) {
            return;
        }

        this.openingShop = true;
        this.close();
    }

    private formatBackpackEntry(entry: ShopArtifactBackpackEntry): string {
        const item = ShopArtifactItemsConfiguration.getById(entry.id);
        if (!item) {
            return "";
        }

        return LocalizationService.get(item.name) + " " + LocalizationService.get("ui.character.levelShort", "Lv. {level}", {
            level: entry.level
        });
    }

    private openSkillInfoPanel(skillId: ShopArtifactSkillId, currentValue?: number, artifactBonus?: number): void {
        const info = new SkillInfoPanel(this.game, skillId, {
            currentValue: currentValue,
            artifactBonus: artifactBonus
        });
        this.game.add.existing(info);
        info.show();
    }

    private setContentBodyPlain(text: string): void {
        this.contentBody.visible = true;
        this.contentBodyRich.visible = false;
        this.hideArtifactBonusDetails();
        this.contentBody.text = text;
        this.contentBodyRich.clearColors();
        this.contentBodyRich.text = "";
    }

    private setContentBodyRich(lines: RichTextLine[]): void {
        this.contentBody.visible = false;
        this.contentBodyRich.visible = true;
        this.hideArtifactBonusDetails();

        let text = "";
        let ranges: { start: number, color: string }[] = [];

        lines.forEach((line, index) => {
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

        this.hideArtifactBonusInfoButtons();
    }

    private hideArtifactBonusInfoButtons(): void {
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

        const currentValue = this.getCurrentCharacterSkillValue(skillId);
        this.openSkillInfoPanel(skillId, currentValue);
    }

    private getArtifactBonusesBySkill(characterId: string): { [skillId: string]: number } {
        const user = UserService.getUser();
        const bonuses: { [skillId: string]: number } = {};

        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const artifactEntry = user.getCharacterEquippedArtifact(characterId, layout.slotId);
            if (!artifactEntry) {
                return;
            }

            const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
            if (!item) {
                return;
            }

            item.skillIds.forEach(skillId => {
                const skillConfig = ShopArtifactSkillsConfiguration.getById(skillId);
                if (!skillConfig) {
                    return;
                }

                bonuses[skillId] = (bonuses[skillId] || 0) + artifactEntry.level * skillConfig.valuePerLevel;
            });
        });

        return bonuses;
    }

    private getCurrentCharacterSkillValue(skillId: ShopArtifactSkillId): number {
        const character = UserService.getUser().getCharacters()[this.currentCharacterIndex];
        if (!character || !character.skills) {
            return null;
        }

        const skill = character.skills.filter(entry => entry.skillId == skillId).shift();
        return skill ? skill.value : null;
    }

    private isArtifactSkill(skillId: ShopArtifactSkillId): boolean {
        return ShopArtifactItemsConfiguration.allItems.some(item => (item.skillIds || []).indexOf(skillId) != -1);
    }

    private addButtonText(button: Phaser.Button, text: string, style: Phaser.PhaserTextStyle, offsetY?: number): Label {
        const label = new Label(this.game, 0, offsetY || 0, text, style);
        label.anchor.set(0.5);
        button.addChild(label);
        return label;
    }

    private createDetachedActionButton(spriteId: string, callback, name?: string): Phaser.Button {
        const button = SpriteUtils.createButton(this.game, 0, 0, spriteId, callback);
        button.anchor.set(0.5);
        button.name = name || spriteId;
        button.fixedToCamera = true;
        button.visible = false;
        button.alpha = 0;
        button.inputEnabled = false;
        this.game.add.existing(button);
        return button;
    }

    private placeAtPsdCenter(displayObject: PIXI.DisplayObject, centerX: number, centerY: number): void {
        (<any>displayObject).x = this.psdX(centerX);
        (<any>displayObject).y = this.psdY(centerY);
    }

    private placeDetachedActionButtonAtPsdCenter(button: Phaser.Button, centerX: number, centerY: number): void {
        button.scale.set(this.panelScale);
        button.cameraOffset.set(
            this.game.width / 2 + this.psdX(centerX) * this.panelScale,
            this.game.height / 2 + this.psdY(centerY) * this.panelScale
        );
    }

    private psdX(value: number): number {
        return value - CharacterPanel.PSD_WIDTH / 2;
    }

    private psdY(value: number): number {
        return value - CharacterPanel.PSD_HEIGHT / 2;
    }

    private capitalize(value: string): string {
        if (!value) {
            return "";
        }

        return value.charAt(0).toUpperCase() + value.substring(1);
    }

    private getSlotName(slotId: CharacterArtifactSlotId): string {
        return LocalizationService.get("ui.character.slot." + slotId, slotId);
    }
}
