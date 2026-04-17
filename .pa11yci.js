const { enumerateRoutes } = require('./scripts/lib/routes.cjs');

const PORT = 4324;
const BASE = `http://localhost:${PORT}/mines-automotive`;

let urls = [];
try {
  const routes = enumerateRoutes('dist');
  urls = routes.map(r => (r.slug === 'home' ? `${BASE}/` : `${BASE}/${r.slug}/`));
} catch {
  urls = [`${BASE}/`];
}

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 30000,
    wait: 500
  },
  urls
};
