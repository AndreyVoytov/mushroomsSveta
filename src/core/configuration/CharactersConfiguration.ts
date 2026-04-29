import { CharacterConfig } from "../model/character/CharacterModels";

export default class CharactersConfiguration {

    public static readonly START_CHARACTER_ID = 'sveta';

    public static allCharacters: CharacterConfig[] = [
        {
            id: 'sveta',
            name: 'Emma',
            descriptionText: 'character.sveta.description',
            aliases: ['Sveta', 'Red Hood'],
            imageKey: 'sveta1',
            tags: ['human'],
            skills: [
                { skillId: 'energy', value: 5 },
                { skillId: 'bravery', value: 4 },
                { skillId: 'knowledge', value: 7 }
            ]
        }
    ];

    public static getById(characterId: string): CharacterConfig {
        return this.allCharacters.filter(character => character.id == characterId).shift();
    }

    public static getStartCharacter(): CharacterConfig {
        return this.getById(this.START_CHARACTER_ID);
    }
}
