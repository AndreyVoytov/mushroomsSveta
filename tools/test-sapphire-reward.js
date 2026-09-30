// Regression checks for the reused Phaser state and the frame-driven collection.
// Run with: node tools/test-sapphire-reward.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

function Point(x = 0, y = 0) { this.set(x, y); }
Point.prototype.set = function (x, y = x) { this.x = x; this.y = y; return this; };
function Sprite(game) {
    this.game = game;
    this.scale = new Point(1, 1);
    this.anchor = new Point();
    this.position = { set: (x, y) => { this.x = x; this.y = y; } };
    this.width = this.height = 1254;
    this.worldTransform = { tx: 100, ty: 600, a: 0.07, b: 0, c: 0, d: 0.065 };
    this.alpha = 1;
}
Sprite.prototype.updateTransform = function () {};
Sprite.prototype.destroy = function () { this.pendingDestroy = true; };
function Group(game, parent) {
    this.game = game;
    this.children = [];
    if (parent) parent.add(this);
}
Group.prototype.add = function (child) {
    if (child.parent) child.parent.children = child.parent.children.filter(item => item !== child);
    this.children.push(child);
    child.parent = this;
    return child;
};
Group.prototype.destroy = function () {
    this.destroyed = true;
    this.children.forEach(child => child.destroy());
    this.children = [];
};
function State() {}
State.prototype.init = function () {};

const Phaser = { Group, Sprite, Point, Easing: {
    Back: { Out: 'back' }, Sinusoidal: { InOut: 'sine' }, Quadratic: { In: 'in' }, Linear: { None: 'linear' }
} };
function gameFixture() {
    const timers = [];
    const game = { width: 960, height: 1440, time: { elapsedMS: 1000 / 60,
        events: { add: (delay, callback) => { timers.push({ delay, callback }); } } },
        add: { existing: sprite => game.world.add(sprite), tween: () => ({ to: function () { return this; } }) }
    };
    game.world = new Group(game);
    return { game, timers };
}
function load(relativePath, overrides = {}) {
    const filename = path.resolve(__dirname, '..', relativePath);
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 }
    }).outputText;
    const exports = {};
    vm.runInNewContext(output, { exports, Phaser, console,
        require: name => ({ default: overrides[path.basename(name)] || State }) }, { filename });
    return exports.default;
}

const Flight = load('src/view/component/forest/SapphireFlight.ts', {
    SapphireEffects: { sprite: game => new Sprite(game) }
});
for (const count of [1, 12, 180]) {
    const { game } = gameFixture();
    let received = 0;
    const target = new Point(178, 850);
    const panel = { getSapphireStarTarget: out => out.set(target.x, target.y),
        receiveSapphireStar: () => received++ };
    const parent = new Group(game);
    const stars = Array.from({ length: count }, (_, index) => {
        const star = parent.add(new Sprite(game));
        // Include off-screen cells of a scrolled level, plus inherited scaling.
        star.worldTransform.tx = 80 + index % 8 * 100;
        star.worldTransform.ty = count > 12 ? -400 + Math.floor(index / 8) * 100 : 650;
        return star;
    });
    const sourceY = stars[0].worldTransform.ty;
    const flight = new Flight(game, stars, panel);
    assert.strictEqual(flight.sparks.length, 56, 'particle pool is bounded');
    assert.strictEqual(stars[0].scale.x, 0.07, 'reparenting preserves inherited scale');
    assert.strictEqual(stars[0].y, sourceY, 'reparenting preserves camera-relative position');
    for (let frame = 0; frame < 240 && !flight.destroyed; frame++) {
        target.y = 850 - Math.min(frame, 40) * 0.5; // panel is entering while stars fly
        flight.update();
        stars.forEach(star => assert(Number.isFinite(star.x) && Number.isFinite(star.y)));
        if (frame === 35 && count === 1) {
            assert(stars[0].y < sourceY - 20, 'flight lifts into an arc');
        }
    }
    assert.strictEqual(received, count, 'each star increments the counter exactly once');
    assert(flight.destroyed, 'the transient flight layer cleans itself up');
    stars.forEach(star => {
        assert(star.pendingDestroy);
        assert(Math.abs(star.x - target.x) < 0.001 && Math.abs(star.y - target.y) < 0.001,
            'every star lands on the moving reward icon');
    });
}

const ForestScreen = load('src/view/screen/BaseForestScreen.ts', {
    Game: { WHITE_TRANSITION: true },
    ForestUtils: { isCloverReskin: () => false },
    YandexGamesHelper: { stopGameplay: () => {} },
    SpriteUtils: { createSprite: game => new Sprite(game) }
});
const screen = new ForestScreen();
let panels = 0;
screen.getForestType = () => ({});
screen.showWinPanelContents = () => panels++;
for (const count of [8, 5, 0, 180]) {
    const { game, timers } = gameFixture();
    screen.game = game;
    screen.add = game.add;
    screen.init();
    assert.strictEqual(screen.sapphireStarsPrepared, false, 'new level resets the reused state');
    assert.strictEqual(screen.sapphireStars.length, 0);
    const cells = Array.from({ length: count }, (_, index) => ({ X: index % 8, Y: Math.floor(index / 8),
        state: { opened: false, cover: { isDark: () => true, growSapphireStar: () => new Sprite(game) } } }));
    screen.cellsProvider = { getCells: () => cells };
    screen.showWinPanel();
    screen.showWinPanel();
    assert.strictEqual(screen.sapphireStars.length, Math.max(1, count), 'zero-grey level gets a completion star');
    assert.strictEqual(timers.length, 1, 'duplicate win checks do not duplicate rewards');
    assert(timers[0].delay <= 1230, 'reveal duration is bounded on long boards');
    timers[0].callback();
}
assert.strictEqual(panels, 4, 'all four consecutive levels show the reward panel');

const Panel = load('src/view/component/forest/CompleteLevelPanel.ts');
const panel = Object.create(Panel.prototype);
Object.assign(panel, { sapphireTotal: 3, sapphiresReceived: 0, sapphireCountLabel: { scale: new Point(), textWidth: 60 },
    entranceFinished: true, continueButton: {}, cameraOffset: new Point(480, 744), scale: new Point(0.96),
    sapphireStarReward: { x: -237, y: 106 }, sapphireStarIcon: { x: -65 } });
panel.receiveSapphireStar();
assert.strictEqual(panel.sapphireCountLabel.text, '1');
assert.strictEqual(panel.continueButton.inputEnabled, false, 'continue waits for collection');
panel.receiveSapphireStar();
panel.receiveSapphireStar();
assert.strictEqual(panel.sapphireCountLabel.text, '3');
assert.strictEqual(panel.continueButton.inputEnabled, true);
assert.strictEqual(panel.getSapphireStarTarget().x, 480 - 302 * 0.96);
console.log('PASS: consecutive wins, no-grey fallback, duplicate guard, 1/12/180 curved flights, camera/scale, moving target, counter, cleanup, bounded particles.');
