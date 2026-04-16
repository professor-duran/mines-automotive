# Mines Automotive Engineering Program, Site Design Spec

**Date:** 2026-04-15
**Owner:** Adam W. Duran, P.E., PMP. Assistant Teaching Professor of Mechanical Engineering, Co-Founder and Co-Director of the Automotive Engineering Program.
**Co-Lead:** Prof. Polina Brodsky, Co-Lead of the Automotive Engineering Program.
**Status:** Design approved, awaiting spec review.
**Target repo:** `professor-duran/mines-automotive`
**Target preview URL:** `https://professor-duran.github.io/mines-automotive/`
**Eventual home:** a subdomain or section of `mines.edu` managed by Mines Communications and Marketing on WordPress + Divi.

---

## 1. Goal

Build a comprehensive, Mines-brand-compliant mockup website for the Colorado School of Mines Automotive Engineering Program. The mockup serves three purposes:

1. **Recruiting.** Make the program visible and compelling to prospective undergraduates, current Mines students, and industry partners.
2. **Negotiation tool.** Give Mines Communications and Marketing a concrete visual reference for what the program's eventual WordPress/Divi site should contain and look like.
3. **Content handoff package.** Produce ready-to-paste copy, structured HTML, and an asset bundle that a Mines comms editor can drop into Divi field-by-field.

The mockup is a staging artifact, not the final production site. It must not be indexed by search engines while in preview.

## 2. Audiences

Three audiences, roughly equal weight:

- **Prospective undergraduate students** considering Mines ME or adjacent programs.
- **Current Mines students** deciding whether to declare the automotive track.
- **Industry partners and sponsors** (OEMs, Tier 1 suppliers, DOE national laboratories).

Tone: institutional Mines voice, but data-forward (lead with numbers and outcomes). Readable by all three audiences without tonal gymnastics.

## 3. Success criteria

- All 6 primary navigation pages, all 5 secondary pages, and dynamic detail pages for the 4 competition teams and 8 courses render without errors and pass WCAG 2.1 AA.
- Every visual decision maps to a Mines brand guide citation (colors, fonts, logo usage, spacing).
- `npm run export` produces per-page `.md` and `.html` artifacts for every rendered route (static and dynamic), a content map, brand compliance notes, and a media bundle that a Mines comms editor can use without needing to reach back to the project for clarification.
- Site loads in under 1.5s on a 3G connection for the homepage (Lighthouse mobile target).
- Lighthouse scores: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.
- Zero axe-core critical or serious violations.
- Preview URL is live on GitHub Pages, publicly reachable, but robots-blocked and tagged `noindex, nofollow`.

## 4. Non-goals

Explicit, so we don't scope-creep:

- **Dark mode.** Mines brand guide does not specify it. Site is light-only.
- **Live WordPress/Divi deploy.** Mines comms does that with their stack. We produce a handoff bundle and stop there.
- **CMS / admin UI.** Content lives in markdown files in the repo. No Sanity, Contentful, or WP backend during mockup phase.
- **Authentication / student portal.** Out of scope. If needed later, Mines has its own auth systems.
- **E-commerce / sponsorship payment.** Partners page links to Mines Foundation for gifts. We do not handle transactions.
- **Mailing list / newsletter signup.** Deferred. Can add later when Mines provides the right Formstack/HubSpot endpoint.
- **Search.** Deferred. Site is small enough that nav + sitemap is sufficient for v1.
- **Analytics.** Deferred until the site moves to mines.edu and Mines' own GA4 / GTM is available.
- **Public framework references.** The user's TWI, EPI, MESA, EMBL frameworks are not referenced anywhere on the site.

## 5. Information architecture

Three tiers of pages.

### Tier 1, top navigation (6 items)

| Route | Purpose |
|---|---|
| `/` | Home. Program summary, hero, stats, featured teams, recent news. |
| `/about` | Program overview, 3-pillar framework, history, faculty snapshot. |
| `/curriculum` | Track requirements, course sequence, pillar-to-course mapping. Summary view. |
| `/teams` | Competition team overview + links to team detail pages. |
| `/partners` | Industry partners, sponsorship tiers, how-to-engage. |
| `/contact` | Contact info, get-involved CTAs, affiliate inquiry form. |

### Tier 2, secondary pages (linked from Tier 1, footer sitemap)

