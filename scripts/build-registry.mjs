/**
 * Builds a shadcn-compatible component registry from packages/ui/src.
 *
 * Emits apps/docs/public/registry.json plus apps/docs/public/r/<name>.json so
 * the docs site (GitHub Pages) doubles as the registry host. Consumers install
 * components with the official shadcn CLI:
 *
 *   npx shadcn@latest add https://cobanov.github.io/soft-club-ui/r/sheet.json
 *
 * Dependency graph (npm deps, sibling components, libs, hooks) is derived from
 * each file's imports, never hand-maintained. Pass --base-url to point
 * registryDependencies somewhere else (e.g. a localhost dev server for e2e
 * testing the registry before it is deployed).
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI_SRC = path.join(ROOT, "packages/ui/src");
const COMPONENTS_DIR = path.join(UI_SRC, "components");
const HOOKS_DIR = path.join(UI_SRC, "hooks");
const LIB_DIR = path.join(UI_SRC, "lib");
const STYLES_CSS = path.join(UI_SRC, "styles.css");
const TOKENS_CSS = path.join(ROOT, "packages/tokens/src/soft-club.css");
const UI_PKG = path.join(ROOT, "packages/ui/package.json");
const OUT_DIR = path.join(ROOT, "apps/docs/public");

const HOMEPAGE = "https://cobanov.github.io/soft-club-ui";
const baseUrlArg = process.argv.indexOf("--base-url");
const REGISTRY_URL =
  baseUrlArg !== -1 ? process.argv[baseUrlArg + 1].replace(/\/$/, "") : `${HOMEPAGE}/r`;

const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";

const ACRONYMS = { ide: "IDE", otp: "OTP" };
const titleFromSlug = (slug) =>
  slug
    .split("-")
    .map((part) => ACRONYMS[part] ?? part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const itemUrl = (name) => `${REGISTRY_URL}/${name}.json`;

const uiPkg = JSON.parse(fs.readFileSync(UI_PKG, "utf8"));

/** "@radix-ui/react-dialog/sub" -> "@radix-ui/react-dialog", "clsx/x" -> "clsx" */
const packageName = (source) => {
  const parts = source.split("/");
  return source.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
};

const npmDependency = (source) => {
  const name = packageName(source);
  const version = uiPkg.dependencies?.[name];
  return version ? `${name}@${version}` : name;
};

const importSources = (code) =>
  [...code.matchAll(/from\s+"([^"]+)"/g)].map((match) => match[1]);

