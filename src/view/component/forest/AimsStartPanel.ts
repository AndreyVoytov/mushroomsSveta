import LocationUtils from './../../../core/utils/LocationUtils';
import ForestAim from '../../../core/model/forest/ForestAim';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from '../panel/BasePanel';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
import UiLayout from '../../../core/utils/UiLayout';
export default class AimsStartPanel extends BasePanel {

    private aimsPanelShowed: boolean = false;
    private needSkipAims: boolean = false;

    constructor(game: Phaser.Game, x: number, y: number, aims: ForestAim[], shortInfo: boolean, forestType: ForestType, onHideCallback: () => void, skipIntro: boolean = false) {
        super(game, x, y);
        this.game = game;

        if (skipIntro) {
            this.visible = false;
            this.game.time.events.add(1, onHideCallback);
            return;
        }

        let level = ForestDao.indexOf(forestType);

        let background = SpriteUtils.createSprite(this.game, game.width / 2, 0, 'helperPanel2');
        background.anchor.set(0.5);
        background.width = game.width - 48;
        background.height = 300;
        this.addChild(background);

        let catHelper : boolean = level >= LocationUtils.CAT_FROM_LEVEL;

        let helper = SpriteUtils.createSprite(this.game, 186, 120, catHelper ? 'cat1' : 'sveta1');
        helper.anchor.set(0.5, 1);
        SpriteUtils.fitIcon(helper, 240, 246);
        this.addChild(helper);

        if (aims.length > 1) {
            shortInfo = true;
        }

        if (shortInfo) {
            aims.forEach((aim, index) => {
                const centerX = 604 + (index - (aims.length - 1) / 2) * 185;
                let label = new Label(this.game, centerX + 44, 0, "" + aim.countLeft, {font:'bold 56px Manrope',fill:Label.INK});
                this.addChild(label);
                label.anchor = new Phaser.Point(0.5, 0.5);
                UiLayout.fit(label, 80, 64);

                let image = SpriteUtils.createSprite(this.game, centerX - 45, 0, aim.image);
                image.anchor = new Phaser.Point(0.5, 0.5);
                SpriteUtils.fitIcon(image, 112, 112);
                this.addChild(image);
            });
        } else {
            let info = ForestAim.getAimsInfo(aims[0]);

            let label = new Label(this.game, 606, 0, info, {font:'bold 46px Manrope',fill:Label.INK,align:'center'});
            label.anchor = new Phaser.Point(0.5, 0.5);
            UiLayout.fit(label, 526, 180, true);
            this.addChild(label);
        }

        let treesTime = 500;

        let delay = 300 + treesTime * 2;
        let time = 500;
        let showFor = 1300;
        this.game.add.tween(this).to({ y: [this.game.height / 2 + 50, this.game.height / 2] }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, delay, 0, false);
        SoundUtils.fastPanelWhooshIn(delay);
        this.game.time.events.add(time + delay + (showFor), () => {
            if (!this.aimsPanelShowed) {
                this.aimsPanelShowed = true;
                this.game.add.tween(this).to({ y: [this.game.height / 2 + 50, -220] }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                this.game.time.events.add(delay, onHideCallback);
                SoundUtils.fastPanelWhooshOut(0);
            }
        });

        //если игрок кликает, цели убираются раньше
        this.game.time.events.add(time + delay, () => {
            this.game.time.events.repeat(100, (time + delay + (showFor)) / 100, () => {
                if (this.needSkipAims && !this.aimsPanelShowed) {
                    this.aimsPanelShowed = true;
                    this.game.add.tween(this).to({ y: [this.game.height / 2 + 50, -220] }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 500, 0, false);
                    console.log("AIMS PANEL SKIPPED!!!!")
                    this.game.time.events.add(delay, onHideCallback);
                    SoundUtils.fastPanelWhooshOut(500);
                }
            });
        });
    }

    public onMouseUp(): void {
        this.needSkipAims = true;
    }


}
