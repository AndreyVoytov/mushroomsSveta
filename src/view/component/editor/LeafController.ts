import Environment from '../../../core/model/enum/Environment';
import EditorImageControlPanel from './EditorImageControlPanel';
export default class LeafController extends EditorImageControlPanel {

    protected getOptions():string[]{
        return ["leaf1", "leaf3", "leaf4"]
    };
    protected applyOption(option:string):void{
        if(this.screen.forestType.environment != Environment.house){
            this.screen.forestType.leafType = option;
        }
        // this.screen.forestType.environment = this.getEnvironment(option);
    };

    // private getEnvironment(leafType: string): Environment {
    //     if (leafType == "hexChest") {
    //         return Environment.house;
    //     } else {
    //         // if (this.cellCovers.filter(c => c.cellType == CellType.MOUNTAIN).length > 0) {
    //         //     return Environment.mountaines;
    //         // }
    //         return Environment.forest;
    //     }
    // }
}