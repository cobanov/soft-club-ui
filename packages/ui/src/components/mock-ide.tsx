import * as React from "react";
import { cx } from "../lib/cx";

export type IdeTokenTone = "comment" | "function" | "keyword" | "number" | "string" | "text";

export interface IdeToken {
  children: string;
  tone?: IdeTokenTone;
}

export interface MockIDEProps extends React.HTMLAttributes<HTMLDivElement> {
  charMs?: [number, number];
  filename?: string;
  loop?: boolean;
  thinkingLabel?: React.ReactNode | false;
  tokens?: IdeToken[];
}

const defaultTokens: IdeToken[] = [
  { children: "// soft club transfer\n", tone: "comment" },
  { children: "export ", tone: "keyword" },
  { children: "const ", tone: "keyword" },
  { children: "surface", tone: "function" },
  { children: " = " },
  { children: '"ascii-hero"', tone: "string" },
  { children: ";\n" },
  { children: "route", tone: "function" },
  { children: "({ tab: " },
  { children: '"B2"', tone: "string" },
  { children: ", noise: " },
  { children: "0.04", tone: "number" },
  { children: " });" }
];

const defaultCharMs: [number, number] = [14, 42];

const MockIDERoot = React.forwardRef<HTMLDivElement, MockIDEProps>(
  (
    {
      charMs = defaultCharMs,
      children,
      className,
      filename = "performative-soft-club.tsx",
      loop = true,
      thinkingLabel = "writing",
      tokens = defaultTokens,
      ...props
    },
    ref
  ) => (
    <div className={cx("sc-mock-ide", className)} ref={ref} {...props}>
      {children ?? (
        <>
          <Chrome filename={filename} thinkingLabel={thinkingLabel} />
          <Body charMs={charMs} loop={loop} tokens={tokens} />
        </>
      )}
    </div>
  )
);

MockIDERoot.displayName = "MockIDE";

interface MockIDEChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  filename?: string;
  thinkingLabel?: React.ReactNode | false;
}

const Chrome = React.forwardRef<HTMLDivElement, MockIDEChromeProps>(
  ({ children, className, filename, thinkingLabel = "writing", ...props }, ref) => (
    <div className={cx("sc-mock-ide__chrome", className)} ref={ref} {...props}>
      <span className="sc-mock-ide__dot" />
      <span className="sc-mock-ide__dot" />
      <span className="sc-mock-ide__dot" />
      {filename ? <span className="sc-mock-ide__tab">{filename}</span> : null}
      {children}
      {thinkingLabel !== false ? (
        <span className="sc-mock-ide__thinking">
          <span className="sc-mock-ide__spinner" />
          <span>{thinkingLabel}</span>
        </span>
      ) : null}
    </div>
  )
);

Chrome.displayName = "MockIDE.Chrome";

interface MockIDEBodyProps extends React.HTMLAttributes<HTMLPreElement> {
  charMs?: [number, number];
  loop?: boolean;
  tokens: IdeToken[];
}

const Body = React.forwardRef<HTMLPreElement, MockIDEBodyProps>(
  ({ charMs = defaultCharMs, className, loop = true, tokens, ...props }, ref) => {
    const [visibleCharacters, setVisibleCharacters] = React.useState(0);
    const sourceLength = React.useMemo(
      () => tokens.reduce((sum, token) => sum + token.children.length, 0),
      [tokens]
    );

    React.useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let cancelled = false;

      const tick = (next: number) => {
        if (cancelled) return;

        if (next > sourceLength) {
          if (loop) {
            timer = setTimeout(() => {
              setVisibleCharacters(0);
              tick(1);
            }, 3000);
          }
          return;
        }

        setVisibleCharacters(next);
        const [min, max] = charMs;
        const delay = min + Math.random() * (max - min);
        timer = setTimeout(() => tick(next + 1), delay);
      };

      setVisibleCharacters(0);
      tick(1);

      return () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
      };
    }, [charMs, loop, sourceLength]);

    let remaining = visibleCharacters;

    return (
      <pre className={cx("sc-mock-ide__body", className)} ref={ref} {...props}>
        <code>
          {tokens.map((token, index) => {
            const visible = token.children.slice(0, Math.max(0, remaining));
            remaining -= token.children.length;
            if (!visible) return null;

            return (
              <span
                className={cx(token.tone ? `sc-mock-ide__token--${token.tone}` : undefined)}
                key={`${token.children}-${index}`}
              >
                {visible}
              </span>
            );
          })}
          <span aria-hidden="true" className="sc-mock-ide__caret" />
        </code>
      </pre>
    );
  }
);

Body.displayName = "MockIDE.Body";

export const MockIDE = Object.assign(MockIDERoot, {
  Body,
  Chrome
});
