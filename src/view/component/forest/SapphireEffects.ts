// Small shared textures: soft light and a four-point glint, rasterized once.
// No filters, per-frame drawing, emitters or extra downloaded assets.
export default class SapphireEffects {
    public static sprite(game: Phaser.Game, glint: boolean, size: number): Phaser.Sprite {
        const key = glint ? 'sapphire-glint' : 'sapphire-glow';
        let bitmap = game.cache.getBitmapData(key);
        if (!bitmap) {
            bitmap = game.make.bitmapData(64, 64);
            const ctx = bitmap.ctx;
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.18, 'rgba(202,245,255,0.9)');
            gradient.addColorStop(0.5, 'rgba(79,171,255,0.35)');
            gradient.addColorStop(1, 'rgba(38,112,255,0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
            if (glint) {
                ctx.beginPath();
                ctx.moveTo(32, 2);
                ctx.lineTo(36, 27);
                ctx.lineTo(62, 32);
                ctx.lineTo(36, 37);
                ctx.lineTo(32, 62);
                ctx.lineTo(28, 37);
                ctx.lineTo(2, 32);
                ctx.lineTo(28, 27);
                ctx.closePath();
                ctx.fillStyle = '#e7fbff';
                ctx.fill();
            }
            bitmap.dirty = true;
            game.cache.addBitmapData(key, bitmap);
        }
        const sprite = new Phaser.Sprite(game, 0, 0, bitmap);
        sprite.anchor.set(0.5);
        sprite.width = sprite.height = size;
        sprite.inputEnabled = false;
        return sprite;
    }
}
