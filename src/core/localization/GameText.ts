import BoosterType from '../model/enum/BoosterType';
import AimType from '../model/enum/AimType';
import LocalizationService, { SupportedTextLanguage } from './LocalizationService';

interface AimLike {
    type: AimType;
    image: string;
    countLeft: number;
}

interface CountForms {
    ru: [string, string, string];
    en: [string, string];
    tr: string;
}

export default class GameText {

    private static get language(): SupportedTextLanguage {
        return LocalizationService.getTextLanguage();
    }

    public static loading(): string {
        switch (this.language) {
            case 'tr':
                return 'Yükleniyor...';
            case 'en':
                return 'Loading...';
            default:
                return 'Загрузка...';
        }
    }

    public static tapToContinue(): string {
        switch (this.language) {
            case 'tr':
                return 'devam etmek için dokun';
            case 'en':
                return 'tap to continue';
            default:
                return 'нажмите для продолжения';
        }
    }

    public static level(level: number, isHard?: boolean): string {
        if (this.language === 'tr') {
            return isHard ? 'Zor Seviye ' + level : 'Seviye ' + level;
        }
        if (this.language === 'en') {
            return isHard ? 'Hard Level ' + level : 'Level ' + level;
        }
        return isHard ? 'Сложный уровень ' + level : 'Уровень ' + level;
    }

    public static chooseBoosters(): string {
        switch (this.language) {
            case 'tr':
                return 'Güçlendiricileri seçin:';
            case 'en':
                return 'Choose boosters:';
            default:
                return 'Выберите бустеры:';
        }
    }

    public static currentLimit(limit: number): string {
        switch (this.language) {
            case 'tr':
                return 'Geçerli limit: ' + limit;
            case 'en':
                return 'Current limit: ' + limit;
            default:
                return 'Текущий лимит: ' + limit;
        }
    }

    public static friendsInGame(count: number): string {
        switch (this.language) {
            case 'tr':
                return 'Oyundaki arkadaşlar: ' + count;
            case 'en':
                return 'Friends in game: ' + count;
            default:
                return 'Друзей в игре: ' + count;
        }
    }

    public static restoreFor(price: number): string {
        switch (this.language) {
            case 'tr':
                return price + ' karşılığında yenile     ';
            case 'en':
                return 'Restore for ' + price + '     ';
            default:
                return 'Восстановить за ' + price + '     ';
        }
    }

    public static inviteFriendsInfo(friendTarget: number, targetLimit: number): string {
        switch (this.language) {
            case 'tr':
                return 'Oyuna ' + friendTarget + ' arkadaş davet et ve can limitini ' + targetLimit + ' seviyesine çıkar!';
            case 'en':
                return 'Invite ' + friendTarget + ' friends to the game and increase your life limit to ' + targetLimit + '!';
            default:
                return 'Пригласите в игру ' + friendTarget + ' ' + this.countWord(friendTarget, {
                    ru: ['друга', 'друга', 'друзей'],
                    en: ['friend', 'friends'],
                    tr: 'arkadaş'
                }) + ' и лимит жизней возрастёт до ' + targetLimit + '!';
        }
    }

    public static dailyGiftText(count: number): string {
        switch (this.language) {
            case 'tr':
                return 'Şunu alıyorsunuz\n ~' + count + ' elmas~';
            case 'en':
                return 'You receive\n ~' + count + ' gems~';
            default:
                return 'Вы получаете \n ~' + count + ' самоцветов~';
        }
    }

    public static shareInviteText(): string {
        switch (this.language) {
            case 'tr':
                return 'Merhaba! Yeni oyundaki maceraya katıl!';
            case 'en':
                return 'Hi! Join the adventure in the new game!';
            default:
                return 'Привет! Прими участие в приключениях в новой игре!';
        }
    }

    public static supportMessage(email: string): string {
        switch (this.language) {
            case 'tr':
                return 'Lütfen oyundaki hataları\n şu adrese bildirin\n ~' + email + '~';
            case 'en':
                return 'Please report any\n game issues to\n ~' + email + '~';
            default:
                return 'Пожалуйста, сообщайте об \n ошибках в игре на почту \n ~' + email + '~';
        }
    }

    public static purchaseReward(name: string): string {
        switch (this.language) {
            case 'tr':
                return 'Kazandığınız\n ~' + name + '~';
            case 'en':
                return 'You receive\n ~' + name + '~';
            default:
                return 'Вам достается\n ~' + name + '~';
        }
    }

    public static gems(count: number): string {
        return count + ' ' + this.countWord(count, {
            ru: ['самоцвет', 'самоцвета', 'самоцветов'],
            en: ['gem', 'gems'],
            tr: 'elmas'
        });
    }

