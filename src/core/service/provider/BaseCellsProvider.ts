import BiomType from '../../model/enum/BiomType';
import CellType from '../../model/enum/CellType';
import ForestUtils from '../../utils/ForestUtils';
import Utils from '../../utils/Utils';
import CellState from '../../model/forest/CellState';
import ForestCell from '../../model/forest/ForestCell';
import ForestType from '../../model/forest/ForestType';
import MaskCell from '../../model/forest/MaskCell';
import Movable from '../../model/forest/Movable';
import StripsPanel from '../../../view/component/dialog/StripsPanel';
import BaseScreen from "../../../view/screen/common/BaseScreen";
import SeparatorType from '../../model/enum/SeparatorType';
import { ContentType, ItemContents, InteractiveContents, AnimalsContents } from '../../model/enum/ContentType';
import LocationUtils from '../../utils/LocationUtils';
import Separator from '../../model/forest/Separator';
import Settings from '../Settings';

export default abstract class BaseCellsProvider {
    private game: Phaser.Game;
    private screen: BaseScreen;

    public static CELL_WIDTH = 120;
    public static CELL_HEIGHT =  127; //BaseCellsProvider.CELL_WIDTH / 150 * 158;
    public static HEIGHT_DELTA_RATIO = 0.766;

    // private bottomPanelHeight = 170;
    private bottomPanelHeight = 133;
    public static MAX_WIDTH = 7;
    public static MAX_HEIGHT_WITH_NO_SCROLL = 8;
    private visibleHeaderHeight;

    protected forestType: ForestType;
    private cells: ForestCell[];

    protected mask: MaskCell[] = [];
    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;


    public isAllCellsOnScreen: boolean = true;

    public containJelly: boolean = false;
    public containIce: boolean = false;
    public containAcorns: boolean = false;

    protected abstract generateCells(): ForestCell[];

    public constructor(forestType: ForestType, game: Phaser.Game) {
        this.game = game;
        this.forestType = forestType;

        this.visibleHeaderHeight = LocationUtils.getVisibleHeaderHeight(game, forestType);

        this.calculateMask(this.forestType);

        this.cells = this.generateCells();
    }

    public calculateMask(forestType:ForestType) {
        this.forestType = forestType;
        this.mask = [];
        let maskString = this.forestType.mask;
        while (maskString.indexOf(' ') >= 0) {
            maskString = maskString.replace(' ', '');
        }

        for (let i = 0; i < maskString.length; i++) {
            if (maskString[i] == "0") {
                continue;
            } else {
                if (maskString[i] == ForestUtils.getChar(CellType.COLD)) {
                    this.containIce = true;
                }
                if (maskString[i] == ForestUtils.getChar(CellType.JELLY)) {
                    this.containJelly = true;
                }

                if (maskString[i] == ForestUtils.getChar(CellType.ACORN)) {
                    this.containAcorns = true;
                }

                let leafType = maskString[i] == "w" ? "leaf5" : this.forestType.leafType;
                this.mask.push(new MaskCell(i % BaseCellsProvider.MAX_WIDTH, Math.floor(i / BaseCellsProvider.MAX_WIDTH), ForestUtils.getCellType(maskString[i]), leafType));
            }
        }

        this.maxX = this.getMask().map(cell => cell.X + (cell.Y + 1) % 2 * 0.5).sort((n1, n2) => n1 - n2)[this.getMask().length - 1];
        this.minX = this.getMask().map(cell => cell.X + (cell.Y + 1) % 2 * 0.5).sort((n1, n2) => n1 - n2)[0];
        this.maxY = this.getMask().map(cell => cell.Y).sort((n1, n2) => n1 - n2)[this.getMask().length - 1];
        this.minY = this.getMask().map(cell => cell.Y).sort((n1, n2) => n1 - n2)[0];

        // console.log("MinY: " + this.minY + "; maxY: " + this.maxY)
        // console.log(this.getMask())
        // console.log(this.getMask().map(cell => cell.y).sort())
    }

    public getCells(): ForestCell[] {
        return this.cells;
    }

    public getNotWaterCells(): ForestCell[] {
        return this.cells.filter(cell => ForestUtils.getBiom(cell.type) != BiomType.WATER);
    }

    public getCellWidth(): number {
        return BaseCellsProvider.CELL_WIDTH;
    }

    public getAdjucentInteractiveCount(cells: ForestCell[], cell: ForestCell): number {
        return cells.filter(otherCell => this.isInteractive(otherCell) && this.areAdjucent(cell, otherCell) &&
            !otherCell.state.opened).length;
    }

    public isInteractive(cell: ForestCell): boolean {
        return this.isInteractiveState(cell.state);
    }

