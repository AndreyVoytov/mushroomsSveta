import UserService from '../../../core/service/UserService';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import Label from './../../component/panel/Label';
import HouseScreen from './../../screen/HouseScreen';
import BasePanel from './BasePanel';
import RecipeUtils from '../../../core/utils/RecipeUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import PrizesConfiguration from '../../../core/configuration/PrizesConfiguration';
import ForestDao from '../../../core/dao/ForestDao';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import { Easing, Game } from 'phaser-ce';
import InfoPanel from './InfoPanel';
import BoosterType from '../../../core/model/enum/BoosterType';
import ForestUtils from '../../../core/utils/ForestUtils';
import Settings from '../../../core/service/Settings';
import LocalizationService from '../../../core/localization/LocalizationService';
import LocalizationKey from '../../../core/localization/LocalizationKey';
export default class ProgressBar extends BasePanel {
    private screen: HouseScreen;

    private currentTask: DiaryContentType;

    private progressBarBody: Phaser.TileSprite;
    private progressBarTail: Phaser.Sprite;
    private progressLineBg: Phaser.Sprite;
    private characterImage: Phaser.Sprite;
    private taskText: Label;
    private resultImage: Phaser.Sprite;
    private taskCount: Label;

    private totalCount: number;
    private currentCount: number;

