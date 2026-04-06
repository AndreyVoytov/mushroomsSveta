export default class UserEventState {
    eventId: string;
    progress: number;
    completedAt?: number;
    expiredAt?: number;
    pendingMainScreenLevelId?: string;
    pendingOpenPanel?: boolean;
    pendingPanelEventEndAt?: number;

    constructor(state?: UserEventState) {
        this.eventId = state && state.eventId ? state.eventId : "";
        this.progress = state && state.progress != null ? state.progress : 0;
        this.completedAt = state && state.completedAt;
        this.expiredAt = state && state.expiredAt;
        this.pendingMainScreenLevelId = state && state.pendingMainScreenLevelId;
        this.pendingOpenPanel = state && state.pendingOpenPanel;
        this.pendingPanelEventEndAt = state && state.pendingPanelEventEndAt;
    }
}
