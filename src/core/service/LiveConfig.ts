export default class LiveConfig {
    public static version = 'world-1';
    public static readonly defaults = {
        firstEventLevel: 8, tasksLevel: 4, worldLevel: 5,
        adMinSeconds: 180, adMaxPerSession: 4, adFirstLevel: 10, adControlPercent: 10,
        dailyRerolls: 1, seasonDays: 28
    };
    private static values: any = {};
    public static get(name: string): number { return this.values[name] == null ? this.defaults[name] : this.values[name]; }
    public static apply(values: any): void {
        const safe: any = {};
        Object.keys(this.defaults).forEach(key => {
            if(!values||values[key]==null)return;
            const n = Number(values && values[key]);
            if (isFinite(n) && n >= (key==='seasonDays'?1:0) && n <= 10000) safe[key] = Math.floor(n);
        });
        this.values = safe;
        if (values && typeof values.version === 'string') this.version = values.version.slice(0, 40);
    }
}
