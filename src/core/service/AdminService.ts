
import DebugScreen from '../../view/screen/common/DebugScreen';
import ForestDao from '../dao/ForestDao';
import ReplicaDao from '../dao/ReplicaDao';
import CustomizationType from '../model/enum/CustomizationType';
import ForestType from '../model/forest/ForestType';
import AnalyticUtils from '../utils/AnalyticUtils';
import EventUtils from '../utils/EventUtils';
import LifeUtils from '../utils/LifeUtils';
import Utils from '../utils/Utils';
import UserService from './UserService';
import Settings from './Settings';
import User from '../model/user/User';
export default class AdminService {

    private static levelReplaced: boolean = false;

    //LIST of tester query parameters:
    //lifes=5               set lifes count
    //loose                 start each level with 1 turn
    //transparent           make cell covers transparent
    //spyCells              add number to every opened cell
    //level=4               every time start specific level
    //edit                  enable edit levels and scenario mode
    //debug                 enable sprite debugging (see DebugScreen)
    //skip                  skip each level
    //clearUser             clear user data
    //diary                 show diary
    //start_event_1         restart event1 from scratch
    //finish_event_1        finish event1 immediately

    private static isAdminToolsEnabled(): boolean {
        return AnalyticUtils.getCustomization() != CustomizationType.odkl || AdminService.isAdminUser();
    }

    public static isAdminUser(): boolean {
        return false;
        // return window.location.href.indexOf("logged_user_id=570508001352") != -1;
    }

    public static addExtraGemsToTester():void{
        //TODO remove
        if(window.location.href.indexOf("logged_user_id=575467406257") != -1){
            let user = UserService.getUser();
            if(user.getSupermoney() < 500){
                user.setSupermoney(50000);
            }    
        }
    }

    public static cacheComplexImages(): boolean {
        // return true;
        return Settings.isOkApp();
    }

    public static skipLevelsToForestType(): ForestType {
        if (!AdminService.isAdminToolsEnabled()) {
            return null;
        }

        let param = AdminService.getQueryParameter('level');
        if (!param || AdminService.levelReplaced) return null;

        let level = Number(param) - 1;

        AdminService.levelReplaced = true;

        let forestType: ForestType;

        let user = UserService.getUser();
        if (level >= ForestDao.getAllForests().length) {
            forestType = ForestDao.getAllForests()[ForestDao.getAllForests().length - 1];
        } else {
            forestType = ForestDao.getAllForests()[level];
        }
        user.setCurrentForest(level);

        let firstReplica = ReplicaDao.getEntity().getAll().filter(r => r.context.level == level).shift();
        let locations = ReplicaDao.getEntity().getLocationForLevelAndReplica(level, firstReplica);
        user.setLocation(locations.location);
        user.setAfterLevelLocation(locations.afterlevelLocation);

        ReplicaDao.getEntity().getAll().forEach(r => {
            if (!r.context || r.context.level < level) {
                if (user.getCompletedReplicas().indexOf(r.id) == -1) user.addCompletedReplica(r.id);
            }
        })

        return forestType;
    }

    public static setEverydayGems(): void {
        if (!AdminService.isAdminToolsEnabled()) {
            return;
        }

        if (window.location.href.indexOf("everyday") != -1) {
            UserService.getUser().supermoneyTakenAt = 0;
        }
    }

    public static setLifes(): void {
        if (!AdminService.isAdminToolsEnabled()) {
            return;
        }

        let param = AdminService.getQueryParameter('lifes');

        let lifesToSet = null;
        if (param) {
            lifesToSet = Number(param);
        } else if (window.location.href.indexOf("lifes") != -1) {
            lifesToSet = LifeUtils.getLifesMaximum();
        }

        if (lifesToSet) {
            UserService.getUser().setLifes(lifesToSet);
        }
    }

    public static setDebugMode(): void {
        if (!AdminService.isAdminToolsEnabled()) {
            return;
        }

        if (window.location.href.indexOf("debug") != -1) {
            DebugScreen.DEBUG_MODE = true;
        }
    }

    public static applyEventCommands(): void {
        if (!AdminService.isAdminToolsEnabled()) {
            return;
        }

        AdminService.getEventCommandIds('finish').forEach(eventId => {
            EventUtils.finishConfiguredEventForAdmin(eventId);
        });

        AdminService.getEventCommandIds('start').forEach(eventId => {
            EventUtils.restartConfiguredEventForAdmin(eventId);
        });
    }

    public static needClearUser(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("clearUser") != -1;
    }

    public static isEditMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("edit") != -1 || AdminService.isAdminUser();
    }

    public static isSkipMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("skip") != -1;
    }

    public static isDiaryMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("diary") != -1;
    }

    public static isSpyCellsMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("spyCells") != -1;
    }

    public static isTransparentMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("transparent") != -1;
    }

    public static isLooseMode(): boolean {
        if (!AdminService.isAdminToolsEnabled()) {
            return false;
        }

        return window.location.href.indexOf("loose") != -1;
    }

    public static isNoWebpMode(): boolean {
        return window.location.href.indexOf("nowebp") != -1;
    }

    private static getQueryParameter(param: string): string {
        const myParam = Utils.getUrlParameter(param);

        if (myParam != null && myParam != "") {
            return myParam;
        }

        return null;
    }

    private static getEventCommandIds(action: 'start' | 'finish'): string[] {
        if (typeof window == "undefined" || !window.location) {
            return [];
        }

        let result: string[] = [];
        let regex = new RegExp("[?&]" + action + "_event_(\\d+)(?:[&#]|$)", "g");
        let match: RegExpExecArray;
        while ((match = regex.exec(window.location.href)) != null) {
            result.push('event' + match[1]);
        }

        return result;
    }

}
