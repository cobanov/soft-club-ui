import * as React from "react";
import { useCanvasAnimation } from "../hooks/use-canvas-animation";
import { rgba, themeRgb } from "../lib/theme-color";
import { cx } from "../lib/cx";
import { useInstrument } from "./instrument";

export interface GeodesicChoirProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kuramoto coupling strength. Voices drift into unison as it rises. */
  coupling?: number;
  label?: string;
  /** Idle spin speed in radians per second. */
  spin?: number;
}

interface ChoirSim {
  edges: [number, number][];
  omega: Float32Array;
  phase: Float32Array;
  vertices: number[][];
}

/** Icosahedron subdivided twice: 162 vertices, 480 edges. */
const buildIcosphere = (): { edges: [number, number][]; vertices: number[][] } => {
  const t = (1 + Math.sqrt(5)) / 2;
  let vertices: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
  ];
  let faces: number[][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];
  const normalize = (v: number[]) => {
    const len = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  };
  vertices = vertices.map(normalize);

  for (let level = 0; level < 2; level += 1) {
    const midCache = new Map<string, number>();
    const midpoint = (a: number, b: number) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      const cached = midCache.get(key);
      if (cached !== undefined) return cached;
      const index = vertices.length;
      vertices.push(
        normalize([
          (vertices[a][0] + vertices[b][0]) / 2,
          (vertices[a][1] + vertices[b][1]) / 2,
          (vertices[a][2] + vertices[b][2]) / 2
        ])
      );
      midCache.set(key, index);
      return index;
    };
    const next: number[][] = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const key = p < q ? `${p}-${q}` : `${q}-${p}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push(p < q ? [p, q] : [q, p]);
      }
    }
  }
  return { edges, vertices };
};

/**
 * A world model that hums: voices on a triangulated sphere, Kuramoto-coupled
 * along the shortest paths between them. Drag to turn the sphere by hand.
 * Inside a focused Instrument the coupling rises and the choir locks onto one
 * note; the order parameter reports how close it is to unison.
 */
export const GeodesicChoir = React.forwardRef<HTMLDivElement, GeodesicChoirProps>(
  ({ className, coupling = 1.4, label, onPointerDown, spin = 0.12, ...props }, ref) => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const simRef = React.useRef<ChoirSim | null>(null);
    const epochRef = React.useRef(-1);
    const dragRef = React.useRef<{ active: boolean; vx: number; vy: number; x: number; y: number }>({
      active: false,
      vx: 0,
      vy: 0,
      x: 0,
      y: 0
    });
    const rotationRef = React.useRef({ x: 0.4, y: 0 });
    const { epoch, focused } = useInstrument();

    useCanvasAnimation(
      canvasRef,
      hostRef,
      ({ ctx, dt, height, width }) => {
        let sim = simRef.current;
        if (!sim || epochRef.current !== epoch) {
          const { edges, vertices } = buildIcosphere();
          sim = {
            edges,
            omega: Float32Array.from({ length: vertices.length }, () => 0.8 + Math.random() * 1.4),
            phase: Float32Array.from({ length: vertices.length }, () => Math.random() * Math.PI * 2),
            vertices
          };
          simRef.current = sim;
          epochRef.current = epoch;
        }

        const k = focused ? coupling * 2.4 : coupling;
        const { edges, omega, phase, vertices } = sim;

        // Kuramoto step along sphere edges.
        const delta = new Float32Array(phase.length);
        for (const [a, b] of edges) {
          const pull = Math.sin(phase[b] - phase[a]);
          delta[a] += pull;
          delta[b] -= pull;
        }
        let orderX = 0;
        let orderY = 0;
        for (let i = 0; i < phase.length; i += 1) {
          phase[i] += dt * (omega[i] + (k / 6) * delta[i]);
          orderX += Math.cos(phase[i]);
          orderY += Math.sin(phase[i]);
        }
        const order = Math.hypot(orderX, orderY) / phase.length;

        const drag = dragRef.current;
        rotationRef.current.y += drag.active ? drag.vx * 0.01 : dt * spin;
        rotationRef.current.x += drag.active ? drag.vy * 0.01 : 0;
        drag.vx *= 0.8;
        drag.vy *= 0.8;
        const rx = rotationRef.current.x;
        const ry = rotationRef.current.y;
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);

        const radius = Math.min(width, height) * 0.38;
        const cx0 = width / 2;
        const cy0 = height / 2;
        const projected = vertices.map(([x, y, z]) => {
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          const y1 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;
          return [cx0 + x1 * radius, cy0 + y1 * radius, z2];
        });

        const primary = themeRgb(hostRef.current, "--sc-theme-rgb-primary", [142, 255, 173]);
        const secondary = themeRgb(hostRef.current, "--sc-theme-rgb-secondary", [139, 184, 215]);

        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;
        for (const [a, b] of sim.edges) {
          const pa = projected[a];
          const pb = projected[b];
          const depth = (pa[2] + pb[2]) / 2;
          ctx.strokeStyle = rgba(secondary, depth > 0 ? 0.34 : 0.1);
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          ctx.stroke();
        }
        for (let i = 0; i < projected.length; i += 1) {
          const [x, y, z] = projected[i];
          const voice = 0.5 + 0.5 * Math.sin(phase[i]);
          const front = z > 0;
          ctx.fillStyle = rgba(primary, front ? 0.25 + voice * 0.7 : 0.08 + voice * 0.16);
          ctx.beginPath();
          ctx.arc(x, y, front ? 1.6 + voice * 2.4 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = rgba(primary, 0.7);
        ctx.font = "9px monospace";
        ctx.fillText(
          `VOICES ${vertices.length}  EDGES ${edges.length}  ORDER R ${order.toFixed(3)}  K ${k.toFixed(2)}`,
          8,
          height - 8
        );
      },
      { fps: 30 }
    );

    const setRef = (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      dragRef.current = { active: true, vx: 0, vy: 0, x: event.clientX, y: event.clientY };
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic pointers (tests, some assistive input) have no active id.
      }
    };

    const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      drag.vx = event.clientX - drag.x;
      drag.vy = event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;
    };

    const endDrag = () => {
      dragRef.current.active = false;
    };

    return (
      <div
        className={cx("sc-live", "sc-geodesic-choir", className)}
        onPointerCancel={endDrag}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        ref={setRef}
        {...props}
      >
        <canvas aria-hidden="true" className="sc-live__canvas" ref={canvasRef} />
        {label ? <span className="sc-live__label">{label}</span> : null}
      </div>
    );
  }
);

GeodesicChoir.displayName = "GeodesicChoir";
