import * as React from "react";
import { cx } from "../lib/cx";

const TimelineRoot = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol className={cx("sc-timeline", className)} ref={ref} {...props} />
  )
);

TimelineRoot.displayName = "Timeline";

export interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Tone of the node marker. */
  status?: "active" | "default" | "done";
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ children, className, status = "default", ...props }, ref) => (
    <li className={cx("sc-timeline__item", `sc-timeline__item--${status}`, className)} ref={ref} {...props}>
      <span aria-hidden="true" className="sc-timeline__node" />
      <div className="sc-timeline__content">{children}</div>
    </li>
  )
);

TimelineItem.displayName = "TimelineItem";

export const TimelineTime = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span className={cx("sc-timeline__time", className)} ref={ref} {...props} />
  )
);

TimelineTime.displayName = "TimelineTime";

export const TimelineTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p className={cx("sc-timeline__title", className)} ref={ref} {...props} />
  )
);

TimelineTitle.displayName = "TimelineTitle";

export const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-timeline__description", className)} ref={ref} {...props} />
));

TimelineDescription.displayName = "TimelineDescription";

export const Timeline = Object.assign(TimelineRoot, {
  Description: TimelineDescription,
  Item: TimelineItem,
  Time: TimelineTime,
  Title: TimelineTitle
});
