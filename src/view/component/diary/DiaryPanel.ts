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
import UiLayout from '../../../core/utils/UiLayout';
export default class DiaryPanel extends ClosablePanel {
    private static REVEAL_DELAY_MS = 40;
    private static PAGE_BG_X = 49;
    private static PAGE_BG_Y = 27;
    private static PAGE_BG_SCALE_X = 1.08;
    private static PAGE_BG_SCALE_Y = 1.04;
    private static PAGE_TURN_X = 49;
    private static PAGE_TURN_Y = 27;
    private static PAGE_TURN_SCALE_X = 1.08 * 4 / 1.5;
    private static PAGE_TURN_SCALE_Y = 1.04 * 4 / 1.5;
    private static PAGE_TURN_DURATION_MS = 500;
    private static PAGE_TURN_FADE_OUT_MS = 90;
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
    private persistentPageBgLayer: Phaser.Group;
    private persistentPageBg: Phaser.Sprite;
    private pageTurnLayer: Phaser.Group;
    private stagedLayoutPageBg: Phaser.Sprite;
    private stagedLayoutOwner: BasePanel;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number) {
        super(game, x - DiaryPanel.PAGE_BG_X * DiaryPanel.panelScale(game),
            y - DiaryPanel.PAGE_BG_Y * DiaryPanel.panelScale(game), true, "diaryPanel", DiaryPanel.panelScale(game));
        this.screen = screen;
        this.ensurePersistentPageBackground();
    }

    private static panelScale(game: Phaser.Game): number {
        return Math.min(0.90, (game.width - 96) / (890 * DiaryPanel.PAGE_BG_SCALE_X),
            (game.height - 160) / (1085 * DiaryPanel.PAGE_BG_SCALE_Y));
    }

    private createPageArrow(name: string, direction: number, x: number, callback: () => void): Phaser.Button {
        const button = SpriteUtils.createButton(this.game, x, 455, 'blank', callback, name);
        button.anchor.set(0.5);button.hitArea = new Phaser.Rectangle(-48, -42, 96, 84);
        button.input.useHandCursor = true;
        const art = new Phaser.Graphics(this.game, 0, 0);
        art.beginFill(0xfff4db, 0.35);art.lineStyle(2, 0xa58b59, 0.5);art.drawCircle(0, 0, 74);art.endFill();
        art.lineStyle(5, 0x526650, 0.95);
        art.moveTo(-direction * 7, -13);art.lineTo(direction * 7, 0);art.lineTo(-direction * 7, 13);
        button.addChild(art);this.addButton(button);
        return button;
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
        if (animateReveal) {
            this.stageLayoutPageBackground(this.layout);
        }
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

       

        let closeBtn2 = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'closeButton', () => this.close());
        closeBtn2.name = "closeBtn2";
        closeBtn2.anchor.set(0.5);closeBtn2.position.set(425, -470);
        SpriteUtils.fitIcon(closeBtn2, 84, 84);UiLayout.touchTarget(closeBtn2, 104, 104);
        closeBtn2.tint = 0xffffff;
        closeBtn2.alpha = 1;
        this.addButton(closeBtn2);

        this.arrowLeft = this.createPageArrow('arrowLeft', -1, -68, () => this.showPrevPage(currentPage));
        this.arrowLeft.visible = currentPage > 1;

        this.arrowRight = this.createPageArrow('arrowRight', 1, 166, () => this.showNextPage(currentPage));
        this.arrowRight.visible = currentPage < this.pagesCount;

        let pageNumber = new Label(this.game, 49, 455, currentPage + ' / ' + this.pagesCount, { font: "32px Lora", fill: Label.INK });
        pageNumber.name = "pageNumber";
        pageNumber.anchor.set(0.5);UiLayout.fit(pageNumber, 120, 44);
        this.addSprite(pageNumber);
        if (animateReveal) {
            this.scheduleNavigationReveal([closeBtn2, this.arrowLeft, this.arrowRight, pageNumber]);
        }

        this.screen.attachForDebug(this);
    }

    public show() {
        this.showPage(undefined, true);
        super.show();
    }


    private pageBg0:Phaser.Sprite;
    private pageBg:Skewable;

    private ensurePersistentPageBackground(): void {
        if (!this.persistentPageBgLayer || !this.persistentPageBgLayer.parent) {
            this.persistentPageBgLayer = this.game.add.group();
            this.persistentPageBgLayer.name = "diaryPersistentPageBgLayer";
            this.addChildAt(this.persistentPageBgLayer, 0);
        } else if (this.persistentPageBgLayer.parent === this) {
            this.setChildIndex(this.persistentPageBgLayer, 0);
        }

        if (!this.persistentPageBg || !this.persistentPageBg.parent) {
            this.persistentPageBg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg", "persistentPageBg");
            Utils.applyPreset(this.persistentPageBg, {
                "spriteId": "bookBg",
                "x": DiaryPanel.PAGE_BG_X,
                "y": DiaryPanel.PAGE_BG_Y,
                "scaleX": DiaryPanel.PAGE_BG_SCALE_X,
                "scaleY": DiaryPanel.PAGE_BG_SCALE_Y,
                "anchorX": 0.5,
                "anchorY": 0.5,
                "rotation": 0
            });
            this.persistentPageBgLayer.add(this.persistentPageBg);
        }
    }

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
        let revealTargets = this.prepareRevealTargets(layout.children.filter(child => child && (<any>child).name != "pageBg"));
        this.layoutRevealEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
            if (!layout || !layout.parent || !layout.alive) {
                return;
            }
            this.revealTargets(revealTargets, 120);
            this.layoutRevealEvent = null;
        });
    }

    private scheduleNavigationReveal(targets: PIXI.DisplayObject[]) {
        if (this.navRevealEvent) {
            this.game.time.events.remove(this.navRevealEvent);
            this.navRevealEvent = null;
        }

        let revealTargets = this.prepareRevealTargets(targets);

        this.navRevealEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
            this.revealTargets(revealTargets, 120);
            this.navRevealEvent = null;
        });
    }

    private prepareRevealTargets(targets: PIXI.DisplayObject[]): { target: PIXI.DisplayObject, alpha: number }[] {
        let revealTargets: { target: PIXI.DisplayObject, alpha: number }[] = [];
        targets.forEach(target => {
            if (!target || !(target instanceof Phaser.Sprite || target instanceof Phaser.Button || target instanceof Phaser.BitmapText || target instanceof Phaser.Text || target instanceof Phaser.Group)) {
                return;
            }
            let targetAlpha = typeof (<any>target).alpha === "number" ? (<any>target).alpha : 1;
            (<any>target).alpha = 0;
            revealTargets.push({ target: target, alpha: targetAlpha });
        });
        return revealTargets;
    }

    private revealTargets(targets: { target: PIXI.DisplayObject, alpha: number }[], duration?: number): void {
        targets.forEach(item => {
            let target = item.target;
            if (!target || !target.parent || !(<any>target).alive) {
                return;
            }
            (<any>target).alpha = 0;
            if (duration && duration > 0) {
                this.game.add.tween(target).to({ alpha: item.alpha }, duration, Easing.Linear.None, true, 0);
            } else {
                (<any>target).alpha = item.alpha;
            }
        });
    }

    public showNextPage(currentPage:number){
        if (this.pageTurnInProgress || !this.opened || currentPage >= this.pagesCount) {
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
        if (this.pageTurnInProgress || !this.opened || currentPage <= 1) {
            return;
        }
        this.pageTurnInProgress = true;
        this.arrowLeft.inputEnabled = false;
        this.clearPageTurnEvent();
        this.hidePageTurnSprites();

        this.resetSkewPageTurnSprite();
        this.pageBg0.visible = false;
        this.pageBg0.renderable = false;
        let targetScaleX = this.pageBg.scale.x;
        this.pageBg.scale.x = 0;
        this.pageBg.skewY = -2;
        this.showPageTurnLayer();
        let pageTurnTween = this.game.add.tween(this.pageBg).to({skewY: 0}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        this.game.add.tween(this.pageBg.scale).to({x: targetScaleX}, DiaryPanel.PAGE_TURN_DURATION_MS, Easing.Linear.None, true, 0);
        pageTurnTween.onComplete.addOnce(() => {
            this.showPage(currentPage - 1, false, true);
            this.pageBg.alpha = 1;
            this.pageBg.visible = true;
            this.pageBg.renderable = true;
            this.showPageTurnLayer();
            this.pageTurnEvent = this.game.time.events.add(DiaryPanel.REVEAL_DELAY_MS, () => {
                this.pageTurnEvent = null;
                let fadeTween = this.game.add.tween(this.pageBg).to({alpha: 0}, DiaryPanel.PAGE_TURN_FADE_OUT_MS, Easing.Linear.None, true, 0);
                fadeTween.onComplete.addOnce(this.finishPageTurn, this);
            });
        }, this);

        SoundUtils.diaryPrevPage();
    }

    private showPage(page?:number, animateReveal:boolean = true, keepPageTurnCover:boolean = false) {
        if (this.layoutRevealEvent) {
            this.game.time.events.remove(this.layoutRevealEvent);
            this.layoutRevealEvent = null;
        }
        if (this.navRevealEvent) {
            this.game.time.events.remove(this.navRevealEvent);
            this.navRevealEvent = null;
        }
        this.clearPageTurnEvent();
        if (!keepPageTurnCover) {
            this.hidePageTurnSprites();
        }
        this.clearStagedLayoutPageBg(true);
        if (this.layout) {
            this.game.tweens.removeFrom(this.layout);
            this.layout.children.forEach(c => this.game.tweens.removeFrom(c));
            this.layout.onKill();
            this.layout.destroy(true);
        }
        this.children.slice().forEach(c => {
            if(c instanceof Phaser.Sprite || c instanceof Phaser.BitmapText || c instanceof Phaser.Text){
                this.game.tweens.removeFrom(c);
                (<any>c).destroy(true);
            }
        });
        this.ensurePersistentPageBackground();
        this.initialize(page, animateReveal);
        if (keepPageTurnCover) {
            this.showPageTurnLayer();
        }
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
