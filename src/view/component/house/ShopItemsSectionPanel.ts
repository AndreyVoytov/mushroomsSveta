import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import ShopArtifactItemsConfiguration from '../../../core/configuration/ShopArtifactItemsConfiguration';
import { ShopArtifactItemConfig } from '../../../core/model/shop/ShopArtifactModels';
import ShopArtifactService, { ShopArtifactGrantResult } from '../../../core/service/ShopArtifactService';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import CharacterTextUtils from '../../../core/utils/CharacterTextUtils';
import UserService from '../../../core/service/UserService';
import BuyConfirmPanel from './BuyConfirmPanel';
import ConfirmPanel from './ConfirmPanel';
import ShopArtifactCardPanel from './ShopArtifactCardPanel';
import ShopSectionPanel from './ShopSectionPanel';
import SkillInfoPanel from './SkillInfoPanel';
import { ShopArtifactSkillId } from '../../../core/model/shop/ShopArtifactModels';

export default class ShopItemsSectionPanel extends ShopSectionPanel {
    private static readonly CARD_SCALE = 1.25;
    private static readonly COLUMN_OFFSET = 232;
    private static readonly ROW_START_Y = -158;
    private static readonly ROW_STEP = 390;

    private cards: ShopArtifactCardPanel[] = [];
    private onOpenBank?: () => void;
    private preferredCharacterId?: string;
    private onOpenCharacter?: (characterId: string) => void;

    constructor(game: Phaser.Game, onOpenBank?: () => void, preferredCharacterId?: string, onOpenCharacter?: (characterId: string) => void) {
        super(game, "itemsSection");
        this.onOpenBank = onOpenBank;
        this.preferredCharacterId = preferredCharacterId;
        this.onOpenCharacter = onOpenCharacter;

        ShopArtifactItemsConfiguration.getAvailableForForest(UserService.getUser().getCurrentForest()).forEach((item, index) => {
            const card = new ShopArtifactCardPanel(
                this.game,
                "artifactCard" + index,
                item,
                index,
                boughtItem => this.buyItem(boughtItem),
                skillId => this.showSkillInfo(skillId)
            );
            card.scale.set(ShopItemsSectionPanel.CARD_SCALE);
            card.alpha = 0;

            this.addSprite(card);
            this.cards.push(card);
        });

        this.refreshCardsLayout();
    }

    public showSection(animate?: boolean): void {
        this.refreshCardsLayout();
        super.showSection(animate);

        if (!animate) {
            this.cards.forEach(card => card.alpha = 1);
            return;
        }

        this.cards.forEach(card => card.alpha = 0);
        this.animateRow(0, 200);
        this.animateRow(1, 400);
    }

    public hideSection(): void {
        super.hideSection();
        this.cards.forEach(card => card.alpha = 0);
    }

    private buyItem(item: ShopArtifactItemConfig): void {
        const result = ShopArtifactService.buy(item, () => {
            this.refreshCardsLayout(true);
        }, this.preferredCharacterId);

        if (result.result == 'success') {
            this.showArtifactPurchased(item, result.grantResult);
            return;
        }

        if (result.result == 'notEnoughGems') {
            this.showNotEnoughGems(item);
        }
    }

    private refreshCardsLayout(forceVisibleAlpha?: boolean): void {
        this.cards.forEach(card => card.refreshState());
        this.cards.sort((left, right) => this.compareCards(left, right));

        this.cards.forEach((card, index) => {
            const row = Math.floor(index / 2);
            const column = index % 2;

            card.x = column == 0 ? -ShopItemsSectionPanel.COLUMN_OFFSET : ShopItemsSectionPanel.COLUMN_OFFSET;
            card.y = ShopItemsSectionPanel.ROW_START_Y + row * ShopItemsSectionPanel.ROW_STEP;

            if (forceVisibleAlpha) {
                card.alpha = this.visible ? 1 : 0;
            }

            this.bringChildToTop(card);
        });
    }

    private compareCards(left: ShopArtifactCardPanel, right: ShopArtifactCardPanel): number {
        const leftPurchased = left.isPurchased() ? 1 : 0;
        const rightPurchased = right.isPurchased() ? 1 : 0;

        if (leftPurchased != rightPurchased) {
            return leftPurchased - rightPurchased;
        }

        return left.getSortIndex() - right.getSortIndex();
    }

    private animateRow(row: number, delay: number): void {
        this.cards
            .filter((_card, index) => Math.floor(index / 2) == row)
            .forEach(card => AnimationUtils.appear2(this.game, card, delay, 1, 1, 1));
    }

    private showSkillInfo(skillId: ShopArtifactSkillId): void {
        const info = new SkillInfoPanel(this.game, skillId);
        this.game.add.existing(info);
        info.show();
    }

    private showArtifactPurchased(item: ShopArtifactItemConfig, grantResult?: ShopArtifactGrantResult): void {
        const equippedCharacterId = grantResult && grantResult.placement == 'equipped' ? grantResult.characterId : null;
        const canOpenCharacter = !!equippedCharacterId && !!this.onOpenCharacter;
        const actionName = canOpenCharacter
            ? LocalizationService.get('ui.shop.toCharacter', LocalizationService.isRussian() ? 'К персонажу' : 'To character')
            : LocalizationService.get('ui.ok', 'OK');
        const text = equippedCharacterId
            ? GameText.purchaseRewardEquipped(
                LocalizationService.get(item.name),
                CharacterTextUtils.getDisplayName(equippedCharacterId)
            )
            : GameText.purchaseRewardBackpack(LocalizationService.get(item.name));
        let actionCallback: (() => void) | undefined = undefined;

        if (canOpenCharacter) {
            const safeCharacterId = equippedCharacterId;
            const safeOpenCharacter = this.onOpenCharacter;
            actionCallback = () => safeOpenCharacter(safeCharacterId);
        }

        let info = new BuyConfirmPanel(
            this.game,
            LocalizationService.get('ui.purchaseReceived'),
            actionName,
            text,
            {
                rewardIconKey: item.icon,
                rewardIconScale: (item.iconScale || 0.52) * 2.8,
                actionCallback: actionCallback
            }
        );
        this.game.add.existing(info);
        info.show();
    }

    private showNotEnoughGems(item: ShopArtifactItemConfig): void {
        const missingGems = Math.max(0, item.price - UserService.getUser().getSupermoney());
        let info = new ConfirmPanel(
            this.game,
            LocalizationService.get('ui.shop.notEnoughGemsTitle', 'Not enough gems'),
            LocalizationService.get('ui.shop.goToBank', 'Go to Bank'),
            LocalizationService.get(
                'ui.shop.notEnoughGemsText',
                'You are short of ~{gems}~ for this purchase.',
                { gems: GameText.gems(missingGems) }
            ),
            () => {
                if (this.onOpenBank) {
                    this.onOpenBank();
                }
            }
        );
        this.game.add.existing(info);
        info.show();
    }
}
