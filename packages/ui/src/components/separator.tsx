import * as React from "react";
import { cx } from "../lib/cx";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, decorative = true, orientation = "horizontal", ...props }, ref) => (
    <div
      aria-orientation={decorative ? undefined : orientation}
      className={cx("sc-separator", `sc-separator--${orientation}`, className)}
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      {...props}
    />
  )
);

Separator.displayName = "Separator";
