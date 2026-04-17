import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import EventInfo from '../../../core/model/event/EventInfo';
import EventStage from '../../../core/model/event/EventStage';
import EventType from '../../../core/model/event/EventType';
import EventUtils from '../../../core/utils/EventUtils';
import ForestScreen from '../../screen/ForestScreen';
import HouseScreen from './../../screen/HouseScreen';
import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import TreesTransitionPanel from '../panel/TreesTransitionPanel';

type SideEventState = {
    canPlay: boolean;
    nextLevelNumber: number;
    progress: number;
    totalLevels: number;
};

type SideEventChildAlphaState = {
    target: PIXI.DisplayObject;
    alpha: number;
};

export default class SideEventPanel extends ClosablePanel {

    private static readonly PANEL_SCALE = 1.1;
    private static readonly EVENT1_MAIN_IMAGE_MASK_HEIGHT = 951;
    private static readonly EVENT1_MAIN_IMAGE_MASK_WIDTH = 689;
    private static readonly EVENT1_MAIN_IMAGE_MASK_RADIUS = 24;
    private static readonly EVENT1_MAIN_IMAGE_FOCUS_OFFSET_Y = -200;
    private static readonly PRE_DIALOG_FOCUS_DELAY = 1650;
    private static readonly PRE_DIALOG_FOCUS_DURATION = 420;
    private static readonly PRE_DIALOG_RESTORE_DURATION = 260;
    private static readonly PRE_DIALOG_PANEL_SCALE = 1.4;
    private static readonly EVENT1_MAP2_UNLOCK_PROGRESS = 3;
    private static readonly EVENT1_MAP3_UNLOCK_PROGRESS = 7;
    private static readonly EVENT1_CHARACTER_OFFSET_Y = -45;
    private static readonly EVENT1_CHARACTER_MOVE_DELAY = 1200;
    private static readonly EVENT1_CHARACTER_MOVE_DURATION = 540;

    private static readonly EVENT1_POINT_POSITIONS: Phaser.Point[] = [
        new Phaser.Point(-17.5, -32.5),
        new Phaser.Point(-16.5, 107.5),
        new Phaser.Point(-125.5, 117.5),
        new Phaser.Point(-230.5, 85.5),
        new Phaser.Point(-250.5, 180.5),
        new Phaser.Point(-243.5, 275.5),
        new Phaser.Point(-141.5, 315.5),
        new Phaser.Point(-37.5, 345.5),
        new Phaser.Point(78.5, 322.5),
        new Phaser.Point(198.5, 312.5),
        new Phaser.Point(91.5, 226.5),
        new Phaser.Point(237.5, 168.5),
        new Phaser.Point(218.5, 81.5),
        new Phaser.Point(134.5, 12.5)
    ];

    private actionButton: Phaser.Button;
    private eventInfo: EventInfo;
    private eventPointPositions: Phaser.Point[] = [];
    private characterSprite: Phaser.Sprite;
    private characterMoveTimer: Phaser.TimerEvent;
    private characterMoveTween: Phaser.Tween;
    private mainImageSprite: Phaser.Sprite;
    private mainImageMask: Phaser.Graphics;
    private preDialogFocusTargets: SideEventChildAlphaState[] = [];
    private preDialogFocusTimer: Phaser.TimerEvent;
    private preDialogRestoreTimer: Phaser.TimerEvent;
    private preDialogFocusActive = false;
    private panelBaseScaleX = 1;
    private panelBaseScaleY = 1;
    private preDialogTweens: Phaser.Tween[] = [];

    constructor(game: Phaser.Game, eventInfo: EventInfo) {
        super(game, game.width / 2, game.height / 2, false, "blank", SideEventPanel.PANEL_SCALE);

        this.eventInfo = eventInfo;
        this.visible = false;
        this.fixedToCamera = true;
        this.blackTransparent.events.onInputDown.add(() => this.onBackdropTap(), this);

        const eventState = this.getEventState();
        if (eventInfo.eventType == EventType.configured && eventInfo.eventId == "event1") {
            this.buildEvent1Layout(eventState);
        } else {
            this.buildDefaultLayout(eventState);
        }
    }

