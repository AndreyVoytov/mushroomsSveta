import LocalizationService from "../../../core/localization/LocalizationService";
import TaskService from "../../../core/service/TaskService";
import SpriteUtils from "../../../core/utils/SpriteUtils";
import EnergyUtils from "../../../core/utils/EnergyUtils";
import HouseScreen from "../../screen/HouseScreen";
import ClosablePanel from "../panel/ClosablePanel";
import BasePanel from "../panel/BasePanel";
import Label from "../panel/Label";
import InfoPanel from "../panel/InfoPanel";
import StackContainer from "../panel/StackContainer";
import {
    CampaignChapterView,
    TaskProgressView,
    TaskRewardGrant,
    TaskRewardView
} from "../../../core/model/task/TaskModels";

type TasksTab = "daily" | "campaign";

type TasksPanelHooks = {
    onUpdated?: () => void;
};

class TaskCardPanel extends BasePanel {
    private background: Phaser.Sprite;
    private contentPanel: Phaser.Sprite;
    private rewardPanel: Phaser.Sprite;
    private icon: Phaser.Sprite;
    private titleLabel: Label;
    private progressLabel: Label;
    private rewardTitleLabel: Label;
    private rewardIcon: Phaser.Sprite;
    private rewardLabel: Label;
    private claimButton: Phaser.Button;
    private claimTitleLabel: Label;
    private claimRewardIcon: Phaser.Sprite;
    private claimRewardLabel: Label;
    private checkIcon: Phaser.Sprite;
    private currentTaskId: string;
    private onClaim: (taskId: string) => void;

