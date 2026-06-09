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
import {
  Alert,
  Avatar,
  Breadcrumb,
  ButtonGroup,
  Calendar,
  DateInput,
  DatePicker,
  DuotoneCard,
  DuotoneImage,
  GlitchText,
  Kbd,
  Label,
  Loader,
  type LoaderName,
  loaderNames,
  LogoRow,
  MatrixRain,
  NativeSelect,
  OrbitLoader,
  Pagination,
  ParticleField,
  Progress,
  RadarSweep,
  RadioGroup,
  ScrollArea,
  Slider,
  Spinner,
  Table,
  Toggle,
  ToggleGroup,
  ToolCall,
  Waveform
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
    glass: "blue",
    label: "Blue",
    swatches: ["#7ebcff", "#87f2e6", "#ffd16a"],
    value: "blue"
  },
  {
    description: "Green room glow, soft glass, muted concrete.",
    glass: "green",
    label: "Green",
    swatches: ["#8bb8d7", "#8effad", "#ff8a3d"],
    value: "green"
  },
  {
    description: "Amber motion blur and late-night platform heat.",
    glass: "amber",
    label: "Orange",
    swatches: ["#ffd27a", "#ff9a20", "#ffcf35"],
    value: "orange"
  },
  {
    description: "Night City: petrol-blue glass, neon cyan lights, hot HUD red.",
    glass: "neon",
    label: "Night City",
    swatches: ["#5eb3af", "#a1eae3", "#d22348"],
    value: "night-city"
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
    code: `<AsciiHero variant="banner" title="cursor reactive field" />`,
    description: "Full-bleed reactive ASCII banner: the canvas fills the surface, title overlaid, no side panel.",
    name: "AsciiBanner",
    preview: () => (
      <AsciiHero
        label="PERFORMATIVE / ASCII"
        spotlightRadius={11}
        subtitle="Reactive ASCII surface tuned to Soft Club tokens."
        title="cursor reactive field"
        variant="banner"
      />
    ),
    slug: "ascii-banner"
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
    code: `<NodeGrid points={[{ x: 12, y: 30, label: "A1" }, { x: 50, y: 64 }]} />`,
    description: "Grid surface that plots an x,y list of nodes (percent coords) with optional labels and tones.",
    name: "NodeGrid",
    preview: () => (
      <NodeGrid
        points={[
          { label: "A1", tone: "green", x: 10, y: 26 },
          { tone: "blue", x: 30, y: 60 },
          { x: 48, y: 32 },
          { tone: "warning", x: 66, y: 70 },
          { tone: "green", x: 82, y: 42 },
          { label: "B2", tone: "danger", x: 90, y: 18 }
        ]}
      >
        <AuroraField intensity="low" />
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
    code: `<ChatBubble agent="Synthetica" thinking="reasoning…">
  <TokenStream text="Q3 churn is bleeding from your SMB cohort…" loop />
</ChatBubble>`,
    description: "Message bubble with an agent name and a thinking pill that streams a reply.",
    name: "ChatBubble",
    preview: () => (
      <div className="preview-stack">
        <ChatBubble agent="Synthetica" thinking="reasoning…" tone="system">
          <TokenStream
            loop
            loopDelayMs={2800}
            text="Q3 churn is bleeding from your SMB cohort. Net retention there is 71% vs. 104% in mid-market and 118% in enterprise."
          />
        </ChatBubble>
        <ChatBubble agent="Synthetica" thinking="calling search_web…" tone="system">
          <TokenStream loop loopDelayMs={3400} text="Pulling the latest cohort numbers before I answer." />
        </ChatBubble>
        <ChatBubble meta="operator" tone="user">
          Keep it useful in the left menu.
        </ChatBubble>
      </div>
    ),
    slug: "chat-bubble"
  },
  {
    category: "Conversation",
    code: `<ToolCall tool="search_web" status="running" />`,
    description: "Agent tool-call indicator: a loading pill naming the called tool and its state.",
    name: "ToolCall",
    preview: () => (
      <div className="preview-stack">
        <div className="preview-row">
          <ToolCall status="calling" tool="search_web" />
          <ToolCall status="running" tool="query_db" />
        </div>
        <div className="preview-row">
          <ToolCall status="done" tool="render_chart" />
          <ToolCall status="error" tool="send_email" />
        </div>
      </div>
    ),
    slug: "tool-call"
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
    code: `<LogoRow heading="Backed by" logos={logos} />`,
    description: "Static, centered logo strip for backers, press, or alumni.",
    name: "LogoRow",
    preview: () => (
      <LogoRow
        heading="Backed by"
        logos={[
          { kind: "node", node: "NOVA", key: "nova" },
          { kind: "node", node: "A24", key: "a24" },
          { kind: "node", node: "VOID FM", key: "void" },
          { kind: "node", node: "ROOM 33", key: "room" },
          { kind: "node", node: "K7 LABS", key: "k7" }
        ]}
      />
    ),
    slug: "logo-row"
  },
  {
    category: "Proof & Commerce",
    code: `<CommunityBadge variant="outline" tone="blue" title="Join the Discord" subtitle="…" />`,
    description: "Social-proof tile with surface, outline, ghost, and solid variants across tones.",
    name: "CommunityBadge",
    preview: () => (
      <div className="preview-stack">
        <CommunityBadge
          href="#/category/proof-and-commerce/community-badge"
          iconNode={<span>GH</span>}
          subtitle={
            <>
              <b>12,847</b> stars / +184 this week
            </>
          }
          title="Star us on GitHub"
          trailing="→"
        />
        <CommunityBadge
          href="#/category/proof-and-commerce/community-badge"
          iconNode={<span>DC</span>}
          subtitle="9,210 members online"
          title="Join the Discord"
          tone="blue"
          variant="outline"
        />
        <CommunityBadge
          href="#/category/proof-and-commerce/community-badge"
          iconNode={<span>X</span>}
          size="sm"
          subtitle="Follow for component drops"
          title="@softclubui"
          tone="warm"
          variant="solid"
        />
        <CommunityBadge
          href="#/category/proof-and-commerce/community-badge"
          iconNode={<span>RS</span>}
          size="sm"
          subtitle="Weekly dispatch and release notes"
          title="Soft Club Dispatch"
          tone="neutral"
          variant="ghost"
        />
      </div>
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
  },
  {
    category: "Foundations",
    code: `<Label required>Channel name</Label>`,
    description: "Form label with optional required marker, paired with any control.",
    name: "Label",
    preview: () => (
      <div className="preview-stack">
        <Label htmlFor="demo-room">Room code</Label>
        <Input aria-label="Room code" defaultValue="SC-133G04" id="demo-room" name="demo-room" />
        <Label required>Channel name</Label>
      </div>
    ),
    slug: "label"
  },
  {
    category: "Foundations",
    code: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`,
    description: "Keyboard key cap for shortcut hints and command surfaces.",
    name: "Kbd",
    preview: () => (
      <div className="preview-row">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <span>open palette</span>
      </div>
    ),
    slug: "kbd"
  },
  {
    category: "Foundations",
    code: `<Avatar fallback="SC" />`,
    description: "Image avatar with monogram fallback, tones, and stacked groups.",
    name: "Avatar",
    preview: () => (
      <div className="preview-row">
        <Avatar fallback="SC" />
        <Avatar fallback="A3" size="lg" tone="blue" />
        <Avatar.Group>
          <Avatar fallback="R3" />
          <Avatar fallback="K7" tone="warm" />
          <Avatar fallback="VF" tone="blue" />
        </Avatar.Group>
      </div>
    ),
    slug: "avatar"
  },
  {
    category: "Actions & Inputs",
    code: `<NativeSelect><option>Bus B2</option></NativeSelect>`,
    description: "Styled native select with token chrome and custom chevron.",
    name: "NativeSelect",
    preview: () => (
      <NativeSelect aria-label="Route bus" defaultValue="b2">
        <option value="a1">Bus A1</option>
        <option value="b2">Bus B2</option>
        <option value="c3">Bus C3</option>
      </NativeSelect>
    ),
    slug: "native-select"
  },
  {
    category: "Actions & Inputs",
    code: `<RadioGroup.Item value="glass" label="Green glass" />`,
    description: "Accessible radio group with controlled value and labelled items.",
    name: "RadioGroup",
    preview: () => (
      <RadioGroup defaultValue="glass" name="demo-surface">
        <RadioGroup.Item
          description="Default Soft Club surface."
          label="Green glass"
          value="glass"
        />
        <RadioGroup.Item description="Cold platform light." label="Metro" value="metro" />
        <RadioGroup.Item description="Amber late-night heat." label="Signal" value="signal" />
      </RadioGroup>
    ),
    slug: "radio-group"
  },
  {
    category: "Actions & Inputs",
    code: `<Slider defaultValue={64} />`,
    description: "Native range slider with token track and themed thumb tones.",
    name: "Slider",
    preview: () => (
      <div className="preview-stack">
        <Slider aria-label="Noise" defaultValue={64} />
        <Slider aria-label="Blur" defaultValue={32} tone="blue" />
        <Slider aria-label="Heat" defaultValue={48} tone="warning" />
      </div>
    ),
    slug: "slider"
  },
  {
    category: "Actions & Inputs",
    code: `<Toggle defaultPressed>Glass</Toggle>`,
    description: "Two-state pressable toggle with default and outline variants.",
    name: "Toggle",
    preview: () => (
      <div className="preview-row">
        <Toggle defaultPressed>Glass</Toggle>
        <Toggle variant="outline">Grid</Toggle>
        <Toggle variant="outline">Scan</Toggle>
      </div>
    ),
    slug: "toggle"
  },
  {
    category: "Actions & Inputs",
    code: `<ToggleGroup type="single">…</ToggleGroup>`,
    description: "Single or multiple toggle set with shared selection state.",
    name: "ToggleGroup",
    preview: () => (
      <ToggleGroup aria-label="Align" defaultValue={["center"]}>
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup>
    ),
    slug: "toggle-group"
  },
  {
    category: "Actions & Inputs",
    code: `<ButtonGroup><Button variant="outline">Scan</Button></ButtonGroup>`,
    description: "Joins related buttons into one seamless segmented control.",
    name: "ButtonGroup",
    preview: () => (
      <ButtonGroup>
        <Button variant="outline">Scan</Button>
        <Button variant="outline">Route</Button>
        <Button variant="outline">Render</Button>
      </ButtonGroup>
    ),
    slug: "button-group"
  },
  {
    category: "Navigation",
    code: `<Breadcrumb><Breadcrumb.List>…</Breadcrumb.List></Breadcrumb>`,
    description: "Hierarchy trail with links, current page, and chevron separators.",
    name: "Breadcrumb",
    preview: () => (
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="#/category/surfaces">Surfaces</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Glass Panel</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    ),
    slug: "breadcrumb"
  },
  {
    category: "Navigation",
    code: `<Pagination><Pagination.Content>…</Pagination.Content></Pagination>`,
    description: "Page navigation with prev/next, active page, and ellipsis.",
    name: "Pagination",
    preview: () => (
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous href="#/category/navigation/pagination" />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="#/category/navigation/pagination">1</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="#/category/navigation/pagination" isActive>
              2
            </Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="#/category/navigation/pagination">3</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next href="#/category/navigation/pagination" />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    ),
    slug: "pagination"
  },
  {
    category: "Feedback",
    code: `<Alert variant="green"><Alert.Title>Synced</Alert.Title></Alert>`,
    description: "Inline status message with variants and an optional leading icon.",
    name: "Alert",
    preview: () => (
      <div className="preview-stack">
        <Alert variant="green">
          <Alert.Title>Channel synced</Alert.Title>
          <Alert.Description>Glass pass active. Visual noise settled at 04%.</Alert.Description>
        </Alert>
        <Alert variant="warning">
          <Alert.Title>Signal drift</Alert.Title>
          <Alert.Description>Bus B2 latency is above the soft threshold.</Alert.Description>
        </Alert>
        <Alert variant="danger">
          <Alert.Title>Channel breach</Alert.Title>
          <Alert.Description>Bus C3 dropped the glass layer. Re-route before the next pass.</Alert.Description>
        </Alert>
      </div>
    ),
    slug: "alert"
  },
  {
    category: "Feedback",
    code: `<Progress value={72} />`,
    description: "Determinate progress bar with green, blue, and warning tones.",
    name: "Progress",
    preview: () => (
      <div className="preview-stack">
        <Progress value={72} />
        <Progress tone="blue" value={44} />
        <Progress tone="warning" value={28} />
      </div>
    ),
    slug: "progress"
  },
  {
    category: "Feedback",
    code: `<Spinner />`,
    description: "Compact ring spinner for inline and button loading states.",
    name: "Spinner",
    preview: () => (
      <div className="preview-row">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
      </div>
    ),
    slug: "spinner"
  },
  {
    category: "Feedback",
    code: `<OrbitLoader />`,
    description: "Live three-ring orbital loader with themed satellites.",
    name: "OrbitLoader",
    preview: () => (
      <div className="preview-row">
        <OrbitLoader size="sm" />
        <OrbitLoader />
        <OrbitLoader size="lg" />
      </div>
    ),
    slug: "orbit-loader"
  },
  {
    category: "Feedback",
    code: `<Loader preset="arc" />`,
    description: "Frame-based terminal loaders ported from rattles. Switch presets anywhere a spinner lives.",
    name: "Loader",
    preview: () => <LoaderShowcase />,
    slug: "loader"
  },
  {
    category: "Surfaces",
    code: `<Table><Table.Header>…</Table.Header></Table>`,
    description: "Composable data table with header, body, footer, and hover rows.",
    name: "Table",
    preview: () => (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Node</Table.Head>
            <Table.Head>Bus</Table.Head>
            <Table.Head>State</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>A1</Table.Cell>
            <Table.Cell>Glass</Table.Cell>
            <Table.Cell>
              <Badge variant="green">Online</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>B2</Table.Cell>
            <Table.Cell>Metro</Table.Cell>
            <Table.Cell>
              <Badge variant="warning">Drift</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>C3</Table.Cell>
            <Table.Cell>Signal</Table.Cell>
            <Table.Cell>
              <Badge variant="neutral">Idle</Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    ),
    slug: "table"
  },
  {
    category: "Surfaces",
    code: `<ScrollArea maxHeight="9rem">…</ScrollArea>`,
    description: "Scoped scroll container with themed thin scrollbars.",
    name: "ScrollArea",
    preview: () => (
      <ScrollArea maxHeight="9rem">
        <div style={{ display: "grid", gap: "0.5rem", padding: "0.75rem" }}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>SC/{index + 1} — glass bus mapped, noise 0{index}%</div>
          ))}
        </div>
      </ScrollArea>
    ),
    slug: "scroll-area"
  },
  {
    category: "Live & Reactive",
    code: `<MatrixRain />`,
    description: "Falling glyph rain rendered on canvas, tinted to the active theme.",
    name: "MatrixRain",
    preview: () => <MatrixRain label="MATRIX / RAIN" />,
    slug: "matrix-rain"
  },
  {
    category: "Live & Reactive",
    code: `<ParticleField />`,
    description: "Cursor-reactive constellation of particles linked by signal lines.",
    name: "ParticleField",
    preview: () => <ParticleField label="PARTICLE / FIELD" />,
    slug: "particle-field"
  },
  {
    category: "Live & Reactive",
    code: `<RadarSweep />`,
    description: "Rotating radar sweep over concentric rings with fading blips.",
    name: "RadarSweep",
    preview: () => <RadarSweep label="RADAR / SWEEP" />,
    slug: "radar-sweep"
  },
  {
    category: "Live & Reactive",
    code: `<Waveform />`,
    description: "Always-moving audio-style bar field with gradient bars.",
    name: "Waveform",
    preview: () => <Waveform label="WAVEFORM" />,
    slug: "waveform"
  },
  {
    category: "Live & Reactive",
    code: `<GlitchText text="SOFT CLUB" />`,
    description: "Phosphor glitch type with dual color channels jittering on a loop.",
    name: "GlitchText",
    preview: () => (
      <div className="preview-counter">
        <GlitchText text="SOFT CLUB" />
      </div>
    ),
    slug: "glitch-text"
  },
  {
    category: "Media",
    code: `<DuotoneImage src={src} color="rgb(142 255 173)" />`,
    description: "Recolors any image into a single-hue duotone via CSS blends.",
    name: "DuotoneImage",
    preview: () => (
      <div className="preview-row">
        <DuotoneImage
          alt=""
          src="https://picsum.photos/seed/soft-club-green/360/450"
          style={{ width: "9rem" }}
        />
        <DuotoneImage
          alt=""
          color="rgb(126 188 255)"
          src="https://picsum.photos/seed/soft-club-blue/360/450"
          style={{ width: "9rem" }}
        />
        <DuotoneImage
          alt=""
          color="rgb(255 154 32)"
          src="https://picsum.photos/seed/soft-club-amber/360/450"
          style={{ width: "9rem" }}
        />
      </div>
    ),
    slug: "duotone-image"
  },
  {
    category: "Media",
    code: `<DuotoneCard src={src} color="rgb(126 188 255)" featured>…</DuotoneCard>`,
    description: "Image-backed plan card: a duotone picture under a readable content scrim.",
    name: "DuotoneCard",
    preview: () => (
      <div className="snapshot-grid">
        <DuotoneCard alt="" color="rgb(142 255 173)" src="https://picsum.photos/seed/plan-free/640/800">
          <DuotoneCard.Header>
            <DuotoneCard.Meta>FREE / $0 mo</DuotoneCard.Meta>
            <DuotoneCard.Title>Free</DuotoneCard.Title>
          </DuotoneCard.Header>
          <DuotoneCard.Body>
            <span>· Pay-as-you-go access</span>
            <span>· 300+ models</span>
          </DuotoneCard.Body>
          <DuotoneCard.Footer>
            <Button size="sm" variant="outline">
              Choose plan
            </Button>
          </DuotoneCard.Footer>
        </DuotoneCard>
        <DuotoneCard
          alt=""
          color="rgb(126 188 255)"
          featured
          src="https://picsum.photos/seed/plan-plus/640/800"
        >
          <DuotoneCard.Header>
            <DuotoneCard.Meta>PLUS / $20 mo</DuotoneCard.Meta>
            <DuotoneCard.Title>Signal Plus</DuotoneCard.Title>
          </DuotoneCard.Header>
          <DuotoneCard.Body>
            <span>· 300+ models</span>
            <span>· Hosted tool usage</span>
            <span>· High rate limits</span>
          </DuotoneCard.Body>
          <DuotoneCard.Footer>
            <Button size="sm">Subscribe and connect</Button>
          </DuotoneCard.Footer>
        </DuotoneCard>
      </div>
    ),
    slug: "duotone-card"
  },
  {
    category: "Date & Time",
    code: `<Calendar defaultValue={new Date()} />`,
    description: "Month-grid calendar with keyboard navigation and single-date selection.",
    name: "Calendar",
    preview: () => <Calendar defaultMonth={new Date(2026, 5, 1)} defaultValue={new Date(2026, 5, 14)} />,
    slug: "calendar"
  },
  {
    category: "Date & Time",
    code: `<Calendar mode="range" defaultValue={{ start, end }} />`,
    description: "Range mode picks a start and end date across a connected highlight.",
    name: "CalendarRange",
    preview: () => (
      <Calendar
        defaultMonth={new Date(2026, 5, 1)}
        defaultValue={{ end: new Date(2026, 5, 19), start: new Date(2026, 5, 11) }}
        mode="range"
      />
    ),
    slug: "calendar-range"
  },
  {
    category: "Date & Time",
    code: `<DatePicker defaultValue={new Date()} />`,
    description: "Button-triggered calendar in a popover that shows the chosen date.",
    name: "DatePicker",
    preview: () => <DatePicker defaultValue={new Date(2026, 5, 14)} />,
    slug: "date-picker"
  },
  {
    category: "Date & Time",
    code: `<DateInput defaultValue="2026-06-14" />`,
    description: "Styled native date field with the browser's date picker.",
    name: "DateInput",
    preview: () => <DateInput aria-label="Pick a date" defaultValue="2026-06-14" name="demo-date" />,
    slug: "date-input"
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
  "Date & Time": "Calendars, date pickers, and date entry fields.",
  Feedback: "Toast, loading, streaming, counters, and status motion.",
  Foundations: "Small primitives that carry state, spacing, and separators.",
  "Live & Reactive": "Canvas-driven, cursor-aware, always-moving surfaces.",
  Media: "Image treatments that recolor to a chosen hue or the active theme.",
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

const wideExampleSlugs = new Set([
  "ascii-banner",
  "ascii-hero",
  "aurora-field",
  "before-after",
  "calendar",
  "calendar-range",
  "chat-dock",
  "duotone-card",
  "duotone-image",
  "loader",
  "logo-marquee",
  "matrix-rain",
  "mock-console",
  "mock-ide",
  "node-grid",
  "particle-field",
  "pricing-card",
  "prompt-hero",
  "radar-sweep",
  "signal-marquee",
  "sticky-banner",
  "table",
  "token-stream",
  "waveform"
]);

const standardExampleSlugs = new Set([
  "accordion",
  "card",
  "dialog",
  "dropdown-menu",
  "glass-card",
  "glass-panel",
  "popover",
  "rotator",
  "tabs",
  "textarea"
]);

const getExampleScale = (entry: ComponentEntry) => {
  if (wideExampleSlugs.has(entry.slug)) return "wide";
  if (standardExampleSlugs.has(entry.slug)) return "standard";
  return "compact";
};

const demoPages = [
  { label: "Landing", slug: "landing" },
  { label: "Product", slug: "product" },
  { label: "Pricing", slug: "pricing" },
  { label: "Community", slug: "community" }
] as const;

type DemoPageSlug = (typeof demoPages)[number]["slug"];

const isDemoPageSlug = (value: string | undefined): value is DemoPageSlug =>
  demoPages.some((page) => page.slug === value);

const docsBasePath = "/soft-club-ui";

function normalizeRoutePath(path: string) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function getRoutePath() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) return normalizeRoutePath(hash.startsWith("/") ? hash : `/${hash}`);

  const pathname = window.location.pathname;
  const baseRelativePath = pathname.startsWith(docsBasePath)
    ? pathname.slice(docsBasePath.length)
    : pathname;

  return normalizeRoutePath(baseRelativePath || "/");
}

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "green";
    const urlTheme = new URLSearchParams(window.location.search).get("theme");
    if (isThemeName(urlTheme)) return urlTheme;
    const storedTheme = window.localStorage.getItem("soft-club-theme");
    return isThemeName(storedTheme) ? storedTheme : "green";
  });
  const [route, setRoute] = useState(() => getRoutePath());
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoutePath());
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.scTheme = activeTheme;
    window.localStorage.setItem("soft-club-theme", activeTheme);
  }, [activeTheme]);

  const categoryRoute = route.match(/^\/category\/([^/]+)(?:\/([^/]+))?$/);
  const demoRoute = route.match(/^\/demo(?:\/([^/]+))?$/);
  const activeDemoPage = isDemoPageSlug(demoRoute?.[1]) ? demoRoute?.[1] : demoRoute ? "landing" : undefined;
  const activeCategory = categories.find((group) => group.slug === categoryRoute?.[1]);
  const activeComponentSlug = categoryRoute?.[2];
  const activePath = activeDemoPage ? "/demo" : activeCategory ? `/category/${activeCategory.slug}` : route;

  useEffect(() => {
    if (!activeComponentSlug) return;
    window.setTimeout(() => {
      document
        .getElementById(`component-${activeComponentSlug}`)
        ?.scrollIntoView({ block: "start" });
    }, 0);
  }, [activeComponentSlug, route]);

  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [route]);

  const showToast = () => setToastOpen(true);
  const isDocsView = Boolean(activeDemoPage || activeCategory);

  return (
    <ToastProvider swipeDirection="right">
      <a className="skip-link" href="#main-content">
        Skip to Content
      </a>
      {isDocsView ? (
        <div className="docs-shell">
          <header className="docs-topbar">
            <a className="docs-topbar__brand" href="#/">
              <strong translate="no">GEN X</strong>
              <span>Soft Club UI</span>
            </a>
            <div className="docs-topbar__actions">
              <ThemeSwitcher
                activeTheme={activeTheme}
                setActiveTheme={setActiveTheme}
                variant="bar"
              />
              <button
                aria-controls="docs-nav"
                aria-expanded={navOpen}
                aria-label={navOpen ? "Close menu" : "Open menu"}
                className={`docs-menu-toggle${navOpen ? " docs-menu-toggle--open" : ""}`}
                onClick={() => setNavOpen((open) => !open)}
                type="button"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </header>
          <aside className={`docs-nav${navOpen ? " docs-nav--open" : ""}`} id="docs-nav">
            <a className="docs-brand" href="#/">
              <strong translate="no">GEN X</strong>
              <span>Soft Club UI</span>
            </a>
            <ThemeSwitcher
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              variant="rail"
            />
            <nav aria-label="Component documentation" onClick={() => setNavOpen(false)}>
              <div className="docs-nav-group">
                <span>Overview</span>
                <a href="#/">Home</a>
                <a aria-current={activePath === "/demo" ? "page" : undefined} href="#/demo">
                  Demo Website
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
            {activeDemoPage ? (
              <DemoWebsite page={activeDemoPage} showToast={showToast} />
            ) : activeCategory ? (
              <CategoryPage
                activeComponentSlug={activeComponentSlug}
                category={activeCategory.category}
                entries={activeCategory.entries}
                showToast={showToast}
                slug={activeCategory.slug}
              />
            ) : null}
          </main>
        </div>
      ) : (
        <LandingPage
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          showToast={showToast}
        />
      )}

      <Toast onOpenChange={setToastOpen} open={toastOpen}>
        <ToastTitle>Soft channel synced</ToastTitle>
        <ToastDescription>Glass pass active. Visual noise settled at 04%.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

function DemoWebsite({ page, showToast }: { page: DemoPageSlug; showToast: () => void }) {
  return (
    <article className="demo-site">
      <header className="demo-site__nav">
        <a className="demo-site__brand" href="#/demo" translate="no">
          GEN X
        </a>
        <nav aria-label="Demo website pages">
          {demoPages.map((demoPage) => (
            <a
              aria-current={page === demoPage.slug ? "page" : undefined}
              href={demoPage.slug === "landing" ? "#/demo" : `#/demo/${demoPage.slug}`}
              key={demoPage.slug}
            >
              {demoPage.label}
            </a>
          ))}
        </nav>
      </header>

      {page === "landing" ? <DemoLanding showToast={showToast} /> : null}
      {page === "product" ? <DemoProduct /> : null}
      {page === "pricing" ? <DemoPricing /> : null}
      {page === "community" ? <DemoCommunity /> : null}
    </article>
  );
}

