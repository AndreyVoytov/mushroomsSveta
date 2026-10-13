const fs = require('fs');
const vm = require('vm');
const dir = process.argv[2];
const context = { window: {} };
for (const name of ['seed.js', 'batch-seed.js']) vm.runInNewContext(fs.readFileSync(`${dir}/${name}`, 'utf8'), context);
const all = context.window.MECHANIC_SEED;
const added = all.filter(x => /^base-b0[78]-/.test(x.id));
if (added.length !== 20) throw new Error(`Expected 20 new records, got ${added.length}`);
if (all.length !== 144) throw new Error(`Expected 144 total records, got ${all.length}`);
for (const item of added) {
  if (!item.title || item.title.trim().split(/\s+/).length > 3) throw new Error(`Invalid title: ${item.title}`);
  if (!item.focus || item.focus.x === 50 && item.focus.y === 50) throw new Error(`Center focus: ${item.id}`);
  for (const image of item.images) if (!fs.existsSync(`${dir}/${image.src}`)) throw new Error(`Missing image: ${image.src}`);
}
console.log(`Seed parsed: ${all.length} total, ${added.length} new; all new titles, focus points, and images are present.`);
