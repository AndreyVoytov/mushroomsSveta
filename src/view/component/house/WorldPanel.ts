import WorldService from '../../../core/service/WorldService';
import WorldConfiguration, { WorldReward } from '../../../core/configuration/WorldConfiguration';
import WorldLevels from '../../../core/configuration/WorldLevels';
import UserService from '../../../core/service/UserService';
import { WorldStat } from '../../../core/model/world/WorldState';
import CharactersConfiguration from '../../../core/configuration/CharactersConfiguration';
import CharacterTextUtils from '../../../core/utils/CharacterTextUtils';
import GameClock from '../../../core/service/GameClock';
import Telemetry from '../../../core/service/Telemetry';
import Game from '../../game/Game';
import ForestScreen from '../../screen/ForestScreen';
import YandexGamesHelper from '../../../core/service/integration/YandexGamesHelper';
import ShopService from '../../../core/service/ShopService';
import Settings from '../../../core/service/Settings';
import TaskService from '../../../core/service/TaskService';
import CloudProfileService from '../../../core/service/CloudProfileService';
import ServerStoreComponent from '../../../core/service/store/ServerStoreComponent';
import User from '../../../core/model/user/User';
import AnalyticUtils from '../../../core/utils/AnalyticUtils';
import CustomizationType from '../../../core/model/enum/CustomizationType';

