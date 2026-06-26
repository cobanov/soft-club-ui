import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface AsciiPlasmaProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  speed?: number;
}

const RAMP = " .:-=+*#%@";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mix(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

export const AsciiPlasma = React.forwardRef<HTMLDivElement, AsciiPlasmaProps>(
  ({ className, label, cell = 11, speed = 1, ...props }, ref) => {
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
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        const cellH = cell * 1.15;
        const cols = Math.floor(width / cell);
        const rows = Math.floor(height / cellH);
        const cx0 = width / 2;
        const cy0 = height / 2;
        const t = time * speed;

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        const rampMax = RAMP.length - 1;

        for (let row = 0; row < rows; row += 1) {
          const y = row * cellH;
          for (let col = 0; col < cols; col += 1) {
            const x = col * cell;

            let value =
              Math.sin(x * 0.04 + t) +
              Math.sin(y * 0.05 - t * 0.8) +
              Math.sin((x + y) * 0.03 + t * 1.3) +
              Math.sin(Math.hypot(x - cx0, y - cy0) * 0.05 - t * 1.5);

            if (pointer.inside) {
              const pd = Math.hypot(x - pointer.x, y - pointer.y);
              value += Math.sin(pd * 0.06 - t * 2.2) * Math.max(0, 1 - pd / 220) * 1.6;
            }

            const v01 = Math.min(1, Math.max(0, (value + 4) / 8));
            const ch = RAMP[Math.min(rampMax, Math.floor(v01 * rampMax))] ?? " ";
            if (ch === " ") continue;

            const tone = v01 < 0.5 ? mix(primary, secondary, v01 * 2) : mix(secondary, text, (v01 - 0.5) * 2);
            ctx.fillStyle = rgba(tone, 0.35 + v01 * 0.6);
            ctx.fillText(ch, x, y);
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
      <div className={cx("sc-live", "sc-ascii-plasma", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiPlasma.displayName = "AsciiPlasma";
