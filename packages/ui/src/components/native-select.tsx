import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../lib/cx";

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ children, className, ...props }, ref) => (
    <span className={cx("sc-native-select", className)}>
      <select className="sc-native-select__field" ref={ref} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="sc-native-select__icon"
        size={16}
        strokeWidth={1.7}
      />
    </span>
  )
);

NativeSelect.displayName = "NativeSelect";
