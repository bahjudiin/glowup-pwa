// Build a local USDA FoodData Central lookup table from the values already
// shipped in data.js, so extract.py no longer depends on an external
// /home/user/tools/lookup.py that is not part of this repository.
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const s = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const data = JSON.parse(s.replace(/^[\s\S]*?window\.GLOWUP_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const out = {};
for (const n of data.nutrition || []) {
  out[n.name] = {
    fdcId: n.fdcId,
    kcal: n.kcal,
    protein: n.protein ?? null,
    fibre: n.fibre ?? null,
    water: n.water ?? null,
  };
}
fs.writeFileSync(
  path.join(root, 'usda_foods.json'),
  JSON.stringify(
    {
      _comment:
        'USDA FoodData Central SR Legacy values per 100 g, keyed by food name. ' +
        'Generated from data.js; used as the offline fallback for extract.py ' +
        'when the external lookup tool is unavailable. Regenerate with: ' +
        'node scripts/build-usda-cache.cjs',
      foods: out,
    },
    null,
    1
  ) + '\n'
);
console.log('wrote usda_foods.json with', Object.keys(out).length, 'foods');
