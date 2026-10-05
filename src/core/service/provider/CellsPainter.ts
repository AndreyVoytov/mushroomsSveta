import Label from '../../../view/component/panel/Label';
import DebugScreen from '../../../view/screen/common/DebugScreen';
import { ContentType, DecorationsContents } from '../../model/enum/ContentType';
import BiomType from '../../model/enum/BiomType';
import Environment from '../../model/enum/Environment';
import OpeningType from '../../model/enum/OpeningType';
import ForestCell from '../../model/forest/ForestCell';
import { NumberedTreeParticleCloud } from '../../model/forest/CellState';
import ForestType from '../../model/forest/ForestType';
import ForestUtils from '../../utils/ForestUtils';
import AnimationUtils from '../../utils/AnimationUtils';
import SpriteUtils from '../../utils/SpriteUtils';
import SoundUtils from '../../utils/SoundUtils';
import Utils from '../../utils/Utils';
import AdminService from './../AdminService';
import BaseCellsProvider from './BaseCellsProvider';
import BoostersProvider from './BoosterProvider';
import CellsProvider from './CellsProvider';


export default class CellsPainter extends CellsProvider {
    private static readonly HIVE_HONEY_LABEL_LEGACY = false;
    private static readonly MEGA_HIVE_SCALE = 0.8;
    private static readonly NUMBERED_TREE_PARTICLE_LIFETIME = 13770;
    // Set to false to restore the original scenery with separate number labels.
    public static USE_NUMBERED_TREE_IMAGES = true;

    public constructor(forestType: ForestType, game: Phaser.Game) {
        super(forestType, game);
    }

