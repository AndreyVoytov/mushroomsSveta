# Итоговый список нового арта для расширения до 500 уровней

Ниже перечислен только новый арт для максимально проработанной версии расширения. Уже существующие изображения персонажей и предметов сюда не включены.

Предлагаемая структура путей:
- сюжетные фоны, крупные объекты и предметы новой ветки: `assets/chapter2/...`
- новые портреты персонажей: `assets/additional/characters/...`
- новые иллюстрации дневника и иконки карты: в существующие UI-папки `assets/base/ui/diary/...` и `assets/base/ui/map/...`
- новые наборы клеток биомов: `assets/base/hex/<biome>/...`

## 1. Новые персонажи

### 1.1. Ворон-архивариус

- `assets/additional/characters/ravenArchivist_neutral.png` — Нейтральный: сухой, внимательный хранитель маршрутов, сидит ровно, держит свиток или дощечку с заметками.
- `assets/additional/characters/ravenArchivist_annoyed.png` — Недовольный: нахмуренный, взъерошенные перья, клюв приоткрыт, поза как у того, кто устал исправлять чужие ошибки в дороге.
- `assets/additional/characters/ravenArchivist_explaining.png` — Довольный / объясняющий: оживлённый, одно крыло чуть поднято, показывает на карту или кристалл маршрута, ощущение умного проводника.

### 1.2. Выдра-мельничиха

- `assets/additional/characters/otterMiller_calm.png` — Спокойная: уверенная хозяйка запруды, в рабочем переднике, рядом инструменты или мешочек с мукой.
- `assets/additional/characters/otterMiller_working.png` — Рабочая / занятая: в движении, подтягивает рычаг, придерживает лопасть или проверяет механизм мельницы.
- `assets/additional/characters/otterMiller_happy.png` — Радостная: открытая улыбка, руки раскрыты, будто мельница снова заработала и вода пошла как нужно.

### 1.3. Барсучиха-травница

- `assets/additional/characters/badgerHerbalist_serious.png` — Серьёзная: собранная, с пучками трав, баночками или ступкой, образ знахарки, которая сразу видит, что нарушено в лесу.
- `assets/additional/characters/badgerHerbalist_surprised.png` — Удивлённая: лёгкое изумление, поднятые брови, в лапе редкий росток или светящаяся колба.
- `assets/additional/characters/badgerHerbalist_kind.png` — Добрая: мягкая улыбка, протягивает лекарство, фонарь или травяной свёрток, ощущение заботы и надёжности.

### 1.4. Мотылёк-фонарщик

- `assets/additional/characters/mothLamplighter_idle.png` — Обычный: хрупкий лесной помощник с небольшим ручным фонариком или светящейся пыльцой на крыльях.
- `assets/additional/characters/mothLamplighter_glow.png` — Светящийся: крылья и фонарь ярко подсвечены, вокруг тёплый ореол, образ проводника по тёмным дорожкам.

### 1.5. Морок Забвения

- `assets/additional/characters/fogOfForgetfulness_weak.png` — Слабый: полупрозрачный клубящийся силуэт, почти как туманное пятно с редкими искрами.
- `assets/additional/characters/fogOfForgetfulness_active.png` — Активный: плотный, вытянутый, с закручивающимися лентами дыма, ощущение, что он стирает следы и знаки.
- `assets/additional/characters/fogOfForgetfulness_dissolve.png` — Растворяющийся: разорванный на клочья тумана, свет пробивается сквозь него, образ ухода угрозы без прямой битвы.

## 2. Новые локации и объектные наборы

Для каждой локации ниже указан путь основного фона и пути отдельных крупных объектных спрайтов, которые лучше готовить как самостоятельные PNG без фона.

### 2.1. Снежный перевал

- `assets/chapter2/snowPass/bg.png` — Основной фон: высокий продуваемый перевал на пути к Хозяйке; узкая дорога между снежными склонами, вьюга, следы старых дорожных знаков, ощущение первой большой границы после обычного леса.
- `assets/chapter2/snowPass/passArch.png` — Дорожная арка перевала: старая деревянная или корневая арка с подвесками, наполовину занесённая снегом.
- `assets/chapter2/snowPass/waymarker.png` — Веха с указателем: столб с резными направлениями, колокольчиками и обледеневшими ленточками.
- `assets/chapter2/snowPass/snowDriftSign.png` — Сугроб с полузасыпанным знаком: большой снежный ком с выглядывающим символом дороги.
- `assets/chapter2/snowPass/watchBrazier.png` — Сторожевой костёр или жаровня: низкий тёплый огонь на ветру, визуальная точка уюта в холодной сцене.

### 2.2. Хрустальный овраг

- `assets/chapter2/crystalRavine/bg.png` — Основной фон: глубокий овраг с россыпью кристаллов, светящимися жилами и дорожными следами, будто память о маршрутах застыла прямо в камне.
- `assets/chapter2/crystalRavine/routeCrystalCluster.png` — Глыба кристаллов маршрута: крупный кластер, который можно использовать как сюжетный акцент.
- `assets/chapter2/crystalRavine/brokenSignpost.png` — Разбитый указатель с кристальными осколками: старый дорожный знак, вросший в блестящую породу.
- `assets/chapter2/crystalRavine/crystalBridge.png` — Подвесной кристальный мостик: короткий переход через трещину, может работать как объект переднего плана.
- `assets/chapter2/crystalRavine/crystalDebris.png` — Куча светящихся обломков: рассыпанные фрагменты, намёк на разрушенную систему путей.

