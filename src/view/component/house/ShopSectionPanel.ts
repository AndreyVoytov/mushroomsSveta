import AnimationUtils from '../../../core/utils/AnimationUtils';
import BasePanel from '../panel/BasePanel';

export default class ShopSectionPanel extends BasePanel {

    constructor(game: Phaser.Game, name: string) {
        super(game, 0, 0, name, "blank");
        this.visible = false;
    }

    public showSection(_animate?: boolean): void {
        AnimationUtils.showStable(this);
    }

    public hideSection(): void {
        this.visible = false;
    }
}