/** First JSDoc block in the file, collapsed to a single line. */
const jsdocDescription = (code) => {
  const match = code.match(/\/\*\*([\s\S]*?)\*\//);
  if (!match) return null;
  const text = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*?\s?/, ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 4 ? text : null;
};

/**
 * Rewrites the library's relative imports to shadcn `@/` aliases (the CLI maps
 * those onto the consumer's configured paths) and returns the npm/internal
 * dependencies discovered along the way.
 */
const transform = (code) => {
  const npm = new Set();
  const siblings = new Set();
  const hooks = new Set();
  const libs = new Set();

  for (const source of importSources(code)) {
    if (source === "react" || source === "react-dom" || source.startsWith("react/")) continue;
    if (source.startsWith("../lib/")) libs.add(source.slice("../lib/".length));
    else if (source.startsWith("../hooks/")) hooks.add(source.slice("../hooks/".length));
    else if (source.startsWith("./")) siblings.add(source.slice(2));
    else if (!source.startsWith(".")) npm.add(npmDependency(source));
  }

  const rewritten = code
    .replaceAll('from "../lib/', 'from "@/lib/soft-club/')
    .replaceAll('from "../hooks/', 'from "@/hooks/soft-club/')
    .replaceAll('from "./', 'from "@/components/soft-club/');

  return { hooks, libs, npm, rewritten, siblings };
};

const useClient = (code) => `"use client";\n\n${code}`;

// ---------------------------------------------------------------------------
// Shared items: base (css + cx), theme-color, hooks
// ---------------------------------------------------------------------------

const tokensCss = fs.readFileSync(TOKENS_CSS, "utf8");
const stylesCss = fs
  .readFileSync(STYLES_CSS, "utf8")
  .replace('@import "@cobanov/soft-club-tokens/style.css";', '@import "./soft-club-tokens.css";');

if (!stylesCss.startsWith('@import "./soft-club-tokens.css";')) {
  throw new Error("styles.css no longer starts with the tokens @import; update build-registry.mjs");
}

const cxSource = fs.readFileSync(path.join(LIB_DIR, "cx.ts"), "utf8");

const baseItem = {
  $schema: ITEM_SCHEMA,
  name: "base",
  type: "registry:ui",
  title: "Soft Club Base",
  description:
    "Design tokens, the shared Soft Club stylesheet (all four themes), and the cx class helper. Every Soft Club component depends on this item.",
  dependencies: [...new Set(importSources(cxSource).map(npmDependency))],
  files: [
    {
      path: "registry/soft-club/styles/soft-club-tokens.css",
      content: tokensCss,
      type: "registry:file",
      target: "styles/soft-club-tokens.css"
    },
    {
      path: "registry/soft-club/styles/soft-club.css",
      content: stylesCss,
      type: "registry:file",
      target: "styles/soft-club.css"
    },
    {
      path: "registry/soft-club/lib/cx.ts",
      content: cxSource,
      type: "registry:lib",
      target: "lib/soft-club/cx.ts"
    }
  ],
  docs: [
    "Import the stylesheet once, e.g. in your global CSS: @import \"./styles/soft-club.css\"; (it pulls in soft-club-tokens.css).",
    "Pick a theme by setting data-sc-theme on <html>: green (default), blue, orange, or night-city."
  ].join("\n")
};

const themeColorSource = fs.readFileSync(path.join(LIB_DIR, "theme-color.ts"), "utf8");
const themeColorItem = {
  $schema: ITEM_SCHEMA,
  name: "theme-color",
  type: "registry:lib",
  title: "ThemeColor",
  description:
    jsdocDescription(themeColorSource) ??
    "Reads Soft Club theme RGB tokens off computed styles for canvas rendering.",
  registryDependencies: [itemUrl("base")],
  files: [
    {
      path: "registry/soft-club/lib/theme-color.ts",
      content: themeColorSource,
      type: "registry:lib",
      target: "lib/soft-club/theme-color.ts"
    }
  ]
};

const hookItems = fs
  .readdirSync(HOOKS_DIR)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => {
    const name = file.replace(/\.ts$/, "");
    const source = fs.readFileSync(path.join(HOOKS_DIR, file), "utf8");
    const { libs, npm, rewritten } = transform(source);
    return {
      $schema: ITEM_SCHEMA,
      name,
      type: "registry:hook",
      title: titleFromSlug(name),
      description: jsdocDescription(source) ?? `Soft Club ${titleFromSlug(name)} hook.`,
      ...(npm.size ? { dependencies: [...npm].sort() } : {}),
      registryDependencies: [
        itemUrl("base"),
        ...[...libs].filter((lib) => lib !== "cx").map((lib) => itemUrl(lib))
      ],
      files: [
        {
          path: `registry/soft-club/hooks/${file}`,
          content: useClient(rewritten),
          type: "registry:hook",
          target: `hooks/soft-club/${file}`
        }
      ]
    };
  });

// ---------------------------------------------------------------------------
// Component items
// ---------------------------------------------------------------------------

const componentItems = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((file) => file.endsWith(".tsx"))
  .sort()
  .map((file) => {
    const slug = file.replace(/\.tsx$/, "");
    const source = fs.readFileSync(path.join(COMPONENTS_DIR, file), "utf8");
    const { hooks, libs, npm, rewritten, siblings } = transform(source);

    const registryDependencies = [
      itemUrl("base"),
      ...[...libs].filter((lib) => lib !== "cx").map((lib) => itemUrl(lib)),
      ...[...hooks].map((hook) => itemUrl(hook)),
      ...[...siblings].map((sibling) => itemUrl(sibling))
    ];

    return {
      $schema: ITEM_SCHEMA,
      name: slug,
      type: "registry:ui",
      title: titleFromSlug(slug),
      description: jsdocDescription(source) ?? `Soft Club ${titleFromSlug(slug)} component.`,
      ...(npm.size ? { dependencies: [...npm].sort() } : {}),
      registryDependencies,
      files: [
        {
          path: `registry/soft-club/components/${file}`,
          content: useClient(rewritten),
          type: "registry:ui",
          target: `components/soft-club/${file}`
        }
      ]
    };
  });

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

const items = [baseItem, themeColorItem, ...hookItems, ...componentItems];

const rDir = path.join(OUT_DIR, "r");
fs.rmSync(rDir, { force: true, recursive: true });
fs.mkdirSync(rDir, { recursive: true });

for (const item of items) {
  fs.writeFileSync(path.join(rDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}

const leanItem = (item) => {
  const copy = { ...item, files: item.files.map((file) => ({ ...file })) };
  delete copy.$schema;
  for (const file of copy.files) delete file.content;
  return copy;
};

const index = {
  $schema: REGISTRY_SCHEMA,
  name: "soft-club",
  homepage: HOMEPAGE,
  items: items.map(leanItem)
};
fs.writeFileSync(path.join(OUT_DIR, "registry.json"), `${JSON.stringify(index, null, 2)}\n`);

process.stdout.write(
  `registry: ${items.length} items (${componentItems.length} components) -> ${path.relative(ROOT, rDir)}\n`
);
