import * as React from "react";
import { cx } from "../lib/cx";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea className={cx("sc-textarea", className)} ref={ref} {...props} />
  )
);

Textarea.displayName = "Textarea";
