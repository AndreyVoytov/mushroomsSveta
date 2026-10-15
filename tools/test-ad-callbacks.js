const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert');
const file='src/core/service/integration/YandexGamesHelper.ts',source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true),cls=source.statements.find(ts.isClassDeclaration),methods=['showFullscreenAdv','showRewardedVideo','canShowRewardedVideo'];
const context={result:null,console:{log(){}}};vm.runInNewContext(ts.transpileModule('class Ads {\n'+cls.members.filter(n=>n.name&&methods.includes(n.name.getText(source))).map(n=>n.getText(source)).join('\n')+'\n}\nresult=Ads;', {compilerOptions:{target:ts.ScriptTarget.ES2015}}).outputText,context);
const Ads=context.result;let callbacks,calls=0,rewards=0,finished=[];
Ads.startGameplay=Ads.stopGameplay=()=>{};Ads.ysdk={adv:{showRewardedVideo:x=>{calls++;callbacks=x.callbacks;},showFullscreenAdv:x=>{calls++;callbacks=x.callbacks;}}};
Ads.showRewardedVideo(()=>rewards++,(...args)=>finished.push(args));Ads.showRewardedVideo(()=>rewards++,(...args)=>finished.push(args));assert.equal(calls,1);callbacks.onRewarded();callbacks.onRewarded();callbacks.onError(Error('synthetic'));callbacks.onClose();assert.equal(rewards,1);assert.deepEqual(finished,[[true,'rewarded']]);
Ads.showFullscreenAdv(x=>finished.push(x));callbacks.onClose(true);callbacks.onClose(true);callbacks.onOffline();assert.equal(finished.length,2);assert.equal(finished[1],true);
Ads.showRewardedVideo(()=>rewards++,(...args)=>finished.push(args));callbacks.onOffline();callbacks.onRewarded();assert.equal(rewards,1);assert.deepEqual(finished[2],[false,'offline']);
console.log('Ad callbacks: PASS — rapid requests, repeated reward/close/error, and offline completion are idempotent.');
