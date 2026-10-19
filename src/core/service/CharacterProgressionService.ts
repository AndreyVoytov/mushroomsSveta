import User from '../model/user/User';
import { CharacterGrowthState, CharacterLevelGain } from '../model/world/WorldState';
import WorldConfiguration from '../configuration/WorldConfiguration';
import ServerStoreComponent from './store/ServerStoreComponent';

export default class CharacterProgressionService {
    // Far beyond normal play; bounds work when importing a damaged save.
    public static readonly MAX_LEVEL = 1000;
    public static threshold(level:number):number {
        if(level<=1)return 0;
        if(level<=5)return WorldConfiguration.relationshipThresholds[level-1];
        return 160+15*(level-5)*(level+4)/2;
    }
    public static pointsForLevel(level:number):number {
        if(level<=1)return 0;
        let points=1;for(let milestone=5;level>=milestone;milestone*=2)points++;
        return points;
    }
    public static levelForXp(xp:number):number {
        xp=isFinite(xp)?Math.max(0,xp):0;
        if(xp<160)return WorldConfiguration.relationshipThresholds.filter(n=>n<=xp).length;
        return Math.min(this.MAX_LEVEL,5+Math.floor((Math.sqrt(81+8*(xp-160)/15)-9)/2));
    }
    public static state(user:User,character:string):CharacterGrowthState {
        return user.world.characterGrowth&&user.world.characterGrowth[character];
    }
    public static level(user:User,character:string):number {
        const state=this.state(user,character);return state?state.level:1;
    }
    private static seed(user:User,character:string):number {
        const text=user.createdAt+':'+character;let hash=2166136261;
        for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
        return hash>>>0||1;
    }
    // Applied once to the actual character skills, so abilities and checks also improve.
    public static sync(user:User):void {
        const characters=user.getCharacters();
        const changes=characters.filter(c=>{
            const state=this.state(user,c.id),target=this.levelForXp(user.world.relationships['player:'+c.id]||0);
            return !state||state.level<target;
        });
        if(!changes.length)return;
        ServerStoreComponent.atomic(user,()=>{
            if(!user.world.characterGrowth)user.world.characterGrowth={};
            changes.forEach(character=>{
                let state=this.state(user,character.id);
                if(!state)state=user.world.characterGrowth[character.id]={level:1,seed:this.seed(user,character.id),bonuses:{},announcedLevel:1,pending:{}};
                const target=this.levelForXp(user.world.relationships['player:'+character.id]||0),skills=character.skills||[];
                if(!skills.length)return;
                const gains:{[skill:string]:number}={},from=state.level;
                for(let level=state.level+1;level<=target;level++){
                    let random=(state.seed^Math.imul(level,2654435761))>>>0||1;
                    for(let point=0;point<this.pointsForLevel(level);point++){
                        random^=random<<13;random^=random>>>17;random^=random<<5;
                        const skill=skills[Math.floor((random>>>0)/4294967296*skills.length)];
                        skill.value++;
                        state.bonuses[skill.skillId]=(state.bonuses[skill.skillId]||0)+1;
                        state.pending[skill.skillId]=(state.pending[skill.skillId]||0)+1;
                        gains[skill.skillId]=(gains[skill.skillId]||0)+1;
                    }
                    state.level=level;
                }
                if(state.level>from)state.lastGain={fromLevel:from,toLevel:state.level,bonuses:gains};
            });
        });
    }
    public static pending(user:User,character:string):CharacterLevelGain {
        const state=this.state(user,character);
        if(!state||state.announcedLevel>=state.level)return null;
        return {fromLevel:state.announcedLevel,toLevel:state.level,bonuses:Object.assign({},state.pending)};
    }
    public static consumeNotice(user:User,character:string):CharacterLevelGain {
        const gain=this.pending(user,character);if(!gain)return null;
        ServerStoreComponent.atomic(user,()=>{
            const state=this.state(user,character);state.announcedLevel=state.level;state.pending={};state.lastGain=gain;
        });return gain;
    }
}
