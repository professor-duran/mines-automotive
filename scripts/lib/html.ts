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
