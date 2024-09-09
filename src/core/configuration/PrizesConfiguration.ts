import BoosterType from "../model/enum/BoosterType";

export default class PrizesConfiguration {

    public static allPrizes: {id:string,level:string, boosters?:{type:BoosterType, count:number}[], gems?:number}[] = [
        {   
            id:"prize1",
            level: "10",
            boosters: [{type:BoosterType.compass, count:3}],
        }, 
        {   
            id:"prize2",
            level: "24",
            boosters: [{type:BoosterType.glove, count:3}],
            gems:100
        },
        {   
            id:"prize3",
            level: "43",
            boosters: [{type:BoosterType.rocket, count:3}],
        },
        {   
            id:"prize4",
            level: "59",
            boosters: [{type:BoosterType.compass, count:1}, {type:BoosterType.rocket, count:1}, {type:BoosterType.beans, count:1}],
        },
        {   
            id:"prize5",
            level: "85",
            boosters: [{type:BoosterType.vision, count:2}]
        },
        {   
            id:"prize6",
            level: "106",
            boosters: [{type:BoosterType.compass, count:1}, {type:BoosterType.glove, count:1}, {type:BoosterType.beans, count:1},],
        },
        {   
            id:"prize7",
            level: "130",
            boosters: [{type:BoosterType.rainbow, count:1}, {type:BoosterType.glove, count:1}, {type:BoosterType.beans, count:1},],
        },
        {   
            id:"prize8",
            level: "150",
            boosters: [{type:BoosterType.rocket, count:3}],
            gems:100
        },
        
    ]



}


