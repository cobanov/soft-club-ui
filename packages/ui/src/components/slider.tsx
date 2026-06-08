import * as React from "react";
import { cx } from "../lib/cx";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  tone?: "blue" | "green" | "warning";
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, tone = "green", ...props }, ref) => (
    <input
      className={cx("sc-slider", `sc-slider--${tone}`, className)}
      ref={ref}
      type="range"
      {...props}
    />
  )
);

Slider.displayName = "Slider";
