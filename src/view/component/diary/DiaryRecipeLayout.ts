import AnimationUtils from '../../../core/utils/AnimationUtils';
import Utils from '../../../core/utils/Utils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Label from '../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
import UiLayout from '../../../core/utils/UiLayout';
export default class DiaryRecipeLayout extends BasePanel {
    private particlesEvent: Phaser.TimerEvent;
    private particleEmitters: Phaser.Particles.Arcade.Emitter[] = [];

    constructor(game: Phaser.Game, recipeContent: DiaryContentType, x: number, y: number, animationsDelay?: number, showParticles: boolean = true) {
        super(game, x, y, "diaryLayout", "blank");

        let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        bg.name = "pageBg";
        Utils.applyPreset(bg, { "spriteId": "", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        bg.anchor.set(0.5);
        this.addSprite(bg);

        this.inputEnabled = true;

        const titleText = LocalizationService.get(recipeContent.title);
        const detailsText = LocalizationService.get(recipeContent.details);

        let title = new Label(game, 0, 0, titleText, Label.TASK_TITLE_STYLE);
        title.name = "title";
        title.lineSpacing = -15;
        Utils.applyPreset(title, { "spriteId": "title", "x": 510 - 480, "y": 130 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 53 })
        this.addSprite(title);
        title.fontSize = 46;title.lineGap = -6;UiLayout.fit(title, 590, 88, true);

        let details = new Label(game, 0, 100, detailsText, Label.TASK_STYLE);
        details.name = "details";
        Utils.applyPreset(details, { "spriteId": "details", "x": 516 - 480, "y": 228 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 })
        this.addSprite(details);
        details.anchor.set(0.5);details.position.set(30, -265);details.fontSize = 34;
        details.lineGap = -6;UiLayout.fit(details, 590, 112, true);


        let magicCenter = new Phaser.Point(510 - 480, 630 - 512);
        let corner = new Phaser.Point(magicCenter.x - 135, magicCenter.y - 200);

        let positions = [];
        if (recipeContent.requiredItems.length == 3) {
            positions.push(new Phaser.Point(150, 35), new Phaser.Point(-20, 300-17), new Phaser.Point(290, 310))
        } else if (recipeContent.requiredItems.length == 4) {
            positions.push(new Phaser.Point(70, 126), new Phaser.Point(260, 75), new Phaser.Point(300, 280), new Phaser.Point(85, 350))
        } else {
            recipeContent.requiredItems.forEach((item, i) => {
                const angle = -Math.PI / 2 + i * Math.PI * 2 / recipeContent.requiredItems.length;
                positions.push(new Phaser.Point(135 + Math.cos(angle) * 170, 200 + Math.sin(angle) * 170));
            });
        }
        positions.forEach(p => { p.x += corner.x; p.y += corner.y; });

        let flow = SpriteUtils.createSprite(this.game, magicCenter.x, magicCenter.y, "circleFlow");
        flow.anchor.set(0.5);
        SpriteUtils.fitIcon(flow, 420, 420);flow.alpha = 0.24;flow.tint = 0xb6c9b5;
        game.add.tween(flow).to({ angle: 360 }, 12000, Phaser.Easing.Linear.None, true, animationsDelay || 0, 100000, false)
        this.addSprite(flow);

        let sign = SpriteUtils.createSprite(this.game, magicCenter.x, magicCenter.y, "circleSign");
        sign.anchor.set(0.5);
        SpriteUtils.fitIcon(sign, 310, 330);sign.alpha = 0.5;sign.tint = 0x947950;
        game.add.tween(sign).to({ angle: 10 }, 24000, Phaser.Easing.Linear.None, true, animationsDelay || 0, 100000, true)
        this.addSprite(sign);

        if (recipeContent.resultImage) {
            let dy = recipeContent.resultImage.startsWith("plate")? -20 : 0;

            let result = SpriteUtils.createSprite(this.game, magicCenter.x, magicCenter.y + 20 + dy, recipeContent.resultImage);
            result.anchor.set(0.5);
            
            result.scale.set(Math.min(180/result.width, 200/result.height))

            this.addSprite(result);
            AnimationUtils.heartBeat(this.game, result);
        }

        if (showParticles) {
            if (positions.length > 0) {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
            }
            this.particlesEvent = this.game.time.events.add(animationsDelay || 0, () => {
                this.particlesEvent = null;
                positions.forEach(p => {
                    this.createParticles(p.x, p.y);
                });
            });
        }

        positions.forEach((p, i) => {
            let ingredientBg = SpriteUtils.createSprite(this.game, p.x, p.y, "blank");
            ingredientBg.anchor.set(0.5);
            this.addSprite(ingredientBg);
            const aura = new Phaser.Graphics(this.game, 0, 0);
            aura.beginFill(0xfff1cf, 0.28);aura.lineStyle(1.5, 0xb49a69, 0.36);
            aura.drawCircle(0, 0, 156);aura.endFill();ingredientBg.addChild(aura);

            let item = SpriteUtils.createSprite(this.game, -10, -10, recipeContent.requiredItems[i].name)
            item.anchor.set(0.5)
            // item.scale.set(130 / 80);
            ingredientBg.addChild(item);
            // Updated item textures are 4x the original canvas size. Recipe
            // ingredients use the original 120x127 logical footprint.
            SpriteUtils.preserveItemPresetSize(item);

            // let count = new Label(this.game, 40, 10, "" + recipeContent.requiredItems[i].count, { font: "40px Arial", fill: "#571044" })
            const countBadge = new Phaser.Graphics(this.game, 48, 43);
            countBadge.beginFill(0xfff4dc, 0.9);countBadge.lineStyle(1.5, 0xb49a69, 0.55);
            countBadge.drawCircle(0, 0, 52);countBadge.endFill();ingredientBg.addChild(countBadge);
            let count = new Label(this.game, 48, 43, "" + recipeContent.requiredItems[i].count, { font: "bold 38px Arial", fill: Label.INK })
            ingredientBg.addChild(count);
            count.anchor.set(0.5);UiLayout.fit(count, 46, 40);

            let k = 1;
            if (i == 1) {
                k = -0.7;
            } else if (i == 2) {
                k = 0.5;
            } else if (i == 3) {
                k = -0.85;
            }

            game.add.tween(ingredientBg).to({ angle: [7 * k, -4 * k, 0] }, 15000 * Math.abs(k), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
            game.add.tween(ingredientBg).to({ x: [p.x + 10 * k, p.x - 8 * k, p.x], y: [p.y + 8 * k, p.y - 6 * k, p.y] }, 20000 * Math.abs(k), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)

            ingredientBg.scale.set(0.83, 0.83)
        })
    }

    private createParticles(x: number, y: number): void {
        let emitter = this.game.add.emitter(x, y, 12);
        this.particleEmitters.push(emitter);
        this.addChild(emitter);

        emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "dustBlue").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "dustBlue").frameName);
        emitter.gravity = new Phaser.Point(0, 0);
        // emitter.gravity = 0;

        emitter.maxParticleScale = 0.28;
        emitter.minParticleScale = 0.10;
        emitter.maxRotation = 0;
        emitter.minRotation = 0;
        emitter.maxParticleSpeed = new Phaser.Point(15, 15);
        emitter.minParticleSpeed = new Phaser.Point(-15, -15);
        emitter.setAlpha(0.45, 0, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false);
        emitter.autoAlpha = true;
        emitter.width = 170;
        emitter.height = 170;

        emitter.start(false, 2000, 300)
    }

    public onKill(): void {
        if (this.particlesEvent) {
            this.game.time.events.remove(this.particlesEvent);
            this.particlesEvent = null;
        }

        this.particleEmitters.forEach(emitter => {
            emitter.killAll();
            emitter.kill();
            emitter.destroy(true);
        });
        this.particleEmitters = [];
        this.stopTweensRecursively(this);
    }

    private stopTweensRecursively(target: any): void {
        if (!target) return;
        this.game.tweens.removeFrom(target);
        if (target.children) {
            target.children.slice().forEach((child: any) => this.stopTweensRecursively(child));
        }
    }

}
