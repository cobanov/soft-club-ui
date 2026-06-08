import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

export const badgeVariants = cva("sc-badge", {
  variants: {
    variant: {
      default: "sc-badge--default",
      green: "sc-badge--green",
      warning: "sc-badge--warning",
      danger: "sc-badge--danger",
      neutral: "sc-badge--neutral"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span className={cx(badgeVariants({ variant }), className)} ref={ref} {...props} />
  )
);

Badge.displayName = "Badge";
