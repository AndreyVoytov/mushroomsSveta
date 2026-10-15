import { GameAnalytics, EGAResourceFlowType } from 'gameanalytics';
import LiveConfig from './LiveConfig';
import GameClock from './GameClock';
export interface AttemptContext { mode: string; branchId: string; levelId: string; occurrenceId?: string; attemptId?: string; }
export default class Telemetry {
    public static context: AttemptContext = { mode: 'home', branchId: 'main', levelId: '' };
    private static sessionId = 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    private static sequence = 0;
    private static seen: { [id: string]: boolean } = {};
    private static events: any[] = [];
    private static started = false;
    private static playerId='';
    private static cohort='production';
    public static start(): void {
        if (this.started) return;
        this.started = true;
        this.cohort=/(?:[?&])(level|skip|seed|loaddebug|animals)(?:[=&]|$)/.test(window.location.search||'')?'test':'production';
        try {
            this.playerId=localStorage.getItem('mushrooms.telemetry.player')||('p-'+Date.now()+'-'+Math.random().toString(36).slice(2));
            localStorage.setItem('mushrooms.telemetry.player',this.playerId);
            this.events=JSON.parse(localStorage.getItem('mushrooms.telemetry.v1')||'[]');
            const sent=JSON.parse(localStorage.getItem('mushrooms.telemetry.sent')||'[]');
            sent.forEach(id=>this.seen[id]=true);
        }catch(_){this.events=[];}
        this.track('session_start');
        window.addEventListener('pagehide', () => {this.end('abandoned',{reason:'pagehide'});this.track('session_end');});
        window.addEventListener('error',(e:ErrorEvent)=>this.track('runtime_error',{message:String(e.message||'Unknown error').slice(0,300)}));
    }
    public static begin(context: AttemptContext): void {
        this.end('abandoned',{reason:'new_attempt'});
        this.context = Object.assign({}, context, {attemptId: this.sessionId + '-a-' + (++this.sequence)});
        this.track('attempt_start');
    }
    public static end(result: string, extra: any = {}): void {
        const id = this.context.attemptId;
        if (!id || this.seen[id + ':end']) return;
        this.seen[id + ':end'] = true;
        this.track('attempt_end', Object.assign({result}, extra));
    }
    public static track(name: string, extra: any = {}): void {
        if(!this.started)this.start();
        const event = Object.assign({schemaVersion: 1, id: this.sessionId + ':' + (++this.sequence), sessionId:this.sessionId,
            at:GameClock.now(), name, playerId:this.playerId, cohort:this.cohort, configVersion:LiveConfig.version}, this.context, extra);
        this.events.push(event);
        if (this.events.length > 3000) this.events.shift();
        try { localStorage.setItem('mushrooms.telemetry.v1', JSON.stringify(this.events)); } catch (_) {}
        try { GameAnalytics.addDesignEvent('world:' + name + ':' + (this.context.mode || 'home')); } catch (_) {}
    }
    public static economy(entries: any[]): void {
        (entries || []).forEach(e => {
            if (this.seen[e.id]) return;
            this.seen[e.id] = true;
            this.track('resource', e);
            try { GameAnalytics.addResourceEvent(e.amount > 0 ? EGAResourceFlowType.Source : EGAResourceFlowType.Sink,
                e.currency, Math.abs(e.amount), 'economy', e.reason); } catch (_) {}
        });
        try{localStorage.setItem('mushrooms.telemetry.sent',JSON.stringify(Object.keys(this.seen).slice(-1000)));}catch(_){}
    }
    public static progressionStart():boolean {
        const id=this.context.attemptId;
        if(!id||this.seen[id+':start'])return false;
        this.seen[id+':start']=true;return true;
    }
    public static export():void {
        const blob=new Blob([JSON.stringify({schemaVersion:1,events:this.events},null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mushrooms-telemetry.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
}
