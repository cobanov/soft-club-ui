import * as React from "react";
import { Check } from "lucide-react";
import { cx } from "../lib/cx";

export interface StepperStep {
  description?: string;
  label: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Index of the active step. Steps before it render as complete. */
  current?: number;
  orientation?: "horizontal" | "vertical";
  steps: StepperStep[];
}

const stepStatus = (index: number, current: number) => {
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
};

/**
 * A numbered progress indicator for multi-step flows. Completed steps collapse
 * to a check, the active step glows, and upcoming steps stay quiet.
 */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ className, current = 0, orientation = "horizontal", steps, ...props }, ref) => (
    <ol
      className={cx("sc-stepper", `sc-stepper--${orientation}`, className)}
      ref={ref}
      {...props}
    >
      {steps.map((step, index) => {
        const status = stepStatus(index, current);
        return (
          <li
            aria-current={status === "current" ? "step" : undefined}
            className={cx("sc-stepper__step", `sc-stepper__step--${status}`)}
            key={step.label}
          >
            <span className="sc-stepper__marker" aria-hidden="true">
              {status === "complete" ? <Check size={14} strokeWidth={2.2} /> : index + 1}
            </span>
            <span className="sc-stepper__body">
              <span className="sc-stepper__label">{step.label}</span>
              {step.description ? (
                <span className="sc-stepper__description">{step.description}</span>
              ) : null}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden="true" className="sc-stepper__line" />
            ) : null}
          </li>
        );
      })}
    </ol>
  )
);

Stepper.displayName = "Stepper";
