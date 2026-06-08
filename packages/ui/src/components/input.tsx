import * as React from "react";
import { cx } from "../lib/cx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input className={cx("sc-input", className)} ref={ref} type={type} {...props} />
  )
);

Input.displayName = "Input";
