import UserService from '../UserService';
import BiomType from '../../model/enum/BiomType';
import CellType from '../../model/enum/CellType';
import ForestUtils from '../../utils/ForestUtils';
import NeverError from '../../utils/NeverError';
import Utils from '../../utils/Utils';
import Environment from '../../model/enum/Environment';
import ForestCell from '../../model/forest/ForestCell';
import ForestType, { HiveGroupType } from '../../model/forest/ForestType';
import MaskCell from '../../model/forest/MaskCell';
import Movable from '../../model/forest/Movable';
import WaterPart from '../../model/forest/WaterPart';
import ForestCellCover from '../../../view/component/forest/ForestCellCover';
import BaseCellsProvider from './BaseCellsProvider';
import { ContentType, InteractiveContents, ItemContents } from '../../model/enum/ContentType';
import TypesInfo from '../../model/forest/TypesInfo';
import HouseItemsConfiguration from '../../configuration/HouseItemsConfiguration';
import SpecialItemsConfiguration from '../../configuration/SpecialItemsConfiguration';
import ForestsConfiguration from '../../configuration/ForestConfiguration';
import EventUtils from '../../utils/EventUtils';
import EventType from '../../model/event/EventType';

interface ResolvedHiveGroup {
    anchorIndex: number;
    hiveIndexes: number[];
    output: number;
    image: string;
    maxHoney: number;
}

export default class CellsProvider extends BaseCellsProvider {

    private message: string;

    private waterParts: WaterPart[];
    public additionalCellTypes: {type: ContentType, metaValue:string}[];
    public taskItems: {image: string, count:number};

    private static MAX_GENERATION_ATTEMPTS_COUNT = 100;

    public constructor(forestType: ForestType, game: Phaser.Game) {
        super(forestType, game);
    }

    public refreshWater(ladybugs: Movable[]): void {
        if (this.forestType.waterCenter) {
            this.switchCellsByCircle(this.waterParts.map<ForestCell>(part => part.cell), ladybugs);
        }
    }

