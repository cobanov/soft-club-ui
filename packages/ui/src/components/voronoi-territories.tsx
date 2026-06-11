import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface VoronoiTerritoriesProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Number of territory sites surveyed. */
  sites?: number;
}

const BLOCK = 5;

interface Site {
  cells: number;
  cx: number;
  cy: number;
  flash: number;
  label: string;
  omega: number;
  phase: number;
  x: number;
  y: number;
}

interface VoronoiSim {
  cols: number;
  owner: Int16Array;
  ruptured: number;
  rows: number;
  sites: Site[];
}

const makeSite = (cols: number, rows: number): Site => ({
  cells: 0,
  cx: 0,
  cy: 0,
  flash: 0,
  label: `C-${100 + Math.floor(Math.random() * 800)}`,
  omega: 0.6 + Math.random() * 0.9,
  phase: Math.random() * Math.PI * 2,
  x: Math.random() * cols,
  y: Math.random() * rows
});

/**
 * The archive surveyed as land: a Voronoi census over a pixel grid. Sites
 * drift under Lloyd relaxation, Kuramoto coupling synchronizes the shading of
 * neighboring holdings, and clicking a territory ruptures its file, annexing
 * it to a new random survey point. The map keeps the damage on record.
 */
export const VoronoiTerritories = React.forwardRef<HTMLDivElement, VoronoiTerritoriesProps>(
  ({ className, label, onPointerDown, sites = 24, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<VoronoiSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, width }) => {
        const cols = Math.max(8, Math.floor(width / BLOCK));
        const rows = Math.max(8, Math.floor(height / BLOCK));
        let sim = simRef.current;
        if (!sim || sim.cols !== cols || sim.rows !== rows || epochRef.current !== epoch) {
          sim = {
            cols,
            owner: new Int16Array(cols * rows),
            ruptured: 0,
            rows,
            sites: Array.from({ length: sites }, () => makeSite(cols, rows))
          };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        // Nearest-site assignment + centroid accumulation (Lloyd relaxation).
        for (const site of sim.sites) {
          site.cells = 0;
          site.cx = 0;
          site.cy = 0;
        }
        const { owner } = sim;
        for (let gy = 0; gy < rows; gy += 1) {
          for (let gx = 0; gx < cols; gx += 1) {
            let best = 0;
            let bestDist = Infinity;
            for (let s = 0; s < sim.sites.length; s += 1) {
              const dx = sim.sites[s].x - gx;
              const dy = sim.sites[s].y - gy;
              const dist = dx * dx + dy * dy;
              if (dist < bestDist) {
                bestDist = dist;
                best = s;
              }
            }
            owner[gy * cols + gx] = best;
            const site = sim.sites[best];
            site.cells += 1;
            site.cx += gx;
            site.cy += gy;
          }
        }
        for (const site of sim.sites) {
          if (site.cells > 0) {
            site.x += (site.cx / site.cells - site.x) * 0.08;
            site.y += (site.cy / site.cells - site.y) * 0.08;
          }
          site.flash = Math.max(0, site.flash - dt * 1.4);
        }

        // Kuramoto coupling across shared borders.
        const coupling = new Float32Array(sim.sites.length);
        for (let gy = 0; gy < rows - 1; gy += 1) {
          for (let gx = 0; gx < cols - 1; gx += 1) {
            const here = owner[gy * cols + gx];
            const east = owner[gy * cols + gx + 1];
            const south = owner[(gy + 1) * cols + gx];
            if (east !== here) {
              coupling[here] += Math.sin(sim.sites[east].phase - sim.sites[here].phase);
              coupling[east] += Math.sin(sim.sites[here].phase - sim.sites[east].phase);
            }
            if (south !== here) {
              coupling[here] += Math.sin(sim.sites[south].phase - sim.sites[here].phase);
              coupling[south] += Math.sin(sim.sites[here].phase - sim.sites[south].phase);
            }
          }
        }
        let syncX = 0;
        let syncY = 0;
        sim.sites.forEach((site, index) => {
          site.phase += dt * (site.omega + 0.0016 * coupling[index]);
          syncX += Math.cos(site.phase);
          syncY += Math.sin(site.phase);
        });
        const sync = Math.hypot(syncX, syncY) / sim.sites.length;

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);
        const warm = themeRgb(hostRef.current, "--sc-theme-rgb-warm", [201, 124, 92]);

        ctx.clearRect(0, 0, width, height);
        for (let gy = 0; gy < rows; gy += 1) {
          for (let gx = 0; gx < cols; gx += 1) {
            const here = owner[gy * cols + gx];
            const site = sim.sites[here];
            const east = gx + 1 < cols ? owner[gy * cols + gx + 1] : here;
            const south = gy + 1 < rows ? owner[(gy + 1) * cols + gx] : here;
            const isWall = east !== here || south !== here;
            if (isWall) {
              ctx.fillStyle = rgba(text, 0.82);
            } else if (site.flash > 0) {
              ctx.fillStyle = rgba(warm, 0.25 + site.flash * 0.6);
            } else {
              const pulse = 0.5 + 0.5 * Math.sin(site.phase);
              ctx.fillStyle = rgba(primary, 0.1 + pulse * 0.16);
            }
            ctx.fillRect(gx * BLOCK, gy * BLOCK, BLOCK - 1, BLOCK - 1);
          }
        }

        ctx.fillStyle = rgba(text, 0.8);
        ctx.font = "8px monospace";
        sim.sites.forEach((site, index) => {
          if (index % 3 !== 0) return;
          ctx.fillText(site.label, site.x * BLOCK + 4, site.y * BLOCK - 3);
          ctx.fillText(String(site.cells), site.x * BLOCK + 4, site.y * BLOCK + 7);
        });

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `HOLDINGS ${sim.sites.length}  RUPTURED ${sim.ruptured}  SYNC ${sync.toFixed(2)}  GRID ${cols}x${rows}`,
          8,
          height - 8
        );
      },
      { fps: 24 }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const rupture = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const sim = simRef.current;
      const host = hostRef.current;
      if (!sim || !host) return;
      const rect = host.getBoundingClientRect();
      const gx = Math.floor((event.clientX - rect.left) / BLOCK);
      const gy = Math.floor((event.clientY - rect.top) / BLOCK);
      if (gx < 0 || gy < 0 || gx >= sim.cols || gy >= sim.rows) return;
      const site = sim.sites[sim.owner[gy * sim.cols + gx]];
      site.flash = 1;
      site.x = Math.random() * sim.cols;
      site.y = Math.random() * sim.rows;
      site.label = `C-${100 + Math.floor(Math.random() * 800)}`;
      sim.ruptured += 1;
    };

    return (
      <div
        className={cx("sc-live", "sc-voronoi-territories", className)}
        onPointerDown={rupture}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

VoronoiTerritories.displayName = "VoronoiTerritories";
