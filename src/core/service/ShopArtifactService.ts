import ShopArtifactItemsConfiguration from "../configuration/ShopArtifactItemsConfiguration";
import CharactersConfiguration from "../configuration/CharactersConfiguration";
import { CharacterArtifactSlotId, CharacterTagId } from "../model/character/CharacterModels";
import { ShopArtifactItemConfig } from "../model/shop/ShopArtifactModels";
import User from "../model/user/User";
import UserService from "./UserService";

export type ShopArtifactPurchaseResult = 'success' | 'notEnoughGems' | 'alreadyPurchased' | 'unknownItem';
export type ShopArtifactGrantResult = 'equipped' | 'backpack' | 'unknownItem';

export default class ShopArtifactService {

    public static getAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        return ShopArtifactItemsConfiguration.getAvailableForForest(currentForest).slice();
    }

    public static getSortedAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        return this.getAvailableForForest(currentForest).sort((a, b) => this.compareItems(a, b));
    }

    public static isPurchased(itemId: string): boolean {
        return UserService.getUser().hasOwnedArtifact(itemId);
    }

    public static getItemLevel(item: ShopArtifactItemConfig): number {
        let itemLevel = UserService.getUser().getOwnedArtifactLevel(item.id);
        return itemLevel > 0 ? itemLevel : Math.max(1, item.currentLevel || 1);
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
        this.grantToUser(user, item.id, Math.max(1, item.currentLevel || 1));

        if (callbackOnBought) {
            callbackOnBought();
        }

        return 'success';
    }

    public static grantToUser(user: User, itemId: string, level?: number): ShopArtifactGrantResult {
        const item = ShopArtifactItemsConfiguration.getById(itemId);
        if (!item) {
            return 'unknownItem';
        }

        if (user.hasOwnedArtifact(item.id)) {
            return user.hasArtifactInBackpack(item.id) ? 'backpack' : 'equipped';
        }

        const safeLevel = Math.max(1, level || 1);
        if (this.tryEquipToCurrentCharacter(user, item, safeLevel)) {
            return 'equipped';
        }

        user.putArtifactToBackpack(item.id, safeLevel);
        return 'backpack';
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

    private static tryEquipToCurrentCharacter(user: User, item: ShopArtifactItemConfig, level: number): boolean {
        const character = user.getCurrentCharacter();
        if (!character) {
            return false;
        }

        const characterConfig = CharactersConfiguration.getById(character.id);
        if (!characterConfig || !this.hasRequiredTags(characterConfig.tags, item.requiredCharacterTags)) {
            return false;
        }

        const slot = this.findFirstFreeSlot(user, character.id, item.allowedSlots);
        if (!slot) {
            return false;
        }

        user.equipArtifactToCharacter(character.id, slot, item.id, level);
        return true;
    }

    private static hasRequiredTags(characterTags: CharacterTagId[], requiredTags: CharacterTagId[]): boolean {
        const safeRequiredTags = requiredTags || [];
        if (safeRequiredTags.length == 0) {
            return true;
        }

        const safeCharacterTags = characterTags || [];
        return safeRequiredTags.every(tag => safeCharacterTags.indexOf(tag) != -1);
    }

    private static findFirstFreeSlot(user: User, characterId: string, allowedSlots: CharacterArtifactSlotId[]): CharacterArtifactSlotId {
        const safeSlots = allowedSlots || [];
        for (let i = 0; i < safeSlots.length; i++) {
            const slot = safeSlots[i];
            if (!user.getCharacterEquippedArtifact(characterId, slot)) {
                return slot;
            }
        }

        return null;
    }
}