| Route | Purpose |
|---|---|
| `/courses` | Full catalog of the 8 automotive-track courses. `/curriculum` links here for detail. |
| `/faculty` | Faculty profiles (Adam Duran, Polina Brodsky, affiliated). |
| `/research` | Research projects, capstone highlights, publication callouts. |
| `/students` | Student spotlight index, outcomes, where-they-went. |
| `/news` | News + events index. |

**Relationship between `/curriculum` and `/courses`:** `/curriculum` is a narrative overview that explains the 3-pillar framework, how courses map to pillars, and the student journey. `/courses` is the catalog. `/curriculum` links to `/courses` for detail and to specific `/courses/[slug]` pages for each course.

### Tier 3, dynamic detail pages

- `/teams/[slug]`. One page per team: FSAE, Shell Eco-marathon, Battery Workforce Challenge, EcoCAR Innovation Challenge.
- `/courses/[slug]`. One page per course, linked to open-materials GitHub repos where available. See Appendix A for the canonical 8-course list.
- `/news/[slug]`. Individual news posts.

### Navigation

- **Top bar:** Home, About, Curriculum, Teams, Partners, Contact (6 items, matches Mines convention).
- **Footer:** full sitemap including Tier 2 pages, Mines institutional links, program contact.
- **Mobile:** hamburger menu, full sitemap. Focus trap inside the menu when open.

## 6. Content model

Four Astro content collections + two TypeScript data files.

### Collections (markdown + frontmatter in `src/content/`)

**`teams/`**, one file per competition team.
```
title, shortName, description, role, established, advisors[],
heroImage, heroAlt, thumbnail, logo, order,
gallery[{src, alt, caption?}],
sponsors[], recentResults[],
externalLinks{instagram?, github?, website?}
```

**`courses/`**, one file per course.
```
code (e.g. "MEGN 301"), name, credits, crossList[],
semesters[], prerequisites[], instructor, developedBy,
openMaterialsUrl, order
```

**`news/`**, news posts.
```
title, description, pubDate (Date),
updatedDate? (Date), tags[], heroImage?, draft (default false),
category ("news" | "event" | "student-spotlight")
```

**`partners/`**, one file per partner tier or named partner.
```
name, tier ("founding" | "corporate" | "supporter" | "national-lab"),
logo, description, website, since, order
```

### TypeScript data files (`src/data/`)

**`faculty.ts`.** Array of faculty records (name, title, bio, headshot, email, expertise[], courses[], links). Small fixed list, currently two core faculty (Duran, Brodsky). The list can grow later. Titles constrained to actual academic titles only: Adam Duran is "Assistant Teaching Professor of Mechanical Engineering," never "PhD candidate" or similar.

**`stats.ts`.** Single source of truth for program stats (252 students, 8 courses, 17% of ME, 126:1 ratio, $365K to $827K tuition generated, etc.).

### Page to content mapping

Static pages:

| Page | Data sources |
|---|---|
| `/` Home | `stats.ts`, featured news (3), featured teams (3) |
| `/about` | hardcoded copy + `stats.ts` |
| `/curriculum` | hardcoded 3-pillar copy + courses collection (summary) |
| `/teams` | teams collection (index) |
| `/courses` | courses collection (catalog) |
| `/faculty` | `faculty.ts` |
| `/research` | hardcoded copy + news filtered by tag `research` |
| `/partners` | partners collection |
| `/students` | hardcoded hero + news filtered by category `student-spotlight` |
| `/news` | news collection (index) |
| `/contact` | hardcoded |

Dynamic detail pages:

| Route | Data source |
|---|---|
| `/teams/[slug]` | teams collection (one entry per slug) |
| `/courses/[slug]` | courses collection (one entry per slug) |
| `/news/[slug]` | news collection (one entry per slug) |

## 7. Visual system

Strict Mines brand compliance. Modern layout within the brand.

### Colors (CSS custom properties)

```css
--color-mines-blue: #21314D;        /* primary */
--color-mines-light-blue: #92A2BD;  /* primary */
--color-mines-red: #D2492A;         /* accent */
--color-mines-deep-blue: #263F6A;   /* secondary, dark hero overlays */
--color-mines-pale-blue: #CED5DD;   /* secondary, card backgrounds */
--color-mines-gray: #B2B4B3;        /* secondary, captions, borders */
--color-mines-silver: #8B8D8E;      /* secondary, metallic accents */
--color-white: #FFFFFF;
--color-body: #2D2D2D;
```

