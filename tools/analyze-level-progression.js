const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function readStaticArray(relativePath, propertyName) {
    const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
    const file = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    let initializer = null;
    function find(node) {
        if (ts.isPropertyDeclaration(node) && node.name.getText(file).replace(/['"]/g, '') === propertyName) {
            initializer = node.initializer;
        }
        if (!initializer) ts.forEachChild(node, find);
    }
    find(file);
    if (!initializer || !ts.isArrayLiteralExpression(initializer)) throw new Error('Array not found: ' + propertyName);
    function value(node) {
        if (!node) return undefined;
        if (ts.isObjectLiteralExpression(node)) {
            const result = {};
            node.properties.forEach(prop => {
                if (ts.isPropertyAssignment(prop)) result[prop.name.getText(file).replace(/^['"]|['"]$/g, '')] = value(prop.initializer);
            });
            return result;
        }
        if (ts.isArrayLiteralExpression(node)) return node.elements.map(value);
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
        if (ts.isNumericLiteral(node)) return Number(node.text);
        if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
        if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
        if (node.kind === ts.SyntaxKind.NullKeyword) return null;
        if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -Number(node.operand.text);
        return undefined;
    }
    return initializer.elements.map(value);
}

const levels = readStaticArray('src/core/configuration/ForestConfiguration.ts', 'allForests');
const replicas = readStaticArray('src/core/configuration/ReplicasConfiguration.ts', 'allReplicas');
const locations = ['Без отдельной локации','Дом / окрестности','Закрытый сундук','Открытый сундук','Котёл','Тёмный лес','Встреча с единорогом','Чердак','Цветочные поля','Лес','Лесной костёр','Водяная мельница','Лагерь'];
const tokenFeatures = {
    l:'Малая лиана',i:'Лиана',j:'Сильная лиана',t:'Компасс в лиане',s:'Свободный компас',
    v:'Зрение',V:'Зрение в лиане',r:'Ракета I',R:'Ракета I в лиане',q:'Ракета II',Q:'Ракета II в лиане',y:'Ракета III',Y:'Ракета III в лиане',
    c:'Желейный гриб',C:'Лёд',h:'Улей и мёд',k:'Шиповник I',K:'Шиповник II',a:'Жёлуди',f:'Стрекозы',
    p:'Доски I',P:'Доски II',z:'Доски III',b:'Лодки и вода',e:'Пчёлы',n:'Пчёлы на лианах',A:'Лиана на камне',B:'Сильная лиана на камне',D:'Густая лиана на камне',E:'Доска на камне',F:'Две доски на камне',d:'Три доски на камне',
    '1':'Ягодное поле', '2':'Песок'
};
const mechanicSet = new Set();
const itemSet = new Set();
const itemIntroductions = [];
const perLevel = [];
let previousEnvironment = null;
levels.forEach((level, index) => {
    const number = Number(level.id) || index + 1;
    const freshMechanics = [];
    [...new Set(String(level.mask || '').split(''))].forEach(char => {
        if (tokenFeatures[char] && !mechanicSet.has(tokenFeatures[char])) {
            mechanicSet.add(tokenFeatures[char]); freshMechanics.push(tokenFeatures[char]);
        }
    });
    const freshItems = [];
    [...(level.items || []), ...(level.interactiveItems || [])].forEach(item => {
        if (item && item.name && !itemSet.has(item.name)) { itemSet.add(item.name); freshItems.push(item.name); itemIntroductions.push({name:item.name,level:number}); }
    });
    if (level.acorns && !mechanicSet.has('Жёлуди (свойство уровня)')) { mechanicSet.add('Жёлуди (свойство уровня)'); freshMechanics.push('Жёлуди'); }
    if (level.bees && !mechanicSet.has('Пчёлы (свойство уровня)')) { mechanicSet.add('Пчёлы (свойство уровня)'); freshMechanics.push('Пчёлы'); }
    if (level.jellyMushrooms && !mechanicSet.has('Желейные грибы (свойство уровня)')) { mechanicSet.add('Желейные грибы (свойство уровня)'); freshMechanics.push('Желейные грибы'); }
    if (level.honey && !mechanicSet.has('Мёд (свойство уровня)')) { mechanicSet.add('Мёд (свойство уровня)'); freshMechanics.push('Мёд'); }
    perLevel.push({number, env:level.environment, freshMechanics, freshItems, newEnvironment:previousEnvironment !== null && previousEnvironment !== level.environment});
    previousEnvironment = level.environment;
});
const windows = [];
for (let start = 0; start < perLevel.length; start += 10) {
    const entries = perLevel.slice(start, start + 10);
    windows.push({from:entries[0].number, to:entries[entries.length-1].number,
        mechanics:entries.reduce((sum,x)=>sum+x.freshMechanics.length,0),
        items:entries.reduce((sum,x)=>sum+x.freshItems.length,0),
        transitions:entries.filter(x=>x.newEnvironment).length});
}
const locationFirst = new Map();
replicas.forEach(replica => {
    const location = replica.location;
    const level = replica.context && replica.context.level;
    if (location != null && level != null && !locationFirst.has(location)) locationFirst.set(location, level);
});
const storyLocations = [...locationFirst].filter(([id]) => id !== 0).map(([id,level]) => ({id,name:locations[id]||('Локация '+id),level}));
windows.forEach(window => window.locations = storyLocations.filter(x => x.level >= window.from && x.level <= window.to).length);
console.log(JSON.stringify({levelCount:levels.length,lastLevel:perLevel[perLevel.length-1].number,windows, firstItems:itemIntroductions, locationFirst:storyLocations, mechanicIntroductions:perLevel.filter(x=>x.freshMechanics.length).map(x=>({level:x.number,features:x.freshMechanics})), uniqueMechanics:mechanicSet.size},null,2));
