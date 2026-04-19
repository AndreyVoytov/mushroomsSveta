import BiomType from '../../model/enum/BiomType';
import CellType from '../../model/enum/CellType';
import { ContentType } from '../../model/enum/ContentType';
import SeparatorType from '../../model/enum/SeparatorType';
import CellState from './CellState';
import Game from './../../../view/game/Game';
export default class ForestCell {
    X: number;
    Y: number;
    type: CellType;
    biomType: BiomType;
    occupiedByFlower: boolean = false;
    state: CellState;
    bg: Phaser.Sprite;
    bgShadow: Phaser.Sprite;
    separators: SeparatorType[] = [];
    hiveAnchor: ForestCell;
    hiveGroupCells: ForestCell[];
    hiveOutput: number = 1;
    hiveImage: string;

    constructor(X: number, Y: number, content: ContentType, type: CellType, biomType: BiomType, leafType: string, metaValue?: string) {
        this.type = type;
        this.X = X;
        this.Y = Y;
        this.state = new CellState(content, leafType, metaValue);
        this.biomType = biomType;
    }

    public static getImage(content: string): string {
        if (content && content.startsWith("bush")) {
            return "bush"
        } else if (content && content.startsWith("hive")) {
            return "hive";
        }

        return content;
    }

    //! does not work with flowers. For tutorial.
    public orderAndBringToTop() {
        this.bg.bringToTop();
        if (this.state.sprite) {
            this.state.sprite.bringToTop();
        }
        this.state.label.bringToTop();
        if (this.state.cover) {
            Game.getInstance().world.bringToTop(this.state.cover);
        }
    }
}




