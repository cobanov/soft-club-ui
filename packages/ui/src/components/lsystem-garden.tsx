import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface LSystemGardenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Branching angle in degrees. */
  branchAngle?: number;
  label?: string;
  /** Number of specimens in the herbarium row. */
  specimens?: number;
}

interface Segment {
  depth: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface Specimen {
  /** Loop time the replay started. -1 means "stamp on the next frame". */
  born: number;
  label: string;
  segments: Segment[];
}

interface GardenSim {
  specimens: Specimen[];
}

/** Stochastic bracketed L-system expanded to turtle segments in unit space. */
const growSpecimen = (branchAngle: number, born: number, index: number): Specimen => {
  const rules: Record<string, string[]> = {
    F: ["F[+F]F[-F]F", "F[+F]F", "F[-F]F", "FF[+F][-F]"]
  };
  let sentence = "F";
  for (let i = 0; i < 4; i += 1) {
    let next = "";
    for (const char of sentence) {
      const options = rules[char];
      next += options ? options[Math.floor(Math.random() * options.length)] : char;
    }
    sentence = next;
  }

  const segments: Segment[] = [];
  const stack: { angle: number; depth: number; x: number; y: number }[] = [];
  const spread = (branchAngle * Math.PI) / 180;
  let x = 0;
  let y = 0;
  let angle = -Math.PI / 2;
  let depth = 0;
  const step = 1 / 60;
  for (const char of sentence) {
    if (char === "F") {
      const x2 = x + Math.cos(angle) * step;
      const y2 = y + Math.sin(angle) * step;
      segments.push({ depth, x1: x, x2, y1: y, y2 });
      x = x2;
      y = y2;
    } else if (char === "+") angle += spread * (0.8 + Math.random() * 0.4);
    else if (char === "-") angle -= spread * (0.8 + Math.random() * 0.4);
    else if (char === "[") {
      stack.push({ angle, depth, x, y });
      depth += 1;
    } else if (char === "]") {
      const saved = stack.pop();
      if (saved) {
        ({ angle, depth, x, y } = saved);
      }
    }
  }
  return { born, label: `SP-${200 + index * 110 + Math.floor(Math.random() * 90)}`, segments };
};

/**
 * An herbarium that is also a grammar. Each specimen is a sentence; the wind
 * you see is the same wind the equations feel. Growth replays from the root
 * every time a specimen is regrown — click one to reroll its sentence.
 */
export const LSystemGarden = React.forwardRef<HTMLDivElement, LSystemGardenProps>(
  ({ branchAngle = 24.5, className, label, onPointerDown, specimens = 3, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<GardenSim | null>(null);
    const epochRef = React.useRef(-1);
    const { epoch } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, time, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          sim = {
            specimens: Array.from({ length: specimens }, (_, index) =>
              growSpecimen(branchAngle, -1, index)
            )
          };
          simRef.current = sim;
          epochRef.current = epoch;
        }
        for (const specimen of sim.specimens) {
          if (specimen.born === -1) specimen.born = time;
        }

        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [214, 240, 224]);
        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);

        ctx.clearRect(0, 0, width, height);

        const baseline = height - 26;
        ctx.strokeStyle = rgba(secondary, 0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(12, baseline);
        ctx.lineTo(width - 12, baseline);
        for (let tick = 12; tick < width - 12; tick += 18) {
          ctx.moveTo(tick, baseline);
          ctx.lineTo(tick, baseline + 4);
        }
        ctx.stroke();

        const slot = width / specimens;
        const scale = Math.min(slot * 0.92, height * 0.82);
        ctx.lineWidth = 1;
        sim.specimens.forEach((specimen, index) => {
          const originX = slot * index + slot / 2;
          const grown = Math.min(
            specimen.segments.length,
            Math.floor((time - specimen.born) * 240)
          );
          for (let s = 0; s < grown; s += 1) {
            const seg = specimen.segments[s];
            // Deeper branches feel more of the wind.
            const sway =
              Math.sin(time * 1.1 + index * 1.7 + seg.y1 * 5) * 0.012 * (seg.depth + 1);
            const alpha = 0.28 + Math.min(0.55, (1 + seg.y1) * 0.9);
            ctx.strokeStyle = rgba(text, Math.min(0.85, alpha));
            ctx.beginPath();
            ctx.moveTo(originX + (seg.x1 + sway * seg.y1) * scale, baseline + seg.y1 * scale);
            ctx.lineTo(originX + (seg.x2 + sway * seg.y2) * scale, baseline + seg.y2 * scale);
            ctx.stroke();
          }
          ctx.fillStyle = rgba(secondary, 0.8);
          ctx.font = "8px monospace";
          ctx.fillText(specimen.label, originX - 14, baseline + 14);
          if (grown < specimen.segments.length) {
            ctx.fillStyle = rgba(primary, 0.8);
            ctx.fillText("GROWING", originX - 18, baseline - scale - 6 + scale * 0.06);
          }
        });

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `BRANCH ANGLE ${branchAngle.toFixed(1)}  GRAMMAR DEPTH 4  SPECIMENS ${specimens}`,
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

    const regrow = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const sim = simRef.current;
      const host = hostRef.current;
      if (!sim || !host) return;
      const rect = host.getBoundingClientRect();
      const index = Math.min(
        specimens - 1,
        Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * specimens))
      );
      sim.specimens[index] = growSpecimen(branchAngle, -1, index);
    };

    return (
      <div
        className={cx("sc-live", "sc-lsystem-garden", className)}
        onPointerDown={regrow}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

LSystemGarden.displayName = "LSystemGarden";
