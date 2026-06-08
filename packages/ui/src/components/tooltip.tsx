import * as React from "react";
import { cx } from "../lib/cx";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  content: React.ReactNode;
  side?: "top" | "bottom";
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  ({ children, className, content, side = "top", ...props }, ref) => (
    <span className={cx("sc-tooltip", `sc-tooltip--${side}`, className)} ref={ref} {...props}>
      {children}
      <span className="sc-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  )
);

Tooltip.displayName = "Tooltip";