    private buildEvent1Layout(eventState: SideEventState): void {
        this.eventPointPositions = SideEventPanel.EVENT1_POINT_POSITIONS.slice();

        const hitArea = this.attachSprite('blank', 'hitArea');
        hitArea.width = 760;
        hitArea.height = 1180;
        hitArea.alpha = 0.001;
        hitArea.inputEnabled = true;

        const eventImage = this.attachPsdSprite(
            EventUtils.getMainImage(this.eventInfo.eventType, this.eventInfo.eventId, eventState.nextLevelNumber),
            'eventImage',
            -0.5,
            -66.5
        );
        eventImage.inputEnabled = true;
        this.applyEvent1MainImageMask(
            eventImage,
            EventUtils.getMainImageScale(this.eventInfo.eventType, this.eventInfo.eventId, eventState.nextLevelNumber)
        );
        this.mainImageSprite = eventImage;
        
        this.attachPsdSprite('sideEvent1PanelBottom', 'panelBottom', -3, 458.5);
        this.attachPsdSprite('sideEvent1FadeTop', 'fadeTop', -18.5, -485.5);
        this.attachStretchedPsdSprite('sideEvent1FadeMiddle', 'fadeMiddle', -6.5, -85, 709, 644);
        this.attachPsdSprite('sideEvent1FadeBottom', 'fadeBottom', -18.5, 343);


        this.attachPsdSprite('sideEvent1FrameTop', 'frameTop', -4, -476.5);
        this.attachStretchedPsdSprite('sideEvent1FrameMiddle', 'frameMiddle', -4, -65.5, 696, 693);
        this.attachPsdSprite('sideEvent1FrameBottom', 'frameBottom', -4, 345.5);

        this.attachPsdSprite('sideEvent1MapBg', 'mapBg', 2, 148.5);
        const map3 = this.attachPsdSprite('sideEvent1Map3', 'map3', 5, 157);
        map3.visible = eventState.progress >= SideEventPanel.EVENT1_MAP3_UNLOCK_PROGRESS;
        const map2 = this.attachPsdSprite('sideEvent1Map2', 'map2', -105.5, 290);
        map2.visible = eventState.progress >= SideEventPanel.EVENT1_MAP2_UNLOCK_PROGRESS;
        this.attachPsdSprite('sideEvent1Map1', 'map1', -139.5, 36);
        this.createEvent1Character();

        this.attachPsdSprite('sideEvent1PanelRibbon', 'panelRibbon', -6.5, -491);
        let timer = this.attachPsdSprite('sideEvent1Timer', 'timerBg', -19, -464);
        timer.scale.set(1.2);

        const closeButton = this.attachPsdButton('sideEvent1PanelClose', () => this.onCloseButtonClick(), 'closeButton', 311, -576);
        closeButton.bringToTop();

        const title = this.attachText('titleLabel', EventUtils.getName(this.eventInfo.eventType, this.eventInfo.eventId), {
            font: 'bold 48px Gilroy',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 430
        });
        title.x = -12;
        title.y = -530.5;
        title.lineSpacing = -8;
        title.anchor.set(0.5, 1);

        const remainLabel = this.attachText('remainLabel', EventUtils.getRemainTime(this.eventInfo.eventEndAt), {
            font: 'bold 28px Gilroy',
            fill: '#ffffff',
            align: 'center'
        });
        remainLabel.x = 24;
        remainLabel.y = -469;
        this.game.time.events.loop(1000, () => {
            remainLabel.text = EventUtils.getRemainTime(this.eventInfo.eventEndAt);
        });

        const descriptionLabel = this.attachText('descriptionLabel', EventUtils.getDesc(this.eventInfo.eventType, this.eventInfo.eventId), {
            font: 'bold 31px Gilroy',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 470
        });
        descriptionLabel.x = -4;
        descriptionLabel.y = 473;
        descriptionLabel.lineSpacing = -6;

        this.actionButton = this.attachPsdButton('sideEvent1EventButton', () => this.onActionButtonClick(), 'actionButton', -0.5, 572);

        const playLabel = new Label(this.game, -0.5, -17, LocalizationService.get('ui.play'), {
            font: 'bold 42px Gilroy',
            fill: '#ffffff',
            align: 'center'
        });
        playLabel.anchor.set(0.5);
        this.actionButton.addChild(playLabel);

        const levelLabel = new Label(this.game, 0.5, 24, GameText.level(eventState.nextLevelNumber), {
            font: 'bold 28px Gilroy',
            fill: '#ffffff',
            align: 'center'
        });
        levelLabel.anchor.set(0.5);
        this.actionButton.addChild(levelLabel);

        if (!eventState.canPlay) {
            playLabel.text = LocalizationService.get('ui.ok');
            playLabel.y = 0;
            levelLabel.visible = false;
            this.actionButton.alpha = 0.82;
        }
    }

