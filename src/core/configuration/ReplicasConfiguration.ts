import ReplicaType from '../model/replica/ReplicaType';
import User from '../model/user/User';
import StoryLocation from '../model/enum/StoryLocation';
export default class ReplicasConfiguration {

    public static allReplicas: ReplicaType[] =[
            {
                "id": "r1",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 1
                },
                "text": "О! Похоже, здесь ещё одна ~грибная полянка~ поблизости.",
                "buttonName": "За грибами!",
                "location": 0,
                "afterLevelLocation": null,
                "showDiary": false
            },
            {
                "id": "r2",
                "personImage": "sveta2",
                "personName": "Эмма",
                "location": 1,
                "context": {
                    "level": 2
                },
                "text": "Странно. Никогда здесь не была, а все кажется ~каким-то знакомым~. "
            },
            {
                "id": "r2b",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 2
                },
                "text": "Не удивлюсь, если в доме окажется тот ~старый сундук~, который мне вечно снится.",
                "buttonName": "Зайти в дом",
                "buttonImage": "actionDoor",
                "afterAnimation": "transition"
            },
            {
                "id": "r3",
                "personImage": "sveta4",
                "personName": "Эмма",
                "delay": 500,
                "location": 2,
                "context": {
                    "level": 2
                },
                "text": "Это что? Какой-то ~розыгрыш~?"
            },
            {
                "id": "r4",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 2
                },
                "text": "Интересно, как открывается этот ~сундук~?",
                "buttonName": "Поискать ключ",
                "buttonImage": "actionChest",
                "personalAnimation": "questionBubble"
            },
            {
                "id": "r5",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 3
                },
                "text": "Ключ был под половичком! Хозяева ~серьезно~ подумали о безопасности.",
                "buttonName": "Открыть сундук",
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
                "personName": "Эмма",
                "location": 3,
                "afterLevelLocation": 4,
                "context": {
                    "level": 3
                },
                "text": "Что же там внутри? Скорее посмотрим!",
                "buttonName": "Обыскать сундук",
                "buttonImage": "actionChest",
                "showDiary": false
            },
            {
                "id": "r7",
                "personImage": "sveta1",
                "personName": "Эмма",
                "afterAnimation": "cooking",
                "context": {
                    "level": 7
                },
                "text": "Кажется, мы собрали все грибы! Теперь попробуем ~приготовить~ зелье!",
                "buttonName": "Готовить зелье",
                "buttonImage": "actionBoiler",
                "showDiary": false
            },
            {
                "id": "r8",
                "personImage": "sveta1",
                "personName": "Эмма",
                "afterAnimation": "boilerBurst",
                "context": {
                    "level": 7
                },
                "text": "Закидываем ~ингридиенты~ в котел... И немного ~поварим~...",
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
                "personName": "Эмма",
                "context": {
                    "level": 7
                },
                "text": "Ой-ой-ой! Что происходит?",
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
                "personName": "Эмма",
                "afterLevelLocation": 9,
                "context": {
                    "level": 7
                },
                "text": "Зелье проявило ~новую страницу~ в тетради! Это похоже на ~карту местности~!",
                "showDiary": true,
                "buttonName": "В путь",
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
                "personName": "Котёнок",
                "location": 4,
                "context": {
                    "level": 14
                },
                "rightSide": true,
                "text": "Мяу!",
                "personalAnimation": "eatBubble",
                "decor": null
            },
            {
                "id": "r11",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 14
                },
                "text": "Надо тебя накормить. У нас тут как раз есть ~бутылочка молока~.",
                "buttonName": "Кормить",
                "buttonImage": "actionCream",
                "afterAnimation": "nothing"
            },
            {
                "id": "r12",
                "personImage": "cat2",
                "personName": "Котёнок",
                "context": {
                    "level": 14
                },
                "text": "...",
                "rightSide": true,
                "personalAnimation": "fooBubble"
            },
            {
                "id": "r14",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 14
                },
                "text": "Котёнок ~отказывается~ пить молоко, странно! Что ж, заглянем в тетрадь.."
            },
            {
                "id": "r15",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 14
                },
                "showDiary": true,
                "text": "Получается, наш котик и есть ~Борис~? Какие-то ~странные вкусы~ у него. Попробуем накормить!",
                "buttonName": "За грибами",
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
                "personName": "Эмма",
                "context": {
                    "level": 17
                },
                "text": "А ~мухомор~ точно нужно класть? Он же ядовитый... Эх, была не была!",
                "buttonName": "Варить по рецепту",
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
                "personName": "Котёнок",
                "context": {
                    "level": 17
                },
                "text": "М-р-р-р-р!",
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
                "personName": "Котёнок",
                "context": {
                    "level": 17
                },
                "rightSide": true,
                "text": "Мяу!",
                "personalAnimation": "drinkBubble",
                "decor": null
            },
            {
                "id": "r18",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 17
                },
                "showDiary": true,
                "text": "Похоже, теперь котик хочет пить! А в тетрадке как раз есть рецепт, как ~напоить кота~!",
                "buttonName": "В лес!",
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
                "personName": "Эмма",
                "context": {
                    "level": 20
                },
                "text": "Может мне тоже ~попробовать напиток~? Нет, пожалуй не рискну. ",
                "buttonName": "Сварить напиток",
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
                "personName": "Котёнок",
                "context": {
                    "level": 20
                },
                "text": "...",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "@Здравствуй!@",
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
                "personName": "Эмма",
                "context": {
                    "level": 20
                },
                "text": "Ммм. Привет. Ты умеешь разговаривать?"
            },
            {
                "id": "r22",
                "personImage": "cat3",
                "personName": "Котёнок",
                "context": {
                    "level": 20
                },
                "text": "Похоже на то! Ну и дела.. А ты кто такая?",
                "rightSide": true
            },
            {
                "id": "r23",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 20
                },
                "text": "Я ~Эмма~. А ты, наверное, ~Борис~?"
            },
            {
                "id": "r24",
                "personImage": "cat1",
                "personName": "Котёнок",
                "context": {
                    "level": 20
                },
                "text": "Здравствуй, ~Эм-ма~.. А вот ~кто я~ - я тебе сказать не могу. Сам не помню.",
                "rightSide": true
            },
            {
                "id": "r25",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 20
                },
                "text": "У меня есть говорящий котик, который ~ничего не помнит~. Думаю, стоит снова заглянуть в тетрадку."
            },
            {
                "id": "r26",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 20
                },
                "showDiary": true,
                "text": "Вперёд, за новыми ~ингридиентами~!",
                "buttonName": "За грибами",
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
                "personName": "Котёнок",
                "context": {
                    "level": 24
                },
                "afterAnimation": null,
                "text": "Я вспомнил свое имя: ~Баюн~. К вашим услугам! ",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "beforeAnimation": "memoryRestoration1",
                "delay": 1000
            },
            {
                "id": "r28",
                "personImage": "cat2",
                "personName": "Котёнок",
                "context": {
                    "level": 24
                },
                "text": "Кстати, у тебя нет ~зеркала~? Хочу посмотреть, как я выгляжу. Может вспомню что-нибудь ещё.",
                "rightSide": true
            },
            {
                "id": "r29",
                "personImage": "sveta1",
                "personName": "Эмма",
                "context": {
                    "level": 24
                },
                "text": "Вот ~зеркальце~, держи!",
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
                "personName": "Котёнок",
                "context": {
                    "level": 24
                },
                "text": "ААААААААА! АААА!                       @Я кот!@ Какой ужас!",
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
                "personName": "Эмма",
                "context": {
                    "level": 24
                },
                "text": "Ты не знал?",
            },
            // {
            //     "id": "r30",
            //     "personImage": "cat1",
            //     "personName": "Котёнок",
            //     "context": {
            //         "level": 24
            //     },
            //     "text": "Благородный рыжий цвет, роскошные   усы... Да я ~чертовски хорош собой~! ",
            //     "rightSide": true,
            //     "decor": {
            //         "image": "mirror2b",
            //         "x": 300,
            //         "y": 0,
            //         "rightSide": true,
            //         "overDialog": true
            //     },
            //     "glint": {
            //         "x": 561,
            //         "y": -57,
            //     },
            //     "decor2": {
            //         "image": "cat1cheeks",
            //         "x": 80,
            //         "y": 269,
            //         "rightSide": true,
            //         "overDialog": true
            //     }
            // },
            {
                "id": "r32",
                "personImage": "cat1",
                "personName": "Котёнок",
                "context": {
                    "level": 24
                },
                "text": "Вообще-то, знал. Пошутил просто.. Полагаю, в дневнике моей хозяйки открылась ~новая страница~.",
                "rightSide": true
            },
            {
                "id": "r32b",
                "personImage": "sveta1",
                "personName": "Эмма",
                "showDiary": true,
                "buttonName": "За грибами",
                "context": {
                    "level": 24
                },
                "text": "Продолжим восстановление памяти!"
            },
            {
                "id": "r33",
                "personImage": "cat1",
                "personName": "Котёнок",
                "context": {
                    "level": 28
                },
                "text": "Вспоминаю хозяйку. Хорошая, добрая женщина. Кажется, она просила меня ~что-то кому-то передать~.",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "beforeAnimation": "memoryRestoration2",
                "delay": 1000
            },
            {
                "id": "r34",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 28
                },
                "text": "Что же ты должен передать и кому?"
            },
            {
                "id": "r34b",
                "personImage": "cat2",
                "personName": "Котёнок",
                "context": {
                    "level": 28
                },
                "text": "Не могу вспомнить. Но, похоже, это ~очень важно~.",
                "rightSide": true
            },
            {
                "id": "r34bb",
                "personImage": "sveta1",
                "personName": "Эмма",
                "buttonName": "В лес",
                "showDiary": true,
                "context": {
                    "level": 28
                },
                "text": "Последнее зелье ~полностью~ восстановит твою память!"
            },
            {
                "id": "r34c",
                "personImage": "cat1",
                "personName": "Котёнок",
                "context": {
                    "level": 32
                },
                "text": "Вспомнил. Хозяйка сказала: ~Если я не вернусь до осени, проси помощи у Эм-ма~",
                "rightSide": true,
                "personalAnimation": "ideaBubble",
                "delay": 1000,
                "beforeAnimation": "memoryRestoration3"
            },
            {
                "id": "r35",
                "personImage": "sveta2",
                "personName": "Эмма",
                "context": {
                    "level": 32
                },
                "text": "Эм-ма?"
            },
            {
                "id": "r36",
                "personImage": "cat1",
                "personName": "Котёнок",
                "context": {
                    "level": 32
                },
                "text": "Я думаю, это ты и есть. Кто еще мог найти ~заповедную избушку~ и сварить столько ~зелий~? Поможешь хозяйке?",
                "rightSide": true
            },
            {
                "id": "r37",
                "personImage": "sveta4",
                "personName": "Эмма",
                "context": {
                    "level": 32
                },
                "text": "Я ведь даже не знаю в чем ей нужна помощь. Вдруг она детей ест?"
            },
            {
                "id": "r38",
                "personImage": "cat1",
                "personName": "Котёнок",
                "afterAnimation": "stormTransition(Она не поможет!)",
                "context": {
                    "level": 32
                },
                "text": "Наговаривают это на нее. Не ест она детей. Даже взрослых почти не ест. Так ты поможешь?",
                "rightSide": true
            },
            {
                "id": "r39",
                "delay": 3800,
                "personImage": "sveta4",
                "personName": "Эмма",
                "location": 5,
                "context": {
                    "level": 32
                },
                "text": "Что за @странное место@? Как я здесь оказалась?                 "
            },
            {
                "id": "r40",
                "personImage": "sveta2",
                "personName": "Эмма",
                "text": "Надо выбираться отсюда поскорее.",
                "context": {
                    "level": 32
                },
                "buttonName": "Искать выход",
                "buttonImage": "tree"
            },
            {
                "id": "r41",
                "personImage": "sveta1",
                "personName": "Эмма",
                "text": "Пока выхода из леса не видно...",
                "context": {
                    "level": 37
                },
                "location": 6,
                "afterAnimation": null
            },
            {
                "id": "r41b",
                "personImage": "sveta2",
                "personName": "Эмма",
                "text": "А что это за ~лошадка~ там?",
                "context": {
                    "level": 37
                },
                "afterAnimation": "unicornHide"
            },
            {
                "id": "r42",
                "personImage": "unicorn2",
                "personName": "Лошадка",
                "rightSide": true,
                "text": "...",
                "context": {
                    "level": 37
                },
                "afterAnimation": "unicornShow"
            },
            {
                "id": "r43",
                "personImage": "sveta4",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Да это же настоящий ~единорог~!        Эй, погоди.. Куда же ты?\n",
                "context": {
                    "level": 37
                },
                "location": 0,
                "afterAnimation": "unicornMove"
            },
            {
                "id": "r44",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Пойду следом за единорогом. Может он выведет меня из леса?",
                "context": {
                    "level": 37
                },
                "delay": 3000,
                "decor": null,
                "location": 5,
                "buttonName": "За единорогом!",
                "buttonImage": "unicorn3",
                "showDiary": false
            },
            {
                "id": "r45",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Единорог скрылся из виду.               Но лес здесь становится реже.      ",
                "context": {
                    "level": 38
                },
                "location": 5
            },
            {
                "id": "r46",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Похоже, я на ~правильном пути~!\n",
                "context": {
                    "level": 38
                },
                "buttonName": "Вперёд!",
                "buttonImage": "tree"
            },
            {
                "id": "r47",
                "personImage": "sveta5",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Уф. Не знала, что буду так радоваться оказавшись в чаще ~нормального леса~!",
                "context": {
                    "level": 44
                },
                "location": 9
            },
            {
                "id": "r48",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Надо поискать чего-нибудь поесть.\n",
                "context": {
                    "level": 44
                },
                "buttonName": "За грибами",
                "buttonImage": "actionMushroom",
                "showDiary": true
            },
            {
                "id": "r49",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Теперь нужны ~поленья~, чтобы развести огонь.\n",
                "context": {
                    "level": 46
                },
                "buttonName": "За поленьями",
                "buttonImage": "poleno"
            },
            {
                "id": "r50",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Вот и отлично, наконец-то пообедаю! ",
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
                "personName": "Леший",
                "rightSide": true,
                "text": "Ты откуда здесь взялась?              Кто ~разрешил~ костёр жечь?",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r52",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Я заблудилась и проголодалась. Только что вышла из мрачного леса и …\n",
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
                "personName": "Леший",
                "rightSide": true,
                "text": "Вышла из Мрачного Леса?!                Нет оттуда выхода! ",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r54",
                "personImage": "leshii2",
                "personName": "Леший",
                "rightSide": true,
                "text": "Если ты конечно не… Эм-ма? Та самая? Из ~легенды~? ",
                "context": {
                    "level": 47
                }
            },
            {
                "id": "r54b",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Что? Нет, я самая обычная Эмма.",
                "context": {
                    "level": 47
                },
                "decor": null
            },
            {
                "id": "r55",
                "personImage": "leshii1",
                "personName": "Леший",
                "rightSide": true,
                "text": "Ну тогда всё ясно… Тебе нужно идти на север. ",
                "context": {
                    "level": 47
                },
                "showDiary": true,
                "buttonName": "В путь!",
                "buttonImage": "actionHouse",
                "afterLevelLocation": 9
            },
            {
                "id": "r56",
                "personImage": "cat4",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Наконец-то. Я уже ~заждался~. Что так долго-то?",
                "context": {
                    "level": 54
                },
                "location": 4,
                "personalAnimation": "love"
            },
            {
                "id": "r57",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Ну, я попала в мрачный лес и …\n",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r58",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Знаю-знаю. Все слышали  Легенду.       Но я думал, что ~Великая Эм-ма~ выйдет из мрачного леса побыстрее...",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r59",
                "personImage": "cat2",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "У нас мало времени - нужно разыскать ~Совёнка~. Он - ключ ко всему!\n",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r60",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Совёнка?",
                "context": {
                    "level": 54
                }
            },
            {
                "id": "r61",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Ну да. У Хозяйки был Совёнок.         Когда все ~пошло кувырком~, он исчез. Теперь надо его разыскать! \n",
                "context": {
                    "level": 54
                },
                "showDiary": true,
                "buttonName": "За совёнком!",
                "buttonImage": "owl",
                "afterLevelLocation": 9
            },
            {
                "id": "r62",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Кого это ты принесла? Совёнок, здорово.. Только это ~не наш~ совёнок.\n",
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
                "personName": "Эмма",
                "rightSide": false,
                "text": "Серьезно? А как узнать нашего? ",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Ну, во-первых у него ~серьезный вид~. Во-вторых, он ~побольше~. Ну и еще - он носит ~розовые очки~!",
                "context": {
                    "level": 59
                },
                "personalAnimation": null
            },
            {
                "id": "r65",
                "personImage": "sveta3",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Неплохо. А ты не мог сказать об этом раньше?\n",
                "context": {
                    "level": 59
                },
                "personalAnimation": null,
                "buttonName": "Снова в путь!",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Нашелся наконец, ~блудный совёнок~.    Где тебя носило вообще? ",
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
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Славный котик, как я рад тебя снова видеть. Ты так ~похорошел~!",
                "context": {
                    "level": 64
                },
                "personalAnimation": "love",
                "showDiary": false
            },
            {
                "id": "r68",
                "personImage": "cat4",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Опять за своё, льстивая птица… Ладно. Знаешь ~где искать~ Хозяйку?",
                "context": {
                    "level": 64
                },
                "personalAnimation": "love"
            },
            {
                "id": "r69",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Друзья, я думаю, нам надо спросить    об этом у ~Хрустального Шара~.        Он хранится на чердаке.",
                "context": {
                    "level": 64
                },
                "afterAnimation": "transition"
            },
            {
                "id": "r70",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Милый чердачок! Ну что ж, на поиски.\n",
                "context": {
                    "level": 64
                },
                "location": 7,
                "delay": 500,
                "buttonName": "На поиски шара",
                "buttonImage": "loupe"
            },
            {
                "id": "r71",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Простите меня, любимые друзья, сейчас  я буду читать тайные заклинания. Шар по-другому ~не понимает~.\n",
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
                "personName": "Совёнок",
                "rightSide": false,
                "text": "@Okey-Google! Find-our-Mistress!@",
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
                "personName": "Совёнок",
                "rightSide": false,
                "text": "@...@",
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
                "personName": "Совёнок",
                "rightSide": false,
                "text": "@Zoom-In please!@",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "~Хозяйка!~ Эк, куда ее занесло! ",
                "context": {
                    "level": 71
                },
                "afterAnimation": null
            },
            {
                "id": "r75",
                "personImage": "sova3",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Дааа… Далековато… Пешком туда не  дойти. Тут ~сапоги~ нужны! Где-то на чердаке была пара марки ~\"Скороходы\"~\n",
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
                "buttonName": "На поиски!",
                "buttonImage": "actionBoots",
                "showDiary": false,
                "glint": null
            },
            {
                "id": "r76",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Это точно ~нужные сапоги~?",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Да они же совсем ~разрядились~!\n",
                "context": {
                    "level": 78
                },
                "decor": null,
                "decor2": null
            },
            {
                "id": "r78",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Мне кажется, добрый Леший знал, ~как зарядить сапоги~. Давайте отправимся к нему!\n",
                "context": {
                    "level": 78
                },
                "afterLevelLocation": 9,
                "buttonName": "К лешему!",
                "buttonImage": "tree"
            },
            {
                "id": "r79",
                "personImage": "belka1",
                "personName": "Белка",
                "rightSide": true,
                "text": "Здравствуй, легендарная Эм-ма! Куда это ты идешь?\n",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r80",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Здравствуй, Белка. Мы направляемся ~к Лешему~. А ты почему интересуешься?",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r81",
                "personImage": "belka1",
                "personName": "Белка",
                "rightSide": true,
                "text": "Да так. Из вежливости. Удачи тебе!",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r82",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Странное дело - никогда раньше не встречал эту белку в нашем лесу.\n",
                "context": {
                    "level": 81
                }
            },
            {
                "id": "r83",
                "personImage": "leshii2",
                "personName": "Леший",
                "rightSide": true,
                "text": "Говорите, у вас ~сапоги разрядились~? Сейчас посмотрю, был у меня один рецепт...",
                "context": {
                    "level": 85
                }
            },
            {
                "id": "r84",
                "personImage": "leshii1",
                "personName": "Леший",
                "rightSide": true,
                "text": "..Ага, вот! Рецепт ~зарядного зелья~. Сам я такое сварить не могу. Тут особый дар нужен!\n",
                "context": {
                    "level": 85
                },
                "showDiary": true
            },
            {
                "id": "r85",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "Спасибо за рецепт, господин Леший!      А теперь поспешим, друзья.          Нужно скорее ~спасать Хозяйку~!",
                "context": {
                    "level": 85
                },
                "afterAnimation": "transition",
                "buttonName": "Домой",
                "buttonImage": "actionHouse"
            },
            {
                "id": "r86",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Предлагаю план: Совёнок, ты ~изучай маршрут~. Кот, ты ~готовь припасы~.    А я пока ~наберу корешков~ для зелья. ",
                "context": {
                    "level": 85
                },
                "location": 4,
                "delay": 500,
                "buttonName": "За корешками",
                "buttonImage": "goldRoot"
            },
            {
                "id": "r87",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Все ~ингредиенты собраны~! Не будем терять времени - закидываем сапоги в котел!",
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
                "buttonName": "Закинуть в котёл",
                "buttonImage": "actionBoiler"
            },
            {
                "id": "r88",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "...",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Отлично! Заряда хватит ~вёрст на триста~… Потом надо будет снова заряжать.\n",
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
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Возьмём с собой припасы: мешочек муки, баночку варенья и походный котелок. Остальное ~найдем в дороге~!\n",
                "context": {
                    "level": 92
                },
                "decor": null,
                "decor2": null
            },
            {
                "id": "r91",
                "personImage": "sova2",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Я подготовил карту. Палаткой отмечены места стоянок. Нас ждёт ~большое приключение~!\n",
                "context": {
                    "level": 92
                },
                "showDiary": true,
                "buttonName": "В путь!",
                "buttonImage": "actionMap",
                "afterLevelLocation": 9
            },
            {
                "id": "r92",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Что то я проголодался!\n",
                "context": {
                    "level": 97
                }
            },
            {
                "id": "r93",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Подожди до ~привала~. На привале поедим.",
                "context": {
                    "level": 97
                },
                "buttonName": "Продолжить путь",
                "buttonImage": "tree"
            },
            {
                "id": "r94",
                "personImage": "cat2",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "А скоро привал? Очень хочу есть..",
                "context": {
                    "level": 98
                },
                "afterLevelLocation": null
            },
            {
                "id": "r95",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Уже почти пришли!",
                "context": {
                    "level": 98
                },
                "buttonName": "Вперёд!",
                "buttonImage": "tree",
                "afterLevelLocation": 11
            },
            {
                "id": "r96",
                "personImage": "sveta4",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Борис, что с тобой??",
                "context": {
                    "level": 99
                }
            },
            {
                "id": "r97",
                "personImage": "cat2",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Простите, друзья.. Я ~случайно ~съел всю нашу муку. \n",
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
                "personName": "Совёнок",
                "rightSide": true,
                "text": "Эх, Борис, Борис.. Он скоро ~придёт в себя~. Но как же мы теперь выручим хозяйку   без припасов?\n",
                "context": {
                    "level": 99
                }
            },
            {
                "id": "r99",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Есть идея! Наберём ~колосков~ в округе и ~перемелем~ их с помощью заброшенной водяной мельницы, что виднеется позади",
                "context": {
                    "level": 99
                },
                "buttonName": "За колосками!",
                "buttonImage": "wheat",
                "showDiary": false
            },
            {
                "id": "r100",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Колоски собраны, Время ~молоть~!",
                "context": {
                    "level": 104
                },
                "buttonName": "Молоть колосья",
                "buttonImage": "wheat",
                "afterAnimation": "textTransition(30 минут спустя..)"
            },
            {
                "id": "r101",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Отлично, ~запасы пополнены~!         Пора отправляться в путь.",
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
                "personName": "Совёнок",
                "rightSide": true,
                "text": "Только теперь муку буду нести я.\n",
                "context": {
                    "level": 104
                },
                "buttonName": "В путь!",
                "buttonImage": "tree",
                "afterLevelLocation": 9
            },
            {
                "id": "r103",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Похоже, сапоги разрядились. Устроим ~привал~, чтобы набрать в округе корешков и зарядить сапоги.",
                "context": {
                    "level": 111
                },
                "location": 12,
                "buttonName": "За корешками!",
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
                "personName": "Эмма",
                "rightSide": false,
                "text": "Сейчас ~зарядим сапоги~ и продолжим   путь!",
                "context": {
                    "level": 114
                },
                "delay": null,
                "afterAnimation": "textTransition(Час спустя..)"
            },
            {
                "id": "r105",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Отлично, ~сапоги заряжены~, палатка собрана. Пора отправляться!\n",
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
                "buttonName": "В путь!",
                "buttonImage": "actionMap"
            },
            {
                "id": "r106",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Внимание, друзья! Входим в ~Темный лес~. Будьте начеку.",
                "context": {
                    "level": 118
                },
                "location": 5
            },
            {
                "id": "r107",
                "personImage": "cat2",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "Что-то мне здесь не нравится..\n",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r108",
                "personImage": "cyclop",
                "personName": "Циклоп",
                "rightSide": true,
                "text": "@Агрх-хр-хр-хрррр!@",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r109",
                "personImage": "cat3",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "ААААААА!",
                "context": {
                    "level": 120
                }
            },
            {
                "id": "r110",
                "personImage": "cyclop",
                "personName": "Циклоп",
                "rightSide": true,
                "text": "Что? Здесь кто-то есть? Секундочку, достану свой ~монокль~.",
                "context": {
                    "level": 120
                },
                "showDiary": false
            },
            {
                "id": "r111",
                "personImage": "cyclop",
                "personName": "Циклоп",
                "rightSide": true,
                "text": "Не хотел вас напугать. Но у меня ~горе~ Я потерял свою любимую волторну!        C одним глазом никак её не отыскать.",
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
                "personName": "Эмма",
                "rightSide": false,
                "text": "Давайте мы вам поможем!",
                "context": {
                    "level": 120
                },
                "buttonName": "На поиски",
                "buttonImage": "loupe"
            },
            {
                "id": "r112b",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Посмотрите! Это тот инструмент, который вам нужен?",
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
                "personName": "Циклоп",
                "rightSide": true,
                "text": "Нет, это виолончель.                   А мой инструмент - ~духовой~!",
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
                "buttonName": "На поиски",
                "buttonImage": "loupe"
            },
            {
                "id": "r112с",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Что скажете насчет этого?",
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
                "id": "r112сс",
                "personImage": "cyclop",
                "personName": "Циклоп",
                "rightSide": true,
                "text": "Теплее! Но это всё же не валторна.      Это обыкновенная ~труба~.",
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
                "buttonName": "На поиски",
                "buttonImage": "loupe"
            },
            {
                "id": "r113",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Вот ваша ~валторна~, господин Циклоп!",
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
                "personName": "Циклоп",
                "rightSide": true,
                "text": "Большое спасибо! Я снова могу ~играть~! Давайте я провожу вас до края тёмного леса.\n",
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
                "buttonName": "В путь",
                "buttonImage": "tree"
            },
            {
                "id": "r115",
                "personImage": "cyclop",
                "personName": "Циклоп",
                "rightSide": true,
                "text": "В знак благодарности за то, что помогли мне - вот вам ~ведро клубники~. Прощайте!\n",
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
                "personName": "Котёнок",
                "rightSide": false,
                "text": "Ух-ты, здорово!\n",
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
                "personName": "Эмма",
                "rightSide": false,
                "text": "Тем временем сапоги снова разрядились. Совсем не держат заряд!\n",
                "context": {
                    "level": 130
                },
                "buttonName": "За корешками",
                "buttonImage": "goldRoot",
                "afterLevelLocation": 12
            },
            {
                "id": "r118",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Половина пути позади!             Дальше наш путь пролегает  через ~Цветочную долину~.\n",
                "context": {
                    "level": 133
                },
                "showDiary": false
            },
            {
                "id": "r119",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Ух ты! Я никогда не бывал в цветочной долине, но говорят, там - ~красиво~!",
                "context": {
                    "level": 133
                }
            },
            {
                "id": "r120",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "В любом случае, будем сохранять бдительность, друзья!",
                "context": {
                    "level": 133
                },
                "buttonName": "В путь!",
                "buttonImage": "tree",
                "afterLevelLocation": 0,
                "showDiary": true
            },
            {
                "id": "r121",
                "personImage": "sova2",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Здесь действительно ~красиво~!\n",
                "context": {
                    "level": 134
                },
                "location": 8
            },
            {
                "id": "r122",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": false,
                "text": "Похоже, я зря беспокоился.             Полечу на ~разведку~. Посмотрю, что есть интересного впереди!",
                "context": {
                    "level": 134
                }
            },
            {
                "id": "r123",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Что-то совёнок ~долго~ не возвращается.",
                "context": {
                    "level": 140
                },
                "showDiary": false
            },
            {
                "id": "r124",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "Смотри, там какие-то ~чудики~. Спросим у них дорогу!",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r125",
                "personImage": "dwarfs",
                "personName": "Гномики",
                "rightSide": true,
                "text": "Привет! Мы ~гномики~, мы знаем эти края очень хорошо. Мы подскажем вам путь.",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r126",
                "personImage": "dwarfs",
                "personName": "Гномики",
                "rightSide": true,
                "text": "Но прежде посмотрите, какую ~шикарную птицу~ мы сегодня поймали! Она будет петь для нас!\n",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r127",
                "personImage": "sova3",
                "personName": "Совёнок",
                "rightSide": true,
                "text": "Друзья, помогите!\n",
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
                "personName": "Эмма",
                "rightSide": false,
                "text": "Но ведь эта птица не умеет петь, это ~совёнок~. А вам нужен ~соловей~!",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r129",
                "personImage": "dwarfs",
                "personName": "Гномики",
                "rightSide": true,
                "text": "Раз птица - значит ~должна петь~. Отдадим вашу птицу только в обмен      на соловья, и точка!\n",
                "context": {
                    "level": 140
                }
            },
            {
                "id": "r130",
                "personImage": "cat2",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "Как же мы теперь поймаем соловья?\n",
                "context": {
                    "level": 140
                },
                "buttonName": "На поиски",
                "buttonImage": "loupe"
            },
            {
                "id": "r131",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Мы нашли вам замену для соловья.     Это ~Магнитофон~!",
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
                "personName": "Гномики",
                "rightSide": true,
                "text": "~Странно~, он не похож на птицу...",
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
                "personName": "Гномики",
                "rightSide": true,
                "text": "Это намного ~лучше птицы~! Ваша птица свободна. А путь ваш лежит к тем горам, что виднеются вдали.",
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
                "personName": "Совёнок",
                "rightSide": true,
                "text": "Спасибо друзья, что выручили. Теперь я не буду далеко улетать от вас!\n",
                "context": {
                    "level": 143
                },
                "buttonName": "В путь!",
                "buttonImage": "actionMap"
            },
            {
                "id": "r135",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": false,
                "text": "И вновь продолжается путь!",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r136",
                "personImage": "sova3",
                "personName": "Совёнок",
                "rightSide": true,
                "text": "И сердцу тревожно в груди!",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r137",
                "personImage": "sveta2",
                "personName": "Эмма",
                "rightSide": false,
                "text": "И снова настала пора ~заряжать сапоги~...\n",
                "context": {
                    "level": 150
                }
            },
            {
                "id": "r138",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Надеюсь, на этот раз заряда хватит до самого конца!",
                "context": {
                    "level": 150
                },
                "buttonName": "За корешками!",
                "buttonImage": "goldRoot"
            },
            {
                "id": "r139",
                "personImage": "sova1",
                "personName": "Совёнок",
                "rightSide": true,
                "text": "Остался последний отрезок пути.         Мы ~почти у цели~.\n",
                "context": {
                    "level": 153
                }
            },
            {
                "id": "r140",
                "personImage": "cat1",
                "personName": "Котёнок",
                "rightSide": true,
                "text": "Что же скажет нам ~хозяйка~, когда мы её встретим?\n",
                "context": {
                    "level": 153
                }
            },
            {
                "id": "r141",
                "personImage": "sveta1",
                "personName": "Эмма",
                "rightSide": false,
                "text": "Скоро узнаем. Вперёд!",
                "context": {
                    "level": 153
                },
                "buttonName": "Вперёд!",
                "buttonImage": "actionMap"
            }
        ]}


