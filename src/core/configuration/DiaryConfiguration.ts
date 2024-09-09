import DiaryContentType from '../model/diary/DiaryContentType';
import UserService from '../service/UserService';
import RecipeUtils from '../utils/RecipeUtils';
import MapPresetConfiguration from './MapPresetConfiguration';
export default class DiaryConfiguration {

    //забирать с сервера реплики на -10 уровней, т.к. recipes привязаны к репликам

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
            title: "  Дом, милый дом!  ",
            details: "Полон загадок и секретов. Получится ли у Вас разгадать их все?",
            resultImage: "",
            picture: "housePic",
            fromLevel: 1,
        },
        {
            id: "rec1",
            title: "Непредсказуемое зелье",
            details: "Зелье с неизвестными свойствами. Применять крайне осторожно!",
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
            title: "Грибные холмы",
            fromReplica: "r7",
            resultImage: "catAim",
            mapPreset: MapPresetConfiguration.MAP_1,
        },
        {
            id: "rec2",
            title: "Грибной суп для КБ",
            details: "Секретный ингредиент - хрустящий мухомор. Объеденье!",
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
            title: "Ягодный напиток для КБ",
            details: "Ведьмин гриб пробуждает скрытые способности.",
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
            title: "Восстановление памяти I",
            details: "Этап первый. Восстановление базовых черт характера.",
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
            title: "Восстановление памяти II",
            details: "Этап второй. Восстановление долговременной памяти.",
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
            title: "Восстановление памяти III",
            details: "Этап третий. Полное восстановление памяти.",
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
            title: "  Тёмный лес  ",
            details: "Мрачное и туманное место. По слухам, здесь обитают пугающие существа.",
            resultImage: "tree",
            picture: "dForestPic",
            fromReplica: "r39",
        },
        {
            id: "rec8",
            title: "По следам Единорога ",
            details: "Единорог - естественный обитатель Тёмного леса. Приносит удачу.",
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
            title: "Походный обед",
            details: "Грибочки, жареные на костре. А также свежая лесная ягода",
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
            title: " Междулесье ",
            fromReplica: "r50",
            resultImage: "actionHouse",
            mapPreset: MapPresetConfiguration.MAP_2,
        },
        {
            id: "map3",
            title: "Совиная лощина",
            fromReplica: "r56",
            resultImage: "owl",
            mapPreset: MapPresetConfiguration.MAP_3,
        },
        {
            id: "rec10",
            title: "Новые приметы ",
            details: "Оказывается, совёнок довольно крупный и носит розовые очки.",
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
            title: "Старый чердак",
            details: "Здесь сокрыто множество удивительных вещей, стоит только поискать!",
            resultImage: "actionSphere",
            picture: "atticPic",
            fromReplica: "r66",
        },
        {
            id: "rec12",
            title: "Сапоги-скороходы",
            details: "Именно они помогут добраться до Снежной горы, где ждёт помощи Хозяйка кота и совёнка.",
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
            title: "Поход к лешему",
            details: "Сапоги оказались разряжены. По словам совёнка, Леший знает, как зарядить сапоги.",
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
            title: "Зарядное зелье",
            details: "Рецепт зелья для зарядки сапогов. Основной ингредиент - золотой корень.",
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
            title: "Большое приключение. Часть I",
            titleForProgress: "Большое приключение",
            fromReplica: "r87",
            resultImage: "actionMap",
            mapPreset: MapPresetConfiguration.MAP_4,
        },
        {
            id: "rec15",
            title: "Пшеничные поля",
            details: "Будучи перемолотыми, колоски превращаются в белоснежную пшеничную муку.",
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
            titleForProgress: "Золотая долина",
            fromReplica: "r100",
            resultImage: "actionMap",
        },
        {
            id: "rec14_2",
            copyOf:"rec14",
            title: "Зарядное зелье",
            fromReplica: "r103",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map4_22",
            copyOf:"map4",
            titleForProgress: "Золотая долина",
            fromReplica: "r104",
            resultImage: "actionMap",
        },
        {
            id: "rec16",
            title: " Звенящая глушь ",
            fromReplica: "r107",
            details: "Циклоп пугающий на вид, но с тонкой творческой натурой, попросил отыскать инструмент.",
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
            title: " Туманные дебри ",
            fromReplica: "r114",
            details: "После возвращения волторны циклоп вызвался проводить путников до края Тёмного леса.",
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
            title: "Зарядное зелье",
            fromReplica: "r115",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map5",
            title: "Большое приключение. Часть II",
            titleForProgress: "Цветущий край",
            fromReplica: "r118",
            resultImage: "actionMap",
            mapPreset: MapPresetConfiguration.MAP_5,
        },
        {
            id: "rec18",
            title: " Соловьиные луга ",
            fromReplica: "r123",
            details: "Коварные гномики поймали нашего Совёнка и требуют взамен соловья!",
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
            titleForProgress:"Радужные поля",
            fromReplica: "r131",
            resultImage: "actionMap",
        },
        {
            id: "rec14_4",
            copyOf:"rec14",
            title: "Зарядное зелье",
            fromReplica: "r135",
            resultImage: "boots",
            resultImageForProgress: "goldRoot",
        },
        {
            id: "map5_3",
            copyOf:"map5",
            titleForProgress: "Сизое предгорье",
            fromReplica: "r139",
            resultImage: "actionMap",
        },


        {
            id: "last2",
            title: "",
            details: "",
            fromLevel: 300,
            requiredItems: [
                { name: "mushroom", count: 10 },
                { name: "mushroom3", count: 15 },
                { name: "chamomileSmall", count: 2 }
            ]
        },
    ]


}


