import FlowerType from './FlowerType';
export default class Flower {
    x: number;
    y: number;
    type: FlowerType;
    sprite: Phaser.Sprite;
    collected: boolean;
    constructor(x: number, y: number, type: FlowerType, sprite: Phaser.Sprite) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = sprite;
        this.collected = false;
    }

}


