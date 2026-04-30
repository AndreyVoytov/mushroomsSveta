import ClosablePanel from '../panel/ClosablePanel';
// import Game from '../../game/Game';
import Label from '../panel/Label';
import SoundUtils from '../../../core/utils/SoundUtils';

export interface BuyConfirmRewardOptions {
    bunchBuy?: boolean;
    rewardIconKey?: string;
    rewardIconScale?: number;
    actionCallback?: () => void;
}

export default class BuyConfirmPanel extends ClosablePanel {

    private actionButton:Phaser.Button;

    constructor(game: Phaser.Game, header: string, actionName: string,  text:string, visualOptions?: boolean | BuyConfirmRewardOptions) {
        super(game, game.width/2, game.height/2, true, "blank");
        const options: BuyConfirmRewardOptions = typeof visualOptions == 'boolean'
            ? { bunchBuy: visualOptions }
            : (visualOptions || {});

        this.visible = false;
        this.fixedToCamera = true;

        this.attachSprite('bushes', 'bushes1')
        this.attachSprite('bushes', 'bushes2')
        let panel = this.attachSprite('panel2', 'panel');
        panel.inputEnabled = true;

        let helperPanel =  this.attachSprite("helperPanel")

        let rewardBg: Phaser.Sprite;
        let rewardSplash: Phaser.Sprite;
        let rewardIcon: Phaser.Sprite;
        if (options.rewardIconKey) {
            rewardBg = this.attachSprite('shopItemBg', 'rewardBg');
            rewardSplash = this.attachSprite('splashY', 'rewardSplash');
            rewardIcon = this.attachSprite(options.rewardIconKey, 'rewardIcon');
        } else if(options.bunchBuy){
            this.attachSprite('chest1')
        } else {
            this.attachSprite('chest4')
            this.attachSprite('chest4cap')
        }
        this.attachSprite('ribbon')
        let closeButton = this.attachButton('closeButtonViolet', () => this.close())

        let label = this.attachText("levelLabel", header, { font: "46px Bookman Old Style", fill: "#ffffff" })
        // label.strokeThickness = 4;
        // label.addStrokeColor("#b6691b", 0);


        let labelText = this.attachText("textLabel", text, { font: "bold 45px Arial", fill: "#804119", align:"center" })
        labelText.alpha = 0.8;

        this.actionButton = this.attachButton("pnlButton", () => {
            this.close();
            if (options.actionCallback) {
                this.game.time.events.add(220, () => options.actionCallback());
            }
        }, "actionButton");

        let continueLabel = new Label(this.game, 0, 0, actionName, { font: "bolder 60px Gilroy", fill: "#f0f1ec" });
        continueLabel.name = 'continueLabel';
        continueLabel.anchor = new Phaser.Point(0.5, 0.5);
        continueLabel.strokeThickness = 4;
        continueLabel.addStrokeColor('#61b019', 0);
        this.actionButton.addChild(continueLabel);

        this.applyPreset([{"spriteId":"panel","x":0,"y":-308.5,"scaleX":1.04,"scaleY":0.8,"anchorX":0.5,"anchorY":0,"rotation":0},
{"spriteId":"helperPanel","x":0,"y":-73,"scaleX":1.0139999999999998,"scaleY":0.8199999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
{"spriteId":"ribbon","x":1,"y":-209,"scaleX":1.02,"scaleY":1.2600000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":-3.469446951953614e-18},
{"spriteId":"bushes1","x":-91.27586206896547,"y":-394.83987603305786,"scaleX":1.04/1.5,"scaleY":-1.1400000000000012/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":-1.5500000000000012},
{"spriteId":"bushes2","x":83,"y":-392,"scaleX":1/1.5,"scaleY":1.1600000000000001/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":-1.6000000000000012},
{"spriteId":"chest1","x":-5.896551724137964,"y":-350.16632231404964,"scaleX":1.7400000000000007,"scaleY":1.5800000000000005,"anchorX":0.5,"anchorY":0.5,"rotation":0.03},
{"spriteId":"chest4","x":-11,"y":-353,"scaleX":2.000000000000001,"scaleY":2.020000000000001,"anchorX":0.5,"anchorY":0.5,"rotation":0},
{"spriteId":"chest4cap","x":-5,"y":-431,"scaleX":2.040000000000001,"scaleY":1.9200000000000008,"anchorX":0.5,"anchorY":0.5,"rotation":0},
{"spriteId":"closeButtonViolet","x":308,"y":-244,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
{"spriteId":"levelLabel","x":0,"y":-234,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":46},
{"spriteId":"textLabel","x":6,"y":-83,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":45},
{"spriteId":"actionButton","x":0,"y":98,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}])

        if (rewardBg && rewardSplash && rewardIcon) {
            rewardBg.x = -6;
            rewardBg.y = -357;
            rewardBg.scale.set(1.56);
            rewardBg.alpha = 0.92;

            rewardSplash.x = -6;
            rewardSplash.y = -357;
            rewardSplash.scale.set(1.35);
            rewardSplash.alpha = 0.78;

            rewardIcon.x = -6;
            rewardIcon.y = -349;
            rewardIcon.scale.set(options.rewardIconScale || 1.45);

            this.game.add.tween(rewardBg).to({ angle: 360 }, 40000, Phaser.Easing.Linear.None, true, 0, -1, false);
        }

        // if(panel){
        //     panel.scale.set(panel.scale.x * 1.3, panel.scale.y)
        //     helperPanel.scale.set(helperPanel.scale.x * 1.3, helperPanel.scale.y)
        //     closeButton.x += 80;
        // }
    }

    // protected onClose() {
    //     this.screen.showUI();
    // }

    protected onShow() {
        SoundUtils.successfulBuy();
    }
};
