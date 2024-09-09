import Label from './Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from './BasePanel';
import CellsProvider from '../../../core/service/provider/CellsProvider';
import Settings from '../../../core/service/Settings';
export default class InfoPanel extends BasePanel {

    constructor(game: Phaser.Game, x: number, y: number, texts: string[], icons: string[], disableAnimations?: boolean, smallText?: boolean) {
        super(game, x, y);

        let offsetX = 0;

        for (let i = 0; i < Math.max(texts.length, icons.length); i++) {
            if (texts.length > i) {
                let label = new Label(this.game, offsetX, 0, texts[i], disableAnimations ? Label.INFO_BLACK_STYLE : (smallText ? Label.COMMON_SMALL_STYLE : { font: "bold 70px Arial", fill:  "#00ff00"}));
                label.anchor.set(0, 0);
                this.addChild(label);
                offsetX += label.width + 5;
                if(!smallText){
                    label.strokeThickness = 4;
                    label.addStrokeColor("#064426", 0);
                }
            }

            if (icons.length > i) {
                let iconImage = icons[i];
                let moveNextImage = true;

                if(iconImage.startsWith('-')){
                    iconImage = iconImage.substring(1);
                    moveNextImage = false;
                }

                let parts = iconImage.split('|');
                let scale = 1;
                if(parts.length > 1){
                    scale = Number(parts[1]);
                    iconImage = parts[0];
                }

                let icon = SpriteUtils.createSprite(this.game, offsetX, smallText? 0 : -15 , iconImage);
                icon.anchor = new Phaser.Point(0.5, 0.5);
                icon.x += 30;
                icon.y += 84;

                if(moveNextImage){
                    offsetX += icon.width / 2 + 60;
                }

                if(parts.length == 3){
                    icon.y += Number(parts[2]);
                }
                
                // icon.x += (1 - scale)*icon.width/2;
                // icon.y += (1 - scale)*icon.height/2;
                icon.scale.set(scale, scale);
                
                this.addChild(icon);

                
            }
        }

        if (!disableAnimations) {
            let animationTime = 2500;
            this.game.add.tween(this).to({ alpha: 0, y: this.y - 900 }, animationTime, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true);

            this.game.time.events.add(animationTime + 100, this.destroy, this);
        }
    }



   

}