import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

export const communityBadgeVariants = cva("sc-community-badge", {
  defaultVariants: {
    size: "md",
    tone: "green",
    variant: "surface"
  },
  variants: {
    size: {
      md: "sc-community-badge--md",
      sm: "sc-community-badge--sm"
    },
    tone: {
      blue: "sc-community-badge--blue",
      green: "sc-community-badge--green",
      neutral: "sc-community-badge--neutral",
      warm: "sc-community-badge--warm"
    },
    variant: {
      ghost: "sc-community-badge--ghost",
      outline: "sc-community-badge--outline",
      solid: "sc-community-badge--solid",
      surface: "sc-community-badge--surface"
    }
  }
});

export interface CommunityBadgeProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title">,
    VariantProps<typeof communityBadgeVariants> {
  /** Icon image src (svg/png); inverted to sit on the dark surface. */
  icon?: string;
  /** Render any node in place of the icon image. */
  iconNode?: React.ReactNode;
  subtitle: React.ReactNode;
  title: React.ReactNode;
  /** Optional trailing slot for a stat, count, or chevron. */
  trailing?: React.ReactNode;
}

export const CommunityBadge = React.forwardRef<HTMLAnchorElement, CommunityBadgeProps>(
  ({ className, icon, iconNode, size, subtitle, title, tone, trailing, variant, ...props }, ref) => (
    <a
      className={cx(communityBadgeVariants({ size, tone, variant }), className)}
      ref={ref}
      {...props}
    >
      <span className="sc-community-badge__icon">
        {iconNode ?? (icon ? <img alt="" src={icon} /> : "SC")}
      </span>
      <span className="sc-community-badge__copy">
        <span className="sc-community-badge__title">{title}</span>
        <span className="sc-community-badge__subtitle">{subtitle}</span>
      </span>
      {trailing ? <span className="sc-community-badge__trailing">{trailing}</span> : null}
    </a>
  )
);

CommunityBadge.displayName = "CommunityBadge";
