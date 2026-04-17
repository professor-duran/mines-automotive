import { readFileSync } from 'node:fs';

// Minimal skeleton. Full semantic extraction implemented in Task 7.2.
export function extractSemanticHTML(htmlPath: string): string {
  const html = readFileSync(htmlPath, 'utf8');
  const match = html.match(/<main[\s\S]*?<\/main>/i);
  return match ? match[0] : '';
}
