import LiveConfig from './LiveConfig';
import GameClock from './GameClock';
import UserService from './UserService';
import Telemetry from './Telemetry';
export default class AdPacing {
    private static last=GameClock.now();
    private static count=0;
    public static isControl():boolean {
        const id=UserService.getUser().createdAt||'';let hash=0;for(let i=0;i<id.length;i++)hash=(hash*31+id.charCodeAt(i))>>>0;
        return hash%100<Math.min(100,LiveConfig.get('adControlPercent'));
    }
    public static canShow(level:number):boolean {
        return !this.isControl()&&level>=LiveConfig.get('adFirstLevel')&&this.count<LiveConfig.get('adMaxPerSession')&&
            GameClock.now()-this.last>=LiveConfig.get('adMinSeconds')*1000&&UserService.getUser().processedPurchaseTokens.length===0;
    }
    public static record():void {this.last=GameClock.now();this.count++;Telemetry.track('ad_interstitial_requested',{sessionCount:this.count});}
    public static rewarded():void {this.last=GameClock.now();Telemetry.track('ad_rewarded_complete');}
}
