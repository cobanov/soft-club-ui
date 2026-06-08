import * as React from "react";
import { cx } from "../lib/cx";

export interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
}

/**
 * Phosphor glitch type. The text is duplicated into two clipped color channels
 * that jitter on a loop, giving a broken-signal CRT feel without any canvas.
 */
export const GlitchText = React.forwardRef<HTMLSpanElement, GlitchTextProps>(
  ({ className, text, ...props }, ref) => (
    <span className={cx("sc-glitch", className)} data-text={text} ref={ref} {...props}>
      <span className="sc-glitch__base">{text}</span>
    </span>
  )
);

GlitchText.displayName = "GlitchText";
