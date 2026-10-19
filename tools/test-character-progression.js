const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const fixture={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'test-world.js'),'utf8').split('async function main(){')[0]+`
module.exports={fresh,User,World,deny(v){denyWrites=v;},Growth:load('src/core/service/CharacterProgressionService.ts').default};`,{require,__dirname,module:fixture,console,setTimeout,clearTimeout});
const {fresh,User,World,Growth,deny}=fixture.exports,clone=x=>JSON.parse(JSON.stringify(x));
const points=level=>{let sum=0;for(let n=2;n<=level;n++)sum+=Growth.pointsForLevel(n);return sum;};
for(const [level,bonus] of [[2,1],[4,1],[5,2],[9,2],[10,3],[19,3],[20,4],[39,4],[40,5],[79,5],[80,6],[159,6],[160,7],[320,8],[640,9]])assert.equal(Growth.pointsForLevel(level),bonus);
for(let level=2;level<=1000;level++){
    assert.equal(Growth.levelForXp(Growth.threshold(level)),level,'exact threshold '+level);
    assert.equal(Growth.levelForXp(Growth.threshold(level)-1),level-1,'before threshold '+level);
}
assert.equal(Growth.levelForXp(Infinity),1);assert.equal(Growth.levelForXp(-1),1);assert.equal(Growth.levelForXp(Number.MAX_SAFE_INTEGER),1000);
for(const character of ['sveta','boris','owl','leshy']){
    let u=fresh();if(character!=='sveta')u.unlockCharacter(character);World.prepare(u);
    const original=clone(u.getCharacterById(character).skills);u.world.relationships['player:'+character]=Growth.threshold(20);World.prepare(u);
    const state=Growth.state(u,character);assert.equal(state.level,20);assert.equal(Object.values(state.bonuses).reduce((a,b)=>a+b,0),47);
    for(const skill of u.getCharacterById(character).skills){const base=original.find(x=>x.skillId===skill.skillId).value;assert.equal(skill.value-base,state.bonuses[skill.skillId]||0,'bonus changes actual gameplay skills');}
    const saved=clone(u);World.prepare(u);assert.deepEqual(clone(u),saved,'repeated prepare is idempotent');
    u=new User(saved);World.prepare(u);assert.deepEqual(clone(u.world),saved.world);assert.deepEqual(clone(u.getCharacterById(character).skills),saved.characters.find(c=>c.id===character).skills);
    const gain=Growth.consumeNotice(u,character);assert.equal(gain.fromLevel,1);assert.equal(gain.toLevel,20);assert.equal(Object.values(gain.bonuses).reduce((a,b)=>a+b,0),47);assert.equal(Growth.consumeNotice(u,character),null);
    u=new User(clone(u));World.prepare(u);assert.equal(Growth.pending(u,character),null,'viewing again cannot award or announce twice');
}
// Jumping several levels and earning them one by one produce the same saved rolls.
const one=fresh(),two=new User(clone(one));one.world.relationships['player:sveta']=Growth.threshold(40);World.prepare(one);
for(let level=2;level<=40;level++){two.world.relationships['player:sveta']=Growth.threshold(level);World.prepare(two);}
assert.deepEqual(clone(one.getCharacterById('sveta').skills),clone(two.getCharacterById('sveta').skills));assert.equal(Object.values(Growth.state(one,'sveta').bonuses).reduce((a,b)=>a+b,0),points(40));
// Daily talk, physical gifts, a one-time story, world rewards and field XP all level up.
let u=fresh();World.prepare(u);u.world.relationships['player:sveta']=19;assert(World.relationAction(u,'player:sveta',false));assert.equal(Growth.level(u,'sveta'),2);assert(!World.relationAction(u,'player:sveta',false));
u=fresh();World.prepare(u);u.world.materials.wood=5;assert(World.makeGift(u,'sveta'));assert(World.giveGift(u,'sveta'));assert.equal(Growth.level(u,'sveta'),2);
u=fresh();World.prepare(u);u.world.relationships['player:sveta']=19;assert(World.completeRelationshipStep(u,'sveta',0));assert.equal(Growth.level(u,'sveta'),2);
u=fresh();World.prepare(u);World.reward(u,{relationship:'player:sveta',relationshipXp:55});assert.equal(Growth.level(u,'sveta'),3);
u=fresh();World.prepare(u);u.world.relationships['player:sveta']=19;World.completeLevel(u);assert.equal(Growth.level(u,'sveta'),2);
u=fresh();World.prepare(u);u.world.relationships['player:boris']=100;World.prepare(u);assert.equal(Growth.state(u,'boris'),undefined);u.unlockCharacter('boris');World.prepare(u);assert.equal(Growth.level(u,'boris'),4,'old XP also applies to a newly unlocked companion');
// Save failures roll back both the XP transaction and the actual stat increments.
u=fresh();World.prepare(u);u.world.relationships['player:sveta']=19;let before=clone(u);deny(true);assert.throws(()=>World.relationAction(u,'player:sveta',false),/Quota/);deny(false);assert.deepEqual(clone(u),before);assert(World.relationAction(u,'player:sveta',false));assert.equal(Growth.level(u,'sveta'),2);
before=clone(u);deny(true);assert.throws(()=>Growth.consumeNotice(u,'sveta'),/Quota/);deny(false);assert.deepEqual(clone(u),before);assert(Growth.consumeNotice(u,'sveta'));
u=fresh();World.prepare(u);u.world.relationships['player:sveta']=Growth.threshold(10);before=clone(u);deny(true);assert.throws(()=>World.prepare(u),/Quota/);deny(false);assert.deepEqual(clone(u),before);World.prepare(u);assert.equal(Growth.level(u,'sveta'),10);
console.log('PASS creature levels: 1,000 XP boundaries; 5/10/20/40/80+ bonus tiers; four companions; actual skill gains; stable random rolls; all personal XP sources; migration, reload, queued feedback and transactional rollback.');
