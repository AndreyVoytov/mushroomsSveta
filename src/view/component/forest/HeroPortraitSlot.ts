import { HeroAbilityDefinition } from '../../../core/service/HeroParty';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Label from '../panel/Label';

export default class HeroPortraitSlot extends Phaser.Group {
    public hero: HeroAbilityDefinition;
    private diameter: number;
    private portrait: Phaser.Sprite;
    private ring: Phaser.Sprite;
    private ringMask: Phaser.Graphics;
    private counter: Label;
    private value = -1;

    constructor(game: Phaser.Game, x: number, y: number, diameter: number, hero: HeroAbilityDefinition, progress: boolean) {
        super(game, null, 'heroPortraitSlot');
        this.position.set(x, y);
        this.diameter = diameter;
        this.hero = hero;
        if (hero) {
            this.portrait = new Phaser.Sprite(game, 0, 0, this.portraitTexture(game, hero));
            this.portrait.anchor.set(.5);
            this.portrait.width = this.portrait.height = diameter - 20;
            this.add(this.portrait);
        } else {
            this.paintedSprite('uiEmptyHero', diameter, diameter);
        }
        if (hero) this.paintedSprite('uiPortraitFrame', diameter, diameter);
        if (progress && hero) {
            this.ring = this.paintedSprite('uiChargeRing', diameter, diameter);
            // Only the changing sector is procedural; its painted artwork is shared with the empty frame.
            this.ringMask = new Phaser.Graphics(game, 0, 0);this.add(this.ringMask);
            this.ring.mask = this.ringMask;
            const badge = this.paintedSprite('uiChargeBadge', 86, 32);
            badge.y = diameter * .35 + 14;
            this.counter = new Label(game, 0, diameter * .35 + 14, '0/' + hero.energy, {font:'bold 26px Arial',fill:Label.INK});
            this.counter.anchor.set(.5);this.add(this.counter);
            this.setCharge(0);
        }
    }

    private paintedSprite(key: string, width: number, height: number): Phaser.Sprite {
        const sprite = SpriteUtils.createSprite(this.game, 0, 0, key);
        sprite.anchor.set(.5);sprite.width = width;sprite.height = height;
        this.add(sprite);return sprite;
    }

    private portraitTexture(game: Phaser.Game, hero: HeroAbilityDefinition): Phaser.BitmapData {
        const key = 'party-portrait-' + hero.id;
        let bitmap = game.cache.getBitmapData(key);
        if (bitmap) return bitmap;
        bitmap = game.make.bitmapData(128, 128);
        const ctx = bitmap.ctx;
        ctx.save();ctx.beginPath();ctx.arc(64,64,64,0,Math.PI*2);ctx.clip();
        const backing = SpriteUtils.createSprite(game,0,0,'actionCircle'),back=backing.texture.crop;
        ctx.drawImage(backing.texture.baseTexture.source,back.x,back.y,back.width,back.height,0,0,128,128);
        backing.destroy();
        const source = SpriteUtils.createSprite(game,0,0,hero.image),crop=source.texture.crop;
        const scale=128/(crop.width*hero.faceWidth);
        ctx.drawImage(source.texture.baseTexture.source,crop.x,crop.y,crop.width,crop.height,
            64-crop.width*hero.faceX*scale,64-crop.height*hero.faceY*scale,crop.width*scale,crop.height*scale);
        source.destroy();ctx.restore();bitmap.dirty=true;game.cache.addBitmapData(key,bitmap);
        return bitmap;
    }

    public setCharge(charge: number): void {
        if (!this.ring || !this.hero || this.value == charge) return;
        this.value=charge;
        const progress=Math.max(0,Math.min(1,charge/this.hero.energy)),radius=this.diameter/2+2;
        this.ring.visible=progress>0;
        this.ringMask.clear();
        if(progress>0){
            this.ringMask.beginFill(0xffffff);
            this.ringMask.moveTo(0,0);
            this.ringMask.arc(0,0,radius,-Math.PI/2,-Math.PI/2+Math.PI*2*progress,false);
            this.ringMask.lineTo(0,0);this.ringMask.endFill();
        }
        this.counter.text=Math.min(this.hero.energy,Math.floor(charge))+'/'+this.hero.energy;
    }
}