const css = `
.world-overlay{position:fixed;inset:0;z-index:500;background:#071d20bb;display:flex;align-items:center;justify-content:center;padding:14px;color:#493323;font:16px/1.5 Gilroy,'Segoe UI',sans-serif}.world-shell{width:min(700px,100%);max-height:calc(100dvh - 28px);max-height:calc(100vh - 28px);background:#f6ebd4;border:3px solid #ab7847;border-radius:24px;box-shadow:0 18px 65px #00191ecc;overflow:auto}.world-header{position:sticky;top:0;background:#67412c;color:#fff2c9;padding:17px 22px;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:10px}.world-header h2{margin:0;font:26px 'Bookman Old Style',Georgia,serif}.world-header button{background:#a7794a;color:#fff9dd;border:0;border-radius:50%;width:42px;height:42px;font-size:26px;cursor:pointer}.world-tabs{display:flex;gap:6px;padding:12px;overflow:auto;background:#eadab7}.world-tabs button{white-space:nowrap;min-height:42px;border:1px solid #b69d72;background:#f9f1dd;border-radius:12px;color:#67412c;padding:8px 13px;font:inherit;cursor:pointer}.world-tabs button.active{background:#306349;color:#fff5d5;border-color:#306349}.world-body{padding:18px 22px}.world-card{background:#fff8e8;border:1px solid #d9c39b;border-radius:16px;padding:16px;margin-bottom:13px}.world-card h3{font:22px 'Bookman Old Style',Georgia,serif;margin:0 0 8px}.world-card p{margin:7px 0;font-size:15px;color:#70583f}.world-note{font-size:13px;color:#886f4d;margin:0 0 13px}.world-button{border:1px solid #476942;border-radius:12px;background:linear-gradient(#74a158,#386340);color:#fff6df;font:inherit;font-weight:bold;padding:11px 15px;min-height:44px;cursor:pointer;margin:6px 6px 0 0}.world-button:disabled{background:#d8cbaa;color:#82735b;border-color:#bcae8e;cursor:default}.world-button.secondary{background:#efdfbe;color:#67482e;border-color:#c3a477}.world-check{display:block;width:100%;text-align:left;display:flex;justify-content:space-between;gap:10px}.world-stat{background:#ede1c3;border-radius:10px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;margin:7px 0}.world-stat b{font-size:20px;color:#285543}.world-stat button{font-size:13px;margin:0;padding:8px}.world-art{display:block;width:100%;border-radius:12px;margin-bottom:12px}.world-choice{font-size:12px;display:block;font-weight:normal;opacity:.85}.world-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.world-progress{height:8px;background:#dfceac;border-radius:10px;margin:10px 0;overflow:hidden}.world-progress span{display:block;height:100%;background:#638548}.world-balance{font-size:13px;color:#edd6a5}.world-toast{position:sticky;bottom:0;background:#f2dfb6;border-top:1px solid #c7aa77;padding:10px 18px;font-size:14px}.world-portrait{width:85px;height:100px;object-fit:contain;float:right;filter:drop-shadow(0 3px 3px #bba079)}.world-item-icon{width:60px;height:65px;object-fit:contain;float:right}.world-help details{border-bottom:1px solid #dccba9;padding:12px 0}.world-help summary{cursor:pointer;font-weight:bold}.world-shell button:focus-visible,.world-shell summary:focus-visible{outline:3px solid #db9826;outline-offset:3px}@media(max-width:500px){.world-overlay{padding:6px}.world-shell{max-height:calc(100vh - 12px);border-radius:18px}.world-body{padding:13px}.world-header{padding:12px 15px}.world-header h2{font-size:22px}.world-grid{grid-template-columns:1fr}.world-tabs{padding:8px}.world-card{padding:13px}}`;
// The DOM overlay shares the game's ImageGen paper, brass and enamel textures.
const paintedCss = `
.world-overlay{color:#343c35;background:#102a32b8}
.world-shell{box-sizing:border-box;border:20px solid transparent;border-image:url('assets/base/ui/panel.png?ui=painted2') 60 fill / 20px;border-radius:0;background:#f6f0e3;box-shadow:0 12px 48px #152c3780}
.world-header{background:#f4eddf url('assets/base/ui/helperPanel.png?ui=painted2') center/100% 100%;color:#343c35;padding:15px 17px;gap:16px}
.world-header h2{font-weight:600;color:#343c35}
.world-balance{color:#465348;line-height:1.8}.world-currency{width:20px;height:22px;object-fit:contain;vertical-align:middle;margin-right:4px}
.world-header button{flex:0 0 44px;width:44px;height:44px;background:transparent url('assets/base/ui/closeButton.png?ui=painted2') center/contain no-repeat;border:0;border-radius:0;color:transparent;font-size:0}
.world-tabs{background:transparent;padding:10px 4px;gap:5px}
.world-tabs button{box-sizing:border-box;border:7px solid transparent;border-image:url('assets/base/ui/helperPanel.png?ui=painted2') 24 fill / 7px;border-radius:0;background:transparent;color:#343c35;padding:5px 8px;min-height:44px}
.world-tabs button.active{border-color:transparent;border-image:url('assets/base/ui/pnlButton.png?ui=painted2') 42 fill / 11px;background:transparent;color:#243f37;font-weight:700}
.world-body{padding:10px 7px}
.world-card{border:12px solid transparent;border-image:url('assets/base/ui/helperPanel.png?ui=painted2') 32 fill / 12px;border-radius:0;background:transparent;padding:12px;margin-bottom:14px}
.world-card p,.world-note{color:#485348}.world-note{font-size:14px}
.world-button,.world-button.secondary{box-sizing:border-box;border:12px solid transparent;border-image:url('assets/base/ui/pnlButton.png?ui=painted2') 42 fill / 12px;border-radius:0;background:transparent;color:#293e35;padding:6px 12px;min-height:48px}
.world-button.secondary{border-image-source:url('assets/base/ui/helperPanel.png?ui=painted2')}
.world-button:disabled{background:transparent;color:#465348;border-color:transparent;filter:grayscale(.6);opacity:.7}
.world-button,.world-button.secondary,.world-tabs button.active{border-image:none;border:0;background:transparent url('assets/base/ui/pnlButton.png?ui=painted2') center/100% 100% no-repeat;padding:14px 18px}
.world-button.secondary,.world-stat button{background-image:url('assets/base/ui/helperPanel.png?ui=painted2')}
.world-tabs button.active{padding:9px 15px}.world-button:disabled{background-color:transparent}
.world-button .world-currency{width:17px;height:18px;margin:0 2px}
.world-stat{background:#e3e6d6;color:#343c35}.world-stat b{color:#284d41}
.world-progress{height:12px;background:transparent url('assets/base/ui/progressbar/progressLineBg.png?ui=painted2') center/100% 100%;border-radius:0}
.world-progress span{background:transparent url('assets/base/ui/progressbar/body.jpg?ui=painted2') center/auto 100%}
.world-toast{background:#e8eddd;color:#343c35;border-top-color:#b6a16e}
@media(max-width:500px){.world-shell{border-width:12px;border-image-width:12px;max-height:calc(100dvh - 12px)}.world-header{padding:12px}.world-body{padding:8px 2px}.world-card{padding:8px}.world-tabs{padding:8px 0}.world-tabs button{padding:5px}.world-header h2{font-size:22px}}
`;
function node(tag:string,text?:string,cls?:string):HTMLElement {const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
export default class WorldPanel {
    private static overlay: HTMLElement;
    private static active = 'journey';
    private static notice = '';
    private static focusBefore: HTMLElement;
    private static renderedTab='';
    private static cloudBusy=false;
    private static paymentUpdated=()=>{if(WorldPanel.overlay)WorldPanel.render();};
    private static keys = (event:KeyboardEvent) => {
        if(event.key==='Escape'){WorldPanel.close();return;}
        if(event.key==='Tab'&&WorldPanel.overlay){
            const all=WorldPanel.overlay.querySelectorAll('button:not(:disabled),input:not(:disabled),summary');
            if(!all.length)return;
            const first=<HTMLElement>all[0],last=<HTMLElement>all[all.length-1];
            if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
            else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
        }
    };
    public static show(tab:string='journey'):void {
        const user=UserService.getUser();WorldService.prepare(user);user.saveWorld();
        this.active=tab;this.notice='';
        if(!document.getElementById('world-styles')){const style=node('style');style.id='world-styles';style.textContent=css+paintedCss;document.head.appendChild(style);}
        if(!this.overlay){this.focusBefore=<HTMLElement>document.activeElement;this.overlay=node('div',null,'world-overlay');document.body.appendChild(this.overlay);document.addEventListener('keydown',this.keys);window.addEventListener('mushrooms-payment-updated',this.paymentUpdated);}
        this.overlay.setAttribute('role','dialog');this.overlay.setAttribute('aria-modal','true');this.overlay.setAttribute('aria-label','Путевая книга');
        YandexGamesHelper.stopGameplay();
        this.render();(<HTMLElement>this.overlay.querySelector('button')).focus();Telemetry.track('world_panel_open',{tab});
    }
    public static close():void {
        if(this.overlay)this.overlay.remove();this.overlay=null;document.removeEventListener('keydown',this.keys);
        window.removeEventListener('mushrooms-payment-updated',this.paymentUpdated);
        if(this.focusBefore&&document.body.contains(this.focusBefore))this.focusBefore.focus();
        if(Game.getInstance()&&Game.getInstance().state.getCurrentState() instanceof ForestScreen)YandexGamesHelper.startGameplay();
    }
    private static button(parent:HTMLElement,label:string,action:()=>void,disabled:boolean=false,secondary:boolean=false):HTMLButtonElement {
        const b=<HTMLButtonElement>node('button',label,'world-button'+(secondary?' secondary':''));b.type='button';b.disabled=disabled;
        if(label.indexOf('♦')>=0){b.textContent='';const parts=label.split('♦');parts.forEach((text,index)=>{b.appendChild(document.createTextNode(text));if(index<parts.length-1){const star=<HTMLImageElement>node('img',null,'world-currency');star.src='assets/base/ui/gems.png';star.alt='звёзд';b.appendChild(star);}});}
        b.dataset.action=parent.dataset.key||label;
        b.onclick=()=>{b.disabled=true;try{action();}catch(e){this.notice='Не удалось сохранить изменения. Попробуйте ещё раз.';}if(this.overlay)this.render();};parent.appendChild(b);return b;
    }
    private static card(parent:HTMLElement,title:string,text?:string):HTMLElement {const c=node('section',null,'world-card');c.appendChild(node('h3',title));if(text)c.appendChild(node('p',text));parent.appendChild(c);return c;}
    private static rewardText(r:WorldReward):string {return [r.energy?'⚡ '+r.energy:'',r.gems?'♦ '+r.gems:'',r.wood?'Древесина '+r.wood:'',r.clover?'Клевер '+r.clover:'',r.item?'Вещь: '+(WorldConfiguration.items.filter(i=>i.id===r.item)[0]||{name:r.item}).name:''].filter(Boolean).join(' · ');}
    private static render():void {
        const previousShell=this.overlay.querySelector('.world-shell');
        const scrollTop=previousShell&&this.renderedTab===this.active?previousShell.scrollTop:0;
        const focused=<HTMLElement>document.activeElement;
        const focusAction=focused&&focused.dataset?focused.dataset.action:null;
        this.renderedTab=this.active;
        const user=UserService.getUser();WorldService.prepare(user);
        this.overlay.textContent='';const shell=node('div',null,'world-shell');this.overlay.appendChild(shell);
        const header=node('header',null,'world-header'),title=node('div');title.appendChild(node('h2','Путевая книга'));
        const balance=node('div',null,'world-balance');
        const stars=<HTMLImageElement>node('img',null,'world-currency');stars.src='assets/base/ui/gems.png';stars.alt='Звёзды';balance.appendChild(stars);
        balance.appendChild(document.createTextNode(user.getSupermoney()+' · '));
        const energy=<HTMLImageElement>node('img',null,'world-currency');energy.src='assets/base/ui/energyPanelOrb.png';energy.alt='Энергия';balance.appendChild(energy);
        balance.appendChild(document.createTextNode(user.getEnergy()+' · Древесина '+(user.world.materials.wood||0)+' · Клевер '+(user.world.materials.clover||0)));title.appendChild(balance);header.appendChild(title);
        const close=<HTMLButtonElement>node('button','×');close.setAttribute('aria-label','Закрыть путевую книгу');close.onclick=()=>this.close();header.appendChild(close);shell.appendChild(header);
        const tabs=node('nav',null,'world-tabs');tabs.setAttribute('aria-label','Разделы путевой книги');
        [['journey','Тропа'],['heroes','Герои'],['wardrobe','Вещи'],['relations','Отношения'],['season','Сезон'],['cloud','Сохранение'],['help','Правила']].forEach(pair=>{const b=<HTMLButtonElement>node('button',pair[1],this.active===pair[0]?'active':'');b.setAttribute('aria-pressed',String(this.active===pair[0]));b.dataset.action='tab-'+pair[0];b.onclick=()=>{this.active=pair[0];this.notice='';this.render();};tabs.appendChild(b);});shell.appendChild(tabs);
        const body=node('div',null,'world-body');shell.appendChild(body);
        if(this.active==='journey'){
            body.appendChild(node('p','Встречи необязательны. Неудачная проверка ничего не расходует; основной путь всегда открыт.','world-note'));
            const encounters=WorldService.encounters(user);
            encounters.forEach(e=>{
                const c=this.card(body,e.name,e.description);
                if(e.id==='ghostDoor'){const img=<HTMLImageElement>node('img',null,'world-art');img.src='assets/world/ghost-door.png';img.alt='Светящаяся дверь в древнем дубе';c.insertBefore(img,c.firstChild);}
                c.appendChild(node('p',e.chapter+' · '+(e.persistent?'Осталось '+Math.max(0,Math.ceil((user.world.encounters[e.id].discoveredAt+2*WorldService.DAY-GameClock.now())/3600000))+' ч':'Встреча на уровнях '+e.from+'–'+e.until),'world-note'));
                const char=user.getCurrentCharacterId();
                e.choices.forEach((choice,index)=>{
                    const value=choice.stat?WorldService.stat(user,char,choice.stat):user.world.materials.wood||0,required=choice.required||choice.wood||0;
                    const b=this.button(c,choice.text+' · '+(choice.stat?WorldConfiguration.statNames[choice.stat]:'Древесина')+' '+value+'/'+required,()=>{if(WorldService.check(user,e.id,index,char))this.notice='Получено: '+this.rewardText(choice.reward)+(e.adventure?' · Открыто приключение':'');},value<required);
                    b.classList.add('world-check');
                });
                c.appendChild(node('p','Награда: '+this.rewardText(e.choices[0].reward),'world-note'));
                this.button(c,'Выбрать героя / развить навык',()=>this.active='heroes',false,true);
            });
            if(!encounters.length)this.card(body,'Тропа спокойна','Новые встречи откроются по мере путешествия. Собирайте вещи и узнавайте спутников — их навыки пригодятся в следующих главах.');
            Object.keys(user.world.adventures).forEach(id=>{
                const a=WorldConfiguration.adventures.filter(a=>a.id===id).shift(),s=user.world.adventures[id];if(!a)return;
                const expired=s.startedAt&&GameClock.now()>=s.startedAt+3*WorldService.DAY&&!s.completedAt;
                const c=this.card(body,a.title,a.description);
                c.appendChild(node('p',s.completedAt?'Воспоминание сохранено':expired?'Приключение завершилось':s.startedAt?'Пройдено '+s.progress+'/'+a.levels+' · осталось '+Math.max(0,Math.ceil((s.startedAt+3*WorldService.DAY-GameClock.now())/3600000))+' ч':'После нажатия «Начать» — 3 дня. '+a.levels+' полян.','world-note'));
                if(s.startedAt&&!expired&&!s.completedAt){c.appendChild(node('h3',WorldLevels.routes[id][s.progress]));c.appendChild(node('p',WorldLevels.notes[id][s.progress]));}
                c.appendChild(node('p','Награда: '+this.rewardText(a.reward)));
                const playing=WorldService.activeAdventure===id&&Game.getInstance().state.getCurrentState() instanceof ForestScreen;
                this.button(c,playing?'Вернуться на поляну':s.startedAt?'Продолжить':'Начать приключение',()=>{if(playing){this.close();return;}if(WorldService.startAdventure(user,id)){this.close();Game.getInstance().startScene(ForestScreen,true,false);}else this.notice='Сначала завершите активное приключение.';},!!s.completedAt||!!expired);
            });
            if(user.getCurrentForest()>=153){const c=this.card(body,'Лесные экспедиции','Кампания пройдена. Возвращайтесь на знакомые поляны: прогресс экспедиций считается отдельно, отношения и сезон продолжают расти.');this.button(c,'В экспедицию',()=>{WorldService.expedition=true;WorldService.activeAdventure=null;this.close();Game.getInstance().startScene(ForestScreen,true,false);});}
            const next=WorldConfiguration.encounters.filter(e=>e.from>user.getCurrentForest()).sort((a,b)=>a.from-b.from)[0];if(next)this.card(body,'Дальше по тропе',next.chapter+' · новая встреча после '+next.from+' уровней.');
            user.world.memories.filter(id=>id.indexOf('set:')===0).forEach(id=>{const scene=WorldConfiguration.setScenes[id.slice(4)];if(scene)this.card(body,scene.title,scene.text);});
        }else if(this.active==='heroes'){
            body.appendChild(node('p','Развитие по сюжету: '+WorldService.stage(user).title+'. Вещи дают постоянные бонусы; надетый образ не меняет силу.','world-note'));
            user.getCharacters().forEach(char=>{
                const c=this.card(body,CharacterTextUtils.getDisplayName(char.id));
                const portrait=<HTMLImageElement>node('img',null,'world-portrait');portrait.alt=CharacterTextUtils.getDisplayName(char.id);
                const portraits={sveta:'assets/base/characters/sveta1.png',boris:'assets/base/characters/cat1.png',owl:'assets/additional/characters/sova1.png',leshy:'assets/additional/characters/leshii1.png'};
                portrait.src=portraits[char.id];c.insertBefore(portrait,c.firstChild);
                const wearing=user.world.appearance[char.id],item=WorldConfiguration.items.filter(i=>i.id===wearing).shift();if(item)c.appendChild(node('p','Образ: '+item.name));
                this.button(c,user.getCurrentCharacterId()===char.id?'Активный герой':'Выбрать героя',()=>user.setCurrentCharacterId(char.id),user.getCurrentCharacterId()===char.id);
                Object.keys(WorldConfiguration.statNames).forEach((stat:WorldStat)=>{const value=WorldService.stat(user,char.id,stat),learned=(user.world.training[char.id]||{})[stat]||0,price=8+learned*4;
                    const row=node('div',null,'world-stat');row.dataset.key='train-'+char.id+'-'+stat;row.appendChild(node('span',WorldConfiguration.statNames[stat]));row.appendChild(node('b',String(value)));
                    const train=this.button(row,'+1 · '+price+' ♦',()=>{WorldService.train(user,char.id,stat);},value>=99||user.getSupermoney()<price);train.setAttribute('aria-label','Развить '+WorldConfiguration.statNames[stat]+' · '+CharacterTextUtils.getDisplayName(char.id)+' · '+price+' рубинов');c.appendChild(row);
                });
            });
        }else if(this.active==='wardrobe'){
            body.appendChild(node('p','Получение вещи навсегда улучшает её героя. Полный комплект из 3–4 вещей даёт +2 дружбы и смелости. Выбирайте образ свободно.','world-note'));
            const grid=node('div',null,'world-grid');body.appendChild(grid);
            WorldConfiguration.items.filter(i=>user.hasCharacter(i.character)).forEach(item=>{
                const owned=user.world.wardrobe.indexOf(item.id)>=0,c=this.card(grid,item.name);
                if(/^shopItem[1-4]$/.test(item.icon)){const img=<HTMLImageElement>node('img',null,'world-item-icon');img.src='assets/base/ui/items/item'+item.icon.slice(-1)+'.png';img.alt='';c.insertBefore(img,c.firstChild);}
                c.appendChild(node('p',CharacterTextUtils.getDisplayName(item.character)+' · '+Object.keys(item.bonuses||{}).map(s=>'+'+item.bonuses[s]+' '+WorldConfiguration.statNames[s]).join(', '),'world-note'));
                if(owned)this.button(c,user.world.appearance[item.character]===item.id?'Выбранный образ':'Выбрать образ',()=>WorldService.wear(user,item.id),user.world.appearance[item.character]===item.id);
                else if(item.price)this.button(c,user.getCurrentForest()<item.level?'После уровня '+item.level:'Получить · '+item.price+' ♦',()=>{WorldService.buyItem(user,item);this.notice='Вещь добавлена. Бонусы постоянны.';},user.getCurrentForest()<item.level||user.getSupermoney()<item.price);
                else c.appendChild(node('p','Награда приключения или сезона','world-note'));
                const recipe=WorldConfiguration.recipes[item.id];if(recipe&&!owned)this.button(c,'Создать · '+recipe.wood+' древесины · '+recipe.clover+' клевера',()=>WorldService.craft(user,item.id),user.world.materials.wood<recipe.wood||user.world.materials.clover<recipe.clover,true);
            });
        }else if(this.active==='relations'){
            body.appendChild(node('p','Беседа доступна бесплатно раз в игровой день. Подарок — ещё один шаг к доверию. Совместное прохождение тоже укрепляет связи.','world-note'));
            WorldConfiguration.relationships.filter(r=>user.hasCharacter(r.character)).forEach(r=>{
                const level=WorldService.relationshipLevel(user,r.id),xp=user.world.relationships[r.id]||0,next=WorldConfiguration.relationshipThresholds[level],c=this.card(body,r.name,WorldConfiguration.relationshipNames[level-1]+' · '+xp+' опыта'+(next?' / '+next:' · максимальное доверие'));
                const progress=node('div',null,'world-progress'),fill=node('span');fill.style.width=Math.min(100,xp/(next||160)*100)+'%';progress.appendChild(fill);c.appendChild(progress);
                this.button(c,'Поговорить · +10',()=>WorldService.relationAction(user,r.id,false),user.world.dailyActions[r.id+':talk']===GameClock.day()||level>=5);
                this.button(c,'Подарить · 10 ♦ · +20',()=>WorldService.relationAction(user,r.id,true),user.world.dailyActions[r.id+':gift']===GameClock.day()||user.getSupermoney()<10||level>=5);
                WorldConfiguration.adventures.filter(a=>a.pair===r.id).forEach(a=>c.appendChild(node('p','При доверии '+a.relationshipLevel+': «'+a.title+'». Таймер начнётся по вашему выбору.','world-note')));
            });
        }else if(this.active==='season'){
            const weekly=WorldService.weekly(user),wc=this.card(body,'Лесная почта · неделя','Пройдите 12 полян и помогите доставить письма между опушками. '+weekly.points+'/12 · награда: 3 древесины и 20 энергии. До новой недели '+Math.ceil((WorldService.weeklyEndsAt()-GameClock.now())/3600000)+' ч.');
            this.button(wc,weekly.claimed?'Почта доставлена':'Забрать недельную награду',()=>WorldService.claimWeekly(user),weekly.claimed||weekly.points<12);
            const s=WorldService.season(user);this.card(body,'Сезон тихой реки','Каждая пройденная поляна приносит 1 отметку. Сейчас '+s.points+' отметок. Вещи сезона остаются навсегда.');
            body.appendChild(node('p','До конца сезона '+Math.ceil((WorldService.seasonEndsAt()-GameClock.now())/3600000)+' ч. Поздняя покупка сразу выдаст заработанные награды дорожки поддержки. После окончания незабранные награды закроются; полученные вещи сохранятся.','world-note'));
            WorldConfiguration.seasonRewards.forEach((r,index)=>{const c=this.card(body,r.points+' отметок');c.appendChild(node('p','Бесплатно: '+this.rewardText(r.free)));this.button(c,s.claims.indexOf('f'+index)>=0?'Получено':'Забрать',()=>WorldService.claimSeason(user,index,false),s.points<r.points||s.claims.indexOf('f'+index)>=0);c.appendChild(node('p','Дорожка поддержки: '+this.rewardText(r.premium)));this.button(c,s.claims.indexOf('p'+index)>=0?'Получено':'Забрать с пропуском',()=>WorldService.claimSeason(user,index,true),!s.premium||s.points<r.points||s.claims.indexOf('p'+index)>=0);});
            if(!s.premium){const buy=Settings.BUYS.filter(b=>b.id==='seasonPass')[0];this.button(body,'Пропуск сезона · '+ShopService.getPriceLabel(buy),()=>{ShopService.processPayment(Game.getInstance(),buy,()=>{if(this.overlay)this.render();});},ShopService.paymentInProgress||!ShopService.canPurchase(buy));if(!ShopService.canPurchase(buy))body.appendChild(node('p','Покупка пропуска станет доступна после подключения товара к платёжной платформе. Бесплатная дорожка открыта.','world-note'));}
        }else if(this.active==='cloud'){
            this.renderCloud(body);
        }else{
            const c=this.card(body,'Памятка путешественника');c.classList.add('world-help');
            const scout=node('details'),scoutTitle=node('summary','Пчёлы-разведчицы');scout.appendChild(scoutTitle);scout.appendChild(node('p','На цветочной поляне над открытой клеткой может появиться «Пчёлы: N». Это число закрытых ромашек в шести соседних клетках. Оно уменьшается, когда вы открываете цветы. Сверяйте его с обычными числовыми следами. Нажатие на число открывает эту памятку.'));c.appendChild(scout);
            [['Энергия и ежедневный день','Открытие клетки тратит энергию. Найденные грибы и животные возвращают часть ресурса. Купленный запас сверх 120 не пропадает. Задания учитывают фактическую трату, даже если вы вышли. Подарок, цена энергии и задания обновляются в полночь UTC+3.'],['Лианы и доски','Соседние открытия снимают слои препятствий. Сначала подготовьте доступный край; компас и ракета помогают освободить группу.'],['Пчёлы и желе','Пчёлы могут отнять дополнительную энергию. Желе распространяется: ограничивайте его соседними открытиями. Встреча с гига-желе — отдельный необязательный бонус.'],['Лодки и лёд','Лодки перемещаются по воде. Подготовьте место для их остановки. Лёд и закрытые границы меняют доступность соседей.'],['Вещи, герои и встречи','Все полученные вещи дают постоянный бонус своему герою. Проверка навыка сравнивает число с порогом без случайного штрафа. Можно сменить героя, потренироваться и вернуться к двери в течение двух дней.'],['Отношения и приключения','Связи с героем и между героями растут отдельно. Доверие открывает историю. Приключение длится три дня после ручного старта. Одновременно можно начать одно личное приключение.']].forEach(pair=>{const d=node('details'),summary=node('summary',pair[0]);d.appendChild(summary);d.appendChild(node('p',pair[1]));c.appendChild(d);});
            this.button(body,'Сменить дневную задачу',()=>{if(TaskService.rerollDailyTask(user))this.notice='Одна незавершённая задача заменена.';else this.notice='Замена уже использована или нет доступной задачи.';},false,true);
        }
        if(this.notice)shell.appendChild(node('div',this.notice,'world-toast'));
        const selected=<HTMLElement>tabs.querySelector('button.active');
        tabs.scrollLeft=selected.getBoundingClientRect().left-tabs.getBoundingClientRect().left-(tabs.clientWidth-selected.offsetWidth)/2;
        shell.scrollTop=scrollTop;
        if(focusAction){const matching=Array.prototype.find.call(shell.querySelectorAll('button[data-action]'),b=>b.dataset.action===focusAction&&!b.disabled);if(matching)(matching.focus as any)({preventScroll:true});}
    }

    private static cloudAction(work:()=>Promise<any>,message:string):void {
        this.cloudBusy=true;
        Promise.resolve().then(work).then(()=>this.notice=message).catch(()=>this.notice=CloudProfileService.status==='conflict'?'Обнаружена другая версия сохранения. Выберите облачную копию после проверки.':'Не удалось подключиться. Прогресс остаётся на этом устройстве.').then(()=>{this.cloudBusy=false;if(this.overlay)this.render();});
    }
    private static renderCloud(body:HTMLElement):void {
        const state=CloudProfileService.status,labels={unconfigured:'Прогресс сохранён на этом устройстве',connecting:'Подключаем облачное сохранение',ready:'Облачное сохранение подключено',offline:'Облако временно недоступно',conflict:'Найдены две версии прогресса'};
        const c=this.card(body,labels[state]||labels.offline);
        const onField=Game.getInstance().state.getCurrentState() instanceof ForestScreen;
        if(!CloudProfileService.isConfigured())c.appendChild(node('p','Облачное сохранение появится после подключения сервиса. Пока продолжайте играть на этом устройстве.'));
        else{
            c.appendChild(node('p','Если на другом устройстве изменился прогресс, автоматическая запись остановится. Перед заменой сохранения мы сохраним местную копию.'));
            if(state==='ready')this.button(c,'Сохранить в облако',()=>this.cloudAction(async()=>{CloudProfileService.queueProfile(UserService.getUser());await CloudProfileService.flush();},'Прогресс сохранён в облаке.'),this.cloudBusy);
            if(state==='offline')this.button(c,'Подключиться снова',()=>this.cloudAction(()=>ServerStoreComponent.reconnectCloud(),'Проверка сохранения завершена.'),this.cloudBusy||onField);
            if(state==='conflict'){
                this.button(c,'Посмотреть облачную копию',()=>this.cloudAction(()=>CloudProfileService.refresh(),'Облачная копия обновлена для проверки.'),this.cloudBusy);
                const remote=CloudProfileService.remote;
                if(remote&&remote.profile){c.appendChild(node('p','Облако: уровень '+((remote.profile.currentForest||0)+1)+' · '+(remote.profile.supermoney||0)+' рубинов. Здесь: уровень '+(UserService.getUser().getCurrentForest()+1)+' · '+UserService.getUser().getSupermoney()+' рубинов.'));
                    this.button(c,'Принять облачную копию и перезапустить',()=>this.cloudAction(async()=>{
                        const data=await CloudProfileService.refresh();if(!data.profile)throw new Error('NO_PROFILE');
                        CloudProfileService.backup(UserService.getUser());CloudProfileService.applying=true;
                        try{const loaded=new User(data.profile);ServerStoreComponent.saveLocalUser(loaded);UserService.setUser(loaded);CloudProfileService.accept(data);}finally{CloudProfileService.applying=false;}
                        window.location.reload();
                    },'Облачная копия принята.'),this.cloudBusy||onField,true);
                }
            }
            if(onField)c.appendChild(node('p','Восстановить профиль можно после возвращения домой.','world-note'));
            if(AnalyticUtils.getCustomization()===CustomizationType.webDev&&state==='ready'){
                const account=this.card(body,'Доступ с другого устройства','Привяжите почту к текущему прогрессу. Затем входите по ссылке из письма.');
                const label=node('label','Электронная почта'),input=<HTMLInputElement>node('input');input.type='email';input.autocomplete='email';input.placeholder='name@example.com';input.style.cssText='display:block;box-sizing:border-box;width:100%;padding:12px;border:1px solid #b69d72;border-radius:10px;font:inherit;margin-top:8px';label.appendChild(input);account.appendChild(label);
                const email=()=>{if(!input.checkValidity()||!input.value.trim()){this.notice='Укажите корректную почту.';return null;}return input.value.trim();};
                this.button(account,'Привязать почту',()=>{const value=email();if(value)this.cloudAction(()=>CloudProfileService.linkEmail(value),'Проверьте письмо для подтверждения почты.');},this.cloudBusy);
                this.button(account,'Войти в существующий профиль',()=>{const value=email();if(value)this.cloudAction(()=>CloudProfileService.loginEmail(value),'Проверьте письмо со ссылкой для входа.');},this.cloudBusy||onField,true);
            }
        }
        this.button(body,'Экспорт местной копии',()=>this.downloadProfile(JSON.stringify(UserService.getUser()),'mushrooms-local-profile.json'),false,true);
        const backup=localStorage.getItem('mushrooms.cloud.local-backup');if(backup)this.button(body,'Экспорт копии перед восстановлением',()=>this.downloadProfile(backup,'mushrooms-recovery-profile.json'),false,true);
    }
    private static downloadProfile(value:string,filename:string):void {
        const url=URL.createObjectURL(new Blob([value],{type:'application/json'})),a=<HTMLAnchorElement>node('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
}