    public static buySetDescription(gems: number, boosters: { type: BoosterType, count: number }[]): string {
        let result: string;
        switch (this.language) {
            case 'tr':
                result = 'Paketin içinde ' + gems + ' elmas var';
                break;
            case 'en':
                result = 'This pack includes ' + gems + ' gems';
                break;
            default:
                result = 'В набор входит ' + gems + ' самоцветов';
                break;
        }

        boosters.forEach(booster => {
            result += ', ' + booster.count + ' ' + this.boosterPlural(booster.type, booster.count);
        });

        return result;
    }

    public static buyName(gems: number): string {
        return this.gems(gems);
    }

    public static remainShort(time: number): string {
        const diff = Math.max(0, time - Date.now());
        const seconds = Math.round(diff / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (days > 0) {
            return days + ' ' + this.countWord(days, {
                ru: ['день', 'дня', 'дней'],
                en: ['day', 'days'],
                tr: 'gün'
            });
        }

        if (hours > 0) {
            return hours + ' ' + this.countWord(hours, {
                ru: ['час', 'часа', 'часов'],
                en: ['hour', 'hours'],
                tr: 'saat'
            });
        }

        if (minutes > 0) {
            if (this.language === 'tr') {
                return minutes + ' dk.';
            }
            if (this.language === 'en') {
                return minutes + ' min.';
            }
            return minutes + ' мин.';
        }

        if (this.language === 'tr') {
            return seconds + ' sn.';
        }
        if (this.language === 'en') {
            return seconds + ' sec.';
        }
        return seconds + ' сек.';
    }

    public static remain(time: number): string {
        const diff = Math.max(0, time - Date.now());
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            if (this.language === 'tr') {
                return days + 'g. ' + (hours - days * 24) + 's.';
            }
            if (this.language === 'en') {
                return days + 'd. ' + (hours - days * 24) + 'h.';
            }
            return days + 'д. ' + (hours - days * 24) + 'ч.';
        }

        if (hours > 0) {
            if (this.language === 'tr') {
                return hours + 's. ' + (minutes - hours * 60) + 'dk.';
            }
            if (this.language === 'en') {
                return hours + 'h. ' + (minutes - hours * 60) + 'm.';
            }
            return hours + 'ч. ' + (minutes - hours * 60) + 'м.';
        }

        if (minutes > 0) {
            if (this.language === 'tr') {
                return minutes + 'dk. ' + (seconds - minutes * 60) + 'sn.';
            }
            if (this.language === 'en') {
                return minutes + 'm. ' + (seconds - minutes * 60) + 's.';
            }
            return minutes + 'м. ' + (seconds - minutes * 60) + 'с.';
        }

        if (this.language === 'tr') {
            return seconds + ' sn.';
        }
        if (this.language === 'en') {
            return seconds + ' sec.';
        }
        return seconds + ' сек.';
    }

    public static remainUntil(date: Date): string {
        return this.remain(date.getTime());
    }

    public static aimInfo(aim: AimLike): string {
        if (this.language === 'tr') {
            return (aim.type === AimType.ladybug ? 'Aşağı indirin ' : 'Bulun ') + aim.countLeft + ' ' + this.aimWord(aim);
        }
        if (this.language === 'en') {
            return (aim.type === AimType.ladybug ? 'Guide down ' : 'Find ') + aim.countLeft + ' ' + this.aimWord(aim);
        }
        return (aim.type === AimType.ladybug ? 'Спустите ' : 'Найдите ') + aim.countLeft + ' ' + this.aimWord(aim);
    }

