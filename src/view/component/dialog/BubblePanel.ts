import BasePanel from '../../component/panel/BasePanel';
import AnimationUtils from './../../../core/utils/AnimationUtils';
export default class BubblePanel extends BasePanel {

    private point1: Phaser.Sprite;
    private point2: Phaser.Sprite;
    private cloud: Phaser.Sprite;
    private innerItem: Phaser.Sprite;

    constructor(game: Phaser.Game, x: number, y: number, innerItem: string, traceLengthMultiplier?: number) {
        super(game, x, y);

        this.cloud = this.attachSprite("cloud")
        this.innerItem = this.attachSprite(innerItem, "innerItem")
        this.point1 = this.attachSprite("point", "point1")
        this.point2 = this.attachSprite("point", "point2")

        this.alpha = 0;

        traceLengthMultiplier = traceLengthMultiplier || 1;

        this.applyPreset([{ "spriteId": "cloud", "x": -75, "y": -105 + 197, "scaleX": 1, "scaleY": 1, "anchorX": 0.2, "anchorY": 0.9, "rotation": 0 },
        { "spriteId": "innerItem", "x": 0, "y": 66, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.8, "rotation": 0.12 },
        { "spriteId": "point1", "x": -103 * (1 + (traceLengthMultiplier - 1)*3), "y": 165 * (1 + (traceLengthMultiplier - 1) ), "scaleX": 0.6399999999999998, "scaleY": 0.5999999999999996, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "point2", "x": -72 * (1 + (traceLengthMultiplier - 1)*2), "y": 140 * traceLengthMultiplier, "scaleX": 0.9, "scaleY": 0.9, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])
    }

    public show(delay?: number) {
        this.alpha = 1;

        if (this.scale.x < 0) {
            this.applyPreset([{ "spriteId": "innerItem", "x": 7, "y": 66, "scaleX": -1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.8, "rotation": 0.12 }])
        }

        delay = delay || 0;

        let appearingTime = 1100;

        AnimationUtils.floating(this.game, this.cloud, appearingTime + delay)
        AnimationUtils.floating2(this.game, this.point1, 2000 + appearingTime + delay)
        AnimationUtils.floating2(this.game, this.point2, 1000 + appearingTime + delay)
        AnimationUtils.wiggle2(this.game, this.innerItem, appearingTime + delay)

        AnimationUtils.appear2(this.game, this.point1, delay)
        AnimationUtils.appear2(this.game, this.point2, 100 + delay)
        AnimationUtils.appear2(this.game, this.cloud, 200 + delay)
        AnimationUtils.appear2(this.game, this.innerItem, 400 + delay)

        AnimationUtils.moveFrom(this.game, this.point1, -20, 40, delay)
        AnimationUtils.moveFrom(this.game, this.point2, -15, 20, 100 + delay)
        AnimationUtils.moveFrom(this.game, this.cloud, -30, 30, 150 + delay)
        AnimationUtils.moveFrom(this.game, this.innerItem, -30, 30, 150 + delay)


        this.cloud.scale.set(0);
        this.innerItem.scale.set(0);
        this.point1.scale.set(0);
        this.point2.scale.set(0);

    }
    public hide(delay?: number) {


        this.game.tweens.removeFrom(this.point1)
        this.game.tweens.removeFrom(this.point2)
        this.game.tweens.removeFrom(this.cloud)
        this.game.tweens.removeFrom(this.innerItem)
        AnimationUtils.fadeOut(this.game, this.point1, delay)
        AnimationUtils.fadeOut(this.game, this.point2, 100 + delay)
        AnimationUtils.fadeOut(this.game, this.cloud, 200 + delay)
        AnimationUtils.fadeOut(this.game, this.innerItem, 200 + delay)
        AnimationUtils.disappear(this.game, this.point1, delay)
        AnimationUtils.disappear(this.game, this.point2, 100 + delay)
        AnimationUtils.disappear(this.game, this.cloud, 200 + delay)
        AnimationUtils.disappear(this.game, this.innerItem, 100 + delay)

    }
}