import ForestType from '../model/forest/ForestType';
import Environment from '../model/enum/Environment';

type JourneyLevel = {
    name: string;
    rows: string[];
    steps: number;
    items: { name: string; count: number }[];
    bonuses?: number;
    interactiveItems?: { name: string; count: number }[];
    jellyMushrooms?: number;
    flowers?: number;
};

export function createJourneyLevels(eventId: string, environment: Environment, sceneImage: string, leafType: string, levels: JourneyLevel[]): ForestType[] {
    return levels.map((level, index) => ({
        id: eventId + '_' + (index + 1),
        name: level.name,
        environment: environment,
        sceneImage: sceneImage,
        leafType: leafType,
        mask: level.rows.join(''),
        steps: level.steps,
        items: level.items,
        bonuses: level.bonuses == null ? 4 : level.bonuses,
        interactiveItems: level.interactiveItems,
        jellyMushrooms: level.jellyMushrooms,
        flowers: level.flowers
    } as ForestType));
}
