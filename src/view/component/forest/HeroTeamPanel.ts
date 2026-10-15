import HeroParty from '../../../core/service/HeroParty';
import UserService from '../../../core/service/UserService';
import HeroPortraitSlot from './HeroPortraitSlot';
import HeroChargeTracker from '../../../core/service/HeroChargeTracker';

export default class HeroTeamPanel extends Phaser.Group {
    public slots: HeroPortraitSlot[] = [];
    private withProgress: boolean;
    private diameter: number;
    private spacing: number;
    private memberKey = '';

    constructor(game: Phaser.Game, x: number, y: number, progress: boolean) {
        super(game,null,'heroTeamPanel');this.position.set(x,y);
        this.withProgress=progress;this.diameter=progress?112:136;this.spacing=progress?146:184;
        this.refresh();
    }

    public refresh(): void {
        const members=HeroParty.members(UserService.getUser()),key=members.map(h=>h?h.id:'_').join(',');
        if(key==this.memberKey&&this.slots.length)return;
        this.memberKey=key;
        this.removeAll(true);this.slots=[];
        members.forEach((hero,i)=>{const slot=new HeroPortraitSlot(this.game,(i-1)*this.spacing,0,this.diameter,hero,this.withProgress);this.add(slot);this.slots.push(slot);});
    }

    public showCharges(tracker: HeroChargeTracker): void {
        this.slots.forEach(slot=>{if(slot.hero)slot.setCharge(tracker.value(slot.hero.id));});
    }

    public origin(id: string, world: boolean = false): Phaser.Point {
        const slot=this.slots.filter(s=>s.hero&&s.hero.id==id)[0];
        if(!slot)return new Phaser.Point(this.game.width/2,this.game.height-70);
        slot.updateTransform();
        return new Phaser.Point(slot.worldTransform.tx+(world?this.game.camera.x:0),slot.worldTransform.ty+(world?this.game.camera.y:0));
    }
}
