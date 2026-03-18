import UserService from '../../../core/service/UserService';
import Utils from '../../../core/utils/Utils';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import HouseScreen from '../../screen/HouseScreen';
import BasePanel from '../../component/panel/BasePanel';
import ClosablePanel from '../../component/panel/ClosablePanel';
import DiaryMapLayout from './DiaryMapLayout';
import DiaryRecipeLayout from './DiaryRecipeLayout';
import DiaryPictureLayout from './DiaryPictureLayout';
import Label from '../../component/panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Skewable from '../panel/Skewable';
import { Easing } from 'phaser-ce';
import SoundUtils from '../../../core/utils/SoundUtils';
export default class DiaryPanel extends ClosablePanel {
    private static REVEAL_DELAY_MS = 40;
    private static PAGE_TURN_X = 49;
    private static PAGE_TURN_Y = 27;
    private static PAGE_TURN_SCALE_X = 1.08 * 4 / 1.5;
    private static PAGE_TURN_SCALE_Y = 1.04 * 4 / 1.5;
    private static PAGE_TURN_DURATION_MS = 500;
    private screen: HouseScreen;
    private layout: BasePanel;
    private layoutRevealEvent: Phaser.TimerEvent;
    private navRevealEvent: Phaser.TimerEvent;
    private stagedPageBgRevealEvent: Phaser.TimerEvent;
    private pageTurnEvent: Phaser.TimerEvent;
    private pageTurnInProgress: boolean;
    private pagesCount:number;    
    private arrowRight: Phaser.Button;
    private arrowLeft: Phaser.Button;
    private pageBgStagingLayer: Phaser.Group;
    private pageTurnLayer: Phaser.Group;
    private stagedLayoutPageBg: Phaser.Sprite;
    private stagedLayoutOwner: BasePanel;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number) {
        super(game, x, y, true, "diaryPanel", 1.18);
        this.screen = screen;
    }

    private initialize(currentPage?:number, animateReveal:boolean = true) {

        let user = UserService.getUser();
        let currentRecipeIndex = DiaryConfiguration.getCurrentRecipeIndex(user.getCurrentForest());
        this.pagesCount = DiaryConfiguration.getPagesCountByIndex(currentRecipeIndex);
        let recipeToDraw:DiaryContentType;

        if(currentPage){
            recipeToDraw = DiaryConfiguration.getRecipeByIndex(DiaryConfiguration.getRecipeIndexByPage(currentPage));
        } else {
            recipeToDraw = DiaryConfiguration.allRecipes[currentRecipeIndex]
            currentPage = DiaryConfiguration.getPageByIndex(currentRecipeIndex);
        }

        if(recipeToDraw.copyOf){
            recipeToDraw = DiaryConfiguration.getRecipeById(recipeToDraw.copyOf);
            currentPage = DiaryConfiguration.getPageByIndex(DiaryConfiguration.allRecipes.indexOf(recipeToDraw)); 
        }

        // let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        // Utils.applyPreset(bg, { "spriteId": "bookBg", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        // this.addSprite(bg);

        if (recipeToDraw && recipeToDraw.mapPreset) {
            this.layout = new DiaryMapLayout(this.game, recipeToDraw, 0, 0);
        } else if (recipeToDraw && recipeToDraw.picture) {
            this.layout = new DiaryPictureLayout(this.game, recipeToDraw, 0, 0);
        } else {
            this.layout = new DiaryRecipeLayout(this.game, recipeToDraw, 0, 0);
        }
        this.stageLayoutPageBackground(this.layout);
        this.addSprite(this.layout)
        if ((<any>this).updateTransform) {
            (<any>this).updateTransform();
        }
        if ((<any>this.layout).updateTransform) {
            (<any>this.layout).updateTransform();
        }
        if (animateReveal) {
            this.scheduleLayoutReveal();
        }

       

        // let closeBtn = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'closeBook', () => this.close());
        let closeBtn = SpriteUtils.createSprite(this.game, this.game.width / 2 - 91, -512, 'closeBook');
        closeBtn.anchor = new Phaser.Point(1, 0);
        closeBtn.scale = new Phaser.Point(2, 2);
        Utils.applyPreset(closeBtn, { "spriteId": "", "x": 488 - 209/1.2 -27/1.18 , "y": -475+1118/1.2 + 22/1.18, "scaleX": 0.9599999999999991, "scaleY": 1.0799999999999992, "anchorX": 1, "anchorY": 0, "rotation": 0 })
        // this.addButton(closeBtn);
        this.addSprite(closeBtn);

        let closeBtn2 = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'closeButton', () => this.close());
        closeBtn2.name = "closeBtn2";
        Utils.applyPreset(closeBtn2, {"spriteId":"closeBtn2","x":313,"y":-484,"scaleX":0.9,"scaleY":0.9,"anchorX":0,"anchorY":0,"rotation":0})
        closeBtn2.tint = 0x999999;
        closeBtn2.alpha = 0.5;
        this.addButton(closeBtn2);

        let diaryArrowBg = SpriteUtils.createSprite(this.game, this.game.width / 2 - 91, -512, 'diaryArrowsBg');
        diaryArrowBg.name = "diaryArrowsBg"
        Utils.applyPreset(diaryArrowBg, {"spriteId":"diaryArrowsBg","x":10,"y":433,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addSprite(diaryArrowBg);

        this.arrowLeft = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'diaryArrowLeft', () => this.showPrevPage(currentPage));
        this.arrowLeft.name = "arrowLeft"
        Utils.applyPreset(this.arrowLeft, {"spriteId":"arrowLeft","x":-62,"y":432,"scaleX":0.9599999999999991,"scaleY":1.0799999999999992,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addButton(this.arrowLeft);
        this.arrowLeft.visible = currentPage > 1;

        this.arrowRight = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'diaryArrowLeft', () => this.showNextPage(currentPage));
        this.arrowRight.name = "arrowRight"
        Utils.applyPreset(this.arrowRight, {"spriteId":"arrowRight","x":85,"y":430,"scaleX":-0.9599999999999991,"scaleY":1.0799999999999992,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addButton(this.arrowRight);
        this.arrowRight.visible = currentPage < this.pagesCount;

        let pageNumber = new Label(this.game, 0, 0, "" + currentPage , { font: "bold 40px DiaryDigits", fill: "#000000" });
        pageNumber.name = "pageNumber";
        Utils.applyPreset(pageNumber, {"spriteId":"pageNumber","x":11,"y":412,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0,"rotation":0,"fontSize":40})
        this.addSprite(pageNumber);
        if (animateReveal) {
            this.scheduleNavigationReveal([closeBtn, closeBtn2, diaryArrowBg, this.arrowLeft, this.arrowRight, pageNumber]);
        }

        this.screen.attachForDebug(this);
    }

    public show() {
        this.showPage(undefined, true);
        super.show();
    }


    private pageBg0:Phaser.Sprite;
    private pageBg:Skewable;

    private ensurePageBgStagingLayer(): Phaser.Group {
        if (!this.pageBgStagingLayer || !this.pageBgStagingLayer.parent) {
            this.pageBgStagingLayer = this.game.add.group();
            this.pageBgStagingLayer.name = "diaryPageBgStagingLayer";
            this.pageBgStagingLayer.fixedToCamera = true;
            this.pageBgStagingLayer.cameraOffset.set(0, 0);
        }
        this.game.world.sendToBack(this.pageBgStagingLayer);
        return this.pageBgStagingLayer;
    }

    private ensurePageTurnSprites(): void {
        if (!this.pageTurnLayer || !this.pageTurnLayer.parent) {
            this.pageTurnLayer = this.game.add.group();
            this.pageTurnLayer.name = "diaryPageTurnLayer";
            this.pageTurnLayer.visible = false;
            this.pageTurnLayer.renderable = false;
            this.addChild(this.pageTurnLayer);
        }

        if (!this.pageBg0 || !this.pageBg0.parent) {
            this.pageBg0 = SpriteUtils.createSprite(this.game, 0, 0, "bookPage");
            this.pageBg0.name = "pageTurnStatic";
            this.pageBg0.alpha = 0;
            this.pageBg0.visible = false;
            this.pageBg0.renderable = false;
            this.pageTurnLayer.add(this.pageBg0);
        }

        if (!this.pageBg || !this.pageBg.parent) {
            this.pageBg = new Skewable(this.game, 0, 0, "bookPage", "pageTurnSkewable");
            this.pageBg.alpha = 0;
            this.pageBg.visible = false;
            this.pageBg.renderable = false;
            this.pageTurnLayer.add(this.pageBg);
        }
    }

    private applyPageTurnPreset(sprite: Phaser.Sprite | Skewable): void {
        Utils.applyPreset(sprite, {
            "spriteId": "bookPage",
            "x": DiaryPanel.PAGE_TURN_X,
            "y": DiaryPanel.PAGE_TURN_Y,
            "scaleX": DiaryPanel.PAGE_TURN_SCALE_X,
            "scaleY": DiaryPanel.PAGE_TURN_SCALE_Y,
            "anchorX": 0.5,
            "anchorY": 0.5,
            "rotation": 0
        });
    }

    private resetStaticPageTurnSprite(): void {
        this.ensurePageTurnSprites();
        if (this.pageBg0) {
            this.game.tweens.removeFrom(this.pageBg0);
        }
        this.applyPageTurnPreset(this.pageBg0);
        this.pageBg0.alpha = 1;
        this.pageBg0.visible = true;
        this.pageBg0.renderable = true;
    }

    private resetSkewPageTurnSprite(): void {
        this.ensurePageTurnSprites();
        if (this.pageBg) {
            this.game.tweens.removeFrom(this.pageBg);
            this.game.tweens.removeFrom(this.pageBg.scale);
        }
        this.applyPageTurnPreset(this.pageBg);
        this.pageBg.anchor.set(0, 1);
        this.pageBg.x -= this.pageBg.width / 2;
        this.pageBg.y += this.pageBg.height / 2;
        this.pageBg.skewX = 0;
        this.pageBg.skewY = 0;
        this.pageBg.alpha = 1;
        this.pageBg.visible = true;
        this.pageBg.renderable = true;
    }

    private showPageTurnLayer(): void {
        this.ensurePageTurnSprites();
        this.pageTurnLayer.visible = true;
        this.pageTurnLayer.renderable = true;
        this.setChildIndex(this.pageTurnLayer, this.children.length - 1);
        if ((<any>this).updateTransform) {
            (<any>this).updateTransform();
        }
        if ((<any>this.pageTurnLayer).updateTransform) {
            (<any>this.pageTurnLayer).updateTransform();
        }
        if ((<any>this.pageBg0).updateTransform) {
            (<any>this.pageBg0).updateTransform();
        }
        if ((<any>this.pageBg).updateTransform) {
            (<any>this.pageBg).updateTransform();
        }
    }

    private clearPageTurnEvent(): void {
        if (this.pageTurnEvent) {
            this.game.time.events.remove(this.pageTurnEvent);
            this.pageTurnEvent = null;
        }
    }

    private hidePageTurnSprites(): void {
        if (this.pageBg0) {
            this.game.tweens.removeFrom(this.pageBg0);
        }
        if (this.pageBg) {
            this.game.tweens.removeFrom(this.pageBg);
        }
        if (this.pageBg && this.pageBg.scale) {
            this.game.tweens.removeFrom(this.pageBg.scale);
        }

        if (this.pageBg0) {
            this.pageBg0.alpha = 0;
            this.pageBg0.visible = false;
            this.pageBg0.renderable = false;
        }

        if (this.pageBg) {
            this.pageBg.alpha = 0;
            this.pageBg.visible = false;
            this.pageBg.renderable = false;
            this.pageBg.skewX = 0;
            this.pageBg.skewY = 0;
        }

        if (this.pageTurnLayer) {
            this.pageTurnLayer.visible = false;
            this.pageTurnLayer.renderable = false;
        }
    }

    private finishPageTurn(): void {
        this.pageTurnInProgress = false;
        this.hidePageTurnSprites();
    }

    private clearStagedLayoutPageBg(destroySprite?: boolean) {
        if (this.stagedPageBgRevealEvent) {
            this.game.time.events.remove(this.stagedPageBgRevealEvent);
            this.stagedPageBgRevealEvent = null;
        }

        if (this.stagedLayoutPageBg) {
            if (this.stagedLayoutPageBg.parent) {
                this.stagedLayoutPageBg.parent.removeChild(this.stagedLayoutPageBg);
            }
            if (destroySprite) {
                this.stagedLayoutPageBg.destroy(true);
            }
        }

        this.stagedLayoutPageBg = null;
        this.stagedLayoutOwner = null;
    }

    private stageLayoutPageBackground(layout: BasePanel) {
        this.clearStagedLayoutPageBg();

        if (!layout) {
            return;
        }

        let pageBg = <Phaser.Sprite>layout.children.filter(child => child && (<any>child).name == "pageBg").shift();
        if (!pageBg) {
            return;
        }

        let stagingLayer = this.ensurePageBgStagingLayer();
        stagingLayer.cameraOffset.set(this.x + layout.x, this.y + layout.y);
        stagingLayer.add(pageBg);
        this.stagedLayoutPageBg = pageBg;
        this.stagedLayoutOwner = layout;

        this.stagedPageBgRevealEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
            let stagedPageBg = this.stagedLayoutPageBg;
            let stagedLayoutOwner = this.stagedLayoutOwner;
            this.stagedPageBgRevealEvent = null;

            if (!stagedPageBg) {
                this.clearStagedLayoutPageBg();
                return;
            }

            if (!stagedLayoutOwner || !stagedLayoutOwner.parent || !stagedLayoutOwner.alive) {
                this.clearStagedLayoutPageBg(true);
                return;
            }

            if (stagedPageBg.parent) {
                stagedPageBg.parent.removeChild(stagedPageBg);
            }
            stagedLayoutOwner.addChildAt(stagedPageBg, 0);
            this.stagedLayoutPageBg = null;
            this.stagedLayoutOwner = null;
        });
    }

    private scheduleLayoutReveal() {
        if (this.layoutRevealEvent) {
            this.game.time.events.remove(this.layoutRevealEvent);
            this.layoutRevealEvent = null;
        }
        if (!this.layout) {
            return;
        }

        let layout = this.layout;
        let revealTargets: { target: PIXI.DisplayObject, alpha: number }[] = [];
        layout.children.forEach(child => {
            if (!child || (<any>child).name == "pageBg") {
                return;
            }
            if (child instanceof Phaser.Sprite || child instanceof Phaser.Button || child instanceof Phaser.BitmapText || child instanceof Phaser.Group) {
                let targetAlpha = typeof (<any>child).alpha === "number" ? (<any>child).alpha : 1;
                (<any>child).alpha = 0;
                revealTargets.push({ target: child, alpha: targetAlpha });
            }
        });
        this.layoutRevealEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
            if (!layout || !layout.parent || !layout.alive) {
                return;
            }
            revealTargets.forEach(item => {
                let target = item.target;
                if (!target || !target.parent || !(<any>target).alive) {
                    return;
                }
                (<any>target).alpha = 0;
                this.game.add.tween(target).to({ alpha: item.alpha }, 120, Easing.Linear.None, true, 0);
            });
            this.layoutRevealEvent = null;
        });
    }

    private scheduleNavigationReveal(targets: PIXI.DisplayObject[]) {
        if (this.navRevealEvent) {
            this.game.time.events.remove(this.navRevealEvent);
            this.navRevealEvent = null;
        }

        let revealTargets: { target: PIXI.DisplayObject, alpha: number }[] = [];
        targets.forEach(target => {
            if (!target || !(target instanceof Phaser.Sprite || target instanceof Phaser.Button || target instanceof Phaser.BitmapText || target instanceof Phaser.Group)) {
                return;
            }
            let targetAlpha = typeof (<any>target).alpha === "number" ? (<any>target).alpha : 1;
            (<any>target).alpha = 0;
            revealTargets.push({ target: target, alpha: targetAlpha });
        });

        this.navRevealEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
            revealTargets.forEach(item => {
                let target = item.target;
                if (!target || !target.parent || !(<any>target).alive) {
                    return;
                }
                (<any>target).alpha = 0;
                this.game.add.tween(target).to({ alpha: item.alpha }, 120, Easing.Linear.None, true, 0);
            });
            this.navRevealEvent = null;
        });
    }

    public showNextPage(currentPage:number){
        if (this.pageTurnInProgress) {
            return;
        }
        this.pageTurnInProgress = true;
        this.arrowRight.inputEnabled = false;
        this.showPage(currentPage + 1, false);

        this.resetStaticPageTurnSprite();
        this.resetSkewPageTurnSprite();
        this.showPageTurnLayer();
        this.game.add.tween(this.pageBg0).to({alpha: 0}, 300, Easing.Linear.None, true, 0);
        let pageTurnTween = this.game.add.tween(this.pageBg).to({skewY: [-2]}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        this.game.add.tween(this.pageBg.scale).to({x: 0}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        pageTurnTween.onComplete.addOnce(this.finishPageTurn, this);

        SoundUtils.diaryNextPage();
    }

    public showPrevPage(currentPage:number){
        if (this.pageTurnInProgress) {
            return;
        }
        this.pageTurnInProgress = true;
        this.arrowLeft.inputEnabled = false;
        this.clearPageTurnEvent();
        this.hidePageTurnSprites();
        this.showPage(currentPage - 1, false);

        this.resetSkewPageTurnSprite();
        this.pageBg0.visible = false;
        this.pageBg0.renderable = false;
        this.showPageTurnLayer();
        let pageTurnTween = this.game.add.tween(this.pageBg).from({skewY: -2}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        this.game.add.tween(this.pageBg.scale).from({x: 0}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        pageTurnTween.onComplete.addOnce(this.finishPageTurn, this);

        SoundUtils.diaryPrevPage();
    }

    private showPage(page?:number, animateReveal:boolean = true) {
        if (this.layoutRevealEvent) {
            this.game.time.events.remove(this.layoutRevealEvent);
            this.layoutRevealEvent = null;
        }
        if (this.navRevealEvent) {
            this.game.time.events.remove(this.navRevealEvent);
            this.navRevealEvent = null;
        }
        this.clearPageTurnEvent();
        this.hidePageTurnSprites();
        this.clearStagedLayoutPageBg(true);
        if (this.layout) {
            this.game.tweens.removeFrom(this.layout);
            this.layout.children.forEach(c => this.game.tweens.removeFrom(c));
            this.layout.onKill();
            this.layout.destroy(true);
        }
        this.children.forEach(c => {
            if(c instanceof Phaser.Sprite){
                c.destroy(true);
            }
        });
        this.initialize(page, animateReveal)
    }

    protected onClose() {
        if (this.layoutRevealEvent) {
            this.game.time.events.remove(this.layoutRevealEvent);
            this.layoutRevealEvent = null;
        }
        if (this.navRevealEvent) {
            this.game.time.events.remove(this.navRevealEvent);
            this.navRevealEvent = null;
        }
        this.clearPageTurnEvent();
        this.pageTurnInProgress = false;
        this.hidePageTurnSprites();
        this.clearStagedLayoutPageBg(true);
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }

}
