export type Rgb = [number, number, number];

/**
 * Reads a Soft Club `--sc-theme-rgb-*` token off an element's computed style and
 * returns it as an `[r, g, b]` triple. Lets canvas surfaces follow the active
 * theme, which CSS variables alone cannot do inside a 2D context.
 */
export function themeRgb(host: HTMLElement | null, token: string, fallback: Rgb): Rgb {
  if (!host || typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(host).getPropertyValue(token).trim();
  if (!raw) return fallback;
  const parts = raw.split(/[\s,]+/).map(Number);
  if (parts.length >= 3 && parts.slice(0, 3).every((value) => !Number.isNaN(value))) {
    return [parts[0], parts[1], parts[2]];
  }
  return fallback;
}

export const rgba = (color: Rgb, alpha = 1) =>
  `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
