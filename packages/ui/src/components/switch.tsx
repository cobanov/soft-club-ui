import * as React from "react";
import { cx } from "../lib/cx";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: React.ReactNode;
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, description, label, ...props }, ref) => (
    <label className={cx("sc-switch", className)}>
      <input className="sc-switch__input" ref={ref} role="switch" type="checkbox" {...props} />
      <span className="sc-switch__track" aria-hidden="true">
        <span className="sc-switch__thumb" />
      </span>
      {(label || description) && (
        <span className="sc-switch__copy">
          {label && <span className="sc-switch__label">{label}</span>}
          {description && <span className="sc-switch__description">{description}</span>}
        </span>
      )}
    </label>
  )
);

Switch.displayName = "Switch";
