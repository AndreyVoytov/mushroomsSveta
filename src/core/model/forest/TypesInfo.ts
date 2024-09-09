import { ContentType } from "../../model/enum/ContentType";


export default class TypesInfo {

    public types:{type: ContentType, metaValue:string}[];

	constructor(types: ContentType[], metaDataByIndex:{[key:number] : string}) {
        this.types = [];

        types.forEach((t, i) => {
            this.types.push({type: t, metaValue: metaDataByIndex[i]})
        })
    }

}