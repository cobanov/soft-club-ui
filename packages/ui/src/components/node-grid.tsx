import * as React from "react";
import { cx } from "../lib/cx";

export interface NodeGridPoint {
  /** Optional label rendered beside the node. */
  label?: React.ReactNode;
  tone?: "blue" | "danger" | "green" | "warning";
  /** Horizontal position as a percentage (0-100). */
  x: number;
  /** Vertical position as a percentage (0-100). */
  y: number;
}

export interface NodeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: "loose" | "normal" | "tight";
  /** Explicit node coordinates. Defaults to a scattered system map. */
  points?: NodeGridPoint[];
}

const defaultPoints: NodeGridPoint[] = [
  { x: 8, y: 18 },
  { x: 25, y: 42 },
  { x: 44, y: 24 },
  { x: 61, y: 64 },
  { x: 78, y: 28 },
  { x: 88, y: 76 },
  { x: 18, y: 78 },
  { x: 34, y: 12 },
  { x: 51, y: 82 },
  { x: 70, y: 44 },
  { x: 92, y: 12 },
  { x: 6, y: 58 }
];

export const NodeGrid = React.forwardRef<HTMLDivElement, NodeGridProps>(
  ({ children, className, density = "normal", points = defaultPoints, ...props }, ref) => (
    <div className={cx("sc-node-grid", `sc-node-grid--${density}`, className)} ref={ref} {...props}>
      <div aria-hidden="true" className="sc-node-grid__field">
        {points.map((point, index) => (
          <span
            className={cx("sc-node-grid__node", point.tone && `sc-node-grid__node--${point.tone}`)}
            key={index}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {point.label != null ? (
              <span className="sc-node-grid__node-label">{point.label}</span>
            ) : null}
          </span>
        ))}
      </div>
      {children ? <div className="sc-node-grid__content">{children}</div> : null}
    </div>
  )
);

NodeGrid.displayName = "NodeGrid";
