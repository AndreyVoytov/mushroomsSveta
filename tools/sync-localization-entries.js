'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const rootDir = path.join(__dirname, '..');
const localizationDir = path.join(rootDir, 'assets', 'localization');
const sourceIdMapPath = path.join(rootDir, 'src', 'generated', 'localizationSourceIds.ts');

const manualEntries = {
    'ui.gameTitle': 'Грибы!',
    'ui.ok': 'Ок',
    'ui.skip': 'Пропустить',
    'ui.full': 'Все',
    'ui.levelLower': 'уровень',
    'ui.play': 'ИГРАТЬ',
    'ui.playFor100': 'ИГРАТЬ ЗА 100',
    'ui.fastPlay': 'Пройти быстро',
    'ui.noMovesLeft': 'Ходов не осталось',
    'ui.itemsLeft': 'Осталось собрать:',
    'ui.currency.ok': 'ок',
    'ui.currency.rub': 'руб',
    'ui.settings.title': 'Настройки',
    'ui.settings.sound': 'Звук:',
    'ui.settings.support': 'Поддержка',
    'ui.settings.group': 'Группа',
    'ui.settings.about': 'Об игре',
    'ui.shopTitle': 'Магазин',
    'ui.good': 'Хорошо',
    'ui.goodLower': 'хорошо',
    'ui.back': 'Назад',
    'ui.backUpper': 'НАЗАД',
    'ui.backLower': 'назад',
    'ui.applyLower': 'применить',
    'ui.surrender': 'СДАТЬСЯ',
    'ui.confirmDefeat.withBonus': 'Хотите сдаться? Бонусы ~Волшебного лукошка~ будут потеряны!',
    'ui.confirmDefeat.default': 'Вы действительно хотите сдаться?',
    'ui.confirmPotionUse': "Вы действительно хотите применить зелье '+2 хода'?",
    'ui.dailyGiftTitle': 'Ежедневный подарок',
    'ui.lifeDetails.title': 'Восстановление жизней',
    'ui.noLifes.title': 'Жизни закончились!',
    'ui.invite': 'Пригласить',
    'ui.increase': 'Увеличить',
    'ui.allLevelsComplete.text': 'Поздравляем! Вы прошли все доступные уровни. Вступите в ~группу игры~, чтобы не пропустить продолжение.',
    'ui.allLevelsComplete.title': 'Продолжение следует!',
    'ui.noPlaceForBeans': 'Некуда посадить бобы!',
    'ui.plusTwoMoves': '+2 хода',
    'ui.clearIvyHint': 'Вскройте соседние клетки, чтобы убрать заросли',
    'ui.event.lukoshko.name': 'Волшебное лукошко',
    'ui.event.lukoshko.desc': 'Выигрывайте уровни и \n ~получайте усиления~ на \n старте следующих уровней!',
    'ui.booster.back': 'Назад',
    'ui.booster.use': 'Применить',
    'diary.map1.note.0': 'Борис. Искать \n тут.',
    'diary.map2.note.0': 'Всё время иди \n на север!',
    'diary.map5.note.0': 'Снежная \n гора'
};

const tutorialEntries = {
    'tutorial.level1.openCells': '~Открывайте клеточки~, чтобы собирать грибы',
    'tutorial.level2.animalsGiveMoves': 'Встречи со ~зверями~ прибавляют ходы!',
    'tutorial.level5.freeFromIvy': 'Вскройте соседние клетки, чтобы освободить ячейку     от ~зарослей~!',
    'tutorial.level7.snail': 'Смотрите, ~улитка~! Активируйте её нажатием',
    'tutorial.level9.ladybug': 'Откройте ячейку, чтобы ~коровка~ спустилась',
    'tutorial.level9.ladybugContinue': 'Продолжайте, пока коровка не окажется в ~самом низу~!',
    'tutorial.level15.lilies': 'Кувшинки встречаются только    в ~воде~. Отыщите их!',
    'tutorial.level18.scrollDown': 'Соберите все цели на экране, и он ~прокрутится вниз~.',
    'tutorial.level19.blueberryBush': 'Вскройте соседние с кустом клетки, чтобы собрать ~чернику~',
    'tutorial.level22.lavender': 'Лаванду можно найти лишь в ~гористой местности~',
    'tutorial.level24.rosehip': 'Освободите ячейки от зарослей, чтобы получить ~шиповник~',
    'tutorial.level35.jelly': 'Лопайте желе-грибы, вскрывая соседние клетки. Иначе они ~размножатся~!',
    'tutorial.level38.acorn': 'Лопните желудь,         и из него вырастет ~новая клетка~!',
    'tutorial.level41.rocket': 'Сигнальная ракета ~расчистит линию~, если нажать на неё.',
    'tutorial.level57.honey': 'Трясите ульи,       пока не достанете       ~весь мёд~!',
    'tutorial.level61.dragonfly': 'Стрекоза будет ~ускользать~, пока рядом есть кусты. Загоните её в угол!',
    'tutorial.level83.vision': 'Нажмите на магический шар и ~узрите сокрытое~!',
    'tutorial.level85.fences': '~Заборчики~ мешают убрать заросли          с соседней клетки.      Но мы найдем путь!',
    'tutorial.level93.shell': '~Раковину-жемчужницу~ можно найти в песке или в воде.',
    'tutorial.level97.boats': 'Хотите поймать ~кораблик~?               Загоните его в угол!',
    'tutorial.level116.amber': 'Говорят, в этих песках часто попадается ~янтарь~!',
    'tutorial.level134.berryField': 'Если вам нужны ягоды, поищите их на ~ягодной полянке~!',
    'tutorial.level140.rainbowFlower': 'Споры ~радужного цветка~ вскрывают случайные клетки.'
};

