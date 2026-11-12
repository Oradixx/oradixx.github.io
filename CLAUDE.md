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
- `react-src/src/data.ts` (projects, skills, ideas, education, and the `rounds` of the guessing
  game, which repeat the key numbers), `react-src/src/App.tsx` (experience, contact) and
  `react-src/src/Figures.tsx` (figure values and captions)

Also update the "Last updated on" line in the three footers.

The France Grid Forecast data exists once, in the `#fgfData` script of `index.html`. The two
other versions fetch `index.html` and read it from there, so never move or rename that element
without updating `interactive.html` and `react-src/src/fgf.ts`.

## Archived: the first React version

`react-night-src/` (source) and `react-night/` (its build, served at `/react-night/`) hold the
first React version, replaced by the current one. Clément asked to keep it in case he wants it
back. Nothing links to it, the CI check ignores it, and it is not part of "the three versions":
do not update its content unless asked. Its own README explains how to rebuild or restore it.

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
- The simple and interactive versions share the theme through `localStorage` `theme` (`light`
  or `dark`). The React version has no light/dark switch: it has four styles instead (see below).

## What the React version is

It is deliberately not a scrolling page like the two others. It is a small app with tabs:

- **Play**: six questions where the visitor guesses one of my results with a slider before
  seeing it, and a board of draggable stickers earned by playing and exploring.
- **Projects**: a sortable, filterable, searchable table; a project opens in a drawer.
- **Experience**, **Skills** (combine several skills), **Ideas** (a deck to swipe), **About and
  contact**.

The whole page switches between Plonk's four personalities (Sticker, Retro, Comic, Arcade;
Arcade is the default). Progress is kept in `localStorage` (`react-guesses`, `react-stickers`,
`react-look`).

Libraries, all chosen by Clément, so keep using them rather than hand-rolling replacements:

- `plonk-ui` (MIT): every control, the tabs, table, drawer, dialog, toasts, command palette, and
  the four personalities. Style with its `--plonk-*` tokens, never with fixed colours.
- `stick-it-up`: the stickers. Its licence allows personal sites and forbids reselling.
  Import stickers by name (see `ART` in `App.tsx`); the dynamic `<Sticker name>` pulls all 64.
- Ruixen UI (`src/components/ruixen/`, installed with the shadcn CLI): scramble text on the
  name, confetti button for the CV.
- Watermelon UI (`src/components/watermelon/card-swipe.tsx`): the swipe deck, adapted locally.

## Conventions

- `index.html` and `interactive.html` stay single files with no dependency other than Google
  Fonts. Do not add a framework or a build step to them.
- Keep the simple version's design quiet: it is the one recruiters read first.
- Every animation must respect `prefers-reduced-motion`.
- `scramble-text.tsx` and `card-swipe.tsx` have local changes (noted in each file), so
  reinstalling them from their registry would lose those changes.
- `PRODUCT.md`, `.impeccable/` and `.claude/` are local working files, ignored by git.

## Checking a change

Serve the repository root (the versions link to each other with relative paths, and the
forecast data is fetched over HTTP, so opening the files directly does not work):

```bash
python3 -m http.server 8000
```

Then open `/`, `/interactive.html` and `/react/` at desktop and phone widths, in light and dark
for the first two and in the four styles for the React version.
