import CharactersConfiguration from "../../../core/configuration/CharactersConfiguration";
import ShopArtifactItemsConfiguration from "../../../core/configuration/ShopArtifactItemsConfiguration";
import ShopArtifactSkillsConfiguration from "../../../core/configuration/ShopArtifactSkillsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { CharacterArtifactSlotId, CharacterSkillValue } from "../../../core/model/character/CharacterModels";
import { ShopArtifactBackpackEntry, ShopArtifactItemConfig } from "../../../core/model/shop/ShopArtifactModels";
import UserService from "../../../core/service/UserService";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import HouseScreen from "../../screen/HouseScreen";
import ClosablePanel from "../panel/ClosablePanel";
import Label from "../panel/Label";
import ShopPanel from "./ShopPanel";

interface SkillRowView {
    icon: Phaser.Sprite;
    valueLabel: Label;
    infoButton: Phaser.Button;
}

interface SlotView {
    icon: Phaser.Sprite;
    infoButton: Phaser.Button;
}

export default class CharacterPanel extends ClosablePanel {
    private static readonly PSD_WIDTH = 960;
    private static readonly PSD_HEIGHT = 1669;
    private static readonly MAX_VISIBLE_SKILLS = 3;

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
    private portrait: Phaser.Sprite;
    private bannerTitle: Label;
    private contentTitle: Label;
    private contentBody: Label;
    private arrowLeftButton: Phaser.Button;
    private arrowRightButton: Phaser.Button;
    private backpackButton: Phaser.Button;
    private shopButton: Phaser.Button;
    private closeButton: Phaser.Button;
    private skillRows: SkillRowView[] = [];
    private slotViews: { [slotId: string]: SlotView } = {};
    private currentCharacterIndex: number = 0;
    private openingShop: boolean = false;

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
        this.visible = false;
        this.fixedToCamera = true;

