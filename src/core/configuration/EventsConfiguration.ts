export type EventAssetConfiguration = {
    key: string;
    path: string;
};

export type EventConfiguration = {
    eventId: string;
    name: string;
    description: string;
    duration: number;
    startsatLevel: number;
    levelsCount?: number;
    icon?: string;
    iconScale?: number;
    mainImage?: string;
    mainImageScale?: number;
    assets?: EventAssetConfiguration[];
};

export default class EventsConfiguration {

    public static allEvents: EventConfiguration[] = [
        {
            eventId: "event1",
            name: "Лесной рейд",
            description: "15 особых лесных и горных уровней с медом и пчелами.",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 3,
            levelsCount: -1,
            icon: "tasks",
            iconScale: 0.817,
            mainImage: "sideEvent1tBg",
            mainImageScale: 0.62,
            assets: [
                { key: "sideEvent1tBg", path: "assets/sideEvent1/sideEvent1tBg.png" }
            ]
        }
    ];

    public static getById(eventId: string): EventConfiguration {
        return this.allEvents.filter(event => event.eventId == eventId).shift();
    }

    public static getAssetsById(eventId: string): EventAssetConfiguration[] {
        const event = this.getById(eventId);
        return event && event.assets ? event.assets : [];
    }
}
