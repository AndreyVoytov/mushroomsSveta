import Utils from './../../../core/utils/Utils';
import ForestItemType from '../../../core/model/forest/ForestItemType';
import ForestType from '../../../core/model/forest/ForestType';
import Label from './../../component/panel/Label';
import BasePanel from '../../component/panel/BasePanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import EditorScreen from '../../screen/EditorScreen';
import { ContentType, ItemContents } from '../../../core/model/enum/ContentType';
import ForestUtils from './../../../core/utils/ForestUtils';
export default class EditorContentPanel extends BasePanel {

    //TODO make enum
    public static CONTENT_TYPES = [/*"smth"*/"mushroom", "lavanda","lilly","amber","blackberry", "cankerberry", "blueberry", "redberry", "pearl", "rabbit", "chamomileSmall", "acorn",
                                   "jellyMushroom", "honey", "hex", "book3", "moonflower", "darkStump"]
                                //    .concat(Utils.enumKeys(ItemContents).filter(
                                //        c => c != ItemContents[ItemContents.randomItem] && c != ItemContents[ItemContents.specificItem]
                                       
                                //        //это надо выкинуть
                                //        && c != ItemContents[ItemContents.witchMushroom2] && c != ItemContents[ItemContents.poleno]
                                //        && c != ItemContents[ItemContents.t1] && c != ItemContents[ItemContents.t24]
                                //        && c != ItemContents[ItemContents.t25] && c != ItemContents[ItemContents.t27]
                                //        && c != ItemContents[ItemContents.yellowLilly] && c != ItemContents[ItemContents.randomItem]

                                //        ));

        // "amanita", "mushroom", "mushroom3", "witchMushroom", "lavanda", "lilly",  "strawberry", "blackberry", "poleno", 
        // "t1", "t24", "t25", "t27", "wheat", "goldRoot",

    // ];
    public static MAX_STEPS_TYPE = "maxSteps";
    public static STEPS_TYPE = "steps";
    public static BUSHES_TYPE = "bushes";

    private count: Label;
    public item: string;
    public onPLus: (current:number) => number;
    private onMinus: (current:number) => number;

    constructor(game: Phaser.Game, screen:EditorScreen, x: number, y: number, forestType: ForestType, item: string, onPlus?: (current:number) => number, onMinus?: (current:number) => number) {
        super(game, x, y, "blank");
        this.item = item;
        this.onPLus = onPlus;
        this.onMinus = onMinus;

        let objectBg = this.attachUI("objectBg")
        objectBg.alpha = 0.5;

        if (this.game.height < 1550) {
            this.scale.set(0.9)
        }

        let itemSprite = this.attachUI(item, "item")
        
        this.count = new Label(this.game, 0, 0, "" + this.getValueFromForestType(forestType), Label.BalsamiqSansBoldBold(35))
        this.count.name = "itemCount"
        if (this.getValueFromForestType(forestType) == 0) {
            this.alpha = 0.5;
        }
        this.addSprite(this.count)
       

        this.getValueFromForestType(forestType);

        let arrowLeft = SpriteUtils.createButton(this.game, 0, 0, "arrowEditor", () => {
            if (onMinus) {
                this.updateLabel(onMinus(Number(this.count.text)));
            } else {
                this.updateLabel(Number(this.count.text) - 1)
            }
            this.applyToForestType(screen.forestType);
            screen.redrawCells();
        });
        arrowLeft.anchor.set(0.5)
        arrowLeft.name = "arrowLeft"
        this.addButton(arrowLeft);

        let arrowRight = SpriteUtils.createButton(this.game, 0, 0, "arrowEditor", () => {
            if (onPlus) {
                this.updateLabel(onPlus(Number(this.count.text)));
            } else {
                this.updateLabel(Number(this.count.text) + 1)
            }
            this.applyToForestType(screen.forestType);
            screen.redrawCells();
        });
        arrowRight.anchor.set(0.5)
        arrowRight.name = "arrowRight"
        this.addButton(arrowRight);

        if(item =="maxSteps"){
            this.count.tint = 0x0000FF;
            arrowLeft.tint = 0x0000FF;
            arrowRight.tint = 0x0000FF;
            objectBg.alpha = 0;
        }

        this.applyPreset([{ "spriteId": "objectBg", "x": 4, "y": 16, "scaleX": 1.3000000000000003, "scaleY": 1.08, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "arrowLeft", "x": -43, "y":  52, "scaleX": -0.4400000000000007, "scaleY": 0.47999999999999954, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "arrowRight", "x": 40, "y": 52, "scaleX": 0.4399999999999995, "scaleY": 0.4599999999999995, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "item", "x": 0, "y": 3, "scaleX": 1, "scaleY": 0.96, "anchorX": 0.5, "anchorY": 0.5, "rotation": 0 },
        { "spriteId": "itemCount", "x": -3, "y": 33, "scaleX": 1, "scaleY": 1, "anchorX": 0.5, "anchorY": 0, "rotation": 0, "fontSize": 35 }])

        if(itemSprite.width > 150){
            console.log("item detected: " + item)
            itemSprite.scale.set(150/itemSprite.width, 150/itemSprite.width)
        }
    }

