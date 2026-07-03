# Value Yonder

Personal site of Daniel Araújo — essays, thoughts, photo galleries, and a reading log. Live at [valueyonder.com](https://valueyonder.com).

Next.js (App Router, static export) + Tailwind CSS v4 + Framer Motion. Content is committed markdown in `content/` (Hugo TOML frontmatter) and `data/books.json`, loaded at build time by `lib/content.ts`.

## Develop

```bash
npm run dev
```

## Build

```bash
npm run build   # static export to out/
```

## Deploy

Push to `main` — a GitHub Actions workflow on the self-hosted NAS runner builds and rsyncs `out/` to the web root (`.github/workflows/deploy.yml`). Manual fallback: `python3 deploy_next.py` (local-only script, reads NAS credentials from `.env.local`).
