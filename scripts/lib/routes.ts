import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export interface Route {
  slug: string;
  htmlPath: string;
}

export function enumerateRoutes(distDir: string): Route[] {
  const routes: Route[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) walk(full);
      else if (entry === 'index.html') {
        const rel = relative(distDir, full);
        const slug = rel.replace(/[\\/]?index\.html$/, '').split(sep).join('/') || 'home';
        routes.push({ slug, htmlPath: full });
      }
    }
  }
  walk(distDir);
  return routes;
}
