import EventType from './EventType';
export default class EventInfo {
    eventStartAt:number;
    eventEndAt:number;
    prizeTakingEndAt?:number;
    eventType:EventType;
    eventId?:string;

    constructor(eventType:EventType, eventStartAt:number, eventEndAt:number,  prizeTakingEndAt?:number, eventId?:string){
        this.eventStartAt = eventStartAt;
        this.eventEndAt = eventEndAt;
        this.prizeTakingEndAt = prizeTakingEndAt;
        this.eventType = eventType;
        this.eventId = eventId;
    }
}
