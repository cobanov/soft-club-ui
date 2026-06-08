import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";
import { Loader } from "./loader";

export const buttonVariants = cva("sc-button", {
  variants: {
    variant: {
      default: "sc-button--default",
      secondary: "sc-button--secondary",
      outline: "sc-button--outline",
      ghost: "sc-button--ghost",
      danger: "sc-button--danger"
    },
    size: {
      sm: "sc-button--sm",
      md: "sc-button--md",
      lg: "sc-button--lg"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Show a leading loader and mark the button busy. */
  loading?: boolean;
  /** Custom loading indicator; defaults to a Loader. Ignored when asChild. */
  loader?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, children, className, disabled, loader, loading, size, variant, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    const showLoader = loading && !asChild;

    return (
      <Component
        aria-busy={loading || undefined}
        className={cx(buttonVariants({ size, variant }), loading && "sc-button--loading", className)}
        disabled={asChild ? undefined : disabled || loading}
        ref={ref}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {showLoader ? (
              <span className="sc-button__loader">
                {loader ?? <Loader preset="dots" size="sm" />}
              </span>
            ) : null}
            {children}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";
