import DebugScreen from "../../screen/common/DebugScreen";
import Preset from "../../../view/game/Preset";
import HtmlPreset, { HtmlHorizontalAlign, HtmlVerticalAlign } from "../../../view/game/HtmlPreset";
import Utils from '../../../core/utils/Utils';
import Label from '../../component/panel/Label';
import SpriteUtils from "../../../core/utils/SpriteUtils";
import BlackPanel from "./BlackPanel";
import Settings from "../../../core/service/Settings";

export default class BasePanel extends Phaser.Sprite {

    public tileSprites: Phaser.TileSprite[] = [];
    public sprites: (Phaser.Sprite | Phaser.BitmapText | Phaser.Text)[] = [];
    public buttons: Phaser.Button[] = [];

    constructor(game: Phaser.Game, x: number, y: number, name?: string, image?: string) {
        // super(game, x, y, image || "blank");
        super(game, x, y, SpriteUtils.getAtlasKeyAndFrame(game, image || "blank").atlasKey, SpriteUtils.getAtlasKeyAndFrame(game, image || "blank").frameName);
        this.name = name;
    }

    public onKill():void{}

    public addSprite(sprite: Phaser.Sprite | Phaser.TileSprite | Phaser.BitmapText | Phaser.Text) {
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
                if (preset.spriteId != "" && (child instanceof Phaser.Sprite || child instanceof Phaser.TileSprite || child instanceof Phaser.Button || child instanceof Phaser.Group || child instanceof Phaser.BitmapText || child instanceof Phaser.Text)
                && child.name == preset.spriteId) {
                    Utils.applyPreset(<any>child, preset);
                }
            });
        });
    }

    protected applyHtmlPreset(presets: HtmlPreset[]) {
        presets.forEach(preset => {
            if (!preset || !preset.spriteId) {
                return;
            }

            let child = this.findChildByNameRecursive(this, preset.spriteId);
            if (!child) {
                return;
            }

            let targetParent = child.parent || this;
            let layoutParent = preset.parentId
                ? this.findChildByNameRecursive(this, preset.parentId)
                : targetParent;

            if (!layoutParent) {
                return;
            }

            let parentBox = this.getDisplayBoxInParentSpace(layoutParent, targetParent);
            let horizontalAlign = preset.horizontalAlign || preset.horisontalAlign || 'left';
            let verticalAlign = preset.verticalAlign || 'top';

            if (preset.fontSize != null && !(child instanceof Label) && (child instanceof Phaser.Text || child instanceof Phaser.BitmapText)) {
                (<any>child).fontSize = preset.fontSize;
            }

            this.applyHtmlSize(child, preset, parentBox.width, parentBox.height, horizontalAlign);
            let childBox = this.getDisplayBoxInParentSpace(child, targetParent);
            let anchorX = !(child instanceof Phaser.Group) && (<any>child).anchor ? (<any>child).anchor.x : 0;
            let anchorY = !(child instanceof Phaser.Group) && (<any>child).anchor ? (<any>child).anchor.y : 0;

            let alignedBoxX = this.getAlignedBoxX(parentBox, childBox.width, horizontalAlign);
            let alignedBoxY = this.getAlignedBoxY(parentBox, childBox.height, verticalAlign);

            child.x = alignedBoxX + childBox.width * anchorX + (preset.offsetX || 0);
            child.y = alignedBoxY + childBox.height * anchorY + (preset.offsetY || 0);
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
    public bringChildToTop(child: Phaser.Sprite | Phaser.Button | Phaser.BitmapText | Phaser.Text) {
        if (child) {
            this.setChildIndex(child, this.children.length - 1);
        }
    }

    private findChildByNameRecursive(root: PIXI.DisplayObject, name: string): PIXI.DisplayObject {
        if (!root || !name) {
            return null;
        }

        if ((<any>root).name == name) {
            return root;
        }

        let container = <PIXI.DisplayObjectContainer><any>root;
        if (!container.children || container.children.length == 0) {
            return null;
        }

        for (let i = 0; i < container.children.length; i++) {
            let found = this.findChildByNameRecursive(container.children[i], name);
            if (found) {
                return found;
            }
        }

        return null;
    }

    private getDisplayBoxInParentSpace(displayObject: PIXI.DisplayObject, targetParent: PIXI.DisplayObjectContainer): { x: number, y: number, width: number, height: number } {
        let current = <any>displayObject;
        let customBox = current.layoutBox;
        let width = current.width || 0;
        let height = current.height || 0;
        let anchorX = current instanceof Phaser.Group ? 0 : (current.anchor ? current.anchor.x : 0);
        let anchorY = current instanceof Phaser.Group ? 0 : (current.anchor ? current.anchor.y : 0);

        if (displayObject == <any>targetParent) {
            if (customBox && isFinite(customBox.width) && isFinite(customBox.height)) {
                return {
                    x: customBox.x || 0,
                    y: customBox.y || 0,
                    width: customBox.width,
                    height: customBox.height
                };
            }

            return {
                x: -width * anchorX,
                y: -height * anchorY,
                width: width,
                height: height
            };
        }

        if (current.parent == targetParent) {
            if (customBox && isFinite(customBox.width) && isFinite(customBox.height)) {
                return {
                    x: current.x + (customBox.x || 0),
                    y: current.y + (customBox.y || 0),
                    width: customBox.width,
                    height: customBox.height
                };
            }

            return {
                x: current.x - width * anchorX,
                y: current.y - height * anchorY,
                width: width,
                height: height
            };
        }

        let bounds = current.getBounds ? current.getBounds() : PIXI.DisplayObjectContainer.prototype.getBounds.call(displayObject);
        let topLeftGlobal = new Phaser.Point(bounds.x, bounds.y);
        let bottomRightGlobal = new Phaser.Point(bounds.x + bounds.width, bounds.y + bounds.height);

        let localTopLeft = targetParent.toLocal ? (<any>targetParent).toLocal(topLeftGlobal, null) : topLeftGlobal;
        let localBottomRight = targetParent.toLocal ? (<any>targetParent).toLocal(bottomRightGlobal, null) : bottomRightGlobal;

        return {
            x: localTopLeft.x,
            y: localTopLeft.y,
            width: localBottomRight.x - localTopLeft.x,
            height: localBottomRight.y - localTopLeft.y
        };
    }

    private applyHtmlSize(child: PIXI.DisplayObject, preset: HtmlPreset, parentWidth: number, parentHeight: number, horizontalAlign: HtmlHorizontalAlign): void {
        let current = <any>child;
        let width = this.resolveHtmlSize(preset.width, parentWidth);
        let height = this.resolveHtmlSize(preset.height, parentHeight);
        let textAlign = horizontalAlign == 'center' ? 'center' : (horizontalAlign == 'right' ? 'right' : 'left');

        if (child instanceof Label) {
            let style = Object.assign({}, (<any>child).styleDef || {});

            if (preset.fontSize != null) {
                style.font = this.replaceFontSize(style.font || '40px Arial', preset.fontSize);
            }

            style.align = textAlign;

            if (width != null) {
                style.wordWrap = true;
                style.wordWrapWidth = width;
            }

            child.setStyle(style);
            return;
        }

        if (width != null) {
            if (child instanceof Phaser.Text) {
                let textChild = <any>child;
                textChild.wordWrap = true;
                textChild.wordWrapWidth = width;
                textChild.align = textAlign;
                textChild.style.wordWrap = true;
                textChild.style.wordWrapWidth = width;
                textChild.style.align = textChild.align;
                textChild.updateText();
            } else if (!(child instanceof Phaser.Group)) {
                current.width = width;
            }
        }

        if (height != null && !(child instanceof Phaser.Text) && !(child instanceof Phaser.BitmapText) && !(child instanceof Phaser.Group)) {
            current.height = height;
        }
    }

    private resolveHtmlSize(value: number | string, base: number): number {
        if (value == null) {
            return null;
        }

        if (typeof value == 'number') {
            return value;
        }

        if (typeof value == 'string' && value.indexOf('%') > -1) {
            return base * Number(value.replace('%', '')) / 100;
        }

        return Number(value);
    }

    private replaceFontSize(font: string, size: number): string {
        let fontString = (font || '40px Arial').toString();

        if (fontString.match(/\d+px/i)) {
            return fontString.replace(/\d+px/i, size + 'px');
        }

        return size + 'px ' + fontString;
    }

    private getAlignedBoxX(parentBox: { x: number, y: number, width: number, height: number }, childWidth: number, align: HtmlHorizontalAlign): number {
        switch (align) {
            case 'center':
                return parentBox.x + (parentBox.width - childWidth) / 2;
            case 'right':
                return parentBox.x + parentBox.width - childWidth;
            case 'left':
            default:
                return parentBox.x;
        }
    }

    private getAlignedBoxY(parentBox: { x: number, y: number, width: number, height: number }, childHeight: number, align: HtmlVerticalAlign): number {
        switch (align) {
            case 'center':
                return parentBox.y + (parentBox.height - childHeight) / 2;
            case 'bottom':
                return parentBox.y + parentBox.height - childHeight;
            case 'top':
            default:
                return parentBox.y;
        }
    }

}
