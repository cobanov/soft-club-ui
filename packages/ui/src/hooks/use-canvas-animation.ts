import * as React from "react";

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  dt: number;
  pointer: { x: number; y: number; inside: boolean };
}

export interface UseCanvasAnimationOptions {
  fps?: number;
  reactive?: boolean;
}

/**
 * Shared canvas animation driver for the live Soft Club surfaces.
 * Handles devicePixelRatio scaling, resize observation, an optional pointer,
 * a throttled requestAnimationFrame loop, and reduced-motion (renders a single
 * static frame instead of animating).
 */
export function useCanvasAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  hostRef: React.RefObject<HTMLElement | null>,
  draw: (frame: CanvasFrame) => void,
  options: UseCanvasAnimationOptions = {}
) {
  const { fps = 0, reactive = false } = options;
  const drawRef = React.useRef(draw);
  drawRef.current = draw;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let start = 0;
    let last = 0;
    let lastDraw = 0;
    const frameMs = fps > 0 ? 1000 / fps : 0;
    const pointer = { inside: false, x: -9999, y: -9999 };
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = rect.width;
      height = rect.height;
    };

    const loop = (timeStamp: number) => {
      if (!start) {
        start = timeStamp;
        last = timeStamp;
      }
      if (frameMs && timeStamp - lastDraw < frameMs) {
        animationFrame = requestAnimationFrame(loop);
        return;
      }
      if (width === 0 || height === 0) resize();
      const time = (timeStamp - start) / 1000;
      const dt = Math.min(0.064, (timeStamp - last) / 1000);
      last = timeStamp;
      lastDraw = timeStamp;
      drawRef.current({ ctx, dt, height, pointer, time, width });
      animationFrame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside =
        pointer.x >= -24 &&
        pointer.x <= rect.width + 24 &&
        pointer.y >= -24 &&
        pointer.y <= rect.height + 24;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    if (reactive) window.addEventListener("mousemove", onPointerMove, { passive: true });

    if (reduceMotion) {
      drawRef.current({ ctx, dt: 0, height, pointer, time: 0, width });
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      if (reactive) window.removeEventListener("mousemove", onPointerMove);
    };
  }, [canvasRef, fps, hostRef, reactive]);
}
