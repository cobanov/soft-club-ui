import * as React from "react";
import { cx } from "../lib/cx";
import { Button } from "./button";

export interface InstrumentContextValue {
  /** Bumped by the Regen action. Simulations reseed when it changes. */
  epoch: number;
  /** Toggled by the Focus action. Simulations may intensify while focused. */
  focused: boolean;
}

const InstrumentContext = React.createContext<InstrumentContextValue>({
  epoch: 0,
  focused: false
});

/**
 * Read the surrounding Instrument's state from inside a simulation. Returns
 * `{ epoch: 0, focused: false }` when the simulation is used standalone.
 */
export const useInstrument = () => React.useContext(InstrumentContext);

interface InstrumentActionsContextValue {
  regen: () => void;
  toggleFocus: () => void;
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

const InstrumentActionsContext = React.createContext<InstrumentActionsContextValue | null>(null);

const useInstrumentActions = () => {
  const context = React.useContext(InstrumentActionsContext);
  if (!context) throw new Error("Instrument parts must be used within <Instrument>.");
  return context;
};

export interface InstrumentProps extends React.HTMLAttributes<HTMLElement> {
  onRegen?: () => void;
}

/**
 * A control-room card for generative canvas instruments: viewport, ID line,
 * title, description, technique chips, parameter readout, and Focus / Regen /
 * PNG actions. Simulations placed in the viewport read `useInstrument()` to
 * reseed on Regen and to react while focused.
 */
const InstrumentRoot = React.forwardRef<HTMLElement, InstrumentProps>(
  ({ children, className, onRegen, ...props }, ref) => {
    const [epoch, setEpoch] = React.useState(0);
    const [focused, setFocused] = React.useState(false);
    const viewportRef = React.useRef<HTMLDivElement | null>(null);

    const state = React.useMemo(() => ({ epoch, focused }), [epoch, focused]);
    const actions = React.useMemo(
      () => ({
        regen: () => {
          setEpoch((value) => value + 1);
          onRegen?.();
        },
        toggleFocus: () => setFocused((value) => !value),
        viewportRef
      }),
      [onRegen]
    );

    return (
      <InstrumentContext.Provider value={state}>
        <InstrumentActionsContext.Provider value={actions}>
          <article
            className={cx("sc-instrument", focused && "sc-instrument--focused", className)}
            ref={ref}
            {...props}
          >
            {children}
          </article>
        </InstrumentActionsContext.Provider>
      </InstrumentContext.Provider>
    );
  }
);

InstrumentRoot.displayName = "Instrument";

export const InstrumentViewport = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { viewportRef } = useInstrumentActions();
  return (
    <div className={cx("sc-instrument__viewport", className)} ref={viewportRef} {...props}>
      {children}
    </div>
  );
};

InstrumentViewport.displayName = "InstrumentViewport";

export interface InstrumentHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Catalog line, e.g. "AT-ORR-02 / JONES MODEL". */
  meta?: string;
  /** Right-aligned genre tag, e.g. "FUNCTIONAL POEM". */
  tag?: string;
  title: string;
}

export const InstrumentHeader = ({
  className,
  meta,
  tag,
  title,
  ...props
}: InstrumentHeaderProps) => (
  <header className={cx("sc-instrument__header", className)} {...props}>
    <div className="sc-instrument__heading">
      <h3 className="sc-instrument__title">{title}</h3>
      {meta ? (
        <span className="sc-instrument__meta" translate="no">
          {meta}
        </span>
      ) : null}
    </div>
    {tag ? (
      <span className="sc-instrument__tag" translate="no">
        {tag}
      </span>
    ) : null}
  </header>
);

InstrumentHeader.displayName = "InstrumentHeader";

export const InstrumentDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cx("sc-instrument__description", className)} {...props} />
);

InstrumentDescription.displayName = "InstrumentDescription";

export interface InstrumentChipsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: string[];
}

export const InstrumentChips = ({ className, items, ...props }: InstrumentChipsProps) => (
  <ul className={cx("sc-instrument__chips", className)} {...props}>
    {items.map((item) => (
      <li className="sc-instrument__chip" key={item} translate="no">
        {item}
      </li>
    ))}
  </ul>
);

InstrumentChips.displayName = "InstrumentChips";

export const InstrumentParams = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cx("sc-instrument__params", className)} translate="no" {...props} />
);

InstrumentParams.displayName = "InstrumentParams";

export interface InstrumentActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** File name for the PNG export. Defaults to "instrument.png". */
  fileName?: string;
  /** Hide the PNG action when the viewport holds no canvas. */
  png?: boolean;
}

export const InstrumentActions = ({
  children,
  className,
  fileName = "instrument.png",
  png = true,
  ...props
}: InstrumentActionsProps) => {
  const { focused } = React.useContext(InstrumentContext);
  const { regen, toggleFocus, viewportRef } = useInstrumentActions();

  const exportPng = () => {
    const canvas = viewportRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={cx("sc-instrument__actions", className)} {...props}>
      <Button aria-pressed={focused} onClick={toggleFocus} size="sm" variant="outline">
        Focus
      </Button>
      <Button onClick={regen} size="sm" variant="outline">
        Regen
      </Button>
      {png ? (
        <Button onClick={exportPng} size="sm" variant="outline">
          PNG
        </Button>
      ) : null}
      {children}
    </div>
  );
};

InstrumentActions.displayName = "InstrumentActions";

export const Instrument = Object.assign(InstrumentRoot, {
  Actions: InstrumentActions,
  Chips: InstrumentChips,
  Description: InstrumentDescription,
  Header: InstrumentHeader,
  Params: InstrumentParams,
  Viewport: InstrumentViewport
});
