import * as React from "react";
import { cx } from "../lib/cx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  tone?: "blue" | "danger" | "green" | "warning";
  value?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, max = 100, tone = "green", value = 0, ...props }, ref) => {
    const clamped = Math.min(max, Math.max(0, value));
    const pct = max > 0 ? (clamped / max) * 100 : 0;

    return (
      <div
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={clamped}
        className={cx("sc-progress", `sc-progress--${tone}`, className)}
        ref={ref}
        role="progressbar"
        {...props}
      >
        <span className="sc-progress__bar" style={{ width: `${pct}%` }} />
      </div>
    );
  }
);

Progress.displayName = "Progress";
