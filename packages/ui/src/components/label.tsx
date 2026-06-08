import * as React from "react";
import { cx } from "../lib/cx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, required, ...props }, ref) => (
    <label className={cx("sc-label", className)} ref={ref} {...props}>
      {children}
      {required ? (
        <span aria-hidden="true" className="sc-label__required">
          *
        </span>
      ) : null}
    </label>
  )
);

Label.displayName = "Label";
