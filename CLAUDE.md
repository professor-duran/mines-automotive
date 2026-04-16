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

WCAG 2.1 AA is a release gate. Every PR must pass axe, pa11y, and Lighthouse (>=95 accessibility score). See `scripts/a11y-check.ts`.

## Content voice

Institutional Mines voice, data-forward. Lead with numbers and outcomes. Readable by prospective students, current students, and industry partners simultaneously.

## Tech

Astro 6, Tailwind v4, TypeScript strict, Node 22+. Zero JS on pages where possible.
