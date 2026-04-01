import TasksConfiguration from "../configuration/TasksConfiguration";
import BoosterType from "../model/enum/BoosterType";
import {
    CampaignChapterView,
    TaskChapterDefinition,
    TaskDefinition,
    TaskProgressView,
    TaskRewardConfig,
    TaskRewardGrant,
    TaskRewardView,
    UserTasksState
} from "../model/task/TaskModels";
import User from "../model/user/User";
import EnergyUtils from "../utils/EnergyUtils";
import UserService from "./UserService";

export default class TaskService {

    // Collection-based task progress is buffered for the current forest run
    // and committed only after a successful level completion.
    private static pendingLevelCollections: { [targetId: string]: number } = {};

    public static getDailyTasks(user?: User): TaskDefinition[] {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);

        let dayId = this.getState(safeUser).dailyDayId || EnergyUtils.getMoscowDayId();
        return TasksConfiguration.dailyPool
            .slice()
            .sort((left, right) => {
                let delta = this.hashString(dayId + "|" + left.id) - this.hashString(dayId + "|" + right.id);
                if (delta != 0) {
                    return delta;
                }
                return left.id.localeCompare(right.id);
            })
            .slice(0, Math.min(TasksConfiguration.dailySelectionCount, TasksConfiguration.dailyPool.length));
    }

    public static getDailyTaskViews(user?: User): TaskProgressView[] {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);

        let state = this.getState(safeUser);
        return this.getDailyTasks(safeUser).map(task => this.toTaskView(task, state.dailyProgress, state.claimedDailyTaskIds));
    }

    public static getDailyRewardViews(user?: User): TaskRewardView[] {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);

        let state = this.getState(safeUser);
        let claimedTasks = this.getClaimedDailyTaskCount(safeUser);
        return TasksConfiguration.dailyMilestoneRewards.map(reward => ({
            id: reward.id,
            title: reward.title,
            icon: reward.icon,
            reward: reward.reward,
            progressTarget: reward.claimedAt,
            isReached: claimedTasks >= reward.claimedAt,
            isClaimed: state.claimedDailyRewardIds.indexOf(reward.id) >= 0
        }));
    }

    public static getCampaignChapterViews(user?: User): CampaignChapterView[] {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let currentChapterIndex = this.getCurrentCampaignChapterIndex(safeUser);

        return TasksConfiguration.campaignChapters.map((chapter, index) => {
            let claimedTasks = chapter.tasks.filter(task => state.claimedCampaignTaskIds.indexOf(task.id) >= 0).length;
            let isRewardClaimed = state.claimedCampaignRewardIds.indexOf(chapter.id) >= 0;
            return {
                chapter: chapter,
                index: index,
                isUnlocked: index <= currentChapterIndex,
                isCurrent: index == currentChapterIndex,
                isCompleted: claimedTasks >= chapter.tasks.length,
                isRewardClaimed: isRewardClaimed,
                claimedTasks: claimedTasks,
                totalTasks: chapter.tasks.length
            };
        });
    }

    public static getCampaignTaskViews(chapterIndex?: number, user?: User): TaskProgressView[] {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let targetChapterIndex = chapterIndex == null ? this.getCurrentCampaignChapterIndex(safeUser) : chapterIndex;

        if (targetChapterIndex < 0 || targetChapterIndex >= TasksConfiguration.campaignChapters.length) {
            return [];
        }

        if (targetChapterIndex > this.getCurrentCampaignChapterIndex(safeUser)) {
            return [];
        }

        return TasksConfiguration.campaignChapters[targetChapterIndex].tasks
            .map(task => this.toTaskView(task, state.campaignProgress, state.claimedCampaignTaskIds));
    }

    public static getCampaignRewardView(chapterIndex?: number, user?: User): TaskRewardView {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let targetChapterIndex = chapterIndex == null ? this.getCurrentCampaignChapterIndex(safeUser) : chapterIndex;
        let chapter = TasksConfiguration.campaignChapters[targetChapterIndex];
        let claimedTasks = chapter.tasks.filter(task => state.claimedCampaignTaskIds.indexOf(task.id) >= 0).length;

        return {
            id: chapter.id,
            title: chapter.rewardTitle,
            icon: chapter.rewardIcon,
            reward: chapter.reward,
            progressTarget: chapter.tasks.length,
            isReached: claimedTasks >= chapter.tasks.length,
            isClaimed: state.claimedCampaignRewardIds.indexOf(chapter.id) >= 0
        };
    }

    public static getCurrentCampaignChapterIndex(user?: User): number {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let currentIndex = 0;

        while (
            currentIndex < TasksConfiguration.campaignChapters.length - 1 &&
            state.claimedCampaignRewardIds.indexOf(TasksConfiguration.campaignChapters[currentIndex].id) >= 0
        ) {
            currentIndex++;
        }

        return currentIndex;
    }

    public static recordSpentEnergy(amount: number): void {
        if (!amount || amount <= 0) {
            return;
        }

        let user = UserService.getUser();
        this.ensureDailyState(user);
        let state = this.getState(user);
        let changed = false;

        changed = this.recordTaskDelta(this.getDailyTasks(user), state.dailyProgress, state.claimedDailyTaskIds, "spend_energy", null, amount) || changed;
        changed = this.recordTaskDelta(this.getCurrentCampaignChapter(user).tasks, state.campaignProgress, state.claimedCampaignTaskIds, "spend_energy", null, amount) || changed;

        if (changed) {
            user.saveTasksState();
        }
    }

    public static recordCollection(targetId: string, amount?: number): void {
        if (!targetId) {
            return;
        }

        let delta = amount == null ? 1 : amount;
        if (delta <= 0) {
            return;
        }

        this.pendingLevelCollections[targetId] = (this.pendingLevelCollections[targetId] || 0) + delta;
    }

    public static recordCompletedLevel(amount?: number): void {
        let delta = amount == null ? 1 : amount;
        if (delta <= 0) {
            return;
        }

        let user = UserService.getUser();
        this.ensureDailyState(user);
        let state = this.getState(user);
        let changed = false;

        changed = this.commitPendingLevelCollections(user) || changed;
        changed = this.recordTaskDelta(this.getDailyTasks(user), state.dailyProgress, state.claimedDailyTaskIds, "complete_level", null, delta) || changed;
        changed = this.recordTaskDelta(this.getCurrentCampaignChapter(user).tasks, state.campaignProgress, state.claimedCampaignTaskIds, "complete_level", null, delta) || changed;

        if (changed) {
            user.saveTasksState();
        }
    }

    public static resetPendingLevelCollections(): void {
        this.pendingLevelCollections = {};
    }

    public static claimDailyTask(taskId: string, user?: User): TaskRewardGrant {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);
        let state = this.getState(safeUser);
        let task = this.getDailyTasks(safeUser).filter(item => item.id == taskId).shift();

        if (!task || !this.isTaskClaimable(task, state.dailyProgress, state.claimedDailyTaskIds)) {
            return null;
        }

        state.claimedDailyTaskIds.push(task.id);
        this.applyRewardToUser(safeUser, task.reward);
        safeUser.saveTasksState();

        return this.toRewardGrant(task.title, task.reward, true);
    }

    public static claimCampaignTask(taskId: string, user?: User): TaskRewardGrant {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let maxUnlockedChapter = this.getCurrentCampaignChapterIndex(safeUser);
        let task: TaskDefinition = null;

        for (let i = 0; i <= maxUnlockedChapter; i++) {
            task = TasksConfiguration.campaignChapters[i].tasks.filter(item => item.id == taskId).shift();
            if (task) {
                break;
            }
        }

        if (!task || !this.isTaskClaimable(task, state.campaignProgress, state.claimedCampaignTaskIds)) {
            return null;
        }

        state.claimedCampaignTaskIds.push(task.id);
        this.applyRewardToUser(safeUser, task.reward);
        safeUser.saveTasksState();

        return this.toRewardGrant(task.title, task.reward, true);
    }

    public static claimAvailableDailyRewards(user?: User): TaskRewardGrant[] {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);
        let state = this.getState(safeUser);
        let claimedTasks = this.getClaimedDailyTaskCount(safeUser);
        let rewards: TaskRewardGrant[] = [];

        TasksConfiguration.dailyMilestoneRewards.forEach(reward => {
            if (claimedTasks >= reward.claimedAt && state.claimedDailyRewardIds.indexOf(reward.id) < 0) {
                state.claimedDailyRewardIds.push(reward.id);
                this.applyRewardToUser(safeUser, reward.reward);
                rewards.push(this.toRewardGrant(reward.title, reward.reward, false));
            }
        });

        if (rewards.length > 0) {
            safeUser.saveTasksState();
        }

        return rewards;
    }

    public static claimAvailableCampaignRewards(user?: User): TaskRewardGrant[] {
        let safeUser = user || UserService.getUser();
        let state = this.getState(safeUser);
        let rewards: TaskRewardGrant[] = [];
        let claimed = true;

        while (claimed) {
            claimed = false;
            let chapter = this.getCurrentCampaignChapter(safeUser);
            let isChapterDone = chapter.tasks.every(task => state.claimedCampaignTaskIds.indexOf(task.id) >= 0);
            if (isChapterDone && state.claimedCampaignRewardIds.indexOf(chapter.id) < 0) {
                state.claimedCampaignRewardIds.push(chapter.id);
                this.applyRewardToUser(safeUser, chapter.reward);
                rewards.push(this.toRewardGrant(chapter.rewardTitle, chapter.reward, false));
                claimed = true;
            }
        }

        if (rewards.length > 0) {
            safeUser.saveTasksState();
        }

        return rewards;
    }

    public static hasClaimableTasks(user?: User): boolean {
        let safeUser = user || UserService.getUser();
        this.ensureDailyState(safeUser);

        if (this.getDailyTaskViews(safeUser).some(task => task.isClaimable)) {
            return true;
        }

        let maxUnlockedChapter = this.getCurrentCampaignChapterIndex(safeUser);
        for (let i = 0; i <= maxUnlockedChapter; i++) {
            if (this.getCampaignTaskViews(i, safeUser).some(task => task.isClaimable)) {
                return true;
            }
        }

        return false;
    }

    private static getCurrentCampaignChapter(user: User): TaskChapterDefinition {
        return TasksConfiguration.campaignChapters[this.getCurrentCampaignChapterIndex(user)];
    }

    private static getClaimedDailyTaskCount(user: User): number {
        let state = this.getState(user);
        return this.getDailyTasks(user).filter(task => state.claimedDailyTaskIds.indexOf(task.id) >= 0).length;
    }

    private static commitPendingLevelCollections(user: User): boolean {
        let targetIds = Object.keys(this.pendingLevelCollections);
        if (targetIds.length == 0) {
            return false;
        }

        let state = this.getState(user);
        let changed = false;

        targetIds.forEach(targetId => {
            let delta = this.pendingLevelCollections[targetId] || 0;
            if (delta <= 0) {
                return;
            }

            changed = this.recordTaskDelta(this.getDailyTasks(user), state.dailyProgress, state.claimedDailyTaskIds, "collect", targetId, delta) || changed;
            changed = this.recordTaskDelta(this.getCurrentCampaignChapter(user).tasks, state.campaignProgress, state.claimedCampaignTaskIds, "collect", targetId, delta) || changed;
        });

        this.pendingLevelCollections = {};
        return changed;
    }

    private static recordTaskDelta(
        tasks: TaskDefinition[],
        progressMap: { [taskId: string]: number },
        claimedTaskIds: string[],
        kind: string,
        targetId: string,
        delta: number
    ): boolean {
        let changed = false;

        tasks.forEach(task => {
            if (task.kind != kind) {
                return;
            }
            if (targetId && task.targetId != targetId) {
                return;
            }
            if (claimedTaskIds.indexOf(task.id) >= 0) {
                return;
            }

            let currentValue = progressMap[task.id] || 0;
            let nextValue = Math.min(task.target, currentValue + delta);
            if (nextValue != currentValue) {
                progressMap[task.id] = nextValue;
                changed = true;
            }
        });

        return changed;
    }

    private static toTaskView(
        task: TaskDefinition,
        progressMap: { [taskId: string]: number },
        claimedTaskIds: string[]
    ): TaskProgressView {
        let progress = Math.min(task.target, progressMap[task.id] || 0);
        let isClaimed = claimedTaskIds.indexOf(task.id) >= 0;
        let isCompleted = progress >= task.target;

        return {
            task: task,
            progress: progress,
            isCompleted: isCompleted,
            isClaimed: isClaimed,
            isClaimable: isCompleted && !isClaimed
        };
    }

    private static isTaskClaimable(
        task: TaskDefinition,
        progressMap: { [taskId: string]: number },
        claimedTaskIds: string[]
    ): boolean {
        return (progressMap[task.id] || 0) >= task.target && claimedTaskIds.indexOf(task.id) < 0;
    }

    private static applyRewardToUser(user: User, reward: TaskRewardConfig): void {
        if (!reward) {
            return;
        }

        if (reward.gems) {
            user.setSupermoney(user.getSupermoney() + reward.gems);
        }

        if (reward.boosters) {
            reward.boosters.forEach(booster => {
                user.increaseBoostersCount(<BoosterType><any>booster.type, booster.count);
            });
        }
    }

    private static toRewardGrant(title: string, reward: TaskRewardConfig, includeTaskGemsPrefix: boolean): TaskRewardGrant {
        let texts: string[] = [];
        let icons: string[] = [];

        if (reward && reward.gems) {
            texts.push("+" + reward.gems);
            icons.push("gems|0.55");
        }

        if (reward && reward.boosters) {
            reward.boosters.forEach(booster => {
                texts.push("+" + booster.count);
                icons.push(booster.type + "|0.72");
            });
        }

        if (texts.length == 0) {
            texts.push(includeTaskGemsPrefix ? "+2" : "+0");
            icons.push("gems|0.55");
        }

        return {
            title: title,
            texts: texts,
            icons: icons
        };
    }

    private static ensureDailyState(user: User): void {
        let state = this.getState(user);
        let currentDayId = EnergyUtils.getMoscowDayId();

        if (state.dailyDayId == currentDayId) {
            return;
        }

        state.dailyDayId = currentDayId;
        state.dailyProgress = {};
        state.claimedDailyTaskIds = [];
        state.claimedDailyRewardIds = [];
        user.saveTasksState();
    }

    private static getState(user: User): UserTasksState {
        let state = user.getTasksState();
        let changed = false;

        if (!state) {
            state = {
                dailyDayId: "",
                dailyProgress: {},
                claimedDailyTaskIds: [],
                claimedDailyRewardIds: [],
                campaignProgress: {},
                claimedCampaignTaskIds: [],
                claimedCampaignRewardIds: []
            };
            user.setTasksState(state);
            return state;
        }

        if (!state.dailyProgress) {
            state.dailyProgress = {};
            changed = true;
        }
        if (!state.claimedDailyTaskIds) {
            state.claimedDailyTaskIds = [];
            changed = true;
        }
        if (!state.claimedDailyRewardIds) {
            state.claimedDailyRewardIds = [];
            changed = true;
        }
        if (!state.campaignProgress) {
            state.campaignProgress = {};
            changed = true;
        }
        if (!state.claimedCampaignTaskIds) {
            state.claimedCampaignTaskIds = [];
            changed = true;
        }
        if (!state.claimedCampaignRewardIds) {
            state.claimedCampaignRewardIds = [];
            changed = true;
        }
        if (!state.dailyDayId) {
            state.dailyDayId = "";
            changed = true;
        }

        if (changed) {
            user.saveTasksState();
        }

        return state;
    }

    private static hashString(value: string): number {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    }
}
