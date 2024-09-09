import DiaryContentType from "../model/diary/DiaryContentType";
import ReplicaDao from "../dao/ReplicaDao";

export default class RecipeUtils{

    public static getRequiredLevel(content: DiaryContentType){
        if(content.fromLevel){
            return content.fromLevel;
        }

        if(content.fromReplica){
            let r = ReplicaDao.getEntity().getById(content.fromReplica);
            if(r){
                return r.context.level;
            }
        }

        console.error("DIARY CONTENT WITHOUT LEVEL RESTRICTION FOUND! " + content.id)
        return 0;
    }

    // public static addRecipeLayout(game: Phaser.Game, parent:BasePanel, recipe:DiaryContentType, hideProgress?:boolean):void{

    //     let title = new Label(game, 0, 0, recipe.title, Label.TASK_DESC_STYLE);
    //     title.name="title";
    //     Utils.applyPreset(title, {"spriteId":"title","x":13,"y":-508,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0,"rotation":0,"fontSize":40})
    //     parent.addSprite(title);

    //     let details = new Label(game, 0, 100, recipe.details, Label.TASK_DESC_STYLE);
    //     details.name="details";
    //     Utils.applyPreset(details, {"spriteId":"details","x":15,"y":-427,"scaleX":1,"scaleY":1,"anchorX":0.5,"anchorY":0,"rotation":0,"fontSize":40})
    //     parent.addSprite(details);

    //     let shiftYY = details.y + details.height + 100;

    //     let user = UserDao.getUser();
        
    //     recipe.requiredItems.forEach(item => {

    //         let userItem = user.getItems().filter(i => i.name == i.name).shift();
    //         let userCount = userItem? userItem.count : 0;

    //         let text = ItemUtils.getItemName(item.name);
    //         let progress = " " + (userCount) + "/" +  item.count;

    //         let label = new Label(game, 0, shiftYY, hideProgress? text : text + progress , Label.TASK_DESC_STYLE);
    //         label.anchor = new Phaser.Point(0.5, 0.5);
    //         parent.addSprite(label);

    //         // label.strokeThickness = 4;
    //         // label.addStrokeColor("#62321c",0);

    //         let image = SpriteUtils.createSprite(game, label.x - label.width/2 - 30, shiftYY, item.name);
    //         image.anchor = new Phaser.Point(0.5, 0.5);
    //         // image.scale = new Phaser.Point(1.5, 1.5);
    //         parent.addSprite(image);

    //         let statusImage = SpriteUtils.createSprite(game, label.x + label.width/2 + 37, shiftYY - 10, userCount >= item.count? "check":"cross");
    //         statusImage.anchor = new Phaser.Point(0.5, 0.5);
    //         parent.addSprite(statusImage);

    //         shiftYY += 70;
    //     });
    // }




    
}


