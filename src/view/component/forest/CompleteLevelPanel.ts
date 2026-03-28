import LocalizationService from '../../../core/localization/LocalizationService';
import ForestAim from '../../../core/model/forest/ForestAim';
import ForestType from '../../../core/model/forest/ForestType';
import UserService from '../../../core/service/UserService';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import EnergyUtils from '../../../core/utils/EnergyUtils';
import ForestUtils from '../../../core/utils/ForestUtils';
import LocationUtils from '../../../core/utils/LocationUtils';
import SoundUtils from '../../../core/utils/SoundUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BaseForestScreen from '../../screen/BaseForestScreen';
import StartLevelPanel from '../house/StartLevelPanel';
import Label from './../panel/Label';
import BasePanel from '../panel/BasePanel';

export default class LevelCompletePanel extends BasePanel {

    private screen: BaseForestScreen;
    private gemsCloud: Phaser.Sprite;
    private continueButton: Phaser.Button;
    private callbackOnContinue: () => void;

    constructor(game: Phaser.Game, screen: BaseForestScreen, x: number, y: number, aims: ForestAim[], forestType: ForestType, callbackOnContinue: () => void) {
        super(game, x, y);
        this.game = game;
        this.screen = screen;
        this.callbackOnContinue = callbackOnContinue;
        this.alpha = 0;
        this.fixedToCamera = true;

        const inputBlocker = new Phaser.Graphics(this.game, 0, 0);
        inputBlocker.beginFill(0x000000, 0.001);
        inputBlocker.drawRect(-this.game.width / 2, -this.game.height / 2, this.game.width, this.game.height);
        inputBlocker.endFill();
        inputBlocker.inputEnabled = true;
        this.addChild(inputBlocker);

        const spentEnergy = this.screen.topPanel.getSpentEnergy();
        const supportPercent = EnergyUtils.getSupportPercent(this.screen.topPanel.getTargetSteps(), spentEnergy);
        const panel = this.attachSprite('panel2', 'panel');
        panel.scale.set(1.02, 0.94);
        panel.inputEnabled = true;

        this.attachSprite('helperPanel');
        this.attachSprite('statusPanel', 'titleBg');

        const cat = this.attachSprite('cat4', 'cat');
        cat.scale.set(0.88);

        this.attachText('title', LocalizationService.get('ui.energy.winTitle', 'Уровень пройден'), {
            font: 'bold 44px Arial',
            fill: '#ffffff'
        });

        const lightning = this.attachSprite('lightning', 'lightning');
        lightning.scale.set(0.62);

        const spentLabel = this.attachText('spentLabel', LocalizationService.get('ui.energy.spent', 'Потрачено энергии'), {
            font: 'bold 28px Arial',
            fill: '#8f6130'
        });
        spentLabel.anchor.set(0.5);

        const spentValue = this.attachText('spentValue', '' + spentEnergy, {
            font: 'bold 74px Gilroy',
            fill: '#ffffff'
        });
        spentValue.addStrokeColor('#924d1d', 0);
        spentValue.strokeThickness = 4;

        const betterLabel = this.attachText(
            'betterLabel',
            LocalizationService.get('ui.energy.better', 'Лучше, чем {percent}% игроков').replace('{percent}', '' + supportPercent),
            {
                font: 'bold 34px Arial',
                fill: '#7b4037',
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 480
            }
        );

        const aimsLabel = this.attachText('aimsLabel', ForestAim.getCompleteInfo(aims), {
            font: 'bold 26px Arial',
            fill: '#f7edd5',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 520
        });

        this.continueButton = this.attachButton('pnlButton', () => this.onContinue(), 'continueButton');
        this.continueButton.scale.set(1.04, 0.96);
        this.continueButton.inputEnabled = false;

        const continueLabel = new Label(this.game, 0, 0, LocalizationService.get('ui.ok', 'Хорошо'), {
            font: 'bolder 40px Gilroy',
            fill: '#f0f1ec'
        });
        continueLabel.anchor.set(0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.continueButton.addChild(continueLabel);

        this.applyPreset([
            { "spriteId": "panel", "x": 0, "y": 0, "scaleX": 1.02, "scaleY": 0.94, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "helperPanel", "x": 0, "y": -24, "scaleX": 0.96, "scaleY": 0.68, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "titleBg", "x": 0, "y": -250, "scaleX": 1.28, "scaleY": 1.1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "title", "x": 0, "y": -254, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 44 },
            { "spriteId": "cat", "x": -210, "y": 114, "scaleX": 0.88, "scaleY": 0.88, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "lightning", "x": 84, "y": -45, "scaleX": 0.62, "scaleY": 0.62, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "spentLabel", "x": 90, "y": -108, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 28 },
            { "spriteId": "spentValue", "x": 90, "y": -28, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 74 },
            { "spriteId": "betterLabel", "x": 60, "y": 62, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 34 },
            { "spriteId": "aimsLabel", "x": 0, "y": 170, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 26 },
            { "spriteId": "continueButton", "x": 0, "y": 292, "scaleX": 1.04, "scaleY": 0.96, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        ]);

        if (UserService.getUser().getCurrentForest() >= LocationUtils.SKIP_DIALOG_BUTTON_FROM_LEVEL) {
            const hardLevelAddition = forestType.hardLevel ? StartLevelPanel.hardLevelAwardAddition : 0;
            const gemsCount = ForestUtils.getPrizeGemsCount(this.screen.topPanel.getStepsLeft()) + hardLevelAddition;
            this.gemsCloud = SpriteUtils.createSprite(this.game, 172, -138, 'gemsCloud');
            this.gemsCloud.anchor.set(0.5);
            this.addChild(this.gemsCloud);

            const gemsLabel = new Label(this.game, 8, -7, '+' + gemsCount, {
                font: 'bold 40px Arial',
                fill: '#8c2d84'
            });
            gemsLabel.anchor.set(0.5);
            this.gemsCloud.addChild(gemsLabel);
            this.gemsCloud.alpha = 0;
        }
    }

    public show(delay: number, animationTime: number) {
        this.x = this.game.width / 2;
        this.y = this.game.height / 2 + 36;
        this.scale.set(0.92);

        SoundUtils.fastPanelWhooshIn(delay);

        this.bringToTop();
        this.game.add.tween(this).to({ alpha: 1, y: this.game.height / 2 }, animationTime, Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.add.tween(this.scale).to({ x: 1, y: 1 }, animationTime, Phaser.Easing.Quadratic.Out, true, delay, 0, false);
        this.game.time.events.add(delay + animationTime, () => {
            this.continueButton.inputEnabled = true;
        }, this);

        if (this.gemsCloud) {
            this.gemsCloud.alpha = 1;
            AnimationUtils.appear(this.game, this.gemsCloud, animationTime + delay - 100);
        }
    }

    private onContinue(): void {
        if (!this.continueButton.inputEnabled) {
            return;
        }

        this.continueButton.inputEnabled = false;
        AnimationUtils.jelly(this.game, this.continueButton, 0, true);
        SoundUtils.fastPanelWhooshOut(0);
        this.game.add.tween(this).to({ alpha: 0, y: this.game.height / 2 - 28 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.add.tween(this.scale).to({ x: 0.95, y: 0.95 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.time.events.add(240, () => this.callbackOnContinue(), this);
    }
}
