import Environment from '../model/enum/Environment';
import { createJourneyLevels } from './JourneyLevels';

export default class ForestEvent5Configuration {
    public static allForests = createJourneyLevels('event5', Environment.flowerFields, 'balloonJourneyScene', 'pinkFlower', [
        {"name":"Взлётная поляна","rows":["0gggg00","mmgmmm0","0mggmmm","gggggg0","0gggg00"],"steps":14,"items":[{"name":"poleno","count":5},{"name":"lavanda","count":5}]},
        {"name":"Запасы для корзины","rows":["0gggg00","mmggmm0","0mggmmm","gglggg0","0gggg00"],"steps":15,"items":[{"name":"poleno","count":6},{"name":"lavanda","count":5}]},
        {"name":"Канаты и стропы","rows":["0gggg00","mmllmm0","0mglmmm","glgllg0","0gggg00"],"steps":16,"items":[{"name":"poleno","count":6},{"name":"wheat","count":5}]},
        {"name":"Ромашковый маяк","rows":["0gggg00","mmggmm0","0mllmmm","ggllgg0","0gggg00"],"steps":16,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":4}],"flowers":2},
        {"name":"Ромашковая посадка","rows":["0gggg00","mmgmmm0","0mggmmm","gglggg0","0gggg00"],"steps":16,"items":[{"name":"lavanda","count":5}],"flowers":3},
        {"name":"Новый порыв ветра","rows":["0gggg00","mmlgmm0","0mgmmmm","ggllgg0","0gggg00"],"steps":17,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":5}]},
        {"name":"Попутный ветер","rows":["0gggg00","mmllmm0","0mllmmm","ggllgg0","0gggg00"],"steps":16,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":5}]},
        {"name":"Тропа к лавандовому склону","rows":["0gggg00","mmglmm0","0mllmmm","glgllg0","0gggg00"],"steps":17,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":5}]},
        {"name":"Лавандовые террасы","rows":["0gggg00","mmgmmm0","0mglmmm","gllggg0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":8},{"name":"wheat","count":4}]},
        {"name":"Лавандовая посадка","rows":["0gggg00","mmgmmm0","0mllmmm","gglggg0","0gggg00"],"steps":16,"items":[{"name":"lavanda","count":9},{"name":"wheat","count":3}]},
        {"name":"Высота облаков","rows":["0gggg00","mmllmm0","0mglmmm","gglgig0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":6}]},
        {"name":"Облачный пролив","rows":["0gggg00","mmllmm0","0milmmm","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"wheat","count":6},{"name":"lavanda","count":5}]},
        {"name":"Ягодный ориентир","rows":["0gggg00","mmgmmm0","0mglmmm","gglggg0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":5}],"interactiveItems":[{"name":"bush","count":1}]},
        {"name":"Корзина для пикника","rows":["0gggg00","mmggmm0","0mllmmm","gllggg0","0gggg00"],"steps":18,"items":[{"name":"wheat","count":6},{"name":"lavanda","count":4}],"interactiveItems":[{"name":"bush","count":2}]},
        {"name":"Ягодная посадка","rows":["0gggg00","mmgmmm0","0mggmmm","gglggg0","0gggg00"],"steps":17,"items":[{"name":"wheat","count":4},{"name":"lavanda","count":4}],"interactiveItems":[{"name":"bush","count":2}]},
        {"name":"Вечерний поток","rows":["0gggg00","mmllmm0","0milmmm","glgllg0","0gggg00"],"steps":19,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":6}]},
        {"name":"Сумеречный перелёт","rows":["0gggg00","mmllmm0","0milmmm","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":5}]},
        {"name":"Огоньки под облаками","rows":["0gggg00","mmlgmm0","0mllmmm","gglggg0","0gggg00"],"steps":19,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":5}],"interactiveItems":[{"name":"moonflowerClosed","count":2}]},
        {"name":"К ночной поляне","rows":["0gggg00","mmglmm0","0milmmm","ggllgg0","0gggg00"],"steps":20,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Лунная посадка","rows":["0gggg00","mmllmm0","0milmmm","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":4},{"name":"wheat","count":4}],"interactiveItems":[{"name":"moonflowerClosed","count":3}]},
        {"name":"Высота над колокольчиками","rows":["0gggg00","mmgmmm0","0mlgmmm","glgllg0","0gggg00"],"steps":19,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":6}]},
        {"name":"Попутный звон","rows":["0gggg00","mmllmm0","0mggmmm","gglgig0","0gggg00"],"steps":20,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":6}]},
        {"name":"Звонкий перевал","rows":["0gggg00","mmgmmm0","0mllmmm","gglggg0","0gggg00"],"steps":17,"items":[{"name":"lavanda","count":6},{"name":"wheat","count":5}]},
        {"name":"Последний букет","rows":["0gggg00","mmglmm0","0mllmmm","gllggg0","0gggg00"],"steps":20,"items":[{"name":"lavanda","count":5},{"name":"wheat","count":5}],"flowers":3},
        {"name":"Праздник на лугу","rows":["0gggg00","mmllmm0","0mllmmm","ggllgg0","0gggg00"],"steps":18,"items":[{"name":"lavanda","count":4},{"name":"wheat","count":4}],"flowers":3}
    ]);
}
