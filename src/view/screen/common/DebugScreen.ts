import Ruler from '../../component/panel/Ruler';
import BasePanel from '../../component/panel/BasePanel';
import Utils from "../../../core/utils/Utils";

export default abstract class DebugScreen extends Phaser.State {
    public ruler: Ruler;

    private TAB; // hold to select sprite to transform (work only for named sprites in "debug" mode)

    private cursors; // move sprite
    private Z; // rotate left
    private X; // rotate right
    private E; // anchor
    private Q; // anchor
    private W; // anchor
    private A; // anchor
    private S; // anchor
    private D; // anchor
    private N; //move sprite to top
    private M; //move sprite to back

    private B; //hold to modify sprite parent
    private CTRL; // hold to increase speed of transformation
    private SHIFT; // hold to increase speed of transformation
    private ALT; // hold to resize srite

    //also can do same things with mouse (need use 3 buttons)

    public static DEBUG_MODE = false;

    private mouseLeftDownAt: Phaser.Point;
    private selectedPositionWas: Phaser.Point;

    private mouseRightDownAt: Phaser.Point;
    private selectedScaleWas: Phaser.Point;

    private mouseMiddleDownAt: Phaser.Point;
    private selectedRotationWas: number;

    public selected: PIXI.Sprite;
    private panels: BasePanel[] = [];

    public init() {
        this.ruler = new Ruler(this.game);

        if (DebugScreen.DEBUG_MODE) {
            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.Z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.X = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
            this.E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
            this.B = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
            this.N = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
            this.M = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
            this.CTRL = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
            this.SHIFT = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            this.ALT = this.game.input.keyboard.addKey(Phaser.Keyboard.ALT);
            this.TAB = this.game.input.keyboard.addKey(Phaser.Keyboard.TAB);
        }
    }

    //debug sprites
    protected addSprite(sprite: Phaser.Sprite | Phaser.TileSprite) {
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }

