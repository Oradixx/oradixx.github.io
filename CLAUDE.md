# oradixx.github.io

Clément Vurpillot's portfolio, served by GitHub Pages from the `main` branch as plain files
(`.nojekyll`, no Pages build). The site is in English.

## Three versions, one content

| Version | Files | Build |
|---|---|---|
| Simple (the default, at `/`) | `index.html` | none, one self-contained file |
| Interactive | `interactive.html` | none, one self-contained file |
| React | source in `react-src/`, served from `react/` | Vite; the build is committed |

The three versions must say the same thing. When a fact changes (a project, a number, a date,
the availability), change it in all three:

- `index.html`
- `interactive.html`
- `react-src/src/data.ts` (most copy), `react-src/src/App.tsx` (experience, contact) and
  `react-src/src/Figures.tsx` (figure values and captions)

Also update the "Last updated on" line in the three footers.

The France Grid Forecast data exists once, in the `#fgfData` script of `index.html`. The two
other versions fetch `index.html` and read it from there, so never move or rename that element
without updating `interactive.html` and `react-src/src/Trace.tsx`.

## After every change in `react-src/`

```bash
cd react-src && npm install && npm run build
```

This rewrites `react/`. Commit `react/` together with the source change. Never edit `react/`
by hand. The workflow `.github/workflows/react-build.yml` rebuilds on every pull request and
fails when the committed `react/` is stale.

## Version chooser

- `index.html` shows a dialog on a first visit with the three versions, and a "Versions" button
  in its nav reopens it.
- The choice is stored in `localStorage` under `version` (`simple`, `interactive` or `react`).
  The head script of `index.html` redirects a returning visitor to the version they chose,
  except when the URL has a hash or `?v=simple`.
- The theme is shared through `localStorage` `theme` (`light` or `dark`). The React version is
  dark unless `theme` is `light`.

## Conventions

- `index.html` and `interactive.html` stay single files with no dependency other than Google
  Fonts. Do not add a framework or a build step to them.
- Keep the simple version's design quiet: it is the one recruiters read first.
- Every animation must respect `prefers-reduced-motion`.
- `react-src/src/components/ruixen/` holds components installed from the Ruixen UI registry
  with the shadcn CLI. `scramble-text.tsx` has a local change (letters grouped by word), so
  reinstalling it would lose that change.
- `PRODUCT.md`, `.impeccable/` and `.claude/` are local working files, ignored by git.

## Checking a change

Serve the repository root (the versions link to each other with relative paths, and the
forecast data is fetched over HTTP, so opening the files directly does not work):

```bash
python3 -m http.server 8000
```

Then open `/`, `/interactive.html` and `/react/` at desktop and phone widths, in light and dark.