    constructor(game: Phaser.Game, name: string, onClaim: (taskId: string) => void) {
        super(game, 0, 0, name, "blank");
        this.onClaim = onClaim;

        this.background = this.attachSprite("panel2", "cardBg");
        this.background.scale.set(0.98, 0.35);

        this.contentPanel = this.attachSprite("helperPanel", "contentPanel");
        this.contentPanel.scale.set(0.73, 0.44);
        this.contentPanel.alpha = 0.96;

        this.rewardPanel = this.attachSprite("helperPanel", "rewardPanel");
        this.rewardPanel.scale.set(0.23, 0.44);
        // this.rewardPanel.alpha = 0.38;

        this.icon = this.attachSprite("mushroom", "taskIcon");
        this.icon.scale.set(0.78);

        this.titleLabel = this.attachText("taskTitle", "", {
            font: "bold 22px Arial",
            fill: "#6f4337",
            align: "left",
            wordWrap: true,
            wordWrapWidth: 300
        });
        this.titleLabel.anchor.set(0, 0.5);

        this.progressLabel = this.attachText("taskProgress", "", {
            font: "bold 24px Gilroy",
            fill: "#6f4337",
            align: "right",
            wordWrap: true,
            wordWrapWidth: 88
        });
        this.progressLabel.anchor.set(1, 0.5);

        this.rewardTitleLabel = this.attachText("rewardTitle", LocalizationService.get("ui.tasks.reward", "Награда"), {
            font: "bold 21px Arial",
            fill: "#7b4037",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 140
        });
        this.rewardTitleLabel.anchor.set(0.5);

        this.rewardIcon = this.attachSprite("gems", "rewardIcon");
        this.rewardIcon.scale.set(0.42);

        this.rewardLabel = this.attachText("rewardLabel", "2", {
            font: "bold 30px Gilroy",
            fill: "#7b4037"
        });
        this.rewardLabel.anchor.set(0.5);

        this.claimButton = this.attachButton("pnlButton", () => this.tryClaim(), "claimButton");
        this.claimButton.scale.set(0.35, 1.18);

        this.claimTitleLabel = this.attachText("claimTitle", LocalizationService.get("ui.tasks.claim", "Забрать"), {
            font: "bold 24px Gilroy",
            fill: "#4d5b18",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 160
        });
        this.claimTitleLabel.anchor.set(0.5);

        this.claimRewardIcon = this.attachSprite("gems", "claimRewardIcon");
        this.claimRewardIcon.scale.set(0.36);

        this.claimRewardLabel = this.attachText("claimRewardLabel", "2", {
            font: "bold 30px Gilroy",
            fill: "#7b4037"
        });
        this.claimRewardLabel.anchor.set(0.5);

        this.checkIcon = this.attachSprite("check", "checkIcon");
        this.checkIcon.scale.set(0.32);

        this.applyHtmlPreset([
            { "spriteId": "contentPanel", "parentId": "cardBg", "horizontalAlign": "left", "verticalAlign": "center", "offsetX": 46, "offsetY": 0 },
            { "spriteId": "rewardPanel", "parentId": "cardBg", "horizontalAlign": "right", "verticalAlign": "center", "offsetX": -60, "offsetY": 0 },
            { "spriteId": "taskTitle", "parentId": "contentPanel", "horizontalAlign": "left", "verticalAlign": "center", "width": "54%", "offsetX": 24, "offsetY": -2, "fontSize": 22 },
            { "spriteId": "taskIcon", "parentId": "contentPanel", "horizontalAlign": "right", "verticalAlign": "center", "offsetX": -34, "offsetY": 0 },
            { "spriteId": "taskProgress", "parentId": "contentPanel", "horizontalAlign": "right", "verticalAlign": "center", "width": 88, "offsetX": -116, "offsetY": -2, "fontSize": 24 },
            { "spriteId": "checkIcon", "parentId": "contentPanel", "horizontalAlign": "right", "verticalAlign": "center", "offsetX": -128, "offsetY": 0 },
            { "spriteId": "rewardTitle", "parentId": "rewardPanel", "horizontalAlign": "center", "verticalAlign": "top", "width": "84%", "offsetY": 22, "fontSize": 20 },
            { "spriteId": "rewardLabel", "parentId": "rewardPanel", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": -18, "offsetY": 24, "fontSize": 30 },
            { "spriteId": "rewardIcon", "parentId": "rewardPanel", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": 20, "offsetY": 24 },
            { "spriteId": "claimButton", "parentId": "cardBg", "horizontalAlign": "right", "verticalAlign": "center", "offsetX": -52, "offsetY": 0 },
            { "spriteId": "claimTitle", "parentId": "claimButton", "horizontalAlign": "center", "verticalAlign": "top", "width": "84%", "offsetY": 32, "fontSize": 24 },
            { "spriteId": "claimRewardLabel", "parentId": "claimButton", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": -18, "offsetY": 20, "fontSize": 30 },
            { "spriteId": "claimRewardIcon", "parentId": "claimButton", "horizontalAlign": "center", "verticalAlign": "center", "offsetX": 20, "offsetY": 20 }
        ]);

        (<any>this).layoutBox = {
            x: this.background.x - this.background.width * this.background.anchor.x,
            y: this.background.y - this.background.height * this.background.anchor.y,
            width: this.background.width,
            height: this.background.height
        };
    }

    public setData(taskView: TaskProgressView, claimLabel: string): void {
        if (!taskView) {
            this.visible = false;
            return;
        }

        this.visible = true;
        this.currentTaskId = taskView.task.id;

        SpriteUtils.loadTexture(this.icon, taskView.task.icon);
        this.icon.scale.set(this.getScaleForIcon(taskView.task.icon));

        let rewardIcon = taskView.task.reward && taskView.task.reward.boosters && taskView.task.reward.boosters.length > 0
            ? taskView.task.reward.boosters[0].type
            : "gems";
        let rewardCount = taskView.task.reward && taskView.task.reward.boosters && taskView.task.reward.boosters.length > 0
            ? taskView.task.reward.boosters[0].count
            : ((taskView.task.reward && taskView.task.reward.gems) || 2);

        SpriteUtils.loadTexture(this.rewardIcon, rewardIcon);
        this.rewardIcon.scale.set(this.getRewardScale(rewardIcon, false));
        SpriteUtils.loadTexture(this.claimRewardIcon, rewardIcon);
        this.claimRewardIcon.scale.set(this.getRewardScale(rewardIcon, true));
        this.rewardLabel.text = "" + rewardCount;
        this.claimRewardLabel.text = "" + rewardCount;
        this.titleLabel.text = taskView.task.title;
        this.progressLabel.text = taskView.progress + "/" + taskView.task.target;
        this.claimTitleLabel.text = claimLabel;

        let isClaimable = taskView.isClaimable && !taskView.isClaimed;
        let isClaimed = taskView.isClaimed;

        this.progressLabel.visible = !isClaimable && !isClaimed;
        this.checkIcon.visible = isClaimable || isClaimed;

        this.rewardPanel.visible = !isClaimable;
        this.rewardTitleLabel.visible = !isClaimable;
        this.rewardIcon.visible = !isClaimable && !isClaimed;
        this.rewardLabel.visible = !isClaimable && !isClaimed;
        this.rewardTitleLabel.text = isClaimed
            ? LocalizationService.get("ui.tasks.rewardReceived", "Награда получена")
            : LocalizationService.get("ui.tasks.reward", "Награда");

        this.applyHtmlPreset([
            isClaimed
                ? { "spriteId": "rewardTitle", "parentId": "rewardPanel", "horizontalAlign": "center", "verticalAlign": "center", "width": "84%", "offsetY": 0, "fontSize": 20 }
                : { "spriteId": "rewardTitle", "parentId": "rewardPanel", "horizontalAlign": "center", "verticalAlign": "top", "width": "84%", "offsetY": 22, "fontSize": 20 }
        ]);

        this.claimButton.visible = isClaimable;
        this.claimButton.inputEnabled = isClaimable;
        this.claimTitleLabel.visible = isClaimable;
        this.claimRewardIcon.visible = isClaimable;
        this.claimRewardLabel.visible = isClaimable;

        this.background.tint = 0xffffff;
        this.contentPanel.tint = 0xffffff;
        this.background.alpha = 0;// = 0xffffff;
        this.rewardPanel.tint = 0xf5beb0;
        this.titleLabel.fill = "#6f4337";
        this.progressLabel.fill = "#6f4337";

        if (isClaimed) {
            // this.rewardPanel.alpha = 0.7;
            this.rewardTitleLabel.fill = "#7b4037";
            this.rewardLabel.fill = "#7b4037";
        } else {
            // this.rewardPanel.alpha = 0.7;
            this.rewardTitleLabel.fill = "#7b4037";
            this.rewardLabel.fill = "#7b4037";
        }
    }

    private tryClaim(): void {
        if (!this.currentTaskId || !this.claimButton.inputEnabled) {
            return;
        }

        this.onClaim(this.currentTaskId);
    }

    private getScaleForIcon(icon: string): number {
        switch (icon) {
            case "lightning":
                return 0.44;
            case "playButton":
                return 0.34;
            case "acorn":
                return 0.62;
            default:
                return 0.7;
        }
    }

    private getRewardScale(icon: string, insideButton: boolean): number {
        switch (icon) {
            case "gems":
                return insideButton ? 0.36 : 0.32;
            case "actionChest":
                return insideButton ? 0.44 : 0.5;
            default:
                return insideButton ? 0.52 : 0.6;
        }
    }
}

export default class TasksPanel extends ClosablePanel {
    private tasksViewportWidth: number = 760;
    private tasksViewportHeight: number = 472;
    private taskCardsBackgroundWidthInset: number = 44;
    private taskCardsBackgroundHeightExtra: number = 28;
    private screen: HouseScreen;
    private hooks: TasksPanelHooks;
    private panel: Phaser.Sprite;
    private titleLabel: Label;
    private dailyTabButton: Phaser.Button;
    private campaignTabButton: Phaser.Button;
    private dailyTabLabel: Label;
    private campaignTabLabel: Label;
    private chapterButtons: Phaser.Button[] = [];
    private chapterLabels: Label[] = [];
    private progressTitle: Label;
    private progressLineBg: Phaser.Sprite;
    private progressBarStart: Phaser.Sprite;
    private progressBarBody: Phaser.TileSprite;
    private progressBarTail: Phaser.Sprite;
    private progressBarEndCircle: Phaser.Sprite;
    private progressBarEndReward: Phaser.Sprite;
    private progressBarEndCheck: Phaser.Sprite;
    private resetLabel: Label;
    private subtitleLabel: Label;
    private rewardIcons: Phaser.Sprite[] = [];
    private rewardChecks: Phaser.Sprite[] = [];
    private taskCards: TaskCardPanel[] = [];
    private taskCardsBackground: Phaser.Sprite;
    private taskCardsViewport: Phaser.Group;
    private taskCardsStack: StackContainer;
    private taskCardsMask: Phaser.Graphics;
    private taskCardsDragArea: Phaser.Sprite;
    private taskScrollTrack: Phaser.Sprite;
    private taskScrollThumb: Phaser.Sprite;
    private taskScrollOffset: number = 0;
    private taskMaxScrollOffset: number = 0;
    private dragStartPointerY: number = 0;
    private dragStartScrollOffset: number = 0;
    private draggingTaskList: boolean = false;
    private draggingTaskThumb: boolean = false;
    private wheelListener: (e: WheelEvent) => void;

    private selectedTab: TasksTab = "daily";
    private selectedChapterIndex: number = 0;

    constructor(game: Phaser.Game, screen: HouseScreen, hooks?: TasksPanelHooks) {
        super(game, game.width / 2, game.height / 2 - 8, true, "blank", 1.02);
        this.screen = screen;
        this.hooks = hooks || {};
        this.wheelListener = e => this.onMouseWheel(e);
        this.visible = false;
        this.fixedToCamera = true;

        this.panel = this.attachSprite("panel2", "panel");
        this.panel.scale.set(1.2, 1.74);
        this.panel.y = 18;
        this.panel.inputEnabled = true;

        const titleBg = this.attachSprite("ribbon", "titleBg");
        titleBg.scale.set(0.7, 1);

        const closeButton = this.attachButton("closeButtonViolet", () => this.close(), "closeButton");

        this.titleLabel = this.attachText("title", LocalizationService.get("ui.tasks.title", "Задания"), {
            font: "35px Bookman Old Style",
            fill: "#ffffff"
        });

        this.dailyTabButton = this.attachButton("wooden_tab", () => this.selectTab("daily"), "dailyTab");
        this.dailyTabButton.scale.set(1.18);
        this.dailyTabLabel = new Label(this.game, 0, 0, LocalizationService.get("ui.tasks.daily", "Ежедневные"), {
            font: "bold 28px Gilroy",
            fill: "#f0f1ec"
        });
        this.dailyTabLabel.name = "dailyTabLabel";
        this.dailyTabLabel.anchor.set(0.5);
        this.dailyTabLabel.strokeThickness = 4;
        this.dailyTabLabel.addStrokeColor("#61b019", 0);
        this.dailyTabButton.addChild(this.dailyTabLabel);

        this.campaignTabButton = this.attachButton("wooden_tab", () => this.selectTab("campaign"), "campaignTab");
        this.campaignTabButton.scale.set(1.18);
        this.campaignTabLabel = new Label(this.game, 0, 0, LocalizationService.get("ui.tasks.campaign", "Кампания"), {
            font: "bold 28px Gilroy",
            fill: "#f0f1ec"
        });
        this.campaignTabLabel.name = "campaignTabLabel";
        this.campaignTabLabel.anchor.set(0.5);
        this.campaignTabLabel.strokeThickness = 4;
        this.campaignTabLabel.addStrokeColor("#61b019", 0);
        this.campaignTabButton.addChild(this.campaignTabLabel);

        this.subtitleLabel = this.attachText("subtitle", "", {
            font: "bold 24px Arial",
            fill: "#7b4037",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 560
        });

        this.progressTitle = this.attachText("progressTitle", "", {
            font: "bold 28px Arial",
            fill: "#7b4037",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 520
        });

        this.progressLineBg = this.attachSprite("progressLineBg", "progressLineBg");
        this.progressLineBg.scale.set(1.0, 0.72);

        this.progressBarBody = SpriteUtils.createTileSprite(this.game, 0, 0, 50, 31, "progressBody");
        this.progressBarBody.name = "progressBarBody";
        this.progressBarBody.anchor.set(0, 0.5);
        this.addSprite(this.progressBarBody);

        this.progressBarStart = this.attachSprite("progressTail", "progressBarStart");
        this.progressBarStart.scale.set(-1.02, 1.24);

        this.progressBarTail = this.attachSprite("progressTail", "progressBarTail");
        this.progressBarTail.scale.set(1.02, 1.24);

        this.progressBarEndCircle = this.attachSprite("circle", "progressBarEndCircle");
        this.progressBarEndCircle.scale.set(0.74);

        this.progressBarEndReward = this.attachSprite("actionChest", "progressBarEndReward");
        this.progressBarEndReward.scale.set(0.58);

        this.progressBarEndCheck = this.attachSprite("check", "progressBarEndCheck");
        this.progressBarEndCheck.scale.set(0.32);

        this.resetLabel = this.attachText("resetLabel", "", {
            font: "bold 20px Arial",
            fill: "#9b6536",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 460
        });

        for (let i = 0; i < 2; i++) {
            let rewardIcon = this.attachSprite(i == 0 ? "gems" : "actionChest", "rewardIcon" + i);
            rewardIcon.scale.set(i == 0 ? 0.42 : 0.52);
            this.rewardIcons.push(rewardIcon);

            let rewardCheck = this.attachSprite("check", "rewardCheck" + i);
            rewardCheck.scale.set(0.34);
            this.rewardChecks.push(rewardCheck);
        }

        this.taskCardsBackground = this.attachSprite("helperPanel", "taskCardsBackground");
        this.taskCardsBackground.width = this.tasksViewportWidth - this.taskCardsBackgroundWidthInset;
        this.taskCardsBackground.height = this.tasksViewportHeight + this.taskCardsBackgroundHeightExtra;
        this.taskCardsBackground.tint = 0x8c5b36;
        this.taskCardsBackground.alpha = 0.38;
        this.taskCardsBackground.inputEnabled = false;

        this.taskCardsViewport = new Phaser.Group(this.game, null, "taskCardsViewport");
        (<any>this.taskCardsViewport).layoutBox = { x: 0, y: 0, width: this.tasksViewportWidth, height: this.tasksViewportHeight };
        this.addChild(this.taskCardsViewport);

        this.taskCardsDragArea = SpriteUtils.createSprite(this.game, 0, 0, "blank");
        this.taskCardsDragArea.name = "taskCardsDragArea";
        this.taskCardsDragArea.anchor.set(0);
        this.taskCardsDragArea.alpha = 0.001;
        this.taskCardsDragArea.inputEnabled = true;
        this.taskCardsDragArea.events.onInputDown.add(this.onTaskListPointerDown, this);
        this.taskCardsViewport.add(this.taskCardsDragArea);

        this.taskCardsStack = new StackContainer(this.game, 0, 0, "taskCardsStack", {
            gap: -45,
            align: "center",
            layoutWidth: this.tasksViewportWidth
        });
        this.taskCardsViewport.add(this.taskCardsStack);

        this.taskCardsMask = new Phaser.Graphics(this.game, 0, 0);
        this.taskCardsMask.alpha = 0;
        this.addChild(this.taskCardsMask);
        (<any>this.taskCardsViewport).mask = this.taskCardsMask;

        this.taskScrollTrack = this.attachSprite("blank", "taskScrollTrack");
        this.taskScrollTrack.anchor.set(0, 0);
        this.taskScrollTrack.width = 10;
        this.taskScrollTrack.height = this.tasksViewportHeight;
        this.taskScrollTrack.tint = 0x7b4037;
        this.taskScrollTrack.alpha = 0.24;

        this.taskScrollThumb = this.attachSprite("blank", "taskScrollThumb");
        this.taskScrollThumb.anchor.set(0, 0);
        this.taskScrollThumb.width = 10;
        this.taskScrollThumb.height = 90;
        this.taskScrollThumb.tint = 0xf2d4a5;
        this.taskScrollThumb.alpha = 0.95;
        this.taskScrollThumb.inputEnabled = true;
        this.taskScrollThumb.events.onInputDown.add(this.onTaskThumbPointerDown, this);

        this.game.input.addMoveCallback(this.onGlobalPointerMove, this);
        this.game.input.onUp.add(this.onGlobalPointerUp, this);

        TaskService.getCampaignChapterViews().forEach((chapterView, index) => {
            let button = this.attachButton("pnlButton", () => this.selectChapter(index), "chapterTab" + index);
            button.scale.set(0.48, 0.58);
            let label = new Label(this.game, 0, 0, chapterView.chapter.title, {
                font: "bold 20px Gilroy",
                fill: "#f0f1ec"
            });
            label.name = "chapterTabLabel" + index;
            label.anchor.set(0.5);
            label.strokeThickness = 4;
            label.addStrokeColor("#61b019", 0);
            button.addChild(label);
            this.chapterButtons.push(button);
            this.chapterLabels.push(label);
        });

        for (let i = 0; i < 5; i++) {
            let card = new TaskCardPanel(this.game, "taskCard" + i, taskId => this.onClaimTask(taskId));
            this.taskCardsStack.addStackChild(card);
            this.taskCards.push(card);
        }

        let htmlPresets: any[] = [
            { "spriteId": "titleBg", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": -54 },
            { "spriteId": "title", "parentId": "titleBg", "horizontalAlign": "center", "verticalAlign": "center", "width": "88%", "offsetY": -24, "fontSize": 48 },
            { "spriteId": "closeButton", "parentId": "titleBg", "horizontalAlign": "right", "verticalAlign": "middle", "offsetX": -35, "offsetY": 0 },
            { "spriteId": "dailyTab", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetX": -188, "offsetY": 52 },
            { "spriteId": "dailyTabLabel", "parentId": "dailyTab", "horizontalAlign": "center", "verticalAlign": "center", "width": "86%", "offsetY": 2, "fontSize": 28 },
            { "spriteId": "campaignTab", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetX": 188, "offsetY": 52 },
            { "spriteId": "campaignTabLabel", "parentId": "campaignTab", "horizontalAlign": "center", "verticalAlign": "center", "width": "86%", "offsetY": 2, "fontSize": 28 },
            { "spriteId": "subtitle", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "86%", "offsetY": 150, "fontSize": 24 },
            { "spriteId": "progressTitle", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "84%", "offsetY": 192, "fontSize": 28 },
            { "spriteId": "progressLineBg", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": 248 },
            { "spriteId": "resetLabel", "parentId": "progressLineBg", "horizontalAlign": "center", "verticalAlign": "bottom", "offsetY": 38, "width": "86%", "fontSize": 20 },
            { "spriteId": "taskCardsBackground", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": 382 },
            { "spriteId": "taskCardsViewport", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": 382 },
            { "spriteId": "taskScrollTrack", "parentId": "taskCardsViewport", "horizontalAlign": "right", "verticalAlign": "top", "offsetX": 16 },
            { "spriteId": "taskScrollThumb", "parentId": "taskCardsViewport", "horizontalAlign": "right", "verticalAlign": "top", "offsetX": 16 }
        ];

        this.chapterButtons.forEach((_button, index) => {
            htmlPresets.push({
                "spriteId": "chapterTab" + index,
                "parentId": "panel",
                "horizontalAlign": "center",
                "verticalAlign": "top",
                "offsetX": -170 + index * 170,
                "offsetY": 92
            });
            htmlPresets.push({
                "spriteId": "chapterTabLabel" + index,
                "parentId": "chapterTab" + index,
                "horizontalAlign": "center",
                "verticalAlign": "center",
                "width": "86%",
                "offsetY": 1,
                "fontSize": 20
            });
        });

        this.rewardIcons.forEach((_icon, index) => {
            htmlPresets.push({
                "spriteId": "rewardIcon" + index,
                "parentId": "panel",
                "horizontalAlign": "left",
                "verticalAlign": "top",
                "offsetX": 120 + index * 328,
                "offsetY": 204
            });
            htmlPresets.push({
                "spriteId": "rewardCheck" + index,
                "parentId": "panel",
                "horizontalAlign": "left",
                "verticalAlign": "top",
                "offsetX": 138 + index * 328,
                "offsetY": 188
            });
        });

        this.applyHtmlPreset(htmlPresets);
        this.configureTaskViewport();

        this.selectedTab = this.getPreferredTab();
        this.selectedChapterIndex = TaskService.getCurrentCampaignChapterIndex();
        this.refreshView();
    }

    protected onShow(): void {
        this.selectedChapterIndex = TaskService.getCurrentCampaignChapterIndex();
        this.selectTab(this.getPreferredTab(), true);
        document.body.removeEventListener("wheel", this.wheelListener);
        document.body.addEventListener("wheel", this.wheelListener, false);
        this.screen.hideUI(0, true);
    }

    protected onClose(): void {
        document.body.removeEventListener("wheel", this.wheelListener);
        this.draggingTaskList = false;
        this.draggingTaskThumb = false;
        this.screen.showUI(true);
    }

    private selectTab(tab: TasksTab, claimSectionRewards?: boolean): void {
        this.selectedTab = tab;
        if (tab == "campaign") {
            this.selectedChapterIndex = Math.min(this.selectedChapterIndex, TaskService.getCurrentCampaignChapterIndex());
        }

        if (claimSectionRewards !== false) {
            this.tryClaimSectionRewards();
        } else {
            this.refreshView();
            this.notifyUpdated();
        }
    }

    private selectChapter(chapterIndex: number): void {
        let chapter = TaskService.getCampaignChapterViews().filter(item => item.index == chapterIndex).shift();
        if (!chapter || !chapter.isUnlocked) {
            return;
        }

        this.selectedTab = "campaign";
        this.selectedChapterIndex = chapterIndex;
        this.tryClaimSectionRewards();
    }

    private onClaimTask(taskId: string): void {
        let reward = this.selectedTab == "daily"
            ? TaskService.claimDailyTask(taskId)
            : TaskService.claimCampaignTask(taskId);

        if (!reward) {
            return;
        }

        this.showRewardGrants([reward]);
        this.tryClaimSectionRewards();
    }

    private tryClaimSectionRewards(): void {
        let rewards = this.selectedTab == "daily"
            ? TaskService.claimAvailableDailyRewards()
            : TaskService.claimAvailableCampaignRewards();

        this.selectedChapterIndex = TaskService.getCurrentCampaignChapterIndex();
        this.refreshView();
        this.notifyUpdated();

        if (rewards.length > 0) {
            this.showRewardGrants(rewards);
        }
    }

    private refreshView(): void {
        this.refreshTabButtons();
        this.refreshChapterButtons();
        this.updateHeaderLayout();
        this.refreshProgressBlock();
        this.refreshCards();
    }

    private updateHeaderLayout(): void {
        let showChapters = this.chapterButtons.some(button => button.visible);
        let subtitleY = showChapters ? 186 : 150;
        let progressTitleY = showChapters ? 224 : 192;
        let progressLineY = showChapters ? 280 : 248;
        let viewportY = showChapters ? 420 : 382;

        let headerPresets: any[] = [
            { "spriteId": "dailyTab", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetX": -208, "offsetY": 47 },
            { "spriteId": "campaignTab", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetX": 208, "offsetY": 47 },
            { "spriteId": "subtitle", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "86%", "offsetY": subtitleY, "fontSize": 24 },
            { "spriteId": "progressTitle", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "width": "84%", "offsetY": progressTitleY, "fontSize": 28 },
            { "spriteId": "progressLineBg", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": progressLineY },
            { "spriteId": "resetLabel", "parentId": "progressLineBg", "horizontalAlign": "center", "verticalAlign": "bottom", "offsetY": 38, "width": "86%", "fontSize": 20 },
            { "spriteId": "taskCardsBackground", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": viewportY },
            { "spriteId": "taskCardsViewport", "parentId": "panel", "horizontalAlign": "center", "verticalAlign": "top", "offsetY": viewportY },
            { "spriteId": "taskScrollTrack", "parentId": "taskCardsViewport", "horizontalAlign": "right", "verticalAlign": "top", "offsetX": 16 },
            { "spriteId": "taskScrollThumb", "parentId": "taskCardsViewport", "horizontalAlign": "right", "verticalAlign": "top", "offsetX": 16 }
        ];

        this.chapterButtons.forEach((_button, index) => {
            headerPresets.push({
                "spriteId": "chapterTab" + index,
                "parentId": "panel",
                "horizontalAlign": "center",
                "verticalAlign": "top",
                "offsetX": -150 + index * 150,
                "offsetY": 116
            });
        });

        this.applyHtmlPreset(headerPresets);
        this.configureTaskViewport();
    }

    private refreshTabButtons(): void {
        let isDaily = this.selectedTab == "daily";
        this.setTabState(this.dailyTabButton, this.dailyTabLabel, isDaily);
        this.setTabState(this.campaignTabButton, this.campaignTabLabel, !isDaily);
    }

    private refreshChapterButtons(): void {
        let chapters = TaskService.getCampaignChapterViews();
        let showChapters = false;//this.selectedTab == "campaign";

        this.chapterButtons.forEach((button, index) => {
            let chapter = chapters[index];
            let label = this.chapterLabels[index];
            button.visible = showChapters;
            label.visible = showChapters;
            button.inputEnabled = showChapters && chapter.isUnlocked;

            if (!showChapters) {
                return;
            }

            if (!chapter.isUnlocked) {
                button.tint = 0x7a7a7a;
                button.alpha = 0.75;
            } else if (index == this.selectedChapterIndex) {
                button.tint = 0x86dc28;
                button.alpha = 1;
            } else if (chapter.isCompleted) {
                button.tint = 0xd6a955;
                button.alpha = 1;
            } else {
                button.tint = 0xbf8540;
                button.alpha = 1;
            }
        });
    }

    private refreshProgressBlock(): void {
        if (this.selectedTab == "daily") {
            let dailyTasks = TaskService.getDailyTaskViews();
            let dailyRewards = TaskService.getDailyRewardViews();
            let claimedTasks = dailyTasks.filter(task => task.isClaimed).length;
            let totalTasks = dailyTasks.length || 1;

            this.subtitleLabel.text = LocalizationService.get("ui.tasks.dailyHint", "5 случайных заданий до конца дня");
            this.progressTitle.text = LocalizationService.get("ui.tasks.dailyProgress", "Прогресс дня");
            this.resetLabel.visible = true;
            this.resetLabel.text = LocalizationService.get("ui.tasks.refreshIn", "Обновление через {time}")
                .replace("{time}", this.formatDuration(EnergyUtils.getMillisToNextMoscowMidnight()));

            this.refreshProgressMetaLayout();
            this.updateProgressBar(claimedTasks / totalTasks, dailyRewards);
            return;
        }

        let campaignViews = TaskService.getCampaignChapterViews();
        let chapterView = campaignViews.filter(item => item.index == this.selectedChapterIndex).shift() || campaignViews[0];
        let rewardView = TaskService.getCampaignRewardView(this.selectedChapterIndex);

        this.subtitleLabel.text = LocalizationService.get("ui.tasks.chapterHint", "Все задания текущей главы доступны сразу");
        this.progressTitle.text = chapterView.chapter.title;
        this.resetLabel.visible = false;

        this.refreshProgressMetaLayout();
        this.updateProgressBar(chapterView.claimedTasks / Math.max(1, chapterView.totalTasks), [rewardView]);
    }

    private refreshProgressMetaLayout(): void {
        this.applyHtmlPreset([
            { "spriteId": "resetLabel", "parentId": "progressLineBg", "horizontalAlign": "center", "verticalAlign": "bottom", "offsetY": 38, "width": "86%", "fontSize": 20 }
        ]);
    }

    private refreshCards(): void {
        let tasks = this.selectedTab == "daily"
            ? TaskService.getDailyTaskViews()
            : TaskService.getCampaignTaskViews(this.selectedChapterIndex);

        this.taskCards.forEach((card, index) => {
            card.setData(tasks[index], LocalizationService.get("ui.tasks.claim", "Забрать"));
        });
        this.taskCardsStack.relayout();
        this.updateTaskScrollMetrics();
    }

    private configureTaskViewport(): void {
        (<any>this.taskCardsViewport).layoutBox = {
            x: 0,
            y: 0,
            width: this.tasksViewportWidth,
            height: this.tasksViewportHeight
        };

        this.taskCardsBackground.width = this.tasksViewportWidth - this.taskCardsBackgroundWidthInset;
        this.taskCardsBackground.height = this.tasksViewportHeight + this.taskCardsBackgroundHeightExtra;
        this.taskCardsDragArea.width = this.tasksViewportWidth;
        this.taskCardsDragArea.height = this.tasksViewportHeight;
        this.taskScrollTrack.height = this.tasksViewportHeight;

        this.redrawTaskViewportMask();
        this.updateTaskScrollMetrics();
    }

    private redrawTaskViewportMask(): void {
        this.taskCardsMask.clear();
        this.taskCardsMask.beginFill(0xffffff, 1);
        this.taskCardsMask.drawRect(this.taskCardsViewport.x, this.taskCardsViewport.y, this.tasksViewportWidth, this.tasksViewportHeight);
        this.taskCardsMask.endFill();
    }

    private updateTaskScrollMetrics(): void {
        let contentBox = (<any>this.taskCardsStack).layoutBox || { height: 0 };
        let contentHeight = contentBox.height || 0;
        this.taskMaxScrollOffset = Math.max(0, contentHeight - this.tasksViewportHeight);

        this.taskScrollTrack.visible = this.taskMaxScrollOffset > 0;
        this.taskScrollThumb.visible = this.taskMaxScrollOffset > 0;

        if (this.taskMaxScrollOffset <= 0) {
            this.setTaskScrollOffset(0);
            return;
        }

        let thumbHeight = Math.max(64, this.tasksViewportHeight * this.tasksViewportHeight / Math.max(this.tasksViewportHeight, contentHeight));
        this.taskScrollThumb.height = Math.min(this.tasksViewportHeight, thumbHeight);
        this.setTaskScrollOffset(this.taskScrollOffset);
    }

    private setTaskScrollOffset(value: number): void {
        let clamped = Math.max(0, Math.min(this.taskMaxScrollOffset, value || 0));
        this.taskScrollOffset = clamped;
        this.taskCardsStack.y = -clamped;

        if (!this.taskScrollThumb.visible) {
            return;
        }

        let travel = Math.max(0, this.taskScrollTrack.height - this.taskScrollThumb.height);
        let ratio = this.taskMaxScrollOffset > 0 ? clamped / this.taskMaxScrollOffset : 0;
        this.taskScrollThumb.y = this.taskScrollTrack.y + travel * ratio;
    }

    private onTaskListPointerDown(_sprite: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (this.taskMaxScrollOffset <= 0) {
            return;
        }

        this.draggingTaskList = true;
        this.dragStartPointerY = pointer.y;
        this.dragStartScrollOffset = this.taskScrollOffset;
    }

    private onTaskThumbPointerDown(_sprite: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (this.taskMaxScrollOffset <= 0) {
            return;
        }

        this.draggingTaskThumb = true;
        this.dragStartPointerY = pointer.y;
        this.dragStartScrollOffset = this.taskScrollOffset;
    }

    private onGlobalPointerMove(pointer: Phaser.Pointer, _x: number, y: number): void {
        if (!this.visible || !this.opened) {
            return;
        }

        if (this.draggingTaskList) {
            this.setTaskScrollOffset(this.dragStartScrollOffset - (y - this.dragStartPointerY));
            return;
        }

        if (this.draggingTaskThumb) {
            let travel = Math.max(1, this.taskScrollTrack.height - this.taskScrollThumb.height);
            let ratio = (y - this.dragStartPointerY) / travel;
            this.setTaskScrollOffset(this.dragStartScrollOffset + this.taskMaxScrollOffset * ratio);
        }
    }

    private onGlobalPointerUp(): void {
        this.draggingTaskList = false;
        this.draggingTaskThumb = false;
    }

    private onMouseWheel(e: WheelEvent): void {
        if (!this.opened || !this.visible || this.taskMaxScrollOffset <= 0) {
            return;
        }

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        this.setTaskScrollOffset(this.taskScrollOffset + (e.deltaY || 0) * 0.7);
    }

    private updateProgressBar(progressRatio: number, rewards: TaskRewardView[]): void {
        let clampedRatio = Math.max(0, Math.min(1, progressRatio || 0));
        let lineLeft = this.progressLineBg.x - this.progressLineBg.width / 2;
        let lineRight = lineLeft + this.progressLineBg.width;
        let fillStartX = lineLeft + 18;
        let endCircleX = lineRight - 34;
        let fillEndX = endCircleX - this.progressBarEndCircle.width / 2 + 8;
        let fillWidth = Math.max(0, fillEndX - fillStartX);
        let bodyWidth = clampedRatio <= 0 ? 0 : Math.max(16, fillWidth * clampedRatio);
        let finalReward = rewards && rewards.length > 0 ? rewards[rewards.length - 1] : null;
        let progressTarget = finalReward ? Math.max(1, finalReward.progressTarget) : 1;

        this.progressBarBody.visible = bodyWidth > 0;
        this.progressBarStart.visible = bodyWidth > 0;
        this.progressBarTail.visible = bodyWidth > 0;

        this.progressBarBody.x = fillStartX + 6;
        this.progressBarBody.y = this.progressLineBg.y;
        this.progressBarBody.width = bodyWidth;
        this.progressBarBody.height = this.progressBarTail.height;

        this.progressBarStart.x = fillStartX + 3;
        this.progressBarStart.y = this.progressLineBg.y;

        this.progressBarTail.x = fillStartX + bodyWidth +8;
        this.progressBarTail.y = this.progressLineBg.y;

        this.progressBarEndCircle.visible = !!finalReward;
        this.progressBarEndReward.visible = !!finalReward;
        this.progressBarEndCheck.visible = !!finalReward && finalReward.isClaimed;
        if (finalReward) {
            this.progressBarEndCircle.x = endCircleX;
            this.progressBarEndCircle.y = this.progressLineBg.y;

            SpriteUtils.loadTexture(this.progressBarEndReward, finalReward.icon);
            this.progressBarEndReward.scale.set(this.getProgressEndRewardScale(finalReward.icon));
            this.progressBarEndReward.x = this.progressBarEndCircle.x;
            this.progressBarEndReward.y = this.progressBarEndCircle.y;
            this.progressBarEndCheck.x = this.progressBarEndCircle.x + 24;
            this.progressBarEndCheck.y = this.progressBarEndCircle.y - 18;
        }

        this.rewardIcons.forEach((icon, index) => {
            let reward = index < rewards.length - 1 ? rewards[index] : null;
            icon.visible = !!reward;
            this.rewardChecks[index].visible = !!reward && reward.isClaimed;
            if (!reward) {
                return;
            }

            SpriteUtils.loadTexture(icon, reward.icon);
            icon.scale.set(this.getRewardScale(reward.icon));

            let rewardRatio = reward.progressTarget / progressTarget;
            icon.x = fillStartX + fillWidth * rewardRatio;
            icon.y = this.progressLineBg.y - 2;
            this.rewardChecks[index].x = icon.x + 16;
            this.rewardChecks[index].y = icon.y - 16;
        });

        this.bringChildToTop(this.progressBarStart);
        this.setChildIndex(this.progressBarBody, this.children.length - 1);
        this.bringChildToTop(this.progressBarTail);
        this.bringChildToTop(this.progressBarEndCircle);
        this.bringChildToTop(this.resetLabel);
        this.rewardIcons.forEach(icon => this.bringChildToTop(icon));
        this.rewardChecks.forEach(check => this.bringChildToTop(check));
        this.bringChildToTop(this.progressBarEndReward);
        this.bringChildToTop(this.progressBarEndCheck);
    }

    private setTabState(button: Phaser.Button, label: Label, selected: boolean): void {
        button.tint = selected ? 0xffffff : 0xbf8540;
        button.alpha = 1;
        label.fill = "#f0f1ec";
    }

    private showRewardGrants(grants: TaskRewardGrant[]): void {
        grants.forEach((grant, index) => {
            this.game.time.events.add(index * 220, () => {
                let info = new InfoPanel(this.game, -120, -430, grant.texts, grant.icons, false, true);
                this.addChild(info);
            }, this);
        });
    }

    private notifyUpdated(): void {
        if (this.hooks.onUpdated) {
            this.hooks.onUpdated();
        }
    }

    private getPreferredTab(): TasksTab {
        if (TaskService.getDailyTaskViews().some(task => task.isClaimable) || TaskService.getDailyRewardViews().some(reward => reward.isReached && !reward.isClaimed)) {
            return "daily";
        }

        let campaignRewardReady = TaskService.getCampaignChapterViews().some(chapter =>
            chapter.isUnlocked &&
            TaskService.getCampaignRewardView(chapter.index).isReached &&
            !TaskService.getCampaignRewardView(chapter.index).isClaimed
        );
        let campaignTaskReady = TaskService.getCampaignChapterViews().some(chapter =>
            chapter.isUnlocked &&
            TaskService.getCampaignTaskViews(chapter.index).some(task => task.isClaimable)
        );

        return campaignTaskReady || campaignRewardReady ? "campaign" : "daily";
    }

    private formatDuration(millis: number): string {
        let totalMinutes = Math.max(1, Math.floor(millis / 1000 / 60));
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
        let minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;

        if (hours > 0) {
            return hours + "ч " + minutesText + "м";
        }

        return minutes + "м";
    }

    private getRewardScale(icon: string): number {
        switch (icon) {
            case "gems":
                return 0.42;
            case "actionChest":
                return 0.52;
            default:
                return 0.62;
        }
    }

    private getProgressEndRewardScale(icon: string): number {
        switch (icon) {
            case "gems":
                return 0.5;
            case "actionChest":
                return 0.58;
            default:
                return 0.66;
        }
    }
}
