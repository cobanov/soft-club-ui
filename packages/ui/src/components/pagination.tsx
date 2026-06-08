import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cx } from "../lib/cx";

const PaginationRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      aria-label="Pagination"
      className={cx("sc-pagination", className)}
      ref={ref}
      {...props}
    />
  )
);

PaginationRoot.displayName = "Pagination";

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul className={cx("sc-pagination__content", className)} ref={ref} {...props} />
));

PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li className={cx("sc-pagination__item", className)} ref={ref} {...props} />
  )
);

PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cx("sc-pagination__link", isActive && "sc-pagination__link--active", className)}
      ref={ref}
      {...props}
    />
  )
);

PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = ({ className, ...props }: PaginationLinkProps) => (
  <a aria-label="Go to previous page" className={cx("sc-pagination__edge", className)} {...props}>
    <ChevronLeft size={14} strokeWidth={1.7} />
    <span>Prev</span>
  </a>
);

PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({ className, ...props }: PaginationLinkProps) => (
  <a aria-label="Go to next page" className={cx("sc-pagination__edge", className)} {...props}>
    <span>Next</span>
    <ChevronRight size={14} strokeWidth={1.7} />
  </a>
);

PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span aria-hidden="true" className={cx("sc-pagination__ellipsis", className)} {...props}>
    <MoreHorizontal size={14} strokeWidth={1.7} />
  </span>
);

PaginationEllipsis.displayName = "PaginationEllipsis";

export const Pagination = Object.assign(PaginationRoot, {
  Content: PaginationContent,
  Ellipsis: PaginationEllipsis,
  Item: PaginationItem,
  Link: PaginationLink,
  Next: PaginationNext,
  Previous: PaginationPrevious
});
