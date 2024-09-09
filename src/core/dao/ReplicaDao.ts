import BaseDao from './BaseDao';
import ReplicaType from '../model/replica/ReplicaType';
import ReplicasConfiguration from '../configuration/ReplicasConfiguration';
import User from '../model/user/User';
import StoryLocation from '../model/enum/StoryLocation';

export default class ReplicaDao extends BaseDao<ReplicaType>{

    private static entity = new ReplicaDao("replicas", ReplicasConfiguration.allReplicas);

    public static getEntity():ReplicaDao{
        return ReplicaDao.entity;
    }

    public getReplica(user: User): ReplicaType {
        for (let i = 0; i < this.getAll().length; i++) {
            let r = this.getAll()[i];
            if (user.getCompletedReplicas().indexOf(r.id) != -1) {
                continue;
            }
            if (r.context && r.context.level && r.context.level != user.getCurrentForest()) {
                continue;
            }
            // if (r.context && r.context.requiredMarker && user.getMarkers().indexOf(r.context.requiredMarker) == -1) {
            //     continue;
            // }
            return r;
        }
        return null;
    }

    public getLocationForLevelAndReplica(level:number, replica?:ReplicaType): {location:StoryLocation, afterlevelLocation:StoryLocation}{
        let location = StoryLocation.forest;
        let afterLevelLocation = null;
        let lastReplicaLevel = 0;

        let allReplicas = ReplicaDao.getEntity().getAll();
        allReplicas.forEach(r => {
            if (r.context.level < level || (replica && allReplicas.indexOf(r) <= allReplicas.indexOf(replica))) {
                if(afterLevelLocation){
                    location = afterLevelLocation;
                    afterLevelLocation = null;
                }
                if (r.location) {
                    location = r.location;
                }
                if (r.afterLevelLocation) {
                    afterLevelLocation = r.afterLevelLocation;
                } else {
                    afterLevelLocation = null;
                }
                lastReplicaLevel = r.context.level;
            }
        })

        if(afterLevelLocation && lastReplicaLevel + 1 < level){
            location = afterLevelLocation;
            afterLevelLocation = null;
        }

        return {location: location, afterlevelLocation:afterLevelLocation};
    }
}


