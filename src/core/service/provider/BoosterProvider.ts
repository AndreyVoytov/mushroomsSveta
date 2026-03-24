import CellType from '../../model/enum/CellType';
import OpeningType from '../../model/enum/OpeningType';
import UserService from '../UserService';
import AnimationUtils from '../../utils/AnimationUtils';
import ForestUtils from '../../utils/ForestUtils';
import NeverError from '../../utils/NeverError';
import Utils from '../../utils/Utils';
import ForestCell from '../../model/forest/ForestCell';
import BaseForestScreen from '../../../view/screen/BaseForestScreen';
import ForestScreen from '../../../view/screen/ForestScreen';
import BaseCellsProvider from './BaseCellsProvider';
import LadybugsProvider from './LadybugsProvider';
import SpriteUtils from '../../utils/SpriteUtils';
import BoosterType from '../../model/enum/BoosterType';
import { ContentType } from '../../model/enum/ContentType';
import SoundUtils from '../../utils/SoundUtils';
import Settings from '../Settings';
export default class BoostersProvider {
    private game: Phaser.Game;
    private screen: BaseForestScreen;
    private cellsProvider: BaseCellsProvider;
    private ladybugsProvider: LadybugsProvider;

    public constructor(game: Phaser.Game, screen: BaseForestScreen, cellsProvider: BaseCellsProvider, ladybugsProvider: LadybugsProvider) {
        this.game = game;
        this.screen = screen;
        this.cellsProvider = cellsProvider;
        this.ladybugsProvider = ladybugsProvider;
    }