        this.createLayout();
    }

    protected onShow(): void {
        this.openingShop = false;
        this.syncSelectedCharacter();
        this.refreshView();
        this.screen.hideUI(0, true);
    }

    protected onClose(): void {
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
        const skillsBg = this.attachSprite("characterSkillsBg", "skillsBg");
        this.placeAtPsdCenter(skillsBg, 645.5, 550);

        this.portrait = this.attachSprite("sveta1", "portrait");
        this.placeAtPsdCenter(this.portrait, 290.5, 534.5);

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
        this.arrowLeftButton.scale.set(1);

        this.arrowRightButton = this.attachButton("characterArrowRight", () => this.shiftCharacter(1), "arrowRightButton");
        this.placeAtPsdCenter(this.arrowRightButton, 877, 728.5);
        this.arrowRightButton.scale.set(1);

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
            infoButton.scale.set(1);

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
            font: "bold 24px Arial",
            fill: "#855331",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 430
        });
        this.contentBody.anchor.set(0.5, 0);
        this.contentBody.lineSpacing = 10;
        this.contentBody.x = this.psdX(480);
        this.contentBody.y = this.psdY(922);

        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const icon = this.attachSprite("shopItem1", layout.slotId + "Icon");
            this.placeAtPsdCenter(icon, layout.x, layout.y);
            icon.visible = false;

            const infoButton = this.attachButton("characterArtifactInfoButton", () => this.showArtifactInfo(layout.slotId), layout.slotId + "Info");
            this.placeAtPsdCenter(infoButton, layout.infoX, layout.infoY);
            infoButton.visible = false;
            infoButton.inputEnabled = false;

            this.slotViews[layout.slotId] = {
                icon: icon,
                infoButton: infoButton
            };
        });

        this.backpackButton = this.attachButton("characterBackpackButton", () => this.showBackpackInfo(), "backpackButton");
        this.placeAtPsdCenter(this.backpackButton, 120.5, 1559);
        this.backpackButton.scale.set(1);
        this.addButtonText(this.backpackButton, LocalizationService.get("ui.character.backpack", "Backpack"), {
            font: "bold 30px Gilroy",
            fill: "#fff1d7",
            align: "center"
        }, 12);

        this.shopButton = this.attachButton("characterShopButton", () => this.openShop(), "shopButton");
        this.placeAtPsdCenter(this.shopButton, 842.5, 1554.5);
        this.shopButton.scale.set(1);
        this.addButtonText(this.shopButton, LocalizationService.get("ui.character.shop", "Shop"), {
            font: "bold 30px Gilroy",
            fill: "#fff1d7",
            align: "center"
        }, 18);

        this.closeButton = this.attachButton("characterCloseButton", () => this.close(), "closeButton");
        this.placeAtPsdCenter(this.closeButton, 481.5, 1549.5);
        this.closeButton.scale.set(1);
        this.addButtonText(this.closeButton, LocalizationService.get("ui.character.close", "Close"), {
            font: "bold 40px Gilroy",
            fill: "#efffdd",
            align: "center"
        }, 4);
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
            row.infoButton.visible = true;
            row.infoButton.inputEnabled = true;
            row.valueLabel.text = "" + skillValue.value;
        });

        CharacterPanel.SLOT_LAYOUT.forEach(layout => {
            const slotView = this.slotViews[layout.slotId];
            const artifactEntry = user.getCharacterEquippedArtifact(character.id, layout.slotId);
            if (!artifactEntry) {
                slotView.icon.visible = false;
                slotView.infoButton.visible = false;
                slotView.infoButton.inputEnabled = false;
                return;
            }

            const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
            if (!item) {
                slotView.icon.visible = false;
                slotView.infoButton.visible = false;
                slotView.infoButton.inputEnabled = false;
                return;
            }

            SpriteUtils.loadTexture(slotView.icon, item.icon);
            slotView.icon.visible = true;
            slotView.icon.scale.set((item.iconScale || 0.52) * 1.45);
            slotView.infoButton.visible = true;
            slotView.infoButton.inputEnabled = true;
        });

        const showArrows = characters.length > 1;
        this.arrowLeftButton.visible = showArrows;
        this.arrowLeftButton.inputEnabled = showArrows;
        this.arrowRightButton.visible = showArrows;
        this.arrowRightButton.inputEnabled = showArrows;

        this.showOverview();
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

    private showOverview(): void {
        const user = UserService.getUser();
        const character = user.getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const config = CharactersConfiguration.getById(character.id);
        const equippedCount = CharacterPanel.SLOT_LAYOUT
            .filter(layout => !!user.getCharacterEquippedArtifact(character.id, layout.slotId))
            .length;

        this.contentTitle.text = config ? config.name : LocalizationService.get("ui.character.title", "Character");
        this.contentBody.text = LocalizationService.get(
            "ui.character.overview",
            "Equipped artifacts: {equipped}/{total}\nBackpack: {backpack}\nTap i next to a skill or artifact to see details.",
            {
                equipped: equippedCount,
                total: CharacterPanel.SLOT_LAYOUT.length,
                backpack: user.getArtifactBackpack().length
            }
        );
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

        this.contentTitle.text = this.capitalize(LocalizationService.get(skillConfig.name));
        this.contentBody.text = [
            LocalizationService.get("ui.character.currentValue", "Current value: {value}", { value: skillValue.value }),
            LocalizationService.get("ui.character.upgradeCost", "Upgrade cost +1: {price}", {
                price: ShopArtifactSkillsConfiguration.getUpgradePrice(skillValue.skillId, skillValue.value)
            }),
            LocalizationService.get("ui.character.effectPerLevel", "One artifact level gives +{value}.", {
                value: skillConfig.valuePerLevel
            })
        ].join("\n");
    }

    private showArtifactInfo(slotId: CharacterArtifactSlotId): void {
        const user = UserService.getUser();
        const character = user.getCharacters()[this.currentCharacterIndex];
        if (!character) {
            return;
        }

        const artifactEntry = user.getCharacterEquippedArtifact(character.id, slotId);
        if (!artifactEntry) {
            this.contentTitle.text = this.getSlotName(slotId);
            this.contentBody.text = LocalizationService.get("ui.character.noArtifact", "No artifact equipped.");
            return;
        }

        const item = ShopArtifactItemsConfiguration.getById(artifactEntry.id);
        if (!item) {
            return;
        }

        const bonuses = item.skillIds
            .map(skillId => {
                const skillConfig = ShopArtifactSkillsConfiguration.getById(skillId);
                if (!skillConfig) {
                    return null;
                }

                return this.capitalize(LocalizationService.get(skillConfig.name)) + " +" + artifactEntry.level * skillConfig.valuePerLevel;
            })
            .filter(text => !!text);

        this.contentTitle.text = LocalizationService.get(item.name);
        this.contentBody.text = [
            LocalizationService.get("shop.item.level", "Level {level} of {max}", {
                level: artifactEntry.level,
                max: item.maxLevel
            }),
            LocalizationService.get("ui.character.artifactSlot", "Slot: {slot}", {
                slot: this.getSlotName(slotId)
            }),
            LocalizationService.get(item.usageText)
        ].concat(bonuses as string[]).join("\n");
    }

    private showBackpackInfo(): void {
        const backpack = UserService.getUser().getArtifactBackpack();
        this.contentTitle.text = LocalizationService.get("ui.character.backpackTitle", "Backpack");

        if (backpack.length == 0) {
            this.contentBody.text = LocalizationService.get("ui.character.backpackEmpty", "Backpack is empty for now.");
            return;
        }

        this.contentBody.text = backpack
            .map(entry => this.formatBackpackEntry(entry))
            .join("\n");
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
