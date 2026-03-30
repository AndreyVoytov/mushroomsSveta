import BoosterType from "../enum/BoosterType";

export type TaskKind = "spend_energy" | "collect" | "complete_level";

export type TaskRewardConfig = {
    gems?: number;
    boosters?: { type: BoosterType; count: number }[];
};

export interface TaskDefinition {
    id: string;
    kind: TaskKind;
    target: number;
    title: string;
    icon: string;
    targetId?: string;
    reward?: TaskRewardConfig;
}

export interface TaskMilestoneRewardDefinition {
    id: string;
    claimedAt: number;
    title: string;
    icon: string;
    reward: TaskRewardConfig;
}

export interface TaskChapterDefinition {
    id: string;
    title: string;
    rewardIcon: string;
    rewardTitle: string;
    reward: TaskRewardConfig;
    tasks: TaskDefinition[];
}

export interface TasksConfigurationData {
    dailySelectionCount: number;
    dailyPool: TaskDefinition[];
    dailyMilestoneRewards: TaskMilestoneRewardDefinition[];
    campaignChapters: TaskChapterDefinition[];
}

export interface UserTasksState {
    dailyDayId: string;
    dailyProgress: { [taskId: string]: number };
    claimedDailyTaskIds: string[];
    claimedDailyRewardIds: string[];
    campaignProgress: { [taskId: string]: number };
    claimedCampaignTaskIds: string[];
    claimedCampaignRewardIds: string[];
}

export interface TaskProgressView {
    task: TaskDefinition;
    progress: number;
    isCompleted: boolean;
    isClaimed: boolean;
    isClaimable: boolean;
}

export interface TaskRewardView {
    id: string;
    title: string;
    icon: string;
    reward: TaskRewardConfig;
    progressTarget: number;
    isReached: boolean;
    isClaimed: boolean;
}

export interface CampaignChapterView {
    chapter: TaskChapterDefinition;
    index: number;
    isUnlocked: boolean;
    isCurrent: boolean;
    isCompleted: boolean;
    isRewardClaimed: boolean;
    claimedTasks: number;
    totalTasks: number;
}

export interface TaskRewardGrant {
    title: string;
    texts: string[];
    icons: string[];
}

export function createEmptyUserTasksState(): UserTasksState {
    return {
        dailyDayId: "",
        dailyProgress: {},
        claimedDailyTaskIds: [],
        claimedDailyRewardIds: [],
        campaignProgress: {},
        claimedCampaignTaskIds: [],
        claimedCampaignRewardIds: []
    };
}
