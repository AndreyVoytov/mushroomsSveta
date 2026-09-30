import ForestCell from '../../../core/model/forest/ForestCell';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import AnimationUtils from '../../../core/utils/AnimationUtils';

type SoilParticle = {
    sprite: Phaser.Sprite;
    age: number;
    life: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    arc: number;
    spin: number;
    size: number;
};

/** One bounded particle pool per board; the persistent holes belong to tiles. */
export default class MushroomHarvestEffects extends Phaser.Group {
    private particles: SoilParticle[] = [];

    constructor(game: Phaser.Game) {
        super(game, game.world, 'mushroomHarvestEffects');
        this.inputEnableChildren = false;
        // A rocket/rapid taps can collect many mushrooms in the same frame.
        // Reuse at most 48 sprites, with no physics emitters or per-piece tweens.
        for (let i = 0; i < 48; i++) {
            const sprite = SpriteUtils.createSprite(game, 0, 0, 'soilClod');
            sprite.anchor.set(0.5);
            sprite.inputEnabled = false;
            sprite.visible = false;
            this.add(sprite);
            this.particles.push({ sprite, age: 0, life: 0, x: 0, y: 0,
                dx: 0, dy: 0, arc: 0, spin: 0, size: 0 });
        }
        this.exists = false;
    }

    public static isMushroom(image: string): boolean {
        return ['mushroom', 'mushroom3', 'mushroom4', 'mushroom5',
            'amanita', 'amanita2', 'witchMushroom', 'witchMushroom2'].indexOf(image) >= 0;
    }

    public reveal(cell: ForestCell, delay: number, onLift?: () => void): void {
        if (!cell.bg || cell.mushroomHole) return;
        const source = cell.state.sprite;
        const bg = cell.bg;
        // The original mushroom art has transparent padding below its stem.
        // Keep the indentation near the stem base, inside the lower hex edge.
        const x = source.x;
        const y = source.y + (0.84 - source.anchor.y) * source.height;
        const hole = SpriteUtils.createSprite(this.game,
            (x - bg.x) / bg.scale.x, (y - bg.y) / bg.scale.y, 'mushroomHole');
        hole.anchor.set(0.5);
        hole.inputEnabled = false;
        hole.alpha = 0;
        bg.addChild(hole);
        cell.mushroomHole = hole;
        const sx = (72 / hole.width) / Math.abs(bg.scale.x);
        // A taller, tactile impression remains after the stem is pulled out.
        const sy = (64 / hole.height) / Math.abs(bg.scale.y);
        hole.scale.set(sx * 0.82, sy * 0.65);
        this.game.time.events.add(delay, () => {
            if (!this.game || !this.parent || hole.pendingDestroy || !hole.parent) return;
            AnimationUtils.primeForShow(hole);
            this.game.add.tween(hole).to({ alpha: 1 }, 120, Phaser.Easing.Linear.None, true);
            this.game.add.tween(hole.scale).to({ x: sx, y: sy }, 240,
                Phaser.Easing.Back.Out, true);
            // Keep the mark long enough to read, then let the ground settle
            // back naturally instead of accumulating stale holes on a board.
            this.game.add.tween(hole).to({ alpha: 0 }, 1200, Phaser.Easing.Sinusoidal.In,
                true, 2200).onComplete.addOnce(() => {
                    if (cell.mushroomHole == hole && !hole.pendingDestroy) {
                        cell.mushroomHole = null;
                        hole.destroy();
                    }
                });
            this.emitSoil(x, y);
            // Keep soil below the flying item and the HUD, even in tutorials.
            this.game.world.bringToTop(this);
            if (onLift) onLift();
        });
    }

    private emitSoil(x: number, y: number): void {
        let emitted = 0;
        for (let i = 0; i < this.particles.length && emitted < 8; i++) {
            const p = this.particles[i];
            if (p.sprite.visible) continue;
            const side = emitted % 2 == 0 ? -1 : 1;
            p.age = 0;
            p.life = 560 + Math.random() * 200;
            p.x = x + side * (5 + Math.random() * 9);
            p.y = y - 2;
            p.dx = side * (20 + Math.random() * 22);
            p.dy = 2 + Math.random() * 12;
            p.arc = 19 + Math.random() * 23;
            p.spin = side * (100 + Math.random() * 180);
            p.size = 5 + Math.random() * 6;
            p.sprite.position.set(p.x, p.y);
            p.sprite.width = p.sprite.height = p.size;
            p.sprite.angle = 0;
            p.sprite.alpha = 1;
            AnimationUtils.primeForShow(p.sprite);
            p.sprite.visible = true;
            emitted++;
        }
        this.exists = true;
    }

    public update(): void {
        if (!this.exists) return;
        const dt = Math.min(50, this.game.time.elapsedMS || 16.67);
        let active = false;
        this.particles.forEach(p => {
            if (!p.sprite.visible) return;
            p.age += dt;
            const t = Math.min(1, p.age / p.life);
            // First 72%: ballistic arc; last 28%: a tiny settling bounce.
            const flight = Math.min(1, t / 0.72);
            const settle = Math.max(0, (t - 0.72) / 0.28);
            p.sprite.x = p.x + p.dx * flight;
            p.sprite.y = p.y + p.dy * flight - 4 * p.arc * flight * (1 - flight)
                - Math.sin(settle * Math.PI) * 3;
            p.sprite.angle = p.spin * flight;
            p.sprite.alpha = t < 0.72 ? 1 : (1 - t) / 0.28;
            if (t >= 1) p.sprite.visible = false;
            else active = true;
        });
        this.exists = active;
    }
}
