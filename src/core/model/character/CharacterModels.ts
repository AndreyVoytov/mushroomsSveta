export type CharacterTagId = 'human' | 'cat' | 'owl' | 'leshy';
export type CharacterArtifactSlotId = 'helmet' | 'weapon' | 'boots' | 'amulet' | 'armor' | 'ring';
export type CharacterSkillId = 'energy' | 'bravery' | 'friendship' | 'knowledge';

export const CHARACTER_ARTIFACT_SLOTS: CharacterArtifactSlotId[] = ['helmet', 'weapon', 'boots', 'amulet', 'armor', 'ring'];

export interface CharacterSkillValue {
    skillId: CharacterSkillId;
    value: number;
}

export interface CharacterArtifactEntry {
    id: string;
    level: number;
}

export interface CharacterConfig {
    id: string;
    name: string;
    descriptionText: string;
    aliases?: string[];
    imageKey?: string;
    characterPanelPortraitOffsetY?: number;
    tags: CharacterTagId[];
    skills: CharacterSkillValue[];
}

export interface UserCharacterEquipment {
    helmet?: CharacterArtifactEntry;
    weapon?: CharacterArtifactEntry;
    boots?: CharacterArtifactEntry;
    amulet?: CharacterArtifactEntry;
    armor?: CharacterArtifactEntry;
    ring?: CharacterArtifactEntry;
}

export interface UserCharacterState {
    id: string;
    skills: CharacterSkillValue[];
    equippedArtifacts: UserCharacterEquipment;
}