    public isInteractiveState(cellState: CellState): boolean {
        return (cellState.content in ItemContents) || (cellState.content in InteractiveContents) || (cellState.content in AnimalsContents);
    }
    
    public areAdjucentAndNoSeparators(first: ForestCell, second: ForestCell): boolean {
        return this.areAdjucentAndNoSeparatorsForCoordinates(first, second.X, second.Y);
    }

    public areAdjucentAndNoSeparatorsForCoordinates(first: ForestCell, secondX: number, secondY: number): boolean {
        if (!this.areAdjucentCoordinates(first.X, first.Y, secondX, secondY)) {
            return false;
        }

        return !this.haveSeparatorsBetween(first, secondX, secondY);
    }

    public areAdjucent(first: ForestCell, second: ForestCell): boolean {
        return this.areAdjucentCoordinates(first.X, first.Y, second.X, second.Y);
    }

    public areAdjucentWithDelta(first: ForestCell, second: ForestCell, delta: number): boolean {
        return this.areAdjucentCoordinatesWithDelta(first.state.sprite.x, first.state.sprite.y,
            second.state.sprite.x, second.state.sprite.y, delta);
    }

    public areAdjucentCoordinatesWithDelta(firstX: number, firstY: number, secondX: number, secondY: number, delta: number): boolean {
        return Utils.dist(firstX, firstY, secondX, secondY) <= delta;
    }

    public areAdjucentCoordinates(firstX: number, firstY: number, secondX: number, secondY: number): boolean {
        if (Math.abs(firstY - secondY) == 1) {
            if (firstY % 2 == 0) {
                return secondX == firstX || secondX == firstX + 1;
            } else {
                return firstX == secondX || firstX == secondX + 1;
            }
        } else if (secondY == firstY) {
            return Math.abs(secondX - firstX) == 1;
        }
        return false;
    }

    public haveSeparatorsBetweenMaskCells(first: MaskCell, second: MaskCell):boolean {
        let separators = [];
        if (this.forestType.separators) {
            this.forestType.separators.forEach(s => {
                if (first.X == s.X && first.Y == s.Y) {
                    separators.push(s.type);
                }
            })
        }
        return this.doHaveSeparatorsBetween(first, separators, second.X, second.Y);
    }

    public haveSeparatorsBetween(first: ForestCell, secondX: number, secondY: number):boolean {
        return this.doHaveSeparatorsBetween(first, first.separators, secondX, secondY);
    }

    private doHaveSeparatorsBetween(first: {X:number, Y:number}, separators:SeparatorType[], secondX: number, secondY: number) {
        let haveSeparators = false;
        separators.forEach(s => {
            switch (s) {
                case SeparatorType.left:
                    haveSeparators = haveSeparators || (first.Y == secondY && first.X == secondX + 1);
                    break;
                case SeparatorType.lefttop:
                    let coord = this.getTopLeftCoordinates(first.X, first.Y);
                    haveSeparators = haveSeparators || (coord.x == secondX && coord.y == secondY);
                    break;
                case SeparatorType.leftbottom:
                    coord = this.getBottomLeftCoordinates(first.X, first.Y);
                    haveSeparators = haveSeparators || (coord.x == secondX && coord.y == secondY);
                    break;
                case SeparatorType.right:
                    haveSeparators = haveSeparators || (first.Y == secondY && first.X == secondX - 1);
                    break;
                case SeparatorType.righttop:
                    coord = this.getTopRightCoordinates(first.X, first.Y);
                    haveSeparators = haveSeparators || (coord.x == secondX && coord.y == secondY);
                    break;
                case SeparatorType.rightbottom:
                    coord = this.getBottomRightCoordinates(first.X, first.Y);
                    haveSeparators = haveSeparators || (coord.x == secondX && coord.y == secondY);
                    break;
            }
        })

        return haveSeparators;
    }


    public calculatePosition(cell: ForestCell): Phaser.Point {
        return new Phaser.Point(this.calculateX(cell), this.calculateY(cell));
    }

    public calculateX(cell: ForestCell): number {
        return this.calculateRealX(cell.X, cell.Y);
    }

    public calculateY(cell: ForestCell): number {
        return this.calculateRealY(cell.X, cell.Y);
    }

    public isOnSameLeftDiagonal(x1: number, y1: number, x2: number, y2: number) {
        if (y1 % 2 == y2 % 2) {
            return Math.floor((y1 - y2) / 2) == x1 - x2;
        }

        if (y1 % 2 == 0) {
            return Math.floor((y1 - y2) / 2) == x1 - x2;
        }
        return Math.floor((y2 - y1) / 2) == x2 - x1;

    }

