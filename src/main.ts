import LocalizationService from './core/localization/LocalizationService';
import Game from './view/game/Game';

window.onload = () => {
    LocalizationService.bootstrap()
        .catch(error => {
            console.error('Localization bootstrap failed', error);
        })
        .then(() => {
            new Game();
        });
};
