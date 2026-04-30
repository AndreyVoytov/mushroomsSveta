import ShopArtifactItemsConfiguration from "../configuration/ShopArtifactItemsConfiguration";
import CharactersConfiguration from "../configuration/CharactersConfiguration";
import ShopArtifactSkillsConfiguration from "../configuration/ShopArtifactSkillsConfiguration";
import { CHARACTER_ARTIFACT_SLOTS, CharacterArtifactSlotId, CharacterTagId } from "../model/character/CharacterModels";
import { ShopArtifactItemConfig } from "../model/shop/ShopArtifactModels";
import User from "../model/user/User";
import UserService from "./UserService";

export type ShopArtifactPurchaseResult = 'success' | 'notEnoughGems' | 'alreadyPurchased' | 'unknownItem';
export type ShopArtifactGrantPlacement = 'equipped' | 'backpack' | 'unknownItem';
export type ShopArtifactUpgradeResult = 'success' | 'notEnoughGems' | 'maxLevel' | 'notOwned' | 'unknownItem';

export interface ShopArtifactGrantResult {
    placement: ShopArtifactGrantPlacement;
    characterId?: string;
}

export interface ShopArtifactPurchaseOutcome {
    result: ShopArtifactPurchaseResult;
    grantResult?: ShopArtifactGrantResult;
}

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

    public static getUpgradePrice(item: ShopArtifactItemConfig, currentLevel?: number): number {
        if (!item) {
            return 0;
        }

        const safeCurrentLevel = Math.max(1, currentLevel || this.getItemLevel(item));
        return (item.skillIds || []).reduce((total, skillId) => {
            return total + ShopArtifactSkillsConfiguration.getUpgradePrice(skillId, safeCurrentLevel);
        }, 0);
    }

    public static buy(item: ShopArtifactItemConfig, callbackOnBought?: () => void, preferredCharacterId?: string): ShopArtifactPurchaseOutcome {
        if (!item) {
            return { result: 'unknownItem' };
        }

        if (this.isPurchased(item.id)) {
            return {
                result: 'alreadyPurchased',
                grantResult: this.getExistingGrantResult(UserService.getUser(), item.id)
            };
        }

        let user = UserService.getUser();
        if (user.getSupermoney() < item.price) {
            return { result: 'notEnoughGems' };
        }

        user.setSupermoney(user.getSupermoney() - item.price);
        const grantResult = this.grantToUser(user, item.id, Math.max(1, item.currentLevel || 1), preferredCharacterId);

        if (callbackOnBought) {
            callbackOnBought();
        }

        return {
            result: 'success',
            grantResult: grantResult
        };
    }

    public static grantToUser(user: User, itemId: string, level?: number, preferredCharacterId?: string): ShopArtifactGrantResult {
        const item = ShopArtifactItemsConfiguration.getById(itemId);
        if (!item) {
            return { placement: 'unknownItem' };
        }

        if (user.hasOwnedArtifact(item.id)) {
            return this.getExistingGrantResult(user, item.id);
        }

        const safeLevel = Math.max(1, level || 1);
        const prioritizedCharacterId = this.tryEquipToCharacter(user, preferredCharacterId, item, safeLevel);
        if (prioritizedCharacterId) {
            return {
                placement: 'equipped',
                characterId: prioritizedCharacterId
            };
        }

        const fallbackCharacterId = this.tryEquipByFallbackPriority(user, item, safeLevel, preferredCharacterId ? [preferredCharacterId] : []);
        if (fallbackCharacterId) {
            return {
                placement: 'equipped',
                characterId: fallbackCharacterId
            };
        }

        user.putArtifactToBackpack(item.id, safeLevel);
        return { placement: 'backpack' };
    }

    public static upgradeOwnedItem(itemId: string, user?: User): ShopArtifactUpgradeResult {
        const item = ShopArtifactItemsConfiguration.getById(itemId);
        if (!item) {
            return 'unknownItem';
        }

        const safeUser = user || UserService.getUser();
        const currentLevel = safeUser.getOwnedArtifactLevel(item.id);
        if (currentLevel <= 0) {
            return 'notOwned';
        }

        if (currentLevel >= item.maxLevel) {
            return 'maxLevel';
        }

        const price = this.getUpgradePrice(item, currentLevel);
        if (safeUser.getSupermoney() < price) {
            return 'notEnoughGems';
        }

        safeUser.setSupermoney(safeUser.getSupermoney() - price);
        safeUser.setOwnedArtifactLevel(item.id, currentLevel + 1);
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

    private static getExistingGrantResult(user: User, itemId: string): ShopArtifactGrantResult {
        if (user.hasArtifactInBackpack(itemId)) {
            return { placement: 'backpack' };
        }

        const characterId = this.findEquippedArtifactCharacterId(user, itemId);
        return characterId
            ? { placement: 'equipped', characterId: characterId }
            : { placement: 'backpack' };
    }

    private static tryEquipByFallbackPriority(user: User, item: ShopArtifactItemConfig, level: number, excludedCharacterIds: string[] = []): string {
        const orderedCharacterIds: string[] = [];
        const currentCharacter = user.getCurrentCharacter();
        const safeExcludedCharacterIds = excludedCharacterIds || [];

        if (currentCharacter && safeExcludedCharacterIds.indexOf(currentCharacter.id) == -1) {
            orderedCharacterIds.push(currentCharacter.id);
        }

        user.getCharacters().forEach(character => {
            if (safeExcludedCharacterIds.indexOf(character.id) == -1 && orderedCharacterIds.indexOf(character.id) == -1) {
                orderedCharacterIds.push(character.id);
            }
        });

        for (let i = 0; i < orderedCharacterIds.length; i++) {
            const characterId = this.tryEquipToCharacter(user, orderedCharacterIds[i], item, level);
            if (characterId) {
                return characterId;
            }
        }

        return null;
    }

    private static tryEquipToCharacter(user: User, characterId: string, item: ShopArtifactItemConfig, level: number): string {
        if (!characterId) {
            return null;
        }

        const character = user.getCharacterById(characterId);
        if (!character) {
            return null;
        }

        const characterConfig = CharactersConfiguration.getById(character.id);
        if (!characterConfig || !this.hasRequiredTags(characterConfig.tags, item.requiredCharacterTags)) {
            return null;
        }

        const slot = this.findFirstFreeSlot(user, character.id, item.allowedSlots);
        if (!slot) {
            return null;
        }

        user.equipArtifactToCharacter(character.id, slot, item.id, level);
        return character.id;
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

    private static findEquippedArtifactCharacterId(user: User, artifactId: string): string {
        const characters = user.getCharacters();
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            for (let j = 0; j < CHARACTER_ARTIFACT_SLOTS.length; j++) {
                const slot = CHARACTER_ARTIFACT_SLOTS[j];
                const entry = user.getCharacterEquippedArtifact(character.id, slot);
                if (entry && entry.id == artifactId) {
                    return character.id;
                }
            }
        }

        return null;
    }
}
