import EditorScreen from '../../screen/EditorScreen';
import BasePanel from '../panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
export default abstract class EditorImageControlPanel extends BasePanel {

    public choosenOption: string;
    private image: Phaser.Sprite;
    protected screen: EditorScreen;

    protected abstract getOptions():string[];
    protected abstract applyOption(option:string):void;

    constructor(game: Phaser.Game, screen: EditorScreen, x: number, y: number, choosenOption: string) {
        super(game, x, y, "blank");
        this.choosenOption = choosenOption || this.getOptions()[0];
        this.screen = screen;
        let objectBg = this.attachUI("objectBg")
        objectBg.alpha = 0.5;

        this.image = this.attachUI(this.choosenOption, "image")

        let arrowLeft = SpriteUtils.createButton(this.game, 0, 0, "arrowEditor", () => {
            let index = this.getOptions().indexOf(this.choosenOption);
            this.updateImage(index - 1);
        });
        arrowLeft.anchor.set(0.5)
        arrowLeft.name = "arrowLeft"
        this.addButton(arrowLeft);

        let arrowRight = SpriteUtils.createButton(this.game, 0, 0, "arrowEditor", () => {
            let index = this.getOptions().indexOf(this.choosenOption);
            this.updateImage(index + 1);
        });
        arrowRight.anchor.set(0.5)
        arrowRight.name = "arrowRight"
        this.addButton(arrowRight);

        this.applyPreset([{ "spriteId": "objectBg", "x": 4, "y": 16, "scaleX": 1.3000000000000003, "scaleY": 1.08, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "arrowLeft", "x": -43, "y": 22, "scaleX": -0.4400000000000007, "scaleY": 0.47999999999999954, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "arrowRight", "x": 40, "y": 22, "scaleX": 0.4399999999999995, "scaleY": 0.4599999999999995, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "image", "x": 0, "y": 18, "scaleX": 1.2, "scaleY": 1.2, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        ])

    }

    private updateImage(index: number) {
        let count = this.getOptions().length;
        index = (((index % count) + count) % count);

        this.choosenOption = this.getOptions()[index];
        this.image.loadTexture(SpriteUtils.key(this.choosenOption), SpriteUtils.frame(this.choosenOption));

        this.applyOption(this.choosenOption);

        this.screen.redrawCells();
    }

    private attachUI(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 0, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        return sprite;
    }
}