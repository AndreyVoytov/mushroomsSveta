import { HeroAbilityDefinition } from '../../../core/service/HeroParty';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Label from '../panel/Label';

export default class HeroPortraitSlot extends Phaser.Group {
    public hero: HeroAbilityDefinition;
    private diameter: number;
    private portrait: Phaser.Sprite;
    private ring: Phaser.Graphics;
    private counter: Label;
    private value = -1;

    constructor(game: Phaser.Game, x: number, y: number, diameter: number, hero: HeroAbilityDefinition, progress: boolean) {
        super(game, null, 'heroPortraitSlot');
        this.position.set(x, y);
        this.diameter = diameter;
        this.hero = hero;
        const frame = new Phaser.Graphics(game, 0, 0);
        frame.beginFill(0x241a15, .7); frame.drawCircle(0, 5, diameter + 7); frame.endFill();
        frame.lineStyle(3, hero ? 0xe0ad50 : 0x806c50, 1);
        frame.beginFill(hero ? 0x375144 : 0x493e32); frame.drawCircle(0, 0, diameter); frame.endFill();
        frame.lineStyle(1, 0xf9d888, hero ? .8 : .2); frame.drawCircle(0, 0, diameter - 11);
        this.add(frame);
        if (hero) {
            this.portrait = new Phaser.Sprite(game, 0, 0, this.portraitTexture(game, hero));
            this.portrait.anchor.set(.5);
            this.portrait.width = this.portrait.height = diameter - 17;
            this.add(this.portrait);
        } else {
            const placeholder = new Phaser.Graphics(game, 0, 0);
            placeholder.beginFill(0xc6b28c, .23);
            placeholder.drawCircle(0, -diameter * .11, diameter * .23);
            placeholder.drawEllipse(0, diameter * .19, diameter * .26, diameter * .18);
            placeholder.endFill();this.add(placeholder);
        }
        if (progress && hero) {
            this.ring = new Phaser.Graphics(game, 0, 0);this.add(this.ring);
            const badge = new Phaser.Graphics(game, 0, 0);
            badge.lineStyle(1, 0xc5a56b, .9);badge.beginFill(0x293d2a);
            badge.drawRoundedRect(-37, diameter * .35, 74, 25, 10);badge.endFill();this.add(badge);
            this.counter = new Label(game, 0, diameter * .35 + 12, '0/' + hero.energy, {font:'bold 20px Arial',fill:'#fff1c4'});
            this.counter.anchor.set(.5);this.add(this.counter);
            this.setCharge(0);
        }
    }

    private portraitTexture(game: Phaser.Game, hero: HeroAbilityDefinition): Phaser.BitmapData {
        const key = 'party-portrait-' + hero.id;
        let bitmap = game.cache.getBitmapData(key);
        if (bitmap) return bitmap;
        bitmap = game.make.bitmapData(128, 128);
        const ctx = bitmap.ctx;
        ctx.save();ctx.beginPath();ctx.arc(64,64,64,0,Math.PI*2);ctx.clip();
        const gradient = ctx.createLinearGradient(0,0,0,128);
        gradient.addColorStop(0,'#8a9d77');gradient.addColorStop(1,'#263b32');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
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
        const progress=Math.max(0,Math.min(1,charge/this.hero.energy)),radius=this.diameter/2-3;
        this.ring.clear();this.ring.lineStyle(7,0x17261b,.75);this.ring.drawCircle(0,0,radius*2);
        if(progress>0){
            this.ring.lineStyle(7,this.hero.color,1);
            this.ring.arc(0,0,radius,-Math.PI/2,-Math.PI/2+Math.PI*2*progress,false);
        }
        this.counter.text=Math.min(this.hero.energy,Math.floor(charge))+'/'+this.hero.energy;
    }
}