**Red usage rules** (clarified):
- Colorado Red (`#D2492A`) is an accent color, not a section background.
- Permitted uses: bold links, hover underlines, CTA button fills, thin accent lines, stat number highlights, active-state indicators.
- Prohibited uses: full-section backgrounds, hero backgrounds, large colored panels, body text color on white.
- CTA buttons using red as a fill are allowed (this is how Mines uses red on brand.mines.edu); the "never background" rule refers to large surface areas, not interactive component fills.

**Secondary color usage:** Secondary colors (deep blue, pale blue, gray, silver) collectively capped at roughly 10% of any page's color composition, per Mines brand.

**Source:** Mines Branding 101, published by Mines Communications and Marketing, referenced at `https://brand.mines.edu/`.

### Typography

- **Open Sans** (loaded from Google Fonts), weights 400, 500, 600, 700.
- Headings: 700 (h1, h2), 600 (h3, h4).
- Body: 400.
- Captions and metadata: 500.
- Fallback: `"Open Sans", Arial, sans-serif`.
- No serif font. Mines brand is strictly sans for web.

### Layout

- 12-column grid, max-width 1280px for content, 1440px for full-bleed sections.
- Generous white space per Mines brand.
- Section padding: 80px top/bottom desktop, 48px mobile.
- Card radii: 4px.
- Borders: 1px solid `--color-mines-pale-blue`.
- Shadows: minimal, hover states only.

### Homepage hero

- Full-bleed photo (FSAE car on track) with dark-blue overlay at ~70% opacity.
- White headline, left-aligned, Open Sans 700, ~56px desktop.
- Subheadline in light blue (`#92A2BD`), Open Sans 400, ~20px.
- Two CTAs: primary (Colorado Red fill, white bold text, minimum 16px) and secondary (white outline, white text).
- Thin red accent line (3px by 64px) above headline: Mines visual signature.

### Interior page pattern

- White background.
- Dark blue page title on pale-blue band, ~120px tall.
- Three-pillar or card grids for content.
- Stat callout strips with red accent numbers on white.
- Alternating photo + text rows for long-form sections.

### Accessibility

- WCAG 2.1 AA target.
- Mines Blue (`#21314D`) on white: 9.8:1 contrast, passes AAA.
- Colorado Red on white for text: 4.1:1 contrast. Used only for bold-weight links at 14px or larger, where the bold weight meets the "large text" threshold (3:1 AA). Never used for normal-weight body copy.
- Colorado Red as button fill with white bold text: 4.1:1 contrast. Used only with bold weight and minimum 16px text size to satisfy AA large-text requirements.
- `lang="en"` on `<html>`. One `<h1>` per page. One `<main>` per page. Heading levels never skip.
- All interactive components: keyboard reachable, aria-labeled, visible focus state.
- `prefers-reduced-motion`: honored by default (no animations on first load; transitions disabled under the query).

## 8. Component library

Fourteen components. All 14 map to standard Divi modules for porting.

| # | Component | Used on | Divi equivalent |
|---|---|---|---|
| 1 | `BaseLayout.astro` | all pages | n/a (structural) |
| 2 | `Nav.astro` | all pages | Divi header template |
| 3 | `Footer.astro` | all pages | Divi footer template |
| 4 | `Hero.astro` | home | Fullwidth Header module |
| 5 | `StatStrip.astro` | home, about, partners | Number Counter modules in a row |
| 6 | `PillarGrid.astro` | home, curriculum | Blurb modules |
| 7 | `FeaturedTeams.astro` | home, teams | Image + Text Blurb modules |
| 8 | `PageHeader.astro` | all interior pages | Text + Divider in colored row |
| 9 | `PhotoTextRow.astro` | about, curriculum, research | Image + Text column row |
| 10 | `CourseCard.astro` | curriculum, courses | Blurb with structured content |
| 11 | `FacultyCard.astro` | faculty, about, team detail | Person / Team Member module |
| 12 | `PartnerLogo.astro` | home, partners | Image Gallery |
| 13 | `CTASection.astro` | most pages, before footer | Fullwidth CTA module |
| 14 | `NewsCard.astro` | home, news | Blog module |

**Intentionally excluded** (present on the personal site but not needed here): ThemeToggle, GrowthCharts, CollaborationSection, BeyondTheLab.

## 9. Tech stack

