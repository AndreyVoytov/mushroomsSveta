import Preset from '../../game/Preset';
import Utils from './../../../core/utils/Utils';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import BasePanel from '../../component/panel/BasePanel';
import DiaryMapLayout from '../diary/DiaryMapLayout';
import DiaryRecipeLayout from '../diary/DiaryRecipeLayout';
import DialogPanel from './DialogPanel';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import DiaryPictureLayout from '../diary/DiaryPictureLayout';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class ReplicaDiaryPanel extends BasePanel {
    private static INITIAL_REVEAL_DELAY_MS = 10;
    private static INITIAL_REVEAL_FADE_MS = 500;
    private static DIARY_EFFECT_LOCAL_X = 129;
    private static DIARY_EFFECT_LOCAL_Y = 38 - 56 / 1.18 + 13;

    private blackTransparent: Phaser.Graphics;
    private diaryLayout: BasePanel;
    private diaryPreset: Preset;

    private gameCenterY;

    private finalScale = 0.9;
    private emitter: Phaser.Particles.Arcade.Emitter;
    private emitterStartEvent: Phaser.TimerEvent;
    private layoutAlphaTween: Phaser.Tween;
    private diaryHighlightColor: string;

    private static RIGHT_SIDE_DX = -70;

    constructor(game: Phaser.Game, x: number, y: number, r: ReplicaType, diaryPrest?: Preset) {
        super(game, x + (r.rightSide? ReplicaDiaryPanel.RIGHT_SIDE_DX : 0), y);
        this.diaryPreset = diaryPrest;

        //Всегда подсвечиваем дневник!
        let highlight = true;

        //TODO переделать панель, чтобы (0,0) совпадало с глобальными (0,0)
        this.gameCenterY = -this.game.height / 2 + 280 + DialogPanel.BOTTOM_PADDING - 100;

        //diaryPreset - показ дневника во время мини-игры
        let diaryContent = diaryPrest && r.context.level != 3 ? DiaryConfiguration.getNextrecipe(r.context.level) : DiaryConfiguration.getCurrentRecipe(r.context.level, true);

        this.diaryHighlightColor = diaryContent && diaryContent.highlightColor ? diaryContent.highlightColor : null;

        if (highlight && !diaryPrest) {
            this.emitter = this.createDiaryEmitter(new Phaser.Point(game.world.centerX, game.world.centerY - 200));
            this.startDiaryEmitter();
        }

       

        if (!diaryPrest) {
            let dx = r.rightSide? ReplicaDiaryPanel.RIGHT_SIDE_DX : 0;
            this.blackTransparent = new Phaser.Graphics(this.game, 0, 0);
            this.blackTransparent.beginFill(0x000000, 1);
            this.blackTransparent.drawRect(0-dx, this.gameCenterY - this.game.height / 2, this.game.width-dx, this.game.height);
            this.blackTransparent.endFill();
            this.blackTransparent.alpha = 0;
            this.blackTransparent.inputEnabled = false;
            this.blackTransparent.fixedToCamera = false;
            this.addChild(this.blackTransparent);
        }

        if (!diaryContent) {
            return;
        }

        let animationsDelay = diaryPrest ? 1010 : 0;

        if (diaryContent.mapPreset) {
            this.diaryLayout = new DiaryMapLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100);
        } else if (diaryContent.picture) {
            this.diaryLayout = new DiaryPictureLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100);
        } else {
            this.diaryLayout = new DiaryRecipeLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100, animationsDelay, !diaryPrest);
        }

        this.diaryLayout.anchor.set(0.5, 0.5)
        this.diaryLayout.scale.set(0);
        this.diaryLayout.alpha = 0;

        if(highlight){
            let diaryShine = SpriteUtils.createSprite(this.game, 0, 0, "diaryShine")
            diaryShine.name = "diaryShine";
            Utils.applyPreset(diaryShine, { "spriteId": "diaryShine", "x": 129, "y": 38 - 56/1.18 + 13, "scaleX": 5.780000000000004, "scaleY": 5.640000000000013, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
            this.diaryLayout.addSprite(diaryShine)
            this.diaryLayout.setChildIndex(diaryShine, 0);

            if(diaryContent.highlightColor && diaryContent.highlightColor == "pink"){
                // diaryShine.tint = 0xda54ff;
                diaryShine.tint = 0xa53dba;
            } else if(diaryContent.highlightColor && diaryContent.highlightColor == "blue"){
                diaryShine.tint = 0x52a5ff;
            } else { //green
                diaryShine.tint = 0x67f567;
            }

            game.add.tween(diaryShine).to({ alpha: [0, 1] }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true)
        }

        this.addSprite(this.diaryLayout);

        if (diaryPrest) {
            Utils.applyPreset(this.diaryLayout, diaryPrest);
            this.diaryLayout.y -= this.game.height - 280 - DialogPanel.BOTTOM_PADDING;
        }
    }

    public show() {
        let time = this.diaryPreset ? 1000 : 300;
        this.stopRevealTweens();
        this.stopEmitterStartEvent();
        this.bringEmitterToStageTop();

        let alphaDelay = this.diaryPreset ? ReplicaDiaryPanel.INITIAL_REVEAL_DELAY_MS : 500;
        let alphaTime = this.diaryPreset ? ReplicaDiaryPanel.INITIAL_REVEAL_FADE_MS : time;
        let alphaEasing = Settings.isOnlyLinearAnimations()
            ? Phaser.Easing.Linear.None
            : (this.diaryPreset ? Phaser.Easing.Quadratic.Out : Phaser.Easing.Quadratic.In);

        this.diaryLayout.alpha = 0;
        this.layoutAlphaTween = this.game.add.tween(this.diaryLayout).to({ alpha: 1 }, alphaTime, alphaEasing, true, alphaDelay, 0, false);
        this.layoutAlphaTween.onComplete.addOnce(() => {
            this.layoutAlphaTween = null;
        });
        if (this.blackTransparent) {
            this.game.add.tween(this.blackTransparent).to({ alpha: 0.5 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        }
        this.game.add.tween(this.diaryLayout.scale).to({ x: this.finalScale, y: this.finalScale }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        this.game.add.tween(this.diaryLayout).to({ x: this.game.width / 2 + 30, y: this.gameCenterY - 100 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);

        if (this.diaryPreset) {
            this.game.add.tween(this.diaryLayout).to({ angle: 365 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
            this.emitterStartEvent = this.game.time.events.add(500 + time, () => {
                this.emitterStartEvent = null;
                this.recreateDiaryEmitterAtCurrentPosition();
            });
        }

        // if (highlight) {
            this.game.time.events.add(500 + time + 500, ()=>{
                let animationsDelay = this.diaryPreset ? 1010 : 0;
                let p = this.diaryLayout;
                let k = 0.1;
                let k2 = 2;
                this.game.add.tween(this.diaryLayout).to({ angle: [20 * k, -5 * k, 10 * k, -20 * k, 0, -20 * k, 10 * k, -5 * k, 20 * k, 5] }, 3 * 15000 * Math.abs(k * 10), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
                this.game.add.tween(this.diaryLayout).to({ x: [p.x + 30 * k2, p.x + 5 * k2, p.x - 15 * k2, p.x, p.x - 15 * k2, p.x + 5 * k2, p.x + 30 * k2, p.x], y: [p.y + 20 * k2, p.y + 30 * k2, p.y + 15 * k2, p.y, p.y + 15 * k2, p.y + 30 * k2, p.y + 20 * k2, p.y] }, 3 * 20000 * Math.abs(k2), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
            })
            
        // }

    }

    public hide() {
        this.stopRevealTweens();
        this.stopEmitterStartEvent();
        if (this.blackTransparent) {
            this.game.add.tween(this.blackTransparent).to({ alpha: 0 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
            this.game.time.events.add(300 + 1, () => this.blackTransparent.kill());
        }
        this.game.add.tween(this.diaryLayout).to({ x: this.game.width + 400 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
        this.game.add.tween(this.diaryLayout.scale).to({ x: 0.3, y: 0.3 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
        this.game.time.events.add(490, () => {
            if (this.emitter) {
                this.emitter.killAll();
                this.emitter.kill();
            }
            this.diaryLayout.onKill();
            this.diaryLayout.alpha = 0;
            this.diaryLayout.kill();
        });
    }

    public update(): void {
        if (this.diaryPreset && this.emitter) {
            this.syncEmitterToDiary();
        }
    }

    private stopRevealTweens(): void {
        if (this.layoutAlphaTween) {
            this.layoutAlphaTween.stop(false);
            this.layoutAlphaTween = null;
        }
    }

    private stopEmitterStartEvent(): void {
        if (!this.emitterStartEvent) {
            return;
        }

        this.game.time.events.remove(this.emitterStartEvent);
        this.emitterStartEvent = null;
    }

    private recreateDiaryEmitterAtCurrentPosition(): void {
        if (this.emitter) {
            this.emitter.killAll();
            this.emitter.kill();
            this.emitter.destroy(true);
            this.emitter = null;
        }

        this.emitter = this.createDiaryEmitter(this.getDiaryEmitterGlobalPoint());
        this.startDiaryEmitter();
        this.syncEmitterToDiary();
    }

    private createDiaryEmitter(globalPoint: Phaser.Point): Phaser.Particles.Arcade.Emitter {
        let emitter = this.game.add.emitter(globalPoint.x, globalPoint.y, 10);

        if (this.diaryHighlightColor == "pink") {
            emitter.makeParticles(
                SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").atlasKey,
                [SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p7").frameName]
            );
        } else if (this.diaryHighlightColor == "blue") {
            emitter.makeParticles(
                SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").atlasKey,
                [SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p9").frameName]
            );
        } else {
            emitter.makeParticles(
                SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").atlasKey,
                [SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p5").frameName]
            );
        }

        emitter.gravity = new Phaser.Point(0, 0);
        emitter.minSpeed = 100;
        emitter.maxSpeed = 300;
        emitter.width = 400;
        emitter.height = 600;

        return emitter;
    }

    private startDiaryEmitter(): void {
        if (!this.emitter) {
            return;
        }

        this.emitter.start(false, 5000, 200);
        this.emitter.setAlpha(0.7, 0, 5000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, false);
        this.emitter.setScale(0, 0.7, 0, 0.7, 1450, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false)
    }

    private getDiaryEmitterGlobalPoint(): Phaser.Point {
        if (!this.diaryLayout || !(<any>this.diaryLayout).toGlobal) {
            return new Phaser.Point(this.game.world.centerX, this.game.world.centerY - 200);
        }

        return (<any>this.diaryLayout).toGlobal(new Phaser.Point(
            ReplicaDiaryPanel.DIARY_EFFECT_LOCAL_X,
            ReplicaDiaryPanel.DIARY_EFFECT_LOCAL_Y
        ));
    }

    private syncEmitterToDiary(): void {
        if (!this.emitter) {
            return;
        }

        let globalPoint = this.getDiaryEmitterGlobalPoint();
        this.emitter.x = globalPoint.x;
        this.emitter.y = globalPoint.y;
        this.bringEmitterToStageTop();
    }

    private bringEmitterToStageTop(): void {
        if (!this.emitter) {
            return;
        }

        let globalPoint = this.emitter.parent && (<any>this.emitter.parent).toGlobal
            ? (<any>this.emitter.parent).toGlobal(new Phaser.Point(this.emitter.x, this.emitter.y))
            : new Phaser.Point(this.emitter.x, this.emitter.y);

        if (this.emitter.parent != this.game.stage) {
            this.game.stage.addChild(this.emitter);
        }

        this.emitter.x = globalPoint.x;
        this.emitter.y = globalPoint.y;
        this.game.stage.setChildIndex(this.emitter, this.game.stage.children.length - 1);
    }
}
