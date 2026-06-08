import * as React from "react";
import { cx } from "../lib/cx";

export interface LoaderPreset {
  frames: string[];
  interval: number;
}

/**
 * Frame-based terminal loaders ported from the Rust `rattles` crate
 * (vyfor/rattles), retuned for the Soft Club mono/green-glass surface.
 */
export const loaderPresets = {
  arc: { frames: ["◜", "◠", "◝", "◞", "◡", "◟"], interval: 100 },
  arrow: { frames: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"], interval: 100 },
  balloon: { frames: [".", "o", "O", "o", "."], interval: 120 },
  bounce: { frames: ["⢹", "⢺", "⢼", "⣸", "⣇", "⡧", "⡗", "⡏"], interval: 80 },
  circleHalves: { frames: ["◐", "◓", "◑", "◒"], interval: 60 },
  circleQuarters: { frames: ["◴", "◷", "◶", "◵"], interval: 120 },
  doubleArrow: { frames: ["⇐", "⇖", "⇑", "⇗", "⇒", "⇘", "⇓", "⇙"], interval: 100 },
  dots: { frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"], interval: 80 },
  dots2: { frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"], interval: 80 },
  dots3: { frames: ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"], interval: 80 },
  dotsScroll: { frames: ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"], interval: 100 },
  dqpb: { frames: ["d", "q", "p", "b"], interval: 100 },
  growHorizontal: {
    frames: ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "▊", "▋", "▌", "▍", "▎"],
    interval: 120
  },
  growVertical: { frames: ["▁", "▃", "▄", "▅", "▆", "▇", "▆", "▅", "▄", "▃"], interval: 120 },
  line: { frames: ["/", "-", "\\", "|"], interval: 90 },
  noise: { frames: ["▓", "▒", "░", " ", "░", "▒"], interval: 100 },
  point: { frames: ["∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙"], interval: 200 },
  simpleDots: { frames: [".  ", ".. ", "...", "   "], interval: 350 },
  squareCorners: { frames: ["◰", "◳", "◲", "◱"], interval: 180 },
  toggle: { frames: ["⊶", "⊷"], interval: 250 },
  triangle: { frames: ["◢", "◣", "◤", "◥"], interval: 60 }
} satisfies Record<string, LoaderPreset>;

export type LoaderName = keyof typeof loaderPresets;

export const loaderNames = Object.keys(loaderPresets) as LoaderName[];

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Override the frame sequence directly. */
  frames?: string[];
  label?: string;
  /** Named preset from `loaderPresets`. */
  preset?: LoaderName;
  size?: "lg" | "md" | "sm";
  /** Override the preset interval, in milliseconds. */
  speedMs?: number;
}

export const Loader = React.forwardRef<HTMLSpanElement, LoaderProps>(
  ({ className, frames, label = "Loading", preset = "dots", size = "md", speedMs, ...props }, ref) => {
    const definition = loaderPresets[preset] ?? loaderPresets.dots;
    const sequence = frames ?? definition.frames;
    // Preset intervals run a touch slower than the rattles originals.
    const interval = speedMs ?? Math.round(definition.interval * 1.4);
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
      if (sequence.length <= 1) return;
      const reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const id = window.setInterval(() => {
        setIndex((current) => (current + 1) % sequence.length);
      }, interval);
      return () => window.clearInterval(id);
    }, [interval, sequence]);

    const frame = sequence[index % sequence.length] ?? sequence[0];

    return (
      <span
        aria-label={label}
        className={cx("sc-loader", `sc-loader--${size}`, className)}
        ref={ref}
        role="status"
        {...props}
      >
        <span aria-hidden="true" className="sc-loader__frame">
          {frame}
        </span>
      </span>
    );
  }
);

Loader.displayName = "Loader";
