(function(scope){
  function analyze(input,options){
    options=options||{};const raw=Array.isArray(input)?input:input.events;
    if(!Array.isArray(raw))throw Error('Нет массива events');
    const valid=raw.filter(e=>e&&e.id&&e.playerId&&e.sessionId&&Number.isFinite(e.at)),dedup=[...new Map(valid.map(e=>[e.playerId+':'+e.id,e])).values()];
    const testEvents=dedup.filter(e=>e.cohort==='test').length,events=dedup.filter(e=>options.includeTests||e.cohort!=='test');
    const players=new Map(),sessions=new Map(),starts=new Map(),ends=new Map(),resources={},flows={},configs=new Set();
    events.forEach(e=>{
      const p=players.get(e.playerId)||{first:e.at,days:new Set()};p.first=Math.min(p.first,e.at);if(e.name==='session_start')p.days.add(Math.floor((e.at+10800000)/86400000));players.set(e.playerId,p);
      const s=sessions.get(e.sessionId)||{first:e.at,last:e.at};s.first=Math.min(s.first,e.at);s.last=Math.max(s.last,e.at);sessions.set(e.sessionId,s);if(e.configVersion)configs.add(e.configVersion);
      if(e.name==='attempt_start'&&e.attemptId)starts.set(e.attemptId,e);if(e.name==='attempt_end'&&e.attemptId)ends.set(e.attemptId,e);
      if(e.name==='resource'&&Number.isFinite(e.amount)&&e.currency){
        const r=resources[e.currency]||(resources[e.currency]={source:0,sink:0,reasons:{}}),side=e.amount>0?'source':'sink';r[side]+=Math.abs(e.amount);r.reasons[e.reason||'unknown']=(r.reasons[e.reason||'unknown']||0)+e.amount;
        const f=flows[e.attemptId]||(flows[e.attemptId]={gross:0,refund:0});if(e.currency==='energy'&&e.reason==='open_cell')f.gross+=Math.abs(e.amount);if(e.currency==='energy'&&e.reason==='field_refund')f.refund+=Math.max(0,e.amount);
      }
    });
    const horizon=events.reduce((n,e)=>Math.max(n,e.at),0),retention={};
    [1,7,30].forEach(d=>{let eligible=0,returned=0;players.forEach(p=>{const first=Math.floor((p.first+10800000)/86400000);if(Math.floor((horizon+10800000)/86400000)-first>=d){eligible++;if(p.days.has(first+d))returned++;}});retention['D'+d]={eligible,returned,percent:eligible?Math.round(returned/eligible*1000)/10:null};});
    const levels={};ends.forEach((e,id)=>{const key=[e.mode,e.branchId,e.levelId].join('/'),r=levels[key]||(levels[key]={attempts:0,completed:0,abandoned:0,seconds:0,timed:0,gross:0,refund:0});r.attempts++;r[e.result==='complete'?'completed':'abandoned']++;const start=starts.get(id);if(start&&e.at>=start.at){r.seconds+=(e.at-start.at)/1000;r.timed++;}const f=flows[id]||{gross:0,refund:0};r.gross+=f.gross;r.refund+=f.refund;});
    const durations=[...sessions.values()].map(s=>(s.last-s.first)/1000).sort((a,b)=>a-b);
    return {events:events.length,players:players.size,sessions:sessions.size,completed:[...ends.values()].filter(e=>e.result==='complete').length,retention,resources,levels,
      observedSessionSecondsMedian:durations.length?durations[Math.floor(durations.length/2)]:null,
      quality:{invalid:raw.length-valid.length,duplicates:valid.length-dedup.length,testEvents,unknownCohort:events.filter(e=>!e.cohort).length,openAttempts:[...starts.keys()].filter(id=>!ends.has(id)).length,endsWithoutStart:[...ends.keys()].filter(id=>!starts.has(id)).length,errors:events.filter(e=>e.name==='runtime_error').length,configVersions:[...configs]},
      limitations:'Первое наблюдение в файле не равно регистрации. Обрезанная локальная выборка не доказывает удержание, LTV или выручку. Выдача покупки не является подтверждённым доходом.'};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={analyze};else scope.WorldMetrics={analyze};
})(typeof window!=='undefined'?window:{});
