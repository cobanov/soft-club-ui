import * as React from "react";
import { cx } from "../lib/cx";

export interface BeforeAfterProps extends React.HTMLAttributes<HTMLDivElement> {
  after?: React.ReactNode;
  before?: React.ReactNode;
  afterLabel?: string;
  beforeLabel?: string;
}

export const BeforeAfter = React.forwardRef<HTMLDivElement, BeforeAfterProps>(
  (
    {
      after = "Glass pass active",
      afterLabel = "AFTER",
      before = "Flat terminal panel",
      beforeLabel = "BEFORE",
      className,
      ...props
    },
    ref
  ) => (
    <div className={cx("sc-before-after", className)} ref={ref} {...props}>
      <div className="sc-before-after__pane">
        <div className="sc-before-after__label">{beforeLabel}</div>
        <div className="sc-before-after__body">{before}</div>
      </div>
      <div aria-hidden="true" className="sc-before-after__divider" />
      <div className="sc-before-after__pane sc-before-after__pane--after">
        <div className="sc-before-after__label">{afterLabel}</div>
        <div className="sc-before-after__body">{after}</div>
      </div>
    </div>
  )
);

BeforeAfter.displayName = "BeforeAfter";