    public addCellSprite(game: Phaser.Game, screen: DebugScreen, cell: ForestCell, boostersProvider: BoostersProvider): void {
        if (cell.state.content == ContentType.lilly) {
            let underSprite = SpriteUtils.createSprite(game, this.calculateX(cell), this.calculateY(cell), ContentType[ContentType.wlilly1]);
            underSprite.anchor = new Phaser.Point(0.5, 0.5);
            underSprite.width = BaseCellsProvider.CELL_WIDTH;
            underSprite.height = BaseCellsProvider.CELL_HEIGHT;
            screen.add.existing(underSprite);
            underSprite.visible = false;
            underSprite.alpha = 0;
            cell.state.underSprite = underSprite;
        }

        let image = this.getContentImage(cell);
        if (cell.state.content == ContentType.specificItem || cell.state.content == ContentType.randomItem) {
            image = String(cell.state.metaValue)
        } else if (cell.state.content == ContentType.hive) {
            image = this.getHiveImage(cell);
        }

        const adjucentCount = this.getAdjucentInteractiveCount(this.getCells(), cell);
        const numberedImage = this.getNumberedDecorationImage(cell, adjucentCount);
        if (numberedImage) {
            image = numberedImage;
        }
        cell.state.numberedDecoration = (this.isDarkForestDecoration(cell) || !!numberedImage) && adjucentCount >= 1 && adjucentCount <= 5;
        cell.state.renderedAdjucentCount = adjucentCount;
        cell.state.renderedContentImage = image;

        let spritePosition = cell.state.content == ContentType.hive && this.isMegaHiveAnchor(cell) ? this.getMegaHiveCenter(cell) :
            new Phaser.Point(this.calculateX(cell), this.calculateY(cell));
        let cellSprite = SpriteUtils.createSprite(game, spritePosition.x, spritePosition.y, image);
        cellSprite.anchor = new Phaser.Point(0.5, 0.5);

        if (this.isMegaHiveAnchor(cell)) {
            cellSprite.scale.set(CellsPainter.MEGA_HIVE_SCALE);
        } else {
            cellSprite.width = BaseCellsProvider.CELL_WIDTH;
            cellSprite.height = BaseCellsProvider.CELL_HEIGHT;
        }

        if (cell.state.content == ContentType.bird || cell.state.content == ContentType.sheep || cell.state.content == ContentType.duck) {
            // Use the same pose and size on the board and at animation start.
            const animal = cell.state.content == ContentType.bird ? 'bird' : cell.state.content == ContentType.sheep ? 'ram' : 'duck';
            const size = animal == 'bird' ? 1.25 : animal == 'ram' ? 1.3 : 1;
            cellSprite.loadTexture(animal + 'Escape', 0);
            cellSprite.width = 120 * size;
            cellSprite.height = 127 * size;
        }
        screen.add.existing(cellSprite);
        cell.state.sprite = cellSprite;
        cell.state.baseScaleX = cellSprite.scale.x;
        cell.state.baseScaleY = cellSprite.scale.y;
        this.updateWaterNumberLabel(cell, adjucentCount);
        this.updateDarkForestNumberLabel(cell, adjucentCount);

        if (boostersProvider && ForestUtils.isBoosterType(cell.type)) {
            cellSprite.events.onInputDown.add(() => {
                if (boostersProvider.activateBooster(cell)) {
                    cellSprite.events.onInputDown.removeAll();
                }
            });
            cellSprite.inputEnabled = true;
            if (ForestUtils.getBoosterInfo(cell.type).getOpeningType() != OpeningType.byRocket) {
                cellSprite.scale = new Phaser.Point(1.2, 1.2);
            }
            game.time.events.add(1000 + 100 * Utils.random(6), () => {
                ForestUtils.tryAnimateBooster(game, cell);
            })
        }

        if (cell.state.content == ContentType.bush || cell.state.content == ContentType.bush2) {
            let isBlue = cell.state.content == ContentType.bush2;
            let berriesCount = Number(cell.state.metaValue);
            // let angleStart = Utils.random(180);
            let angleStart = 0;
            for (let i = 0; i < berriesCount; i++) {
                let berryAngle = angleStart + i * 360 / berriesCount;
                let berry = SpriteUtils.createSprite(game, this.calculateX(cell), this.calculateY(cell), isBlue ? "blueberry" : "redberry");
                berry.angle = berryAngle;
                berry.scale.set(0.5);
                berry.anchor.set(0.5)
                let r = 30;
                berry.x += Math.cos(berry.rotation) * r;
                berry.y += Math.sin(berry.rotation) * r;

                berry.angle += 180;
                console.log("BERRY: 90")

                screen.add.existing(berry);
                cell.state.berries.push(berry)
            }
        }

        if (cell.state.content == ContentType.hive) {
            if (this.isMegaHiveHiddenPart(cell)) {
                cell.state.sprite.visible = false;
            } else {
                let labelPosition = this.isMegaHiveAnchor(cell) ? { x: 0, y: 18 } : { x: 20, y: 20 };
                this.addHiveHoneyLabel(game, cell, labelPosition.x, labelPosition.y);

                if (!this.isMegaHiveAnchor(cell)) {
                    cell.state.sprite.x -= 5;
                    cell.state.sprite.y -= -3;
                }
            }
        }

        if (cell.state.content == ContentType.moonflowerClosed) {
            // cell.state.metaValue = "2";
            cell.state.metaValue = "" + (Utils.random(3) + 1);
            console.log("META VALUE: " + cell.state.metaValue)
            SpriteUtils.loadTexture(cellSprite, "moonflowerClosed" + cell.state.metaValue)
            cellSprite.width = BaseCellsProvider.CELL_WIDTH;
            cellSprite.height = BaseCellsProvider.CELL_HEIGHT;
        }

        if (cell.state.content == ContentType.amber) {
            cell.state.metaValue = "" + (Utils.random(3) + 1);
            console.log("META VALUE: " + cell.state.metaValue)
            SpriteUtils.loadTexture(cellSprite, "amber" + (cell.state.metaValue != "1" ? cell.state.metaValue : ""))
            cellSprite.width = BaseCellsProvider.CELL_WIDTH;
            cellSprite.height = BaseCellsProvider.CELL_HEIGHT;
        }

        if (cell.state.content == ContentType.book1) {
            cell.state.sprite.width = BaseCellsProvider.CELL_WIDTH * 1.15;
            cell.state.sprite.height = BaseCellsProvider.CELL_HEIGHT * 1.15;
        }

        // Variant texture swaps must keep the cell-sized display and animation baseline.
        cell.state.baseScaleX = cellSprite.scale.x;
        cell.state.baseScaleY = cellSprite.scale.y;

        if (!ForestUtils.isCoverFreeNotBoosterItem(cell.type) && !ForestUtils.isBoosterType(cell.type) && !AdminService.isTransparentMode()) {
            cell.state.sprite.visible = false;
            cell.bg.visible = false;
        }
    }

