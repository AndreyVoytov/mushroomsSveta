
import Settings from '../Settings';
import User from '../../model/user/User';
import AnalyticUtils from '../../utils/AnalyticUtils';
import CustomizationType from '../../model/enum/CustomizationType';
import Game from '../../../view/game/Game';
export default class LocalStoreComponent {

    private static LS_USER = "user3456789012";
    private static LS_PRINCIPAL = "principal";

    public static getLocalUser(){
        if(!AnalyticUtils.haveLocalStorage()){
            return null;
        }
        
        let userData = null;
        
        if(!Settings.PLAIN_MODE && userData){
            userData = this.decryptUserData(userData, this.getLocalUserId())
            console.log(userData);
        }

        if(userData){
            return new User(JSON.parse(userData));
        }

        return null;
    }

    public static saveLocalUser(user: User) {
        if(!AnalyticUtils.haveLocalStorage()){
            return;
        }

        let userData = JSON.stringify(user);
        
        if(!Settings.PLAIN_MODE){
            userData = this.encryptUserData(userData, this.getLocalUserId())
        }

        localStorage.setItem(this.LS_USER, userData);
    }


    public static getLocalUserId():string{
        if(!AnalyticUtils.haveLocalStorage()){
            return Game.LOCAL_USER_ID;
        }
        return localStorage.getItem(this.LS_PRINCIPAL); 
    }

    public static saveLocalUserId(userId:string):void{
        if(!AnalyticUtils.haveLocalStorage()){
            Game.LOCAL_USER_ID = userId;
        } else {
            localStorage.setItem(this.LS_PRINCIPAL, userId); 
        }
    }

    
    protected static encryptUserData(json:string, userId):string{
        return (window as any).xxtea.encryptToString(json, Settings.KEY + userId);
    }

    protected static decryptUserData(data:string, userId):string{
        return (window as any).xxtea.decryptToString(data, Settings.KEY + userId);
    }

}