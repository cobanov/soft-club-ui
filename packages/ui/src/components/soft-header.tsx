import * as React from "react";
import { cx } from "../lib/cx";

export interface SoftHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Pin to the top of the viewport. */
  sticky?: boolean;
}

/**
 * A frosted Gen X Soft Club site header: subway-Helvetica brand, nav, and a
 * drifting gradient hairline along the base.
 */
const SoftHeaderRoot = React.forwardRef<HTMLElement, SoftHeaderProps>(
  ({ children, className, sticky, ...props }, ref) => (
    <header
      className={cx("sc-soft-header", sticky && "sc-soft-header--sticky", className)}
      ref={ref}
      {...props}
    >
      <div className="sc-soft-header__inner">{children}</div>
      <span aria-hidden="true" className="sc-soft-header__rule" />
    </header>
  )
);

SoftHeaderRoot.displayName = "SoftHeader";

export interface SoftHeaderBrandProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  kicker?: React.ReactNode;
}

export const SoftHeaderBrand = React.forwardRef<HTMLAnchorElement, SoftHeaderBrandProps>(
  ({ children, className, kicker, ...props }, ref) => (
    <a className={cx("sc-soft-header__brand", className)} ref={ref} {...props}>
      {kicker ? <strong translate="no">{kicker}</strong> : null}
      <span>{children}</span>
    </a>
  )
);

SoftHeaderBrand.displayName = "SoftHeaderBrand";

export const SoftHeaderNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav className={cx("sc-soft-header__nav", className)} ref={ref} {...props} />
  )
);

SoftHeaderNav.displayName = "SoftHeaderNav";

export const SoftHeaderLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a className={cx("sc-soft-header__link", className)} ref={ref} {...props} />
));

SoftHeaderLink.displayName = "SoftHeaderLink";

export const SoftHeaderActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-soft-header__actions", className)} ref={ref} {...props} />
));

SoftHeaderActions.displayName = "SoftHeaderActions";

export const SoftHeader = Object.assign(SoftHeaderRoot, {
  Actions: SoftHeaderActions,
  Brand: SoftHeaderBrand,
  Link: SoftHeaderLink,
  Nav: SoftHeaderNav
});
