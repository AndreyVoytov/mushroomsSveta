import ForestCell from '../../../core/model/forest/ForestCell';
import AnimationUtils from '../../../core/utils/AnimationUtils';

/** A soft contact shadow stays on the ground as its item lifts away. */
export default class ItemGroundShadow {
    private sprite: Phaser.Sprite;
    private startY: number;
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(game: Phaser.Game, cell: ForestCell, source: Phaser.Sprite) {
        const key = 'fieldItemContactShadow';
        let bitmap = game.cache.getBitmapData(key);
        if (!bitmap) {
            // One reusable texture, with a soft penumbra and a denser contact
            // point. Works in Canvas and WebGL without per-frame blur filters.
            bitmap = game.make.bitmapData(128, 128, key, true);
            const ctx = bitmap.context;
            const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 62);
            gradient.addColorStop(0, 'rgba(24, 32, 20, 0.85)');
            gradient.addColorStop(0.28, 'rgba(24, 32, 20, 0.55)');
            gradient.addColorStop(0.62, 'rgba(24, 32, 20, 0.20)');
            gradient.addColorStop(1, 'rgba(24, 32, 20, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);
            bitmap.dirty = true;
        }
        const tile = cell.bg;
        this.startY = source.y;
        this.x = (source.x - tile.x - 3) / tile.scale.x;
        this.y = (source.y + (0.78 - source.anchor.y) * source.height - tile.y) / tile.scale.y;
        this.width = Math.min(82, source.width * 0.68) / Math.abs(tile.scale.x);
        this.height = 22 / Math.abs(tile.scale.y);
        this.sprite = new Phaser.Sprite(game, this.x, this.y, bitmap);
        this.sprite.anchor.set(0.5);
        this.sprite.inputEnabled = false;
        tile.addChild(this.sprite);
        this.update(source);
        AnimationUtils.primeForShow(this.sprite);
    }

    public update(item: Phaser.Sprite): void {
        if (!this.sprite || !this.sprite.parent || this.sprite.pendingDestroy) return;
        const lift = Math.min(1, Math.max(0, this.startY - item.y) / 220);
        // Greater height spreads the penumbra and weakens contact. The
        // projection moves only slightly, never following the item into the sky.
        this.sprite.width = this.width * (1 + lift * 0.55);
        this.sprite.height = this.height * (1 + lift * 0.85);
        this.sprite.alpha = 0.28 * Math.pow(1 - lift, 2) * item.alpha;
        this.sprite.visible = this.sprite.alpha > 0.002;
    }

    public destroy(): void {
        if (this.sprite && this.sprite.parent && !this.sprite.pendingDestroy) this.sprite.destroy();
        this.sprite = null;
    }
}
