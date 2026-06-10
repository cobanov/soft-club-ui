# @softclub/tokens

Design tokens for [Soft Club UI](https://github.com/cobanov/soft-club-ui), a late-90s green-glass React component library. Pure CSS variables: colors, typography, spacing, radius, borders, shadows, and motion. No JavaScript required, so the tokens drop into any stack.

## Install

```sh
pnpm add @softclub/tokens
```

## Usage

```css
@import "@softclub/tokens/style.css";
```

Pick a theme by setting `data-sc-theme` on `<html>`: `green` (default), `blue`, `orange`, or `night-city`.

All values are exposed as `--sc-*` custom properties, for example `--sc-color-text`, `--sc-space-4`, `--sc-radius-2`, and per-theme RGB triples like `--sc-theme-rgb-primary` for alpha composition via `rgb(var(--sc-theme-rgb-primary) / 0.2)`.

## Documentation

Component catalog and theming demo: [cobanov.github.io/soft-club-ui](https://cobanov.github.io/soft-club-ui/)

MIT licensed.
