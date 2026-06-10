import * as React from "react";
import { cx } from "../lib/cx";

/**
 * A rich Gen X Soft Club footer: a drifting gradient rule, a brand block,
 * link columns, and a base row for legal / status copy.
 */
const SoftFooterRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => (
    <footer className={cx("sc-soft-footer", className)} ref={ref} {...props}>
      <span aria-hidden="true" className="sc-soft-footer__rule" />
      {children}
    </footer>
  )
);

SoftFooterRoot.displayName = "SoftFooter";

export const SoftFooterInner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-soft-footer__inner", className)} ref={ref} {...props} />
));

SoftFooterInner.displayName = "SoftFooterInner";

export interface SoftFooterBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: React.ReactNode;
  name?: React.ReactNode;
}

export const SoftFooterBrand = React.forwardRef<HTMLDivElement, SoftFooterBrandProps>(
  ({ children, className, kicker, name, ...props }, ref) => (
    <div className={cx("sc-soft-footer__brand", className)} ref={ref} {...props}>
      {kicker ? <strong translate="no">{kicker}</strong> : null}
      {name ? <span>{name}</span> : null}
      {children}
    </div>
  )
);

SoftFooterBrand.displayName = "SoftFooterBrand";

export const SoftFooterColumns = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-soft-footer__columns", className)} ref={ref} {...props} />
));

SoftFooterColumns.displayName = "SoftFooterColumns";

export interface SoftFooterColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const SoftFooterColumn = React.forwardRef<HTMLDivElement, SoftFooterColumnProps>(
  ({ children, className, heading, ...props }, ref) => (
    <div className={cx("sc-soft-footer__column", className)} ref={ref} {...props}>
      {heading ? <span className="sc-soft-footer__heading">{heading}</span> : null}
      {children}
    </div>
  )
);

SoftFooterColumn.displayName = "SoftFooterColumn";

export const SoftFooterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a className={cx("sc-soft-footer__link", className)} ref={ref} {...props} />
));

SoftFooterLink.displayName = "SoftFooterLink";

export const SoftFooterBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-soft-footer__base", className)} ref={ref} {...props} />
));

SoftFooterBase.displayName = "SoftFooterBase";

export const SoftFooter = Object.assign(SoftFooterRoot, {
  Base: SoftFooterBase,
  Brand: SoftFooterBrand,
  Column: SoftFooterColumn,
  Columns: SoftFooterColumns,
  Inner: SoftFooterInner,
  Link: SoftFooterLink
});
