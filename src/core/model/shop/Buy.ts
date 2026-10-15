import User from '../user/User';
import BoosterType from '../enum/BoosterType';
import ForestUtils from '../../utils/ForestUtils';
import GameText from '../../localization/GameText';
import LocalizationService from '../../localization/LocalizationService';
import ShopArtifactService from '../../service/ShopArtifactService';
import WorldService from '../../service/WorldService';

export default class Buy {
    id: string;
    gems: number;
    price: number;
    artifactId?: string;
    seasonPass?:boolean;

    oldPrice?: number;
    name?: string;
    boosters?: { type: BoosterType, count: number }[];

    public static applyToUser(buy: Buy, user: User, reason: string = 'purchase_grant'): void {
        if(buy.seasonPass)WorldService.activateSeasonPass(user);
        user.setSupermoney(user.getSupermoney() + buy.gems, reason);

        if (buy.artifactId) {
            ShopArtifactService.grantToUser(user, buy.artifactId, 1);
        }

        if (buy.boosters) {
            buy.boosters.forEach(booster => {
                user.increaseBoostersCount(booster.type, booster.count);
                ForestUtils.markBoosterSeen(booster.type);
            });
        }
    }

    public static applyServerGrant(grant:any,seasonId:string,user:User):void {
        if(grant.seasonPass)WorldService.activateSeasonPass(user,seasonId);
        user.setSupermoney(user.getSupermoney()+(grant.gems||0),'verified_purchase_grant');
        (grant.boosters||[]).forEach(booster=>{user.increaseBoostersCount(booster.type,booster.count);ForestUtils.markBoosterSeen(booster.type);});
    }

    public static takeFromUser(buy: Buy, user: User): void {
        user.setSupermoney(Math.max(0, user.getSupermoney() - buy.gems), 'purchase_reversal');

        if (buy.artifactId) {
            user.removeOwnedArtifact(buy.artifactId);
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