- **Astro 6** (current latest; matches `professor-duran.github.io` which runs Astro 6.1.6).
- **Tailwind CSS v4** via `@tailwindcss/vite`.
- **`@tailwindcss/typography`** for markdown prose.
- **`@astrojs/sitemap`**.
- **Node 22+**.
- **TypeScript** strict mode.
- **Icons:** `astro-icon` with Lucide icon set.
- **Accessibility tools (CI):** `@axe-core/cli`, `@pa11y/ci`, Lighthouse CI.
- **Export tooling:** Node script using unified/remark + jsdom. No heavier dep needed for markdown + HTML output.

No React, Vue, Svelte runtime. Astro islands only if absolutely necessary. Target zero-JS pages where possible.

## 10. Repo, deployment, handoff

### Repo

- **GitHub:** `professor-duran/mines-automotive` (public).
- **Local path:** `C:\Users\aduran\Downloads\mines-automotive`.
- **License:** "All rights reserved" for content (Mines branding), MIT for code/config. Confirm with Mines comms before handoff.
- Includes `CLAUDE.md`, `README.md`, `docs/` with design spec and brand artifacts.

### Mockup deployment

- **GitHub Pages** via GitHub Actions (same workflow pattern as `professor-duran.github.io`).
- **Preview URL:** `https://professor-duran.github.io/mines-automotive/`.
- **Banner on every page:** *"Mockup / preview site. Final site will be hosted at mines.edu."*
- **`robots.txt`** with `Disallow: /`.
- **`noindex, nofollow`** meta tag on every page.

### Final handoff to Mines comms

- Not our responsibility to deploy to mines.edu.
- We produce: the live Astro mockup as a visual reference, the content export bundle (Section 11), and a content-map document for the Divi editor.

### Branch / commit hygiene

- `main` is always deployable.
- Feature branches for new pages/components.
- No `Co-Authored-By` lines in commits.
- PRs pass axe-core, Lighthouse CI, and Pa11y before merge.

## 11. Content export pipeline

### Goal

Every rendered route in the Astro site produces a companion export artifact that a Mines Divi editor can paste into a WordPress page template field-by-field, with zero reformatting.

### Scope

The export pipeline covers:

- All 11 Tier 1 + Tier 2 static pages.
- Every dynamic detail page (Tier 3): one artifact per team slug, per course slug, per news slug.
- Totals at launch: approximately 11 static + 4 team + 8 course + 5 to 10 news = 28 to 33 exported pages.

### Per-page artifacts

**`exports/pages/<slug>.md`**, structured markdown with labeled blocks:

```
# [PAGE] About the Automotive Program

[Divi template: standard interior page]

## [HERO HEADLINE]
Building the next generation of automotive engineers.

## [HERO SUBHEAD]
A hands-on, industry-connected track at Colorado School of Mines.

## [Divi: number counter x4]
- 252 | declared students
- 8 | new courses
- 17% | of Mines ME track declarations
- 126:1 | student-to-faculty ratio

## [BODY - INTRO]
(markdown body content)

## [CTA PRIMARY]
Text: "Declare the track"
URL: /curriculum
```

**`exports/pages/<slug>.html`**, clean semantic HTML. No Tailwind classes. No Astro scaffolding. Ready to paste into a Divi HTML module.

### Bundle-level artifacts

- **`exports/content-map.md`**, table of page → Divi template → required assets → copy source file.
- **`exports/brand-compliance-notes.md`**, every color, font, layout decision cited against the Mines brand guide URL.
- **`exports/media/`**, all referenced images at production resolution, filenames matching references in the `.md` and `.html` files.

### Commands

- `npm run export`, regenerate all per-page artifacts.
- `npm run export:bundle`, produce a zipped handoff bundle.

### Content style rules enforced by the exporter

- No em-dashes in exported content. Replace with commas, colons, or restructured sentences.
- No emojis.
- American English spelling.
- Title case for page titles, sentence case for section headings and UI labels.
- Numerals for integers ≥10; spelled out for 1 through 9 unless in a stat callout.

### Handoff model

Manual paste into Divi. No WordPress XML import. Keeps the mockup decoupled from Mines infrastructure.

## 12. Accessibility & compliance

WCAG 2.1 AA, enforced in CI before every deploy.

