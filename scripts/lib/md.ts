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
      const linkLabel = (a.textContent ?? '').trim();
      if (linkLabel && href) {
        lines.push('', `[CTA] "${linkLabel}" → ${href}`);
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
