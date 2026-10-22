/**
 * Sub-path the site is served from. Empty for valueyonder.com; "/value-yonder"
 * on GitHub Pages (set NEXT_PUBLIC_BASE_PATH at build time). Next adds it to
 * <Link> hrefs itself; anything else that points at a file in public/ must go
 * through withBase().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}
