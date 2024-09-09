export default class Ruler{
    // Класс выводит координаты мыши при клике по сцене. 
    // Упрощает позиционирование картинок. 

    private game:Phaser.Game;

    public aimX: number = 0;
    public aimY: number = 0;

    private isMouseDownBefore:boolean = false;

    constructor(game: Phaser.Game){
        this.game = game;
        //console.log("ruler created");

        this.game.input.onDown.add((event:MouseEvent) => this.onMouseUp(event));
    }

    onMouseUp(event:MouseEvent):void{
        console.log("x = " + Math.round(this.game.input.activePointer.worldX) + ";    " +
                    "y = " + Math.round(this.game.input.activePointer.worldY) + ";    " +
                    "dx = " + Math.round(Math.abs(this.aimX - this.game.input.activePointer.worldX)) + ";    " +
                    "dy = " + Math.round(Math.abs(this.aimY - this.game.input.activePointer.worldY)) + ";    ");
        this.aimX = this.game.input.activePointer.worldX;
        this.aimY = this.game.input.activePointer.worldY;
    }
}
