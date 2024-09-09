
import User from '../model/user/User';
import ServerStoreComponent from './store/ServerStoreComponent';
import AdminService from './AdminService';
export default class UserService {

    public static userLoaded = false;
    public static user: User; //TODO make private

    public static setUser(user:User): void {
        this.user = user;
    }

    public static getUser(): User {
        if(!this.user){
            this.user = this.doGetUser();
        }

        return this.user;
    }

    private static doGetUser(): User {
        let user = ServerStoreComponent.getLocalUser();

        if (!user || (AdminService.needClearUser() && !this.userLoaded)) {
            let user = new User();
            ServerStoreComponent.saveLocalUser(user);
            return user;
        };
        
        return user;
    }
}