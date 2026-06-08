import * as React from "react";
import { cx } from "../lib/cx";

export interface CommunityBadgeProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  icon?: string;
  iconNode?: React.ReactNode;
  subtitle: React.ReactNode;
  title: React.ReactNode;
}

export const CommunityBadge = React.forwardRef<HTMLAnchorElement, CommunityBadgeProps>(
  ({ className, icon, iconNode, subtitle, title, ...props }, ref) => (
    <a className={cx("sc-community-badge", className)} ref={ref} {...props}>
      <span className="sc-community-badge__icon">
        {iconNode ?? (icon ? <img alt="" src={icon} /> : "SC")}
      </span>
      <span className="sc-community-badge__copy">
        <span className="sc-community-badge__title">{title}</span>
        <span className="sc-community-badge__subtitle">{subtitle}</span>
      </span>
    </a>
  )
);

CommunityBadge.displayName = "CommunityBadge";
