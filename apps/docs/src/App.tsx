import { type ReactNode, useEffect, useState } from "react";
import {
  Accordion,
  AsciiHero,
  AuroraField,
  Badge,
  BeforeAfter,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChatBubble,
  ChatDock,
  Checkbox,
  CommunityBadge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  GradientText,
  GlassCard,
  GlassPanel,
  GlassPanelBody,
  GlassPanelHeader,
  GlassPanelKicker,
  GlassPanelTitle,
  Input,
  LogoMarquee,
  MockConsole,
  MockIDE,
  NodeGrid,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PricingCard,
  PromptBox,
  PromptHero,
  Rotator,
  Separator,
  SignalMarquee,
  Skeleton,
  StatCounter,
  StatusDot,
  StatusIndicator,
  StickyBanner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  TokenStream,
  Tooltip,
  WordRoll
} from "@cobanov/soft-club-ui";

interface ComponentEntry {
  category: string;
  code: string;
  description: string;
  name: string;
  preview: (helpers: { showToast: () => void }) => ReactNode;
  slug: string;
}

const themeOptions = [
  {
    description: "Icy transport glass and cyan scan lines.",
    label: "Blue",
    swatches: ["#7ebcff", "#87f2e6", "#ffd16a"],
    value: "blue"
  },
  {
    description: "Green room glow, soft glass, muted concrete.",
    label: "Green",
    swatches: ["#8bb8d7", "#8effad", "#ff8a3d"],
    value: "green"
  },
  {
    description: "Amber motion blur and late-night platform heat.",
    label: "Orange",
    swatches: ["#ffd27a", "#ff9a20", "#ffcf35"],
    value: "orange"
  }
] as const;

type ThemeName = (typeof themeOptions)[number]["value"];

const isThemeName = (value: string | null): value is ThemeName =>
  themeOptions.some((theme) => theme.value === value);

