import Label from '../../../view/component/panel/Label';
import ForestCellCover from '../../../view/component/forest/ForestCellCover';
import { ContentType } from '../../model/enum/ContentType';

export interface NumberedTreeParticleCloud {
    tint?: number;
    group: Phaser.Group;
    timer: Phaser.TimerEvent;
    stopped: boolean;
    particles: Array<{ sprite: Phaser.Sprite; alphaTween: Phaser.Tween; startedAt: number }>;
}

export default class CellState {
    opened: boolean;
    leafType: string;

    // content: string;
    content: ContentType;

    sprite: Phaser.Sprite;
    renderedContentImage: string;
    renderedAdjucentCount: number;
    numberedDecoration: boolean = false;
    hadNumberedTree: boolean = false;
    numberlessDecorationImage: string;
    finalTreeImage: string;
    numberedTreeEffect: Phaser.Group;
    numberedTreeParticles: NumberedTreeParticleCloud;
    numberedTreeSwayTween: Phaser.Tween;
    numberedTreePulseTween: Phaser.Tween;
    numberedTreeReactionOrigin: { x: number; y: number };
    cover: ForestCellCover;
    label: Label | null = null;
    
    metaValue:string;
    baseScaleX: number = 1;
    baseScaleY: number = 1;

    valueProbability: number;
    adjucentValueProbability: number;

    underSprite: Phaser.Sprite;
    berries: Phaser.Sprite[] = [];
    honeyLabel: Label;

    constructor(content: ContentType, leafType: string, metaValue?:string) {
        this.leafType = leafType;
        this.content = content;
        this.opened = false;
        this.metaValue = metaValue;
        this.valueProbability = 0;
    }

    public static getImage(content: string): string {
        return content;
    }

}


