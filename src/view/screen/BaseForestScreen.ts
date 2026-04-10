import ForestDao from '../../core/dao/ForestDao';
import AimType from '../../core/model/enum/AimType';
import { AnimalsContents, ContentType } from '../../core/model/enum/ContentType';
import OpeningType from '../../core/model/enum/OpeningType';
import CellState from '../../core/model/forest/CellState';
import ForestAim from '../../core/model/forest/ForestAim';
import ForestCell from '../../core/model/forest/ForestCell';
import AdminService from '../../core/service/AdminService';
import CustomizationType from '../../core/model/enum/CustomizationType';
import YandexGamesHelper from '../../core/service/integration/YandexGamesHelper';
import BaseCellsProvider from '../../core/service/provider/BaseCellsProvider';
import BoostersProvider from '../../core/service/provider/BoosterProvider';
import CellsPainter from '../../core/service/provider/CellsPainter';
import FlowersProvider from '../../core/service/provider/FlowersProvider';
import LadybugsProvider from '../../core/service/provider/LadybugsProvider';
import Settings from '../../core/service/Settings';
import ServerStoreComponent from '../../core/service/store/ServerStoreComponent';
import UserService from '../../core/service/UserService';
import AnalyticUtils from '../../core/utils/AnalyticUtils';
import AnimationUtils from '../../core/utils/AnimationUtils';
import SoundUtils from '../../core/utils/SoundUtils';
import SpriteUtils from '../../core/utils/SpriteUtils';
import BoosterInfoPanel from '../component/forest/BoosterInfoPanel';
import ConfirmDefeatPanel from '../component/forest/ConfirmDefeatPanel';
import StartLevelPanel from '../component/house/StartLevelPanel';
import BasePanel from '../component/panel/BasePanel';
import DelayableAction from '../component/panel/DelayableAction';
import Game from '../game/Game';
import ForestType from './../../core/model/forest/ForestType';
import ForestUtils from './../../core/utils/ForestUtils';
import LocationUtils from './../../core/utils/LocationUtils';
import EducationPanel from './../component/dialog/EducationPanel';
import AimsStartPanel from './../component/forest/AimsStartPanel';
import LevelCompletePanel from './../component/forest/CompleteLevelPanel';
import FailPanel from './../component/forest/FailPanel';
import ForestBottomPanel from './../component/forest/ForestBottomPanel';
import ForestTopPanel from './../component/forest/ForestTopPanel';
import GiveUpPanel from './../component/forest/GiveUpPanel';
import EnergyDetailsPanel from './../component/house/EnergyDetailsPanel';
import ShopPanel from './../component/house/ShopPanel';
import ColorTransitionPanel from './../component/panel/ColorTransitionPanel';
import Label from './../component/panel/Label';
import TreesTransitionPanel from './../component/panel/TreesTransitionPanel';
import DialogScreen from "./common/DialogScreen";
import EditorScreen from './EditorScreen';
import ForestScreen from './ForestScreen';
import HouseScreen from './HouseScreen';
import CellsProvider from './../../core/service/provider/CellsProvider';
import ConfirmPanel from './../component/house/ConfirmPanel';
import EventUtils from './../../core/utils/EventUtils';
import EventType from '../../core/model/event/EventType';
import ComplexAnimationUtils from './../../core/utils/ComplexAnimationUtils';
import { Easing } from 'phaser-ce';
import LocalizationService from '../../core/localization/LocalizationService';
import TaskService from '../../core/service/TaskService';

export default abstract class BaseForestScreen extends DialogScreen {
    private static readonly FAKE_TREES_RELEASE_DELAY = 120;

    public cellsProvider: CellsPainter;
    public flowersProvider: FlowersProvider;
    public ladybugsProvider: LadybugsProvider;
    public boostersProvider: BoostersProvider;

    public topPanel: ForestTopPanel;
    public bottomPanel: ForestBottomPanel;
    public confirmPanel: ConfirmDefeatPanel;

    public layoutHolder: BasePanel;
    public uiHolder: BasePanel;
    // public uiHolder: Phaser.Group;

    public failPanel: FailPanel;
    public aimsPanel: AimsStartPanel;
    public giveUpPanel: GiveUpPanel;
    protected educationPanel: EducationPanel;
    public boosterInfoPanel: BoosterInfoPanel;

    protected winOrLooseChecker: DelayableAction;
    protected levelStopped: boolean;
    public static skipNextTime = false;

    protected mapleLabel: Label;
    protected mapleLabelBg: Phaser.Sprite;
    protected maple: Phaser.Sprite;
    protected mapleFace: Phaser.Sprite;
    public energyDetailsShown: boolean = false;
    private onDialogEndCallback: () => void;
    private fakeTrees: Phaser.Sprite;

    protected abstract createCells(): void;
    protected abstract onCellOpen(cellState: CellState, openingType: OpeningType): void;
    protected abstract onCellClick(cell: ForestCell): void;
    protected abstract placePreboosters(): void;
    protected abstract placeEventPreboosters(): {x:number, y:number}[];

