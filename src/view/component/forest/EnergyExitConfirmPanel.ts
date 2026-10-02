import ClosablePanel from '../panel/ClosablePanel';
import LocalizationService from '../../../core/localization/LocalizationService';

export default class EnergyExitConfirmPanel extends ClosablePanel {
    private confirmed = false;

    constructor(game: Phaser.Game, private onStay: () => void, private onLeave: () => void) {
        super(game, game.width / 2, game.height / 2, false, 'energyExitConfirm');
        this.visible = false;
        this.fixedToCamera = true;

        const panel = this.attachSprite('panel');
        panel.scale.set(0.94, 0.74);
        panel.inputEnabled = true;

        const message = this.attachText('message', LocalizationService.get(
            'ui.energy.leaveWarning',
            'Leave the level without buying energy? Your progress in this level will not be saved.'
        ), { font: 'bold 36px Arial', fill: '#804119', align: 'center', wordWrap: true, wordWrapWidth: 510 });
        message.position.set(0, -98);

        const stay = this.attachButton('pnlButton', () => this.close(), 'stay');
        stay.position.set(0, 80);
        stay.scale.set(0.9);
        const stayLabel = this.attachText('stayLabel', LocalizationService.get('ui.energy.stay', 'Stay'),
            { font: 'bold 36px Gilroy', fill: '#fff8db' });
        stayLabel.position.set(0, 80);

        const leave = this.attachButton('pnlButton', () => {
            if (this.processing || this.confirmed) return;
            this.confirmed = true;
            this.close();
        }, 'leave');
        leave.position.set(0, 190);
        leave.scale.set(0.72);
        leave.tint = 0xcc7777;
        const leaveLabel = this.attachText('leaveLabel', LocalizationService.get('ui.energy.leave', 'Leave level'),
            { font: 'bold 30px Gilroy', fill: '#fff8db' });
        leaveLabel.position.set(0, 190);

        const close = this.attachButton('closeButton', () => this.close());
        close.position.set(280, -222);
    }

    protected onClose(): void {
        // Keep board input blocked until the popup has finished closing.
        this.game.time.events.add(350, () => {
            if (this.confirmed) this.onLeave();
            else this.onStay();
        });
    }
}
