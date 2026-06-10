import * as React from "react";
import { cx } from "../lib/cx";

/**
 * A lightweight hover/focus card. The content reveals on hover or keyboard
 * focus of the trigger via CSS, so it needs no positioning dependency.
 */
const HoverCardRoot = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span className={cx("sc-hover-card", className)} ref={ref} {...props} />
  )
);

HoverCardRoot.displayName = "HoverCard";

export const HoverCardTrigger = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, tabIndex = 0, ...props }, ref) => (
  <span className={cx("sc-hover-card__trigger", className)} ref={ref} tabIndex={tabIndex} {...props} />
));

HoverCardTrigger.displayName = "HoverCardTrigger";

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "center" | "end" | "start";
  side?: "bottom" | "top";
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ align = "start", className, side = "bottom", ...props }, ref) => (
    <div
      className={cx(
        "sc-hover-card__content",
        `sc-hover-card__content--${side}`,
        `sc-hover-card__content--${align}`,
        className
      )}
      ref={ref}
      role="tooltip"
      {...props}
    />
  )
);

HoverCardContent.displayName = "HoverCardContent";

export const HoverCard = Object.assign(HoverCardRoot, {
  Content: HoverCardContent,
  Trigger: HoverCardTrigger
});