    public updateNumberedDecoration(cell: ForestCell, adjucentCount: number): boolean {
        const previousCount = cell.state.renderedAdjucentCount;
        const wasNumberedTree = cell.state.numberedDecoration;
        const numberedImage = this.getNumberedDecorationImage(cell, adjucentCount);
        const image = numberedImage || this.getContentImage(cell);
        cell.state.numberedDecoration = (this.isDarkForestDecoration(cell) || !!numberedImage) && adjucentCount >= 1 && adjucentCount <= 5;
        cell.state.renderedAdjucentCount = adjucentCount;

        if (cell.state.sprite && cell.state.renderedContentImage != image && cell.state.content in DecorationsContents) {
            this.stopNumberedTreeReaction(cell);
            SpriteUtils.loadTexture(cell.state.sprite, image);
            cell.state.sprite.width = BaseCellsProvider.CELL_WIDTH;
            cell.state.sprite.height = BaseCellsProvider.CELL_HEIGHT;
            cell.state.baseScaleX = cell.state.sprite.scale.x;
            cell.state.baseScaleY = cell.state.sprite.scale.y;
            cell.state.renderedContentImage = image;
            AnimationUtils.primeForShow(cell.state.sprite);
        }
        this.updateWaterNumberLabel(cell, adjucentCount);
        this.updateDarkForestNumberLabel(cell, adjucentCount);

        this.updateNumberedTreeEffect(cell);
        if (cell.state.opened && wasNumberedTree && previousCount != null && adjucentCount < previousCount) {
            this.emitNumberChangeDust(cell.state.sprite, cell.state.content == ContentType.mirror);
            this.animateNumberedTreeReaction(cell, image);
        }

        return cell.state.numberedDecoration;
    }

    private animateNumberedTreeReaction(cell: ForestCell, image: string): void {
        const state = cell.state;
        const sprite = state.sprite;
        if (!sprite) return;

        this.stopNumberedTreeReaction(cell);
        SoundUtils.treeRustle();
        state.numberedTreeReactionOrigin = { x: sprite.x, y: sprite.y };

        const smallDecor = image == 'stump' || image == 'log' || image == 'rottenStump' || image == 'cobwebDarkLog';
        const duration = smallDecor ? 400 + Utils.random(150) : 620 + Utils.random(220);
        const direction = Utils.random(2) == 0 ? -1 : 1;
        const angles = (smallDecor ? [-2, 2, 0] : [-4, 3, -2, 1, 0]).map(angle => angle * direction);
        const sway = sprite.game.add.tween(sprite).to(
            { angle: angles }, duration, Phaser.Easing.Sinusoidal.InOut, true
        );
        state.numberedTreeSwayTween = sway;
        sway.onUpdateCallback(() => {
            const origin = state.numberedTreeReactionOrigin;
            if (!origin || state.numberedTreeSwayTween != sway) return;
            // Keep the point near the trunk/base fixed without changing the
            // Sprite anchor, which can flash at a stale PIXI transform.
            const distanceToBase = (0.92 - sprite.anchor.y) * sprite.height;
            const angle = sprite.angle * Math.PI / 180;
            sprite.x = origin.x + Math.sin(angle) * distanceToBase;
            sprite.y = origin.y + (1 - Math.cos(angle)) * distanceToBase;
        });
        sway.onComplete.addOnce(() => {
            if (state.numberedTreeSwayTween == sway) {
                sprite.angle = 0;
                this.restoreNumberedTreePosition(cell);
                state.numberedTreeSwayTween = null;
            }
        });

        if (smallDecor) {
            const pulse = sprite.game.add.tween(sprite.scale).to({
                x: [state.baseScaleX * 1.04, state.baseScaleX],
                y: [state.baseScaleY * 0.96, state.baseScaleY]
            }, duration, Phaser.Easing.Sinusoidal.InOut, true);
            state.numberedTreePulseTween = pulse;
            pulse.onComplete.addOnce(() => {
                if (state.numberedTreePulseTween == pulse) {
                    sprite.scale.set(state.baseScaleX, state.baseScaleY);
                    state.numberedTreePulseTween = null;
                }
            });
        } else {
            state.numberedTreePulseTween = null;
        }
    }

