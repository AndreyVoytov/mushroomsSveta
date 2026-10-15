// Run: node tools/test-snail-sparks.js
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
function Group(game,parent){this.game=game;this.children=[];this.exists=true;this.parent=parent;}
Group.prototype.add=function(s){this.children.push(s);s.parent=this;};
Group.prototype.destroy=function(){this.exists=false;this.children=[];};
function sprite(game,x,y,key){const s={key,anchor:{set(){}},position:{set(x,y){s.x=x;s.y=y;}}};return s;}
const exportsForFx={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/view/component/forest/SnailSpinEffects.ts'),'utf8'),{
    compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES5}
}).outputText,{exports:exportsForFx,Phaser:{Group},require:n=>({default:n.endsWith('SpriteUtils')?{createSprite:sprite}:{primeForShow(){}}})});
const source={x:200,y:300,exists:true,visible:true},game={world:{},time:{elapsedMS:16.67}};
const fx=new exportsForFx.default(game,source);
assert(fx.children.every(s=>s.key===exportsForFx.default.PARTICLE_IMAGE&&s.tint===undefined),'stairs use the same unmodified particle texture as directed reveals');
let emitted=0;
for(let frame=0;frame<120;frame++){
    fx.update();assert.equal(fx.children.length,28);
    fx.sparks.filter(p=>p.sprite.visible).forEach(p=>{
        emitted++;
        assert(Number.isFinite(p.sprite.x)&&Number.isFinite(p.sprite.y));
        assert(p.side*(p.sprite.x-p.x)>=-0.001&&p.sprite.y<=p.y+0.001,'sparks climb outwards and upwards');
        assert(p.sprite.alpha>=0&&p.sprite.alpha<=1);
    });
}
assert(emitted>100);
assert(fx.sparks.some(p=>p.side<0)&&fx.sparks.some(p=>p.side>0));
source.visible=false;
for(let frame=0;frame<100&&fx.exists;frame++)fx.update();
assert(!fx.exists,'pool disappears after the snail and its remaining sparks finish');
console.log('Snail sparks: bounded 28-sprite pool, two rising stair paths, varied trajectories, fade and cleanup passed.');
