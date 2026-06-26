import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface AsciiLifeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  density?: number;
}

interface LifeState {
  grid: Uint8Array;
  next: Uint8Array;
  age: Uint8Array;
  cols: number;
  rows: number;
  w: number;
  h: number;
  acc: number;
  seeded: boolean;
}

export const AsciiLife = React.forwardRef<HTMLDivElement, AsciiLifeProps>(
  ({ className, label, cell = 13, density = 0.25, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef<LifeState>({
      grid: new Uint8Array(0),
      next: new Uint8Array(0),
      age: new Uint8Array(0),
      cols: 0,
      rows: 0,
      w: 0,
      h: 0,
      acc: 0,
      seeded: false
    });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, pointer, width }) => {
        const st = state.current;
        const cellH = cell * 1.15;

        const seed = () => {
          for (let i = 0; i < st.grid.length; i += 1) {
            st.grid[i] = Math.random() < density ? 1 : 0;
            st.age[i] = st.grid[i];
          }
        };

        if (!st.seeded || st.w !== width || st.h !== height) {
          st.cols = Math.max(1, Math.floor(width / cell));
          st.rows = Math.max(1, Math.floor(height / cellH));
          const size = st.cols * st.rows;
          st.grid = new Uint8Array(size);
          st.next = new Uint8Array(size);
          st.age = new Uint8Array(size);
          st.w = width;
          st.h = height;
          st.seeded = true;
          st.acc = 0;
          seed();
        }

        const { cols, rows } = st;

        const step = () => {
          let alive = 0;
          for (let y = 0; y < rows; y += 1) {
            const up = (y - 1 + rows) % rows;
            const down = (y + 1) % rows;
            for (let x = 0; x < cols; x += 1) {
              const left = (x - 1 + cols) % cols;
              const right = (x + 1) % cols;
              const n =
                (st.grid[up * cols + left] ?? 0) +
                (st.grid[up * cols + x] ?? 0) +
                (st.grid[up * cols + right] ?? 0) +
                (st.grid[y * cols + left] ?? 0) +
                (st.grid[y * cols + right] ?? 0) +
                (st.grid[down * cols + left] ?? 0) +
                (st.grid[down * cols + x] ?? 0) +
                (st.grid[down * cols + right] ?? 0);
              const i = y * cols + x;
              const was = st.grid[i] ?? 0;
              const live = was === 1 ? n === 2 || n === 3 : n === 3;
              st.next[i] = live ? 1 : 0;
              st.age[i] = live ? (was === 1 ? Math.min(255, (st.age[i] ?? 0) + 1) : 1) : 0;
              if (live) alive += 1;
            }
          }
          const tmp = st.grid;
          st.grid = st.next;
          st.next = tmp;
          if (alive < cols * rows * 0.02) seed();
        };

        st.acc += dt;
        while (st.acc >= 0.09) {
          step();
          st.acc -= 0.09;
        }

        if (pointer.inside) {
          const px = Math.floor(pointer.x / cell);
          const py = Math.floor(pointer.y / cellH);
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              const cxw = (px + dx + cols) % cols;
              const cyw = (py + dy + rows) % rows;
              const i = cyw * cols + cxw;
              st.grid[i] = 1;
              if ((st.age[i] ?? 0) === 0) st.age[i] = 1;
            }
          }
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const i = y * cols + x;
            if ((st.grid[i] ?? 0) !== 1) continue;
            if ((st.age[i] ?? 0) === 1) {
              ctx.fillStyle = rgba(text, 0.95);
              ctx.fillText("+", x * cell, y * cellH);
            } else {
              ctx.fillStyle = rgba(primary, 0.85);
              ctx.fillText("@", x * cell, y * cellH);
            }
          }
        }
      },
      { reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-ascii-life", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiLife.displayName = "AsciiLife";
