import BasePanel from "../../component/panel/BasePanel";
import SpriteUtils from "../../../core/utils/SpriteUtils";

export default class EditorCheckBoxPanel extends BasePanel{

    private value:boolean = false
    private checkImage:Phaser.Sprite;

    private resetCallback: ()=>boolean;

    constructor(game: Phaser.Game, title:string, resetCallback: ()=>boolean, changeValueCallback: (p:EditorCheckBoxPanel)=>void) {
        super(game, 0, 0, "", "editorValuePanel");
        this.resetCallback = resetCallback;

        this.anchor.set(0.5);

        let w = 260;
        let h = 72;

        let titleLabel = this.attachText("title", title, { font: "35px Arial", fill: "#99ff99"})
        titleLabel.y -= 12;
        titleLabel.anchor.set(0, 0.5);
        titleLabel.x -= w/2 -15;

        this.value = resetCallback();

        let switchButton = this.attachButton("actionCircle", ()=>{
            changeValueCallback(this);
        }, "editButton")
        switchButton.scale.set(0.3);
        switchButton.x+=100;

        this.checkImage = SpriteUtils.createSprite(this.game, switchButton.x, switchButton.y, "check");
        this.addChild(this.checkImage);
        this.checkImage.anchor.set(0.5)
        this.checkImage.scale.set(0.5)
        this.checkImage.width = switchButton.width;
        this.checkImage.height = switchButton.height;
        this.checkImage.visible = false;

        this.scale.set(1.08, 1)
    }

    public getValue():boolean{
        return this.value;
    }

    public resetPanel():void{
        this.value = this.resetCallback();
        this.checkImage.visible = this.value;

    }
}