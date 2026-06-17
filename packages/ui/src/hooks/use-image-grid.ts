import * as React from "react";

/**
 * Image sampling for the Soft Club canvas image effects (ASCII, mosaic, dither,
 * halftone): loads a source image and reads it back as a cached, cover-fit RGBA
 * grid, with a drifting procedural subject as the fallback when no image is set.
 */

export interface ImageGrid {
  cols: number;
  rows: number;
  // Cover-fit RGBA bytes, row-major, length `cols * rows * 4`.
  data: Uint8ClampedArray;
}

export interface UseImageGrid {
  /**
   * Down-sample the loaded source image into a `cols x rows` RGBA grid,
   * cover-fitting and centering it. The result is cached until the grid size
   * or the `src` changes, so calling it every animation frame is cheap.
   * Returns `null` until the image has loaded (or if the canvas is tainted by
   * a cross-origin source), which is the cue to fall back to {@link fieldLuma}.
   */
  sample: (cols: number, rows: number) => ImageGrid | null;
  /**
   * Bumps once the image settles (load or error). Pass it as the canvas
   * driver's `redrawKey` so the reduced-motion single static frame repaints
   * with the real image instead of staying on the procedural fallback.
   */
  version: number;
}

/** Rec. 601 luminance (0..1) of an RGBA cell at byte offset `i`, alpha-weighted. */
export const cellLuma = (data: Uint8ClampedArray, i: number) =>
  ((0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255) * (data[i + 3] / 255);

/**
 * Drifting procedural luminance (0..1) for an off-center glowing subject, used
 * by every image effect when no `src` is supplied so the surfaces animate and
 * read as a silhouette on their own. `nx`/`ny` are normalized 0..1 cell
 * coordinates; `t` is seconds.
 */
export function fieldLuma(nx: number, ny: number, t: number): number {
  const cx = 0.5 + 0.05 * Math.sin(t * 0.4);
  const cy = 0.46 + 0.03 * Math.cos(t * 0.33);
  const dx = nx - cx;
  const dy = (ny - cy) * 1.22;
  const r = Math.sqrt(dx * dx * 1.15 + dy * dy);
  const core = Math.max(0, 1 - r * 1.85);
  const halo = Math.exp(-r * r * 5.5);
  const ripple = 0.5 + 0.5 * Math.sin(nx * 9 - t * 1.1) * Math.cos(ny * 7 + t * 0.9);
  const breath = 0.92 + 0.08 * Math.sin(t * 0.8);
  return Math.max(0, Math.min(1, (core * 0.82 + halo * 0.34) * breath + ripple * 0.1 * core));
}

/**
 * Loads an image `src` and exposes a cached, cover-fit RGBA sampler for canvas
 * image effects (ASCII, mosaic, dither, halftone). Cross-origin reads are
 * attempted with `crossOrigin="anonymous"`; a tainted canvas degrades to
 * `null` rather than throwing, so callers fall back to the procedural field.
 */
export function useImageGrid(src?: string): UseImageGrid {
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const bufferRef = React.useRef<HTMLCanvasElement | null>(null);
  const cacheRef = React.useRef<ImageGrid | null>(null);
  const readyRef = React.useRef(false);
  const taintedRef = React.useRef(false);
  const [version, setVersion] = React.useState(0);

  React.useEffect(() => {
    readyRef.current = false;
    taintedRef.current = false;
    cacheRef.current = null;
    imageRef.current = null;
    if (!src || typeof window === "undefined") return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    const settle = () => setVersion((value) => value + 1);
    const onLoad = () => {
      imageRef.current = image;
      cacheRef.current = null;
      readyRef.current = true;
      settle();
    };
    image.addEventListener("load", onLoad);
    image.addEventListener("error", settle);
    image.src = src;

    return () => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", settle);
    };
  }, [src]);

  const sample = React.useCallback((cols: number, rows: number): ImageGrid | null => {
    const image = imageRef.current;
    if (!readyRef.current || taintedRef.current || !image || cols < 1 || rows < 1) return null;

    const cached = cacheRef.current;
    if (cached && cached.cols === cols && cached.rows === rows) return cached;

    let canvas = bufferRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      bufferRef.current = canvas;
    }
    canvas.width = cols;
    canvas.height = rows;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    if (iw < 1 || ih < 1) return null;
    const scale = Math.max(cols / iw, rows / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.clearRect(0, 0, cols, rows);
    ctx.drawImage(image, (cols - dw) / 2, (rows - dh) / 2, dw, dh);

    let data: Uint8ClampedArray;
    try {
      data = ctx.getImageData(0, 0, cols, rows).data;
    } catch {
      taintedRef.current = true;
      return null;
    }

    const grid: ImageGrid = { cols, data, rows };
    cacheRef.current = grid;
    return grid;
  }, []);

  return { sample, version };
}
