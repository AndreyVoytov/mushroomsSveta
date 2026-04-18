import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import EventInfo from '../../../core/model/event/EventInfo';
import EventStage from '../../../core/model/event/EventStage';
import EventType from '../../../core/model/event/EventType';
import EventUtils from '../../../core/utils/EventUtils';
import ForestScreen from '../../screen/ForestScreen';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../panel/BasePanel';
import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import StripsPanel from '../dialog/StripsPanel';
import TreesTransitionPanel from '../panel/TreesTransitionPanel';
import { DIALOG_BOTTOM_STRIP_HEIGHT, DIALOG_BOTTOM_VISIBLE_STRIP_HEIGHT, DIALOG_TOP_STRIP_HEIGHT } from '../dialog/DialogLayoutMetrics';

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
    private static readonly PRE_DIALOG_PANEL_SCALE_SAFETY_MULTIPLIER = 1;
    private static readonly EVENT1_MAP2_UNLOCK_PROGRESS = 3;
    private static readonly EVENT1_MAP3_UNLOCK_PROGRESS = 7;
    private static readonly MAP_REVEAL_DELAY = 260;
    private static readonly MAP_REVEAL_DURATION = 340;
    private static readonly MAP_REVEAL_START_SCALE = 0.15;
    private static readonly EVENT1_CHARACTER_OFFSET_Y = -45;
    private static readonly EVENT1_CHARACTER_MOVE_DELAY = 1200;
    private static readonly EVENT1_CHARACTER_MOVE_DURATION = 540;
    private static readonly EVENT1_LOUPE_BUTTON_X = 271;
    private static readonly EVENT1_LOUPE_BUTTON_Y = -172;
    private static readonly EVENT1_LOUPE_BUTTON_ALPHA = 0.8;
    private static readonly EVENT1_LOUPE_BUTTON_SCALE = 0.7;
    private static readonly PREVIEW_STRIPS_HIDE_DURATION = Math.round(StripsPanel.SHOW_DURATION / 1.5);
    private static readonly PREVIEW_EXIT_HINT_DELAY = 500;
    private static readonly PREVIEW_EXIT_HINT_FADE_DURATION = 300;

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

    private actionButton!: Phaser.Button;
    private eventInfo: EventInfo;
    private eventPointPositions: Phaser.Point[] = [];
    private characterSprite: Phaser.Sprite | null = null;
    private characterMoveTimer: Phaser.TimerEvent | null = null;
    private characterMoveTween: Phaser.Tween | null = null;
    private mainImageSprite: Phaser.Sprite | null = null;
    private mainImageMask: Phaser.Graphics | null = null;
    private pendingMapRevealSprite: Phaser.Sprite | null = null;
    private pendingMapRevealTimer: Phaser.TimerEvent | null = null;
    private pendingMapRevealTweens: Phaser.Tween[] = [];
    private pendingMapRevealBaseScaleX = 1;
    private pendingMapRevealBaseScaleY = 1;
    private backgroundPreviewButton: Phaser.Button | null = null;
    private backgroundPreviewActive = false;
    private backgroundPreviewOverlay: BasePanel | null = null;
    private backgroundPreviewTopStrip: Phaser.Graphics | null = null;
    private backgroundPreviewBottomStrip: Phaser.Graphics | null = null;
    private backgroundPreviewHintLabel: Label | null = null;
    private backgroundPreviewHintTimer: Phaser.TimerEvent | null = null;
    private backgroundPreviewHintTween: Phaser.Tween | null = null;
    private backgroundPreviewBottomStripHeight = DIALOG_BOTTOM_STRIP_HEIGHT;
    private preDialogFocusTargets: SideEventChildAlphaState[] = [];
    private preDialogFocusTimer: Phaser.TimerEvent | null = null;
    private preDialogRestoreTimer: Phaser.TimerEvent | null = null;
    private preDialogFocusActive = false;
    private panelBaseScaleX = 1;
    private panelBaseScaleY = 1;
    private panelBaseY = 0;
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
        hitArea.events.onInputDown.add(() => this.onExpandedPreviewTap(), this);

        const eventImage = this.attachPsdSprite(
            EventUtils.getMainImage(this.eventInfo.eventType, this.eventInfo.eventId, eventState.nextLevelNumber),
            'eventImage',
            -0.5,
            -66.5
        );
        eventImage.inputEnabled = true;
        eventImage.events.onInputDown.add(() => this.onExpandedPreviewTap(), this);
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
        this.preparePendingMapReveal(map2, map3);
        this.attachPsdSprite('sideEvent1Map1', 'map1', -139.5, 36);
        this.createEvent1Character();

        this.attachPsdSprite('sideEvent1PanelRibbon', 'panelRibbon', -6.5, -491);
        let timer = this.attachPsdSprite('sideEvent1Timer', 'timerBg', -19, -464);
        timer.scale.set(1.2);

        const closeButton = this.attachPsdButton('sideEvent1PanelClose', () => this.onCloseButtonClick(), 'closeButton', 311, -576);
        closeButton.bringToTop();

        this.backgroundPreviewButton = this.attachPsdButton('loupe', () => this.onBackgroundPreviewButtonClick(), 'backgroundPreviewButton', SideEventPanel.EVENT1_LOUPE_BUTTON_X, SideEventPanel.EVENT1_LOUPE_BUTTON_Y);
        this.backgroundPreviewButton.alpha = SideEventPanel.EVENT1_LOUPE_BUTTON_ALPHA;
        this.backgroundPreviewButton.scale.set(SideEventPanel.EVENT1_LOUPE_BUTTON_SCALE);
        this.backgroundPreviewButton.bringToTop();

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

    private getConfiguredEventId(): string | null {
        return this.eventInfo.eventType == EventType.configured && this.eventInfo.eventId
            ? this.eventInfo.eventId
            : null;
    }

    private getEventState(): SideEventState {
        const configuredEventId = this.getConfiguredEventId();
        const totalLevels = configuredEventId ? EventUtils.getEventLevelsCount(configuredEventId) : 0;
        const progress = configuredEventId ? EventUtils.getEventProgress(configuredEventId) : 0;
        const nextLevelNumber = Math.min(progress + 1, totalLevels);
        const canPlay = !!configuredEventId
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

    private getPreDialogPanelScale(): number {
        const focusBounds = this.getPreDialogFocusBounds();
        if (!focusBounds) {
            return SideEventPanel.PRE_DIALOG_PANEL_SCALE;
        }

        const availableHeight = this.game.height - DIALOG_TOP_STRIP_HEIGHT - DIALOG_BOTTOM_VISIBLE_STRIP_HEIGHT;
        if (availableHeight <= 0) {
            return SideEventPanel.PRE_DIALOG_PANEL_SCALE;
        }

        return Math.max(
            SideEventPanel.PRE_DIALOG_PANEL_SCALE,
            availableHeight / (focusBounds.bottom - focusBounds.top)
        ) * SideEventPanel.PRE_DIALOG_PANEL_SCALE_SAFETY_MULTIPLIER;
    }

    private getPreDialogPanelY(panelScale: number): number {
        const focusBounds = this.getPreDialogFocusBounds();
        if (!focusBounds) {
            return this.getPanelScreenY();
        }

        const screenTop = DIALOG_TOP_STRIP_HEIGHT;
        const screenBottom = this.game.height - DIALOG_BOTTOM_VISIBLE_STRIP_HEIGHT;
        const screenCenterY = (screenTop + screenBottom) / 2;
        const focusCenterY = (focusBounds.top + focusBounds.bottom) / 2;

        return screenCenterY - focusCenterY * panelScale;
    }

    private getPreDialogFocusBounds(): { top: number, bottom: number } | null {
        if (this.mainImageMask) {
            return {
                top: this.mainImageMask.y - SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / 2,
                bottom: this.mainImageMask.y + SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / 2
            };
        }

        if (!this.mainImageSprite) {
            return null;
        }

        const anchorY = this.mainImageSprite.anchor ? this.mainImageSprite.anchor.y : 0.5;
        return {
            top: this.mainImageSprite.y - this.mainImageSprite.height * anchorY,
            bottom: this.mainImageSprite.y + this.mainImageSprite.height * (1 - anchorY)
        };
    }

    private getPanelScreenY(): number {
        return this.fixedToCamera ? this.cameraOffset.y : this.y;
    }

    private getPanelPositionTweenTarget(): Phaser.Point | Phaser.Sprite {
        return this.fixedToCamera ? this.cameraOffset : this;
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

        if (this.backgroundPreviewActive) {
            this.setBackgroundPreview(false);
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
        this.stopMapRevealAnimation(true);
        this.setBackgroundPreview(false, true);
        this.clearPreDialogTimers(true);
        this.destroyBackgroundPreviewOverlay();
        (<HouseScreen>(this.game.state.getCurrentState())).showUI();
    }

    protected onShow() {
        (<HouseScreen>(this.game.state.getCurrentState())).hideUI(0, false, this.openingWithoutAnimation);
        this.scheduleCharacterMovement();
        this.scheduleMapRevealAnimation();
    }

    private onActionButtonClick() {
        if (this.isDialogBlockingPanel()) {
            return;
        }

        if (this.eventInfo.eventType != EventType.configured) {
            this.close();
            return;
        }

        const eventId = this.getConfiguredEventId();
        if (!eventId) {
            this.close();
            return;
        }

        if (!EventUtils.startEventLevel(eventId)) {
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

    private onBackgroundPreviewButtonClick(): void {
        if (this.isDialogBlockingPanel()) {
            return;
        }

        this.setBackgroundPreview(!this.backgroundPreviewActive);
    }

    private onExpandedPreviewTap(): void {
        if (!this.backgroundPreviewActive || this.isDialogBlockingPanel()) {
            return;
        }

        this.setBackgroundPreview(false);
    }

    private setBackgroundPreview(active: boolean, instantly?: boolean): void {
        if (active) {
            if (this.backgroundPreviewActive || !this.mainImageSprite) {
                return;
            }

            this.clearPreDialogTimers(false);
            this.applyPreDialogFocus(undefined, !!instantly);
            this.showBackgroundPreviewStrips(!!instantly);
            this.backgroundPreviewActive = true;
            return;
        }

        if (!this.backgroundPreviewActive) {
            this.hideBackgroundPreviewStrips(!!instantly);
            return;
        }

        this.clearPreDialogTimers(false);
        this.restorePreDialogFocus(!!instantly);
        this.hideBackgroundPreviewStrips(!!instantly);
        this.backgroundPreviewActive = false;
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

        const eventId = this.getConfiguredEventId();
        const animateLastSection = !!eventId && EventUtils.consumePendingCharacterTravel(eventId) && targetPointIndex > 0;
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

    private preparePendingMapReveal(map2: Phaser.Sprite, map3: Phaser.Sprite): void {
        const eventId = this.getConfiguredEventId();
        const pendingMapRevealProgress = eventId ? EventUtils.consumePendingMapRevealProgress(eventId) : null;
        let pendingMapRevealSprite: Phaser.Sprite | null = null;

        if (pendingMapRevealProgress === SideEventPanel.EVENT1_MAP2_UNLOCK_PROGRESS && map2.visible) {
            pendingMapRevealSprite = map2;
        } else if (pendingMapRevealProgress === SideEventPanel.EVENT1_MAP3_UNLOCK_PROGRESS && map3.visible) {
            pendingMapRevealSprite = map3;
        }

        if (!pendingMapRevealSprite) {
            return;
        }

        this.pendingMapRevealSprite = pendingMapRevealSprite;
        this.pendingMapRevealBaseScaleX = pendingMapRevealSprite.scale.x;
        this.pendingMapRevealBaseScaleY = pendingMapRevealSprite.scale.y;
        pendingMapRevealSprite.visible = false;
        pendingMapRevealSprite.alpha = 0;
        pendingMapRevealSprite.scale.set(
            this.pendingMapRevealBaseScaleX * SideEventPanel.MAP_REVEAL_START_SCALE,
            this.pendingMapRevealBaseScaleY * SideEventPanel.MAP_REVEAL_START_SCALE
        );
    }

    private scheduleMapRevealAnimation(): void {
        if (!this.pendingMapRevealSprite) {
            return;
        }

        this.clearMapRevealAnimationHandles();

        this.pendingMapRevealTimer = this.game.time.events.add(SideEventPanel.MAP_REVEAL_DELAY, () => {
            this.pendingMapRevealTimer = null;
            this.playMapRevealAnimation();
        });
    }

    private playMapRevealAnimation(): void {
        if (!this.pendingMapRevealSprite) {
            return;
        }

        const pendingMapRevealSprite = this.pendingMapRevealSprite;
        pendingMapRevealSprite.visible = true;
        pendingMapRevealSprite.alpha = 0;
        pendingMapRevealSprite.scale.set(
            this.pendingMapRevealBaseScaleX * SideEventPanel.MAP_REVEAL_START_SCALE,
            this.pendingMapRevealBaseScaleY * SideEventPanel.MAP_REVEAL_START_SCALE
        );

        const alphaTween = this.game.add.tween(pendingMapRevealSprite).to(
            { alpha: 1 },
            SideEventPanel.MAP_REVEAL_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        );
        const scaleTween = this.game.add.tween(pendingMapRevealSprite.scale).to(
            {
                x: this.pendingMapRevealBaseScaleX,
                y: this.pendingMapRevealBaseScaleY
            },
            SideEventPanel.MAP_REVEAL_DURATION,
            Phaser.Easing.Back.Out,
            true,
            0,
            0,
            false
        );

        this.pendingMapRevealTweens = [alphaTween, scaleTween];
        alphaTween.onComplete.addOnce(() => {
            if (this.pendingMapRevealSprite === pendingMapRevealSprite) {
                pendingMapRevealSprite.alpha = 1;
                pendingMapRevealSprite.scale.set(this.pendingMapRevealBaseScaleX, this.pendingMapRevealBaseScaleY);
                this.pendingMapRevealSprite = null;
            }

            this.pendingMapRevealTweens = [];
        });
    }

    private stopMapRevealAnimation(resetState: boolean): void {
        this.clearMapRevealAnimationHandles();

        if (!this.pendingMapRevealSprite || !resetState) {
            return;
        }

        this.pendingMapRevealSprite.visible = true;
        this.pendingMapRevealSprite.alpha = 1;
        this.pendingMapRevealSprite.scale.set(this.pendingMapRevealBaseScaleX, this.pendingMapRevealBaseScaleY);
        this.pendingMapRevealSprite = null;
    }

    private clearMapRevealAnimationHandles(): void {
        if (this.pendingMapRevealTimer) {
            this.game.time.events.remove(this.pendingMapRevealTimer);
            this.pendingMapRevealTimer = null;
        }

        this.pendingMapRevealTweens.forEach(tween => {
            if (tween) {
                this.game.tweens.remove(tween);
            }
        });
        this.pendingMapRevealTweens = [];
    }

    private applyPreDialogFocus(visibleTargets?: PIXI.DisplayObject[], instantly?: boolean): void {
        if (!this.mainImageSprite || !this.visible) {
            return;
        }

        this.stopPreDialogTweens();

        const preDialogPanelScale = this.getPreDialogPanelScale();
        const preDialogPanelY = this.getPreDialogPanelY(preDialogPanelScale);
        const panelPositionTweenTarget = this.getPanelPositionTweenTarget();

        this.panelBaseScaleX = this.scale.x;
        this.panelBaseScaleY = this.scale.y;
        this.panelBaseY = this.getPanelScreenY();
        this.preDialogFocusTargets = [];
        const allowedVisibleTargets = visibleTargets || [];

        this.children.forEach(child => {
            if (child === this.mainImageSprite || child === this.mainImageMask || allowedVisibleTargets.indexOf(<PIXI.DisplayObject><any>child) != -1) {
                return;
            }

            this.preDialogFocusTargets.push({
                target: <PIXI.DisplayObject><any>child,
                alpha: (<any>child).alpha == null ? 1 : (<any>child).alpha
            });

            if (instantly) {
                (<any>child).alpha = 0;
            } else {
                this.preDialogTweens.push(this.game.add.tween(child).to(
                    { alpha: 0 },
                    SideEventPanel.PRE_DIALOG_FOCUS_DURATION,
                    Phaser.Easing.Quadratic.Out,
                    true,
                    0,
                    0,
                    false
                ));
            }
        });

        if (instantly) {
            this.scale.set(preDialogPanelScale);
            panelPositionTweenTarget.y = preDialogPanelY;
        } else {
            this.preDialogTweens.push(this.game.add.tween(this.scale).to(
                {
                    x: preDialogPanelScale,
                    y: preDialogPanelScale
                },
                SideEventPanel.PRE_DIALOG_FOCUS_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
            this.preDialogTweens.push(this.game.add.tween(panelPositionTweenTarget).to(
                { y: preDialogPanelY },
                SideEventPanel.PRE_DIALOG_FOCUS_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
        }

        this.preDialogFocusActive = true;
    }

    private restorePreDialogFocus(instantly?: boolean): void {
        if (!this.mainImageSprite) {
            return;
        }

        this.stopPreDialogTweens();

        this.preDialogFocusTargets.forEach(state => {
            if (!state || !state.target) {
                return;
            }

            if (instantly) {
                (<any>state.target).alpha = state.alpha;
            } else {
                this.preDialogTweens.push(this.game.add.tween(state.target).to(
                    { alpha: state.alpha },
                    SideEventPanel.PRE_DIALOG_RESTORE_DURATION,
                    Phaser.Easing.Quadratic.Out,
                    true,
                    0,
                    0,
                    false
                ));
            }
        });

        if (instantly) {
            this.scale.set(this.panelBaseScaleX, this.panelBaseScaleY);
            this.getPanelPositionTweenTarget().y = this.panelBaseY;
        } else {
            this.preDialogTweens.push(this.game.add.tween(this.scale).to(
                { x: this.panelBaseScaleX, y: this.panelBaseScaleY },
                SideEventPanel.PRE_DIALOG_RESTORE_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
            this.preDialogTweens.push(this.game.add.tween(this.getPanelPositionTweenTarget()).to(
                { y: this.panelBaseY },
                SideEventPanel.PRE_DIALOG_RESTORE_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            ));
        }

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

    private ensureBackgroundPreviewOverlay(): BasePanel | null {
        if (this.backgroundPreviewOverlay && this.backgroundPreviewOverlay.parent) {
            this.updateBackgroundPreviewOverlayLayout();
            return this.backgroundPreviewOverlay;
        }

        const screen = <HouseScreen>this.game.state.getCurrentState();
        if (!screen || !screen.addDialogOverlayPanel) {
            return null;
        }

        const overlay = new BasePanel(this.game, 0, 0, 'sideEventPreviewOverlay');
        overlay.fixedToCamera = false;

        this.backgroundPreviewTopStrip = new Phaser.Graphics(this.game, 0, 0);
        this.backgroundPreviewTopStrip.beginFill(0x000000, 1);
        this.backgroundPreviewTopStrip.drawRect(0, 0, this.game.width, DIALOG_TOP_STRIP_HEIGHT);
        this.backgroundPreviewTopStrip.endFill();
        this.backgroundPreviewTopStrip.y = -DIALOG_TOP_STRIP_HEIGHT;
        overlay.addChild(this.backgroundPreviewTopStrip);

        this.backgroundPreviewBottomStrip = new Phaser.Graphics(this.game, 0, 0);
        this.backgroundPreviewBottomStrip.y = this.game.height;
        overlay.addChild(this.backgroundPreviewBottomStrip);

        this.backgroundPreviewHintLabel = new Label(
            this.game,
            this.game.width / 2,
            this.backgroundPreviewBottomStripHeight / 2,
            LocalizationService.get('ui.tapToExitPreview', '\u041d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0439\u0442\u0438'),
            {
                font: '40px Gilroy',
                fill: '#9d9d9d',
                align: 'center'
            }
        );
        this.backgroundPreviewHintLabel.anchor.set(0.5);
        this.backgroundPreviewHintLabel.alpha = 0;
        this.backgroundPreviewBottomStrip.addChild(this.backgroundPreviewHintLabel);

        this.backgroundPreviewOverlay = screen.addDialogOverlayPanel(overlay);
        this.updateBackgroundPreviewOverlayLayout();
        screen.bringDialogOverlayToFront();
        return this.backgroundPreviewOverlay;
    }

    private showBackgroundPreviewStrips(instantly?: boolean): void {
        if (!this.ensureBackgroundPreviewOverlay() || !this.backgroundPreviewTopStrip || !this.backgroundPreviewBottomStrip) {
            return;
        }

        const screen = <HouseScreen>this.game.state.getCurrentState();
        if (screen && screen.bringDialogOverlayToFront) {
            screen.bringDialogOverlayToFront();
        }

        this.game.tweens.removeFrom(this.backgroundPreviewTopStrip);
        this.game.tweens.removeFrom(this.backgroundPreviewBottomStrip);
        this.resetBackgroundPreviewHint();

        if (instantly) {
            this.backgroundPreviewTopStrip.y = 0;
            this.backgroundPreviewBottomStrip.y = this.game.height - this.backgroundPreviewBottomStripHeight;
            this.scheduleBackgroundPreviewHint();
            return;
        }

        this.game.add.tween(this.backgroundPreviewTopStrip).to(
            { y: 0 },
            StripsPanel.SHOW_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.backgroundPreviewBottomStrip).to(
            { y: this.game.height - this.backgroundPreviewBottomStripHeight },
            StripsPanel.SHOW_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        );
        this.scheduleBackgroundPreviewHint();
    }

    private hideBackgroundPreviewStrips(instantly?: boolean): void {
        if (!this.backgroundPreviewTopStrip || !this.backgroundPreviewBottomStrip) {
            return;
        }

        this.game.tweens.removeFrom(this.backgroundPreviewTopStrip);
        this.game.tweens.removeFrom(this.backgroundPreviewBottomStrip);
        this.resetBackgroundPreviewHint();

        if (instantly) {
            this.backgroundPreviewTopStrip.y = -DIALOG_TOP_STRIP_HEIGHT;
            this.backgroundPreviewBottomStrip.y = this.game.height;
            return;
        }

        this.game.add.tween(this.backgroundPreviewTopStrip).to(
            { y: -DIALOG_TOP_STRIP_HEIGHT },
            SideEventPanel.PREVIEW_STRIPS_HIDE_DURATION,
            Phaser.Easing.Quadratic.Out,
            true,
            0,
            0,
            false
        );
        this.game.add.tween(this.backgroundPreviewBottomStrip).to(
            { y: this.game.height },
            SideEventPanel.PREVIEW_STRIPS_HIDE_DURATION,
            Phaser.Easing.Quadratic.In,
            true,
            0,
            0,
            false
        );
    }

    private destroyBackgroundPreviewOverlay(): void {
        if (this.backgroundPreviewTopStrip) {
            this.game.tweens.removeFrom(this.backgroundPreviewTopStrip);
        }

        if (this.backgroundPreviewBottomStrip) {
            this.game.tweens.removeFrom(this.backgroundPreviewBottomStrip);
        }

        this.resetBackgroundPreviewHint();

        if (this.backgroundPreviewOverlay) {
            this.backgroundPreviewOverlay.destroy(true);
        }

        this.backgroundPreviewOverlay = null;
        this.backgroundPreviewTopStrip = null;
        this.backgroundPreviewBottomStrip = null;
        this.backgroundPreviewHintLabel = null;
        this.backgroundPreviewBottomStripHeight = DIALOG_BOTTOM_STRIP_HEIGHT;
        this.backgroundPreviewActive = false;
    }

    private updateBackgroundPreviewOverlayLayout(): void {
        this.backgroundPreviewBottomStripHeight = this.shouldUseSymmetricPreviewStrips()
            ? DIALOG_TOP_STRIP_HEIGHT
            : DIALOG_BOTTOM_STRIP_HEIGHT;

        if (this.backgroundPreviewTopStrip) {
            this.backgroundPreviewTopStrip.clear();
            this.backgroundPreviewTopStrip.beginFill(0x000000, 1);
            this.backgroundPreviewTopStrip.drawRect(0, 0, this.game.width, DIALOG_TOP_STRIP_HEIGHT);
            this.backgroundPreviewTopStrip.endFill();
        }

        if (this.backgroundPreviewBottomStrip) {
            this.backgroundPreviewBottomStrip.clear();
            this.backgroundPreviewBottomStrip.beginFill(0x000000, 1);
            this.backgroundPreviewBottomStrip.drawRect(0, 0, this.game.width, this.backgroundPreviewBottomStripHeight);
            this.backgroundPreviewBottomStrip.endFill();
        }

        if (this.backgroundPreviewHintLabel) {
            this.backgroundPreviewHintLabel.x = this.game.width / 2;
            this.backgroundPreviewHintLabel.y = Math.round(this.backgroundPreviewBottomStripHeight / 2);
        }
    }

    private scheduleBackgroundPreviewHint(): void {
        if (!this.backgroundPreviewHintLabel) {
            return;
        }

        this.resetBackgroundPreviewHint();
        this.backgroundPreviewHintLabel.alpha = 0;
        this.backgroundPreviewHintTimer = this.game.time.events.add(SideEventPanel.PREVIEW_EXIT_HINT_DELAY, () => {
            this.backgroundPreviewHintTimer = null;

            if (!this.backgroundPreviewHintLabel || !this.backgroundPreviewActive) {
                return;
            }

            this.backgroundPreviewHintTween = this.game.add.tween(this.backgroundPreviewHintLabel).to(
                { alpha: 0.3 },
                SideEventPanel.PREVIEW_EXIT_HINT_FADE_DURATION,
                Phaser.Easing.Quadratic.Out,
                true,
                0,
                0,
                false
            );
            this.backgroundPreviewHintTween.onComplete.addOnce(() => {
                this.backgroundPreviewHintTween = null;
            });
        });
    }

    private resetBackgroundPreviewHint(): void {
        if (this.backgroundPreviewHintTimer) {
            this.game.time.events.remove(this.backgroundPreviewHintTimer);
            this.backgroundPreviewHintTimer = null;
        }

        if (this.backgroundPreviewHintTween) {
            this.game.tweens.remove(this.backgroundPreviewHintTween);
            this.backgroundPreviewHintTween = null;
        }

        if (this.backgroundPreviewHintLabel) {
            this.backgroundPreviewHintLabel.alpha = 0;
        }
    }

    private shouldUseSymmetricPreviewStrips(): boolean {
        const visibleBounds = this.getPreviewVisibleContentBounds();
        if (!visibleBounds) {
            return false;
        }

        const panelScale = this.getPreDialogPanelScale();
        const panelY = this.getPreDialogPanelY(panelScale);
        const visibleTop = panelY + visibleBounds.top * panelScale;
        const visibleBottom = panelY + visibleBounds.bottom * panelScale;
        const symmetricTopStripBottom = DIALOG_TOP_STRIP_HEIGHT;
        const symmetricBottomStripTop = this.game.height - DIALOG_TOP_STRIP_HEIGHT;

        return visibleTop <= symmetricTopStripBottom + 1
            && visibleBottom >= symmetricBottomStripTop - 1;
    }

    private getPreviewVisibleContentBounds(): { top: number, bottom: number } | null {
        if (this.mainImageMask && this.mainImageSprite) {
            const anchorY = this.mainImageSprite.anchor ? this.mainImageSprite.anchor.y : 0.5;
            const imageTop = this.mainImageSprite.y - this.mainImageSprite.height * anchorY;
            const imageBottom = this.mainImageSprite.y + this.mainImageSprite.height * (1 - anchorY);
            const maskTop = this.mainImageMask.y - SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / 2;
            const maskBottom = this.mainImageMask.y + SideEventPanel.EVENT1_MAIN_IMAGE_MASK_HEIGHT / 2;

            return {
                top: Math.max(maskTop, imageTop),
                bottom: Math.min(maskBottom, imageBottom)
            };
        }

        return this.getPreDialogFocusBounds();
    }
}
