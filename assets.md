# Assets

Атласы собираются командой `npm run atlases` по конфигу `tools/atlas-groups.json`. Результат лежит в `assets/atlases`, а список групп генерируется в `src/generated/atlasManifest.ts`.

Текущие группы: `load`, `base`, `basehq`, `backpack`, `additional`, `chapter1`, `event1`, `sideEvent1`, `minigame1`...`minigame10`.

Загрузка: `load` используется в `BootSettings`, `base` и `basehq` грузятся на `LoadingScreen`, дополнительные группы выбираются в `BaseScreen.loadOptionalAtlases()`. `backpack` грузится лениво один раз через `HouseScreen.ensureBackpackAssetsLoaded()` перед открытием рюкзака.
