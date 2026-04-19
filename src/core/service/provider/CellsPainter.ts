import Label from '../../../view/component/panel/Label';
import DebugScreen from '../../../view/screen/common/DebugScreen';
import { ContentType } from '../../model/enum/ContentType';
import OpeningType from '../../model/enum/OpeningType';
import ForestCell from '../../model/forest/ForestCell';
import ForestType from '../../model/forest/ForestType';
import ForestUtils from '../../utils/ForestUtils';
import SpriteUtils from '../../utils/SpriteUtils';
import Utils from '../../utils/Utils';
import AdminService from './../AdminService';
import BaseCellsProvider from './BaseCellsProvider';
import BoostersProvider from './BoosterProvider';
import CellsProvider from './CellsProvider';


export default class CellsPainter extends CellsProvider {
    private static readonly HIVE_HONEY_LABEL_LEGACY = false;
    private static readonly MEGA_HIVE_SCALE = 0.8;

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

        let image = ContentType[cell.state.content];
        if (cell.state.content == ContentType.specificItem || cell.state.content == ContentType.randomItem) {
            image = String(cell.state.metaValue)
        } else if (cell.state.content == ContentType.hive) {
            image = this.getHiveImage(cell);
        }

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

        screen.add.existing(cellSprite);
        cell.state.sprite = cellSprite;
        cell.state.baseScaleX = cellSprite.scale.x;
        cell.state.baseScaleY = cellSprite.scale.y;

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
            cellSprite.scale.set(1);
        }

        if (cell.state.content == ContentType.amber) {
            cell.state.metaValue = "" + (Utils.random(3) + 1);
            console.log("META VALUE: " + cell.state.metaValue)
            SpriteUtils.loadTexture(cellSprite, "amber" + (cell.state.metaValue != "1" ? cell.state.metaValue : ""))
            cellSprite.scale.set(1);
        }

        if (cell.state.content == ContentType.book1) {
            cell.state.sprite.scale.set(1.15, 1.15)
        }

        if (!ForestUtils.isCoverFreeNotBoosterItem(cell.type) && !ForestUtils.isBoosterType(cell.type) && !AdminService.isTransparentMode()) {
            cell.state.sprite.visible = false;
            cell.bg.visible = false;
        }
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
    }

    private getMegaHiveCenter(cell: ForestCell): Phaser.Point {
        let hiveCells = this.getHiveGroupCells(cell);
        let x = hiveCells.map(hiveCell => this.calculateX(hiveCell)).reduce((sum, current) => sum + current, 0) / hiveCells.length;
        let y = hiveCells.map(hiveCell => this.calculateY(hiveCell)).reduce((sum, current) => sum + current, 0) / hiveCells.length;
        return new Phaser.Point(x, y);
    }

}
