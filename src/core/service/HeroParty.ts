import User from '../model/user/User';

export interface HeroAbilityDefinition {
    id: string;
    image: string;
    energy: number;
    color: number;
    faceX: number;
    faceY: number;
    faceWidth: number;
}

export default class HeroParty {
    public static readonly heroes: HeroAbilityDefinition[] = [
        {id:'sveta',image:'sveta1',energy:30,color:0xffbe50,faceX:.55,faceY:.30,faceWidth:.66},
        {id:'boris',image:'cat1',energy:40,color:0x8ee073,faceX:.46,faceY:.29,faceWidth:.70},
        {id:'owl',image:'sova1',energy:35,color:0xc5a1ff,faceX:.48,faceY:.33,faceWidth:.78}
    ];

    public static members(user: User): Array<HeroAbilityDefinition | null> {
        return this.heroes.map(hero => user.hasCharacter(hero.id) ? hero : null);
    }
}
