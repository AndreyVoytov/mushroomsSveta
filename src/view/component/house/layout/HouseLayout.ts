import AnimationUtils from '../../../../core/utils/AnimationUtils';
import Utils from '../../../../core/utils/Utils';
import BaseLayout from './BaseLayout';
import { Easing } from 'phaser-ce';
import StoryLocation from '../../../../core/model/enum/StoryLocation';
import DialogScreen from '../../../screen/common/DialogScreen';
import SpriteUtils from '../../../../core/utils/SpriteUtils';
import Game from '../../../game/Game';
import HouseScreen from '../../../screen/HouseScreen';
import Settings from '../../../../core/service/Settings';
export default class HouseLayout extends BaseLayout {

    private chestClosed: Phaser.Sprite;
    private chestOpened: Phaser.Sprite;
    private chestBox: Phaser.Sprite;

    private keyNormal: Phaser.Sprite;
    private keyRotated: Phaser.Sprite;
    private chestShining: Phaser.Sprite;
    private chestShadow: Phaser.Sprite;
    private chestShiningAnimation: Phaser.Tween;
    private chestLock: Phaser.Sprite;

    private boiler: Phaser.Sprite;
    private liquid: Phaser.Sprite;
    private boiling: Phaser.Tween;
    
    private vaxDrop: Phaser.Sprite;
    private flame1: Phaser.Sprite;
    private flame2: Phaser.Sprite;
    private flame3: Phaser.Sprite;

    private boots:Phaser.Sprite;

    // private bigDiary:BasePanel;
    // private bigDiaryGreen:BasePanel;
    // private bigDiaryNew:BasePanel;

    constructor(game: Phaser.Game, location: StoryLocation) {
        super(game, "houseLayout", "houseBg");

        this.scale.set(-1 * this.scale.x, 1 * this.scale.y)

        this.chestShadow = this.attachSprite("chestShadow");
        this.chestBox = this.attachSprite("chestBox");
        this.chestClosed = this.attachSprite("chestClosed");
        this.chestOpened = this.attachSprite("chestOpened");
        this.boiler = this.attachSprite("boilBig");
        this.liquid = this.attachSprite("liquid");
        this.keyNormal = this.attachSprite("keyDecor");
        this.keyRotated = this.attachSprite("keyRotatedDecor");
        this.chestLock = this.attachSprite("lock");
        this.chestShining = this.attachSprite("shining");

        this.vaxDrop = this.attachSprite("vaxDrop");
        this.flame1 = this.attachSprite("flame1");
        this.flame2 = this.attachSprite("flame2");
        this.flame3 = this.attachSprite("flame3");

        let preset = [{ "spriteId": "chestShadow", "x": -207, "y": 171, "scaleX": 6.519999999999949, "scaleY": 5.839999999999963, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "chestBox", "x": -219, "y": 38, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "chestClosed", "x": -222, "y": -131, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "chestOpened", "x": -364, "y": -235, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "boilBig", "x": -131, "y": -24, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "keyDecor", "x": -151, "y": -16, "scaleX": 1.08, "scaleY": 0.9199999999999999, "anchorX": 0, "anchorY": 0, "rotation": 0 },
        { "spriteId": "keyRotatedDecor", "x": -59, "y": 27, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "lock", "x": -158, "y": -20, "scaleX": 1.12, "scaleY": 1.06, "anchorX": 0, "anchorY": 0, "rotation": -0.01999999999999997 },
        {"spriteId":"vaxDrop","x":159,"y":33,"scaleX":1,"scaleY":1,"anchorX":0,"anchorY":0,"rotation":0},
        {"spriteId":"flame1","x":113,"y":-158,"scaleX":1.7200000000000006,"scaleY":2.7000000000000015,"anchorX":0,"anchorY":0,"rotation":0},
        {"spriteId":"flame2","x":113,"y":-158,"scaleX":1.7200000000000006,"scaleY":2.7000000000000015,"anchorX":0,"anchorY":0,"rotation":0},
        {"spriteId":"flame3","x":113,"y":-158,"scaleX":1.7200000000000006,"scaleY":2.7000000000000015,"anchorX":0,"anchorY":0,"rotation":0},
        { "spriteId": "shining", "x": -525, "y": -388, "scaleX": 0.9400000000000003, "scaleY": 1, "anchorX": 0, "anchorY": 0, "rotation": 0 },
        {"spriteId":"liquid","x":-193,"y":-215,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0}
        ];

        this.applyPreset(preset)

        this.boiler.addChild(this.liquid);
        this.liquid.x -= this.boiler.x;
        this.liquid.y -= this.boiler.y;

        

        this.applyState(location);

        this.boiler.events.onInputDown.add(() => {
            this.game.tweens.removeFrom(this.boiler);
            this.boiler.scale.set(1)
            AnimationUtils.jelly(this.game, this.boiler, 0, true, 0.2)
        });
        
    }

