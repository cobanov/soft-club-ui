import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../lib/cx";

export interface DateRange {
  end: Date | null;
  start: Date | null;
}

export type CalendarValue = Date | DateRange | null;

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  defaultMonth?: Date;
  defaultValue?: CalendarValue;
  /** Return true to disable a day. */
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  max?: Date;
  min?: Date;
  /** "single" selects one date; "range" selects a start/end pair. */
  mode?: "range" | "single";
  month?: Date;
  onMonthChange?: (month: Date) => void;
  onValueChange?: (value: CalendarValue) => void;
  value?: CalendarValue;
  /** 0 = Sunday, 1 = Monday. */
  weekStartsOn?: 0 | 1;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const addMonthsClamped = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const maxDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), maxDay));
};
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const cmp = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();
const isSameDay = (a?: Date | null, b?: Date | null) =>
  Boolean(a && b && cmp(a, b) === 0);
const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const asRange = (value: CalendarValue): DateRange =>
  value && !(value instanceof Date) ? value : { end: null, start: null };
const asDate = (value: CalendarValue): Date | null => (value instanceof Date ? value : null);

const buildGrid = (viewMonth: Date, weekStartsOn: number) => {
  const first = startOfMonth(viewMonth);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
};

const weekdayLabels = (weekStartsOn: number, locale?: string) => {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const sunday = new Date(2023, 0, 1);
  sunday.setDate(sunday.getDate() - sunday.getDay()); // normalise back to a Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + ((weekStartsOn + i) % 7));
    return fmt.format(day);
  });
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      defaultMonth,
      defaultValue,
      isDateDisabled,
      locale,
      max,
      min,
      mode = "single",
      month: monthProp,
      onMonthChange,
      onValueChange,
      value: valueProp,
      weekStartsOn = 0,
      ...rest
    },
    ref
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<CalendarValue>(
      defaultValue ?? (mode === "range" ? { end: null, start: null } : null)
    );
    const value = isControlled ? valueProp! : internalValue;

    const anchorDate =
      mode === "range" ? asRange(value).start : asDate(value);
    const [internalMonth, setInternalMonth] = React.useState(() =>
      startOfMonth(monthProp ?? defaultMonth ?? anchorDate ?? new Date())
    );
    const viewMonth = monthProp ? startOfMonth(monthProp) : internalMonth;

    const setViewMonth = (next: Date) => {
      const normalized = startOfMonth(next);
      if (!monthProp) setInternalMonth(normalized);
      onMonthChange?.(normalized);
    };

    const today = startOfDay(new Date());
    const [focused, setFocused] = React.useState<Date>(() =>
      startOfDay(anchorDate ?? today)
    );
    const focusedRef = React.useRef<HTMLButtonElement | null>(null);
    const keyboardingRef = React.useRef(false);

    React.useEffect(() => {
      if (keyboardingRef.current) {
        focusedRef.current?.focus();
        keyboardingRef.current = false;
      }
    }, [focused]);

    const isDisabled = React.useCallback(
      (d: Date) =>
        Boolean(
          (min && cmp(d, min) < 0) || (max && cmp(d, max) > 0) || isDateDisabled?.(d)
        ),
      [isDateDisabled, max, min]
    );

    const commit = (next: CalendarValue) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    };

    const selectDay = (d: Date) => {
      if (isDisabled(d)) return;
      const day = startOfDay(d);
      if (mode === "range") {
        const range = asRange(value);
        if (!range.start || (range.start && range.end)) {
          commit({ end: null, start: day });
        } else if (cmp(day, range.start) < 0) {
          commit({ end: range.start, start: day });
        } else {
          commit({ end: day, start: range.start });
        }
      } else {
        commit(day);
      }
      setFocused(day);
    };

    const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
      let next: Date | null = null;
      const dow = (focused.getDay() - weekStartsOn + 7) % 7;
      switch (event.key) {
        case "ArrowLeft":
          next = addDays(focused, -1);
          break;
        case "ArrowRight":
          next = addDays(focused, 1);
          break;
        case "ArrowUp":
          next = addDays(focused, -7);
          break;
        case "ArrowDown":
          next = addDays(focused, 7);
          break;
        case "Home":
          next = addDays(focused, -dow);
          break;
        case "End":
          next = addDays(focused, 6 - dow);
          break;
        case "PageUp":
          next = addMonthsClamped(focused, -1);
          break;
        case "PageDown":
          next = addMonthsClamped(focused, 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          selectDay(focused);
          return;
        default:
          return;
      }
      event.preventDefault();
      keyboardingRef.current = true;
      const normalized = startOfDay(next);
      setFocused(normalized);
      if (!isSameMonth(normalized, viewMonth)) setViewMonth(normalized);
    };

    const range = asRange(value);
    const singleSelected = asDate(value);
    const weekdays = weekdayLabels(weekStartsOn, locale);
    const grid = buildGrid(viewMonth, weekStartsOn);
    const weeks = Array.from({ length: 6 }, (_, w) => grid.slice(w * 7, w * 7 + 7));
    const monthLabel = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric"
    }).format(viewMonth);
    const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

    return (
      <div className={cx("sc-calendar", className)} ref={ref} {...rest}>
        <div className="sc-calendar__header">
          <button
            aria-label="Previous month"
            className="sc-calendar__nav"
            onClick={() => setViewMonth(addMonths(viewMonth, -1))}
            type="button"
          >
            <ChevronLeft size={16} strokeWidth={1.7} />
          </button>
          <div aria-live="polite" className="sc-calendar__title">
            {monthLabel}
          </div>
          <button
            aria-label="Next month"
            className="sc-calendar__nav"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            type="button"
          >
            <ChevronRight size={16} strokeWidth={1.7} />
          </button>
        </div>
        <div
          aria-label={monthLabel}
          className="sc-calendar__grid"
          onKeyDown={moveFocus}
          role="grid"
        >
          <div className="sc-calendar__weekdays" role="row">
            {weekdays.map((w, i) => (
              <span className="sc-calendar__weekday" key={i} role="columnheader">
                {w}
              </span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div className="sc-calendar__week" key={wi} role="row">
              {week.map((d) => {
                const outside = !isSameMonth(d, viewMonth);
                const disabled = isDisabled(d);
                const isStart = mode === "range" && isSameDay(d, range.start);
                const isEnd = mode === "range" && isSameDay(d, range.end);
                const inRange =
                  mode === "range" &&
                  range.start &&
                  range.end &&
                  cmp(d, range.start) > 0 &&
                  cmp(d, range.end) < 0;
                const selected =
                  mode === "range" ? isStart || isEnd : isSameDay(d, singleSelected);
                const isFocused = isSameDay(d, focused);
                const dayLabel =
                  fullDate.format(d) +
                  (isStart ? " (range start)" : "") +
                  (isEnd ? " (range end)" : "") +
                  (disabled ? " (unavailable)" : "");
                return (
                  <div className="sc-calendar__cell" key={dayKey(d)} role="gridcell">
                    <button
                      aria-current={isSameDay(d, today) ? "date" : undefined}
                      aria-label={dayLabel}
                      aria-selected={selected || undefined}
                      className={cx(
                        "sc-calendar__day",
                        outside && "sc-calendar__day--outside",
                        isSameDay(d, today) && "sc-calendar__day--today",
                        selected && "sc-calendar__day--selected",
                        inRange && "sc-calendar__day--in-range",
                        isStart && "sc-calendar__day--range-start",
                        isEnd && "sc-calendar__day--range-end"
                      )}
                      disabled={disabled}
                      onClick={() => selectDay(d)}
                      ref={isFocused ? focusedRef : undefined}
                      tabIndex={isFocused ? 0 : -1}
                      type="button"
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";
