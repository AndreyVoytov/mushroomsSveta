import Environment from '../model/enum/Environment';
import { createJourneyLevels } from './JourneyLevels';

export default class ForestEvent3Configuration {
    public static allForests = createJourneyLevels('event3', Environment.darkForest, 'mushroomJourneyScene', 'leaf3', [
        {"name":"Синяя шляпа","rows":["0gggg00","ggllgg0","0gllggg","ggllgg0","0wwww00"],"steps":15,"items":[{"name":"witchMushroom","count":6},{"name":"lilly","count":4}]},
        {"name":"Листья с росой","rows":["0ggww00","gglwwg0","0gllwgg","gggwwg0","0gggg00"],"steps":16,"items":[{"name":"lilly","count":4},{"name":"witchMushroom","count":5}]},
        {"name":"Ручей под синей шляпой","rows":["0ggww00","glwwgg0","0glwwgg","ggwwgg0","0gggg00"],"steps":16,"items":[{"name":"lilly","count":5},{"name":"witchMushroom","count":4}]},
        {"name":"Капли на мху","rows":["0gggg00","ggwwlg0","0glwwgg","gglwwg0","0gggg00"],"steps":17,"items":[{"name":"lilly","count":5},{"name":"witchMushroom","count":6}]},
        {"name":"Роса для Синего","rows":["0ggww00","ggwwgg0","0glwwgg","ggwwgg0","0gggg00"],"steps":16,"items":[{"name":"lilly","count":5},{"name":"witchMushroom","count":5}]},
        {"name":"Рыжий ворчун","rows":["0gggg00","gllggg0","0gllggg","gggllg0","0gggg00"],"steps":15,"items":[{"name":"amanita","count":6},{"name":"poleno","count":4}]},
        {"name":"Шуршащие корни","rows":["0gggg00","gllggg0","0glplgg","glgglg0","0gggg00"],"steps":17,"items":[{"name":"poleno","count":6},{"name":"amanita","count":5}]},
        {"name":"Упрямые коряги","rows":["0gggg00","glpggg0","0gllpgg","ggpllg0","0gggg00"],"steps":18,"items":[{"name":"poleno","count":7},{"name":"amanita","count":4}]},
        {"name":"Рыжая просека","rows":["0gggg00","gllpgg0","0gliigg","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"amanita","count":6},{"name":"poleno","count":5}]},
        {"name":"Корни Рыжего","rows":["0gggg00","gllplg0","0gllggg","gllplg0","0gggg00"],"steps":17,"items":[{"name":"poleno","count":6},{"name":"amanita","count":5}]},
        {"name":"Зелёный садовник","rows":["0gggg00","ggllgg0","0gllggg","ggllgg0","0gggg00"],"steps":16,"items":[{"name":"witchMushroom","count":5},{"name":"goldRoot","count":5}]},
        {"name":"Моховые ступени","rows":["0gggg00","ggllgg0","0glgglg","glgglg0","0gggg00"],"steps":17,"items":[{"name":"goldRoot","count":6},{"name":"witchMushroom","count":5}]},
        {"name":"Сад под землёй","rows":["0gggg00","glgllg0","0gillgg","gglgig0","0gggg00"],"steps":18,"items":[{"name":"goldRoot","count":5},{"name":"witchMushroom","count":6}]},
        {"name":"Свет по грибнице","rows":["0gggg00","gglggg0","0glilgg","gllggg0","0gggg00"],"steps":18,"items":[{"name":"goldRoot","count":4},{"name":"witchMushroom","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Сад Зелёного","rows":["0gggg00","gglggg0","0gllggg","gglggg0","0gggg00"],"steps":16,"items":[{"name":"witchMushroom","count":5},{"name":"goldRoot","count":3}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Лиловый соня","rows":["0gggg00","ggllgg0","0glilgg","ggllgg0","0wwww00"],"steps":17,"items":[{"name":"witchMushroom","count":7},{"name":"lilly","count":4}]},
        {"name":"Сонные кувшинки","rows":["0gggg00","ggllgg0","0glwwgg","ggwwlg0","0gggg00"],"steps":18,"items":[{"name":"lilly","count":4},{"name":"witchMushroom","count":6}]},
        {"name":"Лиловый туман","rows":["0ggww00","glgwwg0","0gliigg","ggwwgg0","0gggg00"],"steps":19,"items":[{"name":"lilly","count":5},{"name":"witchMushroom","count":5}]},
        {"name":"Лунные указатели","rows":["0gggg00","gllggg0","0glilgg","ggglgg0","0wwww00"],"steps":19,"items":[{"name":"lilly","count":4},{"name":"witchMushroom","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Луна для Лилового","rows":["0gggg00","ggllgg0","0glilgg","ggllgg0","0wwww00"],"steps":17,"items":[{"name":"lilly","count":4},{"name":"witchMushroom","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Золотой хранитель","rows":["0gggg00","gglggg0","0gliigg","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"goldRoot","count":6},{"name":"witchMushroom","count":5}]},
        {"name":"Пять корневых нитей","rows":["0gggg00","glgllg0","0glilgg","gllggg0","0gggg00"],"steps":19,"items":[{"name":"goldRoot","count":6},{"name":"witchMushroom","count":6}]},
        {"name":"Золотая тропа","rows":["0gggg00","gllpgg0","0gliigg","gglgig0","0gggg00"],"steps":20,"items":[{"name":"goldRoot","count":7},{"name":"witchMushroom","count":5}]},
        {"name":"Песня под шляпой","rows":["0gggg00","ggllgg0","0gilggg","glgllg0","0gggg00"],"steps":20,"items":[{"name":"goldRoot","count":5},{"name":"witchMushroom","count":5}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Сердце грибницы","rows":["0gggg00","gllglg0","0gllggg","glgllg0","0gggg00"],"steps":18,"items":[{"name":"witchMushroom","count":5},{"name":"goldRoot","count":5}],"interactiveItems":[{"name":"moonflowerClosed","count":2}]}
    ]);
}
