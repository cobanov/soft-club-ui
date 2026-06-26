import * as React from "react";
import { cx } from "../lib/cx";

type Rgb = [number, number, number];

const TAU = Math.PI * 2;

/** Deterministic PRNG so a given seed always renders the same field. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + hn * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function hexToRgb(hex: string): Rgb | null {
  const m = hex.trim().replace(/^#/, "");
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    return [r, g, b].some((v) => Number.isNaN(v)) ? null : [r, g, b];
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return [r, g, b].some((v) => Number.isNaN(v)) ? null : [r, g, b];
  }
  return null;
}

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

interface Center {
  x: number;
  y: number;
  sigma: number;
  weight: number;
  color: Rgb;
}

interface Field {
  centers: Center[];
  warp: { fx: number; fy: number; px: number; py: number; amp: number };
  bg: Rgb;
}

/**
 * Turns a seed into a smooth, organic, multi-colour field: a handful of soft
 * colour centres plus a gentle domain warp. Same seed -> identical field.
 */
function buildField(seed: number, palette?: Rgb[]): Field {
  const rnd = mulberry32(seed >>> 0);
  const baseHue = rnd() * 360;
  const n = 3 + Math.floor(rnd() * 3); // 3..5 colour centres
  const scheme = [0, 45 + rnd() * 75, -(45 + rnd() * 75), 150 + rnd() * 70, -150 - rnd() * 40];
  const centers: Center[] = [];
  for (let i = 0; i < n; i += 1) {
    const hue = baseHue + scheme[i % scheme.length] + (rnd() - 0.5) * 20;
    const sat = 0.5 + rnd() * 0.26;
    const lig = 0.56 + rnd() * 0.12;
    const color =
      palette && palette.length > 0 ? palette[i % palette.length] : hslToRgb(hue, sat, lig);
    centers.push({
      x: 0.1 + rnd() * 0.8,
      y: 0.1 + rnd() * 0.8,
      sigma: 0.13 + rnd() * 0.2,
      weight: 1 + rnd() * 0.8,
      color
    });
  }
  const warp = {
    fx: 0.5 + rnd() * 0.9,
    fy: 0.5 + rnd() * 0.9,
    px: rnd() * TAU,
    py: rnd() * TAU,
    amp: 0.04 + rnd() * 0.06
  };
  const bg = hslToRgb(baseHue + (rnd() - 0.5) * 40, 0.22 + rnd() * 0.18, 0.95 + rnd() * 0.03);
  return { centers, warp, bg };
}

interface RenderOptions {
  cell: number;
  seed: number;
  palette?: Rgb[];
  glyphs?: string;
  background?: string;
}

/** Paints one static halftone-dot frame for the given seed. */
function renderBackdrop(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: RenderOptions
) {
  const { cell, seed, palette, glyphs, background } = options;
  const { centers, warp, bg } = buildField(seed, palette);

  ctx.fillStyle = background ?? `rgb(${bg[0] | 0}, ${bg[1] | 0}, ${bg[2] | 0})`;
  ctx.fillRect(0, 0, width, height);

  const cols = Math.max(1, Math.ceil(width / cell));
  const rows = Math.max(1, Math.ceil(height / cell));
  const asp = height > 0 ? width / height : 1;

  if (glyphs) {
    ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
  }

  for (let gy = 0; gy < rows; gy += 1) {
    const v = (gy + 0.5) / rows;
    for (let gx = 0; gx < cols; gx += 1) {
      const u = (gx + 0.5) / cols;
      const wu = u + warp.amp * Math.sin(v * warp.fy * TAU + warp.px);
      const wv = v + warp.amp * Math.sin(u * warp.fx * TAU + warp.py);

      let r = 0;
      let g = 0;
      let b = 0;
      let wsum = 0;
      let cover = 0;
      for (const c of centers) {
        const dx = (wu - c.x) * asp;
        const dy = wv - c.y;
        const w = c.weight * Math.exp(-(dx * dx + dy * dy) / (2 * c.sigma * c.sigma));
        const cw = w * w; // favour the dominant centre so hues stay pure
        r += c.color[0] * cw;
        g += c.color[1] * cw;
        b += c.color[2] * cw;
        wsum += cw;
        cover += w;
      }
      if (wsum > 0) {
        r /= wsum;
        g /= wsum;
        b /= wsum;
      }

      const ink = smoothstep(0.12, 0.9, cover);
      if (ink <= 0.001) continue;

      const px = gx * cell + cell / 2;
      const py = gy * cell + cell / 2;
      const color = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;

      if (glyphs) {
        const ch = glyphs[Math.min(glyphs.length - 1, Math.floor(ink * glyphs.length))] ?? "";
        if (ch === " " || ch === "") continue;
        ctx.globalAlpha = Math.max(0.18, ink);
        ctx.fillStyle = color;
        ctx.fillText(ch, px, py);
      } else {
        const radius = cell * 0.56 * Math.pow(ink, 0.62);
        if (radius < 0.3) continue;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, TAU);
        ctx.fill();
      }
    }
  }
  ctx.globalAlpha = 1;
}

export interface AsciiBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Background fill behind the dots. Defaults to a seeded near-white tint. */
  background?: string;
  /** Grid spacing in pixels. Smaller = finer dot screen. */
  cell?: number;
  /** Render ASCII glyphs from this ramp (low->high density) instead of dots. */
  glyphs?: string;
  label?: string;
  /** Override the generated colours with brand hex colours (e.g. ["#ff9a3d", "#8effad"]). */
  palette?: string[];
  /** Any number; each seed deterministically generates a unique field. */
  seed?: number;
}

/**
 * A static, seeded halftone-dot background: a soft organic colour field sampled
 * into a grid of dots whose size tracks the local ink. Every `seed` renders a
 * unique, reproducible composition — good for landing pages, product visuals,
 * and branding.
 */
export const AsciiBackdrop = React.forwardRef<HTMLDivElement, AsciiBackdropProps>(
  ({ background, cell = 7, className, glyphs, label, palette, seed = 1, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const paletteKey = palette?.join(",") ?? "";

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const host = hostRef.current;
      if (!canvas || !host) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const parsedPalette = paletteKey
        ? (paletteKey
            .split(",")
            .map(hexToRgb)
            .filter((c): c is Rgb => c !== null) as Rgb[])
        : undefined;

      const paint = () => {
        const rect = host.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderBackdrop(ctx, rect.width, rect.height, {
          background,
          cell: Math.max(3, cell),
          glyphs,
          palette: parsedPalette && parsedPalette.length > 0 ? parsedPalette : undefined,
          seed
        });
      };

      paint();
      const resizeObserver = new ResizeObserver(paint);
      resizeObserver.observe(host);
      return () => resizeObserver.disconnect();
    }, [background, cell, glyphs, paletteKey, seed]);

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-ascii-backdrop", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiBackdrop.displayName = "AsciiBackdrop";