    protected linesScrolled = 0;
    private scrollToY = 0;
    private longLevelArrow: Phaser.Sprite;
    private fadeStrip: Phaser.TileSprite;
    private grassStrip: Phaser.TileSprite;
    private fadeBlockers: Phaser.Sprite[] = [];

    init() {
        super.init();

        if (!Game.WHITE_TRANSITION) {
            this.fakeTrees = this.add.existing(new TreesTransitionPanel(this.game, false, 0, 0));
        }
    }

    preload() {
        this.loadBaseAtlases();
        this.loadOptionalAtlases();
    }

    create() {
        super.create();
        console.log("Game size: " + this.game.width + " " + this.game.height);
        this.world.setBounds(0, 0, this.game.width, this.game.height);
        this.game.input.onDown.add((event: MouseEvent) => this.onMouseUp(event));
        this.linesScrolled = 0;
        this.initialize();
    }

    initialize() {

        SoundUtils.startLevel();
        TaskService.resetPendingLevelCollections();

        this.scrollToY = 0;

        this.game.kineticScrolling.stop();
        let body = document.getElementById("content");
        body.removeEventListener("wheel", EditorScreen.onMouseWheel);

        let user = UserService.getUser();

        user.setJustCompletedLevel(false);

        if (AdminService.isSkipMode() || ForestScreen.skipNextTime) {
            ForestScreen.skipNextTime = false;
            if (EventUtils.hasActiveLevelSession()) {
                EventUtils.completeActiveEventLevel();
            } else {
                user.incrementCurrentForest();
            }
            user.setJustCompletedLevel(true);
            this.startScreen(HouseScreen, true, false)
            return;
        }

        console.log("Initialization started")

        this.setOnClickAnimation(null);

        this.winOrLooseChecker = new DelayableAction(this.game, () => this.doCheckWinOrLooseConditions())
        this.levelStopped = false;

        this.layoutHolder = new BasePanel(this.game, 0, 0);

        let forestType = this.getForestType();
        this.cellsProvider = new CellsPainter(forestType, this.game);
        // if (!AdminService.isAdminUser()) {
            LocationUtils.getMiniGameLayout(this.game, this.cellsProvider, this.getForestType()).forEach(
                d => {
                    // this.addSprite(d)
                    this.layoutHolder.addSprite(d)
                    // this.add.existing(d)
                    if (d.name == "mapleLabel") {
                        this.mapleLabel = <Label>d;
                    } else if (d.name == "labelBg") {
                        this.mapleLabelBg = <Phaser.Sprite>d;
                    } else if (d.name == "maple" ) {
                        this.maple = <Phaser.Sprite>d;
                        AnimationUtils.heartBeat3(this.game, this.maple)
                    } else if (d.name == "mapleFace") {
                        this.mapleFace = <Phaser.Sprite>d;
                        AnimationUtils.heartBeat3(this.game, this.mapleFace)
                    }
                }
            );
        // }

        this.addPanel(this.layoutHolder);

        this.flowersProvider = new FlowersProvider(this.game, this, this.cellsProvider);
        this.ladybugsProvider = new LadybugsProvider(this.game, this, this.cellsProvider);
        this.boostersProvider = new BoostersProvider(this.game, this, this.cellsProvider, this.ladybugsProvider);

        this.uiHolder = new BasePanel(this.game, 0, 0);

        // this.uiHolder = this.game.add.group();
        this.uiHolder.fixedToCamera = true;
        this.addPanel(this.uiHolder);

        this.cellsProvider.calculateStartRealY() //for isAllCellsOnScreen 
        if (this.cellsProvider.isAllCellsOnScreen) {
            //for education
            this.addSprite(this.topPanel = new ForestTopPanel(this.game, forestType, this));
            this.addSprite(this.bottomPanel = new ForestBottomPanel(this.game, forestType, this));
        } else {
            //for long level with acorns
            this.uiHolder.addChild(this.topPanel = new ForestTopPanel(this.game, forestType, this));
            this.uiHolder.addChild(this.bottomPanel = new ForestBottomPanel(this.game, forestType, this));
        }

        if (AdminService.isEditMode()) {
            // let winButton = SpriteUtils.createButton(this.game, this.game.width- 150, 55, "winButton", ()=>{
            //     this.instantlyWin();
            // })
            // winButton.anchor = new Phaser.Point(0.5, 0.5);
            // this.uiHolder.addChild(winButton);
        }

        this.createCells();

        if (!this.cellsProvider.isAllCellsOnScreen) {

            // let keyAndRect = SpriteUtils.getKeyAndRect(this.game, "fadeStrip");
            // let bmd = this.game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
            let bgImage = LocationUtils.getBg(this.getForestType().environment);

            let keyAndRect = SpriteUtils.getKeyAndRect(this.game, "fadeStrip");
            let bmd = this.game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
            console.log("fadeStrip: " + keyAndRect.atlasRect.width + " " + keyAndRect.atlasRect.height)

            bmd.alphaMask(SpriteUtils.createBitmapData(this.game, bgImage), SpriteUtils.createBitmapData(this.game, 'fadeStrip'));

            // let bmd = SpriteUtils.createBitmapData(this.game, "fadeStrip");
            // bmd.alphaMask(SpriteUtils.createBitmapData(this.game, bgImage), SpriteUtils.createBitmapData(this.game, 'fadeStrip'));

            this.fadeStrip = new Phaser.TileSprite(this.game, 0, this.game.height - 515 + 370 + 56 - 30, this.game.width, 107, bmd);
            this.fadeStrip.anchor.set(0, 1)
            this.fadeStrip.inputEnabled = false;
            this.fadeStrip.fixedToCamera = true;
            this.addSprite(this.fadeStrip);

            this.cellsProvider.getCells().filter(c => this.isUnderFadeStrip(c)).forEach(c => {
                let blocker = SpriteUtils.createSprite(this.game, c.state.sprite.x, c.state.sprite.y, "hex")
                blocker.anchor.set(0.5)
                blocker.inputEnabled = true;
                blocker.alpha = 0.001;
                this.add.existing(blocker);
                blocker.fixedToCamera = true;
                this.fadeBlockers.push(blocker);

                if(AdminService.cacheComplexImages() && this.isUnderFadeStrip(c, CellsProvider.CELL_HEIGHT) && !c.state.cover.isLocked()){
                    c.state.cover.visible = false;
                }
            })

            this.grassStrip = SpriteUtils.createTileSprite(this.game, 0, this.game.height, this.game.width, this.game.height - this.fadeStrip.y + 2, bgImage);
            this.grassStrip.anchor.set(0, 1)
            this.grassStrip.inputEnabled = false;
            this.grassStrip.fixedToCamera = true;
            this.addSprite(this.grassStrip);

            this.longLevelArrow = SpriteUtils.createSprite(this.game, this.game.width / 2, this.game.height - 115 - 50 - 35, "arrowSmall");
            this.longLevelArrow.scale.set(1, 0.8)
            this.longLevelArrow.fixedToCamera = true;
            this.longLevelArrow.alpha = 0;
            this.longLevelArrow.anchor.set(0.5)
            this.addSprite(this.longLevelArrow)
            this.game.add.tween(this.longLevelArrow).to({ alpha: [0.7, 0, 0.7, 0, 0, 0] }, 4000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, 5000, -1, false)
        }
        // if (!AdminService.isAdminUser()) {
            LocationUtils.applyBushesConfiguration(this.cellsProvider, this.layoutHolder.children, this.getForestType().bushes);
        // }

        this.game.world.bringToTop(this.uiHolder);

        this.addPanel(this.giveUpPanel = new GiveUpPanel(this.game, this, this.game.width / 2, this.game.height / 2, this.topPanel.getAims(),
            this.getCurrentLevelNumber(), () => this.goToHouseFromGiveUp(), () => this.repeatLevel()));
        this.giveUpPanel.fixedToCamera = true;

        this.addPanel(this.educationPanel = new EducationPanel(this.game, this, this.cellsProvider.getCells(), this.ladybugsProvider.getLadybugs(),
            this.topPanel.getAims(), this.getForestType(), this.cellsProvider.calculateStartRealY() - BaseCellsProvider.CELL_HEIGHT / 2));
        this.educationPanel.fixedToCamera = true;

        this.game.world.setBounds(0, 0, this.game.width, this.game.height * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER)

        this.lockScreen();
        let treesTime = 500;

        if (Game.WHITE_TRANSITION) {
            // this.uiHolder.addChild(new WhiteTransitionPanel(this.game, false, treesTime, 0));
            this.uiHolder.addChild(new ColorTransitionPanel(this.game, 0x000000, treesTime, 0, false));
            Game.WHITE_TRANSITION = false;
        } else {
            this.addTopOverlay(new TreesTransitionPanel(this.game, false, treesTime, treesTime));
        }

        this.releaseFakeTrees(Game.WHITE_TRANSITION ? 0 : BaseForestScreen.FAKE_TREES_RELEASE_DELAY);

        this.aimsPanel = new AimsStartPanel(this.game, 0, -220, this.topPanel.getAims(), false, this.getForestType(), () => {
            this.unlockScreen();
            YandexGamesHelper.startGameplay();
            this.educationPanel.showEducation(null, 0);
            let havePreboosters = StartLevelPanel.PREBOOSTERS_TO_SPEND.length > 0;

            if(havePreboosters){
                user.setSpendOnLevel(user.getCurrentForest() + 1);
            }

            this.placePreboosters();

            this.game.time.events.add(havePreboosters? 1000 : 1, ()=>{

                let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
                let user = UserService.getUser();
                let eventSprite;

                if(eventInfo && user.getWinsInRow() > 0 && !this.educationPanel.shown){
                    eventSprite = SpriteUtils.createSprite(this.game, this.game.width / 2, this.game.height + this.game.camera.y + 100, "lukoshkoIcon2");
                    eventSprite.anchor.set(0.5);
                    this.add.existing(eventSprite);
                    ComplexAnimationUtils.doHighlightSpecificItem(this.game, this, eventSprite, false, 1.25, true);
                }

                this.game.time.events.add(300, ()=>{
                    let positions = this.placeEventPreboosters();

                    if(positions.length > 0 && !this.educationPanel.shown){
                        positions.forEach(p => {
                            let firefly = SpriteUtils.createSprite(this.game, this.game.width/2, this.game.height/4*3, "p1");
                            firefly.scale.set(0);
                            firefly.anchor.set(0.5);
                            this.addSprite(firefly);
                            // this.game.time.events.add(1200, () => {
                                this.game.add.tween(firefly).to({ x: p.x, y: [Math.min(p.y, this.game.height/4*3 - 300), p.y] },
                                1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300).interpolation(Phaser.Math.bezierInterpolation).start();

                                firefly.alpha = 0;
                                this.game.add.tween(firefly).to({ alpha: 1 }, 150, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300);
                                this.game.add.tween(firefly.scale).to({ x: 2, y: 2 }, 150, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 300);
                                firefly.alpha = 1;
                                this.game.add.tween(firefly).to({ alpha: 0 }, 50, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Easing.Quadratic.In, true, 950 + 300);
                                firefly.alpha = 0;

                                this.time.events.add(1300, () => {
                                    AnimationUtils.highlight(this.game, p.x, p.y, "splashY", 0, 1.5);
                                });
                            // });
                        })
                        if(eventSprite) eventSprite.bringToTop();
                    }
                });
            });

            this.scheduleEventLevelStartReplica(havePreboosters ? 1800 : 400);
        })
        this.addSprite(this.aimsPanel);

        if (AdminService.isLooseMode()) {
            console.log("LOOSE MODE!")
            this.topPanel.activateLooseMode();
        }

        this.confirmPanel = new ConfirmDefeatPanel(this.game, this.game.width / 2, this.game.height / 2, () => {
            this.confirmPanel.close();
            this.giveUp();
        });
        this.addPanel(this.confirmPanel);
    }

