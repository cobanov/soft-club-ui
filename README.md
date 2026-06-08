# Soft Club UI

Soft Club UI is a reusable React component library shaped by late-90s Sony-adjacent soft club graphics: dark glass, phosphor green, cold blue, smoke, blurred photography, underground transit grids, concrete interiors, and restrained cyber/Y2K technology.

The package is publish-ready as `@cobanov/soft-club-ui`.

## Install

```sh
pnpm add @cobanov/soft-club-ui @cobanov/soft-club-tokens
```

Import the component styles once in your app:

```tsx
import "@cobanov/soft-club-ui/styles.css";
```

Use components from the package:

```tsx
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@cobanov/soft-club-ui";

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

## Packages

- `packages/ui`: React components, Radix UI wrappers, TypeScript exports, and component CSS.
- `packages/tokens`: CSS variables for colors, typography, spacing, radius, borders, shadows, and motion.
- `apps/docs`: Vite demo app and Storybook host.

## Scripts

```sh
pnpm dev
pnpm build
pnpm storybook
pnpm lint
pnpm typecheck
```

## Design Philosophy

Soft Club UI is not McBling, not bright disco Y2K, and not generic SaaS dark mode. It is more mature and urban: black glass, desaturated earth tones, green translucent technology, cold blue lighting, Helvetica-style typography, thin technical borders, low-radius surfaces, and subtle scanline/noise texture.

The components stay accessible and practical. Radix UI handles interaction semantics, exported components support `className` overrides, and all visual decisions are token-based.

## Inspiration

The expanded performative surface set was informed by the MIT-licensed [`vorpus/performativeUI`](https://github.com/vorpus/performativeUI) component catalog, then rewritten for Soft Club's late-90s green-glass design language.

## v0 Components

- Button
- Input
- Textarea
- Card
- Badge
- Tabs
- Dialog
- Dropdown Menu
- Popover
- Toast
- AsciiHero
- AuroraField
- NodeGrid
- GlassPanel
- MockConsole
- TokenStream
- ChatBubble
- ChatDock
- PromptBox
- BeforeAfter
- WordRoll
- StatCounter
- SignalMarquee
- StatusIndicator
- StickyBanner
