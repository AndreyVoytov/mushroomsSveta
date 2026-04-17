import ReplicaFloatingItemPanel from './ReplicaFloatingItemPanel';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import ReplicaPanelItemType from '../../../core/model/replica/ReplicaPanelItemType';

export default class ReplicaMapPartPanel extends ReplicaFloatingItemPanel {
    constructor(game: Phaser.Game, x: number, y: number, r: ReplicaType, panelItem: ReplicaPanelItemType) {
        super(game, x, y, r, panelItem);
    }
}
