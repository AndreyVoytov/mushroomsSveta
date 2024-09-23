import Label from './Label';
import Settings from '../../../core/service/Settings';
import Game from '../../game/Game';
export default class LogPanel extends Label {

    constructor(text:string, x?:number, y?:number) {
        super(Game.getInstance(), x == undefined? Game.getInstance().width/2 : x, y == undefined? Game.getInstance().height/2 : y, text, 
        { font: "bold 45px BalsamiqSansBold ", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800, align:"center" });

        this.anchor.set(0.5);
        this.strokeThickness = 5;
        this.addStrokeColor("#000000", 0);

        let animationTime = 3500;
        this.game.add.tween(this).to({ alpha: 0, y: this.y - 900 }, animationTime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true);
        this.game.time.events.add(animationTime + 100, this.destroy, this);
    }



   

}