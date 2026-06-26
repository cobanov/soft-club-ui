import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

const RAMP = ".,-~:;=!*#$@";

export interface AsciiDonutProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  cell?: number;
  spin?: number;
}

export const AsciiDonut = React.forwardRef<HTMLDivElement, AsciiDonutProps>(
  ({ className, label, cell = 9, spin = 1, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ a: 0, b: 0, cols: 0, rows: 0, w: 0, h: 0, z: new Float32Array(0) });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, width, height, dt, pointer }) => {
        const st = state.current;
        const cellH = cell * 1.15;
        const cols = Math.max(1, Math.floor(width / cell));
        const rows = Math.max(1, Math.floor(height / cellH));
        if (st.w !== width || st.h !== height || st.cols !== cols || st.rows !== rows) {
          st.w = width;
          st.h = height;
          st.cols = cols;
          st.rows = rows;
          st.z = new Float32Array(cols * rows);
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const text = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        st.a += dt * 0.9 * spin;
        st.b += dt * 0.55 * spin;

        // Light direction: defaults near (0,1,-1); steers toward pointer when inside.
        let lx = 0;
        let ly = 1;
        let lz = -1;
        let tiltX = 0.62; // flatten toward edge-on
        if (pointer.inside) {
          const px = (pointer.x / width) * 2 - 1;
          const py = (pointer.y / height) * 2 - 1;
          lx = px;
          ly = -py;
          lz = -0.9;
          tiltX += -py * 0.28;
        }
        const lmag = Math.hypot(lx, ly, lz) || 1;
        lx /= lmag;
        ly /= lmag;
        lz /= lmag;

        const cA = Math.cos(st.a);
        const sA = Math.sin(st.a);
        const cB = Math.cos(st.b);
        const sB = Math.sin(st.b);
        const cT = Math.cos(tiltX);
        const sT = Math.sin(tiltX);

        const r1 = 1;
        const r2 = 2;
        const K2 = 5;
        const K1 = (width * 0.7) / (cell * (K2 / (r1 + r2)) * 2);
        const cx0 = cols / 2;
        const cy0 = rows / 2;

        const z = st.z;
        z.fill(0);
        ctx.clearRect(0, 0, width, height);
        ctx.font = `${cell}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        const glyph: number[] = new Array(cols * rows).fill(-1);

        for (let theta = 0; theta < Math.PI * 2; theta += 0.07) {
          const ct = Math.cos(theta);
          const stt = Math.sin(theta);
          for (let phi = 0; phi < Math.PI * 2; phi += 0.02) {
            const cp = Math.cos(phi);
            const sp = Math.sin(phi);
            const circleX = r2 + r1 * ct;
            // Spin around z (B), then around x (A), then a static tilt to flatten.
            const ox = circleX * (cB * cp + sA * sB * sp) - r1 * stt * cA * sB;
            const oy = circleX * (sB * cp - sA * cB * sp) + r1 * stt * cA * cB;
            const oz = cA * circleX * sp + r1 * stt * sA;
            const y2 = oy * cT - oz * sT;
            const z2 = oy * sT + oz * cT + (r2 + 3);
            const ooz = 1 / z2;
            const xp = Math.floor(cx0 + K1 * ooz * ox);
            const yp = Math.floor(cy0 - K1 * ooz * y2 * 0.55);
            if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;
            const idx = xp + yp * cols;

            // Surface normal (same rotations as the point).
            const nxr = ct * (cB * cp + sA * sB * sp) - stt * cA * sB;
            const nyr = ct * (sB * cp - sA * cB * sp) + stt * cA * cB;
            const nzr = cA * ct * sp + stt * sA;
            const ny2 = nyr * cT - nzr * sT;
            const nz2 = nyr * sT + nzr * cT;
            const lum = nxr * lx + ny2 * ly + nz2 * lz;
            if (lum <= 0) continue;
            if (ooz > (z[idx] ?? 0)) {
              z[idx] = ooz;
              glyph[idx] = Math.min(RAMP.length - 1, Math.floor(lum * 9));
            }
          }
        }

        for (let row = 0; row < rows; row += 1) {
          for (let col = 0; col < cols; col += 1) {
            const idx = col + row * cols;
            const gi = glyph[idx] ?? -1;
            if (gi < 0) continue;
            const t = gi / (RAMP.length - 1);
            const r = primary[0] + (text[0] - primary[0]) * t;
            const g = primary[1] + (text[1] - primary[1]) * t;
            const b = primary[2] + (text[2] - primary[2]) * t;
            ctx.fillStyle = rgba([r, g, b], 0.5 + t * 0.5);
            ctx.fillText(RAMP.charAt(gi), col * cell, row * cellH);
          }
        }
      },
      { fps: 30, reactive: true }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-ascii-donut", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

AsciiDonut.displayName = "AsciiDonut";
