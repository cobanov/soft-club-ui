import * as React from "react";
import { cx } from "../lib/cx";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  meta?: string;
  tone?: "system" | "user" | "signal";
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ children, className, meta, tone = "system", ...props }, ref) => (
    <div className={cx("sc-chat-bubble", `sc-chat-bubble--${tone}`, className)} ref={ref} {...props}>
      {meta ? <div className="sc-chat-bubble__meta">{meta}</div> : null}
      <div className="sc-chat-bubble__body">{children}</div>
    </div>
  )
);

ChatBubble.displayName = "ChatBubble";