    public isOnSameRightDiagonal(x1: number, y1: number, x2: number, y2: number) {
        if (y1 % 2 == y2 % 2) {
            return Math.floor((y1 - y2) / 2) == -(x1 - x2);
        }

        if (y1 % 2 == 0) {
            return Math.floor((y1 - y2) / 2) == -(x1 - x2) - 1;
        }
        return Math.floor((y2 - y1) / 2) == -(x2 - x1) - 1;
    }


    public calculateRelativePosition(order: number): Phaser.Point {
        let x = order % 7;
        if (x < 0) x += 7;
        let y = Math.floor(order / 7);
        return new Phaser.Point(x, y);
    }

    public calculateRelativeYByRealPosition(realX: number, realY: number) {
        let startRealY = this.calculateStartRealY();

        return Math.round((realY - startRealY) / (BaseCellsProvider.CELL_HEIGHT * BaseCellsProvider.HEIGHT_DELTA_RATIO) + this.minY);
    }

    public calculateRelativeXByRealPosition(realX: number, realY: number) {
        let y = this.calculateRelativeYByRealPosition(realX, realY);

        let startRealX = (this.game.width - (this.maxX - this.minX) * BaseCellsProvider.CELL_WIDTH) / 2;

        if (y % 2 == 0) {
            startRealX += BaseCellsProvider.CELL_WIDTH / 2;
        }

        return Math.round((realX - startRealX) / BaseCellsProvider.CELL_WIDTH + this.minX);
    }

    public calculateRealX(x: number, y: number): number {
        let startRealX = (this.game.width - (this.maxX - this.minX) * BaseCellsProvider.CELL_WIDTH) / 2;

        if (y % 2 == 0) {
            startRealX += BaseCellsProvider.CELL_WIDTH / 2;
        }

        return startRealX + (x - this.minX) * BaseCellsProvider.CELL_WIDTH;
    }

    public calculateRealY(x: number, y: number): number {
        let startRealY = this.calculateStartRealY();
        return startRealY + (y - this.minY) * (BaseCellsProvider.CELL_HEIGHT * BaseCellsProvider.HEIGHT_DELTA_RATIO);
    }

    public calculateStartRealY(): number {
        let fieldHeight = Math.min((this.maxY - this.minY + 1), BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL) * BaseCellsProvider.CELL_HEIGHT * BaseCellsProvider.HEIGHT_DELTA_RATIO;

        let halfOfEmptySpace =(this.game.height - this.visibleHeaderHeight - fieldHeight - this.bottomPanelHeight) / 2;

        //центрируем поле для длинных экранов
        let startY = Math.min(halfOfEmptySpace, 200) + this.visibleHeaderHeight;

        this.isAllCellsOnScreen =  this.maxY - this.minY + 1 <=  BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL ||
            startY + (this.maxY - this.minY + 1) * BaseCellsProvider.CELL_HEIGHT * BaseCellsProvider.HEIGHT_DELTA_RATIO < (this.game.height - this.bottomPanelHeight) 

        if(this.isAllCellsOnScreen){
            startY -= Math.max(0, 50 - halfOfEmptySpace);
        } else {
            startY += 10
        }

        return startY;
    }

    public getMask(): MaskCell[] {
        return this.mask;
    }

    // public isLongLevel(): boolean {
    //     return this.getRowsCount() > BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL;
    // }

    public getRowsCount(): number {
        return this.maxY - this.minY + 1;
    }

    public getColumnsCount(): number {
        return this.maxX - this.minX + 1;
    }

    //TODO used once, remove?
    public getCellByOrder(order: number): ForestCell {
        let pos = this.calculateRelativePosition(order);
        return this.cells.filter(cell => cell.X == pos.x && cell.Y == pos.y).shift();
    }

    public belongToBottomCellsCone(X: number, Y: number, cellToCheck: ForestCell): boolean {
        let dy = cellToCheck.Y - Y;
        let dx = cellToCheck.X - X;

        if (dy < 1) { return false }

        if (Y % 2 == 0) {
            if (dy % 2 == 0) {
                return Math.abs(dx) <= Math.abs(dy) / 2;
            } else {
                return -Math.floor(dy / 2) <= dx && dx <= Math.floor(dy / 2) + dy % 2;
            }
        } else {
            if (dy % 2 == 0) {
                return Math.abs(dx) <= Math.abs(dy) / 2;
            } else {
                return -Math.floor(dy / 2) - dy % 2 <= dx && dx <= Math.floor(dy / 2);
            }
        }
    }

