import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

const RAMP = " .:-=+*#%@";

function hash2(ix: number, iy: number): number {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  const top = a + (b - a) * fx;
  const bot = c + (d - c) * fx;
  return top + (bot - top) * fy;
}

export interface AsciiFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  threshold?: number;
}

export const AsciiFlow = React.forwardRef<HTMLDivElement, AsciiFlowProps>(
  ({ className, label, cell = 10, threshold = 0.42, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ w: 0, h: 0 });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const st = state.current;
        if (st.w !== width || st.h !== height) {
          st.w = width;
          st.h = height;
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);
        const cellH = cell * 1.15;
        const cols = Math.floor(width / cell);
        const rows = Math.floor(height / cellH);
        const t = time;

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (let row = 0; row < rows; row += 1) {
          const py = row * cellH;
          for (let col = 0; col < cols; col += 1) {
            const px = col * cell;
            const n1 = valueNoise(col * 0.12 + t * 0.15, row * 0.14 - t * 0.1);
            const n2 = valueNoise(col * 0.045 - t * 0.06, row * 0.05 + t * 0.08);
            let v01 = n1 * 0.65 + n2 * 0.35;

            if (pointer.inside) {
              const dx = px - pointer.x;
              const dy = py - pointer.y;
              const d2 = dx * dx + dy * dy;
              const radius = 90;
              v01 += Math.exp(-d2 / (radius * radius)) * 0.55;
            }
            v01 = v01 < 0 ? 0 : v01 > 1 ? 1 : v01;

            if (v01 <= threshold) continue;

            const k = (v01 - threshold) / (1 - threshold);
            const ci = Math.min(RAMP.length - 1, Math.floor(k * RAMP.length));
            const char = RAMP[ci] ?? "@";
            const r = primary[0] + (text[0] - primary[0]) * k;
            const g = primary[1] + (text[1] - primary[1]) * k;
            const b = primary[2] + (text[2] - primary[2]) * k;
            ctx.fillStyle = rgba([r, g, b] as [number, number, number], 0.4 + k * 0.55);
            ctx.fillText(char, px, py);
          }
        }
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-ascii-flow", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiFlow.displayName = "AsciiFlow";