    //TODO refactor: additionalCells to result
    protected generateCells(): ForestCell[] {

        let cellsCount = this.getMask().length;
        let additionalCells = this.getMask().filter(c => c.type == CellType.ACORN).length +
            (this.forestType.cellsToSpawn ? this.forestType.cellsToSpawn : 0);

        let suitableGeneration = false;
        let notSuitableGenerationsCount = 0;
        let cells: ForestCell[] = [];


        let typesInfo: TypesInfo;
        while (!suitableGeneration && notSuitableGenerationsCount < CellsProvider.MAX_GENERATION_ATTEMPTS_COUNT) {
            this.message = "";
            typesInfo = this.generateTypes(cellsCount + additionalCells, additionalCells, this.forestType);
            // console.log(typesInfo)
            cells = this.generateCellsFromTypes(typesInfo, cellsCount);

            //Не должно быть клеток, в которых с самого начала стоит "0"
            suitableGeneration = true;
            cells.filter(cell => !cell.state.content).forEach(cell => {
                let adjucentCount = this.getAdjucentInteractiveCount(cells, cell);
                if (adjucentCount == 0) {
                    suitableGeneration = false;
                    notSuitableGenerationsCount++;
                    console.log("Not suitable generation!");
                }
            });
        }

        this.configureHiveGroups(cells);
        
        this.additionalCellTypes = typesInfo.types.slice(cellsCount, typesInfo.types.length);
        this.additionalCellTypes.forEach((t, i) => {
            if (!t.type) {
                // this.additionalCellTypes[i].type = ContentType.tree;
                let isHouse = this.forestType.environment == Environment.house;
                this.additionalCellTypes[i].type = isHouse? ContentType.mirror : ContentType.tree;
            }
        })

        if (notSuitableGenerationsCount >= CellsProvider.MAX_GENERATION_ATTEMPTS_COUNT) {
            console.error("Can not generate suitable cells!")
        }

        //CONTENT FOR EMPTY CELLS
        cells.filter(cell => !cell.state.content).forEach(cell => {
            let adjucentCount = this.getAdjucentInteractiveCount(cells, cell);

            if (ForestUtils.getBiom(cell.type) == BiomType.WATER) {
                if (adjucentCount <= 2 || this.forestType.ladybugs || this.containAcorns) {
                    cell.state.content = ContentType.wlilly1;
                } else {
                    cell.state.content = ContentType.wlilly2;
                }
            } else if (this.forestType.environment == Environment.house) {
                cell.state.content = ContentType.mirror;
            } else if (adjucentCount == 0) {
                console.error("Cell with 0 interactive adjucents detected!")
                cell.state.content = this.getTreeContent(cell.type);
            } else if (adjucentCount == 1 || adjucentCount == 2 || adjucentCount == 3) {
                if (Utils.randomBoolean()) {
                    cell.state.content = this.getTreeContent(cell.type);
                } else if (adjucentCount == 1) {
                    cell.state.content = ContentType.stone;
                } else if (adjucentCount == 2) {
                    cell.state.content = ContentType.log;
                } else {
                    cell.state.content = ContentType.stump;
                }
            } else { //if (adjucentCount == 4 || adjucentCount == 5 || adjucentCount == 6) {
                cell.state.content  = this.getTreeContent(cell.type);
            }
        });

        //WATER DATA
        //TODO water conveyer - вынести в отдельный класс
        let waterCenter = this.forestType.waterCenter;
        let centerPosition = waterCenter ? this.calculateRelativePosition(waterCenter) : null;
        this.waterParts = [];

        if (waterCenter != null) {
            cells.filter(cell => cell.type == CellType.WATER).forEach(cell => {
                let tangens = Math.sin(Math.atan((cell.X - centerPosition.x) / (cell.Y - centerPosition.y)));
                if ((cell.Y - centerPosition.y) < 0) {
                    tangens += 2
                }
                this.waterParts.push(new WaterPart(cell, tangens));
            });
            this.waterParts.sort((a, b) => a.tangens - b.tangens);
        }

        // this.waterParts.forEach(part => part.cell.label.text = "" + Math.floor(part.tangens * 100)/100);

        console.log("Forest generated. Cells count: " + cells.length);

        if (this.forestType.separators) {
            cells.forEach(c => {
                this.forestType.separators.forEach(s => {
                    if (c.X == s.X && c.Y == s.Y) {
                        c.separators.push(s.type);
                    }
                })
            })
        }

        if(this.message){
            alert(this.message)
            this.message = "";
        }

        return cells;
    }

    private getTreeContent(cellType:CellType):ContentType{
        if(ForestUtils.getBiom(cellType) == BiomType.SAND){
            return ContentType.cactus;
        } else if (ForestUtils.getBiom(cellType) == BiomType.BERRY_FIELD){
            return ContentType.stump;
        }
        return ContentType.tree;
    }

