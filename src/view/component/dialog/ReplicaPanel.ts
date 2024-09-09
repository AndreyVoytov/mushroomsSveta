import Preset from '../../game/Preset';
import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import LocationUtils from './../../../core/utils/LocationUtils';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import BubblePanel from './BubblePanel';
import DialogPanel from './DialogPanel';
import ReplicaDiaryPanel from './ReplicaDiaryPanel';
import ForestScreen from '../../screen/ForestScreen';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BigBubblePanel from './BigBubblePanel';
import { Easing } from 'phaser-ce';
import Settings from '../../../core/service/Settings';
export default class ReplicaPanel extends BasePanel {

    private personImage: Phaser.Sprite;
    private secondPersonImage: Phaser.Sprite;
    private decorImage: Phaser.Sprite;
    private decorImage2: Phaser.Sprite;
    private bublePanel: BubblePanel;
    private bigBublePanel: BigBubblePanel;
    private dialogPnl: Phaser.Sprite;
    private titlePnl: Phaser.Sprite;
    private title: Phaser.Text;
    private text: Phaser.Text;

    private printing: boolean;
    private printingEvents = [];
    private textToPrint: string;

    private glint: Phaser.Sprite;

    private diaryPanel: ReplicaDiaryPanel;
    private actionButton: Phaser.Button;
    private clickToSkipInfo: Phaser.Text;

    private playAnimation : (animation:string)=> void;

    private parentCont: DialogPanel;

    // private activeAnimations: Phaser.Tween[] = [];

    private SYMBOLS_IN_ROW = 40;

    private PERSON_DELTA_X = 750;

    public static FIRST_SHOW_PERSON_DURATION = 400;
    public static CHANGE_PERSON_DURATION = 200;
    public static LAST_HIDE_PERSON_DURATION = 300;

    public static SHOW_DIALOG_DURATION = 300;
    public static HIDE_DIALOG_DURATION = 200;

    // private static MAIN_PERSON_SCALE = 0.8;
    private static MAIN_PERSON_SCALE = 1;
    private static NO_TINT = 0xffffff;
    private static SECOND_PERSON_SCALE = 0.85;
    private static SECOND_PERSON_TINT = 0xcccccc;

    private static PERSONS_X_OFFSET:{image:string, offsetX:number, offsetY?:number}[] = [
        {image:"sveta1", offsetX:20},
        {image:"sveta2", offsetX:20},
        {image:"sveta3", offsetX:20},
        {image:"sveta4", offsetX:0},
        {image:"sveta5", offsetX:50, offsetY: -15},
    ];

    public r: ReplicaType;

