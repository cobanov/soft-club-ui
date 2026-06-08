import * as React from "react";
import { cx } from "../lib/cx";

export type ConsoleTokenTone = "text" | "comment" | "keyword" | "string" | "function" | "number";

export interface ConsoleToken {
  children: string;
  tone?: ConsoleTokenTone;
}

export interface MockConsoleProps extends React.HTMLAttributes<HTMLDivElement> {
  filename?: string;
  status?: string;
  tokens?: ConsoleToken[];
}

const defaultTokens: ConsoleToken[] = [
  { children: "// soft channel boot\n", tone: "comment" },
  { children: "const ", tone: "keyword" },
  { children: "surface", tone: "function" },
  { children: " = " },
  { children: '"green-glass"', tone: "string" },
  { children: ";\n" },
  { children: "sync", tone: "function" },
  { children: "({ noise: " },
  { children: "0.04", tone: "number" },
  { children: ", bus: " },
  { children: '"B2"', tone: "string" },
  { children: " });" }
];

export const MockConsole = React.forwardRef<HTMLDivElement, MockConsoleProps>(
  (
    {
      className,
      filename = "room-a3.ts",
      status = "ONLINE",
      tokens = defaultTokens,
      ...props
    },
    ref
  ) => (
    <div className={cx("sc-mock-console", className)} ref={ref} {...props}>
      <div className="sc-mock-console__bar">
        <span>{filename}</span>
        <span>{status}</span>
      </div>
      <pre className="sc-mock-console__body">
        <code>
          {tokens.map((token, index) => (
            <span
              className={cx(token.tone ? `sc-mock-console__token--${token.tone}` : undefined)}
              key={`${token.children}-${index}`}
            >
              {token.children}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
);

MockConsole.displayName = "MockConsole";
