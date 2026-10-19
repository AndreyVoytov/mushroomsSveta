export type WorldStat = 'energy' | 'bravery' | 'knowledge' | 'friendship' | 'strength' | 'charm' | 'kindness';
export interface EncounterState { discoveredAt: number; completedAt?: number; choice?: number; attempts?: number; }
export interface AdventureState { unlockedAt: number; startedAt?: number; progress: number; completedAt?: number; }
export interface CharacterLevelGain { fromLevel: number; toLevel: number; bonuses: { [skill: string]: number }; }
export interface CharacterGrowthState {
    level: number; seed: number; bonuses: { [skill: string]: number };
    announcedLevel: number; pending: { [skill: string]: number }; lastGain?: CharacterLevelGain;
}
export interface WorldState {
    version: number;
    wardrobe: string[];
    appearance: { [character: string]: string };
    training: { [character: string]: { [stat: string]: number } };
    relationships: { [pair: string]: number };
    dailyActions: { [action: string]: string };
    memories: string[];
    encounters: { [id: string]: EncounterState };
    adventures: { [id: string]: AdventureState };
    materials: { [id: string]: number };
    seasons: { [id: string]: {points: number; premium: boolean; claims: string[]} };
    weeklies: { [id: string]: {points:number;claimed:boolean} };
    expeditionsCompleted: number;
    tutorialPages: string[];
    gifts: { [id: string]: number };
    relationshipSteps: string[];
    relationshipChoices: { [step: string]: string };
    roomDecor: { [character: string]: string[] };
    characterGrowth: { [character: string]: CharacterGrowthState };
}
export function emptyWorldState(): WorldState {
    return {version:1,wardrobe:[],appearance:{},training:{},relationships:{},dailyActions:{},memories:[],encounters:{},adventures:{},
        materials:{wood:0,clover:0},seasons:{},weeklies:{},expeditionsCompleted:0,tutorialPages:[],gifts:{},relationshipSteps:[],relationshipChoices:{},roomDecor:{},characterGrowth:{}};
}
