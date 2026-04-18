import BoosterType from "../model/enum/BoosterType";
import RewardItemType from "../model/reward/RewardItemType";
import User from "../model/user/User";
import UserService from "../service/UserService";
import ForestUtils from "./ForestUtils";

export default class RewardUtils {

    public static fromPrize(prize: { boosters?: { type: BoosterType, count: number }[], gems?: number }): RewardItemType[] {
        let rewards: RewardItemType[] = [];

        if (prize && prize.gems && prize.gems > 0) {
            rewards.push({
                kind: "gems",
                count: prize.gems
            });
        }

        if (prize && prize.boosters) {
            prize.boosters.forEach(booster => {
                if (!booster || !booster.type || !booster.count || booster.count <= 0) {
                    return;
                }

                rewards.push({
                    kind: "booster",
                    boosterType: booster.type,
                    count: booster.count
                });
            });
        }

        return rewards;
    }

    public static cloneRewards(rewards: RewardItemType[]): RewardItemType[] {
        return (rewards || [])
            .filter(reward => !!reward)
            .map(reward => ({
                kind: reward.kind,
                count: reward.count,
                boosterType: reward.boosterType
            }));
    }

    public static applyRewards(user: User, rewards: RewardItemType[]): void {
        let safeUser = user || UserService.getUser();
        if (!safeUser || !rewards) {
            return;
        }

        rewards.forEach(reward => {
            if (!reward || !reward.count || reward.count <= 0) {
                return;
            }

            if (reward.kind == "gems") {
                safeUser.setSupermoney(safeUser.getSupermoney() + reward.count);
                return;
            }

            if (reward.kind == "booster" && reward.boosterType) {
                safeUser.increaseBoostersCount(reward.boosterType, reward.count);
                ForestUtils.markBoosterSeen(reward.boosterType);
            }
        });
    }

    public static getIconKey(reward: RewardItemType): string {
        if (!reward) {
            return "gems";
        }

        if (reward.kind == "booster" && reward.boosterType) {
            return reward.boosterType;
        }

        return "gems";
    }
}
