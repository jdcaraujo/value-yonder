// The old Hugo site served essays at /essays/<slug>/; the Next.js site uses
// /essays/<section>/<slug>/. A static export can't issue server redirects, so
// this writes a meta-refresh stub at each old URL after `next build`.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ESSAYS_DIR = path.join(ROOT, "content", "essays");
const OUT_DIR = path.join(ROOT, "out");
const SITE_URL = "https://valueyonder.com";

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ not found — run `next build` first");
  process.exit(1);
}

let count = 0;
for (const section of fs.readdirSync(ESSAYS_DIR)) {
  const sectionDir = path.join(ESSAYS_DIR, section);
  if (!fs.statSync(sectionDir).isDirectory()) continue;
  for (const file of fs.readdirSync(sectionDir)) {
    if (!file.endsWith(".md") || file === "_index.md") continue;
    const slug = file.replace(/\.md$/, "");
    const newUrl = `${SITE_URL}/essays/${section}/${slug}/`;
    const stubDir = path.join(OUT_DIR, "essays", slug);
    if (fs.existsSync(path.join(stubDir, "index.html"))) continue; // never clobber a real page
    fs.mkdirSync(stubDir, { recursive: true });
    fs.writeFileSync(
      path.join(stubDir, "index.html"),
      `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${newUrl}">
<meta http-equiv="refresh" content="0; url=${newUrl}">
<meta name="robots" content="noindex">
</head>
<body><p>This essay moved to <a href="${newUrl}">${newUrl}</a>.</p></body>
</html>
`
    );
    count++;
  }
}
console.log(`redirect-stubs: wrote ${count} legacy essay redirects`);
