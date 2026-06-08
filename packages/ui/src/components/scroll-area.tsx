import * as React from "react";
import { cx } from "../lib/cx";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  orientation?: "both" | "horizontal" | "vertical";
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, maxHeight = "16rem", orientation = "vertical", style, ...props }, ref) => (
    <div
      className={cx("sc-scroll-area", `sc-scroll-area--${orientation}`, className)}
      ref={ref}
      style={{ ...style, maxHeight }}
      {...props}
    />
  )
);

ScrollArea.displayName = "ScrollArea";
