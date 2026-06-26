import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

const RAMP = " .:-=+*#%@";

export interface AsciiTunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  speed?: number;
  twist?: number;
}

export const AsciiTunnel = React.forwardRef<HTMLDivElement, AsciiTunnelProps>(
  ({ className, label, cell = 11, speed = 1, twist = 8, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ ccol: 0, crow: 0, w: 0, h: 0, seeded: false });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const st = state.current;
        const cellH = cell * 1.15;
        const cols = Math.max(1, Math.floor(width / cell));
        const rows = Math.max(1, Math.floor(height / cellH));

        if (!st.seeded || st.w !== width || st.h !== height) {
          st.w = width;
          st.h = height;
          st.seeded = true;
          st.ccol = cols / 2;
          st.crow = rows / 2;
        }

        // Steer the vanishing point toward the pointer cell.
        const targetCol = pointer.inside ? pointer.x / cell : cols / 2;
        const targetRow = pointer.inside ? pointer.y / cellH : rows / 2;
        st.ccol += (targetCol - st.ccol) * 0.08;
        st.crow += (targetRow - st.crow) * 0.08;

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        const t = time * 0.5 * speed;
        // Work in normalized screen space so rings stay concentric and fill the
        // (wide, short) panel instead of collapsing into vertical bands.
        const halfW = width * 0.5;
        const halfH = height * 0.5;
        const cxPx = st.ccol * cell;
        const cyPx = st.crow * cellH;

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (let row = 0; row < rows; row += 1) {
          const py = row * cellH + cellH * 0.5;
          const ny = (py - cyPx) / halfH;
          for (let col = 0; col < cols; col += 1) {
            const px = col * cell + cell * 0.5;
            const nx = (px - cxPx) / halfW;
            const radius = Math.hypot(nx, ny) + 1e-3;
            const angle = Math.atan2(ny, nx);

            // Depth scrolls inward; rings bunch up toward the vanishing point.
            const depth = 0.7 / radius + t;
            const rings = 0.5 + 0.5 * Math.sin(depth * Math.PI * 2);
            const spokes = 0.65 + 0.35 * Math.sin(angle * twist - t * 2);
            const edge = Math.max(0, Math.min(1, 1.35 - radius));
            const core = Math.exp(-radius * radius * 7);
            const value = rings * spokes * edge + core * 0.6;
            const v01 = value < 0 ? 0 : value > 1 ? 1 : value;

            const ri = Math.min(RAMP.length - 1, Math.floor(v01 * RAMP.length));
            const char = RAMP[ri] ?? " ";
            if (char === " ") continue;

            const r = primary[0] + (text[0] - primary[0]) * v01;
            const g = primary[1] + (text[1] - primary[1]) * v01;
            const b = primary[2] + (text[2] - primary[2]) * v01;
            ctx.fillStyle = rgba([r, g, b], 0.25 + 0.7 * v01);
            ctx.fillText(char, col * cell, row * cellH);
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
      <div className={cx("sc-live", "sc-ascii-tunnel", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiTunnel.displayName = "AsciiTunnel";
