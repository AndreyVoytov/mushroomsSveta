export type EventAssetConfiguration = {
    key: string;
    path: string;
};

export type EventMainImageOverrideConfiguration = {
    levels: number[];
    mainImage: string;
    mainImageScale?: number;
    path?: string;
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
    mainImagePath?: string;
    mainImageScale?: number;
    mainImageOverrides?: EventMainImageOverrideConfiguration[];
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
            mainImage: "sideEvent1ScreenClover",
            mainImagePath: "assets/sideEvent1Screens/clover.png",
            mainImageScale: 1/1.4,
            mainImageOverrides: [
                {
                    levels: [4, 5],
                    mainImage: "sideEvent1ScreenCloverFlowers",
                    path: "assets/sideEvent1Screens/cloverFlowers.png"
                },
                {
                    levels: [6, 7],
                    mainImage: "sideEvent1ScreenCloverHive",
                    path: "assets/sideEvent1Screens/cloverHive.png"
                },
                {
                    levels: [8, 9, 10],
                    mainImage: "sideEvent1ScreenQueenHives",
                    path: "assets/sideEvent1Screens/queenHives.png"
                },
                {
                    levels: [11, 12, 13, 14, 15],
                    mainImage: "sideEvent1ScreenCloverMountines",
                    path: "assets/sideEvent1Screens/cloverMountines.png"
                }
            ],
            assets: [
                { key: "sideEvent1EventButton", path: "assets/sideEvent1/event_button.png" },
                { key: "sideEvent1FadeBottom", path: "assets/sideEvent1/event_fade_bottom.png" },
                { key: "sideEvent1FadeMiddle", path: "assets/sideEvent1/event_fade_middle(source).png" },
                { key: "sideEvent1FadeTop", path: "assets/sideEvent1/event_fade_top.png" },
                { key: "sideEvent1FrameBottom", path: "assets/sideEvent1/event_frame_bottom.png" },
                { key: "sideEvent1FrameMiddle", path: "assets/sideEvent1/event_frame_middle (source).png" },
                { key: "sideEvent1FrameTop", path: "assets/sideEvent1/event_frame_top.png" },
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

    public static getMainImageAssetById(eventId: string, levelNumber?: number): EventAssetConfiguration {
        const event = this.getById(eventId);
        if (!event) {
            return null;
        }

        const override = this.getMainImageOverride(event, levelNumber);
        if (override && override.mainImage && override.path) {
            return { key: override.mainImage, path: override.path };
        }

        if (event.mainImage && event.mainImagePath) {
            return { key: event.mainImage, path: event.mainImagePath };
        }

        return null;
    }

    public static getAllMainImageAssetsById(eventId: string): EventAssetConfiguration[] {
        const event = this.getById(eventId);
        const result: EventAssetConfiguration[] = [];

        if (!event) {
            return result;
        }

        this.pushAsset(result, event.mainImage, event.mainImagePath);
        (event.mainImageOverrides || []).forEach(override => {
            this.pushAsset(result, override && override.mainImage, override && override.path);
        });

        return result;
    }

    private static getMainImageOverride(event: EventConfiguration, levelNumber?: number): EventMainImageOverrideConfiguration {
        if (!event || !event.mainImageOverrides || event.mainImageOverrides.length == 0 || levelNumber == null) {
            return null;
        }

        return event.mainImageOverrides.filter(override => override && override.levels && override.levels.indexOf(levelNumber) != -1).shift();
    }

    private static pushAsset(target: EventAssetConfiguration[], key: string, path: string): void {
        if (!key || !path || target.some(asset => asset.key == key)) {
            return;
        }

        target.push({ key: key, path: path });
    }
}