const componentEntries: ComponentEntry[] = [
  {
    category: "Foundations",
    code: `<Badge variant="green">Glass</Badge>`,
    description: "Small status label for product metadata, state, and compact proof marks.",
    name: "Badge",
    preview: () => (
      <div className="preview-row">
        <Badge>Blue</Badge>
        <Badge variant="green">Glass</Badge>
        <Badge variant="warning">Signal</Badge>
        <Badge variant="danger">Clip</Badge>
        <Badge variant="neutral">Idle</Badge>
      </div>
    ),
    slug: "badge"
  },
  {
    category: "Foundations",
    code: `<StatusDot tone="green" />`,
    description: "Tiny live-state dot with optional pulse behavior.",
    name: "StatusDot",
    preview: () => (
      <div className="preview-row">
        <StatusDot tone="green" />
        <StatusDot tone="blue" />
        <StatusDot tone="warning" />
        <StatusDot tone="danger" />
      </div>
    ),
    slug: "status-dot"
  },
  {
    category: "Foundations",
    code: `<StatusIndicator tone="green" />`,
    description: "Inline status indicator for dense rows and system labels.",
    name: "StatusIndicator",
    preview: () => (
      <div className="preview-row">
        <StatusIndicator tone="green" /> B2 bus mapped
      </div>
    ),
    slug: "status-indicator"
  },
  {
    category: "Foundations",
    code: `<Separator />`,
    description: "Thin divider for compact panels and form group breaks.",
    name: "Separator",
    preview: () => (
      <div className="preview-stack">
        <span>Signal A</span>
        <Separator />
        <span>Signal B</span>
      </div>
    ),
    slug: "separator"
  },
  {
    category: "Foundations",
    code: `<Skeleton style={{ width: "72%" }} />`,
    description: "Reduced-motion aware loading placeholder.",
    name: "Skeleton",
    preview: () => (
      <div className="skeleton-stack">
        <Skeleton style={{ width: "72%" }} />
        <Skeleton style={{ width: "92%" }} />
        <Skeleton style={{ width: "48%" }} />
      </div>
    ),
    slug: "skeleton"
  },
  {
    category: "Actions & Inputs",
    code: `<Button>Sync</Button>`,
    description: "Primary command surface with secondary, outline, ghost, and danger variants.",
    name: "Button",
    preview: () => (
      <div className="preview-row">
        <Button>Sync</Button>
        <Button variant="secondary">Calibrate</Button>
        <Button variant="outline">Export</Button>
        <Button variant="ghost">Bypass</Button>
      </div>
    ),
    slug: "button"
  },
  {
    category: "Actions & Inputs",
    code: `<Input name="system-code" aria-label="System code" defaultValue="SC-133G04" />`,
    description: "Single-line text field with glass surface and visible focus state.",
    name: "Input",
    preview: () => (
      <Input
        aria-label="System code"
        autoComplete="off"
        defaultValue="SC-133G04"
        name="system-code"
      />
    ),
    slug: "input"
  },
  {
    category: "Actions & Inputs",
    code: `<Textarea name="session-note" aria-label="Session note" />`,
    description: "Multi-line note field for prompts, logs, and system copy.",
    name: "Textarea",
    preview: () => (
      <Textarea
        aria-label="Session note"
        autoComplete="off"
        defaultValue="Trip-hop room active. Fogged lens pass enabled."
        name="session-note"
      />
    ),
    slug: "textarea"
  },
  {
    category: "Actions & Inputs",
    code: `<Checkbox label="Route glass layer" defaultChecked />`,
    description: "Native checkbox with a single clickable label target.",
    name: "Checkbox",
    preview: () => (
      <Checkbox
        defaultChecked
        description="Visible focus and native checkbox behavior."
        label="Route glass layer"
        name="route-glass-layer"
      />
    ),
    slug: "checkbox"
  },
  {
    category: "Actions & Inputs",
    code: `<Switch label="Live token pass" defaultChecked />`,
    description: "Native switch control for binary settings.",
    name: "Switch",
    preview: () => (
      <Switch
        defaultChecked
        description="Role switch with token-driven chrome."
        label="Live token pass"
        name="live-token-pass"
      />
    ),
    slug: "switch"
  },
  {
    category: "Actions & Inputs",
    code: `<PromptBox defaultValue="render a soft cyber room" />`,
    description: "Compact prompt input with attach, voice, and send controls.",
    name: "PromptBox",
    preview: () => <PromptBox aria-label="Prompt route" defaultValue="render a soft cyber room" />,
    slug: "prompt-box"
  },
  {
    category: "Actions & Inputs",
    code: `<PromptHero ctaLabel="Route" leading={<StatusDot />} />`,
    description: "Larger prompt entry for pages where the prompt is the main action.",
    name: "PromptHero",
    preview: () => (
      <PromptHero
        ctaLabel="Route"
        defaultValue="map a green glass deck with reactive ascii"
        leading={<StatusDot />}
      />
    ),
    slug: "prompt-hero"
  },
  {
    category: "Navigation",
    code: `<Tabs defaultValue="club">…</Tabs>`,
    description: "Radix-backed tabs for switching compact views.",
    name: "Tabs",
    preview: () => (
      <Tabs defaultValue="club">
        <TabsList aria-label="Soft Club views">
          <TabsTrigger value="club">Club</TabsTrigger>
          <TabsTrigger value="metro">Metro</TabsTrigger>
          <TabsTrigger disabled value="archive">
            Archive
          </TabsTrigger>
        </TabsList>
        <TabsContent value="club">Frosted green wall, glass shelf, low bass.</TabsContent>
        <TabsContent value="metro">Underground platform, route map, cold light.</TabsContent>
      </Tabs>
    ),
    slug: "tabs"
  },
  {
    category: "Navigation",
    code: `<Accordion><Accordion.Item>…</Accordion.Item></Accordion>`,
    description: "Disclosure list for compact support content and specs.",
    name: "Accordion",
    preview: () => (
      <Accordion>
        <Accordion.Item open>
          <Accordion.Trigger>What is grouped here?</Accordion.Trigger>
          <Accordion.Content>Inputs, feedback, surfaces, and proof components.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Trigger>Does it deep-link?</Accordion.Trigger>
          <Accordion.Content>Every component now has its own hash route.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    ),
    slug: "accordion"
  },
  {
    category: "Navigation",
    code: `<Dialog><DialogTrigger asChild>…</DialogTrigger></Dialog>`,
    description: "Modal surface for confirmations and focused tasks.",
    name: "Dialog",
    preview: () => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Soft Channel</DialogTitle>
            <DialogDescription>Route the session through the glass layer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button>Open</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    slug: "dialog"
  },
  {
    category: "Navigation",
    code: `<DropdownMenu>…</DropdownMenu>`,
    description: "Menu primitive for command lists and compact actions.",
    name: "DropdownMenu",
    preview: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>SC / Deck</DropdownMenuLabel>
          <DropdownMenuItem>Scan Image Plate</DropdownMenuItem>
          <DropdownMenuItem>Route Through Bus B2</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Freeze Frame</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    slug: "dropdown-menu"
  },
  {
    category: "Navigation",
    code: `<Popover><PopoverTrigger asChild>…</PopoverTrigger></Popover>`,
    description: "Small floating info panel for local context.",
    name: "Popover",
    preview: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">Info</Button>
        </PopoverTrigger>
        <PopoverContent>Text remains solid above the glass surface.</PopoverContent>
      </Popover>
    ),
    slug: "popover"
  },
  {
    category: "Navigation",
    code: `<Tooltip content="Tooltip primitive"><Button>Hover</Button></Tooltip>`,
    description: "Hover and focus hint for compact controls.",
    name: "Tooltip",
    preview: () => (
      <Tooltip content="Tooltip primitive">
        <Button variant="ghost">Hover</Button>
      </Tooltip>
    ),
    slug: "tooltip"
  },
  {
    category: "Feedback",
    code: `<Toast open={open}>…</Toast>`,
    description: "Transient feedback for syncs, saves, and route changes.",
    name: "Toast",
    preview: ({ showToast }) => (
      <Button onClick={showToast} variant="secondary">
        Show Toast
      </Button>
    ),
    slug: "toast"
  },
  {
    category: "Feedback",
    code: `<TokenStream text="scan -> route -> render" loop />`,
    description: "Token-by-token reveal with custom tokenizer and loop timing.",
    name: "TokenStream",
    preview: () => (
      <GlassPanel>
        <GlassPanelHeader>
          <GlassPanelKicker>TOKEN STREAM</GlassPanelKicker>
          <GlassPanelTitle>
            <StatCounter suffix="%" value={94} /> sync
          </GlassPanelTitle>
        </GlassPanelHeader>
        <GlassPanelBody>
          <TokenStream
            loop
            loopDelayMs={1800}
            speedMs={[28, 90]}
            text="scan -> tokenize -> route -> render -> settle"
            tokenize={(value) => value.split(/( -> |\s+)/)}
          />
          <SignalMarquee />
        </GlassPanelBody>
      </GlassPanel>
    ),
    slug: "token-stream"
  },
  {
    category: "Feedback",
    code: `<StatCounter suffix="%" value={94} />`,
    description: "Animated numeric counter for small status summaries.",
    name: "StatCounter",
    preview: () => (
      <div className="preview-counter">
        <StatCounter suffix="%" value={94} /> sync
      </div>
    ),
    slug: "stat-counter"
  },
  {
    category: "Feedback",
    code: `<SignalMarquee />`,
    description: "Thin motion strip for looped signal text.",
    name: "SignalMarquee",
    preview: () => <SignalMarquee />,
    slug: "signal-marquee"
  },
  {
    category: "Surfaces",
    code: `<Card><CardHeader>…</CardHeader></Card>`,
    description: "Base content container with header, body, and footer slots.",
    name: "Card",
    preview: () => (
      <Card>
        <CardHeader>
          <CardTitle>Room A3</CardTitle>
          <CardDescription>Green shelf glow, concrete ceiling, fogged lens.</CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="green">133G04</Badge>
        </CardContent>
        <CardFooter>
          <Button size="sm">Arm</Button>
          <Button size="sm" variant="outline">
            Print
          </Button>
        </CardFooter>
      </Card>
    ),
    slug: "card"
  },
  {
    category: "Surfaces",
    code: `<GlassPanel><GlassPanelHeader>…</GlassPanelHeader></GlassPanel>`,
    description: "Composed glass container for dense display surfaces.",
    name: "GlassPanel",
    preview: () => (
      <GlassPanel>
        <GlassPanelHeader>
          <GlassPanelKicker>GLASS PANEL</GlassPanelKicker>
          <GlassPanelTitle>
            Signal surface / <WordRoll index={2} />
          </GlassPanelTitle>
        </GlassPanelHeader>
        <GlassPanelBody>
          <TokenStream text="SC/A3 noise 04% / glass bus online" loop />
        </GlassPanelBody>
      </GlassPanel>
    ),
    slug: "glass-panel"
  },
  {
    category: "Surfaces",
    code: `<GlassCard breathing>…</GlassCard>`,
    description: "Compact glass card with icon, title, body, and link slots.",
    name: "GlassCard",
    preview: () => (
      <GlassCard breathing>
        <GlassCard.Icon>A1</GlassCard.Icon>
        <GlassCard.Title>ASCII Layer</GlassCard.Title>
        <GlassCard.Body>Canvas field, thin border, controlled glow.</GlassCard.Body>
        <GlassCard.Link href="#/category/surfaces/ascii-hero">Open Surface</GlassCard.Link>
      </GlassCard>
    ),
    slug: "glass-card"
  },
  {
    category: "Surfaces",
    code: `<AsciiHero title="cursor reactive field" />`,
    description: "Reactive ASCII canvas adapted into the green glass surface.",
    name: "AsciiHero",
    preview: () => (
      <AsciiHero
        label="PERFORMATIVE / ASCII"
        spotlightRadius={11}
        subtitle="Reactive ASCII surface tuned to Soft Club tokens."
        title="cursor reactive field"
      />
    ),
    slug: "ascii-hero"
  },
  {
    category: "Surfaces",
    code: `<MockIDE />`,
    description: "Animated code mock with Soft Club syntax colors and editor chrome.",
    name: "MockIDE",
    preview: () => <MockIDE />,
    slug: "mock-ide"
  },
  {
    category: "Surfaces",
    code: `<MockConsole />`,
    description: "Compact terminal panel for prompt and command demos.",
    name: "MockConsole",
    preview: () => <MockConsole />,
    slug: "mock-console"
  },
  {
    category: "Surfaces",
    code: `<NodeGrid><AuroraField /></NodeGrid>`,
    description: "Grid-backed ambient surface for system diagrams and backgrounds.",
    name: "NodeGrid",
    preview: () => (
      <NodeGrid>
        <AuroraField intensity="low" />
        <div className="node-copy">
          <StatusIndicator tone="green" /> B2 bus mapped
        </div>
      </NodeGrid>
    ),
    slug: "node-grid"
  },
  {
    category: "Surfaces",
    code: `<AuroraField intensity="low" />`,
    description: "Soft ambient field used inside grid and hero surfaces.",
    name: "AuroraField",
    preview: () => (
      <NodeGrid>
        <AuroraField intensity="low" />
      </NodeGrid>
    ),
    slug: "aurora-field"
  },
  {
    category: "Surfaces",
    code: `<BeforeAfter before="Flat panel" after="Green glass" />`,
    description: "Split surface for comparing copy, states, or design passes.",
    name: "BeforeAfter",
    preview: () => (
      <BeforeAfter
        after="Cold glass, green phosphor, blur, and technical coordinates."
        before="Flat panel, no atmosphere, no scan index."
      />
    ),
    slug: "before-after"
  },
  {
    category: "Motion & Type",
    code: `<Rotator words={["glass", "metro", "signal"]} />`,
    description: "Typewriter word rotation for compact interface copy.",
    name: "Rotator",
    preview: () => (
      <GlassPanel>
        <GlassPanelHeader>
          <GlassPanelTitle>
            Route the <Rotator words={["glass", "metro", "signal", "archive"]} />
          </GlassPanelTitle>
        </GlassPanelHeader>
      </GlassPanel>
    ),
    slug: "rotator"
  },
  {
    category: "Motion & Type",
    code: `<WordRoll index={2} />`,
    description: "Small rolling word mark for labels and headers.",
    name: "WordRoll",
    preview: () => (
      <div className="preview-counter">
        Signal surface / <WordRoll index={2} />
      </div>
    ),
    slug: "word-roll"
  },
  {
    category: "Motion & Type",
    code: `<GradientText static>soft signal text</GradientText>`,
    description: "Token-backed gradient text for rare emphasis moments.",
    name: "GradientText",
    preview: () => (
      <div className="preview-counter">
        <GradientText static>soft signal text</GradientText>
      </div>
    ),
    slug: "gradient-text"
  },
  {
    category: "Conversation",
    code: `<ChatBubble meta="system" tone="system">…</ChatBubble>`,
    description: "Single message bubble for system, user, and signal tones.",
    name: "ChatBubble",
    preview: () => (
      <ChatBubble meta="assistant / transfer" tone="system">
        The pieces are mapped into a calmer component set.
      </ChatBubble>
    ),
    slug: "chat-bubble"
  },
  {
    category: "Conversation",
    code: `<ChatDock><ChatBubble />…</ChatDock>`,
    description: "Conversation surface with bubbles and prompt controls.",
    name: "ChatDock",
    preview: () => (
      <ChatDock>
        <ChatBubble meta="assistant / transfer" tone="system">
          Component route online.
        </ChatBubble>
        <ChatBubble meta="operator" tone="user">
          Keep it useful in the left menu.
        </ChatBubble>
        <PromptBox defaultValue="render a soft cyber room" />
      </ChatDock>
    ),
    slug: "chat-dock"
  },
  {
    category: "Proof & Commerce",
    code: `<LogoMarquee logos={logos} />`,
    description: "Scrolling logo proof strip with hover pause.",
    name: "LogoMarquee",
    preview: () => (
      <LogoMarquee
        logos={[
          { kind: "node", node: "NOVA", key: "nova" },
          { kind: "node", node: "A24", key: "a24" },
          { kind: "node", node: "VOID FM", key: "void" },
          { kind: "node", node: "ROOM 33", key: "room" }
        ]}
        pauseOnHover
        speed={26}
      />
    ),
    slug: "logo-marquee"
  },
  {
    category: "Proof & Commerce",
    code: `<CommunityBadge title="Soft Club channel" />`,
    description: "Compact community/social proof card.",
    name: "CommunityBadge",
    preview: () => (
      <CommunityBadge
        href="#/category/proof-and-commerce/community-badge"
        subtitle="2,408 builders / +91 this week"
        title="Soft Club channel"
      />
    ),
    slug: "community-badge"
  },
  {
    category: "Proof & Commerce",
    code: `<PricingCard featured>…</PricingCard>`,
    description: "Composable pricing surface with feature list and action.",
    name: "PricingCard",
    preview: () => (
      <PricingCard featured>
        <PricingCard.Flag>FEATURED</PricingCard.Flag>
        <PricingCard.Tier>Signal Suite</PricingCard.Tier>
        <PricingCard.Amount unit="/mo">$49</PricingCard.Amount>
        <PricingCard.Blurb>For shipped interfaces with prompt and proof layers.</PricingCard.Blurb>
        <PricingCard.Features>
          <li>PromptHero and pricing cards</li>
          <li>Logo marquee and community badges</li>
        </PricingCard.Features>
        <PricingCard.CTA href="#/category/proof-and-commerce/pricing-card">Upgrade</PricingCard.CTA>
      </PricingCard>
    ),
    slug: "pricing-card"
  },
  {
    category: "Banners",
    code: `<StickyBanner action={<Button size="sm">Open Deck</Button>}>…</StickyBanner>`,
    description: "Dense inline banner for update or release notices.",
    name: "StickyBanner",
    preview: () => (
      <StickyBanner action={<Button size="sm">Open Deck</Button>}>
        SC-133G04 / soft channel updated / noise 04%
      </StickyBanner>
    ),
    slug: "sticky-banner"
  }
];