const boosterEntries = {
    'booster.beans.name': 'Волшебные бобы',
    'booster.rainbowPotion.name': 'Флакон радуги',
    'booster.glove.name': 'Волшебная перчатка',
    'booster.beans.desc': 'Заполняют пустые клетки\nростками с цифрой.',
    'booster.rainbowPotion.desc': 'Вскрывает пять случайных клеток\nна поле.',
    'booster.glove.desc': 'Позволяет вскрыть любую клетку\nбез траты хода.',
    'booster.beans.question': 'Вы точно хотите применить бобы?',
    'booster.rainbowPotion.question': 'Вы точно хотите открыть флакон?',
    'booster.glove.question': 'Нажмите на клетку для вскрытия'
};

function normalize(value) {
    return String(value || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]*\n[ \t]*/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
}

function sortObject(input) {
    const sorted = {};
    Object.keys(input)
        .sort((a, b) => a.localeCompare(b, 'en'))
        .forEach(key => {
            sorted[key] = input[key];
        });
    return sorted;
}

function getNodeName(nameNode) {
    if (!nameNode) {
        return null;
    }
    if (nameNode.kind === ts.SyntaxKind.Identifier || nameNode.kind === ts.SyntaxKind.StringLiteral) {
        return nameNode.text;
    }
    return null;
}

function getStringValue(node) {
    if (!node) {
        return null;
    }
    if (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        return node.text;
    }
    return null;
}

