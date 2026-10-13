// Publish this tool independently: never copy or rebuild the game bundle.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const worktree = path.join(root, '.pages-deploy');
if (!fs.existsSync(path.join(worktree, '.git'))) throw new Error('The .pages-deploy worktree is missing.');
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: worktree, encoding: 'utf8' }).trim();
if (branch !== 'gh-pages') throw new Error('Expected gh-pages worktree, got ' + branch);
const destination = path.join(worktree, 'roadmap');
fs.mkdirSync(destination, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'preview.js', 'data.js', 'README.md']) {
  fs.copyFileSync(path.join(root, 'docs/roadmap', file), path.join(destination, file));
}
const reports = path.join(worktree, 'reports/index.html');
if (fs.existsSync(reports)) {
  let html = fs.readFileSync(reports, 'utf8');
  if (!html.includes('../roadmap/')) html = html.replace('<ul>', '<ul>\n<li><a href="../roadmap/">Атлас игры: маршрут уровней, локаций и истории</a></li>');
  fs.writeFileSync(reports, html);
}
console.log('Staged /roadmap/ and its link in /reports/.');
