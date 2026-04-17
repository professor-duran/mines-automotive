import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Route } from './routes.js';

interface DiviMapping {
  template: string;
  assets: string;
  source: string;
}

// Route pattern to Divi template recommendation mapping. Patterns are matched in order.
const DIVI_MAP: Array<{ test: (slug: string) => boolean; mapping: DiviMapping }> = [
  {
    test: (s) => s === 'home',
    mapping: {
      template: 'Home / Landing (hero, stats strip, 3-col pillars, cards grid, news, CTA)',
      assets: 'Hero image (fsae-track.jpg), 3 pillar icons, 4 team card images, 3 news thumbnails',
      source: 'src/pages/index.astro'
    }
  },
  {
    test: (s) => s === 'about',
    mapping: {
      template: 'Standard interior (hero banner, prose column, stats, leadership grid)',
      assets: 'Leadership headshots (Duran, Brodsky), program-at-a-glance stats',
      source: 'src/pages/about.astro'
    }
  },
  {
    test: (s) => s === 'contact',
    mapping: {
      template: 'Contact page (header, split layout with form and address block)',
      assets: 'Campus map or building photo (optional)',
      source: 'src/pages/contact.astro'
    }
  },
  {
    test: (s) => s === 'curriculum',
    mapping: {
      template: 'Standard interior with filterable card grid',
      assets: 'No images; course cards are text-only',
      source: 'src/pages/curriculum.astro'
    }
  },
  {
    test: (s) => s.startsWith('courses/'),
    mapping: {
      template: 'Course detail (breadcrumb, hero title block, specs table, prose)',
      assets: 'None by default; optional syllabus PDF link',
      source: 'src/content/courses/*.md + src/pages/courses/[slug].astro'
    }
  },
  {
    test: (s) => s === 'faculty',
    mapping: {
      template: 'Faculty grid (header, 2-3 column card grid with headshots)',
      assets: 'Faculty headshots in media/faculty/',
      source: 'src/pages/faculty.astro + src/content/faculty/*.md'
    }
  },
  {
    test: (s) => s === 'teams',
    mapping: {
      template: 'Teams index (header, card grid)',
      assets: 'Team hero images (FSAE, Shell, BWC, EcoCAR)',
      source: 'src/pages/teams/index.astro'
    }
  },
  {
    test: (s) => s.startsWith('teams/'),
    mapping: {
      template: 'Team detail (hero image, overview, roster, recent results, sponsors)',
      assets: 'Team hero image, sponsor logos (handoff list)',
      source: 'src/content/teams/*.md + src/pages/teams/[slug].astro'
    }
  },
  {
    test: (s) => s === 'news',
    mapping: {
      template: 'Blog index (header, chronological article list)',
      assets: 'Optional featured image per post',
      source: 'src/pages/news/index.astro'
    }
  },
  {
    test: (s) => s.startsWith('news/'),
    mapping: {
      template: 'Blog post (breadcrumb, title, date, byline, body)',
      assets: 'Optional featured image',
      source: 'src/content/news/*.md + src/pages/news/[slug].astro'
    }
  },
  {
    test: (s) => s === 'partners',
    mapping: {
      template: 'Standard interior (header, prose, partner logo grid placeholder)',
      assets: 'Partner logos (to be provided by Mines Comms)',
      source: 'src/pages/partners.astro'
    }
  },
  {
    test: (s) => s === 'research',
    mapping: {
      template: 'Standard interior with research focus cards',
      assets: 'Optional lab photos',
      source: 'src/pages/research.astro'
    }
  },
  {
    test: (s) => s === 'students',
    mapping: {
      template: 'Standard interior (paths, spotlights, outcomes)',
      assets: 'Student spotlight headshots (when provided)',
      source: 'src/pages/students.astro'
    }
  }
];

const FALLBACK: DiviMapping = {
  template: 'Standard interior page',
  assets: 'None specified',
  source: 'src/pages/*.astro (see slug)'
};

function lookup(slug: string): DiviMapping {
  for (const { test, mapping } of DIVI_MAP) {
    if (test(slug)) return mapping;
  }
  return FALLBACK;
}

export function writeContentMap(outDir: string, routes: Route[]): void {
  const lines: string[] = [
    '# Content map',
    '',
    'Route to Divi template and required assets mapping for the Mines Automotive site handoff.',
    '',
    `Total routes: ${routes.length}`,
    '',
    '| Route | Target Divi template | Required assets | Copy source |',
    '|-------|----------------------|-----------------|-------------|'
  ];

  const sorted = [...routes].sort((a, b) => a.slug.localeCompare(b.slug));
  for (const route of sorted) {
    const m = lookup(route.slug);
    const routeLabel = route.slug === 'home' ? '/' : `/${route.slug}/`;
    lines.push(`| \`${routeLabel}\` | ${m.template} | ${m.assets} | \`${m.source}\` |`);
  }

  lines.push(
    '',
    '## Handoff notes',
    '',
    '- All structured copy lives in `exports/pages/<slug>.md` with labeled Divi blocks.',
    '- Clean semantic HTML (no Tailwind classes) lives in `exports/pages/<slug>.html`.',
    '- Referenced images are in `exports/media/` and mirror the original `dist/images/` paths.',
    '- Courses, faculty, news, and teams entries are driven by Astro content collections at `src/content/`. For Divi, these map to custom post types or keyword-tagged posts per Mines WP conventions.',
    ''
  );

  writeFileSync(join(outDir, 'content-map.md'), lines.join('\n'));
}
