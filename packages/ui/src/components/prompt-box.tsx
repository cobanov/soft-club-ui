import * as React from "react";
import { Mic, Plus, Send } from "lucide-react";
import { cx } from "../lib/cx";

export interface PromptBoxProps extends React.FormHTMLAttributes<HTMLFormElement> {
  defaultValue?: string;
  placeholder?: string;
}

export const PromptBox = React.forwardRef<HTMLFormElement, PromptBoxProps>(
  (
    {
      className,
      defaultValue,
      placeholder = "Describe the glass pass…",
      onSubmit,
      ...props
    },
    ref
  ) => (
    <form
      className={cx("sc-prompt-box", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
      ref={ref}
      {...props}
    >
      <button aria-label="Attach" className="sc-prompt-box__icon" type="button">
        <Plus aria-hidden="true" size={16} />
      </button>
      <input
        className="sc-prompt-box__input"
        defaultValue={defaultValue}
        name="soft-club-prompt"
        placeholder={placeholder}
      />
      <button aria-label="Voice input" className="sc-prompt-box__icon" type="button">
        <Mic aria-hidden="true" size={16} />
      </button>
      <button aria-label="Send" className="sc-prompt-box__send" type="submit">
        <Send aria-hidden="true" size={16} />
      </button>
    </form>
  )
);

PromptBox.displayName = "PromptBox";
