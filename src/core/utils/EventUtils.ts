
import UserService from './../service/UserService';
import EventInfo from '../model/event/EventInfo';
import EventType from '../model/event/EventType';
import NeverError from './NeverError';
import EventStage from './../model/event/EventStage';
import Utils from './Utils';
import PrizesConfiguration from './../configuration/PrizesConfiguration';
import User from './../model/user/User';
import ReplicasConfiguration from './../configuration/ReplicasConfiguration';
import ReplicaDao from './../dao/ReplicaDao';
export default class EventUtils {

    // private static staticEvents: EventInfo[] = [new EventInfo(EventType.lukoshko, Date.now(), Date.now() +  1000 * 25)];
    private static staticEvents: EventInfo[] = [];
    private static levelForStaticEvents = 15;

    private static levelForLukoshkoEvent = 24;

    public static updateEvents():EventType[]{
        
        let res: EventType[] = [];

        let user = UserService.getUser();
        for(let i=0; i<user.getEvents().length; i++){
            let event = user.getEvents()[i];
            if(EventUtils.getStage(event) == EventStage.expired){
                user.deleteEvent(event);
            }
        }

        //добавляем ивенты из конфигурации
        if(user.getCurrentForest() >= this.levelForStaticEvents){
            let existingTypes = user.getEvents().map(e => e.eventType); 
            this.staticEvents.forEach(e => {
                if(EventUtils.getStage(e) == EventStage.active && existingTypes.indexOf(e.eventType) == -1){
                    user.addEvent(e);
                    res.push(e.eventType);
                }
            })
        }

        //добавляем динамические ивенты
        if(this.canStartFirstLukoshkoEvent(user)){
            user.addMarker("firstLukoshko");
            let e = new EventInfo(EventType.lukoshko, Date.now(), Date.now() +  1000 * 60*60*24);
            user.addEvent(e);
            res.push(e.eventType);
            user.setWinsInRow(0);
        }

        return res;
    }

    private static canStartFirstLukoshkoEvent(user:User):boolean {
        let havePrizes = PrizesConfiguration.allPrizes.filter(p => p.level == "" + user.getCurrentForest()).length > 0;
        let haveReplicas = ReplicaDao.getEntity().getAll().filter(r => r.context.level == user.getCurrentForest()).length > 0;
        let alreadyParticipated = user.getMarkers().indexOf("firstLukoshko") != -1;

        return !havePrizes && !haveReplicas && !alreadyParticipated && user.getCurrentForest() > this.levelForLukoshkoEvent;
    }

    public static getActualEvents():EventInfo[]{
        let user = UserService.getUser();
        return user.getEvents().filter(e => EventUtils.isActual(e));
    }
    
    public static isActual(e:EventInfo):boolean{
        return EventUtils.getStage(e) != EventStage.inactive && EventUtils.getStage(e) != EventStage.expired;
    }

    public static getStage(event: EventInfo):EventStage{
        if(event.prizeTakingEndAt && event.eventEndAt < Date.now() && event.prizeTakingEndAt > Date.now()){
            return EventStage.prizeTaking;
        } else if(event.eventStartAt < Date.now() && event.eventEndAt > Date.now()){
            return EventStage.active;
        } else if (event.eventStartAt > Date.now()) {
            return EventStage.inactive;
        } else {
            return EventStage.expired;
        }
    }

    public static getIcon(eventType:EventType):string{
        switch(eventType){
            case EventType.lukoshko: 
                return "lukoshkoIcon2";
            default:
                throw new NeverError(eventType);
        }
    }

    public static getMainImage(eventType:EventType):string{
        switch(eventType){
            case EventType.lukoshko: 
                return "lukoshkoHeader";
            default:
                throw new NeverError(eventType);
        }
    }

    public static getName(eventType:EventType):string{
        switch(eventType){
            case EventType.lukoshko: 
                return "Волшебное лукошко";
            default:
                throw new NeverError(eventType);
        }
    }

    public static getDesc(eventType:EventType):string{
        switch(eventType){
            case EventType.lukoshko: 
                return "Выигрывайте уровни и \n ~получайте усиления~ на \n старте следующих уровней!";
            default:
                throw new NeverError(eventType);
        }
    }

    public static getRemainTimeShort(time: number):string{
        let diff = Math.max(0, time - Date.now());

        let seconds = Math.round(diff / 1000);
        let minutes = Math.round(seconds / 60);
        let hours = Math.round(minutes / 60);
        let days = Math.round(hours / 24);

        if(days > 0){
            return days + Utils.chooseRussianWord(days, " день", " дня", " дней");
        }

        if(hours > 0){
            return hours + Utils.chooseRussianWord(hours, " час", " часа", " часов");
        }

        if(minutes > 0){
            return minutes + " мин.";
        }

        return seconds + " сек.";
    }

    public static getRemainTime(time: number):string{
        let diff = Math.max(0, time - Date.now());

        let seconds = Math.floor(diff / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        if(days > 0){
            return days + "д. " + (hours - days * 24) + "ч.";
        }

        if(hours > 0){
            return hours + "ч. " + (minutes - hours * 60) + "м.";
        }

        if(minutes > 0){
            return minutes + "м. " + (seconds - minutes * 60) + "с.";
        }

        return seconds + " сек.";
    }

}
