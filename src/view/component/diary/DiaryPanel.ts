import UserService from '../../../core/service/UserService';
import Utils from '../../../core/utils/Utils';
import DiaryConfiguration from '../../../core/configuration/DiaryConfiguration';
import HouseScreen from '../../screen/HouseScreen';
import BasePanel from '../../component/panel/BasePanel';
import ClosablePanel from '../../component/panel/ClosablePanel';
import DiaryMapLayout from './DiaryMapLayout';
import DiaryRecipeLayout from './DiaryRecipeLayout';
import DiaryPictureLayout from './DiaryPictureLayout';
import Label from '../../component/panel/Label';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Skewable from '../panel/Skewable';
import { Easing } from 'phaser-ce';
import SoundUtils from '../../../core/utils/SoundUtils';
export default class DiaryPanel extends ClosablePanel {
    private screen: HouseScreen;
    private layout: BasePanel;
    private pagesCount:number;    
    private arrowRight: Phaser.Button;
    private arrowLeft: Phaser.Button;

    constructor(game: Phaser.Game, screen: HouseScreen, x: number, y: number) {
        super(game, x, y, true, "diaryPanel", 1.18);
        this.screen = screen;
    }

    private initialize(currentPage?:number) {

        let user = UserService.getUser();
        let currentRecipeIndex = DiaryConfiguration.getCurrentRecipeIndex(user.getCurrentForest());
        this.pagesCount = DiaryConfiguration.getPagesCountByIndex(currentRecipeIndex);
        let recipeToDraw:DiaryContentType;

        if(currentPage){
            recipeToDraw = DiaryConfiguration.getRecipeByIndex(DiaryConfiguration.getRecipeIndexByPage(currentPage));
        } else {
            recipeToDraw = DiaryConfiguration.allRecipes[currentRecipeIndex]
            currentPage = DiaryConfiguration.getPageByIndex(currentRecipeIndex);
        }

        if(recipeToDraw.copyOf){
            recipeToDraw = DiaryConfiguration.getRecipeById(recipeToDraw.copyOf);
            currentPage = DiaryConfiguration.getPageByIndex(DiaryConfiguration.allRecipes.indexOf(recipeToDraw)); 
        }

        // let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        // Utils.applyPreset(bg, { "spriteId": "bookBg", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        // this.addSprite(bg);

        if (recipeToDraw && recipeToDraw.mapPreset) {
            this.layout = new DiaryMapLayout(this.game, recipeToDraw, 0, 0);
        } else if (recipeToDraw && recipeToDraw.picture) {
            this.layout = new DiaryPictureLayout(this.game, recipeToDraw, 0, 0);
        } else {
            this.layout = new DiaryRecipeLayout(this.game, recipeToDraw, 0, 0);
        }
        this.addSprite(this.layout)

       

        // let closeBtn = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'closeBook', () => this.close());
        let closeBtn = SpriteUtils.createSprite(this.game, this.game.width / 2 - 91, -512, 'closeBook');
        closeBtn.anchor = new Phaser.Point(1, 0);
        closeBtn.scale = new Phaser.Point(2, 2);
        Utils.applyPreset(closeBtn, { "spriteId": "", "x": 488 - 209/1.2 -27/1.18 , "y": -475+1118/1.2 + 22/1.18, "scaleX": 0.9599999999999991, "scaleY": 1.0799999999999992, "anchorX": 1, "anchorY": 0, "rotation": 0 })
        // this.addButton(closeBtn);
        this.addSprite(closeBtn);

        let closeBtn2 = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'closeButton', () => this.close());
        closeBtn2.name = "closeBtn2";
        Utils.applyPreset(closeBtn2, {"spriteId":"closeBtn2","x":313,"y":-484,"scaleX":0.9,"scaleY":0.9,"anchorX":0,"anchorY":0,"rotation":0})
        closeBtn2.tint = 0x999999;
        closeBtn2.alpha = 0.5;
        this.addButton(closeBtn2);