    protected isUnderFadeStrip(c: ForestCell, dy?:number):boolean{
        dy = dy || 0;
        return this.fadeStrip && (c.state.sprite.y > (this.fadeStrip.y + dy - this.fadeStrip.height) + 10);
    }

    // private isAllCellsOnScreen():boolean{
    //     if(this.cellsProvider.getRowsCount() <= BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL){
    //         return true;
    //     }
    //     return (this.cellsProvider.getCells()[this.cellsProvider.getCells().length - 1].state.sprite.y
    //     + BaseCellsProvider.CELL_HEIGHT / 2) < (this.game.height - this.bottomPanel.height) - 120;
    // }

    protected tryToScroll(scrollRows?: number) {
        let firstRowY = this.cellsProvider.getCells()[0].Y;
        let maxScrollRows = this.cellsProvider.getRowsCount() - BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL;

        let maxCameraY = LocationUtils.getMaxCameraY(this.cellsProvider);
        let scrollRowsAddition = 3;

        console.log("CAMERA Y: " + this.game.camera.y)
        console.log("MAX CAMERA Y: " + maxCameraY)

        console.log("SCROLL: rowsCount = " + this.cellsProvider.getRowsCount())

        if (!scrollRows) {
            scrollRows = 0;
        }

        console.log("SCROLL: IS ALL CELLS ON SCREEN? " + this.cellsProvider.isAllCellsOnScreen)
        if (!this.cellsProvider.isAllCellsOnScreen) {
            let needScrollMore = true;
            console.log("NEED SCROLL MORE!")

            this.cellsProvider.getCells().forEach(c => {
                let row = c.Y - firstRowY;
                if (row >= this.linesScrolled && row <= this.linesScrolled + scrollRows + scrollRowsAddition) {
                    if (this.cellsProvider.isInteractiveState(c.state) && !(c.state.content in AnimalsContents) &&
                        !c.state.opened || c.state.cover.getCankerBerriesCount() > 0 || c.state.berries.length > 0
                        || c.occupiedByFlower || c.state.content == ContentType.shell || c.state.content == ContentType.moonflowerClosed) {
                        needScrollMore = false;
                        console.log("NO NEED TO SCROLL (1): " + c.state.content)
                    }
                }
            });

            this.ladybugsProvider.getLadybugs().forEach(l => {
                let row = l.Y - firstRowY;
                if (row < this.linesScrolled + scrollRows + scrollRowsAddition) {
                    needScrollMore = false;
                    console.log("NO NEED TO SCROLL (2): " + l.Y + " " + l.X)
                }
            })

            this.flowersProvider.flowers.forEach(f => {
                let fY = this.cellsProvider.calculateRelativeYByRealPosition(f.x, f.y)
                let row = fY - firstRowY;
                // console.log("FLOWER Y: " + fY)
                if (row < this.linesScrolled + scrollRows + scrollRowsAddition && !f.collected) {
                    needScrollMore = false;
                    console.log("NO NEED TO SCROLL (3): " + fY)
                }
            })

            console.log("SCROLL: this.linesScrolled: " + this.linesScrolled + "; scrollRows: " + scrollRows + "; maxScrollRows: " + maxScrollRows)
            if (needScrollMore && (this.linesScrolled + scrollRows < maxScrollRows)) {
                console.log("TRY TO SCROLL MORE!")
                this.tryToScroll(scrollRows + scrollRowsAddition)
            } else if (scrollRows > 0) {
                scrollRows = Math.min(scrollRows, maxScrollRows - this.linesScrolled);
                this.linesScrolled += scrollRows;
                this.game.tweens.removeFrom(this.camera);
                this.scrollToY = Math.min(this.scrollToY + LocationUtils.getScrollStep(this.cellsProvider) * scrollRows, maxCameraY)

                if (maxCameraY - this.scrollToY < 200) {
                    this.scrollToY = maxCameraY;
                }

                this.game.add.tween(this.camera).to({ y: this.scrollToY }, (this.camera.y - this.scrollToY) / 110 * 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, 1000, 0, false);

                if(AdminService.cacheComplexImages()){
                    this.cellsProvider.getCells().forEach(c => {
                        if(!c.state.opened 
                            &&  this.isUnderFadeStrip(c, CellsProvider.CELL_HEIGHT) 
                        && !this.isUnderFadeStrip(c,  this.scrollToY - this.camera.y + CellsProvider.CELL_HEIGHT * 2)
                            ){
                            c.state.cover.visible = true;
                            c.state.cover.cacheAsBitmap = false;
                            c.state.cover.cacheAsBitmap = true;
                        }
                    })
                }

                if (this.longLevelArrow && this.scrollToY == maxCameraY) {
                    this.game.tweens.removeFrom(this.longLevelArrow);
                    this.game.add.tween(this.longLevelArrow).to({ alpha: [0] }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, 0, 0, false)
                    this.game.add.tween(this.fadeStrip).to({ alpha: [0] }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, 0, 0, false)
                    this.game.add.tween(this.grassStrip).to({ alpha: [0] }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, 0, 0, false)
                    this.fadeBlockers.forEach(b => b.kill());
                    this.fadeBlockers = [];
                }
            }
        }

        console.log("this.linesScrolled: ", this.linesScrolled)
        console.log("maxScrollRows: ", maxScrollRows)
    }

