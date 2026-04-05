import BiomType from '../../../core/model/enum/BiomType';
import CellType from '../../../core/model/enum/CellType';
import Environment from '../../../core/model/enum/Environment';
import OpeningType from '../../../core/model/enum/OpeningType';
import CellState from '../../../core/model/forest/CellState';
import Settings from '../../../core/service/Settings';
import SoundUtils from '../../../core/utils/SoundUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import ForestScreen from '../../screen/ForestScreen';
import BasePanel from '../panel/BasePanel';
import AdminService from './../../../core/service/AdminService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import ForestUtils from './../../../core/utils/ForestUtils';
import NeverError from './../../../core/utils/NeverError';
import Utils from './../../../core/utils/Utils';
export default class ForestCellCover extends Phaser.Group {

    private environment: Environment;
    // private leafType: string;

    public darkCover: Phaser.Sprite;
    public decoration: Phaser.Sprite;
    private decoration2: Phaser.Sprite;
    private decoration3: Phaser.Sprite;
    private decoration4: Phaser.Sprite;
    private decoration5: Phaser.Sprite;
    private decoration6: Phaser.Sprite;
    private frame: Phaser.Sprite;
    private locked = false;

    private cankerberry: Phaser.Sprite;
    private cankerberry2: Phaser.Sprite;
    public dragonfly: Phaser.Sprite;
    public leaf: Phaser.Sprite;
    public openableCover: Phaser.Button;
    public boat: Phaser.Sprite;
    public bee: Phaser.Sprite;

    public cellState: CellState;
    public cellType: CellType;

    private callback: Function;
    private callbackContext: any;

    private w: number;
    private h: number;

