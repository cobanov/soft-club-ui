import * as React from "react";
import { X } from "lucide-react";
import { cx } from "../lib/cx";

export interface AnnouncementBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trailing action (a link or button). */
  action?: React.ReactNode;
  defaultOpen?: boolean;
  dismissible?: boolean;
  /** Leading marker/tag text. */
  label?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Gradient wash drawn from the Gen X Soft Club palette. */
  preset?: "crossproc" | "dusk" | "smoke" | "terrain" | "transit";
}

/**
 * A thin announcement strip with a drifting film-graded gradient, an optional
 * tag, action, and a dismiss control.
 */
export const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  (
    {
      action,
      children,
      className,
      defaultOpen = true,
      dismissible = true,
      label,
      onOpenChange,
      open: openProp,
      preset = "transit",
      ...props
    },
    ref
  ) => {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp! : internalOpen;

    if (!open) return null;

    const dismiss = () => {
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    };

    return (
      <div
        className={cx("sc-announcement-bar", `sc-announcement-bar--${preset}`, className)}
        ref={ref}
        role="region"
        {...props}
      >
        <span aria-hidden="true" className="sc-announcement-bar__sweep" />
        <div className="sc-announcement-bar__content">
          {label ? <span className="sc-announcement-bar__label">{label}</span> : null}
          <span className="sc-announcement-bar__message">{children}</span>
          {action ? <span className="sc-announcement-bar__action">{action}</span> : null}
        </div>
        {dismissible ? (
          <button
            aria-label="Dismiss announcement"
            className="sc-announcement-bar__dismiss"
            onClick={dismiss}
            type="button"
          >
            <X aria-hidden="true" size={14} strokeWidth={1.8} />
          </button>
        ) : null}
      </div>
    );
  }
);

AnnouncementBar.displayName = "AnnouncementBar";
