import AimType from '../../model/enum/AimType';
import Label from './../../../view/component/panel/Label';
import GameText from '../../localization/GameText';

export default class ForestAim {
    type: AimType;
    image: string;
    countLeft: number;
    countLeftImmediate: number;
    countCollected: number = 0;
    startCount: number;
    label: Label;
    sprite: Phaser.Sprite;

    constructor(type: AimType, image: string, count: number) {
        this.type = type;
        this.image = image;
        this.countLeft = count;
        this.countLeftImmediate = count;
        this.startCount = count;
    }

    public static getAimsInfo(aim: ForestAim): string {
        return GameText.aimInfo(aim);
    }

    public static getCompleteInfo(aims: ForestAim[]): string {
        return GameText.completeAimInfo(aims);
    }
}

