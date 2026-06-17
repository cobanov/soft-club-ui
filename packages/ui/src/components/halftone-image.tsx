import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { cellLuma, fieldLuma, useImageGrid } from "../hooks/use-image-grid";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface HalftoneImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dot grid pitch in px. */
  cell?: number;
  /** Invert so bright regions read as small dots on a filled ground. */
  invert?: boolean;
  label?: string;
  /** Source image. Omit for a self-contained procedural subject. */
  src?: string;
}

/**
 * Reduces a source image (or a procedural subject) to a halftone screen of
 * theme-tinted dots whose radius tracks luminance. Dots pulse on a diagonal
 * wave, fade with vertical depth, and bloom under the pointer, all over the
 * signature dark gradient ground. Set `invert` for a small-dot negative.
 */
export const HalftoneImage = React.forwardRef<HTMLDivElement, HalftoneImageProps>(
  ({ cell = 10, className, invert = false, label, src, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const { sample, version } = useImageGrid(src);

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const size = Math.max(5, cell);
        const cols = Math.max(1, Math.floor(width / size));
        const rows = Math.max(1, Math.floor(height / size));
        const grid = sample(cols, rows);

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [240, 249, 255]);
        const maxR = size * 0.64;
        const spot = Math.min(width, height) * 0.3;
        const TAU = Math.PI * 2;

        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const raw = grid
              ? cellLuma(grid.data, (row * cols + col) * 4)
              : fieldLuma(col / cols, row / rows, time);
            const lum = invert ? 1 - raw : raw;

            const pulse = 0.9 + 0.1 * Math.sin(col * 0.5 - row * 0.4 + time * 2);
            const cx0 = col * size + size / 2;
            const cy0 = row * size + size / 2;
            let radius = lum * maxR * pulse;
            if (pointer.inside) {
              const dx = cx0 - pointer.x;
              const dy = cy0 - pointer.y;
              radius += Math.exp(-(dx * dx + dy * dy) / (spot * spot)) * maxR * 0.5;
            }
            if (radius < 0.35) continue;

            // Top of the field reads brightest, like a lit gradient.
            const depth = 0.55 + 0.45 * (1 - row / rows);
            const tone: [number, number, number] = lum > 0.82 ? text : primary;
            ctx.globalAlpha = Math.min(1, (0.3 + lum * 0.62) * depth);
            ctx.fillStyle = rgba(tone, 1);
            ctx.beginPath();
            ctx.arc(cx0, cy0, Math.min(radius, maxR), 0, TAU);
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1;
      },
      { fps: 26, reactive: true, redrawKey: version }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-halftone-image", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

HalftoneImage.displayName = "HalftoneImage";
