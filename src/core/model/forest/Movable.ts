export default class Movable {
    X: number;
    Y: number;
    collected: boolean;
    sprite: Phaser.Sprite;
    animationEndAt: number;
    isLadybug: boolean;
    baseScaleX: number;
    baseScaleY: number;

    touchedTimes: number = 0;

    constructor(X: number, Y: number, sprite: Phaser.Sprite, isLadybug: boolean) {
        this.X = X;
        this.Y = Y;
        this.sprite = sprite;
        this.baseScaleX = sprite.scale.x;
        this.baseScaleY = sprite.scale.y;
        this.collected = false;
        this.isLadybug = isLadybug;
        this.animationEndAt = 0;
    }

}


