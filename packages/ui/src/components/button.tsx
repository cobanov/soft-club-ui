import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        className={cx(buttonVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
