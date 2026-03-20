import Buy from "../model/shop/Buy";
import BoosterType from "../model/enum/BoosterType";
import AdminService from "./AdminService";

export default class Settings {

    private static GRAPHICS_FROM_ATLASES = true;
    public static USE_WEBP_ATLASES = false;
    public static ATLASES_VERSION = "v1";
    public static isGraphicsFromAtlases():boolean{
        return Settings.GRAPHICS_FROM_ATLASES && !AdminService.isEditMode();
    }

    public static isOkApp():boolean{
        return window.location.href.indexOf("mob_platform=android") != -1 && window.location.href.indexOf("mob_platform=androidweb") == -1;
    }

    public static isOnlyLinearAnimations():boolean {
        return this.isOkApp();
    }

    public static HOST = "https://blabla.com"
    public static KEY = "jt543i089qo6nfffdd]p0-olcfs83uy__"; // TODO maybe replace this later
    public static PLAIN_MODE = false;
    
    public static ANALYTICS_BUILD_VERSION = "0.10";
    public static ANALYTICS_GAME_KEY = "eebdb5bc62804816138a0cedead6729b";
    public static ANALYTICS_GAME_SECRET = "e471ada30814fe1196d16f2583b17e36aa521057";

    public static SUPPORT_MAIL = "redhat.game.help@gmail.com";
    public static OK_GROUP_URL = "https://ok.ru/group/1";

    public static BUYS: Buy[] = [
        { id: "r110", gems: 110, price: 19/*39*/ },
        { id: "r200", gems: 200, price: 39/*75*/ },
        { id: "r1100", gems: 1100, price: 179/*379*/ },
        { id: "r2400", gems: 2400, price: 379/*790*/ },
        { id: "bunch1", name: "buy.bunch1.name", /*oldPrice:295,*/ price: 115, gems: 300, boosters: [{ type: BoosterType.compass, count: 3}, { type: BoosterType.rocket, count: 3}, { type: BoosterType.glove, count: 3} /* , potions: 2 */] },
        { id: "r5000", gems: 5000, price: 790/*1490*/ },
        // { id: "r10500", gems: 10500, price: 2990 },
        { id: "bunch2", name: "buy.bunch2.name", price: 279 /*579*/, gems: 1100, boosters:
                        [{ type: BoosterType.beans, count: 3}, { type: BoosterType.rainbow, count: 3}, { type: BoosterType.vision, count: 3}   /* , potions: 4 */] },
    ]

    /*
    public static MUSIC_CREDITS =
    "Music: \n" +
    "Aquarium - Kevin MacLeod (incompetech.com)\n" +
    "Licensed under Creative Commons: By Attribution 3.0\n" +
    "License http://creativecommons.org/licenses/by/3.0/\n"+
    "fragments used\n\n" +

    "win 02 - rhodesmas (freesound.org)\n" +
    "Licensed under Creative Commons: By Attribution 3.0\n" +
    "License http://creativecommons.org/licenses/by/3.0/\n\n"+
    
    "Other sounds:\n"+
    "freesound.org, freesfx.co.uk\n"
    */
}
