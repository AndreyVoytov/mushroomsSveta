(() => {
  'use strict';
  const D=window.ROADMAP_DATA, P=window.RoadmapPreview;
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image=(key,cls='',alt='')=>P.url(key)?`<img class="${cls}" src="${esc(P.url(key))}" alt="${esc(alt)}" loading="lazy" decoding="async">`:'';
  const catNames={tile:'Клетка',mechanic:'Механика',animal:'Животное',item:'Находка',story:'Сюжетный объект',location:'Окружение'};
  const boosterNames={compass:'Улитка-компас',rocket:'Ракета',glove:'Перчатка',beans:'Бобы',vision:'Сфера зрения',rainbow:'Радуга'};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const store={get(key,fallback){try{return JSON.parse(localStorage.getItem('game-roadmap:'+key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem('game-roadmap:'+key,JSON.stringify(value));}catch{}}};
  let unit=clamp(Number(store.get('unit',260))||260,160,420);
  let linked=store.get('linked',true), selected=null, activeStage=null, oldFocus=null, hovering=null, timer;
  const scrollTop=$('levels-scroll'), scrollStory=$('story-scroll');
  const origin=()=>unit*.5+24;
  const X=n=>origin()+(n-1)*unit;
  const Y=n=>249+Math.sin((n-1)*.9)*12;
  const levelForX=x=>clamp((x-origin())/unit+1,1,D.levels.length);
  const totalWidth=()=>X(D.levels.length)+unit*3+100;
  const stageWidth=s=>(s.continuation?3:s.end-s.start)*unit;
  const energyY=steps=>57-clamp(steps,0,30)*.9;
  const getStage=number=>[...D.stages].reverse().find(s=>s.start<=number)||D.stages[0];
  const energyIcon=()=>image('lightning','energy-icon');
  document.documentElement.style.setProperty('--tutorial-panel',`url("${P.url('helperPanel2')}")`);
  $('total-levels').textContent=D.levels.length;
  $('overview').max=D.levels.length;
  $('chapter').innerHTML+='<option value="1">Начало игры</option>'+D.stages.map(s=>`<option value="${s.start}">${s.start} · ${esc(s.title)}</option>`).join('');
  const rootURL=new URL(location.pathname.includes('/docs/roadmap')?'../../':'../',location.href);
  $('mechanics-link').href=new URL(location.pathname.includes('/docs/roadmap')?'docs/mechanics/':'mechanics/',rootURL).href;
  const backgroundRuns=[];
  for(const level of D.levels){
    const key=D.environments[level.environment].field;
    const header=P.headerKey(level);
    const last=backgroundRuns[backgroundRuns.length-1];
    if(last?.key===key&&last.header===header)last.end=level.number+1;
    else backgroundRuns.push({start:level.number,end:level.number+1,key,header});
  }
  const storyRuns=[];
  for(const stage of D.storyLocations){
    const last=storyRuns[storyRuns.length-1];
    if(last?.key===stage.background)last.end=stage.end;
    else storyRuns.push({start:stage.start,end:stage.end,key:stage.background});
  }
  function backgroundHTML(runs,story=false){
    const segment=(r,left,width)=>`<div class="background-segment ${story?'story-scenery':'field-scenery'}" data-bg="${esc(r.key)}" data-left="${left}" data-width="${width}" style="left:${left}px;width:${width}px">${r.header?`<div class="field-header ${r.header==='carpet'?'house-header':''}" data-header="${esc(r.header)}"></div>`:''}</div>`;
    return runs.map(r=>{
      const left=X(r.start)-unit*.7,right=X(r.end)+unit*.3;
      if(!story)return segment(r,left,right-left);
      // Repeat short, proportionate views rather than stretching a portrait across a chapter.
      const count=Math.max(1,Math.ceil((right-left)/400)),step=(right-left)/count;
      return Array.from({length:count},(_,i)=>segment(r,left+i*step-40,step+80)).join('');
    }).join('');
  }
  function render(){
    const width=totalWidth();
    document.documentElement.style.setProperty('--unit',unit+'px');
    $('zoom-value').textContent=Math.round(unit/260*100)+'%';
    $('zoom-out').disabled=unit<=160;$('zoom-in').disabled=unit>=420;
    for(const id of ['levels-scene','story-scene'])$(id).style.width=width+'px';
    $('level-backgrounds').innerHTML=backgroundHTML(backgroundRuns);
    $('story-backgrounds').innerHTML=backgroundHTML(storyRuns,true);
    const svg=$('path-svg');svg.setAttribute('viewBox',`0 0 ${width} 470`);svg.setAttribute('preserveAspectRatio','none');
    // Coordinates stay fixed vertically, even when the pane is taller.
    svg.style.height='470px';
    let path=`M 0 ${Y(1)} L ${X(1)} ${Y(1)}`;
    for(let n=2;n<=D.levels.length;n++)path+=` C ${X(n-1)+unit*.5} ${Y(n-1)},${X(n)-unit*.5} ${Y(n)},${X(n)} ${Y(n)}`;
    path+=` L ${width} ${Y(D.levels.length)}`;
    svg.innerHTML=`<path d="${path}" fill="none" stroke="#fdf5d8" stroke-width="18"/><path d="${path}" fill="none" stroke="#afb888" stroke-width="10"/><path d="${path}" fill="none" stroke="#f3edc7" stroke-width="2" stroke-dasharray="3 9"/>`;
    const energy=$('energy-svg');energy.setAttribute('viewBox',`0 0 ${width} 80`);energy.style.width=width+'px';
    const points=D.levels.map(l=>`${X(l.number)},${energyY(l.steps)}`).join(' ');
    energy.innerHTML=`<polyline points="${points}" fill="none" stroke="#946e44" stroke-width="1.5" opacity=".55"/>`;
    $('level-content').innerHTML='<span class="energy-caption">Энергия</span>'+D.levels.map(l=>{
      const x=X(l.number),y=Y(l.number),firsts=l.firsts.filter(f=>f.category!=='story');
      const primary=l.tutorials[0];
      return `<span class="energy-value" style="left:${x}px;top:${energyY(l.steps)}px" title="Базовая энергия уровня ${l.number}: ${l.steps}">${energyIcon()}${l.steps}</span>`+
      (primary?`<button class="tutorial-card" data-level="${l.number}" style="left:${x}px" aria-label="Обучение на уровне ${l.number}"><span class="eyebrow">Обучение</span><p>${esc(primary.text)}</p>${l.tutorials.length>1?`<span class="tutorial-more">Ещё подсказок: ${l.tutorials.length-1}</span>`:''}${image(primary.image)}</button>`:'')+
      (l.objects.length?`<button class="story-object" data-level="${l.number}" style="left:${x}px" aria-label="Сюжетные находки уровня ${l.number}: ${esc(l.objects.map(o=>o.name).join(', '))}">${l.objects.slice(0,2).map(o=>image(o.image)).join('')}</button>`:'')+
      `<button class="level-node ${l.hardLevel?'hard':''} ${l.firsts.length?'has-first':''} ${selected===l.number?'selected':''}" data-level="${l.number}" data-hover="${l.number}" style="left:${x}px;top:${y}px" aria-label="Уровень ${l.number}, ${D.environments[l.environment].name}, энергия ${l.steps}${l.hardLevel?', сложный':''}">${l.number}</button>`+
      (firsts.length?`<button class="first-card" data-level="${l.number}" style="left:${x}px" aria-label="Первые появления уровня ${l.number}"><span class="eyebrow">Впервые · ${firsts.length}</span><div class="first-items">${firsts.slice(0,unit<220?3:5).map(f=>`<span class="first-item">${image(f.image)}<span>${esc(f.name)}</span></span>`).join('')}</div>${firsts.length>(unit<220?3:5)?`<div class="first-overflow">+ ${firsts.length-(unit<220?3:5)} открытия →</div>`:''}</button>`:
      l.objects.length?'':`<span class="quiet-level" style="left:${x}px">${image(l.randomItems?'hexChest':l.items?.find(i=>i.count>0)?.name)}Находки: ${(l.items||[]).reduce((sum,i)=>sum+i.count,0)+(l.randomItems||0)}</span>`);
    }).join('');
    $('story-content').innerHTML=D.stages.map(s=>{
      const width=stageWidth(s);
      const hook=s.dialogues.find(d=>d.text);
      return `<span class="stage-tick" style="left:${X(s.start)}px" title="После уровня ${s.start}"></span><div class="stage-band" data-stage-band="${s.index}" style="left:${X(s.start)}px;width:${width}px"><span class="stage-range">${s.continuation?'Продолжение после ур. '+s.start:'После ур. '+s.start+' → '+(s.end<=D.levels.length?s.end:'дальше')}</span><div class="stage-progress">${Array.from({length:s.end-s.start-1},()=>'<i></i>').join('')}</div><button class="stage-card" data-stage="${s.index}">${image(s.image,'stage-image')}<div class="stage-info"><span class="eyebrow">${esc(s.location)} · ${s.map?'Маршрут':'Цель'}</span><h3>${esc(s.title)}</h3><p>${esc(s.description||s.notes[0]||'Продолжение путешествия')}</p>${hook?`<p class="stage-hook">«${esc(hook.text)}»</p>`:''}<div class="stage-characters">${s.characters.slice(0,4).map(c=>`<span class="character">${image(c.image)}${esc(c.name)}</span>`).join('')}</div></div><span class="stage-arrow">↗</span></button></div>`;
    }).join('');
    updateViewport();
  }
  let scrollFrame=0;
  function updateViewport(){
    const left=scrollTop.scrollLeft, visible=scrollTop.clientWidth;
    $('overview').value=levelForX(left+visible*.25);
    for(const [container,scroll] of [[$('level-backgrounds'),scrollTop],[$('story-backgrounds'),scrollStory]]){
      [...container.children].forEach(element=>{
        const x=+element.dataset.left,w=+element.dataset.width;
        const visible=x+w+unit>scroll.scrollLeft&&x-unit<scroll.scrollLeft+scroll.clientWidth;
        if(visible&&!element.style.backgroundImage){
          element.style.backgroundImage=`url("${P.url(element.dataset.bg)}")`;
          const header=element.querySelector('[data-header]');
          if(header)header.style.backgroundImage=`url("${P.url(header.dataset.header)}")`;
        }
      });
    }
    // Keep each long-running goal readable as its band passes under the viewport.
    document.querySelectorAll('.stage-band').forEach(el=>{
      const stage=D.stages[+el.dataset.stageBand],card=el.querySelector('.stage-card');
      const offset=clamp(scrollStory.scrollLeft-X(stage.start)+16,14,stageWidth(stage)-card.offsetWidth-14);
      card.style.marginLeft=Math.max(14,offset)+'px';
    });
  }
  function scheduleViewport(){if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;updateViewport();});}
  function syncFrom(source,target){
    hideHover();
    if(linked&&Math.abs(source.scrollLeft-target.scrollLeft)>1)target.scrollLeft=source.scrollLeft;
    scheduleViewport();
    clearTimeout(timer);timer=setTimeout(()=>store.set('position',levelForX(scrollTop.scrollLeft+Math.min(210,scrollTop.clientWidth*.28))),220);
  }
  scrollTop.addEventListener('scroll',()=>syncFrom(scrollTop,scrollStory),{passive:true});
  scrollStory.addEventListener('scroll',()=>syncFrom(scrollStory,scrollTop),{passive:true});
  function jump(number){
    const n=clamp(Number(number)||1,1,D.levels.length),left=Math.max(0,X(n)-Math.min(210,scrollTop.clientWidth*.28));
    // Both panels scroll together without competing smooth-scroll animations.
    scrollTop.scrollLeft=left;if(linked)scrollStory.scrollLeft=left;
    $('announcement').textContent='Уровень '+Math.round(n);
    scheduleViewport();
  }
  function changeZoom(delta){
    const center=levelForX(scrollTop.scrollLeft+scrollTop.clientWidth/2);
    unit=clamp(unit+delta,160,420);store.set('unit',unit);render();
    scrollTop.scrollLeft=Math.max(0,X(center)-scrollTop.clientWidth/2);
    if(linked)scrollStory.scrollLeft=scrollTop.scrollLeft;
  }
  $('zoom-in').onclick=()=>changeZoom(40);$('zoom-out').onclick=()=>changeZoom(-40);
  $('overview').addEventListener('input',e=>jump(e.target.value,false));
  $('home').onclick=()=>jump(1);
  $('chapter').onchange=e=>{if(e.target.value)jump(+e.target.value);};
  const toolbarToggle=$('toolbar-toggle');
  function setToolbar(open){
    $('toolbar').hidden=!open;
    toolbarToggle.setAttribute('aria-expanded',String(open));
    toolbarToggle.setAttribute('aria-label',open?'Свернуть панель':'Развернуть панель');
    toolbarToggle.title=open?'Свернуть панель':'Развернуть панель';
    toolbarToggle.classList.toggle('expanded',open);
    if(!open){$('layers').hidden=true;$('search-results').hidden=true;$('layers-toggle').setAttribute('aria-expanded','false');}
  }
  toolbarToggle.onclick=()=>setToolbar($('toolbar').hidden);
  function setLinked(){ $('sync-toggle').classList.toggle('active',linked);$('sync-toggle').setAttribute('aria-pressed',String(linked));$('sync-toggle').textContent=linked?'↔ Общая шкала':'↔ Раздельно'; }
  $('sync-toggle').onclick=()=>{linked=!linked;store.set('linked',linked);setLinked();if(linked)scrollStory.scrollLeft=scrollTop.scrollLeft;};setLinked();
  $('layers-toggle').onclick=()=>{const open=$('layers').hidden;$('layers').hidden=!open;$('layers-toggle').setAttribute('aria-expanded',String(open));};
  document.querySelectorAll('[data-layer]').forEach(input=>{
    const key=input.dataset.layer;input.checked=store.get('layer:'+key,true);
    document.body.classList.toggle('hide-'+key,!input.checked);
    input.onchange=()=>{document.body.classList.toggle('hide-'+key,!input.checked);store.set('layer:'+key,input.checked);};
  });
  document.addEventListener('click',e=>{if(!e.target.closest('#layers,#layers-toggle')){$('layers').hidden=true;$('layers-toggle').setAttribute('aria-expanded','false');}});
  $('about-open').onclick=()=>{$('layers').hidden=true;$('about').showModal();};$('about-close').onclick=()=>$('about').close();
  // Drag either canvas; controls retain their usual click behavior.
  for(const scroller of [scrollTop,scrollStory]){
    let drag=null,suppress=false;
    scroller.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='mouse'||e.button!==0)return;
      drag={x:e.clientX,y:e.clientY,left:scroller.scrollLeft,top:scroller.scrollTop,moved:false,id:e.pointerId};
    });
    scroller.addEventListener('pointermove',e=>{
      if(!drag)return;
      if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>6){drag.moved=true;scroller.setPointerCapture(e.pointerId);scroller.classList.add('dragging');hideHover();}
      if(drag.moved){scroller.scrollLeft=drag.left-(e.clientX-drag.x);scroller.scrollTop=drag.top-(e.clientY-drag.y);}
    });
    const stop=()=>{if(drag?.moved){suppress=true;setTimeout(()=>suppress=false,0);}drag=null;scroller.classList.remove('dragging');};
    scroller.addEventListener('pointerup',stop);scroller.addEventListener('pointercancel',stop);
    scroller.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();}},true);
    scroller.addEventListener('wheel',e=>{
      if(e.ctrlKey)return;
      if(Math.abs(e.deltaX)<1 && scroller.scrollHeight<=scroller.clientHeight+2){e.preventDefault();scroller.scrollLeft+=e.deltaY;}
    },{passive:false});
  }
  const splitter=$('splitter');
  function setSplit(value){const v=clamp(value,25,78);document.documentElement.style.setProperty('--upper',v+'%');splitter.setAttribute('aria-valuenow',Math.round(v));store.set('split',v);}
  const defaultSplit=innerWidth<=700?65:61;
  setSplit(Number(store.get('split',defaultSplit))||defaultSplit);
  splitter.onpointerdown=e=>{splitter.setPointerCapture(e.pointerId);splitter.classList.add('resizing');};
  splitter.onpointermove=e=>{if(splitter.hasPointerCapture(e.pointerId)){const rect=$('workspace').getBoundingClientRect();setSplit((e.clientY-rect.top)/rect.height*100);hideHover();}};
  splitter.onpointerup=e=>{splitter.releasePointerCapture(e.pointerId);splitter.classList.remove('resizing');};
  splitter.onpointercancel=()=>splitter.classList.remove('resizing');
  splitter.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();setSplit(Number(splitter.getAttribute('aria-valuenow'))+(e.key==='ArrowUp'?-3:3));}};
  const preview=$('hover-preview');let hoverTimer;
  function hideHover(){clearTimeout(hoverTimer);hovering=null;preview.hidden=true;}
  function showHover(node){
    if(!matchMedia('(hover:hover)').matches||!$('drawer').hidden)return;
    const number=+node.dataset.hover,level=D.levels[number-1];hovering=number;
    clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>{
      if(hovering!==number)return;
      const rect=node.getBoundingClientRect();
      $('hover-title').textContent='Уровень '+number;$('hover-energy').innerHTML=energyIcon()+level.steps;
      preview.hidden=false;
      const bounds=preview.getBoundingClientRect();
      preview.style.left=clamp(rect.left+rect.width/2-bounds.width/2,10,Math.max(10,innerWidth-bounds.width-10))+'px';
      preview.style.top=clamp(rect.top>bounds.height+14?rect.top-bounds.height-12:rect.bottom+14,10,Math.max(10,innerHeight-bounds.height-10))+'px';
      P.draw($('hover-canvas'),level,'covered');
    },160);
  }
  $('level-content').addEventListener('pointerover',e=>{const node=e.target.closest('[data-hover]');if(node)showHover(node);});
  $('level-content').addEventListener('pointerout',e=>{if(e.target.closest('[data-hover]'))hideHover();});
  $('level-content').addEventListener('focusin',e=>{if(e.target.dataset.hover)showHover(e.target);});
  $('level-content').addEventListener('focusout',hideHover);
  $('level-content').onclick=e=>{const node=e.target.closest('[data-level]');if(node)openLevel(+node.dataset.level);};
  $('story-content').onclick=e=>{const node=e.target.closest('[data-stage]');if(node)openStage(+node.dataset.stage);};
  function chip(f){return `<div class="feature-chip">${image(f.image)}<span>${esc(f.name)}<small>${esc(catNames[f.category]||f.category||'')}${f.possible?' · может встретиться':''}</small></span></div>`;}
  function dialogueHTML(rows){return rows.map(d=>`<div class="dialogue">${image(d.image)}<div><b>${esc(d.name)}</b><small>${d.field?'На поле ур. ':'После ур. '}${d.level}</small><p>${esc(d.text)}</p></div></div>`).join('');}
  function openDrawer(title,eyebrow,html){
    hideHover();if($('drawer').hidden)oldFocus=document.activeElement;
    $('drawer-title').textContent=title;$('drawer-eyebrow').textContent=eyebrow;$('drawer-body').innerHTML=html;
    $('drawer-body').scrollTop=0;$('drawer').hidden=false;$('drawer-backdrop').hidden=false;
    for(const el of [$('workspace'),$('toolbar'),toolbarToggle,document.querySelector('.overview')])el.inert=true;
    $('drawer-close').focus({preventScroll:true});
  }
  function openLevel(number){
    const l=D.levels[number-1];if(!l)return;selected=number;activeStage=null;
    const stage=getStage(Math.max(1,number-1));
    const targets=P.goals(l).map(i=>chip({name:i.name+' × '+i.count,image:i.image,category:'Цель'})).join('');
    const html=`<div class="detail-meta"><span>${esc(D.environments[l.environment].name)}</span><span>${energyIcon()} Энергия ${l.steps}</span><span>${[...l.mask].filter(c=>c!=='0').length} клеток</span>${l.hardLevel?'<span>Сложный уровень</span>':''}${l.bonuses?`<span>Зверей: ${l.bonuses}</span>`:''}</div><div class="preview-shell"><canvas id="detail-canvas" width="1000" height="1100" aria-label="Поле уровня ${number}"></canvas><div class="preview-modes"><button data-mode="covered" class="active">Под листьями</button><button data-mode="contents">Открыть поле</button></div></div><p class="preview-note">Форма и типы клеток — из уровня. Заданные находки и их количество сохранены; расположение случайное. Динамические события не проигрываются.</p><button class="location-link" data-open-stage="${stage.index}"><small>ТЕКУЩАЯ ДОЛГАЯ ЦЕЛЬ</small>${esc(stage.title)} ↗</button>`+
    `<section class="detail-section"><h3>Задачи поля</h3>${targets?`<div class="detail-grid">${targets}</div>`:'<p class="empty-state">Отдельные цели в конфигурации не заданы.</p>'}</section>`+
    (l.tutorials.length?`<section class="detail-section"><h3>Обучение</h3>${l.tutorials.map(t=>`<div class="detail-tutorial">${image(t.image)}<p>${esc(t.text)}</p></div>`).join('')}</section>`:'')+
    (l.firsts.length?`<section class="detail-section"><h3>Впервые на этом уровне</h3><div class="detail-grid">${l.firsts.map(chip).join('')}</div></section>`:'')+
    (l.objects.length?`<section class="detail-section"><h3>Сюжетные находки</h3><div class="detail-grid">${l.objects.map(o=>chip({name:o.name,image:o.image,category:'story'})).join('')}</div></section>`:'')+
    (l.dialogues.length?`<section class="detail-section"><h3>Диалоги и завязки</h3>${dialogueHTML(l.dialogues)}</section>`:'')+
    (l.prize?`<section class="detail-section"><h3>Награда на этапе</h3><div class="prize-row">${(l.prize.boosters||[]).map(b=>esc(boosterNames[b.type.split('.').pop()]||b.type.split('.').pop())+' × '+b.count).join(' · ')}${l.prize.gems?' · '+l.prize.gems+' кристаллов':''}</div></section>`:'')+
    `<details class="detail-section"><summary>Все элементы уровня</summary><div class="detail-grid" style="margin-top:12px">${l.features.map(chip).join('')}</div></details><div class="detail-navigation"><button data-prev="${number-1}" ${number===1?'disabled':''}>← Предыдущий</button><button data-next="${number+1}" ${number===D.levels.length?'disabled':''}>Следующий →</button></div>`;
    openDrawer('Уровень '+number,`ПОЛЕ · ${String(number).padStart(3,'0')} / ${D.levels.length}`,html);
    P.draw($('detail-canvas'),l,'covered');
    $('drawer-body').querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{$('drawer-body').querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b===button));P.draw($('detail-canvas'),l,button.dataset.mode);});
    $('drawer-body').querySelector('[data-open-stage]').onclick=()=>openStage(stage.index);
    $('drawer-body').querySelector('[data-prev]').onclick=()=>{jump(number-1);openLevel(number-1);};
    $('drawer-body').querySelector('[data-next]').onclick=()=>{jump(number+1);openLevel(number+1);};
    document.querySelectorAll('.level-node').forEach(node=>node.classList.toggle('selected',+node.dataset.level===number));
    history.replaceState(null,'','#level-'+number);
  }
  function openStage(index){
    const s=D.stages[index];if(!s)return;activeStage=index;
    const html=`<div class="detail-meta"><span>${esc(s.location)}</span><span>После уровня ${s.start}</span><span>${s.continuation?'Продолжение':s.end-s.start+' уровней до следующей цели'}</span></div><div class="detail-banner" style="background-image:linear-gradient(#18392c18,#17352a4d),url('${esc(P.url(s.background))}')">${image(s.image)}</div>${s.description?`<p class="detail-description">${esc(s.description)}</p>`:''}${s.notes.map(note=>`<p class="detail-description">${esc(note)}</p>`).join('')}`+
    (s.characters.length?`<section class="detail-section"><h3>Персонажи этапа</h3><div class="detail-grid">${s.characters.map(c=>chip({name:c.name,image:c.image,category:'Участник истории'})).join('')}</div></section>`:'')+
    (s.requiredItems.length?`<section class="detail-section"><h3>Долговременная цель · собрать</h3><div class="detail-grid">${s.requiredItems.map(i=>chip({name:(D.names[i.name]||i.name)+' × '+i.count,image:i.name,category:'Для дневника'})).join('')}</div></section>`:'')+
    (s.dialogues.length?`<section class="detail-section"><h3>Завязки и диалоги</h3>${dialogueHTML(s.dialogues)}</section>`:'<p class="empty-state">Для этого отрезка пока нет новых реплик.</p>')+
    `<div class="detail-navigation"><button data-to-map>К уровню ${s.start} на карте ↗</button><button data-stage-next ${index===D.stages.length-1?'disabled':''}>Следующий этап →</button></div>`;
    openDrawer(s.title,`ИСТОРИЯ · ЭТАП ${index+1} / ${D.stages.length}`,html);
    $('drawer-body').querySelector('[data-to-map]').onclick=()=>{closeDrawer();jump(s.start);};
    $('drawer-body').querySelector('[data-stage-next]').onclick=()=>{jump(D.stages[index+1].start);openStage(index+1);};
    history.replaceState(null,'','#stage-'+s.id);
  }
  function closeDrawer(){
    $('drawer').hidden=true;$('drawer-backdrop').hidden=true;
    for(const el of [$('workspace'),$('toolbar'),toolbarToggle,document.querySelector('.overview')])el.inert=false;
    history.replaceState(null,'',location.pathname+location.search);
    if(oldFocus?.isConnected)oldFocus.focus({preventScroll:true});
  }
  $('drawer-close').onclick=closeDrawer;$('drawer-backdrop').onclick=closeDrawer;
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){hideHover();if(!$('drawer').hidden)closeDrawer();$('search-results').hidden=true;}
    if(e.key==='Tab'&&!$('drawer').hidden){
      const nodes=[...$('drawer').querySelectorAll('button:not(:disabled),a[href],input,select,textarea,summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);
      const first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  const search=$('search'),results=$('search-results');
  function searchMap(){
    const query=search.value.trim().toLocaleLowerCase('ru');if(!query){results.hidden=true;return;}
    const matches=[];
    const number=Number(query.replace(/^(?:ур(?:овень)?\.?\s*)/,'').trim());
    if(number>=1&&number<=D.levels.length&&Number.isInteger(number))matches.push({level:number,title:'Уровень '+number,detail:D.environments[D.levels[number-1].environment].name});
    for(const l of D.levels){
      const hits=l.firsts.filter(f=>f.name.toLocaleLowerCase('ru').includes(query));
      if(hits.length)matches.push({level:l.number,title:hits.map(h=>h.name).join(', '),detail:'Первое появление'});
      else if(l.tutorials.some(t=>t.text.toLocaleLowerCase('ru').includes(query)))matches.push({level:l.number,title:l.tutorials.find(t=>t.text.toLocaleLowerCase('ru').includes(query)).text,detail:'Обучение'});
    }
    for(const s of D.stages){
      if([s.title,s.description,s.location,...s.characters.map(c=>c.name)].join(' ').toLocaleLowerCase('ru').includes(query))matches.push({level:s.start,stage:s.index,title:s.title,detail:'Сюжетный этап'});
    }
    results.innerHTML=matches.slice(0,16).map(m=>`<button class="search-result" data-search-level="${m.level}" ${m.stage!==undefined?`data-search-stage="${m.stage}"`:''}><b>${m.level}</b><span>${esc(m.title)}<small>${esc(m.detail)}</small></span></button>`).join('')||'<div class="search-empty">На карте ничего не найдено</div>';
    results.hidden=false;
  }
  search.addEventListener('input',searchMap);search.addEventListener('focus',()=>{if(search.value)searchMap();});
  search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();results.querySelector('button')?.click();}if(e.key==='ArrowDown'){e.preventDefault();results.querySelector('button')?.focus();}});
  results.onclick=e=>{const button=e.target.closest('[data-search-level]');if(!button)return;jump(+button.dataset.searchLevel);results.hidden=true;search.blur();if(button.dataset.searchStage!==undefined)openStage(+button.dataset.searchStage);else openLevel(+button.dataset.searchLevel);};
  results.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const buttons=[...results.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);buttons[clamp(i+(e.key==='ArrowDown'?1:-1),0,buttons.length-1)]?.focus();}};
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))results.hidden=true;});
  addEventListener('resize',()=>{hideHover();scheduleViewport();});
  new ResizeObserver(scheduleViewport).observe($('workspace'));
  render();jump(store.get('position',1),false);
  const levelMatch=location.hash.match(/^#level-(\d+)$/),stageMatch=location.hash.match(/^#stage-(.+)$/);
  if(levelMatch){const number=+levelMatch[1];if(D.levels[number-1]){jump(number,false);openLevel(number);}}
  else if(stageMatch){const stage=D.stages.find(s=>s.id===stageMatch[1]);if(stage){jump(stage.start,false);openStage(stage.index);}}
})();
