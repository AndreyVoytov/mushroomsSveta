import User from '../model/user/User';
import Environment from '../model/enum/Environment';
import Label from './../../view/component/panel/Label';
import BaseLayout from '../../view/component/house/layout/BaseLayout';
import EditorScreen from './../../view/screen/EditorScreen';
import HouseLayout from '../../view/component/house/layout/HouseLayout';
import NeverError from './NeverError';
import ReplicaType from '../model/replica/ReplicaType';
import ReplicaDao from '../dao/ReplicaDao';
import StoryLocation from '../model/enum/StoryLocation';
import UserService from '../service/UserService';
import DarkForestLayout from '../../view/component/house/layout/DarkForestLayout';
import ForestLayout from '../../view/component/house/layout/ForestLayout';
import SpriteUtils from './SpriteUtils';
import ForestType from '../model/forest/ForestType';
import ForestUtils from './ForestUtils';
import Utils from './Utils';
import BaseForestScreen from '../../view/screen/BaseForestScreen';
import CellsProvider from '../service/provider/CellsProvider';
import BaseCellsProvider from '../service/provider/BaseCellsProvider';
import Game from '../../view/game/Game';
import Settings from '../service/Settings';
import LevelBackdrop from '../../view/component/forest/LevelBackdrop';
export default class LocationUtils {

    public static SKIP_DIALOG_BUTTON_FROM_LEVEL = 5;
    public static CAT_FROM_LEVEL = 14;
    public static DIARY_AFTER_LEVEL = 3;

    public static BUSHES_MAX_VALUE = 3;

    public static getLocationLayout(game: Phaser.Game, user: User): BaseLayout {
        let nextReplica = ReplicaDao.getEntity().getReplica(UserService.getUser());

        if (nextReplica && nextReplica.location) {
            user.setLocation(nextReplica.location);
        }
        return LocationUtils.doGetLocationLayout(game, user.getLocation());
        // return LocationUtils.doGetLocationLayout(game, user.getCurrentForest(), user.getMarkers());
    }  
    
    public static isHouseStoryLocation(user: User){
        // if(user.getLocation() == StoryLocation.house_chestOpened || user.getLocation() == StoryLocation.house_chestClosed || user.getLocation() == StoryLocation.house_boiler){
        //     return true;
        // } 
        return false;
    }

    // //TODO remove
    // public static getLocationLayoutByReplica(game: Phaser.Game, replica: ReplicaType): BaseLayout {
    //     let level = replica.context.level;
    //     let replicaIndex = ReplicaDao.getEntity().getAll().indexOf(replica);
    //     // let markers = ReplicaDao.getEntity().getAll().filter((r,i) => r.setMarkerAfter && i < replicaIndex).map(r => r.setMarkerAfter);

    //     // return LocationUtils.doGetLocationLayout(game, level, markers);
    //     //TODO
    //     return new BaseLayout(game, "ForestLayout", "forestBg");

    // }

    public static doGetLocationLayout(game: Phaser.Game, location: StoryLocation): BaseLayout {
        console.log("LOCATION: " + location)
        switch (location) {
            case StoryLocation.house_boiler:
            case StoryLocation.house_chestClosed:
            case StoryLocation.house_chestOpened:
                return new HouseLayout(game, location);
            case StoryLocation.forest:
            case StoryLocation.forest_campfire:
            case StoryLocation.forest_watermill:
            case StoryLocation.forest_camp:
                return new ForestLayout(game, location)
            case StoryLocation.nearHouse:
                return new BaseLayout(game, "NearHouseLayout", "forestHouseBg")
            case StoryLocation.darkForest:
            case StoryLocation.darkForest_unicorn:
                return new DarkForestLayout(game, location);
            case StoryLocation.attic:
                return new BaseLayout(game, "AtticLayout", "atticBg")
            case StoryLocation.flowerFields:
                return new BaseLayout(game, "FlowerFieldsLayout", "fieldsBg")
            case StoryLocation.none:
                return null;
            default:
                throw new NeverError(location);
        }
    }

    public static getGroupId(location: StoryLocation): number{
        switch (location) {
            case StoryLocation.house_boiler:
            case StoryLocation.house_chestClosed:
            case StoryLocation.house_chestOpened:
                return 1;
            case StoryLocation.forest:
            case StoryLocation.forest_campfire:
            case StoryLocation.forest_watermill:
            case StoryLocation.forest_camp:
                return 2;
            case StoryLocation.nearHouse:
                return 3;
            case StoryLocation.darkForest:
            case StoryLocation.darkForest_unicorn:
                return 4;
            case StoryLocation.attic:
                return 5;
            case StoryLocation.flowerFields:
                return 6;
            case StoryLocation.none:
                return 7;
            default:
                throw new NeverError(location);
        }
    }

