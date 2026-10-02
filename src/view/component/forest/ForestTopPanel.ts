import BaseCellsProvider from '../../../core/service/provider/BaseCellsProvider';
import AimType from '../../../core/model/enum/AimType';
import ForestUtils from './../../../core/utils/ForestUtils';
import NeverError from './../../../core/utils/NeverError';
import ForestAim from '../../../core/model/forest/ForestAim';
import CellState from '../../../core/model/forest/CellState';
import ForestCell from '../../../core/model/forest/ForestCell';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import ForestCellCover from './ForestCellCover';
import OpeningType from '../../../core/model/enum/OpeningType';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import { ContentType, ItemContents } from '../../../core/model/enum/ContentType';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BaseForestScreen from '../../screen/BaseForestScreen';
import Settings from '../../../core/service/Settings';
import AdminService from './../../../core/service/AdminService';
import UserService from '../../../core/service/UserService';
import TaskService from '../../../core/service/TaskService';
import MushroomHarvestEffects from './MushroomHarvestEffects';
import Environment from '../../../core/model/enum/Environment';
import BiomType from '../../../core/model/enum/BiomType';
export default class ForestTopPanel extends BasePanel {

    private energyCount: number;
    private levelEnergySpent: number;
    private levelEnergyRefunded: number;
    private levelStepsTarget: number;
    private energyLabel: Label;
    private forestType: ForestType;
    private screen: BaseForestScreen;
    private steps: Phaser.Sprite;
    private mushroomHarvestEffects: MushroomHarvestEffects;

    public aims: ForestAim[] = [];

    constructor(game: Phaser.Game, forestType: ForestType, forestScreen: BaseForestScreen) {
        super(game, 0, 0, "blank");
        this.game = game;
        this.screen = forestScreen;
        this.forestType = forestType;

        this.aims = ForestUtils.getAims(forestType);
        this.levelStepsTarget = forestType.steps;
        this.levelEnergySpent = 0;
        this.levelEnergyRefunded = 0;
        this.energyCount = UserService.getUser().getEnergy();

        let topPanel = SpriteUtils.createSprite(this.game, this.game.width / 2, 0, 'topPanel');
        topPanel.anchor = new Phaser.Point(0.5, 0);
        this.addSprite(topPanel);

        let topPanelFrame = SpriteUtils.createSprite(this.game, this.game.width / 2, 3, 'topPanelFrame');
        topPanelFrame.anchor = new Phaser.Point(0.5, 0);
        this.addSprite(topPanelFrame);

        this.steps = SpriteUtils.createSprite(this.game, 96, 55, 'lightning');
        this.steps.anchor = new Phaser.Point(0.5, 0.5);
        this.steps.scale.set(0.54);
        this.steps.alpha = 0.8;
        this.steps.inputEnabled = true;
        this.steps.events.onInputDown.add(() => this.screen.showEnergyPanel(), this);
        this.addSprite(this.steps);

        this.addSprite(this.energyLabel = new Label(this.game, 193, 62, "" + this.energyCount, Label.COMMON_BIG_STYLE));
        this.energyLabel.anchor = new Phaser.Point(0.5, 0.5);
        this.energyLabel.addStrokeColor("#924d1d", 0);
        this.energyLabel.strokeThickness = 4;
        this.energyLabel.inputEnabled = true;
        this.energyLabel.events.onInputDown.add(() => this.screen.showEnergyPanel(), this);
        let step = this.aims.length == 3 ? 165 : 222;

        let shiftX = this.aims.length == 1 ? 108 : (this.aims.length == 2 ? 0 : -55);
        this.aims.forEach((aim, i) => {
            this.addAimWithLabel(aim, shiftX + i * step);
        });

        this.game.time.events.loop(1000, () => this.refreshEnergyLabel());
        this.refreshEnergyLabel();
    }

    public getStepsLeft(): number {
        return Math.max(0, this.levelStepsTarget - this.getNetLevelEnergySpent());
    }

