/* A read-only snapshot of the game for the independent design roadmap. */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { readStaticConfig, root } = require('./lib/read-static-config');
const read = (file, prop) => readStaticConfig(`src/core/configuration/${file}.ts`, prop);
const entries = JSON.parse(fs.readFileSync(path.join(root, 'assets/localization/ru.json'), 'utf8')).entries;
const localize = value => entries[value] || value || '';
const clean = value => localize(value).replace(/~/g, '').replace(/\s+/g, ' ').trim();
const assets = {};
function scan(dir) {
  for (const item of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const file = `${dir}/${item.name}`;
    if (item.isDirectory()) { if (!/atlases|_to add/.test(file)) scan(file); }
    else if (/\.(png|jpg|webp)$/i.test(file)) {
      const key = path.parse(item.name).name;
      if (!assets[key]) assets[key] = file;
    }
  }
}
scan('assets');
const loading = fs.readFileSync(path.join(root, 'src/view/screen/LoadingScreen.ts'), 'utf8');
const source = ts.createSourceFile('LoadingScreen.ts', loading, ts.ScriptTarget.Latest, true);
function visit(node) {
  if (ts.isCallExpression(node) && /(?:loadImage|\.image)$/.test(node.expression.getText(source)) && node.arguments.length > 1) {
    const [key, file] = node.arguments;
    if (ts.isStringLiteral(key) && ts.isStringLiteral(file) && fs.existsSync(path.join(root, file.text))) assets[key.text] = file.text;
  }
  ts.forEachChild(node, visit);
}
visit(source);
for (const key of ['forestBg', 'forestHouseBg', 'houseBg', 'atticBg', 'fieldsBg', 'darkForestBg']) {
  const optimized = `assets/atlases/screens/${key}.webp`;
  assets[key] = fs.existsSync(path.join(root, optimized)) ? optimized : `assets/screens/${key}.png`;
}
assets.flower = assets.chamomileSmall;
assets.moonflowerClosed = assets.moonflowerClosed1;
assets.bush = assets.blueberryBush || assets.bush;