    private createEvent1Character(): void {
        this.characterSprite = this.attachSprite('character', 'eventCharacter');
        this.characterSprite.scale.set(1.44, 1.4);
        this.characterSprite.anchor.set(0.5);
        this.characterSprite.visible = false;
    }

    private buildDefaultLayout(eventState: SideEventState): void {
        let panel = this.attachSprite('panel2', 'panel');
        panel.anchor.set(0.5);
        panel.scale.set(1.08, 1.04);
        panel.inputEnabled = true;

        let helperPanel = this.attachSprite('helperPanel');
        helperPanel.anchor.set(0.5);
        helperPanel.scale.set(0.88, 0.86);

        let titleBg = this.attachSprite('statusPanel', 'titleBg');
        titleBg.anchor.set(0.5);
        titleBg.scale.set(1.62, 1.14);
        titleBg.y = -360;

        let icon = this.attachSprite(EventUtils.getMainImage(this.eventInfo.eventType, this.eventInfo.eventId, eventState.nextLevelNumber), 'eventIcon');
        icon.anchor.set(0.5);
        icon.y = -200;
        icon.scale.set(EventUtils.getMainImageScale(this.eventInfo.eventType, this.eventInfo.eventId, eventState.nextLevelNumber));
        this.mainImageSprite = icon;

        let closeButton = this.attachButton('closeButtonViolet', () => this.onCloseButtonClick());
        closeButton.x = 330;
        closeButton.y = -360;

        let title = this.attachText('titleLabel', EventUtils.getName(this.eventInfo.eventType, this.eventInfo.eventId), {
            font: '46px Bookman Old Style',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 620
        });
        title.y = -366;

        let remainLabel = this.attachText('remainLabel', EventUtils.getRemainTime(this.eventInfo.eventEndAt), {
            font: 'bold 34px Arial',
            fill: '#8f6130',
            align: 'center'
        });
        remainLabel.y = -84;
        this.game.time.events.loop(1000, () => {
            remainLabel.text = EventUtils.getRemainTime(this.eventInfo.eventEndAt);
        });

        if (this.eventInfo.eventType == EventType.configured) {
            let progressLabel = this.attachText('progressLabel', eventState.progress + '/' + eventState.totalLevels, {
                font: 'bold 54px Gilroy',
                fill: '#7b4037',
                align: 'center'
            });
            progressLabel.y = -20;
            progressLabel.addStrokeColor('#f8ebd4', 0);
            progressLabel.strokeThickness = 4;
        }

        let textLabel = this.attachText('textLabel', EventUtils.getDesc(this.eventInfo.eventType, this.eventInfo.eventId), {
            font: 'bold 34px Arial',
            fill: '#804119',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 640
        });
        textLabel.alpha = 0.92;
        textLabel.y = 104;

        this.actionButton = this.attachButton('pnlButton', () => this.onActionButtonClick(), 'actionButton');
        this.actionButton.y = 334;

        let actionLabelText = eventState.canPlay
            ? LocalizationService.get('ui.play') + ' ' + eventState.nextLevelNumber
            : LocalizationService.get('ui.ok');

        let actionLabel = new Label(this.game, 0, 0, actionLabelText, {
            font: 'bolder 52px Gilroy',
            fill: '#f0f1ec'
        });
        actionLabel.anchor.set(0.5);
        actionLabel.strokeThickness = 4;
        actionLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(actionLabel);

        if (!eventState.canPlay) {
            this.actionButton.alpha = 0.82;
        }
    }