    //TODO хранить ivy в cellState. Методы isLocked и т.п. можно будет вынести.
    constructor(environment: Environment, leafType: string, x: number, y: number, width: number, height: number,
        game: Phaser.Game, cellState: CellState, cellType: CellType, callback: Function, callbackContext: any) {
        super(game);

        this.x =  x;
        this.y = y;
        this.game = game;
        this.cellState = cellState;
        this.cellType = cellType;
        this.environment = environment;
        this.w = width;
        this.h = height;
        // this.leafType = leafType;

        this.callbackContext = callbackContext;
        this.callback = callback;

        this.openableCover = SpriteUtils.createButton(this.game, 0, 0, this.getCoverKey(cellType), () => this.openCell());
        this.openableCover.anchor = new Phaser.Point(0.5, 0.5);
        this.openableCover.width = width;
        this.openableCover.height = height;
        this.addChild(this.openableCover);



        if (ForestUtils.isIvyFreeBoosterType(cellType) || ForestUtils.isCoverFreeNotBoosterItem(cellType)) {
            this.visible = false;
            this.inputEnableChildren = false;
        }

        if (AdminService.isTransparentMode()) {
            this.openableCover.alpha = 0.1;
        }

        let unconditionalLeafType = this.getUnconditionalLeafType(cellType);

        this.leaf = SpriteUtils.createSprite(this.game, 0, 0, unconditionalLeafType ? unconditionalLeafType : leafType);
        this.leaf.anchor = new Phaser.Point(0.5, 0.5);
        // this.leaf.width = width/this.scale.x;
        // this.leaf.height = height/this.scale.y;
        this.leaf.scale = new Phaser.Point(1.5, 1.5);
        this.leaf.inputEnabled = false;
        this.openableCover.addChild(this.leaf);

        this.addInitialAnimation();

        this.darkCover = SpriteUtils.createSprite(this.game, 0, 0, this.getGrayedCoverKey());
        this.darkCover.anchor = new Phaser.Point(0.5, 0.5);
        this.darkCover.width = width;
        this.darkCover.height = height;
        this.darkCover.alpha = 0;
        this.darkCover.inputEnabled = false;
        this.addChild(this.darkCover);

        let darkLeaf = SpriteUtils.createSprite(this.game, 0, 0, (unconditionalLeafType ? unconditionalLeafType : leafType) + "g");
        darkLeaf.anchor = new Phaser.Point(0.5, 0.5);
        darkLeaf.width = width;
        darkLeaf.height = height;
        darkLeaf.scale = new Phaser.Point(1.5, 1.5);
        darkLeaf.inputEnabled = false;
        this.darkCover.addChild(darkLeaf);

        let decorationKey = this.getDecorationKey(cellType);
        if (decorationKey != "") {
            this.decoration = SpriteUtils.createSprite(this.game, 0, 0, decorationKey);
            this.decoration.anchor = new Phaser.Point(0.5, 0.5);
            this.decoration.width = width;
            this.decoration.height = height;
            this.decoration.inputEnabled = false;
            this.addChild(this.decoration);

            //ivy
            if (cellType == CellType.IVY || cellType == CellType.IVY_STRONG || cellType == CellType.CANKERBERRY1 || cellType == CellType.CANKERBERRY2
                || cellType == CellType.DRAGONFLY || cellType == CellType.PLANK1 || cellType == CellType.PLANK2 || cellType == CellType.PLANK3 ||
                cellType == CellType.IVY_M || cellType == CellType.IVY_STRONG_M ||
                cellType == CellType.PLANK1_M || cellType == CellType.PLANK2_M || cellType == CellType.PLANK3_M) {
                this.decoration2 = SpriteUtils.createSprite(this.game, 0, 0, "liana2");
                this.decoration2.anchor = new Phaser.Point(0.5, 0.5);
                this.decoration2.width = width;
                this.decoration2.height = height;
                // this.decoration2.angle = -120;
                this.decoration2.inputEnabled = false;
                this.addChild(this.decoration2);

                this.decoration3 = SpriteUtils.createSprite(this.game, 0, 0, "liana3");
                this.decoration3.anchor = new Phaser.Point(0.5, 0.5);
                this.decoration3.width = width;
                this.decoration3.height = height;
                // this.decoration3.angle = -60;
                this.decoration3.inputEnabled = false;
                this.addChild(this.decoration3);

                this.decoration.alpha = 0;
                this.decoration2.alpha = 0;

                if (cellType == CellType.IVY || cellType == CellType.IVY_M || cellType == CellType.CANKERBERRY1) {
                    this.decoration3.alpha = 0;
                    this.decoration2.alpha = 1;
                }
            }

            if (cellType == CellType.CANKERBERRY1 || cellType == CellType.CANKERBERRY2) {
                this.addCankerBerries();
            }

            if (cellType == CellType.DRAGONFLY) {
                this.addDragonfly();
            }
        }

        if (cellType == CellType.JELLY) {
            let jellyMushroom = SpriteUtils.createSprite(this.game, 0, 0, "jellyMushroom");
            jellyMushroom.anchor.set(0.5)
            jellyMushroom.scale = new Phaser.Point(1.5, 1.5);
            this.decoration.addChild(jellyMushroom)
            AnimationUtils.jelly(this.game, jellyMushroom, Utils.random(5000))
        }

        if (cellType == CellType.PLANK1 || cellType == CellType.PLANK2 || cellType == CellType.PLANK3 ||
            cellType == CellType.PLANK1_M || cellType == CellType.PLANK2_M || cellType == CellType.PLANK3_M) {
            this.decoration4 = SpriteUtils.createSprite(this.game, 0, 0, "plank1");
            this.decoration4.anchor = new Phaser.Point(0.5, 0.5);
            this.decoration4.width = width;
            this.decoration4.height = height;
            this.decoration4.angle = -120;
            this.decoration4.inputEnabled = false;
            this.addChild(this.decoration4);
        }

        if (cellType == CellType.PLANK2 || cellType == CellType.PLANK3 || cellType == CellType.PLANK2_M || cellType == CellType.PLANK3_M) {
            this.decoration5 = SpriteUtils.createSprite(this.game, 0, 0, "plank2");
            this.decoration5.anchor = new Phaser.Point(0.5, 0.5);
            this.decoration5.width = width;
            this.decoration5.height = height;
            this.decoration5.angle = -120;
            this.decoration5.inputEnabled = false;
            this.addChild(this.decoration5);
        }

        if (cellType == CellType.PLANK3 || cellType == CellType.PLANK3_M) {
            this.decoration6 = SpriteUtils.createSprite(this.game, 0, 0, "plank3");
            this.decoration6.anchor = new Phaser.Point(0.5, 0.5);
            this.decoration6.width = width;
            this.decoration6.height = height;
            this.decoration6.angle = -120;
            this.decoration6.inputEnabled = false;
            this.addChild(this.decoration6);
        }

        this.locked = this.decoration && this.decoration.alpha > 0;
        if (this.isLocked()) {
            this.leaf.alpha = 0.8;
        }

        if(AdminService.cacheComplexImages()){
            this.cacheAsBitmap = true;
        }
    }

