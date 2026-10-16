import ClosablePanel from '../panel/ClosablePanel';
import Label from '../panel/Label';
import SoundUtils from '../../../core/utils/SoundUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import UiLayout from '../../../core/utils/UiLayout';

export interface BuyConfirmRewardOptions {
    bunchBuy?: boolean;
    rewardIconKey?: string;
    rewardIconScale?: number;
    actionCallback?: () => void;
}

export default class BuyConfirmPanel extends ClosablePanel {
    private actionButton: Phaser.Button;

    constructor(game: Phaser.Game, header: string, actionName: string, text: string, visualOptions?: boolean | BuyConfirmRewardOptions) {
        super(game, game.width / 2, game.height / 2, true, 'blank');
        const options: BuyConfirmRewardOptions = typeof visualOptions === 'boolean'
            ? { bunchBuy: visualOptions } : (visualOptions || {});
        this.visible = false;this.fixedToCamera = true;
        const board = this.attachSprite('panel2', 'panel');
        board.position.set(0, 30);board.width = 820;board.height = 640;board.inputEnabled = true;
        const title = this.attachText('title', header, {font:'44px Lora',fill:'#132c28',align:'center'});
        title.position.set(0, -200);UiLayout.fit(title, 600, 64, true);
        const close = this.attachButton('closeButton', () => this.close());
        close.position.set(330, -220);close.width = close.height = 64;
        const medallion = this.attachSprite('dialogMedallion', 'rewardFrame');
        medallion.position.set(0, -85);medallion.width = medallion.height = 178;
        const reward = this.attachSprite(options.rewardIconKey || (options.bunchBuy ? 'chest1' : 'chest4'), 'rewardIcon');
        reward.position.set(0, -85);SpriteUtils.fitIcon(reward, 142, 142);
        const body = this.attachText('textLabel', text, {font:'36px Manrope',fill:Label.INK,align:'center'});
        body.position.set(0, 60);UiLayout.fit(body, 600, 160, true);
        this.actionButton = this.attachButton('uiSecondaryControl', () => {
            this.close();
            if (options.actionCallback) this.game.time.events.add(220, () => options.actionCallback());
        }, 'actionButton');
        this.actionButton.position.set(0, 260);this.actionButton.width = 410;this.actionButton.height = 88;
        const caption = this.attachText('continueLabel', actionName, {font:'38px Manrope',fill:Label.INK});
        caption.position.set(0, 260);UiLayout.fit(caption, 330, 58);caption.inputEnabled = false;
    }

    protected onShow() {
        SoundUtils.successfulBuy();
    }
}
