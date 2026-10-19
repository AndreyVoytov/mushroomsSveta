export interface RelationshipStep { title: string; xp: number; kind: 'line'|'scene'|'gift'; reply: string; }
export interface CompanionStory { gift: string; giftName: string; giftDescription: string; wood: number; clover: number; room: string; dream: string; welcome: string; thanks: string; artifact: string; }

export default class RelationshipConfiguration {
    public static companions: { [id: string]: CompanionStory } = {
        sveta: {gift:'pressedFlowers',giftName:'Букет лесных цветов',giftDescription:'Цветы в плетёном кольце — память о первой поляне.',wood:1,clover:0,room:'Мансарда Эммы',dream:'Я мечтаю собрать карту мест, где нас всегда будут ждать.',welcome:'С тобой даже незнакомая тропа становится немного домашней.',thanks:'Ты запомнил мои любимые цветы! Сохраню их между страницами карты.',artifact:'Фонарь возвращения'},
        boris: {gift:'ribbonBall',giftName:'Клубок с лентой',giftDescription:'Мягкий клубок с клеверной ленточкой для любопытного следопыта.',wood:1,clover:0,room:'Уголок Бориса',dream:'Хочу место у окна, где можно слушать дождь и рассказывать о наших вылазках.',welcome:'Мур-р. Я как раз оставил тебе место рядом.',thanks:'Этот клубок теперь мой талисман! Только никому про ленточку.',artifact:'Компас тёплых троп'},
        owl: {gift:'starNotebook',giftName:'Звёздная тетрадь',giftDescription:'Переплёт из коры и клеверная закладка для ночных наблюдений.',wood:1,clover:1,room:'Обсерватория Совёнка',dream:'Хочу составить атлас звёзд, которые видны только из нашего леса.',welcome:'Я записал любопытное наблюдение. Ты всегда приходишь вовремя.',thanks:'Настоящая тетрадь для атласа! Первую страницу посвящу нам.',artifact:'Звёздный светильник'},
        leshy: {gift:'oakCharm',giftName:'Дубовый оберег',giftDescription:'Вырезанный вручную лист с живой клеверной сердцевиной.',wood:2,clover:1,room:'Дом у корней',dream:'Пусть в доме будет уголок для каждого, кто устал в дороге.',welcome:'Старый дуб узнал твои шаги. Проходи, здесь спокойно.',thanks:'В этом листе чувствуется забота. Дуб будет хранить его вместе со мной.',artifact:'Сад памяти'}
    };
    public static steps: RelationshipStep[] = [
        {title:'Первое обещание',xp:0,kind:'line',reply:'Спасибо, что спросил. Мне важно знать, что мы идём рядом.'},
        {title:'Место для нашей истории',xp:20,kind:'scene',reply:'Теперь ты знаешь мою маленькую мечту.'},
        {title:'Подарок со смыслом',xp:55,kind:'gift',reply:'Я сохраню его. Ты умеешь замечать важное.'},
        {title:'Огонёк в окне',xp:100,kind:'scene',reply:'Вместе мы сделали этот дом теплее.'},
        {title:'Здесь тебя всегда ждут',xp:160,kind:'scene',reply:'У этого дома теперь две истории. И одна открытая дверь.'}
    ];
}
