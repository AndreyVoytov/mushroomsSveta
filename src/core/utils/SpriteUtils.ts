// import CustomizationType from "../model/enum/CustomizationType";
// import AnalyticUtils from "./AnalyticUtils";
import LoadingScreen from "../../view/screen/LoadingScreen";
import Settings from "../service/Settings";
import Game from "../../view/game/Game";
import { BitmapData } from "phaser-ce";

export default class SpriteUtils {

    public static images: {key:string, path:string}[] = [];
    public static atlases: string[] = [];
    private static tintedTextures: {id:string, texture: Phaser.RenderTexture}[] = [];

    public static createSprite(game: Phaser.Game, x:number, y:number, key:string, name?:string):Phaser.Sprite{
        let keyAndFrame = this.getAtlasKeyAndFrame(game, key);
        let res = new Phaser.Sprite(game, x, y, keyAndFrame.atlasKey, keyAndFrame.frameName);
        if(name) {
            res.name = name;
        }
        return res;
    }

    public static createButton(game: Phaser.Game, x:number, y:number, key:string, callback:()=>void, name?:string):Phaser.Button{
        let keyAndFrame = this.getAtlasKeyAndFrame(game, key);
        let res = new Phaser.Button(game, x, y, keyAndFrame.atlasKey,  callback, keyAndFrame.frameName, keyAndFrame.frameName, keyAndFrame.frameName, keyAndFrame.frameName);
        res.events.onInputOver.removeAll();

        res.input.useHandCursor = false;
        if(name) {
            res.name = name;
        }
        return res;
    }

    public static createTileSprite(game: Phaser.Game, x:number, y:number, width:number, height:number, key:string):Phaser.TileSprite{
        let keyAndFrame = this.getAtlasKeyAndFrame(game, key);
        return new Phaser.TileSprite(game, x, y, width, height, keyAndFrame.atlasKey, keyAndFrame.frameName);
    }

    public static loadTexture(sprite:Phaser.Sprite, texture:string){
        sprite.loadTexture(SpriteUtils.key(texture), SpriteUtils.frame(texture))
    }
    public static loadTextureForButton(button:Phaser.Button, texture:string){
        button.loadTexture(SpriteUtils.key(texture), SpriteUtils.frame(texture))
    }

    public static key(imageKey:string):string{
        return this.getAtlasKeyAndFrame(Game.getInstance(), imageKey).atlasKey;
    }

    public static frame(imageKey:string):string{
        return this.getAtlasKeyAndFrame(Game.getInstance(), imageKey).frameName;
    }

    public static getAtlasKeyAndFrame(game: Phaser.Game, imageKey:string):{atlasKey:string, frameName:string}{
        if(!Settings.isGraphicsFromAtlases()){
            return {atlasKey: imageKey, frameName:undefined}; 
        }

        let image = this.images.filter(i => i.key == imageKey).shift();
        let frame = image? image.path : "";

        if(frame.startsWith("assets/")){
            frame = frame.substring(7);
        }

        let atlasName = "";
        this.atlases.forEach(name => {
            // console.log("atlasName: " + name)
            if(game.cache.getFrameData(name) && game.cache.getFrameData(name).checkFrameName(frame)){
                atlasName = name;
                return;
            }
        })

        if(atlasName == ""){
            return {atlasKey: imageKey, frameName:undefined}; 
        }

        return {atlasKey: atlasName, frameName:frame};
    }

    public static createBitmapData(game: Phaser.Game, imageKey:string, shiftX?:number, shiftY?:number, scaleX?:number, scaleY?:number):Phaser.BitmapData{
        scaleX = scaleX || 1;
        scaleY = scaleY || 1;
        shiftX = shiftX || 0;
        shiftY = shiftY || 0;
        let sprite = SpriteUtils.createSprite(game, 0, 0, imageKey);
        let offset = sprite.texture.trim? {x:sprite.texture.trim.x, y:sprite.texture.trim.y} : {x:0, y:0};
        // console.log(imageKey + ": " + offset.x + " " + offset.y)

        let bmd = game.make.bitmapData(sprite.width*scaleX + shiftX, sprite.height*scaleY + shiftY);
        bmd.draw(sprite, shiftX - offset.x, shiftY - offset.y, sprite.width*scaleX - offset.x, sprite.height*scaleY - offset.y)
        // console.log(sprite.offsetX)

        return bmd;
    }

    // https://www.html5gamedevs.com/topic/6769-display-imageframe-from-atlas-within-bitmapdata/
    // private drawTextureOnBitmapContext(texture:PIXI.Texture, context:CanvasRenderingContext2D):void{
    //     let offset;    
    //     let trim =  texture.trim;
    //     if(trim){      
    //         offset = {x: trim.x, y: trim.y} 
    //     }else{     
    //             offset = {x: 0, y:0}  
    //     }       
        
    //     context.drawImage(texture.baseTexture.source, texture.frame.x, texture.frame.y, texture.frame.width,texture.frame.height,offset.x,offset.y,texture.frame.width,texture.frame.height);
    // }
        

    
    public static getKeyAndRect(game:Phaser.Game, imageKey:string):{atlasKey:string, atlasRect:Phaser.Rectangle}{
        let keyAndFrame = this.getAtlasKeyAndFrame(game, imageKey);
        var frame =  Settings.isGraphicsFromAtlases()? game.cache.getFrameData(keyAndFrame.atlasKey).getFrameByName(keyAndFrame.frameName) 
                : game.cache.getImage(imageKey);	
        var area = new Phaser.Rectangle(frame.x, frame.y, frame.width, frame.height);	

        return {atlasKey: keyAndFrame.atlasKey, atlasRect:area}
    }

    public static createSpriteWithTint(game: Phaser.Game, x:number, y:number, key:string, color:number, name?:string):Phaser.Sprite{
        let textureKey =  key + color;
        let textureWithKey = SpriteUtils.tintedTextures.find(t => t.id == textureKey);  
        let texture = textureWithKey? textureWithKey.texture : null;     
                
        if(!texture){
            let sprite = SpriteUtils.createSprite(game, 0,0,key);
            sprite.tint = color;
            texture = sprite.generateTexture();
            SpriteUtils.tintedTextures.push({id: textureKey, texture:texture});
        }

        let res = new Phaser.Sprite(game, x, y, texture);
        if(name) res.name = name;

        // SpriteUtils.checkAtlasMatchScreen(game, key)    
        // SpriteUtils.saveObjectForAtlasDebug(key,res);  
        return res;
    }
}