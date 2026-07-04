const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');

const viteBin = join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');

if (!existsSync(viteBin)) {
  execFileSync('npm', ['ci'], {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
  });
}