    public static completeAimInfo(aims: AimLike[]): string {
        if (aims.length > 1) {
            if (this.language === 'tr') {
                return 'Tüm hedefler tamamlandı!';
            }
            if (this.language === 'en') {
                return 'All goals completed!';
            }
            return 'Все цели достигнуты!';
        }

        const aim = aims[0];
        if (aim.type === AimType.ladybug) {
            if (aim.image === 'ladybug') {
                if (this.language === 'tr') {
                    return aim.countLeft === 1 ? 'Uğur böceği geçirildi!' : 'Tüm uğur böcekleri geçirildi!';
                }
                if (this.language === 'en') {
                    return aim.countLeft === 1 ? 'Ladybug delivered!' : 'All ladybugs delivered!';
                }
                return aim.countLeft === 1 ? 'Коровка переправлена!' : 'Все коровки переправлены!';
            }
            if (this.language === 'tr') {
                return aim.countLeft === 1 ? 'Böcek geçirildi!' : 'Tüm böcekler geçirildi!';
            }
            if (this.language === 'en') {
                return aim.countLeft === 1 ? 'Beetle delivered!' : 'All beetles delivered!';
            }
            return aim.countLeft === 1 ? 'Жук переправлен!' : 'Все жуки переправлены!';
        }

        if (aim.type === AimType.itemsBunch) {
            return this.language === 'tr' ? 'Tüm öğeler toplandı!' : this.language === 'en' ? 'All items collected!' : 'Все предметы собраны!';
        }
        if (aim.type === AimType.flower && aim.image === 'chamomileSmall') {
            return this.language === 'tr' ? 'Tüm papatyalar toplandı!' : this.language === 'en' ? 'All daisies collected!' : 'Все ромашки собраны!';
        }
        if (aim.type === AimType.item && aim.image === 'mushroom') {
            return this.language === 'tr' ? 'Tüm mantarlar toplandı!' : this.language === 'en' ? 'All mushrooms collected!' : 'Все грибы собраны!';
        }
        if (aim.type === AimType.item && aim.image === 'mushroom3') {
            return this.language === 'tr' ? 'Tüm chanterelle mantarları toplandı!' : this.language === 'en' ? 'All chanterelles collected!' : 'Все лисички собраны!';
        }
        if (aim.type === AimType.item && (aim.image === 'blueberry' || aim.image === 'blackberry' || aim.image === 'strawberry')) {
            return this.language === 'tr' ? 'Tüm meyveler toplandı!' : this.language === 'en' ? 'All berries collected!' : 'Все ягоды собраны!';
        }
        return this.language === 'tr' ? 'Tüm öğeler toplandı!' : this.language === 'en' ? 'All items collected!' : 'Все предметы собраны!';
    }

    public static nearbyTreeMessage(count: number): string {
        if (this.language === 'tr') {
            return '~Ağacın~ yanında ' + count + ' mantar var. ' + (count === 1 ? 'Onu toplayın!' : 'Hepsini toplayın!');
        }
        if (this.language === 'en') {
            return 'There ' + (count === 1 ? 'is ' : 'are ') + count + ' mushroom' + (count === 1 ? '' : 's') + ' near the ~tree~. Collect ' + (count === 1 ? 'it!' : 'them all!');
        }
        return 'Рядом с ~деревом~ ' + count + ' ' + this.countWord(count, {
            ru: ['гриб', 'гриба', 'грибов'],
            en: ['mushroom', 'mushrooms'],
            tr: 'mantar'
        }) + '. Соберите ' + (count === 1 ? 'его!' : 'их все!');
    }

    public static mushroomsLeftMessage(count: number): string {
        if (this.language === 'tr') {
            return 'Harika! Toplanacak ' + count + ' mantar kaldı!';
        }
        if (this.language === 'en') {
            return 'Great! ' + count + ' mushroom' + (count === 1 ? '' : 's') + ' left to collect!';
        }
        return 'Отлично! осталось собрать ' + count + this.countWord(count, {
            ru: [' гриб!', ' гриба!', ' грибов!'],
            en: [' mushroom!', ' mushrooms!'],
            tr: ' mantar!'
        });
    }

    public static nearbyUsefulCells(count: number): string {
        if (this.language === 'tr') {
            return 'Yakında ' + count + ' faydalı hücre var!';
        }
        if (this.language === 'en') {
            return 'There ' + (count === 1 ? 'is ' : 'are ') + count + ' useful cell' + (count === 1 ? '' : 's') + ' nearby!';
        }
        return 'Рядом есть ' + count + this.countWord(count, {
            ru: [' полезная клеточка!', ' полезные клеточки!', ' полезных клеточек!'],
            en: [' useful cell!', ' useful cells!'],
            tr: ' faydalı hücre!'
        });
    }

    public static extraMovesInfo(additionalSteps: number): string {
        if (this.language === 'tr') {
            return '+' + additionalSteps + ' hamle al ve devam et!';
        }
        if (this.language === 'en') {
            return 'Get +' + additionalSteps + ' moves and keep playing!';
        }
        return 'Получи +' + additionalSteps + ' ходов и играй дальше!';
    }

    public static compassLetters(): { south: string, north: string, west: string, east: string } {
        if (this.language === 'tr') {
            return { south: 'G', north: 'K', west: 'B', east: 'D' };
        }
        if (this.language === 'en') {
            return { south: 'S', north: 'N', west: 'W', east: 'E' };
        }
        return { south: 'Ю', north: 'С', west: 'З', east: 'В' };
    }