    public instantlyWin() {
        let user = UserService.getUser();
        let isEventLevel = EventUtils.hasActiveLevelSession();
        TaskService.recordSpentEnergy(this.topPanel.getSpentEnergy());
        TaskService.recordCompletedLevel(1);

        if (isEventLevel) {
            EventUtils.completeActiveEventLevel();
        } else if (user.getCurrentForest() == this.getCurrentLevelIndex()) {
            let hardLevelAddition = this.getForestType().hardLevel ? StartLevelPanel.hardLevelAwardAddition : 0;
            user.setSupermoney(user.getSupermoney() + ForestUtils.getPrizeGemsCount(this.topPanel.getStepsLeft()) + hardLevelAddition)
            user.incrementCurrentForest();
        }

        user.setJustCompletedLevel(true);
        YandexGamesHelper.stopGameplay();
        this.playAnimation("goHome");
    }

    public delayWinOrLooseCheck(time: number) {
        this.winOrLooseChecker.delay(time);
    }

    private doCheckWinOrLooseConditions() {
        console.log("CHECK WIN OR LOOSE: this.levelStopped = " + this.levelStopped)

        if (!this.levelStopped) {
            this.tryToScroll();
            let closedCells = this.cellsProvider.getCells().filter(c => !c.state.opened && !c.state.cover.isDark() && !c.state.cover.isLocked()).length;
            if (this.topPanel.getAims().filter(aim => aim.countLeft > 0).length == 0 || closedCells == 0) {
                if (this.tryShowEventLevelEndReplica()) {
                    return;
                }

                this.showWinPanel();
            }
        }
    }