    public addDecoration(type: CellType) {
        this.cellType = type;
        let decorationKey = this.getDecorationKey(this.cellType);
        if (decorationKey != "") {
            this.decoration = SpriteUtils.createSprite(this.game, 0, 0, decorationKey);
            this.decoration.anchor = new Phaser.Point(0.5, 0.5);
            this.decoration.width = this.w;
            this.decoration.height = this.h;
            this.decoration.inputEnabled = false;
            this.addChild(this.decoration);
            if(!AdminService.cacheComplexImages()){
                AnimationUtils.fadeInStable(this.game, this.decoration, 0, 300)
            }
            this.locked = true;
        }


        if (ForestUtils.getBoosterInfo(this.cellType) && ForestUtils.containIvyOrIce(this.cellType)) {
            this.inputEnableChildren = false;
            this.visible = false;
        } else {
            this.openableCover.inputEnabled = true;
        }
    }

    public setFrame(alpha:number){
        if(this.frame) {
            this.frame.alpha = alpha;
        } else { 
            if (alpha <= 0) {
                return;
            }

            let frameImage = "hexFrame";
            switch(ForestUtils.getBiom(this.cellType)){
                case BiomType.SAND:
                case BiomType.WATER:
                    frameImage = "hexFrame2";
                    break;    
                case BiomType.BERRY_FIELD:
                case BiomType.FOREST:
                case BiomType.MOUNTAIN:
                    break;
            }

            if (this.environment == Environment.house){
                frameImage = "hexFrame2";
            }
            this.frame = SpriteUtils.createSprite(this.game, 0, 0, frameImage);
            this.frame.anchor = new Phaser.Point(0.5, 0.5);
            this.frame.alpha = 0;
            this.frame.width = this.w;
            this.frame.height = this.h;
            this.frame.inputEnabled = false;
            this.frame.visible = false;
            this.addChild(this.frame);
            AnimationUtils.fadeInStable(this.game, this.frame, 1, 20, alpha);
        }
    }

    public getCankerBerriesCount() {
        // if (this.cankerberry) {
        //     return this.lockedTimes() - 1;
        // }
        // return 0;
        return (this.cankerberry ? 1 : 0) + (this.cankerberry2 ? 1 : 0);
    }

    public addDragonfly() {
        this.dragonfly = SpriteUtils.createSprite(this.game, 0, 0, "dragonfly");
        this.dragonfly.anchor = new Phaser.Point(0.5, 0.5);
        this.dragonfly.width = this.openableCover.width;
        this.dragonfly.height = this.openableCover.height;
        this.dragonfly.inputEnabled = false;
        this.dragonfly.scale.set(ForestScreen.dragonflyInitialScale)
        // this.dragonfly.angle = Utils.random(360);
        this.addChild(this.dragonfly);
    }

