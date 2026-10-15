import User from '../model/user/User';
import WorldConfiguration, { WorldEncounter, WorldReward, WardrobeItem } from '../configuration/WorldConfiguration';
import { WorldStat, emptyWorldState } from '../model/world/WorldState';
import ServerStoreComponent from './store/ServerStoreComponent';
import GameClock from './GameClock';
import Telemetry from './Telemetry';
import WorldLevels from '../configuration/WorldLevels';
import UserService from './UserService';
import ForestType from '../model/forest/ForestType';
import LiveConfig from './LiveConfig';
export default class WorldService {
    public static DAY = 86400000;
    public static activeAdventure: string = null;
    public static expedition = false;
    public static houseAfterWorld=false;
    public static prepare(user: User): void {
        const before = JSON.stringify(user.world);
        const defaults: any = emptyWorldState();
        Object.keys(defaults).forEach(k => {if (user.world[k] == null) user.world[k] = defaults[k];});
        WorldConfiguration.items.filter(x=>x.legacy).forEach(x=>{
            if(user.hasOwnedArtifact(x.legacy)&&user.world.wardrobe.indexOf(x.id)<0)user.world.wardrobe.push(x.id);
        });
        WorldConfiguration.encounters.forEach(e=>{
            if(user.getCurrentForest()>=e.from && user.getCurrentForest()<=e.until && !user.world.encounters[e.id])
                user.world.encounters[e.id]={discoveredAt:GameClock.now()};
        });
        WorldConfiguration.adventures.filter(a=>a.pair).forEach(a=>{
            if(this.relationshipLevel(user,a.pair)>=a.relationshipLevel && !user.world.adventures[a.id])
                user.world.adventures[a.id]={unlockedAt:GameClock.now(),progress:0};
        });
        const friendshipItems={sveta:'redCloak',boris:'borisScarf',owl:'owlRibbon',leshy:'leshyCharm'};
        Object.keys(friendshipItems).forEach(char=>{
            const id=friendshipItems[char];
            if(this.relationshipLevel(user,'player:'+char)>=5&&user.world.wardrobe.indexOf(id)<0)user.world.wardrobe.push(id);
        });
        Object.keys(WorldConfiguration.setScenes).forEach(set=>{
            const items=WorldConfiguration.items.filter(i=>i.set===set);
            const memory='set:'+set;
            if(items.length>=3&&items.every(i=>user.world.wardrobe.indexOf(i.id)>=0)&&user.world.memories.indexOf(memory)<0)user.world.memories.push(memory);
        });
        if (JSON.stringify(user.world) !== before) user.saveWorld();
    }
    public static stage(user: User): {from:number;title:string} {
        return WorldConfiguration.stages.filter(s=>s.from<=user.getCurrentForest()).slice(-1)[0];
    }
    public static stat(user: User, characterId: string, stat: WorldStat): number {
        const character=user.getCharacterById(characterId);
        if(!character)return 0;
        const base=(character.skills||[]).filter(x=>x.skillId===stat).shift();
        let value=base?base.value:(stat==='strength'?4:stat==='kindness'?3:stat==='charm'?3:0);
        value+=WorldConfiguration.stages.indexOf(this.stage(user));
        value+=(user.world.training[characterId]||{})[stat]||0;
        const owned=WorldConfiguration.items.filter(x=>x.character===characterId && (user.world.wardrobe.indexOf(x.id)>=0 || (x.legacy && user.hasOwnedArtifact(x.legacy))));
        owned.forEach(x=>value+=((x.bonuses||{})[stat]||0)*(x.legacy?Math.max(1,user.getOwnedArtifactLevel(x.legacy)):1));
        const sets: string[]=[];
        owned.forEach(x=>{if(sets.indexOf(x.set)<0)sets.push(x.set);});
        sets.forEach(set=>{
            const all=WorldConfiguration.items.filter(x=>x.set===set&&x.character===characterId);
            if(all.length>=3&&all.every(x=>owned.some(y=>y.id===x.id))) value+=stat==='friendship'||stat==='bravery'?2:0;
        });
        return Math.min(99,Math.max(0,value));
    }
    public static buyItem(user: User,item: WardrobeItem): boolean {
        if(!item||!user.hasCharacter(item.character)||item.price<=0||user.getCurrentForest()<item.level||user.world.wardrobe.indexOf(item.id)>=0||user.getSupermoney()<item.price)return false;
        ServerStoreComponent.atomic(user,()=>{user.setSupermoney(user.getSupermoney()-item.price,'wardrobe:'+item.id);this.grantItem(user,item.id);});
        Telemetry.track('wardrobe_acquired',{itemId:item.id,characterId:item.character});
        return true;
    }
    public static train(user:User,characterId:string,stat:WorldStat):boolean {
        if(!user.hasCharacter(characterId)||!WorldConfiguration.statNames[stat]||this.stat(user,characterId,stat)>=99)return false;
        const current=(user.world.training[characterId]||{})[stat]||0,price=8+current*4;
        if(user.getSupermoney()<price)return false;
        ServerStoreComponent.atomic(user,()=>{
            user.setSupermoney(user.getSupermoney()-price,'training:'+stat);
            if(!user.world.training[characterId])user.world.training[characterId]={};
            user.world.training[characterId][stat]=current+1;user.saveWorld();
        });return true;
    }
    public static craft(user:User,id:string):boolean {
        const recipe=WorldConfiguration.recipes[id],item=WorldConfiguration.items.filter(i=>i.id===id)[0];
        if(!recipe||!item||!user.hasCharacter(item.character)||user.world.wardrobe.indexOf(id)>=0||user.world.materials.wood<recipe.wood||user.world.materials.clover<recipe.clover)return false;
        ServerStoreComponent.atomic(user,()=>{
            user.world.materials.wood-=recipe.wood;user.world.materials.clover-=recipe.clover;
            user.recordEconomy('wood',-recipe.wood,'craft:'+id,user.world.materials.wood);user.recordEconomy('clover',-recipe.clover,'craft:'+id,user.world.materials.clover);this.grantItem(user,id);
        });Telemetry.track('wardrobe_crafted',{itemId:id});return true;
    }
    public static grantItem(user: User,id:string): void {
        if(!WorldConfiguration.items.some(x=>x.id===id)||user.world.wardrobe.indexOf(id)>=0)return;
        user.world.wardrobe.push(id);user.saveWorld();
    }
    public static wear(user:User,id:string):boolean {
        const item=WorldConfiguration.items.filter(x=>x.id===id).shift();
        if(!item||user.world.wardrobe.indexOf(id)<0)return false;
        user.world.appearance[item.character]=id;user.saveWorld();return true;
    }
    public static relationshipLevel(user:User,id:string):number {
        const xp=user.world.relationships[id]||0;
        return WorldConfiguration.relationshipThresholds.filter(v=>v<=xp).length;
    }
    public static relationAction(user:User,id:string,gift:boolean):boolean {
        const rel=WorldConfiguration.relationships.filter(x=>x.id===id).shift();
        const key=id+(gift?':gift':':talk');
        if(!rel||!user.hasCharacter(rel.character)||user.world.dailyActions[key]===GameClock.day()||(gift&&user.getSupermoney()<10))return false;
        ServerStoreComponent.atomic(user,()=>{
            user.world.dailyActions[key]=GameClock.day();
            if(gift)user.setSupermoney(user.getSupermoney()-10,'relationship_gift:'+id);
            user.world.relationships[id]=(user.world.relationships[id]||0)+(gift?20:10);
            this.prepare(user);user.saveWorld();
        });
        Telemetry.track('relationship_action',{relationshipId:id,gift});return true;
    }
    public static encounters(user:User):WorldEncounter[] {
        this.prepare(user);
        return WorldConfiguration.encounters.filter(e=>{
            const state=user.world.encounters[e.id];
            return state&&!state.completedAt&&(e.persistent?GameClock.now()<state.discoveredAt+2*this.DAY:user.getCurrentForest()<=e.until);
        });
    }
    public static check(user:User,encounterId:string,choiceIndex:number,character:string):boolean {
        const e=this.encounters(user).filter(x=>x.id===encounterId).shift();
        if(!e||!user.hasCharacter(character))return false;
        const c=e.choices[choiceIndex];if(!c)return false;
        if(c.stat&&this.stat(user,character,c.stat)<c.required)return false;
        if(c.wood&&(user.world.materials.wood||0)<c.wood)return false;
        ServerStoreComponent.atomic(user,()=>{
            user.world.encounters[e.id].completedAt=GameClock.now();
            if(c.wood){user.world.materials.wood-=c.wood;user.recordEconomy('wood',-c.wood,'encounter:'+e.id,user.world.materials.wood);}
            this.reward(user,c.reward,'encounter:'+e.id);
            if(user.world.memories.indexOf(e.id)<0)user.world.memories.push(e.id);
            if(e.adventure&&!user.world.adventures[e.adventure])user.world.adventures[e.adventure]={unlockedAt:GameClock.now(),progress:0};
            user.saveWorld();
        });
        Telemetry.track('encounter_success',{encounterId:e.id,choice:choiceIndex,characterId:character});return true;
    }
    public static reward(user:User,reward:WorldReward,reason:string='world_reward'):void {
        if(reward.energy)user.addEnergy(reward.energy,true,reason);
        if(reward.gems)user.setSupermoney(user.getSupermoney()+reward.gems,reason);
        if(reward.wood){user.world.materials.wood=(user.world.materials.wood||0)+reward.wood;user.recordEconomy('wood',reward.wood,reason,user.world.materials.wood);}
        if(reward.clover){user.world.materials.clover=(user.world.materials.clover||0)+reward.clover;user.recordEconomy('clover',reward.clover,reason,user.world.materials.clover);}
        if(reward.item)this.grantItem(user,reward.item);
        if(reward.relationship)user.world.relationships[reward.relationship]=(user.world.relationships[reward.relationship]||0)+(reward.relationshipXp||0);
        user.saveWorld();
    }
    public static startAdventure(user:User,id:string):boolean {
        this.prepare(user);const s=user.world.adventures[id];
        if(!s||s.completedAt||(s.startedAt&&GameClock.now()>=s.startedAt+3*this.DAY))return false;
        if(Object.keys(user.world.adventures).some(k=>k!==id&&user.world.adventures[k].startedAt&&!user.world.adventures[k].completedAt&&GameClock.now()<user.world.adventures[k].startedAt+3*this.DAY))return false;
        if(!s.startedAt){s.startedAt=GameClock.now();user.saveWorld();}
        this.activeAdventure=id;this.expedition=false;return true;
    }
    public static forest(user:User):ForestType {
        if(!this.activeAdventure&&!this.expedition)return null;
        const s=this.activeAdventure?user.world.adventures[this.activeAdventure]:null;
        const index=s?s.progress:user.world.expeditionsCompleted;
        const level=WorldLevels.get(this.activeAdventure||'expedition',index);
        level.id=(this.activeAdventure||'expedition')+'_'+(index+1);
        if(this.expedition)level.name='Лесная экспедиция · '+(index+1);
        return level;
    }
    public static completeLevel(user:User):void {
        const adventureBefore=this.activeAdventure,expeditionBefore=this.expedition;
        try{ServerStoreComponent.atomic(user,()=>{
            if(this.activeAdventure){
                const id=this.activeAdventure,s=user.world.adventures[id],config=WorldConfiguration.adventures.filter(a=>a.id===id)[0];
                if(s&&!s.completedAt&&GameClock.now()<s.startedAt+3*this.DAY){
                    s.progress++;
                    if(s.progress>=config.levels){s.completedAt=GameClock.now();this.reward(user,config.reward,'adventure:'+id);user.world.memories.push(id);}
                }
                this.activeAdventure=null;
            }else if(this.expedition){user.world.expeditionsCompleted++;this.reward(user,{energy:3});this.expedition=false;}
            const char=user.getCurrentCharacterId();
            user.world.relationships['player:'+char]=(user.world.relationships['player:'+char]||0)+2;
            if(user.hasCharacter('boris'))user.world.relationships['sveta:boris']=(user.world.relationships['sveta:boris']||0)+1;
            const season=this.season(user);season.points++;
            this.weekly(user).points++;
            this.prepare(user);user.saveWorld();
        });}catch(e){this.activeAdventure=adventureBefore;this.expedition=expeditionBefore;throw e;}
        if(adventureBefore||expeditionBefore)this.houseAfterWorld=true;
        Telemetry.track('world_level_complete');
    }
    public static seasonId():string {return 's'+Math.floor((GameClock.now()+3*3600000)/(LiveConfig.get('seasonDays')*this.DAY));}
    public static seasonEndsAt():number {return (Number(this.seasonId().slice(1))+1)*LiveConfig.get('seasonDays')*this.DAY-3*3600000;}
    public static weeklyEndsAt():number {return (Math.floor((GameClock.now()+3*3600000-4*this.DAY)/(7*this.DAY))+1)*7*this.DAY+4*this.DAY-3*3600000;}
    public static season(user:User):{points:number;premium:boolean;claims:string[]} {
        const id=this.seasonId();if(!user.world.seasons[id])user.world.seasons[id]={points:0,premium:false,claims:[]};
        // Keep paid items permanently; only progress for three season runs remains in the profile.
        Object.keys(user.world.seasons).sort((a,b)=>Number(a.slice(1))-Number(b.slice(1))).slice(0,-3).forEach(k=>delete user.world.seasons[k]);
        return user.world.seasons[id];
    }
    public static claimSeason(user:User,index:number,premium:boolean,seasonId:string=this.seasonId()):boolean {
        const s=seasonId===this.seasonId()?this.season(user):user.world.seasons[seasonId],r=WorldConfiguration.seasonRewards[index],id=(premium?'p':'f')+index;
        if(!s)return false;
        if(!r||s.points<r.points||(premium&&!s.premium)||s.claims.indexOf(id)>=0)return false;
        ServerStoreComponent.atomic(user,()=>{s.claims.push(id);this.reward(user,premium?r.premium:r.free,'season:'+seasonId+':'+id);});return true;
    }
    public static activateSeasonPass(user:User,seasonId:string=this.seasonId()):void {
        ServerStoreComponent.atomic(user,()=>{
            if(!user.world.seasons[seasonId])user.world.seasons[seasonId]={points:0,premium:false,claims:[]};
            user.world.seasons[seasonId].premium=true;
            WorldConfiguration.seasonRewards.forEach((r,index)=>this.claimSeason(user,index,true,seasonId));
            user.saveWorld();
        });
    }
    public static weekly(user:User):{points:number;claimed:boolean} {
        const id='w'+Math.floor((GameClock.now()+3*3600000-4*this.DAY)/(7*this.DAY));
        if(!user.world.weeklies[id])user.world.weeklies[id]={points:0,claimed:false};
        Object.keys(user.world.weeklies).sort((a,b)=>Number(a.slice(1))-Number(b.slice(1))).slice(0,-3).forEach(k=>delete user.world.weeklies[k]);
        return user.world.weeklies[id];
    }
    public static claimWeekly(user:User):boolean {
        const w=this.weekly(user);if(w.points<12||w.claimed)return false;
        ServerStoreComponent.atomic(user,()=>{w.claimed=true;this.reward(user,{wood:3,energy:20},'weekly_reward');});return true;
    }
}
