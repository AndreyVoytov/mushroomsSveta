const assert=require('assert'),fs=require('fs'),path=require('path'),{analyze}=require('./analyze-telemetry');
const at=Date.parse('2026-10-14T08:00:00Z'),events=[];
function event(id,name,seconds,extra={}){const e=Object.assign({schemaVersion:1,id,name,at:at+seconds*1000,playerId:'fixture-player',sessionId:'s0',cohort:'production',configVersion:'world-1'},extra);events.push(e);return e;}
event('0','session_start',0);event('1','attempt_start',5,{mode:'campaign',branchId:'main',levelId:'7',attemptId:'a1'});
event('op1','resource',10,{currency:'energy',amount:-10,reason:'open_cell',balanceAfter:110,attemptId:'a1',mode:'campaign',branchId:'main',levelId:'7'});
event('op2','resource',20,{currency:'energy',amount:3,reason:'field_refund',balanceAfter:113,attemptId:'a1',mode:'campaign',branchId:'main',levelId:'7'});
const end=event('2','attempt_end',125,{mode:'campaign',branchId:'main',levelId:'7',attemptId:'a1',result:'complete'});
event('3','attempt_start',150,{mode:'event',branchId:'forestsEvent2',levelId:'event2_7',attemptId:'a2'});
event('4','attempt_end',250,{mode:'event',branchId:'forestsEvent2',levelId:'event2_7',attemptId:'a2',result:'abandoned'});
event('5','runtime_error',270,{message:'Synthetic fixture error'});event('6','session_end',300);
event('7','session_start',86400,{sessionId:'s1'});event('8','session_start',30*86400,{sessionId:'s30'});
event('test','session_start',10,{playerId:'test-fixture',sessionId:'stest',cohort:'test'});
events.push(end,{name:'invalid'});const result=analyze({events});
assert.equal(result.players,1);assert.equal(result.completed,1);assert.equal(result.quality.duplicates,1);assert.equal(result.quality.invalid,1);assert.equal(result.quality.testEvents,1);assert.equal(result.quality.errors,1);
assert.equal(result.retention.D1.percent,100);assert.equal(result.retention.D7.percent,0);assert.equal(result.retention.D30.percent,100);
assert.equal(result.levels['campaign/main/7'].gross,10);assert.equal(result.levels['campaign/main/7'].refund,3);assert.equal(result.levels['campaign/main/7'].seconds,120);assert.equal(result.levels['event/forestsEvent2/event2_7'].abandoned,1);
assert.equal(analyze({events},{includeTests:true}).players,2);
if(process.argv.includes('--fixture'))fs.writeFileSync(path.join(__dirname,'../docs/implementation/telemetry-fixture.json'),JSON.stringify({schemaVersion:1,synthetic:true,events},null,2)+'\n');
console.log('Telemetry: PASS — cohorts, deduplication, mature retention denominators, separate level modes, duration and gross/refund energy.');
