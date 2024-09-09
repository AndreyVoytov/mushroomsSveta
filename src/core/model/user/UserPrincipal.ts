export default class UserPrincipalDto {
    context:string;
    externalIdentifier:string;
    internalID:number;

    constructor(userPrincipalDto:UserPrincipalDto){
        this.context = userPrincipalDto.context;
        this.externalIdentifier = userPrincipalDto.externalIdentifier;
        this.internalID = userPrincipalDto.internalID;
    }
}