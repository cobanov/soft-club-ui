import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cx } from "../lib/cx";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "defaultValue" | "onChange" | "type" | "value"
  > {
  defaultValue?: number;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  value?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A numeric field flanked by step controls. Supports controlled and
 * uncontrolled use and clamps to the given min/max on every change.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      defaultValue = 0,
      disabled,
      max = Number.POSITIVE_INFINITY,
      min = Number.NEGATIVE_INFINITY,
      onValueChange,
      step = 1,
      value: valueProp,
      ...props
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const value = isControlled ? valueProp : internal;

    const commit = (next: number) => {
      const clamped = clamp(next, min, max);
      if (!isControlled) setInternal(clamped);
      onValueChange?.(clamped);
    };

    return (
      <div className={cx("sc-number-input", disabled && "sc-number-input--disabled", className)}>
        <button
          aria-label="Decrement"
          className="sc-number-input__step"
          disabled={disabled || value <= min}
          onClick={() => commit(value - step)}
          tabIndex={-1}
          type="button"
        >
          <Minus size={14} strokeWidth={1.9} />
        </button>
        <input
          className="sc-number-input__field"
          disabled={disabled}
          inputMode="numeric"
          max={Number.isFinite(max) ? max : undefined}
          min={Number.isFinite(min) ? min : undefined}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isNaN(next)) commit(next);
          }}
          ref={ref}
          step={step}
          type="number"
          value={value}
          {...props}
        />
        <button
          aria-label="Increment"
          className="sc-number-input__step"
          disabled={disabled || value >= max}
          onClick={() => commit(value + step)}
          tabIndex={-1}
          type="button"
        >
          <Plus size={14} strokeWidth={1.9} />
        </button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