        sprite.events.onInputOver.add(() => this.over(sprite), this);
        this.add.existing(sprite);
    }

    protected addButton(button: Phaser.Button) {
        // if (DebugScreen.DEBUG_MODE) {
        //     button.inputEnabled = true;
        // }
        
        button.events.onInputOver.add(() => this.over(button), this);
        this.add.existing(button);
    }

    public addPanel(panel: BasePanel) {
        this.attachForDebug(panel);
        this.panels.push(panel);
        this.add.existing(panel);
    }

    public attachForDebug(panel: BasePanel) {
        panel.buttons.forEach((element, i) => {
            element.events.onInputOver.add(() => this.over(element), this);
        });
        panel.tileSprites.forEach(element => {
            element.events.onInputOver.add(() => this.over(element), this);
        });
        panel.sprites.forEach(element => {

            if (element instanceof BasePanel) {
                // console.log("ADDED TO DEBUG: " + element.name)
                this.attachForDebug(element);
                this.panels.push(element);
            }

            element.events.onInputOver.add(() => this.over(element), this);
        });

        // panel.events.onInputOver.add(() => this.over(panel), this);
    }

    private over(sprite: PIXI.Sprite) {
        if(DebugScreen.DEBUG_MODE && this.TAB.isDown){
            if(this.selected){
                this.selected.tint = 0xffffff;
            }
            this.selected = sprite;
            this.selected.tint = 0x00FF00;
            console.log("OVER X:" + sprite.x + "; Y:" + sprite.y);
            if (sprite.parent instanceof BasePanel) {
                let panel = sprite.parent as BasePanel;
                console.log("PRESET for " + panel.name + ":");
    
                let presets = [];
                panel.children.forEach(children => {
                    if ((children instanceof Phaser.Sprite || children instanceof Phaser.TileSprite || children instanceof Phaser.Button) && children.name) {
                        presets.push(Utils.presetOf(children));
                    }
                })

                
                console.log(JSON.stringify(presets).replace(/},/g, "},\n"));
                if (sprite instanceof Phaser.Sprite || sprite instanceof Phaser.TileSprite || sprite instanceof Phaser.Button) {
                    console.log("CHILD SPRITE PRESET: " + JSON.stringify(Utils.presetOf(sprite)))
                }
                
                if(this.B.isDown){
                    console.log("PARENT PRESET: " + JSON.stringify(Utils.presetOf(panel)))
                }
            } else if (sprite instanceof Phaser.Sprite || sprite instanceof Phaser.TileSprite || sprite instanceof Phaser.Button) {
                console.log("PRESET for " + sprite.name + ":");
                console.log(JSON.stringify(Utils.presetOf(sprite)));
            }
        }
    }

    public update() {
        //этот код использовался для переключения debug mode
        // if (DebugScreen.DEBUG_MODE && !this.objectsAttachedToDebug) {
        //     this.game.world.children.forEach(c => {
        //         if (c instanceof Phaser.Sprite || c instanceof Phaser.TileSprite || c instanceof Phaser.Button) {
        //             c.inputEnabled = true;
        //             c.events.onInputOver.add(() => this.over(c), this);
        //             c.children.forEach(c2 => {
        //                 if (c2 instanceof Phaser.Sprite || c2 instanceof Phaser.TileSprite || c2 instanceof Phaser.Button) {
        //                     c2.inputEnabled = true;
        //                     c2.events.onInputOver.add(() => this.over(c2), this);
        //                 }
        //             })
        //         }
        //     })

        //     console.log("DEBUG MODE: objects Attached To Debug")
        //     this.objectsAttachedToDebug = true;
        // }
        
        if (!DebugScreen.DEBUG_MODE) {
            return;
        }

        if (!this.selected) {
            return;
        }

        let toModify = this.B.isDown && this.selected.parent instanceof Phaser.Sprite ? this.selected.parent : this.selected;

        let pointer = this.game.input.activePointer;
        if(pointer.leftButton.isDown && toModify){
            if(!this.mouseLeftDownAt){
                this.mouseLeftDownAt = new Phaser.Point(pointer.position.x, pointer.position.y);
                this.selectedPositionWas = new Phaser.Point(toModify.position.x, toModify.position.y);
            }
            
            toModify.x = this.selectedPositionWas.x + pointer.position.x - this.mouseLeftDownAt.x;
            toModify.y = this.selectedPositionWas.y + pointer.position.y - this.mouseLeftDownAt.y;

        } else {
            this.mouseLeftDownAt = null;
        }     

        if(pointer.middleButton.isDown && toModify){
            if(!this.mouseMiddleDownAt){
                this.mouseMiddleDownAt = new Phaser.Point(pointer.position.x, pointer.position.y);
                this.selectedRotationWas = toModify.rotation;
            }
            
            toModify.rotation = this.selectedRotationWas + (pointer.position.x - this.mouseMiddleDownAt.x)/250;

        } else {
            this.mouseMiddleDownAt = null;
        } 

        if(pointer.rightButton.isDown && toModify){
            if(!this.mouseRightDownAt){
                this.mouseRightDownAt = new Phaser.Point(pointer.position.x, pointer.position.y);
                this.selectedScaleWas = new Phaser.Point(toModify.scale.x, toModify.scale.y);
                // this.selectedPositionWas = new Phaser.Point(this.selected.position.x, this.selected.position.y);
            }
            
            // let baseX = this.mouseRightDownAt.x - this.selectedPositionWas.x;
            let baseX = 200;
            let currentX = pointer.position.x - this.mouseRightDownAt.x + baseX;
            toModify.scale.x = this.selectedScaleWas.x * currentX / baseX;

            // let baseY = this.mouseRightDownAt.y - this.selectedPositionWas.y;
            let baseY = 200;
            let currentY = pointer.position.y - this.mouseRightDownAt.y + baseY;
            toModify.scale.y = this.selectedScaleWas.y * currentY / baseY;

        } else {
            this.mouseRightDownAt = null;
        } 

        if(this.N.isDown && toModify.parent instanceof Phaser.Sprite){
            console.log("N down")
            toModify.parent.setChildIndex(toModify, toModify.parent.children.length - 1);
        } else if (this.M.isDown && toModify.parent instanceof Phaser.Sprite){
            console.log("M down")
            toModify.parent.setChildIndex(toModify, 1);//for diary; prevent hiding under background
        }

        let mult = this.CTRL.isDown ? 2 : 1;
        if (this.SHIFT.isDown) {
            mult *= 4;
        }

        

        if (!this.ALT.isDown) {
            //MOVE
            if (this.cursors.up.isDown) {
                toModify.y -= mult;
            } else if (this.cursors.down.isDown) {
                toModify.y += mult;
            }

            if (this.cursors.left.isDown) {
                toModify.x -= mult;
            } else if (this.cursors.right.isDown) {
                toModify.x += mult;
            }
        } else {
            //SCALE
            if (toModify instanceof Phaser.Text) {
                if (this.cursors.up.isDown || this.cursors.right.isDown) {
                    toModify.fontSize = Utils.incrementFontSize(toModify.fontSize, mult);
                } else if (this.cursors.down.isDown || this.cursors.left.isDown) {
                    toModify.fontSize = Utils.incrementFontSize(toModify.fontSize, -mult);
                }
            } else {
                let k = 50;

                if (this.cursors.up.isDown) {
                    toModify.scale = new Phaser.Point(toModify.scale.x, toModify.scale.y + mult / k);
                } else if (this.cursors.down.isDown) {
                    toModify.scale = new Phaser.Point(toModify.scale.x, toModify.scale.y - mult / k);
                }

                if (this.cursors.left.isDown) {
                    toModify.scale = new Phaser.Point(toModify.scale.x - mult / k, toModify.scale.y);
                } else if (this.cursors.right.isDown) {
                    toModify.scale = new Phaser.Point(toModify.scale.x + mult / k, toModify.scale.y);
                }
            }
        }

        //SET ANCHOR
        if (this.Q.isDown) {
            toModify.anchor = new Phaser.Point(0.5, toModify.anchor.y);
        } else if (this.A.isDown) {
            toModify.anchor = new Phaser.Point(1, toModify.anchor.y);
        } else if (this.D.isDown) {
            toModify.anchor = new Phaser.Point(0, toModify.anchor.y);
        }

        if (this.E.isDown) {
            toModify.anchor = new Phaser.Point(toModify.anchor.x, 0.5);
        } else if (this.W.isDown) {
            toModify.anchor = new Phaser.Point(toModify.anchor.x, 1);
        } else if (this.S.isDown) {
            toModify.anchor = new Phaser.Point(toModify.anchor.x, 0);
        }

        if (this.Z.isDown) {
            toModify.rotation += 0.01 * mult;
        } else if (this.X.isDown) {
            toModify.rotation -= 0.01 * mult;
        }
    }

}



