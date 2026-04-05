import Utils from './Utils';
import { Easing, Timer } from 'phaser-ce';
import SpriteUtils from './SpriteUtils';
import Game from '../../view/game/Game';
import Settings from '../service/Settings';
export default class SoundUtils {

    private static volumeRatio = 4; 

    public static enableSound():void{
        Game.SOUND_ENABLED = true;

        Game.getInstance().sound.mute = false;
    }

    public static disableSound():void{
        Game.SOUND_ENABLED = false;
        Game.getInstance().sound.mute = true;
    }

    //manager
    private static sounds : {key: string, sound:Phaser.Sound, time:number}[] = [];
    private static addSound(key:string, volume:number):Phaser.Sound{
        let sound = Game.getInstance().sound.play(key, volume);
        let managableSound = {key:key, sound:sound, time: new Date().getTime()};
        this.sounds.push(managableSound)
        Game.getInstance().time.events.add(sound.totalDuration+1000, ()=>{
            Utils.delete(SoundUtils.sounds, managableSound);
        })
        return sound;
    }
    private static haveRecent(key:string):boolean{
        let res = false;
        SoundUtils.sounds.forEach(s => {
            if(s.key == key && s.time > new Date().getTime() - 100){
                res  = true
            }
        })
        return res;
    }

    //sounds
    public static startLevel(){
    }
    public static winLevel(){
        let game = Game.getInstance();
        game.sound.play("itemFound", 0.060 * this.volumeRatio)
        // this.game.time.events.add(700, ()=>{
        //     let sound = this.game.sound.play("win", 0.05)
        // })
        game.time.events.add(700, ()=>{
            let sound = game.sound.play("win2", 0.06)
            sound.volume = 0;
            game.add.tween(sound).to({volume:0.06 * this.volumeRatio}, 500, null, true)
        })


        // let sound = this.game.sound.play("whooshIn", 0.05);
        // this.game.add.tween(sound).to({volume:0}, 100, null, true, 100);
    }
    public static noStepsLeft(){
        let game = Game.getInstance();
        game.time.events.add(700, ()=>{
            let sound = game.sound.play("win", 0.015 * 1.2 * this.volumeRatio)
            game.add.tween(sound).to({volume:0}, 700, null, true, 300)
            game.time.events.add(300, ()=>{
                let finalVolume =  0.11/2  * 1.2 * this.volumeRatio
                let sound2 = game.sound.play("win3", finalVolume)
                sound2.volume = 0;
                game.add.tween(sound2).to({volume:finalVolume}, 500, null, true)
                sound2.volume = finalVolume;
                game.add.tween(sound2).to({volume:0}, 1300, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.In, true, 600)
                sound2.volume = 0;
            })
        })
    }
    public static looseLevel(){
        // let sound = Game.getInstance().sound.play("loose", 0.025)
        let sound = Game.getInstance().sound.play("trouble2", 0.05 * 1.5 * this.volumeRatio)
        Game.getInstance().add.tween(sound).to({volume:0}, 1000, null, true, 3000);
    }

    public static bushMovingIn(){
        let sound = Game.getInstance().sound.play("bushMoving", 0.2 * this.volumeRatio)
    }

    public static bushMovingOut(){
    }

    public static panelOpen(){
          // this.game.sound.play("whooshOut", 0.2)
          let sound = Game.getInstance().sound.play("whooshOut", 0.15 * this.volumeRatio)
          // let sound = this.game.sound.play("whooshIn", 0.05);
          Game.getInstance().add.tween(sound).to({volume:0}, 100, null, true, 100);
    }
    public static panelClose(){
        let sound = Game.getInstance().sound.play("whooshOut", 0.1 * this.volumeRatio)
        // let sound = this.game.sound.play("whooshIn", 0.05);
        Game.getInstance().add.tween(sound).to({volume:0}, 100, null, true, 100);
    }