    public getSpentEnergy(): number {
        return Math.max(0, this.getNetLevelEnergySpent());
    }

    public getTargetSteps(): number {
        return this.levelStepsTarget;
    }

    public getAims(): ForestAim[] {
        return this.aims;
    }

    public updateAimCounters(delay: number): void {
        this.aims.forEach(aim => {
            this.game.time.events.add(delay + 200, () => {
                aim.label.text = "" + aim.countLeft;

                if (aim.countLeft <= 0) {
                    aim.label.visible = false;

                    let checkLabel = SpriteUtils.createSprite(this.game, aim.label.x, aim.label.y-500, "check");
                    checkLabel.alpha = 0;
                    checkLabel.anchor = new Phaser.Point(0.5, 0);
                    checkLabel.scale = new Phaser.Point(0.5, 0.5);
                    this.addChild(checkLabel);
                    checkLabel.y+= 500;
                    this.game.add.tween(checkLabel).to({ alpha:1}, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                }
            }, this);
        }
        )
    }

    

    public addStepsFromEvent(): void {
        this.restoreSteps(2);

        this.highlightStepsOnRestore();
    }

    public restoreStepsOnAnimalFound(openingType: OpeningType): void {
        this.restoreSteps(3, openingType);

        this.highlightStepsOnRestore();
    }

    private highlightStepsOnRestore() {
        this.game.tweens.removeFrom(this.energyLabel);
        this.energyLabel.scale.set(1, 1);
        //TODO анимация ломается:
        // AnimationUtils.wiggle(this.game, this.energyLabel, 0, true);

        // BitmapText tint updates on consecutive restoration events can leave
        // cached glyphs with a magenta fallback tint. Keep this texture white;
        // the green particle highlight below remains the restoration feedback.
        this.energyLabel.tint = 0xffffff;

        // AnimationUtils.tint(this.game, this.steps, 0xFFFFFF, 0x00FF00, 500, 0);
        // AnimationUtils.tint(this.game, this.steps, 0x00FF00, 0xFFFFFF, 500, 500)
        this.game.time.events.add(50, () => {
            AnimationUtils.highlight(this.game, this.energyLabel.x, this.energyLabel.y, "splashG", 0, 1.4, 1000)
        })
    }

    // public restoreStepsOnPotionUse(): void {
    //     this.restoreSteps(2);
    // }   

    public restoreStepsOnItemFound(openingType: OpeningType): void {
        this.restoreSteps(1, openingType);
    }

    public restoreStepsOnGloveUse(): void {
        this.restoreSteps(1);
    }

    public restoreStepsForMoney(): void {
        this.restoreSteps(ForestUtils.ADDITIONAL_STEPS_COUNT);

        this.highlightStepsOnRestore();
    }

    public restoreStepsOnBoosterUseByBooster(): void {
        this.restoreSteps(1);
    }

    public activateLooseMode(): void {
        this.energyCount = 1;
        this.energyLabel.text = "" + this.energyCount;
    }

    private restoreSteps(addition: number, openingType?: OpeningType) {
        if (openingType as OpeningType) {
            switch (openingType) {
                case OpeningType.byVision:
                case OpeningType.usual:
                    break;
                case OpeningType.byCompass:
                case OpeningType.byRocket:
                    addition--;
                    break;
                default:
                    throw new NeverError(openingType);
            }
        }
        if (addition <= 0) {
            return;
        }

        const user = UserService.getUser();
        const previousEnergy = user.getEnergy();
        user.addEnergy(addition, false);
        const restoredEnergy = Math.max(0, user.getEnergy() - previousEnergy);
        this.levelEnergyRefunded += restoredEnergy;
        this.refreshEnergyLabel();
    }

    public isNoStepsLeft(): boolean {
        return UserService.getUser().getEnergy() <= 0;
    }

    public tryOpenCell(openingType: OpeningType): boolean {
        if (openingType == OpeningType.usual) {
            if (!UserService.getUser().spendEnergy()) {
                this.refreshEnergyLabel();
                this.screen.showEnergyPanel();
                return false;
            }
            this.levelEnergySpent++;
        }

        this.refreshEnergyLabel();
        return true;
    }

    public spendAdditionalEnergy(amount: number): boolean {
        const user = UserService.getUser();
        const energyBefore = user.getEnergy();
        const spent = user.spendEnergy(amount);

        this.levelEnergySpent += Math.max(0, energyBefore - user.getEnergy());
        this.refreshEnergyLabel();
        return spent;
    }

    public refreshEnergyLabel(): void {
        this.energyCount = UserService.getUser().getEnergy();
        this.energyLabel.text = "" + this.energyCount;
    }

    private getNetLevelEnergySpent(): number {
        return this.levelEnergySpent - this.levelEnergyRefunded;
    }

    public decreaseCounter(type: AimType) {
        this.aims.forEach(aim => {
            if (aim.type == type) {
                aim.countLeft--;
            }
        })
        this.updateAimCounters(0);
    }
    public increaseCounter(type: AimType) {
        this.aims.forEach(aim => {
            if (aim.type == type) {
                aim.countLeft++;
            }
        })
        this.updateAimCounters(0);
    }

    public collectItem(cellState: CellState) {
        let self = this;
        let hasMatchingAim = false;
        const sourceSprite = cellState.sprite;
        const itemImage = cellState.content == ContentType.randomItem
            ? cellState.metaValue : ContentType[cellState.content];
        const harvestCell = MushroomHarvestEffects.isMushroom(itemImage)
            && this.forestType.environment != Environment.house
            ? this.screen.cellsProvider.getCells().filter(c => c.state == cellState && c.biomType != BiomType.WATER)[0]
            : null;
        if (harvestCell && !this.mushroomHarvestEffects) {
            this.mushroomHarvestEffects = new MushroomHarvestEffects(this.game);
        }
        TaskService.recordCollection(ContentType[cellState.content]);
        this.aims.forEach(aim => {

            //TODO refactor panel
            if (ContentType[cellState.content] == aim.image || (aim.type == AimType.itemsBunch && cellState.content == ItemContents.randomItem)) {
                hasMatchingAim = true;

                // The cell sprite is owned by the board and can be touched by
                // its refresh routines while an item is in flight. Animate a
                // separate visual copy, and hide the source immediately.
                // This makes it impossible for a collected mushroom to remain
                // on its original cell after the flight has finished.
                const sprite = self.createItemFlightSprite(sourceSprite);
                sourceSprite.visible = false;
                sourceSprite.alpha = 0;
                sourceSprite.inputEnabled = false;
                self.game.tweens.removeFrom(sourceSprite);

                aim.countLeft--;
                self.updateAimCounters(700);

                let delay = harvestCell ? 180 : 200;
                let animationTime = 700;
                // The cell itself must not remain as a stale copy after the
                // flight tween. Keep the timer as a fallback, but also clean
                // up from the tween completion: timers can be delayed when a
                // tab loses focus or another animation changes the timeline.
                const hideCollectedSprite = () => {
                    if (!sprite || sprite.pendingDestroy) {
                        return;
                    }
                    sprite.visible = false;
                    sprite.alpha = 0;
                    sprite.inputEnabled = false;
                };

                if (aim.type == AimType.itemsBunch) {
                    delay = 400;
                    animationTime = 1000;
                    let w = sprite.width;
                    let h = sprite.height;

                    self.game.add.tween(sprite).to({ alpha: 0 }, animationTime - 300, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In,
                        true, delay + 300, 0, false)
                    self.game.time.events.add(delay + animationTime, () => {
                        hideCollectedSprite();
                    });

                    self.game.add.tween(sprite).to({ width: [w * 2, w * 1.5, w, w], height: [h * 2, h * 1.5, h, h] }, animationTime, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In, true, delay, 0, false)
                } else {
                    self.game.add.tween(sprite).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In,
                        true, delay + animationTime - 100, 0, false);
                        
                    self.game.time.events.add(delay + animationTime, () => {
                        hideCollectedSprite();
                    });

                }

                sprite.inputEnabled = false;

                if (harvestCell) {
                    // Anticipation ends exactly when one continuous curved
                    // flight starts; no competing position tween or snap.
                    const sx = sprite.scale.x;
                    const sy = sprite.scale.y;
                    this.game.add.tween(sprite.scale).to({ x: sx * 1.06, y: sy * 0.94 },
                        90, Phaser.Easing.Sinusoidal.InOut, true, delay - 180, 0, true);
                    this.mushroomHarvestEffects.reveal(harvestCell, delay, () => {
                        if (!sprite.pendingDestroy) sprite.bringToTop();
                        this.screen.bringUiToTop();
                    });
                }

                const flightTween = self.game.add.tween(sprite).to(
                    {
                        angle: 0, x: [sprite.x, aim.sprite.x],
                        y: [sprite.y - (harvestCell ? 100 : 0), aim.sprite.y + self.screen.camera.y]
                    },
                    animationTime, Phaser.Easing.Linear.None, true, delay, 0, false).interpolation(Phaser.Math.bezierInterpolation).start();
                flightTween.onComplete.addOnce(hideCollectedSprite);

                // Tutorial cells are repeatedly reordered above the field.
                // Keep the temporary flight copy above those cells for the
                // whole trajectory, while returning HUD elements above it.
                flightTween.onUpdateCallback(() => {
                    sprite.bringToTop();
                    self.screen.bringUiToTop();
                });

                aim.label.bringToTop();
                self.game.time.events.add(1, () => {
                    sprite.bringToTop();
                    self.screen.bringUiToTop();
                })
            }

        })

        // An item is removed from CellState immediately after collection. If
        // its aim is already complete or is absent, it has no destination for
        // the flight animation; previously its source sprite was left on the
        // field forever. Fade that source out explicitly.
        if (!hasMatchingAim && sourceSprite) {
            if (harvestCell) {
                this.mushroomHarvestEffects.reveal(harvestCell, 0, () => this.screen.bringUiToTop());
            }
            const sprite = sourceSprite;
            sprite.inputEnabled = false;
            self.game.tweens.removeFrom(sprite);
            self.game.add.tween(sprite).to({ alpha: 0 }, 150,
                Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Quadratic.In,
                true, 0, 0, false).onComplete.addOnce(() => {
                    if (!sprite.pendingDestroy) {
                        sprite.visible = false;
                    }
                });
        }
    }

