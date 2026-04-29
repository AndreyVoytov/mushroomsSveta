export type CharacterTagId = 'human';
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
    aliases?: string[];
    imageKey?: string;
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
