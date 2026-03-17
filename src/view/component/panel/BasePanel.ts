import DebugScreen from "../../screen/common/DebugScreen";
import Preset from "../../../view/game/Preset";
import Utils from '../../../core/utils/Utils';
import Label from '../../component/panel/Label';
import SpriteUtils from "../../../core/utils/SpriteUtils";
import BlackPanel from "./BlackPanel";
import Settings from "../../../core/service/Settings";

export default class BasePanel extends Phaser.Sprite {

    public tileSprites: Phaser.TileSprite[] = [];
    public sprites: PIXI.DisplayObject[] = [];
    public buttons: Phaser.Button[] = [];

    constructor(game: Phaser.Game, x: number, y: number, name?: string, image?: string) {
        // super(game, x, y, image || "blank");
        super(game, x, y, SpriteUtils.getAtlasKeyAndFrame(game, image || "blank").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, image || "blank").frameName);
        this.name = name;
    }

    public onKill():void{}

    public addSprite(sprite: Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText) {
        if (sprite instanceof Phaser.TileSprite) {
            this.tileSprites.push(sprite);
        } else {
            this.sprites.push(sprite);
        }
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
            this.inputEnabled = true;
        }
        return super.addChild(sprite)
    }
    protected addButton(button: Phaser.Button) {
        this.buttons.push(button);
        return super.addChild(button)
    }

    protected applyPreset(presets: Preset[]) {
        // presets.forEach(preset => {
        //     if (preset.spriteId != "") {
        //         let children = this.game.world.getByName(preset.spriteId)
        //         if (children && (children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button)) {
        //             console.log("APPLY PRESET from getByName: " + preset.spriteId)
        //             Utils.applyPreset(children, preset);
        //         }
        //     }
        // });

        //TODO use Utils method
        presets.forEach(preset => {
            this.children.forEach(child => {
                if (preset.spriteId != "" && (child instanceof Phaser.Sprite || child instanceof Phaser.TileSprite || child instanceof Phaser.Button || child instanceof Phaser.Group || child instanceof Phaser.BitmapText)
                && child.name == preset.spriteId) {
                    Utils.applyPreset(<any>child, preset);
                }
            });
        });
    }

    protected attachText(name: string, text: string, style?: Phaser.PhaserTextStyle, ingoreVioletHighlight?:boolean): Label {
        let label = new Label(this.game, 0, 0, text, style, ingoreVioletHighlight);
        label.anchor.set(0.5)
        label.name = name;
        this.addSprite(label);
        if (DebugScreen.DEBUG_MODE) {
            label.inputEnabled = true;
        }
        return label;
    }
    protected attachButton(spriteId: string, callback, name?: string): Phaser.Button {
        let sprite = SpriteUtils.createButton(this.game, 0, 0, spriteId, callback);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addButton(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }
    protected attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 0, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }
    public bringChildToTop(child: Phaser.Sprite | Phaser.Button | Phaser.BitmapText) {
        if (child) {
            this.setChildIndex(child, this.children.length - 1);
        }
    }

}