- **axe-core** scan on every rendered page (0 critical, 0 serious violations).
- **Lighthouse CI** minimum scores: Accessibility 95, Best Practices 95, SEO 95.
- **Pa11y** as a second automated tool.
- **Manual keyboard-nav test** on every new component. Covers: tab order, focus traps in mobile menu, skip-to-content, visible focus indicators on every interactive element.
- **NVDA screen-reader spot check** before PR merge (noted in PR template).
- **Color contrast enforced** via Tailwind plugin rule: any pair below 4.5:1 for body text or 3:1 for large text triggers a build warning. Exceptions for the Red-on-white case are documented and limited to bold-weight or 16px+ uses.
- **Semantic HTML** only: proper heading hierarchy, lists, landmarks (`header`, `main`, `nav`, `footer`), skip-to-content link, one `<h1>` per page, one `<main>` per page, no skipped heading levels.
- **Page metadata:** `lang="en"` on `<html>`, unique `<title>` per page, unique `<meta name="description">` per page.
- **Forms** (contact page): labeled inputs, explicit error states, no placeholder-as-label, required-field indicators that do not rely on color alone.
- **Images** with meaningful content: descriptive `alt`. Decorative: `alt=""`.
- **Reduced motion:** all transitions and animations respect `prefers-reduced-motion: reduce`.
- **Landmarks:** unique landmark roles per page (one banner, one main, one contentinfo).

## 13. Testing strategy

- **Unit tests:** not applicable for a content site. Components are simple enough to validate visually and with accessibility tools.
- **Visual regression:** Playwright snapshots of each primary page on desktop and mobile breakpoints (375px, 768px, 1280px).
- **Accessibility:** axe + pa11y + Lighthouse in CI.
- **Link checker:** `lychee` run on every build to catch broken internal and external links.
- **Content sanity:** frontmatter validated via Zod schemas in `content.config.ts`.

## 14. Decisions needed from Adam before implementation

These are scoped to Adam's call before we move to writing the implementation plan.

1. **License choice.** Confirm "All rights reserved" on content + MIT on code/config, or propose different.
2. **Photography.** Adam identifies which additional photos to supply: faculty headshots (Adam, Brodsky), Battery Workforce Challenge team shot, EcoCAR promo image (if available pre-Fall 2026), lab/facilities shots, student-on-car action shots. Placeholders flagged in content-map.md until delivered.
3. **Partner list scope for v1.** Confirm the named partners to include (OEMs, Tier 1 suppliers, national labs) or list only tiers without named logos until partner approvals are secured.
4. **News seed posts.** Confirm which existing news items to surface at launch (competition results, recent awards, student placements).
5. **Footer institutional links.** Confirm which Mines institutional footer links to include while the site is a mockup (copy from mines.edu footer or leave as placeholders).
6. **Course catalog confirmation.** Confirm the 8 automotive-track courses and their exact names before implementation starts, specifically MEGN 300 (whose name/topic is uncertain in the current draft) and EBGN 599A. See Appendix A for the working list.

## 15. Open questions for Mines comms (post-mockup)

Deferred to the handoff conversation with Mines Communications and Marketing.

1. Which subdomain or section? (`mines.edu/mechanical-engineering/automotive/` vs. `people.mines.edu/automotive/` vs. standalone `automotive.mines.edu`.)
2. Does Mines prefer `.docx` handoff over `.html` + `.md`? (If yes, add a pandoc step.)
3. Which Divi theme builder template (if any) is preferred for program sites?
4. What are the approved Google Fonts sets and Google Analytics / Tag Manager IDs?
5. What institutional site footer requirements exist (privacy, Title IX, accessibility statement links) that we must include?
6. Licensing: what attribution and copyright notice does Mines want on content?
7. Logo usage: confirm permission to use the Mines Legacy Triangle and wordmark on a non-mines.edu preview URL during the mockup phase.
8. Photo releases: confirm FERPA-compliant consent process for any current-student imagery.

