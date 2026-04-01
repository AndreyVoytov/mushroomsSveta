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
    TaskProgressView,
    TaskRewardGrant,
    TaskRewardView
} from "../../../core/model/task/TaskModels";

type TasksTab = "daily" | "campaign";

type TasksPanelHooks = {
    onUpdated?: () => void;
};

class TaskCardPanel extends BasePanel {
    public static WIDTH: number = 727;
    public static HEIGHT: number = 147;
    private static ITEM_LEFT: number = 24;
    private static ITEM_TOP: number = 23;
    private static ITEM_WIDTH: number = 117;
    private static ITEM_HEIGHT: number = 100;
    private static REWARD_LEFT: number = 522;
    private static REWARD_TOP: number = 11;
    private static REWARD_WIDTH: number = 194;
    private static REWARD_HEIGHT: number = 125;
    private static PROGRESS_LEFT: number = 154;
    private static PROGRESS_EMPTY_TOP: number = 80;
    private static PROGRESS_FULL_TOP: number = 79;
    private static TITLE_CENTER_X: number = 344;
    private static TITLE_TOP: number = 16;

    private background: Phaser.Sprite;
    private itemBackground: Phaser.Sprite;
    private rewardBackground: Phaser.Sprite;
    private progressEmpty: Phaser.Sprite;
    private progressFull: Phaser.Sprite;
    private icon: Phaser.Sprite;
    private titleLabel: Label;
    private progressLabel: Label;
    private rewardTitleLabel: Label;
    private claimTitleLabel: Label;
    private rewardIcon: Phaser.Sprite;
    private rewardLabel: Label;
    private claimedCheckIcon: Phaser.Sprite;
    private claimHitArea: Phaser.Sprite;
    private progressCropRect: Phaser.Rectangle;
    private currentTaskId: string;
    private onClaim: (taskId: string) => void;

