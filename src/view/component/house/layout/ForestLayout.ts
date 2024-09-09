import AnimationUtils from '../../../../core/utils/AnimationUtils';
import Utils from '../../../../core/utils/Utils';
import BaseLayout from './BaseLayout';
import { Easing } from 'phaser-ce';
import StoryLocation from '../../../../core/model/enum/StoryLocation';
import DialogScreen from '../../../screen/common/DialogScreen';
export default class ForestLayout extends BaseLayout {

    private campfire: Phaser.Sprite;
    private tent: Phaser.Sprite;

    private rainbow: Phaser.Sprite;
    private watermill: Phaser.Sprite;

    constructor(game: Phaser.Game, location: StoryLocation) {
        super(game, "ForestLayout", "forestBg");

        this.campfire = this.attachSprite("campfire");
        this.watermill = this.attachSprite("watermill");
        this.rainbow = this.attachSprite("rainbow");
        this.tent = this.attachSprite("tent");

        let preset = [
            {"spriteId":"campfire","x":-109+316-46-20,"y":25+80,"scaleX":1.6599999999999997,"scaleY":1.6399999999999997,"anchorX":0,"anchorY":0,"rotation":0},
            {"spriteId":"watermill","x":-78,"y":-108,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"rainbow","x":26,"y":-172,"scaleX":1.8400000000000007,"scaleY":2.6400000000000015,"anchorX":0.5,"anchorY":0.5,"rotation":0}
        ];

        this.applyPreset(preset)
        this.applyState(location);
    }

    private applyState(location: StoryLocation): void {
        if (location == StoryLocation.forest) {
            //do nothing
        } else if (location == StoryLocation.forest_campfire) {
            this.campfire.visible = true;
        } else if (location == StoryLocation.forest_camp) {
            this.campfire.visible = true;
            this.tent.visible = true;
        } else if (location == StoryLocation.forest_watermill){
            this.watermill.visible = true;
            this.rainbow.visible = true;

            this.rainbow.alpha = 0;
            this.game.add.tween(this.rainbow).to({alpha: [0.7, 0.7, 0, 0]}, 30000, Easing.Linear.None, true, 0, 12321);
        }
    }

    public playAnimation(animationId: string, screen?: DialogScreen): boolean {
        if(super.playAnimation(animationId, screen)){
            //do nothing
        // } else if (animationId == "unicornHide"){
        }

        return true;

    }

    protected attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let res = super.attachSprite(spriteId, name);
        res.visible = false;
        return res;
    }

}