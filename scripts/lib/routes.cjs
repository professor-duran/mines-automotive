const { readdirSync, statSync } = require('node:fs');
const { join, relative, sep } = require('node:path');

function enumerateRoutes(distDir) {
  const routes = [];
  function walk(dir) {
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

module.exports = { enumerateRoutes };
