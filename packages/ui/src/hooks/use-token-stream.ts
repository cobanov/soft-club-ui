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

  // Keep the volatile options in a ref so inline `speedMs={[..]}` / `tokenize`
  // props do not re-trigger the effect mid-loop. The effect runs once per
  // (enabled, loop, text) and loops forever within that single lifecycle —
  // the same run-once algorithm the reference library uses.
  const optionsRef = React.useRef({ loopDelayMs, onComplete, speedMs, tokenize });
  optionsRef.current = { loopDelayMs, onComplete, speedMs, tokenize };

  React.useEffect(() => {
    if (!enabled) {
      setOutput(text);
      setIsComplete(true);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const tokens = optionsRef.current.tokenize(text);

    const pickDelay = () => {
      const speed = optionsRef.current.speedMs;
      return Array.isArray(speed) ? speed[0] + Math.random() * (speed[1] - speed[0]) : speed;
    };

    const run = () => {
      let index = 0;
      let buffer = "";

      const tick = () => {
        if (cancelled) return;

        if (index >= tokens.length) {
          setIsComplete(true);
          optionsRef.current.onComplete?.();
          if (loop) {
            timer = setTimeout(() => {
              if (cancelled) return;
              setIsComplete(false);
              setOutput("");
              run();
            }, optionsRef.current.loopDelayMs);
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

    setOutput("");
    setIsComplete(false);
    run();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, loop, text]);

  return { isComplete, isStreaming: !isComplete, output };
}
