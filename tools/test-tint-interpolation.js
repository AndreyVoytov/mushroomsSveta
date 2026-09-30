const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('assert');
const source = fs.readFileSync('src/core/utils/AnimationUtils.ts', 'utf8');
const moduleObject = {exports:{}};
vm.runInNewContext(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
    {exports:moduleObject.exports,require:()=>({}),Phaser:{}});
const AnimationUtils = moduleObject.exports.default;
let blend, update, complete, delayed;
const tween = {to(){return this},onUpdateCallback(fn){update=fn},onComplete:{addOnce(fn){complete=fn}},start(){}};
const game = {add:{tween(value){blend=value;return tween}},time:{events:{add(delay,fn){delayed=fn}}}};
for(const [start,end] of [[0xffffff,0x9fff9a],[0x9fff9a,0xffffff],[0x777777,0xffffff]]) {
    const sprite={tint:0};AnimationUtils.tint(game,sprite,start,end,1000,0);delayed();
    assert.equal(sprite.tint,start);
    for(let step=0;step<=1000;step++) {
        blend.step=step/10;update();
        assert(Number.isInteger(sprite.tint) && sprite.tint>=0 && sprite.tint<=0xffffff);
        for(const shift of [0,8,16]) {
            const channel=(sprite.tint>>shift)&255,a=(start>>shift)&255,b=(end>>shift)&255;
            assert(channel>=Math.min(a,b) && channel<=Math.max(a,b));
        }
    }
    complete();assert.equal(sprite.tint,end);
}
console.log('RGB tint interpolation: PASS (3003 intermediate colors, no ARGB or channel wrap)');
