import Environment from '../model/enum/Environment';
import { createJourneyLevels } from './JourneyLevels';

export default class ForestEvent2Configuration {
    public static allForests = createJourneyLevels('event2', Environment.lake, 'riverJourneyScene', 'leaf1', [
        {"name":"Пиратская пристань","rows":["0gggg00","gggwwg0","0ggwwwg","gggwwg0","0gggg00"],"steps":14,"items":[{"name":"poleno","count":6},{"name":"mushroom","count":4}]},
        {"name":"Верёвки для плота","rows":["0gggg00","glggwg0","0ggwwwg","gglwwg0","0gggg00"],"steps":15,"items":[{"name":"poleno","count":5},{"name":"mushroom","count":5}]},
        {"name":"Первый речной поворот","rows":["0ggww00","ggwwgg0","0ggwwwg","gggwwg0","0gggg00"],"steps":15,"items":[{"name":"lilly","count":4},{"name":"poleno","count":5}]},
        {"name":"Камышовый рукав","rows":["0ggww00","gggwww0","0glwwgg","gglwwg0","0ggwwgg","0gggg00"],"steps":15,"items":[{"name":"lilly","count":5},{"name":"poleno","count":5}]},
        {"name":"Кувшинковый пролив","rows":["0ggww00","gwwwwg0","0gwwwgg","gglwwg0","0gggg00"],"steps":16,"items":[{"name":"lilly","count":6},{"name":"mushroom","count":4}]},
        {"name":"Письмо под корягой","rows":["0gggg00","glgwwg0","0glwwwg","gggwwg0","0gggg00"],"steps":16,"items":[{"name":"goldRoot","count":5},{"name":"poleno","count":5}]},
        {"name":"Бутылочная почта","rows":["0gggg00","ggwwwg0","0gwwwwg","ggwwwg0","0gggg00"],"steps":14,"items":[{"name":"lilly","count":5},{"name":"goldRoot","count":4}]},
        {"name":"Заводь старого мельника","rows":["0ggww00","gggwwg0","0glwwgg","glggwg0","0gggg00"],"steps":16,"items":[{"name":"lilly","count":5},{"name":"poleno","count":5}]},
        {"name":"Запруда у колеса","rows":["0gggg00","gllwwg0","0gpwwgg","glggwg0","0gggg00"],"steps":17,"items":[{"name":"poleno","count":6},{"name":"mushroom","count":5}]},
        {"name":"Старая мельница","rows":["0gggg00","glpwwg0","0glwwgg","glpwwg0","0ggwwgg","0gggg00"],"steps":16,"items":[{"name":"poleno","count":7},{"name":"mushroom","count":4}]},
        {"name":"Песчаный причал","rows":["0ggww00","ggwwgg0","0gwwwgg","ggggwg0","0gggg00"],"steps":17,"items":[{"name":"lilly","count":4},{"name":"goldRoot","count":5}],"interactiveItems":[{"name":"shell","count":2}]},
        {"name":"Жемчужная отмель","rows":["0ggww00","ggwwww0","0gwwwwg","ggwwww0","0ggww00"],"steps":15,"items":[{"name":"lilly","count":4},{"name":"mushroom","count":4}],"interactiveItems":[{"name":"shell","count":3}]},
        {"name":"Речной тайник","rows":["0gggg00","glgwwg0","0glwwgg","gglwwg0","0ggww00","0gggg00"],"steps":17,"items":[{"name":"goldRoot","count":6},{"name":"poleno","count":5}]},
        {"name":"Ивовая протока","rows":["0gggg00","gllwwg0","0glwwgg","glgwwg0","0gggg00"],"steps":18,"items":[{"name":"poleno","count":6},{"name":"mushroom","count":5}]},
        {"name":"Мост из корней","rows":["0gggg00","gglwwg0","0llwwgg","gllwwg0","0ggwwgg","0gggg00"],"steps":16,"items":[{"name":"poleno","count":6},{"name":"goldRoot","count":5}]},
        {"name":"Швартовка у корней","rows":["0gggg00","glpwwg0","0gllwgg","gplwwg0","0gggg00"],"steps":18,"items":[{"name":"poleno","count":7},{"name":"goldRoot","count":4}]},
        {"name":"Тихий водоворот","rows":["0gggg00","ggwwwg0","0gwwwgg","ggwwwg0","0gggg00"],"steps":15,"items":[{"name":"lilly","count":6},{"name":"mushroom","count":5}]},
        {"name":"Карта течений","rows":["0ggww00","glwwwg0","0ggwwgg","gggwwg0","0gggg00"],"steps":17,"items":[{"name":"lilly","count":6},{"name":"goldRoot","count":5}]},
        {"name":"Светлячковый рукав","rows":["0gggg00","glgwwg0","0ggwwwg","gglwwg0","0gggg00"],"steps":18,"items":[{"name":"goldRoot","count":5},{"name":"lilly","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":2}]},
        {"name":"Остров фонарей","rows":["0wwgg00","wwwggg0","0wwlggg","wwwlgg0","0wwggg0","0gggg00"],"steps":16,"items":[{"name":"goldRoot","count":5},{"name":"lilly","count":5}],"interactiveItems":[{"name":"moonflowerClosed","count":2}]},
        {"name":"Ночной причал","rows":["0gggg00","gglwwg0","0glwwgg","glgwwg0","0gggg00"],"steps":18,"items":[{"name":"poleno","count":5},{"name":"goldRoot","count":5}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Пиратские вехи","rows":["0gggg00","glpwwg0","0gllwgg","glgwwg0","0gggg00"],"steps":19,"items":[{"name":"poleno","count":6},{"name":"goldRoot","count":6}]},
        {"name":"Последний крестик","rows":["0gggg00","glpwwg0","0glwwgg","gllwwg0","0ggwwgg","0gggg00"],"steps":17,"items":[{"name":"poleno","count":6},{"name":"goldRoot","count":6}]},
        {"name":"Ключ от капитанского сундука","rows":["0gggg00","gllpgg0","0glglgg","gpgllg0","0gggg00"],"steps":19,"items":[{"name":"goldRoot","count":7},{"name":"mushroom","count":5}]},
        {"name":"Сундук капитана","rows":["0gggg00","ggllgg0","0glplgg","ggllgg0","0gggg00"],"steps":16,"items":[{"name":"goldRoot","count":7},{"name":"mushroom","count":5}]}
    ]);
}
