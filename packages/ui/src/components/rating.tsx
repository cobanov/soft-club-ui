import * as React from "react";
import { Star } from "lucide-react";
import { cx } from "../lib/cx";

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  defaultValue?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  value?: number;
}

/**
 * A star rating that supports controlled and uncontrolled use, hover preview,
 * and keyboard arrows. Read-only mode renders a static score.
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      defaultValue = 0,
      max = 5,
      onValueChange,
      readOnly = false,
      size = 18,
      value: valueProp,
      ...props
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const value = isControlled ? valueProp : internal;
    const [hover, setHover] = React.useState<number | null>(null);
    const shown = hover ?? value;

    const commit = (next: number) => {
      if (readOnly) return;
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    return (
      <div
        aria-label={readOnly ? `Rated ${value} of ${max}` : undefined}
        className={cx("sc-rating", readOnly && "sc-rating--readonly", className)}
        ref={ref}
        role={readOnly ? "img" : "radiogroup"}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const active = starValue <= shown;
          return (
            <button
              aria-checked={starValue === value}
              aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
              className={cx("sc-rating__star", active && "sc-rating__star--active")}
              disabled={readOnly}
              key={starValue}
              onClick={() => commit(starValue)}
              onMouseEnter={() => !readOnly && setHover(starValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
              role="radio"
              tabIndex={readOnly ? -1 : 0}
              type="button"
            >
              <Star
                fill={active ? "currentColor" : "none"}
                size={size}
                strokeWidth={1.6}
              />
            </button>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = "Rating";
