'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const rootDir = path.join(__dirname, '..');
const localizationDir = path.join(rootDir, 'assets', 'localization');

const manualKeys = [
    'ui.gameTitle',
    'ui.ok',
    'ui.skip',
    'ui.full',
    'ui.levelLower',
    'ui.play',
    'ui.playFor100',
    'ui.watchAd',
    'ui.fastPlay',
    'ui.noMovesLeft',
    'ui.itemsLeft',
    'ui.currency.ok',
    'ui.currency.rub',
    'ui.settings.title',
    'ui.settings.sound',
    'ui.settings.support',
    'ui.settings.group',
    'ui.settings.about',
    'ui.settings.aboutText',
    'ui.shopTitle',
    'ui.good',
    'ui.goodLower',
    'ui.back',
    'ui.backUpper',
    'ui.backLower',
    'ui.applyLower',
    'ui.surrender',
    'ui.confirmation',
    'ui.confirmDefeat.withBonus',
    'ui.confirmDefeat.default',
    'ui.confirmPotionUse',
    'ui.dailyGiftTitle',
    'ui.lifeDetails.title',
    'ui.noLifes.title',
    'ui.invite',
    'ui.increase',
    'ui.allLevelsComplete.text',
    'ui.allLevelsComplete.title',
    'ui.noPlaceForBeans',
    'ui.plusTwoMoves',
    'ui.minusOneEnergy',
    'ui.clearIvyHint',
    'ui.event.lukoshko.name',
    'ui.event.lukoshko.desc',
    'ui.booster.back',
    'ui.booster.use',
    'ui.purchaseReceived',
    'ui.serverUnavailable',
    'ui.checkInternetConnection',
    'ui.paymentWillBeCredited',
    'ui.collectRewardCta',
    'ui.tapToExitPreview',
    'ui.rewardedAdUnavailable',
    'ui.energy.title',
    'ui.energy.hint',
    'ui.energy.winTitle',
    'ui.energy.spent',
    'ui.energy.better',
    'ui.energy.overLimit',
    'ui.energy.full',
    'ui.energy.restoreIn',
    'ui.energy.buyPack',
    'ui.energy.reset',
    'ui.tasks.title',
    'ui.tasks.daily',
    'ui.tasks.campaign',
    'ui.tasks.reward',
    'ui.tasks.claim',
    'ui.tasks.rewardReceived',
    'ui.tasks.dailyProgress',
    'ui.tasks.refreshIn',
    'ui.transition.sheWontHelp',
    'ui.transition.thirtyMinutesLater',
    'ui.transition.hourLater'
];

const tutorialKeys = [
    'tutorial.level1.openCells',
    'tutorial.level2.animalsGiveMoves',
    'tutorial.level5.freeFromIvy',
    'tutorial.level7.snail',
    'tutorial.level9.ladybug',
    'tutorial.level9.ladybugContinue',
    'tutorial.level15.lilies',
    'tutorial.level18.scrollDown',
    'tutorial.level19.blueberryBush',
    'tutorial.level22.lavender',
    'tutorial.level24.rosehip',
    'tutorial.level35.jelly',
    'tutorial.level38.acorn',
    'tutorial.level41.rocket',
    'tutorial.level57.honey',
    'tutorial.level61.dragonfly',
    'tutorial.level83.vision',
    'tutorial.level85.fences',
    'tutorial.level93.shell',
    'tutorial.level97.boats',
    'tutorial.level116.amber',
    'tutorial.level134.berryField',
    'tutorial.level140.rainbowFlower'
];

const boosterKeys = [
    'booster.beans.name',
    'booster.rainbowPotion.name',
    'booster.glove.name',
    'booster.beans.desc',
    'booster.rainbowPotion.desc',
    'booster.glove.desc',
    'booster.beans.question',
    'booster.rainbowPotion.question',
    'booster.glove.question'
];

