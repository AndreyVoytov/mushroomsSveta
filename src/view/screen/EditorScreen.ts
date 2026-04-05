
import Separator from '../../core/model/forest/Separator';
import SeparatorType from '../../core/model/enum/SeparatorType';
import Game from './../../view/game/Game';
import UserService from '../../core/service/UserService';
import CellType from '../../core/model/enum/CellType';
import ForestUtils from './../../core/utils/ForestUtils';
import LocationUtils from './../../core/utils/LocationUtils';
import NeverError from './../../core/utils/NeverError';
import Utils from './../../core/utils/Utils';
import Environment from '../../core/model/enum/Environment';
import ForestType from './../../core/model/forest/ForestType';
import BaseScreen from "./common/BaseScreen";
import Preset from "../game/Preset";
import ForestScreen from './ForestScreen';
import BaseCellsProvider from '../../core/service/provider/BaseCellsProvider';
import BaseLadybugsProvider from '../../core/service/provider/BaseLadybugsProvider';
import CellsPainter from '../../core/service/provider/CellsPainter';
import { ContentType } from '../../core/model/enum/ContentType';
import EditorService from '../../core/service/EditorService';
import BasePanel from '../component/panel/BasePanel';
import LeafController from '../component/editor/LeafController';
import EditorContentPanel from '../component/editor/EditorContentPanel';
import ForestCellCover from '../component/forest/ForestCellCover';
import ForestDao from '../../core/dao/ForestDao';
import HeaderController from '../component/editor/HeaderController';
import ForestsConfiguration from '../../core/configuration/ForestConfiguration';
import BaseForestScreen from './BaseForestScreen';
import AnimationUtils from '../../core/utils/AnimationUtils';
import EditorCheckBoxPanel from '../component/editor/EditorCheckBoxPanel';
import EditorValuePanel from './../component/editor/EditorValuePanel';
import SpriteUtils from './../../core/utils/SpriteUtils';
import BiomType from './../../core/model/enum/BiomType';
import Label from './../component/panel/Label';
import LogPanel from './../component/panel/LogPanel';
import TestLevelRecord from './../../core/model/editor/TestLevelRecord';

export default class EditorScreen extends BaseScreen {

    public static MAX_LEVEL_SIZE_MULTIPLIER = 5;
    public cellsProvider: CellsPainter;
    public ladybugsProvider: BaseLadybugsProvider;
    public cellsHolder: BasePanel;
    public forestType: ForestType;
    
    public layoutHolder: BasePanel;

    private hardCheckbox: EditorCheckBoxPanel;
    private leafController: LeafController;
    private headerController: HeaderController;
    private contentPanels: EditorContentPanel[] = [];
    private brushes: (Phaser.Group | Phaser.Sprite)[] = [];

    private stepsPanel: EditorContentPanel;
    private maxStepsPanel: EditorContentPanel;
    private bushesPanel: EditorContentPanel;

    private contentPage = 0;
    private contentRows: number;
    private contentColumns: number;
    private contentPageLabel: Label;

    private brushesPage = 0;
    private brushesRows: number;
    private brushesColumns: number;
    private brushesPageLabel: Label;

    private static OFFSET_LAYOUT_Y = -250;
    private static OFFSET_CELL_Y = EditorScreen.OFFSET_LAYOUT_Y - 85


    public static test_levelId:string;
    public static test_wins:number = 0;
    public static test_looses:number = 0;
    public static test_stepsOnWin:number = 0;
    public static test_aimsOnLoose:number = 0;
    public static test_withMaxSteps = false;

    public static TEST_WITH_100_STEPS = false;
    public static TEST_ATTEMPTS = 30;
    // public static TEST_ATTEMPTS = 3;
    public static LEVELS_TO_TEST = 1;
    public static SAVE_RESULTS = false;

    private cellCovers: ForestCellCover[] = [];
    private separators: Phaser.Sprite[] = [];

    private brushType: BrushType = BrushType.CELL_DEPENDENT;
    private brushCellType: CellType = CellType.FOREST;

    private forestTypeHistory: ForestType[] = [];
    private Z_key: Phaser.Key;
    private Z_IsDown: boolean = false;

    private topPanel;
    private bottomPanel : Phaser.Sprite;
    private branchPanel: EditorValuePanel;
    private namePanel: EditorValuePanel;
    private iconPanel: EditorValuePanel;
    private iconPanelSprite: Phaser.Sprite;
    // private valuesLabel: Label;

    public create(): void {
        this.Z_IsDown = false;
        this.Z_key = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.forestTypeHistory = [];

        console.log("Game size: " + this.game.width + " " + this.game.height);
        this.world.setBounds(0, 0, this.game.width, this.game.height * 3);
        this.game.input.onTap.add((event: MouseEvent) => this.onMouseUp(event, true));

        let body = document.getElementById("content");
        body.removeEventListener("wheel", EditorScreen.onMouseWheel);
        body.addEventListener("wheel", EditorScreen.onMouseWheel);

        this.initialize();
    }

