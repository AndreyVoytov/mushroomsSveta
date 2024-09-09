import Preset from '../../../view/game/Preset';
import DiaryRecipeItemType from './DiaryRecipeItemType';
export default class MapPreset {
    preset: Preset[];
    notes?: string[];
    ignoreReplicaIntervals?:{from:string, to:string}[];
}


