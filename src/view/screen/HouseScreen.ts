import StripsPanel from '../component/dialog/StripsPanel';
import UserService from '../../core/service/UserService';
import AnimationUtils from './../../core/utils/AnimationUtils';
import ForestUtils from './../../core/utils/ForestUtils';
import LocationUtils from './../../core/utils/LocationUtils';
import DiaryContentType from '../../core/model/diary/DiaryContentType';
import DiaryConfiguration from '../../core/configuration/DiaryConfiguration';
import ColorTransitionPanel from './../component/../component/panel/ColorTransitionPanel';
import InfoPanel from './../component/../component/panel/InfoPanel';
import ProgressBar from './../component/../component/panel/ProgressBar';
import TreesTransitionPanel from './../component/../component/panel/TreesTransitionPanel';
import ReplicaPanel from './../component/dialog/ReplicaPanel';
import DiaryPanel from '../component/diary/DiaryPanel';
import GemsPanel from './../component/house/GemsPanel';
import KeysPanel from './../component/house/KeysPanel';
import LifesPanel from './../component/house/LifesPanel';
import StartLevelPanel from './../component/house/StartLevelPanel';
import BaseLayout from '../component/house/layout/BaseLayout';
import DialogScreen from './common/DialogScreen';
import ForestScreen from './ForestScreen';
import LoadingScreen from './LoadingScreen';
import EditorService from '../../core/service/EditorService';
import ForestDao from '../../core/dao/ForestDao';
import RecipeUtils from '../../core/utils/RecipeUtils';
import ServerStoreComponent from '../../core/service/store/ServerStoreComponent';
import SpriteUtils from '../../core/utils/SpriteUtils';
import AllLevelsCompletePanel from '../component/house/AllLevelsCompletePanel';
import Skewable from '../component/panel/Skewable';
import Utils from '../../core/utils/Utils';
import { Easing } from 'phaser-ce';
import AdminService from '../../core/service/AdminService';
import BuyConfirmPanel from '../component/house/BuyConfirmPanel';
import Buy from '../../core/model/shop/Buy';
import Settings from '../../core/service/Settings';
import EverydayRubyPanel from '../component/house/EverydayRubyPanel';
import User from '../../core/model/user/User';
import SoundUtils from '../../core/utils/SoundUtils';
import ForestLayout from '../component/house/layout/ForestLayout';
import StoryLocation from '../../core/model/enum/StoryLocation';
import SettingsPanel from '../component/house/SettingsPanel';
import Game from '../game/Game';
import EventPanel from '../component/house/EventPanel';
import Label from '../component/panel/Label';
import EventUtils from './../../core/utils/EventUtils';
import EventInfo from './../../core/model/event/EventInfo';
import EventType from './../../core/model/event/EventType';
import HouseFrameLayout from '../component/house/layout/HouseFrameLayout';
import HouseLayout from '../component/house/layout/HouseLayout';
export default class HouseScreen extends DialogScreen {

    private layout: BaseLayout;

    private keysPanel: KeysPanel;
    private gemsPanel: GemsPanel;
    private lifesPanel: LifesPanel;
    private settingsButton: Phaser.Button;
    private settingsButtonStartX: number;

    // private everydayRubiesButton: Phaser.Button;
    // private eventButton: Phaser.Button;
    
    private rightButtons:PIXI.DisplayObject[] = [];
    private rightButtonsX: number ;

    //TODO compose into playButton
    private level: Label;
    private playButton: Phaser.Button;

    private notebookButton: Phaser.Button;

    public startLevelPanel: StartLevelPanel;
    public settingsPanel: SettingsPanel;
    private diaryPanel: DiaryPanel;

    private tasks: DiaryContentType;
    private progressBar: ProgressBar;

    private cat: Phaser.Sprite;
    private arrow: Phaser.Sprite;

    public uiHidden: boolean = false;
    private canNotTouchUI: boolean = false;

    public shopShown: boolean = false;
    public lifeDetailsShown: boolean = false;

