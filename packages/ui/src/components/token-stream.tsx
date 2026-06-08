import * as React from "react";
import { useTokenStream, type UseTokenStreamOptions } from "../hooks/use-token-stream";
import { cx } from "../lib/cx";

export interface TokenStreamProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<UseTokenStreamOptions, "enabled" | "text"> {
  animated?: boolean;
  cursor?: boolean;
  hideCaret?: boolean;
  text?: string;
  tokens?: string[];
}

const defaultTokens = ["SC", "/", "133G04", " ", "glass", " ", "bus", " ", "online"];

export const TokenStream = React.forwardRef<HTMLSpanElement, TokenStreamProps>(
  (
    {
      animated,
      className,
      cursor = true,
      hideCaret,
      loop,
      loopDelayMs,
      onComplete,
      speedMs,
      text,
      tokenize,
      tokens = defaultTokens,
      ...props
    },
    ref
  ) => {
    const streamText = text ?? tokens.join("");
    const shouldAnimate = animated ?? text !== undefined;
    const { isStreaming, output } = useTokenStream({
      enabled: shouldAnimate,
      loop,
      loopDelayMs,
      onComplete,
      speedMs,
      text: streamText,
      tokenize
    });

    return (
      <span className={cx("sc-token-stream", className)} ref={ref} {...props}>
        {shouldAnimate ? (
          <span className="sc-token-stream__token">{output}</span>
        ) : (
          tokens.map((token, index) => (
            <span className="sc-token-stream__token" key={`${token}-${index}`}>
              {token}
            </span>
          ))
        )}
        {cursor && !hideCaret && (!shouldAnimate || isStreaming) ? (
          <span aria-hidden="true" className="sc-token-stream__cursor" />
        ) : null}
      </span>
    );
  }
);

TokenStream.displayName = "TokenStream";
