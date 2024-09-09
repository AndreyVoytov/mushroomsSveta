import AdminService from "../../core/service/AdminService";
import Settings from "../../core/service/Settings";
import AnalyticUtils from "../../core/utils/AnalyticUtils";
import BootSettings from "../screen/common/BootSettings";
import LogoScreen from "../screen/common/LogoScreen";
import EditorScreen from "../screen/EditorScreen";
import EditReplicaScreen from "../screen/EditReplicaScreen";
import ForestScreen from "../screen/ForestScreen";
import HouseScreen from "../screen/HouseScreen";
import LoadingScreen from "../screen/LoadingScreen";
import CustomizationType from './../../core/model/enum/CustomizationType';

export default class Game extends Phaser.Game {

    private static instance: Game;

    public static isSmallDesktopForOk(): boolean {
        return AnalyticUtils.getCustomization() == CustomizationType.odkl && window.innerHeight < 800 + (28 + 48);
    }

    public static SMALL_DESKTOP_RATIO = 1.5;
    public static DESKTOP_WIDTH = window.innerHeight >= 900 ? 580 : 500;
    public static GAME_WIDTH = 960;

    public static MAX_HEIGHT = 1800;

    public static CAN_USE_WEBP = false;
    public static SOUND_ENABLED = true;

    public static WHITE_TRANSITION = false;

    public static LOCAL_USER_ID = null;
    public static LOCAL_USER = null;


    public static getInstance(): Game {
        return Game.instance;
    }

    constructor() {
        super(Game.getWidth(), Game.getHeight(), Settings.isOkApp() ? Phaser.WEBGL : Phaser.CANVAS, 'content', null);
        console.log("width: " + Game.getWidth() + ", heifth: " + Game.getHeight())

        Game.CAN_USE_WEBP = Game.canUseWebP();

        AnalyticUtils.init();

        Game.instance = this;
        this.createScenes();
    }

    preload() {
        this.load.crossOrigin = 'anonymous';
    }

    private createScenes() {
        //add new screen here
        this.state.add("BootSettings", BootSettings, false); //почему-то ломается после минификации, если вставлять класс
        this.state.add("LoadingScreen", LoadingScreen, false);
        this.state.add(LogoScreen.toString(), LogoScreen, false);
        this.state.add(HouseScreen.toString(), HouseScreen, false);
        this.state.add(ForestScreen.toString(), ForestScreen, false);
        this.state.add(EditorScreen.toString(), EditorScreen, false);
        this.state.add(EditReplicaScreen.toString(), EditReplicaScreen, false);

        //BootSettings -> LoadingScreen -> ForestScreen
        this.startScene("BootSettings", true, false);
    }

    public startScene(state: any, clearWorld?: boolean, clearCache?: boolean) {
        let stateId = state.toString();

        this.state.start(stateId, clearWorld, clearCache);
    }

    public static getWidth(): number {
        return Game.GAME_WIDTH;
    }

    public static getHeight(): number {
        if (window.innerHeight < window.innerWidth) {
            if (Game.isSmallDesktopForOk()) {
                return Game.GAME_WIDTH * Game.SMALL_DESKTOP_RATIO;
            } else {
                let ratio = Game.GAME_WIDTH / Game.DESKTOP_WIDTH;
                return Math.min(Game.MAX_HEIGHT, window.innerHeight * ratio);
            }
        }
        return window.innerHeight * Game.GAME_WIDTH / window.innerWidth;
    }

    private static canUseWebP(): boolean {
        if (AdminService.isNoWebpMode()) {
            return false;
        }

        var elem = document.createElement('canvas');

        if (!!(elem.getContext && elem.getContext('2d'))) {
            // was able or not to get WebP representation
            return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
        }

        // very old browser like IE 8, canvas not supported
        return false;
    }

    // FPS checking:
    //     this.time.advancedTiming = true;
    //     console.log("FPS: " + this.time.fps)
}