    public progressAnimation: boolean = false;

    private fakeTrees: Phaser.Sprite;

    private eventsToShow: EventType[] = [];

    public create(): void {
        super.create();

        this.world.setBounds(0, 0, this.game.width, this.game.height);

        this.game.input.onDown.add((event: MouseEvent) => this.onMouseUp(event));

        this.initialize();
    }

    public preload(){
        if (!Game.WHITE_TRANSITION) {
            if(LocationUtils.isHouseStoryLocation(UserService.getUser())){
                this.fakeTrees = this.add.existing(new BaseLayout(this.game, "NearHouseLayout", "forestHouseBg"));
            } else {
                this.fakeTrees = this.add.existing(new TreesTransitionPanel(this.game, false, 0, 0));
            }
        }

        this.eventsToShow = EventUtils.updateEvents();
        this.loadOptionalAtlases()

        // let start = Date.now();
        // while (Date.now() - start < 1500) {
        //     // Пустой цикл, ожидаем истечения времени
        //   }
    }

    public initialize(blackFadeOut?: boolean): void {

        SoundUtils.birds1();
        

        this.rightButtons = [];
        this.rightButtonsX = this.game.width -100
        this.lifeDetailsShown = false;
        this.shopShown = false;
        this.uiHidden = false;
        this.canNotTouchUI = false;
        let user = UserService.getUser();
        console.log("HOUSE SCREEN USER LOCATION: " + user.getLocation())

        if(user.isJustCompletedLevel()){
            ServerStoreComponent.syncronizeUserWithServer();
        }

        this.layout = LocationUtils.getLocationLayout(this.game, user);
        this.addPanel(this.layout);

        this.addPanel(this.keysPanel = new KeysPanel(this.game, this));
        this.addPanel(this.gemsPanel = new GemsPanel(this.game, this));
        this.addPanel(this.lifesPanel = new LifesPanel(this.game, this));
        this.addButton(this.settingsButton = SpriteUtils.createButton(this.game, 20, 140, "settingsMain", ()=>{
            this.settingsPanel.show();
        }));
        this.settingsButton.scale.set(1.2)
        this.settingsButtonStartX = this.settingsButton.x;

        this.lifesPanel.update();
        this.game.time.events.repeat(300, 10000000, function () {
            this.lifesPanel.update();
        }, this);

      

        if (AdminService.isEditMode()) {
            let editorButton = SpriteUtils.createButton(this.game, 0, this.game.height / 2, "editBtn", () => {
                EditorService.showLevelEditorDialog(this.game);
            });
            editorButton.anchor.set(0, 0.5)
            editorButton.y -= editorButton.height/2 + 5 + 150;
            this.addButton(editorButton);

            let editReplicaButton = SpriteUtils.createButton(this.game, 0, this.game.height / 2 + editorButton.height/2 + 5 -150, "editReplicaBtn", () => {
                EditorService.showReplicaEditorDialog(this.game);
            });
            editReplicaButton.anchor.set(0, 0.5)
            this.addButton(editReplicaButton);
        }

        this.playButton = SpriteUtils.createButton(this.game, this.game.width - 200.0 + 105, this.game.height - 200 - 75, 'playButton', () => {
            if (this.isLocked()) {
                return;
            }

            let user = UserService.getUser();

            if(user.getCurrentForest() >= ForestDao.getAllForests().length){
                let infoPanel = new AllLevelsCompletePanel(this.game, this)
                this.addPanel(infoPanel);
                infoPanel.show();
            } else{
                this.startLevelPanel.show();
            }

        });
        this.playButton.anchor = new Phaser.Point(0.5, 0.5);
        this.addButton(this.playButton);

        this.level = new Label(this.game, -10, 5, "" + (user.getCurrentForest() + 1), { "font": "bold 60px Arial", "fill": "#ffffff" });
        this.level.anchor = new Phaser.Point(0.5, 0.5)
        this.playButton.addChild(this.level);

        this.notebookButton = SpriteUtils.createButton(this.game, 90, this.game.height - 200 - 75, 'diary', () => {
            if (!this.isLocked()) { this.diaryPanel.show() }


            // let sound = this.game.sound.play("win", 0.03)
            // this.game.add.tween(sound).to({volume:0}, 700, null, true, 300)
            // this.game.time.events.add(100, ()=>{
            //     let sound2 = this.game.sound.play("win3", 0.09)
            //     sound2.volume = 0;
            //     this.game.add.tween(sound2).to({volume:0.09}, 500, null, true, 200)
            //     sound2.volume = 0.09;
            //     this.game.add.tween(sound2).to({volume:0}, 1100, null, true, 800)
            //     sound2.volume = 0;
            // })
        });
        this.notebookButton.anchor.set(0.5)
        this.notebookButton.scale.set(1/1.5)
        this.notebookButton.name = "notebookButton";
        if (user.getCurrentForest() <= LocationUtils.DIARY_AFTER_LEVEL) {
            this.notebookButton.visible = false;
            this.notebookButton.inputEnabled = false;
        }
        this.addButton(this.notebookButton);

        let currentRecipe = DiaryConfiguration.getCurrentRecipe(user.getCurrentForest());
        if (currentRecipe) {
            this.progressAnimation = this.showProgress(currentRecipe);
        } else {
            currentRecipe = DiaryConfiguration.getNextrecipe(user.getCurrentForest());
            this.progressAnimation = this.showProgress(currentRecipe);
        }
        this.notebookButton.bringToTop()
        this.playButton.bringToTop()


        // if(ForestUtils.isEnchantedPlace()){
        //     this.playButton.tint = 0xDDAAAA;
        // }

        AnimationUtils.wiggle(this.game, this.playButton, 0);

        let forestType = ForestDao.getForestType(UserService.getUser().getCurrentForest());
        let level = user.getCurrentForest() + 1;
        this.startLevelPanel = new StartLevelPanel(this.game, this, this.game.width / 2, this.game.height / 2, ForestUtils.getAims(forestType), level);
        this.startLevelPanel.anchor = new Phaser.Point(0.5, 0.5);
        this.addPanel(this.startLevelPanel);
        this.startLevelPanel.visible = false;
        this.startLevelPanel.fixedToCamera = true;

        this.settingsPanel = new SettingsPanel(this.game, this, this.game.width / 2, this.game.height / 2, ForestUtils.getAims(forestType), level);
        this.settingsPanel.anchor = new Phaser.Point(0.5, 0.5);
        this.addPanel(this.settingsPanel);
        this.settingsPanel.visible = false;
        this.settingsPanel.fixedToCamera = true;     
        
        // let everydayRubiesButton = SpriteUtils.createButton(this.game, this.game.width -100, 400, 'circle', ()=>{
        let everydayRubiesButton = SpriteUtils.createButton(this.game, this.game.width -100, 400, 'actionCircle', ()=>{
            let p = new EverydayRubyPanel(this.game)
            this.addPanel(p);
            p.show();
            this.game.tweens.removeFrom(everydayRubiesButton);
            AnimationUtils.fadeOut(this.game, everydayRubiesButton);
            everydayRubiesButton.inputEnabled = false;
            Utils.delete(this.rightButtons, everydayRubiesButton);
        });
        everydayRubiesButton.visible = UserService.getUser().haveEverydayGemsToTake();
        everydayRubiesButton.angle = -90;
        everydayRubiesButton.anchor.set(0.5);
        everydayRubiesButton.scale.set(1);
        AnimationUtils.wiggle4(this.game, everydayRubiesButton);

        this.rightButtons.push(everydayRubiesButton);
            
        let gems = SpriteUtils.createSprite(this.game, -4,0, 'gems');
        gems.angle = 90;
        gems.anchor.set(0.5,0.44)
        gems.scale.set(0.65/ 1.5*2)
        everydayRubiesButton.addChild(gems);
        this.addButton(everydayRubiesButton);


        let events = EventUtils.getActualEvents();
        let eventDeltaY = 0;
        events.forEach(eventInfo => {
            let eventButton = SpriteUtils.createButton(this.game, this.game.width -100, 400 + 190 + eventDeltaY, EventUtils.getIcon(eventInfo.eventType),
                ()=>{
                    let p = new EventPanel(this.game, eventInfo);
                    this.addPanel(p);
                    p.show();
                });

            eventButton.visible = true;
            eventButton.anchor.set(0.5);
            this.rightButtons.push(eventButton);
            
            let flash = SpriteUtils.createSprite(this.game, eventButton.x, eventButton.y,"flash");
            flash.anchor.set(0.5);
            flash.scale.set(1.5);
            this.addSprite(flash);
            this.rightButtons.push(flash);
            
            this.addButton(eventButton);

            let banner = SpriteUtils.createSprite(this.game, eventButton.x, eventButton.y + 70,"ribbon");
            banner.anchor.set(0.5);
            banner.scale.set(0.2, 0.6);
            this.addSprite(banner);
            this.rightButtons.push(banner);

            
            let eventDuration = new Label(this.game, banner.x, banner.y-10, EventUtils.getRemainTimeShort(eventInfo.eventEndAt), { font: "bold 33px Bookman Old Style ", fill: "#ffffff" });
            eventDuration.anchor.set(0.5);
            // eventDuration.scale.set(0.2, 0.6);
            this.addSprite(eventDuration);
            this.rightButtons.push(eventDuration);
            this.game.time.events.loop(1000, ()=>{
                if(eventInfo.eventEndAt <= Date.now()) {
                    eventButton.visible = false;
                    flash.visible = false;
                    eventDuration.visible = false;
                    banner.visible = false;
                }
                eventDuration.text = EventUtils.getRemainTimeShort(eventInfo.eventEndAt);
            })


            this.game.add.tween(flash).to({alpha: 0.8}, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 500);
            this.game.add.tween(flash).to({angle:360}, 60000, Easing.Linear.None, true, 500, -1);

            eventDeltaY += 200;

            if(this.eventsToShow.indexOf(eventInfo.eventType) != -1){
                this.lockScreenFor(2000);
                this.game.time.events.add(2000, ()=>{
                    let p = new EventPanel(this.game, eventInfo);
                    this.addPanel(p);
                    p.show();
                })
            }
        });

        this.diaryPanel = new DiaryPanel(this.game, this, this.game.width / 2 -20, this.game.height / 2);
        this.addPanel(this.diaryPanel);
        this.diaryPanel.visible = false;
        this.diaryPanel.fixedToCamera = true;
        
        if(AdminService.isDiaryMode()) {
            this.diaryPanel.show()
        } 

        this.playStartAnimations();


        if(!this.progressAnimation && !blackFadeOut && this.dialogPanel.getNextReplica()){
            this.lockScreenFor(1450);
            this.game.time.events.add(1500, () => {
                this.dialogPanel.updateReplica();
            });
        }

        let transitionTime = 2000;
        let transitionDelay = 500;

        if (blackFadeOut) {
            if(!LocationUtils.isHouseStoryLocation(user)){
                this.add.existing(new ColorTransitionPanel(this.game, 0x000000, transitionTime, 0, false));
                this.dialogPanel.bringToTop();
                this.hideUI(0, false, true)
            }
        } else if (Game.WHITE_TRANSITION) {
            this.add.existing(new ColorTransitionPanel(this.game, 0x000000, transitionTime, 0, false));
            Game.WHITE_TRANSITION = false;
        } else {
            this.add.existing(new TreesTransitionPanel(this.game, false, transitionTime, transitionDelay));
            // let start = Date.now();
            // while (Date.now() - start < 500) {
            //     // Пустой цикл, ожидаем истечения времени
            // }
        }


        if(this.fakeTrees){
            this.fakeTrees.alpha = 0;
            this.fakeTrees.kill();
        }

        if (UserService.getUser().getCurrentForest() <= RecipeUtils.getRequiredLevel(DiaryConfiguration.allRecipes[0])) {
            this.game.time.events.add(20000, () => {
                if (!this.uiHidden) {
                    if (this.arrow) {
                        this.arrow.kill();
                    }
                    this.arrow = SpriteUtils.createSprite(this.game, this.playButton.x - 70,
                        this.playButton.y - 100, "arrow");
                    this.game.add.existing(this.arrow);
                    this.arrow.anchor.set(0.5, 1);
                    this.arrow.scale.set(2, 2);
                    this.arrow.angle = -20;
                    this.arrow.tint = 0x55ffff;
                    AnimationUtils.jump(this.game, this.arrow, 0)
                    AnimationUtils.fadeIn(this.game, this.arrow, 0)

                    this.game.tweens.removeFrom(this.playButton);
                }
            })
        }

        if(LocationUtils.isHouseStoryLocation(user)){
            this.addPanel(new HouseFrameLayout(this.game, ""));
        }

        // let p = new EventPanel(this.game, new EventInfo(EventType.lukoshko, Date.now(), Date.now() +  1000 * 60*60*24));
        // this.addPanel(p);
        // p.show();


        // console.log(new UserPrincipalDto() instanceof UserPrincipalDto)
        // console.log(new UserPrincipalDto(JSON.parse('{"sdg":"adw", "externalIdentifier":"awd", "internalID":12}')) instanceof UserPrincipalDto)

        // this.game.time.events.add(1000, ()=>{
        //     let p = new CircleProgressPanel(this.game);
        //     this.addPanel(p);
        //     p.show();

        //     this.game.time.events.add(3000, ()=>{
        //         p.hide();
        //     })
        // })

        // this.game.time.events.add(1000, ()=>{
        //     let info = new ConfirmPanel(this.game, "Что-то пошло не так!", "Ok", 
        //     "Пожалуйста, ~ожидайте~ получения \n платежа в течения суток. \n Потом обратитесь в ~техподдержку~.", ()=>{}, true)
        //     this.game.add.existing(info);
        //     info.show();
        // })

        // //skewable usage example
        // let skewable = new Skewable(this.game, this.game.width/2, this.game.height/2, "sveta1");
        // skewable.anchor.set(0.5, 1)
        // this.addSprite(skewable)
        // let skewRatio = 0.05
        // skewable.skewX = skewRatio;
        // this.game.add.tween(skewable).to({skewX: [skewRatio, -skewRatio, skewRatio, -skewRatio, skewRatio, -skewRatio, skewRatio, -skewRatio]}, 7000, Easing.Linear.None, true, 0)

        // this.game.add.sprite(300, 300, 'atlas1', 'content/characters/sveta5.png')
        // this.game.add.sprite(300-10, 300, 'sveta5')
 
       


        // this.doHideUI(false, true)
        // let vid2 =SpriteUtils.createSprite(this.game, this.game.width/2, this.game.height/2, "vid2");
        // this.addSprite(vid2)
        // vid2.anchor.set(0.5)
        // vid2.alpha = 0;
        // let vid1 =SpriteUtils.createSprite(this.game, this.game.width/2, this.game.height/2, "vid1");
        // this.addSprite(vid1)
        // vid1.anchor.set(0.5)
        // vid1.scale.set(0)

        // let d1 = 1200
        // let d2 = 2000
        // AnimationUtils.fadeIn(this.game, vid2, d1);
        // this.game.add.tween(vid1.scale).to({ x:1, y:1 }, 200, Phaser.Easing.Quadratic.Out, true, d1 + 300, 0, false)
        // this.game.time.events.add(d1 + 500, ()=> {AnimationUtils.jelly(this.game, vid1, 0)});
        // this.game.time.events.add(d1 + 500 + d2, ()=> this.startLevel());
    }