    public addCankerBerries(transparent?: boolean): number {
        if (this.lockedTimes() > 1) {
            // this.cankerberry = SpriteUtils.createSprite(this.game, this.x+10, this.y+20, "cankerberry");
            this.cankerberry = SpriteUtils.createSprite(this.game, 10, 20, "cankerberry");
            this.cankerberry.anchor = new Phaser.Point(0.5, 0.5);
            this.cankerberry.width = this.openableCover.width;
            this.cankerberry.height = this.openableCover.height;
            this.cankerberry.scale.set(0.8, 0.8);
            this.cankerberry.inputEnabled = false;
            this.cankerberry.rotation = 5;
            if (transparent) {
                this.cankerberry.alpha = 0.5;
            }
            this.addChild(this.cankerberry);
            // this.game.add.existing(this.cankerberry);

            this.setChildIndex(this.decoration2, this.children.length - 1);

            if (this.lockedTimes() > 2) {
                // this.cankerberry2 = SpriteUtils.createSprite(this.game, this.x-20, this.y+10, "cankerberry");
                this.cankerberry2 = SpriteUtils.createSprite(this.game, -20, 10, "cankerberry");
                this.cankerberry2.anchor = new Phaser.Point(0.5, 0.5);
                this.cankerberry2.width = this.openableCover.width;
                this.cankerberry2.height = this.openableCover.height;
                this.cankerberry2.scale.set(0.8, 0.8);
                this.cankerberry2.inputEnabled = false;
                this.cankerberry2.angle = 0;
                if (transparent) {
                    this.cankerberry2.alpha = 0.5;
                }
                this.addChild(this.cankerberry2);
                // this.game.add.existing(this.cankerberry2)

                this.setChildIndex(this.decoration3, this.children.length - 1);
                return 2;
            }

            return 1;
        }
        return 0;
    }

    public openCell(openingType?:OpeningType): void {
        if (this.callback) {
            this.cacheAsBitmap = false;
            let callbackBinded = this.callback.bind(this.callbackContext);
            callbackBinded(this.cellState, openingType || OpeningType.usual);
        }
    }

    public openCellSmoothly(time: number, openingType: OpeningType): void {
        this.cellState.opened = true;

        let callbackBinded = this.callback.bind(this.callbackContext);
        callbackBinded(this.cellState, openingType);

        this.game.add.tween(this.openableCover).to({ alpha: 0 }, time, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 0, 0, false)
        this.game.time.events.add(time, () => {
            this.visible = false;
        }, this);

    }

    public resetOpeningLeafAnimation(): void {
        if (!this.leaf) {
            return;
        }

        switch (this.cellType) {
            case CellType.WATER:
            case CellType.BOAT:
                this.game.tweens.removeFrom(this.leaf);
                this.leaf.scale.set(1.5, 1.5);
                this.leaf.angle = 0;
                break;
        }
    }

    public makeDark(): void {
        this.darkCover.alpha = 0.001;
        
        if(AdminService.cacheComplexImages()){
            this.cacheAsBitmap = false;
            this.darkCover.alpha = 1;
            this.cacheAsBitmap = true;
        } else {
            this.game.add.tween(this.darkCover).to({ alpha: 1 }, 500, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 0, 0, false);
        }
        
        if(this.frame){
            this.frame.alpha = 0;
        }

        this.openableCover.inputEnabled = false;
    }

    public tearOffCankerberry(): Phaser.Sprite {
        let res = null;
        if (this.lockedTimes() < 2 && this.cankerberry2) {
            res = this.cankerberry2;
            this.cankerberry2 = null;
        } else if (this.lockedTimes() < 1 && this.cankerberry) {
            res = this.cankerberry;
            this.cankerberry = null;
        }
        return res;
    }

