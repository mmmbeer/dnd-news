# Broadsheet

Broadsheet is a local-first fantasy newspaper studio for tabletop campaigns. It combines DM-authored lead stories with editable procedural filler and renders the issue as a printable newspaper front page.

## Features

- Write, duplicate, reorder, resize and format campaign stories
- Generate local news across eleven fantasy sections
- Randomize newspaper names, bylines, datelines, dates and issue details
- Adjust masthead, headline and body typography
- Choose page size, column count, accent ink and paper treatment
- Preserve DM-written or locked stories while rerolling filler
- Autosave on the current device
- Import and export complete issues as JSON
- Print directly or save as PDF

## Development

```bash
npm ci
npm run dev
```

Create a production build with `npm run build`.

The production build is a static export in `dist/`.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with these settings:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`

No runtime environment variables or server process are required.

## Cloudflare Workers

The repository can also deploy as an assets-only Cloudflare Worker using
`wrangler.jsonc`. In Workers Builds, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Do not select the OpenNext preset. This application is exported as static files
and does not produce an OpenNext standalone server bundle.
