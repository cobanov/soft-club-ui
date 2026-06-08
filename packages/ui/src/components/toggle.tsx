import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

export const toggleVariants = cva("sc-toggle", {
  defaultVariants: {
    size: "md",
    variant: "default"
  },
  variants: {
    size: {
      lg: "sc-toggle--lg",
      md: "sc-toggle--md",
      sm: "sc-toggle--sm"
    },
    variant: {
      default: "sc-toggle--default",
      outline: "sc-toggle--outline"
    }
  }
});

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  pressed?: boolean;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, defaultPressed, onClick, onPressedChange, pressed, size, variant, ...props },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultPressed ?? false);
    const isPressed = pressed ?? internal;

    return (
      <button
        aria-pressed={isPressed}
        className={cx(toggleVariants({ size, variant }), className)}
        data-state={isPressed ? "on" : "off"}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          const next = !isPressed;
          if (pressed === undefined) setInternal(next);
          onPressedChange?.(next);
        }}
        ref={ref}
        type="button"
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";
