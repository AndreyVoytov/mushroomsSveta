
import SeparatorType from '../model/enum/SeparatorType';
import Environment from '../model/enum/Environment';
import ForestAim from './../model/forest/ForestAim';
import ForestCell from '../model/forest/ForestCell';
import ForestType from './../model/forest/ForestType';
import AimType from '../model/enum/AimType';
import CellType from '../model/enum/CellType';
import NeverError from './NeverError';
import Utils from './Utils';
import OpeningType from '../model/enum/OpeningType';
import BoosterInfo from '../model/forest/BoosterInfo';
import { ContentType, ItemContents, AnimalsContents, BoostersContents, DecorationsContents, InteractiveContents } from '../model/enum/ContentType';
import BoosterType from '../model/enum/BoosterType';
import AnimationUtils from './AnimationUtils';
import UserService from './../service/UserService';
import ForestDao from './../dao/ForestDao';
import SpecialItemsConfiguration from './../configuration/SpecialItemsConfiguration';
import User from './../model/user/User';
import BiomType from './../model/enum/BiomType';
import ForestItemType from '../model/forest/ForestItemType';
import ItemUtils from './ItemUtils';
import AnalyticUtils from './AnalyticUtils';
import StoryLocation from '../model/enum/StoryLocation';
export default class ForestUtils {

    public static FOREST_STEPS_ADDITION = 5;

    public static SECRET_FOREST_OPEN_PRICE = 5;

    public static ADDITIONAL_STEPS_GEM_PRICE = 50;
    public static ADDITIONAL_STEPS_COUNT = 5;
    public static MAX_AIMS_COUNT = 3;

    public static AVG_BERRIES_ON_BUSH = 4;

    public static SECRET_FOREST_COOLDOWN_MINUTES = 5 ;
    public static FOREST_COOLDOWN_SMALL = 15 * 1000;
    // public static FOREST_COOLDOWN_SMALL = 0;
    public static FOREST_COOLDOWN_BIG = 60 * 60 * 1000;
    public static FOREST_PASS_TIMES = 3;

