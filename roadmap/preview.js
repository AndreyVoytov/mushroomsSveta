/* Independent canvas illustration. No game imports, saves, analytics or runtime. */
(() => {
  'use strict';
  const data = window.ROADMAP_DATA;
  const root = new URL(location.pathname.includes('/docs/roadmap') ? '../../' : '../', location.href);
  const cache = new Map();
  const boards = new Map();
  const requests = new WeakMap();
  const alias = { bush: 'blueberryBush', moonflowerClosed: 'moonflowerClosed1', flowers: 'chamomileSmall' };
  function url(key) { return data.assets[key] ? new URL(data.assets[key], root).href : ''; }
  function load(key) {
    if (!data.assets[key] && alias[key]) key = alias[key];
    if (cache.has(key)) return cache.get(key);
    const promise = new Promise(resolve => {
      if (!url(key)) { resolve(null); return; }
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url(key);
    });
    cache.set(key, promise);
    return promise;
  }
  function random(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
  function biome(token) {
    if ('wCb'.includes(token)) return 'water';
    if ('mABDEFdn'.includes(token)) return 'mountain';
    if (token === '1') return 'berry';
    if (token === '2') return 'sand';
    return 'forest';
  }
  const fixed = { t:'compass',s:'compass',v:'vision',V:'vision',r:'rocket1',R:'rocket1',q:'rocket2',Q:'rocket2',y:'rocket3',Y:'rocket3',h:'hive',a:'acorn' };
  const fits = {
    lilly:['water'],lavanda:['mountain'],amber:['sand'],emerald:['sand'],strawberry:['berry'],blackberry:['berry'],
    shell:['water','sand'],bush:['forest','mountain'],bush2:['forest','mountain'],chamomileSmall:['forest','mountain'],
    moonflowerClosed:['forest','berry'],book1:['mountain'],lockpick:['mountain'],
  };
  function board(level) {
    if (boards.has(level.number)) return boards.get(level.number);
    const rng = random(level.number * 9187);
    const cells = [...level.mask].map((token, index) => ({token,index,col:index % 7,row:Math.floor(index/7)})).filter(c => c.token !== '0');
    cells.forEach(c => {
      c.x = (c.col + ((c.row + 1) % 2) * .5) * 120;
      c.y = c.row * 127 * .766;
      c.biome = biome(c.token);
      c.content = fixed[c.token] || null;
    });
    const choose = list => list.length ? list[Math.floor(rng()*list.length)] : null;
    function put(key, count, allowed) {
      for(let i=0; i<count; i++) {
        const cell = choose(cells.filter(c => !c.content && (!allowed || allowed.includes(c.biome))));
        if (cell) cell.content = key;
      }
    }
    for (const item of [...(level.interactiveItems || []), ...(level.items || [])]) put(item.name, item.count, fits[item.name] || ['forest']);
    if (level.randomItems) {
      const pool = ['amanita','feather','greenApple','redApple','skull','voodoo','clover'];
      if (level.number > 6) for (let i=1;i<=35;i++) pool.push('t'+i);
      for (let i=0;i<level.randomItems && pool.length;i++) put(pool.splice(Math.floor(rng()*pool.length),1)[0],1);
    }
    for (let i=0;i<(level.bonuses || 0);i++) {
      const cell = choose(cells.filter(c=>!c.content && (c.biome!=='water'||(!(level.ladybugs?.length)&&!level.mask.includes('a')))));
      if (!cell) break;
      let options = ['rabbit','butterfly'];
      if (cell.biome==='mountain') options=['sheep'];
      else if (cell.biome==='sand') options=['crab'];
      else if (cell.biome==='water') options=[level.environment===4||level.mask.includes('b')?'fish':'duck'];
      else if (level.number===64) options=['owl','owlFlying'];
      else if (level.environment===1) options=['owlFlying'];
      else if (level.environment===2) options=['bet'];
      else if (level.environment===3) options=['bird','butterfly2'];
      cell.content=choose(options);
    }
    const neighbors = c => cells.filter(other => other !== c && Math.hypot(other.x-c.x,other.y-c.y)<130);
    const interactive = new Set(cells.filter(c=>c.content));
    for (const cell of cells) {
      if (cell.content) continue;
      const count=neighbors(cell).filter(c=>interactive.has(c)).length;
      if (cell.biome==='water') cell.content=count<=2||level.ladybugs?.length?'wlilly1':'wlilly2';
      else if (level.environment===2) cell.content='mirror';
      else if (cell.biome==='sand'&&!count) cell.content='cactus';
      else if (cell.biome==='berry'&&!count) cell.content='stump';
      else cell.content = rng()<.5 || count===0 || count>3 ? 'tree' : count===1?'stone':count===2?'log':'stump';
    }
    const scatter = (name, count, predicate) => {
      const free=cells.filter(predicate);
      for(let i=0;i<count && free.length;i++) {
        const c=free.splice(Math.floor(rng()*free.length),1)[0];
        c.extra = (c.extra || []).concat(name);
      }
    };
    const fixedBerries=cells.reduce((sum,c)=>sum+(c.token==='k'?1:c.token==='K'?2:0),0);
    scatter('cankerberry', Math.max(0,(level.cankerberries||0)-fixedBerries), c=>'lijABD'.includes(c.token));
    scatter('dragonfly', Math.max(0,(level.dragonflies||0)-cells.filter(c=>c.token==='f').length), c=>'glijABD'.includes(c.token));
    scatter('jellyMushroom', level.jellyMushrooms||0, c=>c.token==='c');
    scatter('chamomileSmall',level.flowers||0,c=>c.biome==='forest'&&!fixed[c.token]);
    const result={cells,neighbors};
    boards.set(level.number,result);
    return result;
  }
  function cover(level,c) {
    if (c.biome==='water') return 'hexWater';
    if (c.biome==='mountain') return 'hexMountain';
    if (c.biome==='berry') return 'hexFlower';
    if (c.biome==='sand') return 'hexSand';
    return level.environment===2?'hexHouse':level.environment===1?'hexDF':'hex';
  }
  function leaf(level,c) {
    return {water:'drop',mountain:'mount',berry:'pinkFlower',sand:'sandPyramid'}[c.biome] || level.leafType || 'leaf1';
  }
  function ground(level,c) {
    return c.biome==='water'?'water':c.biome==='sand'?'sand':c.biome==='berry'?'grassFlower':level.environment===2?'hexWood':level.environment===1?'grassDF':'grass';
  }
  function overlays(c) {
    const result=[];
    if ('lijtVRQYkKfpPzABDEFd'.includes(c.token)) result.push('liana');
    if ('ijKfpPzBDEFd'.includes(c.token)) result.push('liana2','liana3');
    if ('jDzd'.includes(c.token)) result.push('liana2');
    if ('pE'.includes(c.token)) result.push('plank1');
    if ('PF'.includes(c.token)) result.push('plank2');
    if ('zd'.includes(c.token)) result.push('plank3');
    if (c.token==='c') result.push('jelly');
    if (c.token==='C') result.push('cold');
    if ('kK'.includes(c.token)) result.push('cankerberry');
    if (c.token==='f') result.push('dragonfly');
    if (c.token==='b') result.push('boat');
    if ('en'.includes(c.token)) result.push('bee');
    return result.concat(c.extra || []);
  }
  async function draw(canvas, level, mode='covered') {
    const ticket={}; requests.set(canvas,ticket);
    const {cells}=board(level);
    const bg=data.environments[level.environment].field;
    const keys=new Set([bg,'ladybug']);
    cells.forEach(c=>[ground(level,c),cover(level,c),leaf(level,c),c.content,...overlays(c)].forEach(k=>keys.add(k)));
    const images=new Map(await Promise.all([...keys].map(async key=>[key,await load(key)])));
    if (requests.get(canvas)!==ticket) return;
    const ctx=canvas.getContext('2d');
    const width=canvas.width, height=canvas.height;
    ctx.clearRect(0,0,width,height);
    const bgImage=images.get(bg);
    if(bgImage){const s=Math.max(width/bgImage.width,height/bgImage.height);ctx.drawImage(bgImage,(width-bgImage.width*s)/2,(height-bgImage.height*s)/2,bgImage.width*s,bgImage.height*s);}
    else{ctx.fillStyle='#4e6342';ctx.fillRect(0,0,width,height);}
    ctx.fillStyle='#203c2638';ctx.fillRect(0,0,width,height);
    if(!cells.length)return;
    const minX=Math.min(...cells.map(c=>c.x))-66, maxX=Math.max(...cells.map(c=>c.x))+66;
    const minY=Math.min(...cells.map(c=>c.y))-72, maxY=Math.max(...cells.map(c=>c.y))+74;
    const scale=Math.min((width-32)/(maxX-minX),(height-66)/(maxY-minY));
    const ox=(width-(maxX-minX)*scale)/2-minX*scale;
    const oy=42+(height-54-(maxY-minY)*scale)/2-minY*scale;
    ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
    function sprite(key,x,y,w=120,h=127,stretch=true) {
      const image=images.get(key);if(!image)return;
      if(!stretch){const s=Math.min(w/image.width,h/image.height);w=image.width*s;h=image.height*s;}
      ctx.drawImage(image,x-w/2,y-h/2,w,h);
    }
    for(const c of cells){
      sprite(ground(level,c),c.x,c.y);
      if(mode==='contents'||fixed[c.token])sprite(c.content,c.x,c.y,114,121,false);
      if(mode!=='contents'&&!fixed[c.token]){sprite(cover(level,c),c.x,c.y);sprite(leaf(level,c),c.x,c.y);}
      overlays(c).forEach(key=>sprite(key,c.x,c.y,120,127));
    }
    // Hex edges, same six directions as SeparatorType.
    const edges=[[-60,-32,0,-64],[-60,-32,-60,32],[-60,32,0,64],[0,-64,60,-32],[60,-32,60,32],[0,64,60,32]];
    for(const separator of level.separators||[]){
      const x=(separator.X+((separator.Y+1)%2)*.5)*120,y=separator.Y*127*.766;
      const type=typeof separator.type==='number'?separator.type:['lefttop','left','leftbottom','righttop','right','rightbottom'].indexOf(String(separator.type).split('.').pop());
      const e=edges[type];if(!e)continue;
      ctx.beginPath();ctx.moveTo(x+e[0],y+e[1]);ctx.lineTo(x+e[2],y+e[3]);ctx.strokeStyle='#563921';ctx.lineWidth=9;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#cfaa6a';ctx.lineWidth=4;ctx.stroke();
    }
    // Ladybugs begin above the board; their progress is dynamic in the game.
    (level.ladybugs||[]).forEach((value,i)=>{
      const x=minX+(maxX-minX)*(i+1)/((level.ladybugs||[]).length+1);
      sprite('ladybug',x,minY+5,48,51,false);
    });
    ctx.restore();
  }
  window.RoadmapPreview={draw,url,board};
})();
