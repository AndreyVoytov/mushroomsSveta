import { ShopArtifactItemConfig } from "../model/shop/ShopArtifactModels";

export default class ShopArtifactItemsConfiguration {

    public static allItems: ShopArtifactItemConfig[] = [
        {
            id: 'crownOfDawn',
            name: 'shop.item.crownOfDawn.name',
            icon: 'shopItem1',
            price: 79,
            skillIds: ['knowledge', 'friendship'],
            usageText: 'shop.item.crownOfDawn.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            iconScale: 0.52
        },
        {
            id: 'keeperMantle',
            name: 'shop.item.keeperMantle.name',
            icon: 'shopItem2',
            price: 95,
            skillIds: ['friendship', 'energy'],
            usageText: 'shop.item.keeperMantle.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            iconScale: 0.5
        },
        {
            id: 'stormMace',
            name: 'shop.item.stormMace.name',
            icon: 'shopItem3',
            price: 105,
            skillIds: ['bravery', 'knowledge'],
            usageText: 'shop.item.stormMace.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            iconScale: 0.5
        },
        {
            id: 'titanBow',
            name: 'shop.item.titanBow.name',
            icon: 'shopItem4',
            price: 115,
            skillIds: ['energy', 'bravery'],
            usageText: 'shop.item.titanBow.usage',
            currentLevel: 1,
            maxLevel: 10,
            availableFromForest: 1,
            iconScale: 0.55
        }
    ];

    public static getAvailableForForest(currentForest: number): ShopArtifactItemConfig[] {
        const forestIndex = Math.max(1, currentForest + 1);
        return this.allItems.filter(item => item.availableFromForest <= forestIndex);
    }
}
