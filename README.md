# oradixx.github.io

Source of my portfolio, served by GitHub Pages at **https://oradixx.github.io**.

Two versions of the same content, no build step, no framework:

- `index.html`: the simple version (text and figures). On a first visit it offers the choice between the two.
- `interactive.html`: the interactive version (animated name, draggable stickers, charts to play with). It reads the France Grid Forecast data from `index.html`, so that data lives in one place.

The choice is remembered in `localStorage` (`version`); `/?v=simple` always opens the simple version.
