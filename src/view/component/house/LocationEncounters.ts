import WorldService from '../../../core/service/WorldService';
import WorldConfiguration, {WorldEncounter} from '../../../core/configuration/WorldConfiguration';
import UserService from '../../../core/service/UserService';
import GameClock from '../../../core/service/GameClock';
import CharacterTextUtils from '../../../core/utils/CharacterTextUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UiLayout from '../../../core/utils/UiLayout';
import Label from '../panel/Label';
import StoryOverlay, {storyNode,storyButton,portraitPath} from './StoryOverlay';
import Game from '../../game/Game';
import ForestScreen from '../../screen/ForestScreen';

const voices: {[id:string]:{who:string;greeting:string;question:string;answers:string[]}} = {
    shadowEcho:{who:'Лесной гость',greeting:'Не уходи, пожалуйста! Я свернул за светлячком и теперь не узнаю тропу.',question:'Поможешь мне вернуться к большой поляне?',answers:['Теперь вижу знакомый дуб! Спасибо, что подошёл, даже когда не знал, кто здесь прячется.']},
    windBridge:{who:'Белка',greeting:'Мост скрипит, а припасы нужны малышам до дождя. Одной мне не справиться.',question:'Сможешь пройти рядом и подхватить корзину?',answers:['Всё цело! Оставь себе эту крепкую ветку — на тропе она ещё пригодится.']},
    squirrelOak:{who:'Белка',greeting:'Этот жёлудь почти с меня ростом. А ветка над дуплом качается…',question:'Как мне добраться до дома?',answers:['Точно! По нижней ветке можно пройти спокойно. Хорошо, что ты заметил развилку.','Пока ты держишь ветку, я успею! Вот и дом. Вдвоём мы справились.']},
    scoutBranch:{who:'Пчела-разведчица',greeting:'Я пересчитала закрытые цветы, но рядом есть ещё обычные следы. Как их сопоставить?',question:'Поможешь проверить наши наблюдения?',answers:['Оба числа говорят об одном участке! Теперь разведчицы смогут вести отряд точнее.']},
    rustlingHedgehog:{who:'Ёжик',greeting:'Я не прячусь… Просто здесь слишком громко. Можно чуть тише?',question:'Ты подождёшь, пока я освоюсь?',answers:['Теперь не страшно. Я покажу короткую тропу между корнями — там совсем тихо.']},
    pollenBorder:{who:'Хранительница луга',greeting:'Ветер перепутал лепестки, но пыльца осталась на краю листьев.',question:'С какой стороны раньше был цветок?',answers:['Да, рисунок продолжается вон там! Ты помог вернуть лугу потерянный след.']},
    frogPond:{who:'Лягушка',greeting:'Тише! Я жду стрекозу. Хотя… ты знаешь какую-нибудь историю?',question:'Расскажешь, пока твои друзья идут к воде?',answers:['Вот это приключение! Я и не заметила, как все прошли. Приходи ещё, дослушаем у пруда.']},
    butterflyCocoon:{who:'Смотритель поляны',greeting:'Первый вылет совсем скоро, а ветка открыта ветру.',question:'Поможешь приготовить тихое укрытие?',answers:['Листья держат ветер, а свет проходит. Первый полёт начнётся в безопасности.']},
    owlCounter:{who:'Ночная сова',greeting:'В моей карте не сходятся три отметки. Лес звучит иначе после заката.',question:'Сверим голоса и числа вместе?',answers:['Последняя отметка встала на место! Теперь карта помнит и ночную тропу.']},
    ghostDoor:{who:'Голос библиотеки',greeting:'Ты слышишь меня сквозь корни? Библиотека давно ждёт того, кто сумеет прочитать её печать.',question:'Дверь останется здесь два дня. Попробуешь открыть её?',answers:['Ты понял забытые знаки. Цепи отпускают дверь — библиотека признаёт нового читателя.','Корни уступают твоим рукам. За дверью слышен шелест страниц. Вход открыт.']},
    giantJelly:{who:'Гига-желейка',greeting:'Буль… Я не хотела перекрывать тропу. Просто я ужасно голодная.',question:'Поможешь найти путь к цветущей чаше?',answers:['Бутоны пахнут чудесно! Я пойду за ними, а тропа снова свободна.','Ой! Я поняла, здесь нельзя лежать. Перекочую поближе к чаше.','Спасибо за спокойный голос. Теперь я вижу: обед совсем рядом.']},
    leprechaunHome:{who:'Хозяин домика',greeting:'Ветер перекосил крышу, а к вечеру обещают дождь. Как бы вернуть дому тепло?',question:'Поможешь с опорами или креплениями?',answers:['Теперь крыша выдержит дождь. Прими клевер из моего сада — на добрую память.','Как ловко ты разобрался с креплениями! Дом снова дышит теплом.']},
    nutSafe:{who:'Лесной мастер',greeting:'Я завязал этот орех так надёжно, что сам не могу его открыть.',question:'Есть идея, как развести верёвки?',answers:['Распорка держит! Древесины внутри оказалось даже больше, чем я помнил.','Слабая петля была с обратной стороны! Забери часть припасов за помощь.']},
    unicornChain:{who:'Единорог',greeting:'Я дёрнулся от шороха, и цепи запутались ещё сильнее.',question:'Помоги, только без резких движений.',answers:['Рядом с тобой спокойно. Я перестал тянуть цепи, и они ослабли сами.','Ты разомкнул обе цепи. Теперь я снова могу выйти на свет.']},
    frozenChest:{who:'Хранитель ручья',greeting:'Сундук вмёрз в ручей. Силой лёд не взять: внутри хрупкие вещи.',question:'Согреем его или прочтём узор инея?',answers:['Медленное тепло сработало. Старые звёзды внутри ещё сияют.','Иней сложился в знакомую руну, и лёд отпустил замок.']},
    salamanderForge:{who:'Саламандра',greeting:'В горне хороший жар, но мне не хватает второй пары рук. Или свежего взгляда на чертёж.',question:'Чем ты поможешь нашей кузнице?',answers:['С таким помощником работа спорится! Возьми древесину для будущих дел.','Вот где ошибка в чертеже! Следующая тропа встретит нас крепкими инструментами.']}
};

