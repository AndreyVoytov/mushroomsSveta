import EventsConfiguration, { EventAssetConfiguration, EventMainImageOverrideConfiguration } from '../configuration/EventsConfiguration';
import PrizesConfiguration from '../configuration/PrizesConfiguration';
import ForestDao from '../dao/ForestDao';
import ReplicaDao from '../dao/ReplicaDao';
import LocalizationService from '../localization/LocalizationService';
import GameText from '../localization/GameText';
import EventInfo from '../model/event/EventInfo';
import EventStage from '../model/event/EventStage';
import EventType from '../model/event/EventType';
import User from '../model/user/User';
import UserService from '../service/UserService';
import NeverError from './NeverError';

type EventLevelSession = {
    eventId: string;
    levelIndex: number;
    replicaStage?: string;
};

export default class EventUtils {

    private static staticEvents: EventInfo[] = [];
    private static levelForStaticEvents = 15;
    private static levelForLukoshkoEvent = 24;
    private static activeLevelSession: EventLevelSession = null;

    public static updateEvents(): string[] {
        const result: string[] = [];
        const user = UserService.getUser();

        user.getEvents().slice().forEach(event => {
            if (event.eventType == EventType.configured) {
                this.syncConfiguredEvent(event);
                return;
            }

            if (EventUtils.getStage(event) === EventStage.expired) {
                user.deleteEvent(event);
            }
        });

        if (user.getCurrentForest() >= this.levelForStaticEvents) {
            const existingKeys = user.getEvents().map(event => EventUtils.getEventKey(event));
            this.staticEvents.forEach(event => {
                if (EventUtils.getStage(event) === EventStage.active && existingKeys.indexOf(EventUtils.getEventKey(event)) === -1) {
                    user.addEvent(event);
                    result.push(EventUtils.getEventKey(event));
                }
            });
        }

        EventsConfiguration.allEvents.forEach(eventConfig => {
            const levelsCount = this.getEventLevelsCount(eventConfig.eventId);
            const eventState = user.getEventState(eventConfig.eventId);
            const isFinished = eventState && (eventState.completedAt || eventState.expiredAt);
            const existingEvent = this.getEventById(eventConfig.eventId);

            if (levelsCount == 0 || isFinished || existingEvent || this.hasPendingStoryReplica(user)) {
                return;
            }

            if (user.getCurrentForest() >= eventConfig.startsatLevel) {
                user.addEvent(new EventInfo(
                    EventType.configured,
                    Date.now(),
                    Date.now() + eventConfig.duration,
                    null,
                    eventConfig.eventId
                ));
                result.push(eventConfig.eventId);
            }
        });

        if (this.canStartFirstLukoshkoEvent(user)) {
            user.addMarker('firstLukoshko');
            const event = new EventInfo(EventType.lukoshko, Date.now(), Date.now() + 1000 * 60 * 60 * 24);
            user.addEvent(event);
            result.push(this.getEventKey(event));
            user.setWinsInRow(0);
        }

        return result;
    }

    public static getActualEvents(): EventInfo[] {
        const user = UserService.getUser();
        return user.getEvents().filter(event => EventUtils.isActual(event));
    }

    public static isActual(event: EventInfo): boolean {
        if (event && event.eventType == EventType.configured && event.eventId) {
            const eventState = UserService.getUser().getEventState(event.eventId);
            if (eventState && (eventState.completedAt || eventState.expiredAt)) {
                return false;
            }
        }

        return EventUtils.getStage(event) !== EventStage.inactive && EventUtils.getStage(event) !== EventStage.expired;
    }

    public static getStage(event: EventInfo): EventStage {
        const now = Date.now();

        if (event.prizeTakingEndAt && event.eventEndAt <= now && event.prizeTakingEndAt > now) {
            return EventStage.prizeTaking;
        }
        if (event.eventStartAt <= now && event.eventEndAt > now) {
            return EventStage.active;
        }
        if (event.eventStartAt > now) {
            return EventStage.inactive;
        }
        return EventStage.expired;
    }

    public static getEventKey(event: EventInfo): string {
        if (!event) {
            return "";
        }
        if (event.eventId) {
            return event.eventId;
        }
        return EventType[event.eventType];
    }

    public static getIcon(eventType: EventType, eventId?: string): string {
        switch (eventType) {
            case EventType.lukoshko:
                return 'lukoshkoIcon2';
            case EventType.configured:
                return this.getEventConfigStringValue(eventId, "icon", "tasks");
            default:
                throw new NeverError(eventType);
        }
    }

