import { useState } from "react";
import {
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
  GlassPanel,
  GlassPanelBody,
  GlassPanelHeader,
  GlassPanelKicker,
  GlassPanelTitle,
  Input,
  MockConsole,
  NodeGrid,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PromptBox,
  SignalMarquee,
  StatCounter,
  StatusIndicator,
  StickyBanner,
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
  WordRoll
} from "@cobanov/soft-club-ui";

const colors = [
  ["Background", "--sc-color-background"],
  ["Surface", "--sc-color-surface"],
  ["Glass", "--sc-color-glass"],
  ["Text", "--sc-color-text"],
  ["Muted text", "--sc-color-text-muted"],
  ["Border", "--sc-color-border"],
  ["Cold blue", "--sc-color-accent-blue"],
  ["Phosphor green", "--sc-color-accent-green"],
  ["Signal orange", "--sc-color-warning"],
  ["Error red", "--sc-color-danger"]
];

const typeScale = [
  ["SC-01", "var(--sc-font-size-1)"],
  ["SC-02", "var(--sc-font-size-2)"],
  ["SC-03", "var(--sc-font-size-3)"],
  ["SC-04", "var(--sc-font-size-4)"],
  ["SC-05", "var(--sc-font-size-5)"],
  ["SC-06", "var(--sc-font-size-6)"]
];

