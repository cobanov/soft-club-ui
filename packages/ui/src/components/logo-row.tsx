import * as React from "react";
import { cx } from "../lib/cx";

export type LogoRowItem =
  | { alt?: string; kind: "img"; src: string }
  | { key?: string; kind: "node"; node: React.ReactNode };

export interface LogoRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Caption copy ("Backed by", "As seen in", "From alumni of"). */
  heading?: React.ReactNode;
  logos: LogoRowItem[];
}

/**
 * A static, centered row of logos for backers, press, or universities.
 * The marquee's quiet sibling, for "Backed by" or "As seen in" captions.
 */
export const LogoRow = React.forwardRef<HTMLDivElement, LogoRowProps>(
  ({ className, heading, logos, ...props }, ref) => (
    <div className={cx("sc-logo-row", className)} ref={ref} {...props}>
      {heading ? <p className="sc-logo-row__heading">{heading}</p> : null}
      <div className="sc-logo-row__items">
        {logos.map((item, index) =>
          item.kind === "img" ? (
            <img alt={item.alt ?? ""} key={index} src={item.src} />
          ) : (
            <span className="sc-logo-row__text" key={item.key ?? index}>
              {item.node}
            </span>
          )
        )}
      </div>
    </div>
  )
);

LogoRow.displayName = "LogoRow";