### 2.3. Ледяная обсерватория

- `assets/chapter2/iceObservatory/bg.png` — Основной фон: старая северная башня-обсерватория с треснувшим куполом, ледяными линзами и механизмами, где когда-то отслеживали небесные маршруты.
- `assets/chapter2/iceObservatory/telescope.png` — Большая подзорная труба: тяжёлая, покрытая инеем труба на подставке.
- `assets/chapter2/iceObservatory/astralRing.png` — Астрономический круг: замёрзший диск с метками, звёздами и маршрутными символами.
- `assets/chapter2/iceObservatory/domeShard.png` — Осколок купола или линзы: крупный стеклянно-ледяной фрагмент для сюжетной сцены.
- `assets/chapter2/iceObservatory/orreryMechanism.png` — Механизм оррерии: шестерни и кольца с ледяной коркой, намёк на древнюю навигацию.

### 2.4. Корневая тропа

- `assets/chapter2/rootRoad/bg.png` — Основной фон: широкая дорога из гигантских корней, уходящая под землю и снова выходящая к свету; ощущение, что сам лес прокладывает путь.
- `assets/chapter2/rootRoad/rootArch.png` — Корневая арка: переплетённые корни, образующие естественные ворота.
- `assets/chapter2/rootRoad/lanternPedestal.png` — Площадка для корневого фонаря: пень или камень с выемкой под ключевой светильник.
- `assets/chapter2/rootRoad/roadKnot.png` — Узел дорог: разветвление толстых корней с дорожными метками и подвесками.
- `assets/chapter2/rootRoad/rootBridge.png` — Корневой мостик: изогнутый настил из живых корней через провал.

### 2.5. Ночная оранжерея

- `assets/chapter2/nightGreenhouse/bg.png` — Основной фон: стеклянная лесная оранжерея под ночным небом, внутри светятся травы, сосуды с росой и тонкие тропинки между грядками.
- `assets/chapter2/nightGreenhouse/herbShelf.png` — Стеллаж с лечебными травами: полки с горшками, баночками и сушёными пучками.
- `assets/chapter2/nightGreenhouse/hangingGlassLantern.png` — Подвесной стеклянный фонарь: мягкий свет, который можно использовать как важный фокус.
- `assets/chapter2/nightGreenhouse/herbalistTable.png` — Стол травницы: рабочий стол с ножичком, ступкой, лентами и колбами.
- `assets/chapter2/nightGreenhouse/lianaCurtain.png` — Завеса из лиан: густая зелёная штора, через которую можно делать эффект входа в глубину сцены.

### 2.6. Лунная пристань

- `assets/chapter2/moonPier/bg.png` — Основной фон: тихая пристань над тёмной водой с лунными бликами, тонкими сваями, мокрыми досками и подвешенными фонарями для ночной переправы.
- `assets/chapter2/moonPier/moonLanternPost.png` — Лунный фонарь на стойке: вытянутый светильник с холодным серебристым свечением.
- `assets/chapter2/moonPier/mooringPost.png` — Причальная тумба с верёвками: крупный переднеплановый объект для оформления края сцены.
- `assets/chapter2/moonPier/ferryBoat.png` — Маленький паром или лодка: рабочая лодка для доставки, без экипажа.
- `assets/chapter2/moonPier/borisDeliveryCrate.png` — Короб для доставки Бориса: заметный грузовой ящик с печатью и ремнями.

### 2.7. Гнёзда совиной почты

- `assets/chapter2/owlPostNests/bg.png` — Основной фон: высокая система платформ, гнёзд и почтовых опор среди деревьев, где письма и посылки идут по канатам и подвесам.
- `assets/chapter2/owlPostNests/postNestHub.png` — Большое гнездо-почтамт: центральная платформа с мешками, верёвками и знаками маршрутов.
- `assets/chapter2/owlPostNests/owlPostSign.png` — Указатель совиной почты: столб со стрелками и значками направлений.
- `assets/chapter2/owlPostNests/hangingMailBasket.png` — Подвесная почтовая корзина: транспортная корзина на канате для писем и маленьких грузов.
- `assets/chapter2/owlPostNests/mailCells.png` — Ряд почтовых трубок или ячеек: связка адресных секций для фона и переднего плана.

### 2.8. Мельничная запруда

- `assets/chapter2/millBackwater/bg.png` — Основной фон: старая мельница у широкой запруды, вода темнеет от глубины, колёса, створки и мостки показывают, что место давно работает на лесные дороги.
- `assets/chapter2/millBackwater/millWheel.png` — Мельничное колесо: крупное колесо с мокрыми лопастями, ключевой сюжетный объект.
- `assets/chapter2/millBackwater/sluiceGate.png` — Шлюзовая створка: тяжёлый механизм, который можно показывать закрытым или приоткрытым.
- `assets/chapter2/millBackwater/millerWorkbench.png` — Рабочий стол мельничихи: инструменты, верёвки, деревянные клинья, детали механизма.
- `assets/chapter2/millBackwater/sacksAndCrates.png` — Мешки и ящики у воды: бытовой набор, усиливающий ощущение живого рабочего места.

