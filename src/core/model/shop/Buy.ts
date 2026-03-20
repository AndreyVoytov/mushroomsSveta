import User from '../user/User';
import BoosterType from '../enum/BoosterType';
import ForestUtils from '../../utils/ForestUtils';
import GameText from '../../localization/GameText';
import LocalizationService from '../../localization/LocalizationService';
import LocalizationKey from '../../localization/LocalizationKey';

export default class Buy {
    id: string;
    gems: number;
    price: number;

    oldPrice?: number;
    name?: string;
    boosters?: { type: BoosterType, count: number }[];

    public static applyToUser(buy: Buy, user: User): void {
        user.setSupermoney(user.getSupermoney() + buy.gems);
        if (buy.boosters) {
            buy.boosters.forEach(booster => {
                user.increaseBoostersCount(booster.type, booster.count);
                ForestUtils.markBoosterSeen(booster.type);
            });
        }
    }

    public static takeFromUser(buy: Buy, user: User): void {
        user.setSupermoney(Math.max(0, user.getSupermoney() - buy.gems));
        if (buy.boosters) {
            buy.boosters.forEach(booster => {
                user.increaseBoostersCount(booster.type, -booster.count);
            });
        }
    }

    public static getDesc(buy: Buy): string {
        return GameText.buySetDescription(buy.gems, buy.boosters || []);
    }

    public static getName(buy: Buy): string {
        return buy.name ? LocalizationService.get(LocalizationKey.buy(buy, 'name'), buy.name) : GameText.buyName(buy.gems);
    }
}
