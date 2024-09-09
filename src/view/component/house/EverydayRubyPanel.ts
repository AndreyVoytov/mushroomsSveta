import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import UserService from '../../../core/service/UserService';

export default class EverydayRubyPanel extends ClosablePanel {

    private actionButton:Phaser.Button;

    public static RUBIES_COUNT = 50;

    constructor(game: Phaser.Game) {
        super(game, game.width/2, game.height/2, true, "blank");

        let header = "Ежедневный подарок";
        let actionName = "Ок";
        let text = "Вы получаете \n ~" + EverydayRubyPanel.RUBIES_COUNT + " самоцветов~";

        this.visible = false;
        this.fixedToCamera = true;

        let panel = this.attachSprite('panel2', 'panel');
        panel.inputEnabled = true;

        let helperPanel =  this.attachSprite("helperPanel")

        this.attachSprite('ribbon')
        this.attachSprite('gems')
        this.attachSprite('gems', 'gems2')
        this.attachSprite('gems', 'gems3')
        let closeButton = this.attachButton('closeButtonViolet', () => this.close())

        let label = this.attachText("levelLabel", header, { font: "46px Bookman Old Style", fill: "#ffffff" })

        let labelText = this.attachText("textLabel", text, { font: "bold 45px Arial", fill: "#804119", align:"center" })
        labelText.alpha = 0.8;

        this.actionButton = this.attachButton("pnlButton", () => {
            UserService.getUser().tryGiveEverydayGems(this.game);

            this.close();
        }, "actionButton");

        let continueLabel = new Label(this.game, 0, 0, actionName, { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);

        this.applyPreset([{"spriteId":"panel","x":0,"y":-308.5,"scaleX":1.04,"scaleY":0.8,"anchorX":0.5,"anchorY":0,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":-73,"scaleX":1.0139999999999998,"scaleY":0.8199999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"ribbon","x":1,"y":-206,"scaleX":1.02,"scaleY":1.2600000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":-3.469446951953614e-18},
        {"spriteId":"gems","x":-128,"y":-345,"scaleX":1.4200000000000006/ 1.5,"scaleY":1.4200000000000004/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":-0.4900000000000002},
        {"spriteId":"gems2","x":115,"y":-344,"scaleX":1.4400000000000004/ 1.5,"scaleY":1.4400000000000004/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0.6700000000000004},
        {"spriteId":"gems3","x":-4.86206896551721,"y":-354.8543388429752,"scaleX":2.100000000000001/ 1.5,"scaleY":2.040000000000001/ 1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButtonViolet","x":309,"y":-238,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"levelLabel","x":0,"y":-231,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
        {"spriteId":"textLabel","x":6,"y":-83,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
        {"spriteId":"actionButton","x":0,"y":98,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])

    }

    protected onClose() { 
        AnimationUtils.heartsBurst(this.game, this.actionButton.x + this.x, this.actionButton.y + this.y, 0, "gems");
    }

};