### 2.9. Мшистый амфитеатр

- `assets/chapter2/mossAmphitheater/bg.png` — Основной фон: природный круглый амфитеатр из камней, корней и мха, место для встреч, примирения и общего воспоминания о пути.
- `assets/chapter2/mossAmphitheater/memoryStone.png` — Центральный камень памяти: заметный валун или плита в центре круга.
- `assets/chapter2/mossAmphitheater/mossSteps.png` — Мшистые ступени: отдельный модульный блок сидений или уступов.
- `assets/chapter2/mossAmphitheater/lanternGarland.png` — Подвесные гирлянды фонариков: мягкий праздничный свет для подготовки финала.
- `assets/chapter2/mossAmphitheater/rootStage.png` — Низкая сцена из корней и досок: площадка, на которой можно строить финальную композицию.

### 2.10. Ярмарка у избушки

- `assets/chapter2/fairByTheHut/bg.png` — Основной фон: праздничная поляна у избушки Хозяйки, украшенная флажками, фонарями, лавками и длинными столами; это уже не тревожная локация, а место общего сбора.
- `assets/chapter2/fairByTheHut/fairArch.png` — Ярмарочная арка: вход с лентами, вывесками и цветными тканями.
- `assets/chapter2/fairByTheHut/fairStall.png` — Торговая лавка или стол: универсальный праздничный модуль для расстановки персонажей и реквизита.
- `assets/chapter2/fairByTheHut/fairFlags.png` — Флажки и гирлянды: длинные декоративные подвесы для сцены и интерфейсных ивентов.
- `assets/chapter2/fairByTheHut/festivalLampPost.png` — Праздничный столб с фонарями: вертикальный акцент для центра или края композиции.

## 3. Сюжетные предметы и отдельный декор

Это самостоятельные изображения, которые нужны не как часть фона, а как отдельные сюжетные объекты, иконки дневника или элементы сцен.

- `assets/chapter2/items/roadKey.png` — Ключ дорог: старый резной ключ, связанный с восстановлением путей; должен выглядеть не бытовым, а почти ритуальным.
- `assets/chapter2/items/mapSeed.png` — Карта-семя: живое зерно-карта с прожилками, из которого буквально может прорасти дорога.
- `assets/chapter2/items/rootLantern.png` — Корневой фонарь: тёплый лесной светильник, собранный из корня, стекла и мягкого янтарного света.
- `assets/chapter2/items/owlPostBag.png` — Почтовая сумка совиной почты: плотная сумка с застёжками, ярлыками и следами долгих перелётов.
- `assets/chapter2/items/routeCrystal.png` — Кристалл маршрута: вытянутый кристалл с внутренним свечением и знаками направлений.
- `assets/chapter2/items/observatoryShard.png` — Осколок обсерватории: крупный осколок линзы или небесного механизма, важный сюжетный фрагмент.
- `assets/chapter2/items/roadSeal.png` — Дорожная печать: круглая печать или жетон, которым подтверждают восстановление пути.
- `assets/chapter2/items/owlPostSign_item.png` — Указатель совиной почты: отдельная чистая версия указателя для сцен, интерфейсных вставок и дневника.
- `assets/chapter2/items/moonLantern_item.png` — Лунный фонарь: самостоятельная версия холодного серебристого светильника без стойки.
- `assets/chapter2/items/fairFlags_bundle.png` — Ярмарочные флажки: отдельная декоративная связка из ткани для сцены и финального праздника.
- `assets/chapter2/items/festivalGarland.png` — Праздничная гирлянда: более тёплая и уютная версия декора с огоньками или маленькими фонариками.
- `assets/chapter2/items/borisDeliveryCrate_item.png` — Короб для доставки Бориса: отдельная чистая версия грузового ящика с печатями и ремнями.

## 4. Дневник, карта и UI

### 4.1. Иллюстрации для дневника

- `assets/base/ui/diary/story500_snowPassEntry.png` — Подъём на Снежный перевал: Борис выходит к первой большой снежной дороге.
- `assets/base/ui/diary/story500_roadKeyEntry.png` — Находка ключа дорог: момент, где тема утраченных маршрутов становится явной.
- `assets/base/ui/diary/story500_ravenArchivistEntry.png` — Встреча с вороном-архивариусом: сцена чтения старых заметок и карт.
- `assets/base/ui/diary/story500_owlPostEntry.png` — Гнёзда совиной почты: оживлённая верхняя почтовая дорога среди деревьев.
- `assets/base/ui/diary/story500_millWheelEntry.png` — Запуск мельничного колеса: восстановление одного из трёх ключевых якорей пути.
- `assets/base/ui/diary/story500_rootLanternEntry.png` — Зажигание корневого фонаря: тёплая камерная сцена в корневой тропе.
- `assets/base/ui/diary/story500_observatoryFogEntry.png` — Обсерватория и Морок Забвения: тревожная сцена с угрозой стирания памяти.
- `assets/base/ui/diary/story500_mapSeedReturnEntry.png` — Возвращение карты-семени: момент перед финальным соединением дорог.
- `assets/base/ui/diary/story500_finalSpread.png` — Финальный разворот дневника: общая праздничная сцена после восстановления путей, уже без тревоги.

