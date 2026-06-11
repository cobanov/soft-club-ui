import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface SandpileBasilicaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grains dripped onto the center each frame. */
  drip?: number;
  label?: string;
}

const COLS = 150;
const ROWS = 94;

interface SandpileSim {
  avalanches: number;
  dropped: number;
  grains: Int32Array;
}

/**
 * The Abelian sandpile: one rule — whoever holds four, gives four away. The
 * floor anneals itself into self-similar cathedral windows that nobody
 * designed. Grains drip onto the center; click anywhere to pour a handful
 * and watch the avalanche negotiate.
 */
export const SandpileBasilica = React.forwardRef<HTMLDivElement, SandpileBasilicaProps>(
  ({ className, drip = 24, label, onPointerDown, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<SandpileSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          sim = { avalanches: 0, dropped: 0, grains: new Int32Array(COLS * ROWS) };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        const { grains } = sim;
        const centerIndex = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
        grains[centerIndex] += drip;
        sim.dropped += drip;

        // Topple until stable, bounded per frame so cascades stay smooth.
        for (let pass = 0; pass < 60; pass += 1) {
          let toppled = 0;
          for (let y = 1; y < ROWS - 1; y += 1) {
            const row = y * COLS;
            for (let x = 1; x < COLS - 1; x += 1) {
              const i = row + x;
              if (grains[i] >= 4) {
                const share = grains[i] >> 2;
                grains[i] -= share * 4;
                grains[i - 1] += share;
                grains[i + 1] += share;
                grains[i - COLS] += share;
                grains[i + COLS] += share;
                toppled += 1;
              }
            }
          }
          if (toppled === 0) break;
          sim.avalanches += toppled;
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);
        const tones = [
          null,
          rgba(secondary, 0.3),
          rgba(primary, 0.45),
          rgba(primary, 0.85),
          rgba(text, 0.9)
        ];

        const cellW = width / COLS;
        const cellH = height / ROWS;
        ctx.clearRect(0, 0, width, height);
        for (let y = 0; y < ROWS; y += 1) {
          const row = y * COLS;
          for (let x = 0; x < COLS; x += 1) {
            const level = Math.min(4, grains[row + x]);
            const tone = tones[level];
            if (!tone) continue;
            ctx.fillStyle = tone;
            ctx.fillRect(x * cellW, y * cellH, Math.ceil(cellW), Math.ceil(cellH));
          }
        }

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `DROPPED ${sim.dropped}  TOPPLES ${sim.avalanches}  RULE 4 -> 1+1+1+1`,
          8,
          height - 8
        );
      },
      { fps: 30 }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const pour = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const sim = simRef.current;
      const host = hostRef.current;
      if (!sim || !host) return;
      const rect = host.getBoundingClientRect();
      const x = Math.min(
        COLS - 2,
        Math.max(1, Math.floor(((event.clientX - rect.left) / rect.width) * COLS))
      );
      const y = Math.min(
        ROWS - 2,
        Math.max(1, Math.floor(((event.clientY - rect.top) / rect.height) * ROWS))
      );
      sim.grains[y * COLS + x] += 256;
      sim.dropped += 256;
    };

    return (
      <div
        className={cx("sc-live", "sc-sandpile-basilica", className)}
        onPointerDown={pour}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

SandpileBasilica.displayName = "SandpileBasilica";
