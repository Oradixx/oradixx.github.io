# oradixx.github.io

Source of my portfolio, served by GitHub Pages at **https://oradixx.github.io**.

Three versions of the same content:

- `index.html`: the simple version (text and figures), no build step. On a first visit it offers the choice between the three.
- `interactive.html`: the interactive version (animated name, draggable stickers, charts to play with), no build step either.
- `react/`: the React version. Its source is in `react-src/` (Vite, React, Tailwind CSS, Motion); `react/` is the committed build, so GitHub Pages serves it as is.

The forecast data lives in `index.html`; the two other versions read it from there. The choice of version is remembered in `localStorage` (`version`); `/?v=simple` always opens the simple one.

## Rebuilding the React version

```bash
cd react-src && npm install && npm run build
```

This rewrites `react/`. Commit the result together with the source change: a GitHub Actions check (`.github/workflows/react-build.yml`) fails when `react/` does not match `react-src/`.

When a fact changes (a project, a number, a date), update it in the three versions: `index.html`, `interactive.html` and `react-src/src/data.ts`. `CLAUDE.md` lists the details and conventions. Some interface pieces in `react-src/src/components/` are adapted from the open-source Ruixen UI and Watermelon UI registries.
