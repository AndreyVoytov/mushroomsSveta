import HeroParty from '../HeroParty';
import HeroChargeTracker from '../HeroChargeTracker';
import UserService from '../UserService';
import ForestScreen from '../../../view/screen/ForestScreen';
import HeroTeamPanel from '../../../view/component/forest/HeroTeamPanel';
import HeroDiceRoll from '../../../view/component/forest/HeroDiceRoll';
import Utils from '../../utils/Utils';
import AnimationUtils from '../../utils/AnimationUtils';
import OpeningType from '../../model/enum/OpeningType';
import { DecorationsContents } from '../../model/enum/ContentType';
import ForestUtils from '../../utils/ForestUtils';
import ForestCell from '../../model/forest/ForestCell';

export default class HeroAbilitiesProvider {
    public tracker: HeroChargeTracker;
    private screen: ForestScreen;
    private panel: HeroTeamPanel;
    private game: Phaser.Game;
    private busy = false;
    private disposed = false;
    private loop: Phaser.TimerEvent;
    private events: Phaser.TimerEvent[] = [];

    constructor(game: Phaser.Game, screen: ForestScreen, panel: HeroTeamPanel) {
        this.game=game;this.screen=screen;this.panel=panel;
        this.tracker=new HeroChargeTracker(HeroParty.members(UserService.getUser()).filter(h=>!!h).map(h=>h.id));
        this.panel.showCharges(this.tracker);
        this.loop=game.time.events.loop(100,()=>this.pump());
    }

    public recordEnergySpent(amount: number): void {
        if(this.disposed)return;
        this.tracker.spend(amount);this.panel.showCharges(this.tracker);
    }

    private numberedCells(): ForestCell[] {
        const cp=this.screen.cellsProvider;
        return cp.getCells().filter(c=>!c.state.opened&&c.state.cover&&!c.state.cover.isDark()&&!c.state.cover.isLocked()
            && c.state.content in DecorationsContents && !ForestUtils.isBoosterType(c.type))
            .map(cell=>({cell,score:cp.getAdjucentInteractiveCount(cp.getCells(),cell)}))
            .filter(entry=>entry.score>0)
            .sort((a,b)=>b.score-a.score||a.cell.Y-b.cell.Y||a.cell.X-b.cell.X)
            .map(entry=>entry.cell);
    }

    private pump(): void {
        if(this.disposed||this.busy||!this.screen.canUseHeroAbilities())return;
        const ready=this.tracker.readyMembers();
        for(let i=0;i<ready.length;i++){
            const id=ready[i];
            if(id=='owl'){
                if(!this.numberedCells().length)continue;
                this.busy=true;this.tracker.consume(id);this.panel.showCharges(this.tracker);
                const result=Utils.random(6)+1;
                const dice=new HeroDiceRoll(this.game,this.panel.origin(id),result,()=>{
                    if(!this.disposed)this.openOwlCells(result);
                });
                this.screen.addTopOverlay(dice);
                this.screen.delayWinOrLooseCheck(1800+result*350);
                return;
            }
            this.busy=true;
            const placed=this.screen.placeHeroBooster(id,this.panel.origin(id,true),()=>{
                if(!this.disposed)this.busy=false;
            });
            if(placed){this.tracker.consume(id);this.panel.showCharges(this.tracker);return;}
            this.busy=false;
        }
    }

    private later(delay: number, callback: () => void): void {
        const event=this.game.time.events.add(delay,()=>{
            this.events=this.events.filter(e=>e!=event);
            if(!this.disposed)callback();
        });
        this.events.push(event);
    }

    private openOwlCells(left: number): void {
        if(left<=0){this.busy=false;return;}
        if(!this.screen.canUseHeroAbilities()){
            this.later(150,()=>this.openOwlCells(left));return;
        }
        const cell=this.numberedCells()[0];
        if(!cell){this.busy=false;return;}
        const cp=this.screen.cellsProvider;
        AnimationUtils.highlight(this.game,cp.calculateX(cell),cp.calculateY(cell),'splashV',0,.75,350);
        cell.state.cover.openCell(OpeningType.byVision);
        this.screen.delayWinOrLooseCheck(left*350+600);
        this.later(350,()=>this.openOwlCells(left-1));
    }

    public dispose(): void {
        if(this.disposed)return;
        this.disposed=true;this.game.time.events.remove(this.loop);
        this.events.forEach(event=>this.game.time.events.remove(event));this.events=[];
    }
}
