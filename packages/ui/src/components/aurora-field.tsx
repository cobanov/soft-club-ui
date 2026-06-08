import * as React from "react";
import { cx } from "../lib/cx";

export interface AuroraFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
}

export const AuroraField = React.forwardRef<HTMLDivElement, AuroraFieldProps>(
  ({ className, intensity = "medium", ...props }, ref) => (
    <div
      aria-hidden="true"
      className={cx("sc-aurora-field", `sc-aurora-field--${intensity}`, className)}
      ref={ref}
      {...props}
    />
  )
);

AuroraField.displayName = "AuroraField";
