window.MECHANIC_SEED = [
  {
    appearanceLevel: 1,
    shortDescription: "Соседнее открытие снимает лист с клетки",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-001", src: "images/level-001.webp" }],
    id: "game-leaf-cover", title: "Листовые покрытия", icon: "🍃",
    description: "Открытие соседней клетки снимает лист с закрытого гекса и показывает содержимое. Лист и то, что находится под ним, остаются отдельными состояниями клетки.",
    tags: ["покрытие", "основа", "поле"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/model/forest/CellState.ts"
  },
  {
    appearanceLevel: 5,
    shortDescription: "Соседние открытия постепенно снимают слои лианы",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-005", src: "images/level-005.webp" }],
    id: "game-ivy", title: "Лианы и несколько слоёв покрытия", icon: "🌱",
    description: "Лианы закрывают клетки в один, два или три слоя. Соседние открытия постепенно снимают слои; под лианой может оставаться обычный закрытый лист.",
    tags: ["препятствие", "слои", "лианы"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/model/enum/CellType.ts"
  },
  {
    appearanceLevel: 27,
    shortDescription: "Планки снимаются по слоям соседними открытиями",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-027", src: "images/level-027.webp" }],
    id: "game-planks", title: "Доски на клетках", icon: "🪵",
    description: "Деревянные планки перекрывают клетки и снимаются по слоям соседними открытиями. В конфигурации есть варианты от одного до трёх слоёв.",
    tags: ["препятствие", "слои", "доски"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/model/enum/CellType.ts"
  },
  {
    appearanceLevel: 7,
    shortDescription: "Компас открывает цепочку доступных клеток",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-007", src: "images/level-007.webp" }],
    id: "game-compass", title: "Компас открывает путь по полю", icon: "🧭",
    description: "Компас перемещается от клетки к ближайшей доступной закрытой клетке и открывает цепочку до четырёх клеток. Порядок открытия определяется расстоянием на текущем поле.",
    tags: ["бустер", "открытие", "компас"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/service/provider/BoosterProvider.ts"
  },
  {
    appearanceLevel: 41,
    shortDescription: "Ракеты очищают линии в трёх направлениях",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-041", src: "images/level-041.webp" }],
    id: "game-rockets", title: "Ракеты трёх направлений", icon: "🚀",
    description: "Три типа ракет открывают линию клеток: по горизонтали или по одной из двух диагоналей. Взрыв может запускать другие найденные бустеры по пути.",
    tags: ["бустер", "открытие", "ракета"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/service/provider/BoosterProvider.ts"
  },
  {
    appearanceLevel: 83,
    shortDescription: "Сфера показывает содержимое соседних клеток",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-083", src: "images/level-083.webp" }],
    id: "game-vision", title: "Бустер «Зрение»", icon: "👁️",
    description: "Волшебная сфера последовательно показывает покрытие и содержимое закрытых клеток в двух кольцах вокруг себя. Эффект не открывает эти клетки; сферу можно найти на поле даже под лианой.",
    tags: ["бустер", "подсказка", "зрение"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/service/provider/BoosterProvider.ts"
  },
  {
    appearanceLevel: 97,
    shortDescription: "Вода задаёт маршрут лодки по полю",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-097", src: "images/level-097.webp" }],
    id: "game-water-boat", title: "Вода и маршрут лодки", icon: "⛵",
    description: "Водные клетки образуют маршрут для лодки. Открытия и границы между клетками влияют на то, куда она может переместиться и в каком кармане её получится поймать.",
    tags: ["вода", "движение", "лодка"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/screen/ForestScreen.ts"
  },
  {
    appearanceLevel: 93,
    shortDescription: "Соседние действия раскрывают ракушку с жемчугом",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-093", src: "images/level-093.webp" }],
    id: "game-shell-pearl", title: "Ракушка и жемчужина", icon: "🐚",
    description: "Ракушка — интерактивная цель на поле: соседние действия помогают раскрыть её, после чего игрок получает жемчужину. Количество ракушек и жемчужин задаётся целью уровня.",
    tags: ["цель", "сбор", "ракушка"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/model/enum/ContentType.ts"
  },
  {
    appearanceLevel: 12,
    shortDescription: "Открытие клетки раскрывает лунный цветок",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-012", src: "images/level-012.webp" }],
    id: "game-moonflowers", title: "Закрытые лунные цветы", icon: "🌙",
    description: "Закрытые лунные цветы размещаются как интерактивные объекты и учитываются в целях уровня. Открытие клетки запускает отдельную анимацию раскрытия и сбор цветка.",
    tags: ["цветы", "цель", "сбор"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/screen/ForestScreen.ts"
  },
  {
    appearanceLevel: 57,
    shortDescription: "Улей выдаёт мёд при действиях на поле",
    focus: { x: 32, y: 34 },
    images: [{ id: "level-057", src: "images/level-057.webp" }],
    id: "game-hive-honey", title: "Улей и накопление мёда", icon: "🍯",
    description: "Улей показывает оставшийся запас мёда и выдаёт его порциями при взаимодействии с клетками. Уровень задаёт общее количество мёда и вклад каждого улья.",
    tags: ["животные", "сбор", "улей"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/screen/ForestScreen.ts"
  },
  {
    appearanceLevel: 9,
    shortDescription: "Жёлуди задают путь божьим коровкам",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-009", src: "images/level-009.webp" }, { id: "level-038", src: "images/level-038.webp" }],
    id: "game-acorns-ladybugs", title: "Жёлуди и божьи коровки", icon: "🐞",
    description: "Жёлуди задают клетки и маршрут для божьих коровок. Игрок открывает путь и подготавливает соседние клетки, чтобы провести коровку к нужной цели.",
    tags: ["животные", "маршрут", "жёлуди"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/service/provider/LadybugsProvider.ts"
  },
  {
    appearanceLevel: 61,
    shortDescription: "Стрекозы перемещаются вслед за открытиями",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-061", src: "images/level-061.webp" }],
    id: "game-dragonflies", title: "Перелёты стрекоз", icon: "🪷",
    description: "Стрекозы перемещаются по полю по мере открытия клеток. На отдельных клетках их полёт связан с покрытием и достижением цели сбора.",
    tags: ["животные", "движение", "стрекоза"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/screen/ForestScreen.ts"
  },
  {
    appearanceLevel: null,
    shortDescription: "Пчёлы занимают клетки под покрытием",
    focus: { x: 32, y: 34 },
    images: [{ id: "level-057-bees", src: "images/level-057.webp" }],
    id: "game-bees", title: "Пчёлы на клетках", icon: "🐝",
    description: "Пчела размещается на клетке как отдельный объект, в том числе под покрытием. Для вариантов пчелы в коде предусмотрены разные правила обработки клетки и дополнительного действия.",
    tags: ["животные", "клетки", "пчёлы"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/model/enum/CellType.ts"
  },
  {
    appearanceLevel: 35,
    shortDescription: "Желе снимается и распространяется по клеткам",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-035", src: "images/level-035.webp" }],
    id: "game-jelly", title: "Желе как распространяющееся покрытие", icon: "🫧",
    description: "Желе блокирует клетку и снимается от соседних открытий. На некоторых уровнях оно может переходить на соседнюю клетку, поэтому распространение нужно учитывать при выборе следующего хода.",
    tags: ["препятствие", "распространение", "желе"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/screen/ForestScreen.ts"
  },
  {
    appearanceLevel: 120,
    shortDescription: "Лёд удерживает покрытие и блокирует клетки",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-120", src: "images/level-120.webp" }],
    id: "game-ice", title: "Лёд и замёрзшие клетки", icon: "❄️",
    description: "Замёрзшие клетки удерживают покрытие и требуют отдельных соседних действий для освобождения. Лёд учитывается как самостоятельный тип блокировки поля.",
    tags: ["препятствие", "лёд", "слои"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/component/forest/ForestCellCover.ts"
  },
  {
    appearanceLevel: 24,
    shortDescription: "Ягоды снимаются вместе со слоями покрытия",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-024", src: "images/level-024.webp" }],
    id: "game-cankerberries", title: "Ягоды на слоях покрытия", icon: "🍓",
    description: "Некоторые покрытия удерживают ягоды, которые снимаются вместе с открытием слоя. Игра считает их отдельно и показывает прогресс сбора.",
    tags: ["сбор", "покрытие", "ягоды"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/view/component/forest/ForestCellCover.ts"
  },
  {
    appearanceLevel: null,
    shortDescription: "Числа помогают оценивать скрытые клетки и предметы",
    focus: { x: 50, y: 50 },
    images: [{ id: "level-001-numeric", src: "images/level-001-numeric.webp" }],
    id: "game-numeric-clues", title: "Числовые подсказки на поле", icon: "🔢",
    description: "Числа на клетках и предметах помогают оценивать ближайшие скрытые клетки и оставшиеся взаимодействия. Подсказки формируются с учётом типа поля и специальных объектов.",
    tags: ["подсказка", "числа", "поле"], priority: "Средний", status: "В игре", source: "Существующие механики", origin: "src/core/configuration/ForestConfiguration.ts"
  },

  {
    appearanceLevel: 99001,
    legacyTitle: "Живые биомы и восстановление пути",
    shortDescription: "Поручения меняют биом и открывают путь",
    focus: { x: 50, y: 50 },
    id: "ideas2-biomes", title: "Живые биомы", icon: "🗺️",
    description: "Сквозной цикл связывает головоломки, помощь обитателям и изменение карты: заметить след или объект, выполнить несколько шагов поручения, собрать гарантированный материал и сразу увидеть, как восстановленное место меняет биом и маршрут. Идея предлагает вводить не больше одной новой логики за уровень и не блокировать основной сюжет покупками или случайными выпадениями.",
    tags: ["ideas2", "мета", "биомы", "сюжет"], priority: "Средний", status: "Идея", source: "ideas2 · обзор системы", origin: "docs/ideas2/ideas copy.md"
  },
  {
    appearanceLevel: 99002,
    legacyTitle: "Предмет в лиане и выбор сундука",
    shortDescription: "Ключ открывает один из двух подходящих сундуков",
    focus: { x: 70, y: 43 },
    id: "idea-01", title: "Ключ к сундукам", description: "Ключ, деталь или награда скрывается под последним слоем лианы. Найдя ключ, игрок выбирает, какой из двух подходящих сундуков открыть; предмет и покрытие клетки обрабатываются отдельно.", tags: ["ideas2", "лианы", "ключ", "выбор"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 1", images: [{ id: "idea2-01", src: "images/idea2-01.webp", fullSrc: "../ideas2/illustrations/01-keys-in-ivy.png" }]
  },
  {
    appearanceLevel: 99003,
    legacyTitle: "Вода приводит в действие объект на поле",
    shortDescription: "Вода заряжает колесо и снимает слои с клеток",
    focus: { x: 72, y: 39 },
    id: "idea-02", title: "Водяное колесо", description: "Открытия отмеченных водных клеток заряжают связанный объект — например, колесо. После нужного числа активаций он снимает слои с заранее связанных клеток; геометрия водоёма задаёт цену обходного пути.", tags: ["ideas2", "вода", "счётчик", "объекты"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 2", images: [{ id: "idea2-02", src: "images/idea2-02.webp", fullSrc: "../ideas2/illustrations/02-water-wheel.png" }]
  },
  {
    appearanceLevel: 99004,
    legacyTitle: "Бабочка направляет действие цветка",
    shortDescription: "Направляет действие цветка",
    focus: { x: 67, y: 32 },
    id: "idea-03", title: "Цветочная бабочка", description: "Соседнее открытие будит особый бутон. Бабочка летит к выбранному игроком цветку, который раскрывает отмеченные соседние клетки; лианы и доски останавливают эффект.", tags: ["ideas2", "цветы", "бабочка", "направление"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 3", images: [{ id: "idea2-03", src: "images/idea2-03.webp", fullSrc: "../ideas2/illustrations/03-butterfly-choice.png" }]
  },
  {
    appearanceLevel: 99005,
    legacyTitle: "Собранные детали ремонтируют объект",
    shortDescription: "Собранные детали запускают объект на поле",
    focus: { x: 72, y: 36 },
    id: "idea-04", title: "Полевой ремонт", description: "Нужные детали находятся под покрытием. Когда игрок собирает комплект, он чинит объект на поле и получает понятный эффект: восстанавливает проход, включает устройство или открывает отдельную награду.", tags: ["ideas2", "ремонт", "детали", "объекты"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 4", images: [{ id: "idea2-04", src: "images/idea2-04.webp", fullSrc: "../ideas2/illustrations/04-field-repair.png" }]
  },
  {
    appearanceLevel: 99006,
    legacyTitle: "Дверь в сайд-ивент готовится действиями на клетках",
    shortDescription: "Ключи и вода открывают вход в событие",
    focus: { x: 74, y: 28 },
    id: "idea-05", title: "Дверь в событие", description: "Игрок собирает подходящие ключи и заряжает объект водой или другими действиями на том же поле. Когда счётчики выполнены, локальная дверь открывает вход в отдельное событие.", tags: ["ideas2", "событие", "дверь", "ресурсы"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 5", images: [{ id: "idea2-05", src: "images/idea2-05.webp", fullSrc: "../ideas2/illustrations/05-event-door.png" }]
  },
  {
    appearanceLevel: 99007,
    legacyTitle: "Общие правила создают комбинации",
    shortDescription: "Связывает открытия, препятствия и цели",
    focus: { x: 57, y: 47 },
    id: "idea-06", title: "Цепочка механик", description: "Знакомые открытия, покрытия, объекты и ключи соединяются в небольшие цепочки. Игрок планирует порядок действий, чтобы одним маршрутом повлиять на несколько целей и затем выбрать, на что потратить найденный ключ.", tags: ["ideas2", "комбинации", "цепочки", "выбор"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 6", images: [{ id: "idea2-06", src: "images/idea2-06.webp", fullSrc: "../ideas2/illustrations/06-combination.png" }]
  },
  {
    appearanceLevel: 99008,
    legacyTitle: "Рубиновый люк с улиткой на крышке",
    shortDescription: "Ключ открывает люк со спрятанной наградой",
    focus: { x: 72, y: 55 },
    id: "idea-07", title: "Рубиновый тайник", description: "Рубиновый замок связывает клетку с локальным тайником. Игрок освобождает нужный ключ и решает, тратить ли его на люк ради короткой необязательной находки.", tags: ["ideas2", "ключ", "тайник", "улитка"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 7", images: [{ id: "idea2-07", src: "images/idea2-07.webp", fullSrc: "../ideas2/illustrations/07-ruby-hatch.png" }]
  },
  {
    appearanceLevel: 99009,
    legacyTitle: "Шестерёнки запускают насос",
    shortDescription: "Насос поднимает воду к выбранной ветви",
    focus: { x: 70, y: 50 },
    id: "idea-08", title: "Насос из шестерёнок", description: "Найденные в лианах шестерёнки запускают насос. Он поднимает воду к выбранной ветви поля и помогает открыть клетки или запустить соседний водный объект.", tags: ["ideas2", "шестерёнки", "вода", "насос"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 8", images: [{ id: "idea2-08", src: "images/idea2-08.webp", fullSrc: "../ideas2/illustrations/08-gear-pump.png" }]
  },
  {
    appearanceLevel: 99010,
    legacyTitle: "Источник пробуждает засохший клён",
    shortDescription: "Источник возвращает жизнь засохшему дереву",
    focus: { x: 70, y: 30 },
    id: "idea-09", title: "Источник для клёна", description: "Вода из источника проходит по видимому руслу и возвращает жизнь дереву. Игрок выбирает путь открытий, который одновременно помогает текущей цели уровня.", tags: ["ideas2", "вода", "растения", "восстановление"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 9", images: [{ id: "idea2-09", src: "images/idea2-09.webp", fullSrc: "../ideas2/illustrations/09-maple-spring.png" }]
  },
  {
    appearanceLevel: 99011,
    legacyTitle: "Два краба открывают стеклянный тайник",
    shortDescription: "Крабы открывают купол с садом и наградой",
    focus: { x: 71, y: 50 },
    id: "idea-10", title: "Крабий тайник", description: "Два краба, найденные под песком, занимают отмеченные площадки и поднимают стеклянный купол. Под ним восстанавливается миниатюрный сад с наградой.", tags: ["ideas2", "песок", "животные", "тайник"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 10", images: [{ id: "idea2-10", src: "images/idea2-10.webp", fullSrc: "../ideas2/illustrations/10-crab-glass.png" }]
  },
  {
    appearanceLevel: 99012,
    legacyTitle: "Политый цветок выдаёт ценность",
    shortDescription: "Вода раскрывает цветок и ценный предмет",
    focus: { x: 72, y: 47 },
    id: "idea-11", title: "Цветок с наградой", description: "Три водных источника соединены с засохшим цветком. Когда вода проходит по каналам, цветок расцветает и выдаёт один заранее видимый ценный предмет.", tags: ["ideas2", "вода", "цветы", "награда"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 11", images: [{ id: "idea2-11", src: "images/idea2-11.webp", fullSrc: "../ideas2/illustrations/11-watered-flower.png" }]
  },
  {
    appearanceLevel: 99013,
    legacyTitle: "Воздушный змей возвращает винт дирижабля",
    shortDescription: "Помогает вернуть винт дирижабля",
    focus: { x: 72, y: 49 },
    id: "idea-12", title: "Воздушный змей", description: "Винт дирижабля запутался в лианах вместе с воздушным змеем. Освободив деталь, игрок возвращает винт на дирижабль и открывает локальный вход в побочное содержимое.", tags: ["ideas2", "лианы", "ремонт", "дирижабль"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 12", images: [{ id: "idea2-12", src: "images/idea2-12.webp", fullSrc: "../ideas2/illustrations/12-airship-kite.png" }]
  },
  {
    appearanceLevel: 99014,
    legacyTitle: "Воздушный шар поднимает телескоп",
    shortDescription: "Шар поднимает телескоп к скрытым клеткам",
    focus: { x: 70, y: 25 },
    id: "idea-13", title: "Телескоп на шаре", description: "Две найденные лопасти запускают подъёмную корзину. Шар поднимает её к платформе на дереве, а восстановленный телескоп показывает несколько скрытых клеток.", tags: ["ideas2", "ремонт", "подсказка", "телескоп"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 13", images: [{ id: "idea2-13", src: "images/idea2-13.webp", fullSrc: "../ideas2/illustrations/13-balloon-lookout.png" }]
  },
  {
    appearanceLevel: 99015,
    legacyTitle: "Компас в руинах включает рычаг",
    shortDescription: "Компас включает рычаг и открывает клетки",
    focus: { x: 72, y: 54 },
    id: "idea-14", title: "Компас в руинах", description: "Игрок находит иглу компаса под лианами и восстанавливает древний пьедестал. Совмещённый компас активирует рычаг и материализует три заранее обозначенные клетки.", tags: ["ideas2", "компас", "руины", "ремонт"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 14", images: [{ id: "idea2-14", src: "images/idea2-14.webp", fullSrc: "../ideas2/illustrations/14-ruins-compass.png" }]
  },
  {
    appearanceLevel: 99016,
    legacyTitle: "Шалаш освобождает проход под мега-улиткой",
    shortDescription: "Улитка перебирается в шалаш и освобождает путь",
    focus: { x: 72, y: 53 },
    id: "idea-15", title: "Улитка и шалаш", description: "Две найденные жерди ремонтируют шалаш. Проснувшаяся большая улитка перебирается в убежище и освобождает клетки, на которых она спала.", tags: ["ideas2", "ремонт", "животные", "проход"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 15", images: [{ id: "idea2-15", src: "images/idea2-15.webp", fullSrc: "../ideas2/illustrations/15-snail-shelter.png" }]
  },
  {
    appearanceLevel: 99017,
    legacyTitle: "Линза возвращает свет маяку",
    shortDescription: "Линза освещает скрытые клетки",
    focus: { x: 19, y: 38 },
    id: "idea-16", title: "Свет маяка", description: "Линза находится под лианами. После установки маяк освещает три клетки в тумане, но не открывает их автоматически.", tags: ["ideas2", "вода", "подсказка", "маяк"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 16", images: [{ id: "idea2-16", src: "images/idea2-16.webp", fullSrc: "../ideas2/illustrations/16-lighthouse.png" }]
  },
  {
    appearanceLevel: 99018,
    legacyTitle: "Топор восстанавливает переход через болото",
    shortDescription: "Бобр разбирает бревно и строит переправу",
    focus: { x: 65, y: 51 },
    id: "idea-17", title: "Бобровый переход", description: "Топор освобождает дренажный канал от сухого бревна. Вода уходит, части бревна становятся переходом, а затопленный сундук оказывается доступен.", tags: ["ideas2", "вода", "инструменты", "переход"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 17", images: [{ id: "idea2-17", src: "images/idea2-17.webp", fullSrc: "../ideas2/illustrations/17-swamp-chest.png" }]
  },
  {
    appearanceLevel: 99019,
    legacyTitle: "Гига-желе переселяется в восстановленный сад",
    shortDescription: "Бутон заманивает желе в подготовленную чашу",
    focus: { x: 72, y: 47 },
    id: "idea-18", title: "Гига-желе", description: "Два цветущих бутона приманивают большое желе с трёх клеток в подготовленную чашу. На освободившихся клетках остаются покрытие и скрытая награда.", tags: ["ideas2", "желе", "цветы", "перемещение"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 18", images: [{ id: "idea2-18", src: "images/idea2-18.webp", fullSrc: "../ideas2/illustrations/18-giant-jelly.png" }]
  },
  {
    appearanceLevel: 99020,
    legacyTitle: "Починенная лесенка открывает верхний слой",
    shortDescription: "Перекладины открывают верхний слой клеток",
    focus: { x: 71, y: 42 },
    id: "idea-19", title: "Лестница верхнего слоя", description: "Две найденные перекладины восстанавливают лесенку. Над тремя опорными клетками появляется дополнительный верхний слой закрытых гексов.", tags: ["ideas2", "слои", "ремонт", "поле"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 19", images: [{ id: "idea2-19", src: "images/idea2-19.webp", fullSrc: "../ideas2/illustrations/19-layered-ladder.png" }]
  },
  {
    appearanceLevel: 99021,
    legacyTitle: "Лебёдка поднимает решётку пещеры",
    shortDescription: "Лебёдка поднимает решётку и освобождает проход",
    focus: { x: 78, y: 38 },
    id: "idea-20", title: "Подъём решётки", description: "Найденные шестерёнки запускают лебёдку, которая поднимает тяжёлую решётку. Освободившийся проход ведёт к новым клеткам и награде.", tags: ["ideas2", "шестерёнки", "ремонт", "проход"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 20", images: [{ id: "idea2-20", src: "images/idea2-20.webp", fullSrc: "../ideas2/illustrations/20-gear-winch.png" }]
  },
  {
    appearanceLevel: 99022,
    legacyTitle: "Дождеватель поливает выбранную клумбу",
    shortDescription: "Направляет воду на выбранную клумбу",
    focus: { x: 54, y: 47 },
    id: "idea-21", title: "Дождеватель", description: "Отремонтированный дождеватель направляет поток воды к одной из отмеченных клумб. Игрок выбирает сторону, чтобы получить нужный эффект и использовать открытия с пользой для цели уровня.", tags: ["ideas2", "шестерёнки", "вода", "выбор"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 21", images: [{ id: "idea2-21", src: "images/idea2-21.webp", fullSrc: "../ideas2/illustrations/21-gear-sprinkler.png" }]
  },
  {
    appearanceLevel: 99023,
    legacyTitle: "Ветродуй освобождает клетки от песка",
    shortDescription: "Сдувает песок с выбранного ряда клеток",
    focus: { x: 70, y: 50 },
    id: "idea-22", title: "Ветродуй", description: "Собранные детали чинят направленный воздушный механизм. Поток сдувает песок с выбранного ряда клеток, открывая к ним доступ.", tags: ["ideas2", "шестерёнки", "песок", "открытие"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 22", images: [{ id: "idea2-22", src: "images/idea2-22.webp", fullSrc: "../ideas2/illustrations/22-gear-windblower.png" }]
  },
  {
    appearanceLevel: 99024,
    legacyTitle: "Поворотное зеркало меняет направление света",
    shortDescription: "Поворот зеркала меняет путь света",
    focus: { x: 70, y: 52 },
    id: "idea-23", title: "Зеркало света", description: "Зеркало направляет свет по одной из нескольких видимых траекторий. Поворот помогает активировать цель или показать выбранную область поля.", tags: ["ideas2", "шестерёнки", "свет", "направление"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 23", images: [{ id: "idea2-23", src: "images/idea2-23.webp", fullSrc: "../ideas2/illustrations/23-gear-mirror.png" }]
  },
  {
    appearanceLevel: 99025,
    legacyTitle: "Подъёмник возвращает площадку на поле",
    shortDescription: "Подъёмник возвращает клетки на доступный уровень",
    focus: { x: 68, y: 44 },
    id: "idea-24", title: "Подъёмник платформы", description: "Шестерёночный подъёмник восстанавливает опущенную платформу и возвращает клетки на доступный уровень. Положение устройства задаёт порядок подготовки прохода.", tags: ["ideas2", "шестерёнки", "платформа", "ремонт"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 24", images: [{ id: "idea2-24", src: "images/idea2-24.webp", fullSrc: "../ideas2/illustrations/24-gear-lift.png" }]
  },
  {
    appearanceLevel: 99026,
    legacyTitle: "Шпалера с воротом стягивает лианы",
    shortDescription: "Ворот натягивает шпалеру и снимает лианы",
    focus: { x: 71, y: 43 },
    id: "idea-25", title: "Шпалера и ворот", description: "Поворот ворота натягивает шпалеру и снимает лианы с нескольких связанных клеток. Игрок выбирает момент и ветвь, чтобы освободить полезные соседние участки.", tags: ["ideas2", "шестерёнки", "лианы", "открытие"], priority: "Средний", status: "Идея", source: "ideas2", origin: "docs/ideas2/ideas.md · механика 25", images: [{ id: "idea2-25", src: "images/idea2-25.webp", fullSrc: "../ideas2/illustrations/25-gear-trellis.png" }]
  },

  {
    appearanceLevel: 99027,
    legacyTitle: "Теневая рука переносит валун",
    shortDescription: "Переносит валун на одну из боковых площадок",
    focus: { x: 73, y: 64 },
    id: "pdf03-01", title: "Теневая рука", description: "Фонарь оживляет тень, которая переносит валун на одну из двух боковых площадок. Центр поля освобождает два листа и ключ, но камень начинает закрывать клетки у выбранной площадки. Цена — один сохраняющийся между уровнями самоцвет; игрок решает, какой участок открыть и чем пожертвовать.", tags: ["pdf 03", "перемещение", "валун", "самоцвет"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 2", images: [{ id: "pdf03-01", src: "images/pdf03-01.webp" }]
  },
  {
    appearanceLevel: 99028,
    legacyTitle: "Конверт переносит живой цветок",
    shortDescription: "Переносит неиспользованный цветок между уровнями",
    focus: { x: 82, y: 48 },
    id: "pdf03-02", title: "Цветочный конверт", description: "Конверт упаковывает найденный цветок, который ещё не срабатывал. На другом уровне игрок сажает тот же цветок на открытую пустую клетку и использует его обычный соседний эффект. Это позволяет отложить помощь и выбрать более выгодное место.", tags: ["pdf 03", "цветы", "перенос", "расходник"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 3", images: [{ id: "pdf03-02", src: "images/pdf03-02.webp" }]
  },
  {
    appearanceLevel: 99029,
    legacyTitle: "Поворотная кувшинка меняет соседей",
    shortDescription: "Переставляет сектор клеток, не открывая их",
    focus: { x: 72, y: 50 },
    id: "pdf03-03", title: "Поворотная кувшинка", description: "Кувшинка поворачивает сектор из трёх целых клеток на 120 градусов: вместе перемещаются лианы, доски и листья, но клетки ничего не открывают. За один сохраняющийся самоцвет игрок заранее примеряет, какую границу поля подвести к препятствию.", tags: ["pdf 03", "поворот", "геометрия", "самоцвет"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 4", images: [{ id: "pdf03-03", src: "images/pdf03-03.webp" }]
  },
  {
    appearanceLevel: 99030,
    legacyTitle: "Лист перебрасывает коровку",
    shortDescription: "Перебрасывает божью коровку через завал",
    focus: { x: 84, y: 58 },
    id: "pdf03-04", title: "Лист-батут", description: "На открытой площадке натягивается одноразовый лист-батут. Когда путь освобождается, коровка перепрыгивает завал на заранее показанную боковую клетку. Батут стоит две древесины; посадку нужно подготовить, а сам прыжок клетку не открывает.", tags: ["pdf 03", "животные", "прыжок", "древесина"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 5", images: [{ id: "pdf03-04", src: "images/pdf03-04.webp" }]
  },
  {
    appearanceLevel: 99031,
    legacyTitle: "Паутинный шов передаёт толчок",
    shortDescription: "Передаёт толчок от клетки к выбранному объекту",
    focus: { x: 25, y: 65 },
    id: "pdf03-05", title: "Паутинный шов", description: "Паук соединяет закрытый лист с цветком, ракушкой или ульем в пределах трёх рёбер. Первое открытие связанного листа передаёт цели одно обычное соседнее воздействие, затем нить рвётся. Игрок выбирает, какому объекту помочь за один самоцвет.", tags: ["pdf 03", "паутина", "связи", "самоцвет"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 6", images: [{ id: "pdf03-05", src: "images/pdf03-05.webp" }]
  },
  {
    appearanceLevel: 99032,
    legacyTitle: "Ледяной цветок запирает пути лодки",
    shortDescription: "Временно перекрывает часть пути лодки",
    focus: { x: 70, y: 50 },
    id: "pdf03-06", title: "Ледяной цветок", description: "Морозный цветок ставится на открытую водную клетку и на три завершённых хода перекрывает заранее показанные границы. Лодка теряет часть маршрутов, а обычные открытия продолжаются. Самоцвет позволяет временно подготовить выгодный карман для поимки лодки.", tags: ["pdf 03", "лёд", "вода", "лодка"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 7", images: [{ id: "pdf03-06", src: "images/pdf03-06.webp" }]
  },
  {
    appearanceLevel: 99033,
    legacyTitle: "Бобёр разбирает забор на древесину",
    shortDescription: "Разбирает забор и возвращает древесину",
    focus: { x: 72, y: 56 },
    id: "pdf03-07", title: "Бобр и забор", description: "Приманка зовёт бобра вдоль одной из двух видимых цепочек забора длиной до трёх рёбер. Он снимает столбики и складывает целые планки: три границы открываются, а игрок получает древесину. Приманка стоит одну древесину, полный разбор возвращает две.", tags: ["pdf 03", "животные", "забор", "древесина"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 8", images: [{ id: "pdf03-07", src: "images/pdf03-07.webp" }]
  },
  {
    appearanceLevel: 99034,
    legacyTitle: "Форма собирает желе в самоцвет",
    shortDescription: "Собирает желе в магический самоцвет",
    focus: { x: 78, y: 58 },
    id: "pdf03-08", title: "Форма для желе", description: "Одноразовая деревянная форма на соседней клетке собирает три порции красной смолы из желе и отливает один магический самоцвет. Форма стоит две древесины. Игрок выбирает между быстрой расчисткой источника и сохранением желе ради постоянного ресурса.", tags: ["pdf 03", "желе", "ресурс", "самоцвет"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 9", images: [{ id: "pdf03-08", src: "images/pdf03-08.webp" }]
  },
  {
    appearanceLevel: 99035,
    legacyTitle: "Живой корень раскалывает ветвь",
    shortDescription: "Раскалывает одну ветвь и открывает клетки",
    focus: { x: 72, y: 58 },
    id: "pdf03-09", title: "Корень-развилка", description: "Игрок кладёт один самоцвет у выбранной ветви ростка в Y-образной плите. Следующее соседнее открытие растёт корнем и раздвигает эту ветвь, открывая доступ к двум или трём клеткам. Вторая ветвь остаётся закрыта камнем.", tags: ["pdf 03", "растения", "камень", "выбор"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 10", images: [{ id: "pdf03-09", src: "images/pdf03-09.webp" }]
  },
  {
    appearanceLevel: 99036,
    legacyTitle: "Плотина направляет лодку в карман",
    shortDescription: "Направляет лодку в подготовленный речной карман",
    focus: { x: 83, y: 77 },
    id: "pdf03-10", title: "Плотина для лодки", description: "Плотина за две древесины перекрывает один рукав Y-образной реки. Следующее открытие водной клетки направляет волну по другому рукаву и перемещает лодку в подготовленный карман. Весь маршрут нужно открыть до запуска; можно выбрать короткий путь или заодно помочь ракушке.", tags: ["pdf 03", "вода", "лодка", "древесина"], priority: "Средний", status: "Идея", source: "PDF 03 · Физические механики поля", origin: "03_physical_field_mechanics.pdf · стр. 11", images: [{ id: "pdf03-10", src: "images/pdf03-10.webp" }]
  },
  {
    appearanceLevel: 99037,
    legacyTitle: "Дом лепрекона расправляет крышу",
    shortDescription: "Опоры поднимают крышу и возвращают жителя",
    focus: { x: 72, y: 42 },
    id: "pdf04-11", title: "Дом лепрекона", description: "Два из трёх угловых подходов позволяют поставить опоры, поднять крышу и восстановить дом. За две древесины игрок выбирает полезные соседние открытия; житель выдаёт сохраняющийся клевер и засчитывает восстановление леса.", tags: ["pdf 04", "ремонт", "древесина", "клевер"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 2", images: [{ id: "pdf04-01", src: "images/pdf04-01.webp" }]
  },
  {
    appearanceLevel: 99038,
    legacyTitle: "Единорог выходит из цепной ловушки",
    shortDescription: "Ключ освобождает единорога и даёт нить света",
    focus: { x: 66, y: 60 },
    id: "pdf04-12", title: "Единорог и цепи", description: "Игрок заранее готовит один из двух путей к безопасной поляне, затем тратит подходящий ключ на замок двух цепей. Единорог выходит по открытому проходу; награда — катушка нити света, которая на другом поле снимает слой лиан с видимой группы до трёх клеток.", tags: ["pdf 04", "животные", "ключ", "лианы"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 3", images: [{ id: "pdf04-02", src: "images/pdf04-02.webp" }]
  },
  {
    appearanceLevel: 99039,
    legacyTitle: "Орех-сейф раскалывается в растяжке",
    shortDescription: "Распорка раскрывает орех с древесиной",
    focus: { x: 73, y: 50 },
    id: "pdf04-13", title: "Орех-сейф", description: "Одна древесина и распорка натягивают выбранную пару противоположных верёвок и раскрывают орех. Внутри лежат две древесины; при клеверном выборе игрок выбирает один из двух заранее объявленных равнобюджетных наборов.", tags: ["pdf 04", "древесина", "тайник", "выбор"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 4", images: [{ id: "pdf04-03", src: "images/pdf04-03.webp" }]
  },
  {
    appearanceLevel: 99040,
    legacyTitle: "Ледяной сундук оттаивает с трёх сторон",
    shortDescription: "Жаровня растапливает замок с трёх сторон",
    focus: { x: 72, y: 44 },
    id: "pdf04-14", title: "Ледяной сундук", description: "Игрок разжигает жаровню одной древесиной и проводит её по открытым клеткам к трём отмеченным рёбрам сундука. Каждое ребро тает отдельно; после третьего сундук отдаёт один подходящий ключ. Путь и класс ключа видны заранее.", tags: ["pdf 04", "лёд", "ключ", "маршрут"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 5", images: [{ id: "pdf04-04", src: "images/pdf04-04.webp" }]
  },
  {
    appearanceLevel: 99041,
    legacyTitle: "Моховой ковёр сворачивается с тайника",
    shortDescription: "Сворачивает ковёр, оставляя листья на месте",
    focus: { x: 84, y: 38 },
    id: "pdf04-15", title: "Моховой тайник", description: "За одну древесину игрок готовит площадку слева или справа и сворачивает ковёр с трёх клеток. Закрытые листья под ним остаются на месте, а реликвия освобождается. Три разных фрагмента собирают артефакт «Крюк-кошка».", tags: ["pdf 04", "реликвии", "древесина", "тайник"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 6", images: [{ id: "pdf04-05", src: "images/pdf04-05.webp" }]
  },
  {
    appearanceLevel: 99042,
    legacyTitle: "Светлячки следуют по корневой дорожке",
    shortDescription: "Светлячки идут к фонарю по выбранному пути",
    focus: { x: 72, y: 55 },
    id: "pdf04-16", title: "Корневая дорожка", description: "Открытия освобождают непрерывный путь световодов от трёх пузырей росы к фонарю; рубин зажигает дорожку и выпускает стаю. Игрок выбирает короткий маршрут или полезную для цели боковую ветвь. Наполненный фонарик затем даёт одно соседнее воздействие на цветок, ракушку или улей.", tags: ["pdf 04", "светлячки", "маршрут", "рубиновый ресурс"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 7", images: [{ id: "pdf04-06", src: "images/pdf04-06.webp" }]
  },
  {
    appearanceLevel: 99043,
    legacyTitle: "Паук ткёт волшебный конверт",
    shortDescription: "Три открытия помогают пауку соткать конверт",
    focus: { x: 72, y: 50 },
    id: "pdf04-17", title: "Паучий ткацкий станок", description: "Одна древесина запускает ткацкий станок. Три подходящих открытия натягивают две стороны основы, после чего паук ткёт конверт. Он сохраняет найденный цветок для одного будущего уровня, не создавая его копию.", tags: ["pdf 04", "паутина", "цветы", "древесина"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 8", images: [{ id: "pdf04-07", src: "images/pdf04-07.webp" }]
  },
  {
    appearanceLevel: 99044,
    legacyTitle: "Ёжик вывозит два груза",
    shortDescription: "Ёжик перевозит выбранные ресурсы в общий запас",
    focus: { x: 85, y: 23 },
    id: "pdf04-18", title: "Тележка ёжика", description: "Игрок чинит тележную ось за одну древесину и прокладывает путь к выходу мимо двух из трёх складов. Ёжик забирает выбранные пакеты — древесину, ключ или рубин — и увозит их в общий запас.", tags: ["pdf 04", "животные", "ресурсы", "маршрут"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 9", images: [{ id: "pdf04-08", src: "images/pdf04-08.webp" }]
  },
  {
    appearanceLevel: 99045,
    legacyTitle: "Древняя плита поднимается и открывает руну",
    shortDescription: "Подъёмная рама открывает реликвию с руной",
    focus: { x: 78, y: 42 },
    id: "pdf04-19", title: "Рунная плита", description: "Подъёмная рама за две древесины переворачивает тяжёлую плиту с выбранного края. С обратной стороны открывается реликвия-табличка; пять и двенадцать уникальных находок повышают мастерство и снижают стоимость первых построек главы.", tags: ["pdf 04", "реликвии", "плита", "древесина"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 10", images: [{ id: "pdf04-09", src: "images/pdf04-09.webp" }]
  },
  {
    appearanceLevel: 99046,
    legacyTitle: "Саламандра отливает ключи на поле",
    shortDescription: "Отливает ключи или секатор прямо на поле",
    focus: { x: 72, y: 54 },
    id: "pdf04-20", title: "Кузница саламандры", description: "Одна древесина и один рубин запускают кузницу с конечным запасом металла. Первое соседнее открытие выбирает одну из двух форм: отлить два ключа или один медный секатор, снимающий слой лиан с видимой связной группы до трёх клеток.", tags: ["pdf 04", "ресурсы", "ключ", "лианы"], priority: "Средний", status: "Идея", source: "PDF 04 · Механики и метанаграды", origin: "04_field_mechanics_meta_rewards.pdf · стр. 11", images: [{ id: "pdf04-10", src: "images/pdf04-10.webp" }]
  },
  {
    appearanceLevel: 99047,
    legacyTitle: "Общая система запасов и метанаград",
    shortDescription: "Ресурсы и награды сохраняются между уровнями",
    focus: { x: 50, y: 50 },
    id: "pdf04-meta", title: "Запасы и метанаграды", icon: "✨",
    description: "Древесина, рубины и подходящие ключи хранятся между уровнями; клевер, световая нить, фонарик, конверт и секатор работают как расходники. Три поручения — восстановить лес, помочь обитателям и найти реликвии — дают конечные этапы удачи и мастерства. Удача предлагает выбор одного из двух заранее известных наборов, мастерство снижает цену первых построек новой главы, а собранные три фрагмента дают артефакт «Крюк-кошка». Все цены и замены наград показываются до оплаты.", tags: ["pdf 04", "мета", "награды", "ресурсы"], priority: "Средний", status: "Идея", source: "PDF 04 · Общая метасистема", origin: "04_field_mechanics_meta_rewards.pdf · стр. 12"
  }
];
