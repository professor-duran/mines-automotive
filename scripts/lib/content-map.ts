import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Route } from './routes.js';

// Minimal skeleton. Populated in Task 7.3.
export function writeContentMap(outDir: string, routes: Route[]): void {
  const lines = ['# Content map', '', `${routes.length} routes found.`, ''];
  writeFileSync(join(outDir, 'content-map.md'), lines.join('\n'));
}
