export type ShopArtifactSkillId = 'energy' | 'bravery' | 'friendship' | 'knowledge';

export interface ShopArtifactSkillConfig {
    id: ShopArtifactSkillId;
    name: string;
    icon: string;
    valuePerLevel: number;
    effectValue: number;
}

export interface ShopArtifactItemConfig {
    id: string;
    name: string;
    icon: string;
    price: number;
    skillIds: ShopArtifactSkillId[];
    usageText: string;
    currentLevel: number;
    maxLevel: number;
    availableFromForest: number;
    iconScale?: number;
}