    public onDialogEnd(): void {
        console.log("ON DIALOG END!")
        let user = UserService.getUser();
        let currentDiaryContent = DiaryConfiguration.getCurrentRecipe(user.getCurrentForest());
        if (currentDiaryContent && RecipeUtils.getRequiredLevel(currentDiaryContent) == user.getCurrentForest()) {
            this.showProgress(currentDiaryContent, this.uiHidden);
        }
    }

    public showProgress(diaryContent: DiaryContentType, hidden?: boolean) : boolean {
        if(diaryContent && !diaryContent.copyOf && hidden){
            this.game.time.events.add(1000, ()=>{
                AnimationUtils.heartsBurst(this.game, this.notebookButton.x, this.notebookButton.y, 100, "dustYellow")
                AnimationUtils.highlight(this.game, this.notebookButton.x, this.notebookButton.y, "splashY", 100, 2, 800)
            })
        }

        if (diaryContent) {
            this.progressBar = new ProgressBar(this.game, this, this.game.width / 2 + 15, this.game.height - 154, diaryContent, hidden);
            this.addPanel(this.progressBar);
            this.progressBar.visible = this.notebookButton.visible;
            return this.progressBar.getTotal() != 0 && this.progressBar.getTotal() == this.progressBar.getCurrent();
        }
        return false;
    }

