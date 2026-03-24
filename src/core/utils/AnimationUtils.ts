import Utils from './Utils';
import { Easing } from 'phaser-ce';
import SpriteUtils from './SpriteUtils';
import Settings from '../service/Settings';

type FadeTarget = PIXI.Sprite | Phaser.Group | Phaser.Graphics | Phaser.BitmapText | Phaser.Text;
type TintedTarget = PIXI.Sprite | Phaser.BitmapText | Phaser.Text;

export default class AnimationUtils {

    private static primeForStableShow(target: FadeTarget): void {
        if (!target) {
            return;
        }

        const targetAny = target as any;
        const wasVisible = target.visible;
        target.visible = true;

        if (typeof targetAny.updateTransform === 'function') {
            targetAny.updateTransform();
        }

        target.visible = wasVisible;
    }

    public static fadeInStable(game: Phaser.Game, sprite: FadeTarget, delay?: number, time?: number, finalAlpha?: number): void {
        if (!sprite) {
            return;
        }

        const spriteAny = sprite as any;
        const showDelay = delay == null ? 1 : delay;
        const targetAlpha = finalAlpha == null ? 1 : finalAlpha;

        this.primeForStableShow(sprite);
        sprite.visible = false;
        sprite.alpha = 0;

        game.time.events.add(showDelay, () => {
            if (spriteAny.pendingDestroy || spriteAny.exists === false) {
                return;
            }

            sprite.visible = true;
            sprite.alpha = 0;
            game.add.tween(sprite).to({ alpha: targetAlpha }, time || 20, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Linear.None, true, 0, 0, false);
        });
    }

