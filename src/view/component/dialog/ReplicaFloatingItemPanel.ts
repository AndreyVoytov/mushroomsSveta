import BasePanel from '../../component/panel/BasePanel';
import DialogPanel from './DialogPanel';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import ReplicaPanelItemType from '../../../core/model/replica/ReplicaPanelItemType';
import Settings from '../../../core/service/Settings';
import SpriteUtils from '../../../core/utils/SpriteUtils';

export default class ReplicaFloatingItemPanel extends BasePanel {
    private static readonly INITIAL_REVEAL_DELAY_MS = 10;
    private static readonly INITIAL_REVEAL_FADE_MS = 500;
    private static readonly APPEAR_DELAY_MS = 500;
    private static readonly APPEAR_DURATION_MS = 300;
    private static readonly HIDE_DELAY_MS = 200;
    private static readonly HIDE_DURATION_MS = 300;
    private static readonly HOLDER_TARGET_X_OFFSET = 30;
    private static readonly HOLDER_TARGET_Y_OFFSET = -100;
    private static readonly RIGHT_SIDE_DX = -70;
    private static readonly BLACK_OVERLAY_ALPHA = 0.5;
    private static readonly MIN_PARTICLE_AREA_WIDTH = 220;
    private static readonly MIN_PARTICLE_AREA_HEIGHT = 220;

    private blackTransparent: Phaser.Graphics;
    private itemHolder: Phaser.Group;
    private itemSprite: Phaser.Sprite;
    private glowSprite: Phaser.Sprite;
    private emitter: Phaser.Particles.Arcade.Emitter;
    private emitterStartEvent: Phaser.TimerEvent;
    private hoverStartEvent: Phaser.TimerEvent;
    private revealAlphaTween: Phaser.Tween;
    private glowPulseTween: Phaser.Tween;
    private activeTweens: Phaser.Tween[] = [];
    private gameCenterY: number;
    private finalScale = 1;
    private highlightColor: string;
    private panelItem: ReplicaPanelItemType;

    constructor(game: Phaser.Game, x: number, y: number, r: ReplicaType, panelItem: ReplicaPanelItemType) {
        super(game, x + (r.rightSide ? ReplicaFloatingItemPanel.RIGHT_SIDE_DX : 0), y);

        this.panelItem = panelItem;
        this.gameCenterY = -this.game.height / 2 + 280 + DialogPanel.BOTTOM_PADDING - 100;
        this.highlightColor = panelItem && panelItem.highlightColor ? panelItem.highlightColor : "blue";

        const dx = r.rightSide ? ReplicaFloatingItemPanel.RIGHT_SIDE_DX : 0;
        this.blackTransparent = new Phaser.Graphics(this.game, 0, 0);
        this.blackTransparent.beginFill(0x000000, 1);
        this.blackTransparent.drawRect(0 - dx, this.gameCenterY - this.game.height / 2, this.game.width - dx, this.game.height);
        this.blackTransparent.endFill();
        this.blackTransparent.alpha = 0;
        this.blackTransparent.inputEnabled = false;
        this.blackTransparent.fixedToCamera = false;
        this.addChild(this.blackTransparent);

        this.itemHolder = new Phaser.Group(this.game, this);
        this.itemHolder.x = this.getTargetX();
        this.itemHolder.y = this.getTargetY();
        this.itemHolder.alpha = 0;
        this.itemHolder.visible = false;

        this.glowSprite = SpriteUtils.createSprite(this.game, 0, 0, panelItem.glowImage);
        this.glowSprite.anchor.set(0.5);
        this.glowSprite.alpha = 0.75;
        this.glowSprite.tint = this.getGlowTint();
        this.itemHolder.add(this.glowSprite);

        this.itemSprite = SpriteUtils.createSprite(this.game, 0, 0, panelItem.image);
        this.itemSprite.anchor.set(0.5);
        this.itemHolder.add(this.itemSprite);

        this.fitGlowToItem();
        this.fitItemToBounds();
    }

