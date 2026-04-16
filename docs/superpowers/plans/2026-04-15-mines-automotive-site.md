# Mines Automotive Engineering Program Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Mines-brand-compliant, accessible, content-rich mockup site for the Colorado School of Mines Automotive Engineering Program, plus a content export pipeline that hands off cleanly to Mines Communications and Marketing for a WordPress/Divi production build.

**Architecture:** Static-first Astro 6 site using content collections (markdown + frontmatter) and TypeScript data files. Tailwind CSS v4 with Mines brand tokens as CSS custom properties. Zero JS on most pages. Accessibility enforced by axe-core, pa11y, and Lighthouse in GitHub Actions CI. Deployed to GitHub Pages under a preview URL with `robots.txt Disallow: /` and `noindex, nofollow` meta. A node script walks every rendered route and emits per-page markdown and semantic HTML artifacts plus a zipped handoff bundle.

**Tech Stack:** Astro 6, Tailwind CSS v4, @tailwindcss/typography, @astrojs/sitemap, astro-icon (Lucide), TypeScript strict, Node 22+, unified/remark/jsdom (export script), axe-core, pa11y, Lighthouse CI, lychee (link checker), Playwright (visual regression).

**Spec:** `docs/superpowers/specs/2026-04-15-mines-automotive-site-design.md`

**Working directory:** `C:\Users\aduran\Downloads\mines-automotive`

**Execution environment notes:**
- Windows, bash shell (Unix syntax, not PowerShell)
- `fnm` for node; run `eval "$(fnm env)"` once per shell session before npm commands
- Git commits without `Co-Authored-By` lines (Adam's preference)
- No em-dashes in any content or commit message (Adam's preference)
- No emojis unless explicitly requested

**Blockers to resolve before starting execution:**

Spec Section 14 lists 6 decisions. Items 1 (license), 3 (partner list scope), 4 (news posts), 5 (footer links), and 6 (MEGN 300 name) have working defaults baked into this plan that can be adjusted mid-flight. Item 2 (photography) is the one hard prerequisite:

- **Photography.** Task 0.7 below copies the 5 existing automotive images from Adam's personal site repo into this repo as committed assets. If `C:\Users\aduran\Downloads\professor-duran.github.io\public\images\` is not available on the execution machine, Adam must drop the 5 images into `C:\Users\aduran\Downloads\mines-automotive\public\images\` manually before Task 0.7 runs. Faculty headshots (`public/images/faculty/adam-duran.jpg`, `public/images/faculty/polina-brodsky.jpg`) need to be dropped in before Task 5.2 or the faculty page will show broken images.
- **MEGN 300 course name.** Task 2.3 Step 2 leaves MEGN 300's name as "TBD." Adam's answer goes directly into `src/content/courses/megn-300.md` frontmatter. If not supplied, the course page renders with a placeholder name.

---

## Plan structure & milestones

Ten phases. Four milestones where the software is working and demoable.

| Phase | Produces | Milestone |
|---|---|---|
| 0 | Scaffolded Astro repo, Tailwind + brand tokens, BaseLayout | — |
| 1 | Nav, Footer, PageHeader, CTASection, 404 page | — |
| 2 | Content collection schemas + seed content | — |
| 3 | Homepage with Hero, StatStrip, PillarGrid, FeaturedTeams, NewsCard | ✅ M1: Working homepage |
| 4 | About, Curriculum, Teams index, Partners, Contact | — |
| 5 | Courses catalog, Faculty, Research, Students, News index | — |
| 6 | Dynamic detail pages: /teams/[slug], /courses/[slug], /news/[slug] | ✅ M2: Full site |
| 7 | Content export pipeline (md + html + bundle) | ✅ M3: Handoff ready |
| 8 | Accessibility CI, link checker, visual regression | — |
| 9 | GitHub Actions deploy, preview banner, sitemap, final audit | ✅ M4: Production-ready mockup |

Stop at any milestone for a review session with Adam before continuing.

---

# Phase 0: Project scaffolding

Creates the repo, installs Astro + Tailwind, sets up the brand token layer, establishes BaseLayout and head metadata. At the end of this phase, `npm run dev` serves a minimal "Hello, Mines Automotive" page with correct fonts and colors.

## Task 0.1: Initialize repo structure

**Files:**
- Create: `C:\Users\aduran\Downloads\mines-automotive\.gitignore`
- Create: `C:\Users\aduran\Downloads\mines-automotive\README.md`
- Create: `C:\Users\aduran\Downloads\mines-automotive\CLAUDE.md`

- [ ] **Step 1: Create directory and init git**

```bash
cd C:/Users/aduran/Downloads/mines-automotive
git init -b main
mkdir -p public/images/faculty
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules/
dist/
.DS_Store
.env
.env.local
.astro/
exports/
*.log
.lighthouseci/
.pa11yci/
test-results/
playwright-report/
```

- [ ] **Step 3: Write `README.md`**

```markdown
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

## License

Code and config: MIT. Content: All rights reserved pending Mines Communications approval.
```

- [ ] **Step 4: Write `CLAUDE.md`** with project-specific instructions

```markdown
# CLAUDE.md, mines-automotive project notes

## Context

This is the mockup site for the Mines Automotive Engineering Program. The spec is at `docs/superpowers/specs/2026-04-15-mines-automotive-site-design.md`. Read it before making content or architectural decisions.

## Hard rules

- Follow Mines brand guidelines strictly. Colors, fonts, logo rules per `https://brand.mines.edu/`.
- No em-dashes in content or commits. Use commas, colons, or restructured sentences.
- No emojis unless explicitly requested.
- No `Co-Authored-By` lines in git commits.
- Adam Duran is "Assistant Teaching Professor of Mechanical Engineering" and "Co-Founder & Co-Director." Never "PhD candidate."
- Polina Brodsky is the co-lead. Never "Ringler."
- Do not reference Adam's private frameworks (TWI, EPI, MESA, EMBL) on the site.

## Accessibility

WCAG 2.1 AA is a release gate. Every PR must pass axe, pa11y, and Lighthouse (≥95 accessibility score). See `scripts/a11y-check.ts`.

## Content voice

Institutional Mines voice, data-forward. Lead with numbers and outcomes. Readable by prospective students, current students, and industry partners simultaneously.

## Tech

Astro 6, Tailwind v4, TypeScript strict, Node 22+. Zero JS on pages where possible.
```

- [ ] **Step 5: Commit scaffolding**

```bash
git add .gitignore README.md CLAUDE.md docs/
git commit -m "chore: initial repo scaffold with spec and plan"
```

## Task 0.2: Initialize Astro + core dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`

- [ ] **Step 1: Ensure fnm and Node 22 active**

```bash
eval "$(fnm env)"
node --version   # expect v22.x or later
```

- [ ] **Step 2: Initialize package.json**

```bash
npm init -y
```

- [ ] **Step 3: Install Astro + core deps**

```bash
npm install astro@^6.1.6 @astrojs/sitemap@^3.7.2
npm install -D typescript@^5 @types/node
```

- [ ] **Step 4: Install Tailwind v4 and typography plugin**

```bash
npm install tailwindcss@^4.2.2 @tailwindcss/vite@^4.2.2 @tailwindcss/typography@^0.5.19
```

- [ ] **Step 5: Install icon set**

```bash
npm install astro-icon @iconify-json/lucide
```

- [ ] **Step 6: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "exports", "node_modules"]
}
```

- [ ] **Step 7: Write `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://professor-duran.github.io',
  base: '/mines-automotive',
  trailingSlash: 'always',
  integrations: [
    sitemap(),
    icon({ include: { lucide: ['*'] } })
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: 'directory'
  }
});
```

- [ ] **Step 8: Update `package.json` scripts section**

```json
{
  "name": "mines-automotive",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs
git commit -m "chore: install Astro, Tailwind v4, TypeScript, icon set"
```

## Task 0.3: Set up Mines brand tokens and base styles

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Write `src/styles/tokens.css`** (Mines brand tokens)

```css
@theme {
  /* Primary palette (Mines brand) */
  --color-mines-blue: #21314D;
  --color-mines-light-blue: #92A2BD;
  --color-mines-red: #D2492A;

  /* Secondary palette (capped at ~10% per Mines rules) */
  --color-mines-deep-blue: #263F6A;
  --color-mines-pale-blue: #CED5DD;
  --color-mines-gray: #B2B4B3;
  --color-mines-silver: #8B8D8E;

  /* Neutrals */
  --color-white: #FFFFFF;
  --color-body: #2D2D2D;
  --color-caption: #6B7280;

  /* Type scale */
  --font-sans: "Open Sans", Arial, sans-serif;

  /* Layout */
  --container-content: 1280px;
  --container-bleed: 1440px;
}
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import "tailwindcss";
@import "./tokens.css";
@plugin "@tailwindcss/typography";

/* Respect reduced motion by default */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Accessibility baseline */
:focus-visible {
  outline: 3px solid var(--color-mines-red);
  outline-offset: 2px;
}

html {
  font-family: var(--font-sans);
  color: var(--color-body);
  scroll-behavior: smooth;
}

body {
  background: var(--color-white);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-mines-blue);
  color: var(--color-white);
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
  font-weight: 700;
}
.skip-link:focus { top: 0; }
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add Mines brand tokens and base styles"
```

## Task 0.4: Create `BaseLayout.astro` with head metadata, fonts, skip link

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `BaseLayout.astro`**

```astro
---
import '../styles/global.css';

export interface Props {
  title: string;
  description: string;
  pageType?: 'website' | 'article';
  heroImage?: string;
  canonicalPath?: string;
}

const {
  title,
  description,
  pageType = 'website',
  heroImage,
  canonicalPath
} = Astro.props;

const fullTitle = `${title} | Mines Automotive Engineering`;
const canonical = canonicalPath
  ? new URL(canonicalPath, Astro.site + '/mines-automotive').toString()
  : Astro.url.toString();
const ogImage = heroImage
  ? new URL(heroImage, Astro.site + '/mines-automotive').toString()
  : null;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <!-- Mockup phase: never index -->
    <meta name="robots" content="noindex, nofollow" />

    <!-- Open Graph -->
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={pageType} />
    <meta property="og:url" content={canonical} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <!-- Fonts: Open Sans (Mines web brand) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap"
    />

    <link rel="icon" type="image/svg+xml" href="/mines-automotive/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
  </head>
  <body class="text-(--color-body) bg-white">
    <a href="#main" class="skip-link">Skip to main content</a>
    <slot name="banner" />
    <slot name="nav" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Create a placeholder favicon**

```bash
mkdir -p public
cat > public/favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#21314D"/><text x="16" y="22" text-anchor="middle" font-family="Arial" font-weight="700" font-size="18" fill="#FFFFFF">M</text></svg>
EOF
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro public/favicon.svg
git commit -m "feat: BaseLayout with head meta, fonts, noindex, skip link"
```

