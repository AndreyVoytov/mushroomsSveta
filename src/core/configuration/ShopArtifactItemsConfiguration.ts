import { ShopArtifactItemConfig } from "../model/shop/ShopArtifactModels";

export default class ShopArtifactItemsConfiguration {

    public static allItems: ShopArtifactItemConfig[] = [
        {
            id: 'crownOfDawn',
            name: 'shop.item.crownOfDawn.name',
            descriptionText: 'shop.item.crownOfDawn.description',
            icon: 'shopItem1',
            price: 79,
            skillIds: ['knowledge', 'friendship'],
            usageText: 'shop.item.universal.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            requiredCharacterTags: [],
            allowedSlots: ['helmet'],
            iconScale: 0.52
        },
        {
            id: 'keeperMantle',
            name: 'shop.item.keeperMantle.name',
            descriptionText: 'shop.item.keeperMantle.description',
            icon: 'shopItem2',
            price: 95,
            skillIds: ['friendship', 'energy'],
            usageText: 'shop.item.onlyHuman.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            requiredCharacterTags: ['human'],
            allowedSlots: ['armor'],
            iconScale: 0.5
        },
        {
            id: 'stormMace',
            name: 'shop.item.stormMace.name',
            descriptionText: 'shop.item.stormMace.description',
            icon: 'shopItem3',
            price: 105,
            skillIds: ['bravery', 'knowledge'],
            usageText: 'shop.item.onlyHuman.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            requiredCharacterTags: ['human'],
            allowedSlots: ['weapon'],
            iconScale: 0.5
        },
        {
            id: 'titanBow',
            name: 'shop.item.titanBow.name',
            descriptionText: 'shop.item.titanBow.description',
            icon: 'shopItem4',
            price: 115,
            skillIds: ['energy', 'bravery'],
            usageText: 'shop.item.onlyHuman.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            requiredCharacterTags: ['human'],
            allowedSlots: ['weapon'],
            iconScale: 0.55
        }
    ];

    public static getById(itemId: string): ShopArtifactItemConfig {
        return this.allItems.filter(item => item.id == itemId).shift();
    }

    public static getAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        const forestIndex = Math.max(1, currentForest + 1);
        return this.allItems.filter(item => item.availableFromForest <= forestIndex);
    }
}
