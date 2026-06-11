import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface EpicycleOrreryProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Base revolutions per second of the deferent. */
  speed?: number;
}

interface OrreryRing {
  radius: number;
  rate: number;
}

interface OrrerySim {
  rings: OrreryRing[];
  trace: HTMLCanvasElement;
  traceHeight: number;
  traceWidth: number;
}

const makeRings = (): OrreryRing[] => [
  { radius: 0.34, rate: 1 },
  { radius: 0.18, rate: -2.6 + Math.random() * 0.8 },
  { radius: 0.09, rate: 5.2 + Math.random() * 1.6 },
  { radius: 0.045, rate: -9.5 + Math.random() * 3 }
];

/**
 * A model of a heaven that never existed, which is what every model is.
 * Deferent and epicycles stack into a court of nested orbits; the planet's
 * trace closes only when the court agrees on its ratios. Move the pointer
 * across the orrery to retune the outer epicycle and reopen the question.
 */
export const EpicycleOrrery = React.forwardRef<HTMLDivElement, EpicycleOrreryProps>(
  ({ className, label, speed = 0.16, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<OrrerySim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, time, width }) => {
        let sim = simRef.current;
        const resized = sim && (sim.traceWidth !== width || sim.traceHeight !== height);
        if (!sim || resized || epochRef.current !== epoch) {
          const trace = sim?.trace ?? document.createElement("canvas");
          trace.width = Math.max(1, Math.floor(width));
          trace.height = Math.max(1, Math.floor(height));
          const traceCtx = trace.getContext("2d");
          traceCtx?.clearRect(0, 0, trace.width, trace.height);
          sim = { rings: makeRings(), trace, traceHeight: height, traceWidth: width };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        // The pointer retunes the outermost epicycle: x is rate, y is radius.
        if (pointer.inside) {
          const outer = sim.rings[sim.rings.length - 1];
          outer.rate = -12 + (pointer.x / Math.max(1, width)) * 24;
          outer.radius = 0.02 + (pointer.y / Math.max(1, height)) * 0.08;
        }

        const cx0 = width / 2;
        const cy0 = height / 2;
        const scale = Math.min(width, height);
        const angle = time * speed * Math.PI * 2;

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);

        // Walk the chain of circles to the planet.
        let x = cx0;
        let y = cy0;
        const joints: [number, number, number][] = [];
        for (const ring of sim.rings) {
          joints.push([x, y, ring.radius * scale]);
          x += Math.cos(angle * ring.rate) * ring.radius * scale;
          y += Math.sin(angle * ring.rate) * ring.radius * scale;
        }

        const traceCtx = sim.trace.getContext("2d");
        if (!traceCtx) return;
        traceCtx.globalCompositeOperation = "destination-out";
        traceCtx.fillStyle = "rgba(0, 0, 0, 0.008)";
        traceCtx.fillRect(0, 0, width, height);
        traceCtx.globalCompositeOperation = "source-over";
        traceCtx.fillStyle = rgba(primary, 0.5);
        traceCtx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(sim.trace, 0, 0, width, height);

        ctx.lineWidth = 1;
        for (const [jx, jy, radius] of joints) {
          ctx.strokeStyle = rgba(secondary, 0.3);
          ctx.beginPath();
          ctx.arc(jx, jy, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = rgba(text, 0.4);
        ctx.beginPath();
        ctx.moveTo(cx0, cy0);
        for (const [jx, jy] of joints.slice(1)) ctx.lineTo(jx, jy);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = rgba(text, 0.9);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(primary, 0.9);
        ctx.beginPath();
        ctx.arc(cx0, cy0, 2, 0, Math.PI * 2);
        ctx.fill();

        const outer = sim.rings[sim.rings.length - 1];
        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `COURT ${sim.rings.length}  INNER YEAR ${Math.abs(outer.rate).toFixed(2)}  EPICYCLE DEPTH ${outer.radius.toFixed(3)}`,
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
      <div className={cx("sc-live", "sc-epicycle-orrery", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

EpicycleOrrery.displayName = "EpicycleOrrery";