    public static getMainImage(eventType: EventType, eventId?: string, levelNumber?: number): string {
        switch (eventType) {
            case EventType.lukoshko:
                return 'lukoshkoHeader';
            case EventType.configured:
                return this.getConfiguredEventMainImage(eventId, levelNumber);
            default:
                throw new NeverError(eventType);
        }
    }

    public static getConfiguredEventIconScale(eventId?: string): number {
        return this.getEventConfigNumberValue(eventId, "iconScale", 0.86 * 0.95);
    }

    public static getMainImageScale(eventType: EventType, eventId?: string, levelNumber?: number): number {
        switch (eventType) {
            case EventType.lukoshko:
                return 1.45;
            case EventType.configured:
                return this.getConfiguredEventMainImageScale(eventId, levelNumber);
            default:
                throw new NeverError(eventType);
        }
    }

    public static getConfiguredEventAssets(eventId: string): EventAssetConfiguration[] {
        return EventsConfiguration.getAssetsById(eventId);
    }

    public static getConfiguredEventIdsWithOptionalAssets(includeAwaitingActivation?: boolean): string[] {
        const result: string[] = [];
        const user = UserService.getUser();

        const pushEventId = (eventId: string) => {
            if (!eventId || result.indexOf(eventId) != -1 || this.getConfiguredEventAssets(eventId).length == 0) {
                return;
            }

            result.push(eventId);
        };

        this.getActualEvents().forEach(event => {
            if (event.eventType == EventType.configured) {
                pushEventId(event.eventId);
            }
        });

        EventsConfiguration.allEvents.forEach(eventConfig => {
            const eventState = user.getEventState(eventConfig.eventId);
            if (eventState && eventState.pendingOpenPanel) {
                pushEventId(eventConfig.eventId);
            }

            if (includeAwaitingActivation && this.shouldPreloadConfiguredEventAssetsBeforeActivation(user, eventConfig.eventId)) {
                pushEventId(eventConfig.eventId);
            }
        });

        return result;
    }

    public static hasMissingConfiguredEventAssets(game: Phaser.Game, eventId: string): boolean {
        const assets = this.getConfiguredEventAssets(eventId);
        if (assets.length == 0) {
            return false;
        }

        return assets.some(asset => !this.isImageCached(game, asset.key));
    }

    public static getName(eventType: EventType, eventId?: string): string {
        switch (eventType) {
            case EventType.lukoshko:
                return LocalizationService.get('ui.event.lukoshko.name');
            case EventType.configured:
                return this.getEventConfigValue(eventId, "name");
            default:
                throw new NeverError(eventType);
        }
    }

    public static getDesc(eventType: EventType, eventId?: string): string {
        switch (eventType) {
            case EventType.lukoshko:
                return LocalizationService.get('ui.event.lukoshko.desc');
            case EventType.configured:
                return this.getEventConfigValue(eventId, "description");
            default:
                throw new NeverError(eventType);
        }
    }

    public static getEventProgress(eventId: string): number {
        const eventState = UserService.getUser().getEventState(eventId);
        if (!eventState) {
            return 0;
        }

        const totalLevels = this.getEventLevelsCount(eventId);
        if (totalLevels > 0 && eventState.progress > totalLevels) {
            eventState.progress = totalLevels;
            UserService.getUser().saveEventStates();
        }

        return totalLevels > 0 ? Math.min(eventState.progress || 0, totalLevels) : (eventState.progress || 0);
    }

    public static getEventLevelsCount(eventId: string): number {
        const allLevelsCount = ForestDao.getAllEventForestsById(eventId).length;
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig || eventConfig.levelsCount == null || eventConfig.levelsCount == -1) {
            return allLevelsCount;
        }

