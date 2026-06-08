import * as React from "react";
import { cx } from "../lib/cx";

export type LogoMarqueeItem =
  | { alt?: string; kind: "img"; src: string }
  | { key?: string; kind: "node"; node: React.ReactNode };

export interface LogoMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  fade?: boolean;
  gap?: number;
  logos?: LogoMarqueeItem[];
  pauseOnHover?: boolean;
  speed?: number;
}

const defaultLogos: LogoMarqueeItem[] = [
  { kind: "node", node: "A24", key: "a24" },
  { kind: "node", node: "NOVA", key: "nova" },
  { kind: "node", node: "K7", key: "k7" },
  { kind: "node", node: "ROOM 33", key: "room33" },
  { kind: "node", node: "VOID FM", key: "voidfm" }
];

export const LogoMarquee = React.forwardRef<HTMLDivElement, LogoMarqueeProps>(
  (
    {
      className,
      fade = true,
      gap = 48,
      logos = defaultLogos,
      pauseOnHover,
      speed = 32,
      style,
      ...props
    },
    ref
  ) => {
    const cssVars = {
      ...style,
      "--sc-logo-marquee-gap": `${gap}px`,
      "--sc-logo-marquee-speed": `${speed}s`
    } as React.CSSProperties;

    const renderItem = (item: LogoMarqueeItem, index: number) => {
      const key = item.kind === "img" ? item.src : item.key ?? index;

      return (
        <span className="sc-logo-marquee__item" key={`${item.kind}-${key}-${index}`}>
          {item.kind === "img" ? <img alt={item.alt ?? ""} src={item.src} /> : item.node}
        </span>
      );
    };

    return (
      <div
        aria-label="Logo marquee"
        className={cx(
          "sc-logo-marquee",
          fade && "sc-logo-marquee--fade",
          pauseOnHover && "sc-logo-marquee--pause-on-hover",
          className
        )}
        ref={ref}
        style={cssVars}
        {...props}
      >
        <div className="sc-logo-marquee__track">
          {logos.map(renderItem)}
          {logos.map((item, index) => renderItem(item, index + logos.length))}
        </div>
      </div>
    );
  }
);

LogoMarquee.displayName = "LogoMarquee";
