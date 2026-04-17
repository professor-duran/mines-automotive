import { createWriteStream, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import archiver from 'archiver';

const outDir = 'exports';

if (!existsSync(outDir)) {
  console.error(`No ${outDir}/ directory found. Run \`npm run export\` first.`);
  process.exit(1);
}

// Clean up any previous handoff zips so the bundle stays current.
for (const f of readdirSync(outDir)) {
  if (/^mines-automotive-handoff-\d{4}-\d{2}-\d{2}\.zip$/.test(f)) {
    unlinkSync(join(outDir, f));
  }
}

const today = new Date();
const yyyy = today.getUTCFullYear();
const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
const dd = String(today.getUTCDate()).padStart(2, '0');
const dateStr = `${yyyy}-${mm}-${dd}`;
const zipName = `mines-automotive-handoff-${dateStr}.zip`;
const zipPath = join(outDir, zipName);

const output = createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const bytes = archive.pointer();
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  console.log(`Wrote ${zipPath} (${bytes} bytes, ${mb} MB).`);
});

archive.on('warning', (err) => {
  if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Bundle pages, media, and top-level docs. Skip any pre-existing zip files.
archive.directory(join(outDir, 'pages'), 'pages');
if (existsSync(join(outDir, 'media'))) {
  archive.directory(join(outDir, 'media'), 'media');
}
if (existsSync(join(outDir, 'content-map.md'))) {
  archive.file(join(outDir, 'content-map.md'), { name: 'content-map.md' });
}
if (existsSync(join(outDir, 'brand-compliance-notes.md'))) {
  archive.file(join(outDir, 'brand-compliance-notes.md'), { name: 'brand-compliance-notes.md' });
}

archive.finalize();
