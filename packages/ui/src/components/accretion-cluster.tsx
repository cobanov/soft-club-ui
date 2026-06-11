import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface AccretionClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Strata bands used to shade deposits by arrival order. */
  bands?: number;
  label?: string;
  /** Random walkers launched per frame. */
  walkers?: number;
}

const GRID = 168;

interface AccretionSim {
  count: number;
  order: Int32Array;
  radius: number;
}

/**
 * Witten-Sander diffusion-limited aggregation: a mineral that remembers its
 * own arrival order. Nothing is drawn — everything is deposited, one lost
 * particle at a time, and the strata bands in the crust are the archive of
 * when. Regen starts a new seed crystal.
 */
export const AccretionCluster = React.forwardRef<HTMLDivElement, AccretionClusterProps>(
  ({ bands = 7, className, label, walkers = 220, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<AccretionSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, time, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          sim = { count: 1, order: new Int32Array(GRID * GRID), radius: 4 };
          sim.order[(GRID / 2) * GRID + GRID / 2] = 1;
          simRef.current = sim;
          epochRef.current = epoch;
        }

        const center = GRID / 2;
        const { order } = sim;
        const stuck = (x: number, y: number) =>
          x > 0 &&
          x < GRID - 1 &&
          y > 0 &&
          y < GRID - 1 &&
          (order[y * GRID + x - 1] > 0 ||
            order[y * GRID + x + 1] > 0 ||
            order[(y - 1) * GRID + x] > 0 ||
            order[(y + 1) * GRID + x] > 0);

        const spawnRadius = Math.min(GRID / 2 - 4, sim.radius + 8);
        const killRadius = Math.min(GRID / 2 - 2, spawnRadius + 10);
        if (sim.count < 5200) {
          for (let w = 0; w < walkers; w += 1) {
            const startAngle = Math.random() * Math.PI * 2;
            let x = Math.round(center + Math.cos(startAngle) * spawnRadius);
            let y = Math.round(center + Math.sin(startAngle) * spawnRadius);
            for (let step = 0; step < 420; step += 1) {
              x += Math.random() < 0.5 ? -1 : 1;
              y += Math.random() < 0.5 ? -1 : 1;
              const dx = x - center;
              const dy = y - center;
              if (dx * dx + dy * dy > killRadius * killRadius) break;
              if (stuck(x, y)) {
                sim.count += 1;
                order[y * GRID + x] = sim.count;
                const reach = Math.sqrt(dx * dx + dy * dy);
                if (reach > sim.radius) sim.radius = reach;
                break;
              }
            }
          }
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const cell = Math.min(width, height) / GRID;
        const offsetX = (width - GRID * cell) / 2;
        const offsetY = (height - GRID * cell) / 2;

        ctx.clearRect(0, 0, width, height);
        for (let gy = 0; gy < GRID; gy += 1) {
          for (let gx = 0; gx < GRID; gx += 1) {
            const arrival = order[gy * GRID + gx];
            if (arrival === 0) continue;
            const band = Math.floor((arrival / Math.max(1, sim.count)) * bands);
            const tone = 0.3 + (band / Math.max(1, bands - 1)) * 0.65;
            ctx.fillStyle = rgba(primary, tone);
            ctx.fillRect(
              offsetX + gx * cell,
              offsetY + gy * cell,
              Math.max(1, cell),
              Math.max(1, cell)
            );
          }
        }

        // Dashed spawn ring breathing around the crust.
        ctx.strokeStyle = rgba(secondary, 0.4);
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 8;
        ctx.beginPath();
        ctx.arc(
          offsetX + center * cell,
          offsetY + center * cell,
          spawnRadius * cell,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `DEPOSITS ${sim.count}  WALKERS ${walkers}  RADIUS ${Math.round(sim.radius)}  BANDS ${bands}`,
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

    return (
      <div className={cx("sc-live", "sc-accretion-cluster", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AccretionCluster.displayName = "AccretionCluster";
