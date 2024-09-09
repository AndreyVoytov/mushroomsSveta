import BasePanel from "./BasePanel";

export default class Skewable extends BasePanel {

    public skewX:number = 0;
    public skewY:number = 0;

    constructor(game: Phaser.Game, x: number, y: number, image: string, name?:string) {
        super(game, x, y, name || "", image);
    }

    public updateTransform(parent?) {

        if (!parent && !this.parent && !this.game)
        {
            return this;
        }
        
        var p = this.parent;

        if (parent)
        {
            p = parent;
        }
        else if (!this.parent)
        {
            p = this.game.world;
        }

        // create some matrix refs for easy access
        var pt = p.worldTransform;
        var wt = this.worldTransform;

        // temporary matrix variables
        var a, b, c, d, tx, ty;

        // so if rotation is between 0 then we can simplify the multiplication process..
        // if (this.rotation % Phaser.Math.PI2)
        if (this.rotation % Phaser.Math.PI2|| this.skewX || this.skewY)
        {
            // console.log("updateTransform proceed!")
            // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
            // if (this.rotation !== this.rotationCache)
            // {
            //     this.rotationCache = this.rotation;
            //     this._sr = Math.sin(this.rotation);
            //     this._cr = Math.cos(this.rotation);
            // }

            // get the matrix values of the displayobject based on its transform properties..
            // a  =  this._cr * this.scale.x;
            // b  =  this._sr * this.scale.x;
            // c  = -this._sr * this.scale.y;
            // d  =  this._cr * this.scale.y;
            a  =  this.scale.x * Math.cos(this.rotation + this.skewY); 
            b  =  this.scale.x * Math.sin(this.rotation + this.skewY);
            c  =  this.scale.y * Math.sin(-this.rotation - this.skewX);
            d  =  this.scale.y * Math.cos(this.rotation + this.skewX);
            tx = this.position.x;
            ty = this.position.y;

            // check for pivot.. not often used so geared towards that fact!
            if (this.pivot.x || this.pivot.y)
            {
                tx -= this.pivot.x * a + this.pivot.y * c;
                ty -= this.pivot.x * b + this.pivot.y * d;
            }

            // concat the parent matrix with the objects transform.
            wt.a = a * pt.a + b * pt.c;
            wt.b = a * pt.b + b * pt.d;
            wt.c = c * pt.a + d * pt.c;
            wt.d = c * pt.b + d * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }
        else
        {
            // lets do the fast version as we know there is no rotation..
            a = this.scale.x;
            b = 0;
            c = 0;
            d = this.scale.y;
            tx = this.position.x - this.pivot.x * a;
            ty = this.position.y - this.pivot.y * d;

            wt.a = a * pt.a;
            wt.b = a * pt.b;
            wt.c = d * pt.c;
            wt.d = d * pt.d;
            wt.tx = tx * pt.a + ty * pt.c + pt.tx;
            wt.ty = tx * pt.b + ty * pt.d + pt.ty;
        }

        a = wt.a;
        b = wt.b;
        c = wt.c;
        d = wt.d;

        var determ = (a * d) - (b * c);

        if (a || b)
        {
            var r = Math.sqrt((a * a) + (b * b));

            this.worldRotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
            this.worldScale.x = r;
            this.worldScale.y = determ / r;
        }
        else if (c || d)
        {
            var s = Math.sqrt((c * c) + (d * d));

            this.worldRotation = Phaser.Math.HALF_PI - ((d > 0) ? Math.acos(-c / s) : -Math.acos(c / s));
            this.worldScale.x = determ / s;
            this.worldScale.y = s;
        }
        else
        {
            this.worldScale.x = 0;
            this.worldScale.y = 0;
        }

        //  Set the World values
        this.worldAlpha = this.alpha * p.worldAlpha;
        this.worldPosition.x = wt.tx;
        this.worldPosition.y = wt.ty;

        // reset the bounds each time this is called!
        // this._currentBounds = null;

        //  Custom callback?
        if (this.transformCallback)
        {
            this.transformCallback.call(this.transformCallbackContext, wt, pt);
        }

        return this;

    }
}