// Actual placement + adjacency rules, reproducible seeds; this is not a win-rate simulator.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),cache={};
function load(file){const full=path.resolve(root,file);if(cache[full])return cache[full];const exports=cache[full]={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2015,module:ts.ModuleKind.CommonJS}}).outputText,{exports,require:n=>n.endsWith('/Game')?{default:{}}:load(path.resolve(path.dirname(full),n+'.ts'))});return exports;}
function extract(file,name,members,context){const src=ts.createSourceFile(file,fs.readFileSync(path.join(root,file),'utf8'),ts.ScriptTarget.Latest,true),cls=src.statements.find(ts.isClassDeclaration);const selected=cls.members.filter(n=>n.name&&members.includes(n.name.getText(src))).map(n=>n.getText(src)).join('\n');vm.runInNewContext(ts.transpileModule('class '+name+' {\n'+selected+'\n}\nresult='+name+';',{compilerOptions:{target:ts.ScriptTarget.ES2015}}).outputText,context);return context.result;}
const contents=load('src/core/model/enum/ContentType.ts'),CellType=load('src/core/model/enum/CellType.ts').default;
const c=Object.assign({CellType,BiomType:load('src/core/model/enum/BiomType.ts').default,Environment:load('src/core/model/enum/Environment.ts').default,
    BoosterType:load('src/core/model/enum/BoosterType.ts').default,NeverError:Error,result:null},contents);
c.Utils=extract('src/core/utils/Utils.ts','Utils',['randomSource','withRandomSeed','random','randomBoolean','getRandomElement','shuffle','enumValues','enumToKeyValueArray','enumKeys'],c);
c.ForestUtils=extract('src/core/utils/ForestUtils.ts','ForestUtils',['getChar','getCellType','getBiom','getBioms','getCoverFreeNotBoosterItem','isCoverFreeNotBoosterItem','getBoosterContentType','getBoosterInfo','isCloverReskin'],c);
c.Base=extract('src/core/service/provider/BaseCellsProvider.ts','Base',['areAdjucentCoordinates','areAdjucent','isInteractiveState','isInteractive','getAdjucentInteractiveCount'],c);
c.ForestCell=load('src/core/model/forest/ForestCell.ts').default;c.TypesInfo=load('src/core/model/forest/TypesInfo.ts').default;
c.UserService={getUser:()=>({})};c.SpecialItemsConfiguration={allItems:[]};let failures=[];c.console={log(){},error:x=>failures.push(x)};
c.alert=x=>failures.push(x);
const Provider=extract('src/core/service/provider/CellsProvider.ts','CellsProvider',['generateCells','generateTypes','generateCellsFromTypes','getTreeContent','configureHiveGroups','getEmptyCell','resolveHiveGroups','findMaskIndex','getBestHiveAnchorCell','getBestHiveAnchorIndex','getMaxHoneyForHiveGroup'],c);
Object.getOwnPropertyNames(c.Base.prototype).filter(k=>k!=='constructor').forEach(k=>Provider.prototype[k]=c.Base.prototype[k]);
Provider.MAX_GENERATION_ATTEMPTS_COUNT=100;
const WorldLevels=load('src/core/configuration/WorldLevels.ts').default;
let boards=0,totalAttempts=0,maxAttempts=0;
for(const [id,names] of Object.entries(WorldLevels.routes))for(let i=0;i<names.length;i++){
    const level=WorldLevels.get(id,i);assert.equal(level.mask.length%7,0,level.name);
    for(let seed=1;seed<=30;seed++){
        const provider=new Provider();provider.forestType=level;provider.mask=[...level.mask].map((ch,index)=>({X:index%7,Y:Math.floor(index/7),type:c.ForestUtils.getCellType(ch),leaf:'leaf1'})).filter(x=>x.type!==CellType.EMPTY);provider.getMask=()=>provider.mask;
        let attempts=0;const generate=provider.generateTypes;provider.generateTypes=function(...args){attempts++;return generate.apply(this,args);};
        failures=[];const cells=c.Utils.withRandomSeed(seed,()=>provider.generateCells());
        assert(!failures.length,level.name+' seed '+seed+': '+failures.join(', '));
        for(const item of level.items)assert.equal(cells.filter(x=>x.state.content===contents.ContentType[item.name]).length,item.count,level.name+' / '+item.name);
        assert.equal(cells.length,provider.mask.length);totalAttempts+=attempts;maxAttempts=Math.max(maxAttempts,attempts);boards++;
        const replay=new Provider();replay.forestType=level;replay.mask=provider.mask;replay.getMask=()=>replay.mask;
        const again=c.Utils.withRandomSeed(seed,()=>replay.generateCells());assert.deepEqual(cells.map(x=>x.state.content),again.map(x=>x.state.content),'same seed must replay');
    }
}
console.log('World fields: PASS — '+boards+' seeded boards, '+Object.values(WorldLevels.routes).reduce((n,a)=>n+a.length,0)+' story stops; average generation attempts '+(totalAttempts/boards).toFixed(2)+', max '+maxAttempts+'. No claim about completion probability.');