    public startY: number;

    
    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number, currentTask: DiaryContentType, hidden?: boolean) {
        super(game, x, y, "blank");
        this.startY = this.y;
        this.screen = screen;
        this.currentTask = currentTask;

        let user = UserService.getUser();

        let start = RecipeUtils.getRequiredLevel(currentTask)
        this.currentCount = Math.max(0, user.getCurrentForest() - start);
        
        let nextTask = DiaryConfiguration.getNextrecipe(user.getCurrentForest());
        let finish = RecipeUtils.getRequiredLevel(nextTask);

        this.totalCount = finish - start;

        // let progressBg = SpriteUtils.createSprite(this.game, 0, 0, currentTask.mapPreset ? 'forestProgress' : 'boilerProgress');
        // // let progressBg = SpriteUtils.createSprite(this.game, 0, 0, 'progressBg');
        // progressBg.name = "progressBg";
        // progressBg.anchor = new Phaser.Point(0.5, 0.5);
        // this.addSprite(progressBg);

        // this.attachSprite('wood')

        this.attachSprite('shadow')
        let sh2 = this.attachSprite('shadow','shadow2');
        sh2.alpha = 0.5;
        this.attachSprite('statusPanel')
        this.attachSprite(currentTask.mapPreset ? 'forestHeader' : 'potionHeader', 'header')



        // let taskImg = SpriteUtils.createSprite(this.game, 0, 0, currentTask.image);
        // taskImg.name = "taskImg";
        // taskImg.anchor = new Phaser.Point(0.5, 0.5);
        // this.addSprite(taskImg);
        this.progressLineBg = SpriteUtils.createSprite(this.game, 0, 0, 'progressLineBg');
        this.progressLineBg.name = "progressLineBg";
        this.progressLineBg.scale.set(0.5)
        this.addSprite(this.progressLineBg);

        this.progressBarBody = SpriteUtils.createTileSprite(this.game, - this.progressLineBg.width / 2 , - 3, 50, 31, 'progressBody');
        this.progressBarBody.anchor = new Phaser.Point(0, 0.5);
        this.progressBarBody.name = "progressBarBody";
        this.addSprite(this.progressBarBody);

        let progressStart = SpriteUtils.createSprite(this.game, - this.progressLineBg.width / 2 , - 3, 'progressTail');
        progressStart.anchor = new Phaser.Point(0.5, 0.5);
        progressStart.name = "progressBarStart";
        this.addSprite(progressStart);

        this.progressBarTail = SpriteUtils.createSprite(this.game, - this.progressLineBg.width / 2 , - 3, 'progressTail');
        this.progressBarTail.anchor = new Phaser.Point(0.5, 0.5);
        this.progressBarTail.name = "progressBarTail";
        this.addSprite(this.progressBarTail);

        this.attachSprite('circle')
        this.attachSprite('ribbon')
        const taskTitle = LocalizationService.get(LocalizationKey.diary(currentTask, currentTask.titleForProgress ? 'titleForProgress' : 'title'), currentTask.titleForProgress || currentTask.title);
        this.taskText = new Label(this.game, 0, 0, taskTitle, { font: "40px Bookman Old Style", fill: "#ffffff" })
        this.taskText.name = "taskText";
        this.addSprite(this.taskText);

        if (currentTask.resultImageForProgress || currentTask.resultImage) {
            this.resultImage = SpriteUtils.createSprite(this.game, 0, 0, currentTask.resultImageForProgress || currentTask.resultImage);
            this.resultImage.name = "resultImage";
            this.addSprite(this.resultImage);
        }

        if (currentTask.mapPreset) {
            this.characterImage = SpriteUtils.createSprite(this.game, 0, 0, "character");
            this.characterImage.name = "character";
            this.characterImage.anchor.set(0.5, 1);
            this.addSprite(this.characterImage);
        }

        //for items
        this.applyPreset([{ "spriteId": "progressBg", "x": -32, "y": -89, "scaleX": 1.44, "scaleY": 1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressLineBg", "x": 169, "y": -17, "scaleX": 1.4200000000000004, "scaleY": 1.5000000000000004, "anchorX": 1, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarBody", "x": -320.16000000000014, "y": -18, "scaleX": 1, "scaleY": 1, "anchorX": 0, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarStart", "x": -301, "y": -18, "scaleX": -1.0200000000000011, "scaleY": 1.3400000000000003, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarTail", "x": 9.279999999999916, "y": -18, "scaleX": 1, "scaleY": 1.2800000000000002, "anchorX": 0, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "taskText", "x": -82, "y": 40, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 }, { "spriteId": "taskCount", "x": 183, "y": 41, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 38 }, { "spriteId": "resultImage", "x": 167, "y": -55, "scaleX": 0.6399999999999997, "scaleY": 0.5999999999999996, "anchorX": 0, "anchorY": 0, "rotation": 0 }, { "spriteId": "", "x": -155.4400000000001, "y": -18, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "", "x": 9.279999999999916, "y": -18, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }])
        //for forest
        this.applyPreset([{ "spriteId": "progressBg", "x": -32, "y": -89, "scaleX": 1.44, "scaleY": 1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressLineBg", "x": 169, "y": -17, "scaleX": 1.4200000000000004, "scaleY": 1.5000000000000004, "anchorX": 1, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarBody", "x": -310.16000000000014, "y": -18, "scaleX": 1, "scaleY": 1.3400000000000002, "anchorX": 0, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarStart", "x": -307, "y": -18, "scaleX": -1.0200000000000011, "scaleY": 1.4500000000000002, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "progressBarTail", "x": -98.37714285714296, "y": -17, "scaleX": 1, "scaleY": 1.4500000000000002, "anchorX": 0, "anchorY": 0.5, "rotation": 0 }, { "spriteId": "taskText", "x": -82, "y": 40, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 }, { "spriteId": "taskCount", "x": 183, "y": 41, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 38 }, { "spriteId": "character", "x": -98.37714285714296, "y": -54, "scaleX": 1.4600000000000004, "scaleY": 1.5400000000000005, "anchorX": 0.5, "anchorY": 1, "rotation": 0 }])

        // this.applyPreset([{ "spriteId": "shadow", "x": 0, "y": 0, "scaleX": this.game.width, "scaleY": 4.6, "anchorX": 0, "anchorY": 0, "rotation": 0 },
        this.applyPreset([
        { "spriteId": "shadow", "x": 0, "y": this.game.height - this.y + 100, "scaleX": this.game.width * 1.3/100, "scaleY": 7.6/2, "anchorX": 0.5, "anchorY": 1, "rotation": 0 },
        { "spriteId": "shadow2", "x": 0, "y": this.game.height - this.y + 100, "scaleX": this.game.width * 1.3/100, "scaleY": 7.6/2, "anchorX": 0.5, "anchorY": 1, "rotation": 0 },
        { "spriteId": "statusPanel", "x": -15, "y": 6, "scaleX": 2.5600000000000014, "scaleY": 2.4200000000000013, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "header", "x": -16, "y": -147, "scaleX": 0.98, "scaleY": 0.8799999999999999, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "progressLineBg", "x": 180, "y": 5, "scaleX": 1.4200000000000004/2, "scaleY": 1.5000000000000004/2, "anchorX": 1, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "progressBarBody", "x": -292.16000000000014, "y": 5, "scaleX": 1, "scaleY": 1.4500000000000002, "anchorX": 0, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "progressBarStart", "x": -296, "y": 5, "scaleX": -1.0200000000000011, "scaleY": 1.4500000000000002, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "progressBarTail", "x": -90.37714285714296, "y": 5, "scaleX": 1, "scaleY": 1.4500000000000002, "anchorX": 0, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "circle", "x": 223, "y": 4, "scaleX": 1.4800000000000004/2, "scaleY": 1.4600000000000004/2, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "ribbon", "x": -20, "y": 105, "scaleX": 0.8199999999999998, "scaleY": 0.96, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "taskText", "x": -27, "y": 65, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 },
        { "spriteId": "character", "x": -80.37714285714296, "y": -32, "scaleX": 1.4600000000000004, "scaleY": 1.5400000000000005, "anchorX": 0.5, "anchorY": 1, "rotation": 0 }])

        if(this.resultImage){
            this.resultImage.width = 180 * this.resultImage.scale.x;
            this.resultImage.height = 180 * this.resultImage.scale.y;
        }

        this.progressBarBody.x = this.progressLineBg.x + 7 - this.progressLineBg.width  + 15;
        this.progressBarBody.y = this.progressBarTail.y;
        this.progressBarBody.scale = this.progressBarTail.scale;


        if (user.isJustCompletedLevel() && this.currentCount > 0) {
            this.currentCount--;

            this.progressBarBody.width = this.getProgressBodyWidth(this.currentCount);
            this.progressBarTail.x = this.progressBarBody.x + this.getProgressBodyWidth(this.currentCount) - 10;

            if (this.characterImage) {
                this.characterImage.x = this.progressBarTail.x;
            }

            this.visualizeAndSetProgress(this.currentCount + 1, 1000);
        } else {
            this.progressBarBody.width = this.getProgressBodyWidth(this.currentCount);
            this.progressBarTail.x = this.progressBarBody.x + this.getProgressBodyWidth(this.currentCount) - 10;

            if (this.characterImage) {
                this.characterImage.x = this.progressBarTail.x;
            }

            if (hidden) {
                this.y += 300;
                this.alpha = 0;
            }

            // if (this.currentCount == 0) {
            //     this.y += 400;
            //     this.game.add.tween(this).to({ y: this.y - 400 }, 700, Phaser.Easing.Linear.None, true, 500, 0, false);
            // }
        }

        for (let i = 1; i < this.totalCount; i++) {
            let width = this.getProgressBodyWidth(i);
            let scalePart = SpriteUtils.createSprite(this.game, this.progressBarBody.x + width - 10, this.progressBarBody.y, "scale")
            scalePart.anchor.set(0.5, 0.5)
            scalePart.scale.set(1.3)
            this.addSprite(scalePart)
        }

        // this.game.time.events.repeat(1000, 10, () => this.onUpdate(10, 0));

        this.scale.set(0.9)

        // console.log("PROGRESS START: " + start)
        // console.log("PROGRESS FINISH: " + finish)
        // console.log("PROGRESS CURRENT: " + (start + this.currentCount))

        PrizesConfiguration.allPrizes.forEach(p => {
            let forestType = ForestDao.getEntity().getById(p.level);
            let level = ForestDao.getAllForests().indexOf(forestType);
            // console.log("PROGRESS PRIZE AT: " + level)

            if(level <= finish && level >= start + this.currentCount && UserService.getUser().getMarkers().indexOf(p.id) == -1){
                let width = this.getProgressBodyWidth(level - start);
                let gift = SpriteUtils.createSprite(this.game, this.progressBarBody.x + width + 20, this.progressBarBody.y, "gift")
                gift.anchor.set(0.5, 0.5)
                this.addSprite(gift);
                // this.game.add.tween(gift).to({y: gift.y - 8, x: gift.x}, 1000, Easing.Sinusoidal.InOut, true, 0, -1, true)

                if(level == start + this.currentCount){
                    AnimationUtils.emphasize(this.game, gift)
                    this.game.time.events.add(300, ()=>{
                    this.game.tweens.removeFrom(gift);

                    let user = UserService.getUser();
                    AnimationUtils.fadeOut(this.game, gift, 1000);
                        this.game.time.events.add(1000, ()=>{
                            let texts = []
                            let images = []
                            if(p.boosters){
                                p.boosters.forEach(b => {
                                    texts.push("+" +b.count)
                                    images.push(b.type)

                                    user.increaseBoostersCount(b.type, b.count)
                                    ForestUtils.markBoosterSeen(b.type);
                                })
                            }
                            if(p.gems){
                                texts.push("+" +p.gems)
                                images.push("gems")
                                user.setSupermoney(user.getSupermoney() + p.gems)
                            }
                            user.addMarker(p.id);

                            let info =  new InfoPanel(this.game, this.progressBarBody.x + width - 10, this.progressBarBody.y - 100, texts, images, false, false);
                            this.game.tweens.removeFrom(info);
                          
                            info.scale.set(1,1)
                            info.x -= (texts.length + images.length)*50;
                            info.x+=this.x;
                            info.y+=this.y;
                            this.screen.add.existing(info);
                              this.game.add.tween(info).to({  y: info.y - 360}, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None : Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
                            this.game.add.tween(info).to({  alpha: [1, 1, 1, 1, 1, 1, 0.5, 0 ] }, 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Phaser.Easing.Quadratic.Out, true, 0, 0, false);

                            // console.log("info.x " + info.x)
                            // console.log("info.y " + info.y)
                            // this.game.time.events.loop(10, ()=>{
                            //     info.bringToTop();
                            // })


                        })
                    })
                }
            }
        })
    }

    private visualizeAndSetProgress(currentCount: number, delay: number) {

        let barBodyWidth = this.getProgressBodyWidth(currentCount);

        let animationTime = 500;
        this.game.add.tween(this.progressBarBody).to({ width: barBodyWidth }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);
        this.game.add.tween(this.progressBarTail).to({ x: this.progressBarBody.x + barBodyWidth - 10 }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);
        if (this.characterImage) {
            this.game.add.tween(this.characterImage).to({ x: this.progressBarBody.x + barBodyWidth }, animationTime, Phaser.Easing.Linear.None, true, delay, 0, false);
        }

        // this.game.time.events.add(delay, () => {
        //     this.taskCount.text = " (" + this.currentCount + "/" + this.totalCount + ")";
        // })
        // this.game.time.events.add(delay + 400, () => {
        //     AnimationUtils.wiggle(this.game, this.taskCount, 0, true)
        // })

        this.currentCount = currentCount;

        //TODO sparkles

        if (this.currentCount == this.totalCount) {
            let flash = this.attachSprite("flash");
            
            if(this.resultImage){
                this.setChildIndex(this.resultImage, this.children.length - 1);
                flash.x = this.resultImage.x + this.resultImage.width / 2;
                flash.y = this.resultImage.y + this.resultImage.height / 2;
            }
            flash.scale.set(0)
            flash.alpha = 0;

            this.game.add.tween(flash.scale).to({ x: 3/2, y: 3/2 }, 300, Phaser.Easing.Linear.None, true, delay + animationTime - 100, 0, false);
            this.game.add.tween(flash).to({ alpha: 0.8 }, 300, Phaser.Easing.Linear.None, true, delay + animationTime - 100, 0, false);
            this.game.add.tween(flash).to({ angle: 360 }, 6000, Phaser.Easing.Linear.None, true, delay, -1, false);

            this.screen.hideUI(delay + animationTime + 1000 + 700)
            this.game.add.tween(this).to({ y: this.game.height + 400 }, 700, Phaser.Easing.Linear.None, true, delay + animationTime + 1000, 0, false);

            this.screen.lockScreenFor(delay + animationTime + 1000 + 700 + 300 + 1500);
            this.game.time.events.add(delay + animationTime + 1000 + 700 + 300, () => {
                let user = UserService.getUser();
                user.addCompletedTask(this.currentTask.id);
                this.screen.progressAnimation = false;
                this.screen.dialogPanel.updateReplica(true);
            })
        }
    }

    private getProgressBodyWidth(currentCount): number {
        let ratio = currentCount / this.totalCount;

        return ratio * (this.progressLineBg.width);
    }

    public getCurrent(): number {
        return this.currentCount;
    }

    public getTotal(): number {
        return this.totalCount;
    }
}