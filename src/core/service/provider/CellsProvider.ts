import UserService from '../UserService';
import BiomType from '../../model/enum/BiomType';
import CellType from '../../model/enum/CellType';
import ForestUtils from '../../utils/ForestUtils';
import NeverError from '../../utils/NeverError';
import Utils from '../../utils/Utils';
import Environment from '../../model/enum/Environment';
import ForestCell from '../../model/forest/ForestCell';
import ForestType from '../../model/forest/ForestType';
import MaskCell from '../../model/forest/MaskCell';
import Movable from '../../model/forest/Movable';
import WaterPart from '../../model/forest/WaterPart';
import ForestCellCover from '../../../view/component/forest/ForestCellCover';
import BaseCellsProvider from './BaseCellsProvider';
import { ContentType } from '../../model/enum/ContentType';
import TypesInfo from '../../model/forest/TypesInfo';
import HouseItemsConfiguration from '../../configuration/HouseItemsConfiguration';
import SpecialItemsConfiguration from '../../configuration/SpecialItemsConfiguration';
import ForestsConfiguration from '../../configuration/ForestConfiguration';
import EventUtils from '../../utils/EventUtils';
import EventType from '../../model/event/EventType';


export default class CellsProvider extends BaseCellsProvider {

    private message: string;

    private waterParts: WaterPart[];
    public additionalCellTypes: {type: ContentType, metaValue:string}[];

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
            let hiveIndexes = types.map((t, i) => t == ContentType.hive ? i : -1).filter(i => i != -1);

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
    
