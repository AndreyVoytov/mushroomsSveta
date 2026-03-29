export type HtmlHorizontalAlign = 'left' | 'center' | 'right';
export type HtmlVerticalAlign = 'top' | 'center' | 'bottom';

export default class HtmlPreset {
    spriteId: string;
    parentId?: string;
    width?: number | string;
    height?: number | string;
    horizontalAlign?: HtmlHorizontalAlign;
    horisontalAlign?: HtmlHorizontalAlign;
    verticalAlign?: HtmlVerticalAlign;
    offsetX?: number;
    offsetY?: number;
    fontSize?: number;
}
