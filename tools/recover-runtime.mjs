import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';

// Resolve the historical HTML patch chain at build time, never in the player.
const root = path.resolve(import.meta.dirname, '..');
let html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
for (let depth = 0; depth < 8; depth++) {
  if (html.includes('function init()')) break;
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  let next;
  let pending;
  const document = {open() {}, close() {}, write(value) { next = value; }, body: {innerHTML: ''}};
  const context = vm.createContext({document, console, Date, fetch(url) {
    const filename = path.basename(new URL(url).pathname);
    pending = fs.readFile(path.join(root, filename), 'utf8');
    return pending.then(text => ({ok: true, text: async () => text}));
  }});
  for (const [, source] of scripts) await vm.runInContext(source, context, {timeout: 2000});
  if (!next) throw new Error(`Patch chain failed at step ${depth}: ${document.body.innerHTML}`);
  html = next;
}
if (!html.includes('function init()')) throw new Error('No game runtime recovered');
html = html.replace(/https:\/\/raw\.githubusercontent\.com\/Quetopia\/Blank-temp\/main\//g, './');
// Include the known module order directly; deployment now pins one coherent version.
const bundle = await fs.readFile(path.join(root, 'signal020-bundle.js'), 'utf8');
const modules = [...bundle.match(/const modules=\[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
modules.push('signal022-presentation.js', 'signal023-performance.js');
const tags = modules.map(file => `<script src="./${file}"></script>`).join('\n');
html = html.replace(/<script>fetch\("\.\/signal020-bundle[\s\S]*?<\/script>/, tags);
html = html.replace(/SIGNAL 020/g, 'SIGNAL 022');
html = html.replace(/<p class="tip">[\s\S]*?<\/p>/, '<p class="tip">Follow the signal through the Fractured Grove. Awaken three anchors and confront the guardian beyond the veil.</p>');
for (const [,source] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(source);
await fs.writeFile(path.join(root, 'recovered.html'), html);
console.log('Recovered and syntax-checked game runtime: recovered.html');
