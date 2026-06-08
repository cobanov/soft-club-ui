import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface RadarSweepProps extends React.HTMLAttributes<HTMLDivElement> {
  blips?: { angle: number; radius: number }[];
  label?: string;
  speed?: number;
}

const defaultBlips = [
  { angle: 0.6, radius: 0.42 },
  { angle: 2.1, radius: 0.74 },
  { angle: 3.5, radius: 0.3 },
  { angle: 4.4, radius: 0.62 },
  { angle: 5.6, radius: 0.5 }
];

export const RadarSweep = React.forwardRef<HTMLDivElement, RadarSweepProps>(
  ({ blips = defaultBlips, className, label, speed = 1, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, time, width }) => {
        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const cx0 = width / 2;
        const cy0 = height / 2;
        const radius = Math.min(width, height) / 2 - 6;
        const angle = time * speed;

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = rgba(secondary, 0.22);
        ctx.lineWidth = 1;
        for (let r = 1; r <= 3; r += 1) {
          ctx.beginPath();
          ctx.arc(cx0, cy0, (radius * r) / 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(cx0 - radius, cy0);
        ctx.lineTo(cx0 + radius, cy0);
        ctx.moveTo(cx0, cy0 - radius);
        ctx.lineTo(cx0, cy0 + radius);
        ctx.stroke();

        const gradient = ctx.createConicGradient
          ? ctx.createConicGradient(angle, cx0, cy0)
          : null;
        if (gradient) {
          gradient.addColorStop(0, rgba(primary, 0.42));
          gradient.addColorStop(0.08, rgba(primary, 0));
          gradient.addColorStop(1, rgba(primary, 0));
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(cx0, cy0);
          ctx.arc(cx0, cy0, radius, angle - 0.6, angle);
          ctx.closePath();
          ctx.fill();
        }

        ctx.strokeStyle = rgba(primary, 0.85);
        ctx.beginPath();
        ctx.moveTo(cx0, cy0);
        ctx.lineTo(cx0 + Math.cos(angle) * radius, cy0 + Math.sin(angle) * radius);
        ctx.stroke();

        const twoPi = Math.PI * 2;
        for (const blip of blips) {
          const sweep = ((angle % twoPi) - blip.angle + twoPi) % twoPi;
          const intensity = Math.max(0, 1 - sweep / 1.4);
          if (intensity <= 0.02) continue;
          const bx = cx0 + Math.cos(blip.angle) * radius * blip.radius;
          const by = cy0 + Math.sin(blip.angle) * radius * blip.radius;
          ctx.fillStyle = rgba(primary, intensity);
          ctx.beginPath();
          ctx.arc(bx, by, 2.4 + intensity * 2, 0, twoPi);
          ctx.fill();
        }
      },
      { fps: 30 }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-radar-sweep", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

RadarSweep.displayName = "RadarSweep";