    public unlock(): void {
        if (this.isLocked()) {
            if (this.decoration6 && this.decoration6.alpha == 1) {

                this.decoration6.alpha = 0.99;
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = false;
                this.removePlank(this.decoration6)
                SoundUtils.cellPlankOff();
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

            } else if (this.decoration5 && this.decoration5.alpha == 1) {

                this.decoration5.alpha = 0.99;
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = false;
                this.removePlank(this.decoration5, true)
                SoundUtils.cellPlankOff();
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

            } else if (this.decoration4 && this.decoration4.alpha == 1) {

                this.decoration4.alpha = 0.99;
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = false;
                this.removePlank(this.decoration4)
                SoundUtils.cellPlankOff();
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

            } else if (this.decoration3 && this.decoration3.alpha == 1) {
                
                this.decoration3.alpha = 0.99;
                if(AdminService.cacheComplexImages())  {this.cacheAsBitmap = false; this.decoration3.alpha = 0;}
                this.decoration2.alpha = 1;
                this.game.add.tween(this.decoration3).to({ alpha: 0 }, 800, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 100, 0, false);
                SoundUtils.cellBushOff();
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

            } else if (this.decoration2 && this.decoration2.alpha == 1) {
                
                this.decoration2.alpha = 0.99;
                if(AdminService.cacheComplexImages())  {this.cacheAsBitmap = false; this.decoration2.alpha = 0;}
                this.decoration.alpha = 1;
                this.game.add.tween(this.decoration2).to({ alpha: 0 }, 800, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 100, 0, false);
                SoundUtils.cellBushOff();
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

            } else if (!this.decoration2 || this.decoration2.alpha != 1) {
                
                this.decoration.alpha = 0.99;
                if(AdminService.cacheComplexImages()) {this.cacheAsBitmap = false; this.decoration.alpha = 0;}
                this.game.add.tween(this.decoration).to({ alpha: 0 }, 800, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 100, 0, false);
                this.locked = false;
                if(AdminService.cacheComplexImages()) this.cacheAsBitmap = true;

                if (this.cellType == CellType.COLD) {
                    SoundUtils.touchIce();
                } else if (this.cellType == CellType.JELLY) {
                    SoundUtils.touchJelly();
                } else {
                    SoundUtils.cellBushOff();
                }

                //в чем тут разница??
                if (ForestUtils.getBoosterContentType(this.cellType) && ForestUtils.containIvyOrIce(this.cellType)) {
                    this.inputEnableChildren = false;
                    this.visible = false;
                } else {
                    this.openableCover.inputEnabled = true;
                }

                this.leaf.alpha = 1;
            }

            if (this.cellType == CellType.COLD) {
                AnimationUtils.petalsBurst(this.game, this.x, this.y, ["snowflake1", "snowflake2"]);
            } else {
                AnimationUtils.petalsBurst(this.game, this.x, this.y, ["petalGreen", "petalBrown"], 0, 0.5);
            }
        }
    }

