import AnimationUtils from '../../../core/utils/AnimationUtils';
import Utils from '../../../core/utils/Utils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Label from '../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class DiaryRecipeLayout extends BasePanel {

    constructor(game: Phaser.Game, recipeContent: DiaryContentType, x: number, y: number, animationsDelay?: number) {
        super(game, x, y, "diaryLayout", "blank");

        let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        Utils.applyPreset(bg, { "spriteId": "", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        bg.anchor.set(0.5);
        this.addSprite(bg);

        this.inputEnabled = true;

        let title = new Label(game, 0, 0, recipeContent.title, Label.TASK_TITLE_STYLE);
        title.name = "title";
        title.lineSpacing = -15;
        Utils.applyPreset(title, { "spriteId": "title", "x": 510 - 480, "y": 130 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 53 })
        this.addSprite(title);

        let details = new Label(game, 0, 100, recipeContent.details, Label.TASK_STYLE);
        details.name = "details";
        Utils.applyPreset(details, { "spriteId": "details", "x": 516 - 480, "y": 228 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 })
        this.addSprite(details);


        let magicCenter = new Phaser.Point(510 - 480, 630 - 512);
        let corner = new Phaser.Point(magicCenter.x - 135, magicCenter.y - 200);

        let positions = [];
        if (recipeContent.requiredItems.length == 3) {
            positions.push(new Phaser.Point(150, 35), new Phaser.Point(-20, 300-17), new Phaser.Point(290, 310))
        } else if (recipeContent.requiredItems.length == 4) {
            positions.push(new Phaser.Point(70, 126), new Phaser.Point(260, 75), new Phaser.Point(300, 280), new Phaser.Point(85, 350))
        }
        positions.forEach(p => { p.x += corner.x; p.y += corner.y; });

        let flow = SpriteUtils.createSprite(this.game, magicCenter.x, magicCenter.y, "circleFlow");
        flow.anchor.set(0.5);
        game.add.tween(flow).to({ angle: 360 }, 12000, Phaser.Easing.Linear.None, true, animationsDelay || 0, 100000, false)
        this.addSprite(flow);

        let sign = SpriteUtils.createSprite(this.game, magicCenter.x, magicCenter.y, "circleSign");
        sign.anchor.set(0.5);
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

        this.game.time.events.add(animationsDelay || 0, () => {
            positions.forEach(p => {
                this.createParticles(p.x, p.y);
            })
        })

        positions.forEach((p, i) => {
            let ingredientBg = SpriteUtils.createSprite(this.game, p.x, p.y, "ingredientBg");
            ingredientBg.anchor.set(0.5);
            this.addSprite(ingredientBg);

            let item = SpriteUtils.createSprite(this.game, -10, -10, recipeContent.requiredItems[i].name)
            item.anchor.set(0.5)
            // item.scale.set(130 / 80);
            ingredientBg.addChild(item);

            // let count = new Label(this.game, 40, 10, "" + recipeContent.requiredItems[i].count, { font: "40px Arial", fill: "#571044" })
            let count = new Label(this.game, 40, 10, "" + recipeContent.requiredItems[i].count, { font: "bold 40px Bookman Old Style", fill: "#571044" })
            ingredientBg.addChild(count);
            count.anchor.set(0.8, 0)
            count.x += 10;

            let k = 1;
            if (i == 1) {
                k = -0.7;
            } else if (i == 2) {
                k = 0.5;
            } else if (i == 3) {
                k = -0.85;
            }

            game.add.tween(ingredientBg).to({ angle: [20 * k, -5 * k, 10 * k, -20 * k, 0, -20 * k, 10 * k, -5 * k, 20 * k, 0 * k] }, 3 * 15000 * Math.abs(k), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
            game.add.tween(ingredientBg).to({ x: [p.x + 30 * k, p.x + 5 * k, p.x - 15 * k, p.x, p.x - 15 * k, p.x + 5 * k, p.x + 30 * k, p.x], y: [p.y + 20 * k, p.y + 30 * k, p.y + 15 * k, p.y, p.y + 15 * k, p.y + 30 * k, p.y + 20 * k, p.y] }, 3 * 20000 * Math.abs(k), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)

            ingredientBg.scale.set(0.83, 0.83)
        })
    }

    private createParticles(x: number, y: number): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        let emitter = this.game.add.emitter(x, y);
        this.addChild(emitter);

        emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "dustBlue").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "dustBlue").frameName);
        emitter.gravity = new Phaser.Point(0, 0);
        // emitter.gravity = 0;

        emitter.maxParticleScale = 0.5;
        emitter.minParticleScale = 0.2;
        emitter.maxRotation = 0;
        emitter.minRotation = 0;
        emitter.maxParticleSpeed = new Phaser.Point(15, 15);
        emitter.minParticleSpeed = new Phaser.Point(-15, -15);
        emitter.setAlpha(1, 0, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false);
        emitter.autoAlpha = true;
        emitter.width = 170;
        emitter.height = 170;

        emitter.start(false, 2000, 100)
    }

}