    private emitNumberChangeDust(sprite: Phaser.Sprite, red?: boolean): void {
        if (!sprite) return;
        const game = sprite.game;
        const particles: Phaser.Sprite[] = [];
        for (let i = 0; i < 8; i++) {
            const particle = SpriteUtils.createSprite(game, Utils.random(13) - 6, -22 + Utils.random(13) - 6, 'dustYellow');
            if (red) particle.tint = 0xff453c;
            particle.anchor.set(0.5);
            // Children inherit the tree's ~0.67 scale; keep the dust visible on screen.
            particle.scale.set(0.72 + Utils.random(25) / 100);
            particle.alpha = 0;
            particle.visible = false;
            sprite.addChild(particle);
            particles.push(particle);
        }

        // Prime child transforms before making the burst visible (avoids a flash at 0, 0).
        AnimationUtils.primeForShow(sprite);
        game.time.events.add(1, () => {
            particles.forEach(particle => {
                if (particle.exists === false || !particle.parent) return;
                AnimationUtils.primeForShow(particle);
                particle.visible = true;
                const angle = Math.random() * Math.PI * 2;
                const distance = 34 + Utils.random(26);
                game.add.tween(particle).to({ alpha: 1 }, 120, Phaser.Easing.Linear.None, true)
                    .onComplete.addOnce(() => {
                        if (particle.exists !== false) {
                            game.add.tween(particle).to({ alpha: 0 }, 390, Phaser.Easing.Linear.None, true);
                        }
                    });
                game.add.tween(particle).to({
                    x: particle.x + Math.cos(angle) * distance,
                    y: particle.y + Math.sin(angle) * distance + 8
                }, 750, Phaser.Easing.Quadratic.Out, true).onComplete.addOnce(() => particle.destroy());
            });
        });
    }

    private stopNumberedTreeReaction(cell: ForestCell): void {
        const state = cell.state;
        if (!state.numberedTreeSwayTween && !state.numberedTreePulseTween
            && !state.numberedTreeReactionOrigin) return;
        if (state.numberedTreeSwayTween) state.numberedTreeSwayTween.stop();
        if (state.numberedTreePulseTween) state.numberedTreePulseTween.stop();
        state.numberedTreeSwayTween = null;
        state.numberedTreePulseTween = null;
        this.restoreNumberedTreePosition(cell);
        if (state.sprite) {
            state.sprite.angle = 0;
            state.sprite.scale.set(state.baseScaleX, state.baseScaleY);
        }
    }

    private restoreNumberedTreePosition(cell: ForestCell): void {
        const state = cell.state;
        const origin = state.numberedTreeReactionOrigin;
        if (!origin || !state.sprite) return;

        state.sprite.x = origin.x;
        state.sprite.y = origin.y;
        state.numberedTreeReactionOrigin = null;
    }

    private updateNumberedTreeEffect(cell: ForestCell): void {
        const state = cell.state;
        const game = state.sprite && state.sprite.game;
        if (state.opened && state.numberedDecoration && state.sprite) {
            if (state.numberedTreeEffect) return;

            const particles = game.add.group();
            state.sprite.addChild(particles);
            const effect = game.add.group();
            state.sprite.addChild(effect);
            effect.alpha = 0;

            const shine = SpriteUtils.createSprite(game, 0, -10, 'splashY');
            shine.anchor.set(0.5);
            shine.scale.set(0.825);
            shine.alpha = 0.145;
            if (state.content == ContentType.mirror) shine.tint = 0xff453c;
            if (state.content == ContentType.wlilly1 || state.content == ContentType.wlilly2) shine.tint = 0xffdc3f;
            effect.add(shine);
            game.add.tween(shine).to({ angle: 360 }, 20000, Phaser.Easing.Linear.None, true, 0, -1);

            state.numberedTreeEffect = effect;
            const cloud: NumberedTreeParticleCloud = { group: particles, timer: null, stopped: false, particles: [],
                tint: state.content == ContentType.mirror ? 0xff453c :
                    (state.content == ContentType.wlilly1 || state.content == ContentType.wlilly2) ? 0xffdc3f : 0xffffff };
            state.numberedTreeParticles = cloud;
            this.emitNumberedTreeParticle(game, cloud);
            cloud.timer = game.time.events.loop(1283, () => {
                if (!cloud.stopped) this.emitNumberedTreeParticle(game, cloud);
            });
            game.add.tween(effect).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
        } else if (state.numberedTreeEffect) {
            const effect = state.numberedTreeEffect;
            const cloud = state.numberedTreeParticles;
            cloud.stopped = true;
            game.time.events.remove(cloud.timer);
            cloud.timer = null;
            state.numberedTreeParticles = null;
            cloud.particles.forEach(entry => {
                if (!entry.sprite.exists) return;
                if (entry.alphaTween) entry.alphaTween.stop();
                if (entry.startedAt == null) {
                    entry.sprite.destroy();
                    return;
                }
                const remaining = Math.max(0, CellsPainter.NUMBERED_TREE_PARTICLE_LIFETIME
                    - (game.time.now - entry.startedAt));
                entry.alphaTween = game.add.tween(entry.sprite).to(
                    { alpha: 0 }, Math.max(1, remaining / 2), Phaser.Easing.Linear.None, true
                );
            });
            if (cloud.group.children.length == 0) cloud.group.destroy(true);
            game.tweens.removeFrom(effect);
            state.numberedTreeEffect = null;
            game.add.tween(effect).to({ alpha: 0 }, 1800, Phaser.Easing.Linear.None, true)
                .onComplete.addOnce(() => {
                    effect.children.forEach(child => game.tweens.removeFrom(child));
                    effect.destroy(true);
                });
        }
    }

