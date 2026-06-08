import * as React from "react";
import { cx } from "../lib/cx";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      className={cx("sc-button-group", `sc-button-group--${orientation}`, className)}
      ref={ref}
      role="group"
      {...props}
    />
  )
);

ButtonGroup.displayName = "ButtonGroup";
