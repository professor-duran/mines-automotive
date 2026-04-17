import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Minimal skeleton. Populated in Task 7.3.
export function writeBrandNotes(outDir: string): void {
  const lines = ['# Brand compliance notes', '', 'See https://brand.mines.edu/', ''];
  writeFileSync(join(outDir, 'brand-compliance-notes.md'), lines.join('\n'));
}
