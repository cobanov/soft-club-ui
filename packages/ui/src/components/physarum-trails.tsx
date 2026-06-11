import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface PhysarumTrailsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of agents excavating the network. */
  agents?: number;
  label?: string;
  /** Number of fixed attractant nodes. */
  nodes?: number;
}

const GRID_W = 176;
const GRID_H = 110;

interface PhysarumSim {
  angle: Float32Array;
  buffer: HTMLCanvasElement;
  image: ImageData;
  nodes: { label: string; x: number; y: number }[];
  trail: Float32Array;
  trailNext: Float32Array;
  x: Float32Array;
  y: Float32Array;
}

const seedSim = (sim: PhysarumSim, agents: number, nodeCount: number) => {
  for (let i = 0; i < agents; i += 1) {
    sim.x[i] = Math.random() * GRID_W;
    sim.y[i] = Math.random() * GRID_H;
    sim.angle[i] = Math.random() * Math.PI * 2;
  }
  sim.trail.fill(0);
  sim.nodes = Array.from({ length: nodeCount }, (_, index) => ({
    label: `R0${index + 1}`,
    x: GRID_W * (0.16 + 0.68 * Math.random()),
    y: GRID_H * (0.16 + 0.68 * Math.random())
  }));
};

const sample = (trail: Float32Array, x: number, y: number) => {
  const sx = Math.min(GRID_W - 1, Math.max(0, Math.floor(x)));
  const sy = Math.min(GRID_H - 1, Math.max(0, Math.floor(y)));
  return trail[sy * GRID_W + sx];
};

/**
 * A physarum (slime mold) simulation: blind agents sense, turn, and deposit,
 * and the routes between attractant nodes are excavated rather than drawn.
 * Hovering deposits extra attractant, pulling the network toward the pointer.
 */
export const PhysarumTrails = React.forwardRef<HTMLDivElement, PhysarumTrailsProps>(
  ({ agents = 2400, className, label, nodes = 7, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<PhysarumSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, width }) => {
        let sim = simRef.current;
        if (!sim) {
          const buffer = document.createElement("canvas");
          buffer.width = GRID_W;
          buffer.height = GRID_H;
          sim = {
            angle: new Float32Array(agents),
            buffer,
            image: new ImageData(GRID_W, GRID_H),
            nodes: [],
            trail: new Float32Array(GRID_W * GRID_H),
            trailNext: new Float32Array(GRID_W * GRID_H),
            x: new Float32Array(agents),
            y: new Float32Array(agents)
          };
          simRef.current = sim;
          epochRef.current = -1;
        }
        if (epochRef.current !== epoch) {
          epochRef.current = epoch;
          seedSim(sim, agents, nodes);
        }

        const { angle, trail, trailNext, x, y } = sim;

        for (const node of sim.nodes) {
          trail[Math.floor(node.y) * GRID_W + Math.floor(node.x)] += 3.2;
        }
        if (pointer.inside) {
          const px = Math.floor((pointer.x / Math.max(1, width)) * GRID_W);
          const py = Math.floor((pointer.y / Math.max(1, height)) * GRID_H);
          if (px > 1 && px < GRID_W - 2 && py > 1 && py < GRID_H - 2) {
            trail[py * GRID_W + px] += 3.2;
          }
        }

        const senseReach = 8;
        const senseSpread = 0.46;
        const turnRate = 0.34;
        const stride = 1.15;
        for (let i = 0; i < agents; i += 1) {
          const a = angle[i];
          const forward = sample(
            trail,
            x[i] + Math.cos(a) * senseReach,
            y[i] + Math.sin(a) * senseReach
          );
          const leftward = sample(
            trail,
            x[i] + Math.cos(a - senseSpread) * senseReach,
            y[i] + Math.sin(a - senseSpread) * senseReach
          );
          const rightward = sample(
            trail,
            x[i] + Math.cos(a + senseSpread) * senseReach,
            y[i] + Math.sin(a + senseSpread) * senseReach
          );
          if (leftward > forward && leftward > rightward) angle[i] -= turnRate;
          else if (rightward > forward && rightward > leftward) angle[i] += turnRate;
          else if (forward < leftward && forward < rightward) {
            angle[i] += (Math.random() - 0.5) * turnRate * 2;
          }
          x[i] = (x[i] + Math.cos(angle[i]) * stride + GRID_W) % GRID_W;
          y[i] = (y[i] + Math.sin(angle[i]) * stride + GRID_H) % GRID_H;
          trail[Math.floor(y[i]) * GRID_W + Math.floor(x[i])] += 0.9;
        }

        // Diffuse + evaporate.
        for (let gy = 0; gy < GRID_H; gy += 1) {
          const up = Math.max(0, gy - 1) * GRID_W;
          const down = Math.min(GRID_H - 1, gy + 1) * GRID_W;
          const row = gy * GRID_W;
          for (let gx = 0; gx < GRID_W; gx += 1) {
            const left = Math.max(0, gx - 1);
            const right = Math.min(GRID_W - 1, gx + 1);
            const mean =
              (trail[row + gx] +
                trail[row + left] +
                trail[row + right] +
                trail[up + gx] +
                trail[down + gx]) /
              5;
            trailNext[row + gx] = mean * 0.916;
          }
        }
        trail.set(trailNext);

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const data = sim.image.data;
        for (let i = 0; i < GRID_W * GRID_H; i += 1) {
          const t = Math.min(1, trail[i] / 5.5);
          const glow = Math.pow(t, 0.75);
          const o = i * 4;
          data[o] = primary[0];
          data[o + 1] = primary[1];
          data[o + 2] = primary[2];
          data[o + 3] = Math.floor(glow * 255);
        }
        const bufferCtx = sim.buffer.getContext("2d");
        if (!bufferCtx) return;
        bufferCtx.putImageData(sim.image, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(sim.buffer, 0, 0, width, height);

        ctx.strokeStyle = rgba(secondary, 0.85);
        ctx.fillStyle = rgba(secondary, 0.85);
        ctx.font = "9px monospace";
        ctx.lineWidth = 1;
        for (const node of sim.nodes) {
          const nx = (node.x / GRID_W) * width;
          const ny = (node.y / GRID_H) * height;
          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(nx - 9, ny);
          ctx.lineTo(nx - 3, ny);
          ctx.moveTo(nx + 3, ny);
          ctx.lineTo(nx + 9, ny);
          ctx.stroke();
          ctx.fillText(node.label, nx + 11, ny + 3);
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
      <div className={cx("sc-live", "sc-physarum-trails", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

PhysarumTrails.displayName = "PhysarumTrails";
