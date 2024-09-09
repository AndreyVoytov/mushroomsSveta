import AnimationUtils from '../../../../core/utils/AnimationUtils';
import Utils from '../../../../core/utils/Utils';
import BaseLayout from './BaseLayout';
import { Easing } from 'phaser-ce';
import StoryLocation from '../../../../core/model/enum/StoryLocation';
import DialogScreen from '../../../screen/common/DialogScreen';
export default class DarkForestLayout extends BaseLayout {

    private unicorn: Phaser.Sprite;
    private unicorn2: Phaser.Sprite;
    private unicorn3: Phaser.Sprite;

    constructor(game: Phaser.Game, location: StoryLocation) {
        super(game, "DarkForestLayout", "darkForestBg");

        this.unicorn = this.attachSprite("unicorn1", "unicorn");
        this.unicorn2 = this.attachSprite("unicorn1", "unicorn2");
        this.unicorn3 = this.attachSprite("unicorn1", "unicorn3");

        let preset = [
            {"spriteId":"unicorn3","x":-27,"y":105,"scaleX":0.3199999999999995,"scaleY":0.31999999999999947,"anchorX":0,"anchorY":0,"rotation":0},
            {"spriteId":"unicorn2","x":-67,"y":65,"scaleX":0.4899999999999995,"scaleY":0.48999999999999947,"anchorX":0,"anchorY":0,"rotation":0},
            {"spriteId":"unicorn","x":-109,"y":25,"scaleX":0.6599999999999997,"scaleY":0.6399999999999997,"anchorX":0,"anchorY":0,"rotation":0},
        ];

        this.applyPreset(preset)
        this.applyState(location);
    }

    private applyState(location: StoryLocation): void {
        if (location == StoryLocation.darkForest) {
            //do nothing
        } else if (location == StoryLocation.darkForest_unicorn) {
            this.unicorn.visible = true;
            // this.unicorn2.visible = true;
            // this.unicorn3.visible = true;
        }
    }

    public playAnimation(animationId: string, screen?: DialogScreen): boolean {
        if(super.playAnimation(animationId, screen)){
            //do nothing
        } else if (animationId == "unicornHide"){
            this.game.add.tween(this.unicorn).to({alpha:0}, 300, Easing.Linear.None, true, 0)
        } else if (animationId == "unicornShow"){
            this.game.add.tween(this.unicorn).to({alpha:1}, 300, Easing.Linear.None, true, 0)
        } else if (animationId == "unicornMove") {
            this.unicorn2.visible = true;
            this.unicorn3.visible = true;
            this.unicorn2.alpha = 0
            this.unicorn3.alpha = 0

            let delay = 1000;
            let duration = 500;
            this.game.add.tween(this.unicorn).to({alpha:0}, duration, Easing.Linear.None, true, delay)
            this.game.add.tween(this.unicorn2).to({alpha:0.8}, duration, Easing.Linear.None, true, delay + duration/2)
            
            this.unicorn2.alpha = 0.8
            this.game.add.tween(this.unicorn2).to({alpha:0}, duration, Easing.Linear.None, true, delay + duration * 5/2)
            this.game.add.tween(this.unicorn3).to({alpha:0.5}, duration, Easing.Linear.None, true, delay + duration * 3)

            this.unicorn3.alpha = 0.5
            this.game.add.tween(this.unicorn3).to({alpha:0}, duration, Easing.Linear.None, true, delay + duration * 9/2);

            this.unicorn2.alpha = 0
            this.unicorn3.alpha = 0

        } else if (animationId) {
            console.log("WARNING! UNKNOWN ANIMATION ID: " + animationId);
            return false;
        }

        return true;

    }

    protected attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let res = super.attachSprite(spriteId, name);
        res.visible = false;
        return res;
    }

}