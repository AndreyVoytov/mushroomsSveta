import CharactersConfiguration from '../../../core/configuration/CharactersConfiguration';
import ShopArtifactItemsConfiguration from '../../../core/configuration/ShopArtifactItemsConfiguration';
import LocalizationService from '../../../core/localization/LocalizationService';
import { ShopArtifactBackpackEntry } from '../../../core/model/shop/ShopArtifactModels';
import ShopArtifactService, { ShopArtifactEquipTarget } from '../../../core/service/ShopArtifactService';
import CharacterTextUtils from '../../../core/utils/CharacterTextUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UiLayout from '../../../core/utils/UiLayout';
import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';

export default class ArtifactEquipPanel extends ClosablePanel {
    constructor(game: Phaser.Game, artifactId: string, onEquip?: (target: ShopArtifactEquipTarget) => void) {
        super(game, game.width / 2, game.height / 2, true, 'blank');
        const item = ShopArtifactItemsConfiguration.getById(artifactId);
        const targets = ShopArtifactService.getEquipTargets(artifactId);
        const compact = targets.length > 3;
        this.visible = false;this.fixedToCamera = true;
        const panel = this.attachSprite('panel2', 'panel');
        panel.width = 840;panel.height = compact ? 1060 : 760;panel.inputEnabled = true;
        const close = this.attachButton('closeButton', () => this.close(), 'closeButton');
        close.position.set(340, compact ? -432 : -280);close.width = close.height = 64;UiLayout.touchTarget(close);
        const title = this.attachText('title', LocalizationService.get('ui.character.wearSelectTitle', 'Choose a character'),
            {font:'42px Lora',fill:'#142b2d',align:'center'});
        title.position.set(0, compact ? -424 : -274);UiLayout.fit(title, 600, 64);
        const description = this.attachText('description', item ? LocalizationService.get('ui.character.wearSelectText',
            'Choose who should equip "{artifact}".', {artifact:LocalizationService.get(item.name)}) : '',
            {font:'34px Manrope',fill:Label.INK,align:'center'});
        description.position.set(0, compact ? -285 : -197);description.lineGap = -8;UiLayout.fit(description, 640, 80, true);
        if (!targets.length) {
            const empty = this.attachText('emptyLabel', LocalizationService.get('ui.character.noWearTargets', 'There are no suitable characters.'),
                {font:'36px Manrope',fill:Label.INK,align:'center'});
            empty.position.set(0, 20);UiLayout.fit(empty, 620, 160, true);return;
        }
        targets.forEach((target, index) => {
            const x = compact ? (index % 2 ? 165 : -165) : (index - (targets.length - 1) / 2) * (targets.length === 3 ? 250 : 340);
            const y = compact ? -70 + Math.floor(index / 2) * 360 : 55;
            const width = compact ? 300 : targets.length === 3 ? 240 : targets.length === 2 ? 280 : 330;
            this.createTargetCard(target, x, y, width, compact, () => {if (onEquip) onEquip(target);this.close();});
        });
    }

    private createTargetCard(target: ShopArtifactEquipTarget, x: number, y: number, width: number, compact: boolean, onAction: () => void): void {
        const card = this.attachSprite('uiShopCard', 'card' + target.characterId);
        card.position.set(x, y);card.width = width;card.height = compact ? 330 : 400;
        const config = CharactersConfiguration.getById(target.characterId);
        if (config && config.imageKey) {
            const portrait = this.attachSprite(config.imageKey, 'portrait' + target.characterId);
            portrait.position.set(x, y - (compact ? 54 : 64));SpriteUtils.fitIcon(portrait, compact ? 120 : 140, compact ? 110 : 160);
        }
        const name = this.attachText('name' + target.characterId, CharacterTextUtils.getDisplayName(target.characterId, config),
            {font:'36px Lora',fill:Label.INK,align:'center'});
        name.position.set(x, y + (compact ? 31 : 48));UiLayout.fit(name, width - 36, 44);
        const slot = this.attachText('slot' + target.characterId, LocalizationService.get('ui.character.slot.' + target.slot, target.slot),
            {font:'34px Manrope',fill:Label.INK,align:'center'});
        slot.position.set(x, y + (compact ? 70 : 90));UiLayout.fit(slot, width - 28, 36);
        this.showReplacedItem(target.replacedArtifact, x + width / 2 - 39, y - (compact ? 98 : 122));
        const button = this.attachButton('pnlButton', onAction, 'actionButton' + target.characterId);
        button.position.set(x, y + (compact ? 119 : 148));button.width = width - 32;button.height = 74;
        const caption = new Label(this.game, 0, 0, LocalizationService.get(target.replacedArtifact ? 'ui.character.replace' : 'ui.character.wear',
            target.replacedArtifact ? 'Replace' : 'Wear'), {font:'34px Manrope',fill:Label.INK});
        caption.anchor.set(0.5);UiLayout.fit(caption, width - 70, 48);
        caption.scale.x /= button.scale.x;caption.scale.y /= button.scale.y;button.addChild(caption);
    }

    private showReplacedItem(entry: ShopArtifactBackpackEntry, x: number, y: number): void {
        const item = entry && ShopArtifactItemsConfiguration.getById(entry.id);if (!item) return;
        const badge = this.attachSprite('dialogMedallion', 'replacedItemFrame');
        badge.position.set(x, y);badge.width = badge.height = 54;
        const icon = this.attachSprite(item.icon, 'replacedItemIcon');icon.position.set(x, y);SpriteUtils.fitIcon(icon, 42, 42);
    }
}
