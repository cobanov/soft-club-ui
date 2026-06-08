import * as React from "react";
import { useAsciiField, type UseAsciiFieldOptions } from "../hooks/use-ascii-field";
import { cx } from "../lib/cx";

const defaultArt = String.raw`
  133G04     A1       B2       C3
  +--------------------------------+
  |      //// SOFT CLUB ////       |
  |    __  green glass  __         |
  |   /  \  signal bus /  \        |
  |   \__/  scan line  \__/        |
  +--------------------------------+
  D1        UPDATED        F4
`;

export interface AsciiHeroProps
  extends React.HTMLAttributes<HTMLElement>,
    UseAsciiFieldOptions {
  art?: string;
  label?: string;
  subtitle?: string;
  title?: string;
  variant?: "panel" | "bare";
}

export const AsciiHero = React.forwardRef<HTMLElement, AsciiHeroProps>(
  (
    {
      art = defaultArt,
      baseOpacity,
      charRamp,
      className,
      cols,
      colorful,
      fontFamily,
      fontSize,
      frameMs,
      label = "SC / ASCII FIELD",
      palette,
      reactive,
      rippleRadius,
      rippleStrength,
      rows,
      spotlightOpacity,
      spotlightRadius,
      subtitle = "Late-night interface surface with scanline text, cold glass, and technical framing.",
      title = "young adult glass system",
      variant = "panel",
      ...props
    },
    ref
  ) => {
    const hostRef = React.useRef<HTMLElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    useAsciiField(canvasRef, hostRef, {
      baseOpacity,
      charRamp,
      cols,
      colorful,
      fontFamily,
      fontSize,
      frameMs,
      palette,
      reactive,
      rippleRadius,
      rippleStrength,
      rows,
      spotlightOpacity,
      spotlightRadius
    });

    const setRef = (node: HTMLElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    return (
      <section
        className={cx(
          "sc-ascii-hero",
          variant === "bare" && "sc-ascii-hero--bare",
          className
        )}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-ascii-hero__canvas" ref={canvasRef} />
        {variant === "panel" ? (
          <>
            <div className="sc-ascii-hero__copy">
              <div className="sc-ascii-hero__label">{label}</div>
              <h2 className="sc-ascii-hero__title">{title}</h2>
              <p className="sc-ascii-hero__subtitle">{subtitle}</p>
            </div>
            <pre aria-hidden="true" className="sc-ascii-hero__art">
              {art.trim()}
            </pre>
          </>
        ) : null}
      </section>
    );
  }
);

AsciiHero.displayName = "AsciiHero";
