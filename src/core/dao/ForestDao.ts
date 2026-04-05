import ForestType from '../model/forest/ForestType';
import UserService from '../service/UserService';
import BaseDao from './BaseDao';
import ReplicaDao from './ReplicaDao';
import AdminService from '../service/AdminService';

declare const require: {
    context: (path: string, deep?: boolean, filter?: RegExp) => {
        keys(): string[];
        <T>(id: string): T;
    };
};

type ForestConfigurationModule = {
    default: {
        allForests: ForestType[];
    };
};

type ForestBranchInfo = {
    id: string;
    storageId: string;
    dao: ForestDao;
};

export default class ForestDao extends BaseDao<ForestType>{

    private static MAIN_BRANCH_ID = "main";
    private static EVENT_BRANCH_PREFIX = "forestsEvent";
    private static branchEntries: ForestBranchInfo[] = ForestDao.createBranchEntries();

    public static getEntity(branchId: string = ForestDao.MAIN_BRANCH_ID):ForestDao{
        return ForestDao.getBranchInfo(branchId).dao;
    }

    //*********** TODO REMOVE! *******************/
    public static getForestType(index:number){
        return ForestDao.getEntity().getForestType(index);
    }

    public static getEventForestByIdAndIndex(eventId: string, index:number){
        let branchId = ForestDao.getEventBranchId(eventId);
        return branchId ? ForestDao.getEntity(branchId).getForestType(index) : null;
    }

    public static getForestById(id:string, branchId: string = ForestDao.MAIN_BRANCH_ID){
        return ForestDao.getEntity(branchId).getById(id);
    }

    public static indexOf(forestType: ForestType, branchId: string = ForestDao.MAIN_BRANCH_ID){
        return ForestDao.getEntity(branchId).indexOf(forestType);
    }

    public static getAllForests(branchId: string = ForestDao.MAIN_BRANCH_ID): ForestType[]{
        return ForestDao.getEntity(branchId).getAll();
    }

    public static getAllEventForestsById(eventId: string): ForestType[] {
        let branchId = ForestDao.getEventBranchId(eventId);
        return branchId ? ForestDao.getAllForests(branchId) : [];
    }

    public static getBranchIds(): string[] {
        return ForestDao.branchEntries.map(branch => branch.id);
    }

    public static hasBranch(branchId: string): boolean {
        return ForestDao.branchEntries.some(branch => branch.id == branchId);
    }

    public static getDefaultBranchId(): string {
        return ForestDao.MAIN_BRANCH_ID;
    }

    public static getEventBranchId(eventId: string): string {
        let match = eventId ? eventId.match(/^event(\d+)$/i) : null;
        if (!match) {
            return null;
        }

        let branchId = ForestDao.EVENT_BRANCH_PREFIX + match[1];
        return ForestDao.hasBranch(branchId) ? branchId : null;
    }

    /****************************************/

    public getForestType(index: number) {
        return AdminService.skipLevelsToForestType() || this.doGetForestType(index);
    }

    private doGetForestType(index: number): ForestType {
        if (index >= this.objects.length) {
            return this.objects[this.objects.length - 1];
        } else {
            return this.objects[index];
        }
    }

    private static getBranchInfo(branchId: string): ForestBranchInfo {
        return ForestDao.branchEntries.filter(branch => branch.id == branchId).shift()
            || ForestDao.branchEntries.filter(branch => branch.id == ForestDao.MAIN_BRANCH_ID).shift();
    }

    private static createBranchEntries(): ForestBranchInfo[] {
        ForestDao.migrateLegacyBranchStorage();

        let context = require.context('../configuration', false, /^\.\/Forest(?:Event\d+)?Configuration\.ts$/);
        return context.keys()
            .map(key => ForestDao.createBranchInfo(key, context<ForestConfigurationModule>(key)))
            .filter(branch => branch ? true : false)
            .sort((branch1, branch2) => ForestDao.getBranchOrder(branch1.id) - ForestDao.getBranchOrder(branch2.id));
    }

    private static createBranchInfo(moduleKey: string, module: ForestConfigurationModule): ForestBranchInfo {
        let branchId = ForestDao.getBranchId(moduleKey);
        if (!branchId || !module || !module.default || !module.default.allForests) {
            return null;
        }

        return {
            id: branchId,
            storageId: ForestDao.getBranchStorageId(branchId),
            dao: new ForestDao(ForestDao.getBranchStorageId(branchId), module.default.allForests)
        };
    }

    private static getBranchId(moduleKey: string): string {
        let eventBranch = moduleKey.match(/^\.\/ForestEvent(\d+)Configuration\.ts$/);
        if (eventBranch) {
            return ForestDao.EVENT_BRANCH_PREFIX + eventBranch[1];
        }

        if (moduleKey == "./ForestConfiguration.ts") {
            return ForestDao.MAIN_BRANCH_ID;
        }

        return null;
    }

    private static getBranchStorageId(branchId: string): string {
        if (branchId == ForestDao.MAIN_BRANCH_ID) {
            return "forests2";
        }

        return branchId;
    }

    private static getBranchOrder(branchId: string): number {
        if (branchId == ForestDao.MAIN_BRANCH_ID) {
            return 0;
        }

        let eventBranch = branchId.match(/^forestsEvent(\d+)$/);
        if (eventBranch) {
            return parseInt(eventBranch[1], 10) + 1;
        }

        return 1000;
    }

    private static migrateLegacyBranchStorage(): void {
        if (typeof localStorage == "undefined") {
            return;
        }

        let legacyEvent1Levels = localStorage.getItem("event1Forests");
        let currentEvent1Levels = localStorage.getItem("forestsEvent1");
        if (legacyEvent1Levels && !currentEvent1Levels) {
            localStorage.setItem("forestsEvent1", legacyEvent1Levels);
        }
    }

}


