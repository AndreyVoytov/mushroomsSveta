import StoryLocation from '../enum/StoryLocation';
import ServerStoreComponent from '../../service/store/ServerStoreComponent';
import BoosterType from '../enum/BoosterType';
import UserService from '../../service/UserService';
import LifeUtils from '../../utils/LifeUtils';
import EverydayRubyPanel from '../../../view/component/house/EverydayRubyPanel';
import SoundUtils from '../../utils/SoundUtils';
import EventInfo from './../event/EventInfo';
import Utils from './../../utils/Utils';
import EnergyUtils from '../../utils/EnergyUtils';
import { createEmptyUserTasksState, UserTasksState } from '../task/TaskModels';
export default class User {

    public createdAt: string = new Date().toISOString();
    public lastLoginAt: string = new Date().toISOString();
    
    public supermoneyTakenAt: number = Date.now();
    public events: EventInfo[] = [];

    private spendOnLevel: number = 0;

    private supermoney: number = 300;
    private keys: number = 0;
    private lifes: number = 5;
    private energy: number = EnergyUtils.START_ENERGY;
    private currentForest: number = 0;
    private currentReplica: number = 0;
    private friendsInGame:number = 0;
    
    private winsInRow?:number = 0;
    private interruptWinsRow?:boolean = false;

    private boosters:{type: BoosterType, count: number}[] = [];
    // private compasses: number = 0;
    private justCompletedLevel: boolean = false;

    private lastRegenerationAt: number = Date.now();
    private lastEnergyRegenerationAt: number = Date.now();
    private energyPurchaseDayId: string = EnergyUtils.getMoscowDayId();
    private energyPurchasesToday: number = 0;

    private markers: string[] = [];
    private completedReplicas: string[] = [];
    private completedTasks: string[] = ["rec0"];
    private tasksState: UserTasksState = createEmptyUserTasksState();

    private location:StoryLocation;
    private afterLevelLocation:StoryLocation;

    private platform?:string;
    private platformSource?:string;

    //TODO looses vs wins

    constructor(user?: User) {
        if (user) {
            this.spendOnLevel = user.spendOnLevel || 0;
            this.events = user.events || [];
            this.createdAt = user.createdAt || "2020-10-01T22:49:12.681Z";
            this.lastLoginAt = user.lastLoginAt || new Date().toISOString();
            this.interruptWinsRow = user.interruptWinsRow || false;
            this.winsInRow = user.winsInRow || 0;
            this.platform = user.platform;
            this.platformSource = user.platformSource;
            this.supermoney = user.supermoney;
            this.supermoneyTakenAt = user.supermoneyTakenAt;
            this.currentForest = user.currentForest;
            this.friendsInGame = user.friendsInGame;
            // this.compasses = user.compasses;
            this.keys = user.keys;
            this.lifes = user.lifes;
            this.energy = user.energy == null ? EnergyUtils.START_ENERGY : user.energy;
            this.lastRegenerationAt = user.lastRegenerationAt;
            this.lastEnergyRegenerationAt = user.lastEnergyRegenerationAt || Date.now();
            this.energyPurchaseDayId = user.energyPurchaseDayId || EnergyUtils.getMoscowDayId();
            this.energyPurchasesToday = user.energyPurchasesToday || 0;
            this.currentReplica = user.currentReplica;
            this.markers = user.markers;
            this.completedReplicas = user.completedReplicas;
            this.completedTasks = user.completedTasks;
            this.tasksState = user.tasksState || createEmptyUserTasksState();
            // this.items = user.items;
            this.justCompletedLevel = user.justCompletedLevel;

            this.afterLevelLocation = user.afterLevelLocation;
            this.location = user.location;
            this.boosters = user.boosters;
        } else {
            this.location = StoryLocation.forest;
        }
    }

    public getEvents():EventInfo[]{
        return this.events;
    }
    public addEvent(eventInfo: EventInfo):void{
        this.events.push(eventInfo);
        ServerStoreComponent.saveLocalUser(this);
    }
    public deleteEvent(eventInfo: EventInfo):void{
        Utils.delete(this.events, eventInfo);
        ServerStoreComponent.saveLocalUser(this);
    }