function DemoLanding({ showToast }: { showToast: () => void }) {
  return (
    <>
      <section className="demo-hero">
        <div className="demo-hero__copy">
          <h1>
            Coordinate the room before the feed turns into noise.
          </h1>
          <p>
            A compact collaboration layer for crews that route prompts, decisions, pricing
            changes, and community feedback through one readable surface.
          </p>
          <PromptHero
            ctaLabel="Open room"
            defaultValue="Plan Friday release room with pricing, support, and community"
            onSubmit={showToast}
          />
          <div className="demo-hero__actions">
            <Button asChild>
              <a href="#/demo/product">View Product</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#/demo/pricing">See Pricing</a>
            </Button>
          </div>
        </div>
        <div className="demo-hero__visual">
          <div className="demo-hero__status">
            <StatusDot tone="green" />
            <TokenStream
              animated
              loop
              loopDelayMs={1600}
              speedMs={24}
              text="routing / launch-room / pricing-ready / community-online"
            />
          </div>
          <MockIDE
            filename="launch-room.ts"
            tokens={[
              { children: "// live room configuration\n", tone: "comment" },
              { children: "const ", tone: "keyword" },
              { children: "room", tone: "function" },
              { children: " = " },
              { children: '"friday-release"', tone: "string" },
              { children: ";\nroute", tone: "function" },
              { children: "({ pricing: " },
              { children: "true", tone: "keyword" },
              { children: ", community: " },
              { children: "true", tone: "keyword" },
              { children: " });" }
            ]}
          />
        </div>
      </section>

      <LogoMarquee
        className="demo-marquee"
        logos={[
          { kind: "node", node: "ROOM 33", key: "room33" },
          { kind: "node", node: "ATLAS", key: "atlas" },
          { kind: "node", node: "VOID FM", key: "voidfm" },
          { kind: "node", node: "K7 LABS", key: "k7" },
          { kind: "node", node: "NOVA", key: "nova" }
        ]}
        speed={26}
      />

      <section className="demo-section demo-section--split">
        <div>
          <h2>One surface, four operating modes.</h2>
          <p>
            Teams can switch between prompt capture, execution notes, launch signals, and
            community response without leaving the room.
          </p>
        </div>
        <div className="demo-mode-grid">
          {["Prompt", "Launch", "Pricing", "Community"].map((mode) => (
            <GlassCard className="demo-mode-card" key={mode}>
              <span>{mode}</span>
              <strong>
                <GradientText>{mode === "Prompt" ? "Clean input" : mode === "Launch" ? "Live route" : mode === "Pricing" ? "Plan lock" : "Signal read"}</GradientText>
              </strong>
            </GlassCard>
          ))}
        </div>
      </section>
    </>
  );
}