const groupedEntries = componentEntries.reduce<Record<string, ComponentEntry[]>>(
  (groups, entry) => {
    groups[entry.category] = [...(groups[entry.category] ?? []), entry];
    return groups;
  },
  {}
);

const categoryDescriptions: Record<string, string> = {
  "Actions & Inputs": "Buttons, form controls, switches, and prompt entry surfaces.",
  Banners: "Dense notice bars for release and state updates.",
  Conversation: "Chat surfaces, bubbles, and prompt docks.",
  Feedback: "Toast, loading, streaming, counters, and status motion.",
  Foundations: "Small primitives that carry state, spacing, and separators.",
  "Motion & Type": "Animated type and controlled emphasis components.",
  Navigation: "Tabs, disclosure, menus, dialogs, popovers, and tooltips.",
  "Proof & Commerce": "Social proof, marquees, badges, and pricing surfaces.",
  Surfaces: "Cards, glass panels, mock interfaces, and ambient displays."
};

const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const categories = Object.entries(groupedEntries).map(([category, entries]) => ({
  category,
  entries,
  slug: categorySlug(category)
}));

function getHashPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "green";
    const urlTheme = new URLSearchParams(window.location.search).get("theme");
    if (isThemeName(urlTheme)) return urlTheme;
    const storedTheme = window.localStorage.getItem("soft-club-theme");
    return isThemeName(storedTheme) ? storedTheme : "green";
  });
  const [route, setRoute] = useState(() => getHashPath());
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getHashPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scTheme = activeTheme;
    window.localStorage.setItem("soft-club-theme", activeTheme);
  }, [activeTheme]);

  const categoryRoute = route.match(/^\/category\/([^/]+)(?:\/([^/]+))?$/);
  const activeCategory = categories.find((group) => group.slug === categoryRoute?.[1]);
  const activeComponentSlug = categoryRoute?.[2];
  const activePath = activeCategory ? `/category/${activeCategory.slug}` : route;

  useEffect(() => {
    if (!activeComponentSlug) return;
    window.setTimeout(() => {
      document
        .getElementById(`component-${activeComponentSlug}`)
        ?.scrollIntoView({ block: "start" });
    }, 0);
  }, [activeComponentSlug, route]);

  return (
    <ToastProvider swipeDirection="right">
      <a className="skip-link" href="#main-content">
        Skip to Content
      </a>
      <div className="docs-shell">
        <aside className="docs-nav">
          <div className="docs-brand">
            <strong translate="no">GEN X</strong>
            <span>Soft Club UI</span>
          </div>
          <div className="theme-switcher" aria-label="Theme palette">
            {themeOptions.map((theme) => (
              <button
                aria-label={`${theme.label} theme`}
                aria-pressed={activeTheme === theme.value}
                key={theme.value}
                onClick={() => setActiveTheme(theme.value)}
                title={theme.description}
                type="button"
              >
                <span className="theme-switcher__swatches" aria-hidden="true">
                  {theme.swatches.map((swatch) => (
                    <span key={swatch} style={{ background: swatch }} />
                  ))}
                </span>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
          <nav aria-label="Component documentation">
            <div className="docs-nav-group">
              <span>Overview</span>
              <a aria-current={activePath === "/" ? "page" : undefined} href="#/">
                Home
              </a>
            </div>
            {categories.map(({ category, entries, slug }) => (
              <div className="docs-nav-group" key={category}>
                <a
                  aria-current={activePath === `/category/${slug}` ? "page" : undefined}
                  className="docs-nav-category"
                  href={`#/category/${slug}`}
                >
                  {category}
                </a>
                <div className="docs-nav-sublist">
                  {entries.map((entry) => {
                    const href = `/category/${slug}/${entry.slug}`;
                    const isActive = route === href;
                    return (
                      <a
                        aria-current={isActive ? "location" : undefined}
                        href={`#${href}`}
                        key={entry.slug}
                      >
                        {entry.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="docs-main" id="main-content">
          {activeCategory ? (
            <CategoryPage
              activeComponentSlug={activeComponentSlug}
              category={activeCategory.category}
              entries={activeCategory.entries}
              showToast={() => setToastOpen(true)}
              slug={activeCategory.slug}
            />
          ) : (
            <HomePage showToast={() => setToastOpen(true)} />
          )}
        </main>
      </div>

      <Toast onOpenChange={setToastOpen} open={toastOpen}>
        <ToastTitle>Soft channel synced</ToastTitle>
        <ToastDescription>Glass pass active. Visual noise settled at 04%.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

function HomePage({ showToast }: { showToast: () => void }) {
  return (
    <>
      <header className="docs-header docs-header--home">
        <div className="title-block">
          <h1>Soft Club UI</h1>
          <p>
            Category-routed React component catalog for green glass surfaces, prompt UI,
            motion text, proof blocks, and compact application primitives.
          </p>
          <div className="home-actions">
            <a className="docs-link-button" href="#/category/actions-and-inputs">
              Browse Components
            </a>
            <a className="docs-link-button docs-link-button--ghost" href="#/category/surfaces/ascii-hero">
              Open AsciiHero
            </a>
          </div>
        </div>
        <div className="hero-plate" aria-hidden="true">
          <div className="hero-photo" />
          <div className="hero-grid">
            <span>A1</span>
            <span>A2</span>
            <span>B1</span>
            <span>B2</span>
          </div>
          <div className="hero-type">CONTEMPORARY SOFT CLUB</div>
        </div>
      </header>

      <section className="docs-section">
        <div className="section-heading">
          <h2>Components</h2>
          <p>Each category has one page; component links scroll inside that page.</p>
        </div>
        <div className="component-index">
          {categories.map(({ category, entries, slug }) => (
            <section className="component-index-group" key={category}>
              <a className="category-card-link" href={`#/category/${slug}`}>
                <h3>{category}</h3>
                <span>{categoryDescriptions[category]}</span>
              </a>
              <div className="component-index-grid">
                {entries.map((entry) => (
                  <a
                    className="component-index-card"
                    href={`#/category/${slug}/${entry.slug}`}
                    key={entry.slug}
                  >
                    <strong>{entry.name}</strong>
                    <span>{entry.description}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="docs-section">
        <div className="section-heading">
          <h2>Library Snapshot</h2>
          <p>Representative pieces from inputs, feedback, surfaces, and proof.</p>
        </div>
        <div className="snapshot-grid">
          <div className="component-demo">
            {componentEntries.find((entry) => entry.slug === "prompt-hero")?.preview({ showToast })}
          </div>
          <div className="component-demo">
            {componentEntries.find((entry) => entry.slug === "token-stream")?.preview({ showToast })}
          </div>
          <div className="component-demo">
            {componentEntries.find((entry) => entry.slug === "chat-dock")?.preview({ showToast })}
          </div>
          <div className="component-demo">
            {componentEntries.find((entry) => entry.slug === "pricing-card")?.preview({ showToast })}
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryPage({
  activeComponentSlug,
  category,
  entries,
  showToast,
  slug
}: {
  activeComponentSlug?: string;
  category: string;
  entries: ComponentEntry[];
  showToast: () => void;
  slug: string;
}) {
  return (
    <article className="component-page">
      <header className="component-page-header">
        <a className="back-link" href="#/">
          Back to Index
        </a>
        <p>Category</p>
        <h1>{category}</h1>
        <span>{categoryDescriptions[category]}</span>
      </header>

      <nav className="category-tabs" aria-label={`${category} components`}>
        {entries.map((entry) => (
          <a
            aria-current={activeComponentSlug === entry.slug ? "location" : undefined}
            href={`#/category/${slug}/${entry.slug}`}
            key={entry.slug}
          >
            {entry.name}
          </a>
        ))}
      </nav>

      <div className="category-examples">
        {entries.map((entry) => (
          <section
            className="example-block"
            id={`component-${entry.slug}`}
            key={entry.slug}
            aria-labelledby={`${entry.slug}-heading`}
          >
            <div className="example-block__header">
              <div>
                <h2 id={`${entry.slug}-heading`}>{entry.name}</h2>
                <p>{entry.description}</p>
              </div>
            </div>
            <div className="example-block__preview">{entry.preview({ showToast })}</div>
            <div className="example-block__code">
              <pre>
                <code>{entry.code}</code>
              </pre>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

export default App;
