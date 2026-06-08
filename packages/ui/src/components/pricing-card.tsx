import * as React from "react";
import { cx } from "../lib/cx";

export interface PricingCardProps extends React.HTMLAttributes<HTMLElement> {
  featured?: boolean;
}

const PricingCardRoot = React.forwardRef<HTMLElement, PricingCardProps>(
  ({ className, featured, ...props }, ref) => (
    <article
      className={cx("sc-pricing-card", featured && "sc-pricing-card--featured", className)}
      ref={ref}
      {...props}
    />
  )
);

PricingCardRoot.displayName = "PricingCard";

const Flag = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-pricing-card__flag", className)} ref={ref} {...props} />
  )
);

Flag.displayName = "PricingCard.Flag";

const Tier = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-pricing-card__tier", className)} ref={ref} {...props} />
  )
);

Tier.displayName = "PricingCard.Tier";

export interface PricingCardAmountProps extends React.HTMLAttributes<HTMLDivElement> {
  unit?: React.ReactNode;
}

const Amount = React.forwardRef<HTMLDivElement, PricingCardAmountProps>(
  ({ children, className, unit, ...props }, ref) => (
    <div className={cx("sc-pricing-card__amount", className)} ref={ref} {...props}>
      {children}
      {unit ? <span className="sc-pricing-card__unit">{unit}</span> : null}
    </div>
  )
);

Amount.displayName = "PricingCard.Amount";

const Blurb = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p className={cx("sc-pricing-card__blurb", className)} ref={ref} {...props} />
  )
);

Blurb.displayName = "PricingCard.Blurb";

const Features = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul className={cx("sc-pricing-card__features", className)} ref={ref} {...props} />
  )
);

Features.displayName = "PricingCard.Features";

const CTA = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ children, className, ...props }, ref) => (
    <a className={cx("sc-button sc-button--default sc-button--md sc-pricing-card__cta", className)} ref={ref} {...props}>
      {children}
    </a>
  )
);

CTA.displayName = "PricingCard.CTA";

export const PricingCard = Object.assign(PricingCardRoot, {
  Amount,
  Blurb,
  CTA,
  Features,
  Flag,
  Tier
});
