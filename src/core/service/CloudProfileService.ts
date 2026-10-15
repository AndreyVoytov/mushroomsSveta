import GameClock from './GameClock';
import LiveConfig from './LiveConfig';
import YandexGamesHelper from './integration/YandexGamesHelper';

export default class CloudProfileService {
    public static status='unconfigured';
    public static revision=0;
    public static applying=false;
    public static claiming=false;
    public static remote:any;
    public static accountId='';
    private static client:any;
    private static pending:any;
    private static timer:any;
    private static queue:Promise<any>=Promise.resolve();
    private static initialization:Promise<any>;
    public static config():any{return (window as any).MUSHROOMS_PLATFORM_CONFIG||{};}
    public static isConfigured():boolean{const c=this.config();return !!(c.supabaseUrl&&c.publishableKey);}
    public static isReady():boolean{return this.status==='ready';}
    public static isTestPaymentMode():boolean{return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)&&/(?:[?&])testpayments=1(?:&|$)/.test(window.location.search);}
    private static sdk():Promise<any>{
        if((window as any).supabase)return Promise.resolve((window as any).supabase);
        return new Promise((resolve,reject)=>{const script=document.createElement('script'),timer=setTimeout(()=>reject(new Error('CLOUD_SDK_UNAVAILABLE')),10000);script.src=this.config().sdkPath||'assets/other/js/supabase-2.117.3.min.js';script.onload=()=>{clearTimeout(timer);resolve((window as any).supabase);};script.onerror=()=>{clearTimeout(timer);reject(new Error('CLOUD_SDK_UNAVAILABLE'));};document.head.appendChild(script);});
    }
    public static initialize(yandex:boolean):Promise<any>{
        if(this.initialization)return this.initialization;
        this.status='connecting';
        this.initialization=this.sdk().then(sdk=>{
            this.client=sdk.createClient(this.config().supabaseUrl,this.config().publishableKey,{auth:{storageKey:'mushrooms.game.auth'},global:{fetch:(input:any,options:any={})=>{
                const controller=new (window as any).AbortController(),abort=()=>controller.abort(),signal=options.signal;
                if(signal){if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true});}
                const timer=setTimeout(abort,15000),done=()=>{clearTimeout(timer);if(signal)signal.removeEventListener('abort',abort);};
                return window.fetch(input,Object.assign({},options,{signal:controller.signal})).then(result=>{done();return result;},error=>{done();throw error;});
            }}});
            if(yandex)return YandexGamesHelper.getPlayerSignature().then(signature=>this.call('yandex_auth',{signature})).then(data=>this.client.auth.setSession(data.session));
            return this.client.auth.getSession().then(res=>res.data.session?res:this.client.auth.signInAnonymously());
        }).then(res=>{if(res.error)throw new Error('CLOUD_AUTH_UNAVAILABLE');return this.client.auth.getUser();})
          .then(res=>{if(res.error||!res.data.user)throw new Error('CLOUD_AUTH_UNAVAILABLE');this.accountId=res.data.user.id;return this.call('load');})
          .then(data=>{this.remote=data;this.revision=data.revision;GameClock.synchronize(data.serverTime);LiveConfig.apply(data.config);this.status='ready';return data;})
          .catch(error=>{this.status='offline';this.initialization=null;throw error;});return this.initialization;
    }
    public static call(action:string,extra:any={}):Promise<any>{
        if(!this.client)return Promise.reject(new Error('CLOUD_NOT_CONNECTED'));
        return this.client.functions.invoke('game-api',{body:Object.assign({action},extra)}).then(async res=>{
            if(res.error){
                let body:any={};try{if(res.error.context)body=await res.error.context.json();}catch(_){}
                if(body.conflict||body.error==='PROFILE_CONFLICT'){this.conflict(body);throw new Error('PROFILE_CONFLICT');}
                throw new Error(body.error||'CLOUD_UNAVAILABLE');
            }
            if(res.data&&res.data.conflict){this.conflict(res.data);throw new Error('PROFILE_CONFLICT');}
            return res.data;
        });
    }
    public static previous():any{try{return JSON.parse(localStorage.getItem('mushrooms.cloud.ack')||'null');}catch(_){return null;}}
    public static fingerprint(profile:any):string{
        const sorted=(value:any):any=>{
            if(Array.isArray(value))return value.map(sorted);
            if(value&&typeof value==='object'){const out:any={};Object.keys(value).sort().forEach(key=>{if(key!=='updatedAt'&&key!=='lastLoginAt')out[key]=sorted(value[key]);});return out;}
            return value;
        };return JSON.stringify(sorted(profile));
    }
    private static acknowledge(data:any):void{
        this.revision=data.revision;this.remote=data;
        try{localStorage.setItem('mushrooms.cloud.ack',JSON.stringify({accountId:this.accountId,revision:data.revision,profile:this.fingerprint(data.profile)}));}catch(_){}
    }
    public static conflict(data:any):void{this.status='conflict';this.remote=data;clearTimeout(this.timer);}
    public static backup(profile:any):void{try{localStorage.setItem('mushrooms.cloud.local-backup',JSON.stringify(profile));}catch(_){} }
    public static queueProfile(profile:any):void{
        if(this.applying||!this.isReady())return;
        this.pending=JSON.parse(JSON.stringify(profile));clearTimeout(this.timer);
        if(!this.claiming)this.timer=setTimeout(()=>this.flush().catch(()=>{}),2500);
    }
    public static flush():Promise<any>{
        clearTimeout(this.timer);
        const work=async()=>{
            if(!this.isReady())throw new Error('CLOUD_NOT_READY');
            while(this.pending){const sent=this.pending;this.pending=null;
                try{const data=await this.call('save',{revision:this.revision,profile:sent});this.acknowledge(data);}
                catch(error){if(!this.pending)this.pending=sent;this.backup(this.pending);throw error;}
            }return this.remote;
        };
        const next=this.queue.then(work,work);this.queue=next.catch(()=>{});return next;
    }
    public static async refresh():Promise<any>{const data=await this.call('load');this.remote=data;return data;}
    public static accept(data:any):void{this.pending=null;this.status='ready';this.acknowledge(data);}
    public static async claimYandex(signature:string):Promise<any>{
        await this.flush();this.claiming=true;
        const before=this.revision;
        try{const data=await this.call('yandex_claim',{signature,revision:this.revision});this.revision=data.revision;this.remote=data;return data;}
        catch(e){this.claiming=false;try{const data=await this.refresh();if(data.revision!==before)this.conflict(data);}catch(_){}throw e;}
    }
    public static async intent(platform:string,productId:string):Promise<any>{await this.flush();return this.call('intent',{platform,productId});}
    public static async linkEmail(email:string):Promise<void>{await this.flush();const result=await this.client.auth.updateUser({email},{emailRedirectTo:window.location.href.split('#')[0]});if(result.error)throw new Error('EMAIL_LINK_FAILED');}
    public static async loginEmail(email:string):Promise<void>{const result=await this.client.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:window.location.href.split('#')[0]}});if(result.error)throw new Error('EMAIL_LOGIN_FAILED');}
}
