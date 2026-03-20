import BasePanel from '../../panel/BasePanel';
import Game from '../../../../view/game/Game';
import ColorTransitionPanel from '../../panel/ColorTransitionPanel';
import BlackPanel from '../../panel/BlackPanel';
import Label from '../../../component/panel/Label';
import DialogScreen from '../../../screen/common/DialogScreen';
import HouseScreen from '../../../screen/HouseScreen';
import SpriteUtils from '../../../../core/utils/SpriteUtils';
import BigBubblePanel from '../../dialog/BigBubblePanel';
import LocalizationService from '../../../../core/localization/LocalizationService';
export default class BaseLayout extends BasePanel {

    protected bigBubblePanel:BigBubblePanel;

    constructor(game: Phaser.Game, name: string, bgImage: string) {
        super(game, game.width / 2, game.height / 2, bgImage);
        this.name = name;

        if(this.game.height > Game.MAX_HEIGHT){
            this.scale.set(this.game.height / Game.MAX_HEIGHT)
        }

        let bg = SpriteUtils.createSprite(game, 0, 0, bgImage);
        // bg.y = (this.game.height - bg.height)/2;
        bg.anchor.set(0.5)
        this.addChild(bg);
    }

    public playAnimation(animationId: string, screen? : DialogScreen): boolean { 

        if(animationId.startsWith("stormTransition")){
            let param = animationId.indexOf("(") != -1 ? animationId.split("(")[1].split(")")[0] : "";
            let message = LocalizationService.get(param, param);
            let blackPanel = new BlackPanel(this.game);
            this.game.add.existing(blackPanel);
            blackPanel.showMessage(message, 300, 3000, Label.VIOLET_STYLE)

            if(screen && screen instanceof HouseScreen){
                this.game.time.events.add(3800, () => screen.initialize(true));
            }

        } else if(animationId.startsWith("textTransition")){
            let param = animationId.indexOf("(") != -1 ? animationId.split("(")[1].split(")")[0] : "";
            let message = LocalizationService.get(param, param);
            let blackPanel = new BlackPanel(this.game);
            this.game.add.existing(blackPanel);
            blackPanel.showMessage(message, 300, 3000)

            if(screen && screen instanceof HouseScreen){
                this.game.time.events.add(3800, () => screen.initialize(true));
            }
    
        } else if (animationId == "transition") {
            console.log("MOVED INTO HOUSE!")
            this.game.add.existing(new ColorTransitionPanel(this.game, 0x000000, 500, 0, true, true));

            if(screen && screen instanceof HouseScreen){
                this.game.time.events.add(500, () => screen.initialize(true));
            }

        } else if(animationId == "mountineVisionShow"){
            console.log("MOUNTINE VISION SHOW!")
            this.bigBubblePanel = new BigBubblePanel(this.game, 'everestSky');
            this.addChild(this.bigBubblePanel);
            this.bigBubblePanel.show(1000);
        } else if (animationId == "mountineVisionZoom"){
            if(this.bigBubblePanel) this.bigBubblePanel.zoomIn();
        } else if (animationId == "mountineVisionHide"){
            if(this.bigBubblePanel) this.bigBubblePanel.hide()
        } else if (animationId) {
            // console.log("WARNING! UNKNOWN ANIMATION ID: " + animationId);
            return false;
        }

        return true;
    }

}