        let diaryArrowBg = SpriteUtils.createSprite(this.game, this.game.width / 2 - 91, -512, 'diaryArrowsBg');
        diaryArrowBg.name = "diaryArrowsBg"
        Utils.applyPreset(diaryArrowBg, {"spriteId":"diaryArrowsBg","x":10,"y":433,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addSprite(diaryArrowBg);

        this.arrowLeft = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'diaryArrowLeft', () => this.showPrevPage(currentPage));
        this.arrowLeft.name = "arrowLeft"
        Utils.applyPreset(this.arrowLeft, {"spriteId":"arrowLeft","x":-62,"y":432,"scaleX":0.9599999999999991,"scaleY":1.0799999999999992,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addButton(this.arrowLeft);
        this.arrowLeft.visible = currentPage > 1;

        this.arrowRight = SpriteUtils.createButton(this.game, this.game.width / 2 - 91, -512, 'diaryArrowLeft', () => this.showNextPage(currentPage));
        this.arrowRight.name = "arrowRight"
        Utils.applyPreset(this.arrowRight, {"spriteId":"arrowRight","x":85,"y":430,"scaleX":-0.9599999999999991,"scaleY":1.0799999999999992,"anchorX":0.5,"anchorY":0.5,"rotation":0})
        this.addButton(this.arrowRight);
        this.arrowRight.visible = currentPage < this.pagesCount;

        let pageNumber = new Label(this.game, 0, 0, "" + currentPage , Label.MAP_POINT_STYLE);
        pageNumber.name = "pageNumber";
        Utils.applyPreset(pageNumber, {"spriteId":"pageNumber","x":11,"y":412,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0,"rotation":0,"fontSize":40})
        this.addSprite(pageNumber);

        this.screen.attachForDebug(this);
    }

    public show() {
        this.showPage();
        super.show();
    }


    private pageBg0:Phaser.Sprite;
    private pageBg:Phaser.Sprite;

    public showNextPage(currentPage:number){
        this.arrowRight.inputEnabled = false;
        if (this.pageBg) this.pageBg.destroy()
        if (this.pageBg0) this.pageBg0.destroy()

        this.showPage(currentPage + 1);

        this.pageBg0 = SpriteUtils.createSprite(this.game, 0, 0, "bookPage");
        Utils.applyPreset(this.pageBg0, { "spriteId": "bookPage", "x": 49, "y": 27, "scaleX": 1.08*4/1.5, "scaleY": 1.04*4/1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        this.addSprite(this.pageBg0);
        this.game.add.tween(this.pageBg0).to({alpha: 0}, 300, Easing.Linear.None, true, 0)

        this.pageBg = new Skewable(this.game, 0, 0, "bookPage");
        Utils.applyPreset(this.pageBg, { "spriteId": "bookPage", "x": 49, "y": 27, "scaleX": 1.08*4/1.5, "scaleY": 1.04*4/1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        this.pageBg.anchor.set(0, 1);
        this.pageBg.x -= this.pageBg.width/2;
        this.pageBg.y += this.pageBg.height/2;
        this.addSprite(this.pageBg);
        this.game.add.tween(this.pageBg).to({skewY: [-2]}, 500, Easing.Linear.None, true, 0)
        this.game.add.tween(this.pageBg.scale).to({x: 0}, 500, Easing.Linear.None, true, 0)

        SoundUtils.diaryNextPage();
    }

    public showPrevPage(currentPage:number){
        this.arrowLeft.inputEnabled = false;
        if (this.pageBg) this.pageBg.destroy()
        if (this.pageBg0) this.pageBg0.destroy()

        this.pageBg = new Skewable(this.game, 0, 0, "bookPage");
        Utils.applyPreset(this.pageBg, { "spriteId": "bookPage", "x": 49, "y": 27, "scaleX": 1.08*4/1.5, "scaleY": 1.04*4/1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        this.pageBg.anchor.set(0, 1);
        this.pageBg.x -= this.pageBg.width/2;
        this.pageBg.y += this.pageBg.height/2;
        this.addSprite(this.pageBg);
        this.game.add.tween(this.pageBg).from({skewY: -2}, 500, Easing.Linear.None, true, 0)
        this.game.add.tween(this.pageBg.scale).from({x: 0}, 500, Easing.Linear.None, true, 0)
        
        this.game.time.events.add(500, () => {
            this.showPage(currentPage - 1);
            this.pageBg0 = SpriteUtils.createSprite(this.game, 0, 0, "bookPage");
            Utils.applyPreset(this.pageBg0, { "spriteId": "bookPage", "x": 49, "y": 27, "scaleX": 1.08*4/1.5, "scaleY": 1.04*4/1.5, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
            this.addSprite(this.pageBg0);
            this.game.add.tween(this.pageBg0).to({alpha: 0}, 200, Easing.Linear.None, true, 0)
            this.game.add.tween(this.pageBg).to({alpha: 0}, 200, Easing.Linear.None, true, 0)

        })

        SoundUtils.diaryPrevPage();
    }

    private showPage(page?:number) {
        if (this.layout) {
            this.layout.onKill();
            this.layout.destroy(true);
        }
        this.children.forEach(c => {
            if(c instanceof Phaser.Sprite){
                c.destroy(true);
            }
        });
        this.initialize(page)
    }

    protected onClose() {
        this.screen.showUI();
    }

    protected onShow() {
        this.screen.hideUI();
    }

}