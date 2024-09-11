
import Settings from '../Settings';
import UserPrincipalDto from '../../model/user/UserPrincipal';
import User from '../../model/user/User';
import LocalStoreComponent from './LocalStoreComponent';
import UserService from '../UserService';
import Utils from '../../utils/Utils';
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
            request.send(body);
        });
    }
}