### 4.2. Мини-иконки для карты

- `assets/base/ui/map/story500_snowPass.png` — Снежный перевал: компактный значок заснеженной арки или вершины.
- `assets/base/ui/map/story500_iceObservatory.png` — Ледяная обсерватория: силуэт башни с линзой или куполом.
- `assets/base/ui/map/story500_nightGreenhouse.png` — Ночная оранжерея: маленький стеклянный павильон с подсветкой.
- `assets/base/ui/map/story500_moonPier.png` — Лунная пристань: пирс с фонарём и водой.
- `assets/base/ui/map/story500_fairByTheHut.png` — Ярмарка у избушки: яркий праздничный знак с флажками.

### 4.3. UI и событийные иллюстрации

- `assets/chapter2/ui/chapter500Splash.png` — Chapter / event splash: крупная обложка нового сюжетного блока, лучше строить её на переходе в снежную дугу и теме восстановления дорог.
- `assets/chapter2/ui/icons/roadKeySmall.png` — Маленькая иконка ключа дорог.
- `assets/chapter2/ui/icons/mapSeedSmall.png` — Маленькая иконка карты-семени.
- `assets/chapter2/ui/icons/rootLanternSmall.png` — Маленькая иконка корневого фонаря.
- `assets/chapter2/ui/icons/routeCrystalSmall.png` — Маленькая иконка кристалла маршрута.
- `assets/chapter2/ui/icons/owlPostBagSmall.png` — Маленькая иконка почтовой сумки.
- `assets/chapter2/ui/finalFestival.png` — Иллюстрация финального праздника: отдельная полноформатная картинка для завершения арки; это не фон локации, а постановочная сцена с персонажами и декором.

## 5. Новые наборы клеток по биомам

Важное уточнение по клеткам: в текущей игре одна клетка обычно собирается не из одной картинки, а из нескольких слоёв.
- Нижний слой: `cover` / `hex`-подложка.
- Верхний слой: `surface` / `leaf`-рисунок конкретного биома.
- Для закрытой клетки отдельно существует тёмная версия верхнего слоя и отдельная тёмная подложка.
- Рамки, блокировки, настилы и мелкий декор — это отдельные спрайты поверх клетки.

Ниже список переписан именно в таком разрезе. Теперь у каждого нового файла один конкретный вдохновитель, а не два сразу.

### 5.1. Морозный хребет

Подложки:
- `assets/base/hex/frostRidge/coverForest.png` — нижняя подложка лесной клетки. (`вдохновитель: assets/base/hex/hex.png`)
- `assets/base/hex/frostRidge/coverMountain.png` — нижняя подложка горной клетки. (`вдохновитель: assets/base/hex/hexMountain.png`)
- `assets/base/hex/frostRidge/coverWater.png` — нижняя подложка водной клетки. (`вдохновитель: assets/base/hex/hexWater.png`)
- `assets/base/hex/frostRidge/coverSand.png` — нижняя подложка тропы / песчаной клетки. (`вдохновитель: assets/base/hex/hexSand.png`)
- `assets/base/hex/frostRidge/coverBerry.png` — нижняя подложка ягодной клетки. (`вдохновитель: assets/base/hex/hexFlower.png`)

Верхние поверхности:
- `assets/base/hex/frostRidge/surfaceForest.png` — верхний снежный рисунок лесной клетки. (`вдохновитель: assets/base/hex/leaf1.png`)
- `assets/base/hex/frostRidge/surfaceForestDark.png` — тёмная версия снежной лесной поверхности. (`вдохновитель: assets/base/hex/leaf1g.png`)
- `assets/base/hex/frostRidge/surfaceMountain.png` — верхний рисунок ледяного уступа. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/frostRidge/surfaceMountainDark.png` — тёмная версия ледяного уступа. (`вдохновитель: assets/base/hex/mountG.png`)
- `assets/base/hex/frostRidge/surfaceWater.png` — верхний рисунок полыньи или треснувшего льда. (`вдохновитель: assets/base/hex/drop.png`)
- `assets/base/hex/frostRidge/surfaceWaterDark.png` — тёмная версия ледяной воды. (`вдохновитель: assets/base/hex/dropG.png`)
- `assets/base/hex/frostRidge/surfaceSand.png` — верхний рисунок наста или снежной осыпи. (`вдохновитель: assets/base/hex/sandPyramid.png`)
- `assets/base/hex/frostRidge/surfaceSandDark.png` — тёмная версия снежной тропы. (`вдохновитель: assets/base/hex/sandPyramidG.png`)
- `assets/base/hex/frostRidge/surfaceBerry.png` — верхний рисунок замёрзшей ягодной клетки. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/frostRidge/surfaceBerryDark.png` — тёмная версия ягодной клетки. (`вдохновитель: assets/base/hex/pinkFlowerG.png`)

Закрытие и рамки:
- `assets/base/hex/frostRidge/coverDark.png` — тёмная подложка закрытой клетки. (`вдохновитель: assets/base/hex/hexDark.png`)
- `assets/base/hex/frostRidge/framePrimary.png` — рамка для forest / mountain / berry клеток. (`вдохновитель: assets/base/hex/hexFrame.png`)
- `assets/base/hex/frostRidge/frameWet.png` — рамка для water / sand клеток. (`вдохновитель: assets/base/hex/hexFrame2.png`)
- `assets/base/hex/frostRidge/coldOverlay.png` — ледяная корка поверх клетки. (`вдохновитель: assets/base/hex/cold.png`)

