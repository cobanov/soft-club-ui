import * as React from "react";
import { cx } from "../lib/cx";
import { Toggle, type ToggleProps } from "./toggle";

interface ToggleGroupContextValue {
  size?: ToggleProps["size"];
  toggle: (value: string) => void;
  value: string[];
  variant?: ToggleProps["variant"];
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  size?: ToggleProps["size"];
  type?: "multiple" | "single";
  value?: string[];
  variant?: ToggleProps["variant"];
}

const ToggleGroupRoot = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    { children, className, defaultValue, onValueChange, size, type = "single", value, variant, ...props },
    ref
  ) => {
    const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
    const current = value ?? internal;

    const toggle = React.useCallback(
      (item: string) => {
        let next: string[];
        if (type === "single") {
          next = current.includes(item) ? [] : [item];
        } else {
          next = current.includes(item)
            ? current.filter((entry) => entry !== item)
            : [...current, item];
        }
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [current, onValueChange, type, value]
    );

    return (
      <ToggleGroupContext.Provider value={{ size, toggle, value: current, variant }}>
        <div className={cx("sc-toggle-group", className)} ref={ref} role="group" {...props}>
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);

ToggleGroupRoot.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<ToggleProps, "defaultPressed" | "onPressedChange" | "pressed"> {
  value: string;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ size, value, variant, ...props }, ref) => {
    const ctx = React.useContext(ToggleGroupContext);
    const pressed = ctx?.value.includes(value) ?? false;

    return (
      <Toggle
        onPressedChange={() => ctx?.toggle(value)}
        pressed={pressed}
        ref={ref}
        size={size ?? ctx?.size}
        variant={variant ?? ctx?.variant}
        {...props}
      />
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";

export const ToggleGroup = Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });
