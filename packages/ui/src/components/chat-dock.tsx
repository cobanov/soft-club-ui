import * as React from "react";
import { cx } from "../lib/cx";

export interface ChatDockProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const ChatDock = React.forwardRef<HTMLDivElement, ChatDockProps>(
  ({ children, className, label = "SC / MESSAGE BUS", ...props }, ref) => (
    <div className={cx("sc-chat-dock", className)} ref={ref} {...props}>
      <div className="sc-chat-dock__header">{label}</div>
      <div className="sc-chat-dock__body">{children}</div>
    </div>
  )
);

ChatDock.displayName = "ChatDock";
