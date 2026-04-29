import User from '../user/User';
import BoosterType from '../enum/BoosterType';
import ForestUtils from '../../utils/ForestUtils';
import GameText from '../../localization/GameText';
import LocalizationService from '../../localization/LocalizationService';

export default class Buy {
    id: string;
    gems: number;
    price: number;
    artifactId?: string;

    oldPrice?: number;
    name?: string;
    boosters?: { type: BoosterType, count: number }[];

    public static applyToUser(buy: Buy, user: User): void {
        user.setSupermoney(user.getSupermoney() + buy.gems);

        if (buy.artifactId) {
            user.putArtifactToBackpack(buy.artifactId, 1);
        }

        if (buy.boosters) {
            buy.boosters.forEach(booster => {
                user.increaseBoostersCount(booster.type, booster.count);
                ForestUtils.markBoosterSeen(booster.type);
            });
        }
    }

    public static takeFromUser(buy: Buy, user: User): void {
        user.setSupermoney(Math.max(0, user.getSupermoney() - buy.gems));

        if (buy.artifactId) {
            user.removeArtifactFromBackpack(buy.artifactId);
        }

        if (buy.boosters) {
            buy.boosters.forEach(booster => {
                user.increaseBoostersCount(booster.type, -booster.count);
            });
        }
    }

    public static getDesc(buy: Buy): string {
        if (buy.artifactId) {
            return this.getName(buy);
        }
        return GameText.buySetDescription(buy.gems, buy.boosters || []);
    }

    public static getName(buy: Buy): string {
        return buy.name ? LocalizationService.get(buy.name) : GameText.buyName(buy.gems);
    }
}
