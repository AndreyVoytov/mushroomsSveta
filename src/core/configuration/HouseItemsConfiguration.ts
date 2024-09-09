import UserService from "../service/UserService"
import ForestType from "../model/forest/ForestType";
import ForestsConfiguration from "./ForestConfiguration";
import ForestDao from "../dao/ForestDao";

export default class HouseItemsConfiguration {

    private static startItems: string[] =  [
        "amanita", "feather", "greenApple", "redApple", "skull", "voodoo", "clover",
    ]

    private static additionalitemsItems: string[] =  [
        "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17",
        "t18", "t19", "t20", "t21", "t22", "t23", "t24", "t25", "t26", "t27", "t28", "t29", "t30", "t31", "t32", "t33", "t34", "t35"
    ]

    private static allItems: string[] = HouseItemsConfiguration.startItems.concat(HouseItemsConfiguration.additionalitemsItems)

    public static getOptions(forestType:ForestType):string[]{
        let index = ForestDao.getAllForests().map((f,i) =>  f.id == forestType.id? i : -1).filter(i => i != -1).shift();

        if( index <= 5){
            return this.startItems;
        }
        return this.allItems;
    }
}


