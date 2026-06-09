import * as React from "react";
import { cx } from "../lib/cx";

export type DateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/** A styled native date field (day/month/year + the browser's date picker). */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <input className={cx("sc-input", "sc-date-input", className)} ref={ref} type="date" {...props} />
  )
);

DateInput.displayName = "DateInput";
