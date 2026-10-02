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
import SapphireEffects from './SapphireEffects';

type LevelCompletePanelPreviewData = {
    aims: ForestAim[];
    spentEnergy: number;
    targetSteps: number;
    gemsCount?: number;
};

type ResultTextBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    wrap?: boolean;
};

export default class LevelCompletePanel extends BasePanel {

    public static TEST = false;

    private gemsReward: Phaser.Sprite;
    private sapphireStarReward: Phaser.Group;
    private sapphireStarIcon: Phaser.Sprite;
    private sapphireGlow: Phaser.Sprite;
    private sapphireCountLabel: Label;
    private sapphireGlints: Phaser.Sprite[] = [];
    private sapphireTotal = 0;
    private sapphiresReceived = 0;
    private sapphireIconScale = 1;
    private sapphirePulse = 0;
    private rewardTime = 0;
    private entranceFinished = false;
    private continueButton: Phaser.Button;
    private callbackOnContinue: () => void;

    constructor(game: Phaser.Game, screen: BaseForestScreen | null, x: number, y: number, aims: ForestAim[], forestType: ForestType | null, callbackOnContinue: () => void, previewData?: LevelCompletePanelPreviewData, sapphireStarCount: number = 0) {
        super(game, x, y);
        this.game = game;
        this.callbackOnContinue = callbackOnContinue;
        this.alpha = 0;
        this.fixedToCamera = true;

        const resolvedAims = previewData ? previewData.aims : aims;
        const spentEnergy = previewData ? previewData.spentEnergy : screen.topPanel.getSpentEnergy();
        const targetSteps = previewData ? previewData.targetSteps : screen.topPanel.getTargetSteps();

        const inputBlocker = new Phaser.Graphics(this.game, 0, 0);
        inputBlocker.beginFill(0x061627, 0.24);
        // Overscan keeps the dimmed board covered while the panel scales in.
        inputBlocker.drawRect(-this.game.width / 2 - 60, -this.game.height / 2 - 90,
            this.game.width + 120, this.game.height + 180);
        inputBlocker.endFill();
        inputBlocker.inputEnabled = true;
        this.addChild(inputBlocker);

        const supportPercent = EnergyUtils.getSupportPercent(targetSteps, spentEnergy);
        const panel = this.attachSprite('rewardBoard', 'panel');
        panel.width = 820;
        panel.height = sapphireStarCount > 0 ? 614 : 574;
        panel.position.set(0, 20);
        panel.inputEnabled = true;

        // Keep the illustration and the results in separate, fixed local boxes.
        // Text/children must not change the bounds used to position other elements.
        const resultsX = 156;
        const helperPanel = this.attachSprite('rewardCard', 'helperPanel');
        helperPanel.width = 392;
        helperPanel.height = 320;
        helperPanel.position.set(resultsX, -22);

        const titleBg = this.attachSprite('rewardHeader', 'titleBg');
        titleBg.width = 680;
        titleBg.height = 150;
        titleBg.position.set(0, -258);

        const cat = this.attachSprite('cat4', 'cat');
        cat.scale.set(0.68);
        cat.position.set(-237, 20);

        this.createResultText('title', LocalizationService.get('ui.energy.winTitle', 'Level Complete'), {
            font: 'bold 46px Gilroy',
            fill: '#fff3c6'
        }, { x: 0, y: -254, width: 478, height: 64 }, '#12482b');

        this.createResultText('spentLabel', LocalizationService.get('ui.energy.spent', 'Energy spent'), {
            font: 'bold 26px Arial',
            fill: '#87552b'
        }, { x: resultsX - 8, y: -116, width: 280, height: 36 });

        if (sapphireStarCount > 0) {
            this.sapphireTotal = sapphireStarCount;
            cat.scale.set(0.43);
            cat.position.set(-237, -83);
            this.sapphireStarReward = new Phaser.Group(this.game, this, 'sapphireStarReward');
            this.sapphireStarReward.position.set(-237, 106);
            const badge = SpriteUtils.createSprite(this.game, 0, 0, 'rewardBadge');
            badge.anchor.set(0.5);
            badge.width = 300;
            badge.height = 122;
            this.sapphireStarReward.add(badge);
            this.sapphireGlow = SapphireEffects.sprite(this.game, false, 190);
            this.sapphireGlow.x = -65;
            this.sapphireStarReward.add(this.sapphireGlow);
            for (let i = 0; i < 3; i++) {
                const glint = SapphireEffects.sprite(this.game, true, 24);
                this.sapphireStarReward.add(glint);
                this.sapphireGlints.push(glint);
            }
            const starBackdrop = SpriteUtils.createSprite(this.game, -65, 0, 'sapphireStarBackdrop');
            starBackdrop.anchor.set(0.5);
            starBackdrop.width = starBackdrop.height = 124;
            this.sapphireStarReward.addChild(starBackdrop);
            const star = SpriteUtils.createSprite(this.game, -65, 0, 'sapphireStar');
            star.anchor.set(0.5);
            star.width = star.height = 116;
            this.sapphireStarIcon = star;
            this.sapphireIconScale = star.scale.x;
            this.sapphireStarReward.addChild(star);
            const count = new Label(this.game, 54, 0, '0', {
                font: 'bold 64px Gilroy',
                fill: '#fff5ce'
            });
            count.anchor.set(0.5);
            this.sapphireCountLabel = count;
            this.sapphireStarReward.addChild(count);
        }

        const lightning = this.attachSprite('lightning', 'lightning');
        lightning.scale.set(0.61);
        lightning.y = -30;

        const spentValue = this.attachText('spentValue', '' + spentEnergy, Label.PanelDigitsBrown(72));
        const spentValueScale = Math.min(1, 126 / Math.max(1, spentValue.textWidth));
        spentValue.scale.set(spentValueScale, spentValueScale);
        spentValue.y = -30;

        // Center the icon + value together, including two- and three-digit values.
        const energyWidth = lightning.width + 4 + spentValue.textWidth * spentValue.scale.x;
        lightning.x = resultsX - energyWidth / 2 + lightning.width / 2;
        spentValue.x = resultsX + energyWidth / 2 - spentValue.textWidth * spentValue.scale.x / 2;

        const divider = new Phaser.Graphics(this.game, resultsX, 38);
        divider.lineStyle(2, 0xb8874c, 0.35);
        divider.moveTo(-152, 0);
        divider.lineTo(152, 0);
        divider.lineStyle(2, 0xfff8df, 0.6);
        divider.moveTo(-152, 2);
        divider.lineTo(152, 2);
        this.addChild(divider);

        this.createResultText(
            'betterLabel',
            LocalizationService.get('ui.energy.better', 'Better than {percent}% of players').replace('{percent}', '' + supportPercent),
            {
                font: 'bold 30px Arial',
                fill: '#87552b'
            },
            { x: resultsX, y: 86, width: 326, height: 64, wrap: true }
        );

        this.createResultText('aimsLabel', ForestAim.getCompleteInfo(resolvedAims), {
            font: 'bold 34px Gilroy',
            fill: '#fff5ce'
        }, { x: resultsX, y: 180, width: 360, height: 80, wrap: true }, '#89501f');

        this.continueButton = this.attachButton('rewardButton', () => this.onContinue(), 'continueButton');
        this.continueButton.position.set(0, sapphireStarCount > 0 ? 318 : 282);
        this.continueButton.inputEnabled = false;

        const continueLabel = this.createResultText('continueLabel', LocalizationService.get('ui.ok', 'OK'), {
            font: 'bold 46px Gilroy',
            fill: '#fffbea'
        }, { x: 0, y: -3, width: 390, height: 62 }, '#548a14');
        this.continueButton.addChild(continueLabel);

        const previewGemsCount = previewData && previewData.gemsCount != null ? previewData.gemsCount : null;
        const shouldShowGems = previewGemsCount != null
            ? previewGemsCount > 0
            : (screen && forestType && UserService.getUser().getCurrentForest() >= LocationUtils.SKIP_DIALOG_BUTTON_FROM_LEVEL);
        if (shouldShowGems) {
            const hardLevelAddition = forestType && forestType.hardLevel ? StartLevelPanel.hardLevelAwardAddition : 0;
            const gemsCount = previewGemsCount != null
                ? previewGemsCount
                : ForestUtils.getPrizeGemsCount(screen.topPanel.getStepsLeft()) + hardLevelAddition;
            if (!this.sapphireStarReward) {
                cat.scale.set(0.6);
                cat.y = -15;
            }

            // Reserve a reward row below the cat instead of covering its face
            // or the heading with the old floating cloud.
            this.gemsReward = this.attachSprite('blank', 'gemsReward');
            this.gemsReward.position.set(-237, this.sapphireStarReward ? 217 : 186);
            const rewardBg = SpriteUtils.createSprite(this.game, 0, 0, 'rewardBadge');
            rewardBg.anchor.set(0.5);
            rewardBg.width = 236;
            rewardBg.height = this.sapphireStarReward ? 68 : 82;
            this.gemsReward.addChild(rewardBg);

            const gems = SpriteUtils.createSprite(this.game, -58, -2, 'gems');
            gems.anchor.set(0.5);
            gems.scale.set(64 / Math.max(gems.width, gems.height));
            this.gemsReward.addChild(gems);

            const gemsLabel = this.createResultText('gemsLabel', '+' + gemsCount, {
                font: 'bold 40px Gilroy',
                fill: '#fff3d8'
            }, { x: 31, y: -2, width: 112, height: 54 }, '#79421e');
            this.gemsReward.addChild(gemsLabel);
            this.gemsReward.alpha = 0;
        }
    }

