// import OkHelper from "../service/integration/OkHelper";
import UserService from "../service/UserService";

export default class LifeUtils{

    private static RESTORE_LIFES_PRICE = 25;
    public static LIFES_BASE = 4;
    public static PLUS_LIFE_AT_FRIENDS = 3;
    public static SECOND_PLUS_LIFE_AT_FRIENDS = 10;

    public static MILLIS_FOR_LIFE = 20 * 1000 * 60;

    public static getLifesMaximum():number{
        let friendsInvited = LifeUtils.getFriendsInGameCount();
        return LifeUtils.LIFES_BASE + (friendsInvited >= this.PLUS_LIFE_AT_FRIENDS? 1 : 0) + (friendsInvited >= this.SECOND_PLUS_LIFE_AT_FRIENDS? 1 : 0);
    }

    public static getFriendsInGameCount():number{
        //TODO смотреть через API_OK; не уменьшать число друзей
        let user = UserService.getUser();
        return user.getFriendsInGame();
    }

    //strange import problems for OkHelper
    // public static inviteFriends():void{
        // OkHelper.showInvite("Привет! Прими участие в приключениях в новой игре!", "forLifes");
        // let user = UserService.getUser();
        // return user.setFriendsInGame(user.getFriendsInGame() + 1);
    // }

    public static getFullRestorationPrice(){
        return LifeUtils.RESTORE_LIFES_PRICE * LifeUtils.getLifesMaximum();
    }

    public static getCurrentRestorationPrice(){
        let user = UserService.getUser();
        return LifeUtils.RESTORE_LIFES_PRICE * (LifeUtils.getLifesMaximum() - user.getLifes());
    }
}


