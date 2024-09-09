import User from '../user/User';
import BoosterType from '../enum/BoosterType';
import ForestUtils from '../../utils/ForestUtils';
export default class Buy {
    id: string;
    gems: number;
    price: number;

    oldPrice?:number;
    name?: string;
    boosters?: {type: BoosterType, count:number}[];

    public static applyToUser(buy: Buy, user: User): void {
        user.setSupermoney(user.getSupermoney() + buy.gems)
        if(buy.boosters){
            buy.boosters.forEach(b => {
                user.increaseBoostersCount(b.type, b.count);
                ForestUtils.markBoosterSeen(b.type);
            })
        }
    }

    public static takeFromUser(buy: Buy, user: User): void {
        user.setSupermoney(Math.max(0, user.getSupermoney() - buy.gems))
        if(buy.boosters){
            buy.boosters.forEach(b => {
                user.increaseBoostersCount(b.type, -b.count);
            })
        }
    }

    public static getDesc(buy: Buy){
        let res = "В набор входит " + buy.gems + " самоцветов"

        if(buy.boosters){
            buy.boosters.forEach(b => {
                res += ", " + b.count + " " + ForestUtils.getBoosterNamePlural(b.type)
            })
        }

        return res;
    }

    public static getName(buy: Buy){
        return buy.name || "" + buy.gems + " самоцветов";
    }



}