    public show(): void {
        this.stopRevealTweens();
        this.stopHoverTweens();
        this.stopEmitterStartEvent();
        this.stopHoverStartEvent();
        this.stopGlowPulse();
        this.destroyEmitter();

        this.itemHolder.visible = true;
        this.itemHolder.alpha = 0;
        this.itemHolder.angle = 0;
        this.itemHolder.x = this.getTargetX();
        this.itemHolder.y = this.getTargetY();
        this.itemHolder.scale.set(0);
        this.glowSprite.alpha = 0.75;

        this.revealAlphaTween = this.game.add.tween(this.itemHolder).to(
            { alpha: 1 },
            ReplicaFloatingItemPanel.INITIAL_REVEAL_FADE_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.APPEAR_DELAY_MS + ReplicaFloatingItemPanel.INITIAL_REVEAL_DELAY_MS,
            0,
            false
        );
        this.revealAlphaTween.onComplete.addOnce(() => {
            this.revealAlphaTween = null;
        });

        this.game.add.tween(this.blackTransparent).to(
            { alpha: ReplicaFloatingItemPanel.BLACK_OVERLAY_ALPHA },
            ReplicaFloatingItemPanel.APPEAR_DURATION_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.APPEAR_DELAY_MS,
            0,
            false
        );

        this.activeTweens.push(this.game.add.tween(this.itemHolder.scale).to(
            { x: this.finalScale, y: this.finalScale },
            ReplicaFloatingItemPanel.APPEAR_DURATION_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.APPEAR_DELAY_MS,
            0,
            false
        ));

        this.emitterStartEvent = this.game.time.events.add(
            ReplicaFloatingItemPanel.APPEAR_DELAY_MS + ReplicaFloatingItemPanel.APPEAR_DURATION_MS,
            () => {
                this.emitterStartEvent = null;
                this.createEmitterAtCurrentPosition();
                this.startGlowPulse();
            }
        );

        this.hoverStartEvent = this.game.time.events.add(
            ReplicaFloatingItemPanel.APPEAR_DELAY_MS + ReplicaFloatingItemPanel.APPEAR_DURATION_MS + 500,
            () => {
                this.hoverStartEvent = null;
                this.startHoverTweens();
            }
        );
    }

    public hide(): void {
        this.stopRevealTweens();
        this.stopHoverTweens();
        this.stopEmitterStartEvent();
        this.stopHoverStartEvent();
        this.stopGlowPulse();

        this.game.add.tween(this.blackTransparent).to(
            { alpha: 0 },
            ReplicaFloatingItemPanel.HIDE_DURATION_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.HIDE_DELAY_MS,
            0,
            false
        );

        this.activeTweens.push(this.game.add.tween(this.itemHolder).to(
            { x: this.game.width + 400, alpha: 0 },
            ReplicaFloatingItemPanel.HIDE_DURATION_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.HIDE_DELAY_MS,
            0,
            false
        ));
        this.activeTweens.push(this.game.add.tween(this.itemHolder.scale).to(
            { x: this.finalScale * 0.3, y: this.finalScale * 0.3 },
            ReplicaFloatingItemPanel.HIDE_DURATION_MS,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            true,
            ReplicaFloatingItemPanel.HIDE_DELAY_MS,
            0,
            false
        ));

        this.game.time.events.add(ReplicaFloatingItemPanel.HIDE_DELAY_MS + ReplicaFloatingItemPanel.HIDE_DURATION_MS + 1, () => {
            this.destroyEmitter();
            this.itemHolder.visible = false;
        });
    }

    public update(): void {
        if (!this.emitter || !this.itemHolder.visible) {
            return;
        }

        this.syncEmitterToItem();
    }

    protected getFinalScaleMultiplier(): number {
        return this.panelItem && this.panelItem.scaleMultiplier != null ? this.panelItem.scaleMultiplier : 1;
    }

    private fitGlowToItem(): void {
        if (!this.glowSprite || !this.itemSprite || !this.glowSprite.width || !this.glowSprite.height) {
            return;
        }

        this.glowSprite.scale.set(
            this.itemSprite.width / this.glowSprite.width,
            this.itemSprite.height / this.glowSprite.height
        );
    }

    private fitItemToBounds(): void {
        const maxWidth = 360;
        const maxHeight = 260;
        if (!this.itemSprite || !this.itemSprite.width || !this.itemSprite.height) {
            this.finalScale = this.getFinalScaleMultiplier();
            return;
        }

        this.finalScale = Math.min(1, maxWidth / this.itemSprite.width, maxHeight / this.itemSprite.height)
            * this.getFinalScaleMultiplier();
    }

    private getTargetX(): number {
        return this.game.width / 2
            + ReplicaFloatingItemPanel.HOLDER_TARGET_X_OFFSET
            + (this.panelItem && this.panelItem.offsetX ? this.panelItem.offsetX : 0);
    }

    private getTargetY(): number {
        return this.gameCenterY
            + ReplicaFloatingItemPanel.HOLDER_TARGET_Y_OFFSET
            + (this.panelItem && this.panelItem.offsetY ? this.panelItem.offsetY : 0);
    }

    private getGlowTint(): number {
        switch (this.highlightColor) {
            case "pink":
                return 0xa53dba;
            case "blue":
                return 0x52a5ff;
            default:
                return 0x67f567;
        }
    }