## Task 0.5: Create homepage placeholder and verify dev server

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write minimal homepage**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Home"
  description="The Mines Automotive Engineering Program at the Colorado School of Mines."
  canonicalPath="/"
>
  <section class="mx-auto max-w-(--container-content) px-6 py-20">
    <h1 class="text-4xl md:text-6xl font-bold text-(--color-mines-blue)">
      Mines Automotive Engineering
    </h1>
    <p class="mt-4 text-lg text-(--color-caption)">
      Mockup in progress. This placeholder proves the build chain works.
    </p>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Expected: server at `http://localhost:4321/mines-automotive/`. Open in browser, confirm Open Sans is loading, headline is dark blue, page is responsive. Stop server with Ctrl+C.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: `dist/` folder created, build succeeds with zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage placeholder, dev and build verified"
```

## Task 0.6: Add robots.txt, double-layer noindex, confirm published meta

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Write `public/robots.txt`**

```
User-agent: *
Disallow: /

# Preview / mockup site only. Final deploy will live on mines.edu.
# Contact: adam.duran@mines.edu
```

- [ ] **Step 2: Run build and inspect output**

```bash
npm run build
cat dist/robots.txt            # confirm Disallow present
grep -o 'noindex' dist/index.html  # confirm meta is in page head
```

Expected: both present.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: double-layer noindex (robots.txt + meta)"
```

## Task 0.7: Copy the 5 existing automotive images into the repo

Moving this to Phase 0 (vs. Phase 3) so images are committed assets and no downstream task depends on a sibling directory being present.

**Files:**
- Create: `public/images/fsae-track.jpg`
- Create: `public/images/fsae-tilt-test.jpg`
- Create: `public/images/shell-ecomarathon-indy.jpg`
- Create: `public/images/shell-ecomarathon-garage.jpg`
- Create: `public/images/rc-car-workshop.jpg`

- [ ] **Step 1: Check source**

```bash
ls ../professor-duran.github.io/public/images/ 2>/dev/null || echo "source not found"
```

- [ ] **Step 2: If source exists, copy; otherwise ask Adam**

If the `ls` above succeeded:

```bash
cp ../professor-duran.github.io/public/images/fsae-track.jpg public/images/
cp ../professor-duran.github.io/public/images/fsae-tilt-test.jpg public/images/
cp ../professor-duran.github.io/public/images/shell-ecomarathon-indy.jpg public/images/
cp ../professor-duran.github.io/public/images/shell-ecomarathon-garage.jpg public/images/
cp ../professor-duran.github.io/public/images/rc-car-workshop.jpg public/images/
```

If not, halt and ask Adam to drop the 5 JPGs into `public/images/` manually before continuing.

- [ ] **Step 3: Verify**

```bash
ls public/images/
```

Expected: all 5 `.jpg` files listed.

- [ ] **Step 4: Commit**

```bash
git add public/images/
git commit -m "chore: add 5 seed images (FSAE, Shell Eco, RC workshop)"
```

## Task 0.8: First push to GitHub

- [ ] **Step 1: Create remote repo** via GitHub CLI

```bash
gh repo create professor-duran/mines-automotive --public \
  --description "Mockup site for the Mines Automotive Engineering Program. Preview only, never indexed." \
  --source=. --remote=origin
```

- [ ] **Step 2: Push**

```bash
git push -u origin main
```

Expected: repo visible at `https://github.com/professor-duran/mines-automotive`.

**Phase 0 complete.** Repo initialized, Astro + Tailwind running, Mines fonts loading, brand tokens in place, noindex enforced, seed images committed, placeholder homepage builds. No milestone yet.

---

# Phase 1: Core chrome (Nav, Footer, PageHeader, CTASection, 404)

Builds the site-wide UI chrome. At the end of this phase, every page will have a working top nav with mobile menu and a three-column footer, and the 404 page renders.

## Task 1.1: `Nav.astro` component

**Files:**
- Create: `src/components/Nav.astro`

Use a small island of JS only for the mobile hamburger toggle and focus trap. Everything else is static.

- [ ] **Step 1: Write `Nav.astro`**

```astro
---
export interface Props {
  currentPath?: string;
}
const { currentPath = '' } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const links = [
  { href: `${base}/`, label: 'Home' },
  { href: `${base}/about/`, label: 'About' },
  { href: `${base}/curriculum/`, label: 'Curriculum' },
  { href: `${base}/teams/`, label: 'Teams' },
  { href: `${base}/partners/`, label: 'Partners' },
  { href: `${base}/contact/`, label: 'Contact' }
];

const isActive = (href: string) => {
  if (href === `${base}/`) return currentPath === `${base}/`;
  return currentPath.startsWith(href);
};
---

<header class="sticky top-0 z-40 border-b border-(--color-mines-pale-blue) bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
  <nav class="mx-auto flex max-w-(--container-bleed) items-center justify-between px-6 py-4" aria-label="Primary">
    <a href={`${base}/`} class="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-mines-red)">
      <span class="block h-8 w-8 rounded-sm bg-(--color-mines-blue)" aria-hidden="true"></span>
      <span class="font-bold text-(--color-mines-blue) leading-tight">
        <span class="block text-sm uppercase tracking-wider">Colorado School of Mines</span>
        <span class="block text-lg">Automotive Engineering</span>
      </span>
    </a>

    <ul class="hidden lg:flex items-center gap-8" role="list">
      {links.map(link => (
        <li>
          <a
            href={link.href}
            class={`text-sm font-semibold transition-colors hover:text-(--color-mines-red) ${isActive(link.href) ? 'text-(--color-mines-red) underline underline-offset-8' : 'text-(--color-mines-blue)'}`}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <button
      id="mobile-nav-toggle"
      class="lg:hidden rounded p-2 text-(--color-mines-blue) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-mines-red)"
      aria-expanded="false"
      aria-controls="mobile-nav"
      aria-label="Open navigation menu"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  </nav>

  <div
    id="mobile-nav"
    class="hidden lg:hidden border-t border-(--color-mines-pale-blue) bg-white px-6 py-4"
  >
    <ul class="flex flex-col gap-4" role="list">
      {links.map(link => (
        <li>
          <a
            href={link.href}
            class={`block text-base font-semibold ${isActive(link.href) ? 'text-(--color-mines-red)' : 'text-(--color-mines-blue)'}`}
            aria-current={isActive(link.href) ? 'page' : undefined}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</header>

<script>
  const toggle = document.getElementById('mobile-nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      if (isOpen) {
        const first = panel.querySelector('a');
        if (first instanceof HTMLElement) first.focus();
      }
    });

    // Close on Escape, trap focus while open
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      if (e.key === 'Tab' && !panel.classList.contains('hidden')) {
        const focusables = Array.from(panel.querySelectorAll<HTMLElement>('a, button'));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  }
</script>
```

- [ ] **Step 2: Verify manually in dev server**

Run `npm run dev`, open homepage, confirm nav renders, resize to mobile width, click hamburger, verify menu opens and closes, verify Escape key closes it, verify Tab stays trapped inside menu while open.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: Nav component with mobile menu and focus trap"
```

## Task 1.2: `Footer.astro` component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `Footer.astro`**

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const year = new Date().getFullYear();

const programLinks = [
  { href: `${base}/about/`, label: 'About the program' },
  { href: `${base}/curriculum/`, label: 'Curriculum' },
  { href: `${base}/teams/`, label: 'Competition teams' },
  { href: `${base}/partners/`, label: 'Industry partners' }
];

const resourceLinks = [
  { href: `${base}/courses/`, label: 'Course catalog' },
  { href: `${base}/faculty/`, label: 'Faculty' },
  { href: `${base}/research/`, label: 'Research' },
  { href: `${base}/students/`, label: 'Student spotlight' },
  { href: `${base}/news/`, label: 'News and events' }
];

const institutionalLinks = [
  { href: 'https://www.mines.edu/', label: 'Colorado School of Mines' },
  { href: 'https://www.mines.edu/mechanical-engineering/', label: 'Department of Mechanical Engineering' },
  { href: 'https://www.mines.edu/accessibility/', label: 'Accessibility' },
  { href: 'https://www.mines.edu/privacy/', label: 'Privacy' }
];
---

<footer class="bg-(--color-mines-blue) text-white">
  <div class="mx-auto max-w-(--container-bleed) px-6 py-16">
    <div class="grid gap-12 md:grid-cols-3">
      <div>
        <h2 class="text-lg font-bold uppercase tracking-wider">Automotive Engineering</h2>
        <p class="mt-3 text-sm leading-relaxed text-(--color-mines-light-blue)">
          Colorado School of Mines<br />
          1500 Illinois Street<br />
          Golden, CO 80401
        </p>
        <p class="mt-3 text-sm">
          <a href="mailto:automotive@mines.edu" class="underline decoration-(--color-mines-red) underline-offset-4 hover:text-(--color-mines-red)">automotive@mines.edu</a>
        </p>
      </div>

      <nav aria-label="Program">
        <h2 class="text-sm font-bold uppercase tracking-wider">Program</h2>
        <ul class="mt-3 space-y-2 text-sm" role="list">
          {programLinks.map(link => (
            <li><a href={link.href} class="hover:text-(--color-mines-red)">{link.label}</a></li>
          ))}
        </ul>
        <h2 class="mt-6 text-sm font-bold uppercase tracking-wider">Resources</h2>
        <ul class="mt-3 space-y-2 text-sm" role="list">
          {resourceLinks.map(link => (
            <li><a href={link.href} class="hover:text-(--color-mines-red)">{link.label}</a></li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Institutional">
        <h2 class="text-sm font-bold uppercase tracking-wider">Mines</h2>
        <ul class="mt-3 space-y-2 text-sm" role="list">
          {institutionalLinks.map(link => (
            <li>
              <a href={link.href} class="hover:text-(--color-mines-red)" target="_blank" rel="noopener">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div class="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-(--color-mines-light-blue) md:flex-row md:justify-between">
      <p>&copy; {year} Colorado School of Mines. All rights reserved.</p>
      <p>Mockup site. Final site will be hosted at mines.edu.</p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: Footer with 3-column nav and institutional links"
```

## Task 1.3: `PageHeader.astro` component

**Files:**
- Create: `src/components/PageHeader.astro`

- [ ] **Step 1: Write `PageHeader.astro`**

```astro
---
export interface Props {
  title: string;
  lead?: string;
  breadcrumb?: { label: string; href?: string }[];
}
const { title, lead, breadcrumb = [] } = Astro.props;
---

<section class="bg-(--color-mines-pale-blue)/40 border-b border-(--color-mines-pale-blue)">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 md:py-20">
    {breadcrumb.length > 0 && (
      <nav aria-label="Breadcrumb" class="mb-4 text-xs font-semibold uppercase tracking-wider text-(--color-caption)">
        <ol class="flex flex-wrap items-center gap-2" role="list">
          {breadcrumb.map((item, i) => (
            <li class="flex items-center gap-2">
              {item.href ? <a href={item.href} class="hover:text-(--color-mines-red)">{item.label}</a> : <span>{item.label}</span>}
              {i < breadcrumb.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    )}
    <div class="relative pl-5">
      <span class="absolute left-0 top-2 block h-10 w-1 bg-(--color-mines-red)" aria-hidden="true"></span>
      <h1 class="text-3xl md:text-5xl font-bold text-(--color-mines-blue)">{title}</h1>
      {lead && <p class="mt-4 max-w-3xl text-lg text-(--color-body)">{lead}</p>}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PageHeader.astro
git commit -m "feat: PageHeader with breadcrumb and red accent line"
```

