import * as React from "react";
import { cx } from "../lib/cx";

export interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  defaultValue?: string;
  disabled?: boolean;
  length?: number;
  onComplete?: (value: string) => void;
  onValueChange?: (value: string) => void;
  type?: "numeric" | "text";
  value?: string;
}

/**
 * A segmented one-time-code input. A single transparent text field sits over the
 * slot boxes, so native caret, paste, and backspace behaviour all work and the
 * value can never develop interior gaps. Controlled or uncontrolled.
 */
export const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      className,
      defaultValue = "",
      disabled = false,
      length = 6,
      onComplete,
      onValueChange,
      type = "numeric",
      value: valueProp,
      ...props
    },
    ref
  ) => {
    const sanitize = React.useCallback(
      (raw: string) =>
        (type === "numeric" ? raw.replace(/[^0-9]/g, "") : raw.replace(/\s/g, "")).slice(0, length),
      [length, type]
    );

    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(() => sanitize(defaultValue));
    const value = sanitize(isControlled ? valueProp : internal);
    const [focused, setFocused] = React.useState(false);

    const commit = (next: string) => {
      const clipped = sanitize(next);
      if (!isControlled) setInternal(clipped);
      onValueChange?.(clipped);
      if (clipped.length === length) onComplete?.(clipped);
    };

    const activeIndex = Math.min(value.length, length - 1);

    return (
      <div className={cx("sc-input-otp", disabled && "sc-input-otp--disabled", className)} {...props}>
        <input
          aria-label="One-time code"
          autoComplete="one-time-code"
          className="sc-input-otp__input"
          disabled={disabled}
          inputMode={type === "numeric" ? "numeric" : "text"}
          maxLength={length}
          onBlur={() => setFocused(false)}
          onChange={(event) => commit(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            const end = event.target.value.length;
            event.target.setSelectionRange(end, end);
          }}
          ref={ref}
          value={value}
        />
        <div aria-hidden="true" className="sc-input-otp__slots">
          {Array.from({ length }, (_, index) => {
            const active = focused && index === activeIndex;
            const filled = index < value.length;
            return (
              <div
                className={cx(
                  "sc-input-otp__slot",
                  active && "sc-input-otp__slot--active",
                  filled && "sc-input-otp__slot--filled"
                )}
                key={index}
              >
                {value[index] ?? ""}
                {active && value.length === index ? (
                  <span className="sc-input-otp__caret" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

InputOTP.displayName = "InputOTP";
