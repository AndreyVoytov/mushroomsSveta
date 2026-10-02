const fs = require('fs');
const path = require('path');

const buildDir = path.resolve(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');
const routeDir = path.join(buildDir, 'animals');

if (!fs.existsSync(indexPath)) {
    throw new Error('Build index.html before creating the /animals route.');
}

const html = fs.readFileSync(indexPath, 'utf8');
if (!/<head>/i.test(html)) {
    throw new Error('Could not find the document head in build/index.html.');
}

fs.mkdirSync(routeDir, { recursive: true });
fs.writeFileSync(path.join(routeDir, 'index.html'), html.replace(/<head>/i, '<head><base href="../">'));