    public static samePlace(loc1: StoryLocation, loc2:StoryLocation){
        return LocationUtils.getGroupId(loc1) == LocationUtils.getGroupId(loc2);
    }

    private static getHeaderHeight(forestType: ForestType){
        switch (forestType.environment) {
            case Environment.house:
                return 400;
            case Environment.forest:  
            case Environment.darkForest:
            case Environment.flowerFields:
            case Environment.lake:
            case Environment.jungles:
            default:
                return 570;
                // throw new NeverError(forestType.environment);
        }

    } 

    public static getVisibleHeaderHeight(game:Phaser.Game, forestType: ForestType):number{
        return Math.min(game.height * 0.35, this.getHeaderHeight(forestType));
    }

    //MINIGAME 
    public static getMiniGameLayout(game: Phaser.Game, cellProvider: CellsProvider, forestType: ForestType, forEditor: boolean = false): (Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText | Phaser.Text)[] {
        const res: (Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText | Phaser.Text)[] = [
            LevelBackdrop.create(game, forestType, LocationUtils.getVisibleHeaderHeight(game, forestType), forEditor)
        ];
        this.addMaple(game, cellProvider, forestType, res);
        // The basket is an event badge, rather than a landscape header.
        if (forestType.header === 'lukoshkoHeader') {
            const badge = SpriteUtils.createSprite(game, game.width / 2, LocationUtils.getVisibleHeaderHeight(game, forestType) / 2, 'lukoshkoHeader');
            badge.anchor.set(0.5);SpriteUtils.fitIcon(badge, 280, 280);res.push(badge);
        }
        return res;
    }

