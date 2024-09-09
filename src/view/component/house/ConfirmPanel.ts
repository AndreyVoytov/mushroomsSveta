import ClosablePanel from '../panel/ClosablePanel';
// import Game from '../../game/Game';
import Label from '../panel/Label';
import InGameSettingsPanel from './../forest/InGameSettingsPanel';
import SettingsPanel from './SettingsPanel';

export default class ConfirmPanel extends ClosablePanel {

    private actionButton:Phaser.Button;

    constructor(game: Phaser.Game, header: string, actionName: string,  text:string, actionCallback?:()=>void, big?:boolean) {
        super(game, game.width/2, game.height/2, true, "blank");

        this.visible = false;
        this.fixedToCamera = true;

        let panel = this.attachSprite(big? "panel" : 'panel2', 'panel');
        panel.inputEnabled = true;

        let helperPanel =  this.attachSprite("helperPanel")

        let closeButton = this.attachButton('closeButton', () => this.close())

        let label = this.attachText("levelLabel", header, big? { font: "bold 40px Gilroy", fill: "#ffffff", align:"center" } : { font: "bold 50px Gilroy", fill: "#ffffff", align:"center" })
        label.strokeThickness = 4;
        label.addStrokeColor("#b6691b", 0);


        let labelText = this.attachText("textLabel", text, big? { font: "bold 31px Arial", fill: "#804119", align:"center" } : { font: "bold 45px Arial", fill: "#804119", align:"center" }, true)
        labelText.alpha = 0.8;

        this.actionButton = this.attachButton("pnlButton", () => {
            if(actionCallback){
                actionCallback();
            }
            this.close();
        }, "actionButton");

        let continueLabel = new Label(this.game, 0, 0, actionName, { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);

        this.applyPreset([
        {"spriteId":"panel","x":0,"y":-308.5,"scaleX":0.83,"scaleY":0.8,"anchorX":0.5,"anchorY":0,"rotation":0},
        {"spriteId":"helperPanel","x":0,"y":-73,"scaleX":0.81,"scaleY": 0.8199999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"closeButton","x":240,"y":-244,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
        {"spriteId":"levelLabel","x":0,"y":-239,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":50},
        {"spriteId":"textLabel","x":6,"y":-83,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
        {"spriteId":"actionButton","x":0,"y": 98,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}
        ])
        

        if(panel){
            panel.scale.set(panel.scale.x * 1.3, panel.scale.y)
            helperPanel.scale.set(helperPanel.scale.x * 1.3, helperPanel.scale.y)
            closeButton.x += 80;
        }

        if(big){
            closeButton.x += 65;
            closeButton.y += 8;
            helperPanel.scale.set(helperPanel.scale.x, 1.5);
            helperPanel.y += 80 + 70;
            this.actionButton.y += 160 + 160;
            labelText.y += 110 + 60;
            panel.scale.set(panel.scale.x/0.8, panel.scale.y/0.8);
            helperPanel.scale.set(helperPanel.scale.x/0.8, helperPanel.scale.y/0.7)
        }
    }

    protected onClose() {
        this.game.time.events.add(200, () => {
           InGameSettingsPanel.shown = false;
        })
    }

    protected onShow() {
        this.game.time.events.add(210, () => {
            InGameSettingsPanel.shown = true;
        })
    }
};