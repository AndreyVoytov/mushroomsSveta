import Environment from '../../model/enum/Environment';
import ForestItemType from './ForestItemType';
import MaskCell from './MaskCell';
import Separator from './Separator';
import BiomType from './../enum/BiomType';

export interface HiveGroupCellType {
    X: number;
    Y: number;
}

export interface HiveGroupType {
    cells: HiveGroupCellType[];
    output?: number;
    image?: string;
}

export default class ForestType {
    id: string;

    environment: Environment;
    leafType: string;
    header?: string;
    name?:string;

    steps: number;
    maxSteps?: number;
    bushes?: number;
    items: ForestItemType[] = [];
    interactiveItems?: ForestItemType[] = [];
    randomItems?: number; 

    mask: string;
    cells?: MaskCell[];

    separators?: Separator[] = [];
    bonuses: number;    

    
   //================ ЭТО ВСЁ НУЖНО АДАПТИРОВАТЬ ПОД НОВУЮ ЛОГИКУ ====================//
    flowers?: number; 

    cankerberries?: number; //вроде несложно будет переделать, просто подбираем кустистые уровни

    ladybugs?: number[];   
    acorns?: number;
    bees?: number;
    honey?: number; //Нужно рандомное расставление ульев в лесочке
    jellyMushrooms?: number; //Нужно рандомное расставление грибочков в лесочке; причем красиво или симметрично
   

    dragonflies?: number;
    cellsToSpawn?: number;
    darkStump?: boolean;
    hardLevel?:boolean;

    waterCenter?: number;

    slots?: {count:number, biom:BiomType}[];
    hiveGroups?: HiveGroupType[];

    constructor(forestType:ForestType){
            this.name = forestType.name;
            this.randomItems = forestType.randomItems;
            this.id = forestType.id;
            this.header = forestType.header;
            this.environment = forestType.environment;
            this.leafType = forestType.leafType;
            this.steps = forestType.steps;
            this.bushes = forestType.bushes;
            this.items = forestType.items;
            this.interactiveItems = forestType.interactiveItems;
        
            this.mask = forestType.mask;
            this.cells = forestType.cells;
        
            this.separators = forestType.separators;
            this.bonuses = forestType.bonuses;
            this.maxSteps = forestType.maxSteps;
        
            this.cankerberries = forestType.cankerberries;
            this.ladybugs = forestType.ladybugs;
            this.flowers = forestType.flowers;
            this.acorns = forestType.acorns;
            this.bees = forestType.bees;
            this.honey = forestType.honey;
            this.jellyMushrooms = forestType.jellyMushrooms;
            this.dragonflies = forestType.dragonflies;
            this.cellsToSpawn = forestType.cellsToSpawn;
            this.darkStump = forestType.darkStump;
            
            this.waterCenter = forestType.waterCenter;

            this.slots = forestType.slots;
            this.hiveGroups = forestType.hiveGroups;
    }
}

