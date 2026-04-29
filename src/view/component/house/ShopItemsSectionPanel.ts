import ShopArtifactItemsConfiguration from '../../../core/configuration/ShopArtifactItemsConfiguration';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import UserService from '../../../core/service/UserService';
import ShopArtifactCardPanel from './ShopArtifactCardPanel';
import ShopSectionPanel from './ShopSectionPanel';

export default class ShopItemsSectionPanel extends ShopSectionPanel {
    private static readonly CARD_SCALE = 1.25;
    private static readonly COLUMN_OFFSET = 232;
    private static readonly ROW_START_Y = -158;
    private static readonly ROW_STEP = 390;

    private cards: ShopArtifactCardPanel[] = [];

    constructor(game: Phaser.Game) {
        super(game, "itemsSection");

        ShopArtifactItemsConfiguration.getAvailableForForest(UserService.getUser().getCurrentForest()).forEach((item, index) => {
            const card = new ShopArtifactCardPanel(this.game, "artifactCard" + index, item);
            const row = Math.floor(index / 2);
            const column = index % 2;

            card.scale.set(ShopItemsSectionPanel.CARD_SCALE);
            card.x = column == 0 ? -ShopItemsSectionPanel.COLUMN_OFFSET : ShopItemsSectionPanel.COLUMN_OFFSET;
            card.y = ShopItemsSectionPanel.ROW_START_Y + row * ShopItemsSectionPanel.ROW_STEP;
            card.alpha = 0;

            this.addSprite(card);
            this.cards.push(card);
        });
    }

    public showSection(animate?: boolean): void {
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

    private animateRow(row: number, delay: number): void {
        this.cards
            .filter((_card, index) => Math.floor(index / 2) == row)
            .forEach(card => AnimationUtils.appear2(this.game, card, delay, 1, 1, 1));
    }
}