    constructor(game: Phaser.Game, name: string, onClaim: (taskId: string) => void) {
        super(game, 0, 0, name, "blank");
        this.onClaim = onClaim;

        this.background = this.attachSprite("tasksPanelTaskBg", "background");
        this.background.anchor.set(0);

        this.itemBackground = this.attachSprite("tasksPanelTaskItemBg", "itemBackground");
        this.itemBackground.anchor.set(0);
        this.itemBackground.x = TaskCardPanel.ITEM_LEFT;
        this.itemBackground.y = TaskCardPanel.ITEM_TOP;

        this.rewardBackground = this.attachSprite("tasksPanelTaskRewardBg", "rewardBackground");
        this.rewardBackground.anchor.set(0);
        this.rewardBackground.x = TaskCardPanel.REWARD_LEFT;
        this.rewardBackground.y = TaskCardPanel.REWARD_TOP;

        this.progressEmpty = this.attachSprite("tasksPanelTaskProgressEmpty", "progressEmpty");
        this.progressEmpty.anchor.set(0);
        this.progressEmpty.x = TaskCardPanel.PROGRESS_LEFT;
        this.progressEmpty.y = TaskCardPanel.PROGRESS_EMPTY_TOP;

        this.progressFull = this.attachSprite("tasksPanelTaskProgressFull", "progressFull");
        this.progressFull.anchor.set(0);
        this.progressFull.x = TaskCardPanel.PROGRESS_LEFT;
        this.progressFull.y = TaskCardPanel.PROGRESS_FULL_TOP;
        this.progressCropRect = new Phaser.Rectangle(0, 0, this.progressFull.width, this.progressFull.height);

        this.icon = this.attachSprite("mushroom", "taskIcon");
        this.icon.anchor.set(0.5);
        this.icon.x = TaskCardPanel.ITEM_LEFT + TaskCardPanel.ITEM_WIDTH / 2;
        this.icon.y = TaskCardPanel.ITEM_TOP + TaskCardPanel.ITEM_HEIGHT / 2;

        this.titleLabel = this.attachText("taskTitle", "", {
            font: "bold 20px Arial",
            fill: "#855539",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 370
        });
        this.titleLabel.anchor.set(0.5, 0);
        this.titleLabel.x = TaskCardPanel.TITLE_CENTER_X;
        this.titleLabel.y = TaskCardPanel.TITLE_TOP;

        this.progressLabel = this.attachText("taskProgress", "", {
            font: "bold 22px Gilroy",
            fill: "#f7f1d8",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 280
        });
        this.progressLabel.anchor.set(0.5);
        this.progressLabel.x = TaskCardPanel.PROGRESS_LEFT + this.progressEmpty.width / 2;
        this.progressLabel.y = TaskCardPanel.PROGRESS_FULL_TOP + this.progressFull.height / 2 + 1;

        this.rewardTitleLabel = this.attachText("rewardTitle", LocalizationService.get("ui.tasks.reward", "РќР°РіСЂР°РґР°"), {
            font: "bold 20px Arial",
            fill: "#9a6842",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 160
        });
        this.rewardTitleLabel.anchor.set(0.5, 0);
        this.rewardTitleLabel.x = TaskCardPanel.REWARD_LEFT + TaskCardPanel.REWARD_WIDTH / 2;
        this.rewardTitleLabel.y = TaskCardPanel.REWARD_TOP + 16;

        this.claimTitleLabel = this.attachText("claimTitle", LocalizationService.get("ui.tasks.claim", "Р—Р°Р±СЂР°С‚СЊ"), {
            font: "bold 22px Gilroy",
            fill: "#6d9a1f",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 160
        });
        this.claimTitleLabel.anchor.set(0.5, 0);
        this.claimTitleLabel.x = TaskCardPanel.REWARD_LEFT + TaskCardPanel.REWARD_WIDTH / 2;
        this.claimTitleLabel.y = TaskCardPanel.REWARD_TOP + 14;

        this.rewardIcon = this.attachSprite("gems", "rewardIcon");
        this.rewardIcon.anchor.set(0.5);
        this.rewardIcon.x = TaskCardPanel.REWARD_LEFT + 62;
        this.rewardIcon.y = TaskCardPanel.REWARD_TOP + 77;

        this.rewardLabel = this.attachText("rewardLabel", "2", {
            font: "bold 28px Gilroy",
            fill: "#855539",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 90
        });
        this.rewardLabel.anchor.set(0.5);
        this.rewardLabel.x = TaskCardPanel.REWARD_LEFT + 120;
        this.rewardLabel.y = TaskCardPanel.REWARD_TOP + 75;

        this.claimedCheckIcon = this.attachSprite("check", "claimedCheckIcon");
        this.claimedCheckIcon.anchor.set(0.5);
        this.claimedCheckIcon.scale.set(0.28);
        this.claimedCheckIcon.x = TaskCardPanel.REWARD_LEFT + TaskCardPanel.REWARD_WIDTH / 2;
        this.claimedCheckIcon.y = TaskCardPanel.REWARD_TOP + TaskCardPanel.REWARD_HEIGHT / 2 + 2;

        this.claimHitArea = this.attachSprite("blank", "claimHitArea");
        this.claimHitArea.anchor.set(0);
        this.claimHitArea.x = TaskCardPanel.REWARD_LEFT;
        this.claimHitArea.y = TaskCardPanel.REWARD_TOP;
        this.claimHitArea.width = TaskCardPanel.REWARD_WIDTH;
        this.claimHitArea.height = TaskCardPanel.REWARD_HEIGHT;
        this.claimHitArea.alpha = 0.001;
        this.claimHitArea.inputEnabled = true;
        this.claimHitArea.input.useHandCursor = true;
        this.claimHitArea.events.onInputDown.add(() => this.tryClaim(), this);

        (<any>this).layoutBox = { x: 0, y: 0, width: TaskCardPanel.WIDTH, height: TaskCardPanel.HEIGHT };
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

        const rewardIcon = taskView.task.reward && taskView.task.reward.boosters && taskView.task.reward.boosters.length > 0
            ? taskView.task.reward.boosters[0].type
            : "gems";
        const rewardCount = taskView.task.reward && taskView.task.reward.boosters && taskView.task.reward.boosters.length > 0
            ? taskView.task.reward.boosters[0].count
            : ((taskView.task.reward && taskView.task.reward.gems) || 2);

        SpriteUtils.loadTexture(this.rewardIcon, rewardIcon);
        this.rewardIcon.scale.set(this.getRewardScale(rewardIcon));
        this.rewardLabel.text = "" + rewardCount;
        this.titleLabel.text = taskView.task.title;
        this.progressLabel.text = taskView.progress + "/" + taskView.task.target;
        this.claimTitleLabel.text = claimLabel;

        const isClaimable = taskView.isClaimable && !taskView.isClaimed;
        const isClaimed = taskView.isClaimed;
        const progressRatio = isClaimed ? 1 : (taskView.task.target > 0 ? taskView.progress / taskView.task.target : 0);
        this.updateProgressBar(progressRatio);

        this.rewardTitleLabel.text = isClaimed
            ? LocalizationService.get("ui.tasks.rewardReceived", "РќР°РіСЂР°РґР° РїРѕР»СѓС‡РµРЅР°")
            : LocalizationService.get("ui.tasks.reward", "РќР°РіСЂР°РґР°");
        this.rewardTitleLabel.visible = !isClaimable;
        this.claimTitleLabel.visible = isClaimable;
        this.rewardIcon.visible = !isClaimed;
        this.rewardLabel.visible = !isClaimed;
        this.claimedCheckIcon.visible = isClaimed;
        this.claimHitArea.inputEnabled = isClaimable;
        this.claimHitArea.visible = isClaimable;
        this.rewardBackground.tint = isClaimable ? 0xf0ffd7 : 0xffffff;
        this.progressLabel.fill = isClaimable ? "#6c9518" : (isClaimed ? "#8d816c" : "#fff6db");
        this.rewardLabel.fill = isClaimable ? "#6c9518" : "#855539";
        this.rewardTitleLabel.fill = isClaimed ? "#8d816c" : "#9a6842";
        this.claimTitleLabel.fill = "#6c9518";
        this.titleLabel.fill = isClaimed ? "#9e927e" : "#855539";
        this.alpha = isClaimed ? 0.72 : 1;
    }