    // public refresh() {
    //     // console.log("CONTENT PANEL REFRESH! " + this.count.text + " " + (this.onPLus ? "onPlus" : null))
    //     if (Number(this.count.text) > 0 && this.onPLus) {
    //         this.updateLabel(this.onPLus(Number(this.count.text)));
    //     }
    // }

    public updateLabel(newCount: number) {
        if (newCount <= 0) {
            this.alpha = 0.5;
            this.count.text = "" + 0;
        } else {
            this.alpha = 1;
            this.count.text = "" + newCount;
        }
    }

    public getCount(): number {
        return Number(this.count.text);
    }


    //TODO refactor! (put shells, moonflower, bushes, books into items)
    private applyToForestType(forestType: ForestType) {
        // if (this.count.text == "0") {
        //     return;
        // }
        // console.log("applyToForest on bushes: " + forestType.bushes)

        if(!forestType.interactiveItems){
            forestType.interactiveItems = [];
        }

        console.log(forestType)
        let toDelete = forestType.items.filter(i => i.name == this.item).shift();
        Utils.delete(forestType.items, toDelete);

        if (this.item == "chamomileSmall") {
            forestType.flowers = Number(this.count.text);
        } else if (this.item == "rabbit") {
            forestType.bonuses = Number(this.count.text);
        } else if (Utils.enumKeys(ItemContents).indexOf(this.item) != -1){
        // } else if (this.item.indexOf("mushroom") != -1 || this.item == "witchMushroom" || this.item == "amanita" ||
        //     this.item == "lilly" || this.item == "lavanda" || this.item == "poleno" || this.item == "strawberry" || this.item == "blackberry"
        //      || this.item == "t1" || this.item == "t24" || this.item == "t25" || this.item == "t27" || this.item == "wheat" || this.item == "goldRoot") {
            let item = new ForestItemType();
            item.count = Number(this.count.text)
            item.name = this.item;
            forestType.items.push(item)
        // } else if (this.item.indexOf("Hex") != -1) {
        //     let item = new ForestItemType();
        //     item.count = Number(this.count.text)
        //     item.name = this.item;
        //     // item.special = true;
        //     forestType.items.push(item)
        } else if (this.item == "steps") {
            forestType.steps = Number(this.count.text)
        } else if (this.item == "maxSteps") {
            if(Number(this.count.text) == forestType.steps){
                forestType.maxSteps = null;
            } else {
                forestType.maxSteps = Number(this.count.text)
            }
        } else if (this.item == "bushes") {
            forestType.bushes = Number(this.count.text)
            // console.log("on bushes")
            // console.log(forestType)
        } else if (this.item == "cankerberry") {
            forestType.cankerberries = Number(this.count.text);
        } else if (this.item == "blueberry") {
            let bush2 = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush2])
            if(bush2) Utils.delete(forestType.interactiveItems, bush2);

