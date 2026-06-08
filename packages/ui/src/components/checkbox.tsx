import * as React from "react";
import { cx } from "../lib/cx";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: React.ReactNode;
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, description, label, ...props }, ref) => (
    <label className={cx("sc-checkbox", className)}>
      <input className="sc-checkbox__input" ref={ref} type="checkbox" {...props} />
      <span className="sc-checkbox__box" aria-hidden="true" />
      {(label || description) && (
        <span className="sc-checkbox__copy">
          {label && <span className="sc-checkbox__label">{label}</span>}
          {description && <span className="sc-checkbox__description">{description}</span>}
        </span>
      )}
    </label>
  )
);

Checkbox.displayName = "Checkbox";
