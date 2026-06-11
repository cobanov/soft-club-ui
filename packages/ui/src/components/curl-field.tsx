import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface CurlFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Number of wind-tracing particles. */
  particles?: number;
  /** Wind speed multiplier. */
  speed?: number;
}

interface Vortex {
  age: number;
  strength: number;
  x: number;
  y: number;
}

interface CurlSim {
  height: number;
  lastPointer: { x: number; y: number } | null;
  phases: number[];
  px: Float32Array;
  py: Float32Array;
  trailCanvas: HTMLCanvasElement;
  vortices: Vortex[];
  width: number;
}

/**
 * A place that has no sky: a divergence-free wind derived from a drifting
 * stream function, traced by particles with fading trails. Drag the pointer
 * to inject a vortex and file a storm report.
 */
export const CurlField = React.forwardRef<HTMLDivElement, CurlFieldProps>(
  ({ className, label, particles = 650, speed = 34, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<CurlSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, pointer, time, width }) => {
        let sim = simRef.current;
        const resized = sim && (sim.width !== width || sim.height !== height);
        if (!sim || resized || epochRef.current !== epoch) {
          const trailCanvas = sim?.trailCanvas ?? document.createElement("canvas");
          trailCanvas.width = Math.max(1, Math.floor(width));
          trailCanvas.height = Math.max(1, Math.floor(height));
          sim = {
            height,
            lastPointer: null,
            phases: Array.from({ length: 6 }, () => Math.random() * Math.PI * 2),
            px: new Float32Array(particles),
            py: new Float32Array(particles),
            trailCanvas,
            vortices: [],
            width
          };
          for (let i = 0; i < particles; i += 1) {
            sim.px[i] = Math.random() * width;
            sim.py[i] = Math.random() * height;
          }
          simRef.current = sim;
          epochRef.current = epoch;
        }

        const [p0, p1, p2, p3, p4, p5] = sim.phases;
        const fx = (Math.PI * 2) / Math.max(1, width);
        const fy = (Math.PI * 2) / Math.max(1, height);
        const drift = time * 0.08;

        // Stream function psi: analytic partials give a divergence-free field.
        const wind = (x: number, y: number, out: { vx: number; vy: number }) => {
          const a1 = 1.4 * fx * x + drift + p0;
          const b1 = 1.1 * fy * y + p1;
          const a2 = 2.6 * fx * x - drift * 1.7 + p2;
          const b2 = 2.2 * fy * y + drift * 0.9 + p3;
          const a3 = 0.7 * fx * x + drift * 0.5 + p4;
          const b3 = 0.6 * fy * y - drift * 0.6 + p5;
          // vx = d(psi)/dy, vy = -d(psi)/dx for psi = sum sin(a)sin(b)
          let vx =
            Math.sin(a1) * Math.cos(b1) * 1.1 * fy * 36 +
            Math.sin(a2) * Math.cos(b2) * 2.2 * fy * 14 +
            Math.sin(a3) * Math.cos(b3) * 0.6 * fy * 64;
          let vy =
            -Math.cos(a1) * Math.sin(b1) * 1.4 * fx * 36 -
            Math.cos(a2) * Math.sin(b2) * 2.6 * fx * 14 -
            Math.cos(a3) * Math.sin(b3) * 0.7 * fx * 64;
          for (const vortex of sim!.vortices) {
            const dx = x - vortex.x;
            const dy = y - vortex.y;
            const d2 = dx * dx + dy * dy;
            const influence = vortex.strength * Math.exp(-d2 / 5200) * (1 - vortex.age);
            vx += -dy * influence;
            vy += dx * influence;
          }
          out.vx = vx;
          out.vy = vy;
        };

        // Drag injects vortices; strength follows pointer velocity.
        if (pointer.inside) {
          const last = sim.lastPointer;
          if (last) {
            const moved = Math.hypot(pointer.x - last.x, pointer.y - last.y);
            if (moved > 3) {
              sim.vortices.push({
                age: 0,
                strength: Math.min(0.09, moved * 0.004),
                x: pointer.x,
                y: pointer.y
              });
              if (sim.vortices.length > 6) sim.vortices.shift();
            }
          }
          sim.lastPointer = { x: pointer.x, y: pointer.y };
        } else {
          sim.lastPointer = null;
        }
        for (const vortex of sim.vortices) vortex.age = Math.min(1, vortex.age + dt * 0.45);
        sim.vortices = sim.vortices.filter((vortex) => vortex.age < 1);

        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);
        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);

        const trailCtx = sim.trailCanvas.getContext("2d");
        if (!trailCtx) return;
        trailCtx.globalCompositeOperation = "destination-out";
        trailCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
        trailCtx.fillRect(0, 0, width, height);
        trailCtx.globalCompositeOperation = "source-over";
        trailCtx.strokeStyle = rgba(text, 0.5);
        trailCtx.lineWidth = 1;

        const out = { vx: 0, vy: 0 };
        trailCtx.beginPath();
        for (let i = 0; i < particles; i += 1) {
          const x = sim.px[i];
          const y = sim.py[i];
          wind(x, y, out);
          const nx = x + out.vx * dt * speed * 0.1;
          const ny = y + out.vy * dt * speed * 0.1;
          trailCtx.moveTo(x, y);
          trailCtx.lineTo(nx, ny);
          if (nx < -4 || nx > width + 4 || ny < -4 || ny > height + 4 || Math.random() < 0.004) {
            sim.px[i] = Math.random() * width;
            sim.py[i] = Math.random() * height;
          } else {
            sim.px[i] = nx;
            sim.py[i] = ny;
          }
        }
        trailCtx.stroke();

        ctx.clearRect(0, 0, width, height);

        // Field ticks: a sparse grid of vanes reading the wind.
        ctx.strokeStyle = rgba(secondary, 0.22);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let gy = 18; gy < height; gy += 34) {
          for (let gx = 18; gx < width; gx += 34) {
            wind(gx, gy, out);
            const mag = Math.hypot(out.vx, out.vy) || 1;
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + (out.vx / mag) * 7, gy + (out.vy / mag) * 7);
          }
        }
        ctx.stroke();

        ctx.drawImage(sim.trailCanvas, 0, 0, width, height);

        for (const vortex of sim.vortices) {
          ctx.strokeStyle = rgba(primary, 0.5 * (1 - vortex.age));
          ctx.beginPath();
          ctx.arc(vortex.x, vortex.y, 8 + vortex.age * 26, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(`WIND SPEED ${speed}  STORMS ${sim.vortices.length}`, 8, height - 8);
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-curl-field", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

CurlField.displayName = "CurlField";
