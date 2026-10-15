// Run: node tools/test-item-ground-shadow.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
const path = require('path');
function Sprite(game, x, y) {
    Object.assign(this, {x,y,anchor:{set(){}},destroy(){this.pendingDestroy=true;this.parent=null;}});
}
const exportsForShadow = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,
    '../src/view/component/forest/ItemGroundShadow.ts'), 'utf8'), {
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}
}).outputText, {exports:exportsForShadow,Phaser:{Sprite},require:()=>({default:{primeForShow(){}}})});
const Shadow = exportsForShadow.default;
let generated = 0, cached;
const game = {cache:{getBitmapData:()=>cached},make:{bitmapData:()=>{
    generated++;
    return cached={context:{createRadialGradient:()=>({addColorStop(){}}),fillRect(){}}};
}}};
for (const scale of [0.5,1,2]) {
    const tile = {x:200,y:300,scale:{x:scale,y:scale},addChild:s=>{s.parent=tile;}};
    const item = {x:200,y:300,width:120,height:127,anchor:{y:0.5},alpha:1};
    const fx = new Shadow(game,{bg:tile},item);
    const sprite = fx.sprite;
    const width = sprite.width, alpha = sprite.alpha, groundY = sprite.y;
    assert(Math.abs(width * scale - 81.6) < 0.001, 'same footprint on scaled tiles');
    item.y -= 70;
    fx.update(item);
    assert(sprite.alpha < alpha && sprite.alpha > 0);
    assert(sprite.width > width, 'penumbra spreads as item rises');
    assert.equal(sprite.y, groundY, 'shadow remains on the ground');
    item.y -= 250;
    fx.update(item);
    assert.equal(sprite.alpha, 0);
    assert.equal(sprite.visible, false);
    fx.destroy();
    assert(sprite.pendingDestroy);
    fx.update(item); fx.destroy();
}
assert.equal(generated,1,'one shared texture across rapid collections');
console.log('Item shadows: ground anchoring, spread, altitude fade, tile scaling, texture reuse and cleanup passed.');
