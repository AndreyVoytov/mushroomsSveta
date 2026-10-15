
import Settings from '../Settings';
import UserPrincipalDto from '../../model/user/UserPrincipal';
import User from '../../model/user/User';
import LocalStoreComponent from './LocalStoreComponent';
import UserService from '../UserService';
import Utils from '../../utils/Utils';
import YandexGamesHelper from '../integration/YandexGamesHelper';
import AnalyticUtils from '../../utils/AnalyticUtils';
import CustomizationType from '../../model/enum/CustomizationType';
import CloudProfileService from '../CloudProfileService';
export default class ServerStoreComponent extends LocalStoreComponent {

    private static USER_PATH = "/../user";
    private static PRINCIPAL_PATH = "/../user/principal";
    private static FRIENDS_PATH = "/../user/friends";

    public static getServerSessionId():string{
        // console.log("trying extract JSESSIONID: " + window.location.search)
        // console.log("window.location: " + window.location)
        return Utils.getUrlParameter("JSESSIONID");
    }

    public static addSessionToUrl(url:string):string{
        if(url.indexOf("?") != -1){
            let parts = url.split("?");
            return parts[0] + ";jsessionid=" + ServerStoreComponent.getServerSessionId() + parts[1]; 
        }
        return url + ";jsessionid=" + ServerStoreComponent.getServerSessionId();
    }

    protected static getSuffix(){return Settings.PLAIN_MODE? "?plain=true" : ""}


    public static updateFriendsFromServer(): void{
        // this.httpGet(this.FRIENDS_PATH).then((friendsData:string)=>{
        //    let friends:String[] = JSON.parse(friendsData);
        //    let localUser = UserService.getUser();

        //    if(localUser.getFriendsInGame() < friends.length){
        //        localUser.setFriendsInGame(friends.length);
        //    }
        // })
    }

    public static syncronizeUserWithServer():void{
        const platform=AnalyticUtils.getCustomization();
        if(CloudProfileService.isConfigured()){
            if(UserService.userLoaded){CloudProfileService.queueProfile(UserService.getUser());return;}
            this.initializeCloud(platform===CustomizationType.yandexGames);return;
        }
        if(platform===CustomizationType.webDev){UserService.userLoaded=true;return;}
        if(platform===CustomizationType.yandexGames){
            if(UserService.userLoaded){YandexGamesHelper.queueProfile(UserService.getUser());return;}
            const baselineUpdatedAt=UserService.getUser().updatedAt;
            YandexGamesHelper.loadProfile().then(data=>{
                const local=UserService.getUser();
                if(data&&(data.updatedAt||0)>baselineUpdatedAt){
                    const loaded=new User(data);UserService.setUser(loaded);this.saveLocalUser(loaded);
                }
                UserService.userLoaded=true;
            }).catch(error=>{console.warn('Cloud profile unavailable',error.message);UserService.userLoaded=true;});
            return;
        }
        
        let localUser = UserService.getUser();

        this.httpGet(this.PRINCIPAL_PATH)
        //тестовая авторизация
        // this.httpGet("/auth?user=testUser2").then((res:string)=>{
        //     return this.httpGet(this.PRINCIPAL_PATH);
        // })

        .then((principalData:string)=>{
            let principal:UserPrincipalDto = JSON.parse(principalData);

            //TODO typesafe json parsing 
            if(!principal.externalIdentifier || !principal.externalIdentifier){
                throw new Error("wrong response from server: principal not defined");
            }

            let userId =  principal.context + "@" + principal.externalIdentifier;
            this.saveLocalUserId(userId);
            return this.httpGet(this.USER_PATH + this.getSuffix());

        }).then((userData: string)=>{
            
            if(!userData) throw new Error();

            if(!Settings.PLAIN_MODE){
                userData = (JSON.parse(userData) as any).body;

                if(userData === undefined){
                    throw new Error("wrong response from server: user not defined");
                }

                console.log("userData: " + userData)
                console.log("this.getLocalUserId(): " + this.getLocalUserId())
                userData = this.decryptUserData(userData, this.getLocalUserId())
            }
    
            let userFromServer = null;

            if(userData.trim() != "{}"){
                //TODO typesafe json parsing 
                userFromServer = new User(JSON.parse(userData));
            }

            if(userFromServer == null || localUser.getCurrentForest() > userFromServer.getCurrentForest()){
                console.log("USER SERVICE: local user appear to have more game progress")
                ServerStoreComponent.saveUserToServer(localUser);
    
            } else if(userFromServer.getCurrentForest() > localUser.getCurrentForest()){
                UserService.setUser(userFromServer);
                ServerStoreComponent.saveLocalUser(userFromServer);
                console.log("USER SERVICE: server user appear to have more game progress")
            } else {
                //already syncronized
            }
            UserService.userLoaded = true;

        }).catch((e)=>{
            console.log("ServerStoreComponent: error on syncronizeUserWithServer")
            console.log(e); 

            let localId = LocalStoreComponent.getLocalUserId();

            if(!localId){
                localId = Utils.UUID();
                LocalStoreComponent.saveLocalUserId(localId);
            }
            LocalStoreComponent.saveLocalUser(UserService.getUser());

            UserService.userLoaded = true;
        })
    } 

