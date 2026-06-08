import * as React from "react";
import { cx } from "../lib/cx";

export type KbdProps = React.HTMLAttributes<HTMLElement>;

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <kbd className={cx("sc-kbd", className)} ref={ref} {...props} />
  )
);

Kbd.displayName = "Kbd";

export const KbdGroup = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, ...props }, ref) => (
    <span className={cx("sc-kbd-group", className)} ref={ref} {...props} />
  )
);

KbdGroup.displayName = "KbdGroup";
