import * as React from "react";
import { cx } from "../lib/cx";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, label = "Loading", size = "md", ...props }, ref) => (
    <span
      aria-label={label}
      className={cx("sc-spinner", `sc-spinner--${size}`, className)}
      ref={ref}
      role="status"
      {...props}
    >
      <span aria-hidden="true" className="sc-spinner__ring" />
    </span>
  )
);

Spinner.displayName = "Spinner";
