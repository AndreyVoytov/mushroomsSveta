// Reuse the real User/store/clock fixture used by the economy integration suite.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const fixture={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'test-world.js'),'utf8').split('async function main(){')[0]+`
module.exports={fresh,User,World,Config,Clock,deny(value){denyWrites=value;},advance(ms){now+=ms;Clock.synchronize(now);},
stories:load('src/core/configuration/RelationshipConfiguration.ts').default};`,{require,__dirname,module:fixture,console,setTimeout,clearTimeout});
const {fresh,User,World,Config,stories,advance}=fixture.exports;
for(const e of Config.encounters.filter(e=>!e.persistent)){
    assert(e.choices.length>=2,e.id+' has meaningful approaches to choose between');
    const u=fresh();u.setCurrentForest(e.from);World.prepare(u);
    const choice=e.choices.findIndex((c,i)=>c.stat&&u.getCharacters().some(hero=>World.stat(u,hero.id,c.stat)>=World.encounterRequirement(u,e,i)));
    assert(choice>=0,e.id+' must have a free reachable skill choice with only the starting hero');
    assert(World.check(u,e.id,choice,'sveta'));const after=JSON.stringify(u.world);assert(!World.check(u,e.id,choice,'sveta'));assert.equal(JSON.stringify(u.world),after,'no duplicate reward');
}
let u=fresh();u.setCurrentForest(18);World.prepare(u);const start=u.world.encounters.ghostDoor.discoveredAt;
const before=[u.getEnergy(),u.getSupermoney(),u.world.materials.wood];assert(!World.check(u,'ghostDoor',0,'sveta'));assert.deepEqual([u.getEnergy(),u.getSupermoney(),u.world.materials.wood],before);
assert.equal(u.world.encounters.ghostDoor.attempts,1);assert(World.practiceDoor(u,'ghostDoor','sveta','knowledge'));assert(!World.practiceDoor(u,'ghostDoor','sveta','knowledge'));
assert(!World.practiceDoor(u,'ghostDoor','sveta','kindness'));assert(!World.check(u,'ghostDoor',0,'sveta'));
u=new User(JSON.parse(JSON.stringify(u)));World.prepare(u);assert.equal(u.world.encounters.ghostDoor.discoveredAt,start);
advance(World.DAY);assert(World.practiceDoor(u,'ghostDoor','sveta','knowledge'));assert(World.check(u,'ghostDoor',0,'sveta'));assert(u.world.adventures.ghostDoor);assert(!u.world.adventures.ghostDoor.startedAt);assert(!World.check(u,'ghostDoor',0,'sveta'));
u=fresh();u.setCurrentForest(18);World.prepare(u);advance(2*World.DAY);assert(!World.encounters(u).some(e=>e.id==='ghostDoor'));World.prepare(u);assert(!World.practiceDoor(u,'ghostDoor','sveta','knowledge'));assert(!World.check(u,'ghostDoor',0,'sveta'));
for(const character of Object.keys(stories.companions)){
    const u=fresh();if(character!=='sveta')u.unlockCharacter(character);World.prepare(u);const id='player:'+character,g=stories.companions[character];
    assert(!World.completeRelationshipStep(u,character,1),'steps are sequential');
    assert(World.completeRelationshipStep(u,character,0));assert(!World.completeRelationshipStep(u,character,0));
    assert(World.relationAction(u,id,false));assert(!World.relationAction(u,id,false));
    assert(!World.makeGift(u,character),'cannot craft without materials');u.world.materials.wood=20;u.world.materials.clover=20;
    const wood=u.world.materials.wood;assert(World.makeGift(u,character));assert.equal(u.world.materials.wood,wood-g.wood);assert.equal(u.world.gifts[g.gift],1);
    assert(World.giveGift(u,character));assert.equal(u.world.gifts[g.gift],0);assert(!World.giveGift(u,character));
    u.world.relationships[id]=55;assert(World.completeRelationshipStep(u,character,1,'Начнём с места для друзей.'));assert.equal(u.world.relationshipChoices[character+':1'],'Начнём с места для друзей.');assert(!World.completeRelationshipStep(u,character,2),'third step requires a real gift');
    assert(World.makeGift(u,character));assert(World.completeRelationshipStep(u,character,2));assert.equal(u.world.gifts[g.gift],0);
    u.world.relationships[id]=100;assert(World.completeRelationshipStep(u,character,3));assert.deepEqual(Array.from(u.world.roomDecor[character]),['lantern']);
    u.world.relationships[id]=160;assert(World.completeRelationshipStep(u,character,4));assert.deepEqual(Array.from(u.world.roomDecor[character]),['lantern','keepsake']);
    const saved=JSON.stringify(u.world);assert(!World.completeRelationshipStep(u,character,4));assert.equal(JSON.stringify(u.world),saved);
    const restored=new User(JSON.parse(JSON.stringify(u)));World.prepare(restored);assert.equal(JSON.stringify(restored.world),saved,'gifts, choices, scenes, room and progress survive reload');
}
u=fresh();assert(!World.makeGift(u,'missing'));assert(!World.completeRelationshipStep(u,'boris',0));
u=fresh();u.world.relationships['player:sveta']=37;delete u.world.gifts;delete u.world.relationshipSteps;delete u.world.roomDecor;delete u.world.relationshipChoices;
World.prepare(u);assert.equal(u.world.relationships['player:sveta'],37);assert(u.world.gifts&&u.world.relationshipSteps&&u.world.roomDecor&&u.world.relationshipChoices,'migrate old saves without losing trust');
u.world.materials.wood=10;const snapshot=JSON.stringify(u.world);fixture.exports.deny(true);assert.throws(()=>World.makeGift(u,'sveta'),/Quota/);fixture.exports.deny(false);assert.deepEqual(JSON.parse(JSON.stringify(u.world)),JSON.parse(snapshot),'failed gift save rolls back materials and inventory');
fixture.exports.deny(true);assert.throws(()=>World.completeRelationshipStep(u,'sveta',0),/Quota/);fixture.exports.deny(false);assert.deepEqual(JSON.parse(JSON.stringify(u.world)),JSON.parse(snapshot),'failed milestone save rolls back XP and completion');
// Check the actual character-header method against the stat used by a door.
const ts=require('typescript'),headerFile=path.join(__dirname,'../src/view/component/house/CharacterPanel.ts');
const headerSource=ts.createSourceFile(headerFile,fs.readFileSync(headerFile,'utf8'),ts.ScriptTarget.Latest,true);
const headerMethod=headerSource.statements.find(ts.isClassDeclaration).members.find(m=>m.name&&m.name.getText(headerSource)==='getCurrentCharacterSkillValue').getText(headerSource);
const headerContext={UserService:{getUser:()=>u},result:null};vm.runInNewContext(ts.transpileModule('class Header {'+headerMethod+'}\nresult=Header;',{compilerOptions:{target:ts.ScriptTarget.ES2015}}).outputText,headerContext);
u=fresh();u.world.training.sveta={knowledge:3};assert.equal(new headerContext.result().getCurrentCharacterSkillValue('knowledge',u.getCharacterById('sveta'),{}),World.stat(u,'sveta','knowledge'),'preparation is visible in the character header');
console.log('PASS relationships and encounters: 15 reachable meetings, no-charge failures, 48h expiry/reload, free retry preparation, four personal gifts, sequential stories, saved rooms and exactly-once rewards.');