Блокировки и переходы:
- `assets/base/hex/frostRidge/forestBlock1.png` — лесная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/frostRidge/forestBlock2.png` — лесная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/frostRidge/forestBlock3.png` — лесная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/frostRidge/mountainBlock1.png` — горная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/frostRidge/mountainBlock2.png` — горная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/frostRidge/mountainBlock3.png` — горная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/frostRidge/plank1.png` — настил / переход, стадия 1. (`вдохновитель: assets/base/items/plank1.png`)
- `assets/base/hex/frostRidge/plank2.png` — настил / переход, стадия 2. (`вдохновитель: assets/base/items/plank2.png`)
- `assets/base/hex/frostRidge/plank3.png` — настил / переход, стадия 3. (`вдохновитель: assets/base/items/plank3.png`)

Малый декор и препятствия:
- `assets/base/hex/frostRidge/decorIceSpikes.png` — ледяные шипы или сосульки. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/frostRidge/decorSnowBranch.png` — заметённая снегом ветка или бревно. (`вдохновитель: assets/base/items/environment/log.png`)
- `assets/base/hex/frostRidge/decorWayFlag.png` — маленькая веха или ленточка. (`вдохновитель: assets/base/ui/map/mapPointer.png`)
- `assets/base/hex/frostRidge/obstacleFrozenRoadSign.png` — обледеневший дорожный знак. (`вдохновитель: assets/base/ui/map/aim.png`)
- `assets/base/hex/frostRidge/obstacleSupplyBag.png` — снежный мешок с припасами. (`вдохновитель: assets/chapter1/forest/flour.png`)

### 5.2. Хрустальная осыпь

Подложки:
- `assets/base/hex/crystalScree/coverForest.png` — нижняя подложка лесной клетки. (`вдохновитель: assets/base/hex/hex.png`)
- `assets/base/hex/crystalScree/coverMountain.png` — нижняя подложка горной клетки. (`вдохновитель: assets/base/hex/hexMountain.png`)
- `assets/base/hex/crystalScree/coverWater.png` — нижняя подложка водной клетки. (`вдохновитель: assets/base/hex/hexWater.png`)
- `assets/base/hex/crystalScree/coverSand.png` — нижняя подложка тропы / песчаной клетки. (`вдохновитель: assets/base/hex/hexSand.png`)
- `assets/base/hex/crystalScree/coverBerry.png` — нижняя подложка ягодной клетки. (`вдохновитель: assets/base/hex/hexFlower.png`)

Верхние поверхности:
- `assets/base/hex/crystalScree/surfaceForest.png` — тёмная почва с кристальной крошкой. (`вдохновитель: assets/base/hex/leaf4.png`)
- `assets/base/hex/crystalScree/surfaceForestDark.png` — тёмная версия лесной поверхности. (`вдохновитель: assets/base/hex/leaf4g.png`)
- `assets/base/hex/crystalScree/surfaceMountain.png` — гранёная кристальная плита. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/crystalScree/surfaceMountainDark.png` — тёмная версия кристальной плиты. (`вдохновитель: assets/base/hex/mountG.png`)
- `assets/base/hex/crystalScree/surfaceWater.png` — светящаяся вода между кристаллами. (`вдохновитель: assets/base/hex/drop.png`)
- `assets/base/hex/crystalScree/surfaceWaterDark.png` — тёмная версия кристальной воды. (`вдохновитель: assets/base/hex/dropG.png`)
- `assets/base/hex/crystalScree/surfaceSand.png` — кристальная осыпь / дорожка. (`вдохновитель: assets/base/hex/sandPyramid.png`)
- `assets/base/hex/crystalScree/surfaceSandDark.png` — тёмная версия осыпи. (`вдохновитель: assets/base/hex/sandPyramidG.png`)
- `assets/base/hex/crystalScree/surfaceBerry.png` — кристаллическая ягодная поверхность. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/crystalScree/surfaceBerryDark.png` — тёмная версия ягодной поверхности. (`вдохновитель: assets/base/hex/pinkFlowerG.png`)

Закрытие и рамки:
- `assets/base/hex/crystalScree/coverDark.png` — тёмная подложка закрытой клетки. (`вдохновитель: assets/base/hex/hexDark.png`)
- `assets/base/hex/crystalScree/framePrimary.png` — рамка для forest / mountain / berry клеток. (`вдохновитель: assets/base/hex/hexFrame.png`)
- `assets/base/hex/crystalScree/frameWet.png` — рамка для water / sand клеток. (`вдохновитель: assets/base/hex/hexFrame2.png`)
- `assets/base/hex/crystalScree/coldOverlay.png` — стеклянно-ледяная плёнка. (`вдохновитель: assets/base/hex/cold.png`)

Блокировки и переходы:
- `assets/base/hex/crystalScree/forestBlock1.png` — лесная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/crystalScree/forestBlock2.png` — лесная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/crystalScree/forestBlock3.png` — лесная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/crystalScree/mountainBlock1.png` — горная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/crystalScree/mountainBlock2.png` — горная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/crystalScree/mountainBlock3.png` — горная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/crystalScree/plank1.png` — настил / переход, стадия 1. (`вдохновитель: assets/base/items/plank1.png`)
- `assets/base/hex/crystalScree/plank2.png` — настил / переход, стадия 2. (`вдохновитель: assets/base/items/plank2.png`)
- `assets/base/hex/crystalScree/plank3.png` — настил / переход, стадия 3. (`вдохновитель: assets/base/items/plank3.png`)

Малый декор и препятствия:
- `assets/base/hex/crystalScree/decorCrystalShard.png` — мелкий кристальный осколок. (`вдохновитель: assets/base/items/amber2.png`)
- `assets/base/hex/crystalScree/decorReflectorPost.png` — отражающий столбик или маркер. (`вдохновитель: assets/base/ui/map/aimFourth.png`)
- `assets/base/hex/crystalScree/decorCrystalDust.png` — кристальная пыль. (`вдохновитель: assets/base/particles/dustBlue.png`)
- `assets/base/hex/crystalScree/obstacleBrokenRouteCrystal.png` — расколотый кристалл маршрута. (`вдохновитель: assets/base/items/amber3.png`)
- `assets/base/hex/crystalScree/obstacleLensShard.png` — обломок линзы. (`вдохновитель: assets/chapter1/darkForest/monocle.png`)

### 5.3. Болотный мох

Подложки:
- `assets/base/hex/bogMoss/coverForest.png` — нижняя подложка лесной клетки. (`вдохновитель: assets/base/hex/hex.png`)
- `assets/base/hex/bogMoss/coverMountain.png` — нижняя подложка горной клетки. (`вдохновитель: assets/base/hex/hexMountain.png`)
- `assets/base/hex/bogMoss/coverWater.png` — нижняя подложка водной клетки. (`вдохновитель: assets/base/hex/hexWater.png`)
- `assets/base/hex/bogMoss/coverSand.png` — нижняя подложка тропы / песчаной клетки. (`вдохновитель: assets/base/hex/hexSand.png`)
- `assets/base/hex/bogMoss/coverBerry.png` — нижняя подложка ягодной клетки. (`вдохновитель: assets/base/hex/hexFlower.png`)

Верхние поверхности:
- `assets/base/hex/bogMoss/surfaceForest.png` — мшистая лесная поверхность. (`вдохновитель: assets/base/hex/leaf3.png`)
- `assets/base/hex/bogMoss/surfaceForestDark.png` — тёмная версия мшистой поверхности. (`вдохновитель: assets/base/hex/leaf3g.png`)
- `assets/base/hex/bogMoss/surfaceMountain.png` — торфяной бугор или коряга. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/bogMoss/surfaceMountainDark.png` — тёмная версия болотного бугра. (`вдохновитель: assets/base/hex/mountG.png`)
- `assets/base/hex/bogMoss/surfaceWater.png` — вязкая болотная вода. (`вдохновитель: assets/base/hex/drop.png`)
- `assets/base/hex/bogMoss/surfaceWaterDark.png` — тёмная версия болотной воды. (`вдохновитель: assets/base/hex/dropG.png`)
- `assets/base/hex/bogMoss/surfaceSand.png` — сырой ил / утоптанная тропа. (`вдохновитель: assets/base/hex/sandPyramid.png`)
- `assets/base/hex/bogMoss/surfaceSandDark.png` — тёмная версия болотной тропы. (`вдохновитель: assets/base/hex/sandPyramidG.png`)
- `assets/base/hex/bogMoss/surfaceBerry.png` — клюквенная / ягодная поверхность. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/bogMoss/surfaceBerryDark.png` — тёмная версия ягодной поверхности. (`вдохновитель: assets/base/hex/pinkFlowerG.png`)

Закрытие и рамки:
- `assets/base/hex/bogMoss/coverDark.png` — тёмная подложка закрытой клетки. (`вдохновитель: assets/base/hex/hexDark.png`)
- `assets/base/hex/bogMoss/framePrimary.png` — рамка для forest / mountain / berry клеток. (`вдохновитель: assets/base/hex/hexFrame.png`)
- `assets/base/hex/bogMoss/frameWet.png` — рамка для water / sand клеток. (`вдохновитель: assets/base/hex/hexFrame2.png`)
- `assets/base/hex/bogMoss/coldOverlay.png` — тонкая подмёрзшая плёнка. (`вдохновитель: assets/base/hex/cold.png`)

Блокировки и переходы:
- `assets/base/hex/bogMoss/forestBlock1.png` — лесная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/bogMoss/forestBlock2.png` — лесная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/bogMoss/forestBlock3.png` — лесная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/bogMoss/mountainBlock1.png` — горная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/bogMoss/mountainBlock2.png` — горная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/bogMoss/mountainBlock3.png` — горная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/bogMoss/plank1.png` — настил / переход, стадия 1. (`вдохновитель: assets/base/items/plank1.png`)
- `assets/base/hex/bogMoss/plank2.png` — настил / переход, стадия 2. (`вдохновитель: assets/base/items/plank2.png`)
- `assets/base/hex/bogMoss/plank3.png` — настил / переход, стадия 3. (`вдохновитель: assets/base/items/plank3.png`)

Малый декор и препятствия:
- `assets/base/hex/bogMoss/decorReedClump.png` — камышовый пучок. (`вдохновитель: assets/base/items/environment/wlilly1.png`)
- `assets/base/hex/bogMoss/decorMushroomPatch.png` — болотные грибы. (`вдохновитель: assets/base/items/mushroom3.png`)
- `assets/base/hex/bogMoss/decorBubblePatch.png` — пузырьки и всплески. (`вдохновитель: assets/base/particles/splashG.png`)
- `assets/base/hex/bogMoss/obstacleMiniSluiceGate.png` — мини-заслонка запруды. (`вдохновитель: assets/chapter1/forest/watermill.png`)
- `assets/base/hex/bogMoss/obstacleFlourBag.png` — мешок с мукой или мельничная деталь. (`вдохновитель: assets/chapter1/forest/flour.png`)

### 5.4. Ночной сад

Подложки:
- `assets/base/hex/nightGarden/coverForest.png` — нижняя подложка лесной клетки. (`вдохновитель: assets/base/hex/hex.png`)
- `assets/base/hex/nightGarden/coverMountain.png` — нижняя подложка горной клетки. (`вдохновитель: assets/base/hex/hexMountain.png`)
- `assets/base/hex/nightGarden/coverWater.png` — нижняя подложка водной клетки. (`вдохновитель: assets/base/hex/hexWater.png`)
- `assets/base/hex/nightGarden/coverSand.png` — нижняя подложка тропы / песчаной клетки. (`вдохновитель: assets/base/hex/hexSand.png`)
- `assets/base/hex/nightGarden/coverBerry.png` — нижняя подложка ягодной клетки. (`вдохновитель: assets/base/hex/hexFlower.png`)

Верхние поверхности:
- `assets/base/hex/nightGarden/surfaceForest.png` — ночная лесная почва со свечением. (`вдохновитель: assets/base/hex/leaf3.png`)
- `assets/base/hex/nightGarden/surfaceForestDark.png` — тёмная версия ночной лесной поверхности. (`вдохновитель: assets/base/hex/leaf3g.png`)
- `assets/base/hex/nightGarden/surfaceMountain.png` — плитка / клумба оранжереи. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/nightGarden/surfaceMountainDark.png` — тёмная версия плитки / клумбы. (`вдохновитель: assets/base/hex/mountG.png`)
- `assets/base/hex/nightGarden/surfaceWater.png` — канал или лужа с отражением. (`вдохновитель: assets/base/hex/drop.png`)
- `assets/base/hex/nightGarden/surfaceWaterDark.png` — тёмная версия воды. (`вдохновитель: assets/base/hex/dropG.png`)
- `assets/base/hex/nightGarden/surfaceSand.png` — садовая дорожка. (`вдохновитель: assets/base/hex/sandPyramid.png`)
- `assets/base/hex/nightGarden/surfaceSandDark.png` — тёмная версия дорожки. (`вдохновитель: assets/base/hex/sandPyramidG.png`)
- `assets/base/hex/nightGarden/surfaceBerry.png` — светящиеся ягоды / ночные цветы. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/nightGarden/surfaceBerryDark.png` — тёмная версия ягодной поверхности. (`вдохновитель: assets/base/hex/pinkFlowerG.png`)

Закрытие и рамки:
- `assets/base/hex/nightGarden/coverDark.png` — тёмная подложка закрытой клетки. (`вдохновитель: assets/base/hex/hexDark.png`)
- `assets/base/hex/nightGarden/framePrimary.png` — рамка для forest / mountain / berry клеток. (`вдохновитель: assets/base/hex/hexFrame.png`)
- `assets/base/hex/nightGarden/frameWet.png` — рамка для water / sand клеток. (`вдохновитель: assets/base/hex/hexFrame2.png`)
- `assets/base/hex/nightGarden/coldOverlay.png` — лунная роса / изморозь. (`вдохновитель: assets/base/hex/cold.png`)

Блокировки и переходы:
- `assets/base/hex/nightGarden/forestBlock1.png` — лесная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/nightGarden/forestBlock2.png` — лесная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/nightGarden/forestBlock3.png` — лесная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/nightGarden/mountainBlock1.png` — горная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/nightGarden/mountainBlock2.png` — горная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/nightGarden/mountainBlock3.png` — горная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/nightGarden/plank1.png` — настил / переход, стадия 1. (`вдохновитель: assets/base/items/plank1.png`)
- `assets/base/hex/nightGarden/plank2.png` — настил / переход, стадия 2. (`вдохновитель: assets/base/items/plank2.png`)
- `assets/base/hex/nightGarden/plank3.png` — настил / переход, стадия 3. (`вдохновитель: assets/base/items/plank3.png`)

Малый декор и препятствия:
- `assets/base/hex/nightGarden/decorGlowBud.png` — светящийся бутон. (`вдохновитель: assets/base/items/moonflower1.png`)
- `assets/base/hex/nightGarden/decorHangingPot.png` — маленький горшок или контейнер. (`вдохновитель: assets/base/action/pot1.png`)
- `assets/base/hex/nightGarden/decorPetalTrail.png` — дорожка лепестков. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/nightGarden/obstacleHerbCrate.png` — ящик с травами. (`вдохновитель: assets/base/scenario/room/chest/chestBox.png`)
- `assets/base/hex/nightGarden/obstacleGlassLantern.png` — переносной стеклянный фонарь. (`вдохновитель: assets/chapter1/attic/sphere1.png`)

