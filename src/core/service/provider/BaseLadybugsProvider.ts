import CellType from "../../model/enum/CellType";
import Movable from '../../model/forest/Movable';
import BaseScreen from "../../../view/screen/common/BaseScreen";
import ForestCell from '../../model/forest/ForestCell';
import BaseCellsProvider from './BaseCellsProvider';
import CellsPainter from './CellsPainter';
import { ContentType } from "../../model/enum/ContentType";
import Sprite from "../../utils/SpriteUtils";
import SpriteUtils from "../../utils/SpriteUtils";
import ForestType from "../../model/forest/ForestType";
import Environment from "../../model/enum/Environment";

export default class BaseLadybugsProvider {
    public offsetY = 0;
    protected game: Phaser.Game;
    private _screen: BaseScreen;
    protected cellsProvider: CellsPainter;
    protected ladybugsAndAcorns: Movable[] = [];

    public constructor(game: Phaser.Game, screen: BaseScreen, cellsProvider: CellsPainter) {
        this.game = game;
        this._screen = screen;
        this.cellsProvider = cellsProvider;
    }

    public generateLadybugsAndAcorns(acorns?: ForestCell[]): void {
        this.ladybugsAndAcorns.forEach(l => { l.sprite.visible = false; l.sprite.destroy() })
        this.ladybugsAndAcorns = [];

        let forestType = this.cellsProvider.getForestType();

        (forestType.ladybugs || []).forEach((value, i) => {
            let position = this.cellsProvider.calculateRelativePosition(value);
            let sprite = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateRealX(position.x, position.y), this.cellsProvider.calculateRealY(position.x, position.y) + this.offsetY, this.getLadybugImage(forestType, i));
            sprite.anchor = new Phaser.Point(0.5, 0.5);
            sprite.width = BaseCellsProvider.CELL_WIDTH;
            sprite.height = BaseCellsProvider.CELL_HEIGHT;
            if(forestType.darkStump){
                sprite.scale.set(0)
            }
            this._screen.add.existing(sprite);
            this.ladybugsAndAcorns.push(new Movable(position.x, position.y, sprite, true));
        });

        if (acorns) {
            acorns.forEach(a => {
                this.ladybugsAndAcorns.push(new Movable(a.X, a.Y, a.state.sprite, false));
                this._screen.add.existing(a.state.sprite);
                a.state.sprite.bringToTop();
                a.state.sprite = SpriteUtils.createSprite(this.game, 0, 0, ContentType[ContentType.mushroom]);
                a.state.content = ContentType.empty;
                a.type = CellType.FOREST;
                a.state.opened = true;
            });

        }
    }

    private getLadybugImage(forestType:ForestType, index:number):string{
        if(forestType.environment == Environment.darkForest && forestType.ladybugs){
            if(forestType.ladybugs.length == 1){
                return "bug3"
            } else if(forestType.ladybugs.length == 2){
                return index == 0? "bug1" : "bug2";
            } else {
                return "bug" + this.bugsOrder[index];
            }           
        } 
        return "ladybug";
    }
    private bugsOrder = [1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1];

    public getLadybugs(): Movable[] {
        return this.ladybugsAndAcorns;
    }

    public getTrueLadybugs(): Movable[] {
        return this.ladybugsAndAcorns.filter(l => l.isLadybug);
    }

}