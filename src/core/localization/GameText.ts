import BoosterType from '../model/enum/BoosterType';
import AimType from '../model/enum/AimType';
import LocalizationKey from './LocalizationKey';
import LocalizationService from './LocalizationService';

interface AimLike {
    type: AimType;
    image: string;
    countLeft: number;
}

export default class GameText {

    public static loading(): string {
        return this.text('loading', 'Loading...');
    }

    public static tapToContinue(): string {
        return this.text('tapToContinue', 'tap to continue');
    }

    public static level(level: number, isHard?: boolean): string {
        return this.text(isHard ? 'level.hard' : 'level.normal', isHard ? 'Hard Level {level}' : 'Level {level}', { level: level });
    }

    public static chooseBoosters(): string {
        return this.text('chooseBoosters', 'Choose boosters:');
    }

    public static currentLimit(limit: number): string {
        return this.text('currentLimit', 'Current limit: {limit}', { limit: limit });
    }

    public static friendsInGame(count: number): string {
        return this.text('friendsInGame', 'Friends in game: {count}', { count: count });
    }

    public static restoreFor(price: number): string {
        return this.text('restoreFor', 'Restore for {price}     ', { price: price });
    }

    public static inviteFriendsInfo(friendTarget: number, targetLimit: number): string {
        return this.text('inviteFriendsInfo', 'Invite {count} {friendWord} to the game and increase your life limit to {limit}!', {
            count: friendTarget,
            friendWord: this.word('friend', friendTarget, 'friend', 'friends'),
            limit: targetLimit
        });
    }

    public static dailyGiftText(count: number): string {
        return this.text('dailyGift', 'You receive\n ~{count} gems~', { count: count });
    }

    public static shareInviteText(): string {
        return this.text('shareInvite', 'Hi! Join the adventure in the new game!');
    }

    public static supportMessage(email: string): string {
        return this.text('supportMessage', 'Please report any\n game issues to\n ~{email}~', { email: email });
    }

    public static purchaseReward(name: string): string {
        return this.text('purchaseReward', 'You receive\n ~{name}~', { name: name });
    }

    public static gems(count: number): string {
        return count + ' ' + this.word('gem', count, 'gem', 'gems');
    }

    public static buySetDescription(gems: number, boosters: { type: BoosterType, count: number }[]): string {
        let result = this.text('buySetDescription', 'This pack includes {gems}', { gems: this.gems(gems) });

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
            return days + ' ' + this.word('time.day', days, 'day', 'days');
        }

        if (hours > 0) {
            return hours + ' ' + this.word('time.hour', hours, 'hour', 'hours');
        }

        if (minutes > 0) {
            return this.text('remainShort.minute', '{count} min.', { count: minutes });
        }