    public static tint(game: Phaser.Game, sprite: TintedTarget, startColor: number, endColor: number, time: number, delay: number) {
        var colorBlend = { step: 0 };
        var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time);
        colorTween.onUpdateCallback(function () {
            sprite.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step, 1);
        });
        game.time.events.add(delay, () => {
            sprite.tint = startColor;
            colorTween.start();
        })
    }

    public static explodeViolet(game: Phaser.Game, x: number, y: number, delay?: number, speedMultiplier?: number) {
        game.time.events.add(delay || 0, () => {
            let lifetime = 1000;
            game.physics.startSystem(Phaser.Physics.ARCADE);
            let emitter = game.add.emitter(x, y, 30);

            // emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").frameName);
            emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(game, "dustViolet").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, "dustViolet").frameName);
            emitter.gravity = new Phaser.Point(0, 0);
            emitter.maxRotation = 100;
            emitter.minRotation = -100;
            let k = 150 * (speedMultiplier || 1);
            emitter.maxParticleSpeed = new Phaser.Point(k, k);
            emitter.minParticleSpeed = new Phaser.Point(-k, -k);
            emitter.setAlpha(0.1, 0, lifetime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, false);
            // emitter.alpha = 0.5;
            emitter.minParticleScale = 1;
            emitter.maxParticleScale = 3;
            // emitter.setScale(0.5, 1, 0.5, 1, lifetime, Phaser.Easing.Quadratic.In, false)
            // emitter.autoAlpha = true;
            emitter.width = 20;
            emitter.height = 20;

            emitter.start(true, lifetime, 50, 30, false);
        })
    }

    public static floating(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean, durationMultiplier?: number): void {
        let w = sprite.width;
        let h = sprite.height;
        let tk = 1.5 * (durationMultiplier || 1);
        game.add.tween(sprite).to({ width: [w * 1.05, w] }, 2000 * tk, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        game.add.tween(sprite).to({ height: [h * 1.05, h] }, 3000 * tk, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        game.add.tween(sprite).to({ angle: [5, 0] }, 4000 * tk, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
    }
    public static floating2(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): void {
        let w = sprite.width;
        let h = sprite.height;
        game.add.tween(sprite).to({ width: [w * 1.2, w] }, 2000, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        game.add.tween(sprite).to({ height: [h * 1.2, h] }, 3000, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        game.add.tween(sprite).to({ angle: [10, 0] }, 4000, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
    }
    public static floating3(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number): void {
        let sx = sprite.scale.x;
        let sy = sprite.scale.y;
        game.add.tween(sprite.scale).to({ x: [1.05*sx, 1*sx] }, 2000 , Phaser.Easing.Linear.None, true, delay || 0, 100000, false)
        game.add.tween(sprite.scale).to({ y: [1.05*sy, 1*sy] }, 3000, Phaser.Easing.Linear.None, true, delay || 0, 100000, false)
        game.add.tween(sprite).to({ angle: [5, 0] }, 4000, Phaser.Easing.Linear.None, true, delay || 0, 100000, false)
    }

    public static heartBeat(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        return game.add.tween(sprite).to({ width: [w * 1.025, w * 1.05, w * 1.1, w, w], height: [h * 1.025, h * 1.05, h * 1.1, h, h] }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, delay || 0, oneTime ? 0 : 100000, false)
    }
    public static heartBeat4(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let sx = sprite.scale.x;
        let sy = sprite.scale.y;
        return game.add.tween(sprite.scale).to({ x: [sx * 1.025, sx * 1.05, sx * 1.1, sx, sx], y: [sy * 1.025, sy * 1.05, sy * 1.1, sy, sy] }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, oneTime ? 0 : 100000, false)
    }

    public static heartBeat2(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        // return game.add.tween(sprite).to( {width: [w * 1.025 * 1.2, w * 1.05* 1.2, w*1.1* 1.2, w* 1.05* 1.2, w* 1.025 * 1.2, w], height: [h * 1.025* 1.2, h * 1.05* 1.2, h*1.1* 1.2, h* 1.05* 1.2, h* 1.025* 1.2, h]  }, 4000, Phaser.Easing.Linear.None, true, delay || 0, oneTime? 0 : 100000, false  )
        return game.add.tween(sprite).to({ width: [w * 1.2, w], height: [h * 1.2, h] }, 4000, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
    }

    public static heartBeat3(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        // return game.add.tween(sprite).to( {width: [w * 1.025 * 1.2, w * 1.05* 1.2, w*1.1* 1.2, w* 1.05* 1.2, w* 1.025 * 1.2, w], height: [h * 1.025* 1.2, h * 1.05* 1.2, h*1.1* 1.2, h* 1.05* 1.2, h* 1.025* 1.2, h]  }, 4000, Phaser.Easing.Linear.None, true, delay || 0, oneTime? 0 : 100000, false  )
        return game.add.tween(sprite).to({ width: [w * 1.03, w], height: [h * 1.03, h] }, 4000, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
    }


    public static emphasize(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        return game.add.tween(sprite).to({ width: [w * 1.3, w], height: [h * 1.3, h] }, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay || 0, 0, false)
    }
    public static wiggle(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        return game.add.tween(sprite).to({ width: [w * 1.1, w * 1.05, w * 1.1, w, w, w, w, w, w, w, w, w,], height: [h * 1.1, h * 1.05, h * 1.1, h, h, h, h, h, h, h, h, h,] }, 2000, Phaser.Easing.Sinusoidal.In, true, delay || 0, oneTime ? 0 : 100000, false)
    }

    public static wiggle4(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let sx = sprite.scale.x;
        let sy = sprite.scale.y;
        return game.add.tween(sprite.scale).to({ x: [sx * 1.1, sx * 1.05, sx * 1.1, sx, sx, sx, sx, sx, sx, sx, sx, sx,], y: [sy * 1.1, sy * 1.05, sy * 1.1, sy, sy, sy, sy, sy, sy, sy, sy, sy,] }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, oneTime ? 0 : 100000, false)
    }

    public static wiggle2(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        let d = 0.04;
        let tween = game.add.tween(sprite).to({
            width: [w * (1 + d * 4), w * (1 + d * 2), w * (1 + d * 4), w],
            height: [h * (1 + d * 2.5), h * (1 + d * 1.25), h * (1 + d * 2.5), h]
        }, 1200, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        tween.repeatDelay(3000);

        let k = 0.25;
        let p = sprite;
        let ang = (<Phaser.Sprite>sprite).angle;
        game.add.tween(sprite).to({ angle: [ang + 20 * k, ang - 5 * k, ang + 10 * k, ang - 20 * k, ang, ang - 20 * k, ang + 10 * k, ang - 5 * k, ang + 20 * k, ang + 0 * k] }, 3 * 30000 * Math.abs(k), Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        // game.add.tween(sprite).to({ x: [p.x + 30 * k, p.x + 5 * k, p.x - 15 * k, p.x, p.x - 15 * k, p.x + 5 * k, p.x + 30 * k, p.x], y: [p.y + 20 * k, p.y + 30 * k, p.y + 15 * k, p.y, p.y + 15 * k, p.y + 30 * k, p.y + 20 * k, p.y] }, 3 * 40000 * Math.abs(k), Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)

        return tween;
    }

    public static wiggle3(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        let d = 0.05;
        let tween = game.add.tween(sprite).to({
            width: [w * (1 + d * 2.5), w * (1 + d * 1.25), w * (1 + d * 2.5), w],
            height: [h * (1 + d * 4), h * (1 + d * 2), h * (1 + d * 4), h],
        }, 1200, Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)
        tween.repeatDelay(1000);

        let k = 0.25;
        let p = sprite;
        let ang = (<Phaser.Sprite>sprite).angle;
        game.add.tween(sprite).to({ angle: [ang + 20 * k, ang - 5 * k, ang + 10 * k, ang - 20 * k, ang, ang - 20 * k, ang + 10 * k, ang - 5 * k, ang + 20 * k, ang + 0 * k] }, 3 * 10000 * Math.abs(k), Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false).interpolation(Phaser.Math.bezierInterpolation).start();
        // game.add.tween(sprite).to({ x: [p.x + 30 * k, p.x + 5 * k, p.x - 15 * k, p.x, p.x - 15 * k, p.x + 5 * k, p.x + 30 * k, p.x], y: [p.y + 20 * k, p.y + 30 * k, p.y + 15 * k, p.y, p.y + 15 * k, p.y + 30 * k, p.y + 20 * k, p.y] }, 3 * 40000 * Math.abs(k), Phaser.Easing.Linear.None, true, delay || 0, oneTime ? 0 : 100000, false)

        return tween;
    }

    public static jelly(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean, deltaRatio?: number): Phaser.Tween {
        let sx = sprite.scale.x;
        let sy = sprite.scale.y;
        let tween = game.add.tween(sprite.scale);

        let ratio = deltaRatio || 1;
        tween.to({ x: [(1 - 0.2 * ratio) * sx, 1 * sx, (1 + 0.1 * ratio) * sx, 1 * sx], y: [(1 + 0.2 * ratio) * sy, 1 * sy, (1 - 0.1 * ratio) * sy, 1 * sy] }, 500, Phaser.Easing.Quadratic.Out, true, delay || 0, oneTime ? 0 : -1, false);
        tween.repeatDelay(5000);
        return tween;
    }

    public static sway(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, oneTime?: boolean): Phaser.Tween {
        let tween = game.add.tween(sprite);
        tween.to({ angle: [-30, 30, 0] }, 1500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out,
            true, delay || 0, oneTime ? 0 : -1, false).interpolation(Phaser.Math.bezierInterpolation).start();
        tween.repeatDelay(5000);
        return tween;
    }

    public static appear(game: Phaser.Game, sprite: PIXI.Sprite | Phaser.Group | Phaser.BitmapText | Phaser.Text, delay?: number): Phaser.Tween {
        if (sprite) {
            let w = sprite.width;
            let h = sprite.height;
            sprite.width = 0;
            sprite.height = 0;
            return game.add.tween(sprite).to({ width: [w * 1.1, w * 1.05, w * 1.1, w], height: [h * 1.1, h * 1.05, h * 1.1, h] }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.Out, true, delay || 0, 0, false)
        }
    }
    public static appear3(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number): Phaser.Tween {
        if (sprite) {
            let sx = sprite.scale.x;
            let sy = sprite.scale.y;
            sprite.scale.x = 0;
            sprite.scale.y = 0;
            return game.add.tween(sprite.scale).to({ x: [sx * 1.1, sx * 1.05, sx * 1.1, sx], y: [sy * 1.1, sy * 1.05, sy * 1.1, sy] }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.Out, true, delay || 0, 0, false)
        }
    }

    public static moveFrom(game: Phaser.Game, sprite: PIXI.Sprite, dx: number, dy: number, delay?: number) {
        let x0 = sprite.x;
        let y0 = sprite.y;
        sprite.x += dx;
        sprite.y += dy;
        game.add.tween(sprite).to({ x: x0, y: y0 }, 300, Phaser.Easing.Linear.None, true, delay || 0, 0, false)
    }

    public static appear2(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number, durationMultiplier?:number, finalAlpha?:number, finalScale?:number) {
        if (sprite) {
            let w = sprite.width;
            let h = sprite.height;
            sprite.width = w * 0.8;
            sprite.height = h * 0.8;
            sprite.alpha = 0;
            finalScale = finalScale || 1;
            game.add.tween(sprite).to({ width: [w * 1.05 * finalScale, w * finalScale], height: [h * 1.05 * finalScale, h * finalScale] }, 300 * (durationMultiplier || 1), Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Linear.None, true, delay || 0, 0, false)
            game.add.tween(sprite).to({ alpha: finalAlpha || 1 }, 300 * (durationMultiplier || 1), Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, delay || 0, 0, false)
        }
    }

    public static jump(game: Phaser.Game, sprite: Phaser.Sprite, delay?: number) {
        let sx = sprite.scale.x;
        let sy = sprite.scale.y;
        game.add.tween(sprite.scale).to({ x: [sx * 0.8, sx * 1, sx * 1.2, sx * 1], y: [sy * 1.2, sy * 1, sy * 0.8, sy * 1] }, 800, Phaser.Easing.Linear.None, true, delay || 0, -1, false)
    }

    public static blinking(game: Phaser.Game, sprite: TintedTarget, delay?: number): Phaser.Tween {
        sprite.alpha = 0;
        return game.add.tween(sprite).to({ alpha: 1 }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.Out, true, delay || 0, 1000000, true)
    }

    public static disappear(game: Phaser.Game, sprite: PIXI.Sprite | Phaser.Group | Phaser.BitmapText | Phaser.Text, delay?: number): Phaser.Tween {
        let w = sprite.width;
        let h = sprite.height;
        // return game.add.tween(sprite).to( {width: [w * 1.1, w * 1.05, w*1.1, 0], height: [h * 1.1, h * 1.05, h*1.1, 0]  }, 500, Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false  )
        return game.add.tween(sprite).to({ width: [0], height: [0], alpha: [0] }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false)
    }

    public static fadeOut(game: Phaser.Game, sprite: FadeTarget, delay?: number, time?:number): Phaser.Tween {
        return game.add.tween(sprite).to({ alpha: 0 }, time || 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false)
    }
    public static fadeOut2(game: Phaser.Game, sprite: PIXI.Sprite, delay?: number): Phaser.Tween {
        return game.add.tween(sprite).to({ alpha: 0 }, 600, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false)
    }
    public static fadeIn(game: Phaser.Game, sprite: PIXI.Sprite | Phaser.Group | Phaser.BitmapText | Phaser.Text, delay?: number, time?:number): Phaser.Tween {
        sprite.alpha = 0;
        return game.add.tween(sprite).to({ alpha: 1 }, time || 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.Out, true, delay || 0, 0, false)
    }

    public static glint(game: Phaser.Game, parent: Phaser.Sprite, x: number, y: number, delay?:number, scale?:number): Phaser.Sprite {
        let glint = SpriteUtils.createSprite(game, x, y, "glint");
        parent.addChild(glint);

        let w = 100 * (scale || 1);
        let h = 100 * (scale || 1);
        glint.width = 0;
        glint.height = 0;
        glint.anchor = new Phaser.Point(0.5, 0.5);
        game.time.events.add(delay || 10, () => {
            game.add.tween(glint).to({ width: [w, 0, 0, 0, 0, 0, 0], height: [h, 0, 0, 0, 0, 0, 0] }, 3000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 1000000000, false);
        })
        return glint;
    }

    public static boatFloating(game: Phaser.Game, boat: Phaser.Sprite, delay?:number):void{
        game.add.tween(boat).to({angle:[10, 5, 0, -3, 0]}, 4500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quartic.InOut, true, delay, -1);
        game.add.tween(boat).to({ y:[boat.y-7, boat.y]}, 4500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quartic.InOut, true, delay, -1);
    }

    public static coinsBurst(game: Phaser.Game, x: number, y: number, delay) {
        let deltas = [new Phaser.Point(0, 0), new Phaser.Point(-30, -20), new Phaser.Point(-10, -30), new Phaser.Point(-23, -6),
        new Phaser.Point(27, 22), new Phaser.Point(0, 11), new Phaser.Point(-12, 17), new Phaser.Point(-35, 19),]

        console.log("COINS BURST AT: ", x, y)

        deltas.forEach(delta => {
            let coin = SpriteUtils.createSprite(game, x, y, "coinRotation");
            coin.animations.add('rotation', [0, 1, 2, 3, 4, 5, 6], 20, true);
            coin.animations.play('rotation');
            coin.scale = new Phaser.Point(1.5, 1.5)
            coin.anchor = new Phaser.Point(0.5, 0.5)
            coin.alpha = 0;
            game.add.tween(coin).to({ x: x + delta.x * 2, y: y + delta.y * 2, alpha: 1 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay, 0, false);
            coin.x = x + delta.x * 2;
            coin.y = y + delta.y * 2;
            game.add.tween(coin).to({ x: 960 + 50 + delta.x * 0, y: -50 + delta.y * 0 }, 800, Phaser.Easing.Linear.None, true, delay + 500, 0, false);
            // game.add.tween(coin).to( { alpha:0,}, 100, Phaser.Easing.Exponential.Out, true, delay + 500 + 400, 0, false );
            coin.x = x;
            coin.y = y;
            game.add.existing(coin);
        })
    }

    public static petalsBurst(game: Phaser.Game, x: number, y: number, images: string[], delay?: number, durationMultiplier?: number) {
        let image = images[0];
        let additionalImage = images.length > 1 ? images[1] : null;

        let startAngle = Utils.random(180);

        let scaleMultiplier = images[0].startsWith("snowflake")? 1.5 : 1;

        for (let i = 0; i < 5; i++) {
            let petalImage = i % 2 == 1 && additionalImage ? additionalImage : image;
            let petal = SpriteUtils.createSprite(game, x, y, petalImage);
            petal.angle = startAngle + 72 * i;
            petal.alpha = 0.75 + 0.5 * Math.random();
            petal.scale.set(scaleMultiplier * (0.2 + 0.5 * Math.random()));

            petal.anchor.set(0.5)
            game.add.existing(petal);
            let localDelay = Utils.random(300);
            let r = 40;
            let duration = (400 + localDelay) * (durationMultiplier || 1);
            game.add.tween(petal).to({ x: petal.x + Math.cos(petal.rotation) * r * scaleMultiplier, y: petal.y + Math.sin(petal.rotation) * r *scaleMultiplier }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false);
            game.add.tween(petal).to({ alpha: [1, 1, 0] }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false);
            game.add.tween(petal).to({ angle: petal.angle + Utils.random(180) }, duration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay || 0, 0, false);
        }
    }

    public static highlight(game: Phaser.Game, x: number, y: number, image: string, delay?: number, scaleMultiplier?: number, duration?: number) {
        let splash = SpriteUtils.createSprite(game, x, y, image);
        splash.angle = Utils.random(360);
        splash.alpha = 0;
        splash.scale.set(0.5);
        splash.anchor.set(0.5)
        splash.visible = false;
        game.add.existing(splash);
        this.primeForStableShow(splash);

        const startDelay = delay || 0;
        const totalDuration = duration || 400;
        const fadeInTime = Math.min(20, totalDuration);
        const fadeOutTime = Math.max(0, totalDuration - fadeInTime);

        game.time.events.add(startDelay, () => {
            if ((splash as any).pendingDestroy || splash.exists === false) {
                return;
            }

            splash.visible = true;
            splash.alpha = 0;
            game.add.tween(splash).to({ alpha: 0.7 }, fadeInTime, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Linear.None, true, 0, 0, false);
            if (fadeOutTime > 0) {
                game.add.tween(splash).to({ alpha: 0 }, fadeOutTime, Phaser.Easing.Sinusoidal.In, true, fadeInTime, 0, false);
            }
            game.add.tween(splash.scale).to({ x: [1.2 * (scaleMultiplier || 1)], y: [1.2 * (scaleMultiplier || 1)] }, totalDuration, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
        });
    }

    public static highlightCompass(game: Phaser.Game, x: number, y: number, image: string, delay?: number, scaleMultiplier?: number, fadeOutTime?: number) {
        let splash = SpriteUtils.createSprite(game, x, y, image);
        splash.angle = Utils.random(360);
        splash.alpha = 0;
        splash.scale.set(0.5);
        splash.anchor.set(0.5)
        splash.visible = false;
        game.add.existing(splash);
        this.primeForStableShow(splash);

        const startDelay = delay || 0;
        game.time.events.add(startDelay, () => {
            if ((splash as any).pendingDestroy || splash.exists === false) {
                return;
            }

            splash.visible = true;
            splash.alpha = 0;
            game.add.tween(splash).to({ alpha: 1 }, 20, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Linear.None, true, 0, 0, false);
            game.add.tween(splash).to({ alpha: 0 }, fadeOutTime || 0, Phaser.Easing.Sinusoidal.Out, true, 200, 0, false);
            game.add.tween(splash.scale).to({ x: [1.2 * (scaleMultiplier || 1)], y: [1.2 * (scaleMultiplier || 1)] }, 400, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
        });
    }


    public static gemsBurst(game: Phaser.Game, x: number, y: number, delay) {
        let deltas = [new Phaser.Point(0, 0), new Phaser.Point(-30, -20), new Phaser.Point(-10, -30), new Phaser.Point(-23, -6),
        new Phaser.Point(27, 22), new Phaser.Point(0, 11), new Phaser.Point(-12, 17), new Phaser.Point(-35, 19),]

        console.log("COINS BURST AT: ", x, y)

        deltas.forEach(delta => {
            let gems = SpriteUtils.createSprite(game, x, y, "gems");
            gems.scale = new Phaser.Point(0.8/ 1.5, 0.8/ 1.5)
            gems.anchor = new Phaser.Point(0.5, 0.5)
            gems.alpha = 0;
            game.add.tween(gems).to({ x: x + delta.x * 2, y: y + delta.y * 2, alpha: 1, rotation: delta.x > 0 ? 0.5 : -0.5 }, 300, Phaser.Easing.Sinusoidal.In, true, delay, 0, false);
            gems.x = x + delta.x * 2;
            gems.y = y + delta.y * 2;
            game.add.tween(gems).to({ x: 960 + 50 + delta.x * 0, y: -50 + delta.y * 0, rotation: 0 }, 800, Phaser.Easing.Linear.None, true, delay + 500, 0, false);
            // game.add.tween(coin).to( { alpha:0,}, 100, Phaser.Easing.Exponential.Out, true, delay + 500 + 400, 0, false );
            gems.x = x;
            gems.y = y;
            game.add.existing(gems);
        })
    }

    public static rocketBurst(game: Phaser.Game, x: number, y: number): Phaser.Particles.Arcade.Emitter {
        let emitter = game.add.emitter(x, y, 100);
        emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow2").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow2").frameName);
        // emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, "dustYellow").frameName);
        emitter.gravity = new Phaser.Point(0, 0);
        emitter.maxRotation = 100;
        emitter.minRotation = -100;
        // emitter.maxParticleSpeed = new Phaser.Point(-150, -100);
        // emitter.minParticleSpeed = new Phaser.Point(-200, 100);
        emitter.maxParticleSpeed = new Phaser.Point(-100, -100);
        emitter.minParticleSpeed = new Phaser.Point(100, 100);
        emitter.setAlpha(1, 0, 300,Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, false);
        emitter.alpha = 0.9;
        emitter.maxParticleScale = 2;
        emitter.minParticleScale = 0.5;
        emitter.width = 20;
        emitter.height = 20;
        emitter.start(false, 300, 10, 100, false);
        return emitter;
    }

    public static heartsBurst(game: Phaser.Game, x: number, y: number, delay?:number, sprite?:string):void{
        let hearts: {scale:number, dx:number, delay:number, way:{ x:number, y:number}[]}[] = 
        [
        {scale:1, dx:0, delay:0, way:[{x:-100, y: -100/1.5}, {x:+ 60, y: -200/1.5}, {x:-80, y: -300/1.5}, {x:+90, y: -400/1.5}]},
        {scale:0.5, dx:-50, delay:150, way:[{x:100, y: -100}, {x:- 60, y: -200}, {x:80, y: -300}, {x:-90, y: -400}]},
        {scale:0.7, dx:-50, delay:300, way:[{x:-100, y: -70}, {x:+ 60, y: -140}, {x:-80, y: -210}, {x:+90, y: -280}]},
        {scale:1, dx:-70, delay:450, way:[{x:100, y: -100/1.2}, {x: 0, y: -200/1.2}, {x:80, y: -300/1.2}, {x:-10, y: -400/1.2}]},
        {scale:0.5, dx:150, delay:600, way:[{x:-100, y: -100}, {x:+ 60, y: -200}, {x:-80, y: -300}, {x:+90, y: -400}]}
        ];


        hearts.forEach(h => {
            game.time.events.add(h.delay + (delay || 0), () => {
                let heart = SpriteUtils.createSprite(game, x + h.dx, y, sprite || "replicaHeart");
                heart.alpha = 0;
                game.add.existing(heart);

                let animationTime = 1500; 
                heart.scale.set(h.scale);

                game.add.tween(heart).to({alpha:1}, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 0);
                game.add.tween(heart.scale).to({x: h.scale, y: h.scale}, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 0);

                // AnimationUtils.appear(game, heart);
                AnimationUtils.jelly(game, heart);
                // game.add.tween(heart.scale).to({x: h.scale, y: h.scale}, 500, Easing.Quadratic.Out, true, 0);
                
                game.add.tween(heart).to({x: h.way.map(p => p.x + h.dx + x + (Utils.random(50) - 25)), y: h.way.map(p => p.y/1.5 + y + (Utils.random(50) - 25))
                }, animationTime, Easing.Linear.None, true, 0).interpolation(Phaser.Math.bezierInterpolation).start();

                heart.alpha = 1;
                game.add.tween(heart).to({alpha:0}, 300,Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Easing.Quadratic.Out, true, animationTime - 300);
                heart.alpha = 0;
            })
        })
    }

    public static frameByFrameAnimation(game:Phaser.Game, sprite:Phaser.Sprite, frames:string[], frameRate:number, loop:boolean, killOnComplete:boolean):void{
        let i = 0;
        
        sprite.loadTexture(SpriteUtils.key(frames[i]), SpriteUtils.frame(frames[i]));
        let loopEvent = game.time.events.loop(1000/frameRate, ()=>{
            i++
            if( i>= frames.length){
                if(loop){
                    i = 0;
                } else {
                    loopEvent.timer.remove(loopEvent);
                    if(killOnComplete){
                        sprite.kill();
                    }
                    return;
                }
            }

            sprite.loadTexture(SpriteUtils.key(frames[i]), SpriteUtils.frame(frames[i]));
        })
    }

    public static levitate(game: Phaser.Game, sprite:Phaser.Sprite){
        game.add.tween(sprite).to({y: sprite.y - 12, x: sprite.x}, 1000,Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Easing.Sinusoidal.InOut, true, 0, -1, true)
    }
}


