enum ItemContent {
    mushroom  = 1,
    mushroom3,
    mushroom4,
    mushroom5,
    amanita,
    witchMushroom,
    poleno,
    amber,
    lavanda,
    lilly,
    strawberry, blackberry,
    t1, t24, t25, t27,
    goldRoot, wheat,
    randomItem,
    specificItem,
    emerald,
    candy,
    witchMushroom2,
    amanita2,
    yellowLilly,
    apple

}

enum AnimalsContent {
    rabbit              = 50,
    butterfly,
    butterfly2,
    sheep,
    fish,
    crab,
    duck,
    bet,
    owl, 
    owlFlying, 
    bird
}

enum BoostersContent {
    compass             = 100,
    rocket1,
    rocket2,
    rocket3,
    vision
}

enum DecorationsContent {
    wlilly1             = 150,
    wlilly2,
    mirror,
    tree,
    beanLeaf,
    cactus,
    stone,
    log,
    stump
}

enum InteractiveContent {
    hive             = 200,
    acorn,
    bush,
    shell,
    moonflowerClosed,
    book1, 
    lockpick,
    empty,
    bush2,
    chamomileSmall
}

// export const Contents = { ItemContent, AnimalsContent, BoostersContent, DecorationsContent, InteractiveContent};
// export type Contents = typeof Contents;
// export type ContentType = {
//     [K in keyof Contents]: {
//         [K2 in keyof Contents[K]]: Contents[K][K2]
//     }[keyof Contents[K]]
// }[keyof Contents]

export const ContentType = { ...ItemContent, ...AnimalsContent, ...BoostersContent, ...DecorationsContent, ...InteractiveContent};
export type ContentType = ItemContent |  AnimalsContent | BoostersContent | DecorationsContent | InteractiveContent;

export const ItemContents = { ...ItemContent};
export type ItemContents = ItemContent;

export const AnimalsContents = { ...AnimalsContent};
export type AnimalsContents = AnimalsContent;

export const BoostersContents = { ...BoostersContent};
export type BoostersContents = BoostersContent;

export const DecorationsContents = { ...DecorationsContent};
export type DecorationsContents = DecorationsContent;

export const InteractiveContents = { ...InteractiveContent};
export type InteractiveContents = InteractiveContent;

// this.visitContents(c, (c:ItemContents)=>{}, (c:AnimalsContents)=>{}, (c:BoostersContents)=>{}, (c: DecorationsContents)=>{}, (c: InteractiveContents)=>{});





