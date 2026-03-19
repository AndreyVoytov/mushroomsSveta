import UserService from './../service/UserService';
import EventInfo from '../model/event/EventInfo';
import EventType from '../model/event/EventType';
import NeverError from './NeverError';
import EventStage from './../model/event/EventStage';
import PrizesConfiguration from './../configuration/PrizesConfiguration';
import User from './../model/user/User';
import ReplicaDao from './../dao/ReplicaDao';
import LocalizationService from '../localization/LocalizationService';
import GameText from '../localization/GameText';

export default class EventUtils {

    private static staticEvents: EventInfo[] = [];
    private static levelForStaticEvents = 15;
    private static levelForLukoshkoEvent = 24;

    public static updateEvents(): EventType[] {
        const result: EventType[] = [];
        const user = UserService.getUser();

        for (let i = 0; i < user.getEvents().length; i++) {
            const event = user.getEvents()[i];
            if (EventUtils.getStage(event) === EventStage.expired) {
                user.deleteEvent(event);
            }
        }

        if (user.getCurrentForest() >= this.levelForStaticEvents) {
            const existingTypes = user.getEvents().map(e => e.eventType);
            this.staticEvents.forEach(event => {
                if (EventUtils.getStage(event) === EventStage.active && existingTypes.indexOf(event.eventType) === -1) {
                    user.addEvent(event);
                    result.push(event.eventType);
                }
            });
        }

        if (this.canStartFirstLukoshkoEvent(user)) {
            user.addMarker('firstLukoshko');
            const event = new EventInfo(EventType.lukoshko, Date.now(), Date.now() + 1000 * 60 * 60 * 24);
            user.addEvent(event);
            result.push(event.eventType);
            user.setWinsInRow(0);
        }

        return result;
    }

    private static canStartFirstLukoshkoEvent(user: User): boolean {
        const havePrizes = PrizesConfiguration.allPrizes.filter(p => p.level === '' + user.getCurrentForest()).length > 0;
        const haveReplicas = ReplicaDao.getEntity().getAll().filter(r => r.context.level === user.getCurrentForest()).length > 0;
        const alreadyParticipated = user.getMarkers().indexOf('firstLukoshko') !== -1;

        return !havePrizes && !haveReplicas && !alreadyParticipated && user.getCurrentForest() > this.levelForLukoshkoEvent;
    }

    public static getActualEvents(): EventInfo[] {
        const user = UserService.getUser();
        return user.getEvents().filter(e => EventUtils.isActual(e));
    }

    public static isActual(event: EventInfo): boolean {
        return EventUtils.getStage(event) !== EventStage.inactive && EventUtils.getStage(event) !== EventStage.expired;
    }

    public static getStage(event: EventInfo): EventStage {
        if (event.prizeTakingEndAt && event.eventEndAt < Date.now() && event.prizeTakingEndAt > Date.now()) {
            return EventStage.prizeTaking;
        }
        if (event.eventStartAt < Date.now() && event.eventEndAt > Date.now()) {
            return EventStage.active;
        }
        if (event.eventStartAt > Date.now()) {
            return EventStage.inactive;
        }
        return EventStage.expired;
    }

    public static getIcon(eventType: EventType): string {
        switch (eventType) {
            case EventType.lukoshko:
                return 'lukoshkoIcon2';
            default:
                throw new NeverError(eventType);
        }
    }

    public static getMainImage(eventType: EventType): string {
        switch (eventType) {
            case EventType.lukoshko:
                return 'lukoshkoHeader';
            default:
                throw new NeverError(eventType);
        }
    }

    public static getName(eventType: EventType): string {
        switch (eventType) {
            case EventType.lukoshko:
                return LocalizationService.text('Волшебное лукошко');
            default:
                throw new NeverError(eventType);
        }
    }

    public static getDesc(eventType: EventType): string {
        switch (eventType) {
            case EventType.lukoshko:
                return LocalizationService.text('Выигрывайте уровни и \n ~получайте усиления~ на \n старте следующих уровней!');
            default:
                throw new NeverError(eventType);
        }
    }

    public static getRemainTimeShort(time: number): string {
        return GameText.remainShort(time);
    }

    public static getRemainTime(time: number): string {
        return GameText.remain(time);
    }
}