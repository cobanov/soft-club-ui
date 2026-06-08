import * as React from "react";
import { cx } from "../lib/cx";

export interface NodeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: "loose" | "normal" | "tight";
}

export const NodeGrid = React.forwardRef<HTMLDivElement, NodeGridProps>(
  ({ children, className, density = "normal", ...props }, ref) => (
    <div className={cx("sc-node-grid", `sc-node-grid--${density}`, className)} ref={ref} {...props}>
      <div aria-hidden="true" className="sc-node-grid__field">
        {Array.from({ length: 12 }, (_, index) => (
          <span className="sc-node-grid__node" key={index} />
        ))}
      </div>
      {children ? <div className="sc-node-grid__content">{children}</div> : null}
    </div>
  )
);

NodeGrid.displayName = "NodeGrid";
