import ReplicaType from '../model/replica/ReplicaType';
import ReplicaPanelItemType from '../model/replica/ReplicaPanelItemType';
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

function createReplica(
    id: string,
    personImage: string,
    personName: string,
    text: string,
    extra?: Partial<ReplicaType>
): ReplicaType {
    const replica = {
        id: id,
        personImage: personImage,
        personName: personName,
        text: text,
        context: <any>{}
    } as ReplicaType;

    if (extra) {
        Object.keys(extra).forEach(key => {
            (<any>replica)[key] = (<any>extra)[key];
        });
    }

    return replica;
}

function createDecor(image: string, x: number, y: number, rightSide?: boolean) {
    return {
        image: image,
        x: x,
        y: y,
        rightSide: !!rightSide,
        overDialog: false
    };
}

function createPanelItem(
    image: string,
    glowImage: string,
    highlightColor?: string,
    extra?: Partial<ReplicaPanelItemType>
): ReplicaPanelItemType {
    return {
        image: image,
        glowImage: glowImage,
        highlightColor: highlightColor,
        scaleMultiplier: extra && extra.scaleMultiplier != null ? extra.scaleMultiplier : null,
        offsetX: extra && extra.offsetX != null ? extra.offsetX : null,
        offsetY: extra && extra.offsetY != null ? extra.offsetY : null
    };
}

export default class EventReplicasConfiguration {

    private static event1Replicas: EventReplicaSet = {
        forest: [
            createReplica('event1_level_end_4', 'sveta2', 'Шапка', 'Хм, к шмелю был привязан кусочек карты.', {
                panelItem: createPanelItem('sideEvent1Map2', 'map2Shine', 'blue', {
                    scaleMultiplier: 3
                })
            })
        ],
        houseAfterLevel: [
            createReplica('event1_main_screen_after_level_1', 'sveta2', 'Шапка', 'Клеверные луга... Куда мы забрели?'),
            createReplica('event1_main_screen_after_level_1_2', 'cat2', 'Котёнок', 'Кажется, карта скоро оборвется. Поэтому смотрите в оба, ищите зацепки, друзья.', {
                rightSide: true
            }),
            createReplica('event1_main_screen_after_level_5', 'sveta4', 'Шапка', 'Только посмотрите на эти огромные ульи! Давайте будем держаться от них подальше.'),
            createReplica('event1_main_screen_after_level_7', 'sveta2', 'Шапка', 'Видите ту огромную медовую соту? Кажется, там фрагмент карты.', {
                panelItem: createPanelItem('sideEvent1Map3', 'map3Shine', 'blue', {
                    scaleMultiplier: 2.5,
                    offsetX: -150
                }),
                decor: createDecor('mapInHive', 238, 58)
            }),
            createReplica('event1_main_screen_after_level_10', 'sveta4', 'Шапка', 'Ой-ой. У меня плохое предчувствие.'),
            createReplica('event1_main_screen_after_level_10_2', 'sova2', 'Совёнок', 'ААААА, мы чуть было не стали мёдом!', {
                rightSide: true
            }),
            createReplica('event1_main_screen_after_level_10_3', 'cat4', 'Котёнок', 'А я даже набрал пару баночек, не пропадать же добру.', {
                rightSide: true,
                decor: createDecor('honeyDecor', 120, 48, true)
            }),
            createReplica('event1_main_screen_after_level_13', 'sveta5', 'Шапка', 'Кажется, мы почти у цели! Давайте поднажмем.')
        ],
        complete: [
            createReplica('event1_complete', 'sveta2', 'Шапка', 'Хм, знакомые места... Кажется, примерно тут мы и начали наше приключение...'),
            createReplica('event1_complete_2', 'cat1', 'Котёнок', 'Смотрите, на том дереве крест! Дайте мне пару минут.', {
                rightSide: true,
                decor: createDecor('crossDecor', 160, 44, true),
                decor2: createDecor('shovelDecor', 20, 0, true)
            }),
            createReplica('event1_complete_3', 'sveta5', 'Шапка', 'Отлично, сундучок. Откроем...', {
                decor: createDecor('chestClosedDecor', 232, 30)
            }),
            createReplica('event1_complete_4', 'sveta2', 'Шапка', 'Хм, тут немного рубинов... и птичье перо.', {
                decor: createDecor('chestOpenDecor', 232, 30)
            }),
            createReplica('event1_complete_5', 'sveta4', 'Шапка', 'Постойте-ка! Совёнок, эта карта - твоих рук дело?!'),
            createReplica('event1_complete_6', 'sova3', 'Совёнок', '...', {
                rightSide: true
            }),
            createReplica('event1_complete_7', 'sveta1', 'Шапка', 'Ах ты хитрый комок перьев! Постойте-ка... Тут еще бутылка.', {
                decor: createDecor('bottleDecor', 255, 42)
            }),
            createReplica('event1_complete_8', 'sveta4', 'Шапка', 'А в ней снова карта.')
        ],
        expired: []
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