    private emitNumberedTreeParticle(game: Phaser.Game, cloud: NumberedTreeParticleCloud): void {
        const side = Utils.random(2) == 0 ? -1 : 1;
        const x = side * (14 + Utils.random(27));
        const y = -10 + Utils.random(57) - 28;
        const particle = SpriteUtils.createSprite(game, x, y, 'p1');
        particle.tint = cloud.tint == null ? 0xffffff : cloud.tint;
        particle.anchor.set(0.5);
        particle.scale.set(0.22 + Utils.random(13) / 100);
        particle.alpha = 0;
        particle.visible = false;
        cloud.group.add(particle);
        const entry = { sprite: particle, alphaTween: null as Phaser.Tween, startedAt: null as number };
        cloud.particles.push(entry);

        // Two spawn bands flank the number; each particle moves away from it.
        const spreadAngle = (Math.random() - 0.5) * Math.PI / 3;
        const distance = 40 + Utils.random(41);
        const driftX = side * Math.cos(spreadAngle) * distance;
        const driftY = Math.sin(spreadAngle) * distance;
        // PIXI may render a newly attached child once with its stale (0, 0)
        // world transform. Keep it hidden until the parent transform is ready.
        AnimationUtils.primeForShow(cloud.group);
        game.time.events.add(1, () => {
            if (particle.exists === false || !particle.parent) return;
            if (cloud.stopped) {
                particle.destroy();
                return;
            }
            AnimationUtils.primeForShow(particle);
            particle.visible = true;
            entry.startedAt = game.time.now;
            entry.alphaTween = game.add.tween(particle).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
            entry.alphaTween
                .onComplete.addOnce(() => {
                    if (particle.exists !== false && !cloud.stopped) {
                        entry.alphaTween = game.add.tween(particle).to(
                            { alpha: 0 }, CellsPainter.NUMBERED_TREE_PARTICLE_LIFETIME - 300,
                            Phaser.Easing.Linear.None, true
                        );
                    }
                });
            game.add.tween(particle).to(
                { x: x + driftX, y: y + driftY, angle: Utils.random(90) - 45 },
                CellsPainter.NUMBERED_TREE_PARTICLE_LIFETIME, Phaser.Easing.Linear.None, true
            ).onComplete.addOnce(() => {
                particle.destroy();
                cloud.particles.splice(cloud.particles.indexOf(entry), 1);
                if (cloud.stopped && cloud.group.children.length == 0) {
                    cloud.group.destroy(true);
                }
            });
        });
    }