        return this.text('remainShort.second', '{count} sec.', { count: seconds });
    }

    public static remain(time: number): string {
        const diff = Math.max(0, time - Date.now());
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return this.text('remain.dayCompact', '{days}d. {hours}h.', { days: days, hours: hours - days * 24 });
        }

        if (hours > 0) {
            return this.text('remain.hourCompact', '{hours}h. {minutes}m.', { hours: hours, minutes: minutes - hours * 60 });
        }

        if (minutes > 0) {
            return this.text('remain.minuteCompact', '{minutes}m. {seconds}s.', { minutes: minutes, seconds: seconds - minutes * 60 });
        }

        return this.text('remain.secondCompact', '{seconds} sec.', { seconds: seconds });
    }

    public static remainUntil(date: Date): string {
        return this.remain(date.getTime());
    }

    public static aimInfo(aim: AimLike): string {
        return this.text(aim.type === AimType.ladybug ? 'aimInfo.ladybug' : 'aimInfo.find', aim.type === AimType.ladybug ? 'Guide down {count} {itemWord}' : 'Find {count} {itemWord}', {
            count: aim.countLeft,
            itemWord: this.aimWord(aim)
        });
    }

    public static completeAimInfo(aims: AimLike[]): string {
        if (aims.length > 1) {
            return this.text('completeAim.multiple', 'All goals completed!');
        }

        const aim = aims[0];
        if (aim.type === AimType.ladybug) {
            if (aim.image === 'ladybug') {
                return this.text(aim.countLeft === 1 ? 'completeAim.ladybug.one' : 'completeAim.ladybug.all', aim.countLeft === 1 ? 'Ladybug delivered!' : 'All ladybugs delivered!');
            }
            return this.text(aim.countLeft === 1 ? 'completeAim.beetle.one' : 'completeAim.beetle.all', aim.countLeft === 1 ? 'Beetle delivered!' : 'All beetles delivered!');
        }

        if (aim.type === AimType.itemsBunch) {
            return this.text('completeAim.items', 'All items collected!');
        }
        if (aim.type === AimType.flower && aim.image === 'chamomileSmall') {
            return this.text('completeAim.daisies', 'All daisies collected!');
        }
        if (aim.type === AimType.item && aim.image === 'mushroom') {
            return this.text('completeAim.mushrooms', 'All mushrooms collected!');
        }
        if (aim.type === AimType.item && aim.image === 'mushroom3') {
            return this.text('completeAim.chanterelles', 'All chanterelles collected!');
        }
        if (aim.type === AimType.item && (aim.image === 'blueberry' || aim.image === 'blackberry' || aim.image === 'strawberry')) {
            return this.text('completeAim.berries', 'All berries collected!');
        }
        if (aim.type === AimType.bee) {
            return this.text('completeAim.bees', 'All bees cleared!');
        }
        return this.text('completeAim.items', 'All items collected!');
    }

    public static nearbyTreeMessage(count: number): string {
        const key = count === 1 ? 'nearbyTree.one' : 'nearbyTree.many';
        const fallback = count === 1
            ? 'There is {count} {itemWord} near the ~tree~. Collect it!'
            : 'There are {count} {itemWord} near the ~tree~. Collect them all!';
        return this.text(key, fallback, {
            count: count,
            itemWord: this.word('aim.mushroom', count, 'mushroom', 'mushrooms')
        });
    }

    public static mushroomsLeftMessage(count: number): string {
        return this.text('mushroomsLeft', 'Great! {count} {itemWord} left to collect!', {
            count: count,
            itemWord: this.word('aim.mushroom', count, 'mushroom', 'mushrooms')
        });
    }

    public static nearbyUsefulCells(count: number): string {
        return this.text('nearbyUsefulCells', 'There are {count} {itemWord} nearby!', {
            count: count,
            itemWord: this.word('usefulCell', count, 'useful cell', 'useful cells')
        });
    }

    public static extraMovesInfo(additionalSteps: number): string {
        return this.text('extraMovesInfo', 'Get +{count} moves and keep playing!', { count: additionalSteps });
    }

    public static compassLetters(): { south: string, north: string, west: string, east: string } {
        return {
            south: this.text('compass.south', 'S'),
            north: this.text('compass.north', 'N'),
            west: this.text('compass.west', 'W'),
            east: this.text('compass.east', 'E')
        };
    }

    private static aimWord(aim: AimLike): string {
        if (aim.image === 'poleno') {
            return this.word('aim.log', aim.countLeft, 'log', 'logs');
        }
        if (aim.image === 't27') {
            return this.word('aim.pumpkin', aim.countLeft, 'pumpkin', 'pumpkins');
        }
        if (aim.image === 't24') {
            return this.word('aim.pepper', aim.countLeft, 'pepper', 'peppers');
        }
        if (aim.image === 't25') {
            return this.word('aim.plum', aim.countLeft, 'plum', 'plums');
        }
        if (aim.image === 'mushroom' || aim.image === 'witchMushroom') {
            return this.word('aim.mushroom', aim.countLeft, 'mushroom', 'mushrooms');
        }
        if (aim.image === 'mushroom3') {
            return this.word('aim.chanterelle', aim.countLeft, 'chanterelle', 'chanterelles');
        }
        if (aim.image === 'chamomileSmall') {
            return this.word('aim.daisy', aim.countLeft, 'daisy', 'daisies');
        }
        if (aim.image === 'ladybug') {
            return this.word('aim.ladybug', aim.countLeft, 'ladybug', 'ladybugs');
        }
        if (aim.image === 'bumblebee') {
            return this.word('aim.bee', aim.countLeft, 'bee', 'bees');
        }
        if (aim.image.indexOf('bug') === 0) {
            return this.word('aim.beetle', aim.countLeft, 'beetle', 'beetles');
        }
        if (aim.image.indexOf('book3') === 0) {
            return this.word('aim.book', aim.countLeft, 'book', 'books');
        }
        if (aim.image.indexOf('goldRoot') === 0) {
            return this.word('aim.root', aim.countLeft, 'root', 'roots');
        }
        if (aim.image.indexOf('wheat') === 0) {
            return this.word('aim.wheat', aim.countLeft, 'ear of wheat', 'ears of wheat');
        }
        if (aim.image === 'blackberry' || aim.image === 'cankerberry' || aim.image === 'blueberry' || aim.image === 'strawberry') {
            return this.word('aim.berry', aim.countLeft, 'berry', 'berries');
        }
        return this.word('aim.item', aim.countLeft, 'item', 'items');
    }

    private static boosterPlural(type: BoosterType, count: number): string {
        switch (type) {
            case BoosterType.compass:
                return this.word('booster.compass', count, 'compass', 'compasses');
            case BoosterType.rocket:
                return this.word('booster.rocket', count, 'signal rocket', 'signal rockets');
            case BoosterType.vision:
                return this.word('booster.vision', count, 'magic sphere', 'magic spheres');
            case BoosterType.beans:
                return this.word('booster.beans', count, 'magic bean', 'magic beans');
            case BoosterType.glove:
                return this.word('booster.glove', count, 'glove', 'gloves');
            case BoosterType.rainbow:
                return this.word('booster.rainbow', count, 'rainbow vial', 'rainbow vials');
            default:
                return '';
        }
    }

    private static text(id: string, fallback: string, params?: { [key: string]: string | number }): string {
        return LocalizationService.get(LocalizationKey.text(id), fallback, params);
    }

    private static word(id: string, count: number, fallbackOne: string, fallbackMany: string): string {
        const fallback = count === 1 ? fallbackOne : fallbackMany;
        return LocalizationService.get(this.wordKey(id, count), fallback);
    }

    private static wordKey(id: string, count: number): string {
        const prefix = LocalizationKey.word(id);
        if (LocalizationService.isRussian()) {
            const mod100 = count % 100;
            const mod10 = count % 10;
            if ((mod100 >= 10 && mod100 <= 20) || mod10 === 0 || mod10 > 4) {
                return prefix + '.many';
            }
            if (mod10 === 1) {
                return prefix + '.one';
            }
            return prefix + '.few';
        }
        return prefix + (count === 1 ? '.one' : '.many');
    }
}