    protected attachSprite(spriteId: string, name?: string): Phaser.Sprite {
        let res = super.attachSprite(spriteId, name);
        res.visible = false;
        return res;
    }

    private applyState(location: StoryLocation): void {
        if (location == StoryLocation.house_chestClosed) {
            this.chestClosed.visible = true;
            // this.keyNormal.visible = true;
            this.chestBox.visible = true;
            this.chestShadow.visible = true;
            this.chestLock.visible = true;
        } else if (location == StoryLocation.house_chestOpened) {
            this.chestOpened.visible = true;
            this.chestShining.visible = true;
            this.chestLock.visible = true;
            this.keyRotated.visible = true;
            this.chestBox.visible = true;
            this.chestShadow.visible = true;
            this.makeChestDustAnimation(0);
        } else if (location == StoryLocation.house_boiler) {
            this.boiler.visible = true;
            this.boiler.inputEnabled = true;
            // this.liquid.tint = Math.random() * 0xffffff;
            // console.log(this.liquid.tint)
            // this.liquid.visible = true;
        }

        this.addCandleAnimation();
    }

    public addCandleAnimation(){
        this.vaxDrop.visible = true;
        this.vaxDrop.alpha = 0;

        this.flame1.visible = true;
        this.flame2.visible = true;
        this.flame3.visible = true;
        this.flame2.alpha = 0;
        this.flame3.alpha = 0;

        this.game.time.events.repeat(5000, 9999, () => {
            this.vaxDrop.y -= 100;
            this.vaxDrop.alpha = 1;
            this.vaxDrop.scale.set(0);

            this.game.add.tween(this.vaxDrop.scale).to({x:1, y:1}, 1000, Easing.Linear.None, true, 500, 0, false);
            this.game.add.tween(this.vaxDrop).to({y: this.vaxDrop.y + 100}, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Sinusoidal.In, true, 1000, 0, false);
            // this.game.add.tween(this.vaxDrop).to({y: 33}, 1000, Easing.Sinusoidal.In, true, 1000, 0, false);
            this.game.add.tween(this.vaxDrop).to({alpha: 0}, 1000, Easing.Linear.None, true, 2500, 0, false);
        })

        this.flame1.alpha = 0.8;
        this.game.add.tween(this.flame1).to({alpha: [0.87, 0.94, 1, 0.6, 0.3, 0.1, 0.1,  0.1, 0.1, 0.4, 0.8]}, 2600, Easing.Linear.None, true, 0, -1, false);

        this.game.add.tween(this.flame2).to({alpha: [0.4,0.3,0.3,0.5, 1,0.8,0.6,0.4, 0.4,0.5,0.5,0.5, 1, 0.93, 0.87, 0.8]}, 1400, Easing.Linear.None, true, 0, -1, false);

        this.game.add.tween(this.flame3).to({alpha: [0.3,0.2,0.4,0.5, 1,1,1,0.5,0.3,0.2]}, 2200, Easing.Linear.None, true, 0, -1, false);
    }



