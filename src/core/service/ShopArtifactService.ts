import ShopArtifactItemsConfiguration from "../configuration/ShopArtifactItemsConfiguration";
import { ShopArtifactItemConfig } from "../model/shop/ShopArtifactModels";
import UserService from "./UserService";

export type ShopArtifactPurchaseResult = 'success' | 'notEnoughGems' | 'alreadyPurchased' | 'unknownItem';

export default class ShopArtifactService {

    public static getAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        return ShopArtifactItemsConfiguration.getAvailableForForest(currentForest).slice();
    }

    public static getSortedAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        return this.getAvailableForForest(currentForest).sort((a, b) => this.compareItems(a, b));
    }

    public static isPurchased(itemId: string): boolean {
        return UserService.getUser().hasArtifactInBackpack(itemId);
    }

    public static getItemLevel(item: ShopArtifactItemConfig): number {
        let backpackLevel = UserService.getUser().getArtifactLevel(item.id);
        return backpackLevel > 0 ? backpackLevel : Math.max(1, item.currentLevel || 1);
    }

    public static buy(item: ShopArtifactItemConfig, callbackOnBought?: () => void): ShopArtifactPurchaseResult {
        if (!item) {
            return 'unknownItem';
        }

        if (this.isPurchased(item.id)) {
            return 'alreadyPurchased';
        }

        let user = UserService.getUser();
        if (user.getSupermoney() < item.price) {
            return 'notEnoughGems';
        }

        user.setSupermoney(user.getSupermoney() - item.price);
        user.putArtifactToBackpack(item.id, Math.max(1, item.currentLevel || 1));

        if (callbackOnBought) {
            callbackOnBought();
        }

        return 'success';
    }

    private static compareItems(left: ShopArtifactItemConfig, right: ShopArtifactItemConfig): number {
        let leftPurchased = this.isPurchased(left.id) ? 1 : 0;
        let rightPurchased = this.isPurchased(right.id) ? 1 : 0;

        if (leftPurchased != rightPurchased) {
            return leftPurchased - rightPurchased;
        }

        return this.getItemIndex(left.id) - this.getItemIndex(right.id);
    }

    private static getItemIndex(itemId: string): number {
        let index = ShopArtifactItemsConfiguration.allItems.findIndex(item => item.id == itemId);
        return index == -1 ? 9999 : index;
    }
}