function getObjectStringProperty(objectNode, propertyName) {
    for (let i = 0; i < objectNode.properties.length; i++) {
        const property = objectNode.properties[i];
        if (property.kind !== ts.SyntaxKind.PropertyAssignment) {
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
        if (node.kind === ts.SyntaxKind.PropertyDeclaration && getNodeName(node.name) === propertyName && node.initializer && node.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            const elements = node.initializer.elements || [];
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    result.push(element);
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return result;
}

function mergeEntries(target, source) {
    Object.keys(source).forEach(key => {
        if (source[key]) {
            target[key] = source[key];
        }
    });
}

function collectReplicaEntries(filePath) {
    const entries = {};
    const objects = getStaticArrayObjects(filePath, 'allReplicas');
    for (let i = 0; i < objects.length; i++) {
        const objectNode = objects[i];
        const id = getObjectStringProperty(objectNode, 'id');
        if (!id) {
            continue;
        }
        const personName = getObjectStringProperty(objectNode, 'personName');
        const text = getObjectStringProperty(objectNode, 'text');
        const buttonName = getObjectStringProperty(objectNode, 'buttonName');

        if (personName) {
            entries['replica.' + id + '.personName'] = personName;
        }
        if (text) {
            entries['replica.' + id + '.text'] = text;
        }
        if (buttonName) {
            entries['replica.' + id + '.buttonName'] = buttonName;
        }
    }
    return entries;
}

function collectDiaryEntries(filePath) {
    const entries = {};
    const objects = getStaticArrayObjects(filePath, 'allRecipes');
    for (let i = 0; i < objects.length; i++) {
        const objectNode = objects[i];
        const id = getObjectStringProperty(objectNode, 'id');
        if (!id) {
            continue;
        }
        const title = getObjectStringProperty(objectNode, 'title');
        const details = getObjectStringProperty(objectNode, 'details');
        const titleForProgress = getObjectStringProperty(objectNode, 'titleForProgress');

        if (title) {
            entries['diary.' + id + '.title'] = title;
        }
        if (details) {
            entries['diary.' + id + '.details'] = details;
        }
        if (titleForProgress) {
            entries['diary.' + id + '.titleForProgress'] = titleForProgress;
        }
    }
    return entries;
}

function collectBuyEntries(filePath) {
    const entries = {};
    const objects = getStaticArrayObjects(filePath, 'BUYS');
    for (let i = 0; i < objects.length; i++) {
        const objectNode = objects[i];
        const id = getObjectStringProperty(objectNode, 'id');
        const name = getObjectStringProperty(objectNode, 'name');
        if (id && name) {
            entries['buy.' + id + '.name'] = name;
        }
    }
    return entries;
}

function buildSourceIdMap(entrySources) {
    const sourceIdMap = {};
    Object.keys(entrySources)
        .sort((a, b) => a.localeCompare(b, 'en'))
        .forEach(id => {
            const normalizedSource = normalize(entrySources[id]);
            if (!normalizedSource || sourceIdMap[normalizedSource]) {
                return;
            }
            sourceIdMap[normalizedSource] = id;
        });
    return sourceIdMap;
}

function writeSourceIdMap(entrySources) {
    const sourceIdMap = buildSourceIdMap(entrySources);
    const lines = ['const localizationSourceIds: { [source: string]: string } = {'];

    Object.keys(sourceIdMap)
        .sort((a, b) => a.localeCompare(b, 'en'))
        .forEach(source => {
            lines.push('    ' + JSON.stringify(source) + ': ' + JSON.stringify(sourceIdMap[source]) + ',');
        });

    lines.push('};');
    lines.push('');
    lines.push('export default localizationSourceIds;');
    lines.push('');

    fs.mkdirSync(path.dirname(sourceIdMapPath), { recursive: true });
    fs.writeFileSync(sourceIdMapPath, lines.join('\n'), 'utf8');
}

function resolveEntryValue(bundle, englishBundle, key, source) {
    if (!source) {
        return source;
    }
    if (bundle.language === 'ru') {
        return source;
    }

    const currentValue = bundle.entries && bundle.entries[key];
    const englishValue = englishBundle.entries && englishBundle.entries[key];

    if (bundle.language === 'en') {
        return currentValue || source;
    }

    if (currentValue && normalize(currentValue) !== normalize(source)) {
        return currentValue;
    }

    return englishValue || source;
}

function main() {
    const entrySources = {};
    mergeEntries(entrySources, collectReplicaEntries(path.join(rootDir, 'src', 'core', 'configuration', 'ReplicasConfiguration.ts')));
    mergeEntries(entrySources, collectReplicaEntries(path.join(rootDir, 'src', 'core', 'configuration', 'ForestReplicasConfiguration.ts')));
    mergeEntries(entrySources, collectDiaryEntries(path.join(rootDir, 'src', 'core', 'configuration', 'DiaryConfiguration.ts')));
    mergeEntries(entrySources, collectBuyEntries(path.join(rootDir, 'src', 'core', 'service', 'Settings.ts')));
    mergeEntries(entrySources, manualEntries);
    mergeEntries(entrySources, tutorialEntries);
    mergeEntries(entrySources, boosterEntries);

    writeSourceIdMap(entrySources);

    const fileNames = fs.readdirSync(localizationDir).filter(fileName => fileName.endsWith('.json')).sort();
    const bundles = {};
    fileNames.forEach(fileName => {
        const fullPath = path.join(localizationDir, fileName);
        bundles[fileName] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    });

    const englishBundle = bundles['en.json'] || { language: 'en', entries: {} };

    fileNames.forEach(fileName => {
        const fullPath = path.join(localizationDir, fileName);
        const bundle = bundles[fileName];
        const entries = {};

        Object.keys(entrySources).forEach(key => {
            entries[key] = resolveEntryValue(bundle, englishBundle, key, entrySources[key]);
        });

        const output = {
            language: bundle.language,
            entries: sortObject(entries),
            direction: bundle.direction || 'ltr'
        };

        fs.writeFileSync(fullPath, JSON.stringify(output, null, 4) + '\n', 'utf8');
        console.log('updated ' + fileName + ' -> entries=' + Object.keys(output.entries).length);
    });
}

main();

