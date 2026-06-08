import * as React from "react";
import { cx } from "../lib/cx";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  fallback?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  src?: string;
  tone?: "blue" | "green" | "warm";
}

const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ alt, className, fallback, size = "md", src, tone = "green", ...props }, ref) => {
    const [failed, setFailed] = React.useState(false);
    const showImage = Boolean(src) && !failed;

    return (
      <span
        className={cx("sc-avatar", `sc-avatar--${size}`, `sc-avatar--${tone}`, className)}
        ref={ref}
        {...props}
      >
        {showImage ? (
          <img
            alt={alt ?? ""}
            className="sc-avatar__image"
            onError={() => setFailed(true)}
            src={src}
          />
        ) : (
          <span aria-hidden={alt ? undefined : true} className="sc-avatar__fallback">
            {fallback}
          </span>
        )}
      </span>
    );
  }
);

AvatarRoot.displayName = "Avatar";

export const AvatarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-avatar-group", className)} ref={ref} {...props} />
  )
);

AvatarGroup.displayName = "AvatarGroup";

export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });
