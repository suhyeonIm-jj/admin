# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Damin Hub** is a personal bookmark/link manager with two workspaces (work/personal). Built on Next.js 16 App Router with JSON file persistence — no database.

### Data Layer

All data lives in `/data/*.json` and is read/written by `/src/lib/data.ts` via synchronous `fs.readFileSync`/`writeFileSync`. There is no ORM or database. The four files are:

- `links.json` — bookmarks (title, url, favicon, tags, category, order, isPinned, isFavorite, usageCount)
- `categories.json` — categories scoped to `"work"` or `"personal"` type
- `tags.json` — global tag library with colors
- `users.json` — user accounts (passwords stored in plaintext)

Functions in `data.ts` are the sole write path. API routes call these directly; never write to `/data/` files from components.

### API Routes (`/src/app/api/`)

```
auth/login, logout, me, register   — session via httpOnly cookie
links/           GET, POST          — list or create; POST also handles reorder
links/[id]/      PATCH, DELETE
categories/      GET, POST          — list or create; POST also handles reorder
categories/[id]/ PATCH, DELETE
tags/            GET
tags/[id]/       DELETE
favicon/         GET                — extracts favicon URL from a given domain
```

Reordering is a special POST to `/api/links` or `/api/categories` with a body shaped `{ type: "reorder", items: [...] }`.

### Frontend Structure

Single-page layout pattern: `/src/app/page.tsx` composes the whole dashboard (Sidebar + Topbar + ContentFilter + link grid + CommandPalette + LinkModal). The work and personal workspace pages (`/src/app/work/page.tsx`, `/src/app/personal/page.tsx`) follow the same structure scoped to a `pageType`.

Key components:
- `Sidebar` — workspace switcher, view mode (all/pinned/recent), link counts
- `ContentFilter` — category list with counts, tag filter, category CRUD
- `LinkCard` / `SortableLinkCard` — individual bookmark display; the sortable variant wraps with `@dnd-kit`
- `CommandPalette` — Cmd+K search across title/url/tags
- `LinkModal` — add/edit form with favicon auto-fetch

Drag-and-drop reordering uses `@dnd-kit/core` and `@dnd-kit/sortable` for both links and categories.

### Styling

Tailwind CSS 4 via PostCSS. Heavy use of custom CSS in `/src/globals.css` (CSS variables for theming, grid layouts, sidebar/topbar). Path alias `@/*` maps to `./src/*`.

### Types

All shared TypeScript types are in `/src/types/index.ts`: `Link`, `Category`, `Tag`, `User`, `PageType`.
