import * as React from "react";
import { cx } from "../lib/cx";

interface RadioGroupContextValue {
  name?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, className, defaultValue, name, onValueChange, value, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultValue);
    const generatedName = React.useId();
    const current = value ?? internal;

    const handleChange = React.useCallback(
      (next: string) => {
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [onValueChange, value]
    );

    return (
      <RadioGroupContext.Provider
        value={{ name: name ?? generatedName, onValueChange: handleChange, value: current }}
      >
        <div className={cx("sc-radio-group", className)} ref={ref} role="radiogroup" {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroupRoot.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  description?: React.ReactNode;
  label?: React.ReactNode;
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, description, label, value, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext);

    return (
      <label className={cx("sc-radio", className)}>
        <input
          checked={ctx.value === value}
          className="sc-radio__input"
          name={ctx.name}
          onChange={() => ctx.onValueChange?.(value)}
          ref={ref}
          type="radio"
          value={value}
          {...props}
        />
        <span aria-hidden="true" className="sc-radio__dot" />
        {(label || description) && (
          <span className="sc-radio__copy">
            {label && <span className="sc-radio__label">{label}</span>}
            {description && <span className="sc-radio__description">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export const RadioGroup = Object.assign(RadioGroupRoot, { Item: RadioGroupItem });