    public static getAims(forestType: ForestType): ForestAim[] {
        let res: ForestAim[] = [];

        Utils.enumValues(AimType).forEach(at => {
            let type: AimType = at;
            switch (type) {
                case AimType.itemsBunch:
                    if (forestType.randomItems) {
                        res.push(new ForestAim(AimType.itemsBunch, "smth", forestType.randomItems));
                    }
                    break;
                case AimType.item:
                    if (forestType.items) {
                        forestType.items.forEach(itemType => {
                            if (itemType.count > 0 && ContentType[itemType.name] in ItemContents) {
                                res.push(new ForestAim(AimType.item, itemType.name, itemType.count));
                            }
                        })
                    }
                    break;
                case AimType.ladybug:
                    if (forestType.ladybugs && forestType.ladybugs.length > 0) {
                        let darkForest = forestType.environment == Environment.darkForest;
                        res.push(new ForestAim(AimType.ladybug, darkForest ? "bug3" : "ladybug", forestType.ladybugs.length));
                    }
                    break;
                case AimType.flower:
                    if (forestType.flowers && forestType.flowers != 0) {
                        res.push(new ForestAim(AimType.flower, "chamomileSmall", forestType.flowers));
                    }
                    break;
                case AimType.cankerberry:
                    if (forestType.cankerberries && forestType.cankerberries != 0) {
                        res.push(new ForestAim(AimType.cankerberry, "cankerberry", forestType.cankerberries));
                    }
                    break;
                case AimType.blueberry:
                    if (forestType.interactiveItems) {
                        let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush2]);
                        if(item){
                            res.push(new ForestAim(AimType.blueberry, "blueberry", item.count * ForestUtils.AVG_BERRIES_ON_BUSH ));
                        }
                    }
                    break;
                case AimType.redberry:
                    if (forestType.interactiveItems) {
                        let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush]);
                        if(item){
                            res.push(new ForestAim(AimType.redberry, "redberry", item.count * ForestUtils.AVG_BERRIES_ON_BUSH));
                        }
                    }
                    break;
                case AimType.jelly:
                    if (forestType.jellyMushrooms && forestType.jellyMushrooms != 0) {
                        res.push(new ForestAim(AimType.jelly, "jellyMushroom", forestType.jellyMushrooms));
                    }
                    break;
                case AimType.acorn:
                    if (forestType.acorns && forestType.acorns != 0) {
                        res.push(new ForestAim(AimType.acorn, "acorn", forestType.acorns));
                    }
                    break;
                case AimType.dragonfly:
                    if (forestType.dragonflies && forestType.dragonflies != 0) {
                        res.push(new ForestAim(AimType.dragonfly, "dragonfly", forestType.dragonflies));
                    }
                    break;
                case AimType.honey:
                    if (forestType.honey && forestType.honey != 0) {
                        res.push(new ForestAim(AimType.honey, "honey", forestType.honey));
                    }
                    break;
                case AimType.book:
                    if (forestType.interactiveItems) {
                        let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.book1]);
                        if(item){
                            res.push(new ForestAim(AimType.book, "book3", item.count));
                        }
                    }
                    break;
                case AimType.moonflower:
                    if (forestType.interactiveItems) {
                        let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.moonflowerClosed]);
                        if(item){
                            res.push(new ForestAim(AimType.moonflower, "moonflower", item.count));
                        }
                    }
                    break;
                case AimType.pearl:
                    if (forestType.interactiveItems) {
                        let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.shell]);
                        if(item){
                            res.push(new ForestAim(AimType.pearl, "pearl", item.count));
                        }
                    }
                    break;
                case AimType.boat:
                    let boatsCount = forestType.mask.split(ForestUtils.getChar(CellType.BOAT)).length - 1;
                    if (boatsCount > 0) {
                        res.push(new ForestAim(AimType.boat, "boat", boatsCount));
                    }
                    break;
                default:
                    throw new NeverError(type);
            }
        })

        // res.forEach(a => a.count = 0);
        return res;
    }

    public static isCoverFreeNotBoosterItem(type: CellType): boolean {
        return this.getCoverFreeNotBoosterItem(type) ? true : false;
    }

    public static getCoverFreeNotBoosterItem(type: CellType) : ContentType {
        switch (type) {
            case CellType.HIVE: return ContentType.hive;
            case CellType.ACORN: return ContentType.acorn;;

            case CellType.COMPASS_FREE:
            case CellType.ROCKET:
            case CellType.ROCKET2:
            case CellType.ROCKET3:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.ROCKET_IVY3:
            case CellType.ROCKET_IVY:
            case CellType.COMPASS_IVY:
            case CellType.ROCKET_IVY2:
            case CellType.EMPTY:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.DRAGONFLY:
            case CellType.COLD:
            case CellType.JELLY:
            case CellType.WATER:
            case CellType.FOREST:
            case CellType.MOUNTAIN:
            case CellType.BERRY_FIELD:
            case CellType.SAND:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
            case CellType.BOAT:
                return null;

            default:
                throw new NeverError(type);
        }
    }

    public static getForestCellBg(type: ForestType, cellType: CellType) {
        if (ForestUtils.getBiom(cellType) == BiomType.WATER) {
            return "water"
        }

        if (ForestUtils.getBiom(cellType) == BiomType.SAND) {
            return "sand"
        }

        if (ForestUtils.getBiom(cellType) == BiomType.BERRY_FIELD) {
            return "grassFlower"
        }

        switch (type.environment) {
            case Environment.forest:
                return "grass";
            case Environment.house:
                return "hexWood";
            case Environment.darkForest:
                return "grassDF"; //TODO
            case Environment.flowerFields:
            case Environment.lake:
            case Environment.jungles:
            case Environment.bugForest:
            case Environment.snailForest:
                return "grass"; //TODO
            default:
                throw new NeverError(type.environment);
        }
    }

    public static getPrizeGemsCount(stepsLeft:number):number {
        // return 10;
        return Math.floor(14 + 7 * (Math.min(1, stepsLeft / 10)));
        // return Math.ceil(Math.floor(14 + 7 * (Math.min(1, stepsLeft / 10)))/1.5);
    }

    public static getCellType(char: string): CellType {
        return Utils.enumValues(CellType).filter(t => this.getChar(t) == char).shift();
    }

    public static getChar(type: CellType): string {
        switch (type) {
            case CellType.EMPTY: return "0";
            case CellType.FOREST: return "g";
            case CellType.MOUNTAIN: return "m";
            case CellType.WATER: return "w";
            case CellType.IVY_SMALL: return "l";
            case CellType.IVY: return "i";
            case CellType.IVY_STRONG: return "j";
            case CellType.COMPASS_IVY: return "t";
            case CellType.COMPASS_FREE: return "s";
            case CellType.VISION: return "v";
            case CellType.VISION_IVY: return "V";
            case CellType.ROCKET: return "r";
            case CellType.ROCKET_IVY: return "R";
            case CellType.ROCKET2: return "q";
            case CellType.ROCKET_IVY2: return "Q";
            case CellType.ROCKET3: return "y";
            case CellType.ROCKET_IVY3: return "Y";


            case CellType.JELLY: return "c";
            case CellType.COLD: return "C";
            case CellType.HIVE: return "h";
            case CellType.CANKERBERRY1: return "k";
            case CellType.CANKERBERRY2: return "K";
            case CellType.ACORN: return "a";
            case CellType.DRAGONFLY: return "f";
            case CellType.PLANK1: return "p";
            case CellType.PLANK2: return "P";
            case CellType.PLANK3: return "z";
            case CellType.BOAT: return "b";

            case CellType.IVY_SMALL_M: return "A";
            case CellType.IVY_M: return "B";
            case CellType.IVY_STRONG_M: return "D";
            case CellType.PLANK1_M: return "E";
            case CellType.PLANK2_M: return "F";
            case CellType.PLANK3_M: return "d";
            case CellType.BERRY_FIELD: return "1";
            case CellType.SAND: return "2";
            default:
                throw new NeverError(type);
        }
    }

    private static straightIvyContents = [CellType.IVY_SMALL_M, CellType.IVY_M, CellType.IVY_STRONG_M, CellType.PLANK1_M, CellType.PLANK2_M, CellType.PLANK3_M,
        CellType.IVY_SMALL, CellType.IVY, CellType.IVY_STRONG, CellType.PLANK1, CellType.PLANK2, CellType.PLANK3];
    
    public static containIvyChar(mask:string):boolean{
        for(let type of this.straightIvyContents){
            if(mask.indexOf(this.getChar(type)) != -1){
                console.log("containIvyChar: result = true");
                return true;
            }
        }

        return false;
    }


    public static isBoosterType(type: CellType): boolean {
        return ForestUtils.getBoosterInfo(type) ? true : false;
    }

    public static isIvyFreeBoosterType(type: CellType): boolean {
        let boosterInfo = ForestUtils.getBoosterInfo(type);
        return boosterInfo? !boosterInfo.isContainIvy() : false;
    }

    public static getBoosterContentType(type: CellType): ContentType {
        let boosterInfo = ForestUtils.getBoosterInfo(type);
        return boosterInfo? boosterInfo.getContentType() : null;
    }

    public static getOpeningTypeByBooster(type: CellType):OpeningType{
        let boosterInfo = ForestUtils.getBoosterInfo(type);
        return boosterInfo? boosterInfo.getOpeningType() : null;
    }

    public static getBoosterInfo(type:CellType):BoosterInfo{
        switch (type) {
            case CellType.COMPASS_IVY:
                return new BoosterInfo(ContentType.compass, OpeningType.byCompass, true)
            case CellType.COMPASS_FREE:
                return new BoosterInfo(ContentType.compass, OpeningType.byCompass, false)
            case CellType.ROCKET_IVY:
                return new BoosterInfo(ContentType.rocket1, OpeningType.byRocket, true)
            case CellType.ROCKET:
                return new BoosterInfo(ContentType.rocket1, OpeningType.byRocket, false)
            case CellType.ROCKET_IVY2:
                return new BoosterInfo(ContentType.rocket2, OpeningType.byRocket, true)
            case CellType.ROCKET2:
                return new BoosterInfo(ContentType.rocket2, OpeningType.byRocket, false)
            case CellType.ROCKET_IVY3:
                return new BoosterInfo(ContentType.rocket3, OpeningType.byRocket, true)
            case CellType.ROCKET3:
                return new BoosterInfo(ContentType.rocket3, OpeningType.byRocket, false)
            case CellType.VISION_IVY:
                return new BoosterInfo(ContentType.vision, OpeningType.byVision, true)
            case CellType.VISION:
                return new BoosterInfo(ContentType.vision, OpeningType.byVision, true)
            case CellType.EMPTY:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.CANKERBERRY1:
            case CellType.DRAGONFLY:
            case CellType.CANKERBERRY2:
            case CellType.COLD:
            case CellType.JELLY:
            case CellType.WATER:
            case CellType.HIVE:
            case CellType.FOREST:
            case CellType.MOUNTAIN:
            case CellType.ACORN:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.BOAT:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
            case CellType.BERRY_FIELD:
            case CellType.SAND:
                return null;
            default:
                throw new NeverError(type);
        }
    }

    
    public static containIvyOrIce(type: CellType): boolean {
        switch (type) {
            case CellType.COMPASS_IVY:
            case CellType.VISION_IVY:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET_IVY3:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.CANKERBERRY1:
            case CellType.DRAGONFLY:
            case CellType.CANKERBERRY2:
            case CellType.COLD:
            case CellType.JELLY:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
                return true;
            case CellType.EMPTY:
            case CellType.COMPASS_FREE:
            case CellType.ROCKET:
            case CellType.ROCKET2:
            case CellType.ROCKET3:
            case CellType.VISION:
            case CellType.WATER:
            case CellType.HIVE:
            case CellType.FOREST:
            case CellType.MOUNTAIN:
            case CellType.ACORN:
            case CellType.BOAT:
            case CellType.BERRY_FIELD:
            case CellType.SAND:
                return false;
            default:
                throw new NeverError(type);
        }
    }

    //TODO remove
    public static isLandscapeType(type: CellType): boolean {
        switch (type) {
            case CellType.EMPTY:
            case CellType.COMPASS_IVY:
            case CellType.COMPASS_FREE:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:

            case CellType.COLD:
            case CellType.JELLY:
            case CellType.HIVE:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.DRAGONFLY:
            case CellType.ACORN:
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.BOAT:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
                return false;
            case CellType.FOREST:
            case CellType.MOUNTAIN:
            case CellType.WATER:
            case CellType.BERRY_FIELD:
            case CellType.SAND:
                return true;
            default:
                throw new NeverError(type);
        }
    }

    //можно зарефакторить forestType.mask, сделать биом на отдельной кисти
    public static getBiom(type: CellType): BiomType {
        switch (type) {
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.EMPTY:

            case CellType.HIVE:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.FOREST:
            case CellType.COMPASS_IVY:
            case CellType.COMPASS_FREE:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.ACORN:
            case CellType.DRAGONFLY:
            case CellType.JELLY:
                return BiomType.FOREST;
            case CellType.COLD:
            case CellType.WATER:
            case CellType.BOAT:
                return BiomType.WATER;
            case CellType.MOUNTAIN:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
                return BiomType.MOUNTAIN;
            case CellType.BERRY_FIELD:
                return BiomType.BERRY_FIELD;
            case CellType.SAND:
                return BiomType.SAND;
            default:
                throw new NeverError(type);
        }
    }

    public static isOccupied(forestCell: ForestCell) : boolean {
        let res = false;
        let c = forestCell.state.content;

        this.visitContents(c, (c:ItemContents)=>{
            res = false;
        }, (c:AnimalsContents)=>{
            res = false;
        }, (c:BoostersContents)=>{
            res = true;
        }, (c: DecorationsContents)=>{
            res = false;
        }, (c: InteractiveContents)=>{
            switch(c){
                case InteractiveContents.empty:
                case InteractiveContents.chamomileSmall:
                    res = false;
                    break;
                case InteractiveContents.acorn:
                case InteractiveContents.book1:
                case InteractiveContents.bush:
                case InteractiveContents.bush2:
                case InteractiveContents.hive:
                case InteractiveContents.lockpick:
                case InteractiveContents.moonflowerClosed:
                case InteractiveContents.shell:
                    res = true;
                    break;
                default:
                    throw new NeverError(c);
            }
        });

        return res;
    }

    public static canBeOccupiedByLadybug(type: CellType): boolean {
        return type != CellType.EMPTY;
    }

    public static getSeparatorImage(type: SeparatorType): string {
        switch (type) {
            case SeparatorType.left:
                // return "separator1"
            case SeparatorType.leftbottom:
                // return "separator2"
            case SeparatorType.lefttop:
                // return "separator3"

                return "separator";
            case SeparatorType.right:
            case SeparatorType.righttop:
            case SeparatorType.rightbottom:
                return "";
            default:
                throw new NeverError(type);
        }
    }

    public static visitContents(content: ContentType, 
                                visitItemContents: (c:ItemContents)=>void, 
                                visitAnimalsContents: (c:AnimalsContents)=>void,
                                visitBoostersContents: (c:BoostersContents)=>void,
                                visitDecorationsContents: (c:DecorationsContents)=>void,
                                visitInteractiveContents: (c:InteractiveContents)=>void) : void {

        if(content in AnimalsContents){
            visitAnimalsContents(content as AnimalsContents);
            return;
        } else if (content in BoostersContents){
            visitBoostersContents(content as BoostersContents);
            return;
        } else if (content in DecorationsContents){
            visitDecorationsContents(content as DecorationsContents);
            return;
        } else if (content in ItemContents){
            visitItemContents(content as ItemContents);
            return;
        } else if (content in InteractiveContents){
            visitInteractiveContents(content as InteractiveContents);
            return;
        }

        alert("Неизвестный контент для ячейки: " + content);
    }

    public static getBoosterNamePlural(type: BoosterType):string{
        switch(type){
            case BoosterType.compass:
                return "компасов"
            case BoosterType.rocket:
                return "сигнальных ракет"
            case BoosterType.vision:
                return "волшебных сфер"
            case BoosterType.beans:
                return "волшебных бобов"
            case BoosterType.glove:
                return "перчаток"
            case BoosterType.rainbow:
                return "флаконов с радугой"            
            default: 
                throw new NeverError(type);
        }
    }

    public static isBoosterSeen(boosterType: BoosterType):boolean{
        let user = UserService.getUser();
        return user.getMarkers().indexOf(ForestUtils.getMarker(boosterType)) != -1;
    }

    public static markBoosterSeen(boosterType: BoosterType):void{
        let user = UserService.getUser();
        if(user.getMarkers().indexOf(ForestUtils.getMarker(boosterType)) == -1){
            user.addMarker(ForestUtils.getMarker(boosterType));
        }
    }

    private static getMarker(boosterType: BoosterType):string{
        return boosterType + "Seen";
    }

    public static tryAnimateBooster(game: Phaser.Game, cell: ForestCell){
        if(cell.state.content in BoostersContents && cell.state.cover && !cell.state.cover.isLocked()){
            let booster:BoostersContents = <BoostersContents>cell.state.content;
            game.tweens.removeFrom(cell.state.sprite);

            switch(booster){
                case BoostersContents.compass:
                    AnimationUtils.heartBeat(game, cell.state.sprite);
                    break;
                case BoostersContents.rocket1:
                case BoostersContents.rocket2:
                case BoostersContents.rocket3:
                    AnimationUtils.wiggle(game, cell.state.sprite);
                    break;
                case BoostersContents.vision:
                    AnimationUtils.levitate(game, cell.state.sprite);
                    break;
                default:
                    throw new NeverError(booster);
            }
        }
    }

    // ATLASES loading
    public static getMinigameScreenImage(env: Environment):string{
        switch(env){
            case Environment.forest:
                return "minigame1";
            case Environment.house:
                return "minigame2";
            case Environment.darkForest:
                return "minigame3";
            case Environment.lake:
                return "minigame4";
            case Environment.flowerFields:
                return "minigame5";
            case Environment.jungles:
                return "minigame6";
            case Environment.bugForest:
                return "minigame7";
            case Environment.snailForest:
                return "minigame8";
            default:
                throw new NeverError(env);
        }
    }

	public static getScreenImage(location: StoryLocation):string{
        switch (location) {
            case StoryLocation.house_boiler:
            case StoryLocation.house_chestClosed:
            case StoryLocation.house_chestOpened:
                return "houseBg";
            case StoryLocation.forest:
            case StoryLocation.forest_campfire:
            case StoryLocation.forest_watermill:
            case StoryLocation.forest_camp:
                return "forestBg";
            case StoryLocation.darkForest:
            case StoryLocation.darkForest_unicorn:
                return "darkForestBg";
            case StoryLocation.attic:
                return "atticBg";
            case StoryLocation.flowerFields:
                return "fieldsBg";
            case StoryLocation.nearHouse://using for loadingScreen
            case StoryLocation.none:
                return null;
            default:
                throw new NeverError(location);
        }

    }


    public static getAllMinigameScreenImages():string[]{
        return Utils.enumValues(Environment).map(e => this.getMinigameScreenImage(e));
    }

    public static getAllScreenImages():string[]{
        return Utils.enumValues(StoryLocation).map(l => this.getScreenImage(l));
    }

    private static getItemCount(forestType:ForestType, itemName:string):number{
        let item = forestType.items.filter(i => i.name == itemName).shift();
        return item? item.count : 0;
    }


    public static getNeededTowerLevel(forestIndex:number):number{
        switch(forestIndex){
            case 0:
            case 1:
            case 2:
                return 1;
            case 3: 
                return 2;
            case 4: 
                return 3;
            case 5:
            case 6:
            case 7:
            case 8:
                return Math.floor(3 + (forestIndex - 4) * 1.5);
            default:
                return Math.floor(3 + (forestIndex - 4) * 1.5) + 2;//19 forest on 27 level

            // case 5: 
            //     re
        }
        // return forestIndex  * 3 - 7;
    }

    // public static GIVE_KEY_ON_AVAILABLE_FORESTS = 1;
    public static AVAILABLE_FORESTS_COUNT = 4;
    public static forestTypeToPLay : ForestType;
    public static withMaxSteps : boolean;

    // public static getLevelByBioms(bioms:BiomType[], hardLevel?:boolean):ForestType{
    //     let user = UserService.getUser();
    //     let res = null;

    //     let availableBioms:BiomType[] = this.getAllAvailableBioms();

    //     if(user.getUsedNotOrderedLevels().length < 30){ //если уже слишком много уровней взято не по-порядку, берём по-порядку
    //         for(let i= user.getUsedOrderedForests(); i< ForestDao.getAllForests().length; i++){
    //             let forestType = ForestDao.getAllForests()[i];
    //             if(user.getUsedNotOrderedLevels().indexOf(forestType.id) == -1 &&                                               //ещё не открыт
    //                     (bioms.length == 0 ||  bioms.filter(b => forestType.slots.find(slot => slot.biom == b)? true : false).length > 0) &&       //присутствует место для самого дорогого предмета                                     
    //                     forestType.slots.filter(slot => availableBioms.indexOf(slot.biom) == -1).length == 0 &&               //отсутствуют недоступные биомы
    //                     (!hardLevel || ForestUtils.isHardLevel(forestType)) 
    //             ) {
    //                 res = forestType;
    //                 break;
    //             }
    //         }
    //     } 

    //     if(!res){
    //         res = ForestDao.getAllForests()[user.getUsedOrderedForests()];
    //     }

    //     return res;
    // }

    // public static getAllAvailableBioms():BiomType[]{
    //     let user = UserService.getUser();
    //     let allAvailableBioms:BiomType[] = [];
    //     user.getUnlockedItems().forEach(i => {
    //         ForestUtils.getBioms(i).forEach(b => {
    //             if(allAvailableBioms.indexOf(b) == -1){
    //                 allAvailableBioms.push(b);
    //             }
    //         })
    //     })
    //     return allAvailableBioms;
    // }

    public static KEY_IMAGE = "keyHex";

    // public static updateLastVisitSteps(forestInfo:ForestInfo):void{
    //     let user = UserService.getUser();
    //     forestInfo.lastVisitSteps = this.getStepsCount(forestInfo.forestType);
    //     forestInfo.lastVisitOnLevel = user.getTowerLevel();
    // }

    // public static getStepsAddition(forestType: ForestType):number{
    //     let user = UserService.getUser();
    //     let forestInfo = user.getAllForests().filter(af => af.forestType.id == forestType.id).shift();

    //     if(!forestInfo || !forestInfo.lastVisitSteps || forestInfo.lastVisitSteps >= forestType.mask.length){
    //         return 0;
    //     }

    //     // console.log("forestInfo.lastVisitSteps: " + forestInfo.lastVisitSteps)
    //     // console.log("this.getStepsCount(forestType): " + this.getStepsCount(forestType))
    //     return this.getStepsCount(forestType) - forestInfo.lastVisitSteps;
    // }

    private static MINIMAL_STEPS_COUNT = 4;
    public static LEVEL_STEPS_RATIO = 2;


    public static getStepsCount(forestType: ForestType):number{
        return forestType.steps;
    }

    private static between(num:number, range:number[]):boolean{
        return num >= range[0] && num <= range[1];
    }

    // public static getStepsMaxCount(forestType: ForestType):number{
    //     return forestType.maxSteps || forestType.steps + 4;
    // }

    // public static getAvailableForest(forestType:ForestType):ForestInfo{
    //     let user = UserService.getUser();
    //     return user.getAllForests().find(af => af.forestType.id == forestType.id);
    // }

    // public static getSpeedUpForestPrice(forestInfo:ForestInfo):number{
    //     if(forestInfo.availableAt - Date.now() < 2 * 60 * 1000 ){
    //         return 1;
    //     }

    //     return Math.floor(60 * Math.min(1, (forestInfo.availableAt - Date.now())/ForestUtils.FOREST_COOLDOWN_BIG));
    // }

    public static getSlotsOfBiom(forestType:ForestType, biomType: BiomType):number{
        //TODO!!!
        switch(biomType){
            case BiomType.WATER:
                let wlilly = forestType.items.find(i => i.name == ContentType[ContentType.lilly]);
                return wlilly? wlilly.count : 0;
            case BiomType.FOREST:
            case BiomType.MOUNTAIN:
            case BiomType.BERRY_FIELD:
                case BiomType.SAND:
                    return 0;
                    default:
                        throw new NeverError(biomType);
                    }
                    return 0;
                }
                
    public static getBioms(content:ContentType):BiomType[]{
        if(content in ItemContents){
            let c = <ItemContents>content;
            switch(c){
                case ItemContents.lilly:  
                    return [BiomType.WATER];
                case ItemContents.goldRoot:
                    return [BiomType.FOREST];
                case ItemContents.lavanda:  
                    return [BiomType.MOUNTAIN];
                case ItemContents.emerald:  
                    return [BiomType.SAND];
                case ItemContents.candy:  
                    return [BiomType.MOUNTAIN];
                case ItemContents.amber:
                    return [BiomType.SAND];
                case ItemContents.strawberry:          
                case ItemContents.blackberry:
                    // return [BiomType.FOREST, BiomType.BERRY_FIELD, BiomType.MOUNTAIN];
                    return [BiomType.BERRY_FIELD];
                case ItemContents.mushroom4:
                    return [BiomType.FOREST]//, BiomType.SAND];
                case ItemContents.witchMushroom2:
                case ItemContents.amanita2:          
                    return [BiomType.FOREST]//, BiomType.MOUNTAIN];
                
                case ItemContents.mushroom:  
                case ItemContents.poleno:     
                case ItemContents.t27:       
                case ItemContents.mushroom3:     
                case ItemContents.mushroom5:     
                case ItemContents.wheat:
                case ItemContents.yellowLilly:
                case ItemContents.amanita:         
                case ItemContents.t24:          
                case ItemContents.t1:
                case ItemContents.t25: 
                case ItemContents.witchMushroom:   
                case ItemContents.randomItem:       
                case ItemContents.specificItem:       
                case ItemContents.apple:       
                        return [BiomType.FOREST];
                default:
                    throw new NeverError(c);
            }
        }

        if(content in InteractiveContents){
            let c = <InteractiveContents>content;
            switch(c){
                case InteractiveContents.shell:
                    return [BiomType.WATER, BiomType.SAND];
                case InteractiveContents.book1:
                case InteractiveContents.lockpick:
                    return [BiomType.MOUNTAIN];
                case InteractiveContents.bush:
                case InteractiveContents.bush2:
                case InteractiveContents.chamomileSmall:
                    return [BiomType.FOREST, BiomType.MOUNTAIN];
                case InteractiveContents.moonflowerClosed:
                    return [BiomType.FOREST, BiomType.BERRY_FIELD];
                case InteractiveContents.hive:
                case InteractiveContents.acorn:
                case InteractiveContents.empty:
                    return [BiomType.FOREST];
                default:
                    throw new NeverError(c);
            }
        }

        return [];
    }

    public static getCellsByBiom(forestType:ForestType) : {count:number, cellsCount:number, biom:BiomType}[] {
        let res : {count:number, cellsCount:number, biom:BiomType}[] = [];
        for (let i = 0; i < forestType.mask.length; i++) {
            let biom = ForestUtils.getBiom(ForestUtils.getCellType(forestType.mask[i]));
            let placingForBiom = res.find(cb => cb.biom == biom);
            if(!placingForBiom){
                placingForBiom = {count:0, cellsCount:0, biom:biom};
                res.push(placingForBiom);
            }
            placingForBiom.cellsCount++;
        }
        return res;
    }

    public static placeItemToCorrectBiom(placing: {count:number, cellsCount:number, biom:BiomType}[], bioms:BiomType[] ): void {
        let choosenBiom = bioms[0];
        let minDencity = 1;
        bioms.forEach(b => {
            let placingForBiom = placing.find(p => p.biom == b);
            if(placingForBiom && placingForBiom.cellsCount > placingForBiom.count){
                let dencity =  placingForBiom.count/placingForBiom.cellsCount;
                if(dencity < minDencity){
                    choosenBiom = b;
                    minDencity = minDencity;
                }
            }
        });
        placing.forEach(p => {
            if(p.biom == choosenBiom){
                p.count ++;
            }
        })
    }

    private static baseAdjectives: {mascline:string, feminine:string, neuter:string}[]=[
        {mascline:"радужный", feminine:"радужная", neuter:"радужное"},
        {mascline:"дождевой", feminine:"дождевая", neuter:"дождевое"},
        {mascline:"радужный", feminine:"радужная", neuter:"радужное"},
        {mascline:"волшебный", feminine:"волшебная", neuter:"волшебное"},
        {mascline:"мистический", feminine:"мистическая", neuter:"мистическое"},
        {mascline:"заячий", feminine:"заячья", neuter:"заячье"},
        {mascline:"барсучий", feminine:"барсучья", neuter:"барсучье"},
        {mascline:"волчий", feminine:"волчья", neuter:"волчье"},
    ];
    private static forestAdjectives: {mascline:string, feminine:string, neuter:string}[]=[
        {mascline:"дремучий", feminine:"дремучая", neuter:"дремучее"},
        {mascline:"осенний", feminine:"осенняя", neuter:"осеннее"},
        {mascline:"лиственный", feminine:"лиственная", neuter:"лиственное"},
        {mascline:"хвойный", feminine:"хвойная", neuter:"хвойное"},
        {mascline:"молодой", feminine:"молодая", neuter:"молодое"},
    ];
    private static waterAdjectives: {mascline:string, feminine:string, neuter:string}[]=[
        {mascline:"пресный", feminine:"пресная", neuter:"пресное"},
        {mascline:"соленый", feminine:"соленая", neuter:"соленое"},
        {mascline:"изумрудный", feminine:"изумрудная", neuter:"изумрудное"},
        {mascline:"ракушечий", feminine:"ракушечья", neuter:"ракушечье"},
    ];
    private static mountineAdjectives: {mascline:string, feminine:string, neuter:string}[]=[
        {mascline:"железный", feminine:"железная", neuter:"железное"},
        {mascline:"медный", feminine:"медная", neuter:"медное"},
        {mascline:"самоцветный", feminine:"самоцветная", neuter:"самоцветное"},
        {mascline:"высокий", feminine:"высокая", neuter:"высокое"},
        {mascline:"пологий", feminine:"пологая", neuter:"пологое"},
    ];

    // private static baseObjectives: {name:string, genus:string}[]=[];
    private static forestObjectives: {name:string, genus:string}[]=[
        {name:"перелесок", genus:"m"},
        {name:"лес", genus:"m"},
        {name:"бор", genus:"m"},
        {name:"валежник", genus:"m"},
      
        {name:"просека", genus:"f"},
        {name:"роща", genus:"f"},
        {name:"чаща", genus:"f"},
        {name:"пуща", genus:"f"},
        {name:"тайга", genus:"f"},
        {name:"чащоба", genus:"f"},
        {name:"глушь", genus:"f"},

        {name:"редколесье", genus:"n"},
    ];
    private static waterObjectives: {name:string, genus:string}[]=[
        {name:"озеро", genus:"n"},
        {name:"болото", genus:"n"},
        {name:"русло", genus:"n"},

        {name:"пруд", genus:"m"},
        {name:"водоем", genus:"m"},
        
        {name:"лагуна", genus:"f"},

        {name:"великие озера", genus:null},
        {name:"соленые озера", genus:null},
    ];
    private static mountineObjectives: {name:string, genus:string}[]=[
        {name:"взгорье", genus:"n"},

        {name:"склон", genus:"m"},
        {name:"холм", genus:"m"},
        {name:"бугор", genus:"m"},
        {name:"перешеек", genus:"m"},
        
        {name:"гора", genus:"f"},

    ];

    // public static generateForestName(bioms?:BiomType[]):string{

    //     let biom1 = bioms? bioms[Utils.random(bioms.length)] : BiomType.BERRY_FIELD;
    //     let biom2 = bioms? bioms[Utils.random(bioms.length)] : BiomType.BERRY_FIELD;

    //     let objectivesArray:{name:string, genus:string}[];
    //     let adjectivesArray:{mascline:string, feminine:string, neuter:string}[];

    //     switch(biom1){
    //         case BiomType.FOREST: objectivesArray = this.forestObjectives; break;
    //         case BiomType.WATER: objectivesArray = this.waterObjectives; break;
    //         case BiomType.MOUNTAIN: objectivesArray = this.mountineObjectives; break;
    //         default:
    //             objectivesArray = this.forestObjectives;
    //     }
    //     // if(Utils.randomBoolean()) objectivesArray = this.baseObjectives;

    //     switch(biom2){
    //         case BiomType.FOREST: adjectivesArray = this.forestAdjectives; break;
    //         case BiomType.WATER: adjectivesArray = this.waterAdjectives; break;
    //         case BiomType.MOUNTAIN: adjectivesArray = this.mountineAdjectives; break;
    //         default:
    //             adjectivesArray = this.baseAdjectives;
    //     }
    //     if(Utils.randomBoolean()) adjectivesArray = this.baseAdjectives;

    //     let choosenObjective = objectivesArray[Utils.random(objectivesArray.length)];
    //     let res = choosenObjective.name;
    //     if(choosenObjective.genus == "m"){
    //         res = adjectivesArray[Utils.random(adjectivesArray.length)].mascline + " " + res;
    //     } else if(choosenObjective.genus == "f"){
    //         res = adjectivesArray[Utils.random(adjectivesArray.length)].feminine + " " + res;
    //     } else if(choosenObjective.genus == "n"){
    //         res = adjectivesArray[Utils.random(adjectivesArray.length)].neuter + " " + res;
    //     }

    //     for(let avf of UserService.getUser().getAvailableForests()){
    //         if(res == avf.forestType.name){
    //             return this.generateForestName(bioms);
    //         }
    //     }

    //     return res;
    // }

    public static isHardLevel(forestType:ForestType):boolean{
        return forestType.maxSteps && forestType.maxSteps != forestType.steps;
    } 

    public static getHardLevelOffset(forestType:ForestType):number{
        return 5 - forestType.name.length%3;
    }

    // private static fixedHardLevels = [4, 7, 10, 15];

    // private static specialStepsAdditions:{level:number, addition:number}[] = [
    //     {level:4, addition:6}
    // ]

    public static nextLevelIsHard():boolean{
        let currentForest = ForestDao.getForestType(UserService.getUser().getCurrentForest());
        return currentForest.hardLevel;


        // let index = user.getCurrentForest() + 1;
        // if(index <= this.fixedHardLevels[this.fixedHardLevels.length-1]){
        //     return this.fixedHardLevels.indexOf(index) != -1;
        // }

        // let lastForestType = user.getAvailableForests()[user.getAvailableForests().length -1].forestType;
        // return user.getHardLevelOffset() >= ForestUtils.getHardLevelOffset(lastForestType);
    }

    // private static getSpecialAddition(forestInfo:ForestInfo):number{
    //     let user = UserService.getUser();
    //     if(forestInfo && !forestInfo.specialItemOrCreature){
    //         let index = user.getCurrentForest() - user.getAvailableForests().length + 2 + user.getAvailableForests().indexOf(forestInfo);
    //         let specialAddition = this.specialStepsAdditions.find(a => a.level == index);
    //         if(specialAddition){
    //             return specialAddition.addition;
    //         }
    //     }
    //     return 0;
    // }

    // //Эта добавка нужна для игрока, который долго строил башню и не проходил уровни
    // private static getExpectedLevelStepsAddition(forestInfo:ForestInfo):number{
    //     // let user = UserService.getUser();
    //     // let index = user.getCurrentForest() - user.getAvailableForests().length + 1 + user.getAvailableForests().indexOf(forestInfo);

    //     // let expectedLevel = Math.ceil(index/10); //TODO сложная зависимость...
    //     // let delta = user.getLevel() - expectedLevel;
    //     // if(delta > 0){
    //     //     return delta;
    //     // }
    //     return 0;
    // }

}
