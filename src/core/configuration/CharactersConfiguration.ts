import { CharacterConfig } from "../model/character/CharacterModels";

export default class CharactersConfiguration {

    public static readonly START_CHARACTER_ID = 'sveta';
    public static readonly BORIS_CHARACTER_ID = 'boris';
    public static readonly OWL_CHARACTER_ID = 'owl';
    public static readonly LESHY_CHARACTER_ID = 'leshy';

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
        },
        {
            id: 'boris',
            name: 'Boris',
            descriptionText: 'character.boris.description',
            aliases: ['Boris', 'Kitten', 'Cat'],
            imageKey: 'cat1',
            tags: ['cat'],
            skills: [
                { skillId: 'energy', value: 6 },
                { skillId: 'friendship', value: 7 },
                { skillId: 'knowledge', value: 6 }
            ]
        },
        {
            id: 'owl',
            name: 'Owlet',
            descriptionText: 'character.owl.description',
            aliases: ['Owlet', 'Owl'],
            imageKey: 'sova1',
            tags: ['owl'],
            skills: [
                { skillId: 'knowledge', value: 8 },
                { skillId: 'friendship', value: 6 },
                { skillId: 'energy', value: 5 }
            ]
        },
        {
            id: 'leshy',
            name: 'Leshy',
            descriptionText: 'character.leshy.description',
            aliases: ['Leshy', 'Forest Spirit'],
            imageKey: 'leshii1',
            tags: ['leshy'],
            skills: [
                { skillId: 'knowledge', value: 9 },
                { skillId: 'friendship', value: 5 },
                { skillId: 'bravery', value: 6 }
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
