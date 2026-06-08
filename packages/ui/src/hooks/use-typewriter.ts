import * as React from "react";

export interface UseTypewriterOptions {
  deleteMs?: number;
  holdMs?: number;
  loop?: boolean;
  onWordReached?: (word: string, index: number) => void;
  typeMs?: number;
  words: string[];
}

export function useTypewriter({
  deleteMs = 32,
  holdMs = 1500,
  loop = true,
  onWordReached,
  typeMs = 70,
  words
}: UseTypewriterOptions) {
  const [word, setWord] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const stateRef = React.useRef({ index, isDeleting, word });
  stateRef.current = { index, isDeleting, word };

  React.useEffect(() => {
    if (words.length === 0) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      const current = stateRef.current;
      const target = words[current.index] ?? "";
      const next = current.isDeleting
        ? target.slice(0, current.word.length - 1)
        : target.slice(0, current.word.length + 1);

      setWord(next);

      if (!current.isDeleting && next === target) {
        onWordReached?.(target, current.index);
        if (!loop && current.index === words.length - 1) {
          setIsComplete(true);
          return;
        }

        timer = setTimeout(() => {
          setIsDeleting(true);
          timer = setTimeout(tick, deleteMs);
        }, holdMs);
        return;
      }

      if (current.isDeleting && next === "") {
        setIsDeleting(false);
        setIndex((value) => (value + 1) % words.length);
      }

      timer = setTimeout(tick, current.isDeleting ? deleteMs : typeMs);
    };

    timer = setTimeout(tick, typeMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [deleteMs, holdMs, loop, onWordReached, typeMs, words]);

  return { index, isComplete, isDeleting, word };
}
