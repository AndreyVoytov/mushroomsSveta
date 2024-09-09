export default class Label extends Phaser.Text{
    // private static GREEN_HIGLIGHT_COLOR = "#04c036";
    private static GREEN_HIGLIGHT_COLOR = "#018c26";
    // private static GREEN_HIGLIGHT_COLOR = "#3f8c07"; //gs
    private static VIOLET_HIGLIGHT_COLOR = "#8e15ca"; 

    private static GREEN_ESCAPE_SYMBOL = "~";
    private static VIOLET_ESCAPE_SYMBOL = "@";


    
    public static AIM_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#ffffff"};

    public static INFO_GREEN_STYLE: Phaser.PhaserTextStyle = { font: "bold 60px Arial", fill: "#00ff00", wordWrap: true, wordWrapWidth: 800 }; 
    public static INFO_BLACK_STYLE: Phaser.PhaserTextStyle = { font: "50px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: 800 };
    public static CLICK_TO_SKIP_YELLOW_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#f8c600"};

    public static VIOLET_STYLE: Phaser.PhaserTextStyle = { font: "bold 70px Bookman Old Style", fill: "#f293fd", wordWrap: true, wordWrapWidth: 800 };
    public static WHITE_STYLE: Phaser.PhaserTextStyle = { font: "bold 70px Bookman Old Style", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 };

    public static COMMON_BIG_STYLE: Phaser.PhaserTextStyle = { font: "bold 55px Arial", fill: "#fff5bc", wordWrap: true, wordWrapWidth: 600 }; 
    public static COMMON_MEDIUM_STYLE: Phaser.PhaserTextStyle = { font: "bold 50px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 };
    public static COMMON_SMALL_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#fff0ab", wordWrap: true, wordWrapWidth: 800 };

    public static MAP_POINT_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Bookman Old Style", fill: "#000000", wordWrap: true, wordWrapWidth: 800 };
    public static MAP_POINT_STYLE2: Phaser.PhaserTextStyle = { font: "bold 27px Bookman Old Style", fill: "#9a4848", wordWrap: true, wordWrapWidth: 800 };

    public static TASK_TITLE_STYLE: Phaser.PhaserTextStyle =  { font: "bold 45px Bookman Old Style", fill: "#000000", fontStyle: "italic", align: "center", wordWrap: true, wordWrapWidth: 430 };
    public static TASK_STYLE: Phaser.PhaserTextStyle = { font: "35px Bookman Old Style", fill: "#000000", fontStyle:"italic", align:"center",  wordWrap: true, wordWrapWidth: 510 };
    public static DIALOG_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#734f3f"} //gs
    // public static DIALOG_STYLE: Phaser.PhaserTextStyle = { font: "bold 40px Arial", fill: "#804119"}
    public static DIALOG_TITLE_STYLE: Phaser.PhaserTextStyle = { font: "45px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 880 };

    private static DEFAULT_STYLE: Phaser.PhaserTextStyle = { font: "40px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 800 }; 

    constructor(game: Phaser.Game, x: number, y: number, text: string, style?:Phaser.PhaserTextStyle, ignoreVioletHighlight?:boolean, symbolsInRow?:number){
        super(game, x, y, Label.splitRows(text, symbolsInRow).split(Label.GREEN_ESCAPE_SYMBOL).join("").split(ignoreVioletHighlight? "*" : Label.VIOLET_ESCAPE_SYMBOL).join(""), style || Label.DEFAULT_STYLE)

        let defaultColor = style? style.fill : Label.DEFAULT_STYLE.fill;        

        let isDefaultColor = false;
        while(text.indexOf(Label.GREEN_ESCAPE_SYMBOL) >= 0){
            this.addColor(isDefaultColor? defaultColor : Label.GREEN_HIGLIGHT_COLOR, text.indexOf(Label.GREEN_ESCAPE_SYMBOL)
                         - (text.substring(0, text.indexOf(Label.GREEN_ESCAPE_SYMBOL)).split("\n").length-1));
            text = text.replace(Label.GREEN_ESCAPE_SYMBOL, "");
            isDefaultColor = !isDefaultColor;
        }
        if(!ignoreVioletHighlight){
            while(text.indexOf(Label.VIOLET_ESCAPE_SYMBOL) >= 0){
                this.addColor(isDefaultColor? defaultColor : Label.VIOLET_HIGLIGHT_COLOR, text.indexOf(Label.VIOLET_ESCAPE_SYMBOL) 
                - (text.substring(0, text.indexOf(Label.GREEN_ESCAPE_SYMBOL)).split("\n").length-1));
                text = text.replace(Label.VIOLET_ESCAPE_SYMBOL, "");
                isDefaultColor = !isDefaultColor;
            }
        }

        this.anchor = new Phaser.Point(0.5, 0);
    }

    private static splitRows(text:string, symbolsInRow?:number) :string{
        if(!symbolsInRow){
            return text;
        }

        let currentlength = 0;
        var words = text.split(" ");
        words.forEach((w, i) => {
            if(currentlength + w.length >= symbolsInRow){
                currentlength = 0;
                if(i > 0){
                    words[i-1] = words[i-1].concat("\n");
                }
            }
            words[i] = w.concat(" ");
            currentlength += w.length + 1;
        })

        return words.join("");
    }

}