    public playAnimation(animationId: string, screen?: DialogScreen): boolean {
        if(super.playAnimation(animationId, screen)){
            //do nothing
        } else if (animationId == "openChest") {
            this.keyNormal.visible = true;
            this.keyRotated.visible = true;
            this.keyRotated.alpha = 0;
            this.chestOpened.visible = true;
            this.chestOpened.alpha = 0;
            this.chestLock.visible = true;
            this.chestShining.visible = true;
            this.chestShining.alpha = 0;

            let finalKeyX = this.keyNormal.x;
            let finalKeyY = this.keyNormal.y;
            this.keyNormal.x += this.keyNormal.width;
            this.keyNormal.y += this.keyNormal.height / 2;
            AnimationUtils.appear(this.game, this.keyNormal);

            this.game.add.tween(this.keyNormal).to({ x: finalKeyX, y: finalKeyY }, 500, Phaser.Easing.Linear.None, true, 500, 0, false);
            this.game.add.tween(this.keyNormal).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 1000, 0, false);
            this.game.add.tween(this.keyRotated).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 1000, 0, false);

            this.game.add.tween(this.chestOpened).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 1300, 0, false);
            this.game.add.tween(this.chestClosed).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 1300, 0, false);
            this.game.add.tween(this.chestShining).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 1300, 0, false);
            // this.game.add.tween(this.chestClosed).to( { alpha:0}, 300, Phaser.Easing.Linear.None, true, 1300, 0, false);

            this.makeChestDustAnimation(1300);
            this.chestShining.alpha = 0;

        } else if (animationId.startsWith("cooking")) {
            this.boiler.events.onInputDown.removeAll();

            let param = animationId.indexOf("(") != -1? animationId.split("(")[1].split(")")[0] : "";
            let parts = param.split("&");

            let color;
            let ingredients;            

            if(parts.length > 1){
                color = parts[1]
            } 
            ingredients = parts[0]

            if(!ingredients){
                ingredients = "mushroom|mushroom3";
            }
            let time = this.throwIngredientsAnimation(ingredients.split("|"));

            this.boiling = AnimationUtils.wiggle(this.game, this.boiler, time);

            if(color){
                this.liquid.visible = true;
                if(color == "pink"){
                    this.liquid.tint = 0xEB7697;
                } else if(color == "blue"){
                    this.liquid.tint = 0x3D8AE8;
                } else if(color == "green"){
                    this.liquid.visible = false;
                }
                this.liquid.alpha = 0;
                this.game.add.tween(this.liquid).to({ alpha: 1 }, 4000, Phaser.Easing.Linear.None, true, time)
                this.game.time.events.add(4000 + time, () => {
                    this.boiling.stop();
                })
            }

        } else if (animationId == "boilerBurst") {
            this.boiler.events.onInputDown.removeAll();
            this.game.time.events.add(4000, () => {
                if (this.boiling) {
                    this.boiling.stop();
                }
            })

            //diary
            this.game.time.events.add(500, () => {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                let emitter = this.game.add.emitter(433 + 200, this.game.height / 2 + (563 - 693) - 100, 100);

                emitter.makeParticles(
                    //warning! p2 and p5 have to be on the same atlas!
                    SpriteUtils.getAtlasKeyAndFrame(this.game, "p5").atlasKey,
                    [SpriteUtils.getAtlasKeyAndFrame(this.game, "p5").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").frameName]
                );
                // emitter.makeParticles(["p5", "p2"]);
                emitter.gravity = new Phaser.Point(-130, 2500);
                // emitter.gravity = 2000;

                emitter.maxRotation = 100;
                emitter.minRotation = -100;
                emitter.maxParticleSpeed = new Phaser.Point(-70, -1500);
                emitter.minParticleSpeed = new Phaser.Point(50, -1500);
                emitter.setAlpha(1, 0, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, false);
                emitter.setScale(1, 1.5, 1, 1.5, 1450, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false)
                emitter.autoAlpha = true;
                emitter.width = 270;
                emitter.height = 20;

                emitter.start(false, 1450, 50, 25, false);

                this.emitter = emitter;
            })
        } else if (animationId == "boilerAppear") {
            AnimationUtils.appear(this.game, this.boiler, 1500);
        } else if (animationId == "memoryRestoration1" || animationId == "memoryRestoration2" || animationId == "memoryRestoration3"){ //TODO
            let line1 = this.attachSprite("line1");
            line1.visible = true;
            Utils.applyPreset(line1, {"spriteId":"line1","x":111,"y":-121,"scaleX":-0.9400000000000011,"scaleY":1.2400000000000002,"anchorX":0.5,"anchorY":0.5,"rotation":0});
            // AnimationUtils.appear2(this.game, line1);
            line1.angle = -120;
            this.game.add.tween(line1).to({angle: [10, 0]}, 800, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 0);
            this.game.add.tween(line1).from({alpha: 0}, 800, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 0);

            let sx = line1.scale.x;
            let sy = line1.scale.y;
            line1.scale.set(0);
            this.game.add.tween(line1.scale).to({x: [1.1 * sx, 1* sx], y:[1.1* sy, 1* sy]}, 800, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 0);

            let points:{x:number, y:number}[] =  [{x:601, y: 546}, {x: 449, y: 305-100}, {x: 192, y: 307-100}, {x: 61-200, y:607}, {x: 50-200, y: 795}, {x:169, y:957}, {x: 349, y:1074}, {x:555, y:1174}, {x:753, y:1237}];
            this.addLineitemAnimation("note1", 0, 100, points);
            this.addLineitemAnimation("note2", 200, 100, points);
            this.addLineitemAnimation("note3", 300, 100, points);
            this.addLineitemAnimation("note4", 500, 100, points);
            this.addLineitemAnimation("note2", 150, 150, points);
            this.addLineitemAnimation("note4", 250, 150, points);
            this.addLineitemAnimation("note1", 350, 150, points);
            this.addLineitemAnimation("note3", 550, 150, points);
            
            line1.alpha = 1;
            this.game.add.tween(line1).to({alpha: 0}, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 2500);
            line1.alpha = 0;

            line1.scale.set(sx, sy);
            this.game.add.tween(line1.scale).to({x: sx*1.5, y: sy*1.5}, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 2500);
            line1.scale.set(0);
        } else if (animationId == "hideBoots"){
            if(this.boots){
                this.game.add.tween(this.boots).to({ alpha: 0 }, 200, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false)
            }
        } else if (animationId) {
            console.log("WARNING! UNKNOWN ANIMATION ID: " + animationId);
            return false;
        }

        return true;

    }

    private addLineitemAnimation(itemImage: string, delay:number, maxDelta:number, points:{x:number, y:number}[], durationMultiplier?:number, doNotHide?:boolean) : Phaser.Sprite{
        let note1 = this.attachSprite(itemImage);
        let tx = this.x;
        // let ty = this.y;
        let ty = 900;
        
        note1.visible = true;
        let w = this.game.width
        note1.x = w - 662 - tx 
        note1.y = 703 - ty 
        note1.scale.set(0);

        let duration = 2000 * (durationMultiplier || 1);
        this.game.add.tween(note1).to({x: points.map(p => w - p.x - tx + this.getRandomDelta(maxDelta)), y: points.map(p => p.y - ty + this.getRandomDelta(maxDelta/2))}, 
        duration, Easing.Linear.None, true, 600 + delay).interpolation(Phaser.Math.bezierInterpolation).start();
        if(!doNotHide){
            this.game.add.tween(note1).to({alpha:0}, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, duration + 600 - 300 + delay);
        }
        this.game.add.tween(note1.scale).to({x:1, y:1}, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.Out, true, 600 + delay);
        return note1;
    }

    private getRandomDelta(maxDelta:number):number{
        return (Utils.random(200) - 100) / 100 * maxDelta;
    }

    private makeChestDustAnimation(delay: number) {
        this.chestShining.alpha = 1;
        this.game.time.events.add(delay + 300, () => {
            this.chestShiningAnimation = this.game.add.tween(this.chestShining).to({ alpha: [0.9, 0.8, 0.95, 1] }, 1000, Phaser.Easing.Linear.None, true, 0, 1000000, true);
        });

        this.game.time.events.add(delay, () => {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            let emitter = this.game.add.emitter(570 + 50, this.game.height / 2 + (643 - 693) - 50, 15);

            emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "dust").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "dust").frameName);
            emitter.gravity = new Phaser.Point(0, -1000);
            // emitter.gravity = -1000;

            emitter.maxParticleScale = 8;
            emitter.minParticleScale = 4;
            emitter.maxRotation = 0;
            emitter.minRotation = 0;
            emitter.maxParticleSpeed = new Phaser.Point(0, -200);
            emitter.minParticleSpeed = new Phaser.Point(0, -200);
            emitter.setAlpha(0.35, 0, 1000, Phaser.Easing.Linear.None, false);
            emitter.autoAlpha = true;
            emitter.width = 300 + 50;
            emitter.height = 350 + 50;

            emitter.start(true, 1000, 200, 12);
        })

        this.game.time.events.add(delay, () => {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            let emitter = this.game.add.emitter(550 + 50, this.game.height / 2 + (643 - 693) - 50);

            emitter.makeParticles(SpriteUtils.getAtlasKeyAndFrame(this.game, "dustYellow").atlasKey, SpriteUtils.getAtlasKeyAndFrame(this.game, "dustYellow").frameName);
            emitter.gravity = new Phaser.Point(0, -100);
            // emitter.gravity = -100;

            emitter.maxParticleScale = 1;
            emitter.minParticleScale = 0.5;
            emitter.maxRotation = 0;
            emitter.minRotation = 0;
            emitter.maxParticleSpeed = new Phaser.Point(100, -200);
            emitter.minParticleSpeed = new Phaser.Point(-100, -200);
            emitter.setAlpha(1, 0, 2000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false);
            emitter.autoAlpha = true;
            emitter.width = 220 + 50;
            emitter.height = 130 + 50;

            emitter.start(false, 3000, 700);
        })
    }

    private throwIngredientsAnimation(ingredients: string[]):number{
        let finalPositions = [new Phaser.Point(571 - 480 - 180, 581 - 693 - 100), new Phaser.Point(505 - 480 - 180, 569 - 693 - 100), new Phaser.Point(450 - 480 - 180, 579 - 693 - 100)]
        let startpositions = [new Phaser.Point(1060 - 480, 250 - 693), new Phaser.Point(1060 - 480, 270 - 693), new Phaser.Point(1060 - 480, 290 - 693),
        new Phaser.Point(-100 - 480, 250 - 693), new Phaser.Point(-100 - 480, 270 - 693), new Phaser.Point(-100 - 480, 290 - 693),]

        let delay = 500;
        let ingridientsCount = 7;
        let ingridientTime = 500;
        let ingridientDelay = 200;

        for (let i = 0; i < ingridientsCount; i++) {
            this.game.time.events.add(delay + i * ingridientDelay, () => {
                let startposition = startpositions[Utils.random(startpositions.length)];
                // console.log("START POSITION: x=" + startposition.x + "; y=" + startposition.y)
                let finalPosition = finalPositions[Utils.random(finalPositions.length)];

                let specialIngredient = ingredients.filter(i => i.endsWith("!")).shift();
                let image;
                if(specialIngredient){
                    image = specialIngredient.substring(0, specialIngredient.length-1);
                    Utils.delete(ingredients, specialIngredient);
                } else {
                    image = ingredients[Utils.random(ingredients.length)]
                }

                let ingredient = SpriteUtils.createSprite(this.game, startposition.x, startposition.y, image);
                ingredient.anchor.set(0.5)
                ingredient.scale.set(1.7 * 2 / 2.5)
                this.addSprite(ingredient);
                
                if(image == "bootsBroken"){
                    (<HouseScreen>(Game.getInstance().state.getCurrentState())).lockScreenFor(5500);
                    startposition = new Phaser.Point(0, this.game.height - (1417 - 945 ) - this.y);
                    ingredient.x = startposition.x;
                    ingredient.y = startposition.y;
                    ingredient.scale.set(ingredient.scale.x * 0.8)        

                    this.game.time.events.add(4000, ()=> {
                        let points:{x:number, y:number}[] =  [{x:601, y: 546}, {x:601, y: 246}, {x:this.game.width/2 - 300, y: 246}, 
                            {x:this.game.width/2 - 300, y: 446},  {x:this.game.width/2 - 250, y: 1100}, {x: this.game.width/2 + 200, y: 1100}];
                        this.boots = this.addLineitemAnimation("boots", 0, 0, points, 0.5, true);
                        this.game.time.events.add(1500, ()=> {
                            let dw = this.boots.width/4 +20;
                            let dh = this.boots.height/2 - 25;
                            let mp = 5;
                            AnimationUtils.glint(this.game, this.boots, 0 *mp -dw, 32*mp-dh, 150*2, 0.9)
                            AnimationUtils.glint(this.game, this.boots, 15 *mp-dw, 18*mp-dh, 220*2, 0.45)
                            AnimationUtils.glint(this.game, this.boots, 30*mp-dw, 12*mp-dh, 350 *2, 0.4)
                            AnimationUtils.glint(this.game, this.boots, 22*mp-dw, 15*mp-dh, 280*2, 0.5)
                            AnimationUtils.glint(this.game, this.boots, 10*mp-dw, 21*mp-dh, 500*2, 0.452)
                            AnimationUtils.glint(this.game, this.boots, 13*mp-dw, 5*mp-dh, 230*2, 0.9)
                            AnimationUtils.glint(this.game, this.boots, 25*mp-dw, 17*mp-dh, 400*2, 0.3)
                            AnimationUtils.glint(this.game, this.boots, 20*mp-dw, 28*mp-dh, 450*2, 0.45)
                        })
                    })
                }

                let deltaX = finalPosition.x - startposition.x;
                let deltaY = finalPosition.y - startposition.y;
                this.game.add.tween(ingredient).to({ x: [startposition.x, startposition.x + deltaX * 4 / 5, finalPosition.x], y: [startposition.y, startposition.y + deltaY / 5, finalPosition.y] },
                    ingridientTime, Phaser.Easing.Linear.None, true, 0, 0, false).interpolation(Phaser.Math.bezierInterpolation).start();
                this.game.add.tween(ingredient).to({ alpha: 0 }, 100, Phaser.Easing.Linear.None, true, ingridientTime - 100, 0, false)
                this.game.add.tween(ingredient).to({ angle: Utils.random(180) - 90 }, ingridientTime, Phaser.Easing.Linear.None, true, 0, 0, false)

                let splash = SpriteUtils.createSprite(this.game, finalPosition.x, finalPosition.y, "splash1");
                splash.anchor.set(0.5)
                splash.scale.set(1.2)
                splash.alpha = 0;
                this.addSprite(splash);

                this.game.time.events.add(ingridientTime, () => {
                    splash.alpha = 0.8;
                    AnimationUtils.frameByFrameAnimation(this.game, splash, ["splash1", "splash2", "splash3", "splash4"], 15, false, true);
                })
            })
        }

        return delay + ingridientsCount * ingridientDelay + ingridientTime;
    }


    private emitter;

    update() {
        if (this.emitter) {
            this.emitter.customSort(this.scaleSort, this);
        }
    }

    scaleSort(a, b) {
        if (a.scale.x < b.scale.x) {
            return -1;
        } else if (a.scale.x > b.scale.x) {
            return 1;
        } else {
            return 0;
        }
    }

}