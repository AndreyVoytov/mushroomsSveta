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

export default class EventPanel extends ClosablePanel {

    private actionButton: Phaser.Button;
    private eventInfo: EventInfo;

    constructor(game: Phaser.Game, eventInfo: EventInfo) {
        super(game, game.width / 2, game.height / 2, false, "blank");

        this.eventInfo = eventInfo;
        this.visible = false;
        this.fixedToCamera = true;
        this.blackTransparent.events.onInputDown.add(() => this.onBackdropTap(), this);

        let isConfiguredEvent = eventInfo.eventType == EventType.configured;
        let totalLevels = isConfiguredEvent ? EventUtils.getEventLevelsCount(eventInfo.eventId) : 0;
        let progress = isConfiguredEvent ? EventUtils.getEventProgress(eventInfo.eventId) : 0;
        let nextLevelNumber = Math.min(progress + 1, totalLevels);
        let canPlay = isConfiguredEvent && EventUtils.getStage(eventInfo) == EventStage.active && nextLevelNumber > 0 && progress < totalLevels;

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

        let icon = this.attachSprite(EventUtils.getMainImage(eventInfo.eventType, eventInfo.eventId), 'eventIcon');
        icon.anchor.set(0.5);
        icon.y = -200;
        icon.scale.set(isConfiguredEvent ? 1.18 : 1.45);

        let closeButton = this.attachButton('closeButtonViolet', () => this.onCloseButtonClick());
        closeButton.x = 330;
        closeButton.y = -360;

        let title = this.attachText('titleLabel', EventUtils.getName(eventInfo.eventType, eventInfo.eventId), {
            font: '46px Bookman Old Style',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 620
        });
        title.y = -366;

        let remainLabel = this.attachText('remainLabel', EventUtils.getRemainTime(eventInfo.eventEndAt), {
            font: 'bold 34px Arial',
            fill: '#8f6130',
            align: 'center'
        });
        remainLabel.y = -84;
        this.game.time.events.loop(1000, () => {
            remainLabel.text = EventUtils.getRemainTime(eventInfo.eventEndAt);
        });

        if (isConfiguredEvent) {
            let progressLabel = this.attachText('progressLabel', progress + '/' + totalLevels, {
                font: 'bold 54px Gilroy',
                fill: '#7b4037',
                align: 'center'
            });
            progressLabel.y = -20;
            progressLabel.addStrokeColor('#f8ebd4', 0);
            progressLabel.strokeThickness = 4;
        }

        let textLabel = this.attachText('textLabel', EventUtils.getDesc(eventInfo.eventType, eventInfo.eventId), {
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

        let actionLabelText = LocalizationService.get('ui.ok');
        if (isConfiguredEvent) {
            actionLabelText = canPlay ? LocalizationService.get('ui.play') + ' ' + nextLevelNumber : LocalizationService.get('ui.ok');
        }

        let actionLabel = new Label(this.game, 0, 0, actionLabelText, {
            font: 'bolder 52px Gilroy',
            fill: '#f0f1ec'
        });
        actionLabel.anchor.set(0.5);
        actionLabel.strokeThickness = 4;
        actionLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(actionLabel);

        if (isConfiguredEvent && !canPlay) {
            this.actionButton.alpha = 0.82;
        }
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

    protected onClose() {
        (<HouseScreen>(this.game.state.getCurrentState())).showUI();
    }

    protected onShow() {
        (<HouseScreen>(this.game.state.getCurrentState())).hideUI();
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
        trees.fixedToCamera = true;
        houseScreen.addTopOverlay(trees);

        this.game.time.events.add(time * 2, () => {
            AnalyticUtils.logLevelStart();
            houseScreen.startScreen(ForestScreen, true, false);
        }, this);
    }
}
