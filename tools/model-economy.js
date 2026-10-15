// Explicit scenarios; observed player behavior and paid revenue are not inferred.
const {readStaticConfig}=require('./lib/read-static-config');
const levels=readStaticConfig('src/core/configuration/ForestConfiguration.ts','allForests');
const scenarios=[{name:'Короткие сессии',levelsPerDay:3,attemptsPerWin:1.1,netEnergyPerAttempt:10},{name:'Регулярные сессии',levelsPerDay:8,attemptsPerWin:1.3,netEnergyPerAttempt:13},{name:'Длинные сессии',levelsPerDay:20,attemptsPerWin:1.6,netEnergyPerAttempt:16}];
const spending={wardrobe:35+45+50,knowledgeTraining:Array.from({length:5},(_,i)=>8+4*i).reduce((a,b)=>a+b,0),giftsPerDay:10};
const points=scenarios.map(s=>({scenario:s.name,assumptions:s,campaignDaysAtThisSpeed:Math.ceil(levels.length/s.levelsPerDay),days:[1,7,30].map(days=>{
  const played=Math.min(levels.length,days*s.levelsPerDay),hard=levels.slice(0,played).filter(l=>l.hardLevel).length;
  const sources={startingGems:300,dailyGifts:Math.max(0,days-1)*50,campaignPrizeMin:played*14+hard*25,campaignPrizeMax:played*21+hard*25};
  const spendingTotal=spending.wardrobe+spending.knowledgeTraining+spending.giftsPerDay*days;
  return {days,completedCampaignMaps:played,hardMaps:hard,energyDemand:Math.ceil(played*s.attemptsPerWin*s.netEnergyPerAttempt),sources,plannedSpending:spendingTotal,
    gemsAfterPlannedSpending:{min:sources.startingGems+sources.dailyGifts+sources.campaignPrizeMin-spendingTotal,max:sources.startingGems+sources.dailyGifts+sources.campaignPrizeMax-spendingTotal},
    interpretation:'Planned wardrobe/training spending is a comparison basket; unlock timing and choices are not assumed. Energy demand is an assumption, not a simulation.'};
})}));
console.log(JSON.stringify({schemaVersion:2,kind:'scenario model',campaignLevels:levels.length,spendingBasket:spending,
  energy:{initial:120,cap:120,secondsPerPoint:30,maximumTheoreticalRegenerationPerDay:2880,pack:100,packPriceFormula:'10 * (purchasesToday + 1)',notes:'Theoretical regeneration is not collected while capped. Actual usable supply depends on sessions and refunds.'},
  excluded:'Task/event/season rewards, boosters, continues, ads, expeditions and payments require separate observed distributions. These source ranges are not a production economy validation.',scenarios:points},null,2));