    public applyCurrentVision(compass: Phaser.Sprite, compassCell: ForestCell): boolean {
        if (this.doApplyCurrentBooster(compass, compassCell)) {
            // this.screen.topPanel.restoreStepsOnVisionUse();
            this.game.time.events.add(200, () => {
                let firstDuration = 1500;
                let secondDuration = 2000;

                SoundUtils.useVision();

                AnimationUtils.explodeViolet(this.game, compass.x, compass.y);
                AnimationUtils.explodeViolet(this.game, compass.x, compass.y, firstDuration, 1.5);

                compass.alpha = 1;
                AnimationUtils.wiggle(this.game, compass, 0, true);
                AnimationUtils.wiggle(this.game, compass, firstDuration, true);
                this.game.add.tween(compass.scale).to({ x: 0.5, y: 0.5 }, 400, Phaser.Easing.Linear.None, true, firstDuration + secondDuration, 0, false)
                this.game.add.tween(compass).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, firstDuration + secondDuration, 0, false)
                this.game.time.events.add(400 + firstDuration + secondDuration, () => {
                    compass.visible = false;
                })

                this.game.time.events.add(firstDuration + secondDuration + 100, () => {
                    compassCell.state.content = ContentType.empty;
                }, this);
                this.screen.delayWinOrLooseCheck(firstDuration + secondDuration + 100);

                this.screen.add.existing(compass);

                AnimationUtils.highlight(this.game, compass.x, compass.y, "splashV", 0, 2, 800);
                AnimationUtils.highlight(this.game, compass.x, compass.y, "splashV", firstDuration, 4, 800);


                let firstWave = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentWithDelta(c, compassCell, BaseCellsProvider.CELL_HEIGHT * 1.5) &&
                    !c.state.opened && !c.state.cover.isDark());
                let secondWave = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentWithDelta(c, compassCell, BaseCellsProvider.CELL_HEIGHT * 2) &&
                    !this.cellsProvider.areAdjucentWithDelta(c, compassCell, BaseCellsProvider.CELL_HEIGHT * 1.5) &&
                    !c.state.opened && !c.state.cover.isDark());

                let delay = 500;

                firstWave.forEach(c => {
                    // AnimationUtils.tint(this.game, c.state.cover.cover, 0xffffff, 0xffaaff, 300, 0);
                    // this.game.add.tween(c.state.cover.cover).to({ tint: 0xaaaaaa }, 300, Phaser.Easing.Linear.None, true, 0, 0, false)
                    AnimationUtils.fadeInStable(this.game, c.bg, delay);
                    AnimationUtils.fadeInStable(this.game, c.state.sprite, delay);
                    this.game.add.tween(c.state.cover).to({ alpha: [0, 0.15, 0, 0.15, 0, 0.15, 0, 0.15, 0, 0.15, 0, 0.5, 1] }, firstDuration + secondDuration, Phaser.Easing.Linear.None, true, delay, 0, false)
                    if (c.state.label.alpha > 0 && c.state.label.visible) {
                        this.game.time.events.add(delay, () => { c.state.label.alpha = 0 })
                        this.game.time.events.add(firstDuration + secondDuration + delay, () => { c.state.label.alpha = 1 })
                        this.game.add.tween(c.state.cover.leaf).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, delay, 0, false)
                        c.state.cover.leaf.alpha = 0;
                        this.game.add.tween(c.state.cover.leaf).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, firstDuration + secondDuration + delay - 400, 0, false)
                        c.state.cover.leaf.alpha = 1;
                    }
                })

                let secondDelay = -200;
                secondWave.forEach(c => {
                    AnimationUtils.fadeInStable(this.game, c.bg, firstDuration + delay + secondDelay);
                    AnimationUtils.fadeInStable(this.game, c.state.sprite, firstDuration + delay + secondDelay);
                    // AnimationUtils.tint(this.game, c.state.cover.cover, 0xffffff, 0xffaaff, 300, 0);
                    // this.game.add.tween(c.state.cover.cover).to({ tint: 0xaaaaaa }, 300, Phaser.Easing.Linear.None, true, 0, 0, false)
                    this.game.add.tween(c.state.cover).to({ alpha: [0, 0.15, 0, 0.15, 0, 0.5, 1] }, secondDuration, Phaser.Easing.Linear.None, true, firstDuration + delay + secondDelay, 0, false)
                    if (c.state.label.alpha > 0 && c.state.label.visible) {
                        this.game.time.events.add(firstDuration + delay + secondDelay, () => { c.state.label.alpha = 0 })
                        this.game.time.events.add(firstDuration + secondDuration + delay + secondDelay, () => { c.state.label.alpha = 1 })
                        this.game.add.tween(c.state.cover.leaf).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, firstDuration + delay + secondDelay, 0, false)
                        c.state.cover.leaf.alpha = 0;
                        this.game.add.tween(c.state.cover.leaf).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, firstDuration + secondDuration + delay + secondDelay - 400, 0, false)
                        c.state.cover.leaf.alpha = 1;
                    }
                })

            }, this);

            return true;
        }

        return false;
    }

    private rocketWayLength = 1800;
    private time = 1800;
    private rocketEasing = Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.InOut;

    public applyCurrentRocket(compass: Phaser.Sprite, compassCell: ForestCell): boolean {
        if (this.doApplyCurrentBooster(compass, compassCell)) {
            compassCell.state.sprite.alpha = 0;
            compassCell.state.content = ContentType.empty;
            this.screen.delayWinOrLooseCheck(500);

            SoundUtils.useRocket();

            let delta = 22;
            let leftHalf = SpriteUtils.createSprite(this.game, compass.x - delta, compass.y , "halfrocket");
            leftHalf.anchor.set(0.5);
            leftHalf.scale.set(1.27);
            leftHalf.angle = -90;
            this.screen.add.existing(leftHalf);

            let rightHalf = SpriteUtils.createSprite(this.game, compass.x + delta, compass.y , "halfrocket");
            rightHalf.anchor.set(0.5);
            rightHalf.scale.set(1.27);
            rightHalf.angle = 90;
            this.screen.add.existing(rightHalf);

            this.game.add.tween(leftHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time - 200)
            this.game.add.tween(rightHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time - 200)

            this.game.add.tween(rightHalf).to({ x: rightHalf.x + this.rocketWayLength }, this.time, this.rocketEasing, true, 0, 0, false)
            this.game.add.tween(leftHalf).to({ x: leftHalf.x - this.rocketWayLength }, this.time, this.rocketEasing, true, 0, 0, false)

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            let emitter = AnimationUtils.rocketBurst(this.game, rightHalf.x -15, rightHalf.y);
            this.game.add.tween(emitter).to({ x: rightHalf.x + this.rocketWayLength  }, this.time, this.rocketEasing, true, 0, 0, false)

            let emitter2 = AnimationUtils.rocketBurst(this.game, leftHalf.x + 15, leftHalf.y);
            this.game.add.tween(emitter2).to({ x: leftHalf.x - this.rocketWayLength }, this.time, this.rocketEasing, true, 0, 0, false)

            leftHalf.bringToTop();
            rightHalf.bringToTop();
            this.screen.bringUiToTop();

            this.cellsProvider.getCells().forEach(c => {
                if (c.Y == compassCell.Y && c != compassCell) {
                    this.game.time.events.add(100 * Math.abs(c.X - compassCell.X)+150, () => {
                        this.openCellByBooster(c, OpeningType.byRocket)
                    })
                }
            })

            return true;
        }

        return false;
    }

    public applyCurrentRocket2(compass: Phaser.Sprite, compassCell: ForestCell): boolean {
        if (this.doApplyCurrentBooster(compass, compassCell)) {
            compassCell.state.sprite.alpha = 0;
            compassCell.state.content = ContentType.empty;
            this.screen.delayWinOrLooseCheck(500);

            SoundUtils.useRocket();

            let deltaX = 10;
            let deltaY = -18;
            let leftHalf = SpriteUtils.createSprite(this.game, compass.x- deltaX, compass.y +deltaY, "halfrocket");
            leftHalf.anchor.set(0.5);
            leftHalf.scale.set(1.27);
            leftHalf.angle = -30;
            this.screen.add.existing(leftHalf);

            let rightHalf = SpriteUtils.createSprite(this.game, compass.x+ deltaX, compass.y - deltaY, "halfrocket");
            rightHalf.anchor.set(0.5);
            rightHalf.scale.set(1.27);
            rightHalf.angle = 150;
            this.screen.add.existing(rightHalf);

            this.game.add.tween(leftHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time-200)
            this.game.add.tween(rightHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time-200)


            let angle1 = 30;
            let vector1 = new Phaser.Point(Math.sin(angle1 / 180 * 3.14) * this.rocketWayLength
                , Math.cos(angle1 / 180 * 3.14) * this.rocketWayLength);

            this.game.add.tween(rightHalf).to({ x: rightHalf.x + vector1.x, y: rightHalf.y + vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)
            this.game.add.tween(leftHalf).to({ x: leftHalf.x - vector1.x, y: leftHalf.y - vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            let emitter = AnimationUtils.rocketBurst(this.game, rightHalf.x, rightHalf.y);
            this.game.add.tween(emitter).to({ x: rightHalf.x + vector1.x, y: rightHalf.y + vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            let emitter2 = AnimationUtils.rocketBurst(this.game, leftHalf.x, leftHalf.y);
            this.game.add.tween(emitter2).to({ x: leftHalf.x - vector1.x, y: leftHalf.y - vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            leftHalf.bringToTop();
            rightHalf.bringToTop();
            this.screen.bringUiToTop();

            this.cellsProvider.getCells().forEach(c => {
                if (c != compassCell && this.cellsProvider.isOnSameLeftDiagonal(c.X, c.Y, compassCell.X, compassCell.Y)) {
                    this.game.time.events.add(100 * Math.abs(c.X - compassCell.X)+150, () => {
                        this.openCellByBooster(c, OpeningType.byRocket);
                    })
                }
            })

            return true;
        }

        return false;
    }

    public applyCurrentRocket3(compass: Phaser.Sprite, compassCell: ForestCell): boolean {
        if (this.doApplyCurrentBooster(compass, compassCell)) {
            compassCell.state.sprite.alpha = 0;
            compassCell.state.content = ContentType.empty;
            this.screen.delayWinOrLooseCheck(500);

            SoundUtils.useRocket();

            let deltaX = 10;
            let deltaY = -18;
            let leftHalf = SpriteUtils.createSprite(this.game, compass.x + deltaX, compass.y + deltaY, "halfrocket");
            leftHalf.anchor.set(0.5);
            leftHalf.scale.set(1.27);
            leftHalf.angle = 30;
            this.screen.add.existing(leftHalf);

            let rightHalf = SpriteUtils.createSprite(this.game, compass.x - deltaX, compass.y - deltaY, "halfrocket");
            rightHalf.anchor.set(0.5);
            rightHalf.scale.set(1.27);
            rightHalf.angle = -150;
            this.screen.add.existing(rightHalf);

            this.game.add.tween(leftHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time - 200)
            this.game.add.tween(rightHalf).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, this.time - 200)

            let angle1 = -30;
            let vector1 = new Phaser.Point(Math.sin(angle1 / 180 * 3.14) * this.rocketWayLength
                , Math.cos(angle1 / 180 * 3.14) * this.rocketWayLength);

            this.game.add.tween(rightHalf).to({ x: rightHalf.x + vector1.x, y: rightHalf.y + vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)
            this.game.add.tween(leftHalf).to({ x: leftHalf.x - vector1.x, y: leftHalf.y - vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            let emitter = AnimationUtils.rocketBurst(this.game, rightHalf.x, rightHalf.y);
            this.game.add.tween(emitter).to({ x: rightHalf.x + vector1.x, y: rightHalf.y + vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            let emitter2 = AnimationUtils.rocketBurst(this.game, leftHalf.x, leftHalf.y);
            this.game.add.tween(emitter2).to({ x: leftHalf.x - vector1.x, y: leftHalf.y - vector1.y }, this.time, this.rocketEasing, true, 0, 0, false)

            leftHalf.bringToTop();
            rightHalf.bringToTop();
            this.screen.bringUiToTop();

            this.cellsProvider.getCells().forEach(c => {
                if (c != compassCell && this.cellsProvider.isOnSameRightDiagonal(c.X, c.Y, compassCell.X, compassCell.Y)) {
                    this.game.time.events.add(100 * Math.abs(c.X - compassCell.X)+150, () => {
                        this.openCellByBooster(c, OpeningType.byRocket);
                    })
                }
            })

            return true;
        }

        return false;
    }

    private openCellByBooster(c: ForestCell, openingType: OpeningType, cellDelay?: number, boosterDelay?: number) {
        let movableOnTheCell = this.ladybugsProvider.getLadybugs().filter(l => l.X == c.X && l.Y == c.Y).shift();

        // console.log("X: " + c.X + "; Y: " + c.Y)
        // console.log(this.ladybugsProvider.getLadybugs())
        // console.log(movableOnTheCell)

        if (movableOnTheCell) {
            if (!movableOnTheCell.isLadybug) {
                this.ladybugsProvider.touchAcorn(movableOnTheCell);
            }
        } else if (ForestUtils.isBoosterType(c.type)) {
            this.game.time.events.add(boosterDelay || 500, () => {
                this.screen.topPanel.restoreStepsOnBoosterUseByBooster();
                this.activateBooster(c);
            })
        } else if (c.state.cover.isDark()) {
            //do nothing
        } else if (c.state.cover.isLocked()) {
            c.state.cover.unlock();
            this.screen.topPanel.tryCollectCankerberry(c.state.cover);
            if(c.state.cover.dragonfly){
                (<ForestScreen>(this.screen)).moveDragonflies([c], OpeningType.byRocket);
            }
        } else {
            c.state.cover.openCellSmoothly(cellDelay || 0, openingType);

            if(openingType == OpeningType.byCompass){
                ((<ForestScreen>(this.screen)).refreshIvyAndIce(c.state, openingType));
            }
        }
    }


    public applyCurrentCompass(compass: Phaser.Sprite, compassCell: ForestCell): boolean {
        if (this.doApplyCurrentBooster(compass, compassCell)) {
            this.game.time.events.add(200, () => {
                compass.alpha = 1;
                this.game.add.tween(compass).to({ angle: 360 }, 300, Phaser.Easing.Linear.None, true, 0, 30, false)
                this.screen.add.existing(compass);
            }, this);

            SoundUtils.useCompass();

            let timeForOneCell = 500;
            let cellsToOpenWithCompass = 4;

            let closedCells: ForestCell[] = [];

            let cellsToOpen: ForestCell[] = [];

            let currentCell = compassCell;

            this.screen.delayWinOrLooseCheck(2100);

            for (let i = 0; i < cellsToOpenWithCompass; i++) {
                this.game.time.events.add(timeForOneCell + i * timeForOneCell, () => {
                    closedCells = this.cellsProvider.getCells().filter(cell => !cell.state.opened && !cell.state.cover.isDark() &&
                        !cell.state.cover.isLocked() && cellsToOpen.indexOf(cell) == -1);

                    console.log("closedCells.length: " + closedCells.length)

                    if (closedCells.length > 0) {
                        let closestCell = closedCells[0];
                        closedCells.forEach(c => {
                            if (this.dist(currentCell, c) < this.dist(currentCell, closestCell)) {
                                closestCell = c;
                            }
                        });

                        console.log("CLOSETS CELL CONTENT: " + closestCell.state.content)

                        cellsToOpen.push(closestCell);

                        this.compassAnimation(currentCell, closestCell, cellsToOpenWithCompass - i - 1);

                        if (closestCell != compassCell) {
                            this.openCellByBooster(closestCell, OpeningType.byCompass, 500, 0);
                        }

                        // Utils.delete(closedCells, closestCell);
                        currentCell = closestCell;
                    }

                    if (i == cellsToOpenWithCompass - 1) {
                        this.game.time.events.add(750, () => {
                            compassCell.state.content = ContentType.empty;

                            this.game.add.tween(compass).to({ width: 0, height: 0 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 0, 0, false)
                            this.game.time.events.add(300, () => {
                                compass.visible = false;
                            })
                        }, this);
                    }
                }, this);
            }
            return true;
        }

        return false;
    }

    public activateBooster(cellWithBooster: ForestCell): boolean {
        let cellType = cellWithBooster.type;
        let boosterSprite = cellWithBooster.state.sprite;
        switch (cellType) {
            case CellType.COMPASS_FREE:
            case CellType.COMPASS_IVY:
                return this.applyCurrentCompass(boosterSprite, cellWithBooster);
            case CellType.VISION:
            case CellType.VISION_IVY:
                return this.applyCurrentVision(boosterSprite, cellWithBooster);
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
                return this.applyCurrentRocket(boosterSprite, cellWithBooster);
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
                return this.applyCurrentRocket2(boosterSprite, cellWithBooster);
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
                return this.applyCurrentRocket3(boosterSprite, cellWithBooster);
            case CellType.EMPTY:
            case CellType.COLD:
            case CellType.HIVE:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.FOREST:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.DRAGONFLY:
            case CellType.ACORN:
            case CellType.WATER:
            case CellType.MOUNTAIN:
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
            case CellType.JELLY:
            case CellType.SAND:
            case CellType.BERRY_FIELD:
                break;
            default:
                throw new NeverError(cellType);
        }
        return false;
    }

    private doApplyCurrentBooster(booster: Phaser.Sprite, boosterCell: ForestCell): boolean {
        //Для ячейки с компасом в opened записываем взят ли бустер
        if (boosterCell.state.opened || boosterCell.state.cover.isLocked() || !this.screen.topPanel.tryOpenCell(OpeningType.usual)) {
            return false;
        }

        console.log("Opened: " + boosterCell.state.opened)

        if (!boosterCell.state.opened) {
            (<ForestScreen>(this.screen)).refreshIvyAndIce(boosterCell.state, ForestUtils.getOpeningTypeByBooster(boosterCell.type));
            boosterCell.state.opened = true;
            this.game.tweens.removeFrom(boosterCell.state.sprite);
        }

        return true;
    }

    private compassAnimation(from: ForestCell, to: ForestCell, cellsLeft: number) {

        let lifetime = 200;

        let pos1 = this.cellsProvider.calculatePosition(from);
        let pos2 = this.cellsProvider.calculatePosition(to);

        // AnimationUtils.highlightCompass(this.game, pos2.x, pos2.y, "splashG", 350, 1, (cellsLeft + 1) * 500)
        AnimationUtils.highlightCompass(this.game, pos2.x, pos2.y, "splashY", 150, 1, (cellsLeft + 1) * 500)

        let vector = new Phaser.Point(pos2.x - pos1.x, pos2.y - pos1.y);
        let k = 1000 / lifetime;
        let speed = new Phaser.Point(vector.x * k, vector.y * k);


        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        let emitter = this.game.add.emitter(pos1.x, pos1.y, 10);

         // emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").frameName);
        // emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "dustGreen").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "dustGreen").frameName);
        emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "p1").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "p1").frameName);
        emitter.gravity = new Phaser.Point(0, 0);
        emitter.maxRotation = 100;
        emitter.minRotation = -100;
        emitter.maxParticleSpeed = speed;//new Phaser.Point(speed.x * 1.2, speed.y * 1.2);
        emitter.minParticleSpeed = new Phaser.Point(speed.x * 0.7, speed.y * 0.7);
        // emitter.setAlpha(1, 0, lifetime, Phaser.Easing.Exponential.In, false);
        emitter.alpha = 0.9;
        emitter.setScale(0.5, 1, 0.5, 1, lifetime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false)
        // emitter.autoAlpha = true;
        emitter.width = 20;
        emitter.height = 20;

        emitter.start(false, lifetime, 50, 25, false);
    }

    private dist(c1: ForestCell, c2: ForestCell) {
        return Utils.dist(c1.X, c1.Y, c2.X, c2.Y)
    }

}
