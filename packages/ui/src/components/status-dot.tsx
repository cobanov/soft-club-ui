import * as React from "react";
import { cx } from "../lib/cx";

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  static?: boolean;
  tone?: "blue" | "danger" | "green" | "neutral" | "warning";
}

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, color, static: isStatic, style, tone = "green", ...props }, ref) => (
    <span
      aria-hidden="true"
      className={cx("sc-status-dot", `sc-status-dot--${tone}`, !isStatic && "sc-status-dot--pulse", className)}
      ref={ref}
      style={color ? { ...style, background: color, color } : style}
      {...props}
    />
  )
);

StatusDot.displayName = "StatusDot";
