import * as React from "react";
import { cx } from "../lib/cx";

export interface SignalMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: string[];
}

const defaultItems = ["SC-133G04", "GLASS PASS", "A3 ONLINE", "B2 BUS", "NOISE 04"];

export const SignalMarquee = React.forwardRef<HTMLDivElement, SignalMarqueeProps>(
  ({ className, items = defaultItems, ...props }, ref) => {
    const loop = [...items, ...items];
    return (
      <div className={cx("sc-signal-marquee", className)} ref={ref} {...props}>
        <div className="sc-signal-marquee__track">
          {loop.map((item, index) => (
            <span className="sc-signal-marquee__item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

SignalMarquee.displayName = "SignalMarquee";
