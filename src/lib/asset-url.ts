/**
 * Prepend the Astro BASE_URL to a content-authored asset path.
 *
 * Content collection frontmatter stores image paths as `/images/foo.jpg` (author-friendly),
 * but the site is served under a base path like `/mines-automotive/`. This helper prepends
 * the base so runtime URLs resolve.
 *
 * Absolute URLs (starting with `http`) pass through untouched.
 */
export function assetUrl(path: string | undefined): string | undefined {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
