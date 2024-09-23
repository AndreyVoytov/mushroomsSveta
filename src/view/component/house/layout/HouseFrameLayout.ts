import BasePanel from '../../panel/BasePanel';
import Game from '../../../game/Game';
import ColorTransitionPanel from '../../panel/ColorTransitionPanel';
import BlackPanel from '../../panel/BlackPanel';
import Label from '../../panel/Label';
import DialogScreen from '../../../screen/common/DialogScreen';
import HouseScreen from '../../../screen/HouseScreen';
import SpriteUtils from '../../../../core/utils/SpriteUtils';
import BigBubblePanel from '../../dialog/BigBubblePanel';
import { Easing } from 'phaser-ce';
export default class HouseFrameLayout extends BasePanel {

    protected bigBubblePanel:BigBubblePanel;

    constructor(game: Phaser.Game, name: string) {
        super(game, game.width / 2, game.height / 2, "houseFrameLayout");
        this.name = name;

        if(this.game.height > Game.MAX_HEIGHT){
            this.scale.set(this.game.height / Game.MAX_HEIGHT)
        }
        
        let roomScale = 0.21;

        let bg = SpriteUtils.createSprite(game, 0, 0, "forestHouseBg");
        bg.anchor.set(0.5);
        this.addChild(bg);

        let room =  SpriteUtils.createSprite(game, 349, -169, "houseBg");
        room.anchor.set(0.5);
        room.scale.set(-roomScale, roomScale);
        room.alpha = 0;
        this.addChild(room);

        let frame = SpriteUtils.createSprite(game, 349, -169, "houseFrame");
        frame.anchor.set(0.5);
        this.addChild(frame);


        let duration0 = 300;
        let delay = 1000;
        let duration = 2000;
        let duration2 = 500;


        this.game.add.tween(room).to({alpha:1}, duration0, Easing.Quadratic.Out, true, 0)
        // this.game.add.tween(frame).to({alpha:1}, duration0, Easing.Quadratic.Out, true, 0)

        this.game.add.tween(room).to({x:0, y:0}, duration, Easing.Quadratic.Out, true, delay)
        this.game.add.tween(frame).to({x:0, y:0}, duration, Easing.Quadratic.Out, true, delay)
        this.game.add.tween(bg).to({x:-349/roomScale, y:169/roomScale}, duration, Easing.Quadratic.Out, true, delay)
        
        this.game.add.tween(room.scale).to({x:-1, y:1}, duration, Easing.Quadratic.Out, true, delay)
        this.game.add.tween(bg.scale).to({x:1/roomScale, y:1/roomScale}, duration, Easing.Quadratic.Out, true, delay)
        this.game.add.tween(frame.scale).to({x:1/roomScale, y:1/roomScale}, duration, Easing.Quadratic.Out, true, delay)
        
        this.game.time.events.add(delay + duration + 100, () =>{
            bg.alpha = 0;
            bg.kill();
        });
        this.game.add.tween(frame).to({alpha: 0}, duration2, Easing.Quadratic.Out, true, delay + duration + 200)
        
        //Странный баг, room не растворяется медленно..
        this.game.add.tween(room).to({alpha: 0}, duration2, Easing.Quadratic.Out, true, delay + duration + 200 + duration2)


        this.game.time.events.add(delay + duration + 200 + duration2 + 100, () =>{
            frame.kill();
            room.kill();
        });

        // let forestHouseBg = SpriteUtils.createSprite(this.game, this.playButton.x - 70, this.playButton.y - 100, "forestHouseBg");
        // this.addSprite(forestHouseBg);

        // let houseBg = SpriteUtils.createSprite(this.game, this.playButton.x - 70, this.playButton.y - 100, "houseBg");
        // this.addSprite(houseBg);

        // let houseFrame = SpriteUtils.createSprite(this.game, this.playButton.x - 70, this.playButton.y - 100, "houseFrame");
        // this.addSprite(houseFrame);        

    }

}