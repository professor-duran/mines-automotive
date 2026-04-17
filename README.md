# Mines Automotive Engineering Program, mockup site

Preview site for the Colorado School of Mines Automotive Engineering Program. This repo is a mockup intended to hand off to Mines Communications and Marketing for eventual deployment on mines.edu via WordPress + Divi.

**Preview URL:** https://professor-duran.github.io/mines-automotive/ (not indexed)
**Final destination:** mines.edu (managed by Mines Communications and Marketing)
**Design spec:** [`docs/superpowers/specs/2026-04-15-mines-automotive-site-design.md`](docs/superpowers/specs/2026-04-15-mines-automotive-site-design.md)
**Implementation plan:** [`docs/superpowers/plans/2026-04-15-mines-automotive-site.md`](docs/superpowers/plans/2026-04-15-mines-automotive-site.md)

## Quick start

```bash
eval "$(fnm env)"        # Windows / fnm users
npm install
npm run dev              # http://localhost:4321/mines-automotive/
```

## Scripts

- `npm run dev`, local dev server
- `npm run build`, production build to `dist/`
- `npm run preview`, serve the production build locally
- `npm run export`, produce content export artifacts in `exports/`
- `npm run export:bundle`, zipped handoff bundle
- `npm run test:a11y`, axe + pa11y + Lighthouse

## Why there's a sitemap if the site is noindex

The `sitemap-index.xml` is generated as a reference artifact for Mines Communications and Marketing during handoff. Search engines cannot see it because `robots.txt Disallow: /` blocks the whole preview URL.

## License

Code and config: MIT. Content: All rights reserved pending Mines Communications approval.
