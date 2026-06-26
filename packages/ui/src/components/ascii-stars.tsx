import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface AsciiStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  label?: string;
  speed?: number;
  depth?: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
}

const GLYPHS = " .:+*oO#@";

export const AsciiStars = React.forwardRef<HTMLDivElement, AsciiStarsProps>(
  ({ className, count = 140, depth = 1.4, label, speed = 0.9, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({
      stars: [] as Star[],
      seeded: false,
      w: 0,
      h: 0,
      cx: 0,
      cy: 0
    });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, pointer, width }) => {
        const st = state.current;
        const spread = depth;
        const spawn = (s: Star) => {
          s.x = (Math.random() * 2 - 1) * spread;
          s.y = (Math.random() * 2 - 1) * spread;
          s.z = Math.random() * depth + 0.05;
        };
        if (!st.seeded || st.w !== width || st.h !== height) {
          st.w = width;
          st.h = height;
          st.seeded = true;
          st.cx = width / 2;
          st.cy = height / 2;
          st.stars = Array.from({ length: count }, () => {
            const s: Star = { x: 0, y: 0, z: 0 };
            spawn(s);
            return s;
          });
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);
        const scale = Math.min(width, height) * 0.9;

        const targetX = pointer.inside ? width - pointer.x : width / 2;
        const targetY = pointer.inside ? height - pointer.y : height / 2;
        st.cx += (targetX - st.cx) * Math.min(1, dt * 2.4);
        st.cy += (targetY - st.cy) * Math.min(1, dt * 2.4);

        ctx.fillStyle = rgba([0, 0, 0], 0.42);
        ctx.fillRect(0, 0, width, height);

        const cell = 12;
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (const s of st.stars) {
          s.z -= speed * dt * (0.3 + s.z);
          const sx = st.cx + (s.x / s.z) * scale;
          const sy = st.cy + (s.y / s.z) * scale;
          if (s.z <= 0.05 || sx < 0 || sx > width || sy < 0 || sy > height) {
            spawn(s);
            continue;
          }
          const b = Math.max(0, Math.min(1, 1 - s.z / depth));
          const idx = Math.min(GLYPHS.length - 1, Math.floor(b * (GLYPHS.length - 1)));
          const glyph = GLYPHS[idx] ?? ".";
          const r = primary[0] + (text[0] - primary[0]) * b;
          const g = primary[1] + (text[1] - primary[1]) * b;
          const bl = primary[2] + (text[2] - primary[2]) * b;
          ctx.fillStyle = rgba([r, g, bl], 0.25 + b * 0.75);
          ctx.fillText(glyph, sx, sy);
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
      <div className={cx("sc-live", "sc-ascii-stars", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiStars.displayName = "AsciiStars";
