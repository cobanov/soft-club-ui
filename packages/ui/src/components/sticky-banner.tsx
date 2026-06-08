import * as React from "react";
import { cx } from "../lib/cx";

export interface StickyBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const StickyBanner = React.forwardRef<HTMLDivElement, StickyBannerProps>(
  ({ action, children, className, ...props }, ref) => (
    <div className={cx("sc-sticky-banner", className)} ref={ref} {...props}>
      <div className="sc-sticky-banner__content">{children}</div>
      {action ? <div className="sc-sticky-banner__action">{action}</div> : null}
    </div>
  )
);

StickyBanner.displayName = "StickyBanner";
