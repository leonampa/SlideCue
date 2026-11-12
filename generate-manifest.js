// Runs on every Netlify deploy (see netlify.toml): writes pictures/index.json
// listing every JPG/PNG/WEBP under ./pictures (subfolders included).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'pictures');
const EXT = /\.(jpe?g|png|webp)$/i;
const out = [];
(function walk(dir, prefix) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) walk(path.join(dir, e.name), prefix + e.name + '/');
    else if (EXT.test(e.name)) out.push(prefix + e.name);
  }
})(fs.existsSync(root) ? root : (fs.mkdirSync(root, { recursive: true }), root), '');
out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
fs.writeFileSync(path.join(root, 'index.json'), JSON.stringify(out));
console.log('pictures/index.json written with ' + out.length + ' images');
