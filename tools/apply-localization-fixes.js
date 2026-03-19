const fs = require('fs');
const path = require('path');

const localizationDir = path.join(__dirname, '..', 'assets', 'localization');
const englishFallbackLanguages = new Set(['en', 'es', 'pt', 'ar', 'id', 'fr', 'ja', 'it', 'de', 'hi']);

const sharedFixes = {
    'ок': { en: 'OK', tr: 'OK' },
    'руб': { en: 'RUB', tr: 'RUB' },
    'Все': { en: 'Full', tr: 'Dolu' },
    'уровень': { en: 'level', tr: 'seviye' },
    'Набор походника': { en: "Camper\'s Pack", tr: 'Kampçı Seti' },
    'Сундук лесника': { en: "Forester\'s Chest", tr: 'Ormancı Sandığı' },
    'Единорог - естественный обитатель Тёмного леса. Приносит удачу.': {
        en: 'The unicorn is a natural inhabitant of the Dark Forest. It brings good luck.',
        tr: 'Tekboynuz, Karanlık Orman\'ın doğal sakinidir. Uğur getirir.'
    },
    'Волшебные бобы': { en: 'Magic Beans', tr: 'Sihirli Fasulyeler' },
    'Флакон радуги': { en: 'Rainbow Flask', tr: 'Gökkuşağı Şişesi' },
    'Волшебная перчатка': { en: 'Magic Glove', tr: 'Sihirli Eldiven' },
    'Заполняют пустые клетки\nростками с цифрой.': {
        en: 'Fill empty cells\nwith numbered sprouts.',
        tr: 'Boş hücreleri\nnumaralı filizlerle doldurur.'
    },
    'Вскрывает пять случайных клеток\nна поле.': {
        en: 'Reveals five random cells\non the board.',
        tr: 'Tahtadaki beş rastgele hücreyi\naçar.'
    },
    'Позволяет вскрыть любую клетку\nбез траты хода.': {
        en: 'Lets you reveal any cell\nwithout spending a move.',
        tr: 'Herhangi bir hücreyi\nhamle harcamadan açmanı sağlar.'
    },
    'Нажмите на клетку для вскрытия': {
        en: 'Tap a cell to reveal it',
        tr: 'Açmak için bir hücreye dokunun'
    },
    'Вот и отлично, наконец-то пообедаю!': {
        en: 'Great, now I can finally have lunch!',
        tr: 'Harika, sonunda öğle yemeğimi yiyebilirim!'
    },
    'Пропустить': { en: 'Skip', tr: 'Atla' },
    'ИГРАТЬ ЗА 100': { en: 'PLAY FOR 100', tr: '100 İÇİN OYNA' }
};