    private static cloudLoading:Promise<any>;
    public static reconnectCloud():Promise<any>{return this.initializeCloud(AnalyticUtils.getCustomization()===CustomizationType.yandexGames);}
    private static initializeCloud(yandex:boolean):Promise<any> {
        if(this.cloudLoading)return this.cloudLoading;
        const local=UserService.getUser(),previous=CloudProfileService.previous(),baseline=CloudProfileService.fingerprint(local);
        this.cloudLoading=CloudProfileService.initialize(yandex).then(async data=>{
            if(data.profile){
                const sameAccount=previous&&previous.accountId===CloudProfileService.accountId;
                if(sameAccount&&previous.revision!==data.revision&&previous.profile!==baseline){
                    CloudProfileService.backup(local);CloudProfileService.conflict(data);return;
                }
                if(sameAccount&&previous.revision===data.revision&&previous.profile!==baseline){
                    CloudProfileService.queueProfile(local);const saved=await CloudProfileService.flush();this.applyCloudSnapshot(saved);return;
                }
                this.applyCloudSnapshot(data);
            }else{
                const initial=previous&&previous.accountId!==CloudProfileService.accountId?new User():local;
                CloudProfileService.queueProfile(initial);const saved=await CloudProfileService.flush();this.applyCloudSnapshot(saved);
            }
        }).catch(()=>{CloudProfileService.backup(UserService.getUser());if(CloudProfileService.isReady())CloudProfileService.conflict(CloudProfileService.remote);}).then(()=>{CloudProfileService.applying=false;UserService.userLoaded=true;this.cloudLoading=null;});
        return this.cloudLoading;
    }
    private static applyCloudSnapshot(data:any):void {
        CloudProfileService.backup(UserService.getUser());CloudProfileService.applying=true;
        try{const loaded=new User(data.profile);this.saveLocalUser(loaded);UserService.setUser(loaded);CloudProfileService.accept(data);}finally{CloudProfileService.applying=false;}
    }

    public static saveUserToServer(upToDateUser:User){
        // let userDataToSend = JSON.stringify(upToDateUser);
            
        // if(!Settings.PLAIN_MODE){
        //     userDataToSend = this.encryptUserData(JSON.stringify(upToDateUser), this.getLocalUserId());
        // }

        // this.httpPost(this.USER_PATH + this.getSuffix(), userDataToSend);
    }



    protected static httpPost(url: string, body:string): Promise<any>{
        return this.http("POST", ServerStoreComponent.addSessionToUrl(url), body);
    }

    protected static httpGet(url: string): Promise<any>{
        return this.http("GET", ServerStoreComponent.addSessionToUrl(url), null);
    }

    private static http(method:string, url: string, body:string): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.onload = function () {
              if (this.status === 200) {
                console.log(method + " success for url=" + Settings.HOST + url + "  :\n" + this.response)
                resolve(this.response);
              } else {
                console.log(method + " error for url=" + Settings.HOST + url)
                reject(new Error(this.statusText));
              }
            };
            request.onerror = function () {
                console.log(method + " error for url=" + Settings.HOST + url)
              reject(new Error(this.statusText));
            };
            request.open(method, Settings.HOST + url);
            request.timeout=8000;
            request.ontimeout=()=>reject(new Error('Server request timed out'));
            request.send(body);
        });
    }
}
