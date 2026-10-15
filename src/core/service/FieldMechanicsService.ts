import BaseCellsProvider from './provider/BaseCellsProvider';
import { ContentType } from '../model/enum/ContentType';
import UserService from './UserService';
import WorldPanel from '../../view/component/house/WorldPanel';
// Approved tracker mechanic base-b01-09: a scout carrier counts nearby closed flowers.
export default class FieldMechanicsService {
    public static attach(game:Phaser.Game,provider:BaseCellsProvider):void {
        const level=UserService.getUser().getCurrentForest();
        if(level<22||level%10!==2)return;
        let marker:Phaser.Text=null,carrier:any=null;
        const refresh=()=>{
            const cells=provider.getCells();
            const flowers=cells.filter(c=>c.state.content===ContentType.chamomileSmall&&!c.state.opened);
            if(!carrier)carrier=cells.filter(c=>c.state.opened&&flowers.some(f=>provider.areAdjucent(c,f)))[0];
            if(!carrier||!carrier.state.sprite)return;
            if(!marker){marker=game.add.text(0,0,'',{font:'bold 28px Arial',fill:'#ffe595',stroke:'#523921',strokeThickness:4});marker.anchor.set(0.5);marker.inputEnabled=true;marker.events.onInputDown.add(()=>WorldPanel.show('help'));}
            const count=flowers.filter(f=>provider.areAdjucent(carrier,f)).length;
            marker.position.set(carrier.state.sprite.x,carrier.state.sprite.y-35);marker.text='Пчёлы: '+count;
        };
        game.time.events.loop(800,refresh);refresh();
    }
}
