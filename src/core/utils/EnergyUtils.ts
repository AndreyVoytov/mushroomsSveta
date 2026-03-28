export default class EnergyUtils {
    public static START_ENERGY = 120;
    public static MAX_ENERGY = 120;
    public static ENERGY_PER_PURCHASE = 100;
    public static MILLIS_FOR_ENERGY = 30 * 1000;
    public static BASE_PURCHASE_PRICE = 10;

    public static getMoscowDayId(timestamp?: number): string {
        const utcPlus3Millis = (timestamp == null ? Date.now() : timestamp) + 3 * 60 * 60 * 1000;
        const moscowDate = new Date(utcPlus3Millis);
        const year = moscowDate.getUTCFullYear();
        const month = moscowDate.getUTCMonth() + 1;
        const day = moscowDate.getUTCDate();

        return year + "-" + month + "-" + day;
    }

    public static getEnergyPurchasePrice(purchasesToday: number): number {
        return this.BASE_PURCHASE_PRICE * (Math.max(0, purchasesToday) + 1);
    }

    public static getMillisToNextMoscowMidnight(timestamp?: number): number {
        const baseTimestamp = timestamp == null ? Date.now() : timestamp;
        const utcPlus3Millis = baseTimestamp + 3 * 60 * 60 * 1000;
        const moscowDate = new Date(utcPlus3Millis);
        moscowDate.setUTCHours(24, 0, 0, 0);
        return Math.max(0, moscowDate.getTime() - utcPlus3Millis);
    }

    public static getSupportPercent(steps: number, spentEnergy: number): number {
        const baseline = Math.max(1, steps);
        const diff = baseline - Math.max(0, spentEnergy);

        const positiveDelta = 14 * (1 - Math.exp(-Math.max(0, diff) / Math.max(3, baseline / 4)));
        const negativeDelta = 23 * (1 - Math.exp(-Math.max(0, -diff) / Math.max(4, baseline / 3)));
        const percent = Math.round(85 + positiveDelta - negativeDelta);

        return Math.max(62, Math.min(98, percent));
    }
}
