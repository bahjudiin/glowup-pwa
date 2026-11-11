// Report the real counts the README claims, so the docs can be corrected and
// kept honest by `npm run test:docs`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = readFileSync('data.js', 'utf8');
const marker = 'window.GLOWUP_DATA =';
const data = eval('(' + src.slice(src.indexOf(marker) + marker.length, src.lastIndexOf(';')) + ')');

const photos = readdirSync('art/photo').filter((f) => /\.(jpe?g|png)$/i.test(f));
const photosKb = photos.reduce(
  (n, f) => n + statSync(join('art/photo', f)).size,
  0,
);

let standalone = 0;
try {
  standalone = statSync('dist/glowup-standalone.html').size;
} catch {
  standalone = 0;
}

const md = readdirSync('research_library_md').filter((f) => f.endsWith('.md'));

console.log(JSON.stringify({
  articles: (data.articles || []).length,
  categories: (data.categories || []).length,
  products: (data.products || []).length,
  nutrition: (data.nutrition || []).length,
  meals: (data.meals || []).length,
  guides: (data.guides || []).length,
  photos: photos.length,
  photoKb: Math.round(photosKb / 1024),
  libraryMd: md.length,
  standaloneBytes: standalone,
  standaloneMb: Math.round((standalone / 1024 / 1024) * 100) / 100,
}, null, 2));