export default class LocationEncounters extends Phaser.Group {
    private panel:StoryOverlay;private badges:Phaser.Group;private timer:Phaser.TimerEvent;private disposing=false;
    constructor(private screen:any){
        super(screen.game);this.name='locationEncounters';this.fixedToCamera=true;this.refresh();
        this.timer=this.game.time.events.loop(30000,()=>{if(!this.panel)this.refresh();});
    }
    public refresh():void {
        if(this.disposing)return;
        if(this.badges)this.badges.destroy(true);this.badges=this.game.add.group(this);
        const user=UserService.getUser(),encounters=WorldService.encounters(user);
        // A passed door remains an actual entrance until its adventure ends.
        WorldConfiguration.encounters.filter(e=>e.adventure).forEach(e=>{
            const state=user.world.adventures[e.adventure];if(state&&!state.completedAt&&(!state.startedAt||GameClock.now()<state.startedAt+3*WorldService.DAY)&&!encounters.some(x=>x.id===e.id))encounters.push(e);
        });
        encounters.slice(0,3).forEach((e,i)=>{
            const button=SpriteUtils.createButton(this.game,this.game.width-115,this.game.height-650-i*145,'actionCircle',()=>{if(!this.screen.isLocked()&&!this.panel)this.open(e);});button.anchor.set(.5);button.name='encounter:'+e.id;
            const icon=SpriteUtils.createSprite(this.game,0,-2,e.icon);icon.anchor.set(.5);SpriteUtils.fitIcon(icon,78,78);button.addChild(icon);this.badges.add(button);
            const plaque=SpriteUtils.createSprite(this.game,0,76,'uiSecondaryControl');plaque.anchor.set(.5);plaque.width=196;plaque.height=43;button.addChild(plaque);
            const open=!!user.world.adventures[e.adventure];
            const text=new Label(this.game,0,76,e.persistent?(open?'Войти':'Дверь · '+this.hours(e)+' ч'):'Встреча', {font:'bold 24px Gilroy',fill:'#294a38',align:'center'});text.anchor.set(.5);UiLayout.fit(text,190,34);button.addChild(text);
        });
    }
    private hours(e:WorldEncounter):number {const s=UserService.getUser().world.encounters[e.id];return s?Math.max(0,Math.ceil((s.discoveredAt+2*WorldService.DAY-GameClock.now())/3600000)):0;}
    public open(e:WorldEncounter):void {
        const user=UserService.getUser(),voice=voices[e.id],state=user.world.encounters[e.id];let character=user.getCurrentCharacterId(),page=0,notice='';
        if(!voice||!state)return;
        const modal=this.panel=new StoryOverlay(e.name,e.adventure?'assets/world/ghost-door.png':'assets/arcane/levels/forest-v1.webp',character,()=>{this.panel=null;this.refresh();});
        const adventure=()=>{
            if(WorldService.startAdventure(user,e.adventure)){modal.close();Game.getInstance().startScene(ForestScreen,true,false);}
            else {notice='Сначала завершите другое активное приключение.';render();}
        };
        const render=()=>{
            const portrait=<HTMLImageElement>modal.scene.querySelector('.story-portrait');if(portrait)portrait.src=portraitPath(character);
            const completed=!!user.world.encounters[e.id].completedAt;
            if(completed){
                const choice=user.world.encounters[e.id].choice||0;
                modal.say(voice.who,voice.answers[choice]||'Мы нашли другой способ и справились вместе! Спасибо, что выслушал меня и помог подготовиться.');
                if(e.adventure){modal.body.appendChild(storyNode('p','Вход открыт. Приключение длится три дня с первого входа.','story-note'));storyButton(modal.body,'Войти в библиотеку',adventure);}
                else modal.body.appendChild(storyNode('p','Получено: '+LocationEncounters.rewardText(e.choices[choice].reward),'story-reward'));
                storyButton(modal.body,'Вернуться на тропу',()=>modal.close());if(notice)modal.body.appendChild(storyNode('p',notice,'story-note'));return;
            }
            if(e.persistent&&this.hours(e)<=0){modal.say(voice.who,'Огонёк погас. Время этой встречи истекло, но основная тропа остаётся открытой.');storyButton(modal.body,'Вернуться на тропу',()=>modal.close());return;}
            modal.say(voice.who,page===0?voice.greeting:notice||voice.question);
            if(page===0){modal.body.appendChild(storyNode('p',e.chapter,'story-kicker'));storyButton(modal.body,'Прислушаться',()=>{page=1;render();});return;}
            if(e.persistent)modal.body.appendChild(storyNode('p','Дверь исчезнет через '+this.hours(e)+' ч. Неудачная попытка ничего не расходует.','story-note'));
            const heroes=storyNode('div',null,'story-heroes');heroes.setAttribute('aria-label','Кто поможет');modal.body.appendChild(heroes);
            user.getCharacters().forEach(c=>{const b=storyButton(heroes,CharacterTextUtils.getDisplayName(c.id),()=>{character=c.id;notice='';render();});b.setAttribute('aria-pressed',String(character===c.id));});
            e.choices.forEach((choice,index)=>{
                const needed=WorldService.encounterRequirement(user,e,index),value=choice.stat?WorldService.stat(user,character,choice.stat):user.world.materials.wood||0;
                const label=choice.stat?WorldConfiguration.statNames[choice.stat]:'Древесина';
                const check=storyButton(modal.body,choice.text,()=>{
                    if(WorldService.check(user,e.id,index,character)){render();return;}
                    notice='Пока не получилось. '+voice.who+': «Не торопись. Можно подготовиться и вернуться». Ничего не потрачено.';render();
                },!choice.stat&&value<needed);
                check.appendChild(storyNode('span',label+' '+value+'/'+needed,'story-check-detail'));
            });
            if(e.persistent){
                const stat=e.choices[0].stat,practiced=user.world.dailyActions['door:'+e.id+':practice']===GameClock.day();
                storyButton(modal.body,practiced?'Новые подсказки — завтра':'Изучить знаки вместе · +3 к интеллекту',()=>{if(WorldService.practiceDoor(user,e.id,character,stat)){notice='Мы разобрали часть знаков. Навык вырос на 3; попробуем снова?';render();}},practiced);
                modal.body.appendChild(storyNode('p','Бесплатная подготовка доступна раз в день. Навык сохранится. Можно выбрать другого спутника и снова открыть эту панель с карты.','story-note'));
            }else modal.body.appendChild(storyNode('p','Помощь отряда учитывается: хотя бы один из ваших героев может пройти проверку.','story-note'));
        };render();
    }
    public static rewardText(r:any):string {return [r.energy?r.energy+' энергии':'',r.wood?r.wood+' древесины':'',r.clover?r.clover+' клевера':'',r.gems?r.gems+' звёзд':''].filter(Boolean).join(', ');}
    public destroy(destroyChildren?:boolean):void {this.disposing=true;if(this.panel)this.panel.close();if(this.timer)this.game.time.events.remove(this.timer);super.destroy(destroyChildren);}
}
