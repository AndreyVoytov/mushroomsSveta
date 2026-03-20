import ReplicaType from '../model/replica/ReplicaType';
import User from '../model/user/User';
export default class ForestReplicasConfiguration {

    public static getReplica(user: User) {
        for (let i = 0; i < this.allReplicas.length; i++) {
            let r = this.allReplicas[i];
            if (user.getCompletedReplicas().indexOf(r.id) != -1) {
                continue;
            }
            if (r.context && r.context.level && r.context.level != user.getCurrentForest()) {
                continue;
            }
            if (r.context && r.context.requiredMarker && user.getMarkers().indexOf(r.context.requiredMarker) == -1) {
                continue;
            }
            return r;
        }
        return null;
    }

    public static allReplicas: ReplicaType[] = [
        {
            id: "fr1",
            personImage: "sveta2",
            personName: "replica.fr1.personName",
            context: {
                level: 1,
                requiredMarker: "homeFound"
            },
            text: "replica.fr1.text",
            buttonName: "replica.fr1.buttonName",
            buttonImage: "actionHouse",
            afterAnimation: "exploreHouse"
        },
        {
            id: "fr2",
            personImage: "sveta2",
            personName: "replica.fr2.personName",
            context: {
                level: 3,
                requiredMarker: "notebookFound"
            },
            text: "replica.fr2.text",
            buttonName: "replica.fr2.buttonName",
            buttonImage: "actionHouse",
            showDiary: true,
            // personalAnimation:"questionBubble"
        },
        {
            id: "fr3",
            personImage: "sveta3",
            personName: "replica.fr3.personName",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "replica.fr3.text",
        },
        {
            id: "fr4",
            personImage: "cat1",
            personName: "replica.fr4.personName",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "replica.fr4.text",
            rightSide: true
        },
        {
            id: "fr5",
            personImage: "sveta1",
            personName: "replica.fr5.personName",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "replica.fr5.text",
            afterAnimation: "winLevel",
        },

        {
            id: "fr6",
            personImage: "sveta1",
            personName: "replica.fr6.personName",
            context: {
                level: 58,
                requiredMarker: "owl1found"
            },
            text: "replica.fr6.text",
            decor:  {
                image: "owl",
                x: 102,
                y: 2,
                rightSide: true,
                overDialog: false,
            },
        },
        {
            id: "fr7",
            personImage: "sveta5",
            personName: "replica.fr7.personName",
            context: {
                level: 58,
                requiredMarker: "owl1found"
            },
            text: "replica.fr7.text",
            afterAnimation: "winLevel",
            "buttonName": "replica.fr7.buttonName",
            "buttonImage": "actionHouse",
            // buttonAnimation:"winLevel"
            decor:  {
                image: "owl",
                x: 102,
                y: 2,
                rightSide: true,
                overDialog: false,
            },
        },
        {
            id: "fr8",
            personImage: "sveta1",
            personName: "replica.fr8.personName",
            context: {
                level: 63,
                requiredMarker: "owl2found"
            },
            text: "replica.fr8.text",
        },
        {
            id: "fr9",
            personImage: "sova1",
            personName: "replica.fr9.personName",
            rightSide:true,
            context: {
                level: 63,
                requiredMarker: "owl2found"
            },
            text: "replica.fr9.text",
            afterAnimation: "winLevel",
            // "buttonImage": "actionHouse",
        },
    ]



}


