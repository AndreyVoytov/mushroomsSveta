import AnimationUtils from '../../../core/utils/AnimationUtils';
import Utils from '../../../core/utils/Utils';
import DiaryContentType from '../../../core/model/diary/DiaryContentType';
import Label from '../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
export default class DiaryPictureLayout extends BasePanel {

    constructor(game: Phaser.Game, recipeContent: DiaryContentType, x: number, y: number) {
        super(game, x, y, "diaryLayout", "blank");

        let bg = SpriteUtils.createSprite(this.game, 0, 0, "bookBg");
        Utils.applyPreset(bg, { "spriteId": "", "x": 49, "y": 27, "scaleX": 1.08, "scaleY": 1.04, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 })
        bg.anchor.set(0.5);
        this.addSprite(bg);

        this.inputEnabled = true;

        let title = new Label(game, 0, 0, recipeContent.title, Label.TASK_TITLE_STYLE);
        title.name = "title";
        title.lineSpacing = -15;
        Utils.applyPreset(title, { "spriteId": "title", "x": 510 - 480, "y": 130 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0, "fontSize": 53 })
        this.addSprite(title);

        let details = new Label(game, 0, 100, recipeContent.details, Label.TASK_STYLE);
        details.name = "details";
        Utils.applyPreset(details, { "spriteId": "details", "x": 516 - 480, "y": 228 - 512, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 40 })
        this.addSprite(details);


        let center = new Phaser.Point(510 - 480, 630 - 512);

        if(recipeContent.characterOverPicture && recipeContent.picture && recipeContent.centerCharacter){
            let picture = SpriteUtils.createSprite(this.game, center.x, center.y, recipeContent.picture);
            picture.anchor.set(0.5);
            this.addSprite(picture);

            let character = SpriteUtils.createSprite(game, center.x, center.y+60, recipeContent.characterOverPicture.image);
            character.anchor.set(0.5);
            let scaleY = recipeContent.characterOverPicture.scaleX || 1;
            let scaleX = recipeContent.characterOverPicture.scaleY || 1;
            character.scale.set(scaleX, scaleY)
            this.addSprite(character);

        } else if(recipeContent.characterOverPicture && recipeContent.picture && !recipeContent.centerCharacter){
            let keyAndRect = SpriteUtils.getKeyAndRect(game, recipeContent.picture);
            let bmd = game.make.bitmapData(keyAndRect.atlasRect.width, keyAndRect.atlasRect.height);

            let c = recipeContent.characterOverPicture;
            bmd.alphaMask(SpriteUtils.createBitmapData(game, recipeContent.characterOverPicture.image, c.x, c.y, c.scaleX, c.scaleY), 
                          SpriteUtils.createBitmapData(game, recipeContent.picture));

            let character = new Phaser.Sprite(this.game, center.x, center.y, bmd);
            character.anchor.set(0.5);
            this.addSprite(character);

            if(recipeContent.decorOverPicture){
                let d = recipeContent.decorOverPicture;
                let sprite = SpriteUtils.createSprite(game, center.x + d.x, center.y + d.y, d.image)
                sprite.anchor.set(0.5)
                sprite.scale.set(d.scaleX || 1, d.scaleY || 1)
                this.addSprite(sprite)
            }
        } else if (recipeContent.picture) {
            let picture = SpriteUtils.createSprite(this.game, center.x, center.y, recipeContent.picture);
            picture.anchor.set(0.5);
            this.addSprite(picture);
        }
        

    }

}