    private getEventState(): SideEventState {
        const isConfiguredEvent = this.eventInfo.eventType == EventType.configured;
        const totalLevels = isConfiguredEvent ? EventUtils.getEventLevelsCount(this.eventInfo.eventId) : 0;
        const progress = isConfiguredEvent ? EventUtils.getEventProgress(this.eventInfo.eventId) : 0;
        const nextLevelNumber = Math.min(progress + 1, totalLevels);
        const canPlay = isConfiguredEvent
            && EventUtils.getStage(this.eventInfo) == EventStage.active
            && nextLevelNumber > 0
            && progress < totalLevels;

        return {
            canPlay: canPlay,
            nextLevelNumber: nextLevelNumber,
            progress: progress,
            totalLevels: totalLevels
        };
    }

    private attachPsdSprite(spriteId: string, name: string, x: number, y: number): Phaser.Sprite {
        const sprite = this.attachSprite(spriteId, name);
        sprite.x = x;
        sprite.y = y;
        return sprite;
    }

    private attachStretchedPsdSprite(spriteId: string, name: string, x: number, y: number, targetWidth: number, targetHeight: number): Phaser.Sprite {
        const sprite = this.attachPsdSprite(spriteId, name, x, y);
        sprite.width = targetWidth;
        sprite.height = targetHeight;
        return sprite;
    }

    private attachPsdButton(spriteId: string, callback: () => void, name: string, x: number, y: number): Phaser.Button {
        const button = this.attachButton(spriteId, callback, name);
        button.x = x;
        button.y = y;
        return button;
    }

    private applyEvent1MainImageMask(eventImage: Phaser.Sprite, imageScale: number): void {
        if (!eventImage) {
            return;
        }

        const maskX = eventImage.x;
        const maskY = eventImage.y + 17;
        const coverScale = Math.max(
            SideEventPanel.EVENT1_MAIN_IMAGE_MASK_WIDTH / eventImage.width,
            SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / eventImage.height
        );
        eventImage.scale.set(coverScale * Math.max(1, imageScale || 1));
        eventImage.y = maskY + SideEventPanel.EVENT1_MAIN_IMAGE_FOCUS_OFFSET_Y;

        this.mainImageMask = new Phaser.Graphics(this.game, maskX, maskY);
        this.mainImageMask.beginFill(0xffffff, 1);
        this.mainImageMask.drawRoundedRect(
            -SideEventPanel.EVENT1_MAIN_IMAGE_MASK_WIDTH / 2,
            -SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / 2,
            SideEventPanel.EVENT1_MAIN_IMAGE_MASK_WIDTH,
            SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT,
            SideEventPanel.EVENT1_MAIN_IMAGE_MASK_RADIUS
        );
        this.mainImageMask.endFill();
        this.addChild(this.mainImageMask);
        eventImage.mask = this.mainImageMask;
    }

    private onBackdropTap(): void {
        if (this.isDialogBlockingPanel()) {
            return;
        }

        this.close();
    }

    private onCloseButtonClick(): void {
        if (this.isDialogBlockingPanel()) {
            return;
        }

        this.close();
    }

    private isDialogBlockingPanel(): boolean {
        const screen = <HouseScreen>this.game.state.getCurrentState();
        return !!screen && !!screen.dialogPanel && screen.dialogPanel.isDialogActive();
    }

