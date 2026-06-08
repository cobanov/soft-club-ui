import * as React from "react";
import { Sparkles } from "lucide-react";
import { cx } from "../lib/cx";
import { Spinner } from "./spinner";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Agent name shown in the meta row (e.g. "Synthetica"). */
  agent?: React.ReactNode;
  /** Leading icon. Defaults to a sparkle when an agent is set; pass false to hide. */
  icon?: React.ReactNode | false;
  /** Custom loading indicator inside the thinking pill; defaults to a Spinner. */
  loader?: React.ReactNode;
  /** Legacy meta string, still rendered in the meta row. */
  meta?: React.ReactNode;
  /** Thinking-pill content with a loading indicator (text or a <ToolCall />). */
  thinking?: React.ReactNode;
  tone?: "signal" | "system" | "user";
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ agent, children, className, icon, loader, meta, thinking, tone = "system", ...props }, ref) => {
    const showIcon = icon !== false && (icon != null || agent != null);
    const showMeta = Boolean(meta != null || agent != null || thinking != null || showIcon);

    return (
      <div className={cx("sc-chat-bubble", `sc-chat-bubble--${tone}`, className)} ref={ref} {...props}>
        {showMeta ? (
          <div className="sc-chat-bubble__meta">
            {showIcon ? (
              <span aria-hidden="true" className="sc-chat-bubble__icon">
                {icon ?? <Sparkles size={13} strokeWidth={1.7} />}
              </span>
            ) : null}
            {agent != null ? <span className="sc-chat-bubble__agent">{agent}</span> : null}
            {meta != null ? <span className="sc-chat-bubble__metatext">{meta}</span> : null}
            {thinking != null ? (
              <span className="sc-chat-bubble__thinking">
                {loader ?? <Spinner size="sm" />}
                <span>{thinking}</span>
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="sc-chat-bubble__body">{children}</div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";
