import UserService from '../../../core/service/UserService';
import WorldService from '../../../core/service/WorldService';
import WorldConfiguration from '../../../core/configuration/WorldConfiguration';
import RelationshipConfiguration from '../../../core/configuration/RelationshipConfiguration';
import CharacterTextUtils from '../../../core/utils/CharacterTextUtils';
import GameClock from '../../../core/service/GameClock';
import CharacterProgressionService from '../../../core/service/CharacterProgressionService';
import StoryOverlay, { installStoryStyles, storyNode, storyButton } from './StoryOverlay';

export default class CharacterRelationships {
    private root:HTMLElement;private tabs:HTMLElement;private content:HTMLElement;private bubble:HTMLElement;
    private mode='relations';private character='';private scene:StoryOverlay;private bubbleTimer:any;
    private keys=(event:KeyboardEvent)=>{if(event.key==='Escape'&&this.owner.opened&&!this.scene)this.owner.close();};
    constructor(private owner:any,private selectTab:(relations:boolean)=>void){
        installStoryStyles();this.root=storyNode('div',null,'relation-ui');this.root.style.width='860px';
        this.tabs=storyNode('nav',null,'relation-tabs');this.tabs.setAttribute('role','tablist');this.tabs.setAttribute('aria-label','Панель персонажа');this.root.appendChild(this.tabs);
        [['relations','Отношения'],['items','Предметы']].forEach(pair=>{
            const b=storyButton(this.tabs,pair[1],()=>{this.mode=pair[0];this.refresh(this.character);});b.setAttribute('role','tab');b.dataset.tab=pair[0];
            b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.mode=this.mode==='items'?'relations':'items';this.refresh(this.character);(<HTMLElement>this.tabs.querySelector('[aria-selected=true]')).focus();}};
        });
        this.content=storyNode('section',null,'relation-content');this.content.setAttribute('role','tabpanel');this.root.appendChild(this.content);document.body.appendChild(this.root);document.addEventListener('keydown',this.keys);this.sync();
    }
    public sync():void {
        if(!this.root)return;const p=this.owner,g=p.game,r=g.canvas.getBoundingClientRect(),s=p.scale.x;
        this.root.style.display=p.opened&&p.visible?'block':'none';
        this.root.style.left=(r.left+(g.width/2-430*s)*r.width/g.width)+'px';
        this.root.style.top=(r.top+(g.height/2+(820-1669/2)*s)*r.height/g.height)+'px';
        this.root.style.transform='scale('+(s*r.width/g.width)+','+(s*r.height/g.height)+')';
    }
    public showItems():void {this.mode='items';this.refresh(this.character);}
    public refresh(character:string):void {
        if(!this.root)return;const scroll=this.character===character?this.content.scrollTop:0;if(this.character!==character)this.clearSpeech();this.character=character;
        const user=UserService.getUser(),g=RelationshipConfiguration.companions[character];WorldService.prepare(user);
        Array.prototype.forEach.call(this.tabs.children,(b:HTMLElement)=>{b.setAttribute('aria-selected',String(b.dataset.tab===this.mode));b.tabIndex=b.dataset.tab===this.mode?0:-1;});
        this.selectTab(this.mode==='relations');this.content.style.display=this.mode==='relations'?'block':'none';
        this.content.textContent='';if(this.mode!=='relations'||!g)return;
        const id='player:'+character,xp=user.world.relationships[id]||0,level=WorldService.relationshipLevel(user,id);
        const growth=CharacterProgressionService.state(user,character),heroLevel=growth.level,next=CharacterProgressionService.threshold(heroLevel+1),start=CharacterProgressionService.threshold(heroLevel);
        const summary=storyNode('div',null,'relation-summary');summary.appendChild(storyNode('h3','Уровень '+heroLevel));summary.appendChild(storyNode('span',WorldConfiguration.relationshipNames[level-1]));this.content.appendChild(summary);
        const progress=storyNode('div',null,'relation-progress'),fill=storyNode('span');fill.style.width=Math.max(0,Math.min(100,(xp-start)/(next-start)*100))+'%';progress.appendChild(fill);progress.setAttribute('aria-label','Опыт отношений: '+xp+'; уровень '+heroLevel);this.content.appendChild(progress);
        this.content.appendChild(storyNode('p',heroLevel<CharacterProgressionService.MAX_LEVEL?'До уровня '+(heroLevel+1)+': '+Math.max(0,next-xp)+' ♡ · +'+CharacterProgressionService.pointsForLevel(heroLevel+1)+' к параметрам':'Достигнут высший уровень','relation-growth-next'));
        if(growth.lastGain){
            const reward=storyNode('aside',null,'relation-level-reward');reward.setAttribute('aria-label','Прибавки за уровень');
            reward.appendChild(storyNode('strong','Уровень '+growth.lastGain.fromLevel+' → '+growth.lastGain.toLevel));
            const stats=storyNode('div',null,'relation-gain-stats');Object.keys(growth.lastGain.bonuses).forEach(stat=>stats.appendChild(storyNode('span','+'+growth.lastGain.bonuses[stat]+' '+WorldConfiguration.statNames[stat])));reward.appendChild(stats);this.content.appendChild(reward);
        }
        const rules=storyNode('details',null,'relation-growth-rules');rules.appendChild(storyNode('summary','Как растут параметры'));rules.appendChild(storyNode('p','За уровни 2–4: +1; 5–9: +2; 10–19: +3; 20–39: +4; 40–79: +5; с 80-го: +6. Дальше бонус растёт на 160-м, 320-м и 640-м. Очки случайно распределяются между параметрами существа и сохраняются навсегда.'));this.content.appendChild(rules);
        const actions=storyNode('div',null,'relation-actions');this.content.appendChild(actions);
        storyButton(actions,user.world.dailyActions[id+':talk']===GameClock.day()?'Беседа — завтра':'Поговорить · +10 ♡',()=>{
            if(WorldService.relationAction(user,id,false)){this.refresh(character);this.speak(g.welcome);}
        },user.world.dailyActions[id+':talk']===GameClock.day());
        storyButton(actions,'Подарок · '+(user.world.gifts[g.gift]||0),()=>this.giftPanel());
        const roomReady=user.world.relationshipSteps.indexOf(character+':1')>=0;
        if(roomReady)storyButton(this.content,'Заглянуть в комнату',()=>this.room(-1));
        this.content.appendChild(storyNode('p','Наши истории','story-kicker'));
        RelationshipConfiguration.steps.forEach((step,index)=>{
            const done=user.world.relationshipSteps.indexOf(character+':'+index)>=0,ready=WorldService.canCompleteRelationshipStep(user,character,index),tile=storyNode('article',null,'relation-step'+(done?' done':ready?'':' locked'));
            const prepareGift=!done&&step.kind==='gift'&&xp>=step.xp&&user.world.relationshipSteps.indexOf(character+':'+(index-1))>=0;
            tile.appendChild(storyNode('h4',(done?'✓ ':'')+(index+1)+'. '+step.title));
            const giftNeed=step.kind==='gift'?' · '+g.giftName:'';
            tile.appendChild(storyNode('p',done?'Воспоминание с вами':step.xp+' доверия'+giftNeed+(step.kind==='scene'?' · личная сцена':'')));
            if(done&&step.kind==='scene')storyButton(tile,'Вспомнить разговор',()=>this.room(index,true));
            else if(!done)storyButton(tile,ready?(step.kind==='scene'?'Начать историю':step.kind==='gift'?'Вручить подарок':'Спросить о мечте'):(xp<step.xp?'Ещё '+(step.xp-xp)+' доверия':index>0&&user.world.relationshipSteps.indexOf(character+':'+(index-1))<0?'Сначала предыдущая история':'Подготовить подарок'),()=>{
                if(!ready&&prepareGift){this.giftPanel();return;}
                if(step.kind==='scene'){this.room(index);return;}
                if(WorldService.completeRelationshipStep(user,character,index)){this.refresh(character);this.speak(index===0?g.dream:g.thanks);}
            },!ready&&!prepareGift);
            this.content.appendChild(tile);
        });
        const bonds=WorldConfiguration.relationships.filter(r=>r.id.indexOf('player:')!==0&&r.id.split(':').indexOf(character)>=0&&r.id.split(':').every(c=>user.hasCharacter(c)));
        if(bonds.length){this.content.appendChild(storyNode('h3','Связи отряда'));bonds.forEach(r=>{const tile=storyNode('article',null,'relation-step');tile.appendChild(storyNode('h4',r.name));tile.appendChild(storyNode('p',(user.world.relationships[r.id]||0)+' доверия'));storyButton(tile,'Поговорить о друге · +10 ♡',()=>{if(WorldService.relationAction(user,r.id,false)){this.refresh(character);this.speak('Хорошо, что мы можем положиться друг на друга. Давай чаще путешествовать вместе.');}},user.world.dailyActions[r.id+':talk']===GameClock.day());this.content.appendChild(tile);});}
        this.content.appendChild(storyNode('p','Беседы и обычные подарки доступны раз в день. Истории — один раз, а перечитывать их можно всегда. Совместные поляны тоже укрепляют доверие.','story-note'));
        this.content.scrollTop=scroll;
    }
    private giftPanel():void {
        const character=this.character,user=UserService.getUser(),g=RelationshipConfiguration.companions[character];
        const modal=this.scene=new StoryOverlay('Подарок · '+CharacterTextUtils.getDisplayName(character),'assets/arcane/story/companion-room-v1.webp',character,()=>{this.scene=null;this.refresh(character);});
        const render=()=>{
            modal.say(g.giftName,g.giftDescription);modal.body.appendChild(storyNode('p','В сумке: '+(user.world.gifts[g.gift]||0)+' · древесина '+user.world.materials.wood+' · клевер '+user.world.materials.clover,'story-note'));
            storyButton(modal.body,'Сделать · '+g.wood+' древесины'+(g.clover?' · '+g.clover+' клевера':''),()=>{if(WorldService.makeGift(user,character))render();},user.world.materials.wood<g.wood||user.world.materials.clover<g.clover);
            modal.body.appendChild(storyNode('p','Древесина и клевер встречаются на тропе и выдаются за лесную почту. Один подарок пригодится для третьей истории — его можно приберечь.','story-note'));
            const given=user.world.dailyActions['player:'+character+':gift']===GameClock.day();
            storyButton(modal.body,given?'Следующий подарок — завтра':'Подарить · +20 ♡',()=>{if(WorldService.giveGift(user,character)){modal.close();this.speak(g.thanks);}},given||!(user.world.gifts[g.gift]>0));
            storyButton(modal.body,'Оставить подарок для истории',()=>modal.close());
        };render();
    }
    private room(index:number,replay=false):void {
        const character=this.character,user=UserService.getUser(),g=RelationshipConfiguration.companions[character],name=CharacterTextUtils.getDisplayName(character);
        let page=0,answer=replay?user.world.relationshipChoices[character+':'+index]||'':'',placed=false;
        const modal=this.scene=new StoryOverlay(g.room,'assets/arcane/story/companion-room-v1.webp',character,()=>{this.scene=null;this.refresh(character);});
        const decorate=()=>{
            Array.prototype.forEach.call(modal.scene.querySelectorAll('.room-artifact'),e=>e.remove());
            const decor=user.world.roomDecor[character]||[];
            ['lantern','keepsake'].forEach((id,i)=>{if(decor.indexOf(id)<0&&!(placed&&i===(index===4?1:0)))return;const img=<HTMLImageElement>storyNode('img',null,'room-artifact '+id);img.alt=i?'Памятный артефакт':'Установленный фонарь';img.src=i?'assets/base/ui/items/item1.png':'assets/base/ui/items/item3.png';modal.scene.appendChild(img);});
        };decorate();
        const finish=()=>{
            const completed=replay||WorldService.completeRelationshipStep(user,character,index,answer);modal.close();
            if(completed&&!replay)this.speak(RelationshipConfiguration.steps[index].reply);
        };
        const render=()=>{
            if(index<0){modal.say(name,(character==='sveta'?'Рада':'Рад')+' видеть тебя дома. '+((user.world.roomDecor[character]||[]).length?'Наши памятные вещи уже на своих местах.':'Здесь ещё много свободного места для наших будущих находок.'));storyButton(modal.body,'Побыть рядом',()=>{modal.say(name,g.welcome);storyButton(modal.body,'До следующей встречи',()=>modal.close());});return;}
            const text=index===1?[g.dream,'Я долго не решал'+(character==='sveta'?'ась':'ся')+' показать тебе это место. С чего бы ты начал?','Тогда пусть это будет наш первый общий план. '+answer]:index===3?['Помнишь нашу мечту? Я наш'+(character==='sveta'?'ла':'ёл')+' место для вещи, которая будет встречать нас после каждой вылазки.','Какой смысл мы оставим в этом огоньке?','Ты выбрал: «'+answer+'» Пусть «'+g.artifact+'» напоминает нам об этом. Поставим его на полку?','Теперь, когда в окне горит свет, дом будто говорит: тебя ждут.']:['Ты помог превратить тихий уголок в настоящий дом. Осталось выбрать место для нашего оберега.','Что он будет нам напоминать?','«'+answer+'» — я тоже этого хочу. Поставим оберег рядом с фонарём, чтобы сохранить наше обещание?','Куда бы ни привела нас тропа, сюда можно вернуться. Спасибо, что прошёл этот путь со мной.'];
            modal.say(name,text[page]);
            if(page===1){
                const options=index===1?['Начнём с места для друзей.','Сохраним здесь самые важные находки.']:['О том, что рядом есть друзья.','О смелости идти навстречу новому.'];
                options.forEach(t=>storyButton(modal.body,t,()=>{answer=t;page++;render();}));
            }else if(page===2&&index>=3){storyButton(modal.body,replay?'Посмотреть на памятную вещь':index===3?'Поставить фонарь на полку':'Разместить оберег',()=>{placed=true;decorate();page++;render();});}
            else if(page===text.length-1)storyButton(modal.body,replay?'Вернуться':'Сохранить эту историю · +5 ♡',finish);
            else storyButton(modal.body,'Дальше',()=>{page++;render();});
            if(replay)modal.body.appendChild(storyNode('p','Воспоминание · награда уже получена','story-note'));
        };render();
    }
    private speak(text:string):void {
        this.clearSpeech();this.bubble=storyNode('div',text,'relation-bubble');this.bubble.setAttribute('role','status');this.root.appendChild(this.bubble);
        for(let i=0;i<5;i++){const h=storyNode('span','♥','relation-heart');h.style.left=(100+i*26)+'px';h.style.animationDelay=(i*.1)+'s';h.style.setProperty('--drift',(i*22-44)+'px');this.root.appendChild(h);}
        this.bubbleTimer=setTimeout(()=>this.clearSpeech(),6500);
    }
    private clearSpeech():void {clearTimeout(this.bubbleTimer);if(this.bubble)this.bubble.remove();this.bubble=null;if(this.root)Array.prototype.forEach.call(this.root.querySelectorAll('.relation-heart'),e=>e.remove());}
    public hide():void {this.clearSpeech();if(this.root)this.root.style.display='none';if(this.scene)this.scene.close();}
    public destroy():void {this.hide();document.removeEventListener('keydown',this.keys);if(this.root)this.root.remove();this.root=null;}
}
