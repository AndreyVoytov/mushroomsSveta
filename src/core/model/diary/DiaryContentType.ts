import Preset from '../../../view/game/Preset';
import DiaryRecipeItemType from './DiaryRecipeItemType';
import MapPreset from './MapPreset';
import ReplicaDecorConfiguration from '../../configuration/ReplicaDecorConfiguration';
import ReplicaDecor from '../replica/ReplicaDecor';
import DiaryPicture from '../replica/DiaryPicture';
export default class DiaryContentType {
    id: string;
    fromReplica?:string;
    fromLevel?: number;
    
    copyOf?:string;
    
    title?: string;
    resultImage?: string;
    resultImageForProgress?: string;
    titleForProgress?:string;

    picture?:string;
    characterOverPicture?:DiaryPicture;
    decorOverPicture?:DiaryPicture;

    centerCharacter?:boolean;

    details?: string;
    requiredItems?: DiaryRecipeItemType[];

    mapPreset?: MapPreset;

    highlightColor?:string;
}


