# First React version ("night"), archived

This is the first React version of the portfolio, kept in case it is wanted again: a dark
scrolling page with a replay of the grid forecast behind the name, four results pinned to the
scroll, project cards that open in a sheet, a dock and a search palette.

It was replaced by the game in `react-src/` on 12 November 2026. Its build is still served at
`/react-night/`, but nothing links to it and its content is no longer kept in sync with the
three live versions.

To rebuild it after a change:

```bash
cd react-night-src && npm install && npm run build
```

This rewrites `react-night/`. To make it the main React version again, swap the folders:
move `react-src/` and `react/` aside, rename `react-night-src/` to `react-src/`, set `outDir`
back to `../react` in `vite.config.ts`, and rebuild.
