import Environment from '../model/enum/Environment';
import { createJourneyLevels } from './JourneyLevels';

export default class ForestEvent4Configuration {
    public static allForests = createJourneyLevels('event4', Environment.darkForest, 'dungeonJourneyScene', 'hexChest', [
        {"name":"Лестница под пнём","rows":["00ggg00","00gggg0","0gggg00","00gggg0","0gggg00","00ggg00"],"steps":14,"items":[{"name":"t1","count":5},{"name":"goldRoot","count":4}]},
        {"name":"Пыльные ступени","rows":["00ggg00","0gglgg0","0glgg00","00gglg0","0gggg00","00ggg00"],"steps":15,"items":[{"name":"t1","count":5},{"name":"t24","count":5}]},
        {"name":"Первый огонёк","rows":["0gggg00","glgggg0","0gglggg","ggllgg0","0gggg00"],"steps":16,"items":[{"name":"t24","count":5},{"name":"goldRoot","count":5}]},
        {"name":"Зал забытых фонарей","rows":["0gggg00","ggllgg0","0gggggg","ggllgg0","0gggg00"],"steps":15,"items":[{"name":"t24","count":5},{"name":"goldRoot","count":5}]},
        {"name":"Кладовая фонарей","rows":["0gggg00","ggplgg0","0glgggg","glpggg0","0gggg00"],"steps":17,"items":[{"name":"t1","count":5},{"name":"goldRoot","count":5}]},
        {"name":"Сломанный подъёмник","rows":["0gggg00","gpllgg0","0glplgg","ggplgg0","0gggg00"],"steps":18,"items":[{"name":"t25","count":6},{"name":"t1","count":5}]},
        {"name":"Каменные затворы","rows":["0gggg00","ggppgg0","0glplgg","ggppgg0","0gggg00"],"steps":18,"items":[{"name":"t1","count":6},{"name":"t25","count":5}]},
        {"name":"Каменный лабиринт","rows":["0gggg00","glpggg0","0gllpgg","gplllg0","0gggg00"],"steps":19,"items":[{"name":"t1","count":6},{"name":"t27","count":5}]},
        {"name":"Отражения в шахте","rows":["0gggg00","ggllgg0","0gmmlgg","glgmmg0","0gggg00"],"steps":18,"items":[{"name":"t27","count":6},{"name":"t24","count":5}]},
        {"name":"Шахта кристаллов","rows":["0gggg00","gglggg0","0glilgg","gglggg0","0gggg00"],"steps":17,"items":[{"name":"t27","count":6},{"name":"t24","count":5}]},
        {"name":"Кристальный мост","rows":["0gggg00","gllggg0","0gliigg","gglplg0","0gggg00"],"steps":19,"items":[{"name":"t27","count":7},{"name":"goldRoot","count":5}]},
        {"name":"Подземная река","rows":["0ggww00","ggwwgg0","0ggwwgg","ggwwgg0","0gggg00"],"steps":16,"items":[{"name":"t25","count":5},{"name":"lilly","count":5}]},
        {"name":"Переправа в темноте","rows":["0ggww00","glwwgg0","0gwwwgg","gglwwg0","0gggg00"],"steps":18,"items":[{"name":"lilly","count":5},{"name":"t25","count":5}]},
        {"name":"Страж книжных полок","rows":["0gggg00","gmmllg0","0gmmggg","glpggg0","0gggg00"],"steps":19,"items":[{"name":"t1","count":5},{"name":"t24","count":4}],"interactiveItems":[{"name":"book1","count":3}]},
        {"name":"Архив короля","rows":["0gggg00","ggmmgg0","0gmplmg","ggllgg0","0gggg00"],"steps":17,"items":[{"name":"t1","count":4},{"name":"t27","count":4}],"interactiveItems":[{"name":"book1","count":3}]},
        {"name":"Забытый указ короля","rows":["0gggg00","glmmgg0","0glmmgg","ggplgg0","0gggg00"],"steps":19,"items":[{"name":"t27","count":5},{"name":"goldRoot","count":4}],"interactiveItems":[{"name":"book1","count":3}]},
        {"name":"Королевская печать","rows":["0gggg00","gllpgg0","0gplggg","gglplg0","0gggg00"],"steps":20,"items":[{"name":"t25","count":6},{"name":"t27","count":6}]},
        {"name":"След из желе","rows":["0gggg00","ggcggg0","0gccggg","ggcggg0","0gggg00"],"steps":17,"items":[{"name":"t24","count":6},{"name":"goldRoot","count":4}],"jellyMushrooms":4},
        {"name":"Липкая галерея","rows":["0gggg00","glcggg0","0glcggg","ggllgg0","0gggg00"],"steps":19,"items":[{"name":"t24","count":6},{"name":"goldRoot","count":5}],"jellyMushrooms":2},
        {"name":"Эхо Булька","rows":["0gggg00","ggclgg0","0gccggg","glgllg0","0gggg00"],"steps":20,"items":[{"name":"goldRoot","count":6},{"name":"t25","count":5}],"jellyMushrooms":3},
        {"name":"Дверь сокровищницы","rows":["0gggg00","ggpplg0","0glplgg","glppgg0","0gggg00"],"steps":19,"items":[{"name":"t25","count":6},{"name":"t27","count":5}]},
        {"name":"Преддверие сокровищницы","rows":["0gggg00","ggccgg0","0gclcgg","glpclg0","0gggg00"],"steps":21,"items":[{"name":"t27","count":6},{"name":"goldRoot","count":5}],"jellyMushrooms":5},
        {"name":"Золотой блик в желе","rows":["0gggg00","glccgg0","0gccggg","gplggg0","0gggg00"],"steps":21,"items":[{"name":"goldRoot","count":7},{"name":"t24","count":5}],"jellyMushrooms":4},
        {"name":"Хранитель Бульк","rows":["0gggg00","ggccgg0","0gcccgg","ggccgg0","0gggg00"],"steps":19,"items":[{"name":"goldRoot","count":5},{"name":"t24","count":5}],"jellyMushrooms":7},
        {"name":"Корона в желе","rows":["0gggg00","ggccgg0","0gccggg","ggccgg0","0gggg00"],"steps":19,"items":[{"name":"goldRoot","count":6},{"name":"t27","count":4}],"jellyMushrooms":6}
    ]);
}