        return Math.max(0, Math.min(allLevelsCount, eventConfig.levelsCount));
    }

    public static startEventLevel(eventId: string): boolean {
        const event = this.getEventById(eventId);
        if (!event) {
            return false;
        }

        if (this.getStage(event) !== EventStage.active) {
            this.expireConfiguredEvent(event);
            return false;
        }

        const levelIndex = this.getEventProgress(eventId);
        if (this.getEventLevelsCount(eventId) == 0 || levelIndex >= this.getEventLevelsCount(eventId)) {
            this.finishConfiguredEvent(eventId);
            return false;
        }

        this.activeLevelSession = {
            eventId: eventId,
            levelIndex: levelIndex,
            replicaStage: 'level_start'
        };

        return true;
    }

    public static hasActiveLevelSession(): boolean {
        return this.activeLevelSession != null;
    }

    public static getActiveLevelEventId(): string {
        return this.activeLevelSession ? this.activeLevelSession.eventId : null;
    }

    public static getActiveLevelIndex(): number {
        return this.activeLevelSession ? this.activeLevelSession.levelIndex : null;
    }

    public static getActiveLevelReplicaStage(): string {
        return this.activeLevelSession ? this.activeLevelSession.replicaStage : null;
    }

    public static clearActiveLevelReplicaStage(): void {
        if (this.activeLevelSession) {
            this.activeLevelSession.replicaStage = null;
        }
    }

    public static activateLevelEndReplica(): boolean {
        if (!this.activeLevelSession) {
            return false;
        }

        this.activeLevelSession.replicaStage = 'level_end';
        return true;
    }

    public static getActiveLevelOrder(): string {
        if (!this.activeLevelSession || this.activeLevelSession.levelIndex == null) {
            return null;
        }

        return '' + (this.activeLevelSession.levelIndex + 1);
    }

    public static getActiveEventForestType() {
        if (!this.activeLevelSession) {
            return null;
        }

        return ForestDao.getEventForestByIdAndIndex(this.activeLevelSession.eventId, this.activeLevelSession.levelIndex);
    }

    public static completeActiveEventLevel(): void {
        if (!this.activeLevelSession) {
            return;
        }

        const user = UserService.getUser();
        const eventId = this.activeLevelSession.eventId;
        const totalLevels = this.getEventLevelsCount(eventId);
        const eventState = user.getOrCreateEventState(eventId);
        const completedLevelId = this.getActiveLevelOrder();
        const activeEvent = this.getEventById(eventId);

        eventState.progress = Math.max(eventState.progress || 0, this.activeLevelSession.levelIndex + 1);
        if (totalLevels > 0 && eventState.progress > totalLevels) {
            eventState.progress = totalLevels;
        }
        if (completedLevelId) {
            eventState.pendingMainScreenLevelId = completedLevelId;
        }
        eventState.pendingOpenPanel = true;
        eventState.pendingPanelEventEndAt = activeEvent ? activeEvent.eventEndAt : eventState.pendingPanelEventEndAt;
        eventState.pendingCharacterTravel = true;

        if (totalLevels > 0 && eventState.progress >= totalLevels) {
            eventState.completedAt = Date.now();
            if (activeEvent) {
                user.deleteEvent(activeEvent);
            }
        }

        user.saveEventStates();
        this.clearActiveLevelSession();
    }

    public static clearActiveLevelSession(): void {
        this.activeLevelSession = null;
    }

    public static consumePendingHousePanelEvent(): EventInfo {
        const user = UserService.getUser();

        for (let i = 0; i < EventsConfiguration.allEvents.length; i++) {
            const eventConfig = EventsConfiguration.allEvents[i];
            const eventState = user.getEventState(eventConfig.eventId);
            if (!eventState || !eventState.pendingOpenPanel) {
                continue;
            }

            const eventInfo = this.createHousePanelEvent(eventConfig.eventId, eventState.pendingPanelEventEndAt);
            this.clearPendingHousePanelState(eventState);
            user.saveEventStates();
            return eventInfo;
        }

        return null;
    }

    public static expireConfiguredEvent(eventOrId: EventInfo | string): void {
        const event = typeof eventOrId == "string" ? this.getEventById(eventOrId) : eventOrId;
        const eventId = event && event.eventId ? event.eventId : (typeof eventOrId == "string" ? eventOrId : null);
        if (!eventId) {
            return;
        }

        const user = UserService.getUser();
        const eventState = user.getOrCreateEventState(eventId);
        if (!eventState.completedAt && !eventState.expiredAt) {
            eventState.expiredAt = Date.now();
        }
        eventState.pendingMainScreenLevelId = null;
        eventState.pendingCharacterTravel = false;
        this.clearPendingHousePanelState(eventState);

        user.saveEventStates();

        if (event) {
            user.deleteEvent(event);
        }

        if (this.activeLevelSession && this.activeLevelSession.eventId == eventId) {
            this.clearActiveLevelSession();
        }
    }

    public static restartConfiguredEventForAdmin(eventId: string): boolean {
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig || this.getEventLevelsCount(eventId) == 0) {
            return false;
        }

        const user = UserService.getUser();
        this.deleteConfiguredEventsById(eventId);

        const eventState = user.getOrCreateEventState(eventId);
        eventState.progress = 0;
        eventState.completedAt = null;
        eventState.expiredAt = null;
        eventState.pendingMainScreenLevelId = null;
        eventState.pendingCharacterTravel = false;
        this.clearPendingHousePanelState(eventState);

        user.deleteCompletedReplicasByPrefix(eventId + "_");
        user.saveEventStates();

        user.addEvent(new EventInfo(
            EventType.configured,
            Date.now(),
            Date.now() + eventConfig.duration,
            null,
            eventId
        ));

        if (this.activeLevelSession && this.activeLevelSession.eventId == eventId) {
            this.clearActiveLevelSession();
        }

        return true;
    }

    public static finishConfiguredEventForAdmin(eventId: string): boolean {
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig || this.getEventLevelsCount(eventId) == 0) {
            return false;
        }

        const user = UserService.getUser();
        this.deleteConfiguredEventsById(eventId);

        const eventState = user.getOrCreateEventState(eventId);
        eventState.progress = this.getEventLevelsCount(eventId);
        eventState.completedAt = Date.now();
        eventState.expiredAt = null;
        eventState.pendingMainScreenLevelId = null;
        eventState.pendingCharacterTravel = false;
        this.clearPendingHousePanelState(eventState);
        user.saveEventStates();

        if (this.activeLevelSession && this.activeLevelSession.eventId == eventId) {
            this.clearActiveLevelSession();
        }

        return true;
    }

    public static getRemainTimeShort(time: number): string {
        return GameText.remainShort(time);
    }

    public static consumePendingCharacterTravel(eventId: string): boolean {
        if (!eventId) {
            return false;
        }

        const user = UserService.getUser();
        const eventState = user.getEventState(eventId);
        if (!eventState || !eventState.pendingCharacterTravel) {
            return false;
        }

        eventState.pendingCharacterTravel = false;
        user.saveEventStates();
        return true;
    }

    public static getRemainTime(time: number): string {
        return GameText.remain(time);
    }

    private static getEventById(eventId: string): EventInfo {
        return UserService.getUser().getEvents().filter(event => event.eventId == eventId).shift();
    }

    private static deleteConfiguredEventsById(eventId: string): void {
        const user = UserService.getUser();
        user.getEvents()
            .slice()
            .filter(event => event.eventId == eventId)
            .forEach(event => user.deleteEvent(event));
    }

    private static syncConfiguredEvent(event: EventInfo): void {
        if (!event || !event.eventId) {
            return;
        }

        if (this.getStage(event) === EventStage.expired) {
            this.expireConfiguredEvent(event);
            return;
        }

        const totalLevels = this.getEventLevelsCount(event.eventId);
        const eventState = UserService.getUser().getEventState(event.eventId);
        if (totalLevels == 0) {
            UserService.getUser().deleteEvent(event);
            if (this.activeLevelSession && this.activeLevelSession.eventId == event.eventId) {
                this.clearActiveLevelSession();
            }
            return;
        }

        if (eventState && !eventState.completedAt && eventState.progress >= totalLevels) {
            this.finishConfiguredEvent(event.eventId);
            return;
        }

        if (eventState && eventState.completedAt) {
            UserService.getUser().deleteEvent(event);
        }
    }

    private static finishConfiguredEvent(eventId: string): void {
        const user = UserService.getUser();
        const totalLevels = this.getEventLevelsCount(eventId);
        const eventState = user.getOrCreateEventState(eventId);

        if (totalLevels > 0) {
            eventState.progress = totalLevels;
        }
        if (!eventState.completedAt) {
            eventState.completedAt = Date.now();
        }
        eventState.pendingMainScreenLevelId = null;
        eventState.pendingCharacterTravel = false;
        this.clearPendingHousePanelState(eventState);

        user.saveEventStates();

        const activeEvent = this.getEventById(eventId);
        if (activeEvent) {
            user.deleteEvent(activeEvent);
        }

        if (this.activeLevelSession && this.activeLevelSession.eventId == eventId) {
            this.clearActiveLevelSession();
        }
    }

    private static getEventConfigValue(eventId: string, key: "name" | "description"): string {
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig) {
            return eventId || "";
        }
        return eventConfig[key];
    }

    private static getConfiguredEventMainImage(eventId: string, levelNumber?: number): string {
        const eventConfig = EventsConfiguration.getById(eventId);
        const override = this.getConfiguredEventMainImageOverride(eventId, levelNumber);
        if (override && override.mainImage) {
            return override.mainImage;
        }
        return eventConfig && eventConfig.mainImage ? eventConfig.mainImage : "tasks";
    }

    private static getConfiguredEventMainImageScale(eventId: string, levelNumber?: number): number {
        const eventConfig = EventsConfiguration.getById(eventId);
        const override = this.getConfiguredEventMainImageOverride(eventId, levelNumber);
        if (override && override.mainImageScale != null) {
            return Number(override.mainImageScale);
        }
        return eventConfig && eventConfig.mainImageScale != null ? Number(eventConfig.mainImageScale) : 1.18;
    }

    private static getConfiguredEventMainImageOverride(eventId: string, levelNumber?: number): EventMainImageOverrideConfiguration {
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig || !eventConfig.mainImageOverrides || eventConfig.mainImageOverrides.length == 0) {
            return null;
        }

        const resolvedLevelNumber = levelNumber || this.getConfiguredEventDisplayLevelNumber(eventId);
        return eventConfig.mainImageOverrides.filter(override => override && override.levels && override.levels.indexOf(resolvedLevelNumber) != -1).shift();
    }

    private static getConfiguredEventDisplayLevelNumber(eventId: string): number {
        if (this.activeLevelSession && this.activeLevelSession.eventId == eventId) {
            return this.activeLevelSession.levelIndex + 1;
        }

        const totalLevels = this.getEventLevelsCount(eventId);
        const progress = this.getEventProgress(eventId);
        if (totalLevels > 0) {
            return Math.max(1, Math.min(progress + 1, totalLevels));
        }

        return Math.max(1, progress + 1);
    }

    private static getEventConfigStringValue(eventId: string, key: "icon" | "mainImage", fallback: string): string {
        const eventConfig = EventsConfiguration.getById(eventId);
        return eventConfig && eventConfig[key] ? eventConfig[key] : fallback;
    }

    private static getEventConfigNumberValue(eventId: string, key: "iconScale" | "mainImageScale", fallback: number): number {
        const eventConfig = EventsConfiguration.getById(eventId);
        return eventConfig && eventConfig[key] != null ? Number(eventConfig[key]) : fallback;
    }

    private static isImageCached(game: Phaser.Game, key: string): boolean {
        const cache: any = game && game.cache;
        if (!cache || !key) {
            return false;
        }

        if (cache.checkImageKey) {
            return cache.checkImageKey(key);
        }

        try {
            return !!cache.getImage(key, true);
        } catch (e) {
            return false;
        }
    }

    private static createHousePanelEvent(eventId: string, fallbackEventEndAt?: number): EventInfo {
        const activeEvent = this.getEventById(eventId);
        if (activeEvent) {
            return activeEvent;
        }

        const eventConfig = EventsConfiguration.getById(eventId);
        const eventEndAt = fallbackEventEndAt || Date.now();
        const eventStartAt = eventConfig ? eventEndAt - eventConfig.duration : eventEndAt - 1;

        return new EventInfo(EventType.configured, eventStartAt, eventEndAt, null, eventId);
    }

    private static clearPendingHousePanelState(eventState): void {
        eventState.pendingOpenPanel = false;
        eventState.pendingPanelEventEndAt = null;
    }

    private static shouldPreloadConfiguredEventAssetsBeforeActivation(user: User, eventId: string): boolean {
        const eventConfig = EventsConfiguration.getById(eventId);
        if (!eventConfig) {
            return false;
        }

        const levelsCount = this.getEventLevelsCount(eventId);
        const eventState = user.getEventState(eventId);
        const isFinished = eventState && (eventState.completedAt || eventState.expiredAt);
        const existingEvent = this.getEventById(eventId);

        if (levelsCount == 0 || isFinished || existingEvent) {
            return false;
        }

        return user.getCurrentForest() >= eventConfig.startsatLevel;
    }

    private static canStartFirstLukoshkoEvent(user: User): boolean {
        const havePrizes = PrizesConfiguration.allPrizes.filter(p => p.level === '' + user.getCurrentForest()).length > 0;
        const haveReplicas = ReplicaDao.getEntity().getAll().filter(r => r.context.level === user.getCurrentForest()).length > 0;
        const alreadyParticipated = user.getMarkers().indexOf('firstLukoshko') !== -1;

        return !havePrizes && !haveReplicas && !alreadyParticipated && user.getCurrentForest() > this.levelForLukoshkoEvent;
    }

    private static hasPendingStoryReplica(user: User): boolean {
        return !!ReplicaDao.getEntity().getReplica(user);
    }
}
