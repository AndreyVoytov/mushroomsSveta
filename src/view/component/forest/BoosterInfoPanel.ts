import LocationUtils from '../../../core/utils/LocationUtils';
import ForestAim from '../../../core/model/forest/ForestAim';
import ForestType from '../../../core/model/forest/ForestType';
import Label from '../panel/Label';
import ClosablePanel from '../panel/ClosablePanel';
import ForestDao from '../../../core/dao/ForestDao';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BoosterType from '../../../core/model/enum/BoosterType';
import BasePanel from '../panel/BasePanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import NeverError from '../../../core/utils/NeverError';
import Utils from '../../../core/utils/Utils';
import User from '../../../core/model/user/User';
import UserService from '../../../core/service/UserService';
import ForestScreen from '../../screen/ForestScreen';
import { ContentType } from '../../../core/model/enum/ContentType';
import Settings from '../../../core/service/Settings';
import ServerStoreComponent from '../../../core/service/store/ServerStoreComponent';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class BoosterInfoPanel extends BasePanel {

    public boosterType: BoosterType;
    private forestType: ForestType;

    private backButton: Phaser.Button;
    private useButton: Phaser.Button;

    private fadeStripTop: Phaser.TileSprite;
    private grassStripTop: Phaser.TileSprite;
    private shadowTop: Phaser.Sprite;
    private shadowTop2: Phaser.Sprite;
    
    private fadeStripBottom: Phaser.TileSprite;
    private grassStripBottom: Phaser.TileSprite;
    private shadowBottom: Phaser.Sprite;
    private shadowBottom2: Phaser.Sprite;

    private blocker: Phaser.Graphics;
    private screen:ForestScreen;

    constructor(game: Phaser.Game, screen: ForestScreen, forestType: ForestType, boosterType: BoosterType) {
        super(game, 0, 0);
        this.game = game;
        this.screen = screen;
        this.alpha = 0;
        this.inputEnabled = false;
        this.visible = false;
        this.boosterType = boosterType;
        this.fixedToCamera = true;

        let keyAndRect = SpriteUtils.getKeyAndRect(this.game, "fadeStrip");
        let bmd = this.game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
        let bgImage = LocationUtils.getBg(forestType.environment); 
        bmd.alphaMask(SpriteUtils.createBitmapData(this.game, bgImage), SpriteUtils.createBitmapData(this.game, 'fadeStrip'));
        this.fadeStripBottom = new Phaser.TileSprite(this.game, 0, this.game.height - 515 + 370 + 56-30 -50, this.game.width, 118,  bmd);
        this.fadeStripBottom.anchor.set(0, 1)
        // this.fadeStripBottom.fixedToCamera = true;
        this.addSprite(this.fadeStripBottom);
        this.fadeStripBottom.inputEnabled = false;

        let addition = Settings.isGraphicsFromAtlases()? 12 : 0;

        this.grassStripBottom = SpriteUtils.createTileSprite(this.game, 0, this.game.height, this.game.width, this.game.height -this.fadeStripBottom.y+ addition, bgImage);
        this.grassStripBottom.anchor.set(0, 1)
        // this.grassStripBottom.fixedToCamera = true;
        this.addSprite(this.grassStripBottom);
        this.grassStripBottom.inputEnabled = false;

        this.shadowBottom = this.attachSprite("shadow", "shadowBottom")
        this.shadowBottom.inputEnabled = false;
        this.shadowBottom.anchor.set(0, 1);
        this.shadowBottom.width = this.game.width;
        this.shadowBottom.y = this.game.height;
        this.shadowBottom.height = 500;
        this.shadowBottom.alpha = 0.99
        // this.shadowBottom.fixedToCamera = true;

        this.shadowBottom2 = this.attachSprite("shadow", "shadowBottom2")
        this.shadowBottom2.inputEnabled = false;
        this.shadowBottom2.anchor.set(0, 1);
        this.shadowBottom2.width = this.game.width;
        this.shadowBottom2.y = this.game.height;
        this.shadowBottom2.height = 500;
        this.shadowBottom2.alpha = 0.99
        // this.shadowBottom2.fixedToCamera = true;

        this.fadeStripTop = new Phaser.TileSprite(this.game, 0, -(- 515 + 370 + 56-30 -50), this.game.width, 118,  bmd);
        this.fadeStripTop.anchor.set(0, 1)
        this.fadeStripTop.scale.set(1, -1)
        // this.fadeStripTop.fixedToCamera = true;
        this.addSprite(this.fadeStripTop);
        this.fadeStripTop.inputEnabled = false;

        this.grassStripTop = SpriteUtils.createTileSprite(this.game, 0, 0, this.game.width, this.fadeStripTop.y + addition, bgImage);
        this.grassStripTop.anchor.set(0, 0)
        // this.grassStripTop.fixedToCamera = true;
        this.addSprite(this.grassStripTop);
        this.grassStripTop.inputEnabled = false;
        
        this.shadowTop = this.attachSprite("shadow", "shadowTop")
        this.shadowTop.anchor.set(0, 1);
        this.shadowTop.height = 500;
        this.shadowTop.scale.set(1, -this.shadowTop.scale.y);
        this.shadowTop.width = this.game.width;
        this.shadowTop.inputEnabled = false;
        
        this.shadowTop2 = this.attachSprite("shadow", "shadowTop2")
        this.shadowTop2.anchor.set(0, 1);
        this.shadowTop2.height = 500;
        this.shadowTop2.scale.set(1, -this.shadowTop2.scale.y);
        this.shadowTop2.width = this.game.width;
        this.shadowTop2.inputEnabled = false;

        let slotOpened = this.attachSprite("slotOpened")
        slotOpened.alpha = 0.9;
        this.attachSprite(boosterType, "booster")
        this.attachSprite("decor", "decor1")
        this.attachSprite("decor", "decor2")

        let circle = this.attachSprite( "circleBoosterBlue");
        let boosterCountLabel = new Label(this.game, 0,-44, "" + UserService.getUser().getBoostersCount(boosterType), { font: "bold 40px Arial", fill: "#ffffff"});
        boosterCountLabel.name = "boosterCountLabel";
        boosterCountLabel.scale.set(2, 2)
        circle.scale.set(0.5)
        circle.addChild(boosterCountLabel);

        circle.x = 117 + 47 + 20;
        circle.y = 113 + 33 + 22;



        this.attachText("title", this.getBoosterName(boosterType), { font: "40px Times New Roman", fill: "#f8c600",  align: "center"});//fontStyle: "italic",
        this.attachText("desc", this.getBoosterDesc(boosterType), { font: "38px Times New Roman", fill: "#ffffff",  align: "center"});//fontStyle: "italic",

        
        this.attachText("action", this.getBoosterQuestion(boosterType),  { font: "bold 40px Arial", fill: "#f8c600",  align: "center"});//fontStyle: "italic",

        if(this.getActionCallback(boosterType)){
            this.blocker = new Phaser.Graphics(this.game, 0, 0);
            this.blocker.beginFill(0x000000, 1);
            this.blocker.drawRect(0, 0, this.game.width, this.game.height);
            this.blocker.endFill();
            this.blocker.alpha = 0.001;
            // this.blocker.fixedToCamera = true;
            this.addChild(this.blocker);
            this.blocker.inputEnabled = true;
            this.blocker.events.onInputDown.add(() => this.close(), this);
        }

        let clicked = false;
        let backButton = this.attachButton("pnlButton", () => {
            AnimationUtils.jelly(this.game, backButton, 0, true);
            this.close();
        }, "backButton")
        let backLabel = new Label(this.game, 0, 0, LocalizationService.get(LocalizationKey.ui('booster.back'), 'Назад'), { font: "bolder 45px Gilroy", fill: "#f0f1ec" });
        backLabel.anchor.set(0.5)
        backLabel.scale.set(1.2, 1)
        backButton.addChild(backLabel)
        backButton.tint = 0xAAAAAA;
        backButton.alpha = 1;
        backLabel.strokeThickness = 4;
        backLabel.addStrokeColor('#008600', 0);
        this.backButton = backButton;

        let useButton;
        if(this.getActionCallback(boosterType)){
            useButton = this.attachButton("pnlButton", () => {
                if(!clicked){
                    clicked = true;
                    this.game.tweens.removeFrom(useButton);
                    AnimationUtils.jelly(this.game, useButton, 0, true);
                    this.getActionCallback(boosterType)();
                }
            }, "useButton")
            let useLabel = new Label(this.game, 0, 0, LocalizationService.get(LocalizationKey.ui('booster.use'), 'Применить'), { font: "bolder 45px Gilroy", fill: "#f0f1ec" });
            useLabel.scale.set(1.2 * 1.2, 1 * 1.2)
            useLabel.anchor.set(0.5)
            useButton.addChild(useLabel)
            useLabel.strokeThickness = 4;
            useLabel.addStrokeColor('#008600', 0);
            this.useButton = useButton;
        }
        

       this.game.time.events.add(50, () => {this.show()})

        this.applyPreset([
            {"spriteId":"shadowTop","x":0,"y":1603,"scaleX":960/100,"scaleY":4.310344827586207/2,"anchorX":0,"anchorY":1,"rotation":0},
            {"spriteId":"shadowTop2","x":0,"y":1603,"scaleX":960/100,"scaleY":4.310344827586207/2,"anchorX":0,"anchorY":1,"rotation":0},
            {"spriteId":"shadowTop","x":0,"y":0,"scaleX":960/100,"scaleY":-4.310344827586207/2,"anchorX":0,"anchorY":1,"rotation":0},
            {"spriteId":"shadowTop2","x":0,"y":0,"scaleX":960/100,"scaleY":-4.310344827586207/2,"anchorX":0,"anchorY":1,"rotation":0},
            {"spriteId":"slotOpened","x":117.51724137931033,"y":112.6074380165289,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"booster","x":117.58620689655173,"y":113.52789256198346,"scaleX":1.3000000000000003,"scaleY":1.3800000000000003,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"decor1","x":875,"y":61,"scaleX":1.7400000000000007,"scaleY":1.7400000000000007,"anchorX":0.5,"anchorY":0.5,"rotation":1.6000000000000008},
            {"spriteId":"decor2","x":279.82758620689657,"y":54.34400826446282,"scaleX":1.7400000000000007,"scaleY":1.7400000000000007,"anchorX":0.5,"anchorY":0.5,"rotation":4.680000000000009},
            {"spriteId":"title","x":576.1379310344827,"y":58.03202479338843,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40},
            {"spriteId":"desc","x":581.8275862068965,"y":140.37603305785126,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":35},
            {"spriteId":"action","x":478.344827586207,"y":this.game.height - 1603 + 1449.2086776859505,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0,"fontSize":40},
            {"spriteId":"backButton","x":642.2413793103448,"y":this.game.height - 1603 + 1540.6962809917354,"scaleX":0.6399999999999997,"scaleY":0.7399999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0},
            {"spriteId":"useButton","x":331.1379310344828,"y":this.game.height - 1603 + 1540.728305785124,"scaleX":0.5999999999999996,"scaleY":0.7599999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0}
        ])

        if(!this.getActionCallback(boosterType)){
            Utils.applyPreset(backButton, {"spriteId":"backButton","x":this.game.width/2,"y":this.game.height - 1603 +1540.728305785124,"scaleX":0.5999999999999996,"scaleY":0.7599999999999998,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        } else {
            AnimationUtils.wiggle(this.game, useButton, 1000);
        }
    }

    private getBoosterName(boosterType:BoosterType):string{
        switch(boosterType){
            case BoosterType.beans:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'name'), 'Волшебные бобы');
            case BoosterType.rainbow:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'name'), 'Флакон радуги');
            case BoosterType.glove:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'name'), 'Волшебная перчатка');
            case BoosterType.compass:
            case BoosterType.rocket:
            case BoosterType.vision:
                break;
            default:
                throw new NeverError(boosterType);
        }
    }
    private getBoosterDesc(boosterType:BoosterType):string{
        switch(boosterType){
            case BoosterType.beans:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'desc'), '\u0417\u0430\u043f\u043e\u043b\u043d\u044f\u044e\u0442 \u043f\u0443\u0441\u0442\u044b\u0435 \u043a\u043b\u0435\u0442\u043a\u0438\n\u0440\u043e\u0441\u0442\u043a\u0430\u043c\u0438 \u0441 \u0446\u0438\u0444\u0440\u043e\u0439.')
            case BoosterType.rainbow:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'desc'), '\u0412\u0441\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u043f\u044f\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u044b\u0445 \u043a\u043b\u0435\u0442\u043e\u043a\n\u043d\u0430 \u043f\u043e\u043b\u0435.')
            case BoosterType.glove:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'desc'), '\u041f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0432\u0441\u043a\u0440\u044b\u0442\u044c \u043b\u044e\u0431\u0443\u044e \u043a\u043b\u0435\u0442\u043a\u0443\n\u0431\u0435\u0437 \u0442\u0440\u0430\u0442\u044b \u0445\u043e\u0434\u0430.')
            case BoosterType.compass:
            case BoosterType.rocket:
            case BoosterType.vision:
                return "";
            default:
                throw new NeverError(boosterType);
        }
    }
    private getBoosterQuestion(boosterType:BoosterType):string{
        switch(boosterType){
            case BoosterType.beans:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'question'), '\u0412\u044b \u0442\u043e\u0447\u043d\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u043f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u0431\u043e\u0431\u044b?')
            case BoosterType.rainbow:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'question'), '\u0412\u044b \u0442\u043e\u0447\u043d\u043e \u0445\u043e\u0442\u0438\u0442\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0444\u043b\u0430\u043a\u043e\u043d?')
            case BoosterType.glove:
                return LocalizationService.get(LocalizationKey.booster(boosterType, 'question'), '\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u043a\u043b\u0435\u0442\u043a\u0443 \u0434\u043b\u044f \u0432\u0441\u043a\u0440\u044b\u0442\u0438\u044f')
            case BoosterType.compass:
            case BoosterType.rocket:
            case BoosterType.vision:
                return "";
            default:
                throw new NeverError(boosterType);
        }
    }

    private getActionCallback(boosterType:BoosterType):()=>void{
        switch(boosterType){
            case BoosterType.beans:
                return () => {
                    this.close();
                    this.screen.useBeans();
                    let user = UserService.getUser();
                    user.setSpendOnLevel(user.getCurrentForest() + 1);
                };
            case BoosterType.rainbow:
                return () => {
                    this.close();
                    this.screen.useRainbow();
                    let user = UserService.getUser();
                    user.setSpendOnLevel(user.getCurrentForest() + 1);
                };
            case BoosterType.glove:
                return null;
            case BoosterType.compass:
            case BoosterType.rocket:
            case BoosterType.vision:
                return null;
            default:
                throw new NeverError(boosterType);
        }
    }

    public show(): void {
        this.visible = true;
        AnimationUtils.fadeIn(this.game, this);
    }

    public close(): void {
        this.screen.boosterInfoPanel = null;
        this.backButton.inputEnabled = false;
        if(this.useButton) this.useButton.inputEnabled = false;
        AnimationUtils.fadeOut(this.game, this);
        this.game.time.events.add(700, () => {
            this.destroy(true);
        })
    }
    
}
