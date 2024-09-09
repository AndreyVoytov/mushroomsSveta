import EventType from './EventType';
export default class EventInfo {
    eventStartAt:number;
    eventEndAt:number;
    prizeTakingEndAt?:number;
    eventType:EventType;

    constructor(eventType:EventType, eventStartAt:number, eventEndAt:number,  prizeTakingEndAt?:number){
        this.eventStartAt = eventStartAt;
        this.eventEndAt = eventEndAt;
        this.prizeTakingEndAt = prizeTakingEndAt;
        this.eventType = eventType;
    }
}