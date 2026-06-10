# @softclub/ui

Soft Club UI is a reusable React component library shaped by late-90s soft club graphics: dark glass, phosphor green, cold blue, smoke, and restrained cyber/Y2K technology. 90+ components, four switchable themes, Radix primitives underneath.

## Install

```sh
pnpm add @softclub/ui @softclub/tokens
```

Import the stylesheet once in your app:

```tsx
import "@softclub/ui/styles.css";
```

Pick a theme by setting `data-sc-theme` on `<html>`: `green` (default), `blue`, `orange`, or `night-city`.

## Usage

```tsx
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@softclub/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room A3</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="green">Glass</Badge>
        <Button>Sync channel</Button>
      </CardContent>
    </Card>
  );
}
```

## Copy single components instead

Every component is also a shadcn-compatible registry item, so you can copy the source into your project and own it:

```sh
npx shadcn@latest add https://cobanov.github.io/soft-club-ui/r/sheet.json
```

## Documentation

Component catalog, theming demo, and per-component install commands: [cobanov.github.io/soft-club-ui](https://cobanov.github.io/soft-club-ui/)

MIT licensed.
