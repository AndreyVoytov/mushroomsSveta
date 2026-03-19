import { Easing, Sprite, Sound } from 'phaser-ce';
import BiomType from '../../core/model/enum/BiomType';
import SeparatorType from '../../core/model/enum/SeparatorType';
import StartLevelPanel from '../component/house/StartLevelPanel';
import Game from './../../view/game/Game';
import UserService from '../../core/service/UserService';
import AimType from '../../core/model/enum/AimType';
import AnimationUtils from './../../core/utils/AnimationUtils';
import CellType from '../../core/model/enum/CellType';
import ForestUtils from './../../core/utils/ForestUtils';
import Utils from './../../core/utils/Utils';
import CellState from '../../core/model/forest/CellState';
import ForestCell from '../../core/model/forest/ForestCell';
import Label from './../component/panel/Label';
import InfoPanel from './../component/panel/InfoPanel';
import ForestCellCover from './../component/forest/ForestCellCover';
import OpeningType from '../../core/model/enum/OpeningType';
import BaseForestScreen from './BaseForestScreen';
import BaseCellsProvider from '../../core/service/provider/BaseCellsProvider';
import { ItemContents, ContentType, AnimalsContents, InteractiveContents, DecorationsContents } from '../../core/model/enum/ContentType';
import ComplexAnimationUtils from '../../core/utils/ComplexAnimationUtils';
import SpriteUtils from '../../core/utils/SpriteUtils';
import NeverError from '../../core/utils/NeverError';
import CellsProvider from '../../core/service/provider/CellsProvider';
import BoosterType from '../../core/model/enum/BoosterType';
import ForestBottomPanel from '../component/forest/ForestBottomPanel';
import AdminService from '../../core/service/AdminService';
import SoundUtils from '../../core/utils/SoundUtils';
import ForestDao from '../../core/dao/ForestDao';
import ServerStoreComponent from '../../core/service/store/ServerStoreComponent';
import Settings from '../../core/service/Settings';
import InGameSettingsPanel from './../component/forest/InGameSettingsPanel';
import EventUtils from '../../core/utils/EventUtils';
import EventType from '../../core/model/event/EventType';
import LocationUtils from '../../core/utils/LocationUtils';
import GameText from '../../core/localization/GameText';
export default class ForestScreen extends BaseForestScreen {

    private previousCellClicked: ForestCell;
    private currentCellClicked: ForestCell;
    private justOpenedCells: ForestCell[] = [];

    public bottomArrows: Phaser.Sprite[] = [];

    private spawnedCells: number = 0;
    private spawnCellsCountdown: number = 0;
    private forceSpawn = false;
    private canSpawn = false;
    
    private haveShells = false;
    private haveMoonflowers = false;
    private haveBushes = false;


    create() {
        super.create();
        // ServerStoreComponent.syncronizeUserWithServer();
        // // ForestsConfiguration.allForests.forEach(f =>{
        // //     if(!ForestUtils.isHardLevel(f)){
        // //         let slots = 0;
        // //         if(f.slots)f.slots.forEach(s => slots += s.count);
        // //         console.log("frst" + "\t" + f.id+ "\t" + f.mask.split("0").join("").length + "\t" + (slots + f.bonuses) + "\t" + f.steps + "\t" + (f.bonuses *2))
        // //     }
        // // })

        // if(EditorScreen.test_levelId && EditorScreen.test_looses + EditorScreen.test_wins <= (EditorScreen.TEST_WITH_100_STEPS? 1: EditorScreen.TEST_ATTEMPTS)){
        //     let label = new Label(this.game, this.game.width/2, 80,  "testLog[" + EditorScreen.test_levelId + "]: win/loose=" + EditorScreen.test_wins + "/" + EditorScreen.test_looses +
        //     "; avg_steps_left=" + EditorScreen.test_stepsOnWin/EditorScreen.test_wins  +
        //     "; avg_aims_left=" + EditorScreen.test_aimsOnLoose/EditorScreen.test_looses)
        //     this.add.existing(label);
        //     console.log(label.text)
        //     if(EditorScreen.test_looses + EditorScreen.test_wins < (EditorScreen.TEST_WITH_100_STEPS? 1: EditorScreen.TEST_ATTEMPTS)
        //                                                          || EditorScreen.LEVELS_TO_TEST > 1){
        //         this.game.time.events.add(2000, () => {
        //             this.testLevel(ForestScreen.DEFAULT_TEST_ATTEMPTS);
        //         });
        //     } else {
        //         EditorScreen.test_levelId = null;
        //     }
        // }
    }

