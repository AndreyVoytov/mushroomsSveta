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
            mainImage: "sideEvent1EventImage",
            mainImageScale: 1,
            assets: [
                { key: "sideEvent1EventButton", path: "assets/sideEvent1/event_button.png" },
                { key: "sideEvent1FadeBottom", path: "assets/sideEvent1/event_fade_bottom.png" },
                { key: "sideEvent1FadeMiddle", path: "assets/sideEvent1/event_fade_middle(source).png" },
                { key: "sideEvent1FadeTop", path: "assets/sideEvent1/event_fade_top.png" },
                { key: "sideEvent1FrameBottom", path: "assets/sideEvent1/event_frame_bottom.png" },
                { key: "sideEvent1FrameMiddle", path: "assets/sideEvent1/event_frame_middle (source).png" },
                { key: "sideEvent1FrameTop", path: "assets/sideEvent1/event_frame_top.png" },
                { key: "sideEvent1EventImage", path: "assets/sideEvent1/event_image.png" },
                { key: "sideEvent1PanelBottom", path: "assets/sideEvent1/event_panel_bottom.png" },
                { key: "sideEvent1PanelClose", path: "assets/sideEvent1/event_panel_close.png" },
                { key: "sideEvent1PanelRibbon", path: "assets/sideEvent1/event_panel_ribbon.png" },
                { key: "sideEvent1Timer", path: "assets/sideEvent1/event_timer.png" },
                { key: "sideEvent1MapBg", path: "assets/sideEvent1/map_bg.png" },
                { key: "sideEvent1Map1", path: "assets/sideEvent1/map1.png" },
                { key: "sideEvent1Map2", path: "assets/sideEvent1/map2.png" },
                { key: "sideEvent1Map3", path: "assets/sideEvent1/map3.png" }
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
