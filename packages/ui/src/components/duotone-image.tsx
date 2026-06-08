import * as React from "react";
import { cx } from "../lib/cx";

type DuotoneStyle = React.CSSProperties & Record<string, string | number>;

export interface DuotoneImageProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: string;
  /** Highlight tint. Defaults to the active theme primary. */
  color?: string;
  /** Deep-shadow color blended underneath the tint. */
  shadow?: string;
  /** 0 - 1, how aggressively the tint overrides the source image. */
  intensity?: number;
  scanlines?: boolean;
  src: string;
}

/**
 * Colorizes any image into a single-hue duotone treatment using CSS blend
 * modes. Pass an `src` and a `color` and the picture is desaturated, contrast
 * boosted, and re-tinted into the given hue over the dark Soft Club ground.
 */
export const DuotoneImage = React.forwardRef<HTMLDivElement, DuotoneImageProps>(
  (
    {
      alt = "",
      className,
      color = "rgb(var(--sc-theme-rgb-primary))",
      intensity = 0.82,
      scanlines = true,
      shadow = "var(--sc-color-background)",
      src,
      style,
      ...props
    },
    ref
  ) => {
    const mergedStyle: DuotoneStyle = {
      ...(style as DuotoneStyle),
      "--sc-duotone-color": color,
      "--sc-duotone-intensity": String(intensity),
      "--sc-duotone-shadow": shadow
    };

    return (
      <div
        className={cx("sc-duotone", scanlines && "sc-duotone--scanlines", className)}
        ref={ref}
        style={mergedStyle}
        {...props}
      >
        <img alt={alt} className="sc-duotone__image" loading="lazy" src={src} />
        <span aria-hidden="true" className="sc-duotone__tint" />
        <span aria-hidden="true" className="sc-duotone__grain" />
      </div>
    );
  }
);

DuotoneImage.displayName = "DuotoneImage";