    protected playAnimation(animationId: string): void {
        if (animationId == "afterNotebookFoundAnimation") {
            this.layout.playAnimation("boilerAppear");
            AnimationUtils.appear3(this.game, this.notebookButton, 2000);
            AnimationUtils.appear(this.game, this.progressBar, 2500);

            AnimationUtils.heartsBurst(this.game, this.notebookButton.x, this.notebookButton.y, 2500, "dustYellow")
            AnimationUtils.highlight(this.game, this.notebookButton.x, this.notebookButton.y, "splashY", 100, 2, 3200)

        } else if (animationId == "goToForest") {
            if (UserService.getUser().getCurrentForest() == 0) {
                this.startLevel();
            } else {
                this.canNotTouchUI = true;
                this.game.time.events.add(ReplicaPanel.HIDE_DIALOG_DURATION + StripsPanel.SHOW_DURATION + 500, () => {
                    this.canNotTouchUI = false;
                })
                this.dialogPanel.updateReplica();
                this.startLevelPanel.show();
            }
        } else if (animationId == "transition" && UserService.getUser().getCurrentForest() == 2) {
            SoundUtils.openDoor();
            this.game.time.events.add(1800, ()=>{
                SoundUtils.halfTrouble();
            })
            let animationPLayed = this.layout.playAnimation(animationId, this);
            if(animationPLayed){
                this.lockScreenFor(1500);
            }
        } else if (animationId.startsWith("stormTransition") && UserService.getUser().getCurrentForest() == 32) {
            this.game.time.events.add(0, ()=>{
                SoundUtils.trouble();
            })
            let animationPLayed = this.layout.playAnimation(animationId, this);
            if(animationPLayed){
                this.lockScreenFor(1500);
            }
        } else {
            let animationPLayed = this.layout.playAnimation(animationId, this);
            if(animationPLayed){
                this.lockScreenFor(1500);
            }
        }
    }