    private static addMaple(game:Phaser.Game, cellProvider:CellsProvider, forestType:ForestType, res:(Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText | Phaser.Text)[]):void{
        if (forestType.cellsToSpawn) {
            let visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);
            let mapleFace = SpriteUtils.createSprite(game, game.width / 2, visibleHeaderHeight - 50, "mapleFace");
            mapleFace.name = "mapleFace";
            mapleFace.alpha = 0;
            mapleFace.anchor.set(0.5, 1);
            let maple = SpriteUtils.createSprite(game, game.width / 2, visibleHeaderHeight - 50, "maple");
            maple.name = "maple";
            maple.anchor.set(0.5, 1);
            let mapleDy = 50;

            Utils.applyPreset(maple, {"spriteId":"maple","x":479,"y":546.05 + mapleDy,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":1,"rotation":0})
            res.push(maple);
            Utils.applyPreset(mapleFace, {"spriteId":"maple","x":479,"y":546.05 + mapleDy,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":1,"rotation":0})
            res.push(mapleFace);


            let labelBg = SpriteUtils.createSprite(game, maple.x, maple.y - 112, "circleSmall");
            labelBg.name = "labelBg";
            // Utils.applyPreset(labelBg, {"spriteId":"labelBg","x":477.3103448275863,"y":389.4663223140496 + 100 + mapleDy,"scaleX":1.6200000000000006/2,"scaleY":1.6200000000000005/2,"anchorX":0.5,"anchorY":0.5,"rotation":0})
            Utils.applyPreset(labelBg, {"spriteId":"labelBg","x":477.3103448275863,"y":389.4663223140496 + 100 + mapleDy,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0})
            // labelBg.tint = 0x8a4910;
            // labelBg.tint = 0xf45725;
            // labelBg.tint = 0xa92900;
            // labelBg.tint = 0xff8902;
            res.push(labelBg);

            // let mapleLabel = new Label(game, maple.x, maple.y - 112, "" + forestType.cellsToSpawn, { font: "bold 44px Arial", fill: "#ffffff" });
            // let mapleLabel = new Label(game, maple.x, maple.y - 112, "" + forestType.cellsToSpawn, { font: "bold 44px Arial", fill: "#fbf983" });
            let mapleLabel = new Label(game, maple.x, maple.y - 112, "" + forestType.cellsToSpawn, { font: "bold 44px Arial", fill: "#ffe188" });
            mapleLabel.addStrokeColor("#924f15", 0);
            // mapleLabel.alpha = 0.7;
            mapleLabel.strokeThickness = 4;
            // Utils.applyPreset(mapleLabel, {"spriteId":"mapleLabel","x":476,"y":413.04999999999995,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0,"rotation":0,"fontSize":44})
            Utils.applyPreset(mapleLabel,   {"spriteId":"mapleLabel","x":477.3103448275862,"y":393.4663223140495+ 100 + mapleDy,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":44})
            mapleLabel.name = "mapleLabel";
            res.push(mapleLabel);

            let leafs1;
            let leafs2;
            res.push(leafs1 = SpriteUtils.createSprite(game, game.width/2, game.height/2+240 , 'leafs1', 'leafsMaple1'));
            res.push(leafs2 = SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafsMaple2'));
            // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_3'));
            // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_4'));
            leafs1.alpha = 0.76;
            leafs2.alpha = 0.76;

            Utils.applyPresetToArray(res, [{"spriteId":"leafsMaple1","x":567,"y":443.5 + mapleDy,"scaleX":0.5399999999999996,"scaleY":0.35999999999999943,"anchorX":0,"anchorY":0,"rotation":0.41000000000000014},
            {"spriteId":"leafsMaple2","x":485,"y":509.5 + mapleDy,"scaleX":0.3399999999999994,"scaleY":0.47999999999999954,"anchorX":0,"anchorY":0,"rotation":1.6200000000000012}])
        }

        if (forestType.darkStump && forestType.ladybugs) {
            let uniqueLadybugs = [...new Set(forestType.ladybugs)];
            uniqueLadybugs.forEach(l => {
                let position = cellProvider.calculateRelativePosition(l);
                let sprite = SpriteUtils.createSprite(game, cellProvider.calculateRealX(position.x, position.y), cellProvider.calculateRealY(position.x, position.y) - 60, "darkStump");
                sprite.anchor.set(0.5)
                // sprite.scale.set(0.8)
                res.push(sprite);
            })
        }
    }

    public static getBanner(env: Environment): string {
        //TODO make more banners

        switch (env) {
            case Environment.house:
                return 'banner2';
            case Environment.darkForest:
                // return 'banner3';
            case Environment.lake:
                // return 'banner4';
            case Environment.flowerFields:
                // return 'banner5';
            case Environment.forest:
            case Environment.jungles:
            default:
                return 'banner1';
                // throw new NeverError(env);
        }
    }

    public static getBg(env: Environment, forestType?: ForestType): string {
        switch (env) {
            case Environment.lake:
                return 'bgLake';
            case Environment.flowerFields:
                return 'bgLight';
            case Environment.house:
                return 'bgHouse';
            case Environment.darkForest:
                return 'bgDark';
            case Environment.forest:
            case Environment.jungles:
            default:
                if (ForestUtils.isCloverReskin(forestType)) {
                    return 'bgClover';
                }
                return 'bg';
                // throw new NeverError(env);
        }
    }

    public static applyBushesConfiguration(cellsProvider:CellsProvider, children: PIXI.DisplayObject[], configuration: number, forEditor?:boolean ){
        let bottomLayoutElements = ["bushes_2", "bushes_3", "bushes_5", "stoneBig",     "table", "leafs2_3", "leafs1_3", "leafs3_2", "flowersBig", "flowersBig2" ]; 
        let sideLayoutElements = ["bushes_1", "bushes_6", "bushes2_1", "bushes2_2",];

        let bushesValue = configuration || 0;
        if(bushesValue < LocationUtils.BUSHES_MAX_VALUE){
            children.forEach(c => {
                // console.log("applyBushesConfiguration: configuration " + configuration)
                if(c instanceof Phaser.Sprite){
                    if(bottomLayoutElements.indexOf(c.name) != -1){
                        // console.log("applyBushesConfiguration: at bottom")
                        if(bushesValue == 1 || bushesValue == 0 ) { 
                            c.visible = false;
                        }
                    } else if(sideLayoutElements.indexOf(c.name) != -1){
                        // console.log("applyBushesConfiguration: at side")
                        if(bushesValue == 2 || bushesValue == 0 ) { 
                            c.visible = false;
                        }
                    }
                }
            });
        }

        if(!cellsProvider.isAllCellsOnScreen){
            let maxCameraY = LocationUtils.getMaxCameraY(cellsProvider);
            
            children.forEach(c => {
                if(c instanceof Phaser.Sprite && bottomLayoutElements.indexOf(c.name) != -1){
                    c.visible = true;
                    c.y += maxCameraY;
                }
            });
        }

        if(forEditor){
            children.forEach(c => {
                if(c instanceof Phaser.Sprite && bottomLayoutElements.indexOf(c.name) != -1){
                    c.y -= 120;

                }
            });
        }
    }

    public static getMaxCameraY(cellsProvider:CellsProvider):number{
        let maxScrollRows = cellsProvider.getRowsCount() - BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL;
        return maxScrollRows*LocationUtils.getScrollStep(cellsProvider);
    }

    public static getScrollStep(cellsProvider:CellsProvider):number{
        let maxScrollRows = cellsProvider.getRowsCount() - BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL;
        return BaseCellsProvider.CELL_HEIGHT * BaseCellsProvider.HEIGHT_DELTA_RATIO + 50/maxScrollRows;
    }

}




