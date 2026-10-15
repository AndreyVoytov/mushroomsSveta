import SpriteUtils from '../../../core/utils/SpriteUtils';
import AnimationUtils from '../../../core/utils/AnimationUtils';

type Spark = {
    sprite: Phaser.Sprite; age: number; life: number; side: number;
    x: number; y: number; width: number; height: number; phase: number; size: number;
};

/** A bounded pool of gold sparks climbing offset, rounded stair paths. */
export default class SnailSpinEffects extends Phaser.Group {
    public static readonly PARTICLE_IMAGE = 'p1';
    private source: Phaser.Sprite;
    private sparks: Spark[] = [];
    private age = 0;
    private nextEmission = 0;

    constructor(game: Phaser.Game, source: Phaser.Sprite) {
        super(game, game.world, 'snailSpinEffects');
        this.source = source;
        for (let i = 0; i < 28; i++) {
            const sprite = SpriteUtils.createSprite(game, 0, 0, SnailSpinEffects.PARTICLE_IMAGE);
            sprite.anchor.set(0.5);
            sprite.inputEnabled = false;
            sprite.visible = false;
            this.add(sprite);
            this.sparks.push({sprite, age:0, life:0, side:1, x:0, y:0,
                width:0, height:0, phase:0, size:0});
        }
    }

    private emit(side: number): void {
        const spark = this.sparks.filter(p => !p.sprite.visible)[0];
        if (!spark) return;
        spark.age = 0;
        spark.life = 1000 + Math.random() * 400;
        spark.side = side;
        spark.x = this.source.x + side * (8 + Math.random() * 14);
        spark.y = this.source.y + 8 + Math.random() * 16;
        spark.width = 60 + Math.random() * 70;
        spark.height = 95 + Math.random() * 65;
        spark.phase = Math.random() * Math.PI;
        spark.size = 18 + Math.random() * 12;
        spark.sprite.position.set(spark.x, spark.y);
        spark.sprite.width = spark.sprite.height = spark.size;
        spark.sprite.alpha = 0;
        AnimationUtils.primeForShow(spark.sprite);
        spark.sprite.visible = true;
    }

    public update(): void {
        const dt = Math.min(50, this.game.time.elapsedMS || 16.67);
        this.age += dt;
        const emitting = this.source && this.source.exists && this.source.visible && this.age < 3000;
        if (emitting && this.age >= this.nextEmission) {
            this.emit(-1); this.emit(1);
            this.nextEmission = this.age + 110;
        }
        let active = false;
        this.sparks.forEach(p => {
            if (!p.sprite.visible) return;
            p.age += dt;
            const t = Math.min(1, p.age / p.life);
            // Alternating horizontal/vertical speed rounds each stair corner.
            // Vary phase and scale independently for every particle.
            const bend = (Math.sin(t * 6 * Math.PI + p.phase) - Math.sin(p.phase)) / (6 * Math.PI);
            p.sprite.x = p.x + p.side * p.width * (t + bend);
            p.sprite.y = p.y - p.height * (t - bend);
            p.sprite.angle = p.side * t * 110;
            p.sprite.alpha = Math.min(1, t / 0.12) * Math.pow(1 - t, 0.7) * 0.9;
            if (t >= 1) p.sprite.visible = false;
            else active = true;
        });
        if (!emitting && !active) this.destroy(true);
    }
}