### 5.5. Корневой лабиринт

Подложки:
- `assets/base/hex/rootMaze/coverForest.png` — нижняя подложка лесной клетки. (`вдохновитель: assets/base/hex/hex.png`)
- `assets/base/hex/rootMaze/coverMountain.png` — нижняя подложка горной клетки. (`вдохновитель: assets/base/hex/hexMountain.png`)
- `assets/base/hex/rootMaze/coverWater.png` — нижняя подложка водной клетки. (`вдохновитель: assets/base/hex/hexWater.png`)
- `assets/base/hex/rootMaze/coverSand.png` — нижняя подложка тропы / песчаной клетки. (`вдохновитель: assets/base/hex/hexSand.png`)
- `assets/base/hex/rootMaze/coverBerry.png` — нижняя подложка ягодной клетки. (`вдохновитель: assets/base/hex/hexFlower.png`)

Верхние поверхности:
- `assets/base/hex/rootMaze/surfaceForest.png` — корневая лесная поверхность. (`вдохновитель: assets/base/hex/leaf4.png`)
- `assets/base/hex/rootMaze/surfaceForestDark.png` — тёмная версия корневой лесной поверхности. (`вдохновитель: assets/base/hex/leaf4g.png`)
- `assets/base/hex/rootMaze/surfaceMountain.png` — камень или выступ, обвитый корнями. (`вдохновитель: assets/base/hex/mount.png`)
- `assets/base/hex/rootMaze/surfaceMountainDark.png` — тёмная версия корневого уступа. (`вдохновитель: assets/base/hex/mountG.png`)
- `assets/base/hex/rootMaze/surfaceWater.png` — подземная вода в корневом провале. (`вдохновитель: assets/base/hex/drop.png`)
- `assets/base/hex/rootMaze/surfaceWaterDark.png` — тёмная версия подземной воды. (`вдохновитель: assets/base/hex/dropG.png`)
- `assets/base/hex/rootMaze/surfaceSand.png` — сухая дорожка из коры и щепы. (`вдохновитель: assets/base/hex/sandPyramid.png`)
- `assets/base/hex/rootMaze/surfaceSandDark.png` — тёмная версия корневой тропы. (`вдохновитель: assets/base/hex/sandPyramidG.png`)
- `assets/base/hex/rootMaze/surfaceBerry.png` — ягодная / грибная корневая поверхность. (`вдохновитель: assets/base/hex/pinkFlower.png`)
- `assets/base/hex/rootMaze/surfaceBerryDark.png` — тёмная версия ягодной поверхности. (`вдохновитель: assets/base/hex/pinkFlowerG.png`)

