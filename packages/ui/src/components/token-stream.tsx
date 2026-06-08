import * as React from "react";
import { cx } from "../lib/cx";

export interface TokenStreamProps extends React.HTMLAttributes<HTMLSpanElement> {
  cursor?: boolean;
  tokens?: string[];
}

const defaultTokens = ["SC", "/", "133G04", " ", "glass", " ", "bus", " ", "online"];

export const TokenStream = React.forwardRef<HTMLSpanElement, TokenStreamProps>(
  ({ className, cursor = true, tokens = defaultTokens, ...props }, ref) => (
    <span className={cx("sc-token-stream", className)} ref={ref} {...props}>
      {tokens.map((token, index) => (
        <span className="sc-token-stream__token" key={`${token}-${index}`}>
          {token}
        </span>
      ))}
      {cursor ? <span aria-hidden="true" className="sc-token-stream__cursor" /> : null}
    </span>
  )
);

TokenStream.displayName = "TokenStream";