    private removePlank(plank: Phaser.Sprite, odd?: boolean) {
        console.log(odd ? -15 : 15)
        this.game.add.existing(plank)
        plank.x = this.cellState.sprite.x
        plank.y = this.cellState.sprite.y
        this.game.add.tween(plank).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 200, 0, false);
        this.game.add.tween(plank).to({ y: plank.y + 100 }, 800, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.Out, true, 100, 0, false);
        // this.game.add.tween(plank).to({ angle: odd ? -15 : 15 }, 800, Phaser.Easing.Quadratic.Out, true, 100, 0, false);
        this.game.add.tween(plank).to({ rotation: (odd ? - 3.14 / 6 : 3.14 / 6) }, 800, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.Out, true, 100, 0, false);
    }

    public isDark(): boolean {
        return this.darkCover.alpha != 0;
    }

    public isLocked(): boolean {
        return this.lockedTimes() > 0;
    }

    //need refactoring
    public lockedTimes(): number {
        if (this.decoration6 != null && this.decoration6.alpha == 1) {
            return 6;
        } else if (this.decoration5 != null && this.decoration5.alpha == 1) {
            return 5;
        } else if (this.decoration4 != null && this.decoration4.alpha == 1) {
            return 4;
        } else if (this.decoration3 != null && this.decoration3.alpha == 1) {
            return 3;
        } else if (this.decoration2 != null && this.decoration2.alpha == 1) {
            return 2;
        } else if (this.decoration != null && this.decoration.alpha == 1) {
            return 1;
        }
        return this.locked ? 1 : 0;
    }

    private getCoverKey(type: CellType): string {
        switch (type) {
            case CellType.EMPTY:
            case CellType.COMPASS_IVY:
            case CellType.COMPASS_FREE:
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.ACORN:
            case CellType.HIVE:
                return "";
            case CellType.DRAGONFLY:
            case CellType.FOREST:

            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.JELLY:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
                return this.getCoverBg(this.environment);
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
            case CellType.BEE_M:
            case CellType.MOUNTAIN:
                return "hexMountain";
            case CellType.BEE:
                return this.getCoverBg(this.environment);
            case CellType.BOAT:
            case CellType.WATER:
            case CellType.COLD:
                return "hexWater";
            case CellType.BERRY_FIELD:
                return "hexFlower";
            case CellType.SAND:
                return "hexSand";
            default:
                throw new NeverError(type);

        }
    }

    private getUnconditionalLeafType(type: CellType): string {
        switch (type) {
            case CellType.MOUNTAIN:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
            case CellType.BEE_M:
                return "mount";
            case CellType.WATER:
            case CellType.BOAT:
            case CellType.COLD:
                return "drop";
            case CellType.SAND:
                return "sandPyramid";
            case CellType.BERRY_FIELD:
                return "pinkFlower";

            case CellType.JELLY:
            case CellType.EMPTY:
            case CellType.COMPASS_IVY:
            case CellType.COMPASS_FREE:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
            case CellType.FOREST:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:

            case CellType.HIVE:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.ACORN:
            case CellType.DRAGONFLY:
            case CellType.BEE:

                return null;
            default:
                throw new NeverError(type);

        }
    }

    private addInitialAnimation() {
        let anim = !AdminService.cacheComplexImages()
        
        switch (this.cellType) {
            case CellType.FOREST:
                if (this.environment == Environment.house) {
                    if (anim) AnimationUtils.jelly(this.game, this.leaf, Utils.random(5000));
                } else {
                    if (anim) AnimationUtils.sway(this.game, this.leaf, Utils.random(5000));
                }
                break;
            case CellType.MOUNTAIN:
            case CellType.SAND:
                if (anim) AnimationUtils.heartBeat2(this.game, this.leaf, Utils.random(5000));
                break;
            case CellType.BERRY_FIELD:
                if (anim) AnimationUtils.sway(this.game, this.leaf, Utils.random(5000));
                break;
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
                this.openableCover.inputEnabled = false;
                if (anim) AnimationUtils.heartBeat2(this.game, this.leaf, Utils.random(5000));
                break;
            case CellType.WATER:
                if (anim) AnimationUtils.wiggle(this.game, this.leaf, Utils.random(5000));
                break;
            case CellType.COMPASS_IVY:
            case CellType.COMPASS_FREE:
            case CellType.ROCKET:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET2:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET3:
            case CellType.ROCKET_IVY3:
            case CellType.VISION:
            case CellType.VISION_IVY:
            case CellType.ACORN:
            case CellType.HIVE:
                this.openableCover.visible = false;
                this.openableCover.inputEnabled = false;
                break;
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.EMPTY:
            case CellType.COLD:
            case CellType.DRAGONFLY:
            case CellType.JELLY:
                //TODO add animation when unblock
                this.openableCover.inputEnabled = false;
                break;
            case CellType.BOAT:
                if (anim) AnimationUtils.wiggle(this.game, this.leaf, Utils.random(5000));
                this.boat = SpriteUtils.createSprite(this.game, 0, 0, "boat");
                this.boat.anchor.set(0.5, 0.8);
                this.boat.width = this.w;
                this.boat.height = this.h;
                this.boat.scale.set(1.15 * 1.5)
                this.boat.y = 0.3 * this.boat.height - 7;
                this.boat.inputEnabled = false;
                this.openableCover.addChild(this.boat);

                if(!AdminService.cacheComplexImages()){
                    this.leaf.alpha = 0;
                }
                
                this.openableCover.inputEnabled = false;
                if (anim) AnimationUtils.boatFloating(this.game, this.boat);
                break;
            case CellType.BEE:
            case CellType.BEE_M:
                this.bee = SpriteUtils.createSprite(this.game, 0, 2, "bee");
                this.bee.anchor.set(0.5, 0.6);
                this.bee.width = (this.openableCover.width * 0.95) / Math.max(Math.abs(this.openableCover.scale.x), 0.001);
                this.bee.height = (this.openableCover.height * 0.95) / Math.max(Math.abs(this.openableCover.scale.y), 0.001);
                this.bee.inputEnabled = false;
                this.openableCover.addChild(this.bee);
                this.leaf.alpha = 0;
                this.openableCover.inputEnabled = false;
                if (anim) AnimationUtils.beeFloating(this.game, this.bee);
                break;
            default:
                throw new NeverError(this.cellType);
        }
    }

    public refreshCover(leafType: string) {
        this.leaf.loadTexture(SpriteUtils.key(leafType), SpriteUtils.frame(leafType));
        if (leafType == "hexChest") {
            this.openableCover.loadTexture(SpriteUtils.key("hexHouse"), SpriteUtils.frame("hexHouse"))
        } else {
            this.openableCover.loadTexture(SpriteUtils.key("hex"), SpriteUtils.frame("hex"))
        }
    }

    private getCoverBg(environment: Environment) {
        switch (environment) {
            case Environment.house:
                return "hexHouse";
                case Environment.darkForest:
                    return "hexDF";
            case Environment.flowerFields:
            case Environment.forest:
            case Environment.lake:
            case Environment.jungles:
            default:
                return "hex";
                // throw new NeverError(environment);
        }
    }

    private getGrayedCoverKey() {
        let biom = ForestUtils.getBiom(this.cellType)
        switch (biom) {
            case BiomType.WATER:
            case BiomType.FOREST:
            case BiomType.MOUNTAIN:
            case BiomType.BERRY_FIELD:
            case BiomType.SAND:
                break;
            default:
                throw new NeverError(biom);
        }

        switch (this.environment) {
            case Environment.house:
                return "hexHouseDark";
            case Environment.forest:
            case Environment.darkForest:
            case Environment.flowerFields:
            case Environment.lake:
            case Environment.jungles:
            case Environment.bugForest:
            case Environment.snailForest:
            default:
                return "hexDark";
                // throw new NeverError(this.environment);
        }
    }

    private getDecorationKey(type: CellType) {
        switch (type) {
            case CellType.EMPTY:
            case CellType.COMPASS_FREE:
            case CellType.VISION:
            case CellType.ROCKET:
            case CellType.ROCKET2:
            case CellType.ROCKET3:
            case CellType.FOREST:
            case CellType.WATER:
            case CellType.BOAT:
            case CellType.BEE:
            case CellType.BEE_M:
            case CellType.MOUNTAIN:
            case CellType.ACORN:
            case CellType.HIVE:
            case CellType.BERRY_FIELD:
            case CellType.SAND:
                return "";

            case CellType.IVY_SMALL:
            case CellType.IVY:
            case CellType.IVY_STRONG:
            case CellType.COMPASS_IVY:
            case CellType.ROCKET_IVY:
            case CellType.ROCKET_IVY2:
            case CellType.ROCKET_IVY3:
            case CellType.VISION_IVY:
            case CellType.CANKERBERRY1:
            case CellType.CANKERBERRY2:
            case CellType.DRAGONFLY:
            case CellType.PLANK1:
            case CellType.PLANK2:
            case CellType.PLANK3:
            case CellType.IVY_SMALL_M:
            case CellType.IVY_M:
            case CellType.IVY_STRONG_M:
            case CellType.PLANK1_M:
            case CellType.PLANK2_M:
            case CellType.PLANK3_M:
                return "liana";
            case CellType.COLD:
                return "cold";
            case CellType.JELLY:
                return "jelly";

            default:
                throw new NeverError(type);
        }
    }
}
