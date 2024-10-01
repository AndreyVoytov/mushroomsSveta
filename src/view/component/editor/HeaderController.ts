import Environment from '../../../core/model/enum/Environment';
import EditorImageControlPanel from './EditorImageControlPanel';
import ForestType from '../../../core/model/forest/ForestType';
import NeverError from '../../../core/utils/NeverError';
import EditorScreen from '../../screen/EditorScreen';
import LeafController from './LeafController';
export default class HeaderController extends EditorImageControlPanel {

    private leafController: LeafController;

    constructor(game: Phaser.Game, screen: EditorScreen, x: number, y: number, forestType: ForestType, leafController: LeafController){
        super(game, screen, x, y, HeaderController.getOption(forestType));
        this.leafController = leafController;
    }

    protected getOptions():string[]{
        return ["envMountines", "envHome", "envForest", "envDarkForest", "envFlowerFields", "envLake"]
    };

    //TODO leaf брать из leafPanel
    protected applyOption(option:string):void{
        if(option == "envMountines"){
            this.screen.forestType.header = "mountinesHeader";
            this.screen.forestType.leafType = this.leafController.choosenOption;
            this.screen.forestType.environment = Environment.forest;
        } else if(option == "envHome"){
            this.screen.forestType.header = null;
            this.screen.forestType.leafType = "hexChest";
            this.screen.forestType.environment = Environment.house;
        }  else if(option == "envForest"){
            this.screen.forestType.header = null;
            this.screen.forestType.leafType = this.leafController.choosenOption;
            this.screen.forestType.environment = Environment.forest;
        }  else if(option == "envDarkForest"){
            this.screen.forestType.header = null;
            this.screen.forestType.leafType = this.leafController.choosenOption;
            this.screen.forestType.environment = Environment.darkForest;
        }  else if(option == "envFlowerFields"){
            this.screen.forestType.header = null;
            this.screen.forestType.leafType = this.leafController.choosenOption;
            this.screen.forestType.environment = Environment.flowerFields;
        }  else if (option == "envLake"){
            this.screen.forestType.header = null;
            this.screen.forestType.leafType = this.leafController.choosenOption;
            this.screen.forestType.environment = Environment.lake;
        }
    };

    protected static getOption(forestType: ForestType):string{
        switch(forestType.environment){
            case Environment.forest:
                if(forestType.header == "mountinesHeader"){
                    return "envMountines";
                } 
                return "envForest";
            case Environment.darkForest:
                return "envDarkForest";
            case Environment.flowerFields:
                return "envFlowerFields";
            case Environment.house:
                return "envHome";
            case Environment.lake:
                return "envLake";
            case Environment.jungles:
                return "envJungle";
            case Environment.bugForest:
                return "envBugForest";
            case Environment.snailForest:
                return "envSnailForest";
            default:
                throw new NeverError(forestType.environment);
        }
    }
}