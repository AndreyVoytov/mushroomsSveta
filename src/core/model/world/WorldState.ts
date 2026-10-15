export type WorldStat = 'energy' | 'bravery' | 'knowledge' | 'friendship' | 'strength' | 'charm' | 'kindness';
export interface EncounterState { discoveredAt: number; completedAt?: number; }
export interface AdventureState { unlockedAt: number; startedAt?: number; progress: number; completedAt?: number; }
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
}
export function emptyWorldState(): WorldState {
    return {version:1,wardrobe:[],appearance:{},training:{},relationships:{},dailyActions:{},memories:[],encounters:{},adventures:{},
        materials:{wood:0,clover:0},seasons:{},weeklies:{},expeditionsCompleted:0,tutorialPages:[]};
}
