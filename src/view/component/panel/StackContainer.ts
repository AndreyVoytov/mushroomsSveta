export type StackAlign = 'left' | 'center' | 'right';

type StackContainerOptions = {
    gap?: number;
    align?: StackAlign;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    includeInvisible?: boolean;
    layoutWidth?: number;
};

export default class StackContainer extends Phaser.Group {
    private gap: number;
    private stackAlign: StackAlign;
    private paddingTop: number;
    private paddingRight: number;
    private paddingBottom: number;
    private paddingLeft: number;
    private includeInvisible: boolean;
    private layoutWidth: number;

    constructor(game: Phaser.Game, x: number, y: number, name?: string, options?: StackContainerOptions) {
        super(game, null, name);
        this.x = x;
        this.y = y;
        this.gap = options && options.gap != null ? options.gap : 0;
        this.stackAlign = options && options.align ? options.align : 'left';
        this.paddingTop = options && options.paddingTop != null ? options.paddingTop : 0;
        this.paddingRight = options && options.paddingRight != null ? options.paddingRight : 0;
        this.paddingBottom = options && options.paddingBottom != null ? options.paddingBottom : 0;
        this.paddingLeft = options && options.paddingLeft != null ? options.paddingLeft : 0;
        this.includeInvisible = options && options.includeInvisible != null ? options.includeInvisible : false;
        this.layoutWidth = options && options.layoutWidth != null ? options.layoutWidth : null;
    }

    public addStackChild<T extends PIXI.DisplayObject>(child: T): T {
        this.add(child);
        this.relayout();
        return child;
    }

    public setGap(value: number): void {
        this.gap = value || 0;
        this.relayout();
    }

    public setLayoutWidth(value: number): void {
        this.layoutWidth = value;
        this.relayout();
    }

    public relayout(): void {
        let items = (<any[]>this.children).filter(child => this.includeInvisible || child.visible);
        let measured = items.map(child => ({
            child: child,
            box: this.getLocalBox(child)
        }));

        let maxWidth = 0;
        measured.forEach(item => {
            maxWidth = Math.max(maxWidth, item.box.width);
        });

        let availableWidth = this.layoutWidth != null
            ? Math.max(0, this.layoutWidth - this.paddingLeft - this.paddingRight)
            : maxWidth;

        let cursorY = this.paddingTop;
        measured.forEach(item => {
            let childWidth = item.box.width;
            let targetX = this.paddingLeft;

            switch (this.stackAlign) {
                case 'center':
                    targetX = this.paddingLeft + (availableWidth - childWidth) / 2;
                    break;
                case 'right':
                    targetX = this.paddingLeft + availableWidth - childWidth;
                    break;
                case 'left':
                default:
                    targetX = this.paddingLeft;
                    break;
            }

            (<any>item.child).x = targetX - item.box.x;
            (<any>item.child).y = cursorY - item.box.y;
            cursorY += item.box.height + this.gap;
        });

        let totalHeight = measured.length > 0
            ? cursorY - this.gap + this.paddingBottom
            : this.paddingTop + this.paddingBottom;

        (<any>this).layoutBox = {
            x: 0,
            y: 0,
            width: this.paddingLeft + availableWidth + this.paddingRight,
            height: totalHeight
        };
    }

    private getLocalBox(child: PIXI.DisplayObject): { x: number, y: number, width: number, height: number } {
        let current = <any>child;
        let customBox = current.layoutBox;
        if (customBox && isFinite(customBox.width) && isFinite(customBox.height)) {
            return {
                x: customBox.x || 0,
                y: customBox.y || 0,
                width: customBox.width,
                height: customBox.height
            };
        }

        let hasChildren = current.children && current.children.length > 0;
        let bounds = hasChildren
            ? PIXI.DisplayObjectContainer.prototype.getBounds.call(child)
            : (current.getBounds ? current.getBounds() : null);

        if (bounds && isFinite(bounds.width) && isFinite(bounds.height)) {
            let topLeft = this.toLocal(new Phaser.Point(bounds.x, bounds.y), null);
            let bottomRight = this.toLocal(new Phaser.Point(bounds.x + bounds.width, bounds.y + bounds.height), null);

            return {
                x: topLeft.x - (current.x || 0),
                y: topLeft.y - (current.y || 0),
                width: bottomRight.x - topLeft.x,
                height: bottomRight.y - topLeft.y
            };
        }

        let width = current.width || 0;
        let height = current.height || 0;
        let anchorX = current instanceof Phaser.Group ? 0 : (current.anchor ? current.anchor.x : 0);
        let anchorY = current instanceof Phaser.Group ? 0 : (current.anchor ? current.anchor.y : 0);

        return {
            x: -width * anchorX,
            y: -height * anchorY,
            width: width,
            height: height
        };
    }
}