    public hideUI(delay?: number, forShop?: boolean, instantly?: boolean, fromShop?:boolean) {
        if (delay) {
            this.game.time.events.add(delay || 0, () => {
                this.doHideUI(forShop, instantly, fromShop);
            })
        } else {
            this.doHideUI(forShop, instantly, fromShop);
        }
    }

    private getPlayButtonStartX() {
        return this.game.width - 200.0 + 105;
    }

    private notebookButtonStartX = 90;

    private doHideUI(forShop?: boolean, instantly?:boolean, fromShop?:boolean) {
        if (this.canNotTouchUI || (this.uiHidden && !fromShop)) {
            return;
        }
        if (this.arrow) {
            AnimationUtils.disappear(this.game, this.arrow);
        }

        if(!instantly){
            this.canNotTouchUI = true;
            this.game.time.events.add(300, () => { this.canNotTouchUI = false; })
        }
        else{ console.log("INSTANTLY!!!")}

        this.uiHidden = true;

        let duration = instantly? 1 : 300;


        // this.game.sound.play("whooshIn2", 0.5)
        
        if (!forShop) {
            this.game.add.tween(this.keysPanel).to({ x: this.keysPanel.startX + 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.lifesPanel).to({ x: this.lifesPanel.startX - 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.gemsPanel).to({ x: this.gemsPanel.startX + 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)

            this.game.add.tween(this.keysPanel).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.gemsPanel).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.lifesPanel).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)

            this.game.add.tween(this.settingsButton).to({ x: this.settingsButtonStartX - 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.settingsButton).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
        } else {
            this.game.time.events.add(101, () => {
                this.keysPanel.bringToTop();
                this.lifesPanel.bringToTop();
                this.settingsButton.bringToTop();
                this.gemsPanel.bringToTop();
            });

            this.game.add.tween(this.settingsButton).to({ alpha: 0 }, duration + 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        }

        if(!fromShop){
            this.rightButtons.forEach(b => {
                this.game.add.tween(b).to({ x: this.rightButtonsX + 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
                this.game.add.tween(b).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            })
            this.game.add.tween(this.playButton).to({ x: this.getPlayButtonStartX() + 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.notebookButton).to({ x: this.notebookButtonStartX - 200 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.progressBar).to({ y: this.progressBar.startY + 300 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)

            this.game.add.tween(this.playButton).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.notebookButton).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
            this.game.add.tween(this.progressBar).to({ alpha: 0 }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
        }
    }

    public showUI(forShop?: boolean) {
        if (this.canNotTouchUI || !this.uiHidden) {
            return;
        }
        this.uiHidden = false;
        this.canNotTouchUI = true;
        this.game.time.events.add(300, () => { this.canNotTouchUI = false; })

        // this.game.sound.play("whooshOut2", 0.5)

        if (!forShop) {
            this.game.add.tween(this.keysPanel).to({ x: this.keysPanel.startX /*- 200*/ }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.gemsPanel).to({ x: this.gemsPanel.startX  }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.lifesPanel).to({ x: this.lifesPanel.startX }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)

            this.game.add.tween(this.keysPanel).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.gemsPanel).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.lifesPanel).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)

            this.game.add.tween(this.settingsButton).to({ x: this.settingsButtonStartX }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.settingsButton).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        } else {
            this.game.add.tween(this.settingsButton).to({ x: this.settingsButtonStartX }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(this.settingsButton).to({ alpha: 1 }, 200, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, true, 0, 0, false)
        }

        this.rightButtons.forEach(b => {
            this.game.add.tween(b).to({ x: this.rightButtonsX  }, 300,Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 0, 0, false)
            this.game.add.tween(b).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        });

        this.game.add.tween(this.progressBar).to({ y: this.progressBar.startY  }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        this.game.add.tween(this.playButton).to({ x: this.getPlayButtonStartX()  }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        this.game.add.tween(this.notebookButton).to({ x: this.notebookButtonStartX  }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        
        this.game.add.tween(this.progressBar).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        this.game.add.tween(this.playButton).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)
        this.game.add.tween(this.notebookButton).to({ alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false)

        this.playButton.bringToTop();
        this.notebookButton.bringToTop();
    }

    public startLevel(): void {
        let time = 500;
        let trees = new TreesTransitionPanel(this.game, true, time, 0);
        trees.fixedToCamera = true;
        this.add.existing(trees);
        this.game.time.events.add(time*2, () => {
            this.startScreen(ForestScreen, true, false);
        })
    }

    public playStartAnimations(): void {
        let user = UserService.getUser();
        if (user.getCurrentForest() == 4 && user.isJustCompletedLevel()) {
            this.playAnimation("afterNotebookFoundAnimation");
        }
    }
}
