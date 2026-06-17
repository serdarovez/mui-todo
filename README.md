# Open Library Explorer

Test assignment — a React + Material-UI table that displays book data from the
[Open Library Search API](https://openlibrary.org/developers/api).

> Live demo: **https://serdarovez.github.io/mui-todo/**
> Repository: **https://github.com/serdarovez/mui-todo**

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Material-UI v9** (`@mui/material`, `@mui/icons-material`)
- **MUI X DataGrid** (`@mui/x-data-grid`)
- **Open Library API** for live data (no auth required)

## Features

### Required

- DataGrid with **7 columns**: cover image, title, author, first published
  date, pages (numbers), editions (numbers), subjects.
- Every text/number/date column is **sortable** (click headers) and
  **filterable** via a custom toolbar built on top of the grid.
- Each text column has its own styling — serif bold title, italic
  secondary-color author, monospace tabular numerals for dates / pages /
  edition count.
- **Auto row height** clamped between **100px and 300px** via CSS overrides on
  `.MuiDataGrid-row`.
- **Click a row** → modal with the full record (cover, author, year, pages,
  edition count, subject chips).
- **Click a cover** → separate modal with the large-resolution image
  (`covers.openlibrary.org/.../-L.jpg`); the row-click handler is suppressed
  with `stopPropagation`.

### Bonuses

- **Custom FilterBar** — search across title/author/subjects, subject
  multi-select, year-range slider auto-derived from data, sort dropdown +
  asc/desc toggle, live result count, one-click reset. Persisted to
  `localStorage`.
- **Persistent grid state** — filters, pagination model, sort model and
  column visibility are all stored in `localStorage` and restored on reload.
- **Dark / light theme toggle** — preference persisted, default driven by
  `prefers-color-scheme`. Modern palette (indigo + magenta + mint), gradient
  hero text, glassmorphism cards, backdrop-blurred app bar.
- **Lazy image loading** — `LazyImage` component uses `IntersectionObserver`
  (200px rootMargin) + native `loading="lazy"` / `decoding="async"`, with a
  shimmer `Skeleton` placeholder and fade-in on load.
- **Live data** from the Open Library search API.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build locally
```

## Project layout

```
src/
  api/books.ts              Open Library fetch + Book type
  hooks/
    useBooks.ts             loading / ready / error state machine
    useLocalStorage.ts      JSON-serialised persisted state
  components/
    BooksTable.tsx          DataGrid, columns, sort/pagination models
    FilterBar.tsx           search, year range, subjects, sort controls
    LazyImage.tsx           intersection-observer lazy image + skeleton
    RowDetailsModal.tsx     row-click modal
    ImageZoomModal.tsx      cover-click modal
  theme.ts                  light / dark MUI theme factory
  App.tsx                   layout, hero header, theme toggle, footer
  main.tsx                  entry point
```

## Deploying

The repo ships with a GitHub Actions workflow
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that builds the
Vite app on every push to `main` and publishes it to GitHub Pages.

To enable it once:

1. **Repo Settings → Pages → Source: "GitHub Actions"**
2. Push to `main` — the workflow runs `npm ci && npm run build` and uploads
   `dist/` as the Pages artifact.
3. The site is served from `https://<username>.github.io/mui-todo/`.

`vite.config.ts` sets `base: '/mui-todo/'` so asset URLs resolve correctly
under the subpath. If you fork and rename the repo, update `base` to match.

---

Built by [Serdar](https://serdar-eight.vercel.app/).
