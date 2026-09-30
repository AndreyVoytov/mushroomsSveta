// Run: node tools/test-mushroom-harvest.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

function Point(x = 0, y = x) { this.set(x, y); }
Point.prototype.set = function(x, y = x) { this.x = x; this.y = y; };
function Group(game, parent) {
    this.game = game; this.children = [];
    if (parent) parent.add(this);
}
Group.prototype.add = function(child) {
    if (child.parent) child.parent.children = child.parent.children.filter(c => c !== child);
    this.children.push(child); child.parent = this; return child;
};
Group.prototype.bringToTop = function(child) { this.add(child); };
function sprite(game, x, y, key) {
    const s = new Group(game);
    Object.assign(s, { x, y, key, anchor: new Point(0.5), scale: new Point(1),
        width: key === 'mushroomHole' ? 180 : 32, height: key === 'mushroomHole' ? 80 : 32,
        alpha: 1, visible: true });
    s.position = { set: (x, y) => { s.x = x; s.y = y; } };
    s.addChild = s.add;
    game.world.add(s);
    return s;
}
const code = ts.transpileModule(fs.readFileSync(path.join(__dirname,
    '../src/view/component/forest/MushroomHarvestEffects.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5 }
}).outputText;
const exported = {};
vm.runInNewContext(code, { exports: exported, Phaser: { Group, Easing: {
    Linear: { None: 0 }, Back: { Out: 0 }, Sinusoidal: { In: 0 }
} }, require: name => ({ default: name.endsWith('SpriteUtils') ? { createSprite: sprite }
    : { primeForShow: () => {} } }) });
const Harvest = exported.default;
function fixture() {
    const timers = [], tweens = [];
    const game = { time: { elapsedMS: 16.67, events: { add: (delay, fn) => timers.push({ delay, fn }) } },
        add: { tween: target => ({ to: (props, duration, easing, auto, delay) => {
            const record = { target, props, duration, delay, startAlpha: target.alpha };
            tweens.push(record);
            return { onComplete: { addOnce: fn => { record.complete = fn; } } };
        } }) } };
    game.world = new Group(game);
    function cell(scale = 1) {
        const bg = sprite(game, 200, 300, 'grass'); bg.scale.set(scale);
        const source = sprite(game, 200, 300, 'mushroom'); source.height = 127;
        return { bg, state: { sprite: source } };
    }
    return { game, timers, tweens, cell };
}
assert(Harvest.isMushroom('mushroom'));
assert(Harvest.isMushroom('witchMushroom2'));
assert(!Harvest.isMushroom('lavender'));
assert(!Harvest.isMushroom('tree1'));
{
    const { game, timers, tweens, cell } = fixture();
    const fx = new Harvest(game), c = cell(0.5);
    let lifted = 0;
    fx.reveal(c, 180, () => lifted++);
    fx.reveal(c, 180);
    assert.strictEqual(timers.length, 1, 'one hole per cell');
    assert.strictEqual(timers[0].delay, 180);
    assert.strictEqual(c.mushroomHole.parent, c.bg, 'hole follows board, not moving CellState');
    assert.strictEqual(c.mushroomHole.alpha, 0, 'no hole before pluck');
    assert.strictEqual(fx.children.filter(p => p.visible).length, 0);
    assert(Math.abs(c.mushroomHole.y * c.bg.scale.y - 127 * 0.18) < 0.001,
        'hole sits under the stem rather than below the cell');
    timers.shift().fn();
    assert.strictEqual(lifted, 1);
    assert.strictEqual(fx.children.filter(p => p.visible).length, 8);
    assert.strictEqual(tweens[1].props.x * 180 * c.bg.scale.x, 72);
    assert.strictEqual(tweens[1].props.y * 80 * c.bg.scale.y, 64);
    assert.strictEqual(tweens.length, 2, 'fade must not capture alpha before reveal completes');
    c.mushroomHole.alpha = 1;
    tweens[0].complete();
    assert.strictEqual(tweens[2].startAlpha, 1, 'fade starts at visible alpha');
    assert.strictEqual(tweens[2].props.alpha, 0, 'hole fades back into the ground');
    assert(tweens[2].duration >= 2000, 'hole has a visibly gradual fade');
    for (let i = 0; i < 20; i++) fx.reveal(cell(), 0);
    timers.splice(0).forEach(timer => timer.fn());
    assert.strictEqual(fx.children.length, 48, 'rapid collection never expands pool');
    assert.strictEqual(fx.children.filter(p => p.visible).length, 48);
    for (let frame = 0; frame < 60; frame++) {
        fx.update();
        fx.children.forEach(p => {
            assert(Number.isFinite(p.x) && Number.isFinite(p.y));
            assert(p.alpha >= 0 && p.alpha <= 1);
        });
    }
    assert.strictEqual(fx.exists, false, 'no idle update work');
    assert.strictEqual(fx.children.filter(p => p.visible).length, 0);
    fx.reveal(cell(), 0); timers.shift().fn();
    assert.strictEqual(fx.children.filter(p => p.visible).length, 8, 'pool reusable');
    game.time.elapsedMS = 5000; fx.update();
    assert(fx.particles.every(p => !p.sprite.visible || p.age <= 50), 'long frame does not skip animation');
}
{
    const { game, timers, cell } = fixture();
    const fx = new Harvest(game), c = cell();
    fx.reveal(c, 180);
    c.mushroomHole.parent = null;
    timers.shift().fn();
    assert.strictEqual(fx.exists, false, 'respawn cancels pending burst');
    fx.reveal(cell(), 180); fx.parent = null;
    timers.shift().fn();
    assert.strictEqual(fx.exists, false, 'scene teardown cancels pending burst');
}
console.log('Mushroom harvest: quick fade, raised anchoring, scaled tile, pooling, reuse and teardown passed.');
