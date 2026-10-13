const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {} };
for (const file of ['docs/mechanics/seed.js', 'docs/mechanics/batch-seed.js']) vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
const items = context.window.MECHANIC_SEED;
console.log('COUNT', items.length);
for (const item of items.filter(x => /base-b0[56]/.test(x.id)).slice(-6)) {
  console.log(JSON.stringify({id:item.id,title:item.title,shortDescription:item.shortDescription,description:item.description,tags:item.tags,appearanceLevel:item.appearanceLevel,images:item.images,source:item.source,origin:item.origin}, null, 2));
}