    private createResultText(name: string, text: string, style: Phaser.PhaserTextStyle, box: ResultTextBox, outlineColor?: string): Phaser.Group {
        const group = new Phaser.Group(this.game, this, name);
        group.position.set(box.x, box.y);
        const textStyle = Object.assign({}, style, { align: 'center', wordWrap: false });
        // Set the width constraint before assigning text so BitmapText lays the
        // glyphs out only once (the constructor's initial text is empty).
        const label = new Label(this.game, 0, 0, '', textStyle);
        label.name = name;
        label.anchor.set(0.5);
        // Phaser's native wrapping measures glyphs; Label's legacy wrap estimates
        // character counts and can overflow a narrow column in some languages.
        label.maxWidth = box.wrap ? box.width : 0;
        label.text = text;
        group.scale.set(Math.min(1, box.width / Math.max(1, label.textWidth), box.height / Math.max(1, label.textHeight)));

        if (outlineColor) {
            // Label is BitmapText, so strokeThickness/addStrokeColor are no-ops.
            // Four cardinal copies preserve a readable outline while avoiding
            // the extra bitmap-text rebuilds and draw work from diagonal copies.
            const offsets = [[-2, 0], [2, 0], [0, -2], [0, 2]];
            offsets.forEach(offset => {
                const outline = new Label(this.game, offset[0], offset[1], '', Object.assign({}, textStyle, { fill: outlineColor }));
                outline.anchor.set(0.5);
                outline.maxWidth = label.maxWidth;
                outline.text = text;
                group.add(outline);
            });
        }

        group.add(label);
        return group;
    }

