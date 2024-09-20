import BaseScreen from "../../../view/screen/common/BaseScreen";
import Utils from '../../utils/Utils';
import Flower from '../../model/forest/Flower';
import FlowerType from '../../model/forest/FlowerType';
import ForestAim from '../../model/forest/ForestAim';
import ForestCell from '../../model/forest/ForestCell';
import BaseCellsProvider from './BaseCellsProvider';
import SpriteUtils from "../../utils/SpriteUtils";
import { Easing } from "phaser-ce";
import ForestUtils from "../../utils/ForestUtils";
import Settings from "../Settings";

export default class FlowersProvider {
    private game: Phaser.Game;
    private screen: BaseScreen;
    private cellsProvider: BaseCellsProvider;
    public flowersCollected: number = 0;

    public flowers: Flower[] = [];

    public constructor(game: Phaser.Game, screen: BaseScreen, cellsProvider: BaseCellsProvider) {
        this.game = game;
        this.screen = screen;
        this.cellsProvider = cellsProvider;
    }

    public refreshFlowers(flowerAim: ForestAim): void {
        //TODO можно оптимизировать
        this.flowers.forEach(flower => {
            if (!flower.collected) {
                let cells = this.cellsProvider.getNotWaterCells();
                let openedFlowerCells = cells.filter(cell => this.containFlower(cell, flower.x, flower.y, flower.type.r) && cell.state.opened);

                if (openedFlowerCells.length == flower.type.cellsCount) {
                    this.flowersCollected++;
                    flower.collected = true;
                    openedFlowerCells.forEach(c => c.occupiedByFlower = false)
                    this.game.add.tween(flower.sprite).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
                    this.game.time.events.add(300, () => {
                        flower.sprite.bringToTop();
                        flower.sprite.alpha = 1;
                        this.game.add.tween(flower.sprite).to(
                            // { x: [flower.sprite.x, this.game.width - 150, this.game.width - 150],
                            // y: [flower.sprite.y, flower.sprite.y, this.game.height-150],
                            {
                                x: [flower.sprite.x, flowerAim.sprite.x],
                                y: [flower.sprite.y, flowerAim.sprite.y],
                                width: [flower.sprite.width, 90], height: [flower.sprite.height, 90],
                            },
                            700, Phaser.Easing.Linear.None, true, 200, 0, false).interpolation(Phaser.Math.bezierInterpolation).start();
                        this.game.add.tween(flower.sprite).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 800, 0, false)

                        flowerAim.label.bringToTop();
                    }, this);
                } else if(openedFlowerCells.length > 0 && flower.sprite.alpha != 0.7){
                    flower.sprite.alpha = 0.7;
                }
            }
        })
    }

    public generateFlowers(count: number) {

        let cellsCount = this.cellsProvider.getNotWaterCells().length;

        //TODO это как-то совсем тупо!
        //Надо придумать нормальный алгоритм
        let fora = Math.max(0, 9 - Math.floor(cellsCount / count));
        // console.log("flowers fora: " + fora)

        if (count > 0) {
            let allFlowers = FlowersProvider.getPossibleFlowers(BaseCellsProvider.CELL_WIDTH,
                BaseCellsProvider.CELL_HEIGHT, BaseCellsProvider.HEIGHT_DELTA_RATIO);


            let bigCount = Math.max(0, Math.min(count, Math.ceil(count / 3) - fora));
            console.log("BIG COUNT: " + bigCount)

            for (let i = 0; i < bigCount; i++) {
                let generated = this.generateFlower(allFlowers[0]);
                if (!generated) {
                    generated = this.generateFlower(allFlowers[1]);
                    if (!generated) {
                        generated = this.generateFlower(allFlowers[2]);
                    }
                }
            }

            count -= bigCount;
            let middleCount = Math.min(count, Math.ceil(count / 2) - Math.max(fora - 1));
            console.log("MIDDLE COUNT: " + middleCount)

            for (let i = 0; i < middleCount; i++) {
                let generated = this.generateFlower(allFlowers[1]);
                if (!generated) {
                    generated = this.generateFlower(allFlowers[2]);
                }
            }

            count -= middleCount;
            console.log("SMALL COUNT: " + count)

            for (let i = 0; i < count; i++) {
                let generated = this.generateFlower(allFlowers[2]);
                console.log("Generated: " + generated);
            }
        }
    }

    private generateFlower(flowerType: FlowerType): boolean {
        let brokenGeneration = true;
        var x: number;
        var y: number;

        let cells = this.cellsProvider.getNotWaterCells();

        let iterations = 0;
        while (brokenGeneration == true) {
            brokenGeneration = false;

            let choosenCell = Utils.getRandomElement(cells);

            //TODO сделать нормальный FlowerType
            x = this.cellsProvider.calculateX(choosenCell) + flowerType.dx;
            y = this.cellsProvider.calculateY(choosenCell) + flowerType.dy;

            let justOccupiedCells = cells.filter(cell => this.containFlower(cell, x, y, flowerType.r) && !cell.occupiedByFlower);

            if (justOccupiedCells.length != flowerType.cellsCount){
                brokenGeneration = true;
            } else {
                justOccupiedCells.forEach(cell => cell.occupiedByFlower = true);
                let flowerSprite = SpriteUtils.createSprite(this.game, x, y, "chamomile");
                flowerSprite.anchor = new Phaser.Point(0.5, 0.5);
                flowerSprite.width = flowerType.rForImage * 2;
                flowerSprite.height = flowerType.rForImage * 2;
                flowerSprite.alpha = 0;
                // flowerSprite.alpha = 0.7;
                this.screen.add.existing(flowerSprite);

                this.flowers.push(new Flower(x, y, flowerType, flowerSprite));
                console.log("Flower generated!")
                return true;
            }

            iterations++;
            if (iterations == 200) {
                console.log("Can not generate flower!")
                return false;
            }
        }

        return true;
    }

    public containFlower(cell: ForestCell, flowerX: number, flowerY: number, r: number, ): boolean {
        // console.log("x: " + flowerX + "; y: " + flowerY + "; cell.x: " +cell.X + "; cell.y: " + cell.Y)
        // console.log(Utils.dist(cell.X, cell.Y, flowerX, flowerY) + " vs r="+r)

        return Utils.dist(this.cellsProvider.calculateX(cell), this.cellsProvider.calculateY(cell), flowerX, flowerY) <= r;
    }

    private static getPossibleFlowers(cellWidth: number, cellHeight: number, hexRowsHeightDeltaRatio: number): FlowerType[] {
        return [
            new FlowerType(0, 0, cellHeight * 1.5, cellHeight * 1.05, 7),                //for 7 cells
            new FlowerType(cellWidth / 2, 0, cellHeight, cellHeight * 2 / 3, 4),                                    //for 4 cells
            new FlowerType(cellWidth / 2, cellHeight * hexRowsHeightDeltaRatio / 2, cellHeight, cellWidth / 2.1, 3),    //for 3 cells
        ];
    }

}