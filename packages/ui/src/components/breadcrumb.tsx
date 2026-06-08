import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";

const BreadcrumbRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav aria-label="Breadcrumb" className={cx("sc-breadcrumb", className)} ref={ref} {...props} />
  )
);

BreadcrumbRoot.displayName = "Breadcrumb";

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol className={cx("sc-breadcrumb__list", className)} ref={ref} {...props} />
  )
);

BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li className={cx("sc-breadcrumb__item", className)} ref={ref} {...props} />
  )
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a className={cx("sc-breadcrumb__link", className)} ref={ref} {...props} />
));

BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      aria-current="page"
      className={cx("sc-breadcrumb__page", className)}
      ref={ref}
      {...props}
    />
  )
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => (
  <li
    aria-hidden="true"
    className={cx("sc-breadcrumb__separator", className)}
    role="presentation"
    {...props}
  >
    {children ?? <ChevronRight size={13} strokeWidth={1.7} />}
  </li>
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  List: BreadcrumbList,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator
});
