@AGENTS.md

# Value Yonder

Daniel's personal site: essays, thoughts, photo galleries and a reading log. Live at https://valueyonder.com.

- **Stack:** Next.js 16 (App Router, TypeScript, static export) + Tailwind CSS v4 + Framer Motion
- **Hosting:** static files on the Synology NAS (`/Solar6TB/ValueYonder`), uploaded by `deploy_next.py`.
  GitHub (`jdcaraujo/value-yonder-next`) is backup only — there is no Actions deploy.
- **Content lives in this repo:** markdown with Hugo-style TOML frontmatter in `content/`
  (`essays/<section>/`, `thoughts/`, `seeing/`), plus `data/books.json`, `data/projects/`, `data/thinking.json`.
  The old Hugo site (`jdcaraujo/value-yonder`) is retired and archived.
- `drafts/` holds old Hugo essays that were never carried over. They are not published; ask Daniel before
  moving any of them into `content/`.

## Commands

```bash
npm run dev                                   # dev server
npm run build                                 # static export to out/
.venv/bin/python deploy_next.py               # build + upload to the NAS
.venv/bin/python deploy_next.py --no-build    # upload the existing out/
```

`deploy_next.py` reads `NAS_HOST`, `NAS_PORT`, `NAS_USER`, `NAS_PASS`, `NAS_DEST` from `.env.local`
(gitignored, never commit it). It clears the destination folder and re-uploads `out/` through the Synology
FileStation API. If `.venv` is missing: `python3 -m venv .venv && .venv/bin/pip install requests python-dotenv`.

## Routes

| Route | Page |
|-------|------|
| `/` | Homepage (hero + recent essays) |
| `/essays` | Essays index (On Learning, On Progress, On Prosperity) |
| `/essays/[section]` | One section |
| `/essays/[section]/[slug]` | Essay |
| `/thoughts`, `/thoughts/[slug]` | Thoughts |
| `/seeing`, `/seeing/[gallery]` | Photo galleries |
| `/reading` | Reading log with a 3D bookshelf (`data/books.json`) |
| `/about` | About + career timeline |

The build also writes redirect stubs for legacy essay URLs.

## Key files

| File | Purpose |
|------|---------|
| `lib/content.ts` | All content reading (essays, thoughts, galleries, books) — extend it rather than duplicating logic |
| `app/layout.tsx` | Root layout: space background, nav, footer, theme |
| `components/space-background.tsx` | Canvas starfield + shooting stars |
| `components/nav.tsx` | Transparent → frosted glass on scroll |
| `components/theme-toggle.tsx` | Light/dark mode, follows the system by default |
| `components/bookshelf.tsx` | 3D bookshelf on `/reading` |
| `deploy_next.py` | Deploy to the NAS |

## Design

- Dark: background `#08090f` (deep space), accent `#06b6d4` (cyan-500); a light mode also exists
- Cards: `rounded-3xl`, border reveals on hover; font Inter; scroll fade-ins with Framer Motion `whileInView`

## Conventions

- Read a feature's key file before touching it
- Link hrefs have no basePath prefix (`/essays`, not `/next/essays`); public assets use absolute paths (`/logo.svg`)
- Run `npm run dev` and check the change before deploying
- Frontmatter format:

  ```toml
  +++
  title = "Essay Title"
  date = '2024-01-01T00:00:00Z'
  draft = false
  description = "Optional description"
  +++
  ```
