import AimType from '../../model/enum/AimType';
import Utils from './../../utils/Utils';
import Label from './../../../view/component/panel/Label';
export default class ForestAim {
    type: AimType;
    image: string;
    count: number;
    startCount: number;
    label: Label;
    sprite: Phaser.Sprite;
    constructor(type: AimType, image: string, count: number) {
        this.type = type;
        this.image = image;
        this.count = count;
        this.startCount = count;
    }

    //TODO aim configuration
    public static getAimsInfo(aim: ForestAim): string {
        if (aim.type == AimType.ladybug) {
            return "Спустите " + aim.count + " " + ForestAim.getWord(aim);
        } else {
            return "Найдите " + aim.count + " " + ForestAim.getWord(aim);
        }
    }

    private static getWord(aim: ForestAim): string {
        if(aim.image == "poleno"){
            return Utils.chooseRussianWord(aim.count, "полено", "полена", "поленьев");
        } else if (aim.image == "t27") {
            return Utils.chooseRussianWord(aim.count, "тыкву", "тыквы", "тыкв");
        } else if (aim.image == "t24") {
            return Utils.chooseRussianWord(aim.count, "перец", "перца", "перцев");
        } else if (aim.image == "t25") {
            return Utils.chooseRussianWord(aim.count, "сливу", "сливы", "слив");
        } else if (aim.image == "mushroom" || aim.image == "witchMushroom") {
            return Utils.chooseRussianWord(aim.count, "гриб", "гриба", "грибов");
        } else if (aim.image == "mushroom3") {
            return Utils.chooseRussianWord(aim.count, "лисичку", "лисички", "лисичек");
        } else if (aim.image == "chamomileSmall") {
            return Utils.chooseRussianWord(aim.count, "ромашку", "ромашки", "ромашек");
        } else if (aim.image == "ladybug") {
            return Utils.chooseRussianWord(aim.count, "коровку", "коровки", "коровок");
        } else if (aim.image.startsWith("bug")) {
            return Utils.chooseRussianWord(aim.count, "жука", "жука", "жуков");
        } else if (aim.image.startsWith("book3")) {
            return Utils.chooseRussianWord(aim.count, "книжку", "книжки", "книжек");
        } else if (aim.image.startsWith("goldRoot")) {
            return Utils.chooseRussianWord(aim.count, "корешок", "корешка", "корешков");
        } else if (aim.image.startsWith("wheat")) {
            return Utils.chooseRussianWord(aim.count, "колосок", "колоска", "колосков");
        } else if (aim.image == "blackberry" || aim.image == "cankerberry" || aim.image == "blueberry") {
            return Utils.chooseRussianWord(aim.count, "ягоду", "ягоды", "ягод");
        } else if (aim.type == AimType.itemsBunch) {
            return Utils.chooseRussianWord(aim.count, "предмет", "предмета", "предметов");
        }
        return Utils.chooseRussianWord(aim.count, "предмет", "предмета", "предметов");
    }

    public static getCompleteInfo(aims: ForestAim[]): string {
        if (aims.length > 1) {
            return "Все цели достигнуты!";
        } else if (aims[0].type == AimType.ladybug) {
            if (aims[0].image == "ladybug"){
                return aims[0].count == 1 ? "Коровка переправлена!" : "Все коровки переправлены!";
            } else {
                return aims[0].count == 1 ? "Жук переправлен!" : "Все жуки переправлены!";
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


