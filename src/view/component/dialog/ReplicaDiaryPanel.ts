import Preset from '../../game/Preset';
import Utils from './../../../core/utils/Utils';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import BasePanel from '../../component/panel/BasePanel';
import DiaryMapLayout from '../diary/DiaryMapLayout';
import DiaryRecipeLayout from '../diary/DiaryRecipeLayout';
import DialogPanel from './DialogPanel';
import ReplicaType from '../../../core/model/replica/ReplicaType';
import DiaryPictureLayout from '../diary/DiaryPictureLayout';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Settings from '../../../core/service/Settings';
export default class ReplicaDiaryPanel extends BasePanel {

    private blackTransparent: Phaser.Graphics;
    private diaryLayout: BasePanel;
    private diaryPreset: Preset;

    private gameCenterY;

    private finalScale = 0.9;
    private emitter: Phaser.Particles.Arcade.Emitter;

    private static RIGHT_SIDE_DX = -70;

    constructor(game: Phaser.Game, x: number, y: number, r: ReplicaType, diaryPrest?: Preset) {
        super(game, x + (r.rightSide? ReplicaDiaryPanel.RIGHT_SIDE_DX : 0), y);
        this.diaryPreset = diaryPrest;

        //Всегда подсвечиваем дневник!
        let highlight = true;

        //TODO переделать панель, чтобы (0,0) совпадало с глобальными (0,0)
        this.gameCenterY = -this.game.height / 2 + 280 + DialogPanel.BOTTOM_PADDING - 100;

        //diaryPreset - показ дневника во время мини-игры
        let diaryContent = diaryPrest && r.context.level != 3 ? DiaryConfiguration.getNextrecipe(r.context.level) : DiaryConfiguration.getCurrentRecipe(r.context.level, true);

        if (highlight) {
            // let emitter = game.add.emitter(0, 0, /*game.world.centerX, game.world.centerY,*/ 200);
            this.emitter = game.add.emitter(game.world.centerX, game.world.centerY - 200, 10);

            if(diaryContent.highlightColor && diaryContent.highlightColor == "pink"){
                // this.emitter.makeParticles(["p6", "p7"]);
                this.emitter.makeParticles(
                    //warning! p6 and p7 have to be on the same atlas!
                    SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").atlasKey,
                    [SpriteUtils.getAtlasKeyAndFrame(this.game, "p6").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p7").frameName]
                );
            } else if(diaryContent.highlightColor && diaryContent.highlightColor == "blue"){
                // this.emitter.makeParticles(["p8", "p9"]);
                this.emitter.makeParticles(
                    //warning! p8 and p9 have to be on the same atlas!
                    SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").atlasKey,
                    [SpriteUtils.getAtlasKeyAndFrame(this.game, "p8").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p9").frameName]
                );
            } else { //green
                // this.emitter.makeParticles(["p5", "p2"]);
                this.emitter.makeParticles(
                    //warning! p2 and p5 have to be on the same atlas!
                    SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").atlasKey,
                    [SpriteUtils.getAtlasKeyAndFrame(this.game, "p2").frameName, SpriteUtils.getAtlasKeyAndFrame(this.game, "p5").frameName]
                );
            }

            this.emitter.gravity = new Phaser.Point(0, 0);
            this.emitter.minSpeed = 100;
            this.emitter.maxSpeed = 300;
            // emitter.maxParticleScale = 0.7;
            this.emitter.width = 400;
            this.emitter.height = 600;
            // emitter.alpha = 0.7;
            this.emitter.start(false, 5000, 200);
            this.emitter.setAlpha(0.7, 0, 5000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Exponential.In, false);
            this.emitter.setScale(0, 0.7, 0, 0.7, 1450, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, false)
            // emitter.x = 0;
            // emitter.y = 0;
            // this.addChild(emitter)
        }

       

        if (!diaryPrest) {
            let dx = r.rightSide? ReplicaDiaryPanel.RIGHT_SIDE_DX : 0;
            this.blackTransparent = new Phaser.Graphics(this.game, 0, 0);
            this.blackTransparent.beginFill(0x000000, 1);
            this.blackTransparent.drawRect(0-dx, this.gameCenterY - this.game.height / 2, this.game.width-dx, this.game.height);
            this.blackTransparent.endFill();
            this.blackTransparent.alpha = 0;
            this.blackTransparent.inputEnabled = false;
            this.blackTransparent.fixedToCamera = true;
            this.addChild(this.blackTransparent);
        }

        

        if (!diaryContent) {
            return;
        }

        let animationsDelay = diaryPrest ? 1010 : 0;

        if (diaryContent.mapPreset) {
            this.diaryLayout = new DiaryMapLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100);
        } else if (diaryContent.picture) {
            this.diaryLayout = new DiaryPictureLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100);
        } else {
            this.diaryLayout = new DiaryRecipeLayout(this.game, diaryContent, this.game.width / 2 + 30, this.gameCenterY - 100, animationsDelay);
        }

        this.diaryLayout.anchor.set(0.5, 0.5)
        this.diaryLayout.scale.set(0);

        if(highlight){
            let diaryShine = SpriteUtils.createSprite(this.game, 0, 0, "diaryShine")
            diaryShine.name = "diaryShine";
            Utils.applyPreset(diaryShine, { "spriteId": "diaryShine", "x": 129, "y": 38 - 56/1.18 + 13, "scaleX": 5.780000000000004, "scaleY": 5.640000000000013, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
            this.diaryLayout.addSprite(diaryShine)
            this.diaryLayout.setChildIndex(diaryShine, 0);

            if(diaryContent.highlightColor && diaryContent.highlightColor == "pink"){
                // diaryShine.tint = 0xda54ff;
                diaryShine.tint = 0xa53dba;
            } else if(diaryContent.highlightColor && diaryContent.highlightColor == "blue"){
                diaryShine.tint = 0x52a5ff;
            } else { //green
                diaryShine.tint = 0x67f567;
            }

            game.add.tween(diaryShine).to({ alpha: [0, 1] }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true)
        }

        this.addSprite(this.diaryLayout);

        if (diaryPrest) {
            Utils.applyPreset(this.diaryLayout, diaryPrest);
            this.diaryLayout.y -= this.game.height - 280 - DialogPanel.BOTTOM_PADDING;
        } else {
            this.diaryLayout.alpha = 0;
        }
    }

    public show() {
        let time = this.diaryPreset ? 1000 : 300;
        if (this.blackTransparent) {
            this.game.add.tween(this.blackTransparent).to({ alpha: 0.5 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        }
        this.game.add.tween(this.diaryLayout).to({ alpha: 1 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        this.game.add.tween(this.diaryLayout.scale).to({ x: this.finalScale, y: this.finalScale }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        this.game.add.tween(this.diaryLayout).to({ x: this.game.width / 2 + 30, y: this.gameCenterY - 100 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);

        if (this.diaryPreset) {
            this.game.add.tween(this.diaryLayout).to({ angle: 365 }, time, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 500, 0, false);
        }

        // if (highlight) {
            this.game.time.events.add(500 + time + 500, ()=>{
                let animationsDelay = this.diaryPreset ? 1010 : 0;
                let p = this.diaryLayout;
                let k = 0.1;
                let k2 = 2;
                this.game.add.tween(this.diaryLayout).to({ angle: [20 * k, -5 * k, 10 * k, -20 * k, 0, -20 * k, 10 * k, -5 * k, 20 * k, 5] }, 3 * 15000 * Math.abs(k * 10), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
                this.game.add.tween(this.diaryLayout).to({ x: [p.x + 30 * k2, p.x + 5 * k2, p.x - 15 * k2, p.x, p.x - 15 * k2, p.x + 5 * k2, p.x + 30 * k2, p.x], y: [p.y + 20 * k2, p.y + 30 * k2, p.y + 15 * k2, p.y, p.y + 15 * k2, p.y + 30 * k2, p.y + 20 * k2, p.y] }, 3 * 20000 * Math.abs(k2), Phaser.Easing.Linear.None, true, animationsDelay || 0, -1, false)
            })
            
        // }

    }

    public hide() {
        if (this.blackTransparent) {
            this.game.add.tween(this.blackTransparent).to({ alpha: 0 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
            this.game.time.events.add(300 + 1, () => this.blackTransparent.kill());
        }
        this.game.add.tween(this.diaryLayout).to({ x: this.game.width + 400 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
        this.game.add.tween(this.diaryLayout.scale).to({ x: 0.3, y: 0.3 }, 300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.In, true, 200, 0, false);
        this.game.time.events.add(490, () => {
            if (this.emitter) {
                this.emitter.killAll();
                this.emitter.kill();
            }
            this.diaryLayout.alpha = 0;
            this.diaryLayout.kill();
        });
    }
}