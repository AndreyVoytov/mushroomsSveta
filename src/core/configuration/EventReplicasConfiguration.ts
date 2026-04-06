import ReplicaType from '../model/replica/ReplicaType';
import User from '../model/user/User';
import UserEventState from '../model/event/UserEventState';
import EventUtils from '../utils/EventUtils';
import EventsConfiguration from './EventsConfiguration';

type EventReplicaSet = {
    forest: ReplicaType[];
    houseAfterLevel: ReplicaType[];
    complete: ReplicaType[];
    expired: ReplicaType[];
};

export default class EventReplicasConfiguration {

    private static event1Replicas: EventReplicaSet = {
        forest: [
            { id: 'event1_level_start_1', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_1', context: <any>{} },
            { id: 'event1_level_end_1', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_1', context: <any>{} },
            { id: 'event1_level_start_2', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_2', context: <any>{} },
            { id: 'event1_level_end_2', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_2', context: <any>{} },
            { id: 'event1_level_start_3', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_3', context: <any>{} },
            { id: 'event1_level_end_3', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_3', context: <any>{} },
            { id: 'event1_level_start_4', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_4', context: <any>{} },
            { id: 'event1_level_end_4', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_4', context: <any>{} },
            { id: 'event1_level_start_5', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_5', context: <any>{} },
            { id: 'event1_level_end_5', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_5', context: <any>{} },
            { id: 'event1_level_start_6', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_6', context: <any>{} },
            { id: 'event1_level_end_6', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_6', context: <any>{} },
            { id: 'event1_level_start_7', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_7', context: <any>{} },
            { id: 'event1_level_end_7', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_7', context: <any>{} },
            { id: 'event1_level_start_8', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_8', context: <any>{} },
            { id: 'event1_level_end_8', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_8', context: <any>{} },
            { id: 'event1_level_start_9', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_9', context: <any>{} },
            { id: 'event1_level_end_9', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_9', context: <any>{} },
            { id: 'event1_level_start_10', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_10', context: <any>{} },
            { id: 'event1_level_end_10', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_10', context: <any>{} },
            { id: 'event1_level_end_10_2', personImage: 'cat1', personName: 'Котёнок', text: 'level_end_10_2', rightSide: true, context: <any>{} },
            { id: 'event1_level_start_11', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_11', context: <any>{} },
            { id: 'event1_level_end_11', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_11', context: <any>{} },
            { id: 'event1_level_start_12', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_12', context: <any>{} },
            { id: 'event1_level_end_12', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_12', context: <any>{} },
            { id: 'event1_level_start_13', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_13', context: <any>{} },
            { id: 'event1_level_end_13', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_13', context: <any>{} },
            { id: 'event1_level_start_14', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_14', context: <any>{} },
            { id: 'event1_level_end_14', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_14', context: <any>{} },
            { id: 'event1_level_start_15', personImage: 'sveta1', personName: 'Эмма', text: 'level_start_15', context: <any>{} },
            { id: 'event1_level_end_15', personImage: 'sveta1', personName: 'Эмма', text: 'level_end_15', context: <any>{} }
        ],
        houseAfterLevel: [
            { id: 'event1_main_screen_after_level_1', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_1', context: <any>{} },
            { id: 'event1_main_screen_after_level_2', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_2', context: <any>{} },
            { id: 'event1_main_screen_after_level_3', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_3', context: <any>{} },
            { id: 'event1_main_screen_after_level_4', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_4', context: <any>{} },
            { id: 'event1_main_screen_after_level_5', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_5', context: <any>{} },
            { id: 'event1_main_screen_after_level_6', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_6', context: <any>{} },
            { id: 'event1_main_screen_after_level_7', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_7', context: <any>{} },
            { id: 'event1_main_screen_after_level_8', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_8', context: <any>{} },
            { id: 'event1_main_screen_after_level_9', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_9', context: <any>{} },
            { id: 'event1_main_screen_after_level_10', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_10', context: <any>{} },
            { id: 'event1_main_screen_after_level_11', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_11', context: <any>{} },
            { id: 'event1_main_screen_after_level_12', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_12', context: <any>{} },
            { id: 'event1_main_screen_after_level_13', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_13', context: <any>{} },
            { id: 'event1_main_screen_after_level_14', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_14', context: <any>{} },
            { id: 'event1_main_screen_after_level_15', personImage: 'sveta1', personName: 'Эмма', text: 'main_screen_after_level_15', context: <any>{} }
        ],
        complete: [
            { id: 'event1_complete', personImage: 'sveta1', personName: 'Эмма', text: 'Финал event1', context: <any>{} }
        ],
        expired: [
            { id: 'event1_expired', personImage: 'sveta1', personName: 'Эмма', text: 'Время event1 вышло', context: <any>{} }
        ]
    };

    public static getForestReplica(user: User): ReplicaType {
        const eventId = EventUtils.getActiveLevelEventId();
        const levelId = EventUtils.getActiveLevelOrder();
        const replicaStage = EventUtils.getActiveLevelReplicaStage();

        if (!eventId || !levelId || !replicaStage) {
            return null;
        }

        const replicaIdPrefix = eventId + '_' + replicaStage + '_' + levelId;
        const replica = this.getFirstUncompletedReplicaByPrefix(user, this.getForestReplicas(eventId), replicaIdPrefix);
        if (!replica) {
            EventUtils.clearActiveLevelReplicaStage();
            return null;
        }

        return replica;
    }

    public static getHouseReplica(user: User): ReplicaType {
        for (let i = 0; i < EventsConfiguration.allEvents.length; i++) {
            const eventConfig = EventsConfiguration.allEvents[i];
            const eventState = user.getEventState(eventConfig.eventId);
            if (!eventState) {
                continue;
            }

            let pendingLevelReplica = this.getPendingMainScreenReplica(user, eventState);
            if (pendingLevelReplica) {
                return pendingLevelReplica;
            }

            if (eventState.completedAt) {
                let replica = this.getFirstUncompletedReplica(user, this.getCompleteReplicas(eventConfig.eventId));
                if (replica) {
                    return replica;
                }
            }

            if (eventState.expiredAt) {
                let replica = this.getFirstUncompletedReplica(user, this.getExpiredReplicas(eventConfig.eventId));
                if (replica) {
                    return replica;
                }
            }
        }

        return null;
    }

    private static getPendingMainScreenReplica(user: User, eventState: UserEventState): ReplicaType {
        if (!eventState.pendingMainScreenLevelId) {
            return null;
        }

        let replicaIdPrefix = eventState.eventId + '_main_screen_after_level_' + eventState.pendingMainScreenLevelId;
        let replica = this.getFirstUncompletedReplicaByPrefix(user, this.getHouseAfterLevelReplicas(eventState.eventId), replicaIdPrefix);

        if (!replica) {
            eventState.pendingMainScreenLevelId = null;
            user.saveEventStates();
            return null;
        }

        return replica;
    }

    private static getForestReplicas(eventId: string): ReplicaType[] {
        return this.getReplicas(eventId).forest;
    }

    private static getHouseAfterLevelReplicas(eventId: string): ReplicaType[] {
        return this.getReplicas(eventId).houseAfterLevel;
    }

    private static getCompleteReplicas(eventId: string): ReplicaType[] {
        return this.getReplicas(eventId).complete;
    }

    private static getExpiredReplicas(eventId: string): ReplicaType[] {
        return this.getReplicas(eventId).expired;
    }

    private static getReplicas(eventId: string): EventReplicaSet {
        switch (eventId) {
            case 'event1':
                return this.event1Replicas;
            default:
                return {
                    forest: [],
                    houseAfterLevel: [],
                    complete: [],
                    expired: []
                };
        }
    }

    private static getFirstUncompletedReplica(user: User, replicas: ReplicaType[]): ReplicaType {
        for (let i = 0; i < replicas.length; i++) {
            if (user.getCompletedReplicas().indexOf(replicas[i].id) == -1) {
                return replicas[i];
            }
        }

        return null;
    }

    private static getFirstUncompletedReplicaByPrefix(user: User, replicas: ReplicaType[], replicaIdPrefix: string): ReplicaType {
        for (let i = 0; i < replicas.length; i++) {
            const replica = replicas[i];
            if (!this.matchesReplicaPrefix(replica.id, replicaIdPrefix)) {
                continue;
            }
            if (user.getCompletedReplicas().indexOf(replica.id) == -1) {
                return replica;
            }
        }

        return null;
    }

    private static matchesReplicaPrefix(replicaId: string, replicaIdPrefix: string): boolean {
        return replicaId == replicaIdPrefix || replicaId.indexOf(replicaIdPrefix + '_') == 0;
    }
}
