import * as React from "react";
import { Search } from "lucide-react";
import { cx } from "../lib/cx";
import { Dialog, DialogContent } from "./dialog";

interface CommandContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

const useCommand = () => {
  const context = React.useContext(CommandContext);
  if (!context) throw new Error("Command components must be used within <Command>.");
  return context;
};

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSearch?: string;
  onSearchChange?: (value: string) => void;
  search?: string;
}

/**
 * A command palette list with built-in fuzzy-by-substring filtering. Items hide
 * themselves when they fall out of the query; empty groups and the empty state
 * are handled in CSS via :has(), so no registry bookkeeping is needed.
 */
const CommandRoot = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ children, className, defaultSearch = "", onSearchChange, search: searchProp, ...props }, ref) => {
    const isControlled = searchProp !== undefined;
    const [internal, setInternal] = React.useState(defaultSearch);
    const search = isControlled ? searchProp : internal;
    const setSearch = React.useCallback(
      (value: string) => {
        if (!isControlled) setInternal(value);
        onSearchChange?.(value);
      },
      [isControlled, onSearchChange]
    );

    const context = React.useMemo(() => ({ search, setSearch }), [search, setSearch]);

    return (
      <CommandContext.Provider value={context}>
        <div className={cx("sc-command", className)} ref={ref} {...props}>
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);

CommandRoot.displayName = "Command";

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
>(({ className, placeholder = "Type a command…", ...props }, ref) => {
  const { search, setSearch } = useCommand();
  return (
    <div className="sc-command__search">
      <Search aria-hidden="true" size={15} strokeWidth={1.7} />
      <input
        className={cx("sc-command__input", className)}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        ref={ref}
        value={search}
        {...props}
      />
    </div>
  );
});

CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cx("sc-command__list", className)} ref={ref} role="listbox" {...props} />
  )
);

CommandList.displayName = "CommandList";

export const CommandEmpty = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children = "No results found.", className, ...props }, ref) => (
    <p className={cx("sc-command__empty", className)} ref={ref} {...props}>
      {children}
    </p>
  )
);

CommandEmpty.displayName = "CommandEmpty";

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ children, className, heading, ...props }, ref) => (
    <div className={cx("sc-command__group", className)} ref={ref} {...props}>
      {heading ? <div className="sc-command__group-heading">{heading}</div> : null}
      {children}
    </div>
  )
);

CommandGroup.displayName = "CommandGroup";

export const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div aria-hidden="true" className={cx("sc-command__separator", className)} ref={ref} {...props} />
  )
);

CommandSeparator.displayName = "CommandSeparator";

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Extra terms to match against beyond the visible text. */
  keywords?: string;
  onSelect?: () => void;
  /** Text used for filtering. Falls back to the item's children text. */
  value?: string;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ children, className, keywords = "", onSelect, value, ...props }, ref) => {
    const { search } = useCommand();
    const haystack = `${value ?? (typeof children === "string" ? children : "")} ${keywords}`.toLowerCase();
    const query = search.trim().toLowerCase();
    if (query && !haystack.includes(query)) return null;
    return (
      <div
        className={cx("sc-command__item", className)}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect?.();
          }
        }}
        ref={ref}
        role="option"
        tabIndex={0}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CommandItem.displayName = "CommandItem";

export interface CommandDialogProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

/** The command palette inside a centered modal, opened by ⌘K and similar. */
export const CommandDialog = ({ children, onOpenChange, open }: CommandDialogProps) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent className="sc-command-dialog">
      <CommandRoot>{children}</CommandRoot>
    </DialogContent>
  </Dialog>
);

CommandDialog.displayName = "CommandDialog";

export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Separator: CommandSeparator
});
