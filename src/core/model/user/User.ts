import StoryLocation from '../enum/StoryLocation';
import ServerStoreComponent from '../../service/store/ServerStoreComponent';
import BoosterType from '../enum/BoosterType';
import UserService from '../../service/UserService';
import LifeUtils from '../../utils/LifeUtils';
import EverydayRubyPanel from '../../../view/component/house/EverydayRubyPanel';
import SoundUtils from '../../utils/SoundUtils';
import EventInfo from './../event/EventInfo';
import UserEventState from './../event/UserEventState';
import Utils from './../../utils/Utils';
import EnergyUtils from '../../utils/EnergyUtils';
import { createEmptyUserTasksState, UserTasksState } from '../task/TaskModels';
import { ShopArtifactBackpackEntry, ShopArtifactSkillId } from '../shop/ShopArtifactModels';
import CharactersConfiguration from '../../configuration/CharactersConfiguration';
import { CHARACTER_ARTIFACT_SLOTS, CharacterArtifactEntry, CharacterArtifactSlotId, CharacterSkillValue, UserCharacterEquipment, UserCharacterState } from '../character/CharacterModels';
export default class User {

    public createdAt: string = new Date().toISOString();
    public lastLoginAt: string = new Date().toISOString();
    
    public supermoneyTakenAt: number = Date.now();
    public events: EventInfo[] = [];
    public eventStates: UserEventState[] = [];

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
    private backpack: ShopArtifactBackpackEntry[] = [];
    private characters: UserCharacterState[] = [];
    private currentCharacterId: string = null;

    private location:StoryLocation;
    private afterLevelLocation:StoryLocation;

    private platform?:string;
    private platformSource?:string;

    //TODO looses vs wins

