import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  bars?: number;
  label?: string;
}

export const Waveform = React.forwardRef<HTMLDivElement, WaveformProps>(
  ({ bars = 40, className, label, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    useCanvasAnimation(canvasRef, hostRef, ({ ctx, height, time, width }) => {
      const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
      const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
      const gap = 2;
      const barWidth = Math.max(2, width / bars - gap);
      const midY = height / 2;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bars; i += 1) {
        const phase = i * 0.4;
        const amplitude =
          0.5 +
          0.34 * Math.sin(time * 2 + phase) +
          0.16 * Math.sin(time * 4.8 + phase * 1.7);
        const barHeight = Math.max(2, Math.abs(amplitude) * (height - 8));
        const x = i * (barWidth + gap);
        const blend = i / bars;
        const color: [number, number, number] = [
          primary[0] + (secondary[0] - primary[0]) * blend,
          primary[1] + (secondary[1] - primary[1]) * blend,
          primary[2] + (secondary[2] - primary[2]) * blend
        ];
        const gradient = ctx.createLinearGradient(0, midY - barHeight / 2, 0, midY + barHeight / 2);
        gradient.addColorStop(0, rgba(color, 0.9));
        gradient.addColorStop(0.5, rgba(color, 0.55));
        gradient.addColorStop(1, rgba(color, 0.9));
        ctx.fillStyle = gradient;
        ctx.fillRect(x, midY - barHeight / 2, barWidth, barHeight);
      }
    });

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-waveform", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

Waveform.displayName = "Waveform";
