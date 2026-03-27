import BaseLadybugsProvider from './BaseLadybugsProvider';
import Movable from '../../model/forest/Movable';
import BaseForestScreen from '../../../view/screen/BaseForestScreen';
import AimType from '../../model/enum/AimType';
import AnimationUtils from '../../utils/AnimationUtils';
import CellType from '../../model/enum/CellType';
import ForestUtils from '../../utils/ForestUtils';
import Utils from '../../utils/Utils';
import ForestCell from '../../model/forest/ForestCell';
import ForestScreen from '../../../view/screen/ForestScreen';
import CellsPainter from './CellsPainter';
import BiomType from '../../model/enum/BiomType';
import SpriteUtils from '../../utils/SpriteUtils';
import { ContentType, BoostersContents } from '../../model/enum/ContentType';
import BoosterType from '../../model/enum/BoosterType';
import Environment from '../../model/enum/Environment';
import SoundUtils from '../../utils/SoundUtils';
import Settings from '../Settings';
export default class LadybugsProvider extends BaseLadybugsProvider {
    private screen: BaseForestScreen;

    public constructor(game: Phaser.Game, screen: BaseForestScreen, cellsProvider: CellsPainter) {
        super(game, screen, cellsProvider);
        this.screen = screen;
        this.cellsProvider = cellsProvider;
    }

    public isLadybugWayBlocker(cell: ForestCell): boolean {
        let res = false;
        //Следим, чтобы коровка могла провалиться вниз
        this.ladybugsAndAcorns.forEach(ladybug => {
            if (this.cellsProvider.belongToBottomCellsCone(ladybug.X, ladybug.Y, cell)) {
                let rightAndLeftNotDark = this.cellsProvider.getCells().filter(c => Math.abs(cell.X - c.X) == 1 && cell.Y == c.Y && !c.state.cover.isDark())
                //учитываем разделители
                rightAndLeftNotDark = rightAndLeftNotDark.filter(c => !this.cellsProvider.haveSeparatorsBetween(c, cell.X, cell.Y))

                // console.log("RC [" + cell.X + "," + cell.Y + "] rightAndLeft: " + rightAndLeftNotDark.length)

                if (rightAndLeftNotDark.length < 2) {
                    res = true;
                }
            }
        });

        return res;
    }

    public refreshLadybugsAndAcorns(): void {
        //Двигаем сначала коровку, которая ниже (чтобы следующая могла встать на её место)
        this.ladybugsAndAcorns.sort((a, b) => b.Y - a.Y);

        this.ladybugsAndAcorns.forEach(ladybug => {

            if (Date.now() < ladybug.animationEndAt) {
                return;
            }

            let openedAdjucentCells: ForestCell[] = this.cellsProvider.getBottomOpenedCellsWithNoSeparators(ladybug.X, ladybug.Y);

            //Убираем ячейки, занятые другими коровками
            openedAdjucentCells = openedAdjucentCells.filter(cell => {
                let otherLadyBugOnCell = this.ladybugsAndAcorns.filter(otherLadybug => cell.X == otherLadybug.X &&
                    cell.Y == otherLadybug.Y).shift();

                return otherLadyBugOnCell == null;
            });

            // //Убираем ячейку, в которой коровка тонет, если есть альтернативы
            // if (openedAdjucentCells.length > 1) {
            //     let emptyWaterCell = openedAdjucentCells.filter(cell => cell.type == CellType.WATER && this.cellsProvider.isInteractive(cell) && cell.state.opened).shift();
            //     if (emptyWaterCell != null) {
            //         let index = openedAdjucentCells.indexOf(emptyWaterCell, 0);
            //         openedAdjucentCells.splice(index, 1);
            //     }
            // }

            if (openedAdjucentCells.length > 0) {
                // ladybug.sprite.bringToTop();

                let choosen: ForestCell = openedAdjucentCells[Utils.random(openedAdjucentCells.length)];
                let currentCell = this.cellsProvider.getCellByCoordinates(ladybug.X, ladybug.Y);

                this.game.add.tween(ladybug.sprite).to({
                    x: this.cellsProvider.calculateX(choosen), y: this.cellsProvider.calculateY(choosen),
                }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);
                this.game.add.tween(ladybug.sprite.scale).to({
                    x: 1, y: 1,
                }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 100, 0, false);
                this.screen.delayWinOrLooseCheck(1000);

                ladybug.sprite.bringToTop();
                this.screen.bringUiToTop();

                // console.log("LADYBUGS CASE 0: " + "[" + (currentCell != null)+"]" + "[" + this.cellsProvider.isInteractive(choosen)+"]" + choosen.state.content)
                

                //Если на пути клетка-декорация, тогда обмениваем клетки
                if (currentCell != null && //currentCell.state.content != ContentType.bush && currentCell.state.content != ContentType.bush2 &&
                     !this.cellsProvider.isInteractive(choosen) 
                    && ForestUtils.getBiom(currentCell.type) != BiomType.WATER && ForestUtils.getBiom(choosen.type) != BiomType.WATER) {
                    
                    this.cellsProvider.switchCellsByCircle([currentCell, choosen], null, true);

                    // console.log("LADYBUGS CASE 1: " + ContentType[choosen.state.content] + " " + this.cellsProvider.isInteractive(choosen))


                    //На первом шаге коровки не в воду (либо когда выходим из воды) просто выкидываем декорацию
                } else if (!this.cellsProvider.isInteractive(choosen) &&
                    ((currentCell == null && choosen.type != CellType.WATER) ||
                        (choosen.type != CellType.WATER && currentCell.type == CellType.WATER))) {

                    // console.log("LADYBUGS CASE 2")

                    this.game.add.tween(choosen.state.sprite).to({ width: 0, height: 0 }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);
                    this.game.add.tween(choosen.state.label).to({ width: 0, height: 0 }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 200, 0, false);

                    //При переходе в воду декорации не двигаем
                } else if (!this.cellsProvider.isInteractive(choosen) && choosen.type == CellType.WATER) {
                    //do nothing

                    //Коровка может утонуть
                } else if (this.cellsProvider.isInteractive(choosen) && choosen.type == CellType.WATER) {
                    // this.game.add.tween(ladybug.sprite).to({ width: 0, height: 0 }, 1000, Phaser.Easing.Exponential.Out, true, 200, 0, false);
                    // this.screen.unexpectedFail()

                    // return;
                }

                if (ladybug.Y != choosen.Y) {
                    console.log("ladybug Y: " + ladybug.Y + " => " + choosen.Y)
                }

                ladybug.X = choosen.X;
                ladybug.Y = choosen.Y;
                ladybug.isLadybug? SoundUtils.ladybugMove() : SoundUtils.acornMove();
                (<ForestScreen>(this.screen)).refreshCovers();

                ladybug.animationEndAt = Date.now() + 400;

                if (this.cellsProvider.getBottomCells(ladybug.X, ladybug.Y).filter(c => !c.state.cover.isDark()).length == 0) {
                    if (ladybug.isLadybug) {
                        this.game.time.events.add(100, () => {
                            this.collectLadybug(ladybug);
                        })
                    } else {
                        this.screen.delayWinOrLooseCheck(1500);
                        this.game.time.events.add(1000, () => {
                            this.touchAcorn(ladybug);
                            this.game.time.events.add(400, () => {
                                this.touchAcorn(ladybug);
                                // this.screen.delayWinOrLooseCheck(1000);
                            })
                        });
                    }
                } else {
                    this.screen.delayWinOrLooseCheck(600);
                }
            }
        })
    }