Закрытие и рамки:
- `assets/base/hex/rootMaze/coverDark.png` — тёмная подложка закрытой клетки. (`вдохновитель: assets/base/hex/hexDark.png`)
- `assets/base/hex/rootMaze/framePrimary.png` — рамка для forest / mountain / berry клеток. (`вдохновитель: assets/base/hex/hexFrame.png`)
- `assets/base/hex/rootMaze/frameWet.png` — рамка для water / sand клеток. (`вдохновитель: assets/base/hex/hexFrame2.png`)
- `assets/base/hex/rootMaze/coldOverlay.png` — сырая корка / минеральный налёт. (`вдохновитель: assets/base/hex/cold.png`)

Блокировки и переходы:
- `assets/base/hex/rootMaze/forestBlock1.png` — лесная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/rootMaze/forestBlock2.png` — лесная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/rootMaze/forestBlock3.png` — лесная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/rootMaze/mountainBlock1.png` — горная блокировка, стадия 1. (`вдохновитель: assets/base/hex/liana.png`)
- `assets/base/hex/rootMaze/mountainBlock2.png` — горная блокировка, стадия 2. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/rootMaze/mountainBlock3.png` — горная блокировка, стадия 3. (`вдохновитель: assets/base/hex/liana3.png`)
- `assets/base/hex/rootMaze/plank1.png` — настил / переход, стадия 1. (`вдохновитель: assets/base/items/plank1.png`)
- `assets/base/hex/rootMaze/plank2.png` — настил / переход, стадия 2. (`вдохновитель: assets/base/items/plank2.png`)
- `assets/base/hex/rootMaze/plank3.png` — настил / переход, стадия 3. (`вдохновитель: assets/base/items/plank3.png`)

Малый декор и препятствия:
- `assets/base/hex/rootMaze/decorSeedPod.png` — семенная коробочка или древесный плод. (`вдохновитель: assets/base/ui/mapleSeed.png`)
- `assets/base/hex/rootMaze/decorHangingCharm.png` — маленькая подвеска или амулет. (`вдохновитель: assets/base/items/feather.png`)
- `assets/base/hex/rootMaze/decorRootLoop.png` — дополнительная петля корня. (`вдохновитель: assets/base/hex/liana2.png`)
- `assets/base/hex/rootMaze/obstacleRoadKnot.png` — узел дорог с отметкой. (`вдохновитель: assets/base/ui/map/path.png`)
- `assets/base/hex/rootMaze/obstacleLanternPedestal.png` — подставка под корневой фонарь или ритуальный пень. (`вдохновитель: assets/base/items/environment/stump.png`)
