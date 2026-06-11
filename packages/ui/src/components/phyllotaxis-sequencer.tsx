import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface PhyllotaxisSequencerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** Number of seeds on the Vogel spiral. */
  seeds?: number;
  /** Playhead revolutions per second. */
  speed?: number;
}

const GOLDEN_ANGLE = (137.50776405 * Math.PI) / 180;

interface SequencerSim {
  envelope: Float32Array;
  muted: Set<number>;
}

/**
 * A Vogel spiral asked to write music: seeds are steps, the radar arm is the
 * playhead, and the golden angle keeps the melody from ever quite repeating.
 * Click a seed to mute that step; the arm passes over it in silence.
 */
export const PhyllotaxisSequencer = React.forwardRef<HTMLDivElement, PhyllotaxisSequencerProps>(
  ({ className, label, onPointerDown, seeds = 200, speed = 0.1, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<SequencerSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, time, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          sim = { envelope: new Float32Array(seeds), muted: new Set() };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        const cx0 = width / 2;
        const cy0 = height / 2;
        const maxRadius = Math.min(width, height) * 0.44;
        const arm = (time * speed * Math.PI * 2) % (Math.PI * 2);

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = rgba(secondary, 0.2);
        ctx.lineWidth = 1;
        for (let ring = 1; ring <= 4; ring += 1) {
          ctx.beginPath();
          ctx.arc(cx0, cy0, (maxRadius * ring) / 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        let sounding = 0;
        for (let i = 0; i < seeds; i += 1) {
          const angle = i * GOLDEN_ANGLE;
          const radius = maxRadius * Math.sqrt((i + 1) / seeds);
          const x = cx0 + Math.cos(angle) * radius;
          const y = cy0 + Math.sin(angle) * radius;
          const muted = sim.muted.has(i);

          // Light the seed as the arm sweeps across its angle.
          const twoPi = Math.PI * 2;
          const sweep = ((arm - (angle % twoPi)) % twoPi + twoPi) % twoPi;
          if (sweep < 0.05 && !muted) sim.envelope[i] = 1;
          sim.envelope[i] = Math.max(0, sim.envelope[i] - dt * 1.6);
          const env = sim.envelope[i];
          if (env > 0.45) sounding += 1;

          const planet = i % 13 === 0;
          if (muted) {
            ctx.strokeStyle = rgba(text, 0.28);
            ctx.beginPath();
            ctx.arc(x, y, planet ? 3.4 : 2, 0, twoPi);
            ctx.stroke();
          } else {
            ctx.fillStyle = env > 0 ? rgba(primary, 0.3 + env * 0.7) : rgba(text, 0.3);
            ctx.beginPath();
            ctx.arc(x, y, (planet ? 3.2 : 1.7) + env * 2.6, 0, twoPi);
            ctx.fill();
          }
        }

        ctx.strokeStyle = rgba(primary, 0.8);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx0 - Math.cos(arm) * maxRadius * 0.2, cy0 - Math.sin(arm) * maxRadius * 0.2);
        ctx.lineTo(cx0 + Math.cos(arm) * maxRadius, cy0 + Math.sin(arm) * maxRadius);
        ctx.stroke();

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `ANGLE 137.507  SEEDS ${seeds}  MUTED ${sim.muted.size}  SOUNDING ${sounding}`,
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

    const toggleSeed = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const sim = simRef.current;
      const host = hostRef.current;
      if (!sim || !host) return;
      const rect = host.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const cx0 = rect.width / 2;
      const cy0 = rect.height / 2;
      const maxRadius = Math.min(rect.width, rect.height) * 0.44;
      let bestIndex = -1;
      let bestDist = 12 * 12;
      for (let i = 0; i < seeds; i += 1) {
        const angle = i * GOLDEN_ANGLE;
        const radius = maxRadius * Math.sqrt((i + 1) / seeds);
        const dx = cx0 + Math.cos(angle) * radius - px;
        const dy = cy0 + Math.sin(angle) * radius - py;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }
      if (bestIndex >= 0) {
        if (sim.muted.has(bestIndex)) sim.muted.delete(bestIndex);
        else sim.muted.add(bestIndex);
      }
    };

    return (
      <div
        className={cx("sc-live", "sc-phyllotaxis-sequencer", className)}
        onPointerDown={toggleSeed}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

PhyllotaxisSequencer.displayName = "PhyllotaxisSequencer";
