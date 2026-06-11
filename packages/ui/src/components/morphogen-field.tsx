import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface MorphogenFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gray-Scott feed rate. Drifts slightly over time. */
  feed?: number;
  /** Gray-Scott kill rate. */
  kill?: number;
  label?: string;
  /** Simulation steps per frame. */
  speed?: number;
}

const SIM_W = 144;
const SIM_H = 90;

interface MorphogenSim {
  buffer: HTMLCanvasElement;
  image: ImageData;
  u: Float32Array;
  uNext: Float32Array;
  v: Float32Array;
  vNext: Float32Array;
}

const seedSim = (sim: MorphogenSim) => {
  sim.u.fill(1);
  sim.v.fill(0);
  for (let blob = 0; blob < 14; blob += 1) {
    const bx = 4 + Math.floor(Math.random() * (SIM_W - 8));
    const by = 4 + Math.floor(Math.random() * (SIM_H - 8));
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        sim.v[(by + dy) * SIM_W + bx + dx] = 1;
      }
    }
  }
};

/**
 * A Gray-Scott reaction-diffusion field. Feed and kill drift slowly, contour
 * bands quantize the chemical into rings, and the pointer acts as a morphogen
 * stylus that paints new growth wherever it touches.
 */
export const MorphogenField = React.forwardRef<HTMLDivElement, MorphogenFieldProps>(
  ({ className, feed = 0.0367, kill = 0.0649, label, speed = 8, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<MorphogenSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        let sim = simRef.current;
        if (!sim) {
          const buffer = document.createElement("canvas");
          buffer.width = SIM_W;
          buffer.height = SIM_H;
          sim = {
            buffer,
            image: new ImageData(SIM_W, SIM_H),
            u: new Float32Array(SIM_W * SIM_H),
            uNext: new Float32Array(SIM_W * SIM_H),
            v: new Float32Array(SIM_W * SIM_H),
            vNext: new Float32Array(SIM_W * SIM_H)
          };
          simRef.current = sim;
          epochRef.current = -1;
        }
        if (epochRef.current !== epoch) {
          epochRef.current = epoch;
          seedSim(sim);
        }

        // Parameter drift keeps the pattern from settling.
        const f = feed + Math.sin(time * 0.11) * 0.0016;
        const k = kill + Math.cos(time * 0.07) * 0.0012;

        if (pointer.inside) {
          const px = Math.floor((pointer.x / Math.max(1, width)) * SIM_W);
          const py = Math.floor((pointer.y / Math.max(1, height)) * SIM_H);
          for (let dy = -2; dy <= 2; dy += 1) {
            for (let dx = -2; dx <= 2; dx += 1) {
              const x = px + dx;
              const y = py + dy;
              if (x > 0 && x < SIM_W - 1 && y > 0 && y < SIM_H - 1 && dx * dx + dy * dy <= 5) {
                sim.v[y * SIM_W + x] = 0.9;
                sim.u[y * SIM_W + x] = 0.4;
              }
            }
          }
        }

        const { u, uNext, v, vNext } = sim;
        for (let step = 0; step < speed; step += 1) {
          for (let y = 0; y < SIM_H; y += 1) {
            const up = ((y - 1 + SIM_H) % SIM_H) * SIM_W;
            const down = ((y + 1) % SIM_H) * SIM_W;
            const row = y * SIM_W;
            for (let x = 0; x < SIM_W; x += 1) {
              const left = (x - 1 + SIM_W) % SIM_W;
              const right = (x + 1) % SIM_W;
              const i = row + x;
              const lapU =
                (u[row + left] + u[row + right] + u[up + x] + u[down + x]) * 0.2 +
                (u[up + left] + u[up + right] + u[down + left] + u[down + right]) * 0.05 -
                u[i];
              const lapV =
                (v[row + left] + v[row + right] + v[up + x] + v[down + x]) * 0.2 +
                (v[up + left] + v[up + right] + v[down + left] + v[down + right]) * 0.05 -
                v[i];
              const uvv = u[i] * v[i] * v[i];
              uNext[i] = u[i] + lapU - uvv + f * (1 - u[i]);
              vNext[i] = v[i] + 0.5 * lapV + uvv - (f + k) * v[i];
            }
          }
          u.set(uNext);
          v.set(vNext);
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const data = sim.image.data;
        for (let i = 0; i < SIM_W * SIM_H; i += 1) {
          const t = Math.min(1, v[i] * 2.6);
          const band = Math.floor(t * 4) / 4;
          const o = i * 4;
          data[o] = primary[0];
          data[o + 1] = primary[1];
          data[o + 2] = primary[2];
          data[o + 3] = Math.floor(band * 235);
        }
        const bufferCtx = sim.buffer.getContext("2d");
        if (!bufferCtx) return;
        bufferCtx.putImageData(sim.image, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(sim.buffer, 0, 0, width, height);

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(`FEED ${f.toFixed(4)}  KILL ${k.toFixed(4)}`, 8, height - 8);
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-morphogen-field", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

MorphogenField.displayName = "MorphogenField";
