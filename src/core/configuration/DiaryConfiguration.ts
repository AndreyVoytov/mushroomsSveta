import DiaryContentType from '../model/diary/DiaryContentType';
import UserService from '../service/UserService';
import RecipeUtils from '../utils/RecipeUtils';
import MapPresetConfiguration from './MapPresetConfiguration';
export default class DiaryConfiguration {

    // Keep replicas loaded from slightly earlier levels because recipes are tied to replicas.

    public static getCurrentRecipe(currentLevel:number, alwaysNext?:boolean): DiaryContentType {
        let i = DiaryConfiguration.getCurrentRecipeIndex(currentLevel, alwaysNext);
        return this.allRecipes[i];
    }

    public static getPagesCountByIndex(i: number): number{
        return this.allRecipes.filter((r,j) => j<=i && !r.copyOf).length;
    }

    public static getPageByIndex(i: number): number{
        let recipe = this.getRecipeByIndex(i);
        if(recipe.copyOf){
            recipe = this.getRecipeById(recipe.copyOf);
        }
        return this.getPagesCountByIndex(this.allRecipes.indexOf(recipe));
    }

    public static getRecipeIndexByPage(page: number): number{
        let currentPage = 1;
        for(let i=0; i< this.allRecipes.length; i++){
            if(!this.allRecipes[i].copyOf){
                if(currentPage == page) return i;
                currentPage ++;
            } 
        }
        return -1;
    }

    public static getRecipeByIndex(i: number): DiaryContentType{
        return this.allRecipes[i];
    }

    public static getRecipeById(recipeId: string): DiaryContentType{
        return this.allRecipes.filter(r => r.id == recipeId).shift();
    }

    public static getCurrentRecipeIndex(currentLevel:number, alwaysNext?:boolean): number {
        for (let i = this.allRecipes.length - 1; i >= 0; i--) {
            let r = this.allRecipes[i];
            let fromLevel = RecipeUtils.getRequiredLevel(r);
            if (fromLevel >= currentLevel && i != 0 || fromLevel > currentLevel) {
                continue;
            }

            if (!alwaysNext && UserService.getUser().getCompletedTasks().indexOf(r.id) == -1) {
                console.log("DiaryConfiguration: " + r.id)
                return i;
            } else {
                console.log("DiaryConfiguration: " + this.allRecipes[Math.min(i + 1, this.allRecipes.length)].id)
                return Math.min(i + 1, this.allRecipes.length);
            }
        }
        return -1;
    }

    public static getNextrecipe(currentLevel:number): DiaryContentType {
        let r = this.getCurrentRecipe(currentLevel);

        if (!r) {
            return this.allRecipes[0];
        }

        let index = this.allRecipes.indexOf(r);

        if (index + 1 >= this.allRecipes.length) {
            return null;
        }
        return this.allRecipes[index + 1];
    }

