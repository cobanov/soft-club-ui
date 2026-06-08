import * as React from "react";

export interface UseTokenStreamOptions {
  enabled?: boolean;
  loop?: boolean;
  loopDelayMs?: number;
  onComplete?: () => void;
  speedMs?: number | [number, number];
  text: string;
  tokenize?: (text: string) => string[];
}

const tokenizeByWhitespace = (value: string) => value.split(/(\s+)/);
const defaultSpeedMs: [number, number] = [18, 80];

export function useTokenStream({
  enabled = true,
  loop = false,
  loopDelayMs = 6000,
  onComplete,
  speedMs = defaultSpeedMs,
  text,
  tokenize = tokenizeByWhitespace
}: UseTokenStreamOptions) {
  const [output, setOutput] = React.useState(enabled ? "" : text);
  const [isComplete, setIsComplete] = React.useState(!enabled);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useEffect(() => {
    if (!enabled) {
      setOutput(text);
      setIsComplete(true);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tokens = tokenize(text);

    const pickDelay = () =>
      Array.isArray(speedMs)
        ? speedMs[0] + Math.random() * (speedMs[1] - speedMs[0])
        : speedMs;

    const start = () => {
      let index = 0;
      let buffer = "";
      setOutput("");
      setIsComplete(false);

      const tick = () => {
        if (cancelled) return;

        if (index >= tokens.length) {
          setIsComplete(true);
          onCompleteRef.current?.();
          if (loop) {
            timer = setTimeout(start, loopDelayMs);
          }
          return;
        }

        buffer += tokens[index] ?? "";
        index += 1;
        setOutput(buffer);
        timer = setTimeout(tick, pickDelay());
      };

      tick();
    };

    start();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, loop, loopDelayMs, speedMs, text, tokenize]);

  return { isComplete, isStreaming: !isComplete, output };
}
