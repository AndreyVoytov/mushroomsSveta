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
import Utils from './Utils';
import BaseForestScreen from '../../view/screen/BaseForestScreen';
import CellsProvider from '../service/provider/CellsProvider';
import BaseCellsProvider from '../service/provider/BaseCellsProvider';
import Game from '../../view/game/Game';
import Settings from '../service/Settings';
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
    public static getMiniGameLayout(game: Phaser.Game, cellProvider:CellsProvider,  forestType:ForestType): (Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText)[] {
        let environment = forestType.environment;

        let res: (Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText)[] = [];
        switch (environment) {
            case Environment.lake:
                let background = SpriteUtils.createTileSprite(game, 0, 0, game.width, game.height * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER, "bgLake");
                background.inputEnabled = true;
                res.push(background);
                
                res.push(SpriteUtils.createSprite(game, 500, 500, 'grassLight', 'grassLight2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'lakeHeaderDecor', "lakeDecor"));
                
                let visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);
                let headerImage = forestType.header || "lakeHeader";
                
                let forestHeader = SpriteUtils.createSprite(game, 0, -this.getHeaderHeight(forestType) +visibleHeaderHeight, headerImage);
                res.push(forestHeader);
                
                this.addMaple(game, cellProvider, forestType, res);
                let bushes2_1;
                let bushes2_2;

                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_1'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_3'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_5'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_6'));
                res.push(bushes2_1 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_1'));
                res.push(bushes2_2 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'stoneBig', 'stoneBig'));

                Utils.applyPresetToArray(res, [
                {"spriteId":"grassLight2","x":968.655172413793,"y":443.32024793388393+9 +forestHeader.y,"scaleX":-1.1200000000000012,"scaleY":1.12,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_1","x":-75.44827586206895,"y":372.5444214876032+9 +forestHeader.y,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_2","x":-79.68965517241378,"y":game.height - 1603 +1552.7086776859508,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":-1.6300000000000012},
                // {"spriteId":"bushes_2","x":-79.68965517241378,"y":game.height - 1603 +1165.7086776859508,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_3","x":1029.655172413793,"y":game.height - 1603 +1654.2262396694216,"scaleX":1.1193085391409658/1.5,"scaleY":-1.215549138817601/1.5,"anchorX":0,"anchorY":0,"rotation":-1.2957241379310345},

                {"spriteId":"bushes_5","x":51.10344827586215,"y":game.height - 1603 +1528.0030991735537,"scaleX":0.9526620689655171/1.5,"scaleY":0.9753697382630554/1.5,"anchorX":0,"anchorY":0,"rotation":-1.0645517241379308},
                {"spriteId":"bushes_6","x":1036.8275862068967,"y":723.3667355371903+9 +forestHeader.y,"scaleX":-0.9335928190577711/1.5,"scaleY":-0.9728640006285858/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"bushes_5","x":53.10344827586215,"y":game.height - 1603 +1482.0030991735537,"scaleX":0.9526620689655171,"scaleY":0.9753697382630554,"anchorX":0,"anchorY":0,"rotation":-1.264551724137931},
                // {"spriteId":"bushes_6","x":1004.8275862068966,"y":753.3667355371903,"scaleX":-0.9335928190577711,"scaleY":-0.9728640006285858,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes2_1","x":1004.6551724137929,"y":1029.7975206611575,"scaleX":-0.9200000000000012,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.4200000000000002},
                {"spriteId":"bushes2_2","x":-29.655172413793025,"y":965.3336776859505,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"stoneBig","x":-3.1724137931034875,"y":game.height - 1603 +1394.0516528925618,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"lakeDecor","x":-3,"y":587,"scaleX":19.31999999999989,"scaleY":18.379999999999928,"anchorX":0,"anchorY":0,"rotation":0}
                {"spriteId":"lakeDecor","x":-3,"y":forestHeader.y + forestHeader.height - 100,"scaleX":19.31999999999989,"scaleY":18.379999999999928,"anchorX":0,"anchorY":0,"rotation":0}
                ]);

                if(game.height < 1600){
                    bushes2_1.visible = false;
                    bushes2_2.visible = false;
                } else {
                    bushes2_1.y = 835 + Utils.random(game.height - (1600 - 1267) - 835);
                    bushes2_2.y = 914 + Utils.random(game.height - (1600 - 1105) - 914);
                }

                if(forestType.header){
                    res.forEach(s => {
                        if(s.name == "bushes_1" || s.name == "bushes_6"){
                            s.x = game.width - s.x;
                            s.scale.set(-s.scale.x, s.scale.y);
                        }
                    })
                }

                break;
            case Environment.darkForest:

                background = SpriteUtils.createTileSprite(game, 0, 0, game.width, game.height * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER, "bgDark");
                background.inputEnabled = true;
                res.push(background);
                
                res.push(SpriteUtils.createSprite(game, 500, 500, 'grassDark', 'grassLight2'));
                
                visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);
                headerImage = forestType.header || "forestHeader2";

                forestHeader = SpriteUtils.createSprite(game, 0, -this.getHeaderHeight(forestType) +visibleHeaderHeight, headerImage);
                res.push(forestHeader);

                
                if(Game.CAN_USE_WEBP && Settings.USE_WEBP_ATLASES){
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_1'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_2'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_3'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_4'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_5'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_6'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_7'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_8'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_9'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_10'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_11'));
                }

                res.push(SpriteUtils.createSprite(game, 500, 500, 'fog', 'fog_1'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'fog', 'fog_2'));

                this.addMaple(game, cellProvider, forestType, res);
                
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushDark', 'bushes_1'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushDark', 'bushes_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushDark', 'bushes_3'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushDark', 'bushes_5'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushDark', 'bushes_6'));

                
                
                // res.push(bushes2_1 = SpriteUtils.createSprite(game, 500, 500, 'bushDark2', 'bushes2_1'));
                // res.push(bushes2_2 = SpriteUtils.createSprite(game, 500, 500, 'bushDark2', 'bushes2_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'stoneBig', 'stoneBig'));

                Utils.applyPresetToArray(res, [
                // {"spriteId":"grassLight2","x":941.655172413793,"y":443.32024793388393,"scaleX":-1.0200000000000011,"scaleY":1.12,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_1","x":720.1379310344828,"y":958.7097107438012,"scaleX":3.160000000000002,"scaleY":2.9000000000000017,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_2","x":651.1724137931035,"y":858.2221074380165,"scaleX":2.4400000000000013,"scaleY":3.380000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_3","x":447.1034482758621,"y":1188.3243801652895,"scaleX":-3.380000000000003,"scaleY":3.8000000000000025,"anchorX":0,"anchorY":0,"rotation":0.26000000000000006},
                {"spriteId":"flowersBg_4","x":461.93103448275883,"y":1274.572314049587,"scaleX":3.220000000000002,"scaleY":4.679999999999988,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_5","x":193.79310344827593,"y":572.8636363636364,"scaleX":2.6600000000000015,"scaleY":3.340000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_6","x":536.4137931034481,"y":498.352272727273,"scaleX":3.140000000000002,"scaleY":2.7200000000000015,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_7","x":1.7931034482757866,"y":796.422520661157,"scaleX":2.4200000000000013,"scaleY":3.020000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_8","x":634.5962005942196,"y":1650.2857998788902,"scaleX":3.220000000000002,"scaleY":2.8400000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_9","x":233.62068965517244,"y":447.74380165289244,"scaleX":2.280000000000001,"scaleY":1.5800000000000005,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_10","x":88.32015845862969,"y":1418.5383819904644,"scaleX":3.6000000000000023,"scaleY":2.8000000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_11","x":326.62068965517244,"y":851.4700413223139,"scaleX":3.240000000000002,"scaleY":3.9000000000000026,"anchorX":0,"anchorY":0,"rotation":0},

                {"spriteId":"bushes_1","x":-75.44827586206895,"y":372.5444214876032 +50+9 +forestHeader.y,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_2","x":-79.68965517241378,"y":game.height - 1603 +1552.7086776859508,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":-1.6300000000000012},
                {"spriteId":"bushes_5","x":51.10344827586215,"y":game.height - 1603 +1528.0030991735537,"scaleX":0.9526620689655171/1.5,"scaleY":0.9753697382630554/1.5,"anchorX":0,"anchorY":0,"rotation":-1.0645517241379308},
                {"spriteId":"bushes_6","x":1036.8275862068967,"y":723.3667355371903+50+9 +forestHeader.y,"scaleX":-0.9335928190577711/1.5,"scaleY":-0.9728640006285858/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_3","x":1029.655172413793,"y":game.height - 1603 +1654.2262396694216,"scaleX":1.1193085391409658/1.5,"scaleY":-1.215549138817601/1.5,"anchorX":0,"anchorY":0,"rotation":-1.2957241379310345},
                {"spriteId":"bushes2_1","x":1004.6551724137929,"y":1029.7975206611575,"scaleX":-0.9200000000000012,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.4200000000000002},
                {"spriteId":"bushes2_2","x":-29.655172413793025,"y":965.3336776859505,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"stoneBig","x":-3.1724137931034875,"y":game.height - 1603 +1394.0516528925618,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"fog_1","x":693.4827586206895,"y":584.0640495867768+9 +forestHeader.y,"scaleX":4.520000000000003,"scaleY":-6.520000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"fog_2","x":-82,"y":383+9 +forestHeader.y,"scaleX":5.080000000000004,"scaleY":5.580000000000004,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"grassLight2","x":-1.3103448275862775,"y":464.34400826446245+9 +forestHeader.y,"scaleX":1.04,"scaleY":1.12,"anchorX":0,"anchorY":0,"rotation":0}
                ]);

                res.forEach(s => {
                    if(s.name == "bushes_2" || s.name == "bushes_5" || s.name =="stoneBig" || s.name == "bushes_3"){
                        s.y += 30;
                    } else if (s.name && (<string>s.name).startsWith("flowersBg")){
                        s.alpha = 0.4;
                        s.tint = 0x111111;
                    } else if (s.name && (<string>s.name).startsWith("fog")){
                        s.alpha = 0.5;
                        let delay =0;
                        game.time.events.add(100, ()=>{
                            game.add.tween(s).to({x: s.x + 50}, 6000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.InOut, true, delay, -1, true)
                            delay += 3000;
                        })
                    }
                })

                break;
            case Environment.flowerFields:
                background = SpriteUtils.createTileSprite(game, 0, 0, game.width, game.height * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER, "bgLight");
                background.inputEnabled = true;
                res.push(background);
                
                visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);
                headerImage = forestType.header || "flowersFieldHeader";

                forestHeader = SpriteUtils.createSprite(game, 0, -this.getHeaderHeight(forestType) +visibleHeaderHeight, headerImage);
                res.push(forestHeader);

                this.addMaple(game, cellProvider, forestType, res);

                if(Game.CAN_USE_WEBP && Settings.USE_WEBP_ATLASES){
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_1'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_1'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_2'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_3'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_4'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_5'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_6'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_7'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_8'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_9'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_10'));
                }
                
                // res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_1'));
                // res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_3'));
                // res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_5'));
                // res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_6'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_5'));
                // res.push(bushes2_1 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_1'));
                // res.push(bushes2_2 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBig', 'flowersBig2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBig', 'flowersBig'));
                // res.push(SpriteUtils.createSprite(game, 500, 500, 'stoneBig', 'stoneBig'));

                Utils.applyPresetToArray(res, [
                {"spriteId":"grassLight2","x":941.655172413793,"y":443.32024793388393,"scaleX":-1.0200000000000011,"scaleY":1.12,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_1","x":720.1379310344828,"y":958.7097107438012,"scaleX":3.160000000000002,"scaleY":2.9000000000000017,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_2","x":651.1724137931035,"y":858.2221074380165,"scaleX":2.4400000000000013,"scaleY":3.380000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_3","x":447.1034482758621,"y":1188.3243801652895,"scaleX":-3.380000000000003,"scaleY":3.8000000000000025,"anchorX":0,"anchorY":0,"rotation":0.26000000000000006},
                {"spriteId":"flowersBg_4","x":461.93103448275883,"y":1274.572314049587,"scaleX":3.220000000000002,"scaleY":4.679999999999988,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_5","x":193.79310344827593,"y":572.8636363636364,"scaleX":2.6600000000000015,"scaleY":3.340000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_6","x":536.4137931034481,"y":498.352272727273,"scaleX":3.140000000000002,"scaleY":2.7200000000000015,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_7","x":1.7931034482757866,"y":796.422520661157,"scaleX":2.4200000000000013,"scaleY":3.020000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_8","x":634.5962005942196,"y":1650.2857998788902,"scaleX":3.220000000000002,"scaleY":2.8400000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_9","x":233.62068965517244,"y":447.74380165289244,"scaleX":2.280000000000001,"scaleY":1.5800000000000005,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_10","x":88.32015845862969,"y":1418.5383819904644,"scaleX":3.6000000000000023,"scaleY":2.8000000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"bushes_1","x":-11.448275862068954,"y":415.5444214876032,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"bushes_2","x":-72.68965517241378,"y":game.height - 1603 +1165.7086776859508,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_3","x":813.0000000000007,"y":game.height - 1603 +1673.1632231404972,"scaleX":1/1.5,"scaleY":1.1600000000000001/1.5,"anchorX":0,"anchorY":0,"rotation":4.0477241379309925},
                // {"spriteId":"bushes_5","x":53.10344827586215,"y":game.height - 1603 +1482.0030991735537,"scaleX":0.9526620689655171,"scaleY":0.9753697382630554,"anchorX":0,"anchorY":0,"rotation":-1.264551724137931},
                // {"spriteId":"bushes_6","x":1004.8275862068966,"y":753.3667355371903,"scaleX":-0.9335928190577711,"scaleY":-0.9728640006285858,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"bushes2_1","x":1004.6551724137929,"y":1029.7975206611575,"scaleX":-0.9200000000000012,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.4200000000000002},
                // {"spriteId":"bushes2_2","x":-29.655172413793025,"y":965.3336776859505,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"stoneBig","x":-3.1724137931034875,"y":game.height - 1603 +1394.0516528925618,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBig","x":830.0000000000007,"y":game.height - 1603 +1518.1632231404972,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":4.307724137930987},
                {"spriteId":"flowersBig2","x":119.31034482758619,"y":game.height - 1603 +1326.3398760330583,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.7100000000000004},
                {"spriteId":"bushes_5","x":-97.51724137931036,"y":game.height - 1603 +1369.3956611570247,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":-0.49000000000000027}
                ]);

                // if(game.height < 1600){
                    // bushes2_1.visible = false;
                    // bushes2_2.visible = false;
                // } else {
                //     bushes2_1.y = 835 + Utils.random(game.height - (1600 - 1267) - 835);
                //     bushes2_2.y = 914 + Utils.random(game.height - (1600 - 1105) - 914);
                // }

                
                // res.forEach(s => {
                //     if(s.name == "bushes_1" || s.name == "bushes_6"){
                //         s.visible = false;
                //         // s.y += 50;
                //         // if(s.x < game.width/2) s.x -= 50;
                //         // if(s.x > game.width/2) s.x += 50;
                //     } 
                // });

                break;
            case Environment.house:
                let background2 = SpriteUtils.createTileSprite(game, 0, 0, game.width, game.height * 3, "bgHouse");
                background2.inputEnabled = true;
                res.push(background2);

                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_1'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_2'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_3'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_4'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_5'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_6'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'crack', 'crack_7'));

                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_1'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_2'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_3'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+240, 'leafs1', 'leafs1_4'));

                // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs2', 'leafs2_1'));
                // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs2', 'leafs2_2'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs2', 'leafs2_3'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs2', 'leafs2_4'));

                // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs3', 'leafs3_1'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs3', 'leafs3_2'));
                // res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs3', 'leafs3_3'));
                res.push(SpriteUtils.createSprite(game, game.width/2, game.height/2+440, 'leafs3', 'leafs3_4'));
                
                res.push(SpriteUtils.createSprite(game, 0, 0, 'carpet', 'carpet'));

                let decor2 = SpriteUtils.createSprite(game, 0, game.height, 'table', 'table');
                decor2.anchor.set(0, 1);
                res.push(decor2);

                Utils.applyPresetToArray(res, [
                    {"spriteId":"crack_6","x":551.5792082816944,"y":1450.7781462954908,"scaleX":-2.0000000000000018,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_7","x":812.0597798352406,"y":1559.0184649762475,"scaleX":0.7199999999999998,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_5","x":92.68965517241372,"y":383.69628099173565,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_4","x":742.5517241379312,"y":485.0237603305785,"scaleX":-0.760000000000001,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_3","x":860.6896551724137,"y":702.6466942148762,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_1","x":779.5862068965515,"y":1128.8925619834713,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"crack_2","x":159.9655172413793,"y":1128.236570247934,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"leafs2_4","x":87.72413793103442,"y":279.3688016528924,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"leafs1_1","x":-77.79310344827582,"y":278.08780991735546,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":-3.469446951953614e-18},
                    {"spriteId":"leafs1_4","x":714.896551724138,"y":452.2985537190083,"scaleX":1.059990107015458,"scaleY":0.9932746877347858,"anchorX":0,"anchorY":0,"rotation":-1.5558620689655172},
                    {"spriteId":"leafs3_4","x":898.5517241379312,"y":game.height - 1603 +616.6559917355371,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":-1.689999999999999},
                    {"spriteId":"leafs2_3","x":885.51724137931,"y":game.height - 1603 +1301.1157024793388,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.9300000000000006},
                    {"spriteId":"leafs1_3","x":635.5862068965517,"y":game.height - 1603 + 1263.4028925619843,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.2672413793103367},
                    {"spriteId":"leafs3_2","x":441.9310344827587,"y":game.height - 1603 + 1433.5309917355369,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"leafs1_2","x":-208.03448275862075,"y":game.height - 1603 +1086.7241735537189,"scaleX":0.96,"scaleY":0.8599999999999999,"anchorX":0,"anchorY":0,"rotation":-0.8600000000000007},
                    {"spriteId":"leafs2_2","x":86.0689655172414,"y":game.height - 1603 + 900.3657024793388,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":1.9400000000000013},
                    {"spriteId":"carpet","x":116,"y":119,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                    {"spriteId":"table","x":0,"y":game.height - 1603 + 1598,"scaleX":1.08,"scaleY":1.1400000000000001,"anchorX":0,"anchorY":1,"rotation":0},
                ]);
                
                
                break;

            case Environment.forest:
            case Environment.jungles:
            default:
                
                background = SpriteUtils.createTileSprite(game, 0, 0, game.width, game.height * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER, "bg");
                background.inputEnabled = true;
                res.push(background);
                
                res.push(SpriteUtils.createSprite(game, 500, 500, 'grassLight', 'grassLight2'));
                
                visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);
                headerImage = forestType.header || "forestHeader1";

                forestHeader = SpriteUtils.createSprite(game, 0, -this.getHeaderHeight(forestType) +visibleHeaderHeight, headerImage);
                res.push(forestHeader);

                this.addMaple(game, cellProvider,  forestType, res);

                if(Game.CAN_USE_WEBP && Settings.USE_WEBP_ATLASES){
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_1'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_2'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_3'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_4'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_5'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_6'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_7'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_8'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_9'));
                    res.push(SpriteUtils.createSprite(game, 500, 500, 'flowersBg', 'flowersBg_10'));
                }
                
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_1'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_3'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_5'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'bushes', 'bushes_6'));
               
                res.push(bushes2_1 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_1'));
                res.push(bushes2_2 = SpriteUtils.createSprite(game, 500, 500, 'bushes2', 'bushes2_2'));
                res.push(SpriteUtils.createSprite(game, 500, 500, 'stoneBig', 'stoneBig'));

                Utils.applyPresetToArray(res, [
                {"spriteId":"grassLight2","x":968.655172413793,"y":443.32024793388393+9 +forestHeader.y,"scaleX":-1.1200000000000012,"scaleY":1.12,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_1","x":720.1379310344828,"y":958.7097107438012,"scaleX":3.160000000000002,"scaleY":2.9000000000000017,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_2","x":651.1724137931035,"y":858.2221074380165,"scaleX":2.4400000000000013,"scaleY":3.380000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_3","x":447.1034482758621,"y":1188.3243801652895,"scaleX":-3.380000000000003,"scaleY":3.8000000000000025,"anchorX":0,"anchorY":0,"rotation":0.26000000000000006},
                {"spriteId":"flowersBg_4","x":461.93103448275883,"y":1274.572314049587,"scaleX":3.220000000000002,"scaleY":4.679999999999988,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_5","x":193.79310344827593,"y":572.8636363636364,"scaleX":2.6600000000000015,"scaleY":3.340000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_6","x":536.4137931034481,"y":498.352272727273,"scaleX":3.140000000000002,"scaleY":2.7200000000000015,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_7","x":1.7931034482757866,"y":796.422520661157,"scaleX":2.4200000000000013,"scaleY":3.020000000000002,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_8","x":634.5962005942196,"y":1650.2857998788902,"scaleX":3.220000000000002,"scaleY":2.8400000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_9","x":233.62068965517244,"y":447.74380165289244,"scaleX":2.280000000000001,"scaleY":1.5800000000000005,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"flowersBg_10","x":88.32015845862969,"y":1418.5383819904644,"scaleX":3.6000000000000023,"scaleY":2.8000000000000016,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_1","x":-75.44827586206895,"y":372.5444214876032+9 +forestHeader.y,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_2","x":-79.68965517241378,"y":game.height - 1603 +1552.7086776859508,"scaleX":1/1.5,"scaleY":1/1.5,"anchorX":0,"anchorY":0,"rotation":-1.6300000000000012},
                // {"spriteId":"bushes_2","x":-79.68965517241378,"y":game.height - 1603 +1165.7086776859508,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes_3","x":1029.655172413793,"y":game.height - 1603 +1654.2262396694216,"scaleX":1.1193085391409658/1.5,"scaleY":-1.215549138817601/1.5,"anchorX":0,"anchorY":0,"rotation":-1.2957241379310345},

                {"spriteId":"bushes_5","x":51.10344827586215,"y":game.height - 1603 +1528.0030991735537,"scaleX":0.9526620689655171/1.5,"scaleY":0.9753697382630554/1.5,"anchorX":0,"anchorY":0,"rotation":-1.0645517241379308},
                {"spriteId":"bushes_6","x":1036.8275862068967,"y":723.3667355371903+9 +forestHeader.y,"scaleX":-0.9335928190577711/1.5,"scaleY":-0.9728640006285858/1.5,"anchorX":0,"anchorY":0,"rotation":0},
                // {"spriteId":"bushes_5","x":53.10344827586215,"y":game.height - 1603 +1482.0030991735537,"scaleX":0.9526620689655171,"scaleY":0.9753697382630554,"anchorX":0,"anchorY":0,"rotation":-1.264551724137931},
                // {"spriteId":"bushes_6","x":1004.8275862068966,"y":753.3667355371903,"scaleX":-0.9335928190577711,"scaleY":-0.9728640006285858,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"bushes2_1","x":1004.6551724137929,"y":1029.7975206611575,"scaleX":-0.9200000000000012,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.4200000000000002},
                {"spriteId":"bushes2_2","x":-29.655172413793025,"y":965.3336776859505,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                {"spriteId":"stoneBig","x":-3.1724137931034875,"y":game.height - 1603 +1394.0516528925618,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0}
                ]);

                if(game.height < 1600){
                    bushes2_1.visible = false;
                    bushes2_2.visible = false;
                } else {
                    bushes2_1.y = 835 + Utils.random(game.height - (1600 - 1267) - 835);
                    bushes2_2.y = 914 + Utils.random(game.height - (1600 - 1105) - 914);
                }

                if(forestType.header){
                    res.forEach(s => {
                        if(s.name == "bushes_1" || s.name == "bushes_6"){
                            s.x = game.width - s.x;
                            s.scale.set(-s.scale.x, s.scale.y);
                        }
                    })
                }

                break;
                // throw new NeverError(environment);
        }
        return res;
    }

    private static addMaple(game:Phaser.Game, cellProvider:CellsProvider, forestType:ForestType, res:(Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText)[]):void{
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

    public static getBg(env: Environment): string {
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




