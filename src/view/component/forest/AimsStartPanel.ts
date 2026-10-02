import LocationUtils from './../../../core/utils/LocationUtils';
import ForestAim from '../../../core/model/forest/ForestAim';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from '../panel/BasePanel';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
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

        let environment = forestType.environment;
        let level = ForestDao.indexOf(forestType);

        let background = SpriteUtils.createSprite(this.game, 0, 23, LocationUtils.getBanner(environment));
        background.anchor = new Phaser.Point(0, 0.5);
        this.addChild(background);

        let catHelper : boolean = level >= LocationUtils.CAT_FROM_LEVEL;

        let helper = SpriteUtils.createSprite(this.game, 10 - 3 - 45, background.height / 2 - 69 + (catHelper? 30:0),  catHelper ? 'cat1' : 'sveta1');
        helper.anchor = new Phaser.Point(0, 1);
        // helper.scale.set(0.8)
        this.addChild(helper);

        if (aims.length > 1) {
            shortInfo = true;
        }

        if (shortInfo) {
            let shiftX = aims.length == 3 ? -110 : 0;
            aims.forEach(aim => {
                let labelShift = aims.length == 3? -5 : 0;

                let wideImages = ["lilly", "book3", "dragonfly"]

                console.log("Aim.image: " + aim.image)
                if(wideImages.indexOf(aim.image) != -1){
                    labelShift += 5*(Math.floor(aim.countLeft+10)/10);
                }

                let label = new Label(this.game, 550 + 90 + shiftX + labelShift, 3, "" + aim.countLeft, Label.PanelDigitsBrown(aims.length > 1 ? 55 : 60));
                this.addChild(label);
                label.anchor = new Phaser.Point(0.5, 0.5);

                let image = SpriteUtils.createSprite(this.game, 550 + shiftX, 0, aim.image);
                image.anchor = new Phaser.Point(0.5, 0.5);
                // image.scale = new Phaser.Point(2.5, 2.5);
                const targetSize = aims.length > 1 ? 140 : 158;
                const imageScale = targetSize / Math.max(image.width, image.height);
                image.scale.set(imageScale, imageScale);
                
                if(wideImages.indexOf(aim.image) != -1){
                    image.scale.x = image.scale.x * 0.85;
                    image.scale.y = image.scale.y * 0.85;
                }
                this.addChild(image);

                shiftX += aims.length == 3 ? 187 : 200;
            });
        } else {
            let info = ForestAim.getAimsInfo(aims[0]);

            let label = new Label(this.game, 470 + 70 + 108, 3, info, Label.COMMON_MEDIUM_STYLE);
            label.anchor = new Phaser.Point(0.5, 0.5);

            // Phaser BitmapText ignores the normal text-stroke API. A small
            // ring of dark glyphs gives the target a clean outline without
            // adding another panel over the scene artwork.
            const outlineStyle: Phaser.PhaserTextStyle = {
                font: 'bold 50px Arial',
                fill: '#194233',
                wordWrap: true,
                wordWrapWidth: 600
            };
            [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(offset => {
                const outline = new Label(this.game, label.x + offset[0], label.y + offset[1], info, outlineStyle);
                outline.anchor = new Phaser.Point(0.5, 0.5);
                this.addChild(outline);
            });
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
