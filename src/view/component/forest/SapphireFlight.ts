import LevelCompletePanel from './CompleteLevelPanel';
import SapphireEffects from './SapphireEffects';

type Flight = {
    star: Phaser.Sprite;
    glow: Phaser.Sprite;
    x: number; y: number;
    scaleX: number; scaleY: number;
    delay: number;
    done: boolean;
};
type Spark = {
    sprite: Phaser.Sprite;
    age: number; life: number;
    vx: number; vy: number; size: number;
};

export default class SapphireFlight extends Phaser.Group {
    private flights: Flight[] = [];
    private sparks: Spark[] = [];
    private elapsed = 0;
    private startedAt = 0;
    private lastTrail = 0;
    private trailCursor = 0;
    private sparkCursor = 0;
    private finishedAt = -1;
    private panel: LevelCompletePanel;
    private target = new Phaser.Point();
    private static DURATION = 700;

    constructor(game: Phaser.Game, stars: Phaser.Sprite[], panel: LevelCompletePanel) {
        super(game, game.world, 'sapphireFlight');
        this.fixedToCamera = true;
        this.panel = panel;
        this.startedAt = game.time.now;
        // Keep identical textures adjacent for GPU batching instead of
        // alternating a glow and an atlas texture for every flying star.
        const glows = new Phaser.Group(game, this, 'flightGlows');
        const icons = new Phaser.Group(game, this, 'flightIcons');
        const particles = new Phaser.Group(game, this, 'flightParticles');
        // A fixed pool bounds the cost even on very tall, densely filled levels.
        for (let i = 0; i < 56; i++) {
            const sprite = SapphireEffects.sprite(game, i < 18, 18);
            sprite.visible = false;
            particles.add(sprite);
            this.sparks.push({ sprite: sprite, age: 1, life: 0, vx: 0, vy: 0, size: 18 });
        }
        const interval = Math.min(45, 420 / Math.max(1, stars.length - 1));
        stars.forEach((star, index) => {
            if (!star || star.pendingDestroy || !star.parent) {
                // A late board animation may already have removed a cover.
                // Credit its reward without leaving the Continue button locked.
                panel.receiveSapphireStar();
                return;
            }
            star.updateTransform();
            const transform = star.worldTransform;
            // World transform already includes the camera. Keep both position
            // and inherited scale when moving a cell icon into the UI overlay.
            const x = transform.tx;
            const y = transform.ty;
            const scaleX = Math.sqrt(transform.a * transform.a + transform.b * transform.b);
            const scaleY = Math.sqrt(transform.c * transform.c + transform.d * transform.d);
            const glow = SapphireEffects.sprite(game, false, 104);
            glow.alpha = 0;
            glows.add(glow);
            star.fixedToCamera = false;
            icons.add(star);
            star.position.set(x, y);
            star.scale.set(scaleX, scaleY);
            this.flights.push({ star: star, glow: glow, x: x, y: y,
                scaleX: scaleX, scaleY: scaleY, delay: index * interval, done: false });
        });
    }

    public update(): void {
        // Drive the flight curve from Phaser's absolute clock. Accumulating a
        // clamped frame delta makes the animation run slow whenever a device
        // misses frames, even though the intended flight duration is fixed.
        const dt = Math.min(50, this.game.time.elapsedMS || 16.67);
        this.elapsed = Math.max(0, this.game.time.now - this.startedAt);
        this.panel.getSapphireStarTarget(this.target);
        let active = 0;
        let unfinished = 0;
        this.flights.forEach((flight, index) => {
            if (flight.done) return;
            unfinished++;
            const p = Math.max(0, Math.min(1, (this.elapsed - flight.delay) / SapphireFlight.DURATION));
            if (p <= 0) return;
            active++;
            // A lifted cubic arc joins a shared bend above the reward. A small
            // diminishing curl gives the procession a ribbon-like movement.
            const t = p * p * (3 - 2 * p);
            const u = 1 - t;
            const bendY = Math.max(100, Math.min(flight.y, this.target.y) - 200);
            const curl = Math.sin(t * Math.PI) * Math.sin(t * Math.PI * 2) * 38;
            const x = u * u * u * flight.x + 3 * u * u * t * (flight.x + 125)
                + 3 * u * t * t * (this.target.x + 190) + t * t * t * this.target.x + curl;
            const y = u * u * u * flight.y + 3 * u * u * t * bendY
                + 3 * u * t * t * (this.target.y - 155) + t * t * t * this.target.y;
            flight.star.position.set(x, y);
            const size = 1 + 0.16 * Math.sin(p * Math.PI) - 0.38 * Math.pow(p, 6);
            flight.star.scale.set(flight.scaleX * size, flight.scaleY * size);
            flight.star.angle = Math.sin(p * Math.PI * 2) * 24;
            flight.star.alpha = Math.min(1, (1 - p) * 12);
            flight.glow.position.set(x, y);
            flight.glow.alpha = Math.sin(p * Math.PI) * 0.55;
            if (p >= 1) {
                flight.done = true;
                flight.star.destroy();
                flight.glow.destroy();
                this.panel.receiveSapphireStar();
                for (let i = 0; i < 5; i++) {
                    const angle = i * Math.PI * 2 / 5 + index;
                    this.emit(this.target.x, this.target.y, Math.cos(angle) * 75, Math.sin(angle) * 75, 24);
                }
            }
        });
        // At most three trail particles per frame, regardless of cell count.
        if (active > 0 && this.elapsed - this.lastTrail >= 24) {
            this.lastTrail = this.elapsed;
            let emitted = 0;
            for (let i = 0; i < this.flights.length && emitted < 3; i++) {
                const flight = this.flights[this.trailCursor++ % this.flights.length];
                if (flight.done || this.elapsed <= flight.delay) continue;
                this.emit(flight.star.x, flight.star.y, -14, 24, 16 + emitted * 4);
                emitted++;
            }
        }
        this.sparks.forEach(spark => {
            if (spark.age >= spark.life) return;
            spark.age += dt;
            const life = Math.max(0, 1 - spark.age / spark.life);
            spark.sprite.visible = life > 0;
            spark.sprite.alpha = life * life * 0.8;
            spark.sprite.x += spark.vx * dt / 1000;
            spark.sprite.y += spark.vy * dt / 1000;
            spark.sprite.rotation += dt * 0.001;
            spark.sprite.scale.set(spark.size / 64 * (0.4 + life * 0.6));
        });
        if (!unfinished && this.finishedAt < 0) this.finishedAt = this.elapsed;
        if (this.finishedAt >= 0 && this.elapsed - this.finishedAt > 550) this.destroy(true);
    }

    private emit(x: number, y: number, vx: number, vy: number, size: number): void {
        const spark = this.sparks[this.sparkCursor++ % this.sparks.length];
        spark.age = 0;
        spark.life = 480;
        spark.vx = vx;
        spark.vy = vy;
        spark.size = size;
        spark.sprite.position.set(x, y);
        spark.sprite.visible = true;
        spark.sprite.alpha = 0.8;
    }
}