const names = {
  mushroom: 'Белый гриб', mushroom3: 'Лисичка', mushroom4: 'Шампиньон', mushroom5: 'Опята', witchMushroom: 'Ведьмин гриб',
  lilly: 'Кувшинка', lavanda: 'Лаванда', amanita: 'Мухомор', poleno: 'Полено', t27: 'Тыква', t25: 'Слива',
  t24: 'Острый перец', t1: 'Свёкла', goldRoot: 'Золотой корень', strawberry: 'Клубника', blackberry: 'Ежевика',
  shell: 'Жемчужница', wheat: 'Пшеница', amber: 'Янтарь', homeHex: 'Лесной дом', key: 'Ключ от сундука', milk: 'Молоко',
  diaryHex: 'Дневник', boil: 'Котёл', catHex: 'Кот Борис', unicorn1: 'Единорог', owl: 'Сова', owlPink: 'Розовая сова',
  actionSphere: 'Волшебная сфера', actionBoots: 'Сапоги-скороходы', musicTool1: 'Часть инструмента I',
  musicTool2: 'Часть инструмента II', musicTool3: 'Часть инструмента III', boombox2: 'Бумбокс',
  rabbit: 'Кролик', butterfly: 'Бабочка', butterfly2: 'Полевая бабочка', sheep: 'Барашек', fish: 'Рыба', crab: 'Краб',
  duck: 'Утка', bet: 'Летучая мышь', owlFlying: 'Летящая сова', bird: 'Птица', bush: 'Куст красных ягод', bush2: 'Черничный куст',
  blueberry: 'Черника', chamomileSmall: 'Ромашка', moonflowerClosed: 'Лунный цветок', book1: 'Книга', lockpick: 'Отмычка',
  honey: 'Мёд', jellyMushrooms: 'Желейные грибы', flowers: 'Цветы', cankerberries: 'Шиповник', ladybug: 'Божья коровка',
  dragonfly: 'Стрекоза', acorn: 'Жёлудь', hive: 'Улей', bee: 'Пчела', compass: 'Улитка-компас', vision: 'Сфера зрения',
  rocket1: 'Ракета I', rocket2: 'Ракета II', rocket3: 'Ракета III', boat: 'Кораблик', grass: 'Лесная клетка',
  tree: 'Дерево-подсказка', randomItem: 'Случайные находки', separators: 'Перегородки', scroll: 'Длинное поле',
};
// Prefer the game's own item names whenever the locale contains them.
for (const [key, value] of Object.entries(entries)) {
  const m = key.match(/^item\.([^.]+)\.name$/);
  if (m) names[m[1]] = clean(value);
}
const tokenRows = {
  g: ['Лесная клетка', 'hex', 'tile'], m: ['Горная клетка', 'hexMountain', 'tile'], w: ['Водная клетка', 'hexWater', 'tile'],
  l: ['Плющ I', 'liana', 'mechanic'], i: ['Плющ II', 'liana', 'mechanic'], j: ['Плющ III', 'liana', 'mechanic'],
  t: ['Компас в плюще', 'compass', 'mechanic'], s: ['Улитка-компас', 'compass', 'mechanic'],
  v: ['Сфера зрения', 'vision', 'mechanic'], V: ['Сфера в плюще', 'vision', 'mechanic'],
  r: ['Ракета I', 'rocket1', 'mechanic'], R: ['Ракета I в плюще', 'rocket1', 'mechanic'],
  q: ['Ракета II', 'rocket2', 'mechanic'], Q: ['Ракета II в плюще', 'rocket2', 'mechanic'],
  y: ['Ракета III', 'rocket3', 'mechanic'], Y: ['Ракета III в плюще', 'rocket3', 'mechanic'],
  c: ['Желе', 'jelly', 'mechanic'], C: ['Лёд', 'cold', 'mechanic'], h: ['Улей', 'hive', 'mechanic'],
  k: ['Шиповник I', 'cankerberry', 'mechanic'], K: ['Шиповник II', 'cankerberry', 'mechanic'],
  a: ['Жёлудь', 'acorn', 'mechanic'], f: ['Стрекоза в плюще', 'dragonfly', 'mechanic'],
  p: ['Доски I', 'plank1', 'mechanic'], P: ['Доски II', 'plank2', 'mechanic'], z: ['Доски III', 'plank3', 'mechanic'],
  b: ['Кораблик', 'boat', 'mechanic'], e: ['Пчела', 'bee', 'animal'], n: ['Пчела в горах', 'bee', 'animal'],
  A: ['Горный плющ I', 'liana', 'mechanic'], B: ['Горный плющ II', 'liana', 'mechanic'], D: ['Горный плющ III', 'liana', 'mechanic'],
  E: ['Горные доски I', 'plank1', 'mechanic'], F: ['Горные доски II', 'plank2', 'mechanic'], d: ['Горные доски III', 'plank3', 'mechanic'],
  '1': ['Ягодная поляна', 'hexFlower', 'tile'], '2': ['Песок', 'hexSand', 'tile'],
};
const environments = [
  ['Лес', 'bg', 'forestBg'], ['Тёмный лес', 'bgDark', 'darkForestBg'], ['Дом', 'bgHouse', 'houseBg'],
  ['Цветочные поля', 'bgLight', 'fieldsBg'], ['Озеро', 'bgLake', 'fieldsBg'], ['Джунгли', 'bg', 'forestBg'],
  ['Лес коровок', 'bg', 'forestBg'], ['Лес улиток', 'bg', 'forestBg'],
].map(([name, field, background]) => ({ name, field, background }));
const locationNames = ['Начало истории', 'У лесного дома', 'Дом', 'Дом', 'У котла', 'Тёмный лес', 'Единорог', 'Чердак', 'Цветочные поля', 'Лес', 'У костра', 'Водяная мельница', 'Лагерь'];
const locationBackgrounds = ['forestBg', 'forestHouseBg', 'houseBg', 'houseBg', 'houseBg', 'darkForestBg', 'darkForestBg', 'atticBg', 'fieldsBg', 'forestBg', 'forestBg', 'forestBg', 'forestBg'];
const specialItems = read('SpecialItemsConfiguration', 'allItems');
const replicas = read('ReplicasConfiguration', 'allReplicas');
const fieldReplicas = read('ForestReplicasConfiguration', 'allReplicas');
const recipes = read('DiaryConfiguration', 'allRecipes');
const prizes = read('PrizesConfiguration', 'allPrizes');
const forests = read('ForestConfiguration', 'allForests');
const tutorialSource = fs.readFileSync(path.join(root, 'src/view/component/dialog/EducationPanel.ts'), 'utf8');
function dialogue(r, field = false) {
  return { id: r.id, level: Number(r.context.level) + (field ? 1 : 0), name: clean(r.personName), image: r.personImage,
    text: clean(r.text), field, location: r.location, afterLocation: r.afterLevelLocation };
}
const dialogues = replicas.map(r => dialogue(r)).concat(fieldReplicas.map(r => dialogue(r, true)));
const tutorials = Object.entries(entries).filter(([key]) => /^tutorial\.level\d+\./.test(key)).map(([key, text]) => {
  const pattern = new RegExp("get\\(['\"]" + key.replace(/\./g, '\\.') + "['\"]\\)\\s*,\\s*['\"]([^'\"]+)");
  return { key, level: Number(key.match(/level(\d+)/)[1]), text: clean(text), image: (tutorialSource.match(pattern) || [])[1] || 'sveta1' };
});
for (const key of ['text.nearbyTree.many', 'text.mushroomsLeft']) {
  if (entries[key]) tutorials.push({ key, level: 1, text: clean(entries[key]).replace(/\{count\}/g, 'N').replace(/\{itemWord\}/g, 'грибов'), image: 'sveta1', dynamic: true });
}
const seen = new Set();
function feature(id, name, image, category, possible = false) { return { id, name, image, category, possible }; }
const levels = forests.map((f, index) => {
  const number = index + 1;
  const mask = (f.mask || '').replace(/\s/g, '');
  const features = [];
  const add = (id, name, image, category, possible) => features.push(feature(id, name, image, category, possible));
  for (const token of new Set(mask)) {
    if (tokenRows[token]) add(`tile:${token}`, ...tokenRows[token]);
  }
  for (const item of (f.items || []).concat(f.interactiveItems || [])) {
    if (item.count > 0) add(`item:${item.name}`, names[item.name] || item.name, item.name, 'item');
  }
  if (f.randomItems) add('randomItem', names.randomItem, 'hexChest', 'item');
  if (number === 1) add('tree', names.tree, 'tree', 'mechanic');
  if (number === 18) add('scroll', 'Прокрутка поля', 'leaf1', 'mechanic');
  if (f.separators && f.separators.length) add('separators', names.separators, 'plank1', 'mechanic');
  for (const [property, image, category] of [['flowers','flower','mechanic'], ['cankerberries','cankerberry','mechanic'], ['jellyMushrooms','jelly','mechanic'], ['acorns','acorn','mechanic'], ['honey','honey','mechanic'], ['dragonflies','dragonfly','animal']]) {
    if (property === 'acorns' && mask.includes('a') || property === 'dragonflies' && mask.includes('f') || property === 'cankerberries' && /[kK]/.test(mask)) continue;
    if (f[property] > 0) add(property, names[property] || names[image], image, category);
  }
  if (f.ladybugs && f.ladybugs.length) add('ladybug', names.ladybug, 'ladybug', 'animal');
  if (f.bonuses > 0) {
    const animalKeys = [];
    if (/[glijtsvVrRqQyYchkKafpPze1]/.test(mask)) {
      animalKeys.push(...(f.environment === 1 ? ['owlFlying'] : f.environment === 2 ? ['bet'] : f.environment === 3 ? ['bird', 'butterfly2'] : ['rabbit', 'butterfly']));
      if (number === 64) animalKeys.push('owl');
    }
    if (/[mABDEFdn]/.test(mask)) animalKeys.push('sheep');
    if (mask.includes('2')) animalKeys.push('crab');
    if (/[wCb]/.test(mask) && !(f.ladybugs && f.ladybugs.length) && !mask.includes('a')) animalKeys.push(f.environment === 4 || mask.includes('b') ? 'fish' : 'duck');
    for (const key of new Set(animalKeys)) add(`animal:${key}`, names[key], key, 'animal', true);
  }
  const objects = specialItems.filter(s => +s.level === number).map(s => ({ ...s, name: names[s.image] || s.image }));
  for (const object of objects) add(`story:${object.image}`, object.name, object.image, 'story');
  const environmentImages = ['forestHeader1','forestHeader2','housePic','flowersFieldHeader','lakeHeader','junglesHeader','bugForestHeader','snailForestHeader'];
  add(`environment:${f.environment}`, environments[f.environment].name, f.header || environmentImages[f.environment], 'location');
  const firsts = features.filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); return true; });
  return { ...f, mask, number, firsts, features, objects,
    tutorials: tutorials.filter(t => t.level === number), dialogues: dialogues.filter(d => d.level === number),
    prize: prizes.find(p => +p.level === number) || null };
});

