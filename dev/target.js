// Resolve which build the dev/ QA scripts exercise.
// Priority: explicit CLI arg > GLOWUP_TARGET env > the built standalone file
// > the local dev server. Never a hardcoded machine path.
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

const ROOT = path.join(__dirname, '..');
const STANDALONE = path.join(ROOT, 'dist', 'glowup-standalone.html');

function target(arg) {
  const explicit = arg || process.env.GLOWUP_TARGET;
  if (explicit) return explicit;
  if (fs.existsSync(STANDALONE)) return pathToFileURL(STANDALONE).href;
  return 'http://127.0.0.1:' + (process.env.PORT || '8080') + '/index.html';
}

module.exports = { target, STANDALONE, ROOT };
