export type EventAssetConfiguration = {
    key: string;
    path: string;
    atlasGroup?: string;
};

export type EventMainImageOverrideConfiguration = {
    levels: number[];
    mainImage: string;
    mainImageScale?: number;
    path?: string;
    atlasGroup?: string;
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
    mainImageAtlasGroup?: string;
    mainImageScale?: number;
    mainImageOverrides?: EventMainImageOverrideConfiguration[];
    assets?: EventAssetConfiguration[];
    previousEventId?: string;
    routeNames?: string[];
    routeColor?: number;
    finalReplicaId?: string;
    expiredReplicaId?: string;
};

export default class EventsConfiguration {

    public static allEvents: EventConfiguration[] = [
        {
            eventId: "event1",
            finalReplicaId: "event1_complete_8",
            name: "Гудящая долина",
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
                { key: "sideEvent1EventButton", path: "assets/sideEvent1/event_button.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FadeBottom", path: "assets/sideEvent1/event_fade_bottom.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FadeMiddle", path: "assets/sideEvent1/event_fade_middle(source).png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FadeTop", path: "assets/sideEvent1/event_fade_top.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FrameBottom", path: "assets/sideEvent1/event_frame_bottom.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FrameMiddle", path: "assets/sideEvent1/event_frame_middle (source).png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1FrameTop", path: "assets/sideEvent1/event_frame_top.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1PanelBottom", path: "assets/sideEvent1/event_panel_bottom.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1PanelClose", path: "assets/sideEvent1/event_panel_close.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1PanelRibbon", path: "assets/sideEvent1/event_panel_ribbon.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1Timer", path: "assets/sideEvent1/event_timer.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1MapBg", path: "assets/sideEvent1/map_bg.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1Map1", path: "assets/sideEvent1/map1.png", atlasGroup: "sideEvent1" },
                { key: "map1Shine", path: "assets/sideEvent1/map1Shine.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1Map2", path: "assets/sideEvent1/map2.png", atlasGroup: "sideEvent1" },
                { key: "map2Shine", path: "assets/sideEvent1/map2Shine.png", atlasGroup: "sideEvent1" },
                { key: "sideEvent1Map3", path: "assets/sideEvent1/map3.png", atlasGroup: "sideEvent1" },
                { key: "map3Shine", path: "assets/sideEvent1/map3Shine.png", atlasGroup: "sideEvent1" },
                { key: "bottleDecor", path: "assets/sideEvent1/bottleDecor.png", atlasGroup: "sideEvent1" },
                { key: "chestClosedDecor", path: "assets/sideEvent1/chestClosedDecor.png", atlasGroup: "sideEvent1" },
                { key: "chestOpenDecor", path: "assets/sideEvent1/chestOpenDecor.png", atlasGroup: "sideEvent1" },
                { key: "crossDecor", path: "assets/sideEvent1/crossDecor.png", atlasGroup: "sideEvent1" },
                { key: "honeyDecor", path: "assets/sideEvent1/honeyDecor.png", atlasGroup: "sideEvent1" },
                { key: "mapInHive", path: "assets/sideEvent1/mapInHive.png", atlasGroup: "sideEvent1" },
                { key: "shovelDecor", path: "assets/sideEvent1/shovelDecor.png", atlasGroup: "sideEvent1" },
                { key: "sova1", path: "assets/additional/characters/sova1.png", atlasGroup: "additional" },
                { key: "sova2", path: "assets/additional/characters/sova2.png", atlasGroup: "additional" },
                { key: "sova3", path: "assets/additional/characters/sova3.png", atlasGroup: "additional" }
            ]
        },
        {
            eventId: "event2",
            finalReplicaId: "event2_complete_5",
            expiredReplicaId: "event2_expired",
            name: "Пираты Тихой речки",
            description: "На плоту по карте Совёнка — к пиратскому кладу!",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 12,
            previousEventId: "event1",
            levelsCount: 25,
            icon: "boat",
            iconScale: 1.8,
            mainImage: "riverJourneyScene",
            mainImagePath: "assets/journeys/river.png",
            assets: [{ key: "pirateSveta", path: "assets/journeys/pirate.png" }],
            routeColor: 0x63d9ee,
            routeNames: ["Пиратская пристань","Верёвки для плота","Первый речной поворот","Камышовый рукав","Кувшинковый пролив","Письмо под корягой","Бутылочная почта","Заводь старого мельника","Запруда у колеса","Старая мельница","Песчаный причал","Жемчужная отмель","Речной тайник","Ивовая протока","Мост из корней","Швартовка у корней","Тихий водоворот","Карта течений","Светлячковый рукав","Остров фонарей","Ночной причал","Пиратские вехи","Последний крестик","Ключ от капитанского сундука","Сундук капитана"]
        },
        {
            eventId: "event3",
            finalReplicaId: "event3_complete_4",
            expiredReplicaId: "event3_expired",
            name: "Лес шепчущих шляп",
            description: "Пять говорящих грибов и тайна тёмного леса.",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 20,
            previousEventId: "event2",
            levelsCount: 25,
            icon: "witchMushroom",
            iconScale: 0.24,
            mainImage: "mushroomJourneyScene",
            mainImagePath: "assets/journeys/forest.png",
            assets: [{ key: "talkingMushroom", path: "assets/journeys/mushroom.png" }],
            routeColor: 0xc9a5ff,
            routeNames: ["Синяя шляпа","Листья с росой","Ручей под синей шляпой","Капли на мху","Роса для Синего","Рыжий ворчун","Шуршащие корни","Упрямые коряги","Рыжая просека","Корни Рыжего","Зелёный садовник","Моховые ступени","Сад под землёй","Свет по грибнице","Сад Зелёного","Лиловый соня","Сонные кувшинки","Лиловый туман","Лунные указатели","Луна для Лилового","Золотой хранитель","Пять корневых нитей","Золотая тропа","Песня под шляпой","Сердце грибницы"]
        },
        {
            eventId: "event4",
            finalReplicaId: "event4_complete_4",
            expiredReplicaId: "event4_expired",
            name: "Корона под горой",
            description: "Древний клад и слизень с короной внутри!",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 30,
            previousEventId: "event3",
            levelsCount: 25,
            icon: "key",
            iconScale: 0.24,
            mainImage: "dungeonJourneyScene",
            mainImagePath: "assets/journeys/dungeon.png",
            assets: [{ key: "slimeKeeper", path: "assets/journeys/slime.png" }],
            routeColor: 0xffce77,
            routeNames: ["Лестница под пнём","Пыльные ступени","Первый огонёк","Зал забытых фонарей","Кладовая фонарей","Сломанный подъёмник","Каменные затворы","Каменный лабиринт","Отражения в шахте","Шахта кристаллов","Кристальный мост","Подземная река","Переправа в темноте","Страж книжных полок","Архив короля","Забытый указ короля","Королевская печать","След из желе","Липкая галерея","Эхо Булька","Дверь сокровищницы","Преддверие сокровищницы","Золотой блик в желе","Хранитель Бульк","Корона в желе"]
        },
        {
            eventId: "event5",
            finalReplicaId: "event5_complete_4",
            expiredReplicaId: "event5_expired",
            name: "Луга под облаками",
            description: "На воздушном шаре — от поляны к поляне!",
            duration: 1000 * 60 * 60 * 24 * 3,
            startsatLevel: 40,
            previousEventId: "event4",
            levelsCount: 25,
            icon: "feather",
            iconScale: 0.55,
            mainImage: "balloonJourneyScene",
            mainImagePath: "assets/journeys/balloon.png",
            routeColor: 0xffa6c2,
            routeNames: ["Взлётная поляна","Запасы для корзины","Канаты и стропы","Ромашковый маяк","Ромашковая посадка","Новый порыв ветра","Попутный ветер","Тропа к лавандовому склону","Лавандовые террасы","Лавандовая посадка","Высота облаков","Облачный пролив","Ягодный ориентир","Корзина для пикника","Ягодная посадка","Вечерний поток","Сумеречный перелёт","Огоньки под облаками","К ночной поляне","Лунная посадка","Высота над колокольчиками","Попутный звон","Звонкий перевал","Последний букет","Праздник на лугу"]
        }
    ];

    public static getById(eventId: string): EventConfiguration | null {
        return this.allEvents.filter(event => event.eventId == eventId).shift() || null;
    }

    public static getAssetsById(eventId: string): EventAssetConfiguration[] {
        const event = this.getById(eventId);
        const assets = event && event.assets ? event.assets.slice() : [];
        // Journey panels share the existing event frame and story decorations.
        if (event && event.routeNames) {
            (this.allEvents[0].assets || []).forEach(asset => {
                if (!assets.some(existing => existing.key == asset.key)) assets.push(asset);
            });
        }
        return assets;
    }

    public static getOptionalAtlasGroups(): string[] {
        const result: string[] = [];
        const sharedAtlasGroups = ['base', 'basehq', 'additional', 'chapter1'];

        this.allEvents.forEach(event => {
            if (event.mainImageAtlasGroup && result.indexOf(event.mainImageAtlasGroup) == -1 && sharedAtlasGroups.indexOf(event.mainImageAtlasGroup) == -1) {
                result.push(event.mainImageAtlasGroup);
            }

            (event.mainImageOverrides || []).forEach(override => {
                if (override && override.atlasGroup && result.indexOf(override.atlasGroup) == -1 && sharedAtlasGroups.indexOf(override.atlasGroup) == -1) {
                    result.push(override.atlasGroup);
                }
            });

            (event.assets || []).forEach(asset => {
                if (asset && asset.atlasGroup && result.indexOf(asset.atlasGroup) == -1 && sharedAtlasGroups.indexOf(asset.atlasGroup) == -1) {
                    result.push(asset.atlasGroup);
                }
            });
        });
        return result;
    }

    public static getMainImageAssetById(eventId: string, levelNumber?: number): EventAssetConfiguration | null {
        const event = this.getById(eventId);
        if (!event) {
            return null;
        }

        const override = this.getMainImageOverride(event, levelNumber);
        if (override && override.mainImage && override.path) {
            return { key: override.mainImage, path: override.path, atlasGroup: override.atlasGroup };
        }

        if (event.mainImage && event.mainImagePath) {
            return { key: event.mainImage, path: event.mainImagePath, atlasGroup: event.mainImageAtlasGroup };
        }

        return null;
    }

    public static getAllMainImageAssetsById(eventId: string): EventAssetConfiguration[] {
        const event = this.getById(eventId);
        const result: EventAssetConfiguration[] = [];

        if (!event) {
            return result;
        }

        this.pushAsset(result, event.mainImage, event.mainImagePath, event.mainImageAtlasGroup);
        (event.mainImageOverrides || []).forEach(override => {
            this.pushAsset(result, override && override.mainImage, override && override.path, override && override.atlasGroup);
        });

        return result;
    }

    private static getMainImageOverride(event: EventConfiguration, levelNumber?: number): EventMainImageOverrideConfiguration | null {
        if (!event || !event.mainImageOverrides || event.mainImageOverrides.length == 0 || levelNumber == null) {
            return null;
        }

        return event.mainImageOverrides.filter(override => override && override.levels && override.levels.indexOf(levelNumber) != -1).shift() || null;
    }

    private static pushAsset(target: EventAssetConfiguration[], key: string, path: string, atlasGroup?: string): void {
        if (!key || !path || target.some(asset => asset.key == key)) {
            return;
        }

        target.push({ key: key, path: path, atlasGroup: atlasGroup });
    }
}
