import BoosterType from "../enum/BoosterType";

export type RewardItemKind = "gems" | "booster";

export default class RewardItemType {
    kind: RewardItemKind;
    count: number;
    boosterType?: BoosterType;
}
