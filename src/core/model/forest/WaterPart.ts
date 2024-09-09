import ForestCell from './ForestCell';
export default class WaterPart {
    cell: ForestCell;
    tangens: number;
    constructor(cell: ForestCell, tangens: number) {
        this.cell = cell;
        this.tangens = tangens;
    }

}


