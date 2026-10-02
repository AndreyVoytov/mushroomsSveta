// Run: node tools/test-animals-generation.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const options = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2015 };

// Load the real configuration, enums and data models without starting Phaser.
function loadData(file) {
    const filename = path.resolve(root, file);
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
        compilerOptions: options
    }).outputText;
    vm.runInNewContext(code, { exports, require: name => {
        if (name.endsWith('/Game')) return { default: {} };
        return loadData(path.resolve(path.dirname(filename), name + '.ts'));
    } });
    return exports;
}
const { ContentType, InteractiveContents, ItemContents } = loadData('src/core/model/enum/ContentType.ts');
const BiomType = loadData('src/core/model/enum/BiomType.ts').default;
const CellType = loadData('src/core/model/enum/CellType.ts').default;
const Environment = loadData('src/core/model/enum/Environment.ts').default;
const Showcase = loadData('src/core/configuration/AnimalsShowcaseConfiguration.ts').default;
const filename = 'src/core/service/provider/CellsProvider.ts';
const source = ts.createSourceFile(filename, fs.readFileSync(path.join(root, filename), 'utf8'), ts.ScriptTarget.Latest, true);
const declaration = source.statements.find(node => ts.isClassDeclaration(node));
const methods = ['generateCells', 'generateTypes', 'generateCellsFromTypes', 'getTreeContent', 'configureHiveGroups'];
const code = ts.transpileModule('class CellsProvider { static MAX_GENERATION_ATTEMPTS_COUNT = 100;\n' +
    declaration.members.filter(node => node.name && methods.includes(node.name.getText(source)))
        .map(node => node.getText(source)).join('\n') + '\n}', { compilerOptions: options }).outputText;

function generate(forest, rejectFirst = false) {
    const context = {
        forest, rejectFirst, ContentType, InteractiveContents, ItemContents, BiomType, CellType, Environment,
        ForestCell: loadData('src/core/model/forest/ForestCell.ts').default,
        TypesInfo: loadData('src/core/model/forest/TypesInfo.ts').default,
        UserService: { getUser: () => ({}) },
        Utils: { randomBoolean: () => true },
        ForestUtils: {
            getBiom: () => BiomType.FOREST,
            getBoosterContentType: () => null,
            isCoverFreeNotBoosterItem: () => false
        },
        console: { log() {}, error() {} },
        result: null
    };
    // A synchronous infinite loop must fail the test rather than hang Node.
    vm.runInNewContext(code + `
        const provider = new CellsProvider();
        provider.forestType = forest;
        provider.mask = forest.mask.split('').map((_, i) => ({ X: i % 7, Y: Math.floor(i / 7), type: CellType.FOREST, leaf: 'leaf1' }));
        provider.getMask = () => provider.mask;
        let attempts = 0;
        const generateTypes = provider.generateTypes;
        provider.generateTypes = function(...args) { attempts++; return generateTypes.apply(this, args); };
        provider.getAdjucentInteractiveCount = () => forest.showcaseAnimals || (rejectFirst && attempts === 1) ? 0 : 1;
        result = { cells: provider.generateCells(), attempts };
    `, context, { timeout: 1000 });
    return context.result;
}

for (let restart = 0; restart < 3; restart++) {
    const forest = Showcase.createForest();
    const { cells, attempts } = generate(forest);
    assert.strictEqual(attempts, 1, 'showcase completes generation without retrying');
    assert.strictEqual(cells.length, 35);
    for (const animal of forest.showcaseAnimals) {
        assert.strictEqual(cells.filter(cell => cell.state.content === animal).length, 1,
            'each showcase animal appears once');
    }
}
const regular = Showcase.createForest();
delete regular.showcaseAnimals;
assert.strictEqual(generate(regular).attempts, 1, 'valid regular board is accepted');
assert.strictEqual(generate(regular, true).attempts, 2, 'regular boards still retry invalid layouts');
console.log('Animal showcase generation: PASS (35 cells, all 12 animals, restarts and regular-board retries)');
