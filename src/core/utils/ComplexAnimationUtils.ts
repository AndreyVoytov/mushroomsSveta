import Utils from './Utils';
import { ItemContents, ContentType } from '../model/enum/ContentType';
import NeverError from './NeverError';
import ForestUtils from './ForestUtils';
import AnimationUtils from './AnimationUtils';
import CellState from '../model/forest/CellState';
import { Easing } from 'phaser-ce';
import SpriteUtils from './SpriteUtils';
import ForestScreen from '../../view/screen/ForestScreen';
import BaseForestScreen from '../../view/screen/BaseForestScreen';
import Settings from '../service/Settings';
export default class ComplexAnimationUtils {



    public static onItemFound(game: Phaser.Game, contentType: ItemContents, position:Phaser.Point): void {
        let petalImages = ComplexAnimationUtils.getPetalsImage(contentType);
        if (petalImages) {
            AnimationUtils.petalsBurst(game, position.x, position.y, petalImages);
        }
        AnimationUtils.highlight(game, position.x, position.y, "splashY")
    }

    public static getPetalsImage(contentType: ItemContents): string[] {
        switch(contentType){
            case ItemContents.mushroom:  
            case ItemContents.poleno:     
                    return ["petalBrown"];
            case ItemContents.mushroom4:
                    return ["petalWhite"];
            case ItemContents.t27:       
            case ItemContents.mushroom3:     
            case ItemContents.mushroom5:     
            case ItemContents.wheat:
            case ItemContents.goldRoot:
            case ItemContents.amber:
                    return ["petalOrange"];
            case ItemContents.amanita:         
                    return ["petalRed", "petalWhite"];
            case ItemContents.t24:          
            case ItemContents.strawberry:          
                    return ["petalRed"];
            case ItemContents.t1:
            case ItemContents.blackberry:
                return ["petalBlue"];
            case ItemContents.t25: 
                return ["petalGreen"];
            case ItemContents.witchMushroom:   
                    return ["petalSky"];
            case ItemContents.lavanda:       
            case ItemContents.lilly:        
                    return ["petalPink"];   
            case ItemContents.randomItem:       
            case ItemContents.specificItem:     
            default:
                return null;
                // throw new NeverError(contentType);
        }
        return null;
    }

    public static doHighlightSpecificItem(game:Phaser.Game, screen:BaseForestScreen, sprite: Phaser.Sprite, winLevel?:boolean, scaleRatio?:number, faster?:boolean){
        let flash = SpriteUtils.createSprite(game, sprite.x, sprite.y/*-game.camera.y*/, winLevel? "flash" : "p2")
        flash.scale.set(winLevel? 1/2 : 1)
        flash.anchor.set(0.5);flash.alpha = 0;
        // this.addChild(flash);
        game.add.existing(flash);

        let destination = winLevel? new Phaser.Point(game.width/2, game.height/2) : new Phaser.Point(game.width/2, game.height/4*3);


        game.add.tween(flash.scale).to({x:4.2*flash.scale.x, y:4.2*flash.scale.y}, faster? 700: 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, faster? 0: 500);
        game.add.tween(flash).to({x: destination.x, y:destination.y+game.camera.y}, faster? 700: 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, faster? 0: 500);
        game.add.tween(flash).to({alpha: 0.8}, faster? 700: 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, faster? 0: 500);
        game.add.tween(flash).to({angle:360}, 6000, Easing.Linear.None, true, faster? 0: 500, -1);
        
        sprite.bringToTop();

        scaleRatio = scaleRatio  || 1;
        sprite.scale.set((winLevel? 1 : 1/3) * scaleRatio)
        game.add.tween(sprite.scale).to({x:sprite.scale.x * 2.5 * scaleRatio,  y: sprite.scale.y *2.5 * scaleRatio}, faster? 700: 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, faster? 0: 500);
        game.add.tween(sprite).to({x: destination.x, y:destination.y+game.camera.y}, faster? 700: 1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, faster? 0: 500);
        game.time.events.add(faster? 700: 1500, ()=>{
            AnimationUtils.floating3(game,sprite, 1)
        })

        game.time.events.add(faster? 1200 : 2500, ()=>{
                game.tweens.removeFrom(flash)
                game.tweens.removeFrom(sprite)

                let destination2 = winLevel? new Phaser.Point(screen.topPanel.aims[0].sprite.x, screen.topPanel.aims[0].sprite.y) : 
                                new Phaser.Point(game.width/2, game.height + 100);

                game.add.tween(flash).to({alpha: 0}, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 0);
                game.add.tween(flash.scale).to({x:1, y:1}, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 0);
                game.add.tween(flash).to({x: destination2.x, y: destination2.y+game.camera.y},
                        1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 0);

                game.add.tween(sprite).to({alpha: 0}, 100,Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Exponential.In, true, 600);
                game.add.tween(sprite.scale).to({x:sprite.scale.x/2.5, y:sprite.scale.y/2.5}, 700, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 0);
                game.add.tween(sprite).to({x: destination2.x, y:destination2.y+screen.topPanel.y+game.camera.y},
                        1000, Settings.isOnlyLinearAnimations()?  Phaser.Easing.Linear.None :Easing.Quadratic.InOut, true, 0);

                if(winLevel){
                        screen.playAnimation("hideEducation")
                
                        game.time.events.add(700, () => {
                                screen.playAnimation("winLevel")
                        })
                }
        })
    }

}


