import * as React from "react";
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

export interface AsciiHeroProps extends React.HTMLAttributes<HTMLElement> {
  art?: string;
  label?: string;
  subtitle?: string;
  title?: string;
}

export const AsciiHero = React.forwardRef<HTMLElement, AsciiHeroProps>(
  (
    {
      art = defaultArt,
      className,
      label = "SC / ASCII FIELD",
      subtitle = "Late-night interface surface with scanline text, cold glass, and technical framing.",
      title = "young adult glass system",
      ...props
    },
    ref
  ) => (
    <section className={cx("sc-ascii-hero", className)} ref={ref} {...props}>
      <div className="sc-ascii-hero__copy">
        <div className="sc-ascii-hero__label">{label}</div>
        <h2 className="sc-ascii-hero__title">{title}</h2>
        <p className="sc-ascii-hero__subtitle">{subtitle}</p>
      </div>
      <pre aria-hidden="true" className="sc-ascii-hero__art">
        {art.trim()}
      </pre>
    </section>
  )
);

AsciiHero.displayName = "AsciiHero";
