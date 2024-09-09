import BasePanel from '../panel/BasePanel';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class BigBubblePanel extends BasePanel {

    // private point1: Phaser.Sprite;
    // private point2: Phaser.Sprite;
    private cloud: Phaser.Sprite;
    private innerItem: Phaser.Sprite;
    private innerBg: Phaser.Sprite;

    private blackTransparent: Phaser.Graphics;

    private cloud1: Phaser.Sprite;
    private cloud2: Phaser.Sprite;
    private cloud3: Phaser.Sprite;
    private cloud4: Phaser.Sprite;

    private vedmaEverest: Phaser.Sprite;

    constructor(game: Phaser.Game, innerItem: string) {
        super(game, 0, -150);

        this.blackTransparent = new Phaser.Graphics(this.game, -game.width/2-this.x, -game.height/2-this.y);
        this.blackTransparent.beginFill(0x000000, 1);
        this.blackTransparent.drawRect(0, 0, this.game.width, this.game.height);
        this.blackTransparent.endFill();
        this.blackTransparent.alpha = 0;
        this.blackTransparent.inputEnabled = false;
        this.blackTransparent.fixedToCamera = true;
        this.addChild(this.blackTransparent);

        this.cloud1 = this.attachSprite("cloud", "cloud1")
        this.cloud2 = this.attachSprite("cloud", "cloud2")
        this.cloud3 = this.attachSprite("cloud", "cloud3")
        this.cloud4 = this.attachSprite("cloud", "cloud4")

        this.innerBg = this.attachSprite(innerItem, "innerBg")
        this.innerItem = this.attachSprite("everest", "innerItem")
        this.cloud = this.attachSprite("cloudBig")


        this.vedmaEverest = SpriteUtils.createSprite(game, -5, 50, "vedmaEverest")
        this.vedmaEverest.anchor.set(0.5, 1);
        this.vedmaEverest.scale.set(0.13);
        this.innerItem.addChild(this.vedmaEverest);
        this.vedmaEverest.alpha = 0;


        // this.cloud.visible = false
        // this.cloud1.visible = false
        // this.cloud2.visible = false
        // this.cloud3.visible = false
        // this.cloud4.visible = false
        
        var mask = game.add.graphics(game.width/2, game.height/2);
        mask.beginFill(0xffffff);
        mask.drawEllipse(this.x, this.y, 380, 310);
        this.innerItem.mask = mask;
    

        // let keyAndRect = SpriteUtils.getKeyAndRect(game, );
        // let bmd = game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);
        // bmd.alphaMask(SpriteUtils.createBitmapData(game, recipeContent.characterOverPicture), SpriteUtils.createBitmapData(game, recipeContent.picture));
        
        // let character = new Phaser.Sprite(this.game, center.x, center.y, bmd);
        // character.anchor.set(0.5);
        // this.addSprite(character);
        
        

        // this.point1 = this.attachSprite("point", "point1")
        // this.point2 = this.attachSprite("point", "point2")

        this.alpha = 0;

        this.applyPreset([{ "spriteId": "cloudBig", "x": 0, "y": 0, "scaleX": 2.6, "scaleY": 2.6, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "innerItem", "x": 0, "y": 0, "scaleX": 1.30, "scaleY": 1.30, "anchorX": 0.55, "anchorY": 0.1, "rotation": 0 },
        { "spriteId": "innerBg", "x": 0, "y": 0, "scaleX": 1.30, "scaleY": 1.30, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "point1", "x": -300, "y": 185 , "scaleX": 0.6399999999999998, "scaleY": 0.5999999999999996, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        // { "spriteId": "point2", "x": -292, "y": 150, "scaleX": 0.9, "scaleY": 0.9, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }
        ])

        this.innerItem.y -= this.innerItem.height * 0.4;
        this.innerItem.x += this.innerItem.width * 0.05;

        this.cloud1.x -= this.innerBg.width/3.5;
        this.cloud1.y += this.innerBg.height/3.5 - 35;

        this.cloud2.x -= this.innerBg.width/3.5;
        this.cloud2.y -= this.innerBg.height/3.5 - 35;

        this.cloud3.x += this.innerBg.width/3.5;
        this.cloud3.y += this.innerBg.height/3.5 - 35;

        this.cloud4.x += this.innerBg.width/3.5;
        this.cloud4.y -= this.innerBg.height/3.5 - 35;
    }


    public zoomIn(){
        this.game.add.tween(this.innerItem.scale).to({ x: 10, y:10 }, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.InOut, true, 500, 0, false);
        this.game.add.tween(this.vedmaEverest).to({ alpha:1 }, 1500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 500, 0, false);
    }

    public show(delay?: number) {
        this.game.add.tween(this.blackTransparent).to({ alpha: 0.5 }, 500, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.Out, true, 0, 0, false);

        this.alpha = 1;

        // if (this.scale.x < 0) {
        //     this.applyPreset([{ "spriteId": "innerItem", "x": 7, "y": 66, "scaleX": -1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.8, "rotation": 0.12 }])
        // }

        delay = delay || 0;

        let appearingTime = 1250;


        AnimationUtils.floating(this.game, this.cloud, appearingTime + delay, false, 3)
        // AnimationUtils.floating(this.game, this.innerItem, appearingTime + delay, false, 3 )

        AnimationUtils.floating(this.game, this.innerBg, appearingTime + delay, false, 3 )
        // AnimationUtils.floating2(this.game, this.point1, 2000 + appearingTime + delay)
        // AnimationUtils.floating2(this.game, this.point2, 1000 + appearingTime + delay)
        // AnimationUtils.wiggle2(this.game, this.innerItem, appearingTime + delay)

        // AnimationUtils.appear2(this.game, this.point1, delay)
        // AnimationUtils.appear2(this.game, this.point2, 100 + delay)
        AnimationUtils.appear2(this.game, this.cloud, 200 + delay, 2)
        AnimationUtils.appear2(this.game, this.innerItem, 200 + delay)
        AnimationUtils.appear2(this.game, this.innerBg, 200 + delay)
        // AnimationUtils.appear2(this.game, this.innerItem, 400 + delay)

        AnimationUtils.floating(this.game, this.cloud1, appearingTime + delay)
        AnimationUtils.floating(this.game, this.cloud2, appearingTime + delay  +30)
        AnimationUtils.floating(this.game, this.cloud3, appearingTime + delay  +40)
        AnimationUtils.floating(this.game, this.cloud4, appearingTime + delay  +20)

        AnimationUtils.appear2(this.game, this.cloud3, 200 + delay, 2)
        AnimationUtils.appear2(this.game, this.cloud4, 230 + delay, 2)
        AnimationUtils.appear2(this.game, this.cloud2, 240 + delay, 2)
        AnimationUtils.appear2(this.game, this.cloud1, 220 + delay, 2)

        // AnimationUtils.moveFrom(this.game, this.point1, -20, 40, delay)
        // AnimationUtils.moveFrom(this.game, this.point2, -15, 20, 100 + delay)
        // AnimationUtils.moveFrom(this.game, this.cloud, -30, 30, 150 + delay)
        // AnimationUtils.moveFrom(this.game, this.innerItem, -30, 30, 150 + delay)


        this.cloud.scale.set(0);
        this.innerItem.scale.set(0);
        this.innerBg.scale.set(0);
        // this.point1.scale.set(0);
        // this.point2.scale.set(0);

    }
    public hide(delay?: number) {


        // this.game.tweens.removeFrom(this.point1)
        // this.game.tweens.removeFrom(this.point2)
        this.game.tweens.removeFrom(this.cloud)
        this.game.tweens.removeFrom(this.innerItem)
        this.game.tweens.removeFrom(this.innerBg)
        // AnimationUtils.fadeOut(this.game, this.point1, delay)
        // AnimationUtils.fadeOut(this.game, this.point2, 100 + delay)
        AnimationUtils.fadeOut(this.game, this.cloud, 200 + delay)
        AnimationUtils.fadeOut(this.game, this.innerItem, 200 + delay)
        AnimationUtils.fadeOut(this.game, this.innerBg, 200 + delay)
        // AnimationUtils.disappear(this.game, this.point1, delay)
        // AnimationUtils.disappear(this.game, this.point2, 100 + delay)
        AnimationUtils.disappear(this.game, this.cloud, 200 + delay)
        AnimationUtils.disappear(this.game, this.cloud1, 200 + delay)
        AnimationUtils.disappear(this.game, this.cloud2, 200 + delay)
        AnimationUtils.disappear(this.game, this.cloud3, 200 + delay)
        AnimationUtils.disappear(this.game, this.cloud4, 200 + delay)
        AnimationUtils.disappear(this.game, this.innerItem, 100 + delay)
        AnimationUtils.disappear(this.game, this.innerBg, 100 + delay)

        this.game.tweens.removeFrom(this.blackTransparent);
        this.game.tweens.removeFrom(this);
        this.game.add.tween(this.blackTransparent).to({ alpha: 0 }, 200, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 0, 0, false);
        this.game.time.events.add(250, function () {
            this.blackTransparent.inputEnabled = false;
        }, this);

    }
}