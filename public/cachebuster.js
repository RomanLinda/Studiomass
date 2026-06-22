const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');
const glob = require('glob');
const express = require('express');

const assetDir = path.join(__dirname, 'public');
const baseUrl = 'http://127.0.0.1:5500/public';

// 🔍 Trova file HTML e asset
const htmlFiles = glob.sync(path.join(assetDir, '**/*.html'));
const assetFiles = glob.sync(path.join(assetDir, '**/*.{css,js}'));

// 🔢 Genera hash da contenuto file
function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

// 🔁 Rinomina file con hash
function renameWithHash(filePath) {
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const dir = path.dirname(filePath);
  const hash = getHash(filePath);
  const newName = `${base}.${hash}${ext}`;
  const newPath = path.join(dir, newName);
  fs.copySync(filePath, newPath);
  fs.removeSync(filePath);
  return { oldName: path.basename(filePath), newName };
}

// 🧼 Mappa dei file rinominati
const renamedMap = new Map();
for (const file of assetFiles) {
  const { oldName, newName } = renameWithHash(file);
  renamedMap.set(oldName, newName);
  console.log(`✅ ${oldName} → ${newName}`);
}

// 📝 Aggiorna tutti gli HTML
for (const htmlPath of htmlFiles) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);

  $('link[href], script[src]').each((_, el) => {
    const attr = el.tagName === 'link' ? 'href' : 'src';
    const file = $(el).attr(attr)?.split('/').pop();
    if (file && renamedMap.has(file)) {
      const newName = renamedMap.get(file);
      $(el).attr(attr, `/${newName}`);
    }
  });

  fs.writeFileSync(htmlPath, $.html(), 'utf8');
  console.log(`🧩 HTML aggiornato: ${path.basename(htmlPath)}`);
}

// 🗺️ Genera sitemap.xml
const today = new Date().toISOString().split('T')[0];
const sitemapPath = path.join(assetDir, 'sitemap.xml');

const sitemapEntries = htmlFiles.map(file => {
  const relativePath = path.relative(assetDir, file).replace(/\\/g, '/');
  const url = `${baseUrl}/${relativePath}`;
  const priority = relativePath === 'index.html' ? '1.0' : '0.5';
  const changefreq = relativePath === 'index.html' ? 'weekly' : 'monthly';

  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapContent.trim(), 'utf8');
console.log('🗺️ Sitemap aggiornata:', sitemapPath);

// 🚀 Avvia server Express
const app = express();
app.use(express.static(assetDir));
app.listen(5500, () => {
  console.log('🌐 Server online: http://127.0.0.1:5500');
});