    public static diaryNextPage(){
        let sound = Game.getInstance().sound.play("whooshIn", 0.05 * this.volumeRatio);
        Game.getInstance().add.tween(sound).to({volume:0}, 100, null, true, 100);
    }
    public static diaryPrevPage(){
        Game.getInstance().time.events.add(250, () => {
            let sound = Game.getInstance().sound.play("whooshIn", 0.05 * this.volumeRatio);
            Game.getInstance().add.tween(sound).to({volume:0}, 100, null, true, 100);
        })
    }

    public static fastPanelWhooshIn(delay:number){
        Game.getInstance().time.events.add(delay, () => {
            let sound = Game.getInstance().sound.play("whooshIn2", 0.03 * this.volumeRatio);
        })
    }
    public static fastPanelWhooshOut(delay:number){
        Game.getInstance().time.events.add(delay, () => {
            Game.getInstance().sound.play("whooshOut2", 0.04 * this.volumeRatio)
        })
    }

    public static successfulBuy(){
        let sound = Game.getInstance().sound.play("win", 0.03 * this.volumeRatio)
    }
    public static successfulEverydayGems(){
        let sound = Game.getInstance().sound.play("win", 0.03 * this.volumeRatio)
    }
    public static restoreLifes(){
        let sound = Game.getInstance().sound.play("win", 0.03 * this.volumeRatio)
    }
    public static restoreSteps(){
        let sound = Game.getInstance().sound.play("win", 0.03 * this.volumeRatio)
    }

    public static forestTheme(){

        Game.getInstance().time.events.add(2000, ()=>{
            // let sound = Game.getInstance().sound.play("forest", 0.02, false)
        })
    }
    public static darkForestTheme(){
    }
    public static openDoor(){
        let sound = Game.getInstance().sound.play("door", 0.07 * this.volumeRatio)
    }
    public static trouble(){
        let sound = Game.getInstance().sound.play("trouble", 0.05 * this.volumeRatio)
    }
    public static halfTrouble(){
        let sound = Game.getInstance().sound.play("trouble", 0.05 * this.volumeRatio)
        Game.getInstance().add.tween(sound).to({volume:0}, 2000, null, true, 5000);
    }
    public static trouble2(){
        let sound = Game.getInstance().sound.play("trouble2", 0.1 * this.volumeRatio)
    }
    public static birds1(){
         let sound2 = Game.getInstance().sound.play("forestSounds1", 0.1 * this.volumeRatio, false)
        let finalVolume = sound2.volume;
        sound2.volume = 0;
        Game.getInstance().add.tween(sound2).to({volume: [finalVolume, finalVolume, finalVolume, 0]}, 2500, null, true);
        // let sound = Game.getInstance().sound.play("forestSounds1", 0.1 * this.volumeRatio)
    }
    public static birds2(){
        let sound = Game.getInstance().sound.play("forestSounds2", 0.1 * this.volumeRatio)
    }


    //game
    public static specialItemFound(){
        // Game.getInstance().sound.play("itemFound", 0.3);
        Game.getInstance().time.events.add(700, ()=>{
            let sound = Game.getInstance().sound.play("win", 0.015 * this.volumeRatio);
        })
    }
    public static honey(){
        let sound = Game.getInstance().sound.play("mushroomTaking", 0.015 * this.volumeRatio);
    }
    public static beeSting(){
        if(!SoundUtils.haveRecent("beeSting")){
            SoundUtils.addSound("beeSting", 0.03 * this.volumeRatio);
        }
    }
    public static mushroomFound(){
        // if(Utils.randomBoolean()){
            let sound = Game.getInstance().sound.play("mushroomTaking", 0.0045 * this.volumeRatio);
            // TODO тут вероятно надо сделать 2 звука на уровнях, где нет дерева/желудей/мёда
        // } 
        // else {
        //     Game.getInstance().time.events.add(200, ()=>{
        //         let sound2 = Game.getInstance().sound.play("collect3", 0.0125 * this.volumeRatio);
        //     })
        // }

    }
    public static houseItemFound(){
        let sound2 = Game.getInstance().sound.play("collect3", 0.025 * this.volumeRatio);
    }
    public static animalFound(){
        let sound = Game.getInstance().sound.play("itemFound", 0.015 * this.volumeRatio);
    }
    
