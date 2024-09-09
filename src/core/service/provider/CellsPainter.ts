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
            // underSprite.width = 0;
            // underSprite.height = 0;
            cell.state.underSprite = underSprite;
        }

        let image = ContentType[cell.state.content];
        if (cell.state.content == ContentType.specificItem || cell.state.content == ContentType.randomItem) {
            image = String(cell.state.metaValue)
        }

        let cellSprite = SpriteUtils.createSprite(game, this.calculateX(cell), this.calculateY(cell), image);
        cellSprite.anchor = new Phaser.Point(0.5, 0.5);
        cellSprite.width = BaseCellsProvider.CELL_WIDTH;
        cellSprite.height = BaseCellsProvider.CELL_HEIGHT;
        screen.add.existing(cellSprite);
        cell.state.sprite = cellSprite;

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

        if (cell.state.content == ContentType.bush) {
            let berriesCount = Number(cell.state.metaValue);
            // let angleStart = Utils.random(180);
            let angleStart = 0;
            for (let i = 0; i < berriesCount; i++) {
                let berryAngle = angleStart + i * 360 / berriesCount;
                let berry = SpriteUtils.createSprite(game, this.calculateX(cell), this.calculateY(cell), "blueberry");
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
            let honeyCount = Number(cell.state.metaValue);
            cell.state.honeyLabel = new Label(game, 20, 20, "" + honeyCount, { font: "35px Arial", fill: "#fde700" })
            cell.state.honeyLabel.addStrokeColor("#6c2e11", 0)
            cell.state.honeyLabel.strokeThickness = 8;

            cell.state.honeyLabel.anchor.set(0.5)
            let bg = SpriteUtils.createSprite(game, 20, 15, "honey2");
            bg.anchor.set(0.5)
            bg.scale.set(1, 0.9)
            cell.state.sprite.addChild(bg);
            cell.state.sprite.addChild(cell.state.honeyLabel);

            cell.state.sprite.x -= 5;
            cell.state.sprite.y -= -3;
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

}