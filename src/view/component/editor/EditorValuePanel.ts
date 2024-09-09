import BasePanel from "../../component/panel/BasePanel";
import Label from "../../component/panel/Label";


export default class EditorValuePanel extends BasePanel{

    private valueLabel:Label;
    private resetCallback: ()=>string;

    constructor(game: Phaser.Game, title:string, resetCallback: ()=>string, changeValueCallback: (p:EditorValuePanel)=>void) {
        super(game, 0, 0, "", "editorValuePanel");
        this.resetCallback = resetCallback;

        this.anchor.set(0.5);

        let w = 260;
        let h = 72;

        let titleLabel = this.attachText("title", title, { font: "35px Arial", fill: "#99ff99"})
        titleLabel.y -= 12;
        titleLabel.anchor.set(0, 0.5);
        titleLabel.x -= w/2 -15;

        this.valueLabel = this.attachText("value", resetCallback(), { font: "35px Arial", fill: "#ffffff"})
        this.valueLabel.y += 20;
        this.valueLabel.anchor.set(0, 0.5);
        this.valueLabel.x -= w/2 -15;

        let editButton = this.attachButton("renameButton", ()=>{
            changeValueCallback(this);
        }, "editButton")
        // editButton.scale.set(0.5);
        editButton.x+=100;

        this.scale.set(1.08, 1)
    }

    public setValue(newValue:string){
        this.valueLabel.text = newValue;
    }

    public getValue():string{
        return this.valueLabel.text;
    }

    public resetPanel():void{
        this.valueLabel.text = this.resetCallback();
    }
}