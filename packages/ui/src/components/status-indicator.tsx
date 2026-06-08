import * as React from "react";
import { cx } from "../lib/cx";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  pulse?: boolean;
  tone?: "green" | "blue" | "warning" | "danger" | "neutral";
}

export const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, pulse = true, tone = "green", ...props }, ref) => (
    <span
      className={cx(
        "sc-status-indicator",
        `sc-status-indicator--${tone}`,
        pulse && "sc-status-indicator--pulse",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

StatusIndicator.displayName = "StatusIndicator";