    constructor(user?: User) {
        if (user) {
            this.spendOnLevel = user.spendOnLevel || 0;
            this.events = user.events || [];
            this.eventStates = (user.eventStates || []).map(state => new UserEventState(state));
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
            this.markers = user.markers || [];
            this.completedReplicas = user.completedReplicas || [];
            this.completedTasks = user.completedTasks || ["rec0"];
            this.tasksState = user.tasksState || createEmptyUserTasksState();
            this.backpack = (user.backpack || [])
                .filter(entry => !!entry && !!entry.id)
                .map(entry => ({
                    id: entry.id,
                    level: Math.max(1, entry.level || 1)
                }));
            this.characters = this.normalizeCharacters(user.characters || []);
            this.currentCharacterId = user.currentCharacterId || null;
            // this.items = user.items;
            this.justCompletedLevel = user.justCompletedLevel;

            this.afterLevelLocation = user.afterLevelLocation;
            this.location = user.location;
            this.boosters = user.boosters || [];
        } else {
            this.location = StoryLocation.forest;
        }

        this.ensureStartCharacter();
        this.ensureCurrentCharacterId();
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

    public getEventStates(): UserEventState[] {
        if (!this.eventStates) {
            this.eventStates = [];
        }
        return this.eventStates;
    }

    public getEventState(eventId: string): UserEventState {
        return this.getEventStates().filter(state => state.eventId == eventId).shift();
    }

    public getOrCreateEventState(eventId: string): UserEventState {
        let eventState = this.getEventState(eventId);
        if (!eventState) {
            eventState = new UserEventState();
            eventState.eventId = eventId;
            this.getEventStates().push(eventState);
        }
        return eventState;
    }

    public saveEventStates(): void {
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
        this.ensureStoryCharactersUnlocked();
        ServerStoreComponent.saveLocalUser(this);
    }

    public addCompletedReplica(id: string): void {
        console.log("COMPLETED REPLICA: " + id)
        this.completedReplicas.push(id);
        this.ensureReplicaCharactersUnlocked(id);
        ServerStoreComponent.saveLocalUser(this);
    }

    public deleteCompletedReplicasByPrefix(prefix: string): void {
        this.completedReplicas = (this.completedReplicas || []).filter(id => id.indexOf(prefix) != 0);
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

    public getCharacters(): UserCharacterState[] {
        if (!this.characters) {
            this.characters = [];
        }
        return this.characters;
    }

    public getCharacterById(characterId: string): UserCharacterState {
        return this.getCharacters().filter(character => character.id == characterId).shift();
    }

    public hasCharacter(characterId: string): boolean {
        return !!this.getCharacterById(characterId);
    }

    public unlockCharacter(characterId: string): UserCharacterState {
        const existing = this.getCharacterById(characterId);
        if (existing) {
            return existing;
        }

        const state = this.createCharacterState(characterId);
        if (!state) {
            return null;
        }

        this.getCharacters().push(state);
        if (!this.currentCharacterId) {
            this.currentCharacterId = characterId;
        }

        ServerStoreComponent.saveLocalUser(this);
        return state;
    }

    public getCurrentCharacterId(): string {
        this.ensureCurrentCharacterId();
        return this.currentCharacterId;
    }

    public setCurrentCharacterId(characterId: string): void {
        if (!this.hasCharacter(characterId)) {
            return;
        }

        this.currentCharacterId = characterId;
        ServerStoreComponent.saveLocalUser(this);
    }

    public getCurrentCharacter(): UserCharacterState {
        return this.getCharacterById(this.getCurrentCharacterId());
    }

    public getCharacterSkillValue(characterId: string, skillId: ShopArtifactSkillId): number {
        const character = this.getCharacterById(characterId);
        if (!character) {
            return 0;
        }

        const skill = (character.skills || []).filter(skillValue => skillValue.skillId == skillId).shift();
        return skill ? Math.max(0, skill.value || 0) : 0;
    }

    public getCharacterEquippedArtifacts(characterId: string): UserCharacterEquipment {
        const character = this.getCharacterById(characterId);
        if (!character) {
            return {};
        }

        if (!character.equippedArtifacts) {
            character.equippedArtifacts = {};
        }

        return character.equippedArtifacts;
    }

    public getCharacterEquippedArtifact(characterId: string, slot: CharacterArtifactSlotId): CharacterArtifactEntry {
        return this.getCharacterEquippedArtifacts(characterId)[slot];
    }

    public equipArtifactToCharacter(characterId: string, slot: CharacterArtifactSlotId, artifactId: string, level?: number): void {
        this.equipArtifactToCharacterReplacingExisting(characterId, slot, artifactId, level);
    }

    public equipArtifactToCharacterReplacingExisting(characterId: string, slot: CharacterArtifactSlotId, artifactId: string, level?: number): void {
        const character = this.getCharacterById(characterId);
        if (!character || !artifactId) {
            return;
        }

        const safeLevel = Math.max(1, level || 1);
        const currentEntry = this.getCharacterEquippedArtifact(characterId, slot);
        if (currentEntry && currentEntry.id != artifactId) {
            this.putArtifactToBackpackInternal(currentEntry.id, currentEntry.level);
        }

        this.removeArtifactFromBackpackInternal(artifactId);
        this.removeEquippedArtifactInternal(artifactId);
        this.getCharacterEquippedArtifacts(characterId)[slot] = { id: artifactId, level: safeLevel };
        ServerStoreComponent.saveLocalUser(this);
    }

    public unequipArtifactToBackpack(characterId: string, slot: CharacterArtifactSlotId): CharacterArtifactEntry {
        const entry = this.getCharacterEquippedArtifact(characterId, slot);
        if (!entry) {
            return null;
        }

        this.putArtifactToBackpackInternal(entry.id, entry.level);
        delete this.getCharacterEquippedArtifacts(characterId)[slot];
        ServerStoreComponent.saveLocalUser(this);

        return {
            id: entry.id,
            level: entry.level
        };
    }

    public getArtifactBackpack(): ShopArtifactBackpackEntry[] {
        if (!this.backpack) {
            this.backpack = [];
        }
        return this.backpack;
    }

    public getArtifactBackpackEntry(id: string): ShopArtifactBackpackEntry {
        return this.getArtifactBackpack().filter(entry => entry.id == id).shift();
    }

    public hasArtifactInBackpack(id: string): boolean {
        return !!this.getArtifactBackpackEntry(id);
    }

    public getArtifactLevel(id: string): number {
        let entry = this.getArtifactBackpackEntry(id);
        return entry ? Math.max(1, entry.level || 1) : 0;
    }

    public hasOwnedArtifact(id: string): boolean {
        return this.getOwnedArtifactLevel(id) > 0;
    }

    public getOwnedArtifactLevel(id: string): number {
        const backpackLevel = this.getArtifactLevel(id);
        if (backpackLevel > 0) {
            return backpackLevel;
        }

        const equippedEntry = this.getEquippedArtifactEntry(id);
        return equippedEntry ? Math.max(1, equippedEntry.level || 1) : 0;
    }

    public putArtifactToBackpack(id: string, level?: number): void {
        this.putArtifactToBackpackInternal(id, level);
        ServerStoreComponent.saveLocalUser(this);
    }

    public setOwnedArtifactLevel(id: string, level?: number): void {
        const safeLevel = Math.max(1, level || 1);
        const backpackEntry = this.getArtifactBackpackEntry(id);
        if (backpackEntry) {
            backpackEntry.level = safeLevel;
            ServerStoreComponent.saveLocalUser(this);
            return;
        }

        const equippedEntry = this.getEquippedArtifactEntry(id);
        if (equippedEntry) {
            equippedEntry.level = safeLevel;
            ServerStoreComponent.saveLocalUser(this);
        }
    }

    public removeArtifactFromBackpack(id: string): void {
        this.removeArtifactFromBackpackInternal(id);
        ServerStoreComponent.saveLocalUser(this);
    }

    public removeOwnedArtifact(id: string): void {
        const removedFromBackpack = this.removeArtifactFromBackpackInternal(id);
        const removedFromEquipment = this.removeEquippedArtifactInternal(id);
        if (removedFromBackpack || removedFromEquipment) {
            ServerStoreComponent.saveLocalUser(this);
        }
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

    private normalizeCharacters(rawCharacters: UserCharacterState[]): UserCharacterState[] {
        return (rawCharacters || [])
            .map(character => this.normalizeCharacterState(character))
            .filter(character => !!character);
    }

    private normalizeCharacterState(rawCharacter: UserCharacterState): UserCharacterState {
        if (!rawCharacter || !rawCharacter.id) {
            return null;
        }

        const config = CharactersConfiguration.getById(rawCharacter.id);
        if (!config) {
            return null;
        }

        const rawSkills = rawCharacter.skills || [];
        const skills: CharacterSkillValue[] = config.skills.map(skill => {
            const existingSkill = rawSkills.filter(skillValue => skillValue && skillValue.skillId == skill.skillId).shift();
            return {
                skillId: skill.skillId,
                value: Math.max(0, existingSkill ? existingSkill.value || skill.value : skill.value)
            };
        });

        const rawEquipment = rawCharacter.equippedArtifacts || {};
        const equippedArtifacts: UserCharacterEquipment = {};
        CHARACTER_ARTIFACT_SLOTS.forEach(slot => {
            const entry = rawEquipment[slot];
            if (entry && entry.id) {
                equippedArtifacts[slot] = {
                    id: entry.id,
                    level: Math.max(1, entry.level || 1)
                };
            }
        });

        return {
            id: rawCharacter.id,
            skills: skills,
            equippedArtifacts: equippedArtifacts
        };
    }

    private createCharacterState(characterId: string): UserCharacterState {
        const config = CharactersConfiguration.getById(characterId);
        if (!config) {
            return null;
        }

        return {
            id: config.id,
            skills: config.skills.map(skill => ({
                skillId: skill.skillId,
                value: Math.max(0, skill.value || 0)
            })),
            equippedArtifacts: {}
        };
    }

    private ensureStartCharacter(): void {
        const startCharacter = CharactersConfiguration.getStartCharacter();
        if (!startCharacter || this.getCharacters().length > 0) {
            return;
        }

        const state = this.createCharacterState(startCharacter.id);
        if (state) {
            this.getCharacters().push(state);
        }
    }

    private ensureStoryCharactersUnlocked(): void {
        if (this.getMarkers().indexOf("catFound") != -1) {
            this.ensureCharacterUnlocked(CharactersConfiguration.BORIS_CHARACTER_ID);
        }

        if (this.getMarkers().indexOf("owl2found") != -1) {
            this.ensureCharacterUnlocked(CharactersConfiguration.OWL_CHARACTER_ID);
        }
    }

    private ensureCharacterUnlocked(characterId: string): void {
        if (!characterId || this.hasCharacter(characterId)) {
            return;
        }

        const state = this.createCharacterState(characterId);
        if (state) {
            this.getCharacters().push(state);
        }
    }

    private ensureReplicaCharactersUnlocked(replicaId: string): void {
        if (replicaId == "r51") {
            this.ensureCharacterUnlocked(CharactersConfiguration.LESHY_CHARACTER_ID);
        }
    }

    private ensureCurrentCharacterId(): void {
        if (this.currentCharacterId && this.hasCharacter(this.currentCharacterId)) {
            return;
        }

        const characters = this.getCharacters();
        this.currentCharacterId = characters.length > 0 ? characters[0].id : null;
    }

    private getEquippedArtifactEntry(id: string): CharacterArtifactEntry {
        const characters = this.getCharacters();
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            for (let j = 0; j < CHARACTER_ARTIFACT_SLOTS.length; j++) {
                const slot = CHARACTER_ARTIFACT_SLOTS[j];
                const entry = this.getCharacterEquippedArtifact(character.id, slot);
                if (entry && entry.id == id) {
                    return entry;
                }
            }
        }

        return null;
    }

    private removeArtifactFromBackpackInternal(id: string): boolean {
        const nextBackpack = this.getArtifactBackpack().filter(entry => entry.id != id);
        if (nextBackpack.length == this.getArtifactBackpack().length) {
            return false;
        }

        this.backpack = nextBackpack;
        return true;
    }

    private removeEquippedArtifactInternal(id: string): boolean {
        let removed = false;

        this.getCharacters().forEach(character => {
            CHARACTER_ARTIFACT_SLOTS.forEach(slot => {
                const entry = this.getCharacterEquippedArtifact(character.id, slot);
                if (entry && entry.id == id) {
                    delete character.equippedArtifacts[slot];
                    removed = true;
                }
            });
        });

        return removed;
    }

    private putArtifactToBackpackInternal(id: string, level?: number): void {
        let entry = this.getArtifactBackpackEntry(id);
        let safeLevel = Math.max(1, level || 1);

        if (entry) {
            entry.level = safeLevel;
        } else {
            this.getArtifactBackpack().push({ id: id, level: safeLevel });
        }
    }



}
