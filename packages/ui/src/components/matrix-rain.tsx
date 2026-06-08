import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";

export interface MatrixRainProps extends React.HTMLAttributes<HTMLDivElement> {
  glyphs?: string;
  label?: string;
}

const defaultGlyphs = "01<>/\\[]{}#*+=Σ░▒▓░アカサタナソフ133G04";

export const MatrixRain = React.forwardRef<HTMLDivElement, MatrixRainProps>(
  ({ className, glyphs = defaultGlyphs, label, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const state = React.useRef({ cols: 0, drops: [] as number[] });

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, height, width }) => {
        const fontSize = 14;
        const cols = Math.max(1, Math.floor(width / fontSize));
        if (cols !== state.current.cols) {
          state.current.cols = cols;
          state.current.drops = Array.from({ length: cols }, () => Math.random() * -24);
        }

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const head = themeRgb(hostRef.current, "--sc-theme-rgb-text", [247, 255, 248]);

        ctx.fillStyle = "rgba(3, 8, 7, 0.2)";
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px var(--sc-font-mono, monospace)`;
        ctx.textBaseline = "top";

        const drops = state.current.drops;
        for (let i = 0; i < cols; i += 1) {
          const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillStyle = rgba(head, 0.95);
          ctx.fillText(glyph, x, y);
          ctx.fillStyle = rgba(primary, 0.42);
          ctx.fillText(
            glyphs[Math.floor(Math.random() * glyphs.length)],
            x,
            y - fontSize * 2
          );

          if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -12;
          drops[i] += 0.6;
        }
      },
      { fps: 22 }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <div className={cx("sc-live", "sc-matrix-rain", className)} ref={setRef} {...props}>
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

MatrixRain.displayName = "MatrixRain";