    private updateProgressBar(progressRatio: number): void {
        const clampedRatio = Math.max(0, Math.min(1, progressRatio || 0));
        const cropWidth = Math.round(this.progressFull.width * clampedRatio);
        this.progressFull.visible = cropWidth > 0;
        if (!this.progressFull.visible) {
            return;
        }
        this.progressCropRect.x = 0;
        this.progressCropRect.y = 0;
        this.progressCropRect.width = Math.max(1, cropWidth);
        this.progressCropRect.height = this.progressFull.height;
        (<any>this.progressFull).crop(this.progressCropRect, false);
    }

    private tryClaim(): void {
        if (!this.currentTaskId || !this.claimHitArea.inputEnabled) {
            return;
        }
        this.onClaim(this.currentTaskId);
    }

    private getScaleForIcon(icon: string): number {
        switch (icon) {
            case "lightning": return 0.42;
            case "playButton": return 0.32;
            case "acorn": return 0.56;
            default: return 0.64;
        }
    }

    private getRewardScale(icon: string): number {
        switch (icon) {
            case "gems": return 0.3;
            case "actionChest": return 0.38;
            default: return 0.44;
        }
    }
}

export default class TasksPanel extends ClosablePanel {
    private static PSD_WIDTH: number = 1024;
    private static PSD_HEIGHT: number = 1536;
    private static PANEL_LEFT: number = 64;
    private static PANEL_TOP: number = 176;
    private static PANEL_WIDTH: number = 897;
    private static PANEL_HEIGHT: number = 1203;
    private static PANEL_CENTER_HEIGHT: number = 984;
    private static LIST_CENTER_HEIGHT: number = 860;
    private static VIEWPORT_LEFT: number = 151;
    private static VIEWPORT_TOP: number = 545;
    private static VIEWPORT_WIDTH: number = 727;
    private static VIEWPORT_HEIGHT: number = 786;
    private static MAIN_PROGRESS_LEFT: number = 133;
    private static MAIN_PROGRESS_WIDTH: number = 766;
    private static MAIN_PROGRESS_TRACK_LEFT: number = 182;
    private static MAIN_PROGRESS_TRACK_RIGHT: number = 720;