    private static aimWord(aim: AimLike): string {
        if (aim.image === 'poleno') {
            return this.countWord(aim.countLeft, { ru: ['полено', 'полена', 'поленьев'], en: ['log', 'logs'], tr: 'odun' });
        }
        if (aim.image === 't27') {
            return this.countWord(aim.countLeft, { ru: ['тыкву', 'тыквы', 'тыкв'], en: ['pumpkin', 'pumpkins'], tr: 'balkabağı' });
        }
        if (aim.image === 't24') {
            return this.countWord(aim.countLeft, { ru: ['перец', 'перца', 'перцев'], en: ['pepper', 'peppers'], tr: 'biber' });
        }
        if (aim.image === 't25') {
            return this.countWord(aim.countLeft, { ru: ['сливу', 'сливы', 'слив'], en: ['plum', 'plums'], tr: 'erik' });
        }
        if (aim.image === 'mushroom' || aim.image === 'witchMushroom') {
            return this.countWord(aim.countLeft, { ru: ['гриб', 'гриба', 'грибов'], en: ['mushroom', 'mushrooms'], tr: 'mantar' });
        }
        if (aim.image === 'mushroom3') {
            return this.countWord(aim.countLeft, { ru: ['лисичку', 'лисички', 'лисичек'], en: ['chanterelle', 'chanterelles'], tr: 'chanterelle mantarı' });
        }
        if (aim.image === 'chamomileSmall') {
            return this.countWord(aim.countLeft, { ru: ['ромашку', 'ромашки', 'ромашек'], en: ['daisy', 'daisies'], tr: 'papatya' });
        }
        if (aim.image === 'ladybug') {
            return this.countWord(aim.countLeft, { ru: ['коровку', 'коровки', 'коровок'], en: ['ladybug', 'ladybugs'], tr: 'uğur böceği' });
        }
        if (aim.image.indexOf('bug') === 0) {
            return this.countWord(aim.countLeft, { ru: ['жука', 'жука', 'жуков'], en: ['beetle', 'beetles'], tr: 'böcek' });
        }
        if (aim.image.indexOf('book3') === 0) {
            return this.countWord(aim.countLeft, { ru: ['книжку', 'книжки', 'книжек'], en: ['book', 'books'], tr: 'kitap' });
        }
        if (aim.image.indexOf('goldRoot') === 0) {
            return this.countWord(aim.countLeft, { ru: ['корешок', 'корешка', 'корешков'], en: ['root', 'roots'], tr: 'kök' });
        }
        if (aim.image.indexOf('wheat') === 0) {
            return this.countWord(aim.countLeft, { ru: ['колосок', 'колоска', 'колосков'], en: ['ear of wheat', 'ears of wheat'], tr: 'başak' });
        }
        if (aim.image === 'blackberry' || aim.image === 'cankerberry' || aim.image === 'blueberry' || aim.image === 'strawberry') {
            return this.countWord(aim.countLeft, { ru: ['ягоду', 'ягоды', 'ягод'], en: ['berry', 'berries'], tr: 'meyve' });
        }
        return this.countWord(aim.countLeft, { ru: ['предмет', 'предмета', 'предметов'], en: ['item', 'items'], tr: 'öğe' });
    }

    private static boosterPlural(type: BoosterType, count: number): string {
        switch (type) {
            case BoosterType.compass:
                return this.countWord(count, { ru: ['компас', 'компаса', 'компасов'], en: ['compass', 'compasses'], tr: 'pusula' });
            case BoosterType.rocket:
                return this.countWord(count, { ru: ['сигнальная ракета', 'сигнальные ракеты', 'сигнальных ракет'], en: ['signal rocket', 'signal rockets'], tr: 'işaret fişeği' });
            case BoosterType.vision:
                return this.countWord(count, { ru: ['волшебная сфера', 'волшебные сферы', 'волшебных сфер'], en: ['magic sphere', 'magic spheres'], tr: 'sihirli küre' });
            case BoosterType.beans:
                return this.countWord(count, { ru: ['волшебный боб', 'волшебных боба', 'волшебных бобов'], en: ['magic bean', 'magic beans'], tr: 'sihirli fasulye' });
            case BoosterType.glove:
                return this.countWord(count, { ru: ['перчатка', 'перчатки', 'перчаток'], en: ['glove', 'gloves'], tr: 'eldiven' });
            case BoosterType.rainbow:
                return this.countWord(count, { ru: ['флакон с радугой', 'флакона с радугой', 'флаконов с радугой'], en: ['rainbow vial', 'rainbow vials'], tr: 'gökkuşağı şişesi' });
            default:
                return '';
        }
    }

    private static countWord(count: number, forms: CountForms): string {
        switch (this.language) {
            case 'tr':
                return forms.tr;
            case 'en':
                return count === 1 ? forms.en[0] : forms.en[1];
            default:
                return this.chooseRussianWord(count, forms.ru[0], forms.ru[1], forms.ru[2]);
        }
    }

    private static chooseRussianWord(count: number, one: string, two: string, five: string): string {
        if ((count % 100 >= 10 && count % 100 <= 20) || count % 10 > 4 || count % 10 === 0) {
            return five;
        }
        if (count % 10 === 1) {
            return one;
        }
        return two;
    }
}