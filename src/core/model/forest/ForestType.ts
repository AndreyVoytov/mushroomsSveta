import Environment from '../../model/enum/Environment';
import ForestItemType from './ForestItemType';
import MaskCell from './MaskCell';
import Separator from './Separator';
export default class ForestType {
    id: string;

    environment: Environment;
    leafType: string;
    header?: string;

    steps: number;
    bushes?: number;
    items: ForestItemType[] = [];
    randomItems?: number; 

    mask: string;
    cells?: MaskCell[];
    isHardLevel?: boolean;


    separators?: Separator[] = [];
    bonuses?: number;

    cankerberries?: number;
    blueberries?: number;
    pearls?: number;
    moonflowers?: number;
    ladybugs?: number[];
    flowers?: number;
    acorns?: number;
    books?: number;
    honey?: number;
    jellyMushrooms?: number;
    dragonflies?: number;
    cellsToSpawn?: number;
    darkStump?: boolean;
    hardLevel?:boolean;

    waterCenter?: number;

    constructor(forestType:ForestType){
            this.randomItems = forestType.randomItems;
            this.id = forestType.id;
            this.header = forestType.header;
            this.environment = forestType.environment;
            this.leafType = forestType.leafType;
            this.steps = forestType.steps;
            this.bushes = forestType.bushes;
            this.items = forestType.items;
            this.isHardLevel = forestType.isHardLevel;
        
            this.mask = forestType.mask;
            this.cells = forestType.cells;
        
            this.separators = forestType.separators;
            this.bonuses = forestType.bonuses;
        
            this.cankerberries = forestType.cankerberries;
            this.blueberries = forestType.blueberries;
            this.pearls = forestType.pearls;
            this.moonflowers = forestType.moonflowers;
            this.ladybugs = forestType.ladybugs;
            this.flowers = forestType.flowers;
            this.acorns = forestType.acorns;
            this.books = forestType.books;
            this.honey = forestType.honey;
            this.jellyMushrooms = forestType.jellyMushrooms;
            this.dragonflies = forestType.dragonflies;
            this.cellsToSpawn = forestType.cellsToSpawn;
            this.darkStump = forestType.darkStump;
            
            this.waterCenter = forestType.waterCenter;
    }
}