const textKeys = [
    'text.loading',
    'text.tapToContinue',
    'text.level.normal',
    'text.level.hard',
    'text.chooseBoosters',
    'text.currentLimit',
    'text.friendsInGame',
    'text.restoreFor',
    'text.inviteFriendsInfo',
    'text.dailyGift',
    'text.shareInvite',
    'text.supportMessage',
    'text.purchaseReward',
    'text.buySetDescription',
    'text.remainShort.minute',
    'text.remainShort.second',
    'text.remain.dayCompact',
    'text.remain.hourCompact',
    'text.remain.minuteCompact',
    'text.remain.secondCompact',
    'text.aimInfo.find',
    'text.aimInfo.ladybug',
    'text.completeAim.multiple',
    'text.completeAim.ladybug.one',
    'text.completeAim.ladybug.all',
    'text.completeAim.beetle.one',
    'text.completeAim.beetle.all',
    'text.completeAim.items',
    'text.completeAim.daisies',
    'text.completeAim.mushrooms',
    'text.completeAim.chanterelles',
    'text.completeAim.berries',
    'text.completeAim.bees',
    'text.nearbyTree.one',
    'text.nearbyTree.many',
    'text.mushroomsLeft',
    'text.nearbyUsefulCells',
    'text.extraMovesInfo',
    'text.compass.south',
    'text.compass.north',
    'text.compass.west',
    'text.compass.east'
];

const wordPrefixes = [
    'word.friend',
    'word.gem',
    'word.time.day',
    'word.time.hour',
    'word.usefulCell',
    'word.aim.log',
    'word.aim.pumpkin',
    'word.aim.pepper',
    'word.aim.plum',
    'word.aim.mushroom',
    'word.aim.chanterelle',
    'word.aim.daisy',
    'word.aim.bee',
    'word.aim.ladybug',
    'word.aim.beetle',
    'word.aim.book',
    'word.aim.root',
    'word.aim.wheat',
    'word.aim.berry',
    'word.aim.item',
    'word.booster.compass',
    'word.booster.rocket',
    'word.booster.vision',
    'word.booster.beans',
    'word.booster.glove',
    'word.booster.rainbow'
];

function sortObject(input) {
    const sorted = {};
    Object.keys(input).sort((a, b) => a.localeCompare(b, 'en')).forEach(key => {
        sorted[key] = input[key];
    });
    return sorted;
}

function containsCyrillic(value) {
    return typeof value === 'string' && /[?-??-???]/.test(value);
}

function addKeys(target, keys) {
    keys.forEach(key => target.add(key));
}

function getNodeName(nameNode) {
    if (!nameNode) {
        return null;
    }
    if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
        return nameNode.text;
    }
    return null;
}

function getStringValue(node) {
    if (!node) {
        return null;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        return node.text;
    }
    return null;
}

function getObjectStringProperty(objectNode, propertyName) {
    for (let i = 0; i < objectNode.properties.length; i++) {
        const property = objectNode.properties[i];
        if (!ts.isPropertyAssignment(property)) {
            continue;
        }
        if (getNodeName(property.name) !== propertyName) {
            continue;
        }
        return getStringValue(property.initializer);
    }
    return null;
}