                    while (this.getForestType().cellsToSpawn && attempts < 1000 && this.forestType.honey > honeyCount) {
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

        if (this.forestType.blueberries) {
            let avrg = 4;
            let bushesCount = Math.ceil(this.forestType.blueberries / avrg);

            let berries = [];
            let avgCount = this.forestType.blueberries - bushesCount * (avrg - 1);
            for (let i = 0; i < avgCount; i++) {
                berries.push(avrg);
            }
            for (let i = 0; i < bushesCount - avgCount; i++) {
                berries.push(avrg - 1);
            }
            for (let i = 0; i < Math.floor(avgCount / 2); i++) {
                berries[i]++; berries[i + Math.floor(avgCount / 2)]--;
            }

            for (let i = 0; i < bushesCount; i++) {
                let index = this.getEmptyCell(types, [BiomType.FOREST, BiomType.MOUNTAIN]);
                types[index] = ContentType.bush;
                metaDataByIndex[index] = berries[i]; 
            }
        }

        if (this.forestType.books) {
            for (let i = 0; i < this.forestType.books; i++) {
                let index1 = this.getEmptyCell(types, [BiomType.MOUNTAIN]);
                types[index1] = ContentType.book1;
                let index2 = this.getEmptyCell(types, [BiomType.MOUNTAIN]);
                types[index2] = ContentType.lockpick;
            }
        }

        if (this.forestType.pearls) {
            for (let i = 0; i < this.forestType.pearls; i++) {
                // let index = this.getEmptyCell(types, [BiomType.WATER]);
                let index = this.getEmptyCell(types, [BiomType.SAND, BiomType.WATER]);
                types[index] = ContentType.shell;
            }
        }

        if (this.forestType.moonflowers) {
            for (let i = 0; i < this.forestType.moonflowers; i++) {
                let index = this.getEmptyCell(types, [BiomType.FOREST, BiomType.BERRY_FIELD]);
                types[index] = ContentType.moonflowerClosed;
            }
        }

        forestType.items.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                let index;
                if (item.name == ContentType[ContentType.lilly]) {
                    index = this.getEmptyCell(types, [BiomType.WATER]);
                } else if (item.name == ContentType[ContentType.lavanda]) {
                    index = this.getEmptyCell(types, [BiomType.MOUNTAIN]);
                } else if (item.name == ContentType[ContentType.blackberry]) {
                    index = this.getEmptyCell(types, [BiomType.BERRY_FIELD]);
                } else if (item.name == ContentType[ContentType.strawberry]) {
                    index = this.getEmptyCell(types, [BiomType.BERRY_FIELD]);
                } else if (item.name == ContentType[ContentType.amber]) {
                    index = this.getEmptyCell(types, [BiomType.SAND]);
                } else {
                    index = this.getEmptyCell(types, [BiomType.FOREST]);
                }

                // if(!ContentType[item.name]){
                //     types[index] = ContentType.specificItem;
                //     metaDataByIndex[index] = item.name;
                // } else {
                    types[index] = ContentType[item.name];
                // }
            }
        });

        

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
            let specificItems = SpecialItemsConfiguration.allItems.filter(i => i.usual && i.level == forestType.id);
            specificItems.forEach(i=> {
                let index = this.getEmptyCell(types, [BiomType.FOREST]);
                types[index] = ContentType.randomItem;
                metaDataByIndex[index] = i.image;
            })

            let choosenItems = Utils.getDifferentRandomElements(HouseItemsConfiguration.getOptions(forestType), forestType.randomItems - specificItems.length)
            choosenItems.forEach(itemName => {
                let index = this.getEmptyCell(types);
                types[index] = ContentType.randomItem;
                metaDataByIndex[index] = itemName;
            })
        }

        let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
        let user = UserService.getUser();
        let handicap = eventInfo && user.getWinsInRow() >= 3;
        let strongHandicap = eventInfo && user.getWinsInRow() >= 4 && user.getCurrentForest() - user.getSpendOnLevel() >= 4;

        let finalBonuses = Math.max(0, (forestType.bonuses || 0) - (handicap? 1:0) - (strongHandicap? 1:0));
        
        for (let i = 0; i < finalBonuses; i++) {
            let possibleAnimalBioms = [BiomType.FOREST, BiomType.MOUNTAIN, BiomType.SAND, BiomType.BERRY_FIELD];
            if (!forestType.ladybugs && !this.containAcorns) {
                possibleAnimalBioms.push(BiomType.WATER);
            }
            let index = this.getEmptyCell(types, possibleAnimalBioms);
            let maskCell = this.getMask()[index];
            if(maskCell){
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

                console.log("littleIvyCells.length: " + littleIvyCells.length)
                console.log("bigIvyCells.length: " + bigIvyCells.length)
                console.log("cankerberriesLeft: " + cankerberriesLeft)

                if (littleIvyCells.length != 0 && (cankerberriesLeft == 1 || bigIvyCells.length == 0 || (Utils.randomBoolean() && cankerberriesLeft != 2))) {
                    let cell = littleIvyCells[Utils.random(littleIvyCells.length)];
                    let added = cell.addCankerBerries(transparent);
                    Utils.delete(littleIvyCells, cell)
                    cankerberriesLeft -= added;
                    console.log("littleIvyCells used")

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
                    console.log("bigIvyCells used")

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
        let position = Utils.random(contents.length);
        let counter = 0;
        while (contents[position] || (bioms && bioms.indexOf(ForestUtils.getBiom(this.getMask()[position].type)) == -1)) {
            position = Utils.random(contents.length);
            counter++;
            if (counter == CellsProvider.MAX_GENERATION_ATTEMPTS_COUNT) {
                this.message = "Не удалось разместить объект на поле!";
                console.error("Can not place grass object!");
                return -1;
            }
        }
        return position;
    }

    public canSpawnOnCell(cell: ForestCell):boolean {
        if (!cell.state.opened) {
            return false;
        }

        if (this.isInteractive(cell) && cell.type != CellType.HIVE) {
            if (cell.state.content == ContentType.bush) {
                return cell.state.berries.length == 0;
            }
            return true;
        }

        if (ForestUtils.isLandscapeType(cell.type)) {
            return cell.state.label.text == "" || !cell.state.label.visible;
        } else if (cell.type == CellType.HIVE && cell.state.honeyLabel && Number(cell.state.honeyLabel.text) != 0) {
            return false;
        }

        return true;
    }
}