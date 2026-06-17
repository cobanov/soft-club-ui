import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { cellLuma, fieldLuma, useImageGrid } from "../hooks/use-image-grid";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface DitherImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sampling cell size in px (smaller is finer, heavier). */
  cell?: number;
  label?: string;
  /** Diagonal line-screen scroll speed. */
  speed?: number;
  /** Source image. Omit for a self-contained procedural subject. */
  src?: string;
}

// 4x4 Bayer matrix, normalized to 0..1 thresholds for the ordered jitter.
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/**
 * Resolves a source image (or a procedural subject) into a scrolling diagonal
 * line-screen: a sine grating sets the carrier, a Bayer matrix adds ordered
 * jitter, and luminance decides where the bright ink wins over the saturated
 * theme field. Brighter regions go solid while shadows thin to diagonal hatch.
 */
export const DitherImage = React.forwardRef<HTMLDivElement, DitherImageProps>(
  ({ cell = 4, className, label, speed = 1, src, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const { sample, version } = useImageGrid(src);

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const size = Math.max(2, cell);
        const cols = Math.max(1, Math.floor(width / size));
        const rows = Math.max(1, Math.floor(height / size));
        const grid = sample(cols, rows);
        const phase = time * speed * 1.6;

        const ink = themeRgb(hostRef.current, "--sc-theme-rgb-text", [240, 249, 255]);
        const pr = pointer.inside ? pointer.x / Math.max(1, width) : -1;
        const pcol = pr * cols;
        const prow = pointer.inside ? (pointer.y / Math.max(1, height)) * rows : -1;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = rgba(ink, 1);

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            let lum = grid
              ? cellLuma(grid.data, (row * cols + col) * 4)
              : fieldLuma(col / cols, row / rows, time);

            if (pointer.inside) {
              const dx = col - pcol;
              const dy = row - prow;
              lum += Math.exp(-(dx * dx + dy * dy) / 900) * 0.4;
            }

            const grating = 0.5 + 0.5 * Math.sin((col - row) * 0.6 + phase);
            const threshold = grating * 0.86 + (bayer[(row & 3) * 4 + (col & 3)] - 0.5) * 0.22 + 0.06;
            if (lum <= threshold) continue;

            ctx.globalAlpha = Math.min(1, 0.5 + lum * 0.5);
            ctx.fillRect(col * size, row * size, size, size);
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
      <div className={cx("sc-live", "sc-dither-image", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

DitherImage.displayName = "DitherImage";