    protected createCells() {

        // if (AdminService.cacheComplexImages() && AdminService.isEditMode()) {

        //     let thingsRemoved = 0;
        //     let removeThingsButton = SpriteUtils.createButton(this.game, 100, this.game.height - 300, "circleBooster", ()=>{
        //         if(this instanceof ForestScreen){
        //             if(thingsRemoved == 0){
        //                 (<ForestScreen>this).cellsProvider.getCells().forEach(c => {
        //                     c.state.cover.destroy();
        //                     c.bg.visible = true;
        //                     c.state.sprite.visible = true;
        //                 })
        //             } else if (thingsRemoved == 1){
        //                 (<ForestScreen>this).cellsProvider.getCells().forEach(c => {
        //                     c.state.label.destroy();
        //                 })
        //             } else if (thingsRemoved == 2){
        //                 (<ForestScreen>this).cellsProvider.getCells().forEach(c => {
        //                     c.state.sprite.destroy();
        //                 })
        //             } else if (thingsRemoved == 3){
        //                 (<ForestScreen>this).cellsProvider.getCells().forEach(c => {
        //                     c.bg.destroy();
        //                 })
        //             }

        //             thingsRemoved ++;
        //         }
        //         //reset scales..
        //     });
        //     this.game.add.existing(removeThingsButton);

        //     this.game.time.events.loop(500, () => {
        //         removeThingsButton.bringToTop();
        //     })
        // }

        this.canSpawn = false;
        this.forceSpawn = false;
        this.spawnedCells = 0;
        this.spawnCellsCountdown = 0;

        this.haveShells = this.getForestType().interactiveItems && this.getForestType().interactiveItems.find(i => i.name == ContentType[ContentType.shell]) ? true : false;
        this.haveMoonflowers = this.getForestType().interactiveItems && this.getForestType().interactiveItems.find(i => i.name == ContentType[ContentType.moonflowerClosed])? true : false; 
        this.haveBushes = this.getForestType().interactiveItems && this.getForestType().interactiveItems.find(i => i.name == ContentType[ContentType.bush] || i.name == ContentType[ContentType.bush2])? true : false; 

   
        // if (!AdminService.isAdminUser()) {
            this.cellsProvider.getCells().forEach((cell, i) => {
                this.drawCellBgShadow(cell);
            });
        // }
        this.cellsProvider.getCells().forEach((cell, i) => {
            this.drawCellBg(cell);
        });

        this.flowersProvider.generateFlowers(this.getForestType().flowers || 0);
        if(this.getForestType().flowers){
            this.getForestType().flowers = this.flowersProvider.flowers.length;
        }


        this.cellsProvider.getCells().forEach((cell, i) => {
            this.drawCell(cell);
        });

        this.ladybugsProvider.generateLadybugsAndAcorns(this.cellsProvider.getCells().filter(c => c.type == CellType.ACORN));
        if (this.ladybugsProvider.getLadybugs().length > 0) {
            this.game.time.events.repeat(200, 1000000, () => {
                this.ladybugsProvider.refreshLadybugsAndAcorns();
                this.refreshLabels();
            }, this);
        }

        this.cellsProvider.generateCankerberries(this.cellsProvider.getCells().map(c => c.state.cover), this.getForestType().cankerberries)
        this.ladybugsProvider.getLadybugs().forEach(l => l.sprite.bringToTop())


        if (this.getForestType().separators) {
            this.getForestType().separators.forEach(s => {
                let img = ForestUtils.getSeparatorImage(s.type);
                if (img) {
                    let sep = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateRealX(s.X, s.Y) + (s.type == SeparatorType.left ? -7 : 0),
                        this.cellsProvider.calculateRealY(s.X, s.Y) + + (s.type == SeparatorType.lefttop ? -10 : 0) + (s.type == SeparatorType.leftbottom ? 5 : 0),
                        img);

                    switch (s.type) {
                        case SeparatorType.left:
                            sep.x += -50;
                            sep.y += 0;
                            sep.angle = 0;
                            sep.anchor = new Phaser.Point(0.5, 0.5);
                            break;
                        case SeparatorType.leftbottom:
                            sep.x += -56;
                            sep.y += 25 + 5;
                            sep.angle = -65;
                            sep.anchor = new Phaser.Point(0.5, 0.2);
                            break;
                        case SeparatorType.lefttop:
                            sep.x += -56;
                            sep.y += -25;
                            sep.angle = 65;
                            sep.anchor = new Phaser.Point(0.5, 0.8);
                            break;
                    }

                    sep.inputEnabled = false;

                    // sep.width = BaseCellsProvider.CELL_WIDTH;
                    // sep.height = BaseCellsProvider.CELL_HEIGHT;
                    this.add.existing(sep);
                }
            })
        }
    }

    protected drawCellBgShadow(cell: ForestCell) {
        let bgShadow = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateX(cell), this.cellsProvider.calculateY(cell), "hex2");
        bgShadow.anchor = new Phaser.Point(0.5, 0.5);
        bgShadow.alpha = 0.3;
        // this.add.existing(bgShadow);
        this.layoutHolder.addChild(bgShadow);
        cell.bgShadow = bgShadow;
    }
    protected drawCellBg(cell: ForestCell) {
        let cellBg = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateX(cell), this.cellsProvider.calculateY(cell), ForestUtils.getForestCellBg(this.getForestType(), cell.type));
        cellBg.anchor = new Phaser.Point(0.5, 0.5);
        cellBg.width = BaseCellsProvider.CELL_WIDTH;
        cellBg.height = BaseCellsProvider.CELL_HEIGHT;
        this.add.existing(cellBg);

        // console.log("ARROW 1: " + (this.ladybugsProvider.getLadybugs().filter(l => l.isLadybug).length > 0))
        // console.log("ARROW 2: " + (this.cellsProvider.getBottomCells(cell.X, cell.Y).length == 0))

        if (this.getForestType().ladybugs && this.getForestType().ladybugs.length > 0 && this.cellsProvider.getBottomCells(cell.X, cell.Y).length == 0) {
            // console.log("ARROW PLACED")
            let arrow = SpriteUtils.createSprite(this.game, cellBg.x, cellBg.y + 90, "arrowSmall");
            arrow.width = 45; arrow.height = 28;
            arrow.alpha = 0.7;
            arrow.anchor.set(0.5);
            this.add.existing(arrow);

            this.bottomArrows.push(arrow);

            this.game.add.tween(arrow).to({ alpha: [0.1, 0.7] }, 2000, Easing.Linear.None, true, 2000 + 200 * cell.X, -1);
        }

        cell.bg = cellBg;
    }

    public drawCell(cell: ForestCell) {
        this.cellsProvider.addCellSprite(this.game, this, cell, this.boostersProvider);

        this.addAdjucentLabel(cell);

        cell.state.label.visible = false;

        if (ForestUtils.getBoosterContentType(cell.type)) {
            cell.state.label.visible = false;
        }

        if (ForestUtils.isCoverFreeNotBoosterItem(cell.type)) {
            cell.state.opened = true;
            cell.state.label.visible = false;
        }

        // if (!AdminService.isAdminUser()) {
        let cellCover = new ForestCellCover(this.getForestType().environment, cell.state.leafType, this.cellsProvider.calculateX(cell), this.cellsProvider.calculateY(cell),
            BaseCellsProvider.CELL_WIDTH, BaseCellsProvider.CELL_HEIGHT, this.game, cell.state, cell.type, this.onCellOpen, this);
        this.add.existing(cellCover);
        // cellCover.cacheAsBitmap = true;

        cell.state.cover = cellCover;
        // }


        // let gr = new Phaser.Group(this.game);

        // // let s1 = SpriteUtils.createSprite(this.game, this.game.width/2, 10, "circleBooster")
        // let s2 = SpriteUtils.createSprite(this.game, 0, 0, "circleGray")
        // let s3 = SpriteUtils.createSprite(this.game, 0, 0, "circleBooster")

        // s2.scale.set(0.8)
        // s3.scale.set(0.8)
        
        // // AnimationUtils.jelly(this.game, s1);
        // AnimationUtils.jelly(this.game, s2);
        // AnimationUtils.jelly(this.game, s3);
        
        
        // gr.addChild(s2);
        // s2.addChild(s3);

        // // gr.cacheAsBitmap = true;

        // this.add.existing(gr);
        
        // https://www.html5gamedevs.com/topic/15916-problem-with-phasergroup-and-cacheasbitmap/
    }

    protected placeEventPreboosters(): {x:number, y:number}[]{
        let res:{x:number, y:number}[] = [];
        let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
        let user = UserService.getUser();
        if (eventInfo && user.getWinsInRow() >= 3) {
            res.push(this.placePrebooster(BoosterType.compass, 500));
        }
        if (eventInfo && user.getWinsInRow() >= 2) {
            this.topPanel.addStepsFromEvent();
            res.push({x: 104, y:56});
        }
        if (eventInfo && user.getWinsInRow() >= 1) {
            this.lockScreenFor(700);
            res.push(this.placePrebooster(BoosterType.rocket, 500));
        }

        return res;
    }

    protected placePreboosters(): void {
        if (StartLevelPanel.PREBOOSTERS_TO_SPEND.length > 0) {
            let user = UserService.getUser();

            StartLevelPanel.PREBOOSTERS_TO_SPEND.forEach(prebooster => {
                if (user.getBoostersCount(prebooster) > 0) {
                    user.increaseBoostersCount(prebooster, -1);

                    this.placePrebooster(prebooster);       
                    this.lockScreenFor(700);             
                }
            })

            ServerStoreComponent.syncronizeUserWithServer();
            StartLevelPanel.PREBOOSTERS_TO_SPEND = [];
        }
    }

    private placePrebooster(prebooster: BoosterType, delay?:number):{x:number, y:number}{

        let availableCells = this.cellsProvider.getCells().filter(cell => {
            return (cell.Y <= BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL - 2 &&
                cell.state.content in AnimalsContents && !ForestUtils.containIvyOrIce(cell.type) && !cell.state.cover.boat);
        })

        if(availableCells.length == 0){
            availableCells = this.cellsProvider.getCells().filter(cell => {
                return (cell.Y <= BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL - 2 &&
                    cell.state.content in DecorationsContents && !ForestUtils.containIvyOrIce(cell.type) && !cell.state.cover.boat);
            })
        }
        let cell = Utils.getRandomElement(availableCells);

        switch (prebooster) {
            case BoosterType.compass:
                cell.type = CellType.COMPASS_FREE;
                cell.state.content = ContentType.compass;
                break;
            case BoosterType.rocket:
                let r = Utils.random(3) + 1;
                if (r == 1) {
                    cell.type = CellType.ROCKET;
                    cell.state.content = ContentType.rocket1;
                } else if (r == 2) {
                    cell.type = CellType.ROCKET2;
                    cell.state.content = ContentType.rocket2;
                } else if (r == 3) {
                    cell.type = CellType.ROCKET3;
                    cell.state.content = ContentType.rocket3;
                }
                break;
            case BoosterType.vision:
                cell.type = CellType.VISION;
                cell.state.content = ContentType.vision;
                break;
            case BoosterType.glove:
            case BoosterType.rainbow:
            case BoosterType.beans:
                break;
            default:
                throw new NeverError(prebooster);

        }
        cell.state.label.text = "";
        cell.state.label.visible = false;
        cell.bg.visible = true;

        this.game.time.events.add(delay || 1, () => {
            AnimationUtils.disappear(this.game, cell.state.sprite)
            AnimationUtils.disappear(this.game, cell.state.cover)
            AnimationUtils.petalsBurst(this.game, cell.state.sprite.x, cell.state.sprite.y, ["petalGreen"]);
    
            this.cellsProvider.addCellSprite(this.game, this, cell, this.boostersProvider);
            AnimationUtils.appear(this.game, cell.state.sprite, 500);

            //TODO костыль
            let level = ForestDao.indexOf(this.getForestType());
            console.log("ForestScreen level: " + level)
            if (level != 24 - 1) { //24 - уровень с подсказкой про шиповник
                this.educationPanel.bringToTop();
            }
        });

        return {x: cell.state.sprite.x, y: cell.state.sprite.y};
    }

    // onMouseUp(event: MouseEvent): void {
    //     if(!this.isLocked() && AdminService.cacheComplexImages()) { //TODO do not ignore education!
    //         let X = this.cellsProvider.calculateRelativeXByRealPosition(this.ruler.aimX, this.ruler.aimY);
    //         let Y = this.cellsProvider.calculateRelativeYByRealPosition(this.ruler.aimX, this.ruler.aimY);

    //         let closestCellOrder = Y * BaseCellsProvider.MAX_WIDTH + X;

    //         console.log("Y: " + Y)
    //         console.log("X: " + X)
    //         console.log("ORDER: " + closestCellOrder)

    //         let coordinates = this.cellsProvider.calculateRelativePosition(closestCellOrder);
    //         let x = this.cellsProvider.calculateRealX(coordinates.x, coordinates.y);
    //         let y = this.cellsProvider.calculateRealY(coordinates.x, coordinates.y);

    //         let cell = this.cellsProvider.getCells().filter(c => c.X == coordinates.x && c.Y == coordinates.y).shift();
    //         if(cell && cell.state.cover && !cell.state.opened && !cell.state.cover.isLocked() && !cell.state.cover.isDark() &&
    //             !this.educationPanel.shownWithOkButton && !this.levelStopped && !InGameSettingsPanel.shown && (!this.boosterInfoPanel || this.boosterInfoPanel.boosterType == BoosterType.glove)
    //             && !this.isUnderFadeStrip(cell) && !cell.state.cover.boat) { 

    //             if (ForestUtils.isBoosterType(cell.type)) {
    //                 this.boostersProvider.activateBooster(cell);
    //             } else {
    //                 cell.state.cover.openCell();
    //             }
    //         }
    //     }
    //     super.onMouseUp(event);
    // }

    onMouseUp(event: MouseEvent): void {
        this.onMouseUpOnCoorinates(this.ruler.aimX, this.ruler.aimY);
        super.onMouseUp(event);
    }

    public onMouseUpOnCoorinates(cursorX: number, cursorY:number, cacheComplexImages?:boolean): void {
        if(!this.isLocked() && (AdminService.cacheComplexImages() || cacheComplexImages)) { //TODO do not ignore education!
            // console.log("onMouseUpOnCoorinates: " + cursorX + " " + cursorY);
            let X = this.cellsProvider.calculateRelativeXByRealPosition(cursorX, cursorY);
            let Y = this.cellsProvider.calculateRelativeYByRealPosition(cursorX, cursorY);

            let closestCellOrder = Y * BaseCellsProvider.MAX_WIDTH + X;

            // console.log("Y: " + Y)
            // console.log("X: " + X)
            // console.log("ORDER: " + closestCellOrder)

            let coordinates = this.cellsProvider.calculateRelativePosition(closestCellOrder);
            // let x = this.cellsProvider.calculateRealX(coordinates.x, coordinates.y);
            // let y = this.cellsProvider.calculateRealY(coordinates.x, coordinates.y);

            let cell = this.cellsProvider.getCells().filter(c => c.X == coordinates.x && c.Y == coordinates.y).shift();
            if(cell && cell.state.cover && !cell.state.opened && !cell.state.cover.isLocked() && !cell.state.cover.isDark() &&
                !this.educationPanel.shownWithOkButton && !this.levelStopped && !InGameSettingsPanel.shown 
                && !this.isUnderFadeStrip(cell) && !cell.state.cover.boat) { 

                if (ForestUtils.isBoosterType(cell.type)) {
                    this.boostersProvider.activateBooster(cell);//, cacheComplexImages && AdminService.isEditMode());
                } else {
                    cell.state.cover.openCell();
                }
            }
        }
       
    }

    protected onCellOpen(cellState: CellState, openingType: OpeningType, byGlove?: boolean) {
        if (this.boosterInfoPanel && this.boosterInfoPanel.boosterType == BoosterType.glove) {
            this.boosterInfoPanel.close();

            let glove = SpriteUtils.createSprite(this.game, cellState.sprite.x, cellState.sprite.y, "glove");
            glove.scale.set(1.5)
            glove.anchor.set(0.5);
            this.addSprite(glove);
            AnimationUtils.fadeIn(this.game, glove)
            this.game.add.tween(glove).to({ angle: [30, 0, - 30, 0] }, 1500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Elastic.InOut, true, 0)
            glove.alpha = 1;
            AnimationUtils.fadeOut(this.game, glove, 1800)
            glove.alpha = 0;
            this.game.add.tween(glove).to({ y: glove.y + 70, x: glove.x - 70 }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 1200)

            this.game.time.events.add(1500, () => {
                this.onCellOpen(cellState, openingType, true);
            })

            let user = UserService.getUser();
            user.setSpendOnLevel(user.getCurrentForest() + 1);

            return;
        }

        let firstRowY = this.cellsProvider.getCells()[0].Y;
        let maxY = firstRowY + this.linesScrolled + CellsProvider.MAX_HEIGHT_WITH_NO_SCROLL - 1;

        this.justOpenedCells = this.cellsProvider.getCells().filter(cell => cell.state == cellState);


        if(this.justOpenedCells[0]){
            this.justOpenedCells[0].bg.visible = true;
   
           if (this.justOpenedCells[0].state.sprite) {
               this.justOpenedCells[0].state.sprite.visible = true;
           }
           if(this.justOpenedCells[0].state.label && this.justOpenedCells[0].state.label.text != "") {
               this.justOpenedCells[0].state.label.visible = true;
           }
        }

        //commented
        // this.justOpenedCells[0].bg.visible = true;
        // if (this.justOpenedCells[0].state.sprite) {
        //     // this.justOpenedCells[0].state.sprite.alpha = 0;
        //     this.justOpenedCells[0].state.sprite.updateTransform();
        //     this.game.time.events.add(1, ()=>{
        //         this.justOpenedCells[0].state.sprite.visible = true;
        //     });
        //     // this.game.add.tween(this.justOpenedCells[0].state.sprite).to({alpha:1}, 1, Easing.Linear.None, true, 0)
            
        // }
        // if(this.justOpenedCells[0].state.label && this.justOpenedCells[0].state.label.text != "") {
        //     // this.justOpenedCells[0].state.label.alpha = 0;
        //     this.justOpenedCells[0].state.label.updateTransform();
        //     this.game.time.events.add(1, ()=>{
        //         this.justOpenedCells[0].state.label.visible = true;
        //     });
        //     // this.game.add.tween(this.justOpenedCells[0].state.label).to({alpha:1}, 1, Easing.Linear.None, true, 0)
        // }

        // if(this.justOpenedCells[0].Y > maxY){
        //     return;
        // }

        if (!this.topPanel.tryOpenCell(openingType)) {
            return;
        }

        let stepSpend = true;

        cellState.opened = true;
        cellState.cover.visible = false;
        cellState.cover.openableCover.kill();
        cellState.cover.darkCover.kill();
        let cellByState =  this.cellsProvider.getCells().filter(cell => cell.state == cellState).shift();

        let openedCells = this.cellsProvider.getCells().filter(cell => cell.state.opened);
        // console.log("OPENED CELLS COUNT: " + openedCells.length)

        this.spawnCellsCountdown++;

        //opened interactive or opened without number
        let cellWhereCanSpawn = this.cellsProvider.getCells().filter(cell => this.cellsProvider.canSpawnOnCell(cell) &&
            !this.ladybugsProvider.isOccupiedByMovable(cell));

        let closedOpenableCells = this.cellsProvider.getCells().filter(cell => !cell.state.opened &&
            !cell.state.cover.isLocked() && !cell.state.cover.isDark());

        // console.log("closedOpenableCells; spawn left: " + (this.getForestType().cellsToSpawn - this.spawnedCells))
        // console.log("closedOpenableCells: " + closedOpenableCells.length)
        // console.log("closedOpenableCells; opened cells: " + cellWhereCanSpawn.length)
        // console.log("closedOpenableCells; all cells: " + this.cellsProvider.getCells().length)

        if (openedCells.length >= 9) {
            this.canSpawn = true;
        }

        if (this.canSpawn && this.getForestType().cellsToSpawn && this.getForestType().cellsToSpawn > this.spawnedCells &&
            (this.spawnCellsCountdown >= (this.forceSpawn ? 3 : 6) || closedOpenableCells.length == 0)) {

            if (closedOpenableCells.length == 0) {
                this.forceSpawn = true;
            }

            
            let sound = SoundUtils.treeSpawnCells();

            for (let i = 0; i < (this.forceSpawn ? 6 : 3); i++) {
                if (this.getForestType().cellsToSpawn > this.spawnedCells && cellWhereCanSpawn.length > 0) {
                    let choosen = Utils.getRandomElement(cellWhereCanSpawn);
                    Utils.delete(cellWhereCanSpawn, choosen);

                    let mapleSeed = SpriteUtils.createSprite(this.game, this.mapleLabel.x, this.mapleLabel.y, "mapleSeed")
                    this.add.existing(mapleSeed)


                    let dx = this.cellsProvider.calculateRealX(choosen.X, choosen.Y) - mapleSeed.x;
                    let dy = this.cellsProvider.calculateRealY(choosen.X, choosen.Y) - mapleSeed.y;
                    this.game.add.tween(mapleSeed).to({ x: [mapleSeed.x + dx * 2 / 3, mapleSeed.x + dx], y: [mapleSeed.y + dy * 1 / 3, mapleSeed.y + dy] },
                        500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 0).interpolation(Phaser.Math.bezierInterpolation).start();
                    this.game.add.tween(mapleSeed).to({ angle: 1440 }, 500, Easing.Linear.None, true, 0)
                    mapleSeed.anchor.set(0.5)
                    mapleSeed.scale.set(0.5)
                    this.game.add.tween(mapleSeed).to({ alpha: 0 }, 50, Easing.Linear.None, true, 450)

                    this.spawnNewCellAt(choosen.X, choosen.Y, "leaf2");
                    this.spawnedCells++;
                }
            }

            this.game.tweens.removeFrom(this.maple)
            this.game.tweens.removeFrom(this.mapleFace)
            AnimationUtils.jelly(this.game, this.maple, 0, true)
            AnimationUtils.jelly(this.game, this.mapleFace, 0, true)

            this.mapleFace.alpha = 1; 
            this.game.add.tween(this.mapleFace).to({alpha:0}, 25, Easing.Linear.None,true, 350);


            let cellToSpawnLeft = (this.getForestType().cellsToSpawn - this.spawnedCells)
            this.mapleLabel.text = "" + cellToSpawnLeft;

            if (cellToSpawnLeft == 0) {
                this.game.add.tween(this.mapleLabel.scale).to({ x: 0, y: 0 }, 700, Easing.Linear.None, true, 300)
                this.game.add.tween(this.mapleLabelBg.scale).to({ x: 0, y: 0 }, 700, Easing.Linear.None, true, 300)
            } else {
                AnimationUtils.heartBeat3(this.game, this.maple, 500)
                AnimationUtils.heartBeat3(this.game, this.mapleFace, 500)
            }

            this.spawnCellsCountdown = 0;
        }

        if (cellWhereCanSpawn.length == 0) {
            this.forceSpawn = false;
        }

        this.educationPanel.showEducation(cellState, openedCells.length);

        if (this.justOpenedCells[0]) {
            console.log("opened cell (" + this.justOpenedCells[0].X + ", " + this.justOpenedCells[0].Y + ")");
        }

        let contentType = cellState.content;

        if (contentType in AnimalsContents) {
            SoundUtils.animalFound();

            AnimationUtils.highlight(this.game, cellState.sprite.x, cellState.sprite.y, "splashG", 0, 1)
            this.topPanel.restoreStepsOnAnimalFound(openingType);
            stepSpend = false;
            this.game.time.events.add(1, () => {
                cellState.sprite.bringToTop();
                this.bringUiToTop()
            })
            cellState.content = ContentType.empty;

            this.game.add.tween(cellState.sprite).to({ x: cellState.sprite.x, y: cellState.sprite.y - 360 }, 1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 200, 0, false);
            this.game.add.tween(cellState.sprite).to({ alpha: [1, 0] }, 1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, 200, 0, false);

            this.game.time.events.add(200, () => {
                let x = cellState.sprite.x > Game.getWidth() / 2 ? cellState.sprite.x - 200 : cellState.sprite.x + 200;

                let label = new Label(this.game, x, cellState.sprite.y - 50, "+2 хода", { font: "bold 50px Arial", fill: "#00ff00" });
                label.strokeThickness = 4;
                label.addStrokeColor("#064426", 0);
                // label.addStrokeColor("#028017", 0);
                label.alpha = 0;
                this.add.existing(label);

                // this.add.existing(new InfoPanel(this.game, Game.getWidth() / 2 - 300, cellState.sprite.y - 100, ["+2 хода"], []));

                this.game.add.tween(label).to({ y: label.y - 360 }, 1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
                this.game.add.tween(label).to({ alpha: [1, 1, 1, 1, 1, 1, 0.5, 0] }, 1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                // let animationTime = 2500;
                // this.game.add.tween(label).to({ alpha: 0, y: label.y - 900 }, animationTime, Phaser.Easing.Sinusoidal.In, true);
                this.game.time.events.add(1100, () => { label.destroy() }, this);
            }, this);


        } else if (contentType in ItemContents) {
            if (contentType == ItemContents.randomItem) {
                SoundUtils.houseItemFound()
            } else if (contentType == ItemContents.specificItem) {
                SoundUtils.specialItemFound()
            } else {
                SoundUtils.mushroomFound()
            }

            ComplexAnimationUtils.onItemFound(this.game, contentType as ItemContents, cellState.sprite.position);
            this.topPanel.restoreStepsOnItemFound(openingType);
            stepSpend = false;

            this.topPanel.collectItem(cellState);
            this.dialogPanel.bringToTop();

            if (contentType == ContentType.lilly) {
                let cell = this.justOpenedCells[0];
                cell.state.content = ContentType.wlilly1;

                this.game.time.events.add(2, () => {
                    cell.state.sprite = cell.state.underSprite;
                })

                this.refreshLabelForCell(cell);

                AnimationUtils.appear(this.game, cell.state.underSprite, 500)
                AnimationUtils.appear(this.game, cell.state.label, 500)
            } else {
                cellState.content = ContentType.empty;
            }

        } else if (contentType in InteractiveContents) {

            SoundUtils.houseItemFound()

            this.topPanel.restoreStepsOnItemFound(openingType);
            stepSpend = false;

            //Bush will be processed by 'refreshBushes()'

            if (contentType == ContentType.lockpick || contentType == ContentType.book1) {
                AnimationUtils.levitate(this.game, cellState.sprite);
            } else if (contentType == ContentType.moonflowerClosed) {
                AnimationUtils.jelly(this.game, cellState.sprite);
            }

            this.tryUnlockBooks(this.justOpenedCells[0]);
        } else {
            SoundUtils.simpleCellOpen();
        }

        if (this.getForestType().flowers) {
            console.log("flowers collected: " + this.flowersProvider.flowersCollected + "; flowers need: " + (this.getForestType().flowers || 0))
        }

        this.refreshBushesAndShells(this.justOpenedCells[0]);
        this.refreshIvyAndIce(cellState, openingType);
        this.refreshBoats();
        // this.markValuableCells(this.justOpenedCells[0]);
        
        this.game.time.events.add(710, () => {
            this.refreshBoats(true);
        });

        this.ladybugsProvider.refreshLadybugsAndAcorns();
        this.cellsProvider.refreshWater(this.ladybugsProvider.getLadybugs());
        this.refreshLabels();
        if (this.justOpenedCells[0] && !ForestUtils.getBoosterInfo(this.justOpenedCells[0].type)) {
            this.refreshCovers();
        }
        this.markValuableCells();

        let flowerAim = this.topPanel.getAims().filter(aim => aim.type == AimType.flower)[0] || null;
        this.flowersProvider.refreshFlowers(flowerAim);

        this.topPanel.getAims().forEach(aim => {
            if (aim.type == AimType.flower) {
                aim.countLeft = this.getForestType().flowers - this.flowersProvider.flowersCollected;
                this.topPanel.updateAimCounters(1000);
            }
        })

        if (byGlove) {
            if (stepSpend) this.topPanel.restoreStepsOnGloveUse();
            // this.boosterInfoPanel.close();

            UserService.getUser().increaseBoostersCount(BoosterType.glove, -1);
            ServerStoreComponent.syncronizeUserWithServer();
            this.bottomPanel.refresh();
        }

        // if(!this.cellsProvider.isInteractiveState(cellState) && cellState.label && !cellState.label.text && openingType == OpeningType.usual){
        //     let count = 0;
        //     console.log("xsaxax count 0 for (" + cellByState.X + " " + cellByState.Y + ")")
        //     this.cellsProvider.getCells().forEach(cell =>{
        //         if (this.cellsProvider.areAdjucent(cell, cellByState) && !cell.state.opened && !cell.state.cover.isLocked() && !cell.state.cover.isDark()){
        //             // this.game.time.events.add(100, ()=>{
        //                 cell.state.cover.openCell(OpeningType.byCompass);
        //                 count ++;
        //                 // this.onCellOpen(cell.state, OpeningType.byCompass);
        //             // })
        //         }
        //     })
        //     console.log("xsaxax2 count " + count + " for (" + cellByState.X + " " + cellByState.Y + ")")
        // }

        this.delayWinOrLooseCheck(500);
        this.tryToScroll();
    }

    private refreshBoats(canNotMove?: boolean) {
        this.cellsProvider.getCells().filter(c => c.state.cover.boat).forEach(c => {
            let cellsToGo = this.cellsProvider.getCells().filter(cc => this.cellsProvider.areAdjucentAndNoSeparators(c, cc) && ForestUtils.getBiom(cc.type) == BiomType.WATER
                && !cc.state.cover.isLocked() && !cc.state.cover.isDark() && !cc.state.opened && !cc.state.cover.boat);

            console.log("REFRESH BOATS: " + new Date().getTime() + "; steps: " + this.cellsProvider.getCells().filter(c => c.state.opened).length)

            if (c.state.cover.boat.x == 0) {
                console.log("REFRESH BOATS: cover.boat.x=0")
                c.state.cover.boat.x += c.state.sprite.x;
                c.state.cover.boat.y += c.state.sprite.y - 19;
                c.state.cover.boat.scale.set(1.15);
                this.game.tweens.removeFrom(c.state.cover.boat)
                this.addSprite(c.state.cover.boat)
                if(AdminService.cacheComplexImages()) c.state.cover.cacheAsBitmap = false;
                if(AdminService.cacheComplexImages()) {
                    c.state.cover.cacheAsBitmap = true;
                    c.state.cover.onDestroy.add(()=>{
                        c.state.cover.cacheAsBitmap = false;
                    })
                }
                c.state.cover.boat.inputEnabled = false;
                this.bringUiToTop();
            }

            if (cellsToGo.length == 0) {
                console.log("REFRESH BOATS: cellsToGo.length=0")
                this.topPanel.collectBoat(c.state.cover.boat);
                c.state.cover.boat = null;

                c.state.cover.openableCover.inputEnabled = true;
                AnimationUtils.fadeIn(this.game, c.state.cover.leaf)

            } else if (!canNotMove) {
                console.log("REFRESH BOATS: canNotMove")
                let cellToGo = Utils.getRandomElement(cellsToGo);

                let boat = c.state.cover.boat;
                this.game.add.tween(boat).to({ x: cellToGo.state.sprite.x, y: cellToGo.state.sprite.y + 0.3 * boat.height - 7, angle: 0 }, 700,
                    Easing.Quadratic.InOut, true);

                let boatAngle = boat.angle;
                let boatPosition = new Phaser.Point(boat.x, boat.y);
                boat.x = cellToGo.state.sprite.x, boat.y = cellToGo.state.sprite.y + 0.3 * boat.height - 7;
                boat.angle = 0;
                AnimationUtils.boatFloating(this.game, boat, 700);
                boat.position.set(boatPosition.x, boatPosition.y);
                boat.angle = boatAngle;

                cellToGo.state.cover.boat = c.state.cover.boat;
                c.state.cover.boat = null;

                c.state.cover.openableCover.inputEnabled = true;
                AnimationUtils.fadeIn(this.game, c.state.cover.leaf)

                cellToGo.state.cover.openableCover.inputEnabled = false;
                AnimationUtils.fadeOut(this.game, cellToGo.state.cover.leaf)
            }
        })
    }

    private tryUnlockBooks(cell: ForestCell) {
        if(!cell) return;

        let lockpick: ForestCell;
        let book: ForestCell;
        if (cell.state.content == ContentType.book1) {
            book = cell;
            lockpick = this.cellsProvider.getCells().filter(c => c.state.opened && c.state.content == ContentType.lockpick).shift();
        } else if (cell.state.content == ContentType.lockpick) {
            lockpick = cell;
            book = this.cellsProvider.getCells().filter(c => c.state.opened && c.state.content == ContentType.book1).shift();
        }

        if (lockpick && book) {
            this.game.tweens.removeFrom(lockpick.state.sprite)
            this.game.tweens.removeFrom(book.state.sprite)

            book.state.sprite.bringToTop();
            lockpick.state.sprite.bringToTop();
            // this.game.add.tween(book.state.sprite.scale).to({x: book.state.sprite.scale.x*1.2, y:book.state.sprite.scale.y*1.2}, 400, Easing.Linear.None, true, 200)

            this.game.add.tween(lockpick.state.sprite).to({ x: book.state.sprite.x, y: book.state.sprite.y }, 500, Easing.Linear.None, true, 300)
            this.game.add.tween(lockpick.state.sprite).to({ alpha: 0 }, 100, Easing.Linear.None, true, 700)

            let book2 = SpriteUtils.createSprite(this.game, book.state.sprite.x - 10, book.state.sprite.y - 10, "book3");
            book2.anchor.set(0.5, 0.5)
            book2.alpha = 0;
            this.add.existing(book2);

            AnimationUtils.highlight(this.game, book.state.sprite.x, book.state.sprite.y, "splashY", 750, 1.5)
            // AnimationUtils.highlight(this.game, book.state.sprite.x, book.state.sprite.y, "splashY", 750, 1)

            this.game.time.events.add(800, () => {
                // book.state.sprite.loadTexture(SpriteUtils.key("book2"), SpriteUtils.frame("book2"))

                book2.x = book.state.sprite.x;
                book2.y = book.state.sprite.y;
                book2.scale.set(book.state.sprite.scale.x * 1.2, book.state.sprite.scale.y * 1.2);
                AnimationUtils.fadeIn(this.game, book2);
                AnimationUtils.fadeOut(this.game, book.state.sprite)
            })

            // let book3 = SpriteUtils.createSprite(this.game, book.state.sprite.x, book.state.sprite.y, "book3");
            // book3.anchor.set(0.5, 0.5)
            // book3.alpha = 0;
            // this.add.existing(book3);

            // this.game.time.events.add(1200, () =>{
            //     // book.state.sprite.loadTexture(SpriteUtils.key("book3"), SpriteUtils.frame("book3"))

            //     book3.x = book2.x;
            //     book3.y = book2.y;
            //     book3.scale.set(book2.scale.x, book2.scale.y);

            //     AnimationUtils.fadeOut(this.game, book2)
            //     AnimationUtils.fadeIn(this.game, book3);
            // })

            // this.game.time.events.add(1500, () =>{
            this.game.time.events.add(1300, () => {
                book.state.sprite.kill();
                // book2.kill();
                this.topPanel.collectBook(book2)
            })


            lockpick.state.content = ContentType.empty;
            book.state.content = ContentType.empty;

            this.delayWinOrLooseCheck(2200)
        }

    }

    protected addAdjucentLabel(cell: ForestCell): void {
        let adjucentCount = this.cellsProvider.getAdjucentInteractiveCount(this.cellsProvider.getCells(), cell);
        let adjucentCountLabel = new Label(this.game, this.cellsProvider.calculateX(cell), this.cellsProvider.calculateY(cell), "" + adjucentCount, Label.COMMON_MEDIUM_STYLE);

        if (cell.state.content in DecorationsContents) {
            let content: DecorationsContents = <DecorationsContents>cell.state.content
            switch (content) {
                case DecorationsContents.wlilly1:
                case DecorationsContents.wlilly2:
                case DecorationsContents.cactus:
                    adjucentCountLabel.addStrokeColor("#036f0e", 0);
                    break;
                case DecorationsContents.beanLeaf:
                case DecorationsContents.tree:
                    adjucentCountLabel.addStrokeColor("#114e00", 0);
                    break;
                case DecorationsContents.mirror:
                    // adjucentCountLabel.addStrokeColor("#34888e", 0);
                    adjucentCountLabel.addStrokeColor("#6c5c4a", 0);
                    break;
                case DecorationsContents.stone:
                    adjucentCountLabel.addStrokeColor("#8b704d", 0);
                    break;
                case DecorationsContents.stump:
                case DecorationsContents.log:
                    adjucentCountLabel.addStrokeColor("#692c02", 0);
                    break;
                default:
                    throw new NeverError(content);
            }
            adjucentCountLabel.strokeThickness = 4;

        } else {//if (cell.state.content == ContentType.lilly){
            adjucentCountLabel.addStrokeColor("#036f0e", 0);
            adjucentCountLabel.strokeThickness = 4;
        }

        adjucentCountLabel.anchor.set(0.5, 0.5);
        this.add.existing(adjucentCountLabel);
        cell.state.label = adjucentCountLabel;
        if (this.cellsProvider.isInteractive(cell)) {
            cell.state.label.text = "";
        }
        cell.state.label.visible = false;
    }

    protected onCellClick(cell: ForestCell) {
        if (this.isLocked()) {
            return;
        }

        this.previousCellClicked = this.currentCellClicked;
        this.currentCellClicked = cell;

        if (this.previousCellClicked != this.currentCellClicked) {
            return;
        }

        let cellState = cell.state;
        let type = cell.type;

        // console.log("decoration clicked: " + (cellState.opened && type == "g" && !this.isInteractiveState(cellState) && UserDao.getUser().getCurrentForest() <= 2))
        if (cellState.opened && ForestUtils.isLandscapeType(type) && !this.cellsProvider.isInteractiveState(cellState) && UserService.getUser().getCurrentForest() <= 2) {
            let adjucentInteractiveCount = this.cellsProvider.getAdjucentInteractiveCount(this.cellsProvider.getCells(), cell);

            if (adjucentInteractiveCount > 0) {
                this.game.time.events.add(200, () => {
                    let text = GameText.nearbyUsefulCells(adjucentInteractiveCount);
                    this.add.existing(new InfoPanel(this.game, Game.getWidth() / 2 - 300, cellState.sprite.y - 100, [text], [], false, true));
                }, this);
            }
        } else if (!cellState.opened && ForestUtils.containIvyOrIce(type) && UserService.getUser().getCurrentForest() <= 5) {
            let lockedTimes = cellState.cover.lockedTimes();
            if (lockedTimes > 0) {
                this.game.time.events.add(200, () => {
                    //TODO сделать сообщение от персонажа в стиле туториала. Только надо аккуратно.
                    let text = "Вскройте соседние клетки, чтобы убрать заросли";
                    this.add.existing(new InfoPanel(this.game, Game.getWidth() / 2 - 300, cellState.sprite.y - 100, [text], [], false, true));
                }, this);
            }
        }
    }

    public refreshLabels(): void {
        if (AdminService.isSpyCellsMode()) {
            this.cellsProvider.getCells().filter(cell => {
                cell.state.label.visible = true;
                // cell.state.label.text = ContentType[cell.state.content];
                cell.state.label.text =  cell.state.cover.type + " " + CellType[cell.state.cover.type];
            });
        } else {
            this.cellsProvider.getCells().filter(cell => !this.cellsProvider.isInteractive(cell)).forEach(cell => {
                this.refreshLabelForCell(cell);
            });
        }
    }

    private refreshLabelForCell(cell: ForestCell): void {
        if(!cell) return;

        let adjucentCount = this.cellsProvider.getAdjucentInteractiveCount(this.cellsProvider.getCells(), cell);
        let adjucentClosedCount = this.cellsProvider.getAdjucentClosedCount(this.cellsProvider.getCells(), cell);
        if (adjucentCount == 0) {
            cell.state.label.text = "";
            cell.state.label.visible = false;
        } else {
            cell.state.label.text = "" + adjucentCount;
            if(cell.state.opened){
                cell.state.label.visible = true;
            }
            cell.state.adjucentValueProbability = adjucentClosedCount > 0? adjucentCount/adjucentClosedCount : 0;
        }

        if (ForestUtils.getBoosterContentType(cell.type)) {
            cell.state.label.visible = false;
        }

        if (ForestUtils.isCoverFreeNotBoosterItem(cell.type)) {
            cell.state.label.visible = false;
        }
    }

    public refreshCovers(): void {
        let cellsToMakeDark = this.cellsProvider.getCells().filter(cell => !this.cellsProvider.isInteractive(cell)
            && !cell.state.opened && !cell.occupiedByFlower && !cell.state.cover.isDark());

        cellsToMakeDark.forEach(cell => {

            let canMakeDark = true;

            if (cell.state.cover.boat || (cell.type == CellType.JELLY && cell.state.cover.isLocked()) || ForestUtils.isBoosterType(cell.type)) {
                canMakeDark = false;
            }

            // if (cell.state.cover.getCankerBerriesCount() > 0) {
            if (cell.state.cover.getCankerBerriesCount() > 0 || cell.state.cover.dragonfly) {
                // console.log("RC [" + cell.X + "," + cell.Y + "] cankerberries detected!")
                canMakeDark = false;
            } else {
                // console.log("RC [" + cell.X + "," + cell.Y + "] no cankerberries!")
            }

            //Следим, чтобы заросли можно было вскрыть
            let ivyLockedCells = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(cell, c) &&
                ForestUtils.containIvyOrIce(c.type) && c.state.cover.isLocked() && !c.state.cover.isDark());

            ivyLockedCells.forEach(ivyCell => {
                let ivyAdjucentOpenable = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(ivyCell, c) &&
                    c.state.opened == false && !c.state.cover.isLocked() && !c.state.cover.isDark());

                let addition = (ivyCell.type == CellType.COLD || ivyCell.type == CellType.JELLY) ? 1 : 0;

                if (ivyAdjucentOpenable.length <= ivyCell.state.cover.lockedTimes() + addition) {
                    canMakeDark = false;
                }
            })

            //Следим, чтобы желейные грибы и лёд можно было вскрыть
            let bushWithBerryCells = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(cell, c) &&
                c.state.berries.length > 0);

            bushWithBerryCells.forEach(bushCell => {
                let adjucentOpenable = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(bushCell, c)
                    && c.state.opened == false && !c.state.cover.isLocked() && !c.state.cover.isDark());

                if (adjucentOpenable.length <= bushCell.state.berries.length) {
                    canMakeDark = false;
                }
            })

            //ракушки и moonflower
            let shells = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(cell, c) &&
                (c.state.content == ContentType.shell || c.state.content == ContentType.moonflowerClosed) && c.state.opened);

            shells.forEach(shell => {
                let adjucentOpenable = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(shell, c)
                    && c.state.opened == false && !c.state.cover.isLocked() && !c.state.cover.isDark());

                if (adjucentOpenable.length <= 1) {
                    canMakeDark = false;
                }
            })

            //Следим, чтобы можно было собрать весь мёд 
            let hiveCells = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(cell, c) &&
                c.state.honeyLabel && Number(c.state.honeyLabel.text) > 0);

            hiveCells.forEach(hiveCell => {
                let adjucentOpenable = this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucentAndNoSeparators(hiveCell, c)
                    && c.state.opened == false && !c.state.cover.isLocked() && !c.state.cover.isDark());

                if (adjucentOpenable.length <= Number(hiveCell.state.honeyLabel.text)) {
                    canMakeDark = false;
                }
            })

            // console.log("RC [" + cell.X + "," + cell.Y + "] start")
            if (this.ladybugsProvider.isLadybugWayBlocker(cell)) {
                canMakeDark = false;
                // console.log("RC [" + cell.X + "," + cell.Y + "] can not!")
            } else {
                // console.log("RC [" + cell.X + "," + cell.Y + "] can!")
            }

            //Следим, чтобы желудь, изначально лежащий на дне, можно было вскрыть
            let adjucentAcornsOnTheGround = this.ladybugsProvider.getLadybugs().filter(l => !l.isLadybug
                // && this.cellsProvider.getBottomCells(l.X, l.Y).filter(c => !c.state.cover.isLocked()).length > 0
                && this.cellsProvider.getBottomCells(l.X, l.Y).filter(c => !c.state.cover.isLocked()).length == 0
                && this.cellsProvider.areAdjucentAndNoSeparatorsForCoordinates(cell, l.X, l.Y));

            if (adjucentAcornsOnTheGround.length > 0) {
                canMakeDark = false;
            }


            if (canMakeDark) {
                this.cellsProvider.getCells().forEach(otherCell => {
                    //Если рядом c пустой клеткой есть неинтерактивная клетка с цифрой "0", делаем её серой
                    if (otherCell.state.opened && otherCell.state.content in DecorationsContents
                        // && !ForestUtils.getBoosterContentType(otherCell.type) 
                        && this.cellsProvider.areAdjucent(cell, otherCell)
                        && this.cellsProvider.getAdjucentInteractiveCount(this.cellsProvider.getCells(), otherCell) == 0) {

                        cell.state.cover.makeDark();
                        // console.log("RC [" + cell.X + "," + cell.Y + "] makeDark")
                        // console.log("RC [" + otherCell.X + "," + otherCell.Y + "] otherCell; content = " + otherCell.state.content)
                    }
                });
            }
        });
    }

    public spawnNewCellAt(X: number, Y: number, leaf: string): ForestCell {
        let cell = this.cellsProvider.getCells().filter(c => c.X == X && c.Y == Y).shift();
        Utils.delete(this.cellsProvider.getCells(), cell);

        cell.state.label.visible = false;
        this.game.time.events.add(800, () => {
            if (cell.type == CellType.WATER) {
                cell.bg.loadTexture(SpriteUtils.key("grass"), SpriteUtils.frame("grass"))
                cell.bg.width = CellsProvider.CELL_WIDTH;
                cell.bg.height = CellsProvider.CELL_HEIGHT;
            }
            cell.state.sprite.visible = false;
        })

        // console.log(this.cellsProvider.additionalCellTypes)

        let index = Utils.random(this.cellsProvider.additionalCellTypes.length);
        let choosen = this.cellsProvider.additionalCellTypes.splice(index, 1)[0];

        let newCell = new ForestCell(X, Y, choosen.type, CellType.FOREST, BiomType.FOREST, leaf);
        newCell.bg = cell.bg;
        newCell.state.metaValue = choosen.metaValue;

        this.cellsProvider.getCells().push(newCell);
        this.drawCell(newCell)
        AnimationUtils.appear(this.game, newCell.state.sprite, 300)
        AnimationUtils.appear(this.game, newCell.state.cover, 300)

        newCell.state.berries.forEach(b => { b.alpha = 0; })
        newCell.state.label.alpha = 0;
        this.game.time.events.add(500, () => {
            newCell.state.label.alpha = 1;
            newCell.state.berries.forEach(b => { b.alpha = 1; })
        })

        this.flowersProvider.flowers.forEach(f => {
            if(!f.collected && this.flowersProvider.containFlower(newCell, f.x, f.y, f.type.r)){
                newCell.occupiedByFlower = true;
            };
        })

        return newCell;
    }

    public refreshIvyAndIce(openedCellState: CellState, openingType: OpeningType): void {
        let openedCell = this.cellsProvider.getCells().filter(cell => cell.state == openedCellState).shift();
        if (openedCell != null) {
            let affectedIvyCells = this.cellsProvider.getCells().filter(cell => ForestUtils.containIvyOrIce(cell.type) &&
                cell.type != CellType.COLD && cell.type != CellType.JELLY && cell.state.cover.isLocked() && this.cellsProvider.areAdjucentAndNoSeparators(openedCell, cell));

            let dragonfliesToMove: ForestCell[] = [];

            affectedIvyCells.forEach(cell => {
                cell.state.cover.unlock();
                ForestUtils.tryAnimateBooster(this.game, cell);
                this.topPanel.tryCollectCankerberry(cell.state.cover);

                if (cell.state.cover.dragonfly) {
                    dragonfliesToMove.push(cell);
                }
            });

            this.moveDragonflies(dragonfliesToMove, openingType);

            if (this.getForestType().honey) {
                let affectedHives = this.cellsProvider.getCells().filter(cell => CellType.HIVE &&
                    cell.state.honeyLabel && Number(cell.state.honeyLabel.text) > 0 && this.cellsProvider.areAdjucentAndNoSeparators(openedCell, cell));

                affectedHives.forEach(cell => {
                    let countWas = Number(cell.state.honeyLabel.text);
                    let openableCells = this.cellsProvider.getCells().filter(cc => this.cellsProvider.areAdjucent(cell, cc) &&
                    !cc.state.opened && !cc.state.cover.isLocked() && !cc.state.cover.isDark()).length;


                    if (openableCells == 0) {
                    // if (countWas == 1) {
                        for(let i=0; i<countWas; i++){
                            this.game.time.events.add(i*100+1, ()=>{
                                cell.state.honeyLabel.text = "" + (countWas - i - 1);
                                this.topPanel.collectHoney(cell);
                                SoundUtils.honey();

                                if(countWas - i - 1 == 0){
                                    this.game.add.tween(cell.state.sprite.scale).to({ x: 0, y: 0 }, 400, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 300);
                                    this.game.time.events.add(700, () => {
                                        cell.state.content = ContentType.empty;
                                    })
                                }   
                            })
                        }
                    } else {
                        cell.state.honeyLabel.text = "" + (countWas - 1);
                        this.game.tweens.removeFrom(cell.state.sprite)
                        cell.state.sprite.scale.set(1, 1);
                        AnimationUtils.jelly(this.game, cell.state.sprite, 0, true)
                        this.topPanel.collectHoney(cell);
                        SoundUtils.honey();
                        if(countWas - 1 == 0){
                            this.game.add.tween(cell.state.sprite.scale).to({ x: 0, y: 0 }, 400, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 300);
                            this.game.time.events.add(700, () => {
                                cell.state.content = ContentType.empty;
                            })
                        }
                    }
                });
            }


            if (this.cellsProvider.containAcorns && openingType != OpeningType.byRocket) {
                let affectedAcorns = this.ladybugsProvider.getLadybugs().filter(l => !l.isLadybug &&
                    this.cellsProvider.areAdjucentAndNoSeparatorsForCoordinates(openedCell, l.X, l.Y))

                affectedAcorns.forEach(a => {
                    this.ladybugsProvider.touchAcorn(a);
                })
            }

            if (this.cellsProvider.containIce) {
                console.log("Contain ICE")
                this.reduceIceOrJelly(CellType.COLD, openedCell)
            }

            if (this.cellsProvider.containJelly) {
                console.log("Contain JELLY")
                if (!this.reduceIceOrJelly(CellType.JELLY, openedCell)) {
                    let jellyCells = this.cellsProvider.getCells().filter(cell =>
                        cell.type == CellType.JELLY && !cell.state.opened && cell.state.cover.isLocked());

                    let jellyAdjucentCells = this.cellsProvider.getCells().filter(cell => !cell.state.cover.dragonfly &&
                        !cell.state.opened && !cell.state.cover.isLocked() && !cell.state.cover.isDark() &&
                        ForestUtils.getBiom(cell.type) != BiomType.WATER &&
                        !ForestUtils.isBoosterType(cell.type) &&
                        jellyCells.filter(c => !this.isUnderFadeStrip(c)).filter(c => this.cellsProvider.areAdjucent(c, cell) && !this.cellsProvider.haveSeparatorsBetween(c, cell.X, cell.Y)).length > 0 &&
                        this.cellsProvider.getCells().filter(c => this.cellsProvider.areAdjucent(c, cell) &&
                            !c.state.opened && !c.state.cover.isDark() && !c.state.cover.isLocked()).length > 0); //TODO вложенный цикл

                    //TODO cellByCoordinates[][]
                    //TODO вынести всякие areAdjucent в CellUtils??
                    //c.state.opened и т.п. - вынести в отдельный метод!

                    console.log("JELLY ADJUCENT CELLS: " + jellyAdjucentCells.length)

                    if (jellyAdjucentCells.length > 0 && (openingType == OpeningType.usual)) {
                        let cellToMakeJelly = Utils.getRandomElement(jellyAdjucentCells);

                        if(AdminService.cacheComplexImages()) {cellToMakeJelly.state.cover.cacheAsBitmap = false;}
                        cellToMakeJelly.state.cover.addDecoration(CellType.JELLY);
                        cellToMakeJelly.type = CellType.JELLY;
                        cellToMakeJelly.state.cover.openableCover.inputEnabled = false;

                        let jellyMushroom = SpriteUtils.createSprite(this.game, 0, 0, "jellyMushroom");
                        jellyMushroom.anchor.set(0.5)
                        jellyMushroom.scale.set(1.5)
                        cellToMakeJelly.state.cover.decoration.addChild(jellyMushroom)
                        AnimationUtils.jelly(this.game, jellyMushroom)
                        if(AdminService.cacheComplexImages()) {cellToMakeJelly.state.cover.cacheAsBitmap = true;}

                        SoundUtils.jellyAppear();

                        this.topPanel.increaseCounter(AimType.jelly);
                    }
                }
            }
        }
    }

    private markValuableCells(): void {
        let closedCells = this.cellsProvider.getCells().filter(cell =>
            !cell.state.opened && !cell.state.cover.isDark() && cell.type != CellType.COMPASS_FREE
        );

        closedCells.forEach(closedCell => {
            let adjucentOpenedCells = this.cellsProvider.getCells().filter(cell =>
                this.cellsProvider.areAdjucent(cell, closedCell) && cell.state.opened && cell.state.label.text && cell.type != CellType.COMPASS_FREE
            );

            closedCell.state.valueProbability = 0;

            adjucentOpenedCells.forEach(adjucentOpenedCell => {
                closedCell.state.valueProbability = Math.max(closedCell.state.valueProbability, adjucentOpenedCell.state.adjucentValueProbability);
                if(closedCell.state.valueProbability <= 0.5) closedCell.state.valueProbability = 0;
                let alpha = closedCell.state.valueProbability > 0? closedCell.state.valueProbability * 0.999 + 0: 0;
                closedCell.state.cover.setFrame(alpha);
            });
        })
    }

    private markValuableCells2(openedCell: ForestCell): void {
        //TODO достойный арт!
        let adjucentsCells = this.cellsProvider.getCells().filter(cell =>
            this.cellsProvider.areAdjucent(cell, openedCell) && cell.state.opened && cell.state.label.text && cell.type != CellType.COMPASS_FREE
        );

        if(openedCell.state.label.text){
            adjucentsCells.push(openedCell);
        }

        adjucentsCells.forEach(adjucentCell => {
            let affectedCells = this.cellsProvider.getCells().filter(cell =>
                this.cellsProvider.areAdjucent(cell, adjucentCell) && !cell.state.opened && !cell.state.cover.isDark() && cell.type != CellType.COMPASS_FREE
            );

            affectedCells.forEach(affectedCell =>{
                let cellsToCheck = this.cellsProvider.getCells().filter(cell =>
                    this.cellsProvider.areAdjucent(cell, affectedCell) && cell.state.opened && cell.type != CellType.COMPASS_FREE
                );

                affectedCell.state.valueProbability = 0;

                cellsToCheck.forEach(cellToCheck => {
                    let num = cellToCheck.state.label.text? Number(cellToCheck.state.label.text) : 0;

                    affectedCell.state.valueProbability = Math.max(affectedCell.state.valueProbability, num/cellsToCheck.length);
                    if(affectedCell.state.valueProbability <= 0.5) affectedCell.state.valueProbability = 0;
                    let alpha = affectedCell.state.valueProbability > 0? affectedCell.state.valueProbability * 0.999 + 0: 0;
                    affectedCell.state.cover.setFrame(alpha);
                })
            })
        })
    }

    private reduceIceOrJelly(cellType: CellType, openedCell: ForestCell): boolean {
        let affectedJellyOrIceCells = this.cellsProvider.getCells().filter(cell =>
            cell.type == cellType && cell.state.cover.isLocked() && this.cellsProvider.areAdjucentAndNoSeparators(openedCell, cell));

        if (affectedJellyOrIceCells.length > 0) {
            let adjucent = [];

            let maxAttempts = 100;
            let attempts = 0;

            while (affectedJellyOrIceCells.length > 0 && attempts < maxAttempts) {
                // console.log("affectedJellyCells.length: " + affectedJellyCells.length)
                // console.log("adjucent.length: " + adjucent.length)
                // console.log(affectedJellyCells)
                // console.log(adjucent)

                let choosen = Utils.getRandomElement(affectedJellyOrIceCells);
                choosen.state.cover.unlock();

                //если вскрыли ячейку, смежную с 2-я кластерами желе - надо в каждом кластере по 1-й ячейке освободить от желе/льда. 
                //(проверка в радиусе 1) 
                adjucent = [choosen]
                adjucent = adjucent.concat(affectedJellyOrIceCells.filter(c => this.cellsProvider.areAdjucentAndNoSeparators(choosen, c)));
                adjucent = adjucent.concat(affectedJellyOrIceCells.filter(c => adjucent.filter(cc => this.cellsProvider.areAdjucentAndNoSeparators(cc, c)).length > 0));
                adjucent = adjucent.concat(affectedJellyOrIceCells.filter(c => adjucent.filter(cc => this.cellsProvider.areAdjucentAndNoSeparators(cc, c)).length > 0));

                adjucent.forEach(c => Utils.delete(affectedJellyOrIceCells, c));

                if (cellType == CellType.JELLY) {
                    this.topPanel.decreaseCounter(AimType.jelly);
                }
                attempts++;
            }

            if (attempts == maxAttempts) {
                console.error("Too many attempts to refresh jelly/ice: " + attempts)
            }

            return true;
        }

        return false;
    }

    public static dragonflyInitialScale = 1.0;

    public moveDragonflies(dragonfliesToMove: ForestCell[], openingType: OpeningType) {
        this.time.events.add(200, () => {
            dragonfliesToMove.forEach(c => {

                //TODO нужно отдельную кисть для стрекоз, без CellType!
                let ivyCellsToGo = this.cellsProvider.getCells().filter(c2 => this.cellsProvider.areAdjucent(c, c2) && !c2.state.opened
                    && c2.state.cover.isLocked() && (c2.type == CellType.IVY || c2.type == CellType.IVY_SMALL || c2.type == CellType.IVY_STRONG
                        || c2.type == CellType.DRAGONFLY) && !c2.state.cover.dragonfly)

                if (c.state.cover.dragonfly && c.state.cover.dragonfly.x == 0) {
                    c.state.cover.dragonfly.x += c.state.sprite.x;
                    c.state.cover.dragonfly.y += c.state.sprite.y;
                    if(AdminService.cacheComplexImages()) c.state.cover.cacheAsBitmap = false;
                    this.addSprite(c.state.cover.dragonfly);
                    if(AdminService.cacheComplexImages()) c.state.cover.cacheAsBitmap = true;
                    this.bringUiToTop();
                }

                if (c.state.cover.dragonfly && ivyCellsToGo && ivyCellsToGo.length > 0 && (openingType != OpeningType.byRocket || !this.game.tweens.isTweening(c.state.cover.dragonfly))) {

                    let choosen = Utils.getRandomElement(ivyCellsToGo);

                    let dx = choosen.state.sprite.x - c.state.sprite.x;
                    let dy = choosen.state.sprite.y - c.state.sprite.y;

                    let df = c.state.cover.dragonfly;

                    choosen.state.cover.dragonfly = df;
                    c.state.cover.dragonfly = null;
                    // choosen.state.cover.addChild(df);
                    // df.x = -dx;
                    // df.y = -dy;

                    // this.game.add.tween(df).to({ x: 0, y: 0 },
                    //     300, Easing.Linear.None, true)
                    // this.game.add.tween(df.scale).to({ x: [1.5 * df.scale.x, 1 * df.scale.x], y: [1.5 * df.scale.y, 1 * df.scale.y] },
                    //     300, Easing.Linear.None, true)
                    this.game.add.tween(df).to({ x: df.x + dx, y: df.y + dy },
                        300, Easing.Linear.None, true)
                    this.game.add.tween(df.scale).to({
                        x: [1.5 * ForestScreen.dragonflyInitialScale, 1 * ForestScreen.dragonflyInitialScale],
                        y: [1.5 * ForestScreen.dragonflyInitialScale, 1 * ForestScreen.dragonflyInitialScale]
                    },
                        300, Easing.Linear.None, true)

                }

                this.topPanel.tryCollectDragonfly(c.state.cover);
            })
        })
    }

    private refreshBushesAndShells(openedCell: ForestCell): void {
        if(!openedCell) return;

        // if (this.getForestType().blueberries) {

        if (this.haveBushes) {
            this.cellsProvider.getCells().filter(c => c.state.berries.length > 0
                && c.state.opened && (this.cellsProvider.areAdjucent(c, openedCell) || c == openedCell)).forEach(c => {

                    let openableCells = this.cellsProvider.getCells().filter(cc => this.cellsProvider.areAdjucent(c, cc) &&
                        !cc.state.opened && !cc.state.cover.isLocked() && !cc.state.cover.isDark()).length;

                    let berriesToTakeOff = [];

                    do {
                        berriesToTakeOff.push(c.state.berries[0])
                        Utils.delete(c.state.berries, c.state.berries[0])
                    } while (openableCells < c.state.berries.length)

                    if (berriesToTakeOff.length > 0) {
                        this.game.tweens.removeFrom(c.state.sprite);
                        c.state.sprite.scale.set(1, 1);
                        AnimationUtils.jelly(this.game, c.state.sprite, 200, true)
                        c.state.berries.forEach(b => {
                            AnimationUtils.wiggle3(this.game, b, 200, true);
                        })
                    }

                    if (c.state.berries.length == 0) {
                        c.state.content = ContentType.empty;
                        this.game.add.tween(c.state.sprite.scale).to({x:0, y:0}, 1000, Easing.Linear.None, true, 200)
                    }

                    this.topPanel.tryCollectBlueberry(berriesToTakeOff);
                    this.topPanel.tryCollectBlueberry(berriesToTakeOff);
                });
        }

        // if (this.getForestType().pearls) {
        if (this.haveShells) {
            this.cellsProvider.getCells().filter(c => c.state.content == ContentType.shell &&
                c.state.opened && (this.cellsProvider.areAdjucent(c, openedCell) || c == openedCell) && c.state.metaValue != "pearlCollected").forEach(c => {

                    let openableCells = this.cellsProvider.getCells().filter(cc => this.cellsProvider.areAdjucent(c, cc) &&
                        !cc.state.opened && !cc.state.cover.isLocked() && !cc.state.cover.isDark()).length;

                    if (c != openedCell || openableCells == 0) {
                        let sprite = c.state.sprite;
                        sprite.loadTexture(SpriteUtils.key("shell2"), SpriteUtils.frame("shell2"));
                        this.topPanel.collectPearl(c);
                        c.state.metaValue = "pearlCollected";

                        this.game.time.events.add(600, () => {
                            c.state.content = ContentType.empty;
                            this.game.add.tween(sprite.scale).to({ x: 0, y: 0 }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 300)
                            this.game.add.tween(sprite).to({ alpha: 0 }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, 300)
                        })
                    } else {
                        AnimationUtils.wiggle3(this.game, c.state.sprite);
                    }
                })
        }

        // if (this.getForestType().moonflowers) {
        if (this.haveMoonflowers) {
            this.cellsProvider.getCells().filter(c => c.state.content == ContentType.moonflowerClosed &&
                c.state.opened && (this.cellsProvider.areAdjucent(c, openedCell) || c == openedCell)).forEach(c => {

                    let openableAdjucentCells = this.cellsProvider.getCells().filter(cc => this.cellsProvider.areAdjucent(c, cc) &&
                        !cc.state.opened && !cc.state.cover.isLocked() && !cc.state.cover.isDark()).length;

                    if (c != openedCell || openableAdjucentCells == 0) {
                        this.delayWinOrLooseCheck(2800);

                        let variation = c.state.metaValue ? c.state.metaValue : "";

                        let closed = SpriteUtils.createSprite(this.game, c.state.sprite.x, c.state.sprite.y, "moonflowerClosed" + variation)
                        closed.anchor.set(0.5);
                        this.add.existing(closed);

                        this.game.tweens.removeFrom(c.state.sprite);
                        this.game.tweens.removeFrom(c.state.sprite.scale);

                        c.state.sprite.loadTexture(SpriteUtils.key("moonflower" + variation), SpriteUtils.frame("moonflower" + variation));
                        c.state.sprite.alpha = 0;
                        c.state.sprite.scale.set(1.36, 1.36);
                        c.state.sprite.bringToTop();

                        AnimationUtils.jelly(this.game, c.state.sprite, 0, true)

                        AnimationUtils.fadeOut(this.game, closed)
                        AnimationUtils.fadeIn(this.game, c.state.sprite)

                        c.state.content = ContentType.empty;

                        this.useMoonflower(c.state.sprite.x, c.state.sprite.y, variation);

                        this.time.events.add(2000, () => {
                            this.topPanel.collectMoonflower(c.state.sprite);
                        })
                    }
                })
        }

    }

    private useMoonflower(x: number, y: number, variation: string, shotsCount?: number) {
        let openableCellsUnbounded = this.cellsProvider.getCells().filter(cc => !cc.state.opened &&
            !cc.state.cover.isLocked() && !cc.state.cover.isDark());

        let firstRowY = this.cellsProvider.getCells()[0].Y;
        let maxY = firstRowY + this.linesScrolled + CellsProvider.MAX_HEIGHT_WITH_NO_SCROLL - 2;

        let openableCells = openableCellsUnbounded.filter(cc => cc.Y <= maxY);

        if (openableCells.length < (shotsCount || 3)) {
            openableCells = openableCellsUnbounded;
        }

        for (let i = 0; i < (shotsCount || 3) && openableCells.length > 0; i++) {
            let choosen = Utils.getRandomElement(openableCells);
            Utils.delete(openableCells, choosen);

            let particleVariation = "p8";
            if (variation == "2") particleVariation = "p1";
            if (variation == "3") particleVariation = "p6";

            if (variation == "4" && i == 1) particleVariation = "p1";
            if (variation == "4" && i == 2) particleVariation = "p6";
            if (variation == "4" && i == 3) particleVariation = "p8";
            if (variation == "4" && i == 4) particleVariation = "p1";

            let delay = i * 100;

            let firefly = SpriteUtils.createSprite(this.game, x, y, particleVariation);
            firefly.scale.set(0.3, 0.5);
            firefly.anchor.set(0.5);
            this.addSprite(firefly);
            this.game.add.tween(firefly).to({ x: choosen.state.sprite.x, y: [Math.min(choosen.state.sprite.y, y) - 300, choosen.state.sprite.y] },
                1000 + delay, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300).interpolation(Phaser.Math.bezierInterpolation).start();

            firefly.alpha = 0;
            this.game.add.tween(firefly).to({ alpha: 1 }, 150, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300 + delay);
            this.game.add.tween(firefly.scale).to({ x: 2, y: 2 }, 300, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300 + delay);
            firefly.alpha = 1;
            this.game.add.tween(firefly).to({ alpha: 0 }, 50, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 950 + 300 + delay);
            firefly.alpha = 0;

            let splashVariation = "splashG";
            if (variation == "2") splashVariation = "splashY";
            if (variation == "3") splashVariation = "splashV";

            if (variation == "4" && i == 1) particleVariation = "splashY";
            if (variation == "4" && i == 2) particleVariation = "splashV";
            if (variation == "4" && i == 3) particleVariation = "splashG";
            if (variation == "4" && i == 4) particleVariation = "splashY";

            this.time.events.add(1300 + delay, () => {
                choosen.state.cover.openCellSmoothly(0, OpeningType.byCompass);
                AnimationUtils.highlight(this.game, choosen.state.sprite.x, choosen.state.sprite.y, "splashG", 0, 1.5);
                // AnimationUtils.highlight(this.game, choosen.state.sprite.x, choosen.state.sprite.y, "splashG", 0);
            })
        }
    }

    public useBeans() {
        let delay = 0;
        this.cellsProvider.getCells().forEach(c => {
            if (c.state.content == ContentType.empty && c.state.opened == true
                && this.ladybugsProvider.getLadybugs().filter(l => l.X == c.X && c.Y == l.Y).length == 0) {

                if (c.state.sprite) { this.game.add.tween(c.state.sprite).to({ alpha: 0 }, 300, Easing.Linear.None, true) }//remove bush

                c.state.content = ContentType.beanLeaf;
                c.state.sprite = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateX(c), this.cellsProvider.calculateY(c), "beanLeaf");
                c.state.sprite.anchor.set(0.5);
                c.state.sprite.scale.set(1 / 1.5);
                this.addSprite(c.state.sprite);
                c.state.label.bringToTop();
                c.state.label.addStrokeColor("#3d1223", 0);
                c.state.label.strokeThickness = 4;
                c.state.label.visible = true;

                this.refreshLabelForCell(c);
                AnimationUtils.appear(this.game, c.state.sprite, delay)
                AnimationUtils.appear(this.game, c.state.label, delay)
                delay += 100;
            }
        })
        this.bringUiToTop();
        this.refreshCovers();

        UserService.getUser().increaseBoostersCount(BoosterType.beans, -1);
        ServerStoreComponent.syncronizeUserWithServer();
        this.bottomPanel.refresh();
    }

    public useRainbow() {
        let sprite = SpriteUtils.createSprite(this.game, this.game.width / 2, this.game.height + this.game.camera.y + 100, "rainbowPotionBig");
        sprite.anchor.set(0.5);
        this.add.existing(sprite);

        ComplexAnimationUtils.doHighlightSpecificItem(this.game, this, sprite);

        this.game.time.events.add(1200, () => {
            this.useMoonflower(sprite.x, sprite.y - 30, "4", 5);
        })
        UserService.getUser().increaseBoostersCount(BoosterType.rainbow, -1);
        ServerStoreComponent.syncronizeUserWithServer();
        this.bottomPanel.refresh();
    }
}