const englishReplicaFixes = {
    'О! Похоже, здесь ещё одна ~грибная полянка~ поблизости.': 'Oh! Looks like there is another ~mushroom glade~ nearby.',
    'Странно. Никогда здесь не была, а все кажется ~каким-то знакомым~.': 'Strange. I have never been here before, and yet everything feels ~somehow familiar~.',
    'Не удивлюсь, если в доме окажется тот ~старый сундук~, который мне вечно снится.': 'I would not be surprised if the house contains that ~old chest~ I keep dreaming about.',
    'Ключ был под половичком! Хозяева ~серьезно~ подумали о безопасности.': 'The key was under the doormat! The owners took security ~seriously~.',
    'Кажется, мы собрали все грибы! Теперь попробуем ~приготовить~ зелье!': 'Looks like we gathered all the mushrooms! Now let us try to ~brew~ a potion!',
    'Закидываем ~ингридиенты~ в котел... И немного ~поварим~...': 'Into the cauldron go the ~ingredients~... And now let us ~cook~ a little...',
    'Зелье проявило ~новую страницу~ в тетради! Это похоже на ~карту местности~!': 'The potion revealed a ~new page~ in the notebook! It looks like a ~map of the area~!',
    'Мяу!': 'Meow!',
    'Надо тебя накормить. У нас тут как раз есть ~бутылочка молока~.': 'We need to feed you. We happen to have a ~bottle of milk~ right here.',
    '...': '...',
    'Котёнок ~отказывается~ пить молоко, странно! Что ж, заглянем в тетрадь..': 'The kitten ~refuses~ to drink milk, strange! Well, let us look in the notebook..',
    'М-р-р-р-р!': 'Purr-r-r-r!',
    'Похоже, теперь котик хочет пить! А в тетрадке как раз есть рецепт, как ~напоить кота~!': 'Looks like the kitty is thirsty now! And the notebook happens to have a recipe for how to ~give a cat a drink~!',
    '@Здравствуй!@': '@Hello!@',
    'Здравствуй, ~Эм-ма~.. К сожалению, я не помню, кто я такой, и как меня зовут.': 'Hello, ~Em-ma~.. Unfortunately, I do not remember who I am or what my name is.',
    'У меня есть говорящий котик, который ~ничего не помнит~. Думаю, стоит снова заглянуть в тетрадку.': 'I have a talking kitty who ~remembers nothing~. I think it is worth checking the notebook again.',
    'Вперёд, за новыми ~ингридиентами~!': 'Forward, for more ~ingredients~!',
    'Я вспомнил свое имя; действительно ~Борис~. К вашим услугам!': 'I remembered my name; it really is ~Boris~. At your service!',
    'Вот ~зеркальце~, держи!': 'Here, take this ~little mirror~!',
    'ААААААААА! АААА! @Я кот!@ Какой ужас!': 'AAAAAAAA! AAAA! @I am a cat!@ This is awful!',
    'Благородный рыжий цвет, роскошные усы... Да я ~чертовски хорош собой~!': 'Noble ginger fur, luxurious whiskers... Why, I am ~devilishly handsome~!',
    'Вообще-то, знал. Пошутил просто.. Полагаю, в дневнике моей хозяйки открылась ~новая страница~.': 'Actually, I knew. I was just joking.. I suppose a ~new page~ opened in my mistress\'s diary.',
    'Продолжим восстановление памяти!': 'Let us continue restoring the memory!',
    'Вспоминаю хозяйку. Хорошая, добрая женщина. Кажется, она просила меня ~что-то кому-то передать~.': 'I remember my mistress. A good, kind woman. I think she asked me to ~deliver something to someone~.',
    'Не могу вспомнить. Но, похоже, это ~очень важно~.': 'I cannot remember. But it seems to be ~very important~.',
    'Последнее зелье ~полностью~ восстановит твою память!': 'The last potion will ~completely~ restore your memory!',
    'Вспомнил. Хозяйка сказала: ~Если я не вернусь до осени, проси помощи у Эм-ма~': 'I remember. The Mistress said: ~If I do not return by autumn, ask Em-ma for help~',
    'Надо выбираться отсюда поскорее.': 'We need to get out of here as soon as possible.',
    'Пока выхода из леса не видно...': 'There is still no way out of the forest in sight...',
    'Единорог скрылся из виду. Но лес здесь становится реже.': 'The unicorn disappeared from view. But the forest is getting thinner here.',
    'Похоже, я на ~правильном пути~!': 'Looks like I am on the ~right path~!',
    'Уф. Не знала, что буду так радоваться оказавшись в чаще ~нормального леса~!': 'Phew. I did not know I would be so happy to end up in a patch of ~normal forest~!',
    'Надо поискать чего-нибудь поесть.': 'I should look for something to eat.',
    'Теперь нужны ~поленья~, чтобы развести огонь.': 'Now we need ~firewood~ to light a fire.',
    'Я заблудилась и проголодалась. Только что вышла из мрачного леса и …': 'I got lost and hungry. I just came out of the dark forest and …',
    'Ну тогда всё ясно… Тебе нужно идти на север.': 'Well, then everything is clear… You need to go north.',
    'Ну, я попала в мрачный лес и …': 'Well, I got into the dark forest and …',
    'Знаю-знаю. Все слышали Легенду. Но я думал, что ~Великая Эм-ма~ выйдет из мрачного леса побыстрее...': 'Yes, yes. Everybody has heard the Legend. But I thought ~Great Em-ma~ would get out of the dark forest faster...',
    'У нас мало времени - нужно разыскать ~Совёнка~. Он - ключ ко всему!': 'We have little time - we need to find the ~Owlet~. He is the key to everything!',
    'Ну да. У Хозяйки был Совёнок. Когда все ~пошло кувырком~, он исчез. Теперь надо его разыскать!': 'Yes. The Mistress had an Owlet. When everything ~went topsy-turvy~, he disappeared. Now we have to find him!',
    'Ну, во-первых у него ~серьезный вид~. Во-вторых, он ~побольше~. Ну и еще - он носит ~розовые очки~!': 'Well, first of all he has a ~serious look~. Second, he is ~bigger~. And besides, he wears ~pink glasses~!',
    'Славный котик, как я рад тебя снова видеть. Ты так ~похорошел~!': 'Dear kitty, I am so glad to see you again. You look so ~much better~!',
    'Друзья, я думаю, нам надо спросить об этом у ~Хрустального Шара~. Он хранится на чердаке.': 'Friends, I think we should ask the ~Crystal Sphere~ about it. It is kept in the attic.',
    'Милый чердачок! Ну что ж, на поиски.': 'What a lovely attic! Well then, let us search.',
    'Простите меня, любимые друзья, сейчас я буду читать тайные заклинания. Шар по-другому ~не понимает~.': 'Forgive me, dear friends, I am about to recite secret spells. The Sphere ~does not understand~ any other way.',
    '@Okey-Google! Find-our-Mistress!@': '@Okay-Google! Find-our-Mistress!@',
    '@...@': '@...@',
    '@Zoom-In please!@': '@Zoom-In please!@',
    '~Хозяйка!~ Эк, куда ее занесло!': '~The Mistress!~ My, she has been carried far away!',
    'Дааа… Далековато… Пешком туда не дойти. Тут ~сапоги~ нужны! Где-то на чердаке была пара марки ~"Скороходы"~': 'Yeees... That is far away... We cannot get there on foot. We need ~boots~! There used to be a pair in the attic called ~"Swift Boots"~.',
    'Мне кажется, добрый Леший знал, ~как зарядить сапоги~. Давайте отправимся к нему!': 'I think good old Leshy knew ~how to recharge the boots~. Let us go to him!',
    'Да так. Из вежливости. Удачи тебе!': 'Oh, nothing. Just being polite. Good luck to you!',
    'Странное дело - никогда раньше не встречал эту белку в нашем лесу.': 'Strange - I have never seen this squirrel in our forest before.',
    '..Ага, вот! Рецепт ~зарядного зелья~. Сам я такое сварить не могу. Тут особый дар нужен!': '..Aha, here! The recipe for a ~charging potion~. I cannot brew such a thing myself. It takes a special gift!',
    'Спасибо за рецепт, господин Леший! А теперь поспешим, друзья. Нужно скорее ~спасать Хозяйку~!': 'Thank you for the recipe, Mr. Leshy! Now let us hurry, friends. We must ~save the Mistress~ as soon as possible!',
    'Предлагаю план: Совёнок, ты ~изучай маршрут~. Кот, ты ~готовь припасы~. А я пока ~наберу корешков~ для зелья.': 'I have a plan: Owlet, you ~study the route~. Cat, you ~prepare the supplies~. I will ~gather roots~ for the potion in the meantime.',
    'Все ~ингредиенты собраны~! Не будем терять времени - закидываем сапоги в котел!': 'All the ~ingredients are gathered~! Let us not waste time - into the cauldron go the boots!',
    'Отлично! Заряда хватит ~вёрст на триста~… Потом надо будет снова заряжать.': 'Great! The charge will last for ~three hundred versts~… Then we will have to recharge them again.',
    'Возьмём с собой припасы: мешочек муки, баночку варенья и походный котелок. Остальное ~найдем в дороге~!': 'Let us take supplies with us: a sack of flour, a jar of jam, and a camping cauldron. We will ~find the rest on the road~!',
    'Я подготовил карту. Палаткой отмечены места стоянок. Нас ждёт ~большое приключение~!': 'I prepared a map. The campsites are marked with tents. A ~great adventure~ awaits us!',
    'Что то я проголодался!': 'I am getting hungry!',
    'Подожди до ~привала~. На привале поедим.': 'Wait until the ~rest stop~. We will eat then.',
    'Уже почти пришли!': 'We are almost there!',
    'Простите, друзья.. Я ~случайно ~съел всю нашу муку.': 'Sorry, friends.. I ~accidentally ~ate all our flour.',
    'Есть идея! Наберём ~колосков~ в округе и ~перемелем~ их с помощью заброшенной водяной мельницы, что виднеется позади': 'I have an idea! Let us gather some ~ears of wheat~ nearby and ~grind~ them with that abandoned watermill over there.',
    'Отлично, ~запасы пополнены~! Пора отправляться в путь.': 'Great, our ~supplies are replenished~! Time to move on.',
    'Только теперь муку буду нести я.': 'From now on, I will carry the flour.',
    'Отлично, ~сапоги заряжены~, палатка собрана. Пора отправляться!': 'Great, the ~boots are charged~, the tent is packed. Time to go!',
    'Внимание, друзья! Входим в ~Темный лес~. Будьте начеку.': 'Attention, friends! We are entering the ~Dark Forest~. Stay alert.',
    'Что-то мне здесь не нравится..': 'I do not like it here..',
    '@Агрх-хр-хр-хрррр!@': '@Aargh-khr-khr-khrrrr!@',
    'ААААААА!': 'AAAAAAA!',
    'Не хотел вас напугать. Но у меня ~горе~ Я потерял свою любимую волторну! C одним глазом никак её не отыскать.': 'I did not mean to scare you. But I am in ~trouble~. I lost my beloved french horn! With one eye I just cannot find it.',
    'Давайте мы вам поможем!': 'Let us help you!',
    'Нет, это виолончель. А мой инструмент - ~духовой~!': 'No, that is a cello. And my instrument is a ~wind instrument~!',
    'Теплее! Но это всё же не валторна. Это обыкновенная ~труба~.': 'Warmer! But that still is not a french horn. It is an ordinary ~trumpet~.',
    'Вот ваша ~валторна~, господин Циклоп!': 'Here is your ~french horn~, Mr. Cyclops!',
    'Большое спасибо! Я снова могу ~играть~! Давайте я провожу вас до края тёмного леса.': 'Thank you so much! I can ~play~ again! Let me guide you to the edge of the dark forest.',
    'В знак благодарности за то, что помогли мне - вот вам ~ведро клубники~. Прощайте!': 'As thanks for helping me - here is a ~bucket of strawberries~. Farewell!',
    'Ух-ты, здорово!': 'Wow, awesome!',
    'Тем временем сапоги снова разрядились. Совсем не держат заряд!': 'Meanwhile, the boots ran out of charge again. They hardly hold any charge at all!',
    'Половина пути позади! Дальше наш путь пролегает через ~Цветочную долину~.': 'Half the journey is behind us! Next our path leads through ~Flower Valley~.',
    'Ух ты! Я никогда не бывал в цветочной долине, но говорят, там - ~красиво~!': 'Wow! I have never been to Flower Valley, but they say it is ~beautiful~ there!',
    'В любом случае, будем сохранять бдительность, друзья!': 'In any case, let us stay vigilant, friends!',
    'Здесь действительно ~красиво~!': 'It really is ~beautiful~ here!',
    'Похоже, я зря беспокоился. Полечу на ~разведку~. Посмотрю, что есть интересного впереди!': 'Looks like I worried for nothing. I will fly ~scouting ahead~ and see what interesting things lie before us!',
    'Что-то совёнок ~долго~ не возвращается.': 'The owlet is taking a ~long~ time to come back.',
    'Смотри, там какие-то ~чудики~. Спросим у них дорогу!': 'Look, there are some ~weird little folks~ over there. Let us ask them the way!',
    'Привет! Мы ~гномики~, мы знаем эти края очень хорошо. Мы подскажем вам путь.': 'Hello! We are ~gnomes~, and we know these lands very well. We will show you the way.',
    'Но прежде посмотрите, какую ~шикарную птицу~ мы сегодня поймали! Она будет петь для нас!': 'But first look what a ~magnificent bird~ we caught today! It will sing for us!',
    'Друзья, помогите!': 'Friends, help!',
    'Но ведь эта птица не умеет петь, это ~совёнок~. А вам нужен ~соловей~!': 'But this bird cannot sing, it is an ~owlet~. What you need is a ~nightingale~!',
    'Раз птица - значит ~должна петь~. Отдадим вашу птицу только в обмен на соловья, и точка!': 'If it is a bird, it ~must sing~. We will only give your bird back in exchange for a nightingale, and that is final!',
    'Мы нашли вам замену для соловья. Это ~Магнитофон~!': 'We found a replacement for the nightingale. It is a ~Tape Recorder~!',
    '~Странно~, он не похож на птицу...': '~Strange~, it does not look like a bird...',
    'Это намного ~лучше птицы~! Ваша птица свободна. А путь ваш лежит к тем горам, что виднеются вдали.': 'It is ~much better than a bird~! Your bird is free. And your path lies toward those mountains in the distance.',
    'Спасибо друзья, что выручили. Теперь я не буду далеко улетать от вас!': 'Thank you, friends, for rescuing me. Now I will not fly far away from you again!',
    'И вновь продолжается путь!': 'And the journey continues once more!',
    'И сердцу тревожно в груди!': 'And the heart feels anxious in the chest!',
    'Надеюсь, на этот раз заряда хватит до самого конца!': 'I hope this time the charge lasts all the way to the end!',
    'Остался последний отрезок пути. Мы ~почти у цели~.': 'There is only one last stretch left. We are ~almost there~.',
    'Скоро узнаем. Вперёд!': 'We will know soon. Forward!'
};

