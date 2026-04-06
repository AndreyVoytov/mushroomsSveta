export type EventConfiguration = {
    eventId: string;
    name: string;
    description: string;
    duration: number;
    startsatLevel: number;
    levelsCount?: number;
};

export default class EventsConfiguration {

    public static allEvents: EventConfiguration[] = [
        {
            eventId: "event1",
            name: "Лесной рейд",
            description: "15 особых лесных и горных уровней с медом и пчелами.",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 3,
            levelsCount: -1
        }
    ];

    public static getById(eventId: string): EventConfiguration {
        return this.allEvents.filter(event => event.eventId == eventId).shift();
    }
}
