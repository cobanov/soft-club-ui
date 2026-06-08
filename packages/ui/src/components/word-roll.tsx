import * as React from "react";
import { cx } from "../lib/cx";

export interface WordRollProps extends React.HTMLAttributes<HTMLSpanElement> {
  index?: number;
  words?: string[];
}

const defaultWords = ["glass", "metro", "trip-hop", "sony", "signal"];

export const WordRoll = React.forwardRef<HTMLSpanElement, WordRollProps>(
  ({ className, index = 0, words = defaultWords, ...props }, ref) => {
    const safeIndex = Math.abs(index) % words.length;
    return (
      <span className={cx("sc-word-roll", className)} ref={ref} {...props}>
        {words[safeIndex]}
      </span>
    );
  }
);

WordRoll.displayName = "WordRoll";