    initialize() {
        this.game.kineticScrolling.start();

        this.forestType = EditorService.getCurrentLevel();
        this.expandForestType();  
        
        this.layoutHolder = this.add.existing(new BasePanel(this.game, 0, 0));
        // LocationUtils.getMiniGameLayout(this.game, this.forestType).forEach(
        //     d => { d.y += EditorScreen.OFFSET_LAYOUT_Y; this.layoutHolder.addChild(d) }, this
        // );

        this.separators = [];
        this.contentPanels = [];
        this.brushes = [];

        this.cellsHolder = this.add.existing(new BasePanel(this.game, 0, 0));
        this.cellsProvider = new CellsPainter(this.forestType, this.game);
        this.ladybugsProvider = new BaseLadybugsProvider(this.game, this, this.cellsProvider);
        this.ladybugsProvider.offsetY = EditorScreen.OFFSET_CELL_Y;

        this.bushesPanel = new EditorContentPanel(this.game, this, 381 + 115 - 430, 58 - 17 + 40, this.forestType, EditorContentPanel.BUSHES_TYPE, 
            (current:number)=> Math.min(current + 1, LocationUtils.BUSHES_MAX_VALUE), (current:number)=> Math.max(current - 1, 0));

        this.bushesPanel.fixedToCamera = true;
        this.addPanel(this.bushesPanel);

        this.topPanel = this.attachUI("editorTopPanel");
        this.topPanel.fixedToCamera = true;
        this.bottomPanel = this.attachUI("editorBottomPanel");
        this.bottomPanel.fixedToCamera = true;

        let levelName = new Label(this.game, 90, 80, this.forestType.id, Label.COMMON_SMALL_STYLE)
        levelName.anchor.set(0.5)
        levelName.fixedToCamera = true;
        this.addSprite(levelName)

        this.branchPanel = new EditorValuePanel(this.game, "branch", () => EditorService.getCurrentLevelBranchId(), () => {
            EditorService.showSimpleList("Choose level branch", EditorService.getLevelBranchIds(), (branchId:string) => {
                EditorService.switchToLevelBranch(this.game, branchId, this.forestType.id);
            });
        });
        this.branchPanel.x = 255;
        this.branchPanel.y = 130;
        this.branchPanel.scale.set(0.58);
        this.branchPanel.fixedToCamera = true;
        this.addPanel(this.branchPanel);

        let previousLevelButton = SpriteUtils.createButton(this.game,  40, 65, "arrowEditor", () => {
            let forests = EditorService.getCurrentLevels();
            let currentIndex = forests.map((f,i) => f.id == this.forestType.id? i : -1).filter(i => i>=0).shift();
            if(currentIndex - 1 >= 0){
                EditorService.switchToLevel(this.game, forests[currentIndex - 1].id);
            }
        });
        previousLevelButton.scale.set(-0.6, 0.6);
        previousLevelButton.fixedToCamera = true;
        this.addButton(previousLevelButton);

        let nextLevelButton = SpriteUtils.createButton(this.game, 10 + 130, 65, "arrowEditor", () => {
            let forests = EditorService.getCurrentLevels();
            let currentIndex = forests.map((f,i) => f.id == this.forestType.id? i : -1).filter(i => i>=0).shift();
            if(forests.length > currentIndex + 1){
                EditorService.switchToLevel(this.game, forests[currentIndex + 1].id);
            }
        });
        nextLevelButton.fixedToCamera = true;
        nextLevelButton.scale.set(0.6);
        this.addButton(nextLevelButton);

        
        // this.hardCheckbox = new EditorCheckBoxPanel(this.game, "             hard", () => this.forestType.isHardLevel? true : false, (p:EditorCheckBoxPanel) => {
        //     this.forestType.isHardLevel = !this.forestType.isHardLevel;
        //     this.saveCreatedLevel();
        //     p.resetPanel();
        // })
        // this.hardCheckbox.x += 0;
        // this.hardCheckbox.y += 100 * (3 + 1/2) - 150 ;
        // this.addSprite(this.hardCheckbox);
        // this.hardCheckbox.resetPanel();
        // this.hardCheckbox.visible = false;




        this.leafController = new LeafController(this.game, this, 381, 37, this.forestType.environment != Environment.house? this.forestType.leafType : "leaf1");
        this.leafController.anchor.set(0.5);
        this.leafController.fixedToCamera = true;
        this.addPanel(this.leafController);

        this.headerController = new HeaderController(this.game, this, 381 + 115, 37, this.forestType, this.leafController);
        this.headerController.anchor.set(0.5);
        this.headerController.fixedToCamera = true;
        this.addPanel(this.headerController);


        let downloadButton = SpriteUtils.createButton(this.game, 0, 0, "downloadButton", () => {
            EditorService.downloadLevels();
        });
        downloadButton.anchor.set(0.5)
        downloadButton.name = "downloadButton";
        downloadButton.fixedToCamera = true;
        this.addButton(downloadButton);

        let playButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playButtonEditor", () => {
            this.playCreatedLevel();
        });
        playButtonEditor.name = "playButtonEditor";
        playButtonEditor.fixedToCamera = true;
        this.addButton(playButtonEditor);

        // let playTestButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playButtonEditor", () => {
        //     this.testLevel();
        // });
        // playTestButtonEditor.name = "playTestButtonEditor";
        // playTestButtonEditor.fixedToCamera = true;
        // this.addButton(playTestButtonEditor);

        let playMaxButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playMaxButtonEditor", () => {
            this.playCreatedLevel(true);
        });
        playMaxButtonEditor.name = "playMaxButtonEditor";
        playMaxButtonEditor.fixedToCamera = true;
        this.addButton(playMaxButtonEditor);

        // let playMaxTestButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playMaxButtonEditor", () => {
        //     this.testLevel(true);
        // });
        // playMaxTestButtonEditor.name = "playMaxTestButtonEditor";
        // playMaxTestButtonEditor.fixedToCamera = true;
        // this.addButton(playMaxTestButtonEditor);

        // let playAutoButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playAutoButtonEditor", () => {
        //     this.testForBugs();
        // });
        // playAutoButtonEditor.name = "playAutoButtonEditor";
        // playAutoButtonEditor.fixedToCamera = true;
        // this.addButton(playAutoButtonEditor);

        let playAutoFullButtonEditor = SpriteUtils.createButton(this.game, 0, 0, "playAutoButtonEditor", () => {
            let pnl = this.attachSprite("panel2");
            pnl.x = this.game.width/2;
            pnl.y = this.game.height - 350+120+12;
            pnl.inputEnabled = true;
            pnl.fixedToCamera = true;
            pnl.scale.set(3, 0.7)

            let closeButton = this.attachButton("closeButtonBlue", () => pnl.kill());
            closeButton.x += 140+5;
            closeButton.y -= 270+10+10;
            closeButton.scale.set(0.6/pnl.scale.x, 0.6/pnl.scale.y)
            pnl.addChild(closeButton);

            let buttons = [
                {name: "reset & full test", sprite: "panelButton", action: () => this.testForBalance()},
                {name: "continue Ftest", sprite: "panelButton", action: () => this.continueTestForBalance()},
                {name: "test curr", sprite: "panelButton", action: () => this.testLevel()},
                {name: "test curr MAX", sprite: "panelButton", action: () => this.testLevel(true)},

                {name: "fast test", sprite: "pnlButton", action: () => this.testForBugs()},
                {name: "fast test from 1", sprite: "pnlButton", action: () => this.testForBugs(true)},
                {name: "print results", sprite: "pnlButton", action: () => EditorScreen.printTestedLevels()},
            ];
            
            let columns = 4;
            let startX = this.game.width/columns/2 - this.game.width/2;
            let startY = -200;

            buttons.forEach((b,i) =>{
                let b1 = this.attachButton(b.sprite, b.action);
                b1.y = startY + Math.floor(i/columns) * 100;
                b1.x = (startX + i%columns * this.game.width/columns)/pnl.scale.x;
                b1.scale.set(0.5/pnl.scale.x, 0.5/pnl.scale.y)
                b1.addChild(new Label(this.game, 0, -30, b.name,  { font: "bold 54px BalsamiqSansBold", fill: "#ffffff"}));
                pnl.addChild(b1);
            })
        });
        playAutoFullButtonEditor.name = "playAutoFullButtonEditor";
        playAutoFullButtonEditor.fixedToCamera = true;
        this.addButton(playAutoFullButtonEditor);


        let openButton = SpriteUtils.createButton(this.game, 0, 0, "openButton", () => {
            EditorService.showLevelEditorDialog(this.game);
        });
        openButton.anchor.set(0.5)
        openButton.name = "openButton";
        openButton.fixedToCamera = true;
        this.addButton(openButton);

        // this.namePanel = new EditorValuePanel(this.game, "name", () => this.forestType.name || "", (p:EditorValuePanel) => {
        //     EditorService.showTextField("Изменить name", p.getValue(), (value:string) => {
        //         this.forestType.name = value;
        //         this.saveCreatedLevel();

        //         p.resetPanel()
        //     });
        // });
        // this.namePanel.x = 845+30;    
        // this.namePanel.y = 365- 212-20;
        // this.namePanel.scale.set(0.7)
        // this.namePanel.fixedToCamera = true;
        // this.addPanel(this.namePanel);

        // this.iconPanel = new EditorValuePanel(this.game, "icon", () => this.forestType.icon || "", (p:EditorValuePanel) => {
        //     EditorService.showTextField("Изменить icon", p.getValue(), (value:string) => {
        //         this.forestType.icon = value;
        //         this.saveCreatedLevel();
        //         SpriteUtils.loadTexture(this.iconPanelSprite, value);

        //         p.resetPanel()
        //     });
        // });
        // this.iconPanel.x = 845;    
        // this.iconPanel.y = 365 - 212 + this.namePanel.height;
        // this.addPanel(this.iconPanel);

        // this.iconPanelSprite = SpriteUtils.createSprite(this.game, -256/1.12, -33, this.forestType.icon);
        // this.iconPanelSprite.scale.set(0.5);
        // this.iconPanel.addChild(this.iconPanelSprite);

        // this.valuesLabel = new Label(this.game, this.iconPanel.x-460, this.iconPanel.y + 50 - 164, "   0   0   0   0   0");
        // this.addSprite(this.valuesLabel);
        // this.valuesLabel.addColor("#FF0000", 4)
        // this.valuesLabel.addColor("#00FF00", 8)
        // this.valuesLabel.addColor("#e8fb1e", 12)
        // this.valuesLabel.addColor("#7e0f9d", 16)
        // this.game.time.events.loop(500, ()=>{
        //     this.valuesLabel.text = ForestUtils.getValuesString(this.forestType);
        // });

        this.applyPreset(this.preset)

        let isPc = this.game.height < 1550 || window.innerHeight < window.innerWidth;
        if(isPc){
            Utils.applyPreset(this.bottomPanel, { "spriteId": "editorBottomPanel", "x": 478, "y": this.game.height - 50, "scaleX": 1, "scaleY": 1.1600000000000001, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        }

        this.contentRows = isPc ? 3 : 4;
        this.contentColumns = isPc ? 4 : 3;

        let startY = isPc? this.bottomPanel.y - 320 : 1075;
        let startX = isPc ? 58 : 80;
        let currentY = startY;
        let currentX = startX;
        let dx = isPc ? 115 : 140;
        let dy = isPc ? 118 : 150;

        EditorContentPanel.CONTENT_TYPES.forEach((content, i) => {
            let contentPage = Math.floor(i / (this.contentRows * this.contentColumns));

            let OBJECTS_IN_ROW = isPc ? 4 : 3;
            let x = currentX + dx * (i % OBJECTS_IN_ROW)
            let y = currentY + dy * Math.floor(i / OBJECTS_IN_ROW % this.contentRows)
            let contentPanel;

            if (content == "jellyMushroom") {
                contentPanel = new EditorContentPanel(this.game, this, x, y, this.forestType, content, () => {
                    return this.cellCovers.filter(c => c.cellType == CellType.JELLY).length;
                }, () => { return 0; });
                if (contentPanel.getCount() > 0) {
                    contentPanel.onPLus(contentPanel.getCount());
                }
                contentPanel.plus
            } else if (content == "acorn") {
                contentPanel = new EditorContentPanel(this.game, this, x, y, this.forestType, content, () => {
                    return this.cellCovers.filter(c => c.cellType == CellType.ACORN).length;
                }, () => { return 0; });
                if (contentPanel.getCount() > 0) {
                    contentPanel.onPLus(contentPanel.getCount());
                }
            } else if (content == "darkStump") {
                contentPanel = new EditorContentPanel(this.game, this, x, y, this.forestType, content, () => {
                    return this.forestType.ladybugs? this.forestType.ladybugs.length : 0;
                }, () => { return 0; });
                if (contentPanel.getCount() > 0) {
                    contentPanel.onPLus(contentPanel.getCount());
                }
            } else {
                contentPanel = new EditorContentPanel(this.game, this, x, y, this.forestType, content);
            }

            contentPanel.visible = contentPage == this.contentPage;
            contentPanel.inputEnabled = contentPanel.visible;

            contentPanel.fixedToCamera = true;
            this.addPanel(contentPanel);
            this.contentPanels.push(contentPanel)
        });
        
        this.stepsPanel = new EditorContentPanel(this.game, this, 620, 58 - 17, this.forestType, EditorContentPanel.STEPS_TYPE);
        this.stepsPanel.fixedToCamera = true;
        this.addPanel(this.stepsPanel);

        this.maxStepsPanel = new EditorContentPanel(this.game, this, 620, 58 - 17 - 50-20, this.forestType, EditorContentPanel.MAX_STEPS_TYPE);
        this.maxStepsPanel.fixedToCamera = true;
        this.addPanel(this.maxStepsPanel);


        let v = this.attachButton("v", ()=> this.duplicateVertical());
        let v1 = this.attachButton("v1", ()=> this.duplicateVerticalWithMargin());
        let vm = this.attachButton("vm", ()=> this.duplicateVertical(true));
        // let vm1 = this.attachButton("vm1", ()=> this.duplicateVerticalWithMargin(true));
        let vm1 = this.attachButton("vm1", ()=> this.addEmptyStringToTop());
        
        v.y+=15;
        v1.y+=15;
        vm.y+=15;
        vm1.y+=15;
        
        v.x+=36;
        v1.x+=36 +75;
        vm.x+=36 +75*2;
        vm1.x+=36 +75*3;

        v.fixedToCamera = true;
        v1.fixedToCamera = true;
        vm.fixedToCamera = true;
        vm1.fixedToCamera = true;


        let cellTypes = Utils.enumValues(CellType);
        Utils.delete(cellTypes, CellType.EMPTY);

        // this.ladybugsProvider.generateLadybugsAndAcorns();

        this.brushesRows = 4;
        this.brushesColumns = 5;
        let totalOnPage = this.brushesRows * this.brushesColumns;
        let i;
        for (i = 0; i < cellTypes.length; i++) {
            let contentPage = Math.floor(i / (this.brushesRows * this.brushesColumns));

            let t = cellTypes[i];

            let brush = new ForestCellCover(Environment.forest, "leaf1", this.getBrushX(i % totalOnPage), this.getBrushY(i % totalOnPage, startY),
                BaseCellsProvider.CELL_WIDTH, BaseCellsProvider.CELL_HEIGHT, this.game, null, t, () => this.chooseBrush(BrushType.CELL_DEPENDENT, t), this);

            // brush.scale.set(0.7);
            brush.openableCover.inputEnabled = true;
            // this.add.existing(brush);
            this.bottomPanel.addChild(brush);
            brush.x-=this.bottomPanel.x;
            brush.y-=this.bottomPanel.y - 30;
            brush.scale.set(0.7/ this.bottomPanel.scale.x, 0.7/ this.bottomPanel.scale.y);

            this.brushes.push(brush);

            let coverFreeImage = ForestUtils.getBoosterContentType(t) || ForestUtils.getCoverFreeNotBoosterItem(t);
            if (coverFreeImage) {
                brush.visible = true;
                brush.openableCover.loadTexture(SpriteUtils.key("grass"), SpriteUtils.frame("grass"));
                // brush.openableCover.scale.set(1.5)
                brush.openableCover.scale.set(1)

                let compass = SpriteUtils.createSprite(this.game, 0, 0, ContentType[coverFreeImage]);
                compass.anchor.set(0.5);
                // compass.scale.set(1.5)
                // compass.alpha = 0.1;
                compass.width = 140;
                compass.height = 140;
                brush.openableCover.addChild(compass);
                brush.leaf.visible = false;
            }

            brush.openableCover.visible = true;

            brush.visible = contentPage == this.contentPage;
            brush.inputEnableChildren = brush.visible;
        };

        let contentPage = Math.floor(i / (this.brushesRows * this.brushesColumns));

        let ladybugBrush = SpriteUtils.createSprite(this.game, this.getBrushX(i % totalOnPage), this.getBrushY(i % totalOnPage, startY), "ladybugBrush");
        ladybugBrush.anchor.set(0.5)
        ladybugBrush.name = "ladybug";
        ladybugBrush.inputEnabled = true;
        ladybugBrush.events.onInputDown.add(() => this.chooseBrush(BrushType.LADYBUG), this);
        ladybugBrush.scale.set(0.7);
        ladybugBrush.fixedToCamera = true;
        this.addSprite(ladybugBrush);
        this.brushes.push(ladybugBrush);

        ladybugBrush.visible = contentPage == this.contentPage;
        ladybugBrush.inputEnabled = ladybugBrush.visible;

        i++;

        let ladybugPlusBrush = SpriteUtils.createSprite(this.game, this.getBrushX(i % totalOnPage), this.getBrushY(i % totalOnPage, startY), "ladybugBrush");
        ladybugPlusBrush.anchor.set(0.5)
        ladybugPlusBrush.name = "ladybugPlus";
        ladybugPlusBrush.inputEnabled = true;
        ladybugPlusBrush.events.onInputDown.add(() => this.chooseBrush(BrushType.LADYBUG_PLUS), this);
        ladybugPlusBrush.scale.set(0.7);
        ladybugPlusBrush.fixedToCamera = true;
        this.addSprite(ladybugPlusBrush);
        this.brushes.push(ladybugPlusBrush);
        ladybugPlusBrush.addChild(new Label(this.game, 0, -40, "+", { font: "bold 70px BalsamiqSansBold", fill: "#000000"}));

        ladybugPlusBrush.visible = contentPage == this.contentPage;
        ladybugPlusBrush.inputEnabled = ladybugBrush.visible;

        i++;

        let separatorBrush = SpriteUtils.createSprite(this.game, this.getBrushX(i % totalOnPage), this.getBrushY(i % totalOnPage, startY), "hex");
        let sep = SpriteUtils.createSprite(this.game, 0, 0, "separator");
        sep.anchor.set(0.5)
        sep.scale.set(1*1.5)
        separatorBrush.addChild(sep)
        separatorBrush.anchor.set(0.5)
        separatorBrush.name = "separator";
        separatorBrush.inputEnabled = true;
        separatorBrush.events.onInputDown.add(() => this.chooseBrush(BrushType.SEPARATOR), this);
        separatorBrush.scale.set(0.7/1.5);
        separatorBrush.fixedToCamera = true;
        this.addSprite(separatorBrush);
        this.brushes.push(separatorBrush);

        separatorBrush.visible = contentPage == this.contentPage;
        separatorBrush.inputEnabled = separatorBrush.visible;


        if (!isPc) {
            let joystick = SpriteUtils.createSprite(this.game, this.game.width - 40, this.game.height - 40, "joystick");
            joystick.scale.set(2);
            joystick.anchor.set(1);
            // joystick.alpha = 0.8;
            joystick.fixedToCamera = true;
            this.addSprite(joystick);
        }


       

        let arrowLeft = SpriteUtils.createButton(this.game, 78, this.bottomPanel.y + 20 - this.bottomPanel.height / 2, "arrowEditor", () => {
            this.scrollContentToPage(this.contentPage - 1)
        });
        arrowLeft.scale.set(-0.6, 0.6);
        arrowLeft.fixedToCamera = true;
        this.addButton(arrowLeft);

        let arrowRight = SpriteUtils.createButton(this.game, 378 + 10, this.bottomPanel.y + 20 - this.bottomPanel.height / 2, "arrowEditor", () => {
            this.scrollContentToPage(this.contentPage + 1)
        });
        arrowRight.fixedToCamera = true;
        arrowRight.scale.set(0.6);
        this.addButton(arrowRight);

        this.contentPageLabel = new Label(this.game, 355 + 10, this.bottomPanel.y + 14 - this.bottomPanel.height / 2, "(" + (this.contentPage + 1) + ")", { font: "30px BalsamiqSansBold", fill: "#ffffff" });
        // this.contentPageLabel.anchor.set(0.5);
        this.contentPageLabel.fixedToCamera = true;
        this.addSprite(this.contentPageLabel);


        let arrowLeftBrushes = SpriteUtils.createButton(this.game, 78 + 500, this.bottomPanel.y + 20 - this.bottomPanel.height / 2, "arrowEditor", () => {
            this.scrollBrushesToPage(this.brushesPage - 1)
        });
        arrowLeftBrushes.scale.set(-0.6, 0.6);
        arrowLeftBrushes.fixedToCamera = true;
        this.addButton(arrowLeftBrushes);

        let arrowRightBrushes = SpriteUtils.createButton(this.game, 378 + 10 + 500, this.bottomPanel.y + 20 - this.bottomPanel.height / 2, "arrowEditor", () => {
            this.scrollBrushesToPage(this.brushesPage + 1)
        });
        arrowRightBrushes.fixedToCamera = true;
        arrowRightBrushes.scale.set(0.6);
        this.addButton(arrowRightBrushes);

        this.brushesPageLabel = new Label(this.game, 355 + 10 + 500, this.bottomPanel.y + 14 - this.bottomPanel.height / 2, "(" + (this.brushesPage + 1) + ")", { font: "30px BalsamiqSansBold", fill: "#ffffff" });
        // this.contentPageLabel.anchor.set(0.5);
        this.brushesPageLabel.fixedToCamera = true;
        this.addSprite(this.brushesPageLabel);

        this.redrawCells();
    } 

    private duplicateVertical(mirror?:boolean):void{
        this.forestType = this.trimHard(this.forestType);
        while(this.forestType.mask.length % BaseCellsProvider.MAX_WIDTH != 0) this.forestType.mask += "0";

        this.forestType.mask =this.forestType.mask + (mirror?
            this.shiftEvenLines(this.forestType.mask.split("").reverse().join("")):
            this.shiftEvenLines(this.forestType.mask));
        this.saveCreatedLevel();
        this.redrawCells();
        this.expandForestType();
        console.log("editor: v")
    }
    
    private addEmptyStringToTop():void{
        let margin = "";
        for(let i=0; i<BaseCellsProvider.MAX_WIDTH;i++){
            margin += "0";
        }
        this.forestType.mask = margin + this.forestType.mask;
        this.saveCreatedLevel();
        this.redrawCells();
    }

    private duplicateVerticalWithMargin(mirror?:boolean):void{
        this.forestType = this.trimHard(this.forestType);
        while(this.forestType.mask.length % BaseCellsProvider.MAX_WIDTH != 0) this.forestType.mask += "0";
        
        let margin = "";
        for(let i=0; i<BaseCellsProvider.MAX_WIDTH;i++){
            margin += "0";
        }

        this.forestType.mask =this.forestType.mask + margin + (mirror?
                this.shiftEvenLines(this.forestType.mask.split("").reverse().join(""), mirror):
                this.shiftEvenLines(this.forestType.mask, mirror));
        this.saveCreatedLevel();
        this.redrawCells();
        this.expandForestType();
        console.log("editor: v1")
    }

    private shiftEvenLines(mask:string, margin?:boolean):string{
        let lines:string[] = [];
        for(let i=0; i < mask.length; i++){
            let line = Math.floor(i/BaseCellsProvider.MAX_WIDTH);
            if(i % BaseCellsProvider.MAX_WIDTH ==0 ) lines[line] = mask[i];
            else lines[line] += mask[i];
        }
        for(let j=0; j<lines.length; j++){
            console.log("shift: j=" + j + " lines.length=" + lines.length)
            // if(((j  + lines.length + (margin?1:0)) % 2) == 1){//(lines.length%2==0?1:0)){
            //     console.log("shift at j=" + j)
            //     lines[j] = "0" + lines[j].substring(0, Math.min(BaseCellsProvider.MAX_WIDTH-1, lines[j].length));
            // }
        }
        console.log("editor: " + lines.join(""))
        return lines.join("");
    }

    private scrollContentToPage(page: number) {
        page = Math.max(0, page)
        page = Math.min(Math.ceil(this.contentPanels.length / (this.contentRows * this.contentColumns) - 1), page)
        this.contentPage = page;
        this.contentPageLabel.text = "(" + (page + 1) + ")";
        this.contentPanels.forEach((p, i) => {
            let contentPage = Math.floor(i / (this.contentRows * this.contentColumns));
            p.visible = page == contentPage;
            p.inputEnabled = p.visible;
        })
    }

    private scrollBrushesToPage(page: number) {
        page = Math.max(0, page)
        page = Math.min(Math.ceil(this.brushes.length / (this.brushesRows * this.brushesColumns) - 1), page)
        this.brushesPage = page;
        this.brushesPageLabel.text = "(" + (page + 1) + ")";
        this.brushes.forEach((p, i) => {
            let currentPage = Math.floor(i / (this.brushesRows * this.brushesColumns));
            p.visible = page == currentPage;

            (p instanceof Phaser.Sprite)? p.inputEnabled = p.visible : p.inputEnableChildren = p.visible;
        })
    }

    public static onMouseWheel(e: WheelEvent): void {
        var delta = e.deltaY || e.detail;//*|| e.wheelDelta;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        console.log("ON MOUSE WHEEL")
        Game.getInstance().camera.y += delta;
    }

    private getBrushX(i: number) {
        // let startY = 1067;
        let startX = 523;
        let dx = 100;
        let dy = 100;

        let BRUSHES_IN_ROW = 5;
        return startX + dx * (i % BRUSHES_IN_ROW)
    }

    private getBrushY(i: number, startY: number) {
        // let startY = 1067;
        let startX = 523;
        let dx = 100;
        let dy = 95;

        let BRUSHES_IN_ROW = 5;
        return startY + dy * Math.floor(i / BRUSHES_IN_ROW)
    }

    private chooseBrush(brushType: BrushType, cellType?: CellType) {
        this.brushes.forEach(b => b.scale.set(0.7/ this.bottomPanel.scale.x, 0.7/ this.bottomPanel.scale.y))
        this.brushType = brushType;
        console.log("BRUSH CELL CHOOSEN: " + cellType)

        switch (brushType) {
            case BrushType.CELL_DEPENDENT:
                if (cellType) {
                    this.brushes.filter(b => b instanceof ForestCellCover && b.cellType == cellType).shift().scale.set(0.9);
                    this.brushCellType = cellType;
                }
                break;
            case BrushType.LADYBUG:
                this.brushes.filter(b => b.name == "ladybug").shift().scale.set(0.9);
                break;
            case BrushType.LADYBUG_PLUS:
                this.brushes.filter(b => b.name == "ladybugPlus").shift().scale.set(0.9);
                break;
            case BrushType.SEPARATOR:
                this.brushes.filter(b => b.name == "separator").shift().scale.set(0.9);
                break;
            default:
                throw new NeverError(brushType);
        }
    }

    /// CTRL + Z 
    private saveCreatedLevel() {
        this.forestTypeHistory.push(new ForestType(this.forestType));
        if(this.forestTypeHistory.length > 50){
            this.forestTypeHistory.splice(0, 1);
        } 

        let cellsAndItemsByBiom: {count:number, cellsCount:number, biom:BiomType}[] = ForestUtils.getCellsByBiom(this.forestType);
        
        this.forestType.items.forEach(item => {
            for(let i=0; i<item.count; i++){
                ForestUtils.placeItemToCorrectBiom(cellsAndItemsByBiom, ForestUtils.getBioms(ContentType[item.name]));
            }
        });
        if(this.forestType.interactiveItems){
            this.forestType.interactiveItems.forEach(item => {
                for(let i=0; i<item.count; i++){ 
                    ForestUtils.placeItemToCorrectBiom(cellsAndItemsByBiom, ForestUtils.getBioms(ContentType[item.name]));
                }
            });
        }

        let slots : {count:number, biom:BiomType}[] = []; 
        cellsAndItemsByBiom.forEach(cib => {
            slots.push({count: cib.count, biom:cib.biom});
        });

        this.forestType.slots = slots;

        EditorService.saveLevel(this.trimForestType(this.forestType));
    }

    private switchToPreviousForestTypeVersion(){
        if(this.forestTypeHistory.length >= 2){
            this.forestType = this.forestTypeHistory[this.forestTypeHistory.length - 2];
            this.forestTypeHistory.splice(this.forestTypeHistory.length-2, 2);

            this.redrawCells();
            //TODO redraw layout
        }
    }

    public update() :void{
        if(this.Z_key.isDown && !this.Z_IsDown){
            console.log("Z pressed!")
            this.switchToPreviousForestTypeVersion();
            this.Z_IsDown = true;
        }

        if(!this.Z_key.isDown){
            this.Z_IsDown = false;
        }
    }

    private continueTestForBalance():void{
        this.resetTestParams();
        EditorScreen.resetToNextLevel();
        // if(localStorage.getItem("testedLevelLast")){
        //     let index = ForestDao.getAllForests().findIndex(f => f.id == localStorage.getItem("testedLevelLast"));
        //     if(index < ForestDao.getAllForests().length - 1){
        //         EditorScreen.test_levelId = ForestDao.getAllForests()[index + 1].id;
        //         ForestUtils.forestTypeToPLay = ForestDao.getAllForests()[index + 1];
        //     } 
        // }
        EditorScreen.SAVE_RESULTS = true;
        EditorScreen.TEST_WITH_100_STEPS = false;
        EditorScreen.LEVELS_TO_TEST = EditorService.getCurrentLevels().length;

        this.startScreen(ForestScreen, true, false)
    }

    public static getStatistics(): TestLevelRecord[]{
        if(localStorage.getItem("testLevels")){
            return JSON.parse(localStorage.getItem("testLevels"));
        }
        return [];
    }
    public static updateTestStatisticsRecord(record: TestLevelRecord):void{
        let statistics = this.getStatistics();
        record.branchId = record.branchId || EditorService.getCurrentLevelBranchId();
        let toReplace = statistics.find(r => r.id == record.id && (r.branchId || ForestDao.getDefaultBranchId()) == record.branchId);
        if(toReplace){
            toReplace.branchId = record.branchId;
            toReplace.wins = record.wins;
            toReplace.looses = record.looses;
            toReplace.stepsLeft = record.stepsLeft;
            toReplace.aimsLeft = record.aimsLeft;
            toReplace.hash = record.hash;
        } else {
            statistics.push(record);
        }

        localStorage.setItem("testLevels", JSON.stringify(statistics));
    }

    public static resetTestStatistics():void{
        localStorage.setItem("testLevels", "[]"); 
    }

    private testForBalance():void{ 
        this.resetTestParams();
        EditorScreen.resetTestStatistics();
        // localStorage.setItem("testedLevelLast", "");
        let forests = EditorService.getCurrentLevels();
        EditorScreen.test_levelId = forests[0].id;
        EditorScreen.TEST_WITH_100_STEPS = false;
        EditorScreen.SAVE_RESULTS = true;
        EditorScreen.LEVELS_TO_TEST = forests.length;

        ForestUtils.forestTypeToPLay = forests[0];
        this.startScreen(ForestScreen, true, false)
    }

    private static printTestedLevels():void{
        let data = "";
        this.getStatistics().forEach(r => {
            data += (r.branchId || ForestDao.getDefaultBranchId()) + "|" + r.id + "|" + r.wins + "|" + r.looses + "|" + r.stepsLeft + "|" + r.aimsLeft + "|" + r.hash + "\n";
        })
        console.log(data);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
        element.setAttribute('download', "testLevelsData");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        Game.getInstance().add.existing(new LogPanel("Результаты напечатаны \n в консоль!"));
    }

    private testForBugs(fromStart?:boolean):void{
        this.resetTestParams();
        let forests = EditorService.getCurrentLevels();
        EditorScreen.test_levelId =  fromStart? forests[0].id : this.forestType.id;
        EditorScreen.TEST_WITH_100_STEPS = true;
        EditorScreen.LEVELS_TO_TEST = forests.length;

        ForestUtils.forestTypeToPLay = fromStart? forests[0] : this.forestType;
        this.startScreen(ForestScreen, true, false)
    }

    private testLevel(withMaxSteps?:boolean):void{
        this.resetTestParams();
        EditorScreen.SAVE_RESULTS = true;
        EditorScreen.test_levelId = this.forestType.id;
        ForestUtils.withMaxSteps = withMaxSteps;
        EditorScreen.test_withMaxSteps = withMaxSteps;

        this.playCreatedLevel(withMaxSteps);
    }

    public static resetToNextLevel():void{
        EditorScreen.test_wins =0;
        EditorScreen.test_looses =0;
        EditorScreen.test_aimsOnLoose =0;
        EditorScreen.test_stepsOnWin =0;
        EditorScreen.test_withMaxSteps = false;
        let forests = EditorService.getCurrentLevels();
        let currentBranchId = EditorService.getCurrentLevelBranchId();

        if(EditorScreen.TEST_WITH_100_STEPS){
            let index = forests.findIndex(f => f.id == EditorScreen.test_levelId);
        // console.log("LEVEL ID 1: " + EditorScreen.test_levelId)
            if(forests.length > index+1){
                EditorScreen.test_levelId = forests[index+1].id;
                ForestUtils.forestTypeToPLay = forests[index+1];
                EditorScreen.LEVELS_TO_TEST--;
                // console.log("LEVEL ID 2: " + EditorScreen.test_levelId)
            } else {
                EditorScreen.LEVELS_TO_TEST = 1;
                EditorScreen.test_levelId = null;
            }
            return;
        }
        
        
        if(localStorage.getItem("testLevels")){
            console.log("RESET1")
            let statistics = EditorScreen.getStatistics();
            let noLevels = true;
            for(let f of forests){
                if(!statistics.find(s => s.id == f.id && (s.branchId || ForestDao.getDefaultBranchId()) == currentBranchId && s.hash == Utils.hashCode(JSON.stringify(f)))){ //пересчитываем только обновленные уровни
                    // console.log("RESET f.id: " + f.id)
                    // console.log("RESET " + JSON.stringify(statistics))
                    EditorScreen.test_levelId = f.id;
                    ForestUtils.forestTypeToPLay = f;
                    EditorScreen.LEVELS_TO_TEST--;//TODO can delete
                    noLevels = false;
                    break;
                }

                if(f.maxSteps && f.steps != f.maxSteps && !statistics.find(s => s.id == f.id+"_h" && (s.branchId || ForestDao.getDefaultBranchId()) == currentBranchId && s.hash == Utils.hashCode(JSON.stringify(f)))){
                    // console.log("RESET f.id h: " + f.id)
                    EditorScreen.test_levelId = f.id;
                    ForestUtils.forestTypeToPLay = f;
                    EditorScreen.test_withMaxSteps = true;
                    // EditorScreen.LEVELS_TO_TEST--;
                    noLevels = false;
                    break;
                }
            }

            if(noLevels){
                console.log("RESET no levels: ")
                EditorScreen.LEVELS_TO_TEST = 1;
                EditorScreen.test_levelId = null;
            }
        }

        // let index = ForestDao.getAllForests().findIndex(f => f.id == EditorScreen.test_levelId);
        // // console.log("LEVEL ID 1: " + EditorScreen.test_levelId)
        // if(ForestDao.getAllForests().length > index+1){
        //     EditorScreen.test_levelId = ForestDao.getAllForests()[index+1].id;
        //     ForestUtils.forestTypeToPLay = ForestDao.getAllForests()[index+1];
        //     EditorScreen.LEVELS_TO_TEST--;
        //     // console.log("LEVEL ID 2: " + EditorScreen.test_levelId)
        // } else {
        //     EditorScreen.LEVELS_TO_TEST = 1;
        //     EditorScreen.test_levelId = null;
        // }
    }

    private resetTestParams(){
        EditorScreen.test_levelId = null;
        EditorScreen.test_wins =0;
        EditorScreen.test_looses =0;
        EditorScreen.test_aimsOnLoose =0;
        EditorScreen.test_stepsOnWin =0;
        EditorScreen.test_withMaxSteps = false;

        EditorScreen.LEVELS_TO_TEST = 1;
        EditorScreen.TEST_WITH_100_STEPS = false;
        EditorScreen.SAVE_RESULTS = false;
    }


    private playCreatedLevel(withMaxSteps?:boolean) {
        ForestUtils.forestTypeToPLay = this.forestType;
        ForestUtils.withMaxSteps = withMaxSteps;
        let user = UserService.getUser();
        // user.setCurrentForest(ForestDao.indexOf(ForestDao.getForestById(this.forestType.id)))
        this.startScreen(ForestScreen, true, false)
    }

    private expandForestType() {
        while (this.forestType.mask.length < BaseCellsProvider.MAX_WIDTH * BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL * EditorScreen.MAX_LEVEL_SIZE_MULTIPLIER) {
            this.forestType.mask = this.forestType.mask.concat(ForestUtils.getChar(CellType.EMPTY));
        }
        console.log()
    }

    private trimHard(forestType:ForestType):ForestType {
        let res = new ForestType(forestType);
        let allCellsEmpty = true;
        let i= res.mask.length - 1;
        while (allCellsEmpty && i>=0) {
            if (res.mask[i] != ForestUtils.getChar(CellType.EMPTY)) {
                allCellsEmpty = false;
            }
            if (allCellsEmpty) {
                res.mask = res.mask.substring(0, res.mask.length - 1);
            }
            i--;
        }
        return res;
    }

    private trimForestType(forestType:ForestType):ForestType {
        let res = new ForestType(forestType);
        let allCellsEmpty = true;
        while (allCellsEmpty) {
            for (let i = res.mask.length - 1; i > res.mask.length - 1 - BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL; i--) {
                if (res.mask[i] != ForestUtils.getChar(CellType.EMPTY)) {
                    allCellsEmpty = false;
                }
            }
            if (allCellsEmpty) {
                res.mask = res.mask.substring(0, res.mask.length - BaseCellsProvider.MAX_HEIGHT_WITH_NO_SCROLL);
            }
        }
        return res;
    }

    public redrawCells() {
        this.separators.forEach(s => s.kill())
        this.separators = [];

        this.cellCovers = [];

        this.cellsHolder.children.forEach(c => { c.visible = false; })

        this.cellsProvider.calculateMask(this.forestType);

        this.ladybugsProvider.generateLadybugsAndAcorns();

        this.cellsProvider.getMask().forEach(cell => {
            let cellCover = new ForestCellCover(this.forestType.environment, this.forestType.leafType, this.cellsProvider.calculateRealX(cell.X, cell.Y), this.cellsProvider.calculateRealY(cell.X, cell.Y) + EditorScreen.OFFSET_CELL_Y,
                BaseCellsProvider.CELL_WIDTH, BaseCellsProvider.CELL_HEIGHT, this.game, null, cell.type, null, this);
            this.cellsHolder.addChild(cellCover);

            let coverFreeImage = ForestUtils.getBoosterContentType(cell.type) || ForestUtils.getCoverFreeNotBoosterItem(cell.type);
            if (coverFreeImage) {
                cellCover.visible = true;
                cellCover.openableCover.loadTexture(SpriteUtils.key("grass"), SpriteUtils.frame("grass"));
                // cellCover.openableCover.scale.set(1.5)
                cellCover.openableCover.scale.set(1)

                let booster = SpriteUtils.createSprite(this.game, 0, 0, ContentType[coverFreeImage]);
                booster.anchor.set(0.5);
                // booster.scale.set(1.5)
                // compass.alpha = 0.1;
                booster.width = 140;
                booster.height = 140;
                cellCover.openableCover.addChild(booster);
                cellCover.openableCover.visible = true;
                cellCover.leaf.visible = false;
            }

            this.cellCovers.push(cellCover);
        });

        let panel = this.contentPanels.filter(p => p.item == "cankerberry").shift();
        let сankerberryAimCount = panel ? panel.getCount() : 0;
        this.cellsProvider.generateCankerberries(this.cellCovers, сankerberryAimCount, true);

        if (this.forestType.separators) {
            this.forestType.separators.forEach(s => {
                let img = ForestUtils.getSeparatorImage(s.type);
                if (img) {
                    // let sep = SpriteUtils.createSprite(this.game,
                    //     this.cellsProvider.calculateRealX(s.X, s.Y) + (s.type == SeparatorType.left ? -7 : 0),
                    //     this.cellsProvider.calculateRealY(s.X, s.Y) + EditorScreen.OFFSET_CELL_Y + (s.type == SeparatorType.lefttop ? -10 : 0) + (s.type == SeparatorType.leftbottom ? 5 : 0),
                    //     img);
                    // sep.inputEnabled = true;
                    // sep.anchor = new Phaser.Point(0.5, 0.5);
                    // sep.width = BaseCellsProvider.CELL_WIDTH;
                    // sep.height = BaseCellsProvider.CELL_HEIGHT;
                    let sep = SpriteUtils.createSprite(this.game, this.cellsProvider.calculateRealX(s.X, s.Y) + (s.type == SeparatorType.left ? -7 : 0),
                    this.cellsProvider.calculateRealY(s.X, s.Y) + + (s.type == SeparatorType.lefttop ? -10 : 0) + (s.type == SeparatorType.leftbottom ? 5 : 0),
                    img);

                    switch(s.type){
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

                    sep.y += EditorScreen.OFFSET_CELL_Y

                    sep.inputEnabled = false;
                    
                    // sep.width = BaseCellsProvider.CELL_WIDTH;
                    // sep.height = BaseCellsProvider.CELL_HEIGHT;
                    this.add.existing(sep);
                    this.separators.push(sep);
                }
            })
        }

        let locks: number[] = [];

        this.cellsProvider.getMask().forEach((c, i) => {
            let cover = this.cellCovers[i];
            locks.push(cover.lockedTimes());
        })

        for(let i=0; i<6; i++){
            console.log()

            this.cellsProvider.getMask().forEach((c, k) => {
                if(locks[k] == 0){
                    locks[k] --;

                    this.cellsProvider.getMask().filter((cc, j) =>  {
                        if(this.cellsProvider.areAdjucentCoordinates(c.X, c.Y, cc.X, cc.Y) && locks[j] > 0) {
                            locks[j] --;
                        }                    
                    })
                }
            })
        }

        //TODO учитывать разделители!

        // console.log(locks)

        if( locks.filter(l => l > 0).length > 0){
            alert("Обнаружена невскрываемая ячейка!");
        }
        this.saveCreatedLevel();

        //redraw layout
        this.layoutHolder.children.forEach(c => { c.visible = false; this.layoutHolder.removeChild(c) });
        LocationUtils.getMiniGameLayout(this.game, this.cellsProvider, this.forestType).forEach(
            d => { d.y += EditorScreen.OFFSET_LAYOUT_Y; this.layoutHolder.addChild(d) }
        );

        LocationUtils.applyBushesConfiguration(this.cellsProvider, this.layoutHolder.children, this.forestType.bushes, true);
    }

    onMouseUp(event: MouseEvent, tryMove: boolean): void {
        if (this.topPanel.getBounds().contains(this.ruler.aimX, this.ruler.aimY - this.game.camera.y)) {
            console.log("INSIDE TOP PANEL");
            return;
        }

        if (this.bottomPanel.getBounds().contains(this.ruler.aimX, this.ruler.aimY - this.game.camera.y)) {
            console.log("INSIDE BOTTOM PANEL");
            return;
        }

        let X = this.cellsProvider.calculateRelativeXByRealPosition(this.ruler.aimX, this.ruler.aimY - EditorScreen.OFFSET_CELL_Y)
        let Y = this.cellsProvider.calculateRelativeYByRealPosition(this.ruler.aimX, this.ruler.aimY - EditorScreen.OFFSET_CELL_Y)

        let closestCellOrder = Y * BaseCellsProvider.MAX_WIDTH + X;

        console.log("Y: " + Y)
        console.log("X: " + X)
        console.log("ORDER: " + closestCellOrder)

        let coordinates = this.cellsProvider.calculateRelativePosition(closestCellOrder);
        let x = this.cellsProvider.calculateRealX(coordinates.x, coordinates.y);
        let y = this.cellsProvider.calculateRealY(coordinates.x, coordinates.y);

        let cell = this.cellsProvider.getMask().filter(c => c.X == coordinates.x && c.Y == coordinates.y).shift();

        if (Math.abs(x - this.ruler.aimX) > BaseCellsProvider.CELL_WIDTH / 2 && tryMove) {
            if (x > this.ruler.aimX && this.tryMoveFieldRight()) {
                this.onMouseUp(event, false);
                return;
            } else if (x < this.ruler.aimX && this.tryMoveFieldLeft()) {
                this.onMouseUp(event, false);
                return;
            }
        }

        console.log("BRUSH CELL TYPE: " + this.brushCellType)

        switch (this.brushType) {
            case BrushType.CELL_DEPENDENT:
                let char = ForestUtils.getChar(this.brushCellType);

                if (cell && this.forestType.mask[closestCellOrder] == char) {
                    this.forestType.mask = Utils.replaceAt(this.forestType.mask, closestCellOrder, ForestUtils.getChar(CellType.EMPTY));
                } else {
                    this.forestType.mask = Utils.replaceAt(this.forestType.mask, closestCellOrder, char);
                }

                if (this.brushCellType == CellType.CANKERBERRY1 || this.brushCellType == CellType.CANKERBERRY2) {
                    let panel = this.contentPanels.filter(p => p.item == "cankerberry").shift();
                    if (!panel) {
                        //TODO
                    };
                    let alreadyPlaced = this.cellCovers.map<number>(c => {
                        if (c.cellType == CellType.CANKERBERRY1) return 1;
                        if (c.cellType == CellType.CANKERBERRY2) return 2;
                        return 0;
                    }).reduce((sum, current) => sum + current);

                    if (panel.getCount() <= alreadyPlaced) {
                        panel.updateLabel(alreadyPlaced + (this.brushCellType == CellType.CANKERBERRY1 ? 1 : 2));
                    }
                }
                //можно убрать поле, считать как кораблики
                this.forestType.dragonflies = this.forestType.mask.split(ForestUtils.getChar(CellType.DRAGONFLY)).length -1;

                break;
            case BrushType.LADYBUG:
                if (!this.forestType.ladybugs) {
                    this.forestType.ladybugs = [];
                }

                let existingLadybug = this.forestType.ladybugs.filter(l => l == closestCellOrder).shift();
                if (existingLadybug || existingLadybug == 0) {
                    Utils.delete(this.forestType.ladybugs, existingLadybug);

                    let  panel = this.contentPanels.filter(p => p.item == "darkStump").shift();
                    panel.updateLabel(panel.getCount() - 1);
                } else {
                    this.forestType.ladybugs.push(closestCellOrder);
                    this.forestType.mask = Utils.replaceAt(this.forestType.mask, closestCellOrder, ForestUtils.getChar(CellType.EMPTY));

                    let  panel = this.contentPanels.filter(p => p.item == "darkStump").shift();
                    panel.updateLabel(panel.getCount() + 1);
                }

                break;
            case BrushType.LADYBUG_PLUS:
                if (!this.forestType.ladybugs) {
                    this.forestType.ladybugs = [];
                }

                this.forestType.ladybugs.push(closestCellOrder);
                this.forestType.mask = Utils.replaceAt(this.forestType.mask, closestCellOrder, ForestUtils.getChar(CellType.EMPTY));

                let  panel = this.contentPanels.filter(p => p.item == "darkStump").shift();
                panel.updateLabel(panel.getCount() + 1);
                
                break;
            case BrushType.SEPARATOR:
                if (!this.forestType.separators) {
                    this.forestType.separators = [];
                }
                let dx = this.ruler.aimX - x;
                let dy = this.ruler.aimY - y - EditorScreen.OFFSET_CELL_Y;
                let H = BaseCellsProvider.CELL_HEIGHT;

                console.log("separator: dy=" + dy + "; dx=" + dx + "; 1/4H=" + (1 / 4 * H))
                console.log("separator: this.ruler.aimY=" + this.ruler.aimY + "; this.ruler.aimX=" + this.ruler.aimY + "; x=" + x + "; y=" + (y + EditorScreen.OFFSET_CELL_Y))


                if (dx < 0) {
                    if (dy < -1 / 4 * H) {
                        let leftTop = this.cellsProvider.getTopLeftCoordinates(coordinates.x, coordinates.y);
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.lefttop)
                        this.addOrRemoveSeparator(leftTop.x, leftTop.y, SeparatorType.rightbottom)
                    } else if (dy <= 1 / 4 * H && dy >= -1 / 4 * H) {
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.left)
                        this.addOrRemoveSeparator(coordinates.x - 1, coordinates.y, SeparatorType.right)
                    } else if (dy > 1 / 4 * H) {
                        let leftBottom = this.cellsProvider.getBottomLeftCoordinates(coordinates.x, coordinates.y);
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.leftbottom)
                        this.addOrRemoveSeparator(leftBottom.x, leftBottom.y, SeparatorType.righttop)
                    }
                } else {
                    if (dy < - 1 / 4 * H) {
                        let rightTop = this.cellsProvider.getTopRightCoordinates(coordinates.x, coordinates.y);
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.righttop)
                        this.addOrRemoveSeparator(rightTop.x, rightTop.y, SeparatorType.leftbottom)
                    } else if (dy <= 1 / 4 * H && dy >= -1 / 4 * H) {
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.right)
                        this.addOrRemoveSeparator(coordinates.x + 1, coordinates.y, SeparatorType.left)
                    } else if (dy > 1 / 4 * H) {
                        let rightBottom = this.cellsProvider.getBottomRightCoordinates(coordinates.x, coordinates.y);
                        this.addOrRemoveSeparator(coordinates.x, coordinates.y, SeparatorType.rightbottom)
                        this.addOrRemoveSeparator(rightBottom.x, rightBottom.y, SeparatorType.lefttop)
                    }
                }
                break;
            default:
                throw new NeverError(this.brushType);
        }

        this.redrawCells();

        //коровки, кусты, компассы (тип 1 и тип 2)
    }

    private addOrRemoveSeparator(X: number, Y: number, type: SeparatorType) {
        let existing = this.forestType.separators.filter(s => s.X == X && s.Y == Y && s.type == type).shift();
        console.log("Existing?? " + existing)
        console.log("SEparators: " + this.forestType.separators.length)
        if (existing) {
            Utils.delete(this.forestType.separators, existing);
        } else {
            this.forestType.separators.push(new Separator(X, Y, type))
        }
    }

    private tryMoveFieldLeft(): boolean {
        for (let i = 0; i < this.forestType.mask.length; i += BaseCellsProvider.MAX_WIDTH) {
            if (this.forestType.mask[i] != ForestUtils.getChar(CellType.EMPTY)) {
                return false;
            }
        }

        this.forestType.mask = this.forestType.mask.substring(1, this.forestType.mask.length).concat(ForestUtils.getChar(CellType.EMPTY));
        return true;
    }

    private tryMoveFieldRight(): boolean {

        for (let i = BaseCellsProvider.MAX_WIDTH - 1; i < this.forestType.mask.length; i += BaseCellsProvider.MAX_WIDTH) {
            if (this.forestType.mask[i] != ForestUtils.getChar(CellType.EMPTY)) {
                return false;
            }
        }
        this.forestType.mask = ForestUtils.getChar(CellType.EMPTY) + this.forestType.mask.substring(0, this.forestType.mask.length - 1);
        return true;
    }

    private attachUI(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 0, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        return sprite;
    }

    private preset: Preset[] = [
        , { "spriteId": "downloadButton", "x": 868 + 50+50-20-5, "y": 37+17, "scaleX": 0.6599999999999998, "scaleY": 0.9199999999999999, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        , { "spriteId": "saveButton", "x": 500, "y": 57, "scaleX": 0.7599999999999998, "scaleY": 0.9199999999999999, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        //  ,{"spriteId":"renameButton","x":379,"y":56,"scaleX":0.7999999999999998,"scaleY":0.9199999999999999,"anchorX":0.5,"anchorY":0.5,"rotation":0}
        , { "spriteId": "openButton", "x": 255, "y": 52, "scaleX": 0.8599999999999999, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        , { "spriteId": "editorTopPanel", "x": 479, "y": 50, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        
        
        , { "spriteId": "playButtonEditor", "x": 742-30, "y": 56, "scaleX": 0.8599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        , { "spriteId": "playTestButtonEditor", "x": 742-30, "y": 56+80, "scaleX": 0.8599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        
        , { "spriteId": "playAutoFullButtonEditor", "x": 842-20+50-10-5, "y": 56, "scaleX": 0.8599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        , { "spriteId": "playMaxTestButtonEditor", "x": 842-20-10-5, "y": 56+80, "scaleX": 0.8599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        
        , { "spriteId": "playMaxButtonEditor", "x": 742+50-20+20-5, "y": 56, "scaleX": 0.8599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        // , { "spriteId": "playAutoButtonEditor", "x": 742+50-20, "y": 56, "scaleX": 0.6599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        // , { "spriteId": "playAutoFullButtonEditor", "x": 742+50-20, "y": 56+80, "scaleX": 0.6599999999999999/1.8, "scaleY": 0.98, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        

        , { "spriteId": "editorBottomPanel", "x": 478, "y": 1396, "scaleX": 1, "scaleY": 1.1600000000000001, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
    ]
    
    getAtlasType(){
        return null;
    }

}

enum BrushType {
    CELL_DEPENDENT, LADYBUG, LADYBUG_PLUS, SEPARATOR
}