    private screen: HouseScreen;
    private hooks: TasksPanelHooks;
    private panel: Phaser.Sprite;
    private titleLabel: Label;
    private closeButton: Phaser.Button;
    private dailyTabButton: Phaser.Button;
    private campaignTabButton: Phaser.Button;
    private dailyTabLabel: Label;
    private campaignTabLabel: Label;
    private progressTitle: Label;
    private resetLabel: Label;
    private progressBarFull: Phaser.Sprite;
    private progressBarChest: Phaser.Sprite;
    private progressBarEndReward: Phaser.Sprite;
    private progressBarEndCheck: Phaser.Sprite;
    private progressBarCropRect: Phaser.Rectangle;
    private rewardIcons: Phaser.Sprite[] = [];
    private rewardChecks: Phaser.Sprite[] = [];
    private taskCards: TaskCardPanel[] = [];
    private taskCardsViewport: Phaser.Group;
    private taskCardsStack: StackContainer;
    private taskCardsMask: Phaser.Graphics;
    private taskCardsDragArea: Phaser.Sprite;
    private taskScrollOffset: number = 0;
    private taskMaxScrollOffset: number = 0;
    private dragStartPointerY: number = 0;
    private dragStartScrollOffset: number = 0;
    private draggingTaskList: boolean = false;
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

        this.panel = this.attachSprite("blank", "panel");
        this.panel.anchor.set(0);
        this.panel.x = this.psdX(TasksPanel.PANEL_LEFT);
        this.panel.y = this.psdY(TasksPanel.PANEL_TOP);
        this.panel.width = TasksPanel.PANEL_WIDTH;
        this.panel.height = TasksPanel.PANEL_HEIGHT;
        this.panel.alpha = 0.001;
        this.panel.inputEnabled = true;

        this.createFixedSprite("tasksPanelBgTop", "backgroundTop", 64, 176);
        this.createFixedStretchYSprite("tasksPanelBgCenter", "backgroundCenter", 94, 263, TasksPanel.PANEL_CENTER_HEIGHT);
        this.createFixedSprite("tasksPanelBgBottom", "backgroundBottom", 95, 1241);
        this.createFixedSprite("tasksPanelHeaderRibbon", "headerRibbon", 84, 91);
        this.createFixedSprite("tasksPanelListTop", "listTop", 109, 309);
        this.createFixedStretchYSprite("tasksPanelListCenter", "listCenter", 109, 385, TasksPanel.LIST_CENTER_HEIGHT);
        this.createFixedSprite("tasksPanelListBottom", "listBottom", 109, 1238);
        this.createFixedSprite("tasksPanelProgressEmpty", "progressBarEmpty", 133, 354);
        this.progressBarFull = this.createFixedSprite("tasksPanelProgressFull", "progressBarFull", 133, 354);
        this.progressBarChest = this.createFixedSprite("tasksPanelChest", "progressBarChest", 716, 365);
        this.progressBarCropRect = new Phaser.Rectangle(0, 0, this.progressBarFull.width, this.progressBarFull.height);

        this.closeButton = this.attachButton("closeButtonViolet", () => this.close(), "closeButton");
        this.closeButton.anchor.set(0);
        this.closeButton.x = this.psdX(874);
        this.closeButton.y = this.psdY(194);
        this.closeButton.scale.set(0.95);

        this.titleLabel = this.attachText("title", LocalizationService.get("ui.tasks.title", "Р—Р°РґР°РЅРёСЏ"), {
            font: "46px Bookman Old Style",
            fill: "#fdf6ff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 500
        });
        this.titleLabel.anchor.set(0.5);
        this.titleLabel.x = 0;
        this.titleLabel.y = this.psdY(182);

