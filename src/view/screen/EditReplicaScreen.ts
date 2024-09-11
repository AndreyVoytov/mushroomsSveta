import DialogScreen from "./common/DialogScreen";
import BaseLayout from "../component/house/layout/BaseLayout";
import LocationUtils from "../../core/utils/LocationUtils";
import DialogPanel from "../component/dialog/DialogPanel";
import EditorValuePanel from "../component/editor/EditorValuePanel";
import EditorService from "../../core/service/EditorService";
import EditorButton from "../component/editor/EditorButton";
import BasePanel from "../component/panel/BasePanel";
import ReplicaType from "../../core/model/replica/ReplicaType";
import ReplicaDecor from "../../core/model/replica/ReplicaDecor";
import ReplicaContextType from "../../core/model/replica/ReplicaContextType";
import ReplicaDao from "../../core/dao/ReplicaDao";
import Utils from "../../core/utils/Utils";
import StoryLocation from "../../core/model/enum/StoryLocation";
import UserService from "../../core/service/UserService";
import EditorCheckBoxPanel from "../component/editor/EditorCheckBoxPanel";
import SpriteUtils from "../../core/utils/SpriteUtils";
import ReplicaDecorConfiguration from "../../core/configuration/ReplicaDecorConfiguration";


 export default class EditReplicaScreen extends DialogScreen {

    private layout:BaseLayout;
    private uiHolder: BasePanel;

    private currentReplicaIndex:number;
    private currentReplica:ReplicaType;

    private idPanel:EditorValuePanel;
    private levelPanel:EditorValuePanel;
    private animationParameterPanel:EditorValuePanel;
    private afterAnimationPanel:EditorValuePanel;
    private beforeAnimationPanel:EditorValuePanel;
    private personAnimationPanel:EditorValuePanel;
    private locationPanel:EditorValuePanel;
    private afterLevelLocationPanel:EditorValuePanel;
    private delayPanel:EditorValuePanel;
    private showDiaryCheckBox:EditorCheckBoxPanel;

    private leftArrow:Phaser.Button;
    private rightArrow:Phaser.Button;
    private leftArrow2:Phaser.Button;
    private rightArrow2:Phaser.Button;

    private editPersButton: Phaser.Button;
    private editNameButton: Phaser.Button;
    private editDecorationButton: Phaser.Button;
    private editDecoration2Button: Phaser.Button;
    
    private addActionTextButton: Phaser.Button;
    private addActionImageButton: Phaser.Button;
    private removeActionTextButton: Phaser.Button;
    
    private glintDeleteButton: Phaser.Button;
    private glintControlButton: EditorButton;
    private moveDecorButton: EditorButton;
    private glintEditMode:boolean = false;
    private moveDecorMode:boolean = false;

    private lastDecor2Touched = false;

    private getPersName(characterImage: string){
        if(characterImage.startsWith("sveta")){
            return "Эмма"
        } else if(characterImage.startsWith("cat")){
            return "Котёнок"
        } else if(characterImage.startsWith("sova")){
            return "Совёнок"
        } else if(characterImage.startsWith("leshii")){
            return "Леший"
        } else if (characterImage.startsWith("belka")){
            return "Белка"
        } else if (characterImage.startsWith("yaga")){
            return "Хозяйка"
        } else if (characterImage.startsWith("dwarfs")){
            return "Гномики"
        } else if (characterImage.startsWith("cyclop")){
            return "Циклоп"
        }
        return "text";
    }

    private animations = ["transition", "stormTransition", "textTransition",  "openChest", "cooking", "boilerBurst", "memoryRestoration1", "memoryRestoration2", "memoryRestoration3",
                            "unicornMove", "unicornShow", "unicornHide",  "mountineVisionShow", "mountineVisionZoom", "mountineVisionHide", "hideBoots"
                        ];
    private personalAnimations = ["love", "ideaBubble", "questionBubble", "eatBubble", "fooBubble", "drinkBubble"];
    private characters = ["sveta1", "sveta2", "sveta3", "sveta4", "sveta5", 
                          "cat1", "cat2", "cat3", "cat4",
                          "leshii1", "leshii2", "leshii3",
                          "sova1", "sova2", "sova3",
                           "belka1", "belka2", "belka3",
                            "yaga1", "yaga2", "yaga3",
                          "unicorn2", "cyclop", "dwarfs", 
                        ];
    
    // private decorations = ["book", "cat1cheeks", "keyBig", "mirror2", "plate1", "plate2"]
    private actionImages = ["actionBoiler", "actionChest", "actionCream", "actionDoor", "goldRoot", "actionMap",
                            "actionHouse", "actionKey", "actionMushroom", "tree", "unicorn3", "poleno", "owl", "loupe", "actionBoots", "wheat"]

    public create(): void {
        this.currentReplica = EditorService.getCurrentReplica();
        this.currentReplicaIndex = ReplicaDao.getEntity().getAll().indexOf(this.currentReplica);

        this.game.input.onDown.add((event: MouseEvent) => {
            if(this.glintEditMode){
                
                let x = Math.round(this.game.input.activePointer.worldX) - this.dialogPanel.replicaPanel.x;
                let y = Math.round(this.game.input.activePointer.worldY)- this.dialogPanel.replicaPanel.y;

                // console.log("GLINT ON INPUT DOWN!!! " + x + " " + y)
                this.currentReplica.glint = new Phaser.Point(x, y);
                this.glintEditMode = false;
                if(this.glintControlButton) this.glintControlButton.tint = this.glintEditMode? 0xff55ff : 0xffffff;
                this.updateState(true);
            }

            if(this.moveDecorMode){
                let inpX = this.game.input.activePointer.worldX;
                let inpY = this.game.input.activePointer.worldY;
                
                let x = Math.round(inpX) - this.dialogPanel.replicaPanel.x - 180;
                let y = 11 - (Math.round(inpY)- this.dialogPanel.replicaPanel.y);

                if (Utils.dist(inpX, inpY, this.moveDecorButton.x, this.moveDecorButton.y) > this.moveDecorButton.width/2 &&
                    Utils.dist(inpX, inpY, this.leftArrow.x, this.leftArrow.y) > this.leftArrow.width * 2 &&
                    Utils.dist(inpX, inpY, this.leftArrow2.x, this.leftArrow2.y) > this.leftArrow2.width * 2 &&
                    Utils.dist(inpX, inpY, this.rightArrow.x, this.rightArrow.y) > this.rightArrow.width * 2 &&
                    Utils.dist(inpX, inpY, this.rightArrow2.x, this.rightArrow2.y) > this.rightArrow2.width * 2 
                    ){
                    if(this.lastDecor2Touched && this.currentReplica.decor2){
                        if(this.currentReplica.rightSide){
                            this.currentReplica.decor2.x = this.game.width - x - 240;
                            this.currentReplica.decor2.y = y;
                        } else {
                            this.currentReplica.decor2.x = x;
                            this.currentReplica.decor2.y = y;
                        }
                    } else if(this.currentReplica.decor){
                        if(this.currentReplica.rightSide){
                            this.currentReplica.decor.x = this.game.width - x - 240;
                            this.currentReplica.decor.y = y;
                        } else {
                            this.currentReplica.decor.x = x;
                            this.currentReplica.decor.y = y;
                        }
                    }
                    
                    this.updateState(true);
                } 
            }
        });

        this.uiHolder = new BasePanel(this.game, 0,0);
        this.addPanel(this.uiHolder);

        
        this.dialogPanel = new DialogPanel(this.game, this, (animation:string) => this.playAnimation(animation), () => { return this.currentReplica});
        this.addSprite(this.dialogPanel)
        this.updateState(true);
        this.game.time.events.repeat(10, 10000000, ()=>{
            this.uiHolder.bringToTop();
        });

        this.idPanel = new EditorValuePanel(this.game, "id", () => this.currentReplica.id, (p:EditorValuePanel) => {
            EditorService.showTextField("Изменить id", p.getValue(), (value:string) => {
                this.currentReplica.id = value;
                ReplicaDao.getEntity().update(this.currentReplica);

                p.resetPanel()
            })
        })
        this.idPanel.x += this.idPanel.width/2;
        this.idPanel.y += this.idPanel.height/2;
        this.uiHolder.addSprite(this.idPanel);

        this.locationPanel = new EditorValuePanel(this.game, "location", () => this.currentReplica.location? "" + Utils.enumKeys(StoryLocation)[this.currentReplica.location] : "", (p:EditorValuePanel) => {
            EditorService.showSimpleList("Изменить location", Utils.enumKeys(StoryLocation).concat("None"), (value:string) => {
                if(value == "None"){
                    this.currentReplica.location = null;
                } else {
                    this.currentReplica.location = Utils.enumKeys(StoryLocation).indexOf(value);
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                p.resetPanel();
            })
        })
        this.locationPanel.x += this.idPanel.width * (1 + 1/2);
        this.locationPanel.y += this.idPanel.height/2;
        this.uiHolder.addSprite(this.locationPanel);

        this.afterLevelLocationPanel = new EditorValuePanel(this.game, "afterLvlLoc", 
        () => this.currentReplica.afterLevelLocation? "" + Utils.enumKeys(StoryLocation)[this.currentReplica.afterLevelLocation] : "", (p:EditorValuePanel) => {
            EditorService.showSimpleList("Изменить afterLevelLocation", Utils.enumKeys(StoryLocation).concat("None"), (value:string) => {
                if(value == "None"){
                    this.currentReplica.afterLevelLocation = null;
                } else {
                    this.currentReplica.afterLevelLocation = Utils.enumKeys(StoryLocation).indexOf(value);
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                p.resetPanel();
            })
        })
        this.afterLevelLocationPanel.x += this.idPanel.width * (1 + 1/2);
        this.afterLevelLocationPanel.y += this.idPanel.height * (1  + 1/2);
        this.uiHolder.addSprite(this.afterLevelLocationPanel);

        this.delayPanel = new EditorValuePanel(this.game, "delay", () => this.currentReplica.delay? "" + this.currentReplica.delay : "", (p:EditorValuePanel) => {
            EditorService.showTextField("Изменить delay", p.getValue(), (value:string) => {
                if(isNaN(Number(value))){
                    alert("Здесь должно быть число!")
                } else {
                    if(Number(value) == 0){
                        this.currentReplica.delay = null;
                    } else {
                        this.currentReplica.delay = Number(value);
                    }
                    ReplicaDao.getEntity().update(this.currentReplica);
                    
                    p.resetPanel()
                }
            })
        })
        this.delayPanel.x += this.idPanel.width * (1 + 1/2);
        this.delayPanel.y += this.idPanel.height * (2 + 1/2) ;
        this.uiHolder.addSprite(this.delayPanel);

        
        this.animationParameterPanel = new EditorValuePanel(this.game, "animParam", () =>
            this.currentReplica.afterAnimation && this.currentReplica.afterAnimation.indexOf("(") != -1? this.currentReplica.afterAnimation.split("(")[1].split(")")[0] : ""
        , (p:EditorValuePanel) => {
            EditorService.showTextField("Изменить animationParameter", p.getValue(), (value:string) => {
                if(this.currentReplica.afterAnimation){
                    this.currentReplica.afterAnimation = this.currentReplica.afterAnimation.split("(")[0] + "(" + value + ")"
                } else {
                    alert("Сначала добавьте animation!")
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                
                p.resetPanel()
            })
        })
        this.animationParameterPanel.x += this.idPanel.width * (2 + 1/2);
        this.animationParameterPanel.y += this.idPanel.height * (1 + 1/2) ;
        this.uiHolder.addSprite(this.animationParameterPanel);

        this.levelPanel = new EditorValuePanel(this.game, "level", () => "" + this.currentReplica.context.level, (p:EditorValuePanel) => {
            EditorService.showTextField("Изменить level", p.getValue(), (value:string) => {
                if(isNaN(Number(value))){
                    alert("Здесь должно быть число!")
                } else {
                    this.currentReplica.context.level = Number(value);
                    ReplicaDao.getEntity().update(this.currentReplica);
                    
                    p.resetPanel()
                }
            })
        })
        this.levelPanel.x += this.idPanel.width/2;
        this.levelPanel.y += this.idPanel.height * (1 + 1/2) ;
        this.uiHolder.addSprite(this.levelPanel);

        let plusOneButton = SpriteUtils.createButton(this.game, 0,0,"plusOne", ()=>{
            let confirm = window.confirm("Вы действительно хотите добавить +1 к требуемому level для всех реплик после '" + this.currentReplica.id + " включительно'?");
            if (confirm) {
                ReplicaDao.getEntity().getAll().forEach((r, i) => {
                    if(i >= this.currentReplicaIndex){
                        r.context.level ++;
                    }
                })
                ReplicaDao.getEntity().updateAll();
                this.updateState();
            }  
        });
        plusOneButton.x = this.levelPanel.x + this.levelPanel.width/2 - plusOneButton.width - 10; 
        plusOneButton.y = this.levelPanel.y;
        plusOneButton.anchor.set(1, 0.5); 
        this.uiHolder.addChild(plusOneButton);

        let minusOneButton = SpriteUtils.createButton(this.game, 0,0,"minusOne", ()=>{
            let confirm = window.confirm("Вы действительно хотите отнять -1 от требуемого level для всех реплик после '" + this.currentReplica.id + " включительно'?");
            if (confirm) {
                ReplicaDao.getEntity().getAll().forEach((r, i) => {
                    if(i >= this.currentReplicaIndex){
                        r.context.level --;
                    }
                })
                ReplicaDao.getEntity().updateAll();
                this.updateState();
            }  
        });
        minusOneButton.x = this.levelPanel.x + this.levelPanel.width/2 - 2*plusOneButton.width - 15;
        minusOneButton.y = this.levelPanel.y;
        minusOneButton.anchor.set(1, 0.5);
        this.uiHolder.addChild(minusOneButton);


        this.afterAnimationPanel = new EditorValuePanel(this.game, "afterAnim", () => {
            if(this.currentReplica.afterAnimation){
                return this.currentReplica.afterAnimation.indexOf("(") != -1? this.currentReplica.afterAnimation.split("(")[0]: this.currentReplica.afterAnimation;
            }
            return "";

        }, (p:EditorValuePanel) => {
            EditorService.showSimpleList("Изменить afterAnimation", this.animations.concat(["None"]), (value:string) => {
            
                if(value == "None"){
                    this.currentReplica.afterAnimation = null;
                } else {
                    this.currentReplica.afterAnimation = value;
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                p.resetPanel();
                this.animationParameterPanel.resetPanel();
            })
        })
        this.afterAnimationPanel.x += this.idPanel.width * (2 + 1/2);
        this.afterAnimationPanel.y += this.idPanel.height * (0 + 1/2) ;
        this.uiHolder.addSprite(this.afterAnimationPanel);

        this.beforeAnimationPanel = new EditorValuePanel(this.game, "beforeAnim", () => {
            if(this.currentReplica.beforeAnimation){
                return this.currentReplica.beforeAnimation.indexOf("(") != -1? this.currentReplica.beforeAnimation.split("(")[0]: this.currentReplica.beforeAnimation;
            }
            return "";

        }, (p:EditorValuePanel) => {
            EditorService.showSimpleList("Изменить beforeAnimation", this.animations.concat(["None"]), (value:string) => {
            
                if(value == "None"){
                    this.currentReplica.beforeAnimation = null;
                } else {
                    this.currentReplica.beforeAnimation = value;
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                p.resetPanel();
                this.animationParameterPanel.resetPanel();
            })
        })
        this.beforeAnimationPanel.x += this.idPanel.width * (2 + 1/2);
        this.beforeAnimationPanel.y += this.idPanel.height * (2 + 1/2) ;
        this.uiHolder.addSprite(this.beforeAnimationPanel);

        this.personAnimationPanel = new EditorValuePanel(this.game, "persAnim", () => this.currentReplica.personalAnimation || "", (p:EditorValuePanel) => {
            EditorService.showSimpleList("Изменить personalAnimation", this.personalAnimations.concat(["None"]), (value:string) => { 
            
                if(value == "None"){
                    this.currentReplica.personalAnimation = null;
                } else {
                    this.currentReplica.personalAnimation = value;
                }
                ReplicaDao.getEntity().update(this.currentReplica);
                p.resetPanel();
            })
        })
        this.personAnimationPanel.x += this.idPanel.width/2;
        this.personAnimationPanel.y += this.idPanel.height * (2 + 1/2) ;
        this.uiHolder.addSprite(this.personAnimationPanel);


        this.showDiaryCheckBox = new EditorCheckBoxPanel(this.game, "showDiary", () => this.currentReplica.showDiary, (p:EditorCheckBoxPanel) => {
            this.currentReplica.showDiary = !this.currentReplica.showDiary;
            ReplicaDao.getEntity().update(this.currentReplica);
            p.resetPanel();
        })
        this.showDiaryCheckBox.x += this.idPanel.width/2;
        this.showDiaryCheckBox.y += this.idPanel.height * (3 + 1/2) ;
        this.uiHolder.addSprite(this.showDiaryCheckBox);
        this.showDiaryCheckBox.resetPanel();

        let downloadButton = new EditorButton(this.game, "exportIcon", ()=>{
            EditorService.downloadReplicas();
        });
        downloadButton.x = this.game.width - downloadButton.width/2;
        downloadButton.y += downloadButton.height * (0 + 1/2) ;
        this.uiHolder.addSprite(downloadButton);

        let folderButton = new EditorButton(this.game, "folderIcon", ()=>{
            EditorService.showReplicaEditorDialog(this.game);
        });
        folderButton.x = this.game.width - downloadButton.width/2;
        folderButton.y += downloadButton.height * (1 + 1/2) ;
        this.uiHolder.addSprite(folderButton);

        let switchCharacterButton = new EditorButton(this.game, "switchIcon", ()=>{
            this.currentReplica.rightSide = !this.currentReplica.rightSide; 
            if(this.currentReplica.decor){
                this.currentReplica.decor.rightSide = !this.currentReplica.decor.rightSide;
            }
            if(this.currentReplica.decor2){
                this.currentReplica.decor2.rightSide = !this.currentReplica.decor2.rightSide;
            }
            this.updateSidesForButtons();

            ReplicaDao.getEntity().update(this.currentReplica);

            this.updateState(true);
        });
        switchCharacterButton.x = this.game.width - downloadButton.width/2;
        switchCharacterButton.y += downloadButton.height * (2 + 1/2) ;
        this.uiHolder.addSprite(switchCharacterButton);

        //arrows 
        this.leftArrow = SpriteUtils.createButton(this.game, 0,0, "editorArrowPanel", ()=>{
            this.turnOffDecroAndGlintControllers();
            // console.log(ReplicaDao.getEntity().getAll()) 
            this.currentReplicaIndex = Math.max(0, this.currentReplicaIndex - 1); 
            
            let sideWas = this.currentReplica.rightSide;

            this.updateState();
            EditorService.setCurrentReplicaId(this.currentReplica.id);

            let sideNow = this.currentReplica.rightSide;

            if(sideWas != sideNow)
            this.updateSidesForButtons();

        })
        this.leftArrow.x = this.game.width - downloadButton.width;
        this.leftArrow.y += this.game.height/2 - 300 - downloadButton.height * (1 + 1/2);
        this.uiHolder.addChild(this.leftArrow);

        this.rightArrow = SpriteUtils.createButton(this.game, 0,0, "editorArrowPanel", ()=>{
            this.turnOffDecroAndGlintControllers();
            this.currentReplicaIndex = Math.min(ReplicaDao.getEntity().getAll().length-1, this.currentReplicaIndex + 1); 
            this.updateState(false, true);
            EditorService.setCurrentReplicaId(this.currentReplica.id);
        })
        this.rightArrow.scale.set(-1, 1);
        this.rightArrow.x = this.game.width;
        this.rightArrow.y += this.game.height/2 - 300 - downloadButton.height * (1 + 1/2);
        this.uiHolder.addChild(this.rightArrow);

        //arrows 2 (быстрые стрелки без анимаций)
        this.leftArrow2 = SpriteUtils.createButton(this.game, 0,0, "editorArrow2Panel", ()=>{
            this.turnOffDecroAndGlintControllers();
            if(this.dialogPanel.replicaDelay == 0){
                this.currentReplicaIndex = Math.max(0, this.currentReplicaIndex - 1); 
                this.updateState(true);
                EditorService.setCurrentReplicaId(this.currentReplica.id);
            }
        })
        this.leftArrow2.x = this.game.width - downloadButton.width;
        this.leftArrow2.y += this.game.height/2 - 300 - downloadButton.height * (-2 + 1/2) + this.leftArrow.height- 5;
        this.uiHolder.addChild(this.leftArrow2);

        this.rightArrow2 = SpriteUtils.createButton(this.game, 0,0, "editorArrow2Panel", ()=>{
            this.turnOffDecroAndGlintControllers();
            if(this.dialogPanel.replicaDelay == 0){
                this.currentReplicaIndex = Math.min(ReplicaDao.getEntity().getAll().length-1, this.currentReplicaIndex + 1); 
                this.updateState(true);
                EditorService.setCurrentReplicaId(this.currentReplica.id);
            }
        })
        this.rightArrow2.scale.set(-1, 1);
        this.rightArrow2.x = this.game.width;
        this.rightArrow2.y += this.game.height/2 - 300 - downloadButton.height * (-2 + 1/2) + this.leftArrow.height- 5;
        this.uiHolder.addChild(this.rightArrow2);



        let restartreplicaButton = new EditorButton(this.game, "repeatIcon", ()=>{
            this.playPreviousAnimation();
            this.updateState();
        });
        restartreplicaButton.x = this.game.width - downloadButton.width/2;
        restartreplicaButton.y += this.game.height/2 - 300 + downloadButton.height * (-1/2) + 5;
        this.uiHolder.addSprite(restartreplicaButton);

        let playReplicaButton = new EditorButton(this.game, "playIcon", ()=>{
            window.location.href = "/?skip&edit&clearUser&level=" + this.currentReplica.context.level;
        });
        playReplicaButton.x = this.game.width - downloadButton.width/2;
        playReplicaButton.y += this.game.height/2 - 300 + downloadButton.height * (1 - 1/2) + 5;
        this.uiHolder.addSprite(playReplicaButton);

        let editorNextButton = new EditorButton(this.game, "editorNextButton", ()=>{
            this.turnOffDecroAndGlintControllers();
            EditorService.showTextField("Введите id новой реплики", this.currentReplica.id, (value:string) => {
                let newReplica = new ReplicaType();
                newReplica.id = value;
                newReplica.personImage = this.currentReplica.personImage;
                newReplica.personName = this.getPersName(newReplica.personImage);

                newReplica.rightSide = this.currentReplica.rightSide;
                newReplica.text = "text";
                newReplica.context = new ReplicaContextType();
                newReplica.context.level = this.currentReplica.context.level;
                
                ReplicaDao.getEntity().getAll().splice(this.currentReplicaIndex + 1, 0, newReplica);
                ReplicaDao.getEntity().updateAll();
                this.currentReplicaIndex = this.currentReplicaIndex + 1;
                this.updateState();            
            })
         });
         editorNextButton.x = this.game.width - downloadButton.width/2;
         editorNextButton.y += this.game.height/2 - 300 + downloadButton.height * (2 - 1/2) + 5;
         this.uiHolder.addSprite(editorNextButton);



        //replica buttons
        let editReplicaButton = SpriteUtils.createButton(this.game, 915, this.game.height - 1860 + 1597, "renameButton", ()=> {
            EditorService.showTextField("Изменить реплику", this.currentReplica.text, (value:string) => {
                this.currentReplica.text = value;
                ReplicaDao.getEntity().update(this.currentReplica);
                this.updateState(true);
            })
        })
        editReplicaButton.anchor.set(0.5);
        editReplicaButton.scale.set(1.5);
        this.uiHolder.addChild(editReplicaButton);
        
        this.editNameButton = SpriteUtils.createButton(this.game, 299, this.game.height - 1860 + 1460, "renameButton", ()=> {
            EditorService.showTextField("Изменить имя", this.currentReplica.personName, (value:string) => {

                this.currentReplica.personName = value;
                ReplicaDao.getEntity().update(this.currentReplica);

                this.updateState(true);
            })
        })
        this.editNameButton.anchor.set(0.5);
        this.uiHolder.addChild(this.editNameButton);

        this.editPersButton = SpriteUtils.createButton(this.game, 82, this.game.height - 1860 + 1351, "renameButton", ()=> {
            EditorService.showSimpleList("Изменить персонажа", this.characters, (value:string) => {

                this.currentReplica.personImage = value;
                this.currentReplica.personName = this.getPersName(value);
                ReplicaDao.getEntity().update(this.currentReplica);

                this.updateState(true);
            })
        })
        this.editPersButton.anchor.set(0.5);
        this.editPersButton.scale.set(1.5);
        this.uiHolder.addChild(this.editPersButton);

        this.editDecorationButton = SpriteUtils.createButton(this.game, 475, this.game.height - 1860 + 1478, "editorPlusButton", ()=> {
            this.lastDecor2Touched = false;
            EditorService.showSimpleList("Изменить декорацию", ReplicaDecorConfiguration.allDecor.map(d => d.image).concat(["None"]), (value:string) => { 

                if(value == "None"){
                    this.currentReplica.decor = null;
                } else {
                    this.currentReplica.decor = ReplicaDecorConfiguration.allDecor.filter(d => d.image == value).shift();
                    this.currentReplica.decor.rightSide = this.currentReplica.rightSide;

                    ReplicaDao.getEntity().update(this.currentReplica);
                }

                this.updateState(true);
            })
        })
        this.editDecorationButton.anchor.set(0.5);
        this.uiHolder.addChild(this.editDecorationButton);
        this.editDecorationButton.loadTexture("plusButton");
        if(this.currentReplica.decor){
            this.editDecorationButton.loadTexture("renameButton")
        }

        this.editDecoration2Button = SpriteUtils.createButton(this.game, 475, this.game.height - 1860 + 1478 - 50, "editorPlusButton", ()=> {
            this.lastDecor2Touched = true;
            EditorService.showSimpleList("Изменить декорацию", ReplicaDecorConfiguration.allDecor.map(d => d.image).concat(["None"]), (value:string) => { 

                if(value == "None"){
                    this.currentReplica.decor2 = null;
                } else {
                    this.currentReplica.decor2 = ReplicaDecorConfiguration.allDecor.filter(d => d.image == value).shift();
                    this.currentReplica.decor2.rightSide = this.currentReplica.rightSide;

                    ReplicaDao.getEntity().update(this.currentReplica);
                }

                this.updateState(true);
            })
        })
        this.editDecoration2Button.anchor.set(0.5);
        this.uiHolder.addChild(this.editDecoration2Button);
        this.editDecoration2Button.visible = this.currentReplica.decor ? true : false;
        if(this.currentReplica.decor2){
            this.editDecoration2Button.loadTexture("renameButton")
        }

        //action button        
        this.addActionTextButton  = SpriteUtils.createButton(this.game, 807, this.game.height - 1860 + 1779, "renameButton", ()=> {
            EditorService.showTextField("Добавить кнопку с текстом", this.currentReplica.buttonName || "", (value:string) => {

                this.currentReplica.buttonName = value;
                ReplicaDao.getEntity().update(this.currentReplica);

                this.updateState(true);
            })
        })
        this.addActionTextButton.anchor.set(0.5);
        this.addActionTextButton.scale.set(1.5);
        this.uiHolder.addChild(this.addActionTextButton);
        this.addActionTextButton.visible = this.currentReplica.buttonName? false:true;

        this.addActionImageButton  = SpriteUtils.createButton(this.game, 807, this.game.height - 1860 + 1779 + 30, "renameButton", ()=> {
            EditorService.showSimpleList("Изменить картинку кнопки", this.actionImages, (value:string) => { //TODO list
                this.currentReplica.buttonImage = value;
                ReplicaDao.getEntity().update(this.currentReplica);
                this.updateState(true);
            })
        })

        this.addActionImageButton.anchor.set(0.5);
        this.uiHolder.addChild(this.addActionImageButton);
        this.addActionImageButton.visible = this.currentReplica.buttonName? true:false;


        this.removeActionTextButton  = SpriteUtils.createButton(this.game, 807, this.game.height - 1860 + 1779 - 30, "glintDeleteButton", ()=> {
            this.currentReplica.buttonName = null;
            this.currentReplica.buttonImage = null;

            this.updateState(true);
        })
        this.removeActionTextButton.anchor.set(0.5);
        this.uiHolder.addChild(this.removeActionTextButton);
        this.removeActionTextButton.visible = this.currentReplica.buttonName? true:false;

        //glint        
        this.glintControlButton  = new EditorButton(this.game, "glintIcon", ()=> {
            this.game.time.events.add(100, ()=>{
                console.log("GLINT CONTROL CLICKED!")
                this.glintEditMode = !this.glintEditMode;

                if(this.glintControlButton) this.glintControlButton.tint = this.glintEditMode? 0xff55ff : 0xffffff;
            })
        })
        this.glintControlButton.y = this.game.height - 1860 + 755;
        this.glintControlButton.x = this.glintControlButton.width/2;
        this.uiHolder.addChild(this.glintControlButton);

        this.moveDecorButton  = new EditorButton(this.game, "moveIcon", ()=> {
            this.game.time.events.add(100, ()=>{
                this.moveDecorMode = !this.moveDecorMode;

                if(this.moveDecorButton) this.moveDecorButton.tint = this.moveDecorMode? 0xff55ff : 0xffffff;

                ReplicaDao.getEntity().update(this.currentReplica);
            })
        })
        this.moveDecorButton.y = this.game.height - 1860 + 755 + this.glintControlButton.height;
        this.moveDecorButton.x = this.moveDecorButton.width/2;
        this.uiHolder.addChild(this.moveDecorButton);

        this.glintDeleteButton  = SpriteUtils.createButton(this.game, 0, 0, "glintDeleteButton", ()=> {
            this.currentReplica.glint = null;

            this.updateState(true);
        })
        this.glintDeleteButton.anchor.set(0, 0.5);
        this.glintDeleteButton.x = this.glintControlButton.width;
        this.glintDeleteButton.y = this.glintControlButton.y;
        this.uiHolder.addChild(this.glintDeleteButton);
        this.glintDeleteButton.visible = this.currentReplica.glint? true:false;

        if(this.currentReplica.rightSide){
            this.updateSidesForButtons();
        }
  
        //III. Прописать сюжетец
        //      - сразу прикинуть, куда можно вставить реплику-выбор             
        //IV. Уровень с поиском дров! - сейчас???
 
        //(!) Сюжет должен оставаться максимально легковесным!!!!! Ведь мы его заставляем читать!

        //0) Расставить корректно бурления котелка и delay!
        //1) Прописывание сюжета!!!
      
        // (2) Внедряем уровни 170

        //БАГИ: repeatAnimation ломает реплику!

        //5. Предметы запилить - 1 час (нужно, чтобы сейчас анимации не ломались)
        //6. Перед тем, как пользовться редактором - коммит!!!
        
        //БАГИ:
        //1. Деревья на уровне в доме!
        //2. Котик слишком рано на FailPanel - в том же доме
        //3. На t43 не даёт открыть нижние клетки (хотя их полностью видно!)

        //7. Залить и выровнять всех персонажей!!! 
        // Может Свет повыше сделать? Или sveta5 - пониже
        // sveta3 - белый кусок фона в волосах

    }
    
    private updateState(noAnimations?:boolean, naturalOrder?:boolean){
        let oldReplica = this.currentReplica;
        this.currentReplica =  ReplicaDao.getEntity().getAll()[this.currentReplicaIndex];

        if(!noAnimations){
            this.playPreviousAnimation();
        }

        this.dialogPanel.updateReplica(false, noAnimations, true)
        this.time.events.add(100, ()=>{
            if(this.dialogPanel.replicaPanel && this.dialogPanel.replicaPanel.r != this.currentReplica){
                this.updateState();
            }
        })

        let previousLocation = ReplicaDao.getEntity().getLocationForLevelAndReplica(oldReplica.context.level, oldReplica).location;
        let location = ReplicaDao.getEntity().getLocationForLevelAndReplica(this.currentReplica.context.level, this.currentReplica).location;
        this.time.events.add(this.currentReplica.delay  || 1, () => {
            if(!this.layout || (oldReplica.context.level != this.currentReplica.context.level && !this.currentReplica.beforeAnimation) || noAnimations || !LocationUtils.samePlace(previousLocation, location) || !naturalOrder){
                // console.log("EditReplicaScreen: UPDATE LAYOUT " + String(oldReplica.context.level != this.currentReplica.context.level) + " " + String(noAnimations) + " " +String(!this.samePlace(previousLocation, location)) + " " + String(!naturalOrder))
                if(this.layout) this.layout.kill();
                this.layout = LocationUtils.doGetLocationLayout(this.game, location);
                this.addPanel(this.layout);
                this.dialogPanel.bringToTop();
                this.uiHolder.bringToTop();
            }
        })

        if(this.idPanel) this.idPanel.resetPanel();
        if(this.levelPanel) this.levelPanel.resetPanel();
        if(this.beforeAnimationPanel) this.beforeAnimationPanel.resetPanel();
        if(this.afterAnimationPanel) this.afterAnimationPanel.resetPanel();
        if(this.animationParameterPanel) this.animationParameterPanel.resetPanel();
        if(this.personAnimationPanel) this.personAnimationPanel.resetPanel();
        if(this.locationPanel) this.locationPanel.resetPanel();
        if(this.afterLevelLocationPanel) this.afterLevelLocationPanel.resetPanel();
        if(this.delayPanel) this.delayPanel.resetPanel();
        if(this.showDiaryCheckBox) this.showDiaryCheckBox.resetPanel();

        if(this.addActionTextButton) this.addActionTextButton.visible = this.currentReplica.buttonName? false : true;
        if(this.addActionImageButton) this.addActionImageButton.visible = this.currentReplica.buttonName? true : false;
        if(this.addActionImageButton) this.removeActionTextButton.visible = this.currentReplica.buttonName? true : false;

        if(this.glintDeleteButton) this.glintDeleteButton.visible = this.currentReplica.glint? true:false;

        if(this.editDecorationButton && this.editDecoration2Button && this.editDecorationButton.game){
            if(this.currentReplica && this.currentReplica.decor) { 
                this.editDecorationButton.loadTexture("renameButton");
                this.editDecoration2Button.visible = true;
                this.editDecoration2Button.loadTexture(this.currentReplica.decor2 ? "renameButton" : "editorPlusButton");
            } else if(this.currentReplica){
                this.editDecorationButton.loadTexture("editorPlusButton");
                this.editDecoration2Button.visible = this.currentReplica.decor2? true : false;
            }
        }

        this.updateSidesForButtons();
    }

    private updateSidesForButtons(){
        if(this.editPersButton && this.editNameButton && this.editDecorationButton && this.editDecoration2Button) {
            if(this.currentReplica.rightSide && this.editPersButton.x < this.game.width/2 || !this.currentReplica.rightSide && this.editPersButton.x > this.game.width/2){
                this.editPersButton.x = this.game.width - this.editPersButton.x;
                this.editNameButton.x = this.game.width - this.editNameButton.x;
                this.editDecorationButton.x = this.game.width - this.editDecorationButton.x;
                this.editDecoration2Button.x = this.game.width - this.editDecoration2Button.x;
            }
        }
    }

    private playPreviousAnimation():void{
        let previousIndex = Math.max(0, this.currentReplicaIndex - 1);
        let previousReplica =  ReplicaDao.getEntity().getAll()[previousIndex];
        if(previousReplica != null && previousIndex != this.currentReplicaIndex && previousReplica.context.level == this.currentReplica.context.level && previousReplica.afterAnimation){
            this.playAnimation(previousReplica.afterAnimation);
        }
    }

    protected playAnimation(animationId:string):void{
        if(this.layout){
            this.layout.playAnimation(animationId);
        }
    }

    private turnOffDecroAndGlintControllers(){
        this.glintEditMode = false;
        if(this.glintControlButton) this.glintControlButton.tint = this.glintEditMode? 0xff55ff : 0xffffff;
        
        this.moveDecorMode = false;
        if(this.moveDecorButton) this.moveDecorButton.tint = this.moveDecorMode? 0xff55ff : 0xffffff;

        // ReplicaDao.getEntity().update(this.currentReplica);
    }
}