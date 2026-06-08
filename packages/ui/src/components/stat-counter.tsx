import * as React from "react";
import { cx } from "../lib/cx";

export interface StatCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefix?: string;
  suffix?: string;
  value: number | string;
}

export const StatCounter = React.forwardRef<HTMLSpanElement, StatCounterProps>(
  ({ className, prefix = "", suffix = "", value, ...props }, ref) => (
    <span className={cx("sc-stat-counter", className)} ref={ref} {...props}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
);

StatCounter.displayName = "StatCounter";
