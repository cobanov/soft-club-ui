import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cx } from "../lib/cx";
import { Button } from "./button";
import { Calendar, type CalendarValue } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  align?: "center" | "end" | "start";
  defaultValue?: Date | null;
  disabled?: boolean;
  locale?: string;
  max?: Date;
  min?: Date;
  onValueChange?: (date: Date | null) => void;
  placeholder?: string;
  value?: Date | null;
  weekStartsOn?: 0 | 1;
}

/** A button-triggered calendar in a popover, showing the chosen date. */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      align = "start",
      defaultValue,
      disabled,
      locale,
      max,
      min,
      onValueChange,
      placeholder = "Pick a date",
      value: valueProp,
      weekStartsOn
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
    const value = isControlled ? valueProp! : internal;
    const [open, setOpen] = React.useState(false);

    const label = value
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value)
      : placeholder;

    const handleChange = (next: CalendarValue) => {
      const date = next instanceof Date ? next : null;
      if (!isControlled) setInternal(date);
      onValueChange?.(date);
      setOpen(false);
    };

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cx("sc-datepicker__trigger", !value && "sc-datepicker__trigger--empty")}
            disabled={disabled}
            ref={ref}
            variant="outline"
          >
            <CalendarIcon aria-hidden="true" size={15} strokeWidth={1.7} />
            <span>{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} className="sc-datepicker__popover">
          <Calendar
            locale={locale}
            max={max}
            min={min}
            mode="single"
            onValueChange={handleChange}
            value={value}
            weekStartsOn={weekStartsOn}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
