import * as React from "react";
import { cx } from "../lib/cx";

export const GlassPanel = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <article className={cx("sc-glass-panel", className)} ref={ref} {...props} />
));

GlassPanel.displayName = "GlassPanel";

export const GlassPanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-glass-panel__header", className)} ref={ref} {...props} />
));

GlassPanelHeader.displayName = "GlassPanelHeader";

export const GlassPanelKicker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-glass-panel__kicker", className)} ref={ref} {...props} />
));

GlassPanelKicker.displayName = "GlassPanelKicker";

export const GlassPanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 className={cx("sc-glass-panel__title", className)} ref={ref} {...props} />
));

GlassPanelTitle.displayName = "GlassPanelTitle";

export const GlassPanelBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-glass-panel__body", className)} ref={ref} {...props} />
));

GlassPanelBody.displayName = "GlassPanelBody";
