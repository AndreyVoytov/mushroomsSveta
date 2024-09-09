import OpeningType from "../../model/enum/OpeningType";
import { ContentType } from "../../model/enum/ContentType";

export default class BoosterInfo {

    private openingType: OpeningType;
    private containIvy:boolean;
    private contentType: ContentType;


	constructor(contentType: ContentType, openingType: OpeningType, containIvy: boolean) {
		this.contentType = contentType;
		this.openingType = openingType;
		this.containIvy = containIvy;
	}

	public getContentType(): ContentType {
		return this.contentType;
	}

	public getOpeningType(): OpeningType {
		return this.openingType;
	}

	public isContainIvy(): boolean {
		return this.containIvy;
	}
    
}
