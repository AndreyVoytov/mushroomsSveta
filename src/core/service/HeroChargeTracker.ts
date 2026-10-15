import HeroParty from './HeroParty';

/** Level-local gross expenditure; energy refunds never subtract charge. */
export default class HeroChargeTracker {
    private charge: {[hero: string]: number} = {};
    private members: string[];
    private cursor = 0;

    constructor(members: string[]) {
        this.members = members.slice();
        this.members.forEach(id => this.charge[id] = 0);
    }

    public spend(amount: number): void {
        if (!isFinite(amount) || amount <= 0) return;
        this.members.forEach(id => this.charge[id] += amount);
    }

    public value(id: string): number { return this.charge[id] || 0; }

    public progress(id: string): number {
        const hero = HeroParty.heroes.filter(h => h.id == id)[0];
        return hero ? Math.min(1, this.value(id) / hero.energy) : 0;
    }

    public nextReady(): string {
        return this.readyMembers()[0] || null;
    }

    public readyMembers(): string[] {
        const ready: string[] = [];
        for (let i = 0; i < this.members.length; i++) {
            const id = this.members[(this.cursor + i) % this.members.length];
            if (this.progress(id) >= 1) ready.push(id);
        }
        return ready;
    }

    public consume(id: string): void {
        const hero = HeroParty.heroes.filter(h => h.id == id)[0];
        if (!hero || this.value(id) < hero.energy) return;
        this.charge[id] -= hero.energy;
        this.cursor = (this.members.indexOf(id) + 1) % Math.max(1, this.members.length);
    }
}