    private onCloseFailPanel() {
        if (this.failPanel.alpha != 1) {
            return;
        }

        let eventInfo = EventUtils.getActualEvents().filter(e => e.eventType == EventType.lukoshko).shift();
        let user = UserService.getUser();
        
        if(eventInfo && user.getWinsInRow() > 0){
            let confirmPanel = new ConfirmPanel(
                this.game,
                LocalizationService.get('ui.confirmation'),
                LocalizationService.get('ui.surrender'),
                LocalizationService.get('ui.confirmDefeat.withBonus'),
                () => {
                    this.failPanel.close();

                    this.game.time.events.add(750, () => {
                        this.giveUp();
                    }, this);
                }
            )
            this.addPanel(confirmPanel);
            confirmPanel.show();
            
        } else {
            this.failPanel.close()
    
            this.game.time.events.add(750, () => {
                this.giveUp();
            }, this);
        }
    }

    private goToHouseFromGiveUp() {
        if (this.giveUpPanel.alpha != 1) {
            return;
        }
        this.goToHouse();
    }

    private goToHouse() {
        TaskService.resetPendingLevelCollections();
        YandexGamesHelper.stopGameplay();
        EventUtils.clearActiveLevelSession();
        let treesTime = 500;
        this.addTopOverlay(new TreesTransitionPanel(this.game, true, treesTime, 0));
        this.game.time.events.add(treesTime * 2, function () {
            this.startScreen(HouseScreen, true, false);
        }, this)
    }

