import * as React from "react";
import { useTypewriter, type UseTypewriterOptions } from "../hooks/use-typewriter";
import { cx } from "../lib/cx";

export interface RotatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix">,
    UseTypewriterOptions {
  cursor?: string;
  hideCursor?: boolean;
  renderWord?: (word: string, index: number) => React.ReactNode;
}

export const Rotator = React.forwardRef<HTMLSpanElement, RotatorProps>(
  (
    {
      className,
      cursor,
      deleteMs,
      hideCursor,
      holdMs,
      loop,
      onWordReached,
      renderWord,
      typeMs,
      words,
      ...props
    },
    ref
  ) => {
    const { index, word } = useTypewriter({
      deleteMs,
      holdMs,
      loop,
      onWordReached,
      typeMs,
      words
    });

    return (
      <span className={cx("sc-rotator", className)} ref={ref} {...props}>
        {renderWord ? renderWord(word, index) : word}
        {!hideCursor ? (
          <span
            aria-hidden="true"
            className={cx("sc-rotator__cursor", cursor === undefined && "sc-rotator__cursor--block")}
          >
            {cursor}
          </span>
        ) : null}
      </span>
    );
  }
);

Rotator.displayName = "Rotator";