    private createItemFlightSprite(source: Phaser.Sprite): Phaser.Sprite {
        const flightSprite = new Phaser.Sprite(this.game, source.x, source.y, source.texture);
        flightSprite.anchor.set(source.anchor.x, source.anchor.y);
        flightSprite.scale.set(source.scale.x, source.scale.y);
        flightSprite.angle = source.angle;
        flightSprite.alpha = source.alpha;
        flightSprite.tint = source.tint;
        flightSprite.inputEnabled = false;
        this.game.add.existing(flightSprite);
        AnimationUtils.primeForShow(flightSprite);
        return flightSprite;
    }

    public tryCollectDragonfly(cover: ForestCellCover) {
        let aim = this.aims.filter(aim => aim.type == AimType.dragonfly).shift();
        let dragonfly = cover.dragonfly;

        if (aim && dragonfly && !cover.isLocked()) {
            cover.dragonfly = null;
            aim.countLeft--;
            TaskService.recordCollection(aim.image);

            this.updateAimCounters(700);

            let delay = 200;
            let animationTime = 700;

            // dragonfly.x = dragonfly.x + cover.x;
            // dragonfly.y = dragonfly.y + cover.y;
            // this.game.add.existing(dragonfly);

            dragonfly.inputEnabled = false;

            // this.game.add.tween(cankerberry).to({ rotation: 0, width:cover.cover.width, height:cover.cover.height},animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);

            this.game.add.tween(dragonfly).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay + animationTime - 100, 0, false)

            console.log("aim.sprite.x: " + aim.sprite.x)
            console.log("aim.sprite.y: " + aim.sprite.y)

            this.game.add.tween(dragonfly).to(
                {
                    x: [aim.sprite.x],
                    y: [aim.sprite.y + this.screen.camera.y]
                },
                animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)//.interpolation(Phaser.Math.bezierInterpolation).start();

            aim.label.bringToTop();
            this.game.time.events.add(1, () => {
                dragonfly.bringToTop();
                // this.screen.bringUiToTop();
            })
        }
    }

    //TODO может получится загнать в switch по AimType???

    public collectBoat(boat: Phaser.Sprite) {
        this.collectSprite(boat, AimType.boat);
        // this.game.time.events.add(700, ()=>{boat.kill()})
    }
    public collectMoonflower(moonflower: Phaser.Sprite) {
        this.collectSprite(moonflower, AimType.moonflower);
    }
    public collectBook(book: Phaser.Sprite) {
        this.collectSprite(book, AimType.book);
    }
    public collectBee(bee: Phaser.Sprite): boolean {
        return this.collectSprite(bee, AimType.bee);
    }

    public collectHoney(cell: ForestCell) {
        let honey = SpriteUtils.createSprite(this.game, cell.state.sprite.x + 20, cell.state.sprite.y + 20, "honey2")
        honey.anchor.set(0.5)
        this.game.add.existing(honey);
        honey.inputEnabled = false;
        this.collectSprite(honey, AimType.honey);
        this.game.time.events.add(1, () => {
            honey.bringToTop();
            // this.screen.bringUiToTop();
        })
    }

    public collectPearl(cell: ForestCell) {
        let pearl = SpriteUtils.createSprite(this.game, cell.state.sprite.x, cell.state.sprite.y - 4, "pearl")
        pearl.anchor.set(0.5)
        const pearlScale = 0.66 * 120 / Math.max(pearl.width, pearl.height);
        pearl.scale.set(pearlScale * 0.72)
        this.game.add.existing(pearl);
        pearl.inputEnabled = false;
        this.game.add.tween(pearl).to({ y: pearl.y - 34, angle: 18 }, 260,
            Phaser.Easing.Back.Out, true);
        this.game.add.tween(pearl.scale).to({ x: pearlScale, y: pearlScale }, 260,
            Phaser.Easing.Back.Out, true);
        this.game.time.events.add(320, () => {
            this.collectSprite(pearl, AimType.pearl);
        })

        this.game.time.events.add(1, () => {
            pearl.bringToTop();
            // this.screen.bringUiToTop();
        })

    }

    public collectSprite(sprite: Phaser.Sprite, aimType: AimType): boolean {
        let aim = this.aims.filter(aim => aim.type == aimType).shift();

        if (aim) {
            const spriteAny = sprite as any;
            if (typeof spriteAny.updateTransform === 'function') {
                spriteAny.updateTransform();
            }

            aim.countLeft--;
            TaskService.recordCollection(aim.image);

            this.updateAimCounters(700);

            let delay = 0;
            let animationTime = 700;

            this.game.add.tween(sprite).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay + animationTime - 100, 0, false)
            this.game.add.tween(sprite).to(
                {
                    x: [aim.sprite.x],
                    y: [aim.sprite.y + this.screen.camera.y]
                },
                animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)//.interpolation(Phaser.Math.bezierInterpolation).start();
            // this.game.add.tween(sprite.scale).to({ x: 1.45, y: 1.45 }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)
            this.game.add.tween(sprite.scale).to({ x: 1, y: 1 }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)
            this.game.add.tween(sprite).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay + animationTime - 100, 0, false)

            aim.label.bringToTop();
            this.game.time.events.add(1, () => {
                sprite.bringToTop();
                // this.screen.bringUiToTop();
            })
            return true;
        }
        return false;
    }

    public tryCollectCankerberry(cover: ForestCellCover) {
        let aim = this.aims.filter(aim => aim.type == AimType.cankerberry).shift();
        let cankerberry = cover.tearOffCankerberry();

        if (aim && cankerberry) {
            
            aim.countLeft--;
            TaskService.recordCollection(aim.image);

            this.updateAimCounters(700);

            let delay = 200;
            let animationTime = 700;

            cankerberry.x = cankerberry.x + cover.x;
            cankerberry.y = cankerberry.y + cover.y;
            this.game.add.existing(cankerberry);

            if(AdminService.cacheComplexImages()){
                cover.cacheAsBitmap = false; 
                cover.cacheAsBitmap = true;
            }

            cankerberry.inputEnabled = false;

            // this.game.add.tween(cankerberry).to({ rotation: 0, width:cover.cover.width, height:cover.cover.height},animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);

            this.game.add.tween(cankerberry).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay + animationTime - 100, 0, false)

            console.log("aim.sprite.x: " + aim.sprite.x)
            console.log("aim.sprite.y: " + aim.sprite.y)

            this.game.add.tween(cankerberry).to(
                {
                    x: [aim.sprite.x],
                    y: [aim.sprite.y + this.screen.camera.y]
                },
                animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)//.interpolation(Phaser.Math.bezierInterpolation).start();

            aim.label.bringToTop();
            this.game.time.events.add(1, () => {
                cankerberry.bringToTop();
                // this.screen.bringUiToTop();
            })
        }
    }

    public tryCollectBlueberry(berries: Phaser.Sprite[]) {
        let aim = this.aims.filter(aim => aim.type == AimType.blueberry || aim.type == AimType.redberry).shift();

        if (aim && berries) {
            aim.countLeft -= berries.length;
            TaskService.recordCollection(aim.image, berries.length);

            this.updateAimCounters(700);

            let delay = 200;
            let animationTime = 700;

            berries.forEach(berry => {
                this.game.add.tween(berry).to({ rotation: 0, width: BaseCellsProvider.CELL_WIDTH, height: BaseCellsProvider.CELL_HEIGHT }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);

                this.game.add.tween(berry).to({ alpha: 0 }, 100, Settings.isOnlyLinearAnimations() ? Phaser.Easing.Linear.None : Phaser.Easing.Exponential.In, true, delay + animationTime - 100, 0, false)

                this.game.add.tween(berry).to(
                    {
                        x: [aim.sprite.x],
                        y: [aim.sprite.y + this.screen.camera.y]
                    },
                    animationTime, Phaser.Easing.Linear.None, true, delay, 0, false)//.interpolation(Phaser.Math.bezierInterpolation).start();

                delay += 100;
            })

            aim.label.bringToTop();

            this.game.time.events.add(1, () => {
                berries.forEach(berry => {
                    berry.bringToTop();
                })
                // this.screen.bringUiToTop();
            })
        }
    }

    private addAimWithLabel(aim: ForestAim, shiftX: number): void {
        let image = SpriteUtils.createSprite(this.game, 370 + shiftX, 57, aim.image);
        image.anchor = new Phaser.Point(0.5, 0.5);
        let imageScale = 82 / Math.max(image.width, image.height);
        image.scale.set(imageScale, imageScale);
        // image.scale = new Phaser.Point(1.5, 1.5);
        this.addSprite(image);

        let label = new Label(this.game, 370 + 18 + shiftX, 60, "" + aim.countLeft, Label.AIM_STYLE);
        this.addSprite(label);

        aim.label = label;
        aim.sprite = image;
    }
}
