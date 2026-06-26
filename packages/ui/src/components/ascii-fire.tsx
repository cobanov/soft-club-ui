import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface AsciiFireProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  cooling?: number;
}

const RAMP = " .:*oO#@";

export const AsciiFire = React.forwardRef<HTMLDivElement, AsciiFireProps>(
  ({ className, label, cell = 10, cooling = 0.93, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ heat: new Float32Array(0), cols: 0, rows: 0, w: 0, h: 0 });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, width }) => {
        const st = state.current;
        const cellH = cell * 1.15;
        const cols = Math.max(1, Math.floor(width / cell));
        const rows = Math.max(2, Math.floor(height / cellH));
        if (st.w !== width || st.h !== height) {
          st.w = width;
          st.h = height;
          st.cols = cols;
          st.rows = rows;
          st.heat = new Float32Array(cols * rows);
        }
        const heat = st.heat;
        const idx = (x: number, y: number) => y * cols + x;

        // Seed the bottom row with random high heat; bias toward pointer column (wind).
        const windCol = pointer.inside ? Math.floor(pointer.x / cell) : -1;
        for (let x = 0; x < cols; x += 1) {
          let seed = 0.7 + Math.random() * 0.3;
          if (windCol >= 0) {
            const near = 1 - Math.min(1, Math.abs(x - windCol) / (cols * 0.4));
            seed = Math.min(1, seed + near * 0.35 * Math.random());
          }
          heat[idx(x, rows - 1)] = seed;
        }

        // Inject a torch around the pointer.
        if (pointer.inside) {
          const px = Math.floor(pointer.x / cell);
          const py = Math.floor(pointer.y / cellH);
          for (let dy = -2; dy <= 2; dy += 1) {
            for (let dx = -2; dx <= 2; dx += 1) {
              const tx = px + dx;
              const ty = py + dy;
              if (tx < 0 || tx >= cols || ty < 0 || ty >= rows) continue;
              const falloff = 1 - Math.min(1, Math.hypot(dx, dy) / 2.6);
              const cur = heat[idx(tx, ty)] ?? 0;
              heat[idx(tx, ty)] = Math.min(1, cur + falloff * (0.6 + Math.random() * 0.4));
            }
          }
        }

        // Propagate upward.
        for (let y = 0; y < rows - 1; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const bl = heat[idx(Math.max(0, x - 1), y + 1)] ?? 0;
            const bc = heat[idx(x, y + 1)] ?? 0;
            const br = heat[idx(Math.min(cols - 1, x + 1), y + 1)] ?? 0;
            const cool = cooling + (Math.random() - 0.5) * 0.025;
            heat[idx(x, y)] = Math.max(0, ((bl + bc + br) / 3) * cool);
          }
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const h = heat[idx(x, y)] ?? 0;
            if (h < 0.06) continue;
            const ramp = Math.min(RAMP.length - 1, Math.floor(h * RAMP.length));
            const char = RAMP[ramp] ?? " ";
            if (char === " ") continue;
            const blend: [number, number, number] = [
              primary[0] + (text[0] - primary[0]) * h,
              primary[1] + (text[1] - primary[1]) * h,
              primary[2] + (text[2] - primary[2]) * h
            ];
            ctx.fillStyle = rgba(blend, 0.3 + h * 0.7);
            ctx.fillText(char, x * cell, y * cellH);
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
      <div className={cx("sc-live", "sc-ascii-fire", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiFire.displayName = "AsciiFire";
