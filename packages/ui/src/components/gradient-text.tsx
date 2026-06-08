import * as React from "react";
import { cx } from "../lib/cx";

export interface GradientTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  static?: boolean;
}

export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ as: Tag = "span", children, className, static: isStatic, ...props }, ref) => (
    <Tag
      className={cx("sc-gradient-text", !isStatic && "sc-gradient-text--animate", className)}
      ref={ref}
      {...props}
    >
      {children}
    </Tag>
  )
);

GradientText.displayName = "GradientText";