function App() {
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <ToastProvider swipeDirection="right">
      <main className="docs-shell">
        <aside className="docs-nav">
          <div className="docs-brand">
            <strong>GEN X</strong>
            <span>Soft Club UI</span>
          </div>
          <nav aria-label="Docs sections">
            <a href="#tokens">A1 Tokens</a>
            <a href="#type">B2 Type</a>
            <a href="#components">C3 Components</a>
            <a href="#surfaces">D4 Surfaces</a>
            <a href="#console">E5 Console</a>
          </nav>
        </aside>

        <div className="docs-main">
          <header className="docs-header">
            <div className="title-block">
              <h1>Soft Club UI</h1>
              <p>
                Late-90s Sony-adjacent React components: dark glass, green
                phosphor, blurred club photography, transit grids, and calm
                cybernetic utility.
              </p>
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

          <section className="docs-section" id="tokens">
            <div className="section-heading">
              <h2>Color Tokens</h2>
              <p>Black glass, smoke, cold blue, phosphor green, and one hot signal.</p>
            </div>
            <div className="token-grid">
              {colors.map(([label, token]) => (
                <div className="token-row" key={token}>
                  <span className="swatch" style={{ background: `var(${token})` }} />
                  <div>
                    <strong>{label}</strong>
                    <code>{token}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="docs-section" id="type">
            <div className="section-heading">
              <h2>Typography</h2>
              <p>Helvetica for the interface, mono only for technical system marks.</p>
            </div>
            <div className="type-list">
              {typeScale.map(([label, size]) => (
                <div className="type-row" key={label}>
                  <span style={{ fontSize: size }}>young adult / glass index / 1999</span>
                  <code>{label}</code>
                </div>
              ))}
            </div>
          </section>

          <section className="docs-section" id="components">
            <div className="section-heading">
              <h2>Components</h2>
              <p>Radix-backed primitives with low-radius glass, thin lines, and focus states.</p>
            </div>
            <div className="component-grid">
              <Card>
                <CardHeader>
                  <CardTitle>Control Surface</CardTitle>
                  <CardDescription>Button, badge, input, textarea.</CardDescription>
                </CardHeader>
                <CardContent className="stack">
                  <div className="row">
                    <Button>Sync</Button>
                    <Button variant="secondary">Calibrate</Button>
                    <Button variant="outline">Export</Button>
                    <Button variant="ghost">Bypass</Button>
                  </div>
                  <div className="row">
                    <Badge>Blue</Badge>
                    <Badge variant="green">Glass</Badge>
                    <Badge variant="warning">Signal</Badge>
                    <Badge variant="danger">Clip</Badge>
                    <Badge variant="neutral">Idle</Badge>
                  </div>
                  <Input aria-label="System code" defaultValue="SC-133G04" />
                  <Textarea
                    aria-label="Session note"
                    defaultValue="Trip-hop room active. Fogged lens pass enabled. Green shelf glow stable."
                  />
                  <Input aria-label="Disabled system code" disabled value="LOCKED / 03:35" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interactive Layer</CardTitle>
                  <CardDescription>Tabs, dialog, dropdown, popover, toast.</CardDescription>
                </CardHeader>
                <CardContent className="stack">
                  <Tabs defaultValue="club">
                    <TabsList aria-label="Soft Club views">
                      <TabsTrigger value="club">Club</TabsTrigger>
                      <TabsTrigger value="metro">Metro</TabsTrigger>
                      <TabsTrigger value="archive" disabled>
                        Archive
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="club">
                      Frosted green wall, leather coat, glass shelf, low bass.
                    </TabsContent>
                    <TabsContent value="metro">
                      Underground platform, blurred route map, cold fluorescent light.
                    </TabsContent>
                  </Tabs>

                  <div className="row">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Dialog</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Open soft channel</DialogTitle>
                          <DialogDescription>
                            Route the session through the green glass layer and keep
                            the signal below clipping.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="ghost">Cancel</Button>
                          <Button>Open</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>SC / Deck</DropdownMenuLabel>
                        <DropdownMenuItem>Scan image plate</DropdownMenuItem>
                        <DropdownMenuItem>Route through bus B2</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Freeze frame</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost">Info</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        The glass surface keeps its blur, but the text remains solid
                        for contrast and assistive tech.
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button onClick={() => setToastOpen(true)} variant="secondary">
                    Show toast
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="docs-section" id="surfaces">
            <div className="section-heading">
              <h2>Performative Surfaces</h2>
              <p>ASCII, prompt, chat, counters, marquees, and synthetic background layers.</p>
            </div>
            <div className="surface-stack">
              <AsciiHero
                label="SC / ASCII HERO"
                title="green room interface"
                subtitle="A technical hero surface for posters, docs, and application intros."
              />

              <div className="component-grid">
                <GlassPanel>
                  <GlassPanelHeader>
                    <GlassPanelKicker>GLASS PANEL</GlassPanelKicker>
                    <GlassPanelTitle>
                      Signal surface / <WordRoll index={2} />
                    </GlassPanelTitle>
                  </GlassPanelHeader>
                  <GlassPanelBody>
                    <TokenStream tokens={["SC", "/", "A3", " ", "noise", " ", "04", "%"]} />
                  </GlassPanelBody>
                </GlassPanel>

                <NodeGrid>
                  <AuroraField intensity="low" />
                  <div className="node-copy">
                    <StatusIndicator tone="green" /> B2 bus mapped
                  </div>
                </NodeGrid>
              </div>

              <div className="component-grid">
                <MockConsole />
                <ChatDock>
                  <ChatBubble meta="system / 03:35" tone="system">
                    Glass pass armed. Keep typography solid above the blur layer.
                  </ChatBubble>
                  <ChatBubble meta="operator" tone="user">
                    Sync the green shelf glow and freeze frame B2.
                  </ChatBubble>
                  <PromptBox defaultValue="render a soft cyber room with cold glass" />
                </ChatDock>
              </div>

              <div className="component-grid">
                <BeforeAfter
                  before="Flat panel, no atmosphere, no scan index."
                  after="Cold glass, green phosphor, blur, and technical coordinates."
                />
                <GlassPanel>
                  <GlassPanelHeader>
                    <GlassPanelKicker>COUNTERS</GlassPanelKicker>
                    <GlassPanelTitle>
                      <StatCounter suffix="%" value={94} /> sync
                    </GlassPanelTitle>
                  </GlassPanelHeader>
                  <GlassPanelBody>
                    <SignalMarquee />
                  </GlassPanelBody>
                </GlassPanel>
              </div>

              <StickyBanner action={<Button size="sm">Open deck</Button>}>
                SC-133G04 / soft channel updated / noise 04%
              </StickyBanner>
            </div>
          </section>

          <section className="docs-section" id="console">
            <div className="section-heading">
              <h2>Soft Club Console</h2>
              <p>A denser composition made from the v0 primitives.</p>
            </div>
            <div className="club-board">
              <div className="club-strip">
                <strong>SC//YOUNG ADULT//GLASS INDEX</strong>
                <Badge variant="green">133G04</Badge>
              </div>
              <div className="club-grid">
                <Card>
                  <CardHeader>
                    <CardTitle>Room A3</CardTitle>
                    <CardDescription>Blue-green shelf glow, concrete ceiling, fogged lens.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="club-facts">
                      <div>
                        <dt>Mode</dt>
                        <dd>Soft cyber</dd>
                      </div>
                      <div>
                        <dt>Light</dt>
                        <dd>Green glass</dd>
                      </div>
                      <div>
                        <dt>Signal</dt>
                        <dd>-3 dB</dd>
                      </div>
                    </dl>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">Arm</Button>
                    <Button size="sm" variant="outline">
                      Print
                    </Button>
                  </CardFooter>
                </Card>

                <div className="image-console" aria-hidden="true">
                  <div className="scan-label label-a">A1</div>
                  <div className="scan-label label-b">B3</div>
                  <div className="scan-title">APRIL 20 UPDATED</div>
                  <div className="scan-line" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Toast onOpenChange={setToastOpen} open={toastOpen}>
        <ToastTitle>Soft channel synced</ToastTitle>
        <ToastDescription>Glass pass active. Visual noise settled at 04%.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

export default App;
