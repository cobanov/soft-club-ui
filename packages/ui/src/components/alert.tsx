import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

export const alertVariants = cva("sc-alert", {
  defaultVariants: {
    variant: "default"
  },
  variants: {
    variant: {
      danger: "sc-alert--danger",
      default: "sc-alert--default",
      green: "sc-alert--green",
      info: "sc-alert--info",
      warning: "sc-alert--warning"
    }
  }
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, className, icon, variant, ...props }, ref) => (
    <div className={cx(alertVariants({ variant }), className)} ref={ref} role="alert" {...props}>
      {icon ? (
        <span aria-hidden="true" className="sc-alert__icon">
          {icon}
        </span>
      ) : null}
      <div className="sc-alert__body">{children}</div>
    </div>
  )
);

AlertRoot.displayName = "Alert";

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-alert__title", className)} ref={ref} {...props} />
));

AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-alert__description", className)} ref={ref} {...props} />
));

AlertDescription.displayName = "AlertDescription";

export const Alert = Object.assign(AlertRoot, {
  Description: AlertDescription,
  Title: AlertTitle
});
