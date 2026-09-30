
import SpriteUtils from '../../../core/utils/SpriteUtils';
import DebugScreen from '../../screen/common/DebugScreen';
import Utils from './../../../core/utils/Utils';
import Preset from './../../game/Preset';
export default class TreesPart extends Phaser.Group {

    private static textureCache: { [key: string]: { game: Phaser.Game; texture: Phaser.RenderTexture; x: number; y: number } } = {};

    constructor(game: Phaser.Game, name:string, tintHarder?:boolean, useClover?:boolean) {
        super(game);
        this.name = name;
        this.game = game;
        this.visible = false;

        const textureKey = (useClover ? 'clover' : 'forest') + (tintHarder ? '_hard' : '_soft');
        const cachedTexture = TreesPart.textureCache[textureKey];
        if (!DebugScreen.DEBUG_MODE && cachedTexture && cachedTexture.game === game) {
            this.addTextureSprite(cachedTexture.texture, cachedTexture.x, cachedTexture.y);
            return;
        }

        let b1 = this.attachSprite(useClover ? "bushClover" : "bushes", "bushes1")
        let b2 = this.attachSprite(useClover ? "bushClover" : "bushes", "bushes2")
        let lakeHeaderDecor = this.attachSprite("lakeHeaderDecor", "lakeHeaderDecor", 0x114411)
        let b3 = this.attachSprite(useClover ? "bushClover" : "bushes", "bushes3")
        let b4 = this.attachSprite(useClover ? "bushCloverDark" : "bushDark", "bushes4")
        if(tintHarder){
            let lakeHeaderDecor2 = this.attachSprite("lakeHeaderDecor", "lakeHeaderDecor", 0x114411)
            lakeHeaderDecor2.alpha = 0.5;
        }

        this.applyPreset([{"spriteId":"bushes1","x":134.06896551724128,"y":406.3584710743801,"scaleX":1.8027586206896555/1.5,"scaleY":1.637556818181818/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0.9900000000000007},
        {"spriteId":"bushes2","x":342.6206896551722,"y":244.07128099173553,"scaleX":1.7117241379310344/1.5,"scaleY":1.637556818181818/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":1.1453793103448275},
        {"spriteId":"bushes3","x":99.31034482758606,"y":411.32644628099155,"scaleX":1.85790457532576/1.5,"scaleY":2.0423211348117913/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":0.3508965517241375},
        {"spriteId":"bushes4","x":215.17241379310343,"y":197.70351239669412,"scaleX":1.9517241379310346/1.5,"scaleY":1.8942355371900828/1.5,"anchorX":0.5,"anchorY":0.5,"rotation":1.390344827586207},
        {"spriteId":"lakeHeaderDecor","x":331.6551724137931,"y":311.2159090909091,"scaleX":12.579999999999991,"scaleY":14.379999999999963,"anchorX":0.5,"anchorY":0.5,"rotation":-1.5700000000000012},
        {"spriteId":"lakeHeaderDecor2","x":331.6551724137931,"y":311.2159090909091,"scaleX":18.579999999999991,"scaleY":22.379999999999963,"anchorX":0.5,"anchorY":0.5,"rotation":-1.5700000000000012}
    ])

        if (useClover) {
            this.attachSprite("bushClover2", "cloverAccent");
            this.attachSprite("bushCloverDark2", "cloverAccentDark");
            this.applyPreset([
                {"spriteId":"cloverAccent","x":370,"y":345,"scaleX":2,"scaleY":2,"anchorX":0.5,"anchorY":0.5,"rotation":0.4},
                {"spriteId":"cloverAccentDark","x":130,"y":300,"scaleX":2,"scaleY":2,"anchorX":0.5,"anchorY":0.5,"rotation":-0.3}
            ]);
        }

        //TODO оптимизация производительности
        if (!DebugScreen.DEBUG_MODE) {
            const bounds = this.getLocalBounds();
            this.visible = true;
            const texture = this.generateTexture(1, Phaser.scaleModes.DEFAULT, this.game.renderer);
            this.visible = false;

            TreesPart.textureCache[textureKey] = { game: game, texture: texture, x: bounds.x, y: bounds.y };
            this.removeAll(true);
            this.addTextureSprite(texture, bounds.x, bounds.y);
        }

    }

    private addTextureSprite(texture: Phaser.RenderTexture, x: number, y: number): void {
        const sprite = new Phaser.Sprite(this.game, x, y, texture);
        sprite.name = 'treePartTexture';
        this.addChild(sprite);
    }

    protected attachSprite(spriteId: string, name?: string, tintColor?:number): Phaser.Sprite {
        let sprite = tintColor? SpriteUtils.createSpriteWithTint(this.game, 0, 0, spriteId, tintColor) :
                                 SpriteUtils.createSprite(this.game, 0, 100, spriteId);
        sprite.anchor.set(0.5)
        sprite.name = name || spriteId;
        this.addChild(sprite);
        if (DebugScreen.DEBUG_MODE) {
            sprite.inputEnabled = true;
        }
        return sprite;
    }

    protected applyPreset(presets: Preset[]) {
        presets.forEach(preset => {
            this.children.forEach(child => {
                if (preset.spriteId != "" && (child instanceof Phaser.Sprite || child instanceof Phaser.TileSprite || child instanceof Phaser.Button) 
                && child.name == preset.spriteId) {
                    Utils.applyPreset(child, preset);
                }
            });
        });
    }
}
