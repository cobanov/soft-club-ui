import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface ParticleFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  label?: string;
  linkDistance?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const ParticleField = React.forwardRef<HTMLDivElement, ParticleFieldProps>(
  ({ className, count = 56, label, linkDistance = 118, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ particles: [] as Particle[], seeded: false, w: 0, h: 0 });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, pointer, width }) => {
        const st = state.current;
        if (!st.seeded || st.w !== width || st.h !== height) {
          st.w = width;
          st.h = height;
          st.seeded = true;
          st.particles = Array.from({ length: count }, () => ({
            vx: (Math.random() - 0.5) * 26,
            vy: (Math.random() - 0.5) * 26,
            x: Math.random() * width,
            y: Math.random() * height
          }));
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);
        const particles = st.particles;

        ctx.clearRect(0, 0, width, height);

        for (const particle of particles) {
          if (pointer.inside) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < 130) {
              particle.vx += (dx / distance) * 22 * 0.016;
              particle.vy += (dy / distance) * 22 * 0.016;
            }
          }
          particle.x += particle.vx * 0.016;
          particle.y += particle.vy * 0.016;
          particle.vx *= 0.992;
          particle.vy *= 0.992;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
        }

        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < linkDistance) {
              ctx.strokeStyle = rgba(secondary, (1 - distance / linkDistance) * 0.34);
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        for (const particle of particles) {
          ctx.fillStyle = rgba(primary, 0.85);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      { reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-particle-field", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

ParticleField.displayName = "ParticleField";