    public static allRecipes: DiaryContentType[] = [

         {
            id: "rec0",
            title: "diary.rec0.title",
            details: "diary.rec0.details",
            resultImage: "",
            picture: "housePic",
            fromLevel: 1,
        },
        {
            id: "rec1",
            title: "diary.rec1.title",
            details: "diary.rec1.details",
            resultImage: "pot1",
            fromLevel: 4,
            requiredItems: [
                { name: "mushroom", count: 21 },
                { name: "mushroom3", count: 12 },
                { name: "witchMushroom", count: 1 }
            ]
        },
       
        
        {
            id: "map1",
            title: "diary.map1.title",
            fromReplica: "r7",
            resultImage: "catAim",
            mapPreset: MapPresetConfiguration.MAP_1,
        },
        {
            id: "rec2",
            title: "diary.rec2.title",
            details: "diary.rec2.details",
            fromReplica: "r10b",
            resultImage: "dish2",
            requiredItems: [
                { name: "lilly", count: 12 },
                { name: "mushroom3", count: 20 },
                { name: "amanita", count: 1 }
            ],
            highlightColor: "pink"
        },
        {
            id: "rec3",
            title: "diary.rec3.title",
            details: "diary.rec3.details",
            fromReplica: "r16",
            resultImage: "dish1",
            requiredItems: [
                { name: "chamomileSmall", count: 10 },
                { name: "blueberry", count: 38 },
                { name: "witchMushroom", count: 8 }
            ],
            highlightColor: "blue"
        },
        {
            id: "rec4",
            title: "diary.rec4.title",
            details: "diary.rec4.details",
            fromReplica: "r19",
            resultImage: "pot2",
            requiredItems: [
                { name: "cankerberry", count: 8 },
                { name: "lavanda", count: 24 },
                { name: "witchMushroom", count: 5 },
            ]
        },
        {
            id: "rec5",
            title: "diary.rec5.title",
            details: "diary.rec5.details",
            fromReplica: "r27",
            resultImage: "pot3",
            requiredItems: [
                { name: "blueberry", count: 15 },
                { name: "amanita", count: 17 },
                { name: "witchMushroom", count: 6 }
            ]
        },
        {
            id: "rec6",
            title: "diary.rec6.title",
            details: "diary.rec6.details",
            fromReplica: "r33",
            resultImage: "pot4",
            requiredItems: [
                { name: "blueberry", count: 10 },
                { name: "mushroom", count: 5 },
                { name: "cankerberry", count: 7 }
            ]
        },
        {
            id: "rec7",
            title: "diary.rec7.title",
            details: "diary.rec7.details",
            resultImage: "tree",
            picture: "dForestPic",
            fromReplica: "r39",
        },
        {
            id: "rec8",
            title: "diary.rec8.title",
            details: "diary.rec8.details",
            resultImage: "tree",
            picture: "dForestPic",
            characterOverPicture: {
                image:"unicorn1",
                x:0,
                y:0,
                scaleX:0.92,
                scaleY:0.92
            },
            centerCharacter: true,
            fromReplica: "r41",
        },
        {
            id: "rec9",
            title: "diary.rec9.title",
            details: "diary.rec9.details",
            fromReplica: "r47",
            resultImage: "campfire",
            requiredItems: [
                { name: "blueberry", count: 10 },
                { name: "mushroom", count: 5 },
                { name: "mushroom3", count: 7 }
            ],
            highlightColor: "pink" //TODO red or yellow
        },
        {
            id: "map2",
            title: "diary.map2.title",
            fromReplica: "r50",
            resultImage: "actionHouse",
            mapPreset: MapPresetConfiguration.MAP_2,
        },
        {
            id: "map3",
            title: "diary.map3.title",
            fromReplica: "r56",
            resultImage: "owl",
            mapPreset: MapPresetConfiguration.MAP_3,
        },
        {
            id: "rec10",
            title: "diary.rec10.title",
            details: "diary.rec10.details",
            resultImage: "owlPink",
            picture: "forestPic",
            characterOverPicture: {
                image:"sova1",
                x:20,
                y:70,
                scaleX:0.8,
                scaleY:0.8
            },
            
            fromReplica: "r62",
        },
        {
            id: "rec11",
            title: "diary.rec11.title",
            details: "diary.rec11.details",
            resultImage: "actionSphere",
            picture: "atticPic",
            fromReplica: "r66",
        },
        {
            id: "rec12",
            title: "diary.rec12.title",
            details: "diary.rec12.details",
            resultImage: "actionBoots",
            picture: "atticPic",
            characterOverPicture: {
                image:"boots",
                x:130,
                y:173,
                scaleX:0.86,
                scaleY:0.86
            },
            // centerCharacter: true,
            fromReplica: "r71",
        },
        {
            id: "rec13",
            title: "diary.rec13.title",
            details: "diary.rec13.details",
            resultImage: "tree",
            picture: "forestPic",
            characterOverPicture: {
                image:"leshii1",
                x:30,
                y:50,
                scaleX:0.85,
                scaleY:0.85
            },
            
            fromReplica: "r76",
        },
        {
            id: "rec14",
            title: "diary.rec14.title",
            details: "diary.rec14.details",
            fromReplica: "r83",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
            requiredItems: [
                { name: "goldRoot", count: 10 },
                { name: "cankerberry", count: 5 },
                { name: "witchMushroom", count: 7 }
            ],
            // highlightColor: "pink" 
        },
        {
            id: "map4",
            title: "diary.map4.title",
            titleForProgress: "diary.map4.titleForProgress",
            fromReplica: "r87",
            resultImage: "actionMap",
            mapPreset: MapPresetConfiguration.MAP_4,
        },
        {
            id: "rec15",
            title: "diary.rec15.title",
            details: "diary.rec15.details",
            fromReplica: "r97",
            resultImage: "flour",
            resultImageForProgress: "wheat",
            requiredItems: [
                { name: "wheat", count: 10 },
                { name: "wheat", count: 5 },
                { name: "wheat", count: 7 }
            ],
            // highlightColor: "pink" 
        },
        {
            id: "map4_2",
            copyOf:"map4",
            titleForProgress: "diary.map4_2.titleForProgress",
            fromReplica: "r100",
            resultImage: "actionMap",
        },
        {
            id: "rec14_2",
            copyOf:"rec14",
            title: "diary.rec14_2.title",
            fromReplica: "r103",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map4_22",
            copyOf:"map4",
            titleForProgress: "diary.map4_22.titleForProgress",
            fromReplica: "r104",
            resultImage: "actionMap",
        },
        {
            id: "rec16",
            title: "diary.rec16.title",
            fromReplica: "r107",
            details: "diary.rec16.details",
            resultImage: "voltorna",
            picture: "dForestPic",
            characterOverPicture: {
                image:"cyclop",
                x:50,
                y:140,
                scaleX:0.8,
                scaleY:0.8,
                
            },
            decorOverPicture: {
                "image": "monocle",
                "x": (158 -150 + 15)*0.8 - 57 + 50,
                "y": (272 - 420 + 61)*0.8 + 140 -48,
                scaleX:-0.8,
                scaleY:0.8,
            }
        },
        {
            id: "rec17",
            title: "diary.rec17.title",
            fromReplica: "r114",
            details: "diary.rec17.details",
            resultImage: "tree",
            picture: "dForestPic",
            characterOverPicture: {
                image:"voltorna",
                x:0,
                y:0,
                scaleX:0.8,
                scaleY:0.8
            },
            centerCharacter: true
        },
        {
            id: "rec14_3",
            copyOf:"rec14",
            title: "diary.rec14_3.title",
            fromReplica: "r115",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map5",
            title: "diary.map5.title",
            titleForProgress: "diary.map5.titleForProgress",
            fromReplica: "r118",
            resultImage: "actionMap",
            mapPreset: MapPresetConfiguration.MAP_5,
        },
        {
            id: "rec18",
            title: "diary.rec18.title",
            fromReplica: "r123",
            details: "diary.rec18.details",
            resultImage: "solovei",
            picture: "fieldsPic",
            characterOverPicture: {
                image:"dwarfs",
                x:0,
                y:0,
                scaleX:1,
                scaleY:1
            },
        },
        {
            id: "map5_2",
            copyOf:"map5",
            titleForProgress:"diary.map5_2.titleForProgress",
            fromReplica: "r131",
            resultImage: "actionMap",
        },
        {
            id: "rec14_4",
            copyOf:"rec14",
            title: "diary.rec14_4.title",
            fromReplica: "r135",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map5_3",
            copyOf:"map5",
            titleForProgress: "diary.map5_3.titleForProgress",
            fromReplica: "r139",
            resultImage: "actionMap",
        },



    ]


}


