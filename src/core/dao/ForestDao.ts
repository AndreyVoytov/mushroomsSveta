import ForestsConfiguration from '../../core/configuration/ForestConfiguration';
import ForestType from '../model/forest/ForestType';
import UserService from '../service/UserService';
import BaseDao from './BaseDao';
import ReplicaDao from './ReplicaDao';
import AdminService from '../service/AdminService';
export default class ForestDao extends BaseDao<ForestType>{


    private static entity = new ForestDao("forests2", ForestsConfiguration.allForests);

    public static getEntity():ForestDao{
        return ForestDao.entity;
    }

    //*********** TODO REMOVE! *******************/
    public static getForestType(index:number){
        return ForestDao.getEntity().getForestType(index);
    }

    public static getForestById(id:string){
        return ForestDao.getEntity().getById(id);
    }

    public static indexOf(forestType: ForestType){
        return ForestDao.getEntity().indexOf(forestType);
    }

    public static getAllForests(): ForestType[]{
        return ForestDao.getEntity().getAll();
    }

    /****************************************/

    public getForestType(index: number) {
        return AdminService.skipLevelsToForestType() || this.doGetForestType(index);
    }

    private doGetForestType(index: number): ForestType {
        if (index >= this.objects.length) {
            return this.objects[this.objects.length - 1];
        } else {
            return this.objects[index];
        }
    }
}