## Task 1.4: `CTASection.astro` component

**Files:**
- Create: `src/components/CTASection.astro`

- [ ] **Step 1: Write `CTASection.astro`**

```astro
---
export interface Props {
  headline: string;
  body?: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}
const { headline, body, primary, secondary } = Astro.props;
---

<section class="bg-(--color-mines-blue) text-white">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 text-center">
    <h2 class="text-2xl md:text-4xl font-bold">{headline}</h2>
    {body && <p class="mx-auto mt-4 max-w-2xl text-(--color-mines-light-blue)">{body}</p>}
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a
        href={primary.href}
        class="inline-flex items-center rounded bg-(--color-mines-red) px-6 py-3 text-base font-bold text-white hover:bg-(--color-mines-red)/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {primary.label}
      </a>
      {secondary && (
        <a
          href={secondary.href}
          class="inline-flex items-center rounded border border-white px-6 py-3 text-base font-bold text-white hover:bg-white hover:text-(--color-mines-blue) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {secondary.label}
        </a>
      )}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CTASection.astro
git commit -m "feat: CTASection with primary and secondary buttons"
```

## Task 1.5: Wire chrome into homepage, test

- [ ] **Step 1: Update `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import PageHeader from '../components/PageHeader.astro';
import CTASection from '../components/CTASection.astro';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---

<BaseLayout
  title="Home"
  description="The Mines Automotive Engineering Program at the Colorado School of Mines."
  canonicalPath="/"
>
  <Nav slot="nav" currentPath={Astro.url.pathname} />

  <PageHeader
    title="Mines Automotive Engineering"
    lead="Hands-on, industry-connected automotive engineering at the Colorado School of Mines."
  />

  <section class="mx-auto max-w-(--container-content) px-6 py-20">
    <p class="text-lg">Homepage content coming in Phase 3.</p>
  </section>

  <CTASection
    headline="Declare the automotive track"
    body="Start planning your coursework and find your team."
    primary={{ href: `${base}/curriculum/`, label: 'View curriculum' }}
    secondary={{ href: `${base}/contact/`, label: 'Talk to us' }}
  />

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Verify in dev**

```bash
npm run dev
```

Expected: nav at top, page header with red accent, homepage stub, CTA band, footer with 3 columns.

- [ ] **Step 3: Run first local axe check** (manual, browser extension or CLI if installed). For now confirm visually: one h1, proper landmarks, no obvious contrast issues.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire Nav, PageHeader, CTASection, Footer into homepage"
```

## Task 1.6: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Write 404 page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---

<BaseLayout
  title="Page not found"
  description="The page you requested could not be found on the Mines Automotive Engineering site."
  canonicalPath="/404/"
>
  <Nav slot="nav" currentPath={Astro.url.pathname} />
  <section class="mx-auto max-w-(--container-content) px-6 py-20 text-center">
    <span class="block h-1 w-16 bg-(--color-mines-red) mx-auto mb-6" aria-hidden="true"></span>
    <h1 class="text-4xl md:text-6xl font-bold text-(--color-mines-blue)">Page not found</h1>
    <p class="mt-4 text-lg text-(--color-caption)">We couldn't find what you were looking for.</p>
    <a
      href={`${base}/`}
      class="mt-8 inline-flex items-center rounded bg-(--color-mines-red) px-6 py-3 font-bold text-white hover:bg-(--color-mines-red)/90"
    >
      Return home
    </a>
  </section>
  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: 404 page with brand chrome"
```

**Phase 1 complete.** Site chrome in place. No milestone yet.

---

# Phase 2: Content collections and seed data

Defines Zod schemas for `teams/`, `courses/`, `partners/`, `news/`. Creates `faculty.ts` and `stats.ts`. Writes seed content so downstream pages have something to render.

## Task 2.1: Content collection schemas

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Write content config**

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teams = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teams' }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    description: z.string(),
    role: z.string().optional(),
    established: z.string().optional(),
    advisors: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    thumbnail: z.string().optional(),
    logo: z.string().optional(),
    order: z.number().default(0),
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional()
    })).optional(),
    sponsors: z.array(z.string()).default([]),
    recentResults: z.array(z.string()).default([]),
    externalLinks: z.object({
      instagram: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional()
    }).optional()
  })
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    code: z.string(),
    name: z.string(),
    credits: z.number(),
    crossList: z.array(z.string()).default([]),
    semesters: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
    instructor: z.string().optional(),
    developedBy: z.string().optional(),
    openMaterialsUrl: z.string().optional(),
    order: z.number().default(0)
  })
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    category: z.enum(['news', 'event', 'student-spotlight']).default('news')
  })
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    tier: z.enum(['founding', 'corporate', 'supporter', 'national-lab']),
    logo: z.string().optional(),
    description: z.string().optional(),
    website: z.string().optional(),
    since: z.string().optional(),
    order: z.number().default(0)
  })
});

export const collections = { teams, courses, news, partners };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: Zod schemas for teams, courses, news, partners"
```

## Task 2.2: Seed teams/ content (4 teams)

**Files:**
- Create: `src/content/teams/fsae.md`
- Create: `src/content/teams/shell-eco-marathon.md`
- Create: `src/content/teams/battery-workforce-challenge.md`
- Create: `src/content/teams/ecocar.md`

- [ ] **Step 1: Write `src/content/teams/fsae.md`**

```markdown
---
title: Formula SAE
shortName: FSAE
description: Student-built formula-style race car competing annually at Formula SAE Michigan and Formula SAE Lincoln.
role: Team design, build, test, and competition
established: "Mines FSAE is one of the oldest active student competition teams in Mechanical Engineering."
advisors: ["Adam W. Duran", "Polina Brodsky"]
heroImage: /images/fsae-track.jpg
heroAlt: Mines Formula SAE car on competition track
thumbnail: /images/fsae-track.jpg
order: 1
gallery:
  - src: /images/fsae-tilt-test.jpg
    alt: Mines FSAE car on the tilt test platform
    caption: Tilt testing at FSAE Michigan
sponsors: []
recentResults: []
externalLinks: {}
---

## About

Mines Formula SAE designs, builds, and races an open-wheel formula-style car every year, competing at Formula SAE Michigan in the spring and Formula SAE Lincoln in the summer.

## What students do

Team members own sub-system design from first sketch to competition tech inspection: chassis, powertrain, suspension, electronics, driver controls, aero, and manufacturing. The team operates on an academic-year build cycle with design, manufacturing, testing, and competition phases.

## How to join

New members are welcome at any experience level. Recruiting happens at the beginning of each fall semester. Contact the faculty advisors for details.
```

- [ ] **Step 2: Write `src/content/teams/shell-eco-marathon.md`**

```markdown
---
title: Shell Eco-marathon
shortName: Shell Eco
description: Energy-efficient vehicle team competing at the Shell Eco-marathon Americas at Indianapolis Motor Speedway.
role: Ultra-efficient prototype design, build, test, and competition
advisors: ["Adam W. Duran", "Polina Brodsky"]
heroImage: /images/shell-ecomarathon-indy.jpg
heroAlt: Mines Shell Eco-marathon team at Indianapolis Motor Speedway Gasoline Alley
thumbnail: /images/shell-ecomarathon-indy.jpg
order: 2
gallery:
  - src: /images/shell-ecomarathon-garage.jpg
    alt: Shell Eco-marathon team assembling their vehicle in the paddock garage
    caption: Paddock preparation at Indianapolis Motor Speedway
sponsors: []
recentResults: []
externalLinks: {}
---

## About

The Shell Eco-marathon team designs ultra-efficient prototype vehicles that maximize distance per unit of energy. Mines competes in the Prototype and UrbanConcept classes.

## What students do

Students lead chassis design in composites, aerodynamic shaping, efficient drivetrain selection, and real-world race strategy. The program emphasizes energy efficiency as a design driver over raw performance.

## How to join

Recruiting opens early fall. Contact the advisors to get involved.
```

- [ ] **Step 3: Write `src/content/teams/battery-workforce-challenge.md`**

```markdown
---
title: Battery Workforce Challenge
shortName: BWC
description: DOE-sponsored challenge to redesign battery packs for real-world electric vehicle applications.
role: Battery system design, build, and integration with industry partner vehicles
established: "Mines joined BWC as a founding-cohort university in 2023."
advisors: ["Adam W. Duran", "Polina Brodsky"]
thumbnail: /images/fsae-track.jpg
order: 3
sponsors: []
recentResults: []
externalLinks: {}
---

## About

The Battery Workforce Challenge is a U.S. Department of Energy competition that pairs universities with industry partners to redesign production-vehicle battery packs. Mines placed 1st in Year 1 (2023 to 2024) and 4th in Year 2 (2024 to 2025), with approximately $255,000 in total program value across the two years.

## What students do

Team members work on cell selection, thermal management, battery management systems, pack mechanical design, safety analysis, and integration with the sponsor vehicle. The program is multidisciplinary by design, with mechanical, electrical, and chemical engineering students collaborating.

## How to join

BWC recruits annually. Prior coursework in battery systems or power electronics helps but is not required.
```

- [ ] **Step 4: Write `src/content/teams/ecocar.md`**

```markdown
---
title: EcoCAR Innovation Challenge
shortName: EcoCAR
description: DOE and Stellantis-sponsored multi-year competition to redesign a production SUV for advanced propulsion.
role: Vehicle-level hybrid powertrain and controls design, integration, and competition
established: "Mines awarded EcoCAR in Spring 2026 for the 2026 to 2030 program cycle, Stellantis track."
advisors: ["Adam W. Duran", "Polina Brodsky"]
thumbnail: /images/fsae-track.jpg
order: 4
sponsors: []
recentResults: []
externalLinks: {}
---

## About

The EcoCAR Innovation Challenge is a four-year advanced vehicle technology competition sponsored by the U.S. Department of Energy and Stellantis. Mines joins the 2026 to 2030 cycle on the Stellantis track with approximately $520,000 in program funding over four years.

Program co-leads: Adam W. Duran and Polina Brodsky.

## What students do

EcoCAR is vehicle-level propulsion systems engineering: hybrid architecture selection, controls development, model-based design, hardware-in-the-loop testing, connected and automated vehicle integration, and full-vehicle integration with a Stellantis-provided production platform.

## How to join

EcoCAR recruiting begins Fall 2026. Contact the advisors for more information.
```

