import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { fieldLuma, useImageGrid } from "../hooks/use-image-grid";
import { themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface MosaicImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tile size in px. */
  cell?: number;
  /** Grout gap between tiles in px. */
  gap?: number;
  label?: string;
  /** Source image. Omit for a self-contained procedural subject. */
  src?: string;
}

// Posterize a channel to chunky mosaic steps, clamped to the 0-255 range.
const quantize = (value: number) => Math.min(255, Math.round(value / 26) * 26);

/**
 * Pixelates a source image (or a procedural subject) into a grid of rounded,
 * posterized tiles separated by grout the signature gradient ground shows
 * through. Each tile breathes on a diagonal shimmer and lifts toward the
 * pointer. With no `src` the tiles take the theme's primary/secondary blend.
 */
export const MosaicImage = React.forwardRef<HTMLDivElement, MosaicImageProps>(
  ({ cell = 16, className, gap = 2, label, src, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const { sample, version } = useImageGrid(src);

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        const size = Math.max(6, cell);
        const cols = Math.max(1, Math.floor(width / size));
        const rows = Math.max(1, Math.floor(height / size));
        const grid = sample(cols, rows);

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const tile = size - gap;
        const radius = Math.min(3, tile * 0.22);
        const spot = Math.min(width, height) * 0.34;
        const rounded = typeof ctx.roundRect === "function";

        ctx.clearRect(0, 0, width, height);

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            let r: number;
            let g: number;
            let b: number;
            if (grid) {
              const i = (row * cols + col) * 4;
              r = quantize(grid.data[i]);
              g = quantize(grid.data[i + 1]);
              b = quantize(grid.data[i + 2]);
            } else {
              const lum = fieldLuma(col / cols, row / rows, time);
              r = secondary[0] + (primary[0] - secondary[0]) * lum;
              g = secondary[1] + (primary[1] - secondary[1]) * lum;
              b = secondary[2] + (primary[2] - secondary[2]) * lum;
            }

            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (lum < 0.05) continue;

            const shimmer = 0.82 + 0.18 * Math.sin((col + row) * 0.55 + time * 1.4);
            let alpha = (0.5 + lum * 0.45) * shimmer;
            const x = col * size + gap / 2;
            const y = row * size + gap / 2;
            if (pointer.inside) {
              const dx = x - pointer.x;
              const dy = y - pointer.y;
              alpha += Math.exp(-(dx * dx + dy * dy) / (spot * spot)) * 0.4;
            }

            ctx.globalAlpha = Math.min(1, alpha);
            ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
            ctx.beginPath();
            if (rounded) ctx.roundRect(x, y, tile, tile, radius);
            else ctx.rect(x, y, tile, tile);
            ctx.fill();
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
      <div className={cx("sc-live", "sc-mosaic-image", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

MosaicImage.displayName = "MosaicImage";
