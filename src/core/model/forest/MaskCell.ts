import CellType from '../../model/enum/CellType';
export default class MaskCell {
    X: number;
    Y: number;
    type: CellType;
    leaf: string;

    constructor(X: number, Y: number, type: CellType, leaf: string) {
        this.X = X;
        this.Y = Y;
        this.type = type;
        this.leaf = leaf;
    }
}