    private repeatLevel() {
        if (this.giveUpPanel.alpha != 1) {
            return;
        }
        TaskService.resetPendingLevelCollections();
        YandexGamesHelper.stopGameplay();
        AnalyticUtils.logLevelStart();
        console.log("REPEAT LEVEL!")
        ServerStoreComponent.syncronizeUserWithServer();

        let treesTime = 500;
        this.addTopOverlay(new TreesTransitionPanel(this.game, true, treesTime, 0));
        this.game.time.events.add(treesTime * 2, () => {
            this.startScreen(ForestScreen, true, false);
        }, this)
    }

    private onContinueFailPanel() {
        if (this.failPanel.alpha != 1) {
            return;
        }

        let user = UserService.getUser();
        if (user.getSupermoney() < ForestUtils.ADDITIONAL_STEPS_GEM_PRICE) {
            let shopPanel = new ShopPanel(this.game, this, () => this.onContinueFailPanel());
            shopPanel.show()
            this.addPanel(shopPanel);
            this.failPanel.hideHelper();
            return;
        }

        user.setSupermoney(user.getSupermoney() - ForestUtils.ADDITIONAL_STEPS_GEM_PRICE);
        ServerStoreComponent.syncronizeUserWithServer();
        this.continueLevelAfterFail();
    }



    public getAimWithType(type: AimType): ForestAim {
        return this.topPanel.getAims().filter(aim => aim.type == type).shift();
    }

    public unexpectedFail(): void {
        this.levelStopped = true;
        YandexGamesHelper.stopGameplay();

        let deltaY = this.getCurrentLevelIndex() > LocationUtils.CAT_FROM_LEVEL ? 100 : 0;
        this.failPanel = new FailPanel(this.game, this.getForestType(), this.game.width / 2, this.game.height / 2 + deltaY,
            this.topPanel.getAims(), () => this.onCloseFailPanel(), () => this.onContinueFailPanel(), this.canContinueWithRewardedVideo() ? () => this.onContinueFailPanelByRewardedAd() : null);
        this.addPanel(this.failPanel);
        this.failPanel.fixedToCamera = true;
        // this.game.world.bringToTop(this.uiHolder);
        this.failPanel.show();
    }

    public giveUp(): void {
        AnalyticUtils.logLevelFail(this.topPanel.aims.map(a => a.countLeft).reduce((sum, current) => sum + current, 0));

        let user =  UserService.getUser();
        user.setInterruptWinsRow(false);
        user.setWinsInRow(0);
        TaskService.resetPendingLevelCollections();
        
        this.levelStopped = true;
        YandexGamesHelper.stopGameplay();
        this.giveUpPanel.show();
    }

    public stopLevelForDialog(): void {
        this.winOrLooseChecker.delay(1000000000);
    }

    public getForestType(): ForestType {
        if(ForestUtils.forestTypeToPLay) return ForestUtils.forestTypeToPLay;

        if (EventUtils.hasActiveLevelSession()) {
            let eventForestType = EventUtils.getActiveEventForestType();
            if (eventForestType) {
                return eventForestType;
            }
        }

        return ForestDao.getForestType(UserService.getUser().getCurrentForest());
    }

    protected getCurrentLevelIndex(): number {
        if (EventUtils.hasActiveLevelSession()) {
            return EventUtils.getActiveLevelIndex();
        }
        return ForestDao.indexOf(this.getForestType());
    }

    protected getCurrentLevelNumber(): number {
        return this.getCurrentLevelIndex() + 1;
    }

