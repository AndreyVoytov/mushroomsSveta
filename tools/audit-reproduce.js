// Historical audit reproduction at the audited revision. Current behavior: test-world.js.
const fs = require('fs');
const {execFileSync}=require('child_process');
const revision='7a9d212fa04fe2a69ab254f5baea53472f720519';
const ts = require('typescript');
const vm = require('vm');
const assert = require('assert');
function extract(file, name, methods, context) {
  const source = ts.createSourceFile(file, execFileSync('git',['show',revision+':'+file],{encoding:'utf8'}), ts.ScriptTarget.Latest, true);
  const cls = source.statements.find(n => ts.isClassDeclaration(n));
  const code = `class ${name} {\n${cls.members.filter(n => n.name && methods.includes(n.name.getText(source))).map(n => n.getText(source)).join('\n')}\n}\nresult = ${name}`;
  vm.runInNewContext(ts.transpileModule(code, {compilerOptions:{target:ts.ScriptTarget.ES2015}}).outputText, context);
  return context.result;
}
const now = Date.parse('2026-10-14T01:00:00Z');
class FixedDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
let writes = 0;
const context = {Date:FixedDate, ServerStoreComponent:{saveLocalUser(){writes++;}}, EverydayRubyPanel:{RUBIES_COUNT:50}, SoundUtils:{successfulEverydayGems(){}}, EnergyUtils:{ENERGY_PER_PURCHASE:100,MAX_ENERGY:120,MILLIS_FOR_ENERGY:30000}, result:null};
const User = extract('src/core/model/user/User.ts','User',['haveEverydayGemsToTake','tryGiveEverydayGems','buyEnergyPack','addEnergy'],context);
const daily = new User();
daily.supermoney=0; daily.supermoneyTakenAt=now-86400000;
daily.tryGiveEverydayGems(null);
const eligibleAgain = daily.haveEverydayGemsToTake();
daily.tryGiveEverydayGems(null);
assert.equal(daily.supermoney,100);
assert.equal(eligibleAgain,true);
assert.equal(writes,0);
const energy = new User(); energy.supermoney=100; energy.energy=10;
energy.lastEnergyRegenerationAt=now-30*60*1000; energy.energyPurchasesToday=0;
energy.resetDailyEnergyPurchasesIfNeeded=()=>{}; energy.getCurrentEnergyPurchasePrice=()=>10;
assert.equal(energy.buyEnergyPack(),true);
assert.equal(energy.energy,110);
const expectedEnergy = Math.min(120,10+60)+100;
const overflow = new User(); overflow.energy=220; overflow.updateEnergy=()=>{};
overflow.addEnergy(1,false);
assert.equal(overflow.energy,120);
const serverContext={result:null,Settings:{PLAIN_MODE:true},Utils:{},ServerStoreComponent:null};
const Server=extract('src/core/service/store/ServerStoreComponent.ts','Server',['addSessionToUrl'],serverContext);
serverContext.ServerStoreComponent=Server; Server.getServerSessionId=()=> 'test-session';
const url=Server.addSessionToUrl('/user?plain=true');
assert.equal(url,'/user;jsessionid=test-sessionplain=true');
console.log(JSON.stringify({date:'2026-10-14',method:'Isolated execution of unchanged source methods with controlled clocks and mocked I/O',daily:{utcTime:'01:00',grants:2,gems:100,eligibleAgain,persistenceCalls:0},energy:{stored:10,elapsedMinutes:30,actualAfterBuy:energy.energy,expectedAfterRegenerationAndBuy:expectedEnergy},overflow:{before:220,refund:1,actual:overflow.energy,expected:220},sessionUrl:{actual:url,expected:'/user;jsessionid=test-session?plain=true'}},null,2));
