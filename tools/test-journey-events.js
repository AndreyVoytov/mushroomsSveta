// Run with: node tools/test-journey-events.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = {};
const mocks = {};
function load(file) {
    const filename = path.resolve(root, file);
    if (cache[filename]) return cache[filename];
    const exports = cache[filename] = {};
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2015 }
    }).outputText;
    vm.runInNewContext(output, { exports, console, Date, require: name => {
        if (mocks[path.basename(name)]) return { default: mocks[path.basename(name)] };
        return load(path.resolve(path.dirname(filename), name + '.ts'));
    } }, { filename });
    return exports;
}
const configs = load('src/core/configuration/EventsConfiguration.ts').default;
const stories = load('src/core/configuration/JourneyReplicasConfiguration.ts').default.all;
const russianEntries = JSON.parse(fs.readFileSync(path.join(root, 'assets/localization/ru.json'), 'utf8')).entries;
const { ContentType, ItemContents, InteractiveContents } = load('src/core/model/enum/ContentType.ts');
const CellType = load('src/core/model/enum/CellType.ts').default;
const BiomType = load('src/core/model/enum/BiomType.ts').default;
const Environment = load('src/core/model/enum/Environment.ts').default;
function extractClass(relativePath, className, methods, context) {
    const filename = path.join(root, relativePath);
    const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const cls = source.statements.find(node => ts.isClassDeclaration(node));
    const code = 'class ' + className + ' {\n' + cls.members.filter(node => node.name && methods.includes(node.name.getText(source))).map(node => node.getText(source)).join('\n') + '\n}\nresult = ' + className + ';';
    vm.runInNewContext(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2015 } }).outputText, context);
    return context.result;
}
const context = { CellType, BiomType, ContentType, ItemContents, InteractiveContents, Environment,
    Utils: { enumValues: object => Object.keys(object).filter(key => /^\d+$/.test(key)).map(Number) },
    BoosterType: load('src/core/model/enum/BoosterType.ts').default, NeverError: Error, result: null };
const ForestUtils = extractClass('src/core/utils/ForestUtils.ts', 'ForestUtils', ['getChar', 'getCellType', 'getBiom', 'getBioms', 'getCoverFreeNotBoosterItem', 'isCoverFreeNotBoosterItem', 'getBoosterContentType', 'getBoosterInfo', 'isCloverReskin'], context);
ForestUtils.AVG_BERRIES_ON_BUSH = 4;
const levelsById = {};
let total = 0;
for (const config of configs.allEvents.filter(config => config.routeNames)) {
    const levels = levelsById[config.eventId] = load('src/core/configuration/ForestEvent' + config.eventId.slice(5) + 'Configuration.ts').default.allForests;
    assert.strictEqual(levels.length, 25);
    assert.strictEqual(config.levelsCount, 25);
    const signatures = levels.map(level => JSON.stringify([level.mask, level.items, level.interactiveItems, level.jellyMushrooms, level.flowers]));
    assert.strictEqual(new Set(signatures).size, 25, 'distinct gameplay fields in ' + config.eventId);
    assert.deepStrictEqual(Array.from(levels, level => level.name), Array.from(config.routeNames));
    for (const name of config.routeNames) assert(russianEntries[name], 'visible stop name ' + name);
    for (const asset of configs.getAssetsById(config.eventId).concat(configs.getAllMainImageAssetsById(config.eventId))) {
        assert(fs.existsSync(path.join(root, asset.path)), 'missing event asset ' + asset.path);
    }
    const ids = new Set();
    const story = stories[config.eventId];
    assert(story.complete.some(line => line.id === config.finalReplicaId), 'final asset sentinel exists');
    assert(story.expired.some(line => line.id === config.expiredReplicaId), 'expiration asset sentinel exists');
    for (const [stage, lines] of Object.entries(story)) {
        for (const line of lines) {
            assert(russianEntries[line.text] && russianEntries[line.personName], 'visible dialogue ' + line.id);
            assert(!ids.has(line.id), 'duplicate replica ' + line.id);
            ids.add(line.id);
            if (stage === 'forest') {
                const match = line.id.match(/_level_(?:start|end)_(\d+)(?:_|$)/);
                assert(match && Number(match[1]) <= levels.length, 'unreachable replica ' + line.id);
            }
        }
    }
    assert.strictEqual(story.complete.flatMap(line => line.rewards || []).length, 1, 'one final reward per event');
    for (const level of levels) {
        total++;
        assert(level.steps > 0 && level.mask.length % 7 === 0, level.id + ': seven-column map');
        const capacity = {};
        for (const char of level.mask) {
            assert.notStrictEqual(ForestUtils.getCellType(char), undefined, 'unknown cell: ' + char);
            if (char === '0') continue;
            const cellType = ForestUtils.getCellType(char);
            if (ForestUtils.getBoosterContentType(cellType) || ForestUtils.isCoverFreeNotBoosterItem(cellType)) continue;
            const biom = ForestUtils.getBiom(cellType);
            capacity[biom] = (capacity[biom] || 0) + 1;
        }
        for (const item of level.items.concat(level.interactiveItems || [])) {
            assert(ContentType[item.name] != null, 'unknown target ' + item.name);
            const bioms = ForestUtils.getBioms(ContentType[item.name]);
            let count = item.count;
            for (const biom of bioms) {
                const used = Math.min(count, capacity[biom] || 0);
                capacity[biom] = (capacity[biom] || 0) - used;
                count -= used;
            }
            assert.strictEqual(count, 0, level.id + ': not enough suitable cells for ' + item.name);
        }
        assert(Object.values(capacity).reduce((a, b) => a + b, 0) >= level.bonuses, level.id + ': room for bonus animals');
        if (level.jellyMushrooms) assert.strictEqual(level.mask.split('c').length - 1, level.jellyMushrooms, 'jelly goal matches cells');
    }
}
// Run the actual placement methods against the actual masks, including biome restrictions.
const generationContext = { ContentType, ItemContents, InteractiveContents, BiomType, CellType, Environment, ForestUtils,
    Utils: { random: count => Math.floor(Math.random() * count), randomBoolean: () => Math.random() > 0.5 },
    TypesInfo: load('src/core/model/forest/TypesInfo.ts').default,
    SpecialItemsConfiguration: { allItems: [] },
    UserService: { getUser: () => ({}) }, console: { log() {}, error: message => { throw new Error(message); } }, result: null };
