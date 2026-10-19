import ClosablePanel from '../panel/ClosablePanel';
import SoundUtils from '../../../core/utils/SoundUtils';
import BaseForestScreen from '../../screen/BaseForestScreen';
import ConfirmPanel from '../house/ConfirmPanel';
import Settings from '../../../core/service/Settings';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Game from '../../game/Game';
import GameText from '../../../core/localization/GameText';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
import UiLayout from '../../../core/utils/UiLayout';

export default class InGameSettingsPanel extends ClosablePanel {
    public static shown: boolean = false;
    private settingsButton: Phaser.Button;
    private gear: Phaser.Button;
    private actions: Phaser.Button[] = [];
    private afterClose: () => void;
    private transition: number = 0;

    constructor(game: Phaser.Game, screen: BaseForestScreen, settingsButton: Phaser.Button) {
        super(game, 0, 0, true, 'settings', 1, true);
        this.settingsButton = settingsButton;
        this.fixedToCamera = true;
        this.visible = false;
        this.gear = this.attachButton('settingsMain', () => this.close(), 'settingsGear');
        this.gear.position.set(settingsButton.x, settingsButton.y);
        this.gear.scale.copyFrom(settingsButton.scale);
        UiLayout.touchTarget(this.gear);
        const supportText = LocalizationService.get(LocalizationKey.ui('settings.support'));
        const support = this.attachButton('support', () => this.closeTo(() => {
            const info = new ConfirmPanel(game, supportText,
                LocalizationService.get(LocalizationKey.ui('ok')), GameText.supportMessage(Settings.SUPPORT_MAIL));
            game.add.existing(info);
            info.show();
        }), 'support');
        const sound = this.attachButton(Game.SOUND_ENABLED ? 'sound1' : 'sound2', () => {
            if (this.processing || !this.opened) return;
            if (Game.SOUND_ENABLED) SoundUtils.disableSound();
            else { SoundUtils.enableSound();SoundUtils.simpleCellOpen(); }
            const texture = SpriteUtils.getAtlasKeyAndFrame(game, Game.SOUND_ENABLED ? 'sound1' : 'sound2');
            sound.loadTexture(texture.atlasKey, texture.frameName);
            SpriteUtils.fitIcon(sound, 82, 82);
        }, 'sound');
        const exit = this.attachButton('turnOff', () => this.closeTo(() => screen.confirmPanel.show()), 'exit');
        this.actions = [support, sound, exit];
        this.actions.forEach((button, index) => {
            SpriteUtils.fitIcon(button, 82, 82);
            button.position.set(settingsButton.x, settingsButton.y - (index + 1) * 112);
            UiLayout.touchTarget(button, 96, 96);
        });
    }

    public show(): void {
        if (this.processing || this.opened) return;
        const version = ++this.transition;
        this.opened = true;
        this.processing = true;
        InGameSettingsPanel.shown = true;
        this.visible = true;
        this.alpha = 1;
        this.scale.set(1);
        this.settingsButton.visible = false;
        this.gear.angle = this.settingsButton.angle;
        this.game.tweens.removeFrom(this.gear);
        this.game.add.tween(this.gear).to({angle: this.gear.angle - 120}, 260, Phaser.Easing.Sinusoidal.InOut, true);
        this.blackTransparent.alpha = 0.35;
        this.blackTransparent.inputEnabled = true;
        this.blackTransparent.events.onInputDown.removeAll();
        this.blackTransparent.events.onInputDown.add(() => this.close());
        this.actions.forEach((button, index) => {
            this.game.tweens.removeFrom(button);
            button.y = this.settingsButton.y;
            button.alpha = 0;
            this.game.add.tween(button).to({y: this.settingsButton.y - (index + 1) * 112, alpha: 1},
                220, Phaser.Easing.Quadratic.Out, true, index * 35);
        });
        this.bringToTop();
        this.game.time.events.add(310, () => { if (version === this.transition) this.processing = false; });
        SoundUtils.panelOpen();
    }

    private closeTo(callback: () => void): void {
        if (this.processing || !this.opened) return;
        this.afterClose = callback;
        this.close();
    }

    public close(): void {
        if (this.processing || !this.opened) return;
        const version = ++this.transition;
        this.opened = false;
        this.processing = true;
        this.actions.forEach(button => {
            this.game.tweens.removeFrom(button);
            this.game.add.tween(button).to({y: this.settingsButton.y, alpha: 0}, 180, Phaser.Easing.Quadratic.In, true);
        });
        this.game.tweens.removeFrom(this.gear);
        this.game.add.tween(this.gear).to({angle: this.gear.angle + 120}, 180, Phaser.Easing.Sinusoidal.InOut, true);
        this.game.time.events.add(190, () => {
            if (version !== this.transition) return;
            this.visible = false;
            this.blackTransparent.alpha = 0;
            this.blackTransparent.inputEnabled = false;
            this.settingsButton.angle = this.gear.angle % 360;
            this.settingsButton.visible = true;
            this.processing = false;
            InGameSettingsPanel.shown = false;
            const callback = this.afterClose;
            this.afterClose = null;
            if (callback) callback();
        });
        SoundUtils.panelClose();
    }
}