- [ ] **Step 5: Commit**

```bash
git add src/content/teams/
git commit -m "feat: seed 4 competition team entries"
```

## Task 2.3: Seed courses/ content (8 courses)

**Files:** create `src/content/courses/{megn-200,megn-300,megn-301,megn-417,megn-455,megn-456,megn-566,ebgn-599a}.md`.

- [ ] **Step 1: Write `megn-301.md`** (use existing open materials repo reference; this is the most canonical course)

```markdown
---
code: "MEGN 301"
name: Automotive Powertrains
credits: 3
crossList: []
semesters: ["Fall"]
prerequisites: ["MEGN 200 or equivalent"]
instructor: "Adam W. Duran"
developedBy: "Adam W. Duran"
openMaterialsUrl: "https://github.com/professor-duran/MEGN301"
order: 2
---

## Overview

An applied introduction to automotive powertrain architectures: internal combustion engines, transmissions, hybrid and battery electric drivetrains, fuel cells, and power delivery systems. Emphasis on system-level tradeoffs and real-world vehicle performance.

## Learning outcomes

- Analyze and compare conventional, hybrid, and electric powertrain architectures.
- Select and size powertrain components for target vehicle use cases.
- Interpret manufacturer data sheets and translate them into engineering models.
- Evaluate powertrain design decisions against efficiency, cost, and packaging constraints.

## Open materials

Lectures, problem sets, and references are released under CC BY 4.0 at [github.com/professor-duran/MEGN301](https://github.com/professor-duran/MEGN301).
```

- [ ] **Step 2: Write the other 7 course files.** Use the `megn-301.md` structure as a template. Keep content brief (60 to 120 words of body text per file) and leave `instructor`, `developedBy`, `openMaterialsUrl`, `prerequisites` fields blank when unknown. Key variations:

  - **megn-200.md:** code `"MEGN 200"`, name `"Introduction to Automotive Engineering"`, order 1, open materials not yet public.
  - **megn-300.md:** code `"MEGN 300"`, name *TBD per spec Section 14 item 6*, order 3, open materials at `https://github.com/professor-duran/MEGN300`.
  - **megn-417.md:** code `"MEGN 417"`, name `"Vehicle Systems Design"`, credits 3, order 4.
  - **megn-455.md:** code `"MEGN 455"`, name `"Electric and Hybrid Vehicle Systems"`, credits 3, order 5.
  - **megn-456.md:** code `"MEGN 456"`, name `"Autonomous Vehicle Systems"`, credits 3, order 6.
  - **megn-566.md:** code `"MEGN 566"`, name `"Advanced Automotive Topics"`, credits 3, order 7, graduate-level.
  - **ebgn-599a.md:** code `"EBGN 599A"`, name `"Technology Commercialization for Automotive"`, credits 3, crossList `["MEGN"]`, order 8.

Each file mirrors the structure of `megn-301.md`: frontmatter + H2 Overview + H2 Learning outcomes + H2 Open materials (or `## Materials in development` if no public link yet).

- [ ] **Step 3: Build to validate schemas**

```bash
npm run build
```

Expected: build succeeds, no Zod schema errors. If any field fails validation, fix the markdown frontmatter.

- [ ] **Step 4: Commit**

```bash
git add src/content/courses/
git commit -m "feat: seed 8 automotive track course entries"
```

## Task 2.4: Seed partners/ content

**Files:** create one markdown file per partner tier as a placeholder.

- [ ] **Step 1: Write `src/content/partners/founding.md`**

```markdown
---
name: Founding partners
tier: founding
description: Organizations that helped launch the Mines automotive program.
order: 1
---

Founding partners to be confirmed during Adam's review (Spec Section 14 item 3).
```

- [ ] **Step 2: Write `src/content/partners/corporate.md`**, `supporter.md`, `national-lab.md` using the same pattern (placeholder entries one per tier, to be filled when Adam confirms named partners).

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add src/content/partners/
git commit -m "feat: seed partner tier placeholders (to be filled per spec S14)"
```

## Task 2.5: Seed news/ content

**Files:** write 3 seed news posts.

- [ ] **Step 1: Write `src/content/news/2026-03-awarded-ecocar.md`**

```markdown
---
title: "Mines awarded EcoCAR Innovation Challenge for 2026 to 2030 cycle"
description: "The Mines Automotive Program joins the Stellantis track with approximately $520,000 in program funding over four years."
pubDate: 2026-03-01
tags: [ecocar, awards, research]
category: news
---

The Colorado School of Mines has been selected to join the EcoCAR Innovation Challenge for the 2026 to 2030 program cycle, on the Stellantis track. Program co-leads are Assistant Teaching Professor Adam W. Duran and Prof. Polina Brodsky.

## What EcoCAR brings to Mines

EcoCAR is a four-year vehicle-level advanced propulsion engineering competition. Students develop hybrid powertrains, controls, connected vehicle integration, and model-based design skills on a production Stellantis platform. The program begins in Fall 2026.
```

- [ ] **Step 2: Write `src/content/news/2025-11-bwc-year-two-4th-place.md`**

```markdown
---
title: "Mines Battery Workforce Challenge team finishes 4th in Year 2"
description: "Second straight competitive finish for the DOE-sponsored battery redesign program."
pubDate: 2025-11-15
tags: [bwc, awards]
category: news
---

The Mines Battery Workforce Challenge team finished 4th out of 12 universities in Year 2 of the U.S. Department of Energy's program, following a 1st place finish in Year 1. Across the two years the program represented approximately $255,000 in program value.
```

- [ ] **Step 3: Write `src/content/news/2025-09-automotive-track-252.md`**

```markdown
---
title: "Automotive track passes 252 declared students"
description: "The program is now the second-largest track in ME behind only Aerospace."
pubDate: 2025-09-10
tags: [program, growth]
category: news
---

Enrollment in the Colorado School of Mines Automotive Engineering track has reached 252 declared students, approximately 17 percent of Mechanical Engineering track declarations. The program ranks second in ME by enrollment, behind only Aerospace, with a 126:1 student-to-faculty ratio across two core faculty.
```

- [ ] **Step 4: Commit**

```bash
git add src/content/news/
git commit -m "feat: seed 3 news posts (EcoCAR award, BWC year 2, enrollment)"
```

## Task 2.6: `faculty.ts` data file

**Files:**
- Create: `src/data/faculty.ts`

- [ ] **Step 1: Write `faculty.ts`**

```typescript
export interface FacultyMember {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  bio: string;
  headshot?: string;
  email: string;
  expertise: string[];
  courses: string[];
  links: {
    linkedin?: string;
    orcid?: string;
    website?: string;
    googleScholar?: string;
  };
}

