import SeparatorType from '../../model/enum/SeparatorType';

export default class Separator {
    X: number;
    Y: number;
    type: SeparatorType;

    constructor(X: number, Y: number, type: SeparatorType) {
        this.X = X;
        this.Y = Y;
        this.type = type;
    }
}