function DemoProduct() {
  return (
    <>
      <DemoPageHeader
        copy="Built for focused work: prompts, context, and status updates stay close together without turning the product into a dashboard wall."
        title="Product"
      />
      <section className="demo-section demo-product-grid">
        <GlassPanel>
          <GlassPanelHeader>
            <GlassPanelKicker>Room Stack</GlassPanelKicker>
            <GlassPanelTitle>Release desk</GlassPanelTitle>
          </GlassPanelHeader>
          <GlassPanelBody>
            <div className="demo-task-list">
              {[
                ["Prompt intake", "12 clean briefs"],
                ["Pricing pass", "2 plans changed"],
                ["Community read", "48 posts reviewed"]
              ].map(([label, value]) => (
                <div className="demo-task-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </GlassPanelBody>
        </GlassPanel>
        <div className="demo-chat-stack">
          <ChatBubble meta="Ops" tone="system">
            Pricing copy is locked. Push the annual plan as the default path.
          </ChatBubble>
          <ChatBubble meta="Community" tone="signal">
            Support thread volume is calm. Two launch questions need a pinned answer.
          </ChatBubble>
          <ChatBubble meta="You" tone="user">
            Route both into the release room and mark the pricing card ready.
          </ChatBubble>
        </div>
      </section>
      <section className="demo-section">
        <NodeGrid />
      </section>
    </>
  );
}

function DemoPricing() {
  return (
    <>
      <DemoPageHeader
        copy="A compact pricing page with enough detail to compare plans quickly, using the same library primitives as the component catalog."
        title="Pricing"
      />
      <section className="demo-pricing-grid">
        {[
          ["Room", "$19", "For small launch crews.", ["3 rooms", "Shared prompts", "Community notes"]],
          ["Club", "$49", "For teams running weekly cycles.", ["Unlimited rooms", "Pricing routes", "Priority support"]],
          ["Signal", "$129", "For multi-team operations.", ["Audit trail", "Custom themes", "Dedicated onboarding"]]
        ].map(([tier, price, blurb, features], index) => (
          <PricingCard featured={index === 1} key={tier as string}>
            {index === 1 ? <PricingCard.Flag>Most used</PricingCard.Flag> : null}
            <PricingCard.Tier>{tier}</PricingCard.Tier>
            <PricingCard.Amount unit="/mo">{price}</PricingCard.Amount>
            <PricingCard.Blurb>{blurb}</PricingCard.Blurb>
            <PricingCard.Features>
              {(features as string[]).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </PricingCard.Features>
            <PricingCard.CTA href="#/demo/community">Start room</PricingCard.CTA>
          </PricingCard>
        ))}
      </section>
    </>
  );
}

function DemoCommunity() {
  return (
    <>
      <DemoPageHeader
        copy="Community proof, changelog notes, and public-facing updates stay compact enough to scan without losing the Soft Club atmosphere."
        title="Community"
      />
      <section className="demo-section demo-community-layout">
        <div className="demo-community-list">
          <CommunityBadge href="#/demo/community" subtitle="1.8k builders reading release notes" title="Soft Club Dispatch" />
          <CommunityBadge href="#/demo/community" subtitle="Weekly office hours and pricing clinics" title="Room 33" />
          <CommunityBadge href="#/demo/community" subtitle="Design notes, prompt surfaces, and component drops" title="K7 Labs" />
        </div>
        <GlassPanel>
          <GlassPanelHeader>
            <GlassPanelKicker>Changelog</GlassPanelKicker>
            <GlassPanelTitle>June release</GlassPanelTitle>
          </GlassPanelHeader>
          <GlassPanelBody>
            <div className="demo-changelog">
              <p>PromptHero now supports quieter submit states.</p>
              <p>PricingCard gained plan flags and tighter feature rows.</p>
              <p>TokenStream loop timing can be tuned per surface.</p>
            </div>
          </GlassPanelBody>
        </GlassPanel>
      </section>
    </>
  );
}

function DemoPageHeader({ copy, title }: { copy: string; title: string }) {
  return (
    <header className="demo-page-header">
      <a className="back-link" href="#/demo">
        Back to Demo
      </a>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}

const githubUrl = "https://github.com/cobanov/soft-club-ui";
const npmUrl = "https://www.npmjs.com/package/@cobanov/soft-club-ui";
const licenseUrl = "https://github.com/cobanov/soft-club-ui/blob/main/LICENSE";
const contributingUrl = "https://github.com/cobanov/soft-club-ui/blob/main/CONTRIBUTING.md";
const installCommand = "pnpm add @cobanov/soft-club-ui @cobanov/soft-club-tokens";

const packageManagers = [
  { command: "pnpm add @cobanov/soft-club-ui @cobanov/soft-club-tokens", id: "pnpm" },
  { command: "npm install @cobanov/soft-club-ui @cobanov/soft-club-tokens", id: "npm" },
  { command: "yarn add @cobanov/soft-club-ui @cobanov/soft-club-tokens", id: "yarn" },
  { command: "bun add @cobanov/soft-club-ui @cobanov/soft-club-tokens", id: "bun" }
] as const;

const usageSnippet = `import "@cobanov/soft-club-ui/styles.css";
import { Button, Card, CardHeader, CardTitle } from "@cobanov/soft-club-ui";

export function Room() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Room A3</CardTitle>
      </CardHeader>
      <Button>Sync channel</Button>
    </Card>
  );
}`;

const featureIconProps = {
  "aria-hidden": true,
  fill: "none",
  height: 18,
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.6,
  viewBox: "0 0 24 24",
  width: 18
} as const;

const landingFeatures: { body: string; icon: ReactNode; title: string }[] = [
  {
    body: "Every color, space, radius, shadow, and motion value is a CSS variable. Drop the token sheet into any stack and give your CSS migration one source of truth.",
    icon: (
      <svg {...featureIconProps}>
        <path d="M12 3 3 8l9 5 9-5-9-5Z" />
        <path d="m3 13 9 5 9-5" />
      </svg>
    ),
    title: "Framework-agnostic tokens"
  },
  {
    body: "Install the package or lift the source. Components forward refs and accept className, so the markup stays yours to extend, the shadcn way.",
    icon: (
      <svg {...featureIconProps}>
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
    title: "Copy, own, extend"
  },
  {
    body: "Dialog, Tabs, Popover, Dropdown, and Tooltip ride on Radix primitives. Focus order, keyboard control, and ARIA arrive already wired in.",
    icon: (
      <svg {...featureIconProps}>
        <circle cx="12" cy="5" r="1" />
        <path d="m9 20 3-6 3 6" />
        <path d="m6 8 6 2 6-2" />
        <path d="M12 10v4" />
      </svg>
    ),
    title: "Accessible by default"
  },
  {
    body: "Three calibrated palettes. Flip data-sc-theme on the root element and the whole system re-skins instantly. No rebuild, no JavaScript.",
    icon: (
      <svg {...featureIconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: "Theme with one attribute"
  },
  {
    body: "Full types ship with the package. Autocomplete every variant and slot, and catch prop typos before they ever reach the screen.",
    icon: (
      <svg {...featureIconProps}>
        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
        <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
      </svg>
    ),
    title: "TypeScript first"
  },
  {
    body: "Glass, scanlines, phosphor glow, and motion are tuned through tokens and respect reduced-motion. Atmosphere without the noise.",
    icon: (
      <svg {...featureIconProps}>
        <path d="M3 14c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        <path d="M3 9c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity="0.45" />
      </svg>
    ),
    title: "Mood, controlled"
  }
];

const showcaseSlugs = [
  "prompt-hero",
  "button",
  "badge",
  "token-stream",
  "tabs",
  "switch",
  "pricing-card",
  "glass-panel",
  "stat-counter",
  "chat-dock",
  "accordion",
  "dropdown-menu"
] as const;

const entryBySlug = new Map(componentEntries.map((entry) => [entry.slug, entry]));

const docHrefForEntry = (entry: ComponentEntry) =>
  `#/category/${categorySlug(entry.category)}/${entry.slug}`;

const landingStats: { label: string; suffix?: string; value: number }[] = [
  { label: "Components", suffix: "+", value: componentEntries.length },
  { label: "Categories", value: categories.length },
  { label: "Themes", value: themeOptions.length },
  { label: "Token-driven", suffix: "%", value: 100 }
];

function ThemeSwitcher({
  activeTheme,
  setActiveTheme,
  variant = "rail"
}: {
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
  variant?: "bar" | "rail";
}) {
  if (variant === "bar") {
    return (
      <div className="theme-bar" role="group" aria-label="Theme palette">
        {themeOptions.map((theme) => (
          <button
            aria-label={`${theme.label} theme`}
            aria-pressed={activeTheme === theme.value}
            className="theme-bar__chip"
            key={theme.value}
            onClick={() => setActiveTheme(theme.value)}
            title={theme.description}
            type="button"
          >
            <span className="theme-bar__swatches" aria-hidden="true">
              {theme.swatches.map((swatch) => (
                <span key={swatch} style={{ background: swatch }} />
              ))}
            </span>
            <span className="theme-bar__name">{theme.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
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
  );
}

function CopyButton({ label = "Copy", value }: { label?: string; value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      aria-label={copied ? "Copied to clipboard" : `Copy ${label} to clipboard`}
      className="copy-btn"
      onClick={() => {
        navigator.clipboard
          ?.writeText(value)
          .then(() => setCopied(true))
          .catch(() => undefined);
      }}
      type="button"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionHead({ copy, kicker, title }: { copy?: string; kicker: string; title: string }) {
  return (
    <div className="landing-section-head">
      <span className="landing-kicker">{kicker}</span>
      <h2>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}

function LandingBar({
  activeTheme,
  setActiveTheme
}: {
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
}) {
  return (
    <header className="landing-bar">
      <div className="landing-bar__inner">
        <a className="landing-brand" href="#/">
          <strong translate="no">GEN X</strong>
          <span>Soft Club UI</span>
        </a>
        <nav className="landing-bar__links" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#components">Components</a>
          <a href="#install">Install</a>
          <a href="#themes">Themes</a>
          <a href="#/demo">Demo</a>
        </nav>
        <div className="landing-bar__actions">
          <ThemeSwitcher activeTheme={activeTheme} setActiveTheme={setActiveTheme} variant="bar" />
          <a
            className="landing-bar__github"
            href={githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Button asChild size="sm">
            <a href="#components">Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function LandingFooter({ glass }: { glass: string }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        <div className="landing-footer__brand">
          <strong translate="no">GEN X</strong>
          <span>Soft Club UI</span>
          <p>
            Late-90s {glass}-glass React components and a portable CSS token system. MIT
            licensed and built in the open.
          </p>
        </div>
        <div className="landing-footer__cols">
          <div className="landing-footer-col">
            <strong>Docs</strong>
            <a href="#components">Components</a>
            <a href="#install">Quick start</a>
            <a href="#themes">Theming</a>
            <a href="#/demo">Demo website</a>
          </div>
          <div className="landing-footer-col">
            <strong>Project</strong>
            <a href={githubUrl} rel="noreferrer" target="_blank">
              GitHub
            </a>
            <a href={npmUrl} rel="noreferrer" target="_blank">
              npm
            </a>
            <a href={contributingUrl} rel="noreferrer" target="_blank">
              Contributing
            </a>
            <a href={licenseUrl} rel="noreferrer" target="_blank">
              License
            </a>
          </div>
          <div className="landing-footer-col">
            <strong>Categories</strong>
            {categories.slice(0, 5).map(({ category, slug }) => (
              <a href={`#/category/${slug}`} key={slug}>
                {category}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="landing-footer__base">
        <span>&copy; Soft Club UI / @cobanov</span>
        <span translate="no">Built with the library itself.</span>
      </div>
    </footer>
  );
}

function LoaderShowcase() {
  const [preset, setPreset] = useState<LoaderName>("arc");

  return (
    <div className="loader-showcase">
      <div className="loader-showcase__bar">
        <NativeSelect
          aria-label="Loader preset"
          className="loader-showcase__select"
          onChange={(event) => setPreset(event.target.value as LoaderName)}
          value={preset}
        >
          {loaderNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </NativeSelect>
        <Loader preset={preset} size="lg" />
        <Button loader={<Loader preset={preset} size="sm" />} loading>
          Syncing
        </Button>
        <ToolCall loader={<Loader preset={preset} size="sm" />} status="running" tool="search_web" />
      </div>
      <div className="loader-grid">
        {loaderNames.map((name) => (
          <button
            aria-pressed={preset === name}
            className="loader-chip"
            key={name}
            onClick={() => setPreset(name)}
            type="button"
          >
            <Loader preset={name} />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LandingPage({
  activeTheme,
  setActiveTheme,
  showToast
}: {
  activeTheme: ThemeName;
  setActiveTheme: (theme: ThemeName) => void;
  showToast: () => void;
}) {
  const theme = themeOptions.find((option) => option.value === activeTheme) ?? themeOptions[1];
  const glass = theme.glass;
  const Glass = `${glass.charAt(0).toUpperCase()}${glass.slice(1)}`;

  return (
    <div className="landing">
      <LandingBar activeTheme={activeTheme} setActiveTheme={setActiveTheme} />

      <main className="landing-main" id="main-content">
        <header className="landing-hero">
          <div className="landing-hero__copy">
            <span className="landing-kicker">Open source / React + CSS tokens</span>
            <h1>{Glass} glass components for interfaces that feel engineered.</h1>
            <p>
              Soft Club UI is a React component library and a portable token system. Forty
              accessible, Radix-backed components dressed in late-90s {glass} glass. Copy them,
              own them, and re-skin the whole set with one attribute. Like shadcn, with its own
              atmosphere.
            </p>
            <div className="landing-cmd">
              <span className="landing-cmd__prompt" aria-hidden="true">
                $
              </span>
              <code>{installCommand}</code>
              <CopyButton label="Copy" value={installCommand} />
            </div>
            <div className="landing-hero__actions">
              <Button asChild size="lg">
                <a href="#components">Browse components</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={githubUrl} rel="noreferrer" target="_blank">
                  View on GitHub
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="#/demo">See it in a real site</a>
              </Button>
            </div>
            <div className="landing-hero__meta">
              <span>
                <StatusDot tone="green" /> MIT licensed
              </span>
              <span>
                <StatusDot tone="blue" /> Radix primitives
              </span>
              <span>
                <StatusDot tone="warning" /> Zero-config theming
              </span>
            </div>
          </div>

          <div className="landing-hero__stage" aria-hidden="true">
            <GlassPanel>
              <GlassPanelHeader>
                <GlassPanelKicker>LIVE / SC-133G04</GlassPanelKicker>
                <GlassPanelTitle>
                  <StatCounter suffix="%" value={94} /> system sync
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
                <div className="landing-hero__row">
                  <Badge variant="green">Glass</Badge>
                  <Badge>Blue</Badge>
                  <Badge variant="warning">Signal</Badge>
                  <Badge variant="danger">Clip</Badge>
                </div>
                <SignalMarquee />
              </GlassPanelBody>
            </GlassPanel>
            <MockIDE
              filename="soft-club.tsx"
              tokens={[
                { children: "import ", tone: "keyword" },
                { children: "{ Button, Card } " },
                { children: "from ", tone: "keyword" },
                { children: '"@cobanov/soft-club-ui"', tone: "string" },
                { children: ";\n\n" },
                { children: "export ", tone: "keyword" },
                { children: "function ", tone: "keyword" },
                { children: "Room", tone: "function" },
                { children: "() {\n  " },
                { children: "return ", tone: "keyword" },
                { children: "<Button>Sync</Button>;\n}" }
              ]}
            />
          </div>
        </header>

        <section className="landing-stats" aria-label="Library at a glance">
          {landingStats.map((stat) => (
            <div className="landing-stat" key={stat.label}>
              <strong>
                <StatCounter suffix={stat.suffix} value={stat.value} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="landing-section" id="features">
          <SectionHead
            copy="Soft Club UI is a system, not a skin. The same tokens drive the components, the docs, and the demo site, so what you preview is exactly what ships."
            kicker="Why Soft Club"
            title="Built like a system, not a theme"
          />
          <div className="landing-feature-grid">
            {landingFeatures.map((feature) => (
              <GlassCard key={feature.title}>
                <GlassCard.Icon>{feature.icon}</GlassCard.Icon>
                <GlassCard.Title>{feature.title}</GlassCard.Title>
                <GlassCard.Body>{feature.body}</GlassCard.Body>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="landing-section" id="showcase">
          <SectionHead
            copy="Live components, not screenshots. Every tile below is the real thing rendered from the package. Open any one to read its docs and copy the code."
            kicker="The set"
            title="A look at the components"
          />
          <div className="landing-showcase-grid">
            {showcaseSlugs.map((slug) => {
              const entry = entryBySlug.get(slug);
              if (!entry) return null;
              const wide = wideExampleSlugs.has(slug);
              return (
                <article
                  className={`landing-show-card${wide ? " landing-show-card--wide" : ""}`}
                  key={slug}
                >
                  <div className="landing-show-card__head">
                    <div>
                      <span className="landing-show-card__cat">{entry.category}</span>
                      <h3>{entry.name}</h3>
                    </div>
                    <a className="landing-show-card__doc" href={docHrefForEntry(entry)}>
                      Docs &rarr;
                    </a>
                  </div>
                  <div className="landing-show-card__body">{entry.preview({ showToast })}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section" id="components">
          <SectionHead
            copy={`${componentEntries.length} components across ${categories.length} categories, each with its own deep-linked documentation page and copy-ready snippet.`}
            kicker="Catalog"
            title="Every category, one click away"
          />
          <div className="landing-catalog">
            {categories.map(({ category, entries, slug }) => (
              <a className="landing-catalog-card" href={`#/category/${slug}`} key={category}>
                <div className="landing-catalog-card__top">
                  <h3>{category}</h3>
                  <span className="landing-catalog-card__count">{entries.length}</span>
                </div>
                <p>{categoryDescriptions[category]}</p>
                <div className="landing-catalog-card__chips">
                  {entries.slice(0, 4).map((entry) => (
                    <span key={entry.slug}>{entry.name}</span>
                  ))}
                  {entries.length > 4 ? (
                    <span className="muted">+{entries.length - 4}</span>
                  ) : null}
                </div>
                <span className="landing-catalog-card__link">Open category &rarr;</span>
              </a>
            ))}
          </div>
        </section>

        <section className="landing-section" id="install">
          <SectionHead
            copy="Add the package, import the stylesheet once, and start composing. The token sheet is plain CSS, so it drops into any build during a migration."
            kicker="Quick start"
            title="Install and ship in two imports"
          />
          <div className="landing-install">
            <div className="landing-install__col">
              <Tabs defaultValue="pnpm">
                <TabsList aria-label="Package manager">
                  {packageManagers.map((manager) => (
                    <TabsTrigger key={manager.id} value={manager.id}>
                      {manager.id}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {packageManagers.map((manager) => (
                  <TabsContent key={manager.id} value={manager.id}>
                    <div className="landing-code">
                      <pre>
                        <code>{manager.command}</code>
                      </pre>
                      <CopyButton label="Copy" value={manager.command} />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              <p className="landing-install__note">
                Tokens ship separately as <code>@cobanov/soft-club-tokens</code> &mdash; pure CSS
                variables you can reuse in any framework while you migrate.
              </p>
            </div>
            <div className="landing-install__col">
              <div className="landing-code landing-code--block">
                <div className="landing-code__bar">
                  <span translate="no">App.tsx</span>
                  <CopyButton label="Copy" value={usageSnippet} />
                </div>
                <pre>
                  <code>{usageSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-themes" id="themes">
          <div className="landing-themes__copy">
            <SectionHead
              copy="Switch data-sc-theme on the root and every surface re-skins. Try it here. The whole page follows the palette you pick."
              kicker="Theming"
              title="One token layer, three moods"
            />
            <ThemeSwitcher
              activeTheme={activeTheme}
              setActiveTheme={setActiveTheme}
              variant="rail"
            />
            <div className="landing-code landing-code--inline">
              <code>&lt;html data-sc-theme=&quot;{activeTheme}&quot;&gt;</code>
              <CopyButton label="Copy" value={`<html data-sc-theme="${activeTheme}">`} />
            </div>
          </div>
          <div className="landing-themes__preview">
            <div className="landing-themes__preview-row">
              <Badge variant="green">Glass</Badge>
              <Badge>Blue</Badge>
              <Badge variant="warning">Signal</Badge>
              <StatusDot tone="green" />
            </div>
            <GlassPanel>
              <GlassPanelHeader>
                <GlassPanelKicker translate="no">THEME / {activeTheme}</GlassPanelKicker>
                <GlassPanelTitle>
                  <StatCounter suffix="%" value={94} /> re-skin
                </GlassPanelTitle>
              </GlassPanelHeader>
              <GlassPanelBody>
                <TokenStream loop text="data-sc-theme -> recolor -> settle" />
              </GlassPanelBody>
            </GlassPanel>
            <div className="landing-themes__preview-row">
              <Button size="sm">Sync</Button>
              <Button size="sm" variant="outline">
                Export
              </Button>
              <Switch defaultChecked label="Live token pass" name="theme-demo-switch" />
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta__inner">
            <span className="landing-kicker">Ship the room</span>
            <h2>Bring the {glass} glass to your next interface.</h2>
            <p>
              Open source, MIT licensed, and ready to drop in. Read the docs, lift the code, and
              make it yours.
            </p>
            <div className="landing-hero__actions">
              <Button asChild size="lg">
                <a href="#components">Browse components</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={githubUrl} rel="noreferrer" target="_blank">
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter glass={glass} />
    </div>
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
            className={`example-block example-block--${getExampleScale(entry)}`}
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
