/** Six cached 96px faces and one moving sprite; no video or 3D runtime. */
export default class HeroDiceRoll extends Phaser.Group {
    private die: Phaser.Sprite;
    private startedAt: number;
    private result: number;
    private origin: Phaser.Point;
    private settled = false;
    private callback: () => void;
    private face = 0;

    constructor(game: Phaser.Game, origin: Phaser.Point, result: number, callback: () => void) {
        super(game,game.world,'heroDiceRoll');this.fixedToCamera=true;
        this.origin=origin;this.result=result;this.callback=callback;this.startedAt=game.time.now;
        this.die=new Phaser.Sprite(game,origin.x,origin.y-84,HeroDiceRoll.faceTexture(game,1));
        this.die.anchor.set(.5);this.die.width=this.die.height=84;this.add(this.die);
    }

    private static faceTexture(game: Phaser.Game, face: number): Phaser.BitmapData {
        const key='hero-die-face-'+face;
        let bitmap=game.cache.getBitmapData(key);if(bitmap)return bitmap;
        bitmap=game.make.bitmapData(96,104);const ctx=bitmap.ctx;
        const round=(x:number,y:number,w:number,h:number,r:number)=>{
            ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
            ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
        };
        ctx.fillStyle='rgba(18,10,8,.25)';round(6,10,84,90,17);ctx.fill();
        ctx.fillStyle='#b99055';round(4,7,88,90,16);ctx.fill();
        const light=ctx.createLinearGradient(8,4,84,88);light.addColorStop(0,'#fffdf0');light.addColorStop(.6,'#f9e9c5');light.addColorStop(1,'#dabd88');
        ctx.fillStyle=light;round(4,3,88,85,16);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#ffedbd';ctx.stroke();
        const dots:{[face:number]:number[][]}={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],
            4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
        dots[face].forEach(p=>{ctx.beginPath();ctx.arc(48+p[0]*22,45+p[1]*22,6.4,0,Math.PI*2);ctx.fillStyle='#5d3e65';ctx.fill();
            ctx.beginPath();ctx.arc(47+p[0]*22,43+p[1]*22,2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.28)';ctx.fill();});
        bitmap.dirty=true;game.cache.addBitmapData(key,bitmap);return bitmap;
    }

    public update(): void {
        const elapsed=this.game.time.now-this.startedAt,t=Math.max(0,Math.min(1,elapsed/850));
        const face=elapsed<850?1+((Math.floor(elapsed/65)+this.result)%6):this.result;
        if(face!=this.face){this.face=face;this.die.loadTexture(HeroDiceRoll.faceTexture(this.game,face));}
        const spin=Math.sin(t*Math.PI*5)*(1-t);
        this.die.rotation=spin*1.2;this.die.x=this.origin.x+spin*12;
        this.die.y=this.origin.y-102-Math.sin(t*Math.PI)*48;
        const base=.875;this.die.scale.set(base*(1-.15*Math.abs(spin)),base*(1+.08*Math.abs(spin)));
        this.die.alpha=Math.min(1,elapsed/100)*Math.max(0,Math.min(1,(1550-elapsed)/250));
        if(elapsed>=950&&!this.settled){this.settled=true;this.callback();}
        if(elapsed>=1550)this.destroy(true);
    }
}
