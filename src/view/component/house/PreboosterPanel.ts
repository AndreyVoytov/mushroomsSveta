import BasePanel from '../../component/panel/BasePanel';
import BoosterSlot from '../house/BoosterSlot';
import BoosterType from '../../../core/model/enum/BoosterType';
import UserService from '../../../core/service/UserService';
import Utils from '../../../core/utils/Utils';
import StartLevelPanel from './StartLevelPanel';
import ShopPanel from './ShopPanel';
import { Sound } from 'phaser-ce';
import SoundUtils from '../../../core/utils/SoundUtils';

export default class PreboosterPanel extends BasePanel {

    public static LEVEL_WITH_PRIZE_COMPASSES = 7;

    private slot1: BoosterSlot;
    private slot2: BoosterSlot;
    private slot3: BoosterSlot;

    private screen: Phaser.State;

    constructor(game: Phaser.Game, screen: Phaser.State, x: number, y: number) {
        super(game, x, y);
        this.game = game;
        this.screen = screen;

        this.addSprite(this.slot1 = new BoosterSlot(game, -194 - this.x, 184- this.y, BoosterType.compass, (type)=> {this.markBooster(type)}));
        this.addSprite(this.slot2 = new BoosterSlot(game, 0- this.x, 181- this.y, BoosterType.rocket, (type)=> {this.markBooster(type)}));
        this.addSprite(this.slot3 = new BoosterSlot(game, 195- this.x, 180- this.y, BoosterType.vision, (type)=> {this.markBooster(type)}));

        this.refresh();

    }

    private markBooster(type:BoosterType) {
        let user = UserService.getUser();

        if (user.getBoostersCount(type) > 0) {
            if (StartLevelPanel.PREBOOSTERS_TO_SPEND.indexOf(type) == -1) {
                StartLevelPanel.PREBOOSTERS_TO_SPEND.push(type);
            } else {
                Utils.delete(StartLevelPanel.PREBOOSTERS_TO_SPEND, type);
            }
            SoundUtils.boosterSelect();
                this.refresh();
        } else {
            let shopPanel = new ShopPanel(this.game, this.screen, () => { this.refresh() });
            this.screen.add.existing(shopPanel);
            shopPanel.show()
        }
    }

    public refresh() {
        this.slot1.refresh();
        this.slot2.refresh();
        this.slot3.refresh();
    }

}