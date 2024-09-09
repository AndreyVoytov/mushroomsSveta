export default class ItemUtils{

    public static getItemName(id:string):string{
        if(id == "mushroom"){
            return "белые грибы"
        } else if (id == "mushroom3"){
            return "лисички"
        } else if (id == "chamomileSmall"){
            return "ромашки"
        }
    }
}


