import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cx } from "../lib/cx";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ComboboxProps {
  className?: string;
  defaultValue?: string;
  emptyText?: string;
  onValueChange?: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
}

/**
 * A searchable single-select built on the Popover surface. Filters options as
 * you type, supports arrow-key navigation, and works controlled or not.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      className,
      defaultValue = "",
      emptyText = "No match found.",
      onValueChange,
      options,
      placeholder = "Select option",
      searchPlaceholder = "Search…",
      value: valueProp
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const value = isControlled ? valueProp : internal;
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [active, setActive] = React.useState(0);

    const selected = options.find((option) => option.value === value);
    const filtered = React.useMemo(() => {
      const query = search.trim().toLowerCase();
      if (!query) return options;
      return options.filter((option) => option.label.toLowerCase().includes(query));
    }, [options, search]);

    React.useEffect(() => setActive(0), [search]);

    const commit = (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
      setOpen(false);
      setSearch("");
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((index) => Math.min(index + 1, filtered.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) => Math.max(index - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const option = filtered[active];
        if (option && !option.disabled) commit(option.value);
      }
    };

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className={cx("sc-combobox__trigger", className)}
            ref={ref}
            role="combobox"
            type="button"
            variant="outline"
          >
            <span className={cx("sc-combobox__value", !selected && "sc-combobox__value--placeholder")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronsUpDown aria-hidden="true" size={15} strokeWidth={1.7} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="sc-combobox__content">
          <div className="sc-combobox__search">
            <Search aria-hidden="true" size={14} strokeWidth={1.7} />
            <input
              autoFocus
              className="sc-combobox__input"
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              value={search}
            />
          </div>
          <div className="sc-combobox__list" role="listbox">
            {filtered.length === 0 ? (
              <p className="sc-combobox__empty">{emptyText}</p>
            ) : (
              filtered.map((option, index) => (
                <button
                  aria-selected={option.value === value}
                  className={cx(
                    "sc-combobox__option",
                    index === active && "sc-combobox__option--active"
                  )}
                  disabled={option.disabled}
                  key={option.value}
                  onClick={() => commit(option.value)}
                  onMouseEnter={() => setActive(index)}
                  role="option"
                  type="button"
                >
                  <Check
                    aria-hidden="true"
                    className={cx(
                      "sc-combobox__check",
                      option.value === value && "sc-combobox__check--on"
                    )}
                    size={15}
                    strokeWidth={2}
                  />
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";
