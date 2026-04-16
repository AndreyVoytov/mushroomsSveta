import UserService from '../../../core/service/UserService';
import AnimationUtils from './../../../core/utils/AnimationUtils';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from '../panel/BasePanel';
import Label from '../panel/Label';
import EnergyUtils from '../../../core/utils/EnergyUtils';
import EnergyDetailsPanel from './EnergyDetailsPanel';
import LocalizationService from '../../../core/localization/LocalizationService';

export default class LifesPanel extends BasePanel {

    private lifesLabel: Label;
    private lifesStatus: Label;
    public startX: number;

    constructor(game: Phaser.Game, houseScreen: HouseScreen) {
        super(game, 60, 50, 'lifesPanel');
        this.startX = this.x;

        this.attachSprite('statusPanel');
        const lightning = this.attachSprite('lightning');
        lightning.scale.set(0.72);

        this.lifesLabel = this.attachText("lifesLabel", "" + UserService.getUser().getEnergy(), Label.PanelDigitsBrown(42));

        this.lifesStatus = this.attachText("lifesStatus", LocalizationService.get('ui.energy.full', 'FULL'), { "font": "bold 28px Arial ", "fill": "#d6b08b" });

        const plusButton = this.attachButton('plusButton', () => {
            if (houseScreen.isTasksPanelBlockingUI()) {
                return;
            }

            if (!houseScreen.lifeDetailsShown) {
                const detailsPanel = new EnergyDetailsPanel(this.game, houseScreen, {
                    onShow: () => {
                        houseScreen.hideUI(0, true);
                        houseScreen.lifeDetailsShown = true;
                    },
                    onClose: () => {
                        houseScreen.showUI(true);
                        houseScreen.lifeDetailsShown = false;
                    }
                });
                houseScreen.addPanel(detailsPanel);
                detailsPanel.show();
                AnimationUtils.jelly(game, plusButton, 0, true);
            }
        });

        this.applyPreset([
            { "spriteId": "statusPanel", "x": 127, "y": 20, "scaleX": 0.92, "scaleY": 0.95, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "lightning", "x": 0, "y": 19, "scaleX": 0.72, "scaleY": 0.72, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
            { "spriteId": "lifesLabel", "x": 97, "y": 17, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 42 },
            { "spriteId": "lifesStatus", "x": 178, "y": 20, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 28 },
            { "spriteId": "plusButton", "x": 251, "y": 19, "scaleX": 0.94, "scaleY": 0.96, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        ]);

        this.game.time.events.loop(1000, () => {
            this.updateLabels();
        });
    }

    public update(): void {
        this.updateLabels();
    }

    private updateLabels(): void {
        const user = UserService.getUser();
        const energy = user.getEnergy();

        if (energy > EnergyUtils.MAX_ENERGY) {
            this.lifesStatus.text = LocalizationService.get('ui.energy.overShort', 'OVER');
        } else if (energy >= EnergyUtils.MAX_ENERGY) {
            this.lifesStatus.text = LocalizationService.get('ui.energy.fullShort', 'FULL');
        } else {
            const remain = Math.max(0, EnergyUtils.MILLIS_FOR_ENERGY - (Date.now() - user.getLastEnergyRegenerationAt()));
            const secondsOfRemain = Math.floor(remain / 1000 % 60);
            const minutesOfRemain = Math.floor(remain / 1000 / 60);

            const secondsText = secondsOfRemain >= 10 ? "" + secondsOfRemain : "0" + secondsOfRemain;
            const minutesText = minutesOfRemain >= 10 ? "" + minutesOfRemain : "0" + minutesOfRemain;

            this.lifesStatus.text = minutesText + ":" + secondsText;
        }

        this.lifesLabel.text = "" + energy;
    }
}
