import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface CliffordSmokeProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Attractor points accumulated per frame. */
  rate?: number;
}

interface CliffordSim {
  a: number;
  b: number;
  c: number;
  d: number;
  height: number;
  trail: HTMLCanvasElement;
  width: number;
  x: number;
  y: number;
}

/**
 * Four constants and a spark: a Clifford attractor whose orbit is thrown
 * thousands of times a frame and lands as smoke, never twice in the same
 * place. Constants drift on their own; drag the pointer to bend them by hand
 * and the smoke obeys instantly.
 */
export const CliffordSmoke = React.forwardRef<HTMLDivElement, CliffordSmokeProps>(
  ({ className, label, rate = 7000, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<CliffordSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        let sim = simRef.current;
        const resized = sim && (sim.width !== width || sim.height !== height);
        if (!sim || resized || epochRef.current !== epoch) {
          const trail = sim?.trail ?? document.createElement("canvas");
          trail.width = Math.max(1, Math.floor(width));
          trail.height = Math.max(1, Math.floor(height));
          sim = {
            a: -1.4 + Math.random() * 0.4,
            b: 1.5 + Math.random() * 0.3,
            c: 0.9 + Math.random() * 0.4,
            d: 0.6 + Math.random() * 0.3,
            height,
            trail,
            width,
            x: 0.1,
            y: 0.1
          };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        // Constants drift like incense; the pointer bends a and b directly.
        let a = sim.a + Math.sin(time * 0.07) * 0.12;
        let b = sim.b + Math.cos(time * 0.05) * 0.1;
        if (pointer.inside) {
          a = sim.a + ((pointer.x / Math.max(1, width)) - 0.5) * 1.1;
          b = sim.b + ((pointer.y / Math.max(1, height)) - 0.5) * 0.9;
        }
        const { c, d } = sim;

        const trailCtx = sim.trail.getContext("2d");
        if (!trailCtx) return;
        trailCtx.globalCompositeOperation = "destination-out";
        trailCtx.fillStyle = "rgba(0, 0, 0, 0.045)";
        trailCtx.fillRect(0, 0, width, height);
        trailCtx.globalCompositeOperation = "lighter";

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        trailCtx.fillStyle = rgba(primary, 0.05);
        const scaleX = width / 4.6;
        const scaleY = height / 4.2;
        let { x, y } = sim;
        for (let i = 0; i < rate; i += 1) {
          const nx = Math.sin(a * y) + c * Math.cos(a * x);
          const ny = Math.sin(b * x) + d * Math.cos(b * y);
          x = nx;
          y = ny;
          trailCtx.fillRect(width / 2 + x * scaleX * 0.45, height / 2 + y * scaleY * 0.45, 1, 1);
        }
        sim.x = x;
        sim.y = y;
        trailCtx.globalCompositeOperation = "source-over";

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(sim.trail, 0, 0, width, height);

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `A ${a.toFixed(3)}  B ${b.toFixed(3)}  C ${c.toFixed(3)}  D ${d.toFixed(3)}`,
          8,
          height - 8
        );
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-clifford-smoke", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

CliffordSmoke.displayName = "CliffordSmoke";
