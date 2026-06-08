import * as React from "react";
import { cx } from "../lib/cx";

export interface OrbitLoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Three nested rings, each carrying a satellite dot that orbits at a different
 * speed. Pure CSS, reduced-motion aware.
 */
export const OrbitLoader = React.forwardRef<HTMLSpanElement, OrbitLoaderProps>(
  ({ className, label = "Loading", size = "md", ...props }, ref) => (
    <span
      aria-label={label}
      className={cx("sc-orbit", `sc-orbit--${size}`, className)}
      ref={ref}
      role="status"
      {...props}
    >
      <span aria-hidden="true" className="sc-orbit__ring sc-orbit__ring--1">
        <span className="sc-orbit__dot" />
      </span>
      <span aria-hidden="true" className="sc-orbit__ring sc-orbit__ring--2">
        <span className="sc-orbit__dot" />
      </span>
      <span aria-hidden="true" className="sc-orbit__ring sc-orbit__ring--3">
        <span className="sc-orbit__dot" />
      </span>
      <span aria-hidden="true" className="sc-orbit__core" />
    </span>
  )
);

OrbitLoader.displayName = "OrbitLoader";