export const faculty: FacultyMember[] = [
  {
    slug: 'adam-duran',
    name: 'Adam W. Duran',
    title: 'Assistant Teaching Professor of Mechanical Engineering',
    credentials: 'P.E. Colorado, PMP',
    bio: 'Co-Founder and Co-Director of the Mines Automotive Engineering Program. Twelve years at NREL including Fleet DNA principal investigator and GCxN co-founder. Former senior engineer at QuantumScape working on automated driving systems. Teaches MEGN 301, 300, and the automotive-track core courses.',
    headshot: '/images/faculty/adam-duran.jpg',
    email: 'aduran@mines.edu',
    expertise: [
      'Automotive powertrains',
      'Battery systems',
      'Electric and hybrid vehicles',
      'Vehicle-level energy modeling',
      'Connected and automated vehicles'
    ],
    courses: ['MEGN 301', 'MEGN 300', 'MEGN 200'],
    links: {
      linkedin: 'https://www.linkedin.com/in/adamduran/',
      orcid: 'https://orcid.org/0000-0002-7776-3896',
      website: 'https://adamwduran.com',
      googleScholar: 'https://scholar.google.com/citations?user=ADAM_SCHOLAR_ID'
    }
  },
  {
    slug: 'polina-brodsky',
    name: 'Polina Brodsky',
    title: 'Assistant Teaching Professor of Mechanical Engineering',
    credentials: '',
    bio: 'Co-Lead of the Mines Automotive Engineering Program. Advises FSAE and Shell Eco-marathon and co-leads the Battery Workforce Challenge and EcoCAR Innovation Challenge. Focus on curriculum, hands-on engineering instruction, and student teams.',
    headshot: '/images/faculty/polina-brodsky.jpg',
    email: 'pbrodsky@mines.edu',
    expertise: [
      'Vehicle dynamics',
      'Mechanical design',
      'Hands-on engineering education',
      'Student competition teams'
    ],
    courses: ['MEGN 417', 'MEGN 200'],
    links: {}
  }
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/faculty.ts
git commit -m "feat: faculty data (Duran, Brodsky)"
```

## Task 2.7: `stats.ts` data file

**Files:**
- Create: `src/data/stats.ts`

- [ ] **Step 1: Write `stats.ts`**

```typescript
export interface Stat {
  value: string;
  label: string;
  detail?: string;
}

export const programStats: Stat[] = [
  { value: '252', label: 'declared students' },
  { value: '8', label: 'new courses' },
  { value: '17%', label: 'of Mines ME track declarations' },
  { value: '126:1', label: 'student-to-faculty ratio' }
];

export const secondaryStats: Stat[] = [
  { value: '4', label: 'flagship competition teams', detail: 'FSAE, Shell Eco, BWC, EcoCAR' },
  { value: '3', label: 'departments contributing courses', detail: 'MEGN, EBGN, EDS' },
  { value: '2', label: 'core faculty', detail: 'Duran and Brodsky' }
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/stats.ts
git commit -m "feat: program stats data (single source of truth)"
```

**Phase 2 complete.** Content collections and data files ready. No milestone yet.

---

# Phase 3: Homepage (Hero, StatStrip, PillarGrid, FeaturedTeams, NewsCard, PartnerLogo)

Builds the homepage components and assembles the homepage. This is Milestone 1.

## Task 3.1: `Hero.astro`

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write component**

```astro
---
export interface Props {
  headline: string;
  subhead: string;
  image: string;
  imageAlt: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}
const { headline, subhead, image, imageAlt, primary, secondary } = Astro.props;
---

<section class="relative isolate overflow-hidden bg-(--color-mines-blue)">
  <img
    src={image}
    alt={imageAlt}
    class="absolute inset-0 h-full w-full object-cover opacity-50"
    loading="eager"
    decoding="async"
  />
  <div class="absolute inset-0 bg-gradient-to-r from-(--color-mines-blue)/85 to-(--color-mines-blue)/60" aria-hidden="true"></div>

  <div class="relative mx-auto max-w-(--container-bleed) px-6 py-24 md:py-36">
    <div class="max-w-3xl pl-5">
      <span class="absolute left-6 top-24 block h-16 w-1 bg-(--color-mines-red) md:top-36" aria-hidden="true"></span>
      <h1 class="text-4xl md:text-6xl font-bold leading-tight text-white">{headline}</h1>
      <p class="mt-6 text-lg md:text-xl text-(--color-mines-light-blue)">{subhead}</p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a
          href={primary.href}
          class="inline-flex items-center rounded bg-(--color-mines-red) px-6 py-3 text-base font-bold text-white hover:bg-(--color-mines-red)/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {primary.label}
        </a>
        {secondary && (
          <a
            href={secondary.href}
            class="inline-flex items-center rounded border border-white px-6 py-3 text-base font-bold text-white hover:bg-white hover:text-(--color-mines-blue) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {secondary.label}
          </a>
        )}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: Hero component (full-bleed, dark-blue overlay, red accent line)"
```

## Task 3.2: `StatStrip.astro`

**Files:**
- Create: `src/components/StatStrip.astro`

- [ ] **Step 1: Write component**

```astro
---
import type { Stat } from '../data/stats';
export interface Props {
  stats: Stat[];
  title?: string;
}
const { stats, title } = Astro.props;
---

<section class="bg-white border-y border-(--color-mines-pale-blue)">
  <div class="mx-auto max-w-(--container-content) px-6 py-12 md:py-16">
    {title && <h2 class="sr-only">{title}</h2>}
    <dl class={`grid gap-8 ${stats.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      {stats.map(stat => (
        <div class="text-center md:text-left">
          <dt class="sr-only">{stat.label}</dt>
          <dd>
            <span class="block text-4xl md:text-5xl font-bold text-(--color-mines-red)">{stat.value}</span>
            <span class="mt-2 block text-sm uppercase tracking-wider font-semibold text-(--color-mines-blue)">{stat.label}</span>
            {stat.detail && <span class="mt-1 block text-xs text-(--color-caption)">{stat.detail}</span>}
          </dd>
        </div>
      ))}
    </dl>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatStrip.astro
git commit -m "feat: StatStrip (red numeric highlights, dark-blue labels)"
```

## Task 3.3: `PillarGrid.astro`

**Files:**
- Create: `src/components/PillarGrid.astro`

- [ ] **Step 1: Write component**

```astro
---
import { Icon } from 'astro-icon/components';

export interface Pillar {
  icon: string;
  title: string;
  description: string;
}
export interface Props {
  heading: string;
  lead?: string;
  pillars: Pillar[];
}
const { heading, lead, pillars } = Astro.props;
---

<section class="bg-white">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 md:py-24">
    <div class="max-w-3xl">
      <h2 class="text-3xl md:text-4xl font-bold text-(--color-mines-blue)">{heading}</h2>
      {lead && <p class="mt-4 text-lg text-(--color-body)">{lead}</p>}
    </div>
    <div class="mt-12 grid gap-8 md:grid-cols-3">
      {pillars.map(p => (
        <div class="rounded border border-(--color-mines-pale-blue) bg-white p-8 transition-colors hover:border-(--color-mines-light-blue)">
          <Icon name={p.icon} class="h-10 w-10 text-(--color-mines-red)" aria-hidden="true" />
          <h3 class="mt-4 text-xl font-bold text-(--color-mines-blue)">{p.title}</h3>
          <p class="mt-3 text-sm leading-relaxed text-(--color-body)">{p.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PillarGrid.astro
git commit -m "feat: PillarGrid (3-column cards with Lucide icons)"
```

## Task 3.4: `FeaturedTeams.astro`

**Files:**
- Create: `src/components/FeaturedTeams.astro`

- [ ] **Step 1: Write component**

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const teams = (await getCollection('teams')).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
---

<section class="bg-(--color-mines-pale-blue)/40">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 md:py-24">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div class="max-w-2xl">
        <span class="block h-1 w-16 bg-(--color-mines-red) mb-4" aria-hidden="true"></span>
        <h2 class="text-3xl md:text-4xl font-bold text-(--color-mines-blue)">Competition teams</h2>
        <p class="mt-3 text-(--color-body)">Four flagship teams take coursework from theory to track.</p>
      </div>
      <a href={`${base}/teams/`} class="text-sm font-bold text-(--color-mines-red) hover:underline">See all teams →</a>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {teams.map(team => (
        <a
          href={`${base}/teams/${team.id.replace(/\.md$/, '')}/`}
          class="group block rounded border border-(--color-mines-pale-blue) bg-white overflow-hidden transition-colors hover:border-(--color-mines-red)"
        >
          {team.data.thumbnail && (
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img
                src={team.data.thumbnail}
                alt=""
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div class="p-5">
            <h3 class="text-lg font-bold text-(--color-mines-blue) group-hover:text-(--color-mines-red)">{team.data.title}</h3>
            <p class="mt-2 text-sm text-(--color-body)">{team.data.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FeaturedTeams.astro
git commit -m "feat: FeaturedTeams (4-up card grid from teams collection)"
```

## Task 3.5: `NewsCard.astro` and recent news strip

**Files:**
- Create: `src/components/NewsCard.astro`
- Create: `src/components/RecentNews.astro`

- [ ] **Step 1: Write `NewsCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
export interface Props {
  post: CollectionEntry<'news'>;
}
const { post } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const slug = post.id.replace(/\.md$/, '');
const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(post.data.pubDate);
---

<article class="flex flex-col rounded border border-(--color-mines-pale-blue) bg-white overflow-hidden transition-colors hover:border-(--color-mines-red)">
  {post.data.heroImage && (
    <div class="aspect-[16/9] w-full overflow-hidden">
      <img src={post.data.heroImage} alt="" class="h-full w-full object-cover" loading="lazy" />
    </div>
  )}
  <div class="flex flex-1 flex-col p-6">
    <time datetime={post.data.pubDate.toISOString()} class="text-xs font-semibold uppercase tracking-wider text-(--color-caption)">
      {date}
    </time>
    <h3 class="mt-2 text-lg font-bold text-(--color-mines-blue)">
      <a href={`${base}/news/${slug}/`} class="hover:text-(--color-mines-red)">{post.data.title}</a>
    </h3>
    <p class="mt-2 text-sm text-(--color-body)">{post.data.description}</p>
  </div>
</article>
```

- [ ] **Step 2: Write `RecentNews.astro`**

```astro
---
import { getCollection } from 'astro:content';
import NewsCard from './NewsCard.astro';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const posts = (await getCollection('news'))
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
  .slice(0, 3);
---

<section class="bg-white">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 md:py-24">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div class="max-w-2xl">
        <span class="block h-1 w-16 bg-(--color-mines-red) mb-4" aria-hidden="true"></span>
        <h2 class="text-3xl md:text-4xl font-bold text-(--color-mines-blue)">Recent news</h2>
      </div>
      <a href={`${base}/news/`} class="text-sm font-bold text-(--color-mines-red) hover:underline">All news →</a>
    </div>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {posts.map(post => <NewsCard post={post} />)}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NewsCard.astro src/components/RecentNews.astro
git commit -m "feat: NewsCard + RecentNews (latest 3 posts)"
```

## Task 3.6: `PartnerLogo.astro` and `PartnerStrip.astro`

**Files:**
- Create: `src/components/PartnerLogo.astro`
- Create: `src/components/PartnerStrip.astro`

Note: the spec's 14-component table lists `PartnerLogo`. `PartnerStrip` is a homepage-specific composition that uses `PartnerLogo` (or a placeholder until named partners are confirmed per Spec Section 14 item 3). Both are built here.

- [ ] **Step 0: Write `PartnerLogo.astro`** for use on `/partners` and future homepage grid

```astro
---
export interface Props {
  name: string;
  logo?: string;
  website?: string;
}
const { name, logo, website } = Astro.props;
const inner = logo
  ? `<img src="${logo}" alt="${name} logo" class="max-h-16 w-auto grayscale transition hover:grayscale-0" loading="lazy" />`
  : `<span class="text-sm font-semibold text-(--color-caption)">${name}</span>`;
---

{website ? (
  <a href={website} target="_blank" rel="noopener" class="flex items-center justify-center p-4 rounded border border-(--color-mines-pale-blue) bg-white">
    <Fragment set:html={inner} />
  </a>
) : (
  <div class="flex items-center justify-center p-4 rounded border border-(--color-mines-pale-blue) bg-white">
    <Fragment set:html={inner} />
  </div>
)}
```

- [ ] **Step 1: Write `PartnerStrip.astro`**

Since named partners are still TBD per spec Section 14, render a tier-only placeholder for v1.

```astro
---
import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const partners = (await getCollection('partners'))
  .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
---

<section class="bg-(--color-mines-blue)">
  <div class="mx-auto max-w-(--container-content) px-6 py-14 text-center">
    <h2 class="text-sm font-bold uppercase tracking-widest text-(--color-mines-light-blue)">
      Industry and national lab partners
    </h2>
    <p class="mt-4 mx-auto max-w-2xl text-white">
      Mines Automotive works with OEMs, Tier 1 suppliers, and DOE national laboratories. Named partner list coming soon.
    </p>
    <a
      href={`${base}/partners/`}
      class="mt-6 inline-flex items-center text-sm font-bold text-white underline decoration-(--color-mines-red) underline-offset-8 hover:text-(--color-mines-red)"
    >
      Learn about partnership →
    </a>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PartnerLogo.astro src/components/PartnerStrip.astro
git commit -m "feat: PartnerLogo + PartnerStrip (named partners TBD per spec S14)"
```

## Task 3.7: Assemble homepage

**Files:**
- Update: `src/pages/index.astro`

- [ ] **Step 1: Rewrite homepage**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Hero from '../components/Hero.astro';
import StatStrip from '../components/StatStrip.astro';
import PillarGrid from '../components/PillarGrid.astro';
import FeaturedTeams from '../components/FeaturedTeams.astro';
import RecentNews from '../components/RecentNews.astro';
import PartnerStrip from '../components/PartnerStrip.astro';
import CTASection from '../components/CTASection.astro';
import { programStats } from '../data/stats';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const pillars = [
  {
    icon: 'lucide:book-open',
    title: 'Technical depth',
    description: 'Eight courses across three departments covering powertrains, batteries, controls, autonomy, and vehicle systems design.'
  },
  {
    icon: 'lucide:wrench',
    title: 'Hands-on experience',
    description: 'Four flagship competition teams plus industry-sponsored capstone projects. Every student builds, tests, and competes.'
  },
  {
    icon: 'lucide:users',
    title: 'Industry connection',
    description: 'Direct partnerships with OEMs, Tier 1 suppliers, and DOE national laboratories. Graduates enter the workforce with real-world references.'
  }
];
---

<BaseLayout
  title="Home"
  description="The Mines Automotive Engineering Program at the Colorado School of Mines. 252 declared students, 8 new courses, 4 flagship competition teams."
  heroImage="/images/fsae-track.jpg"
  canonicalPath="/"
>
  <Nav slot="nav" currentPath={Astro.url.pathname} />

  <Hero
    headline="Building the next generation of automotive engineers."
    subhead="A hands-on, industry-connected automotive engineering program at the Colorado School of Mines."
    image={`${base}/images/fsae-track.jpg`}
    imageAlt="Mines Formula SAE car on competition track"
    primary={{ href: `${base}/curriculum/`, label: 'View the curriculum' }}
    secondary={{ href: `${base}/teams/`, label: 'Meet the teams' }}
  />

  <StatStrip stats={programStats} title="Program at a glance" />

  <PillarGrid
    heading="How the program works"
    lead="Three pillars connect classroom instruction to real-world engineering."
    pillars={pillars}
  />

  <FeaturedTeams />

  <RecentNews />

  <PartnerStrip />

  <CTASection
    headline="Ready to build cars?"
    body="Talk to us about declaring the track, joining a team, or partnering as an industry sponsor."
    primary={{ href: `${base}/contact/`, label: 'Get in touch' }}
    secondary={{ href: `${base}/curriculum/`, label: 'View curriculum' }}
  />

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Run dev, verify homepage visually**

```bash
npm run dev
```

Check: hero loads FSAE image with dark overlay, stat strip shows 4 numbers in red, pillar grid has 3 cards with icons, teams grid shows 4 teams, recent news shows 3 posts, partner strip shows dark blue band, CTA loads, footer renders.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: succeeds, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage assembly (hero, stats, pillars, teams, news, partners, CTA)"
```

**🎯 Milestone 1: Working homepage.** Site has a compelling, brand-compliant homepage that loads, is accessible (manual check), and builds cleanly. Demoable to stakeholders. Pause here for Adam review if desired.

---

# Phase 4: Tier 1 interior pages (About, Curriculum, Teams index, Partners, Contact)

Each Tier 1 page follows the same pattern: `BaseLayout` > `Nav` > `PageHeader` > content sections > `CTASection` > `Footer`.

## Task 4.1: `/about` page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Write page** using `PageHeader`, `StatStrip` (program stats + secondary stats), `PillarGrid` for "What we teach" and a `PhotoTextRow`-style section for history. Content: draw from the building-mines-automotive-track.md essay condensed to ~300 words. Narrative should cover: program origin (2022 launch), 2-faculty lean model, 252 students, 3-pillar framework, open course materials approach.

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: About page (origin, stats, pillars, approach)"
```

## Task 4.2: `PhotoTextRow.astro` component + `/curriculum` page

**Files:**
- Create: `src/components/PhotoTextRow.astro`
- Create: `src/pages/curriculum.astro`

- [ ] **Step 1: Write `PhotoTextRow.astro`**

```astro
---
export interface Props {
  image: string;
  alt: string;
  heading: string;
  reverse?: boolean;
}
const { image, alt, heading, reverse = false } = Astro.props;
---

<section class="bg-white">
  <div class="mx-auto max-w-(--container-content) px-6 py-16 md:py-20">
    <div class={`grid gap-10 md:grid-cols-2 md:items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div>
        <img src={image} alt={alt} class="w-full rounded aspect-[4/3] object-cover" loading="lazy" />
      </div>
      <div>
        <h2 class="text-3xl md:text-4xl font-bold text-(--color-mines-blue)">{heading}</h2>
        <div class="mt-4 prose prose-lg max-w-none text-(--color-body)">
          <slot />
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Write `/curriculum`** page

Use `PageHeader`, then three `PhotoTextRow` sections (one per pillar), then a `CourseCard` preview grid (6 courses), then `CTASection` linking to `/courses`.

- [ ] **Step 3: Commit**

```bash
git add src/components/PhotoTextRow.astro src/pages/curriculum.astro
git commit -m "feat: Curriculum page with pillar sections and course preview"
```

## Task 4.3: `/teams` index page

**Files:**
- Create: `src/pages/teams.astro`

- [ ] **Step 1: Write page** using `PageHeader`, intro paragraph, then a full grid of all 4 teams (re-use `FeaturedTeams` grid pattern but without the "see all" link), then a `CTASection` linking to `/contact` for joining.

- [ ] **Step 2: Commit**

```bash
git add src/pages/teams.astro
git commit -m "feat: Teams index page"
```

## Task 4.4: `/partners` page

**Files:**
- Create: `src/pages/partners.astro`

- [ ] **Step 1: Write page**: `PageHeader`, tier explainers (Founding / Corporate / Supporter / National Lab), placeholder logo grids per tier, "Why partner" section with 3 benefits (talent, research, projects), `CTASection` linking to `/contact` for partnership inquiries.

- [ ] **Step 2: Commit**

```bash
git add src/pages/partners.astro
git commit -m "feat: Partners page with tiers and engagement CTA"
```

## Task 4.5: `/contact` page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write page**: `PageHeader`, contact cards for program email + 2 faculty, a "Get involved" section listing 3 paths (prospective student, current student, industry partner) each with an email link. Inquiry form is out of scope for v1 (no backend); use mailto links.

- [ ] **Step 2: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: Contact page with email-only CTAs"
```

**Phase 4 complete.** All Tier 1 interior pages render.

---

# Phase 5: Tier 2 pages (Courses, Faculty, Research, Students, News)

## Task 5.1: `/courses` catalog page + `CourseCard.astro`

**Files:**
- Create: `src/components/CourseCard.astro`
- Create: `src/pages/courses.astro`

- [ ] **Step 1: Write `CourseCard.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
export interface Props {
  course: CollectionEntry<'courses'>;
}
const { course } = Astro.props;
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const slug = course.id.replace(/\.md$/, '');
---

<a
  href={`${base}/courses/${slug}/`}
  class="block rounded border border-(--color-mines-pale-blue) bg-white p-6 transition-colors hover:border-(--color-mines-red)"
>
  <div class="flex items-baseline justify-between">
    <span class="text-xs font-bold uppercase tracking-wider text-(--color-mines-red)">{course.data.code}</span>
    <span class="text-xs text-(--color-caption)">{course.data.credits} cr.</span>
  </div>
  <h3 class="mt-2 text-lg font-bold text-(--color-mines-blue)">{course.data.name}</h3>
  {course.data.semesters.length > 0 && (
    <p class="mt-2 text-xs text-(--color-caption)">Offered: {course.data.semesters.join(', ')}</p>
  )}
  {course.data.developedBy && (
    <p class="mt-1 text-xs text-(--color-caption)">Developed by: {course.data.developedBy}</p>
  )}
</a>
```

- [ ] **Step 2: Write `/courses` page**: `PageHeader`, grid of all 8 courses sorted by `order`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CourseCard.astro src/pages/courses.astro
git commit -m "feat: Courses catalog page + CourseCard"
```

## Task 5.2: `/faculty` page + `FacultyCard.astro`

**Files:**
- Create: `src/components/FacultyCard.astro`
- Create: `src/pages/faculty.astro`

- [ ] **Step 1: Write `FacultyCard.astro`**

```astro
---
import type { FacultyMember } from '../data/faculty';
export interface Props {
  person: FacultyMember;
}
const { person } = Astro.props;
---

<article class="flex flex-col md:flex-row gap-6 rounded border border-(--color-mines-pale-blue) bg-white p-6">
  {person.headshot && (
    <img
      src={person.headshot}
      alt={`Headshot of ${person.name}`}
      class="h-32 w-32 md:h-40 md:w-40 rounded object-cover flex-shrink-0"
      loading="lazy"
    />
  )}
  <div>
    <h2 class="text-xl font-bold text-(--color-mines-blue)">{person.name}</h2>
    <p class="text-sm font-semibold text-(--color-mines-red)">{person.title}</p>
    {person.credentials && <p class="text-xs text-(--color-caption)">{person.credentials}</p>}
    <p class="mt-3 text-sm text-(--color-body)">{person.bio}</p>
    <p class="mt-3 text-sm">
      <a href={`mailto:${person.email}`} class="font-semibold text-(--color-mines-red) underline underline-offset-4">{person.email}</a>
    </p>
    {person.expertise.length > 0 && (
      <div class="mt-4">
        <p class="text-xs font-bold uppercase tracking-wider text-(--color-caption)">Expertise</p>
        <ul class="mt-1 flex flex-wrap gap-2" role="list">
          {person.expertise.map(e => (
            <li class="rounded bg-(--color-mines-pale-blue) px-2 py-1 text-xs font-semibold text-(--color-mines-blue)">{e}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</article>
```

- [ ] **Step 2: Write `/faculty` page**: `PageHeader`, stacked `FacultyCard`s for Duran and Brodsky.

- [ ] **Step 3: Commit**

```bash
git add src/components/FacultyCard.astro src/pages/faculty.astro
git commit -m "feat: Faculty page + FacultyCard (Duran, Brodsky)"
```

## Task 5.3: `/research` page

**Files:**
- Create: `src/pages/research.astro`

- [ ] **Step 1: Write page**: `PageHeader`, intro paragraph about research focus (powertrains, batteries, autonomy), pulled news tagged `research`, capstone project highlights (3 placeholders), `CTASection` to contact for collaboration.

- [ ] **Step 2: Commit**

```bash
git add src/pages/research.astro
git commit -m "feat: Research page (focus areas, news, capstone highlights)"
```

## Task 5.4: `/students` page

**Files:**
- Create: `src/pages/students.astro`

- [ ] **Step 1: Write page**: `PageHeader`, 3-column strip (Independent study / Team involvement / Graduate research) each with a short paragraph and CTA, placeholder spotlight callouts for 3 students, where-they-went aggregate text ("our grads go to..."), `CTASection`.

- [ ] **Step 2: Commit**

```bash
git add src/pages/students.astro
git commit -m "feat: Students page (paths, spotlights, outcomes)"
```

## Task 5.5: `/news` index page

**Files:**
- Create: `src/pages/news/index.astro`

- [ ] **Step 1: Write page**: `PageHeader`, all news posts sorted desc by pubDate, rendered as `NewsCard` grid.

- [ ] **Step 2: Commit**

```bash
git add src/pages/news/index.astro
git commit -m "feat: News index page"
```

**Phase 5 complete.** All Tier 2 pages render.

---

# Phase 6: Dynamic detail pages

Three dynamic routes using `getStaticPaths` from content collections.

## Task 6.1: `/teams/[slug]` detail page

**Files:**
- Create: `src/pages/teams/[...slug].astro`

- [ ] **Step 1: Write dynamic team detail page**

```astro
---
import { getCollection, type CollectionEntry, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';
import Footer from '../../components/Footer.astro';
import PageHeader from '../../components/PageHeader.astro';
import CTASection from '../../components/CTASection.astro';

export async function getStaticPaths() {
  const teams = await getCollection('teams');
  return teams.map(team => ({
    params: { slug: team.id.replace(/\.md$/, '') },
    props: { team }
  }));
}

interface Props { team: CollectionEntry<'teams'> }
const { team } = Astro.props;
const { Content } = await render(team);
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
---

<BaseLayout
  title={team.data.title}
  description={team.data.description}
  heroImage={team.data.heroImage}
  canonicalPath={`/teams/${team.id.replace(/\.md$/, '')}/`}
  pageType="article"
>
  <Nav slot="nav" currentPath={Astro.url.pathname} />

  <PageHeader
    title={team.data.title}
    lead={team.data.description}
    breadcrumb={[
      { label: 'Home', href: `${base}/` },
      { label: 'Teams', href: `${base}/teams/` },
      { label: team.data.shortName }
    ]}
  />

  {team.data.heroImage && (
    <div class="mx-auto max-w-(--container-bleed) px-6 -mt-8">
      <img src={team.data.heroImage} alt={team.data.heroAlt ?? team.data.title} class="w-full aspect-[21/9] object-cover rounded" loading="lazy" />
    </div>
  )}

  <section class="mx-auto max-w-3xl px-6 py-16 prose prose-lg prose-headings:font-bold prose-headings:text-(--color-mines-blue) prose-a:text-(--color-mines-red)">
    <Content />
  </section>

  {team.data.gallery && team.data.gallery.length > 0 && (
    <section class="bg-(--color-mines-pale-blue)/40">
      <div class="mx-auto max-w-(--container-content) px-6 py-16">
        <h2 class="text-2xl font-bold text-(--color-mines-blue)">Gallery</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-2">
          {team.data.gallery.map(g => (
            <figure>
              <img src={g.src} alt={g.alt} class="w-full aspect-[4/3] object-cover rounded" loading="lazy" />
              {g.caption && <figcaption class="mt-2 text-sm text-(--color-caption)">{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )}

  <CTASection
    headline={`Join ${team.data.shortName}`}
    primary={{ href: `${base}/contact/`, label: 'Get in touch' }}
    secondary={{ href: `${base}/teams/`, label: 'Other teams' }}
  />

  <Footer slot="footer" />
</BaseLayout>
```

- [ ] **Step 2: Build and verify all 4 team slugs render**

```bash
npm run build
ls dist/teams
```

Expected: `fsae`, `shell-eco-marathon`, `battery-workforce-challenge`, `ecocar` directories present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/teams/
git commit -m "feat: /teams/[slug] dynamic detail pages"
```

## Task 6.2: `/courses/[slug]` detail page

**Files:**
- Create: `src/pages/courses/[...slug].astro`

- [ ] **Step 1: Write**. Same pattern as team detail, adjusted fields (course code, credits, semesters, prerequisites, instructor, open-materials link). Breadcrumb: Home / Courses / MEGN XXX.

- [ ] **Step 2: Build, verify 8 slugs**

```bash
npm run build
ls dist/courses
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/courses/
git commit -m "feat: /courses/[slug] dynamic detail pages"
```

## Task 6.3: `/news/[slug]` detail page

**Files:**
- Create: `src/pages/news/[...slug].astro`

- [ ] **Step 1: Write**. Same pattern, fields: title, description, pubDate, updatedDate, tags, category. Prose rendered from markdown body. Breadcrumb: Home / News / <title>.

- [ ] **Step 2: Build, verify seed posts render**

```bash
npm run build
ls dist/news
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/news/
git commit -m "feat: /news/[slug] dynamic detail pages"
```

**🎯 Milestone 2: Full site.** All 11 static + 15 dynamic pages render. Every route is reachable from nav or footer. Demoable. Stop here for Adam review before moving to export pipeline + CI + deploy if desired.

---

# Phase 7: Content export pipeline

Produces per-page markdown and HTML artifacts, content map, brand compliance doc, and zippable handoff bundle.

## Task 7.1: Export script skeleton + route enumeration

**Files:**
- Create: `scripts/export-content.ts`
- Create: `scripts/lib/routes.ts`

- [ ] **Step 1: Install export deps**

```bash
npm install -D tsx jsdom @types/jsdom unified remark-parse remark-stringify mdast-util-to-markdown archiver @types/archiver
```

- [ ] **Step 2: Write `scripts/lib/routes.ts`** that enumerates every page route by walking `dist/` after a build and listing `index.html` files. Emit `{ slug, htmlPath }[]`.

```typescript
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
```

- [ ] **Step 3: Write `scripts/export-content.ts` skeleton**

```typescript
import { mkdirSync, writeFileSync, existsSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { enumerateRoutes } from './lib/routes.js';
import { htmlToMarkdown } from './lib/md.js';
import { extractSemanticHTML } from './lib/html.js';
import { writeContentMap } from './lib/content-map.js';
import { writeBrandNotes } from './lib/brand-notes.js';

const distDir = 'dist';
const outDir = 'exports';
const pagesDir = join(outDir, 'pages');
const mediaDir = join(outDir, 'media');

mkdirSync(pagesDir, { recursive: true });
mkdirSync(mediaDir, { recursive: true });

const routes = enumerateRoutes(distDir);
console.log(`Found ${routes.length} routes to export.`);

for (const route of routes) {
  const slug = route.slug.replace(/\//g, '--') || 'home';
  const md = htmlToMarkdown(route.htmlPath);
  const html = extractSemanticHTML(route.htmlPath);
  writeFileSync(join(pagesDir, `${slug}.md`), md);
  writeFileSync(join(pagesDir, `${slug}.html`), html);
  console.log(`Wrote ${slug}.md and ${slug}.html`);
}

// Copy all images from dist to media
const distImages = join(distDir, 'images');
if (existsSync(distImages)) {
  for (const f of readdirSync(distImages)) {
    copyFileSync(join(distImages, f), join(mediaDir, f));
  }
}

writeContentMap(outDir, routes);
writeBrandNotes(outDir);

console.log('Export complete.');
```

- [ ] **Step 4: Add `export` script to package.json**

```json
{
  "scripts": {
    "export": "npm run build && tsx scripts/export-content.ts"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add scripts/ package.json package-lock.json
git commit -m "feat: export-content skeleton + route enumeration"
```

## Task 7.2: Markdown + HTML extractors

**Files:**
- Create: `scripts/lib/md.ts`
- Create: `scripts/lib/html.ts`

- [ ] **Step 1: Write `scripts/lib/html.ts`**

```typescript
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

export function extractSemanticHTML(htmlPath: string): string {
  const html = readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(html);
  const main = dom.window.document.querySelector('main');
  if (!main) return '';

  // Strip all class, style, data-* attributes
  main.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (['class', 'style'].includes(attr.name) || attr.name.startsWith('data-')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return main.innerHTML.trim();
}
```

- [ ] **Step 2: Write `scripts/lib/md.ts`** that parses the same `main` element and converts to structured markdown with labeled Divi blocks. Basic approach: walk children of main, map known component hooks (by `aria-label` or role) to bracketed labels like `## [HERO HEADLINE]`, emit markdown for text content.

```typescript
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

export function htmlToMarkdown(htmlPath: string): string {
  const html = readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const main = doc.querySelector('main');
  if (!main) return '';

  const title = doc.querySelector('title')?.textContent ?? 'Untitled';
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

  const lines: string[] = [
    `# [PAGE] ${title.replace(/\s*\|\s*Mines Automotive Engineering$/, '')}`,
    '',
    `[Meta description]: ${desc}`,
    '',
    `[Divi template: standard interior page]`,
    ''
  ];

  // Walk top-level sections of main
  for (const section of main.querySelectorAll(':scope > section')) {
    const h2 = section.querySelector('h2, h1');
    const label = (h2?.textContent ?? 'Section').trim();
    lines.push(`## [Section] ${label}`);
    // Pull paragraphs
    for (const p of section.querySelectorAll('p')) {
      const t = (p.textContent ?? '').trim();
      if (t) lines.push('', t);
    }
    // Pull lists
    for (const ul of section.querySelectorAll('ul, ol')) {
      lines.push('');
      for (const li of ul.querySelectorAll(':scope > li')) {
        lines.push(`- ${(li.textContent ?? '').trim()}`);
      }
    }
    // Pull links (as CTA hints)
    for (const a of section.querySelectorAll('a.inline-flex, a[role="button"]')) {
      const href = a.getAttribute('href');
      const label = (a.textContent ?? '').trim();
      if (label && href) {
        lines.push('', `[CTA] "${label}" → ${href}`);
      }
    }
    lines.push('');
  }

  // Style rules block
  lines.push(
    '---',
    '## Content style rules',
    '- No em-dashes. Replace with commas, colons, or restructured sentences.',
    '- No emojis.',
    '- American English spelling.',
    '- Title case for page titles. Sentence case for headings.',
    ''
  );

  return lines.join('\n');
}
```

- [ ] **Step 3: Run export, inspect output**

```bash
npm run export
cat exports/pages/home.md | head -30
cat exports/pages/home.html | head -30
```

Expected: home.md shows labeled blocks; home.html shows clean semantic HTML with no Tailwind classes.

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/md.ts scripts/lib/html.ts exports/.gitkeep
git commit -m "feat: markdown and HTML extractors for export pipeline"
```

(Note: `exports/` itself is gitignored; we use a `.gitkeep` to preserve the folder in case anyone clones fresh.)

## Task 7.3: Content map and brand compliance doc

**Files:**
- Create: `scripts/lib/content-map.ts`
- Create: `scripts/lib/brand-notes.ts`

- [ ] **Step 1: Write `content-map.ts`** that emits a markdown table of route → target Divi template → required assets → copy source file. It walks routes and a static table of Divi template recommendations.

- [ ] **Step 2: Write `brand-notes.ts`** that emits `exports/brand-compliance-notes.md` with a static list of every color, font, spacing, and logo decision keyed against the Mines brand guide URL.

- [ ] **Step 3: Run export, verify both files present**

```bash
npm run export
ls exports/
```

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/content-map.ts scripts/lib/brand-notes.ts
git commit -m "feat: content-map and brand-compliance-notes in export bundle"
```

## Task 7.4: Bundle command

**Files:**
- Create: `scripts/bundle-export.ts`

- [ ] **Step 1: Write `bundle-export.ts`** using `archiver` to zip `exports/` to `exports/mines-automotive-handoff-<date>.zip`.

- [ ] **Step 2: Add script to package.json**

```json
"export:bundle": "npm run export && tsx scripts/bundle-export.ts"
```

- [ ] **Step 3: Run**

```bash
npm run export:bundle
ls exports/*.zip
```

- [ ] **Step 4: Commit**

```bash
git add scripts/bundle-export.ts package.json
git commit -m "feat: export:bundle creates handoff zip"
```

**🎯 Milestone 3: Handoff ready.** A Mines comms editor can receive the zip, unzip, and paste content per page into Divi. Stop here for Adam review if desired.

---

# Phase 8: Accessibility CI, link checker, visual regression

## Task 8.1: axe-core CI

**Files:**
- Create: `scripts/a11y-axe.ts`

- [ ] **Step 1: Install**

```bash
npm install -D playwright @axe-core/playwright wait-on
npx playwright install chromium
```

- [ ] **Step 2: Write `scripts/a11y-axe.ts`**

```typescript
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
        console.error(`\n❌ ${url}`);
        for (const v of critical) {
          console.error(`   [${v.impact}] ${v.id}: ${v.description}`);
          v.nodes.forEach(n => console.error(`     ${n.target.join(' ')}`));
        }
        failed++;
      } else {
        console.log(`✓ ${url}`);
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
```

- [ ] **Step 3: Add script**

```json
"test:a11y:axe": "npm run build && tsx scripts/a11y-axe.ts"
```

- [ ] **Step 4: Run locally**

```bash
npm run test:a11y:axe
```

Expected: all routes pass. Fix violations in source components before moving on.

- [ ] **Step 5: Commit**

```bash
git add scripts/a11y-axe.ts package.json package-lock.json
git commit -m "feat: axe-core CI for every rendered route"
```

## Task 8.2: pa11y CI

**Files:**
- Create: `.pa11yci.js`
- Create: `scripts/run-pa11y.ts`

- [ ] **Step 1: Install**

```bash
npm install -D pa11y-ci
```

- [ ] **Step 2: Write `.pa11yci.js`** that dynamically derives URLs from `dist/`

```javascript
const { enumerateRoutes } = require('./scripts/lib/routes.cjs');

const PORT = 4324;
const BASE = `http://localhost:${PORT}/mines-automotive`;
const routes = enumerateRoutes('dist');
const urls = routes.map(r => r.slug === 'home' ? `${BASE}/` : `${BASE}/${r.slug}/`);

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 30000,
    wait: 500
  },
  urls
};
```

- [ ] **Step 3: Compile routes.ts to a CommonJS sibling**

Add a small `.cjs` re-export or compile via `tsx --build`. Simplest: write `scripts/lib/routes.cjs` as a duplicate of `routes.ts` using CommonJS syntax.

- [ ] **Step 4: Write `scripts/run-pa11y.ts`** that boots astro preview, runs pa11y-ci, tears down.

```typescript
import { spawn, execSync } from 'node:child_process';
import waitOn from 'wait-on';

const PORT = 4324;
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'inherit', shell: true });

await waitOn({ resources: [`http://localhost:${PORT}/mines-automotive/`], timeout: 30000 });
try {
  execSync('npx pa11y-ci', { stdio: 'inherit' });
} finally {
  server.kill();
}
```

- [ ] **Step 5: Add script**

```json
"test:a11y:pa11y": "npm run build && tsx scripts/run-pa11y.ts"
```

- [ ] **Step 6: Run, commit**

```bash
npm run test:a11y:pa11y
git add .pa11yci.js scripts/run-pa11y.ts scripts/lib/routes.cjs package.json package-lock.json
git commit -m "feat: pa11y CI on all routes"
```

## Task 8.3: Lighthouse CI

**Files:**
- Create: `lighthouserc.cjs`

- [ ] **Step 1: Install**

```bash
npm install -D @lhci/cli
```

- [ ] **Step 2: Write `lighthouserc.cjs`**

```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/mines-automotive/',
        'http://localhost/mines-automotive/about/',
        'http://localhost/mines-automotive/curriculum/',
        'http://localhost/mines-automotive/teams/',
        'http://localhost/mines-automotive/teams/fsae/'
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.85 }]
      }
    },
    upload: { target: 'temporary-public-storage' }
  }
};
```

- [ ] **Step 3: Add script**

```json
"test:a11y:lh": "npm run build && lhci autorun"
```

- [ ] **Step 4: Run, commit**

```bash
npm run test:a11y:lh
git add lighthouserc.cjs package.json package-lock.json
git commit -m "feat: Lighthouse CI with score gates (95/95/95/85)"
```

## Task 8.4: Lychee link checker

**Files:**
- Create: `.github/workflows/links.yml` (placeholder, wired in Phase 9)

- [ ] **Step 1: Document command to use in CI**

```bash
lychee --no-progress --max-concurrency 8 './dist/**/*.html'
```

- [ ] **Step 2: Commit** (we'll wire to Actions in Phase 9)

## Task 8.5: Aggregate `test:a11y` script

- [ ] **Step 1: Update package.json**

```json
"test:a11y": "npm run test:a11y:axe && npm run test:a11y:pa11y && lhci autorun"
```

- [ ] **Step 2: Run locally, fix any failures**

```bash
npm run test:a11y
```

Expected: all checks pass. If not, fix the offending component/page before proceeding.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: aggregate test:a11y script"
```

**Phase 8 complete.** CI checks defined; next phase wires them to GitHub Actions.

---

# Phase 9: Deployment + preview banner + sitemap + final audit

## Task 9.1: Preview banner (rendered by BaseLayout, not per-page)

Place the banner directly inside `BaseLayout.astro` so it renders on every page automatically. No per-page slot wiring required. This eliminates the risk of forgetting to add it to a new page.

**Files:**
- Create: `src/components/PreviewBanner.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write `PreviewBanner.astro`**

```astro
<aside role="status" aria-label="Mockup site notice" class="bg-(--color-mines-red) text-white text-center text-xs font-semibold py-2 px-4">
  Mockup / preview site. Final site will be hosted at mines.edu.
</aside>
```

- [ ] **Step 2: Import and render inside `BaseLayout.astro`**

Edit `src/layouts/BaseLayout.astro`. At the top of the frontmatter script add:

```astro
import PreviewBanner from '../components/PreviewBanner.astro';
```

In the body, immediately after the `<body>` opening tag and before `<a href="#main" class="skip-link">`, render the banner:

```astro
<body class="text-(--color-body) bg-white">
    <PreviewBanner />
    <a href="#main" class="skip-link">Skip to main content</a>
    ...
```

The `<slot name="banner" />` slot can be kept for any page that wants to add an extra banner, or removed. Default is now always-on.

- [ ] **Step 3: Verify on every page**

```bash
npm run build
grep -l "Mockup / preview site" dist -r | head -5
```

Expected: banner text appears in every page's HTML.

- [ ] **Step 4: Commit**

```bash
git add src/components/PreviewBanner.astro src/layouts/BaseLayout.astro
git commit -m "feat: preview banner rendered by BaseLayout (every page)"
```

## Task 9.2: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `.github/workflows/a11y.yml`

- [ ] **Step 1: Write `deploy.yml`** adapted from `professor-duran.github.io`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `a11y.yml`** that runs on every PR: builds, serves, runs axe + pa11y + Lighthouse, blocks merge on failure.

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "ci: GitHub Actions for deploy + a11y gate on PRs"
```

## Task 9.3: Sitemap integration

- [ ] **Step 1:** `@astrojs/sitemap` is already in astro.config.mjs. Verify build emits `sitemap-index.xml`

```bash
npm run build
ls dist/sitemap*.xml
```

- [ ] **Step 2: Note the intentional tension.** `@astrojs/sitemap` generates `sitemap-index.xml` with every route, but `robots.txt` has `Disallow: /` and every page carries `<meta name="robots" content="noindex, nofollow" />`. This is intentional: the sitemap is a convenience artifact for Mines comms (a list of URLs to recreate in Divi), not a search-engine directive. Because robots.txt disallows all crawling on this preview URL, search engines will not fetch or consume the sitemap. Add a note to `README.md` clarifying this for reviewers:

```markdown
## Why there's a sitemap if the site is noindex

The `sitemap-index.xml` is generated as a reference artifact for Mines Communications and Marketing during handoff. Search engines cannot see it because `robots.txt Disallow: /` blocks the whole preview URL.
```

- [ ] **Step 3: Commit** the README note

```bash
git add README.md
git commit -m "docs: explain sitemap vs. noindex posture in README"
```

## Task 9.4: Final audit

- [ ] **Step 1: Run full check**

```bash
npm run test:a11y
npm run build
npx lychee './dist/**/*.html'
```

- [ ] **Step 2: Fix any issues.** Rerun until clean.

- [ ] **Step 3: Push**

```bash
git push
```

Expected: GitHub Actions runs, deploys to `https://professor-duran.github.io/mines-automotive/`, preview banner shows on every page, site is robots-blocked, all CI checks green.

- [ ] **Step 4: Final spot check**
  - Hit preview URL in an incognito window
  - Verify preview banner on every page
  - Verify `view-source:` shows `<meta name="robots" content="noindex, nofollow" />`
  - Verify `robots.txt` returns `Disallow: /`
  - Run a manual Lighthouse audit in Chrome DevTools on the live URL; all 4 scores ≥ 95 (or Performance ≥ 85)

**🎯 Milestone 4: Production-ready mockup.** Site is live at preview URL, non-indexable, fully accessible, all pages render, handoff bundle builds on demand. Ready for Mines comms conversation.

---

## Appendix: directory structure at end

```
mines-automotive/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── a11y.yml
├── .gitignore
├── .pa11yci.json
├── CLAUDE.md
├── README.md
├── astro.config.mjs
├── docs/
│   └── superpowers/
│       ├── plans/
│       │   └── 2026-04-15-mines-automotive-site.md
│       └── specs/
│           └── 2026-04-15-mines-automotive-site-design.md
├── lighthouserc.cjs
├── package.json
├── public/
│   ├── favicon.svg
│   ├── images/
│   └── robots.txt
├── scripts/
│   ├── a11y-axe.ts
│   ├── bundle-export.ts
│   ├── export-content.ts
│   └── lib/
│       ├── brand-notes.ts
│       ├── content-map.ts
│       ├── html.ts
│       ├── md.ts
│       └── routes.ts
├── src/
│   ├── components/
│   │   ├── BaseLayout.astro
│   │   ├── CTASection.astro
│   │   ├── CourseCard.astro
│   │   ├── FacultyCard.astro
│   │   ├── FeaturedTeams.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Nav.astro
│   │   ├── NewsCard.astro
│   │   ├── PageHeader.astro
│   │   ├── PartnerStrip.astro
│   │   ├── PhotoTextRow.astro
│   │   ├── PillarGrid.astro
│   │   ├── PreviewBanner.astro
│   │   ├── RecentNews.astro
│   │   └── StatStrip.astro
│   ├── content/
│   │   ├── courses/      (8 markdown files)
│   │   ├── news/         (3+ markdown files)
│   │   ├── partners/     (4 markdown files, placeholders)
│   │   └── teams/        (4 markdown files)
│   ├── content.config.ts
│   ├── data/
│   │   ├── faculty.ts
│   │   └── stats.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── courses.astro
│   │   ├── courses/
│   │   │   └── [...slug].astro
│   │   ├── curriculum.astro
│   │   ├── faculty.astro
│   │   ├── index.astro
│   │   ├── news/
│   │   │   ├── [...slug].astro
│   │   │   └── index.astro
│   │   ├── partners.astro
│   │   ├── research.astro
│   │   ├── students.astro
│   │   ├── teams.astro
│   │   └── teams/
│   │       └── [...slug].astro
│   └── styles/
│       ├── global.css
│       └── tokens.css
└── tsconfig.json
```
