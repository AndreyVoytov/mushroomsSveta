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
            personName: "Эмма",
            context: {
                level: 1,
                requiredMarker: "homeFound"
            },
            text: "Смотрите-ка, ~дом посреди леса~! Давайте подойдем поближе..",
            buttonName: "Подойти поближе",
            buttonImage: "actionHouse",
            afterAnimation: "exploreHouse"
        },
        {
            id: "fr2",
            personImage: "sveta2",
            personName: "Эмма",
            context: {
                level: 3,
                requiredMarker: "notebookFound"
            },
            text: "Похоже на какой-то рецепт. Интересно, что будет если все это смешать?",
            buttonName: "Домой",
            buttonImage: "actionHouse",
            showDiary: true,
            // personalAnimation:"questionBubble"
        },
        {
            id: "fr3",
            personImage: "sveta3",
            personName: "Эмма",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "Ой, какой ~хорошенький котик~! Кто же тебя здесь оставил?",
        },
        {
            id: "fr4",
            personImage: "cat1",
            personName: "Котёнок",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "Мяу!",
            rightSide: true
        },
        {
            id: "fr5",
            personImage: "sveta1",
            personName: "Эмма",
            context: {
                level: 13,
                requiredMarker: "catFound"
            },
            text: "Что ж.. Пойдем со мной, приятель!",
            afterAnimation: "winLevel",
        },

        {
            id: "fr6",
            personImage: "sveta1",
            personName: "Эмма",
            context: {
                level: 58,
                requiredMarker: "owl1found"
            },
            text: "А вот и совёнок!",
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
            personName: "Эмма",
            context: {
                level: 58,
                requiredMarker: "owl1found"
            },
            text: "Хорошо, можно возвращаться домой.",
            afterAnimation: "winLevel",
            "buttonName": "Домой",
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
            personName: "Эмма",
            context: {
                level: 63,
                requiredMarker: "owl2found"
            },
            text: "Здравствуйте! Я - ~Эмма~.",
        },
        {
            id: "fr9",
            personImage: "sova1",
            personName: "Совёнок",
            rightSide:true,
            context: {
                level: 63,
                requiredMarker: "owl2found"
            },
            text: "Очень приятно! ~Совёнок~.",
            afterAnimation: "winLevel",
            // "buttonName": "Домой",
            // "buttonImage": "actionHouse",
        },
    ]



}


