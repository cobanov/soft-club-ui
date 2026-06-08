import * as React from "react";
import { cx } from "../lib/cx";
import { Button } from "./button";

export interface PromptHeroProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onChange" | "onSubmit"> {
  ctaLabel?: React.ReactNode;
  defaultValue?: string;
  hideCta?: boolean;
  leading?: React.ReactNode | false;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export const PromptHero = React.forwardRef<HTMLFormElement, PromptHeroProps>(
  (
    {
      className,
      ctaLabel = "Run",
      defaultValue,
      hideCta,
      leading,
      onChange,
      onSubmit,
      placeholder = "Describe the soft-club surface…",
      value,
      ...props
    },
    ref
  ) => {
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = controlled ? value : internalValue;

    return (
      <form
        className={cx("sc-prompt-hero", className)}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(currentValue);
        }}
        ref={ref}
        {...props}
      >
        {leading === false ? null : (
          <span aria-hidden="true" className="sc-prompt-hero__mark">
            {leading ?? "SC"}
          </span>
        )}
        <input
          autoComplete="off"
          className="sc-prompt-hero__input"
          name="soft-club-hero-prompt"
          onChange={(event) => {
            const nextValue = event.target.value;
            if (!controlled) setInternalValue(nextValue);
            onChange?.(nextValue);
          }}
          placeholder={placeholder}
          type="text"
          value={currentValue}
        />
        {hideCta ? null : (
          <Button className="sc-prompt-hero__button" size="sm" type="submit">
            {ctaLabel}
          </Button>
        )}
      </form>
    );
  }
);

PromptHero.displayName = "PromptHero";