    public getSpendOnLevel():number{
        return this.spendOnLevel;
    }
    public setSpendOnLevel(level: number):void{
        this.spendOnLevel = level;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getLocation():StoryLocation{
        return this.location;
    }
    public setLocation(location: StoryLocation):void{
        this.location = location;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getAfterLevelLocation():StoryLocation{
        return this.afterLevelLocation;
    }
    public setAfterLevelLocation(afterLevelLocation: StoryLocation):void{
        this.afterLevelLocation = afterLevelLocation;
    }

    public getSupermoney(): number {
        return this.supermoney;
    }

    public setSupermoney(value: number): void {
        this.supermoney = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public setLastLoginAt(time: Date): void {
        this.lastLoginAt = time.toISOString();
        ServerStoreComponent.saveLocalUser(this);
    }

    public setFriendsInGame(value: number): void {
        this.friendsInGame = value;
        ServerStoreComponent.saveLocalUser(this);
    }
    
    public setWinsInRow(value:number):void{
        this.winsInRow = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public isInterruptWinRows():boolean{
        return this.interruptWinsRow;
    }

    public setInterruptWinsRow(value:boolean):void{
        this.interruptWinsRow = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getWinsInRow():number{
        return this.winsInRow;
    }

    public getFriendsInGame(): number {
        return this.friendsInGame;
    }

    public getCurrentForest(): number {
        return this.currentForest;
    }

    public incrementCurrentForest(): void {
        if(this.afterLevelLocation){
            console.log("USER USE AFTER LEVEL LOCATION: " + this.afterLevelLocation)
            this.location = this.afterLevelLocation;
            this.afterLevelLocation = null;
        }
        this.currentForest ++;

        if(this.getWinsInRow()) {
            this.setWinsInRow(this.getWinsInRow() + 1);
        } else {
            this.setWinsInRow(1);
        }
        this.setInterruptWinsRow(false);

        ServerStoreComponent.saveLocalUser(this);
    }

    public setCurrentForest(value: number): void {
        this.currentForest = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getBoostersCount(type:BoosterType): number {
        let booster = this.boosters.filter(b => b.type == type).shift();

        if(booster){
            return booster.count;
        }

        return 0;
    }

    public increaseBoostersCount(type:BoosterType, value: number):void{
        this.setBoostersCount(type, Math.max(0, this.getBoostersCount(type) + value));
    }

    public setBoostersCount(type:BoosterType, value: number): void {
        let booster = this.boosters.filter(b => b.type == type).shift();

        if(value == 0){
            this.boosters = this.boosters.filter(b => b.type != type);
        } else if(booster){
            booster.count = value;
        } else {
            this.boosters.push({type: type, count: value});
        }

        ServerStoreComponent.saveLocalUser(this);
    }
    // public getCompasses(): number {
    //     return this.compasses;
    // }

    // public setCompasses(value: number): void {
    //     this.compasses = value;
    //     ServerStoreComponent.saveLocalUser(this);
    // }

    // public getBoosterCount(boosterName:string):number{
    //     // if(boosterName == "compass"){
    //     //     return this.getCompasses();
    //     // } else if (boosterName == "compass")
    // }

    public getKeys(): number {
        return this.keys;
    }

    public setKeys(value: number): void {
        this.keys = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getMarkers(): string[] {
        return this.markers;
    }

    public addMarker(marker: string) {
        this.markers.push(marker);
        ServerStoreComponent.saveLocalUser(this);
    }

    public addCompletedReplica(id: string): void {
        console.log("COMPLETED REPLICA: " + id)
        this.completedReplicas.push(id);
        ServerStoreComponent.saveLocalUser(this);
    }

    public getCompletedTasks(): string[] {
        return this.completedTasks;
    }

    public addCompletedTask(id: string): void {
        console.log("COMPLETED TASK: " + id)
        this.completedTasks.push(id);
        ServerStoreComponent.saveLocalUser(this);
    }

    public getTasksState(): UserTasksState {
        if (!this.tasksState) {
            this.tasksState = createEmptyUserTasksState();
        }
        return this.tasksState;
    }

    public setTasksState(state: UserTasksState): void {
        this.tasksState = state || createEmptyUserTasksState();
        ServerStoreComponent.saveLocalUser(this);
    }

    public saveTasksState(): void {
        if (!this.tasksState) {
            this.tasksState = createEmptyUserTasksState();
        }
        ServerStoreComponent.saveLocalUser(this);
    }

    public getCompletedReplicas(): string[] {
        return this.completedReplicas;
    }

    // public getItems(): UserItemType[] {
    //     return this.items;
    // }

    // public addItem(item: UserItemType): void {
    //     let alreadyHaveItem = this.items.filter(i => i.name == item.name).shift();
    //     if (alreadyHaveItem) {
    //         alreadyHaveItem.count += item.count;
    //         if (alreadyHaveItem.count <= 0) {
    //             Utils.delete(this.items, alreadyHaveItem);
    //         }
    //     } else {
    //         this.items.push(item);
    //     }
    //     UserManager.saveUser(this);
    // }

    //energy
    public getEnergy(): number {
        this.updateEnergy();
        return this.energy;
    }

    public getLastEnergyRegenerationAt(): number {
        this.updateEnergy();
        return this.lastEnergyRegenerationAt;
    }

    public getEnergyPurchasesToday(): number {
        this.resetDailyEnergyPurchasesIfNeeded();
        return this.energyPurchasesToday;
    }

    public getCurrentEnergyPurchasePrice(): number {
        return EnergyUtils.getEnergyPurchasePrice(this.getEnergyPurchasesToday());
    }

    public addEnergy(amount: number, allowOverflow?: boolean): void {
        this.updateEnergy();

        const nextEnergy = Math.max(0, this.energy + amount);
        this.energy = allowOverflow === false ? Math.min(EnergyUtils.MAX_ENERGY, nextEnergy) : nextEnergy;

        if (this.energy >= EnergyUtils.MAX_ENERGY) {
            this.lastEnergyRegenerationAt = Date.now();
        }

        ServerStoreComponent.saveLocalUser(this);
    }

    public spendEnergy(amount?: number): boolean {
        this.updateEnergy();

        const energyToSpend = amount == null ? 1 : Math.max(0, amount);
        if (energyToSpend == 0) {
            return true;
        }

        if (this.energy < energyToSpend) {
            return false;
        }

        const nextEnergy = this.energy - energyToSpend;
        if (this.energy >= EnergyUtils.MAX_ENERGY && nextEnergy < EnergyUtils.MAX_ENERGY) {
            this.lastEnergyRegenerationAt = Date.now();
        }

        this.energy = nextEnergy;
        ServerStoreComponent.saveLocalUser(this);
        return true;
    }

    public buyEnergyPack(): boolean {
        this.resetDailyEnergyPurchasesIfNeeded();

        const price = this.getCurrentEnergyPurchasePrice();
        if (this.supermoney < price) {
            return false;
        }

        this.supermoney -= price;
        this.energy += EnergyUtils.ENERGY_PER_PURCHASE;
        this.energyPurchasesToday++;
        this.lastEnergyRegenerationAt = Date.now();

        ServerStoreComponent.saveLocalUser(this);
        return true;
    }

    private updateEnergy(): void {
        this.resetDailyEnergyPurchasesIfNeeded();

        if (this.energy >= EnergyUtils.MAX_ENERGY) {
            return;
        }

        let energyToRegenerate = Math.floor((Date.now() - this.lastEnergyRegenerationAt) / EnergyUtils.MILLIS_FOR_ENERGY);
        if (energyToRegenerate <= 0) {
            return;
        }

        energyToRegenerate = Math.min(EnergyUtils.MAX_ENERGY - this.energy, energyToRegenerate);
        this.energy += energyToRegenerate;
        this.lastEnergyRegenerationAt += EnergyUtils.MILLIS_FOR_ENERGY * energyToRegenerate;

        ServerStoreComponent.saveLocalUser(this);
    }

    private resetDailyEnergyPurchasesIfNeeded(): void {
        const currentDayId = EnergyUtils.getMoscowDayId();
        if (this.energyPurchaseDayId == currentDayId) {
            return;
        }

        this.energyPurchaseDayId = currentDayId;
        this.energyPurchasesToday = 0;
        ServerStoreComponent.saveLocalUser(this);
    }

    //lifes
    public getLifes(): number {
        this.updateLifes();
        return this.lifes;
    }

    public getLastRegenerationAt() {
        this.updateLifes();
        return this.lastRegenerationAt;
    }

    public restoreLifeForWin() {
        if (this.lifes < LifeUtils.getLifesMaximum()) {
            this.setLifes(this.lifes + 1);
        }
    }

    public spendLife() {
        this.updateLifes();

        if (this.lifes >= LifeUtils.getLifesMaximum()) {
            this.setLifes(this.lifes - 1);
            this.setLastRegenerationAt(Date.now());
        } else if (this.lifes != 0) {
            this.setLifes(this.lifes - 1);
        }

        this.setInterruptWinsRow(true);
    }

    private updateLifes() {
        let lifesToRegenerate = Math.floor((Date.now() - this.lastRegenerationAt) / LifeUtils.MILLIS_FOR_LIFE);

        if (lifesToRegenerate > 0) {
            lifesToRegenerate = Math.min(LifeUtils.getLifesMaximum() - this.lifes, lifesToRegenerate);
            this.setLifes(this.lifes + lifesToRegenerate);
            this.setLastRegenerationAt(this.lastRegenerationAt + LifeUtils.MILLIS_FOR_LIFE * lifesToRegenerate);
        }
    }

    public tryGiveEverydayGems(game: Phaser.Game):void{
        if(this.haveEverydayGemsToTake()){
            SoundUtils.successfulEverydayGems();
            this.supermoney += EverydayRubyPanel.RUBIES_COUNT;
            this.supermoneyTakenAt = Date.now();
        }
    }

    public haveEverydayGemsToTake():boolean{
        let dayStart = new Date();
        dayStart.setUTCHours(3,0,0,0);
        return dayStart.getTime() > this.supermoneyTakenAt;
    }

    public setLifes(value: number): void {
        this.lifes = Math.min(Math.max(value, 0), LifeUtils.getLifesMaximum());
        ServerStoreComponent.saveLocalUser(this);
    }

    private setLastRegenerationAt(millis: number) {
        this.lastRegenerationAt = millis;
        ServerStoreComponent.saveLocalUser(this);
    }

    public setJustCompletedLevel(value: boolean): void {
        this.justCompletedLevel = value;
        ServerStoreComponent.saveLocalUser(this);
    }

    public isJustCompletedLevel(): boolean {
        return this.justCompletedLevel;
    }

    public getPlatform(): string {
        return this.platform;
    }
    public getPlatformSource(): string {
        return this.platformSource;
    }

    public setPlatform(platform:string): void {
        this.platform = platform;  
        ServerStoreComponent.saveLocalUser(this);
    }
    public setPlatformSource(platformSource:string): void {
        this.platformSource = platformSource;  
        ServerStoreComponent.saveLocalUser(this);
    }



}
