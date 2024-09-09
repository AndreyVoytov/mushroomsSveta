import BasePanel from "../../component/panel/BasePanel";
import SpriteUtils from "../../../core/utils/SpriteUtils";


export default class EditorButton extends BasePanel{

    constructor(game: Phaser.Game, iconKey:string, action:()=>void) {
        super(game, 0, 0, iconKey, "editorButtonPanel");

        this.anchor.set(0.5)
        
        let button = SpriteUtils.createButton(game, 0,0, iconKey, action);
        button.anchor.set(0.5);
        this.addButton(button)
    }
}