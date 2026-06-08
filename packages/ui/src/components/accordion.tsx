import * as React from "react";
import { cx } from "../lib/cx";

export type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

export type AccordionItemProps = React.DetailsHTMLAttributes<HTMLDetailsElement>;

export type AccordionTriggerProps = React.HTMLAttributes<HTMLElement>;

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-accordion", className)} ref={ref} {...props} />
  )
);

AccordionRoot.displayName = "Accordion";

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <details className={cx("sc-accordion__item", className)} ref={ref} {...props} />
  )
);

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <summary className={cx("sc-accordion__trigger", className)} ref={ref} {...props}>
      <span>{children}</span>
      <span className="sc-accordion__marker" aria-hidden="true" />
    </summary>
  )
);

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-accordion__content", className)} ref={ref} {...props} />
  )
);

AccordionContent.displayName = "AccordionContent";

export const Accordion = Object.assign(AccordionRoot, {
  Content: AccordionContent,
  Item: AccordionItem,
  Trigger: AccordionTrigger
});
