import { readFileSync } from 'node:fs';

// Minimal skeleton. Full structured markdown extraction implemented in Task 7.2.
export function htmlToMarkdown(htmlPath: string): string {
  const html = readFileSync(htmlPath, 'utf8');
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
  return `# [PAGE] ${title}\n\n[Divi template: standard interior page]\n`;
}