    public touchAcorn(a: Movable) {
        a.sprite.bringToTop();

        if (a.touchedTimes == 1) {
            //желудь прорастает
            AnimationUtils.disappear(this.game, a.sprite);
            Utils.delete(this.getLadybugs(), a);
            this.screen.topPanel.decreaseCounter(AimType.acorn);

            let isHouse = this.screen.getForestType().environment == Environment.house;
            let newCell = (<ForestScreen>this.screen).spawnNewCellAt(a.X, a.Y, isHouse? "hexChest": "leaf4", true);
            // let newCell = (<ForestScreen>this.screen).spawnNewCellAt(a.X, a.Y, "leaf4");
            AnimationUtils.petalsBurst(this.game, newCell.state.sprite.x, newCell.state.sprite.y, ["petalBrown"]);
            AnimationUtils.highlight(this.game, newCell.state.sprite.x, newCell.state.sprite.y, "splashY")
            // AnimationUtils.appear(this.game, newCell.state.label)

            a.sprite.bringToTop();
            this.screen.bringUiToTop();

            a.touchedTimes = 2;

            SoundUtils.touchAcorn2();

        } else if (a.touchedTimes == 0) {
            a.sprite.loadTexture(SpriteUtils.key("acorn2"), SpriteUtils.frame("acorn2"));
            a.sprite.bringToTop();
            a.touchedTimes = 1;

            SoundUtils.touchAcorn2();
            
        }
    }

    public isOccupiedByMovable(cell: ForestCell) {
        return this.ladybugsAndAcorns.filter(m => m.X == cell.X && m.Y == cell.Y).length > 0;
    }

    private collectLadybug(ladybug: Movable) {
        ladybug.collected = true;

        this.screen.topPanel.updateAimCounters(700);
        let ladybugAim = this.screen.getAimWithType(AimType.ladybug);
        ladybugAim.countLeft = this.cellsProvider.getForestType().ladybugs.length - this.ladybugsAndAcorns.filter(l => l.collected).length;
        ladybugAim.countCollected = ladybugAim.startCount - ladybugAim.countLeft;

        if(ladybugAim.countLeft == 0){
            (<ForestScreen>this.screen).bottomArrows.forEach(a => {
                this.game.tweens.removeFrom(a);
                AnimationUtils.fadeOut(this.game, a, 500);
            })
        }

        this.screen.delayWinOrLooseCheck(10);
        // this.screen.checkWinOrLooseConditions();
        // this.game.time.events.add(1500, () => {
        //     this.screen.checkWinOrLooseConditions();
        // })

        let finalX = ladybug.X; let finalY = ladybug.Y;
        this.game.time.events.add(600, () => {
            ladybugAim.label.bringToTop();

            this.game.add.tween(ladybug.sprite).to(
                {
                    x: [this.cellsProvider.calculateRealX(finalX, finalY), ladybugAim.sprite.x],
                    y: [this.cellsProvider.calculateRealY(finalX, finalY), ladybugAim.sprite.y]
                },
                500, Phaser.Easing.Linear.None, true, 0, 0, false).interpolation(Phaser.Math.bezierInterpolation).start();

            this.game.add.tween(ladybug.sprite).to({ alpha: 0 }, 10, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 500 - 10, 0, false)
        }, this);
        this.game.time.events.add(500, ()=> {
            ladybug.X = -100;
            ladybug.Y = -100;
        });
    }



}