    private getNumberedDecorationImage(cell: ForestCell, adjucentCount: number): string | null {
        if (!CellsPainter.USE_NUMBERED_TREE_IMAGES || !(cell.state.content in DecorationsContents)
            || cell.biomType == BiomType.WATER
            || cell.state.content == ContentType.wlilly1 || cell.state.content == ContentType.wlilly2) {
            return null;
        }

        // Dark-forest objects use their own silhouettes; render the neighbour
        // count as a small live label rather than replacing that artwork with
        // the generic numbered tree texture.
        if (this.forestType.environment == Environment.darkForest) return null;

        if (adjucentCount >= 1 && adjucentCount <= 5) {
            if (cell.state.opened) {
                cell.state.hadNumberedTree = true;
            }
            return this.forestType.environment == Environment.house && cell.state.content == ContentType.mirror
                ? 'mirror_num' + adjucentCount
                : 'tree_num' + adjucentCount;
        }

        if (this.forestType.environment == Environment.house && cell.state.content == ContentType.mirror) {
            return 'mirror';
        }

        if (cell.state.hadNumberedTree) {
            // Pick once so repeated label refreshes cannot shuffle the scenery.
            if (!cell.state.finalTreeImage) {
                const finalImages = ['tree', 'stump', 'log'];
                cell.state.finalTreeImage = finalImages[Utils.random(finalImages.length)];
            }
            return cell.state.finalTreeImage;
        }

        // An unnumbered cell may keep its original non-tree scenery, but it
        // must never reveal a plain tree before showing a number.
        if (cell.state.content == ContentType.tree) {
            if (!cell.state.numberlessDecorationImage) {
                cell.state.numberlessDecorationImage = Utils.random(2) == 0 ? 'stump' : 'log';
            }
            return cell.state.numberlessDecorationImage;
        }
        return null;
    }

    private isDarkForestDecoration(cell: ForestCell): boolean {
        return this.forestType.environment == Environment.darkForest
            && (cell.state.content == ContentType.stone || cell.state.content == ContentType.tree
                || cell.state.content == ContentType.stump || cell.state.content == ContentType.log);
    }

    private getContentImage(cell: ForestCell): string {
        if (cell.state.content == ContentType.specificItem || cell.state.content == ContentType.randomItem) {
            return String(cell.state.metaValue);
        }
        if (cell.state.content == ContentType.hive) return this.getHiveImage(cell);
        if (this.forestType.environment == Environment.darkForest) {
            if (cell.state.content == ContentType.stone) return 'mossStone';
            if (cell.state.content == ContentType.tree) return 'darkTree';
            if (cell.state.content == ContentType.stump) return 'rottenStump';
            if (cell.state.content == ContentType.log) return 'cobwebDarkLog';
        }
        return ContentType[cell.state.content];
    }

    private updateDarkForestNumberLabel(cell: ForestCell, count: number): void {
        if (!this.isDarkForestDecoration(cell)) return;
        let label = cell.state.numberedDecorationLabel;
        if (count < 1 || count > 5) {
            if (label) { label.destroy(); cell.state.numberedDecorationLabel = null; }
            return;
        }
        if (!label) {
            label = new Label(cell.state.sprite.game, 34, 31, '' + count, {
                font: 'bold 38px Gilroy', fill: '#fff2bc', stroke: '#34402a', strokeThickness: 6,
                align: 'center'
            });
            label.anchor.set(0.5);
            label.inputEnabled = false;
            cell.state.sprite.addChild(label);
            cell.state.numberedDecorationLabel = label;
        }
        label.text = '' + count;
    }

    // Water decorations keep their artwork, with hand-painted number glyphs
    // layered on top to match the numbered tree textures.
    private updateWaterNumberLabel(cell: ForestCell, count: number): void {
        if (cell.state.content != ContentType.wlilly1 && cell.state.content != ContentType.wlilly2) return;
        const current = cell.state.numberedWaterLabel;
        if (count < 1 || count > 5) {
            if (current) { current.destroy(); cell.state.numberedWaterLabel = null; }
            return;
        }
        if (!current) {
            const game = cell.state.sprite.game;
            const label = SpriteUtils.createSprite(game, cell.state.content == ContentType.wlilly2 ? 3 : 1,
                cell.state.content == ContentType.wlilly2 ? -3 : 4, 'water_num' + count);
            label.anchor.set(0.5);
            // Keep water digits as readable as the numbers painted into trees.
            label.width = cell.state.content == ContentType.wlilly2 ? 148 : 142;
            label.height = label.width;
            label.inputEnabled = false;
            cell.state.sprite.addChild(label);
            cell.state.numberedWaterLabel = label;
            game.add.tween(label).to({ alpha: [0.84, 1, 0.9, 1] }, 1450,
                Phaser.Easing.Sinusoidal.InOut, true, 0, -1);
        }
        SpriteUtils.loadTexture(cell.state.numberedWaterLabel, 'water_num' + count);
        cell.state.numberedDecoration = true;
    }

