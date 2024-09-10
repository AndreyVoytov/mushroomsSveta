
import Game from './../../../view/game/Game';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import BasePanel from './BasePanel';
import DebugScreen from '../../screen/common/DebugScreen';
import TreesPart from './TreesPart';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import Label from './Label';
import SoundUtils from '../../../core/utils/SoundUtils';
import Settings from '../../../core/service/Settings';
import { Easing } from 'phaser-ce';
export default class TreesTransitionPanel extends BasePanel {
    private tree1: Phaser.Sprite;
    private tree2: Phaser.Sprite;
    private tree3: Phaser.Sprite;
    private tree4: Phaser.Sprite;

    constructor(game: Phaser.Game, from: boolean, time: number, delay: number) {
        super(game, 0, 0);
        this.game = game;

        if(time != 0) time = 400;

        let g = new Phaser.Graphics(this.game, 0, 0);
        g.beginFill(0x23520d, 1);
        g.drawRect(0, 0, this.game.width, this.game.height);
        g.endFill();
        g.alpha = 0;
        g.inputEnabled = false;
        g.fixedToCamera = true;
        this.game.add.existing(g);
        g.alpha = 0;

        // if(!TreesPart.texture){
        //     let tt = this.addChild(new TreesPart(this.game, "", false));
        //     tt.visible = false;
        // }


        // let tp0 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp0.name="tp0"; this.addSprite(tp0);

        // let tp11 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp11.name="tp11";this.addSprite(tp11);
        // let tp21 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp21.name="tp21";this.addSprite(tp21);
        // let tp31 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp31.name="tp31";this.addSprite(tp31);
        // let tp41 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp41.name="tp41";this.addSprite(tp41);


        let tp0 = new TreesPart(game, "tp0", true); this.addChild(tp0);
        let tp11 = new TreesPart(game, "tp11", true);this.addChild(tp11);
        let tp21 = new TreesPart(game, "tp21", true);this.addChild(tp21);
        let tp31 = new TreesPart(game, "tp31", true);this.addChild(tp31);
        let tp41 = new TreesPart(game, "tp41", true);this.addChild(tp41);


        this.applyPreset([         {"spriteId":"tp41","x":116.89655172413796,"y":1502.64152892562,"scaleX":1.1859675127300187,"scaleY":1.161736611853477,"anchorX":0,"anchorY":0,"rotation":-1.9001379310344828},
        {"spriteId":"tp31","x":-66.20689655172424,"y":580.2376033057845,"scaleX":-0.96675080700647,"scaleY":0.9424014715806039,"anchorX":0,"anchorY":0,"rotation":4.3233103448275845},
        {"spriteId":"tp21","x":947.9310344827586,"y":1266.568181818182,"scaleX":-1.230950830170239,"scaleY":1.0376374226526657,"anchorX":0,"anchorY":0,"rotation":1.6882758620689657},
        {"spriteId":"tp11","x":415.448275862069,"y":109.56095041322317,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0.43696551724137933},
        {"spriteId":"tp0","x":244.9655172413793,"y":559.7252066115702,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0}
        ])

        // let tp1 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp1.name="tp1"; this.addSprite(tp1);
        // let tp2 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp2.name="tp2"; this.addSprite(tp2);
        // let tp3 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp3.name="tp3"; this.addSprite(tp3);
        // let tp4 = new Phaser.Sprite(this.game, 0,0, TreesPart.texture);tp4.name="tp4"; this.addSprite(tp4);

        let tp1 = new TreesPart(game, "tp1"); this.addChild(tp1);
        let tp2 = new TreesPart(game, "tp2");this.addChild(tp2);
        let tp3 = new TreesPart(game, "tp3");this.addChild(tp3);
        let tp4 = new TreesPart(game, "tp4");this.addChild(tp4);


        this.applyPreset([ {"spriteId":"tp2","x":1016.2758620689655,"y":1617.9039256198346,"scaleX":1.1986206896551728,"scaleY":1.149039256198347,"anchorX":0,"anchorY":0,"rotation":2.774068965517242},
                        {"spriteId":"tp4","x":-108.20689655172413,"y":1565.834710743802,"scaleX":1.1859675127300187,"scaleY":1.161736611853477,"anchorX":0,"anchorY":0,"rotation":-1.3042758620689656},
                        {"spriteId":"tp1","x":0,"y":0,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
                        {"spriteId":"tp3","x":938.4827586206898,"y":-57.95971074380168,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":1.2446896551724136},
        ])

        let branches = [tp0,tp11,tp21,tp31,tp41,tp1,tp2,tp3,tp4];
        branches.forEach(b => {
            b.visible = true;
            if(window.location.href.indexOf("treesStop") ==-1){
                b.cacheAsBitmap = true;
            }
            b.onDestroy.add(()=>{
                this.cacheAsBitmap = false;
            })
        })

        this.fixedToCamera = true;

        if(this.game.height > 1600){
            this.scale.set(this.game.height / 1600);
        }

        let loading = new Label(this.game, this.game.width/2, this.game.height*4/5, "Загрузка...", { "font": "bold 60px BalsamiqSansBold", "fill": "#ffffff" });
        loading.addStrokeColor("#194c3f", 0)
        loading.strokeThickness = 6;

        this.addChild(loading);

        let tweens:Phaser.Tween[] = [];

        if(window.location.href.indexOf("treesStop") != -1){
            // tp0.tint= 0xff0000;
            // tp11.tint= 0xff0077;
            // tp21.tint= 0xff7700;
            // tp31.tint = 0x0077ff;
            // tp41.tint = 0x00ff77;
            // tp1.tint=0x00ff00;
            // tp2.tint=0x0000ff;
            // tp3.tint=0xffffff;
            // tp4.tint= 0x7700ff;
            
            // tp0.setAll("tint", 0xff0000);
            // tp11.setAll("tint", 0xff0077);
            // tp21.setAll("tint", 0xff7700);
            // tp31.setAll("tint", 0x0077ff);
            // tp41.setAll("tint", 0x00ff77);
            // tp1.setAll("tint", 0x00ff00);
            // tp2.setAll("tint", 0x0000ff);
            // tp3.setAll("tint", 0xffffff);
            // tp4.setAll("tint", 0x7700ff);
        }

        if (from && time != 0 && window.location.href.indexOf("treesStop") == -1 ) {

            SoundUtils.bushMovingIn()

            tweens.push(AnimationUtils.fadeIn(this.game, tp1, delay + 50 ))
            tweens.push(AnimationUtils.fadeIn(this.game, tp2, delay  ))
            tweens.push(AnimationUtils.fadeIn(this.game, tp3, delay  +  100))
            tweens.push(AnimationUtils.fadeIn(this.game, tp4, delay +  200 ))
            
            tweens.push(this.game.add.tween(tp1).from({ x: tp1.x- 250, y: tp1.y-300 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 50, 0, false));
            tweens.push(this.game.add.tween(tp3).from({ x: tp3.x+ 200, y: tp3.y-380 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay, 0, false));
            tweens.push(this.game.add.tween(tp4).from({ x: tp4.x- 350, y: tp4.y+350 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +100, 0, false));
            tweens.push(this.game.add.tween(tp2).from({ x: tp2.x+ 350, y: tp2.y+400 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +200, 0, false));

            let delay2 = 250;

            tweens.push(this.game.add.tween(tp11).from({ x: tp11.x+ 200, y: tp11.y-200 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 50 + delay2, 0, false));
            tweens.push(this.game.add.tween(tp31).from({ x: tp31.x- 150, y: tp31.y-280 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 100 + delay2, 0, false));
            tweens.push(this.game.add.tween(tp41).from({ x: tp41.x- 250, y: tp41.y+250 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +200 + delay2, 0, false));
            tweens.push(this.game.add.tween(tp21).from({ x: tp21.x+ 250, y: tp21.y+300 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +0 + delay2, 0, false));

            tweens.push(this.game.add.tween(tp0).from({ x: tp0.x- 100, y: tp0.y-100 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 250 + delay2, 0, false));

            tweens.push(AnimationUtils.fadeIn(this.game, tp11, delay + delay2 + 50 ))
            tweens.push(AnimationUtils.fadeIn(this.game, tp31, delay + delay2  +100 ))
            tweens.push(AnimationUtils.fadeIn(this.game, tp41, delay + delay2 + 200 ))
            tweens.push(AnimationUtils.fadeIn(this.game, tp21, delay + delay2  ))

            tweens.push(game.add.tween(g).to({ alpha: 1}, 800, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay +  200 , 0, false))
            tp0.alpha = 0.001;
            tweens.push(game.add.tween(tp0).to({ alpha:0.8}, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.Out, true, delay + delay2 + 250 , 0, false))

            loading.alpha = 0;
            tweens.push(AnimationUtils.fadeIn(this.game, loading, delay + 250 + delay2  ))
            tweens.forEach(t => t.frameBased = true);

        } else if (time != 0 && window.location.href.indexOf("treesStop") == -1 ){
            time = 960;
            let tw = this.game.add.tween(this).to({x: this.x}, 10, Easing.Linear.None, true);
            tw.frameBased = true;
            tw.onComplete.add(()=>{
                SoundUtils.bushMovingOut()
                
                g.alpha = 1;

                let delay2 = 150;

                let k = 2.4;

                tweens.push(AnimationUtils.fadeOut(this.game, tp1, delay +delay2  + 100, 300*k ))
                tweens.push(AnimationUtils.fadeOut(this.game, tp2, delay + delay2 + 100, 300*k))
                tweens.push(AnimationUtils.fadeOut(this.game, tp3, delay  +  delay2 + 100, 300*k ))
                tweens.push(AnimationUtils.fadeOut(this.game, tp4, delay +delay2  + 100, 300*k ))
                

                tweens.push(this.game.add.tween(tp1).to({ x: tp1.x- 350, y: tp1.y-400 }, time - 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 50 + delay2, 0, false));
                tweens.push(this.game.add.tween(tp3).to({ x: tp3.x+ 300, y: tp3.y-480 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + delay2, 0, false));
                tweens.push(this.game.add.tween(tp4).to({ x: tp4.x- 450, y: tp4.y+350 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +80 + delay2, 0, false));
                tweens.push(this.game.add.tween(tp2).to({ x: tp2.x+ 450, y: tp2.y+400 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +100+ delay2, 0, false));


                tweens.push(this.game.add.tween(tp11).to({ x: tp11.x+ 200, y: tp11.y-200 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 50 , 0, false));
                tweens.push(this.game.add.tween(tp31).to({ x: tp31.x- 150, y: tp31.y-280 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay + 100 , 0, false));
                tweens.push(this.game.add.tween(tp41).to({ x: tp41.x- 250, y: tp41.y+250 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +130 , 0, false));
                tweens.push(this.game.add.tween(tp21).to({ x: tp21.x+ 250, y: tp21.y+300 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay +30 , 0, false));

                tweens.push(this.game.add.tween(tp0).to({ x: tp0.x- 100, y: tp0.y-100 }, time- 150, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, delay , 0, false));

                tweens.push(AnimationUtils.fadeOut(this.game,  tp11, delay + 50 - 150, 300*k   ))
                tweens.push(AnimationUtils.fadeOut(this.game,  tp31, delay + 100 - 150 , 300*k))
                tweens.push(AnimationUtils.fadeOut(this.game,  tp41, delay +  130 - 150, 300*k ))
                tweens.push(AnimationUtils.fadeOut(this.game,  tp21, delay  +30 - 150, 300*k ))

            
                tweens.push(game.add.tween(g).to({ alpha: 0}, 400 * k, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.In, true, delay, 0, false))
                tp0.alpha = 0.8;
                tweens.push(game.add.tween(tp0).to({ alpha:0}, 300 * k, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Sinusoidal.Out, true, delay, 0, false))

                tweens.push(AnimationUtils.fadeOut(this.game, loading, delay, 300*k))
                tweens.forEach(t => t.frameBased = true);
            })
        }
    }

    public attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 100, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }
}