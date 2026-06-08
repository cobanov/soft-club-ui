import * as React from "react";
import { cx } from "../lib/cx";

export interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  breathing?: boolean;
  glowOnHover?: boolean;
}

const GlassCardRoot = React.forwardRef<HTMLElement, GlassCardProps>(
  ({ breathing, children, className, glowOnHover = true, ...props }, ref) => (
    <article
      className={cx(
        "sc-glass-card",
        breathing && "sc-glass-card--breathing",
        glowOnHover && "sc-glass-card--glow-hover",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </article>
  )
);

GlassCardRoot.displayName = "GlassCard";

const Icon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-glass-card__icon", className)} ref={ref} {...props} />
  )
);

Icon.displayName = "GlassCard.Icon";

const Title = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 className={cx("sc-glass-card__title", className)} ref={ref} {...props} />
  )
);

Title.displayName = "GlassCard.Title";

const Body = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p className={cx("sc-glass-card__body", className)} ref={ref} {...props} />
  )
);

Body.displayName = "GlassCard.Body";

const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ children, className, ...props }, ref) => (
    <a className={cx("sc-glass-card__link", className)} ref={ref} {...props}>
      <span>{children}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  )
);

Link.displayName = "GlassCard.Link";

export const GlassCard = Object.assign(GlassCardRoot, {
  Body,
  Icon,
  Link,
  Title
});