function getStaticArrayObjects(filePath, propertyName) {
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    const result = [];

    function visit(node) {
        if (ts.isPropertyDeclaration(node) && getNodeName(node.name) === propertyName && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
            node.initializer.elements.forEach(element => {
                if (ts.isObjectLiteralExpression(element)) {
                    result.push(element);
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return result;
}

function collectReplicaKeys(filePath) {
    const keys = new Set();
    getStaticArrayObjects(filePath, 'allReplicas').forEach(objectNode => {
        ['personName', 'text', 'buttonName'].forEach(propertyName => {
            const value = getObjectStringProperty(objectNode, propertyName);
            if (value) {
                keys.add(value);
            }
        });
    });
    return keys;
}

function collectDiaryKeys(filePath) {
    const keys = new Set();
    getStaticArrayObjects(filePath, 'allRecipes').forEach(objectNode => {
        ['title', 'details', 'titleForProgress'].forEach(propertyName => {
            const value = getObjectStringProperty(objectNode, propertyName);
            if (value) {
                keys.add(value);
            }
        });
    });
    return keys;
}

function collectBuyKeys(filePath) {
    const keys = new Set();
    getStaticArrayObjects(filePath, 'BUYS').forEach(objectNode => {
        const value = getObjectStringProperty(objectNode, 'name');
        if (value) {
            keys.add(value);
        }
    });
    return keys;
}

function collectStringArrayPropertyValues(filePath, propertyName) {
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    const keys = new Set();

    function visit(node) {
        if (ts.isPropertyAssignment(node) && getNodeName(node.name) === propertyName && ts.isArrayLiteralExpression(node.initializer)) {
            node.initializer.elements.forEach(element => {
                const value = getStringValue(element);
                if (value) {
                    keys.add(value);
                }
            });
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return keys;
}

function buildExpectedKeys() {
    const keys = new Set();
    addKeys(keys, manualKeys);
    addKeys(keys, tutorialKeys);
    addKeys(keys, boosterKeys);
    addKeys(keys, textKeys);
    wordPrefixes.forEach(prefix => {
        keys.add(prefix + '.one');
        keys.add(prefix + '.few');
        keys.add(prefix + '.many');
    });

    [
        collectReplicaKeys(path.join(rootDir, 'src', 'core', 'configuration', 'ReplicasConfiguration.ts')),
        collectReplicaKeys(path.join(rootDir, 'src', 'core', 'configuration', 'ForestReplicasConfiguration.ts')),
        collectDiaryKeys(path.join(rootDir, 'src', 'core', 'configuration', 'DiaryConfiguration.ts')),
        collectBuyKeys(path.join(rootDir, 'src', 'core', 'service', 'Settings.ts')),
        collectStringArrayPropertyValues(path.join(rootDir, 'src', 'core', 'configuration', 'MapPresetConfiguration.ts'), 'notes')
    ].forEach(set => {
        set.forEach(key => keys.add(key));
    });

    return keys;
}

function resolveEntryValue(bundle, englishBundle, russianBundle, key) {
    const russianValue = russianBundle.entries && Object.prototype.hasOwnProperty.call(russianBundle.entries, key)
        ? russianBundle.entries[key]
        : null;

    if (bundle.entries && Object.prototype.hasOwnProperty.call(bundle.entries, key)) {
        const value = bundle.entries[key];
        const isStaleRussianFallback = bundle.language !== 'ru'
            && russianValue
            && value === russianValue
            && containsCyrillic(value);

        if (!isStaleRussianFallback) {
            return value;
        }
    }

    if (bundle.language !== 'ru' && englishBundle.entries && Object.prototype.hasOwnProperty.call(englishBundle.entries, key)) {
        return englishBundle.entries[key];
    }

    return russianValue || '';
}

function main() {
    const expectedKeys = Array.from(buildExpectedKeys()).sort((a, b) => a.localeCompare(b, 'en'));
    const fileNames = fs.readdirSync(localizationDir).filter(fileName => fileName.endsWith('.json')).sort();
    const bundles = {};

    fileNames.forEach(fileName => {
        bundles[fileName] = JSON.parse(fs.readFileSync(path.join(localizationDir, fileName), 'utf8'));
    });

    const englishBundle = bundles['en.json'] || { language: 'en', entries: {} };
    const russianBundle = bundles['ru.json'] || { language: 'ru', entries: {} };

    fileNames.forEach(fileName => {
        const fullPath = path.join(localizationDir, fileName);
        const bundle = bundles[fileName];
        const entries = {};

        expectedKeys.forEach(key => {
            entries[key] = resolveEntryValue(bundle, englishBundle, russianBundle, key);
        });

        const output = {
            language: bundle.language || fileName.replace(/\.json$/i, ''),
            entries: sortObject(entries),
            direction: bundle.direction || ((bundle.language || '').toLowerCase() === 'ar' ? 'rtl' : 'ltr')
        };

        fs.writeFileSync(fullPath, JSON.stringify(output, null, 4) + '\n', 'utf8');
        console.log('updated ' + fileName + ' -> entries=' + Object.keys(output.entries).length);
    });
}

main();