        this.dailyTabButton = this.attachButton("tasksPanelTabActive", () => this.selectTab("daily"), "dailyTab");
        this.dailyTabButton.anchor.set(0);
        this.dailyTabLabel = this.attachText("dailyTabLabel", LocalizationService.get("ui.tasks.daily", "Р•Р¶РµРґРЅРµРІРЅС‹Рµ"), {
            font: "bold 24px Gilroy",
            fill: "#82533a",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 300
        });
        this.dailyTabLabel.anchor.set(0.5);

        this.campaignTabButton = this.attachButton("tasksPanelTabInactive", () => this.selectTab("campaign"), "campaignTab");
        this.campaignTabButton.anchor.set(0);
        this.campaignTabLabel = this.attachText("campaignTabLabel", LocalizationService.get("ui.tasks.campaign", "РљР°РјРїР°РЅРёСЏ"), {
            font: "bold 24px Gilroy",
            fill: "#f5ebdb",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 300
        });
        this.campaignTabLabel.anchor.set(0.5);

        this.progressTitle = this.attachText("progressTitle", "", {
            font: "bold 26px Arial",
            fill: "#895d3f",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 620
        });
        this.progressTitle.anchor.set(0.5);
        this.progressTitle.x = this.psdCenterX(TasksPanel.MAIN_PROGRESS_LEFT, TasksPanel.MAIN_PROGRESS_WIDTH);
        this.progressTitle.y = this.psdY(334);

        this.resetLabel = this.attachText("resetLabel", "", {
            font: "bold 18px Arial",
            fill: "#a27148",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 620
        });
        this.resetLabel.anchor.set(0.5);
        this.resetLabel.x = this.psdCenterX(TasksPanel.MAIN_PROGRESS_LEFT, TasksPanel.MAIN_PROGRESS_WIDTH);
        this.resetLabel.y = this.psdY(507);

        this.progressBarEndReward = this.attachSprite("gems", "progressBarEndReward");
        this.progressBarEndReward.anchor.set(0.5);
        this.progressBarEndReward.x = this.psdCenterX(716, 169);
        this.progressBarEndReward.y = this.psdCenterY(365, 143);

        this.progressBarEndCheck = this.attachSprite("check", "progressBarEndCheck");
        this.progressBarEndCheck.anchor.set(0.5);
        this.progressBarEndCheck.scale.set(0.34);
        this.progressBarEndCheck.x = this.psdCenterX(716, 169) + 42;
        this.progressBarEndCheck.y = this.psdCenterY(365, 143) - 28;

        for (let i = 0; i < 2; i++) {
            const rewardIcon = this.attachSprite(i == 0 ? "gems" : "actionChest", "rewardIcon" + i);
            rewardIcon.anchor.set(0.5);
            this.rewardIcons.push(rewardIcon);

            const rewardCheck = this.attachSprite("check", "rewardCheck" + i);
            rewardCheck.anchor.set(0.5);
            rewardCheck.scale.set(0.32);
            this.rewardChecks.push(rewardCheck);
        }

        this.taskCardsViewport = new Phaser.Group(this.game, null, "taskCardsViewport");
        this.taskCardsViewport.x = this.psdX(TasksPanel.VIEWPORT_LEFT);
        this.taskCardsViewport.y = this.psdY(TasksPanel.VIEWPORT_TOP);
        this.addChild(this.taskCardsViewport);

        this.taskCardsDragArea = SpriteUtils.createSprite(this.game, 0, 0, "blank");
        this.taskCardsDragArea.name = "taskCardsDragArea";
        this.taskCardsDragArea.anchor.set(0);
        this.taskCardsDragArea.width = TasksPanel.VIEWPORT_WIDTH;
        this.taskCardsDragArea.height = TasksPanel.VIEWPORT_HEIGHT;
        this.taskCardsDragArea.alpha = 0.001;
        this.taskCardsDragArea.inputEnabled = true;
        this.taskCardsDragArea.events.onInputDown.add(this.onTaskListPointerDown, this);
        this.taskCardsViewport.add(this.taskCardsDragArea);