    public show(delay: number, animationTime: number) {
        const finalY = this.game.height / 2 + 24;
        this.cameraOffset.set(this.game.width / 2, finalY + 24);
        this.scale.set(0.96);

        SoundUtils.fastPanelWhooshIn(delay);

        this.bringToTop();
        this.game.add.tween(this).to({ alpha: 1 }, animationTime, Phaser.Easing.Sinusoidal.InOut, true, delay, 0, false);
        this.game.add.tween(this.cameraOffset).to({ y: finalY }, animationTime, Phaser.Easing.Sinusoidal.InOut, true, delay, 0, false);
        this.game.add.tween(this.scale).to({ x: 1, y: 1 }, animationTime, Phaser.Easing.Sinusoidal.InOut, true, delay, 0, false);
        this.game.time.events.add(delay + animationTime, () => {
            this.entranceFinished = true;
            this.continueButton.inputEnabled = this.sapphiresReceived >= this.sapphireTotal;
        }, this);

        if (this.gemsReward) {
            this.gemsReward.alpha = 0;
            this.game.add.tween(this.gemsReward).to({ alpha: 1 }, Math.round(animationTime * 0.55), Phaser.Easing.Sinusoidal.InOut, true, delay + Math.round(animationTime * 0.45), 0, false);
        }

        if (this.sapphireStarReward) {
            this.sapphireStarReward.alpha = 0;
            this.game.add.tween(this.sapphireStarReward).to(
                { alpha: 1 }, Math.round(animationTime * 0.55),
                Phaser.Easing.Sinusoidal.InOut, true,
                delay + Math.round(animationTime * 0.15), 0, false
            );
        }
    }

