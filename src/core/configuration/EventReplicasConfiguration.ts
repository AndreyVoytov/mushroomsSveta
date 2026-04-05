import ReplicaType from '../model/replica/ReplicaType';
import User from '../model/user/User';
import UserEventState from '../model/event/UserEventState';
import EventUtils from '../utils/EventUtils';
import EventsConfiguration from './EventsConfiguration';

export default class EventReplicasConfiguration {

    public static getForestReplica(user: User): ReplicaType {
        const eventId = EventUtils.getActiveLevelEventId();
        const levelId = EventUtils.getActiveLevelOrder();
        const replicaStage = EventUtils.getActiveLevelReplicaStage();

        if (!eventId || !levelId || !replicaStage) {
            return null;
        }

        const replica = this.createLevelReplica(eventId, replicaStage, levelId);
        if (!replica) {
            EventUtils.clearActiveLevelReplicaStage();
            return null;
        }

        if (user.getCompletedReplicas().indexOf(replica.id) != -1) {
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
                let replica = this.getFirstUncompletedReplica(user, this.createCompleteReplicas(eventConfig.eventId));
                if (replica) {
                    return replica;
                }
            }

            if (eventState.expiredAt) {
                let replica = this.getFirstUncompletedReplica(user, this.createExpiredReplicas(eventConfig.eventId));
                if (replica) {
                    return replica;
                }
            }
        }

        return null;
    }

    private static createLevelReplica(eventId: string, replicaStage: string, levelId: string): ReplicaType {
        let text = null;
        if (replicaStage == 'level_start') {
            text = 'level_start_' + levelId;
        } else if (replicaStage == 'level_end') {
            text = 'level_end_' + levelId;
        }

        if (!text) {
            return null;
        }

        return {
            id: eventId + '_' + replicaStage + '_' + levelId,
            personImage: 'sveta1',
            personName: 'Эмма',
            text: text,
            context: <any>{}
        };
    }

    private static getPendingMainScreenReplica(user: User, eventState: UserEventState): ReplicaType {
        if (!eventState.pendingMainScreenLevelId) {
            return null;
        }

        let replicaId = eventState.eventId + '_main_screen_after_level_' + eventState.pendingMainScreenLevelId;
        if (user.getCompletedReplicas().indexOf(replicaId) != -1) {
            eventState.pendingMainScreenLevelId = null;
            user.saveEventStates();
            return null;
        }

        return {
            id: replicaId,
            personImage: 'sveta1',
            personName: 'Эмма',
            text: 'main_screen_after_level_' + eventState.pendingMainScreenLevelId,
            context: <any>{}
        };
    }

    private static createCompleteReplicas(eventId: string): ReplicaType[] {
        return [
            {
                id: eventId + "_complete",
                personImage: "sveta1",
                personName: "Эмма",
                text: "Финал " + eventId,
                context: <any>{}
            }
        ];
    }

    private static createExpiredReplicas(eventId: string): ReplicaType[] {
        return [
            {
                id: eventId + "_expired",
                personImage: "sveta1",
                personName: "Эмма",
                text: "Время " + eventId + " вышло",
                context: <any>{}
            }
        ];
    }

    private static getFirstUncompletedReplica(user: User, replicas: ReplicaType[]): ReplicaType {
        for (let i = 0; i < replicas.length; i++) {
            if (user.getCompletedReplicas().indexOf(replicas[i].id) == -1) {
                return replicas[i];
            }
        }

        return null;
    }
}