    public focusBeforeDialog(delay?: number): void {
        if (!this.mainImageSprite || this.preDialogFocusActive || this.preDialogFocusTimer) {
            return;
        }

        this.clearPreDialogTimers(false);
        this.preDialogFocusTimer = this.game.time.events.add(delay == null ? SideEventPanel.PRE_DIALOG_FOCUS_DELAY : delay, () => {
            this.preDialogFocusTimer = null;
            this.applyPreDialogFocus();
        });
    }

    public restoreAfterDialog(delay?: number): void {
        if (this.preDialogFocusTimer) {
            this.game.time.events.remove(this.preDialogFocusTimer);
            this.preDialogFocusTimer = null;
        }

        if (!this.preDialogFocusActive) {
            return;
        }

        this.clearPreDialogTimers(false);
        this.preDialogRestoreTimer = this.game.time.events.add(delay || 0, () => {
            this.preDialogRestoreTimer = null;
            this.restorePreDialogFocus();
        });
    }

    protected onClose() {
        this.stopCharacterMovement();
        this.clearPreDialogTimers(true);
        (<HouseScreen>(this.game.state.getCurrentState())).showUI();
    }

    protected onShow() {
        (<HouseScreen>(this.game.state.getCurrentState())).hideUI(0, false, this.openingWithoutAnimation);
        this.scheduleCharacterMovement();
    }

    private onActionButtonClick() {
        if (this.isDialogBlockingPanel()) {
            return;
        }

        if (this.eventInfo.eventType != EventType.configured) {
            this.close();
            return;
        }

        if (!EventUtils.startEventLevel(this.eventInfo.eventId)) {
            if (EventUtils.getStage(this.eventInfo) === EventStage.expired) {
                EventUtils.expireConfiguredEvent(this.eventInfo);
            }
            this.close();
            return;
        }

        this.actionButton.inputEnabled = false;

        let houseScreen = <HouseScreen>this.game.state.getCurrentState();
        let time = 500;
        let trees = new TreesTransitionPanel(this.game, true, time, 0);
        houseScreen.addTopOverlay(trees);

        this.game.time.events.add(time * 2, () => {
            AnalyticUtils.logLevelStart();
            houseScreen.startScreen(ForestScreen, true, false);
        }, this);
    }

    private scheduleCharacterMovement(): void {
        if (!this.characterSprite || this.eventPointPositions.length == 0) {
            return;
        }

        this.stopCharacterMovement();

        const targetPointIndex = this.getLastAvailablePointIndex();
        const targetPoint = this.getCharacterPointPosition(targetPointIndex);
        this.characterSprite.visible = true;
        this.characterSprite.alpha = 1;

        const animateLastSection = EventUtils.consumePendingCharacterTravel(this.eventInfo.eventId) && targetPointIndex > 0;
        if (!animateLastSection) {
            this.characterSprite.position.set(targetPoint.x, targetPoint.y);
            return;
        }

        const startPoint = this.getCharacterPointPosition(targetPointIndex - 1);
        this.characterSprite.position.set(startPoint.x, startPoint.y);

        this.characterMoveTimer = this.game.time.events.add(SideEventPanel.EVENT1_CHARACTER_MOVE_DELAY, () => {
            this.moveCharacterToPoint(targetPointIndex, targetPointIndex);
        });
    }

    private moveCharacterToPoint(pointIndex: number, targetPointIndex: number): void {
        if (!this.characterSprite || pointIndex > targetPointIndex) {
            return;
        }

        const targetPoint = this.getCharacterPointPosition(pointIndex);
        const duration = SideEventPanel.EVENT1_CHARACTER_MOVE_DURATION;

        this.characterMoveTween = this.game.add.tween(this.characterSprite).to(
            { x: targetPoint.x, y: targetPoint.y },
            duration,
            Phaser.Easing.Sinusoidal.InOut,
            true,
            0,
            0,
            false
        );

        this.characterMoveTween.onComplete.addOnce(() => {
            this.moveCharacterToPoint(pointIndex + 1, targetPointIndex);
        });
    }

