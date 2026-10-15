// Package the current game branch and its companion pages.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, '.pages-dist');
if (path.dirname(output) !== root || path.basename(output) !== '.pages-dist') {
    throw new Error('Pages output must stay inside the project.');
}
for (const file of ['build/index.html', 'build/animals/index.html', 'build/js/bundle.js']) {
    if (!fs.existsSync(path.join(root, file))) throw new Error('Missing ' + file + '; run npm run pages:build.');
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
let bytes = 0;
let files = 0;
function copy(source, relative) {
    const destination = path.resolve(output, relative);
    if (!destination.startsWith(output + path.sep)) throw new Error('Invalid publish path: ' + relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
    bytes += fs.statSync(source).size;
    files++;
}
function copyTree(source, relative) {
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
        if (entry.isDirectory()) copyTree(path.join(source, entry.name), path.join(relative, entry.name));
        else if (entry.isFile()) copy(path.join(source, entry.name), path.join(relative, entry.name));
    }
}
const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
for (const file of tracked) {
    if (file.startsWith('assets/') && !/\.psd$/i.test(file) && !file.startsWith('assets/_atlasesOriginal/')) {
        copy(path.join(root, file), file);
    }
    if (file.startsWith('docs/')) copy(path.join(root, file), file.slice(5));
    if (file.startsWith('public/')) copy(path.join(root, file), file.slice(7));
}
copy(path.join(root, 'style.css'), 'style.css');
copy(path.join(root, 'build/index.html'), 'index.html');
copy(path.join(root, 'build/animals/index.html'), 'animals/index.html');
copyTree(path.join(root, 'build/js'), 'js');
fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'deployment.json'), JSON.stringify({
    branch: execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim(),
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    journeyLevels: 25
}, null, 2) + '\n');
console.log('Prepared Pages: ' + files + ' files, ' + Math.round(bytes / 1024 / 1024) + ' MiB in .pages-dist.');
