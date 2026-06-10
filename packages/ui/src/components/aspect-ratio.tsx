import * as React from "react";
import { cx } from "../lib/cx";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width-to-height ratio, e.g. 16 / 9. Defaults to 1. */
  ratio?: number;
}

/** Constrains its content to a fixed width-to-height ratio. */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, style, ...props }, ref) => (
    <div
      className={cx("sc-aspect-ratio", className)}
      ref={ref}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  )
);

AspectRatio.displayName = "AspectRatio";