    public getSapphireStarTarget(result: Phaser.Point = new Phaser.Point()): Phaser.Point {
        return result.set(
            this.cameraOffset.x + (this.sapphireStarReward.x + this.sapphireStarIcon.x) * this.scale.x,
            this.cameraOffset.y + this.sapphireStarReward.y * this.scale.y
        );
    }

    public receiveSapphireStar(): void {
        this.sapphiresReceived = Math.min(this.sapphireTotal, this.sapphiresReceived + 1);
        this.sapphireCountLabel.text = '' + this.sapphiresReceived;
        const countScale = Math.min(1, 106 / Math.max(1, this.sapphireCountLabel.textWidth));
        this.sapphireCountLabel.scale.set(countScale, countScale);
        this.sapphirePulse = 1;
        this.continueButton.inputEnabled = this.entranceFinished && this.sapphiresReceived >= this.sapphireTotal;
    }

    public update(): void {
        if (!this.sapphireStarReward || !this.visible) return;
        const dt = Math.min(50, this.game.time.elapsedMS || 16.67) / 1000;
        this.rewardTime += dt;
        this.sapphirePulse = Math.max(0, this.sapphirePulse - dt * 3);
        const scale = this.sapphireIconScale * (1 + this.sapphirePulse * 0.14 + Math.sin(this.rewardTime * 2) * 0.015);
        this.sapphireStarIcon.scale.set(scale);
        this.sapphireGlow.alpha = 0.42 + this.sapphirePulse * 0.35 + Math.sin(this.rewardTime * 2) * 0.08;
        this.sapphireGlints.forEach((glint, index) => {
            const angle = this.rewardTime * 0.7 + index * Math.PI * 2 / 3;
            glint.position.set(-65 + Math.cos(angle) * 65, Math.sin(angle) * 47);
            glint.rotation = -angle;
            glint.alpha = 0.35 + 0.45 * Math.pow(Math.sin(angle * 1.6), 2);
            glint.scale.set(0.24 + 0.12 * Math.pow(Math.sin(angle * 1.6), 2));
        });
    }

    private onContinue(): void {
        if (!this.continueButton.inputEnabled) {
            return;
        }

        this.continueButton.inputEnabled = false;
        AnimationUtils.jelly(this.game, this.continueButton, 0, true);
        SoundUtils.fastPanelWhooshOut(0);
        this.game.add.tween(this).to({ alpha: 0 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.add.tween(this.cameraOffset).to({ y: this.game.height / 2 - 4 }, 220, Phaser.Easing.Quadratic.In, true, 0, 0, false);
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