## 16. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Mines comms rejects the design as off-brand. | Strict brand compliance. Every visual decision cited. We present it as a proposal, not a demand. |
| Eventual Divi build can't match the Astro layout exactly. | Components chosen specifically for Divi-mappability. Visual parity is not required for Tier 2/3 interiors; homepage hero may require custom Divi work. |
| Photography gaps force placeholder images. | Use the 5 existing images as anchors. Flag placeholders in content-map.md. Request specific shots from Adam and Polina as listed in Section 14. |
| Content drift between mockup and final site. | Mockup is a snapshot. Once handed off, Mines comms owns the content. We archive the handoff version and stop editing. |
| Preview URL gets indexed despite `noindex` + robots.txt. | Double layer (robots + meta). Submit URL removal request to Google Search Console if it does appear. |
| Mines logo used on non-mines.edu domain without explicit permission. | Ask Mines comms before adding the official Legacy Triangle/wordmark. Use a neutral program wordmark (text only, Open Sans 700, "Mines Automotive Engineering") during mockup phase until cleared. |
| Student or faculty photos used without FERPA-compliant consent. | No identifiable student faces in mockup until photo releases are confirmed. Default to teams on track / car shots where faces are obscured. Faculty headshots require Adam and Brodsky's explicit approval. |
| Stats drift (e.g., 252 → 260 next semester) with no update plan. | `stats.ts` is the single source of truth. Pre-handoff, sync with latest Mines registrar data. Post-handoff, this is Mines comms' responsibility to maintain. |
| Adam and/or Brodsky availability affects content approval cadence. | Build the site structure and draft copy in parallel. Stage approvals by section (IA, visual, copy) so a delay on one doesn't block others. |

## 17. Dependencies & prerequisites

- Access to brand.mines.edu assets (logos, fonts if licensed). Open Sans is free via Google Fonts. Gotham is not used on web.
- Existing automotive photography (5 images confirmed at `professor-duran.github.io/public/images/`).
- Adam's existing `automotive-program.md` content and `building-mines-automotive-track.md` essay as source copy.
- MEGN 300, MEGN 301, Capstone GitHub repos for course detail content.
- Mines ME site (`mines.edu/mechanical-engineering/`) as a reference for institutional tone and standard content structure.

## 18. Glossary

- **Mines:** Colorado School of Mines, Golden, CO.
- **Mines Communications and Marketing** (shortened as "Mines comms" throughout): the institutional unit responsible for brand and web; Jake Kupiec, Executive Director.
- **Divi:** WordPress theme and page builder by Elegant Themes, currently used by Mines for most department and program sites.
- **Open Sans:** sans-serif typeface used on brand.mines.edu, loaded from Google Fonts.
- **ME:** Mechanical Engineering department at Mines.
- **BWC:** Battery Workforce Challenge, U.S. Department of Energy-sponsored competition.
- **EcoCAR:** EcoCAR Innovation Challenge, U.S. Department of Energy and Stellantis-sponsored competition.
- **FSAE:** Formula SAE, student design competition run by SAE International.
- **Shell Eco-marathon:** student competition focused on energy-efficient vehicle design, sponsored by Shell.
- **Capstone:** EDS 491/492, Mines senior-year Engineering Design Studio capstone sequence taken by Mechanical Engineering students (including automotive-track students).
- **OEM:** Original Equipment Manufacturer (e.g., Stellantis, Ford, GM).
- **Tier 1 supplier:** direct supplier to OEMs (e.g., Bosch, Magna, Continental).
- **DOE:** U.S. Department of Energy.
- **WCAG 2.1 AA:** Web Content Accessibility Guidelines, version 2.1, conformance level AA.
- **axe-core:** open-source accessibility testing engine by Deque.
- **pa11y:** open-source accessibility testing tool by the Pa11y team.
- **Lighthouse:** Google's automated tool for auditing performance, accessibility, SEO, and best practices.
- **lychee:** Rust-based link checker.
- **GA4:** Google Analytics 4.
- **GTM:** Google Tag Manager.
- **CWV:** Core Web Vitals, Google's page experience metrics (LCP, CLS, INP).

## Appendix A. Automotive track course catalog (v1)

The 8 courses referenced throughout this spec, per Adam's prior work building the program. Final course set to be confirmed during implementation; this is the working list.

1. **MEGN 200** (or cross-listed equivalent): Introduction to Automotive Engineering.
2. **MEGN 301:** Automotive Powertrains.
3. **MEGN 300:** name and topic to be confirmed by Adam (see Section 14, item 6).
4. **MEGN 417:** Vehicle Systems Design.
5. **MEGN 455:** Electric & Hybrid Vehicle Systems.
6. **MEGN 456:** Autonomous Vehicle Systems.
7. **MEGN 566:** Advanced Automotive Topics (graduate).
8. **EBGN 599A:** Technology Commercialization for Automotive (cross-listed with Business).

EDS 491/492 (Capstone) is referenced in the `/research` page narrative but is not counted as one of the 8 track-specific courses; it is the general ME capstone that automotive-track students take.

Adam to confirm this course list and adjust MEGN 300's name/topic before the implementation plan is written.
