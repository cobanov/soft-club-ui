import * as React from "react";
import { cx } from "../lib/cx";

export interface AsciiSnapshotProps extends React.HTMLAttributes<HTMLElement> {
  /** Draw the four registration corner brackets around the card. */
  framed?: boolean;
}

/**
 * A shareable snapshot card framed by registration corner marks: an ASCII (or
 * any live) media panel up top, a serif-scaled headline with an optional corner
 * action, descriptive copy, and a footer that pairs a range toggle with share
 * actions. Compose the media with <AsciiImage> for the animated code-portrait look.
 */
const AsciiSnapshotRoot = React.forwardRef<HTMLElement, AsciiSnapshotProps>(
  ({ children, className, framed = true, ...props }, ref) => (
    <article className={cx("sc-ascii-snapshot", className)} ref={ref} {...props}>
      {framed ? (
        <span aria-hidden="true" className="sc-ascii-snapshot__frame">
          <span className="sc-ascii-snapshot__corner sc-ascii-snapshot__corner--tl" />
          <span className="sc-ascii-snapshot__corner sc-ascii-snapshot__corner--tr" />
          <span className="sc-ascii-snapshot__corner sc-ascii-snapshot__corner--bl" />
          <span className="sc-ascii-snapshot__corner sc-ascii-snapshot__corner--br" />
        </span>
      ) : null}
      {children}
    </article>
  )
);

AsciiSnapshotRoot.displayName = "AsciiSnapshot";

export const AsciiSnapshotMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-ascii-snapshot__media", className)} ref={ref} {...props} />
));

AsciiSnapshotMedia.displayName = "AsciiSnapshotMedia";

export const AsciiSnapshotBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-ascii-snapshot__body", className)} ref={ref} {...props} />
));

AsciiSnapshotBody.displayName = "AsciiSnapshotBody";

export interface AsciiSnapshotHeadlineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Right-aligned slot, typically a small square icon button. */
  action?: React.ReactNode;
}

export const AsciiSnapshotHeadline = React.forwardRef<HTMLDivElement, AsciiSnapshotHeadlineProps>(
  ({ action, children, className, ...props }, ref) => (
    <div className={cx("sc-ascii-snapshot__headline", className)} ref={ref} {...props}>
      <h3 className="sc-ascii-snapshot__title">{children}</h3>
      {action ? <div className="sc-ascii-snapshot__action">{action}</div> : null}
    </div>
  )
);

AsciiSnapshotHeadline.displayName = "AsciiSnapshotHeadline";

export const AsciiSnapshotDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-ascii-snapshot__description", className)} ref={ref} {...props} />
));

AsciiSnapshotDescription.displayName = "AsciiSnapshotDescription";

export const AsciiSnapshotFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-ascii-snapshot__footer", className)} ref={ref} {...props} />
));

AsciiSnapshotFooter.displayName = "AsciiSnapshotFooter";

export const AsciiSnapshotActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-ascii-snapshot__actions", className)} ref={ref} {...props} />
));

AsciiSnapshotActions.displayName = "AsciiSnapshotActions";

export const AsciiSnapshot = Object.assign(AsciiSnapshotRoot, {
  Actions: AsciiSnapshotActions,
  Body: AsciiSnapshotBody,
  Description: AsciiSnapshotDescription,
  Footer: AsciiSnapshotFooter,
  Headline: AsciiSnapshotHeadline,
  Media: AsciiSnapshotMedia
});
