import { WorldStat } from '../model/world/WorldState';
export interface WorldReward { energy?: number; gems?: number; wood?: number; clover?: number; item?: string; relationship?: string; relationshipXp?: number; }
export interface WardrobeItem { id:string; name:string; character:string; set:string; price:number; level:number; icon:string; bonuses?:{[stat:string]:number}; legacy?:string; }
export interface WorldEncounter { id:string; name:string; description:string; chapter:string; from:number; until:number; icon:string; mechanic?:string;
    choices:{text:string; stat?:WorldStat; required?:number; wood?:number; reward:WorldReward}[]; adventure?:string; persistent?:boolean; }
export interface CharacterAdventure { id:string; title:string; description:string; pair?:string; relationshipLevel?:number; levels:number; reward:WorldReward; }
export default class WorldConfiguration {
    public static statNames = {energy:'Выносливость',bravery:'Смелость',knowledge:'Интеллект',friendship:'Дружба',strength:'Сила',charm:'Обаяние',kindness:'Доброта'};
    public static stages = [{from:0,title:'Первый шаг'},{from:30,title:'Путешественник'},{from:70,title:'Защитник троп'},{from:120,title:'Хранитель леса'}];
    public static items: WardrobeItem[] = [
        {id:'redCloak',name:'Плащ путешественницы',character:'sveta',set:'forest',price:35,level:5,icon:'shopItem2',bonuses:{bravery:2}},
        {id:'trailLantern',name:'Лесной фонарь',character:'sveta',set:'forest',price:45,level:8,icon:'shopItem3',bonuses:{knowledge:2}},
        {id:'softBoots',name:'Походные сапоги',character:'sveta',set:'forest',price:50,level:12,icon:'shopItem4',bonuses:{energy:2,strength:1}},
        {id:'forestWreath',name:'Венок хранительницы',character:'sveta',set:'forest',price:0,level:20,icon:'shopItem1',bonuses:{kindness:2}},
        {id:'borisScarf',name:'Шарф Бориса',character:'boris',set:'cat',price:30,level:10,icon:'shopItem2',bonuses:{friendship:2}},
        {id:'borisCompass',name:'Компас любопытства',character:'boris',set:'cat',price:40,level:15,icon:'compass',bonuses:{knowledge:2}},
        {id:'borisVest',name:'Жилет следопыта',character:'boris',set:'cat',price:55,level:25,icon:'shopItem4',bonuses:{strength:2}},
        {id:'owlRibbon',name:'Лента Совёнка',character:'owl',set:'owl',price:35,level:15,icon:'shopItem2',bonuses:{charm:2}},
        {id:'owlNotebook',name:'Тетрадь наблюдений',character:'owl',set:'owl',price:45,level:22,icon:'diary',bonuses:{knowledge:3}},
        {id:'owlMantle',name:'Накидка исследователя',character:'owl',set:'owl',price:60,level:32,icon:'shopItem2',bonuses:{kindness:2}},
        {id:'leshyCharm',name:'Дубовый оберег',character:'leshy',set:'oak',price:40,level:32,icon:'shopItem1',bonuses:{strength:3}},
        {id:'leshyStaff',name:'Посох старой тропы',character:'leshy',set:'oak',price:65,level:42,icon:'shopItem3',bonuses:{knowledge:2}},
        {id:'leshyLeaves',name:'Плащ из листьев',character:'leshy',set:'oak',price:60,level:55,icon:'shopItem2',bonuses:{kindness:3}},
        {id:'crownOfDawn',name:'Венец рассвета',character:'sveta',set:'dawn',price:79,level:1,icon:'shopItem1',legacy:'crownOfDawn',bonuses:{knowledge:3,friendship:2}},
        {id:'keeperMantle',name:'Мантия хранителя',character:'sveta',set:'dawn',price:95,level:1,icon:'shopItem2',legacy:'keeperMantle',bonuses:{energy:3,kindness:2}},
        {id:'stormMace',name:'Посох грозы',character:'sveta',set:'dawn',price:105,level:1,icon:'shopItem3',legacy:'stormMace',bonuses:{strength:3,bravery:2}},
        {id:'titanBow',name:'Лук великана',character:'sveta',set:'dawn',price:115,level:1,icon:'shopItem4',legacy:'titanBow',bonuses:{strength:2,energy:2}},
        {id:'seasonCloak',name:'Плащ тихой реки',character:'sveta',set:'season',price:0,level:8,icon:'shopItem2',bonuses:{friendship:2,charm:2}},
        {id:'seasonRibbon',name:'Лента осеннего леса',character:'owl',set:'seasonOwl',price:0,level:8,icon:'shopItem1',bonuses:{knowledge:2}}
    ];
    public static relationships = [
        {id:'player:sveta',name:'Вы и Эмма',character:'sveta'},
        {id:'player:boris',name:'Вы и Борис',character:'boris'},
        {id:'player:owl',name:'Вы и Совёнок',character:'owl'},
        {id:'player:leshy',name:'Вы и Леший',character:'leshy'},
        {id:'sveta:boris',name:'Эмма и Борис',character:'boris'},
        {id:'sveta:owl',name:'Эмма и Совёнок',character:'owl'},
        {id:'boris:leshy',name:'Борис и Леший',character:'leshy'}
    ];
    public static relationshipThresholds = [0,20,55,100,160];
    public static recipes = {forestWreath:{wood:3,clover:2},owlRibbon:{wood:2,clover:1}};
    public static setScenes = {
        forest:{title:'Первый общий привал',text:'Эмма раскладывает фонарь, сапоги и венок у костра. Ещё недавно лес казался чужим. Теперь у неё есть вещи, друзья и своя история на тропе.'},
        cat:{title:'Компас для двоих',text:'Борис надевает шарф и кладёт компас в карман жилета. Он предлагает пометить на карте место, куда вы однажды вернётесь вместе.'},
        owl:{title:'Страница о дружбе',text:'Совёнок завязывает ленту на новой тетради. Среди наблюдений появляется запись о друзьях, которые помогают дождаться рассвета.'},
        oak:{title:'Голос старой рощи',text:'Леший собирает посох, оберег и плащ. Старые корни узнают его шаги; он благодарит вас за заботу о тех, кто живёт под их защитой.'},
        dawn:{title:'Обещание хранителя',text:'Эмма складывает четыре реликвии у древнего дуба. Их сила остаётся с ней, какой бы образ она ни выбрала. Теперь её обещание лесу хранит и путевая книга.'}
    };
    public static relationshipNames = ['Знакомство','Симпатия','Доверие','Близость','Преданность'];
    public static adventures: CharacterAdventure[] = [
        {id:'ghostDoor',title:'За призрачной дверью',description:'Старая библиотека хранит историю тропы. Восемь полян, записки и последняя печать.',levels:8,reward:{energy:30,item:'forestWreath'}},
        {id:'catTrail',title:'Тропа общих воспоминаний',description:'Борис вспоминает, почему оставил свой компас у старой реки.',pair:'sveta:boris',relationshipLevel:3,levels:12,reward:{gems:20,item:'borisVest',relationship:'sveta:boris',relationshipXp:20}},
        {id:'owlArchive',title:'Звёздная тетрадь Совёнка',description:'Помогите Совёнку собрать потерянные наблюдения у воды.',pair:'sveta:owl',relationshipLevel:4,levels:12,reward:{energy:40,item:'owlMantle',relationship:'sveta:owl',relationshipXp:25}}
    ];
    // All checks are optional. Failing a check consumes nothing and does not block a level.
    public static encounters: WorldEncounter[] = [
        {id:'shadowEcho',name:'Шорох за поворотом',chapter:'Первая тропа',from:6,until:9,icon:'actionChest',description:'За кустами слышится робкий голос. Смелый спутник может подойти ближе и помочь потерявшемуся лесному гостю.',choices:[{text:'Подойти на помощь',stat:'bravery',required:6,reward:{energy:5}},{text:'Позвать гостя на знакомый голос',stat:'friendship',required:4,reward:{energy:5}}]},
        {id:'windBridge',name:'Мост над корнями',chapter:'Ореховая тропа',from:12,until:17,icon:'actionChest',description:'Белка просит перенести припасы через шаткий мост. Походные вещи и немного выносливости помогут справиться без спешки.',choices:[{text:'Перенести припасы',stat:'energy',required:7,reward:{energy:5,wood:1}},{text:'Укрепить мост перед переходом',stat:'knowledge',required:7,reward:{energy:5,wood:1}}]},
        {id:'squirrelOak',name:'Белка у старого дуба',chapter:'Ореховая тропа',from:10,until:17,icon:'actionChest',mechanic:'base-b06-05',description:'Белка пытается донести жёлудь до дупла. Помогите ей выбрать надёжную ветку.',choices:[{text:'Подсказать безопасный путь',stat:'knowledge',required:9,reward:{wood:1,energy:5}},{text:'Поддержать ветку',stat:'strength',required:6,reward:{wood:1,energy:5}}]},
        {id:'scoutBranch',name:'Дупло разведчиц',chapter:'Цветочная опушка',from:27,until:34,icon:'hive',mechanic:'base-b01-09',description:'Пчёлы у сухой ветки выдают число закрытых цветов рядом. Совёнок предлагает сверить их с обычными следами находок.',choices:[{text:'Сопоставить два числа',stat:'knowledge',required:12,reward:{wood:1,energy:6}},{text:'Расспросить всех разведчиц',stat:'friendship',required:7,reward:{wood:1,energy:6}}]},
        {id:'rustlingHedgehog',name:'Шорох у корней',chapter:'Тихая роща',from:45,until:51,icon:'actionChest',mechanic:'base-b02-04',description:'Ёжик слышит шорох за листьями. Дайте ему время освоиться — он покажет короткую тропинку.',choices:[{text:'Позвать осторожно',stat:'friendship',required:10,reward:{wood:2,energy:5}},{text:'Подождать рядом в тишине',stat:'kindness',required:5,reward:{wood:2,energy:5}}]},
        {id:'pollenBorder',name:'Пыльца на границе',chapter:'Луговая развилка',from:64,until:71,icon:'chamomileSmall',mechanic:'base-b03-10',description:'Пыльца задержалась на границе листьев. Следы подсказывают, с какой стороны распустился цветок.',choices:[{text:'Проследить рисунок пыльцы',stat:'knowledge',required:15,reward:{energy:8}},{text:'Сверить следы с лесными жителями',stat:'friendship',required:8,reward:{energy:8}}]},
        {id:'frogPond',name:'Лягушка у пруда',chapter:'Кувшинковый берег',from:83,until:90,icon:'actionChest',mechanic:'base-b08-05',description:'Лягушка ждёт стрекоз у зарослей. Можно отвлечь её и спокойно провести друзей к воде.',choices:[{text:'Отвлечь рассказом',stat:'charm',required:8,reward:{wood:1,energy:7}},{text:'Показать игру солнечных бликов',stat:'knowledge',required:10,reward:{wood:1,energy:7}}]},
        {id:'butterflyCocoon',name:'Куколка на ветке',chapter:'Тёплая поляна',from:105,until:117,icon:'chamomileSmall',mechanic:'base-b07-06',description:'Старая ветка качается над поляной. Подготовьте куколке защищённое место для первого вылета.',choices:[{text:'Устроить тихое укрытие',stat:'kindness',required:8,reward:{energy:10,clover:1}},{text:'Укрепить ветку от ветра',stat:'knowledge',required:12,reward:{energy:10,clover:1}}]},
        {id:'owlCounter',name:'Ночная перекличка',chapter:'Звёздная опушка',from:132,until:137,icon:'diary',mechanic:'base-b08-10',description:'Сова сверяет числа и знакомые голоса. Точные наблюдения помогут ей завершить карту леса.',choices:[{text:'Помочь с наблюдениями',stat:'knowledge',required:20,reward:{energy:12}},{text:'Позвать знакомых ночных жителей',stat:'friendship',required:12,reward:{energy:12}}]},
        {id:'ghostDoor',name:'Призрачная дверь',chapter:'Тёмная опушка',from:18,until:26,icon:'actionDoor',persistent:true,adventure:'ghostDoor',description:'Цепи мерцают на старой двери. За ними — забытая библиотека. Дверь останется на тропе ещё два дня; основной путь открыт.',choices:[{text:'Прочитать печать',stat:'knowledge',required:12,reward:{energy:8}},{text:'Раздвинуть цепи',stat:'strength',required:10,reward:{energy:8}}]},
        {id:'giantJelly',name:'Голодная гига-желейка',chapter:'Луговая чаша',from:35,until:44,icon:'jellyMushroom',mechanic:'idea-18',description:'Два цветущих бутона манят желейку к чаше. Можно помочь ей найти обед — или осторожно оттеснить её от тропы.',choices:[{text:'Устроить приманку из бутонов',stat:'knowledge',required:13,reward:{energy:12,wood:1}},{text:'Оттеснить желейку',stat:'strength',required:12,reward:{energy:12,wood:1}},{text:'Успокоить голодного гостя',stat:'kindness',required:6,reward:{energy:12,wood:1}}]},
        {id:'leprechaunHome',name:'Домик у дуба',chapter:'Старая роща',from:52,until:63,icon:'actionDoor',mechanic:'pdf04-11',description:'Крышу перекосило после ветра. Две опоры из древесины вернут домику тепло, а хозяин поделится клевером.',choices:[{text:'Поставить опоры',wood:2,reward:{clover:1,energy:8}},{text:'Починить крепления',stat:'knowledge',required:15,reward:{clover:1,energy:8}}]},
        {id:'nutSafe',name:'Орех-сейф',chapter:'Ореховая тропа',from:72,until:82,icon:'actionChest',mechanic:'pdf04-13',description:'Выберите противоположные верёвки, чтобы раскрыть орех. Внутри — древесина для следующих встреч.',choices:[{text:'Установить распорку',wood:1,reward:{wood:2}},{text:'Найти слабую петлю',stat:'knowledge',required:17,reward:{wood:2}}]},
        {id:'unicornChain',name:'Единорог у поляны',chapter:'Светлая развилка',from:91,until:104,icon:'unicorn',mechanic:'pdf04-12',description:'Единорог запутался в двух цепях. Спокойный голос или точное движение помогут ему выйти на поляну.',choices:[{text:'Успокоить единорога',stat:'kindness',required:8,reward:{energy:15,clover:1}},{text:'Разомкнуть цепи',stat:'strength',required:16,reward:{energy:15,clover:1}}]},
        {id:'frozenChest',name:'Ледяной сундук',chapter:'Холодный ручей',from:118,until:131,icon:'actionChest',mechanic:'pdf04-14',description:'Три ледяных ребра скрывают старый сундук. Подготовьте жаровню или разберите узор инея.',choices:[{text:'Зажечь жаровню',wood:1,reward:{gems:5}},{text:'Растопить рунный узор',stat:'knowledge',required:20,reward:{gems:5}}]},
        {id:'salamanderForge',name:'Кузница саламандры',chapter:'Горячие корни',from:138,until:153,icon:'actionChest',mechanic:'pdf04-20',description:'Саламандра ищет помощника для лесной кузницы. Мастерство понадобится уже на следующем пути.',choices:[{text:'Помочь у горна',stat:'strength',required:18,reward:{wood:3,energy:10}},{text:'Разгадать чертёж',stat:'knowledge',required:22,reward:{wood:3,energy:10}}]}
    ];
    public static seasonRewards = [
        {points:5,free:{energy:15},premium:{gems:10}}, {points:15,free:{wood:3},premium:{energy:30}},
        {points:30,free:{item:'seasonCloak'},premium:{item:'seasonRibbon'}}, {points:50,free:{gems:10},premium:{energy:50}}
    ];
}