    private getLastAvailablePointIndex(): number {
        const eventState = this.getEventState();
        const availablePointsCount = eventState.canPlay
            ? eventState.progress + 1
            : Math.max(1, eventState.progress);

        return Math.max(0, Math.min(this.eventPointPositions.length, availablePointsCount) - 1);
    }

    private getCharacterPointPosition(pointIndex: number): Phaser.Point {
        const point = this.eventPointPositions[Math.max(0, Math.min(this.eventPointPositions.length - 1, pointIndex))];
        return new Phaser.Point(point.x, point.y + SideEventPanel.EVENT1_CHARACTER_OFFSET_Y);
    }

    private stopCharacterMovement(): void {
        if (this.characterMoveTimer) {
            this.game.time.events.remove(this.characterMoveTimer);
            this.characterMoveTimer = null;
        }

        if (this.characterMoveTween) {
            this.game.tweens.remove(this.characterMoveTween);
            this.characterMoveTween = null;
        }

        if (this.characterSprite) {
            this.game.tweens.removeFrom(this.characterSprite);
        }
    }

    private applyPreDialogFocus(): void {
        if (!this.mainImageSprite || !this.visible) {
            return;
        }

        this.stopPreDialogTweens();

        this.panelBaseScaleX = this.scale.x;
        this.panelBaseScaleY = this.scale.y;
        this.preDialogFocusTargets = [];

        this.children.forEach(child => {
            if (child === this.mainImageSprite || child === this.mainImageMask) {
                return;
            }

            this.preDialogFocusTargets.push({
                target: <PIXI.DisplayObject><any>child,
                alpha: (<any>child).alpha == null ? 1 : (<any>child).alpha
            });

            this.preDialogTweens.push(this.game.add.tween(child).to(
                { alpha: 0 },
                SideEventPanel.PRE_DIALOG_FOCUS_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
        });

        this.preDialogTweens.push(this.game.add.tween(this.scale).to(
            {
                x: SideEventPanel.PRE_DIALOG_PANEL_SCALE,
                y: SideEventPanel.PRE_DIALOG_PANEL_SCALE
            },
            SideEventPanel.PRE_DIALOG_FOCUS_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        ));

        this.preDialogFocusActive = true;
    }

    private restorePreDialogFocus(): void {
        if (!this.mainImageSprite) {
            return;
        }

        this.stopPreDialogTweens();

        this.preDialogFocusTargets.forEach(state => {
            if (!state || !state.target) {
                return;
            }

            this.preDialogTweens.push(this.game.add.tween(state.target).to(
                { alpha: state.alpha },
                SideEventPanel.PRE_DIALOG_RESTORE_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
        });

        this.preDialogTweens.push(this.game.add.tween(this.scale).to(
            { x: this.panelBaseScaleX, y: this.panelBaseScaleY },
            SideEventPanel.PRE_DIALOG_RESTORE_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        ));

        this.preDialogFocusActive = false;
        this.preDialogFocusTargets = [];
    }

    private clearPreDialogTimers(resetState: boolean): void {
        if (this.preDialogFocusTimer) {
            this.game.time.events.remove(this.preDialogFocusTimer);
            this.preDialogFocusTimer = null;
        }

        if (this.preDialogRestoreTimer) {
            this.game.time.events.remove(this.preDialogRestoreTimer);
            this.preDialogRestoreTimer = null;
        }

        this.stopPreDialogTweens();

        if (resetState) {
            this.preDialogFocusActive = false;
            this.preDialogFocusTargets = [];
        }
    }

    private stopPreDialogTweens(): void {
        this.preDialogTweens.forEach(tween => {
            if (tween) {
                this.game.tweens.remove(tween);
            }
        });
        this.preDialogTweens = [];
    }
}
