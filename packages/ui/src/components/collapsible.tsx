import * as React from "react";
import { cx } from "../lib/cx";

interface CollapsibleContextValue {
  contentId: string;
  disabled: boolean;
  open: boolean;
  toggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error("Collapsible parts must be used within <Collapsible>.");
  return context;
};

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

/**
 * A disclosure that animates open height with a grid-rows transition, so it
 * needs no measurement or positioning dependency.
 */
const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, className, defaultOpen = false, disabled = false, onOpenChange, open: openProp, ...props }, ref) => {
    const isControlled = openProp !== undefined;
    const [internal, setInternal] = React.useState(defaultOpen);
    const open = isControlled ? openProp : internal;
    const contentId = React.useId();

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const next = !open;
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    }, [disabled, isControlled, onOpenChange, open]);

    const context = React.useMemo(
      () => ({ contentId, disabled, open, toggle }),
      [contentId, disabled, open, toggle]
    );

    return (
      <CollapsibleContext.Provider value={context}>
        <div
          className={cx("sc-collapsible", className)}
          data-state={open ? "open" : "closed"}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);

CollapsibleRoot.displayName = "Collapsible";

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { contentId, disabled, open, toggle } = useCollapsible();
  return (
    <button
      aria-controls={contentId}
      aria-expanded={open}
      className={cx("sc-collapsible__trigger", className)}
      data-state={open ? "open" : "closed"}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      ref={ref}
      type="button"
      {...props}
    />
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    const { contentId, open } = useCollapsible();
    return (
      <div
        className={cx("sc-collapsible__content", className)}
        data-state={open ? "open" : "closed"}
        id={contentId}
        ref={ref}
        {...props}
      >
        <div className="sc-collapsible__inner">{children}</div>
      </div>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";

export const Collapsible = Object.assign(CollapsibleRoot, {
  Content: CollapsibleContent,
  Trigger: CollapsibleTrigger
});