    public onDialogEnd(): void {
        if (this.onDialogEndCallback) {
            let callback = this.onDialogEndCallback;
            this.onDialogEndCallback = null;
            callback();
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.aimsPanel.onMouseUp();

        // //TODO Этот кусок сильно лагает!
        // let closestCellOrder = -100;
        // for(let i = -20; i<100; i++){
        //     let currentPos = this.cellsProvider.calculateRelativePosition(i);
        //     let currentDist = Utils.dist(this.ruler.aimX, this.ruler.aimY, this.cellsProvider.calculateRealX(currentPos.x, currentPos.y), this.cellsProvider.calculateRealY(currentPos.x, currentPos.y))
        //     let closestPos = this.cellsProvider.calculateRelativePosition(closestCellOrder);
        //     let closestDist = Utils.dist(this.ruler.aimX, this.ruler.aimY, this.cellsProvider.calculateRealX(closestPos.x, closestPos.y), this.cellsProvider.calculateRealY(closestPos.x, closestPos.y))
        //     if(currentDist < closestDist){
        //         closestCellOrder = i;
        //     }
        // }

        // let cell = this.cellsProvider.getCellByOrder(closestCellOrder);

        // console.log("Clicked cell order: " + closestCellOrder + "; content: " + (cell && cell.state ? cell.state.content : null))

        // if(cell){
        //     this.onCellClick(cell)
        // }

        super.onMouseUp(event);
    }

    public bringUiToTop(): void {
        if (this.uiHolder) this.uiHolder.bringToTop();

        if (this.boosterInfoPanel) {
            this.boosterInfoPanel.bringToTop();
        }

        if (this.failPanel && (this.failPanel.opened || this.failPanel.processing)) {
            this.game.world.bringToTop(this.failPanel.blackTransparent)
            this.failPanel.bringToTop();
        }
        if (this.giveUpPanel && (this.giveUpPanel.opened || this.giveUpPanel.processing)) {
            this.game.world.bringToTop(this.giveUpPanel.blackTransparent)
            this.giveUpPanel.bringToTop();
        }


    }

    playAnimation(animationId: string) {
        if (animationId == "goHome") {
            this.goToHouse();
        } else if (animationId == "hideEducation") {
            this.educationPanel.hideEducation();
        } else if (animationId == "adoptCat") {
            this.educationPanel.hideEducation(0);
            let catCell = this.cellsProvider.getCells().filter(cell => cell.state.content == ContentType.specificItem).shift();
            this.game.add.tween(catCell.state.sprite).to({ x: catCell.state.sprite.x, y: catCell.state.sprite.y - 360, alpha: 0 }, 1000, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
            // UserManager.getUser().addSpecialItem("homeHex");
        } else if (animationId == "showDiary") {
            let diaryCell = this.cellsProvider.getCells().filter(cell => cell.state.content == ContentType.specificItem).shift();
            this.game.time.events.add(1000, () => {
                diaryCell.state.sprite.alpha = 0;
                diaryCell.state.sprite.visible = false;
            })
            this.dialogPanel.diaryPreset = { x: diaryCell.state.sprite.x, y: diaryCell.state.sprite.y, spriteId: "", scaleX: 82 / 960, scaleY: 92 / 1024, anchorX: 0.5, anchorY: 0.5, rotation: 10 }
        } else if (animationId == "winLevel") {
            this.educationPanel.hideEducation();
            this.dialogPanel.updateReplica();
            this.topPanel.getAims().forEach(aim => {
                aim.countLeft = 0;
            })
            this.topPanel.updateAimCounters(0);
            this.winOrLooseChecker.clear();
            this.winOrLooseChecker.delay(10);
        } else if (animationId == "exploreHouse") {
            let user = UserService.getUser();
            let treesTime = 500;
            user.setCurrentForest(2);
            YandexGamesHelper.stopGameplay();
            this.addTopOverlay(new TreesTransitionPanel(this.game, true, treesTime, 0));
            this.game.time.events.add(treesTime * 2, function () {
                this.startScreen(HouseScreen, true, false);
            }, this)
            AnalyticUtils.logLevelComplete(this.topPanel.getStepsLeft());
        } else if (animationId && animationId != "") {
            console.log("WARNING! UNKNOWN FOREST ANIMATION ID: " + animationId);
        }
    }

    private canContinueWithRewardedVideo(): boolean {
        return AnalyticUtils.getCustomization() == CustomizationType.yandexGames && YandexGamesHelper.canShowRewardedVideo();
    }

    private scheduleEventLevelStartReplica(delay: number): void {
        this.game.time.events.add(delay, () => {
            if (!EventUtils.hasActiveLevelSession() || !this.dialogPanel || this.dialogPanel.replicaPanel) {
                return;
            }
            if (this.educationPanel && this.educationPanel.shown) {
                return;
            }
            if (this.dialogPanel.getNextReplica()) {
                this.dialogPanel.updateReplica(true);
            }
        });
    }

    private tryShowEventLevelEndReplica(): boolean {
        if (!EventUtils.hasActiveLevelSession() || !EventUtils.activateLevelEndReplica()) {
            return false;
        }

        if (!this.dialogPanel.getNextReplica()) {
            EventUtils.clearActiveLevelReplicaStage();
            return false;
        }

        this.levelStopped = true;
        YandexGamesHelper.stopGameplay();
        this.onDialogEndCallback = () => this.showWinPanel();
        this.game.time.events.add(50, () => {
            this.dialogPanel.updateReplica(true);
        });
        return true;
    }

    private showWinPanel(): void {
        console.log("WIN!")

        SoundUtils.winLevel();

        this.levelStopped = true;
        YandexGamesHelper.stopGameplay();
        TaskService.recordSpentEnergy(this.topPanel.getSpentEnergy());
        TaskService.recordCompletedLevel(1);

        let user = UserService.getUser();
        let isEventLevel = EventUtils.hasActiveLevelSession();
        let completedLevelNumber = this.getCurrentLevelNumber();
        let shouldShowInterstitial = !isEventLevel && user.getCurrentForest() == this.getCurrentLevelIndex() && completedLevelNumber % 3 == 0;
        let forestType = this.getForestType();
        let completePanel = new LevelCompletePanel(
            this.game,
            this,
            this.game.width / 2,
            this.game.height / 2,
            this.topPanel.getAims(),
            forestType,
            () => {
                user.setJustCompletedLevel(true);
                if (shouldShowInterstitial) {
                    YandexGamesHelper.showFullscreenAdv(() => this.playAnimation("goHome"));
                } else {
                    this.playAnimation("goHome");
                }
            },
            isEventLevel ? {
                aims: this.topPanel.getAims(),
                spentEnergy: this.topPanel.getSpentEnergy(),
                targetSteps: this.topPanel.getTargetSteps(),
                gemsCount: 0
            } : null
        );
        this.addSprite(completePanel);

        let delay = 1000;
        let animationTime = 500;

        this.lockScreenFor(delay + animationTime);
        completePanel.show(delay, animationTime);

        AnalyticUtils.logLevelComplete(this.topPanel.getStepsLeft());

        if (isEventLevel) {
            EventUtils.completeActiveEventLevel();
        } else if (user.getCurrentForest() == this.getCurrentLevelIndex()) {
            let hardLevelAddition = forestType.hardLevel ? StartLevelPanel.hardLevelAwardAddition : 0;
            user.setSupermoney(user.getSupermoney() + ForestUtils.getPrizeGemsCount(this.topPanel.getStepsLeft()) + hardLevelAddition)
            user.incrementCurrentForest();
        }
    }

    private onContinueFailPanelByRewardedAd() {
        if (this.failPanel.alpha != 1) {
            return;
        }

        YandexGamesHelper.showRewardedVideo(() => {
            // Reward is granted only after the ad is fully completed.
        }, (rewarded, reason) => {
            if (this.failPanel) {
                this.failPanel.bringToTop();
            }

            if (rewarded) {
                this.continueLevelAfterFail();
                return;
            }

            if (reason == 'error' || reason == 'offline' || reason == 'unavailable') {
                this.showRewardedAdUnavailableInfo();
            }
        });
    }

    private continueLevelAfterFail(): void {
        let user = UserService.getUser();

        AnalyticUtils.logContinueLevelComplete(this.topPanel.aims.map(a => a.countLeft).reduce((sum, current) => sum + current, 0));
        user.setSpendOnLevel(user.getCurrentForest() + 1);
        SoundUtils.restoreSteps();

        this.topPanel.restoreStepsForMoney();
        this.bottomPanel.refresh();
        this.levelStopped = false;

        this.failPanel.close();
        this.game.time.events.add(350, () => YandexGamesHelper.startGameplay());
    }

    private showRewardedAdUnavailableInfo(): void {
        let panel = new ConfirmPanel(
            this.game,
            LocalizationService.get('ui.confirmation'),
            LocalizationService.get('ui.ok'),
            LocalizationService.get('ui.rewardedAdUnavailable', 'Реклама сейчас недоступна. Попробуйте чуть позже.')
        );
        this.addPanel(panel);
        panel.show();
    }

    public showEnergyPanel(): void {
        if (this.energyDetailsShown) {
            return;
        }

        let panel = new EnergyDetailsPanel(this.game, this, {
            onShow: () => {
                this.energyDetailsShown = true;
            },
            onClose: () => {
                this.energyDetailsShown = false;
                if (this.topPanel) {
                    this.topPanel.refreshEnergyLabel();
                }
            },
            onBought: () => {
                if (this.topPanel) {
                    this.topPanel.refreshEnergyLabel();
                }
                if (this.bottomPanel) {
                    this.bottomPanel.refresh();
                }
            }
        });
        this.addPanel(panel);
        panel.show();
    }

    private releaseFakeTrees(delay: number): void {
        if (!this.fakeTrees) {
            return;
        }

        this.game.time.events.add(delay || 0, () => {
            if (!this.fakeTrees) {
                return;
            }

            this.fakeTrees.alpha = 0;
            this.fakeTrees.kill();
            this.fakeTrees = null;
        });
    }

}
