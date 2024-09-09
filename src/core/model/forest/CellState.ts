import Label from '../../../view/component/panel/Label';
import ForestCellCover from '../../../view/component/forest/ForestCellCover';
import { ContentType } from '../../model/enum/ContentType';
export default class CellState {
    opened: boolean;
    leafType: string;

    // content: string;
    content: ContentType;

    sprite: Phaser.Sprite;
    cover: ForestCellCover;
    label: Label = null;
    
    metaValue:string;

    underSprite: Phaser.Sprite;
    berries: Phaser.Sprite[] = [];
    honeyLabel: Label;

    constructor(content: ContentType, leafType: string, metaValue?:string) {
        this.leafType = leafType;
        this.content = content;
        this.opened = false;
        this.metaValue = metaValue;
    }

    public static getImage(content: string): string {
        return content;
    }

}