    private getParticleFrameNames(): string[] {
        switch (this.highlightColor) {
            case "pink":
                return [SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p7").frameName];
            case "blue":
                return [SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p9").frameName];
            default:
                return [SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p5").frameName];
        }
    }

    private getParticleAtlasKey(): string {
        switch (this.highlightColor) {
            case "pink":
                return SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").atlasKey;
            case "blue":
                return SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").atlasKey;
            default:
                return SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").atlasKey;
        }
    }

    private createEmitterAtCurrentPosition(): void {
        this.destroyEmitter();

        const globalPoint = this.getEmitterGlobalPoint();
        this.emitter = this.game.add.emitter(globalPoint.x, globalPoint.y, 12);
        this.emitter.makeParticles(this.getParticleAtlasKey(), this.getParticleFrameNames());
        this.emitter.gravity = new Phaser.Point(0, 0);
        this.emitter.minSpeed = 70;
        this.emitter.maxSpeed = 210;
        this.emitter.width = Math.max(
            ReplicaFloatingItemPanel.MIN_PARTICLE_AREA_WIDTH,
            this.itemSprite.width * this.finalScale * 1.2
        );
        this.emitter.height = Math.max(
            ReplicaFloatingItemPanel.MIN_PARTICLE_AREA_HEIGHT,
            this.itemSprite.height * this.finalScale * 1.35
        );
        this.emitter.start(false, 3500, 150);
        this.emitter.setAlpha(
            0.75,
            0,
            3500,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In,
            false
        );
        this.emitter.setScale(
            0,
            0.8,
            0,
            0.8,
            1450,
            Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
            false
        );
        this.bringEmitterToStageTop();
    }

    private startHoverTweens(): void {
        const targetX = this.getTargetX();
        const targetY = this.getTargetY();

        this.activeTweens.push(this.game.add.tween(this.itemHolder).to(
            { angle: [6, -2, 4, -6, 0, -4, 3, -2, 5] },
            16000,
            Phaser.Easing.Linear.None,
            true,
            0,
            -1,
            false
        ));
        this.activeTweens.push(this.game.add.tween(this.itemHolder).to(
            {
                x: [targetX + 18, targetX + 6, targetX - 12, targetX, targetX - 8, targetX + 10, targetX + 18, targetX],
                y: [targetY + 12, targetY + 22, targetY + 10, targetY, targetY - 8, targetY + 16, targetY + 8, targetY]
            },
            20000,
            Phaser.Easing.Linear.None,
            true,
            0,
            -1,
            false
        ));
    }

    private stopRevealTweens(): void {
        if (this.revealAlphaTween) {
            this.revealAlphaTween.stop(false);
            this.revealAlphaTween = null;
        }
    }

    private stopHoverTweens(): void {
        this.activeTweens.forEach(tween => {
            if (tween) {
                tween.stop(false);
            }
        });
        this.activeTweens = [];
    }

    private startGlowPulse(): void {
        this.stopGlowPulse();
        this.glowPulseTween = this.game.add.tween(this.glowSprite).to(
            { alpha: [0.3, 0.95] },
            2600,
            Phaser.Easing.Linear.None,
            true,
            0,
            -1,
            true
        );
    }

    private stopGlowPulse(): void {
        if (!this.glowPulseTween) {
            return;
        }

        this.glowPulseTween.stop(false);
        this.glowPulseTween = null;
    }

    private stopEmitterStartEvent(): void {
        if (!this.emitterStartEvent) {
            return;
        }

        this.game.time.events.remove(this.emitterStartEvent);
        this.emitterStartEvent = null;
    }

    private stopHoverStartEvent(): void {
        if (!this.hoverStartEvent) {
            return;
        }

        this.game.time.events.remove(this.hoverStartEvent);
        this.hoverStartEvent = null;
    }

    private destroyEmitter(): void {
        if (!this.emitter) {
            return;
        }

        this.emitter.killAll();
        this.emitter.kill();
        this.emitter.destroy(true);
        this.emitter = null;
    }

    private getEmitterGlobalPoint(): Phaser.Point {
        if (!this.itemHolder || !(<any>this.itemHolder).toGlobal) {
            return new Phaser.Point(this.game.world.centerX, this.game.world.centerY - 200);
        }

        return (<any>this.itemHolder).toGlobal(new Phaser.Point(0, 0));
    }

    private syncEmitterToItem(): void {
        const globalPoint = this.getEmitterGlobalPoint();
        this.emitter.x = globalPoint.x;
        this.emitter.y = globalPoint.y;
        this.bringEmitterToStageTop();
    }

    private bringEmitterToStageTop(): void {
        if (!this.emitter) {
            return;
        }

        const globalPoint = this.emitter.parent && (<any>this.emitter.parent).toGlobal
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