            if(Number(this.count.text)/ForestUtils.AVG_BERRIES_ON_BUSH != 0){
                if(!forestType.interactiveItems){
                    forestType.interactiveItems = [];
                }
                let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush2]);
                if(!item){
                    item = new ForestItemType();
                    forestType.interactiveItems.push(item);
                }
                item.count = Math.floor(Number(this.count.text)/ForestUtils.AVG_BERRIES_ON_BUSH);
                item.name = ContentType[ContentType.bush2];
            }
        } else if (this.item == "redberry" ) {
            let bush = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush])
            if(bush) Utils.delete(forestType.interactiveItems, bush);

            if(Number(this.count.text)/ForestUtils.AVG_BERRIES_ON_BUSH != 0){
                let item = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush]);
                if(!item){
                    item = new ForestItemType();
                    forestType.interactiveItems.push(item);
                }
                item.count = Math.floor(Number(this.count.text)/ForestUtils.AVG_BERRIES_ON_BUSH);
                item.name = ContentType[ContentType.bush];
            }
        } else if (this.item == "pearl") {
            let toDelete2 = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.shell]);
            Utils.delete(forestType.interactiveItems, toDelete2);

            console.log("editor count: " + this.count.text)

            if(Number(this.count.text) != 0){
                let item = new ForestItemType();
                item.count = Number(this.count.text);
                item.name = ContentType[ContentType.shell];
                forestType.interactiveItems.push(item);
            }
        } else if (this.item == "moonflower") {
            if(forestType.interactiveItems){
                let toDelete2 = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.moonflowerClosed]);
                Utils.delete(forestType.interactiveItems, toDelete2);
            }

            if(Number(this.count.text) != 0){
                let item = new ForestItemType();
                item.count = Number(this.count.text);
                item.name = ContentType[ContentType.moonflowerClosed];
                forestType.interactiveItems.push(item);
            }
        } else if (this.item == "acorn") {
            forestType.acorns = Number(this.count.text);
        } else if (this.item == "jellyMushroom") {
            forestType.jellyMushrooms = Number(this.count.text);
        } else if (this.item == "honey") {
            forestType.honey = Number(this.count.text);
        } else if (this.item == "hex") {
            forestType.cellsToSpawn = Number(this.count.text);
        } else if (this.item == "book3" && Number(this.count.text) != 0) {
            if(forestType.interactiveItems){
                let toDelete2 = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.book1]);
                Utils.delete(forestType.interactiveItems, toDelete2);
                let toDelete3 = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.lockpick]);
                Utils.delete(forestType.interactiveItems, toDelete3);
            }

            if(Number(this.count.text) != 0){
                let item = new ForestItemType();
                item.count = Number(this.count.text);
                item.name = ContentType[ContentType.book1];
                forestType.interactiveItems.push(item);
                let item2 = new ForestItemType();
                item2.count = Number(this.count.text);
                item2.name = ContentType[ContentType.lockpick];
                forestType.interactiveItems.push(item);
            }
            
        } else if (this.item == "darkStump") {
            forestType.darkStump = Number(this.count.text) > 0;
        } else if (this.item == "smth"){
            forestType.randomItems = Number(this.count.text)
            console.log("randomItems: " + forestType.randomItems)
        }
    }

    private getValueFromForestType(forestType: ForestType): number {
        if (this.item == "chamomileSmall") {
            return forestType.flowers || 0;
        } else if (this.item == "rabbit") {
            return forestType.bonuses || 0;
        } else if (Utils.enumKeys(ItemContents).indexOf(this.item) != -1){
        // } else if (this.item.toLowerCase().indexOf("mushroom") != -1 || this.item == "witchMushroom" || this.item == "amanita" ||
        //     this.item == "lilly" || this.item == "lavanda" || this.item == "poleno" || this.item == "strawberry" || this.item == "blackberry"
        //     || this.item == "t1" || this.item == "t24" || this.item == "t25" || this.item == "t27" || this.item == "wheat" || this.item == "goldRoot") {
            return forestType.items.filter(i => i.name == this.item).map(i => i.count).shift() || 0;
        // } else if (this.item.indexOf("Hex") != -1) {
        //     return forestType.items.filter(i => i.name == this.item).map(i => i.count).shift() || 0;
        } else if (this.item == "steps") {
            return forestType.steps;
        } else if (this.item == "maxSteps") {
            return forestType.maxSteps || forestType.steps;
        } else if (this.item == "bushes") {
            return forestType.bushes || 2;
        } else if (this.item == "cankerberry") {
            return forestType.cankerberries || 0;
        } else if (this.item == "blueberry") {
            if(!forestType.interactiveItems){
                return 0;
            }
            let itm = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush2]);
            return itm? itm.count * ForestUtils.AVG_BERRIES_ON_BUSH : 0;
        } else if (this.item == "redberry") {
            if(!forestType.interactiveItems){
                return 0;
            }
            let itm = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.bush]);
            return itm? itm.count * ForestUtils.AVG_BERRIES_ON_BUSH : 0;
        } else if (this.item == "pearl") {
            if(!forestType.interactiveItems){
                return 0;
            }
            let itm = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.shell]);
            return itm? itm.count : 0;
        } else if (this.item == "acorn") {
            return forestType.acorns || 0;
        } else if (this.item == "jellyMushroom") {
            return forestType.jellyMushrooms || 0;
        } else if (this.item == "honey") {
            return forestType.honey || 0;
        } else if (this.item == "hex") {
            return forestType.cellsToSpawn || 0;
        } else if (this.item == "book3") {
            if(!forestType.interactiveItems){
                return 0;
            }
            let itm = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.book1]);
            return itm? itm.count : 0;
        } else if (this.item == "moonflower") {
            if(!forestType.interactiveItems){
                return 0;
            }
            let itm = forestType.interactiveItems.find(i => i.name == ContentType[ContentType.moonflowerClosed]);
            return itm? itm.count : 0;
        } else if (this.item == "smth"){
            return forestType.randomItems || 0;
        } else if (this.item == "darkStump"){
            return forestType.ladybugs && forestType.ladybugs.length > 0 && forestType.darkStump ? 1 : 0;
        }
    }

    private attachUI(spriteId: string, name?: string): Phaser.Sprite {
        let sprite = SpriteUtils.createSprite(this.game, 0, 0, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addSprite(sprite);
        return sprite;
    }
}