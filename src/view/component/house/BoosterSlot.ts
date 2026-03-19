import UserService from '../../../core/service/UserService';
import Label from '../panel/Label';
import BasePanel from '../panel/BasePanel';
import ShopPanel from './ShopPanel';
import StartLevelPanel from './StartLevelPanel';
import SpriteUtils from '../../../core/utils/SpriteUtils';
import Utils from '../../../core/utils/Utils';
import BoosterType from '../../../core/model/enum/BoosterType';

export default class BoosterSlot extends BasePanel {

    private boosterCountLabel: Label;
    private boosterButton: Phaser.Button;
    private boosterInfoCircle: Phaser.Sprite;
    private slotImage: Phaser.Sprite;

    private booster:BoosterType;

    constructor(game: Phaser.Game, x: number, y: number, booster:BoosterType, actionOnClick: (type:BoosterType)=>void, ingameBoosters?:boolean) {
        super(game, x, y);
        this.game = game;
        this.booster = booster;

        this.slotImage = this.attachSprite('slotOpened', 'slotOpened1')

        if(ingameBoosters){
            this.slotImage.alpha = 0.6;
        }

        let boosterTr = SpriteUtils.createSprite(this.game, this.slotImage.x, this.slotImage.y, booster)
        boosterTr.anchor.set(0.5); 
        boosterTr.scale.set(1.3); 
        this.addSprite(boosterTr); boosterTr.alpha = 0.3;

        this.boosterButton = SpriteUtils.createButton(this.game, 0, 0, booster, () => {
            actionOnClick(booster);
        });
        this.boosterButton.scale = new Phaser.Point(1.3, 1.3);
        this.boosterButton.anchor = new Phaser.Point(0.5, 0.5);
        this.addButton(this.boosterButton);

        let user = UserService.getUser();

        let dx = 22 - 3;
        let dy = 20  -3;

        this.boosterInfoCircle = SpriteUtils.createSprite(this.game, 47 + dx- this.boosterButton.x, 33 +dy- this.boosterButton.y+10, "circleBoosterBlue");
        this.boosterInfoCircle.events.onInputDown.add(() => actionOnClick(booster));
        this.boosterInfoCircle.scale.set(0.5)

        // this.boosterInfoCircle = SpriteUtils.createButton(this.game, 47 + dx - this.boosterButton.x, 33 +dy- this.boosterButton.y, 
        //     "circleBoosterBlue",
        //     // user.getBoostersCount(booster) == 0 ? "circleBooster" : "circleBoosterBlue", 
        //      () => {
        //         actionOnClick(booster);
        //     }
        // );
        this.boosterInfoCircle.anchor = new Phaser.Point(0.5, 0.5);
        // this.boosterInfoCircle.scale = new Phaser.Point(1/this.boosterButton.scale.x, 1/this.boosterButton.scale.y);
        this.addChild(this.boosterInfoCircle);
        // this.boosterButton.addChild(this.boosterInfoCircle);

        this.boosterCountLabel = new Label(this.game, 49-2 + dx- this.boosterButton.x, 35+2 + dy- this.boosterButton.y +9,
            user.getBoostersCount(booster) > 0 ? "" + user.getBoostersCount(booster) : "+", { font: "bold 40px Arial", fill: "#ffffff"});
        this.boosterCountLabel.anchor = new Phaser.Point(0.5, 0.5);
        // this.boosterCountLabel.events.onInputDown.add(() => actionOnClick(booster));

        this.addSprite(this.boosterCountLabel);
        // this.boosterCountLabel.inputEnabled = false; 
        // this.inputEnabled = false;
        this.refresh();
    }

    public refresh() {
        let user = UserService.getUser();
        this.boosterButton.alpha = 1;

        if (user.getBoostersCount(this.booster) == 0) {
            this.boosterCountLabel.text = "+";
            SpriteUtils.loadTexture(this.boosterInfoCircle, "circleBoosterBlue")
            // this.boosterInfoCircle.loadTexture(SpriteUtils.key("circleBoosterBlue"), SpriteUtils.frame("circleBoosterBlue"));
            this.boosterButton.alpha = 0.001;
        } else if (StartLevelPanel.PREBOOSTERS_TO_SPEND.indexOf(this.booster) != -1) {
            this.boosterCountLabel.text = "✔";
            SpriteUtils.loadTexture(this.boosterInfoCircle, "circleBooster")
            // this.boosterInfoCircle.loadTexture(SpriteUtils.key("circleBooster"), SpriteUtils.frame("circleBooster"));
        } else {
            this.boosterCountLabel.text = "" + user.getBoostersCount(this.booster);
            SpriteUtils.loadTexture(this.boosterInfoCircle, "circleBoosterBlue")
            // this.boosterInfoCircle.loadTexture(SpriteUtils.key("circleBoosterBlue"), SpriteUtils.frame("circleBoosterBlue"));
        }

        if(this.boosterCountLabel.text == "+"){
            this.boosterCountLabel.scale.set(1.4, 1.4); 
            this.boosterCountLabel.setStyle({ font: "40px Arial", fill: "#ffffff"})
        } else {
            this.boosterCountLabel.scale.set(0.85, 0.85);
            this.boosterCountLabel.setStyle({ font: "bold 40px Arial", fill: "#ffffff"})
        }

        if(this.boosterCountLabel.text == "✔"){
            this.slotImage.tint = 0xFFFFAA;
        } else {
            this.slotImage.tint = 0xFFFFFF;
        }
    }

}
