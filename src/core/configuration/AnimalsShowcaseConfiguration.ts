import Environment from '../model/enum/Environment';
import { ContentType } from '../model/enum/ContentType';
import ForestType from '../model/forest/ForestType';

export default class AnimalsShowcaseConfiguration {
    public static createForest(): ForestType {
        const forest = new ForestType(<ForestType>{
            id: 'animals-showcase',
            name: 'Animals showcase',
            environment: Environment.forest,
            leafType: 'leaf1',
            steps: 35,
            items: [],
            mask: new Array(6).join('ggggggg'),
            bonuses: 0
        });

        forest.showcaseAnimals = [
            ContentType.rabbit,
            ContentType.butterfly,
            ContentType.butterfly2,
            ContentType.sheep,
            ContentType.fish,
            ContentType.crab,
            ContentType.duck,
            ContentType.bet,
            ContentType.owl,
            ContentType.owlFlying,
            ContentType.bird,
            ContentType.horseshoe
        ];
        return forest;
    }
}
