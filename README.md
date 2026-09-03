# Broadsheet

Broadsheet is a local-first fantasy newspaper studio for tabletop campaigns. It combines DM-authored lead stories with editable procedural filler and renders the issue as a printable newspaper front page.

## Features

- Write, duplicate, reorder, resize and format campaign stories
- Generate local news across eleven fantasy sections
- Randomize newspaper names, bylines, datelines, dates and issue details
- Start from five complete newspaper design defaults
- Generate from 110 story templates with reusable placeholder helpers
- Match generated stories to 50 selectable fantasy line illustrations
- Randomize 61 public-domain engravings into stories and 13 editorial cartoons into standalone comic columns
- Adjust masthead, headline and body typography
- Choose page size, column count, accent ink and paper treatment
- Preserve DM-written or locked stories while rerolling filler
- Autosave on the current device
- Import and export complete issues as JSON
- Print directly or save as PDF
- Save an immutable, read-only edition behind a UUID share link
- Display or download a QR code for a shared edition
- Automatically expire and delete shared editions after 30 days
- Match stories with square public-domain engravings and editorial cartoons

## Historical art

The bundled art catalog contains 74 public-domain works sourced from Wikimedia Commons: 61 Gustave Doré engravings from the 1863 edition of *Don Quixote* and 13 nineteenth-century newspaper cartoons from *Harper's Weekly*. Every catalog entry preserves its source page, creator, date, collection, rights label and transformation note in `lib/news/public-domain-art.json`.

The app uses 512 × 512 transparent PNGs redrawn from the historical compositions in the same tonal pen-and-ink language as the generated illustration library. Strong contours and simplified backgrounds keep the art legible at newspaper-column sizes while preserving layered gray shading.

## Development

```bash
npm ci
npm run dev
```

Create a production Worker build with `npm run build`.

The production build is written to `dist/`, with the Worker entry point at
`dist/server/index.js` and public assets in `dist/client/`.

## Shared newspaper storage

The editor remains local-first. Selecting **Save and share** stores a separate,
immutable issue snapshot in the `newspaper_snapshots` D1 table. Public UUID
links render that snapshot without editor controls. Expired rows are rejected
and deleted during reads and writes, while the scheduled Worker cleanup removes
expired rows daily.

The managed Sites deployment provisions the logical `DB` binding declared in
`.openai/hosting.json` and applies the checked-in Drizzle migration.

## Cloudflare Workers

This application now requires a Worker and the D1 database configured as `DB`
in `wrangler.jsonc`. It can no longer be deployed as a static Cloudflare Pages
export. For a direct Wrangler deployment, run:

```bash
npm run deploy
```
