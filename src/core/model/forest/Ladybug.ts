export default class Ladybug{
    X: number;
    Y: number;
    collected:boolean;
    sprite:Phaser.Sprite;
    animationEndAt:number;
    constructor(X:number, Y:number, sprite:Phaser.Sprite){
        this.X = X;
        this.Y = Y;
        this.sprite = sprite;
        this.collected = false;
        this.animationEndAt = Date.now()
    }  

}