    public static cellBushOff(){
        if(!SoundUtils.haveRecent("bushHit2")){
            let sound = SoundUtils.addSound("bushHit2", 0.030 * this.volumeRatio);
        }
    }
    public static cellPlankOff(){
        // if(!SoundUtils.haveRecent("plank")){
        //     let sound = SoundUtils.addSound("plank", 0.3);
        // }
        // if(!SoundUtils.haveRecent("bushHit2")){
        //     let sound = SoundUtils.addSound("bushHit2", 0.010);
        // }
        if(!SoundUtils.haveRecent("bushHit2")){
            let sound = SoundUtils.addSound("bushHit2", 0.030 * this.volumeRatio);
        }
    }
    public static touchJelly(){
        if(!SoundUtils.haveRecent("jellyBlob")){
            let sound = SoundUtils.addSound("jellyBlob", 0.07 * this.volumeRatio);
        }
    }
    public static jellyAppear(){
        let sound = Game.getInstance().sound.play("jellyAppear", 0.15 * this.volumeRatio);
    }
    public static touchIce(){
        if(!SoundUtils.haveRecent("plank")){
            let sound = SoundUtils.addSound("plank", 0.4 * this.volumeRatio);
            Game.getInstance().add.tween(sound).to({volume:0}, 15, null, true, 15);
        }
        // let sound = Game.getInstance().sound.play("jellyBlob", 0.3);
    }

    public static touchAcorn(){
        if(!SoundUtils.haveRecent("crack2")){
            let sound = SoundUtils.addSound("crack2", 0.15 * this.volumeRatio);
        }
    }
    public static touchAcorn2(){
        if(!SoundUtils.haveRecent("crack2")){
            let sound = SoundUtils.addSound("crack2", 0.15 * this.volumeRatio);
        }
    }
    

    public static simpleCellOpen(){
        let sound = Game.getInstance().sound.play("click", 0.05 * this.volumeRatio);
    }
    public static boosterSelect(){
        let sound = Game.getInstance().sound.play("click", 0.3 * this.volumeRatio);
    }
    public static inGameBoosterSelect(){
        let sound = Game.getInstance().sound.play("click", 0.3 * this.volumeRatio);
    }

    public static useCompass(){
        let sound = Game.getInstance().sound.play("compass", 0.2 * this.volumeRatio)
        Game.getInstance().add.tween(sound).to({volume: 0}, 1200, null, true, 2700);
    }
    public static useRocket(){
        let sound = Game.getInstance().sound.play("rocket", 0.05 * this.volumeRatio)
    }
    public static useVision(){
        let sound = Game.getInstance().sound.play("heartBit", 0.3 * this.volumeRatio)
    }

    public static useGlow(){
    }
    public static beanGrowing(){
    }
    public static rainbowPotionSparkle(){
    }

    public static treeSpawnCells(){
        // Game.getInstance().time.events.add(300, ()=>{
            let sound = SoundUtils.addSound("jellyBlob", 0.05 * this.volumeRatio);
        // })
    }

    public static ladybugMove(){
        Game.getInstance().time.events.add(300, ()=>{
            let sound = SoundUtils.addSound("jellyBlob", 0.02 * this.volumeRatio);
        })
        // let sound = Game.getInstance().sound.play("ladybugMoving", 0.02)
    }
    public static acornMove(){
        Game.getInstance().time.events.add(300, ()=>{
            let sound = SoundUtils.addSound("jellyBlob", 0.02 * this.volumeRatio);
        })
        // let sound = Game.getInstance().sound.play("ladybugMoving", 0.02)
    }
  

}


