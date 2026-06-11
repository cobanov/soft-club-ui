import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface ChladniPlateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of sand grains on the plate. */
  grains?: number;
  label?: string;
}

interface ChladniSim {
  gx: Float32Array;
  gy: Float32Array;
}

/**
 * Sound carving stone, slowly: a Chladni plate where grains descend the
 * amplitude gradient of a standing wave and settle on its silent nodal lines.
 * Move the pointer across the plate to retune the two harmonics. They snap to
 * whole numbers, so every figure is a chord the plate can actually hold.
 */
export const ChladniPlate = React.forwardRef<HTMLDivElement, ChladniPlateProps>(
  ({ className, grains = 2400, label, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<ChladniSim | null>(null);
    const epochRef = React.useRef(-1);
    const modesRef = React.useRef({ m: 2, n: 3 });
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, pointer, time, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          sim = { gx: new Float32Array(grains), gy: new Float32Array(grains) };
          for (let i = 0; i < grains; i += 1) {
            sim.gx[i] = Math.random();
            sim.gy[i] = Math.random();
          }
          simRef.current = sim;
          epochRef.current = epoch;
        }

        // Pointer retunes the harmonics with snapping; idle drifts the chord.
        if (pointer.inside) {
          modesRef.current.n = 1 + Math.round((pointer.x / Math.max(1, width)) * 5);
          modesRef.current.m = 1 + Math.round((pointer.y / Math.max(1, height)) * 5);
        } else if (Math.floor(time / 7) % 2 === 0 && Math.floor(time * 30) % 210 === 0) {
          modesRef.current.n = 1 + Math.floor(Math.random() * 5);
          modesRef.current.m = 1 + Math.floor(Math.random() * 5);
        }
        const { m, n } = modesRef.current;

        const amplitude = (x: number, y: number) =>
          Math.sin(n * Math.PI * x) * Math.sin(m * Math.PI * y) +
          Math.sin(m * Math.PI * x) * Math.sin(n * Math.PI * y);

        // Grains descend |amplitude| toward the nodal lines, with thermal jitter.
        const step = Math.min(0.05, dt) * 1.6;
        const eps = 0.004;
        const { gx, gy } = sim;
        for (let i = 0; i < grains; i += 1) {
          const here = Math.abs(amplitude(gx[i], gy[i]));
          const dx = (Math.abs(amplitude(gx[i] + eps, gy[i])) - here) / eps;
          const dy = (Math.abs(amplitude(gx[i], gy[i] + eps)) - here) / eps;
          gx[i] -= dx * step * 0.02;
          gy[i] -= dy * step * 0.02;
          gx[i] += (Math.random() - 0.5) * 0.0024;
          gy[i] += (Math.random() - 0.5) * 0.0024;
          if (gx[i] < 0.01 || gx[i] > 0.99) gx[i] = Math.random();
          if (gy[i] < 0.01 || gy[i] > 0.99) gy[i] = Math.random();
        }

        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);
        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = rgba(text, 0.66);
        for (let i = 0; i < grains; i += 1) {
          ctx.fillRect(gx[i] * width, gy[i] * height, 1.4, 1.4);
        }

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(`MODE ${n}:${m}  FUNDAMENTAL ${52 + n * m * 4} HZ  GRAINS ${grains}`, 8, height - 8);
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-chladni-plate", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

ChladniPlate.displayName = "ChladniPlate";