const Provider = extractClass('src/core/service/provider/CellsProvider.ts', 'CellsProvider', ['generateTypes', 'getEmptyCell'], generationContext);
for (const levels of Object.values(levelsById)) for (const level of levels) for (let repeat = 0; repeat < 5; repeat++) {
    const provider = new Provider();
    provider.forestType = level;
    provider.mask = Array.from(level.mask, (char, index) => ({ X: index % 7, Y: Math.floor(index / 7), type: ForestUtils.getCellType(char) })).filter(cell => cell.type !== CellType.EMPTY);
    provider.getMask = () => provider.mask;
    const generated = provider.generateTypes(provider.mask.length, 0, level);
    assert(!provider.message, level.id + ': failed placement');
    for (const item of level.items.concat(level.interactiveItems || [])) {
        assert.strictEqual(generated.types.filter(type => type.type === ContentType[item.name]).length, item.count, level.id + ': target count ' + item.name);
    }
}
// Exercise real activation, progress, save/reload, expiration and final-dialog selection.
let user;
mocks.UserService = { getUser: () => user };
mocks.ForestDao = { getAllEventForestsById: id => levelsById[id] || Array(15).fill({}), getEventForestByIdAndIndex: (id, i) => levelsById[id][i] };
mocks.ReplicaDao = { getEntity: () => ({ getReplica: () => null, getAll: () => [] }) };
mocks.PrizesConfiguration = { allPrizes: [] };
mocks.Settings = {};
mocks.LocalizationService = { get: key => key };
mocks.GameText = {};
const Events = load('src/core/utils/EventUtils.ts').default;
const Replicas = load('src/core/configuration/EventReplicasConfiguration.ts').default;
const State = load('src/core/model/event/UserEventState.ts').default;
function fixture() {
    const events = [], states = [], completed = [];
    return { getCurrentForest: () => 50, getEvents: () => events, getEventState: id => states.find(state => state.eventId === id),
        getOrCreateEventState(id) { let state = this.getEventState(id); if (!state) { state = new State(); state.eventId = id; states.push(state); } return state; },
        saveEventStates() {}, addEvent: event => events.push(event), deleteEvent: event => events.splice(events.indexOf(event), 1),
        getCompletedReplicas: () => completed, getMarkers: () => ['firstLukoshko'], getEventStates: () => states };
}
user = fixture();
assert(!Events.shouldPreloadConfiguredEventAssetsBeforeActivation(user, 'event2'), 'no preload before prerequisite');
assert(!Array.from(Events.updateEvents()).includes('event2'), 'no river before bee event ends');
Events.expireConfiguredEvent('event1');
assert(Array.from(Events.updateEvents()).includes('event2'), 'expiration unlocks next journey');
assert(!user.getEvents().some(event => event.eventId === 'event3'), 'journeys activate one at a time');
for (const eventId of ['event2', 'event3', 'event4', 'event5']) {
    Events.updateEvents();
    for (let index = 0; index < 25; index++) {
        assert(Events.startEventLevel(eventId));
        assert.strictEqual(Events.getActiveEventForestType().id, levelsById[eventId][index].id);
        let replica;
        while ((replica = Replicas.getForestReplica(user))) user.getCompletedReplicas().push(replica.id);
        Events.activateLevelEndReplica();
        while ((replica = Replicas.getForestReplica(user))) user.getCompletedReplicas().push(replica.id);
        Events.completeActiveEventLevel();
        assert.strictEqual(user.getEventState(eventId).progress, index + 1);
        if (index < 24) assert(!user.getEventState(eventId).completedAt, 'completion only after level 25');
        if (index === 0) {
            // Saved state is plain JSON; rehydration must preserve the next level.
            const states = user.getEventStates();
            states.splice(0, states.length, ...JSON.parse(JSON.stringify(states)).map(state => new State(state)));
        }
        while ((replica = Replicas.getHouseReplica(user))) user.getCompletedReplicas().push(replica.id);
    }
    assert(user.getEventState(eventId).completedAt);
    assert(!Events.startEventLevel(eventId), 'finished event cannot be replayed accidentally');
    assert(!Replicas.getHouseReplica(user), 'final reward dialogue is consumed once');
}
const mushroomLines = stories.event3.forest.filter(line => line.personImage === 'talkingMushroom');
assert.strictEqual(total, 100);
assert.strictEqual(new Set(mushroomLines.map(line => line.personTint)).size, 5, 'five different mushroom colors');
assert(mushroomLines.every(line => !line.secondPersonImage), 'one giant mushroom visible at a time');
const seenChapters = new Map();
for (const line of mushroomLines) {
    const chapter = Math.floor((Number(line.id.match(/_start_(\d+)/)[1]) - 1) / 5);
    if (seenChapters.has(chapter)) assert.strictEqual(line.personTint, seenChapters.get(chapter), 'one mushroom per five-level chapter');
    seenChapters.set(chapter, line.personTint);
}
assert.strictEqual(seenChapters.size, 5);
const slimeLevels = stories.event4.forest.filter(line => line.personImage === 'slimeKeeper').map(line => Number(line.id.match(/_start_(\d+)/)[1]));
assert(slimeLevels.every(level => level >= 24), 'slime appears at the end');
const layoutContext = { Phaser: { Point: function(x, y) { this.x = x; this.y = y; } }, result: null };
const Panel = extractClass('src/view/component/house/SideEventPanel.ts', 'SideEventPanel', ['createJourneyPointPositions'], layoutContext);
const points = new Panel().createJourneyPointPositions(25);
assert.strictEqual(new Set(points.map(point => point.x + ':' + point.y)).size, 25);
assert(points.every(point => Math.abs(point.x) + 20 < 305 && point.y - 20 >= 130 && point.y + 20 < 358), 'all stops fit between title and counter');
user = fixture();
Events.finishConfiguredEventForAdmin('event4');
assert(Array.from(Events.getConfiguredEventIdsWithOptionalAssets()).includes('event4'), 'reload preloads unfinished final dialogue');
let finalLine;
while ((finalLine = Replicas.getHouseReplica(user))) user.getCompletedReplicas().push(finalLine.id);
assert(!Array.from(Events.getConfiguredEventIdsWithOptionalAssets()).includes('event4'), 'completed dialogue no longer needs optional assets');
user = fixture();
Events.expireConfiguredEvent('event2');
assert(Array.from(Events.getConfiguredEventIdsWithOptionalAssets()).includes('event2'), 'reload preloads expiration portrait');
console.log('Journey events: PASS (100 distinct levels, 25-stop maps, story pacing, placement, save/reload and completion at level 25)');