function resolveRecipe(recipe) {
  return recipe.copyOf ? { ...resolveRecipe(recipes.find(r => r.id === recipe.copyOf)), ...recipe } : recipe;
}
// Match the location/pending transition convention in ReplicaDao.
function locationAfter(completed) {
  let current = 9, pending = null, last = 0;
  for (const replica of replicas.filter(d => d.context.level <= completed)) {
    if (pending) current = pending;
    if (replica.location) current = replica.location;
    pending = replica.afterLevelLocation || null;
    last = replica.context.level;
  }
  if (pending && last < completed) current = pending;
  return current;
}
const storyLocations = [];
for (let completed = 1; completed <= levels.length; completed++) {
  const location = locationAfter(completed);
  const last = storyLocations[storyLocations.length - 1];
  if (last && last.location === location) last.end = completed + 1;
  else storyLocations.push({ start: completed, end: completed + 1, location, name: locationNames[location], background: locationBackgrounds[location] });
}
const stages = recipes.map((raw, index) => {
  const r = resolveRecipe(raw);
  const start = r.fromLevel || (replicas.find(d => d.id === r.fromReplica) || {}).context?.level || 1;
  const currentLocation = locationAfter(start);
  let notes = [];
  if (r.mapPreset) {
    const key = r.mapPreset.split('.').pop();
    notes = (read('MapPresetConfiguration', key).notes || []).map(clean);
  }
  const requiredItems = [];
  for (const item of r.requiredItems || []) {
    const existing = requiredItems.find(i => i.name === item.name);
    if (existing) existing.count += item.count;
    else requiredItems.push({ ...item });
  }
  return { id: r.id, index, start, title: clean(r.titleForProgress || r.title), description: clean(r.details), notes,
    image: r.resultImageForProgress || r.resultImage || r.picture || 'diaryHex', requiredItems,
    location: locationNames[currentLocation], background: locationBackgrounds[currentLocation],
    map: !!r.mapPreset };
});
stages.forEach((stage, i) => {
  stage.end = stages[i + 1]?.start || levels.length + 1;
  stage.continuation = i === stages.length - 1;
  const locations = [];
  for (let completed = stage.start; completed < stage.end; completed++) {
    const name = locationNames[locationAfter(completed)];
    if (locations[locations.length - 1] !== name) locations.push(name);
  }
  stage.location = locations.join(' → ');
  stage.dialogues = dialogues.filter(d => d.level >= stage.start && d.level < stage.end);
  const characters = new Map();
  stage.dialogues.forEach(d => { if (d.name && !characters.has(d.name)) characters.set(d.name, { name: d.name, image: d.image }); });
  stage.characters = [...characters.values()];
});
const output = { version: 1, source: 'ForestConfiguration · DiaryConfiguration · ReplicasConfiguration · ru.json',
  levels, stages, storyLocations, environments, names, tokens: Object.fromEntries(Object.entries(tokenRows).map(([token, [name,image,category]]) => [token, {name,image,category}])), assets };
const destination = path.join(root, 'docs/roadmap');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'data.js'), 'window.ROADMAP_DATA = ' + JSON.stringify(output) + ';\n');
console.log(`Roadmap snapshot: ${levels.length} levels, ${stages.length} stages, ${tutorials.length} tutorials, ${seen.size} first appearances.`);
