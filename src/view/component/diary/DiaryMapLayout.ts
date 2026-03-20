import GameText from '../../../core/localization/GameText';
﻿import Utils from '../../../core/utils/Utils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Label from '../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import UserService from '../../../core/service/UserService';
import RecipeUtils from '../../../core/utils/RecipeUtils';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import EditorService from '../../../core/service/EditorService';
import HouseScreen from '../../screen/HouseScreen';
import Preset from '../../game/Preset';
import { TimerEvent, Easing } from 'phaser-ce';
import AnimationUtils from '../../../core/utils/AnimationUtils';
import ReplicasConfiguration from '../../../core/configuration/ReplicasConfiguration';
import Skewable from '../panel/Skewable';
import AdminService from '../../../core/service/AdminService';
import LocalizationService from '../../../core/localization/LocalizationService';
export default class DiaryMapLayout extends BasePanel {

    private mapContent: DiaryContentType;

    constructor(game: Phaser.Game,  mapContent: DiaryContentType, x: number, y: number) {
        super(game, x, y, "diaryLayout");
        this.mapContent = mapContent;

        let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        bg.name = "pageBg";
        Utils.applyPreset(bg, { "spriteId": "bookBg", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        this.addSprite(bg);

        this.inputEnabled = true;
        const titleText = LocalizationService.get(mapContent.title);

        let title = new Label(game, 0, 0, titleText, { font: "bold 45px Bookman Old Style", fill: "#000000", fontStyle: "italic", align: "center", wordWrap: true, wordWrapWidth: 430 });
        title.name = "title";
        title.lineSpacing = -15;
        Utils.applyPreset(title, { "spriteId": "title", "x": 510 - 480, "y": 130 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 53 })
        this.addSprite(title);

        let preset = mapContent.mapPreset? mapContent.mapPreset.preset: [];
        let notes = mapContent.mapPreset? mapContent.mapPreset.notes: [];

        let localPreset = this.getLocalPreset();
        preset = localPreset || preset;

        let textIndex = 0;
        preset.forEach(p => {
            this.objectIds.forEach(oid => {
                let parts = p.spriteId.split("_");
                if (p.spriteId == oid || (parts.length > 1 && parts[0] == oid)) {
                    let obj = SpriteUtils.createSprite(this.game, 0, 0, oid);
                    obj.name = p.spriteId;
                    this.addSprite(obj);

                    if (parts.length > 1 && parts[0].startsWith("mapAim")) {
                        let number = new Label(this.game, 0, 0, parts[1], { font: "bold 40px DiaryDigits", fill: "#000000" })
                        number.anchor.set(0.5);
                        obj.addChild(number);
                    }

                    if(!AdminService.isEditMode()){
                        //CacheAsBitmap=true for map performance, so no animations
                        // this.cacheAsBitmap = true;

                        // if(parts.length > 1 && parts[0] == "fog"){
                        //     this.game.time.events.add(100, ()=>{
                        //         this.game.add.tween(obj).to({x: obj.x + 30}, 4000, Easing.Linear.None, true, Utils.random(1000), -1, true)
                        //     })
                        //     obj.alpha = 0.8;
                        // }

                        // if(parts.length > 1 && parts[0] == "jellyMushroomSmall"){
                        //     this.game.time.events.add(100, ()=>{
                        //         AnimationUtils.jelly(game, obj, Utils.random(5000), false);
                        //     })
                        // }
                    } else {
                        if (parts.length > 1 && parts[0] == "mapPoint") {
                            let number = new Label(this.game, 0, 0, parts[1], { font: "bold 24px DiaryDigits", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 })
                            number.anchor.set(0.5);
                            obj.addChild(number);
                        }
                    }
                }
            })

            if (p.spriteId.indexOf("text") != -1 && notes.length > 0) {
                const noteText = LocalizationService.get(notes[textIndex]);
                let obj = new Label(this.game, 0, 0, noteText, { font: "bold 20px Bookman Old Style", fill: "#051e82", fontStyle: "italic", align: "center"/*, wordWrap: true, wordWrapWidth: 160*/ });
                textIndex ++;
                obj.lineSpacing = -10;
                obj.name = p.spriteId;
                this.addSprite(obj);
            }
        })

        this.applyPreset(preset);

        //РґРІРёРіР°РµРј РїРµСЂСЃРѕРЅР°Р¶Р° РїРѕ РєР°СЂС‚Рµ
        let characterMap = preset.filter(p => p.spriteId == "character").shift();
        if(characterMap){
            let userLevel = UserService.getUser().getCurrentForest()
            let currentPosition = Math.max(0, userLevel - RecipeUtils.getRequiredLevel(mapContent))// + 1;

            let ignoreIntervals = mapContent.mapPreset.ignoreReplicaIntervals;
            if(ignoreIntervals){
                ignoreIntervals.forEach(i => {
                    let fromReplica = ReplicasConfiguration.allReplicas.filter(r => r.id == i.from).shift();
                    let toReplica = ReplicasConfiguration.allReplicas.filter(r => r.id == i.to).shift();

                    if(fromReplica && toReplica){
                        let intervalStart = fromReplica.context.level;
                        let intervalEnd = toReplica.context.level;

                        if(userLevel >= intervalStart && userLevel >= intervalEnd){
                            currentPosition -= intervalEnd - intervalStart;
                        } else if (userLevel > intervalStart && userLevel < intervalEnd){
                            currentPosition -= userLevel - intervalStart;
                        }
                    }
                })
            }
            
            
            let charX = characterMap.x;
            let charY = characterMap.y;



            //usual map
            preset.filter(p => p.spriteId == ("mapAim_" + currentPosition)).forEach(p => {
                if(currentPosition != 1){
                    charX = p.x;
                    charY = p.y - 35;
                }
            })

            //long map
            preset.filter(p => p.spriteId == ("mapPoint_" + currentPosition)).forEach(p => {
                if(currentPosition != 1){
                    charX = p.x;
                    charY = p.y - 35;
                }
            })

            let char = SpriteUtils.createSprite(this.game, 0,0, "character");
            char.name = "character";
            this.addSprite(char);
            Utils.applyPreset(char,  {"spriteId":"character","x":charX,"y":charY,"scaleX":1.44,"scaleY":1.4,"anchorX":0.5,"anchorY":0.5,"rotation":0});
        }

        //РєРѕРјРїР°СЃ
        let compassMap = preset.filter(p => p.spriteId == "compassMap").shift();
        if(compassMap){
            let delta = 10;
            let w = 190 * compassMap.scaleX;
            let h = 180 * compassMap.scaleY;
            let compassLetters = GameText.compassLetters()
            let l1 = new Label(this.game, compassMap.x, compassMap.y + h/2 + delta, compassLetters.south, Label.MAP_POINT_STYLE2)
            let l2 = new Label(this.game, compassMap.x, compassMap.y -h/2 - delta, compassLetters.north, Label.MAP_POINT_STYLE2)
            let l3 = new Label(this.game, compassMap.x-w/2 - delta, compassMap.y, compassLetters.west, Label.MAP_POINT_STYLE2)
            let l4 = new Label(this.game, compassMap.x+w/2 + delta, compassMap.y, compassLetters.east, Label.MAP_POINT_STYLE2)
            l1.anchor.set(0.5, 0.35)
            l2.anchor.set(0.5, 0.35)
            l3.anchor.set(0.5, 0.35)
            l4.anchor.set(0.5, 0.35)
            this.addSprite(l1)
            this.addSprite(l2)
            this.addSprite(l3)
            this.addSprite(l4)
        }

        if(AdminService.isEditMode()){
            preset.forEach(p => {
                let parts = p.spriteId.split("_");
                if(parts.length > 1 && Number(parts[1]) >= this.counter){
                    this.counter = Number(parts[1]) + 1; 
                }
            })

            let button  = SpriteUtils.createButton(this.game, 200, this.game.height/2 - 150, "renameButton", ()=> {
                EditorService.showSimpleList("Add image", this.objectIds, (value:string) => {
                    let sprite = SpriteUtils.createSprite(game, 0, 0, value)
                    sprite.name = value +"_"+ this.counter;
                    this.counter ++;
                    sprite.anchor.set(0.5);
                    this.addSprite(sprite);
                    (<HouseScreen>(this.game.state.getCurrentState())).attachForDebug(this);
                })
            })
            button.anchor.set(0.5)
            this.addChild(button);

            let buttonDelete  = SpriteUtils.createSprite(this.game, 200 + 100, this.game.height/2 - 150, "editorPlusButton");
            buttonDelete.anchor.set(0.5)
            buttonDelete.angle = 45;
            this.addChild(buttonDelete);

            let refreshButton  = SpriteUtils.createButton(this.game, 200 - 100, this.game.height/2 - 150, "resetIcon", ()=>{
                this.setLocalPreset(null);
                window.location.reload(); 
            });
            refreshButton.anchor.set(0.5)
            this.addChild(refreshButton);

            this.debugLoop2 = this.game.time.events.loop(300, ()=>{
                let selected = (<HouseScreen>(this.game.state.getCurrentState())).selected;

                if(selected && selected instanceof Phaser.Sprite && Utils.dist(selected.x, selected.y, buttonDelete.x, buttonDelete.y) < 100){
                    selected.destroy();
                    this.removeChild(selected);
                    (<HouseScreen>(this.game.state.getCurrentState())).selected = null;
                }
            })

            this.debugLoop = this.game.time.events.loop(1000, ()=>{
                this.setLocalPreset(JSON.stringify(Utils.presetOfPanel(this)))
            });

            let downloadButton  = SpriteUtils.createButton(this.game, 200 - 400, this.game.height/2 - 150, "exportIcon", ()=>{
                var element = document.createElement('a');
                // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(Utils.presetOfPanel(this), null, "\t"));
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(Utils.presetOfPanel(this)));
                element.setAttribute('download', "mapPreset_" + this.mapContent.id);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            });
            downloadButton.anchor.set(0.5)
            this.addChild(downloadButton);

            
        }
    }

    private debugLoop:TimerEvent;
    private debugLoop2:TimerEvent;
    public onKill():void{
        if(this.debugLoop){
            this.debugLoop.timer.remove(this.debugLoop);
        }
        if(this.debugLoop2){
            this.debugLoop2.timer.remove(this.debugLoop2);
        }
    }

    private getLocalPreset():Preset[]{
        if(!AdminService.isEditMode()){
            return null;
        }

        let item = localStorage.getItem("mmap_"+this.mapContent.id);

        if(!item){
            return null;
        }

        return JSON.parse(item);
    }

    private setLocalPreset(content:string):void{
        if(!content){
            localStorage.setItem("mmap_"+this.mapContent.id,null);
        } else {
            localStorage.setItem("mmap_"+this.mapContent.id, JSON.stringify(Utils.presetOfPanel(this)))
        }
    }


    private counter = 100;

    private objectIds = [
        'mapBirch', 'mapMountain', 'mapPine', 'evilTree', 'evilTreeSecond','evilTreeThird', 'mapTent', 'campfireSmall',

        'mapPath', 'mapAim', 'mapAimSecond', 'mapAimThird', 'mapAimFourth', 'mapPoint', 

        'stone', 'log', 'mapMushroom', 'jellyMushroomSmall', 'hive', 'wlilly1', 'wlilly2', 'wheat', 'moonflower', 'acorn', 'boat', 
        'flowersMap', 'flowersSecondMap', 'flowersThirdMap', 'snowflake1', 'snowflake2','snowflake3',

        'mapPointer', 'mapHouse', 'mapCat', 'catSad', 'compassMap', 'mountainGlow',

        'fog', 'darkGrassMap','waterMap', 'snowMap',

        'bet', 'butterfly', 'fish', 'hedgehog', 'owl', 'owlFlying', 'rabbit', 'ship'
];

        
}