    public getBottomCells(X: number, Y: number): ForestCell[] {
        return this.cells.filter(cell => {
            let res = this.areAdjucentCoordinates(X, Y, cell.X, cell.Y) && Y == cell.Y - 1
            // if(res){
            //     console.log("adjucent: (" + cell.X + ", " + cell.Y + "); " + cell.state.opened)
            // }
            return res
        })
    }
    public getBottomRightCoordinates(X: number, Y: number): Phaser.Point {
        return new Phaser.Point(X + (Y % 2 == 0 ? 1 : 0), Y + 1);
    }
    public getBottomLeftCoordinates(X: number, Y: number): Phaser.Point {
        return new Phaser.Point(X + (Y % 2 == 0 ? 1 : 0) - 1, Y + 1);
    }
    public getTopLeftCoordinates(X: number, Y: number): Phaser.Point {
        return new Phaser.Point(X + (Y % 2 == 0 ? 1 : 0) - 1, Y - 1);
    }
    public getTopRightCoordinates(X: number, Y: number): Phaser.Point {
        return new Phaser.Point(X + (Y % 2 == 0 ? 1 : 0), Y - 1);
    }

    public getForestType() {
        return this.forestType;
    }

    public getBottomOpenedCellsWithNoSeparators(x: number, y: number): ForestCell[] {
        return this.getBottomCells(x, y).filter(cell => cell.state.opened == true
            && !this.haveSeparatorsBetween(cell, x, y) && !ForestUtils.isOccupied(cell));
    }

    // public getBottomOpenedCells(x: number, y: number): ForestCell[] {
    //     return this.getBottomCells(x, y).filter(cell => cell.state.opened == true);
    // }

    public getCellByCoordinates(x: number, y: number): ForestCell {
        return this.cells.filter(cell => cell.X == x && cell.Y == y).shift();
    }

    public switchCellsByCircle(cells: ForestCell[], ladybugsToAdditionalMove?: Movable[], teleportDecoration?: boolean): void {
        if (cells.length == 0) {
            console.log("Can not switch cells: no cells provided!");
            return;
        }
        let firstState = cells[0].state;

        let bugsMoved = false;

        cells.forEach((cell, i) => {
            let lastCell = i == cells.length - 1;
            let next = lastCell ? cells[0] : cells[i + 1];

            cell.state = lastCell ? firstState : next.state;

            if (cell.state.sprite != null && cell.state.label != null) {
                // if((!this.isInteractive(cell) || cell.type == "w") && cell.state.sprite != null && cell.state.label != null){

                // if (cell.state.opened && teleportDecoration) {
                //     //TODO teleport decoration
                //     if (!(this.isInteractive(cell) && cell.state.opened)) {
                //         cell.state.sprite.x = this.calculateX(cell);
                //         cell.state.sprite.y = this.calculateY(cell);
                //         cell.state.sprite.scale.set(0);
                //         this.game.add.tween(cell.state.sprite.scale).to({
                //             x: 1, y: 1
                //         }, 1000, Phaser.Easing.Exponential.Out, true, 200, 0, false);
                //     }

                //     cell.state.label.x = this.calculateX(cell);
                //     cell.state.label.y = this.calculateY(cell);
                //     cell.state.label.scale.set(0);
                //     this.game.add.tween(cell.state.label).to({
                //         x: 1, y: 1
                //     }, 1000, Phaser.Easing.Exponential.Out, true, 200, 0, false);
                // } else {
                if (!(this.isInteractive(cell) && cell.state.opened)) {
                    this.game.add.tween(cell.state.sprite).to({
                        x: this.calculateX(cell), y: this.calculateY(cell),
                    }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);
                }
                this.game.add.tween(cell.state.label).to({
                    x: this.calculateX(cell), y: this.calculateY(cell),
                }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);
                // console.log("coverX: " + cell.state.cover.x + "; cellX: " + this.calculateX(cell))
                // }

                this.game.add.tween(cell.state.cover).to({
                    x: this.calculateX(cell), y: this.calculateY(cell),
                }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);

                if (ladybugsToAdditionalMove) {
                    let ladybug = ladybugsToAdditionalMove.filter(ladybug => ladybug.X == next.X && ladybug.Y == next.Y).shift();
                    if (ForestUtils.getBiom(cell.type) == BiomType.WATER && ladybug != null && !bugsMoved) {
                        if (ladybug.Y != cell.Y) {
                            console.log("water Y: " + ladybug.Y + " => " + cell.Y)
                        }
                        bugsMoved = true;
                        ladybug.X = cell.X;
                        ladybug.Y = cell.Y;

                        this.game.add.tween(ladybug.sprite).to({
                            x: this.calculateX(cell), y: this.calculateY(cell),
                        }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);
                    }
                }
            }
        });
    }
}