    private generateTypes(cellsCount: number, additionalCellsCount: number, forestType: ForestType): TypesInfo {
        let types: ContentType[] = [];
        let metaDataByIndex: {[key:number] : string} = {};

        for (let i = 0; i < cellsCount; i++) {
            types.push(null);
        }

        this.getMask().forEach((cell, i) => {
            let boosterImg = ForestUtils.getBoosterContentType(cell.type);
            if (boosterImg) {
                types[i] = boosterImg;
            } else if (ForestUtils.isCoverFreeNotBoosterItem(cell.type)) {
                types[i] = ForestUtils.getCoverFreeNotBoosterItem(cell.type);
            }
        });

        if (this.forestType.honey) {
            let handledGroupedHives = false;
            let hiveGroups = this.resolveHiveGroups(types);

            if (hiveGroups.length > 0) {
                handledGroupedHives = true;

                let honeyCount = 0;
                hiveGroups.forEach(group => {
                    group.maxHoney = this.getMaxHoneyForHiveGroup(types, group);
                    metaDataByIndex[group.anchorIndex] = String(group.maxHoney);
                    group.hiveIndexes.filter(index => index != group.anchorIndex).forEach(index => {
                        metaDataByIndex[index] = "0";
                    });
                    honeyCount += group.maxHoney;
                });

                let targetHoney = this.forestType.honey;
                let minHoney = hiveGroups.reduce((sum, group) => {
                    return sum + (group.maxHoney > 0 ? group.output : 0);
                }, 0);
                let attempts = 0;

                if (minHoney <= targetHoney && targetHoney <= honeyCount) {
                    while (!this.getForestType().cellsToSpawn && attempts < 1000 && honeyCount > targetHoney) {
                        let choosableGroups = hiveGroups.filter(group => Number(metaDataByIndex[group.anchorIndex]) > group.output);
                        if (choosableGroups.length == 0) {
                            break;
                        }

                        let choosen = Utils.getRandomElement(choosableGroups);
                        let honeyNumber = Number(metaDataByIndex[choosen.anchorIndex]);

                        metaDataByIndex[choosen.anchorIndex] = String(honeyNumber - choosen.output);
                        honeyCount -= choosen.output;
                        attempts++;
                    }

                    while (attempts < 1000 && targetHoney > honeyCount) {
                        let choosableGroups = hiveGroups.filter(group => Number(metaDataByIndex[group.anchorIndex]) + group.output <= group.maxHoney);
                        if (choosableGroups.length == 0) {
                            break;
                        }

                        let choosen = Utils.getRandomElement(choosableGroups);
                        let honeyNumber = Number(metaDataByIndex[choosen.anchorIndex]);

                        metaDataByIndex[choosen.anchorIndex] = String(honeyNumber + choosen.output);
                        honeyCount += choosen.output;
                        attempts++;
                    }

                    if (attempts == 1000 || honeyCount != targetHoney) {
                        console.error("CRITICAL ERROR: can not generate hives properly!");
                    }
                } else {
                    this.message = "РЎР»РёС€РєРѕРј РјР°Р»Рѕ РјС‘РґР°!";
                    console.log("Not enough honey!");
                }
            }

            let hiveIndexes = handledGroupedHives ? [] : types.map((t, i) => t == ContentType.hive ? i : -1).filter(i => i != -1);

            if (hiveIndexes.length > 0) {

                let honeyCount = 0;
                hiveIndexes.forEach(index => {
                    let cellWithHive = this.getMask()[index];

                    let maxHoney = this.getMask().filter((c, i) => this.areAdjucentCoordinates(c.X, c.Y, cellWithHive.X, cellWithHive.Y) 
                        && !this.haveSeparatorsBetweenMaskCells(c, cellWithHive) && types[i] ==  null).length;

                    metaDataByIndex[index] = String(maxHoney);
                    honeyCount += maxHoney;
                })

                let attempts = 0;

                if(hiveIndexes.length <= this.forestType.honey){
                    while (!this.getForestType().cellsToSpawn && attempts < 1000 && honeyCount > this.forestType.honey) {
                        console.log("HONEY COUNT: " +honeyCount)

                        let choosen = Utils.getRandomElement(hiveIndexes);
                        let honeyNumber = Number(metaDataByIndex[choosen]);

                        if (honeyNumber == 1) {
                            continue;
                        }

                        metaDataByIndex[choosen] = String(honeyNumber - 1);
                        honeyCount--;
    
                        attempts++;
                    }
    
                    while (/*this.getForestType().cellsToSpawn && */ attempts < 1000 && this.forestType.honey > honeyCount) {
                        let choosen = Utils.getRandomElement(hiveIndexes);
                        let honeyNumber = Number(metaDataByIndex[choosen]);
                        // if (honeyNumber == 1) {
                        //     continue;
                        // }
                        metaDataByIndex[choosen] = String(honeyNumber + 1);
                        honeyCount++;
    
                        attempts++;
                    }
    
                    if (attempts == 1000) {
                        console.error("CRITICAL ERROR: can not generate hives properly!")
                    }
                } else {
                    this.message = "Слишком мало мёда!";
                    console.log("Not enough honey!");
                }

               
            }
        }

        for (let i = 0; i < additionalCellsCount; i++) {
            this.getMask().push(new MaskCell(100, i, CellType.FOREST, "leaf4"))
        }

        let bush = forestType.interactiveItems? forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush]) : null;
        if (bush) {
            let avrg = ForestUtils.AVG_BERRIES_ON_BUSH;
            let bushesCount = bush.count;

            let berries = [];
            //заполняем 4-ками
            for (let i = 0; i < bushesCount; i++) {
                berries.push(avrg);
            }
            //половину четверок делаем пятерками, половину тройками
            for (let i = 0; i < Math.floor(bushesCount / 2); i++) {
                berries[i]++; berries[i + Math.floor(bushesCount / 2)]--;
            }

            for (let i = 0; i < bushesCount; i++) {
                let index = this.getEmptyCell(types, ForestUtils.getBioms(InteractiveContents.bush));
                types[index] = ContentType.bush;
                metaDataByIndex[index] = berries[i]; 
            }
        }


        let bush2 = forestType.interactiveItems? forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush2]) : null;
        if (bush2) {
            let avrg = ForestUtils.AVG_BERRIES_ON_BUSH;
            let bushesCount = bush2.count;

            let berries = [];
            for (let i = 0; i < bushesCount; i++) {
                berries.push(avrg);
            }
            for (let i = 0; i < Math.floor(bushesCount / 2); i++) {
                berries[i]++; berries[i + Math.floor(bushesCount / 2)]--;
            }

            for (let i = 0; i < bushesCount; i++) {
                let index = this.getEmptyCell(types, ForestUtils.getBioms(InteractiveContents.bush2));
                types[index] = ContentType.bush2;
                metaDataByIndex[index] = berries[i]; 
            }
        }

        if(forestType.interactiveItems){
            forestType.interactiveItems.forEach(item => {
                if(item.name != ContentType[ContentType.bush2] && item.name != ContentType[ContentType.bush]){
                    for (let i = 0; i < item.count; i++) {
                        let index = this.getEmptyCell(types, ForestUtils.getBioms(InteractiveContents[item.name]));
                        types[index] = InteractiveContents[item.name];
                    }
                }
            });
        }

        forestType.items.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                let index = this.getEmptyCell(types, ForestUtils.getBioms(ItemContents[item.name]));
                types[index] = ContentType[item.name];
            }
        });

        // let collectableTask = TasksConfiguration.findItemCollectActiveTask();

        // if(collectableTask){
        //     let items = UserService.getUser().getItems().find(i => i.name == collectableTask.aim_id);
        //     let maxCountToGenerate = items? collectableTask.count - items.count : collectableTask.count;
        //     let taskItemsCount = Math.min(Utils.random(3)+ 1, maxCountToGenerate);

        //     //выбираем, где размещать предметы. Есть ест лес - в лес; иначе в горы и т.д.
        //     let bioms = Utils.enumValues(BiomType);
        //     let biom:BiomType = null;
        //     for(let i=0; i<bioms.length && !biom; i++){
        //         if(this.getMask().find(c => ForestUtils.getBiom(c.type) == bioms[i])){
        //             biom = bioms[i];
        //         }
        //     }

        //     for (let i = 0; i < taskItemsCount ; i++) {
        //         let index = this.getEmptyCell(types, [biom]);
        //         types[index] = ContentType[collectableTask.aim_id];
        //     }
        //     this.taskItems = {image: collectableTask.aim_id, count: taskItemsCount};
        // } else {
            this.taskItems = null;
        // }

        // let haveSpecificItem = false;
        // specificItems.forEach(i=> {
        //     let index = this.getEmptyCell(types, [BiomType.FOREST]);
        //     if(/*!haveSpecificItem &&*/ !i.usual && !forestType.randomItems){
        //         // types[index] = ContentType.specificItem;
        //         // haveSpecificItem = true;
        //     } else {
        //         types[index] = ContentType.randomItem;
        //     }
        //     metaDataByIndex[index] = i.image;
        // })

        if(forestType.randomItems){
            // let specificItems = SpecialItemsConfiguration.allItems.filter(i => i.usual && i.level == forestType.id);
            // specificItems.forEach(i=> {
            //     let index = this.getEmptyCell(types, [BiomType.FOREST]);
            //     types[index] = ContentType.randomItem;
            //     metaDataByIndex[index] = i.image;
            // })

            let choosenItems = Utils.getDifferentRandomElements(HouseItemsConfiguration.getOptions(forestType), forestType.randomItems)// - specificItems.length)
            choosenItems.forEach(itemName => {
                let index = this.getEmptyCell(types);
                types[index] = ContentType.randomItem;
                metaDataByIndex[index] = itemName;
            })
        }

        // let luckyStrike = EventUtils.getActiveEventByType(EventType.luckyStrike);
        let user = UserService.getUser();

        // let forestInfo = user.getAllForests().find(f => f.forestType.id == forestType.id);
        // let isSecret = forestInfo && forestInfo.specialItemOrCreature;
        // let isMonster = forestInfo && forestInfo.monster;
        // let isHard = ForestUtils.isHardLevel(forestType);

        // let fora = Utils.randomBoolean() && user.getCurrentForest()>=9 && user.getCurrentForest() - user.getBuildStageOnLevel() < 4 &&  
        //     !luckyStrike && !isSecret && !isMonster;                    //помогаем пройти 4 уровня после постройки этажа
        // fora = fora || !isHard && forestInfo && forestInfo.looses >= 4; //если 4 поражения на обычном уровне - помогаем пройти
        
        // let strongFora = fora && isHard;
        // strongFora =  strongFora || isHard && !isSecret && forestInfo && forestInfo.looses >= 10 && Utils.randomBoolean(); //если 10 поражения на сложном уровне - помогаем пройти
        // strongFora =  strongFora || isHard && isSecret && forestInfo && forestInfo.looses >= 15 && Utils.randomBoolean(); //если 15 поражения на секретном уровне - помогаем пройти

        // let handicap = Utils.randomBoolean() && luckyStrike && !isHard && user.getWinsInRow() >= 3;
        

        // let finalBonuses = Math.max(0, (forestType.bonuses || 0)- (handicap? 1:0)  /*- (strongHandicap? 1:0)*/ + (fora?1:0) + (strongFora?1:0));

        let finalBonuses = forestType.bonuses;

        //???? not strong - давать пройти после 2-хпоражений
        //Strong - ослаблять на 3-й день и после 9 поражений 





        // let strongHandicap = !handicap && luckyStrike && user.getWinsInRow() >= 4 && user.getCurrentForest() - user.getSpendOnLevel() >= 4;
        
        for (let i = 0; i < finalBonuses; i++) {
            let possibleAnimalBioms = [BiomType.FOREST, BiomType.MOUNTAIN, BiomType.SAND, BiomType.BERRY_FIELD];
            if (!forestType.ladybugs && !this.containAcorns) {
                possibleAnimalBioms.push(BiomType.WATER);
            }
            let index = this.getEmptyCell(types, possibleAnimalBioms);
            let maskCell = this.getMask()[index];
            if(maskCell){
                if (ForestUtils.isCloverReskin(this.forestType)) {
                    types[index] = ContentType.horseshoe;
                    continue;
                }

                let cellBiom = ForestUtils.getBiom(maskCell.type);
                switch (cellBiom) {
                    case BiomType.FOREST:
                    case BiomType.BERRY_FIELD:
                        let owlPink = SpecialItemsConfiguration.allItems.filter(i => i.image == "owlPink").shift();
                        if(owlPink && owlPink.level == this.forestType.id){
                            index = this.getEmptyCell(types, [BiomType.FOREST]);
                            types[index] = Utils.randomBoolean() ? ContentType.owl : ContentType.owlFlying;
                            break;
                        }

                        switch (this.forestType.environment) {
                            case Environment.forest:
                            case Environment.lake:
                            case Environment.jungles:
                            case Environment.bugForest:
                            case Environment.snailForest:
                                // index = this.getEmptyCell(types, [BiomType.FOREST]);
                                types[index] = Utils.randomBoolean() ? ContentType.rabbit : ContentType.butterfly;
                                break;
                            case Environment.darkForest:
                                // index = this.getEmptyCell(types, [BiomType.FOREST]);
                                types[index] = ContentType.owlFlying;//или bet?
                                break;
                            case Environment.house:
                                // index = this.getEmptyCell(types, [BiomType.FOREST]);
                                types[index] = ContentType.bet;
                                break;
                            case Environment.flowerFields:
                                // index = this.getEmptyCell(types, [BiomType.FOREST]);
                                types[index] = Utils.randomBoolean() ? ContentType.bird : ContentType.butterfly2;
                                break;
                            default:
                                throw new NeverError(this.forestType.environment);
                        }
                        
                        break;
                    case BiomType.MOUNTAIN:
                        types[index] = ContentType.sheep;
                        break;
                    case BiomType.WATER:
                        if(this.forestType.environment == Environment.lake || this.forestType.mask.indexOf(ForestUtils.getChar(CellType.BOAT)) != -1){
                            types[index] = ContentType.fish;
                        } else {
                            types[index] = ContentType.duck;
                        }
                        break;
                    case BiomType.SAND:
                        types[index] = ContentType.crab;
                        break;
                    default:
                        throw new NeverError(cellBiom);
                }
            }
        }

        this.mask.splice(this.mask.length - additionalCellsCount, additionalCellsCount);

        return new TypesInfo(types, metaDataByIndex);
    }

    private generateCellsFromTypes(info: TypesInfo, cellsCount:number): ForestCell[] {

        let contens: {type: ContentType, metaValue:string}[] = info.types.slice(0, cellsCount);
        let cells: ForestCell[] = [];
        let i = 0;
        contens.forEach(content => {
            if (this.getMask().length > i) {
                let maskCell = this.getMask()[i];
                cells.push(new ForestCell(maskCell.X, maskCell.Y, content.type, maskCell.type, ForestUtils.getBiom(maskCell.type), maskCell.leaf, content.metaValue));
                i++;
            }
        });
        return cells;
    }

    private configureHiveGroups(cells: ForestCell[]): void {
        let configuredGroups = this.forestType.hiveGroups || [];

        configuredGroups.forEach(group => {
            let groupCells = group.cells.map(groupCell => {
                return cells.find(cell => cell.X == groupCell.X && cell.Y == groupCell.Y && cell.state.content == ContentType.hive);
            }).filter(cell => !!cell);

            groupCells = groupCells.filter((cell, index) => groupCells.indexOf(cell) == index);

            if (groupCells.length == 0) {
                return;
            }

            let anchor = this.getBestHiveAnchorCell(groupCells);
            let output = group.output || 1;
            let image = group.image || "hive";

            groupCells.forEach(cell => {
                cell.hiveAnchor = anchor;
                cell.hiveGroupCells = groupCells;
                cell.hiveOutput = output;
                cell.hiveImage = image;
            });
        });

        cells.filter(cell => cell.state.content == ContentType.hive && !cell.hiveAnchor).forEach(cell => {
            cell.hiveAnchor = cell;
            cell.hiveGroupCells = [cell];
            cell.hiveOutput = 1;
            cell.hiveImage = "hive";
        });
    }

    private resolveHiveGroups(types: ContentType[]): ResolvedHiveGroup[] {
        let result: ResolvedHiveGroup[] = [];
        let configuredIndexes: number[] = [];

        (this.forestType.hiveGroups || []).forEach((group: HiveGroupType) => {
            let hiveIndexes = group.cells.map(cell => this.findMaskIndex(cell.X, cell.Y)).filter(index => index != -1 && types[index] == ContentType.hive);
            hiveIndexes = hiveIndexes.filter((index, position) => hiveIndexes.indexOf(index) == position);

            if (hiveIndexes.length == 0) {
                return;
            }

            result.push({
                anchorIndex: this.getBestHiveAnchorIndex(hiveIndexes),
                hiveIndexes: hiveIndexes,
                output: group.output || 1,
                image: group.image || "hive",
                maxHoney: 0
            });

            configuredIndexes = configuredIndexes.concat(hiveIndexes);
        });

        types.forEach((type, index) => {
            if (type == ContentType.hive && configuredIndexes.indexOf(index) == -1) {
                result.push({
                    anchorIndex: index,
                    hiveIndexes: [index],
                    output: 1,
                    image: "hive",
                    maxHoney: 0
                });
            }
        });

        return result;
    }

    private getMaxHoneyForHiveGroup(types: ContentType[], group: ResolvedHiveGroup): number {
        let maxHoneyTriggers = this.getMask().filter((cell, index) => {
            if (types[index] != null) {
                return false;
            }

            return group.hiveIndexes.some(hiveIndex => {
                let hiveCell = this.getMask()[hiveIndex];
                return this.areAdjucentCoordinates(cell.X, cell.Y, hiveCell.X, hiveCell.Y)
                    && !this.haveSeparatorsBetweenMaskCells(cell, hiveCell);
            });
        }).length;

        return maxHoneyTriggers * group.output;
    }

    private findMaskIndex(X: number, Y: number): number {
        return this.getMask().findIndex(cell => cell.X == X && cell.Y == Y);
    }

    private getBestHiveAnchorIndex(hiveIndexes: number[]): number {
        return hiveIndexes.slice().sort((firstIndex, secondIndex) => {
            let firstCell = this.getMask()[firstIndex];
            let secondCell = this.getMask()[secondIndex];

            if (firstCell.Y != secondCell.Y) {
                return secondCell.Y - firstCell.Y;
            }

            return secondCell.X - firstCell.X;
        })[0];
    }

    private getBestHiveAnchorCell(cells: ForestCell[]): ForestCell {
        return cells.slice().sort((firstCell, secondCell) => {
            if (firstCell.Y != secondCell.Y) {
                return secondCell.Y - firstCell.Y;
            }

            return secondCell.X - firstCell.X;
        })[0];
    }

    public getHiveAnchorCell(cell: ForestCell): ForestCell {
        return cell && cell.hiveAnchor ? cell.hiveAnchor : cell;
    }

    public getHiveGroupCells(cell: ForestCell): ForestCell[] {
        let anchor = this.getHiveAnchorCell(cell);
        return anchor && anchor.hiveGroupCells && anchor.hiveGroupCells.length > 0 ? anchor.hiveGroupCells : (cell ? [cell] : []);
    }

    public getHiveOutput(cell: ForestCell): number {
        let anchor = this.getHiveAnchorCell(cell);
        return anchor && anchor.hiveOutput ? anchor.hiveOutput : 1;
    }

    public getHiveImage(cell: ForestCell): string {
        let anchor = this.getHiveAnchorCell(cell);
        return anchor && anchor.hiveImage ? anchor.hiveImage : "hive";
    }

    public isMegaHiveAnchor(cell: ForestCell): boolean {
        return !!cell && this.getHiveAnchorCell(cell) == cell && this.getHiveGroupCells(cell).length > 1;
    }

    public isMegaHiveHiddenPart(cell: ForestCell): boolean {
        return !!cell && this.getHiveAnchorCell(cell) != cell && this.getHiveGroupCells(cell).length > 1;
    }

    public getHiveRemainingHoney(cell: ForestCell): number {
        let anchor = this.getHiveAnchorCell(cell);
        return anchor && anchor.state && anchor.state.honeyLabel ? Number(anchor.state.honeyLabel.text) : 0;
    }

    public getHiveRequiredOpenings(cell: ForestCell): number {
        let output = this.getHiveOutput(cell);
        let honey = this.getHiveRemainingHoney(cell);
        return output > 0 ? Math.ceil(honey / output) : honey;
    }

    public isHiveActive(cell: ForestCell): boolean {
        return !!cell && this.getHiveRemainingHoney(cell) > 0;
    }

    public getHiveOpenableCells(cell: ForestCell): ForestCell[] {
        let hiveCells = this.getHiveGroupCells(cell);

        return this.getCells().filter(otherCell => !otherCell.state.opened && !otherCell.state.cover.isLocked() && !otherCell.state.cover.isDark()
            && hiveCells.some(hiveCell => this.areAdjucentAndNoSeparators(hiveCell, otherCell)));
    }

    public getAdjacentHiveAnchors(cell: ForestCell): ForestCell[] {
        let result: ForestCell[] = [];

        this.getCells().forEach(otherCell => {
            if (otherCell.state.content != ContentType.hive || !this.isHiveActive(otherCell) || !this.areAdjucentAndNoSeparators(cell, otherCell)) {
                return;
            }

            let anchor = this.getHiveAnchorCell(otherCell);
            if (result.indexOf(anchor) == -1) {
                result.push(anchor);
            }
        });

        return result;
    }

    public generateCankerberries(covers: ForestCellCover[], cankerberries: number, transparent?: boolean): void {
        if (cankerberries) {
            let alreadyPlaced = covers.map<number>(c => {
                if (c.cellType == CellType.CANKERBERRY1) return 1;
                if (c.cellType == CellType.CANKERBERRY2) return 2;
                return 0;
            }).reduce((sum, current) => sum + current);
            let cankerberriesLeft = cankerberries - alreadyPlaced;

            let bigIvyCells: ForestCellCover[] = covers.filter(c => c.cellType == CellType.IVY_STRONG);
            let littleIvyCells: ForestCellCover[] = covers.filter(c => c.cellType == CellType.IVY);

            while (cankerberriesLeft > 0) {
                if (bigIvyCells.length <= 0 && littleIvyCells.length <= 0) {
                    alert("Недостаточно кустов для шиповника!");
                    console.error("Need more lianas for cankerberries!");
                    return;
                }

                // console.log("littleIvyCells.length: " + littleIvyCells.length)
                // console.log("bigIvyCells.length: " + bigIvyCells.length)
                // console.log("cankerberriesLeft: " + cankerberriesLeft)

                if (littleIvyCells.length != 0 && (cankerberriesLeft == 1 || bigIvyCells.length == 0 || (Utils.randomBoolean() && cankerberriesLeft != 2))) {
                    let cell = littleIvyCells[Utils.random(littleIvyCells.length)];
                    let added = cell.addCankerBerries(transparent);
                    Utils.delete(littleIvyCells, cell)
                    cankerberriesLeft -= added;
                    // console.log("littleIvyCells used")

                    if(added == 0){
                        alert("Недостаточно кустов для шиповника!");
                        console.error("Need more lianas for cankerberries!");
                        return;
                    }
                } else {
                    let cell = bigIvyCells[Utils.random(bigIvyCells.length)];
                    let added = cell.addCankerBerries(transparent);
                    Utils.delete(bigIvyCells, cell)
                    cankerberriesLeft -= added;
                    // console.log("bigIvyCells used")

                    if(added == 0){
                        alert("Недостаточно кустов для шиповника!");
                        console.error("Need more lianas for cankerberries!");
                        return;
                    } else if(cankerberriesLeft < 0 ){
                        alert("Плохая конфигурация: измените количество шиповника!");
                        console.error("Need other lianas for cankerberries!");
                        return;
                    }
                }
            }
        }
    }

    private getEmptyCell(contents: ContentType[], bioms?: BiomType[]): number {
        let position = Utils.random(contents.filter((c,i) => !contents[i] && (!bioms || bioms.indexOf(ForestUtils.getBiom(this.getMask()[i].type)) != -1)).length);
        let currentPosition = 0;

        for(let i=0; i<contents.length; i++){
            if(!bioms || bioms.indexOf(ForestUtils.getBiom(this.getMask()[i].type)) != -1){
                
                if (!contents[i]) {
                    if(currentPosition == position) return i;
                    currentPosition++;
                } 
            }
        }

        this.message = "Не удалось разместить объект на поле! ";
        console.error("Can not place grass object!"  );
        return -1;
    }
    // private getEmptyCell(contents: ContentType[], bioms?: BiomType[]): number {
    //     let position = Utils.random(contents.length);
    //     let counter = 0;
    //     while (contents[position] || (bioms && bioms.indexOf(ForestUtils.getBiom(this.getMask()[position].type)) == -1)) {
    //         position = Utils.random(contents.length);
    //         counter++;
    //         if (counter == CellsProvider.MAX_GENERATION_ATTEMPTS_COUNT) {
    //             this.message = "Не удалось разместить объект на поле! ";
    //             console.error("Can not place grass object!"  );
    //             return -1;
    //         }
    //     }
    //     return position;
    // }

    public canSpawnOnCell(cell: ForestCell):boolean {
        if (!cell.state.opened) {
            return false;
        }

        if (this.isInteractive(cell) && cell.type != CellType.HIVE) {
            if (cell.state.content == ContentType.bush || cell.state.content == ContentType.bush2 ) {
                return cell.state.berries.length == 0;
            }
            return true;
        }

        if (ForestUtils.isLandscapeType(cell.type)) {
            return cell.state.label.text == "" || !cell.state.label.visible;
        } else if (cell.type == CellType.HIVE && cell.state.content == ContentType.hive && this.isHiveActive(cell)) {
            return false;
        }

        return true;
    }
}
