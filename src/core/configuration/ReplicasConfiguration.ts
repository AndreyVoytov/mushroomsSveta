import ReplicaType from '../model/replica/ReplicaType';
import User from '../model/user/User';
import StoryLocation from '../model/enum/StoryLocation';
export default class ReplicasConfiguration {

    public static allReplicas: ReplicaType[] =[
            {
                "id": "r1",
                "personImage": "sveta1",
                "personName": "replica.r1.personName",
                "context": {
                    "level": 1
                },
                "text": "replica.r1.text",
                "buttonName": "replica.r1.buttonName",
                "location": 0,
                "afterLevelLocation": null,
                "showDiary": false
            },
            {
                "id": "r2",
                "personImage": "sveta2",
                "personName": "replica.r2.personName",
                "location": 1,
                "context": {
                    "level": 2
                },
                "text": "replica.r2.text"
            },
            {
                "id": "r2b",
                "personImage": "sveta1",
                "personName": "replica.r2b.personName",
                "context": {
                    "level": 2
                },
                "text": "replica.r2b.text",
                "buttonName": "replica.r2b.buttonName",
                "buttonImage": "actionDoor",
                "afterAnimation": "transition"
            },
            {
                "id": "r3",
                "personImage": "sveta4",
                "personName": "replica.r3.personName",
                "delay": 500,
                "location": 2,
                "context": {
                    "level": 2
                },
                "text": "replica.r3.text"
            },
            {
                "id": "r4",
                "personImage": "sveta2",
                "personName": "replica.r4.personName",
                "context": {
                    "level": 2
                },
                "text": "replica.r4.text",
                "buttonName": "replica.r4.buttonName",
                "buttonImage": "actionChest",
                "personalAnimation": "questionBubble"
            },
            {
                "id": "r5",
                "personImage": "sveta1",
                "personName": "replica.r5.personName",
                "context": {
                    "level": 3
                },
                "text": "replica.r5.text",
                "buttonName": "replica.r5.buttonName",
                "buttonImage": "actionKey",
                "afterAnimation": "openChest",
                "decor": {
                    "image": "keyBig",
                    "x": 40,
                    "y": 40,
                    "rightSide": false,
                    "overDialog": false
                },
                "glint": {
                    "x": 139,
                    "y": -156,
                }
            },
            {
                "id": "r6",
                "personImage": "sveta4",
                "personName": "replica.r6.personName",
                "location": 3,
                "afterLevelLocation": 4,
                "context": {
                    "level": 3
                },
                "text": "replica.r6.text",
                "buttonName": "replica.r6.buttonName",
                "buttonImage": "actionChest",
                "showDiary": false
            },
            {
                "id": "r7",
                "personImage": "sveta1",
                "personName": "replica.r7.personName",
                "afterAnimation": "cooking",
                "context": {
                    "level": 7
                },
                "text": "replica.r7.text",
                "buttonName": "replica.r7.buttonName",
                "buttonImage": "actionBoiler",
                "showDiary": false
            },
            {
                "id": "r8",
                "personImage": "sveta1",
                "personName": "replica.r8.personName",
                "afterAnimation": "boilerBurst",
                "context": {
                    "level": 7
                },
                "text": "replica.r8.text",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r9",
                "personImage": "sveta4",
                "personName": "replica.r9.personName",
                "context": {
                    "level": 7
                },
                "text": "replica.r9.text",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true,
                    "animation": "makeBookGreen"
                }
            },
            {
                "id": "r10",
                "personImage": "sveta2",
                "personName": "replica.r10.personName",
                "afterLevelLocation": 9,
                "context": {
                    "level": 7
                },
                "text": "replica.r10.text",
                "showDiary": true,
                "buttonName": "replica.r10.buttonName",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                },
                "location": 0
            },
            {
                "id": "r10b",
                "personImage": "cat2",
                "personName": "replica.r10b.personName",
                "location": 4,
                "context": {
                    "level": 14
                },
                "rightSide": true,
                "text": "replica.r10b.text",
                "personalAnimation": "eatBubble",
                "decor": null
            },
            {
                "id": "r11",
                "personImage": "sveta1",
                "personName": "replica.r11.personName",
                "context": {
                    "level": 14
                },
                "text": "replica.r11.text",
                "buttonName": "replica.r11.buttonName",
                "buttonImage": "actionCream",
                "afterAnimation": "nothing"
            },
            {
                "id": "r12",
                "personImage": "cat2",
                "personName": "replica.r12.personName",
                "context": {
                    "level": 14
                },
                "text": "replica.r12.text",
                "rightSide": true,
                "personalAnimation": "fooBubble"
            },
            {
                "id": "r14",
                "personImage": "sveta2",
                "personName": "replica.r14.personName",
                "context": {
                    "level": 14
                },
                "text": "replica.r14.text"
            },
            {
                "id": "r15",
                "personImage": "sveta1",
                "personName": "replica.r15.personName",
                "context": {
                    "level": 14
                },
                "showDiary": true,
                "text": "replica.r15.text",
                "buttonName": "replica.r15.buttonName",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r16",
                "personImage": "sveta2",
                "personName": "replica.r16.personName",
                "context": {
                    "level": 17
                },
                "text": "replica.r16.text",
                "buttonName": "replica.r16.buttonName",
                "buttonImage": "actionBoiler",
                "afterAnimation": "cooking(amanita!|lilly|mushroom3&pink)",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r17",
                "personImage": "cat4",
                "personName": "replica.r17.personName",
                "context": {
                    "level": 17
                },
                "text": "replica.r17.text",
                "rightSide": true,
                "decor": {
                    "image": "plate1",
                    "x": 100,
                    "y": 70,
                    "rightSide": true,
                    "overDialog": false
                },
                "personalAnimation": "love",
                "delay": 6000,
                "glint": {
                    "x": 730,
                    "y": -50,
                }
            },
            {
                "id": "r17b",
                "personImage": "cat1",
                "personName": "replica.r17b.personName",
                "context": {
                    "level": 17
                },
                "rightSide": true,
                "text": "replica.r17b.text",
                "personalAnimation": "drinkBubble",
                "decor": null
            },
            {
                "id": "r18",
                "personImage": "sveta2",
                "personName": "replica.r18.personName",
                "context": {
                    "level": 17
                },
                "showDiary": true,
                "text": "replica.r18.text",
                "buttonName": "replica.r18.buttonName",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r19",
                "personImage": "sveta1",
                "personName": "replica.r19.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r19.text",
                "buttonName": "replica.r19.buttonName",
                "buttonImage": "actionBoiler",
                "afterAnimation": "cooking(blueberry|witchMushroom&blue)",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r20",
                "personImage": "cat4",
                "personName": "replica.r20.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r20.text",
                "rightSide": true,
                "decor": {
                    "image": "plate2",
                    "x": 100,
                    "y": 70,
                    "rightSide": true,
                    "overDialog": false
                },
                "personalAnimation": "love",
                "delay": 6000,
                "glint": {
                    "x": 737,
                    "y": -49,
                }
            },
            {
                "id": "r20b",
                "personImage": "cat1",
                "personName": "replica.r20b.personName",
                "rightSide": true,
                "text": "replica.r20b.text",
                "context": {
                    "level": 20
                },
                "decor": {
                    "image": "plate2",
                    "x": 100,
                    "y": 70,
                    "rightSide": true,
                    "overDialog": false
                }
            },
            {
                "id": "r21",
                "personImage": "sveta4",
                "personName": "replica.r21.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r21.text"
            },
            {
                "id": "r22",
                "personImage": "cat3",
                "personName": "replica.r22.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r22.text",
                "rightSide": true
            },
            {
                "id": "r23",
                "personImage": "sveta2",
                "personName": "replica.r23.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r23.text"
            },
            {
                "id": "r24",
                "personImage": "cat1",
                "personName": "replica.r24.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r24.text",
                "rightSide": true
            },
            {
                "id": "r25",
                "personImage": "sveta1",
                "personName": "replica.r25.personName",
                "context": {
                    "level": 20
                },
                "text": "replica.r25.text"
            },
            {
                "id": "r26",
                "personImage": "sveta1",
                "personName": "replica.r26.personName",
                "context": {
                    "level": 20
                },
                "showDiary": true,
                "text": "replica.r26.text",
                "buttonName": "replica.r26.buttonName",
                "decor": {
                    "image": "bookDecor",
                    "x": 250,
                    "y": 10,
                    "rightSide": false,
                    "overDialog": true
                }
            },
            {
                "id": "r27",
                "personImage": "cat1",
                "personName": "replica.r27.personName",
                "context": {
                    "level": 24
                },
                "afterAnimation": null,
                "text": "replica.r27.text",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "beforeAnimation": "memoryRestoration1",
                "delay": 1000
            },
            {
                "id": "r28",
                "personImage": "cat2",
                "personName": "replica.r28.personName",
                "context": {
                    "level": 24
                },
                "text": "replica.r28.text",
                "rightSide": true
            },
            {
                "id": "r29",
                "personImage": "sveta1",
                "personName": "replica.r29.personName",
                "context": {
                    "level": 24
                },
                "text": "replica.r29.text",
                "decor": {
                    "image": "mirror2",
                    "x": 200,
                    "y": 0,
                    "rightSide": false,
                    "overDialog": true
                },
                "glint": {
                    "x": 406,
                    "y": -60,
                }
            },
            {
                "id": "r30",
                "personImage": "cat3",
                "personName": "replica.r30.personName",
                "context": {
                    "level": 24
                },
                "text": "replica.r30.text",
                "rightSide": true,
                "decor": {
                    "image": "mirror2b",
                    "x": 300,
                    "y": 0,
                    "rightSide": true,
                    "overDialog": true
                },
                "glint": {
                    "x": 561,
                    "y": -57,
                },
            },
            {
                "id": "r30b",
                "personImage": "sveta4",
                "personName": "replica.r30b.personName",
                "context": {
                    "level": 24
                },
                "text": "replica.r30b.text",
            },

            {
                "id": "r32",
                "personImage": "cat1",
                "personName": "replica.r32.personName",
                "context": {
                    "level": 24
                },
                "text": "replica.r32.text",
                "rightSide": true
            },
            {
                "id": "r32b",
                "personImage": "sveta1",
                "personName": "replica.r32b.personName",
                "showDiary": true,
                "buttonName": "replica.r32b.buttonName",
                "context": {
                    "level": 24
                },
                "text": "replica.r32b.text"
            },
            {
                "id": "r33",
                "personImage": "cat1",
                "personName": "replica.r33.personName",
                "context": {
                    "level": 28
                },
                "text": "replica.r33.text",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "beforeAnimation": "memoryRestoration2",
                "delay": 1000
            },
            {
                "id": "r34",
                "personImage": "sveta2",
                "personName": "replica.r34.personName",
                "context": {
                    "level": 28
                },
                "text": "replica.r34.text"
            },
            {
                "id": "r34b",
                "personImage": "cat2",
                "personName": "replica.r34b.personName",
                "context": {
                    "level": 28
                },
                "text": "replica.r34b.text",
                "rightSide": true
            },
            {
                "id": "r34bb",
                "personImage": "sveta1",
                "personName": "replica.r34bb.personName",
                "buttonName": "replica.r34bb.buttonName",
                "showDiary": true,
                "context": {
                    "level": 28
                },
                "text": "replica.r34bb.text"
            },
            {
                "id": "r34c",
                "personImage": "cat1",
                "personName": "replica.r34c.personName",
                "context": {
                    "level": 32
                },
                "text": "replica.r34c.text",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "delay": 1000,
                "beforeAnimation": "memoryRestoration3"
            },
            {
                "id": "r35",
                "personImage": "sveta2",
                "personName": "replica.r35.personName",
                "context": {
                    "level": 32
                },
                "text": "replica.r35.text"
            },
            {
                "id": "r36",
                "personImage": "cat1",
                "personName": "replica.r36.personName",
                "context": {
                    "level": 32
                },
                "text": "replica.r36.text",
                "rightSide": true
            },
            {
                "id": "r37",
                "personImage": "sveta4",
                "personName": "replica.r37.personName",
                "context": {
                    "level": 32
                },
                "text": "replica.r37.text"
            },
            {
                "id": "r38",
                "personImage": "cat1",
                "personName": "replica.r38.personName",
                "afterAnimation": "stormTransition(ui.transition.sheWontHelp)",
                "context": {
                    "level": 32
                },
                "text": "replica.r38.text",
                "rightSide": true
            },
            {
                "id": "r39",
                "delay": 3800,
                "personImage": "sveta4",
                "personName": "replica.r39.personName",
                "location": 5,
                "context": {
                    "level": 32
                },
                "text": "replica.r39.text"
            },
            {
                "id": "r40",
                "personImage": "sveta2",
                "personName": "replica.r40.personName",
                "text": "replica.r40.text",
                "context": {
                    "level": 32
                },
                "buttonName": "replica.r40.buttonName",
                "buttonImage": "tree"
            },
            {
                "id": "r41",
                "personImage": "sveta1",
                "personName": "replica.r41.personName",
                "text": "replica.r41.text",
                "context": {
                    "level": 37
                },
                "location": 6,
                "afterAnimation": null
            },
            {
                "id": "r41b",
                "personImage": "sveta2",
                "personName": "replica.r41b.personName",
                "text": "replica.r41b.text",
                "context": {
                    "level": 37
                },
                "afterAnimation": "unicornHide"
            },
            {
                "id": "r42",
                "personImage": "unicorn2",
                "personName": "replica.r42.personName",
                "rightSide": true,
                "text": "replica.r42.text",
                "context": {
                    "level": 37
                },
                "afterAnimation": "unicornShow"
            },
            {
                "id": "r43",
                "personImage": "sveta4",
                "personName": "replica.r43.personName",
                "rightSide": false,
                "text": "replica.r43.text",
                "context": {
                    "level": 37
                },
                "location": 0,
                "afterAnimation": "unicornMove"
            },
            {
                "id": "r44",
                "personImage": "sveta1",
                "personName": "replica.r44.personName",
                "rightSide": false,
                "text": "replica.r44.text",
                "context": {
                    "level": 37
                },
                "delay": 3000,
                "decor": null,
                "location": 5,
                "buttonName": "replica.r44.buttonName",
                "buttonImage": "unicorn3",
                "showDiary": false
            },
            {
                "id": "r45",
                "personImage": "sveta2",
                "personName": "replica.r45.personName",
                "rightSide": false,
                "text": "replica.r45.text",
                "context": {
                    "level": 38
                },
                "location": 5
            },
            {
                "id": "r46",
                "personImage": "sveta1",
                "personName": "replica.r46.personName",
                "rightSide": false,
                "text": "replica.r46.text",
                "context": {
                    "level": 38
                },
                "buttonName": "replica.r46.buttonName",
                "buttonImage": "tree"
            },
            {
                "id": "r47",
                "personImage": "sveta5",
                "personName": "replica.r47.personName",
                "rightSide": false,
                "text": "replica.r47.text",
                "context": {
                    "level": 44
                },
                "location": 9
            },
            {
                "id": "r48",
                "personImage": "sveta1",
                "personName": "replica.r48.personName",
                "rightSide": false,
                "text": "replica.r48.text",
                "context": {
                    "level": 44
                },
                "buttonName": "replica.r48.buttonName",
                "buttonImage": "actionMushroom",
                "showDiary": true
            },
            {
                "id": "r49",
                "personImage": "sveta1",
                "personName": "replica.r49.personName",
                "rightSide": false,
                "text": "replica.r49.text",
                "context": {
                    "level": 46
                },
                "buttonName": "replica.r49.buttonName",
                "buttonImage": "poleno"
            },
            {
                "id": "r50",
                "personImage": "sveta2",
                "personName": "replica.r50.personName",
                "rightSide": false,
                "text": "replica.r50.text",
                "context": {
                    "level": 47
                },
                "location": 10,
                "decor": {
                    "image": "sveta2Mushrooms",
                    "x": 202,
                    "y": 2,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r51",
                "personImage": "leshii1",
                "personName": "replica.r51.personName",
                "rightSide": true,
                "text": "replica.r51.text",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r52",
                "personImage": "sveta2",
                "personName": "replica.r52.personName",
                "rightSide": false,
                "text": "replica.r52.text",
                "context": {
                    "level": 47
                },
                "decor": {
                    "image": "sveta2Mushrooms",
                    "x": 202,
                    "y": 2,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r53",
                "personImage": "leshii3",
                "personName": "replica.r53.personName",
                "rightSide": true,
                "text": "replica.r53.text",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r54",
                "personImage": "leshii2",
                "personName": "replica.r54.personName",
                "rightSide": true,
                "text": "replica.r54.text",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r54b",
                "personImage": "sveta1",
                "personName": "replica.r54b.personName",
                "rightSide": false,
                "text": "replica.r54b.text",
                "context": {
                    "level": 47
                },
                "decor": null
            },
            {
                "id": "r55",
                "personImage": "leshii1",
                "personName": "replica.r55.personName",
                "rightSide": true,
                "text": "replica.r55.text",
                "context": {
                    "level": 47
                },
                "showDiary": true,
                "buttonName": "replica.r55.buttonName",
                "buttonImage": "actionHouse",
                "afterLevelLocation": 9
            },
            {
                "id": "r56",
                "personImage": "cat4",
                "personName": "replica.r56.personName",
                "rightSide": true,
                "text": "replica.r56.text",
                "context": {
                    "level": 54
                },
                "location": 4,
                "personalAnimation": "love"
            },
            {
                "id": "r57",
                "personImage": "sveta1",
                "personName": "replica.r57.personName",
                "rightSide": false,
                "text": "replica.r57.text",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r58",
                "personImage": "cat1",
                "personName": "replica.r58.personName",
                "rightSide": true,
                "text": "replica.r58.text",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r59",
                "personImage": "cat2",
                "personName": "replica.r59.personName",
                "rightSide": true,
                "text": "replica.r59.text",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r60",
                "personImage": "sveta2",
                "personName": "replica.r60.personName",
                "rightSide": false,
                "text": "replica.r60.text",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r61",
                "personImage": "cat1",
                "personName": "replica.r61.personName",
                "rightSide": true,
                "text": "replica.r61.text",
                "context": {
                    "level": 54
                },
                "showDiary": true,
                "buttonName": "replica.r61.buttonName",
                "buttonImage": "owl",
                "afterLevelLocation": 9
            },
            {
                "id": "r62",
                "personImage": "cat1",
                "personName": "replica.r62.personName",
                "rightSide": true,
                "text": "replica.r62.text",
                "context": {
                    "level": 59
                },
                "personalAnimation": null,
                "showDiary": false,
                "location": 4
            },
            {
                "id": "r63",
                "personImage": "sveta2",
                "personName": "replica.r63.personName",
                "rightSide": false,
                "text": "replica.r63.text",
                "context": {
                    "level": 59
                },
                "decor": {
                    "image": "owl",
                    "x": 213,
                    "y": 4,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r64",
                "personImage": "cat4",
                "personName": "replica.r64.personName",
                "rightSide": true,
                "text": "replica.r64.text",
                "context": {
                    "level": 59
                },
                "personalAnimation": null
            },
            {
                "id": "r65",
                "personImage": "sveta3",
                "personName": "replica.r65.personName",
                "rightSide": false,
                "text": "replica.r65.text",
                "context": {
                    "level": 59
                },
                "personalAnimation": null,
                "buttonName": "replica.r65.buttonName",
                "buttonImage": "tree",
                "decor": {
                    "image": "owl",
                    "x": 202,
                    "y": 2,
                    "rightSide": false,
                    "overDialog": false
                },
                "afterLevelLocation": 9
            },
            {
                "id": "r66",
                "personImage": "cat1",
                "personName": "replica.r66.personName",
                "rightSide": true,
                "text": "replica.r66.text",
                "context": {
                    "level": 64
                },
                "personalAnimation": "questionBubble",
                "showDiary": false,
                "location": 4
            },
            {
                "id": "r67",
                "personImage": "sova2",
                "personName": "replica.r67.personName",
                "rightSide": false,
                "text": "replica.r67.text",
                "context": {
                    "level": 64
                },
                "personalAnimation": "love",
                "showDiary": false
            },
            {
                "id": "r68",
                "personImage": "cat4",
                "personName": "replica.r68.personName",
                "rightSide": true,
                "text": "replica.r68.text",
                "context": {
                    "level": 64
                },
                "personalAnimation": "love"
            },
            {
                "id": "r69",
                "personImage": "sova1",
                "personName": "replica.r69.personName",
                "rightSide": false,
                "text": "replica.r69.text",
                "context": {
                    "level": 64
                },
                "afterAnimation": "transition"
            },
            {
                "id": "r70",
                "personImage": "sveta1",
                "personName": "replica.r70.personName",
                "rightSide": false,
                "text": "replica.r70.text",
                "context": {
                    "level": 64
                },
                "location": 7,
                "delay": 500,
                "buttonName": "replica.r70.buttonName",
                "buttonImage": "loupe"
            },
            {
                "id": "r71",
                "personImage": "sova1",
                "personName": "replica.r71.personName",
                "rightSide": false,
                "text": "replica.r71.text",
                "context": {
                    "level": 71
                },
                "decor": {
                    "image": "sphere1",
                    "x": 221,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                },
                "decor2": null
            },
            {
                "id": "r71b",
                "personImage": "sova1",
                "personName": "replica.r71b.personName",
                "rightSide": false,
                "text": "replica.r71b.text",
                "context": {
                    "level": 71
                },
                "decor": {
                    "image": "sphere2",
                    "x": 221,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                },
                "afterAnimation": "mountineVisionShow",
                "showDiary": false
            },
            {
                "id": "r72",
                "personImage": "sova1",
                "personName": "replica.r72.personName",
                "rightSide": false,
                "text": "replica.r72.text",
                "context": {
                    "level": 71
                },
                "decor": {
                    "image": "owlVision",
                    "x": 138,
                    "y": 91,
                    "rightSide": false,
                    "overDialog": false,
                    "animation": "flicker"
                },
                "decor2": {
                    "image": "sphere2",
                    "x": 221,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                },
                "personalAnimation": "bigBubbleMountine",
                "afterAnimation": "mountineVisionZoom"
            },
            {
                "id": "r73",
                "personImage": "sova1",
                "personName": "replica.r73.personName",
                "rightSide": false,
                "text": "replica.r73.text",
                "context": {
                    "level": 71
                },
                "decor": {
                    "image": "owlVision",
                    "x": 139,
                    "y": 91,
                    "rightSide": false,
                    "overDialog": false,
                    "animation": "flicker"
                },
                "decor2": {
                    "image": "sphere2",
                    "x": 221,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r74",
                "personImage": "cat1",
                "personName": "replica.r74.personName",
                "rightSide": true,
                "text": "replica.r74.text",
                "context": {
                    "level": 71
                },
                "afterAnimation": null
            },
            {
                "id": "r75",
                "personImage": "sova3",
                "personName": "replica.r75.personName",
                "rightSide": false,
                "text": "replica.r75.text",
                "context": {
                    "level": 71
                },
                "decor": {
                    "image": "sphere2",
                    "x": 221,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                },
                "afterAnimation": "mountineVisionHide",
                "buttonName": "replica.r75.buttonName",
                "buttonImage": "actionBoots",
                "showDiary": false,
                "glint": null
            },
            {
                "id": "r76",
                "personImage": "sveta2",
                "personName": "replica.r76.personName",
                "rightSide": false,
                "text": "replica.r76.text",
                "context": {
                    "level": 78
                },
                "decor": {
                    "image": "bootsBroken",
                    "x": 275,
                    "y": -4,
                    "rightSide": false,
                    "overDialog": true
                },
                "decor2": {
                    "image": "batteryLow",
                    "x": 213,
                    "y": 121,
                    "rightSide": false,
                    "overDialog": true,
                    "animation": "blinking"
                },
                "glint": null
            },
            {
                "id": "r77",
                "personImage": "cat2",
                "personName": "replica.r77.personName",
                "rightSide": true,
                "text": "replica.r77.text",
                "context": {
                    "level": 78
                },
                "decor": null,
                "decor2": null
            },
            {
                "id": "r78",
                "personImage": "sova1",
                "personName": "replica.r78.personName",
                "rightSide": false,
                "text": "replica.r78.text",
                "context": {
                    "level": 78
                },
                "afterLevelLocation": 9,
                "buttonName": "replica.r78.buttonName",
                "buttonImage": "tree"
            },
            {
                "id": "r79",
                "personImage": "belka1",
                "personName": "replica.r79.personName",
                "rightSide": true,
                "text": "replica.r79.text",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r80",
                "personImage": "sveta1",
                "personName": "replica.r80.personName",
                "rightSide": false,
                "text": "replica.r80.text",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r81",
                "personImage": "belka1",
                "personName": "replica.r81.personName",
                "rightSide": true,
                "text": "replica.r81.text",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r82",
                "personImage": "sova1",
                "personName": "replica.r82.personName",
                "rightSide": false,
                "text": "replica.r82.text",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r83",
                "personImage": "leshii2",
                "personName": "replica.r83.personName",
                "rightSide": true,
                "text": "replica.r83.text",
                "context": {
                    "level": 85
                }
            },
            {
                "id": "r84",
                "personImage": "leshii1",
                "personName": "replica.r84.personName",
                "rightSide": true,
                "text": "replica.r84.text",
                "context": {
                    "level": 85
                },
                "showDiary": true
            },
            {
                "id": "r85",
                "personImage": "cat1",
                "personName": "replica.r85.personName",
                "rightSide": false,
                "text": "replica.r85.text",
                "context": {
                    "level": 85
                },
                "afterAnimation": "transition",
                "buttonName": "replica.r85.buttonName",
                "buttonImage": "actionHouse"
            },
            {
                "id": "r86",
                "personImage": "sveta1",
                "personName": "replica.r86.personName",
                "rightSide": false,
                "text": "replica.r86.text",
                "context": {
                    "level": 85
                },
                "location": 4,
                "delay": 500,
                "buttonName": "replica.r86.buttonName",
                "buttonImage": "goldRoot"
            },
            {
                "id": "r87",
                "personImage": "sveta1",
                "personName": "replica.r87.personName",
                "rightSide": false,
                "text": "replica.r87.text",
                "context": {
                    "level": 92
                },
                "decor": {
                    "image": "bootsBroken",
                    "x": 275,
                    "y": -4,
                    "rightSide": false,
                    "overDialog": true
                },
                "afterAnimation": "cooking(goldRoot|witchMushroom|bootsBroken!&green)",
                "buttonName": "replica.r87.buttonName",
                "buttonImage": "actionBoiler"
            },
            {
                "id": "r88",
                "personImage": "sveta2",
                "personName": "replica.r88.personName",
                "rightSide": false,
                "text": "replica.r88.text",
                "context": {
                    "level": 92
                },
                "decor": {
                    "image": "bootsBroken_fadeOut",
                    "x": 275,
                    "y": -4,
                    "rightSide": false,
                    "overDialog": true,
                    "animation": "fadeOutBoots"
                },
                "afterAnimation": "hideBoots"
            },
            {
                "id": "r89",
                "personImage": "cat1",
                "personName": "replica.r89.personName",
                "rightSide": true,
                "text": "replica.r89.text",
                "context": {
                    "level": 92
                },
                "decor": {
                    "image": "boots",
                    "x": 275,
                    "y": -4,
                    "rightSide": true,
                    "overDialog": true
                },
                "decor2": {
                    "image": "battery1",
                    "x": 325,
                    "y": 140,
                    "rightSide": true,
                    "overDialog": true,
                    "animation": "fillBattery"
                }
            },
            {
                "id": "r90",
                "personImage": "cat1",
                "personName": "replica.r90.personName",
                "rightSide": true,
                "text": "replica.r90.text",
                "context": {
                    "level": 92
                },
                "decor": null,
                "decor2": null
            },
            {
                "id": "r91",
                "personImage": "sova2",
                "personName": "replica.r91.personName",
                "rightSide": false,
                "text": "replica.r91.text",
                "context": {
                    "level": 92
                },
                "showDiary": true,
                "buttonName": "replica.r91.buttonName",
                "buttonImage": "actionMap",
                "afterLevelLocation": 9
            },
            {
                "id": "r92",
                "personImage": "cat1",
                "personName": "replica.r92.personName",
                "rightSide": true,
                "text": "replica.r92.text",
                "context": {
                    "level": 97
                }
            },
            {
                "id": "r93",
                "personImage": "sveta1",
                "personName": "replica.r93.personName",
                "rightSide": false,
                "text": "replica.r93.text",
                "context": {
                    "level": 97
                },
                "buttonName": "replica.r93.buttonName",
                "buttonImage": "tree"
            },
            {
                "id": "r94",
                "personImage": "cat2",
                "personName": "replica.r94.personName",
                "rightSide": true,
                "text": "replica.r94.text",
                "context": {
                    "level": 98
                },
                "afterLevelLocation": null
            },
            {
                "id": "r95",
                "personImage": "sveta1",
                "personName": "replica.r95.personName",
                "rightSide": false,
                "text": "replica.r95.text",
                "context": {
                    "level": 98
                },
                "buttonName": "replica.r95.buttonName",
                "buttonImage": "tree",
                "afterLevelLocation": 11
            },
            {
                "id": "r96",
                "personImage": "sveta4",
                "personName": "replica.r96.personName",
                "rightSide": false,
                "text": "replica.r96.text",
                "context": {
                    "level": 99
                }
            },
            {
                "id": "r97",
                "personImage": "cat2",
                "personName": "replica.r97.personName",
                "rightSide": true,
                "text": "replica.r97.text",
                "context": {
                    "level": 99
                },
                "decor": {
                    "image": "cat3floar",
                    "x": 74,
                    "y": 195,
                    "rightSide": true,
                    "overDialog": false
                },
                "showDiary": false
            },
            {
                "id": "r98",
                "personImage": "sova3",
                "personName": "replica.r98.personName",
                "rightSide": true,
                "text": "replica.r98.text",
                "context": {
                    "level": 99
                }
            },
            {
                "id": "r99",
                "personImage": "sveta1",
                "personName": "replica.r99.personName",
                "rightSide": false,
                "text": "replica.r99.text",
                "context": {
                    "level": 99
                },
                "buttonName": "replica.r99.buttonName",
                "buttonImage": "wheat",
                "showDiary": false
            },
            {
                "id": "r100",
                "personImage": "sveta1",
                "personName": "replica.r100.personName",
                "rightSide": false,
                "text": "replica.r100.text",
                "context": {
                    "level": 104
                },
                "buttonName": "replica.r100.buttonName",
                "buttonImage": "wheat",
                "afterAnimation": "textTransition(ui.transition.thirtyMinutesLater)"
            },
            {
                "id": "r101",
                "personImage": "sveta1",
                "personName": "replica.r101.personName",
                "rightSide": false,
                "text": "replica.r101.text",
                "context": {
                    "level": 104
                },
                "delay": 3800,
                "decor": {
                    "image": "flour",
                    "x": 233,
			        "y": 33,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r102",
                "personImage": "sova1",
                "personName": "replica.r102.personName",
                "rightSide": true,
                "text": "replica.r102.text",
                "context": {
                    "level": 104
                },
                "buttonName": "replica.r102.buttonName",
                "buttonImage": "tree",
                "afterLevelLocation": 9
            },
            {
                "id": "r103",
                "personImage": "sveta1",
                "personName": "replica.r103.personName",
                "rightSide": false,
                "text": "replica.r103.text",
                "context": {
                    "level": 111
                },
                "location": 12,
                "buttonName": "replica.r103.buttonName",
                "buttonImage": "goldRoot",
                "decor": {
                    "image": "bootsBroken",
                    "x": 275,
                    "y": -4,
                    "rightSide": false,
                    "overDialog": true
                },
                "decor2": {
                    "image": "batteryLow",
                    "x": 211,
                    "y": 126,
                    "rightSide": false,
                    "overDialog": true,
                    "animation": "blinking"
                }
            },
            {
                "id": "r104",
                "personImage": "sveta1",
                "personName": "replica.r104.personName",
                "rightSide": false,
                "text": "replica.r104.text",
                "context": {
                    "level": 114
                },
                "delay": null,
                "afterAnimation": "textTransition(ui.transition.hourLater)"
            },
            {
                "id": "r105",
                "personImage": "sveta1",
                "personName": "replica.r105.personName",
                "rightSide": false,
                "text": "replica.r105.text",
                "context": {
                    "level": 114
                },
                "delay": 3800,
                "location": 9,
                "afterLevelLocation": null,
                "decor": {
                    "image": "boots",
                    "x": 275,
                    "y": -4,
                    "rightSide": false,
                    "overDialog": true
                },
                "decor2": {
                    "image": "battery1",
                    "x": 211,
                    "y": 126,
                    "rightSide": false,
                    "overDialog": true,
                    "animation": "fillBattery"
                },
                "buttonName": "replica.r105.buttonName",
                "buttonImage": "actionMap"
            },
            {
                "id": "r106",
                "personImage": "sova1",
                "personName": "replica.r106.personName",
                "rightSide": false,
                "text": "replica.r106.text",
                "context": {
                    "level": 118
                },
                "location": 5
            },
            {
                "id": "r107",
                "personImage": "cat2",
                "personName": "replica.r107.personName",
                "rightSide": false,
                "text": "replica.r107.text",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r108",
                "personImage": "cyclop",
                "personName": "replica.r108.personName",
                "rightSide": true,
                "text": "replica.r108.text",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r109",
                "personImage": "cat3",
                "personName": "replica.r109.personName",
                "rightSide": false,
                "text": "replica.r109.text",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r110",
                "personImage": "cyclop",
                "personName": "replica.r110.personName",
                "rightSide": true,
                "text": "replica.r110.text",
                "context": {
                    "level": 120
                },
                "showDiary": false
            },
            {
                "id": "r111",
                "personImage": "cyclop",
                "personName": "replica.r111.personName",
                "rightSide": true,
                "text": "replica.r111.text",
                "context": {
                    "level": 120
                },
                "decor": {
                    "image": "monocle",
                    "x": 158,
                    "y": 285,
                    "rightSide": true,
                    "overDialog": false
                },
                "showDiary": false
            },
            {
                "id": "r112",
                "personImage": "sveta1",
                "personName": "replica.r112.personName",
                "rightSide": false,
                "text": "replica.r112.text",
                "context": {
                    "level": 120
                },
                "buttonName": "replica.r112.buttonName",
                "buttonImage": "loupe"
            },
            {
                "id": "r112b",
                "personImage": "sveta2",
                "personName": "replica.r112b.personName",
                "rightSide": false,
                "text": "replica.r112b.text",
                "context": {
                    "level": 121
                },
                "decor": {
                    "image": "musicTool1",
                    "x": 247,
                    "y": -66,
                    "rightSide": false,
                    "overDialog": false,
                    "animation": "big"
                },
                "personalAnimation": "questionBubble",
                "glint": {
                    "x": 473,
                    "y": -138,
                }
            },
            {
                "id": "r112bb",
                "personImage": "cyclop",
                "personName": "replica.r112bb.personName",
                "rightSide": true,
                "text": "replica.r112bb.text",
                "context": {
                    "level": 121
                },
                "decor": {
                    "image": "monocle",
                    "x": 157,
                    "y": 283,
                    "rightSide": true,
                    "overDialog": false
                },
                "buttonName": "replica.r112bb.buttonName",
                "buttonImage": "loupe"
            },
            {
                "id": "r112c",
                "personImage": "sveta2",
                "personName": "replica.r112c.personName",
                "rightSide": false,
                "text": "replica.r112c.text",
                "context": {
                    "level": 122
                },
                "decor": {
                    "image": "musicTool2",
                    "x": 230,
                    "y": -45,
                    "rightSide": false,
                    "overDialog": false,
                    "animation": "big"
                },
                "glint": {
                    "x": 505,
                    "y": -122,
                },
                "personalAnimation": "questionBubble"
            },
            {
                "id": "r112cc",
                "personImage": "cyclop",
                "personName": "replica.r112cc.personName",
                "rightSide": true,
                "text": "replica.r112cc.text",
                "context": {
                    "level": 122
                },
                "decor": {
                    "image": "monocle",
                    "x": 157,
                    "y": 283,
                    "rightSide": true,
                    "overDialog": false
                },
                "buttonName": "replica.r112cc.buttonName",
                "buttonImage": "loupe"
            },
            {
                "id": "r113",
                "personImage": "sveta1",
                "personName": "replica.r113.personName",
                "rightSide": false,
                "text": "replica.r113.text",
                "context": {
                    "level": 123
                },
                "decor": {
                    "image": "voltorna",
                    "x": 249,
                    "y": 5,
                    "rightSide": false,
                    "overDialog": false
                },
                "showDiary": false,
                "glint": {
                    "x": 500,
                    "y": -176,
                }
            },
            {
                "id": "r114",
                "personImage": "cyclop",
                "personName": "replica.r114.personName",
                "rightSide": true,
                "text": "replica.r114.text",
                "context": {
                    "level": 123
                },
                "decor": {
                    "image": "monocle",
                    "x": 158,
                    "y": 287,
                    "rightSide": true,
                    "overDialog": false
                },
                "decor2": null,
                "showDiary": false,
                "buttonName": "replica.r114.buttonName",
                "buttonImage": "tree"
            },
            {
                "id": "r115",
                "personImage": "cyclop",
                "personName": "replica.r115.personName",
                "rightSide": true,
                "text": "replica.r115.text",
                "context": {
                    "level": 130
                },
                "location": 9,
                "decor": {
                    "image": "monocle",
                    "x": 157,
                    "y": 288,
                    "rightSide": true,
                    "overDialog": false
                },
                "decor2": {
                    "image": "strawberryBucket",
                    "x": 302,
                    "y": -71,
                    "rightSide": true,
                    "overDialog": false
                }
            },
            {
                "id": "r116",
                "personImage": "cat4",
                "personName": "replica.r116.personName",
                "rightSide": false,
                "text": "replica.r116.text",
                "context": {
                    "level": 130
                },
                "decor": {
                    "image": "strawberryBucket",
                    "x": 186,
                    "y": -81,
                    "rightSide": false,
                    "overDialog": false
                },
                "personalAnimation": "love"
            },
            {
                "id": "r117",
                "personImage": "sveta1",
                "personName": "replica.r117.personName",
                "rightSide": false,
                "text": "replica.r117.text",
                "context": {
                    "level": 130
                },
                "buttonName": "replica.r117.buttonName",
                "buttonImage": "goldRoot",
                "afterLevelLocation": 12
            },
            {
                "id": "r118",
                "personImage": "sova1",
                "personName": "replica.r118.personName",
                "rightSide": false,
                "text": "replica.r118.text",
                "context": {
                    "level": 133
                },
                "showDiary": false
            },
            {
                "id": "r119",
                "personImage": "cat1",
                "personName": "replica.r119.personName",
                "rightSide": true,
                "text": "replica.r119.text",
                "context": {
                    "level": 133
                }
            },
            {
                "id": "r120",
                "personImage": "sova1",
                "personName": "replica.r120.personName",
                "rightSide": false,
                "text": "replica.r120.text",
                "context": {
                    "level": 133
                },
                "buttonName": "replica.r120.buttonName",
                "buttonImage": "tree",
                "afterLevelLocation": 0,
                "showDiary": true
            },
            {
                "id": "r121",
                "personImage": "sova2",
                "personName": "replica.r121.personName",
                "rightSide": false,
                "text": "replica.r121.text",
                "context": {
                    "level": 134
                },
                "location": 8
            },
            {
                "id": "r122",
                "personImage": "sova1",
                "personName": "replica.r122.personName",
                "rightSide": false,
                "text": "replica.r122.text",
                "context": {
                    "level": 134
                }
            },
            {
                "id": "r123",
                "personImage": "sveta2",
                "personName": "replica.r123.personName",
                "rightSide": false,
                "text": "replica.r123.text",
                "context": {
                    "level": 140
                },
                "showDiary": false
            },
            {
                "id": "r124",
                "personImage": "cat1",
                "personName": "replica.r124.personName",
                "rightSide": false,
                "text": "replica.r124.text",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r125",
                "personImage": "dwarfs",
                "personName": "replica.r125.personName",
                "rightSide": true,
                "text": "replica.r125.text",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r126",
                "personImage": "dwarfs",
                "personName": "replica.r126.personName",
                "rightSide": true,
                "text": "replica.r126.text",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r127",
                "personImage": "sova3",
                "personName": "replica.r127.personName",
                "rightSide": true,
                "text": "replica.r127.text",
                "context": {
                    "level": 140
                },
                "decor": {
                    "image": "cage",
                    "x": 13,
                    "y": 7,
                    "rightSide": true,
                    "overDialog": false
                }
            },
            {
                "id": "r128",
                "personImage": "sveta4",
                "personName": "replica.r128.personName",
                "rightSide": false,
                "text": "replica.r128.text",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r129",
                "personImage": "dwarfs",
                "personName": "replica.r129.personName",
                "rightSide": true,
                "text": "replica.r129.text",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r130",
                "personImage": "cat2",
                "personName": "replica.r130.personName",
                "rightSide": false,
                "text": "replica.r130.text",
                "context": {
                    "level": 140
                },
                "buttonName": "replica.r130.buttonName",
                "buttonImage": "loupe"
            },
            {
                "id": "r131",
                "personImage": "sveta1",
                "personName": "replica.r131.personName",
                "rightSide": false,
                "text": "replica.r131.text",
                "context": {
                    "level": 143
                },
                "decor": {
                    "image": "boombox",
                    "x": 250,
                    "y": 42,
                    "rightSide": false,
                    "overDialog": false
                }
            },
            {
                "id": "r132",
                "personImage": "dwarfs",
                "personName": "replica.r132.personName",
                "rightSide": true,
                "text": "replica.r132.text",
                "context": {
                    "level": 143
                },
                "decor": {
                    "image": "boombox",
                    "x": 321,
                    "y": 22,
                    "rightSide": true,
                    "overDialog": false
                },
                "personalAnimation": "questionBubble"
            },
            {
                "id": "r133",
                "personImage": "dwarfs",
                "personName": "replica.r133.personName",
                "rightSide": true,
                "text": "replica.r133.text",
                "context": {
                    "level": 143
                },
                "decor": {
                    "image": "boombox",
                    "x": 321,
                    "y": 22,
                    "rightSide": true,
                    "overDialog": false
                },
                "personalAnimation": "love"
            },
            {
                "id": "r134",
                "personImage": "sova3",
                "personName": "replica.r134.personName",
                "rightSide": true,
                "text": "replica.r134.text",
                "context": {
                    "level": 143
                },
                "buttonName": "replica.r134.buttonName",
                "buttonImage": "actionMap"
            },
            {
                "id": "r135",
                "personImage": "cat1",
                "personName": "replica.r135.personName",
                "rightSide": false,
                "text": "replica.r135.text",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r136",
                "personImage": "sova3",
                "personName": "replica.r136.personName",
                "rightSide": true,
                "text": "replica.r136.text",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r137",
                "personImage": "sveta2",
                "personName": "replica.r137.personName",
                "rightSide": false,
                "text": "replica.r137.text",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r138",
                "personImage": "sveta1",
                "personName": "replica.r138.personName",
                "rightSide": false,
                "text": "replica.r138.text",
                "context": {
                    "level": 150
                },
                "buttonName": "replica.r138.buttonName",
                "buttonImage": "goldRoot"
            },
            {
                "id": "r139",
                "personImage": "sova1",
                "personName": "replica.r139.personName",
                "rightSide": true,
                "text": "replica.r139.text",
                "context": {
                    "level": 153
                }
            },
            {
                "id": "r140",
                "personImage": "cat1",
                "personName": "replica.r140.personName",
                "rightSide": true,
                "text": "replica.r140.text",
                "context": {
                    "level": 153
                }
            },
            {
                "id": "r141",
                "personImage": "sveta1",
                "personName": "replica.r141.personName",
                "rightSide": false,
                "text": "replica.r141.text",
                "context": {
                    "level": 153
                },
                "buttonName": "replica.r141.buttonName",
                "buttonImage": "actionMap"
            }
        ]}


