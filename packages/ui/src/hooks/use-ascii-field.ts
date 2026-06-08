import * as React from "react";

export interface UseAsciiFieldOptions {
  baseOpacity?: number;
  charRamp?: string;
  cols?: number;
  colorful?: boolean;
  fontFamily?: string;
  fontSize?: number;
  frameMs?: number;
  palette?: string[];
  reactive?: boolean;
  rippleRadius?: number;
  rippleStrength?: number;
  rows?: number;
  spotlightOpacity?: number;
  spotlightRadius?: number;
}

const defaultRamp =
  " .`'\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const defaultPalette = ["#8effad", "#8bb8d7", "#ff8a3d", "#f7fff8"];

export function useAsciiField(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  hostRef: React.RefObject<HTMLElement | null>,
  options: UseAsciiFieldOptions = {}
) {
  const {
    baseOpacity = 0.48,
    charRamp = defaultRamp,
    cols: colsOpt,
    colorful = true,
    fontFamily = "var(--sc-font-mono)",
    fontSize = 11,
    frameMs = 60,
    palette: paletteOpt,
    reactive = true,
    rippleRadius = 6,
    rippleStrength = 1.05,
    rows: rowsOpt,
    spotlightOpacity = 0.92,
    spotlightRadius = 9
  } = options;

  const palette = React.useMemo(
    () => paletteOpt ?? (colorful ? defaultPalette : null),
    [colorful, paletteOpt]
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let lastFrame = 0;
    let cols = 0;
    let rows = 0;
    let cellWidth = 0;
    let cellHeight = 0;
    let field = new Float32Array(0);
    const pointer = { x: -9999, y: -9999 };

    const seed = () => {
      field = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const nx = (x / Math.max(1, cols)) * 2 - 1;
          const ny = (y / Math.max(1, rows)) * 2 - 1;
          const distance = Math.sqrt(nx * nx + ny * ny);
          const sweep = 0.5 + 0.5 * Math.sin(nx * 6 + ny * 2);
          const center = 1 - Math.min(1, distance * 1.25);
          field[y * cols + x] = 0.28 * sweep + 0.54 * center;
        }
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "top";

      const measured = ctx.measureText("M").width || fontSize * 0.62;
      cellWidth = measured;
      cellHeight = fontSize * 1.18;
      cols = colsOpt ?? Math.max(1, Math.floor(rect.width / cellWidth));
      rows = rowsOpt ?? Math.max(1, Math.floor(rect.height / cellHeight));

      if (colsOpt !== undefined) cellWidth = rect.width / cols;
      if (rowsOpt !== undefined) cellHeight = rect.height / rows;

      seed();
    };

    const render = (timeStamp: number) => {
      if (timeStamp - lastFrame < frameMs) {
        animationFrame = requestAnimationFrame(render);
        return;
      }

      lastFrame = timeStamp;
      if (cols === 0 || rows === 0) resize();

      const rect = canvas.getBoundingClientRect();
      const time = timeStamp * 0.001;
      const pointerCol = (pointer.x - rect.left) / cellWidth;
      const pointerRow = (pointer.y - rect.top) / cellHeight;
      const pointerMargin = 24;
      const pointerInside =
        pointer.x >= rect.left - pointerMargin &&
        pointer.x <= rect.right + pointerMargin &&
        pointer.y >= rect.top - pointerMargin &&
        pointer.y <= rect.bottom + pointerMargin;

      ctx.clearRect(0, 0, rect.width, rect.height);

      const rampMax = charRamp.length - 1;
      const spotRadiusSquared = spotlightRadius * spotlightRadius * 2;

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const base = field[y * cols + x] ?? 0;
          const wave =
            0.14 *
            Math.sin(x * 0.18 + time * 1.4) *
            Math.cos(y * 0.22 - time * 1.1);
          const dx = x - pointerCol;
          const dy = (y - pointerRow) * 1.8;
          const distanceSquared = dx * dx + dy * dy;
          const distance = Math.sqrt(distanceSquared);
          const ripple =
            reactive && pointerInside
              ? rippleStrength * Math.exp(-distanceSquared / 80) -
                0.52 * Math.exp(-((distance - rippleRadius) ** 2) / 30)
              : 0;

          const value = Math.max(0, Math.min(1, base + wave + ripple));
          const character = charRamp[Math.floor(value * rampMax)];
          if (character === " ") continue;

          let alpha = baseOpacity;
          if (reactive && pointerInside) {
            const spotlight = Math.exp(-distanceSquared / spotRadiusSquared);
            alpha = baseOpacity + (spotlightOpacity - baseOpacity) * spotlight;
          }
          if (alpha <= 0.01) continue;

          const paletteIndex = Math.floor(Math.abs(x * 0.1 + y * 0.07 + time * 0.12));
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.fillStyle = palette?.[paletteIndex % palette.length] ?? "#e8ffee";
          ctx.fillText(character, x * cellWidth, y * cellHeight);
        }
      }

      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    if (reactive) window.addEventListener("mousemove", onPointerMove, { passive: true });
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      if (reactive) window.removeEventListener("mousemove", onPointerMove);
    };
  }, [
    baseOpacity,
    canvasRef,
    charRamp,
    colsOpt,
    fontFamily,
    fontSize,
    frameMs,
    hostRef,
    palette,
    reactive,
    rippleRadius,
    rippleStrength,
    rowsOpt,
    spotlightOpacity,
    spotlightRadius
  ]);
}
