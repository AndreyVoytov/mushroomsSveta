import { CharacterArtifactSlotId, CharacterTagId } from "../character/CharacterModels";

export type ShopArtifactSkillId = 'energy' | 'bravery' | 'friendship' | 'knowledge';

export interface ShopArtifactSkillUpgradePriceFormula {
    basePrice: number;
    stepPrice: number;
}

export interface ShopArtifactSkillConfig {
    id: ShopArtifactSkillId;
    name: string;
    descriptionText: string;
    icon: string;
    valuePerLevel: number;
    effectValue: number;
    upgradePriceFormula: ShopArtifactSkillUpgradePriceFormula;
}

export interface ShopArtifactItemConfig {
    id: string;
    name: string;
    descriptionText: string;
    icon: string;
    price: number;
    skillIds: ShopArtifactSkillId[];
    usageText: string;
    currentLevel: number;
    maxLevel: number;
    availableFromForest: number;
    requiredCharacterTags: CharacterTagId[];
    allowedSlots: CharacterArtifactSlotId[];
    iconScale?: number;
}

export interface ShopArtifactBackpackEntry {
    id: string;
    level: number;
}
