import * as React from "react";
import { Check, X } from "lucide-react";
import { cx } from "../lib/cx";
import { Spinner } from "./spinner";

export type ToolCallStatus = "calling" | "done" | "error" | "running";

export interface ToolCallProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Override the status verb ("calling", "ran", ...). */
  label?: React.ReactNode;
  /** Custom loading indicator for active states; defaults to a Spinner. */
  loader?: React.ReactNode;
  status?: ToolCallStatus;
  /** Name of the tool that was invoked, e.g. "search_web". */
  tool: React.ReactNode;
}

const defaultLabels: Record<ToolCallStatus, string> = {
  calling: "calling",
  done: "ran",
  error: "failed",
  running: "running"
};

/**
 * The agent tool-call indicator: an animated loading pill that names the tool
 * being invoked and reflects its lifecycle (calling, running, done, error).
 * Drop it into a ChatBubble's `thinking` slot or use it standalone.
 */
export const ToolCall = React.forwardRef<HTMLSpanElement, ToolCallProps>(
  ({ className, label, loader, status = "running", tool, ...props }, ref) => {
    const loading = status === "calling" || status === "running";

    return (
      <span
        className={cx("sc-tool-call", `sc-tool-call--${status}`, className)}
        ref={ref}
        role="status"
        {...props}
      >
        <span aria-hidden="true" className="sc-tool-call__icon">
          {loading ? (
            loader ?? <Spinner size="sm" />
          ) : status === "done" ? (
            <Check size={12} strokeWidth={2} />
          ) : (
            <X size={12} strokeWidth={2} />
          )}
        </span>
        <span className="sc-tool-call__verb">{label ?? defaultLabels[status]}</span>
        <code className="sc-tool-call__name">{tool}</code>
        {loading ? (
          <span aria-hidden="true" className="sc-tool-call__dots">
            <i />
            <i />
            <i />
          </span>
        ) : null}
      </span>
    );
  }
);

ToolCall.displayName = "ToolCall";