        this.taskCardsStack = new StackContainer(this.game, 0, 0, "taskCardsStack", {
            gap: 12,
            align: "center",
            layoutWidth: TasksPanel.VIEWPORT_WIDTH
        });
        this.taskCardsViewport.add(this.taskCardsStack);

        this.taskCardsMask = new Phaser.Graphics(this.game, 0, 0);
        this.taskCardsMask.alpha = 0;
        this.addChild(this.taskCardsMask);
        (<any>this.taskCardsViewport).mask = this.taskCardsMask;
        this.redrawTaskViewportMask();

        for (let i = 0; i < 5; i++) {
            const card = new TaskCardPanel(this.game, "taskCard" + i, taskId => this.onClaimTask(taskId));
            this.taskCardsStack.addStackChild(card);
            this.taskCards.push(card);
        }

        this.game.input.addMoveCallback(this.onGlobalPointerMove, this);
        this.game.input.onUp.add(this.onGlobalPointerUp, this);

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
        this.screen.showUI(true);
    }

    private createFixedSprite(key: string, name: string, left: number, top: number): Phaser.Sprite {
        const sprite = this.attachSprite(key, name);
        sprite.anchor.set(0);
        sprite.x = this.psdX(left);
        sprite.y = this.psdY(top);
        return sprite;
    }

    private createFixedStretchYSprite(key: string, name: string, left: number, top: number, height: number): Phaser.Sprite {
        const sprite = this.createFixedSprite(key, name, left, top);
        sprite.height = height;
        return sprite;
    }

    private selectTab(tab: TasksTab, skipSectionRewards?: boolean): void {
        this.selectedTab = tab;
        if (tab == "campaign") {
            this.selectedChapterIndex = Math.min(this.selectedChapterIndex, TaskService.getCurrentCampaignChapterIndex());
        }

        if (skipSectionRewards) {
            this.refreshView();
            this.notifyUpdated();
            return;
        }

        this.tryClaimSectionRewards();
    }

    private onClaimTask(taskId: string): void {
        const reward = this.selectedTab == "daily"
            ? TaskService.claimDailyTask(taskId)
            : TaskService.claimCampaignTask(taskId);

        if (!reward) {
            return;
        }

        this.showRewardGrants([reward]);
        this.tryClaimSectionRewards();
    }

    private tryClaimSectionRewards(): void {
        const rewards = this.selectedTab == "daily"
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
        this.refreshProgressBlock();
        this.refreshCards();
    }

    private refreshTabButtons(): void {
        this.layoutTab(this.dailyTabButton, this.dailyTabLabel, "left", this.selectedTab == "daily");
        this.layoutTab(this.campaignTabButton, this.campaignTabLabel, "right", this.selectedTab == "campaign");
    }

    private layoutTab(button: Phaser.Button, label: Label, side: "left" | "right", selected: boolean): void {
        const key = selected ? "tasksPanelTabActive" : "tasksPanelTabInactive";
        const left = side == "left" ? (selected ? 149 : 131) : (selected ? 511 : 510);
        SpriteUtils.loadTextureForButton(button, key);
        button.anchor.set(0);
        button.x = this.psdX(left);
        button.y = this.psdY(237);

        label.setStyle({
            font: "bold 24px Gilroy",
            fill: selected ? "#81543a" : "#f7ead5",
            align: "center",
            wordWrap: true,
            wordWrapWidth: button.width - 42
        });
        label.anchor.set(0.5);
        label.x = button.x + button.width / 2;
        label.y = button.y + button.height / 2 + (selected ? 4 : 0);
    }

    private refreshProgressBlock(): void {
        if (this.selectedTab == "daily") {
            const dailyTasks = TaskService.getDailyTaskViews();
            const dailyRewards = TaskService.getDailyRewardViews();
            const claimedTasks = dailyTasks.filter(task => task.isClaimed).length;
            const totalTasks = dailyTasks.length || 1;

            this.progressTitle.text = LocalizationService.get("ui.tasks.dailyProgress", "РџСЂРѕРіСЂРµСЃСЃ РґРЅСЏ");
            this.resetLabel.visible = true;
            this.resetLabel.text = LocalizationService.get("ui.tasks.refreshIn", "РћР±РЅРѕРІР»РµРЅРёРµ С‡РµСЂРµР· {time}")
                .replace("{time}", this.formatDuration(EnergyUtils.getMillisToNextMoscowMidnight()));
            this.updateProgressBar(claimedTasks / totalTasks, dailyRewards);
            return;
        }

        const campaignViews = TaskService.getCampaignChapterViews();
        const chapterView = campaignViews.filter(item => item.index == this.selectedChapterIndex).shift() || campaignViews[0];
        const rewardView = TaskService.getCampaignRewardView(this.selectedChapterIndex);

        this.progressTitle.text = chapterView.chapter.title;
        this.resetLabel.visible = false;
        this.updateProgressBar(chapterView.claimedTasks / Math.max(1, chapterView.totalTasks), [rewardView]);
    }

    private refreshCards(): void {
        const tasks = this.selectedTab == "daily"
            ? TaskService.getDailyTaskViews()
            : TaskService.getCampaignTaskViews(this.selectedChapterIndex);
        const sortedTasks = this.sortTasksForDisplay(tasks);

        this.taskCards.forEach((card, index) => {
            card.setData(sortedTasks[index], LocalizationService.get("ui.tasks.claim", "Р—Р°Р±СЂР°С‚СЊ"));
        });

        this.taskCardsStack.relayout();
        this.updateTaskScrollMetrics();
    }

    private sortTasksForDisplay(tasks: TaskProgressView[]): TaskProgressView[] {
        return (tasks || [])
            .map((task, index) => ({ task: task, index: index }))
            .sort((left, right) => {
                const leftDone = left.task && left.task.isClaimed ? 1 : 0;
                const rightDone = right.task && right.task.isClaimed ? 1 : 0;
                if (leftDone != rightDone) {
                    return leftDone - rightDone;
                }
                return left.index - right.index;
            })
            .map(item => item.task);
    }

    private redrawTaskViewportMask(): void {
        this.taskCardsMask.clear();
        this.taskCardsMask.beginFill(0xffffff, 1);
        this.taskCardsMask.drawRect(this.taskCardsViewport.x, this.taskCardsViewport.y, TasksPanel.VIEWPORT_WIDTH, TasksPanel.VIEWPORT_HEIGHT);
        this.taskCardsMask.endFill();
    }

    private updateTaskScrollMetrics(): void {
        const contentBox = (<any>this.taskCardsStack).layoutBox || { height: 0 };
        this.taskMaxScrollOffset = Math.max(0, (contentBox.height || 0) - TasksPanel.VIEWPORT_HEIGHT);
        this.setTaskScrollOffset(this.taskScrollOffset);
    }

    private setTaskScrollOffset(value: number): void {
        const clamped = Math.max(0, Math.min(this.taskMaxScrollOffset, value || 0));
        this.taskScrollOffset = clamped;
        this.taskCardsStack.y = -clamped;
    }

    private onTaskListPointerDown(_sprite: Phaser.Sprite, pointer: Phaser.Pointer): void {
        if (this.taskMaxScrollOffset <= 0) {
            return;
        }

        this.draggingTaskList = true;
        this.dragStartPointerY = pointer.y;
        this.dragStartScrollOffset = this.taskScrollOffset;
    }

    private onGlobalPointerMove(_pointer: Phaser.Pointer, _x: number, y: number): void {
        if (!this.visible || !this.opened || !this.draggingTaskList) {
            return;
        }

        this.setTaskScrollOffset(this.dragStartScrollOffset - (y - this.dragStartPointerY));
    }

    private onGlobalPointerUp(): void {
        this.draggingTaskList = false;
    }

    private onMouseWheel(e: WheelEvent): void {
        if (!this.opened || !this.visible || this.taskMaxScrollOffset <= 0) {
            return;
        }

        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        this.setTaskScrollOffset(this.taskScrollOffset + (e.deltaY || 0) * 0.7);
    }

    private updateProgressBar(progressRatio: number, rewards: TaskRewardView[]): void {
        const clampedRatio = Math.max(0, Math.min(1, progressRatio || 0));
        const cropWidth = Math.round(this.progressBarFull.width * clampedRatio);
        const finalReward = rewards && rewards.length > 0 ? rewards[rewards.length - 1] : null;
        const progressTarget = finalReward ? Math.max(1, finalReward.progressTarget) : 1;

        this.progressBarFull.visible = cropWidth > 0;
        if (this.progressBarFull.visible) {
            this.progressBarCropRect.x = 0;
            this.progressBarCropRect.y = 0;
            this.progressBarCropRect.width = Math.max(1, cropWidth);
            this.progressBarCropRect.height = this.progressBarFull.height;
            (<any>this.progressBarFull).crop(this.progressBarCropRect, false);
        }

        this.progressBarChest.visible = !!finalReward;
        this.progressBarEndReward.visible = !!finalReward && finalReward.icon != "actionChest";
        this.progressBarEndCheck.visible = !!finalReward && finalReward.isClaimed;

        if (finalReward && this.progressBarEndReward.visible) {
            SpriteUtils.loadTexture(this.progressBarEndReward, finalReward.icon);
            this.progressBarEndReward.scale.set(this.getProgressEndRewardScale(finalReward.icon));
        }

        this.rewardIcons.forEach((icon, index) => {
            const reward = index < rewards.length - 1 ? rewards[index] : null;
            const check = this.rewardChecks[index];
            icon.visible = !!reward;
            check.visible = !!reward && reward.isClaimed;

            if (!reward) {
                return;
            }

            SpriteUtils.loadTexture(icon, reward.icon);
            icon.scale.set(this.getRewardScale(reward.icon));
            const rewardRatio = reward.progressTarget / progressTarget;
            icon.x = this.psdX(TasksPanel.MAIN_PROGRESS_TRACK_LEFT) +
                (TasksPanel.MAIN_PROGRESS_TRACK_RIGHT - TasksPanel.MAIN_PROGRESS_TRACK_LEFT) * rewardRatio;
            icon.y = this.psdY(441);
            check.x = icon.x + 16;
            check.y = icon.y - 18;
        });
    }

    private showRewardGrants(grants: TaskRewardGrant[]): void {
        grants.forEach((grant, index) => {
            this.game.time.events.add(index * 220, () => {
                const info = new InfoPanel(this.game, -120, -430, grant.texts, grant.icons, false, true);
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

        const campaignRewardReady = TaskService.getCampaignChapterViews().some(chapter =>
            chapter.isUnlocked &&
            TaskService.getCampaignRewardView(chapter.index).isReached &&
            !TaskService.getCampaignRewardView(chapter.index).isClaimed
        );
        const campaignTaskReady = TaskService.getCampaignChapterViews().some(chapter =>
            chapter.isUnlocked &&
            TaskService.getCampaignTaskViews(chapter.index).some(task => task.isClaimable)
        );

        return campaignTaskReady || campaignRewardReady ? "campaign" : "daily";
    }

    private formatDuration(millis: number): string {
        const totalMinutes = Math.max(1, Math.floor(millis / 1000 / 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const minutesText = minutes >= 10 ? "" + minutes : "0" + minutes;

        if (hours > 0) {
            return hours + "С‡ " + minutesText + "Рј";
        }

        return minutes + "Рј";
    }

    private getRewardScale(icon: string): number {
        switch (icon) {
            case "gems": return 0.38;
            case "actionChest": return 0.44;
            default: return 0.52;
        }
    }

    private getProgressEndRewardScale(icon: string): number {
        switch (icon) {
            case "gems": return 0.42;
            case "actionChest": return 0.52;
            default: return 0.56;
        }
    }

    private psdX(left: number): number {
        return left - TasksPanel.PSD_WIDTH / 2;
    }

    private psdY(top: number): number {
        return top - TasksPanel.PSD_HEIGHT / 2;
    }

    private psdCenterX(left: number, width: number): number {
        return this.psdX(left + width / 2);
    }

    private psdCenterY(top: number, height: number): number {
        return this.psdY(top + height / 2);
    }
}
