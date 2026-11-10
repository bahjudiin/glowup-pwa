// Run a Python script with whichever interpreter actually works.
//
// Windows often has a Microsoft Store `python3` stub that reports a version
// but is missing the packages the build needs, so "the first one that
// spawns" is not the right test - the first one that RUNS the script
// successfully is. Override with PYTHON=/path/to/python.
import { spawnSync } from 'node:child_process';

const script = process.argv[2];
if (!script) {
  console.error('usage: node scripts/run-python.mjs <script.py> [args...]');
  process.exit(2);
}
const args = process.argv.slice(3);
const candidates = process.env.PYTHON
  ? [process.env.PYTHON]
  : process.platform === 'win32'
    ? ['python', 'py', 'python3']
    : ['python3', 'python'];

let lastStatus = 1;
let lastError = '';
for (const py of candidates) {
  const res = spawnSync(py, [script, ...args], { stdio: 'inherit' });
  if (res.error) {
    lastError = `${py}: ${res.error.message}`;
    continue;
  }
  if (res.status === 0) process.exit(0);
  // It ran and failed. Try the next interpreter - it may simply be a
  // different install without the required packages.
  lastStatus = res.status ?? 1;
  lastError = `${py} exited ${res.status}`;
}
console.error(`no working python interpreter (tried: ${candidates.join(', ')}) - ${lastError}`);
process.exit(lastStatus);