    constructor(game: Phaser.Game, parentCont: DialogPanel, x: number, y: number, r: ReplicaType, 
        playAnimationCallback: (animation:string)=> void, diaryPrest?: Preset) {

        super(game, x, y);
        this.r = r;
        this.playAnimation = playAnimationCallback;
        this.parentCont = parentCont;

        this.fixedToCamera = true;

        //TODO переделать панель, чтобы (0,0) совпадало с глобальными (0,0)
        let gameBottomY = 280 + DialogPanel.BOTTOM_PADDING;

        if (r.showDiary) {
            this.diaryPanel = new ReplicaDiaryPanel(this.game, 0, 0, r, diaryPrest);
            // this.addSprite(this.diaryPanel);
            parentCont.addChild(this.diaryPanel); this.diaryPanel.x += this.x; this.diaryPanel.y += this.y;
        }

        if (r.personalAnimation && r.personalAnimation.endsWith("Bubble")) { 
            let image = r.personalAnimation.substring(0, r.personalAnimation.length - 6);
            this.bublePanel = new BubblePanel(this.game, this.game.width / 2, this.game.height / 2, image);
            if (r.rightSide) {
                this.bublePanel.scale.set(-1, 1)
            }
            parentCont.addChild(this.bublePanel);
            // this.game.add.existing(this.bublePanel);
        }

        let offsetX = ReplicaPanel.PERSONS_X_OFFSET.filter(o => o.image == r.personImage).map(o => o.offsetX).shift() || 0;
        let offsetY = ReplicaPanel.PERSONS_X_OFFSET.filter(o => o.image == r.personImage).map(o => o.offsetY).shift() || 0;
        if (r.rightSide) {
            this.personImage = SpriteUtils.createSprite(this.game, this.game.width - 5 - offsetX, 65 - offsetY, r.personImage);
            this.personImage.anchor = new Phaser.Point(0, 1);
            this.personImage.scale.set(-ReplicaPanel.MAIN_PERSON_SCALE, ReplicaPanel.MAIN_PERSON_SCALE);
            // this.addChild(this.personImage);
            parentCont.addChild(this.personImage); this.personImage.x += this.x; this.personImage.y += this.y;
        } else {
            this.personImage = SpriteUtils.createSprite(this.game, 0 + offsetX, 65 - offsetY, r.personImage);
            this.personImage.anchor = new Phaser.Point(0, 1);
            this.personImage.scale.set(ReplicaPanel.MAIN_PERSON_SCALE);
            // this.addChild(this.personImage);

            parentCont.addChild(this.personImage); this.personImage.x += this.x; this.personImage.y += this.y;
        }

        //TODO use images from previous replicas?
        if(r.secondPersonImage){
            if (r.rightSide) {
                this.secondPersonImage = SpriteUtils.createSprite(this.game, 0, 65, r.secondPersonImage);
                this.secondPersonImage.anchor = new Phaser.Point(0, 1);
                this.secondPersonImage.scale.set(ReplicaPanel.SECOND_PERSON_SCALE);
                this.secondPersonImage.tint = ReplicaPanel.SECOND_PERSON_TINT;
                parentCont.addChild(this.secondPersonImage); this.secondPersonImage.x += this.x; this.secondPersonImage.y += this.y;
            } else {
                this.secondPersonImage = SpriteUtils.createSprite(this.game, this.game.width - 5, 65, r.secondPersonImage);
                this.secondPersonImage.anchor = new Phaser.Point(0, 1);
                this.secondPersonImage.scale.set(-ReplicaPanel.SECOND_PERSON_SCALE, ReplicaPanel.SECOND_PERSON_SCALE);
                this.secondPersonImage.tint = ReplicaPanel.SECOND_PERSON_TINT;
                parentCont.addChild(this.secondPersonImage); this.secondPersonImage.x += this.x; this.secondPersonImage.y += this.y;
            }
        }

        if (r.decor) {
            if (r.decor.rightSide) {
                this.decorImage = SpriteUtils.createSprite(this.game, this.game.width - 5 - r.decor.x, 65 - r.decor.y, r.decor.image.split("_")[0]);
                this.decorImage.anchor = new Phaser.Point(1, 1);
                this.decorImage.inputEnabled = false;
                // this.addChild(this.decorImage);
                parentCont.addChild(this.decorImage); this.decorImage.x += this.x; this.decorImage.y += this.y;
            } else {
                this.decorImage = SpriteUtils.createSprite(this.game, 185 + r.decor.x, 65 - r.decor.y, r.decor.image.split("_")[0]);
                this.decorImage.anchor = new Phaser.Point(0.5, 1);
                this.decorImage.scale = new Phaser.Point(-1, 1);

                this.decorImage.inputEnabled = false;
                // this.addChild(this.decorImage);
                parentCont.addChild(this.decorImage); this.decorImage.x += this.x; this.decorImage.y += this.y;
            }
            if(r.decor.image == "owl"){
                this.decorImage.scale.set(this.decorImage.scale.x * 2, this.decorImage.scale.y * 2)
            }
        }

        if (r.decor2) {
            if (r.decor2.rightSide) {
                this.decorImage2 = SpriteUtils.createSprite(this.game, this.game.width - 5 - r.decor2.x, 65 - r.decor2.y, r.decor2.image.split("_")[0]);
                this.decorImage2.anchor = new Phaser.Point(1, 1);
                this.decorImage2.inputEnabled = false;
                // this.addChild(this.decorImage);
                parentCont.addChild(this.decorImage2); this.decorImage2.x += this.x; this.decorImage2.y += this.y;
            } else {
                this.decorImage2 = SpriteUtils.createSprite(this.game, 185 + r.decor2.x, 65 - r.decor2.y, r.decor2.image.split("_")[0]);
                this.decorImage2.anchor = new Phaser.Point(0.5, 1);
                this.decorImage2.scale = new Phaser.Point(-1, 1);

                this.decorImage2.inputEnabled = false;
                // this.addChild(this.decorImage);
                parentCont.addChild(this.decorImage2); this.decorImage2.x += this.x; this.decorImage2.y += this.y;
            }
        }

        this.dialogPnl = SpriteUtils.createSprite(this.game, 0, 0, 'dialogPnl');
        this.dialogPnl.anchor = new Phaser.Point(0, 0);
        // this.addChild(this.dialogPnl);
        parentCont.addChild(this.dialogPnl); this.dialogPnl.x += this.x; this.dialogPnl.y += this.y;
        this.dialogPnl.inputEnabled = false;

        if (UserService.getUser().getCurrentForest() >= LocationUtils.SKIP_DIALOG_BUTTON_FROM_LEVEL) {
            let skipButton = SpriteUtils.createButton(this.game, this.dialogPnl.width - 40, this.dialogPnl.height - 10, 'skipButton', () => {
            // let skipButton = SpriteUtils.createButton(this.game, 270, this.dialogPnl.height - 20, 'skipButton', () => {
                parentCont.skip();
            })
            skipButton.anchor.set(1)
            this.dialogPnl.addChild(skipButton);
        }

        this.text = new Label(this.game, 67, 45, r.text, Label.DIALOG_STYLE, false, this.SYMBOLS_IN_ROW);
        this.text.anchor = new Phaser.Point(0, 0);
        this.text.inputEnabled = false;
        // this.dialogPnl.addChild(this.text);
        parentCont.addChild(this.text); this.text.x += this.x; this.text.y += this.y;

        if (r.rightSide) {
            this.titlePnl = SpriteUtils.createSprite(this.game, this.game.width - 50, 0, 'titlePnl');
            this.titlePnl.anchor = new Phaser.Point(1, 0.5);
            this.titlePnl.scale = new Phaser.Point(1, 1.1)
            this.titlePnl.inputEnabled = false;
            // this.addChild(this.titlePnl);
            parentCont.addChild(this.titlePnl); this.titlePnl.x += this.x; this.titlePnl.y += this.y;

            this.title = new Label(this.game, /*this.titlePnl.x*/ - this.titlePnl.width / 2, /*this.titlePnl.y*/0, r.personName, Label.DIALOG_TITLE_STYLE);
            this.title.anchor = new Phaser.Point(0.5, 0.5);
            this.title.inputEnabled = false;
            this.titlePnl.addChild(this.title);
            // this.addChild(this.title);
            // parentCont.addChild(this.title); this.title.x += this.x; this.title.y += this.y;
        } else {
            this.titlePnl = SpriteUtils.createSprite(this.game, 50, 0, 'titlePnl');
            this.titlePnl.anchor = new Phaser.Point(0, 0.5);
            this.titlePnl.scale = new Phaser.Point(1, 1.1)
            this.titlePnl.inputEnabled = false;
            // this.addChild(this.titlePnl);
            parentCont.addChild(this.titlePnl); this.titlePnl.x += this.x; this.titlePnl.y += this.y;

            this.title = new Label(this.game, /*this.titlePnl.x*/ + this.titlePnl.width / 2, /*this.titlePnl.y*/0, r.personName, Label.DIALOG_TITLE_STYLE);
            this.title.anchor = new Phaser.Point(0.5, 0.5);
            this.title.inputEnabled = false;
            this.titlePnl.addChild(this.title);
            // this.addChild(this.title);
            // parentCont.addChild(this.title); this.title.x += this.x; this.title.y += this.y;
        }

        if (r.decor && r.decor.overDialog) {
            parentCont.setChildIndex(this.decorImage, parentCont.children.length - 1);
        }
        if (r.decor2 && r.decor2.overDialog) {
            parentCont.setChildIndex(this.decorImage2, parentCont.children.length - 1);
        }

        if (r.buttonName) {
            let callback;
            // if (r.buttonAnimation) {
            //     callback = () => { this.actionButton.inputEnabled = false; this.playAnimation(r.buttonAnimation); }
            // } else
             if (r.afterAnimation) {
                callback = () => { this.actionButton.inputEnabled = false; }; //do nothing
            } else {
                callback = () => { this.actionButton.inputEnabled = false; this.playAnimation("goToForest"); }
            }

            // console.log("Y:" + (this.y + gameBottomY - DialogPanel.BOTTOM_PADDING / 2 - 25))

            this.actionButton = SpriteUtils.createButton(this.game, this.game.width / 2 - 25, gameBottomY - DialogPanel.BOTTOM_PADDING / 2 - 20, "pnlButton", callback);
            this.actionButton.anchor.set(0.5);
            // this.addButton(this.actionButton);
            parentCont.addChild(this.actionButton); this.actionButton.x += this.x; this.actionButton.y += this.y;

            let actionCircle = SpriteUtils.createSprite(this.game, this.actionButton.width / 2 + 10, 0, 'actionCircle');
            actionCircle.anchor.set(0.5);
            this.actionButton.addChild(actionCircle);

            let label = new Label(this.game, -13, 0, r.buttonName, { font: "bold 40px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 });
            label.anchor.set(0.5)
            this.actionButton.addChild(label)

            let image = SpriteUtils.createSprite(this.game, 0, 0, r.buttonImage ? r.buttonImage : "actionMushroom");
            image.anchor.set(0.5);
            let toScaleDown = ["tree"];
            if(toScaleDown.indexOf(r.buttonImage) != -1){
                image.scale.set(1/1.5)
            }
            actionCircle.addChild(image);

            AnimationUtils.appear(this.game, this.actionButton, 1000)

            this.game.time.events.add(5000, function () {
                AnimationUtils.wiggle(this.game, this.actionButton, 0)
            }, this)
        } else {
            console.log("CLICK TO SKIP INFO")
            this.clickToSkipInfo = new Label(this.game, this.game.width / 2, gameBottomY - DialogPanel.BOTTOM_PADDING / 2 - 20, "нажмите для продолжения", Label.CLICK_TO_SKIP_YELLOW_STYLE)
            this.clickToSkipInfo.anchor.set(0.5)
            AnimationUtils.blinking(this.game, this.clickToSkipInfo, 2000);
            // this.addChild(this.clickToSkipInfo);
            parentCont.addChild(this.clickToSkipInfo); this.clickToSkipInfo.x += this.x; this.clickToSkipInfo.y += this.y;
        }

        this.personImage.alpha = 0
        if (this.decorImage) {
            this.decorImage.alpha = 0
        }
        if (this.decorImage2) {
            this.decorImage2.alpha = 0
        }
        if (this.secondPersonImage) {
            this.secondPersonImage.alpha = 0
        }
        this.text.alpha = 0
        this.title.alpha = 0;
        this.titlePnl.alpha = 0;
        this.dialogPnl.alpha = 0;
    }

    public firstShow() {

        this.bringToTop();
        console.log("FIRST REPLICA SHOW: " + this.r.text)
        let timePerson = ReplicaPanel.FIRST_SHOW_PERSON_DURATION;
        let timeText = ReplicaPanel.SHOW_DIALOG_DURATION;
        this.alpha = 1;

        
        let startX = this.personImage.x;
        this.personImage.alpha = 1;
        if (this.r.rightSide) {
            this.personImage.x = startX + this.PERSON_DELTA_X;
        } else {
            this.personImage.x = startX - this.PERSON_DELTA_X;
        }

        let decorStartX = this.decorImage ? this.decorImage.x : 0;
        if (this.decorImage) {
            this.decorImage.alpha = 1;
            if (this.r.decor.rightSide) {
                this.decorImage.x = decorStartX + this.PERSON_DELTA_X;
            } else {
                this.decorImage.x = decorStartX - this.PERSON_DELTA_X;
            }
        }
        let decor2StartX = this.decorImage2 ? this.decorImage2.x : 0;
        if (this.decorImage2) {
            this.decorImage2.alpha = 1;
            if (this.r.decor2.rightSide) {
                this.decorImage2.x = decor2StartX + this.PERSON_DELTA_X;
            } else {
                this.decorImage2.x = decor2StartX - this.PERSON_DELTA_X;
            }
        }

        let secondPersonStartX = this.secondPersonImage? this.secondPersonImage.x : 0;
        if(this.secondPersonImage){
            this.secondPersonImage.alpha = 1;
            if (this.r.rightSide) {
                this.secondPersonImage.x = secondPersonStartX - this.PERSON_DELTA_X;
            } else {
                this.secondPersonImage.x = secondPersonStartX + this.PERSON_DELTA_X;
            }
        }

        this.title.alpha = 0;
        this.titlePnl.alpha = 0;
        this.dialogPnl.height = this.dialogPnl.height * 0.3;
        this.dialogPnl.alpha = 0;
        this.text.alpha = 0;

        if (this.diaryPanel) {
            this.diaryPanel.show();
        }

        this.game.time.events.add(this.r.showDiary && screen instanceof ForestScreen? 1500 : 1, () => {
            this.game.add.tween(this.personImage).to({ x: startX }, timePerson, Phaser.Easing.Linear.None, true, 0, 0, false)

            if(this.secondPersonImage){
                this.game.add.tween(this.secondPersonImage).to({ x: secondPersonStartX }, timePerson, Phaser.Easing.Linear.None, true, 0, 0, false)
            }

            if (this.decorImage) {
                this.game.add.tween(this.decorImage).to({ x: decorStartX }, timePerson, Phaser.Easing.Linear.None, true, 0, 0, false)
                if (this.r.decor.animation) {
                    this.applyAnimationToDecor(this.game, this.decorImage, this.r.decor.animation);
                }
            }
            if (this.decorImage2) {
                this.game.add.tween(this.decorImage2).to({ x: decor2StartX }, timePerson, Phaser.Easing.Linear.None, true, 0, 0, false)
                if (this.r.decor2.animation) {
                    this.applyAnimationToDecor(this.game, this.decorImage2, this.r.decor2.animation);
                }
            }

            this.game.add.tween(this.title).to({ alpha: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)
            this.game.add.tween(this.titlePnl).to({ alpha: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)
            this.game.add.tween(this.dialogPnl).to({ height: this.dialogPnl.height / 0.3, alpha: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)

            this.title.scale.set(0);
            this.titlePnl.scale.set(0);
            this.dialogPnl.scale.set(0);
            this.game.add.tween(this.title.scale).to({ x: 1, y: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)
            this.game.add.tween(this.titlePnl.scale).to({ x: 1, y: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)
            this.game.add.tween(this.dialogPnl.scale).to({ x: 1, y: 1 }, timeText, Phaser.Easing.Linear.None, true, timePerson, 0, false)

            this.printText(timeText + timePerson);

            if (this.bublePanel) {
                this.bublePanel.show(timeText + timePerson)
            }
            if (this.bigBublePanel) {
                this.bigBublePanel.show(1000+timeText + timePerson)
            }

            if(this.r.personalAnimation){
                this.playPersonalAnimation(this.r.personalAnimation, 500);
            }

            if (this.r.glint) {
                this.glint = AnimationUtils.glint(this.game, this.parentCont, this.r.glint.x, this.r.glint.y + this.y, 900);
            }
        })
    }

    public replaceWith(nextReplica: ReplicaPanel): void {
        this.hide();
        nextReplica.show(this.r.rightSide != nextReplica.r.rightSide);

        // this.dialogPnl.bringToTop();
        // nextReplica.dialogPnl.bringToTop();
        // this.text.bringToTop();
        // nextReplica.text.bringToTop();
        // this.titlePnl.bringToTop();
        // nextReplica.titlePnl.bringToTop();
        // this.title.bringToTop();
        // nextReplica.title.bringToTop();
        // this.decorImage.bringToTop();
        // nextReplica.decorImage.bringToTop();
        // this.dialogPnl.bringToTop();
        if(this.r.decor && !this.r.decor.overDialog){
            this.parentCont.bringChildToTop(this.decorImage);
        }
        if(nextReplica.r.decor && !nextReplica.r.decor.overDialog){
            this.parentCont.bringChildToTop(nextReplica.decorImage);
        }
        if(this.r.decor2 && !this.r.decor2.overDialog){
            this.parentCont.bringChildToTop(this.decorImage2);
        }
        if(nextReplica.r.decor2 && !nextReplica.r.decor2.overDialog){
            this.parentCont.bringChildToTop(nextReplica.decorImage2);
        }

        this.parentCont.bringChildToTop(this.dialogPnl);
        this.parentCont.bringChildToTop(nextReplica.dialogPnl);
        this.parentCont.bringChildToTop(this.text);
        this.parentCont.bringChildToTop(nextReplica.text);
        this.parentCont.bringChildToTop(this.titlePnl);
        this.parentCont.bringChildToTop(nextReplica.titlePnl);

        if(this.r.decor && this.r.decor.overDialog){
            this.parentCont.bringChildToTop(this.decorImage);
        }
        if(nextReplica.r.decor && nextReplica.r.decor.overDialog){
            this.parentCont.bringChildToTop(nextReplica.decorImage);
        }
        if(this.r.decor2 && this.r.decor2.overDialog){
            this.parentCont.bringChildToTop(this.decorImage2);
        }
        if(nextReplica.r.decor2 && nextReplica.r.decor2.overDialog){
            this.parentCont.bringChildToTop(nextReplica.decorImage2);
        }

        if(nextReplica.r.glint){
            this.parentCont.bringChildToTop(nextReplica.glint);
        }

        this.parentCont.bringChildToTop(nextReplica.actionButton);
    }

    private show(sideSwitched: boolean): void {
        // this.personImage.alpha = 1
        // if (this.decorImage) {
        //     this.decorImage.alpha = 1
        // }
        // this.text.alpha = 0
        this.title.alpha = 1;
        this.titlePnl.alpha = 1;
        this.dialogPnl.alpha = 1;
        // this.bringToTop();
        console.log("REPLICA SHOW: " + this.r.text)

        this.personImage.alpha = 0
        if (this.decorImage) {
            this.decorImage.alpha = 0
        }
        if (this.decorImage2) {
            this.decorImage2.alpha = 0
        }
        if(this.secondPersonImage){
            this.secondPersonImage.alpha = 0;
        }
        this.text.alpha = 0

        if (this.diaryPanel) {
            this.diaryPanel.show();
        }

        this.game.time.events.add(this.r.showDiary && screen instanceof ForestScreen? 1500 : 1, () => {

            let scaleRatio = this.r.rightSide? -1 : 1;
            if(sideSwitched && this.secondPersonImage){
                this.game.add.tween(this.personImage.scale).from({ x: ReplicaPanel.SECOND_PERSON_SCALE * scaleRatio, y: ReplicaPanel.SECOND_PERSON_SCALE}, ReplicaPanel.CHANGE_PERSON_DURATION, Phaser.Easing.Quadratic.Out, true, 200, 0, false)
                AnimationUtils.tint(this.game, this.personImage, ReplicaPanel.SECOND_PERSON_TINT, ReplicaPanel.NO_TINT, 500, 0);
            }
            this.game.add.tween(this.personImage).to({ alpha: 1 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false)

            if(this.secondPersonImage){
                if(sideSwitched){
                    this.game.add.tween(this.secondPersonImage.scale).from({ x: ReplicaPanel.MAIN_PERSON_SCALE * scaleRatio * (-1), y: ReplicaPanel.MAIN_PERSON_SCALE}, ReplicaPanel.CHANGE_PERSON_DURATION, Phaser.Easing.Quadratic.Out, true, 200, 0, false)
                    AnimationUtils.tint(this.game, this.secondPersonImage, ReplicaPanel.NO_TINT, ReplicaPanel.SECOND_PERSON_TINT, 500, 0);
                }
                this.game.add.tween(this.secondPersonImage).to({ alpha: 1 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false)
            }

            if (this.decorImage) {
                this.game.add.tween(this.decorImage).to({ alpha: 1 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false)
                if (this.r.decor.animation) {
                    this.applyAnimationToDecor(this.game, this.decorImage, this.r.decor.animation);
                }
            }
            if (this.decorImage2) {
                this.game.add.tween(this.decorImage2).to({ alpha: 1 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false)
                if (this.r.decor2.animation) {
                    this.applyAnimationToDecor(this.game, this.decorImage2, this.r.decor2.animation);
                }
            }

            this.printText(0);
            if (this.bublePanel) {
                this.bublePanel.show()
            }
            if (this.bigBublePanel) {
                this.bigBublePanel.show(1000)
            }

            if(this.r.personalAnimation){
                this.playPersonalAnimation(this.r.personalAnimation);
            }

            if (this.r.glint) {
                this.glint = AnimationUtils.glint(this.game, this.parentCont, this.r.glint.x, this.r.glint.y + this.y, 400);
            }
        })
    }

    private hide(): void {
        this.cleanAnimations();

        this.hideActionButton()
        this.hideSckipToClickInfo();

        if (this.diaryPanel) {
            this.diaryPanel.hide();
        }

        console.log("REPLICA HIDE: " + this.r.text)
        this.game.add.tween(this.personImage).to({ alpha: 0 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 0, 0, false)
        this.game.time.events.add(ReplicaPanel.CHANGE_PERSON_DURATION + 1, () => this.personImage.kill())

        if(this.secondPersonImage){
            this.game.add.tween(this.secondPersonImage).to({ alpha: 0 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 0, 0, false)
        }
        this.title.visible = false;
        this.titlePnl.visible = false;
        this.dialogPnl.visible = false;
        this.text.visible = false;
        if (this.decorImage) {
            this.game.add.tween(this.decorImage).to({ alpha: 0 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 0, 0, false)
            this.game.time.events.add(ReplicaPanel.CHANGE_PERSON_DURATION + 1, () => this.decorImage.kill())
        }
        if (this.decorImage2) {
            this.game.add.tween(this.decorImage2).to({ alpha: 0 }, ReplicaPanel.CHANGE_PERSON_DURATION, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 0, 0, false)
            this.game.time.events.add(ReplicaPanel.CHANGE_PERSON_DURATION + 1, () => this.decorImage2.kill())
        }

        if (this.bublePanel) {
            this.bublePanel.hide()
        }
        if (this.bigBublePanel) {
            this.bigBublePanel.hide()
        }
    }
    public lastHide(): void {
        // this.dialogPnl.bringToTop();
        // this.text.bringToTop();
        // this.titlePnl.bringToTop();
        // this.title.bringToTop();
        // this.decorImage.bringToTop();

        this.cleanAnimations();

        this.hideActionButton()
        this.hideSckipToClickInfo();

        if (this.diaryPanel) {
            this.diaryPanel.hide();
        }

        console.log("LAST REPLICA HIDE: " + this.r.text)
        let timePerson = ReplicaPanel.LAST_HIDE_PERSON_DURATION;
        let timeText = ReplicaPanel.HIDE_DIALOG_DURATION;

        let deltaX = this.r.rightSide ? this.PERSON_DELTA_X : -this.PERSON_DELTA_X;

        this.game.add.tween(this.personImage).to({ x: this.personImage.x + deltaX }, timePerson, Phaser.Easing.Linear.None, true, timeText, 0, false)
        if(this.secondPersonImage){
            this.game.add.tween(this.secondPersonImage).to({ x: this.secondPersonImage.x - deltaX }, timePerson, Phaser.Easing.Linear.None, true, timeText, 0, false)
        }
        if (this.decorImage) {
            let decorDeltaX = this.r.decor.rightSide ? this.PERSON_DELTA_X : -this.PERSON_DELTA_X;
            this.game.add.tween(this.decorImage).to({ x: this.decorImage.x + decorDeltaX }, timePerson, Phaser.Easing.Linear.None, true, timeText, 0, false)
        }
        if (this.decorImage2) {
            let decorDeltaX = this.r.decor2.rightSide ? this.PERSON_DELTA_X : -this.PERSON_DELTA_X;
            this.game.add.tween(this.decorImage2).to({ x: this.decorImage2.x + decorDeltaX }, timePerson, Phaser.Easing.Linear.None, true, timeText, 0, false)
        }

        this.game.add.tween(this.title).to({ alpha: 0 }, timeText, Phaser.Easing.Linear.None, true, 0, 0, false)
        this.game.add.tween(this.titlePnl).to({ alpha: 0 }, timeText, Phaser.Easing.Linear.None, true, 0, 0, false)
        this.game.add.tween(this.dialogPnl).to({ height: this.dialogPnl.height * 0.3, alpha: 0 }, timeText, Phaser.Easing.Linear.None, true, 0, 0, false)
        this.game.add.tween(this.text).to({ height: this.text.height * 0.3, alpha: 0 }, timeText, Phaser.Easing.Linear.None, true, 0, 0, false)

        if (this.bublePanel) {
            this.bublePanel.hide()
        }
    }

    private printText(delay: number): void {
        this.text.alpha = 1;

        this.textToPrint = this.text.text;
        this.text.text = "";

        let portion = 3;

        this.game.time.events.add(delay, ()=>{
            this.printing = true;
        })

        for (let i = 0; i < this.textToPrint.length; i += portion) {
            this.printingEvents.push(this.game.time.events.add(delay + 10 * i, function () {
                for (let j = 0; j < portion; j++) {
                    if (i + j < this.textToPrint.length) this.text.text += this.textToPrint[i + j];
                }
                if (this.text.text.length == this.textToPrint.length){
                    console.log("FINISH PRINTING")
                    this.printing = false;
                }
            }, this));
        }
    }

    private cleanAnimations(): void {
        this.game.tweens.removeFrom(this.personImage)
        if (this.decorImage) {
            this.game.tweens.removeFrom(this.decorImage)
        }
        if (this.decorImage2) {
            this.game.tweens.removeFrom(this.decorImage2)
        }
        if (this.diaryPanel) {
            this.game.tweens.removeFrom(this.diaryPanel)
        }
        if (this.actionButton) {
            this.game.tweens.removeFrom(this.actionButton)
        }
        if (this.clickToSkipInfo) {
            this.game.tweens.removeFrom(this.clickToSkipInfo)
        }
        this.game.tweens.removeFrom(this.dialogPnl)
        this.game.tweens.removeFrom(this.titlePnl)
        this.game.tweens.removeFrom(this.title)
        this.game.tweens.removeFrom(this.text)

        if(this.glint) this.glint.kill();
    }

    private playPersonalAnimation(animation:string, delay?:number):void{
        if(animation == "love"){
            let x = this.r.rightSide? this.game.width * 4/6 : this.game.width * 2/6;

            this.game.time.events.add(0 + (delay || 0), () => {
                AnimationUtils.heartsBurst(this.game, x, this.game.height - 1800 / 2);
            })
            this.game.time.events.add(800 + (delay || 0), () => {
                AnimationUtils.heartsBurst(this.game, x - 30, this.game.height - 1800 / 2);
            })
        } 
    }

    private applyAnimationToDecor(game: Phaser.Game, decor: Phaser.Sprite, animationId: string) {
        if (animationId == "makeBookGreen") {
            AnimationUtils.tint(game, decor, 0xFFFFFF, 0x00FF00, 2000, 800);
            AnimationUtils.tint(game, decor, 0x00FF00, 0xFFFFFF, 500, 3500)
        } else if (animationId == "flicker"){
            AnimationUtils.fadeIn(game, decor, 300);
            decor.alpha = 1;

            let alphas = [0.7, 0.8, 0.75, 0.6, 0.76, 0.6,0.75, 0.8, 0.75, 0.7, 0.6, 0.7, 0.75];
            for(let i=0; i< alphas.length; i++){
                alphas[i] += 0.2;
            }
            game.add.tween(decor).to({ alpha:  alphas }, 2000, Phaser.Easing.Linear.None, true, 300 +  300, 100000, false)
            decor.alpha = 0;
        } else if (animationId == "blinking"){
            this.game.time.events.add(1000, ()=>{
                this.game.add.tween(decor).to({alpha: [0.1, 1]}, 1500, Easing.Linear.None, true, 0, 12321);
            })
        } else if (animationId == "fillBattery"){
            this.game.time.events.add(700, ()=>{
                SpriteUtils.loadTexture(decor, "battery2")
            })
            this.game.time.events.add(700+500, ()=>{
                SpriteUtils.loadTexture(decor, "battery3")
            })
            this.game.time.events.add(700+1000, ()=>{
                SpriteUtils.loadTexture(decor, "batteryFull")
            })
        } else if (animationId == "fadeOutBoots"){
            let alpha = decor.alpha;
            decor.alpha = 1;
            this.game.add.tween(decor).to({alpha: 0}, 200, Easing.Linear.None, true, 500);
            decor.alpha = alpha;
        } else if (animationId == "big"){
            decor.scale.set(3)
        }

    }

    private hideActionButton(delay?: number): void {
        if (this.actionButton) {
            AnimationUtils.disappear(this.game, this.actionButton, delay || 0)
        }
    }
    private hideSckipToClickInfo(): void {
        if (this.clickToSkipInfo) {
            this.game.tweens.removeFrom(this.clickToSkipInfo);
            AnimationUtils.fadeOut(this.game, this.clickToSkipInfo, 0)
        }
    }
   
    public isShown():boolean{
        return this.printing != undefined ;
    }
    public isPrinting():boolean{
        return this.printing;
    }
    public stopPrinting():void{
        if(this.isPrinting && this.textToPrint){
            this.printingEvents.forEach(e => {
                this.game.time.events.remove(e);
            })
            this.text.text = this.textToPrint;
            this.printing = false;
        }
    }

};