import { mkdirSync, writeFileSync, existsSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
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

// Copy all images from dist to media (recursively, preserving structure)
function copyTree(srcDir: string, destDir: string) {
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const src = join(srcDir, entry);
    const dest = join(destDir, entry);
    if (statSync(src).isDirectory()) {
      copyTree(src, dest);
    } else {
      copyFileSync(src, dest);
    }
  }
}

const distImages = join(distDir, 'images');
if (existsSync(distImages)) {
  copyTree(distImages, mediaDir);
}

writeContentMap(outDir, routes);
writeBrandNotes(outDir);

console.log('Export complete.');
