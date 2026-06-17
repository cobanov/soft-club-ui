import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { cellLuma, fieldLuma, useImageGrid } from "../hooks/use-image-grid";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface AsciiImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glyphs ordered dark to light. Defaults to binary for the code-rain look. */
  charRamp?: string;
  /** Glyph cell size in px. */
  fontSize?: number;
  label?: string;
  /** Animation speed multiplier. */
  speed?: number;
  /** Source image. Omit for a self-contained procedural subject. */
  src?: string;
}

const defaultRamp = "01";

/**
 * Renders a source image (or a procedural subject) as a live field of ASCII
 * glyphs: luminance picks the character and the ink opacity, bright cells flicker
 * and pick up a faint red/blue chromatic split, and the pointer lifts a spotlight
 * through the grid. Tinted to the active theme; pass `charRamp="01"` for binary
 * code rain or a glyph set like arrows for a denser screen.
 */
export const AsciiImage = React.forwardRef<HTMLDivElement, AsciiImageProps>(
  ({ charRamp = defaultRamp, className, fontSize = 12, label, speed = 1, src, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const { sample, version } = useImageGrid(src);
    const ramp = charRamp.length > 0 ? charRamp : defaultRamp;

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const cellW = fontSize * 0.62;
        const cellH = fontSize * 1.16;
        const cols = Math.max(1, Math.floor(width / cellW));
        const rows = Math.max(1, Math.floor(height / cellH));
        const grid = sample(cols, rows);
        const frame = time * speed;

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const spot = Math.min(width, height) * 0.32;

        ctx.clearRect(0, 0, width, height);
        ctx.font = `${fontSize}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const lum = grid
              ? cellLuma(grid.data, (row * cols + col) * 4)
              : fieldLuma(col / cols, row / rows, frame);
            if (lum < 0.08) continue;

            const flick = Math.sin(col * 12.9898 + row * 78.233 + Math.floor(frame * 3) * 0.6);
            const idx = Math.min(ramp.length - 1, Math.floor(lum * ramp.length + (flick > 0 ? 1 : 0)));
            const glyph = ramp[Math.max(0, idx)];
            if (!glyph || glyph === " ") continue;

            const x = col * cellW;
            const y = row * cellH;
            let alpha = 0.32 + lum * 0.62;
            if (pointer.inside) {
              const dx = x - pointer.x;
              const dy = y - pointer.y;
              alpha += Math.exp(-(dx * dx + dy * dy) / (spot * spot)) * 0.5;
            }
            alpha = Math.min(1, alpha);

            if (lum > 0.55) {
              ctx.globalAlpha = alpha * 0.26;
              ctx.fillStyle = "rgb(255, 86, 86)";
              ctx.fillText(glyph, x + 0.8, y);
              ctx.fillStyle = "rgb(96, 142, 255)";
              ctx.fillText(glyph, x - 0.8, y);
            }

            ctx.globalAlpha = alpha;
            ctx.fillStyle = rgba(lum > 0.5 ? primary : secondary, 1);
            ctx.fillText(glyph, x, y);
          }
        }

        ctx.globalAlpha = 1;
      },
      { fps: 24, reactive: true, redrawKey: version }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-ascii-image", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiImage.displayName = "AsciiImage";
