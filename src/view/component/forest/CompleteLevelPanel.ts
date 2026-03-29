import LocalizationService from '../../../core/localization/LocalizationService';
import AimType from '../../../core/model/enum/AimType';
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

type LevelCompletePanelPreviewData = {
    aims: ForestAim[];
    spentEnergy: number;
    targetSteps: number;
    gemsCount?: number;
};

export default class LevelCompletePanel extends BasePanel {

    public static TEST = false;

    private gemsCloud: Phaser.Sprite;
    private continueButton: Phaser.Button;
    private callbackOnContinue: () => void;

    constructor(game: Phaser.Game, screen: BaseForestScreen | null, x: number, y: number, aims: ForestAim[], forestType: ForestType | null, callbackOnContinue: () => void, previewData?: LevelCompletePanelPreviewData) {
        super(game, x, y);
        this.game = game;
        this.callbackOnContinue = callbackOnContinue;
        this.alpha = 0;
        this.fixedToCamera = true;

        const resolvedAims = previewData ? previewData.aims : aims;
        const spentEnergy = previewData ? previewData.spentEnergy : screen.topPanel.getSpentEnergy();
        const targetSteps = previewData ? previewData.targetSteps : screen.topPanel.getTargetSteps();

        const inputBlocker = new Phaser.Graphics(this.game, 0, 0);
        inputBlocker.beginFill(0x000000, 0.001);
        inputBlocker.drawRect(-this.game.width / 2, -this.game.height / 2, this.game.width, this.game.height);
        inputBlocker.endFill();
        inputBlocker.inputEnabled = true;
        this.addChild(inputBlocker);

        const supportPercent = EnergyUtils.getSupportPercent(targetSteps, spentEnergy);
        const panel = this.attachSprite('panel2', 'panel');
        panel.scale.set(1.06, 1.02);
        panel.inputEnabled = true;

        this.attachSprite('helperPanel');
        this.attachSprite('statusPanel', 'titleBg');

        const cat = this.attachSprite('cat4', 'cat');
        cat.scale.set(0.68);

        this.attachText('title', LocalizationService.get('ui.energy.winTitle', 'Уровень пройден'), {
            font: 'bold 40px Arial',
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
            font: 'bold 52px Gilroy',
            fill: '#ffffff'
        });
        spentValue.addStrokeColor('#924d1d', 0);
        spentValue.strokeThickness = 4;

        const betterLabel = this.attachText(
            'betterLabel',
            LocalizationService.get('ui.energy.better', 'Лучше, чем {percent}% игроков').replace('{percent}', '' + supportPercent),
            {
                font: 'bold 30px Arial',
                fill: '#7b4037',
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 360
            }
        );

        const aimsLabel = this.attachText('aimsLabel', ForestAim.getCompleteInfo(resolvedAims), {
            font: 'bold 30px Arial',
            fill: '#f7edd5',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 380
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
            { "spriteId": "panel", "x": 0, "y": 12, "scaleX": 1.06, "scaleY": 1.02, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "helperPanel", "x": 95, "y": -36, "scaleX": 0.7, "scaleY": 0.82, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "titleBg", "x": 0, "y": -222, "scaleX": 1.58, "scaleY": 1.22, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "title", "x": 0, "y": -226, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 44 },
            { "spriteId": "cat", "x": -254, "y": 66, "scaleX": 0.75, "scaleY": 0.75, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "lightning", "x": 95, "y": -19, "scaleX": 0.7, "scaleY": 0.7, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "spentLabel", "x": 95, "y": -106, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 28 },
            { "spriteId": "spentValue", "x": 135, "y":0, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 68 },
            { "spriteId": "betterLabel", "x": 95, "y": 106, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 30 },
            { "spriteId": "aimsLabel", "x": 95, "y": 166, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 24 },
            { "spriteId": "continueButton", "x": 0, "y": 286, "scaleX": 1.04, "scaleY": 0.96, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        ]);

        const previewGemsCount = previewData && previewData.gemsCount != null ? previewData.gemsCount : null;
        if (previewGemsCount != null || (screen && forestType && UserService.getUser().getCurrentForest() >= LocationUtils.SKIP_DIALOG_BUTTON_FROM_LEVEL)) {
            const hardLevelAddition = forestType && forestType.hardLevel ? StartLevelPanel.hardLevelAwardAddition : 0;
            const gemsCount = previewGemsCount != null
                ? previewGemsCount
                : ForestUtils.getPrizeGemsCount(screen.topPanel.getStepsLeft()) + hardLevelAddition;
            this.gemsCloud = SpriteUtils.createSprite(this.game, -334, -210, 'gemsCloud');
            this.gemsCloud.anchor.set(0.5);
            this.gemsCloud.scale.set(0.85);
            this.addChild(this.gemsCloud);

            const gemsLabel = new Label(this.game, -4, 40, '+' + gemsCount, {
                font: 'bold 50px Arial',
                fill: '#8c2d84'
            });
            gemsLabel.anchor.set(0.5);
            this.gemsCloud.addChild(gemsLabel);
            this.gemsCloud.alpha = 0;
        }
    }

    public show(delay: number, animationTime: number) {
        const finalY = this.game.height / 2 + 24;
        this.x = this.game.width / 2;
        this.y = finalY + 36;
        this.scale.set(0.92);

        SoundUtils.fastPanelWhooshIn(delay);

        this.bringToTop();
        this.game.add.tween(this).to({ alpha: 1, y: finalY }, animationTime, Phaser.Easing.Quadratic.Out, true, delay, 0, false);
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
        this.game.add.tween(this).to({ alpha: 0, y: this.game.height / 2 - 4 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.add.tween(this.scale).to({ x: 0.95, y: 0.95 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.time.events.add(240, () => this.callbackOnContinue(), this);
    }

    public static createTestPanel(game: Phaser.Game, callbackOnContinue: () => void): LevelCompletePanel {
        const previewAims = [
            new ForestAim(AimType.book, 'book3', 0),
            new ForestAim(AimType.pearl, 'pearl', 0)
        ];

        return new LevelCompletePanel(
            game,
            null,
            game.width / 2,
            game.height / 2,
            previewAims,
            null,
            callbackOnContinue,
            {
                aims: previewAims,
                spentEnergy: 17,
                targetSteps: 20,
                gemsCount: 16
            }
        );
    }
}
