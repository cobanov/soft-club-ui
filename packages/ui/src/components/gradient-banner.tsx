import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "../lib/cx";

export const gradientBannerVariants = cva("sc-gradient-banner", {
  defaultVariants: {
    preset: "transit",
    size: "md"
  },
  variants: {
    /**
     * Film-graded gradient washes drawn from the Gen X Soft Club palette
     * (muted greens, greys, tans, cold blue) rather than glossy Y2K chrome.
     */
    preset: {
      bleach: "sc-gradient-banner--bleach",
      crossproc: "sc-gradient-banner--crossproc",
      dusk: "sc-gradient-banner--dusk",
      smoke: "sc-gradient-banner--smoke",
      terrain: "sc-gradient-banner--terrain",
      transit: "sc-gradient-banner--transit"
    },
    size: {
      lg: "sc-gradient-banner--lg",
      md: "sc-gradient-banner--md",
      sm: "sc-gradient-banner--sm"
    }
  }
});

export interface GradientBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gradientBannerVariants> {
  /** Stop the drifting gradient animation. */
  static?: boolean;
}

const GradientBannerRoot = React.forwardRef<HTMLDivElement, GradientBannerProps>(
  ({ children, className, preset, size, static: isStatic, ...props }, ref) => (
    <div
      className={cx(
        gradientBannerVariants({ preset, size }),
        isStatic && "sc-gradient-banner--static",
        className
      )}
      ref={ref}
      {...props}
    >
      <span aria-hidden="true" className="sc-gradient-banner__sheen" />
      <span aria-hidden="true" className="sc-gradient-banner__grain" />
      <div className="sc-gradient-banner__content">{children}</div>
    </div>
  )
);

GradientBannerRoot.displayName = "GradientBanner";

export const GradientBannerEyebrow = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span className={cx("sc-gradient-banner__eyebrow", className)} ref={ref} {...props} />
));

GradientBannerEyebrow.displayName = "GradientBannerEyebrow";

export const GradientBannerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 className={cx("sc-gradient-banner__title", className)} ref={ref} {...props} />
));

GradientBannerTitle.displayName = "GradientBannerTitle";

export const GradientBannerText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-gradient-banner__text", className)} ref={ref} {...props} />
));

GradientBannerText.displayName = "GradientBannerText";

export const GradientBannerActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-gradient-banner__actions", className)} ref={ref} {...props} />
));

GradientBannerActions.displayName = "GradientBannerActions";

export const GradientBanner = Object.assign(GradientBannerRoot, {
  Actions: GradientBannerActions,
  Eyebrow: GradientBannerEyebrow,
  Text: GradientBannerText,
  Title: GradientBannerTitle
});
