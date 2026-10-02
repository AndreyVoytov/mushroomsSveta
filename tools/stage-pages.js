// Run after npm run deploy. Stage files in the existing gh-pages worktree.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const target = path.join(root, '.pages-deploy');
if (!fs.existsSync(path.join(target, '.git'))) {
    throw new Error('Create the .pages-deploy gh-pages worktree before staging.');
}

function copy(source, relativePath) {
    const destination = path.join(target, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}

// Webpack emits JS/HTML only. build/assets can contain stale files from an
// earlier manual copy, so always publish tracked resources from the project.
const resources = execFileSync('git', ['ls-files', '-z', '--', 'assets', 'style.css'], {
    cwd: root, encoding: 'utf8'
}).split('\0').filter(Boolean);
for (const file of resources) copy(path.join(root, file), file);
for (const file of ['index.html', 'animals/index.html']) {
    copy(path.join(root, 'build', file), file);
}
for (const file of fs.readdirSync(path.join(root, 'build/js'))) {
    copy(path.join(root, 'build/js', file), 'js/' + file);
}
console.log('Staged current bundle, /animals route and ' + resources.length + ' tracked resources for Pages.');
