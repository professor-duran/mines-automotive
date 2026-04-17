import { spawn, execSync } from 'node:child_process';
import waitOn from 'wait-on';

const PORT = 4324;
const URL = `http://localhost:${PORT}/mines-automotive/`;

const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  stdio: 'inherit',
  shell: true
});

try {
  await waitOn({ resources: [URL], timeout: 30000 });
  execSync('npx pa11y-ci', { stdio: 'inherit' });
} finally {
  server.kill();
}
