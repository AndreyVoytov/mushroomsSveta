// One game day: midnight UTC+3. Live sessions use monotonic elapsed time.
export default class GameClock {
    private static base = Date.now();
    private static tick = typeof performance !== 'undefined' ? performance.now() : 0;
    private static trusted = false;
    private static source: () => number;
    public static useSource(source:()=>number):void {this.source=source;this.synchronize(source());}
    public static synchronize(timestamp: number): void {
        if (!isFinite(timestamp) || timestamp <= 0) return;
        this.base = timestamp;
        this.tick = typeof performance !== 'undefined' ? performance.now() : 0;
        this.trusted = true;
    }
    public static now(): number {
        if(this.source){try{const n=this.source();if(isFinite(n)&&n>0)return n;}catch(_){} }
        return this.base + (typeof performance !== 'undefined' ? Math.max(0, performance.now() - this.tick) : Math.max(0, Date.now() - this.base));
    }
    public static isTrusted(): boolean { return this.trusted; }
    public static day(timestamp: number = this.now()): string {
        return new Date(timestamp + 3 * 3600000).toISOString().slice(0, 10);
    }
}
