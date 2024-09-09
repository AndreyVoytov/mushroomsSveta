export default class FlowerType{
    dx:number;
    dy:number;

    r:number;
    rForImage:number;

    cellsCount:number;

    constructor(dx: number, dy: number, r:number, rForImage:number, cellsCount:number){
        this.dx = dx;
        this.dy = dy;
        this.r = r;
        this.rForImage = rForImage;
        this.cellsCount = cellsCount;
    }  

}


