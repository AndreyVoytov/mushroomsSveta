import CharactersConfiguration from "../../../core/configuration/CharactersConfiguration";
import ShopArtifactItemsConfiguration from "../../../core/configuration/ShopArtifactItemsConfiguration";
import LocalizationService from "../../../core/localization/LocalizationService";
import { CharacterArtifactSlotId } from "../../../core/model/character/CharacterModels";
import { ShopArtifactBackpackEntry } from "../../../core/model/shop/ShopArtifactModels";
import ShopArtifactService, { ShopArtifactEquipTarget } from "../../../core/service/ShopArtifactService";
import CharacterTextUtils from "../../../core/utils/CharacterTextUtils";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import ClosablePanel from "../panel/ClosablePanel";
import Label from "../panel/Label";

interface EquipCardPosition {
    x: number;
    y: number;
}

export default class ArtifactEquipPanel extends ClosablePanel {

    constructor(
        game: Phaser.Game,
        artifactId: string,
        onEquip?: (target: ShopArtifactEquipTarget) => void
    ) {
        super(game, game.width / 2, game.height / 2, true, "blank");

        const item = ShopArtifactItemsConfiguration.getById(artifactId);
        const targets = ShopArtifactService.getEquipTargets(artifactId);

        this.visible = false;
        this.fixedToCamera = true;

        const panel = this.attachSprite("panel", "panel");
        panel.scale.set(1.08, 1.04);
        panel.inputEnabled = true;

        const helperPanel = this.attachSprite("helperPanel", "helperPanel");
        helperPanel.scale.set(1.02, targets.length > 2 ? 1.82 : 1.42);
        helperPanel.y = targets.length > 2 ? 104 : 58;

        const closeButton = this.attachButton("closeButton", () => this.close(), "closeButton");
        closeButton.x = 306;
        closeButton.y = -240;

        const title = this.attachText("title", LocalizationService.get("ui.character.wearSelectTitle", "Choose a character"), {
            font: "bold 40px Gilroy",
            fill: "#ffffff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 600
        });
        title.anchor.set(0.5);
        title.y = -224;
        title.strokeThickness = 4;
        title.addStrokeColor("#b6691b", 0);

        const description = this.attachText(
            "description",
            item
                ? LocalizationService.get("ui.character.wearSelectText", "Choose who should equip \"{artifact}\".", {
                    artifact: LocalizationService.get(item.name)
                })
                : "",
            {
                font: "bold 28px Arial",
                fill: "#804119",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 610
            }
        );
        description.anchor.set(0.5);
        description.y = -150;

        if (targets.length == 0) {
            const emptyLabel = this.attachText("emptyLabel", LocalizationService.get("ui.character.noWearTargets", "There are no suitable characters."), {
                font: "bold 31px Arial",
                fill: "#804119",
                align: "center",
                wordWrap: true,
                wordWrapWidth: 600
            });
            emptyLabel.anchor.set(0.5);
            emptyLabel.y = 8;
            return;
        }

        const positions = this.getCardPositions(targets.length);
        targets.forEach((target, index) => {
            this.createTargetCard(target, positions[index], target.replacedArtifact, () => {
                if (onEquip) {
                    onEquip(target);
                }
                this.close();
            });
        });
    }

    private createTargetCard(
        target: ShopArtifactEquipTarget,
        position: EquipCardPosition,
        replacedArtifact: ShopArtifactBackpackEntry,
        onAction: () => void
    ): void {
        const cardBg = new Phaser.Graphics(this.game, position.x, position.y);
        cardBg.name = "cardBg";
        cardBg.beginFill(0xf3d3aa, 0.42);
        cardBg.drawRoundedRect(-176, -140, 352, 282, 30);
        cardBg.endFill();
        this.addChild(cardBg);

        const portraitConfig = CharactersConfiguration.getById(target.characterId);
        if (portraitConfig && portraitConfig.imageKey) {
            const portrait = this.attachSprite(portraitConfig.imageKey, "portrait" + target.characterId);
            portrait.x = position.x;
            portrait.y = position.y - 64 + (portraitConfig.characterPanelPortraitOffsetY || 0) * 0.18;
            portrait.scale.set(0.34);
        }

        const nameLabel = this.attachText("name" + target.characterId, CharacterTextUtils.getDisplayName(target.characterId, portraitConfig), {
            font: "bold 28px Bookman Old Style",
            fill: "#6a391f",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 280
        });
        nameLabel.anchor.set(0.5);
        nameLabel.x = position.x;
        nameLabel.y = position.y + 44;

        const slotLabel = this.attachText("slot" + target.characterId, LocalizationService.get("ui.character.artifactSlot", "Slot: {slot}", {
            slot: LocalizationService.get("ui.character.slot." + target.slot, target.slot)
        }), {
            font: "bold 20px Arial",
            fill: "#855331",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 260
        });
        slotLabel.anchor.set(0.5);
        slotLabel.x = position.x;
        slotLabel.y = position.y + 84;

        if (replacedArtifact) {
            const replacedItem = ShopArtifactItemsConfiguration.getById(replacedArtifact.id);
            const slotBg = this.attachSprite("shopItemBg", "slotBg" + target.characterId);
            slotBg.x = position.x;
            slotBg.y = position.y + 122;
            slotBg.scale.set(0.76);

            if (replacedItem) {
                const icon = this.attachSprite(replacedItem.icon, "slotIcon" + target.characterId);
                icon.x = position.x;
                icon.y = position.y + 122;
                icon.scale.set((replacedItem.iconScale || 0.52) * 0.82);
            }
        } else {
            const freeCircle = new Phaser.Graphics(this.game, position.x, position.y + 122);
            freeCircle.name = "freeCircle";
            freeCircle.beginFill(0x5ea332, 1);
            freeCircle.drawCircle(0, 0, 74);
            freeCircle.endFill();
            this.addChild(freeCircle);

            const plusLabel = this.attachText("plusLabel" + target.characterId, "+", {
                font: "bold 50px Arial",
                fill: "#ffffff",
                align: "center"
            });
            plusLabel.anchor.set(0.5);
            plusLabel.x = position.x;
            plusLabel.y = position.y + 113;
        }

        const actionButton = this.attachButton("pnlButton", onAction, "actionButton" + target.characterId);
        actionButton.x = position.x;
        actionButton.y = position.y + 204;
        actionButton.scale.set(0.62, 0.7);

        const label = new Label(this.game, 0, -1, LocalizationService.get(
            replacedArtifact ? "ui.character.replace" : "ui.character.wear",
            replacedArtifact ? "Replace" : "Wear"
        ), {
            font: "bold 32px Gilroy",
            fill: "#f0f1ec",
            align: "center"
        });
        label.anchor.set(0.5);
        label.strokeThickness = 4;
        label.addStrokeColor("#61b019", 0);
        actionButton.addChild(label);
    }

    private getCardPositions(count: number): EquipCardPosition[] {
        if (count <= 1) {
            return [{ x: 0, y: 14 }];
        }

        if (count == 2) {
            return [
                { x: -190, y: 8 },
                { x: 190, y: 8 }
            ];
        }

        return [
            { x: -190, y: -30 },
            { x: 190, y: -30 },
            { x: -190, y: 254 },
            { x: 190, y: 254 }
        ].slice(0, count);
    }
}