function normalize(value) {
    return value
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]*\n[ \t]*/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
}

function removeCorruptedKeys(translations) {
    Object.keys(translations).forEach(key => {
        if (key.indexOf('?') === -1) {
            return;
        }

        if (/[A-Za-zА-Яа-яЁёÇĞİÖŞÜçğıöşü]/.test(key)) {
            return;
        }

        delete translations[key];
    });
}

function upsertNormalized(translations, source, target) {
    const normalizedSource = normalize(source);
    Object.keys(translations).forEach(key => {
        if (normalize(key) === normalizedSource) {
            delete translations[key];
        }
    });
    translations[normalizedSource] = target;
}

function applySharedFixes(bundle) {
    Object.keys(sharedFixes).forEach(source => {
        const entry = sharedFixes[source];
        const value = bundle.language === 'tr' ? entry.tr : entry.en;
        upsertNormalized(bundle.translations, source, value);
    });
}

function applyEnglishReplicaFixes(bundle) {
    Object.keys(englishReplicaFixes).forEach(source => {
        upsertNormalized(bundle.translations, source, englishReplicaFixes[source]);
    });
}

function sortTranslations(translations) {
    const sorted = {};
    Object.keys(translations)
        .sort((a, b) => a.localeCompare(b, 'ru'))
        .forEach(key => {
            sorted[key] = translations[key];
        });
    return sorted;
}

fs.readdirSync(localizationDir)
    .filter(name => name.endsWith('.json'))
    .forEach(fileName => {
        const fullPath = path.join(localizationDir, fileName);
        const bundle = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        if (bundle.language === 'ru') {
            return;
        }

        bundle.translations = bundle.translations || {};
        removeCorruptedKeys(bundle.translations);
        applySharedFixes(bundle);

        if (englishFallbackLanguages.has(bundle.language)) {
            applyEnglishReplicaFixes(bundle);
        }

        bundle.translations = sortTranslations(bundle.translations);
        fs.writeFileSync(fullPath, JSON.stringify(bundle, null, 4) + '\n', 'utf8');
        console.log('updated ' + fileName + ' -> ' + Object.keys(bundle.translations).length + ' keys');
    });
