import AimType from '../../model/enum/AimType';
import Utils from './../../utils/Utils';
import Label from './../../../view/component/panel/Label';
export default class ForestAim {
    type: AimType;
    image: string;
    countLeft: number;
    countLeftImmediate: number;
    countCollected: number = 0
    startCount: number;
    label: Label;
    sprite: Phaser.Sprite;
    constructor(type: AimType, image: string, count: number) {
        this.type = type;
        this.image = image;
        this.countLeft = count;
        this.countLeftImmediate = count;
        this.startCount = count;
    }

    //TODO aim configuration
    public static getAimsInfo(aim: ForestAim): string {
        if (aim.type == AimType.ladybug) {
            return "Спустите " + aim.countLeft+ " " + ForestAim.getWord(aim);
        } else {
            return "Найдите " + aim.countLeft + " " + ForestAim.getWord(aim);
        }
    }

    private static getWord(aim: ForestAim): string {
        if(aim.image == "poleno"){
            return Utils.chooseRussianWord(aim.countLeft, "полено", "полена", "поленьев");
        } else if (aim.image == "t27") {
            return Utils.chooseRussianWord(aim.countLeft, "тыкву", "тыквы", "тыкв");
        } else if (aim.image == "t24") {
            return Utils.chooseRussianWord(aim.countLeft, "перец", "перца", "перцев");
        } else if (aim.image == "t25") {
            return Utils.chooseRussianWord(aim.countLeft, "сливу", "сливы", "слив");
        } else if (aim.image == "mushroom" || aim.image == "witchMushroom") {
            return Utils.chooseRussianWord(aim.countLeft, "гриб", "гриба", "грибов");
        } else if (aim.image == "mushroom3") {
            return Utils.chooseRussianWord(aim.countLeft, "лисичку", "лисички", "лисичек");
        } else if (aim.image == "chamomileSmall") {
            return Utils.chooseRussianWord(aim.countLeft, "ромашку", "ромашки", "ромашек");
        } else if (aim.image == "ladybug") {
            return Utils.chooseRussianWord(aim.countLeft, "коровку", "коровки", "коровок");
        } else if (aim.image.startsWith("bug")) {
            return Utils.chooseRussianWord(aim.countLeft, "жука", "жука", "жуков");
        } else if (aim.image.startsWith("book3")) {
            return Utils.chooseRussianWord(aim.countLeft, "книжку", "книжки", "книжек");
        } else if (aim.image.startsWith("goldRoot")) {
            return Utils.chooseRussianWord(aim.countLeft, "корешок", "корешка", "корешков");
        } else if (aim.image.startsWith("wheat")) {
            return Utils.chooseRussianWord(aim.countLeft, "колосок", "колоска", "колосков");
        } else if (aim.image == "blackberry" || aim.image == "cankerberry" || aim.image == "blueberry") {
            return Utils.chooseRussianWord(aim.countLeft, "ягоду", "ягоды", "ягод");
        } else if (aim.type == AimType.itemsBunch) {
            return Utils.chooseRussianWord(aim.countLeft, "предмет", "предмета", "предметов");
        }
        return Utils.chooseRussianWord(aim.countLeft, "предмет", "предмета", "предметов");
    }

    public static getCompleteInfo(aims: ForestAim[]): string {
        if (aims.length > 1) {
            return "Все цели достигнуты!";
        } else if (aims[0].type == AimType.ladybug) {
            if (aims[0].image == "ladybug"){
                return aims[0].countLeft == 1 ? "Коровка переправлена!" : "Все коровки переправлены!";
            } else {
                return aims[0].countLeft == 1 ? "Жук переправлен!" : "Все жуки переправлены!";
            }
        } else if (aims[0].type == AimType.itemsBunch) {
            return "Все предметы собраны!"
        } else if (aims[0].type == AimType.flower && aims[0].image == "chamomileSmall") {
            return "Все ромашки собраны!"
        } else if (aims[0].type == AimType.item && aims[0].image == "mushroom") {
            return "Все грибы собраны!"
        } else if (aims[0].type == AimType.item && aims[0].image == "mushroom3") {
            return "Все лисички собраны!"
        } else if (aims[0].type == AimType.item && (aims[0].image == "blueberry" || aims[0].image == "blackberry" || aims[0].image == "strawberry")) {
            return "Все ягоды собраны!"
        }
        return "Все предметы собраны!"
    }
}


