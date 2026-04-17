import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import waitOn from 'wait-on';
import { enumerateRoutes } from './lib/routes.js';

const PORT = 4323;
const BASE = `http://localhost:${PORT}/mines-automotive`;

async function main() {
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    stdio: 'inherit',
    shell: true
  });

  try {
    await waitOn({ resources: [`${BASE}/`], timeout: 30_000 });

    const routes = enumerateRoutes('dist');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let failed = 0;
    for (const route of routes) {
      const url = route.slug === 'home' ? `${BASE}/` : `${BASE}/${route.slug}/`;
      await page.goto(url, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).analyze();
      const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
      if (critical.length > 0) {
        console.error(`\nFAIL ${url}`);
        for (const v of critical) {
          console.error(`   [${v.impact}] ${v.id}: ${v.description}`);
          v.nodes.forEach(n => console.error(`     ${n.target.join(' ')}`));
        }
        failed++;
      } else {
        console.log(`PASS ${url}`);
      }
    }

    await browser.close();
    if (failed > 0) {
      console.error(`\n${failed} page(s) failed axe check.`);
      process.exit(1);
    }
    console.log(`\nAll ${routes.length} pages passed axe check.`);
  } finally {
    server.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
