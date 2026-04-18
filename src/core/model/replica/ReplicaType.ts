import ReplicaContextType from './ReplicaContextType';
import ReplicaDecor from './ReplicaDecor';
import ReplicaPanelItemType from './ReplicaPanelItemType';
import RewardItemType from '../reward/RewardItemType';
import StoryLocation from '../enum/StoryLocation';
export default class ReplicaType {
    id: string;
    personName: string;
    personImage: string;
    secondPersonImage?: string;
    text: string;

    location?:StoryLocation
    afterLevelLocation?:StoryLocation;

    showDiary?: boolean;
    panelItem?: ReplicaPanelItemType;
    rewards?: RewardItemType[];
    // highlightDiary?: boolean;
    // diaryDelay?: number;

    delay?: number;

    buttonName?: string;
    // buttonAnimation?: string;
    // presentTask?:string;
    buttonImage?: string;

    rightSide?: boolean;

    glint?: {x:number, y:number};
    decor?: ReplicaDecor;
    decor2?: ReplicaDecor;

    context: ReplicaContextType;

    personalAnimation?:string;

    beforeAnimation?: string;
    afterAnimation?: string;
    afterAnimationParameter?: string;

    // afterAnimationDuration?: number;

    // setMarkerAfter?: string; //TODO replace with 'beforeItems' + 'afterItems'
    
    // setMarkerBefore?: string; //not used

}