    private addHiveHoneyLabel(game: Phaser.Game, cell: ForestCell, x: number, y: number): void {
        let honeyCount = Number(cell.state.metaValue);
        const legacy = CellsPainter.HIVE_HONEY_LABEL_LEGACY;
        const labelStyle = legacy
            ? Label.HiveDigitsLegacy(40)
            : Label.BalsamiqSansBoldBold(40, "#ac622c");
        const scaleCompensation = this.isMegaHiveAnchor(cell) ? 1 / CellsPainter.MEGA_HIVE_SCALE : 1;

        cell.state.honeyLabel = new Label(game, x, y, "" + honeyCount, labelStyle);
        cell.state.honeyLabel.anchor.set(0.5);
        cell.state.honeyLabel.scale.set(scaleCompensation, scaleCompensation);

        let bg = SpriteUtils.createSprite(game, x, y - 5, "honey2");
        bg.anchor.set(0.5);
        bg.scale.set(scaleCompensation, 0.9 * scaleCompensation);
        cell.state.sprite.addChild(bg);
        cell.state.sprite.addChild(cell.state.honeyLabel);

        const beeCount = Math.min(3, Math.max(0, honeyCount));
        for (let i = 0; i < beeCount; i++) {
            const bee = SpriteUtils.createSprite(game, 0, 0, 'bee');
            bee.anchor.set(0.5);
            bee.scale.set(0.20, 0.20);
            bee.inputEnabled = false;
            cell.state.sprite.addChild(bee);
            const phase = i / beeCount * Math.PI * 2;
            const radiusX = this.isMegaHiveAnchor(cell) ? 72 : 43;
            const radiusY = this.isMegaHiveAnchor(cell) ? 40 : 28;
            bee.x = Math.cos(phase) * radiusX;
            bee.y = -36 + Math.sin(phase) * radiusY;
            game.add.tween(bee).to({
                x: [Math.cos(phase + 1.6) * radiusX, Math.cos(phase + 3.2) * radiusX, Math.cos(phase + 6.28) * radiusX],
                y: [-36 + Math.sin(phase + 1.6) * radiusY, -36 + Math.sin(phase + 3.2) * radiusY, -36 + Math.sin(phase + 6.28) * radiusY],
                angle: [12, -12, 0]
            }, 2600 + i * 180, Phaser.Easing.Linear.None, true, i * 140, -1, false)
                .interpolation(Phaser.Math.catmullRomInterpolation);
            cell.state.hiveBees.push(bee);
        }
        if (beeCount > 0) {
            cell.state.hiveBuzzSound = game.sound.play('hiveBuzz', 0.05, true);
        }
    }

    public updateHiveBees(game: Phaser.Game, cell: ForestCell, remainingHoney: number): void {
        const targetCount = Math.min(3, Math.max(0, remainingHoney));
        while (cell.state.hiveBees.length > targetCount) {
            const bee = cell.state.hiveBees.pop();
            if (!bee) continue;
            game.tweens.removeFrom(bee);
            game.add.tween(bee).to({ alpha: 0, width: 0, height: 0 }, 240,
                Phaser.Easing.Quadratic.In, true).onComplete.addOnce(() => bee.destroy());
        }
        if (targetCount == 0 && cell.state.hiveBuzzSound) {
            cell.state.hiveBuzzSound.stop();
            cell.state.hiveBuzzSound = null;
        }
    }

    private getMegaHiveCenter(cell: ForestCell): Phaser.Point {
        let hiveCells = this.getHiveGroupCells(cell);
        let x = hiveCells.map(hiveCell => this.calculateX(hiveCell)).reduce((sum, current) => sum + current, 0) / hiveCells.length;
        let y = hiveCells.map(hiveCell => this.calculateY(hiveCell)).reduce((sum, current) => sum + current, 0) / hiveCells.length;
        return new Phaser.Point(x, y);
    }

}
