import * as React from "react";
import { cx } from "../lib/cx";
import { DuotoneImage } from "./duotone-image";

export interface DuotoneCardProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  color?: string;
  featured?: boolean;
  intensity?: number;
  scanlines?: boolean;
  src: string;
}

/**
 * An image-backed surface in the spirit of the Hermes plan cards: a duotone
 * picture fills the card while content is layered on top of a readable scrim.
 */
const DuotoneCardRoot = React.forwardRef<HTMLDivElement, DuotoneCardProps>(
  ({ alt, children, className, color, featured, intensity, scanlines, src, ...props }, ref) => (
    <div
      className={cx("sc-duotone-card", featured && "sc-duotone-card--featured", className)}
      ref={ref}
      {...props}
    >
      <DuotoneImage
        alt={alt}
        className="sc-duotone-card__media"
        color={color}
        intensity={intensity}
        scanlines={scanlines}
        src={src}
      />
      <div className="sc-duotone-card__scrim" />
      <div className="sc-duotone-card__content">{children}</div>
    </div>
  )
);

DuotoneCardRoot.displayName = "DuotoneCard";

export const DuotoneCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-duotone-card__header", className)} ref={ref} {...props} />
));

DuotoneCardHeader.displayName = "DuotoneCardHeader";

export const DuotoneCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 className={cx("sc-duotone-card__title", className)} ref={ref} {...props} />
));

DuotoneCardTitle.displayName = "DuotoneCardTitle";

export const DuotoneCardMeta = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p className={cx("sc-duotone-card__meta", className)} ref={ref} {...props} />
));

DuotoneCardMeta.displayName = "DuotoneCardMeta";

export const DuotoneCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-duotone-card__body", className)} ref={ref} {...props} />
));

DuotoneCardBody.displayName = "DuotoneCardBody";

export const DuotoneCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className={cx("sc-duotone-card__footer", className)} ref={ref} {...props} />
));

DuotoneCardFooter.displayName = "DuotoneCardFooter";

export const DuotoneCard = Object.assign(DuotoneCardRoot, {
  Body: DuotoneCardBody,
  Footer: DuotoneCardFooter,
  Header: DuotoneCardHeader,
  Meta: DuotoneCardMeta,
  Title: DuotoneCardTitle
});
