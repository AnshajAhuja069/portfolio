"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import s from "./DepthField.module.css";

/**
 * Decorative "depth" layer, tied to the iceberg idea behind the work:
 *  - Crystals: real CSS-3D octahedra shaped like icebergs (short tip above,
 *    long mass below) that turn in 3D and drift at different depths.
 *  - Contours: topographic / bathymetric lines that draw themselves as you
 *    scroll — a depth map, with small depth labels.
 * Scroll-linked only (never moves on its own). Static when reduced motion
 * is preferred. Hidden from assistive tech.
 */

export type CrystalSpec = {
  x: number; // % of the field
  y: number; // %
  size: number; // px (scaled down on phones)
  depth: number; // 0 far … 1 near
  hideOnMobile?: boolean;
};

export type ContourSpec = {
  x: number; // % (centre)
  y: number; // %
  size: number; // px
  rings: number;
  seed: number;
  labels?: string[]; // one per ring, from the inside out (optional)
  hideOnMobile?: boolean;
};

const TOP_FACES = [
  "linear-gradient(165deg, #f4fcff, #bde8f1)",
  "linear-gradient(165deg, #d3f2fb, #82cfe0)",
  "linear-gradient(165deg, #aee8ec, #3fb7c4)",
  "linear-gradient(165deg, #e4f7ff, #9fd8e7)",
];
const BOTTOM_FACES = [
  "linear-gradient(180deg, #2f93b3, #0a355a)",
  "linear-gradient(180deg, #1f7196, #072646)",
  "linear-gradient(180deg, #3aa7ba, #0b4561)",
  "linear-gradient(180deg, #1b5f88, #051c38)",
];

function Crystal({ spec, index }: { spec: CrystalSpec; index: number }) {
  return (
    <span
      className={`${s.crystal} ${spec.hideOnMobile ? s.hideMobile : ""}`}
      style={{ left: `${spec.x}%`, top: `${spec.y}%`, "--w": `${spec.size}px` } as CSSProperties}
      data-crystal
      data-depth={spec.depth}
      data-dir={index % 2 ? -1 : 1}
    >
      <span className={s.glow} />
      <span className={s.body} data-crystal-body>
        {TOP_FACES.map((bg, k) => (
          <span key={`t${k}`} className={`${s.face} ${s.top}`} style={{ background: bg, "--k": k } as CSSProperties} />
        ))}
        {BOTTOM_FACES.map((bg, k) => (
          <span key={`b${k}`} className={`${s.face} ${s.bottom}`} style={{ background: bg, "--k": k } as CSSProperties} />
        ))}
      </span>
    </span>
  );
}

/* ---------- Contours ---------- */

function noise(a: number, seed: number) {
  return (
    0.5 * Math.sin(3 * a + seed) +
    0.3 * Math.sin(5 * a + seed * 1.7 + 0.8) +
    0.2 * Math.sin(8 * a + seed * 2.3 + 2.1)
  );
}

/** Smooth closed loop through noisy points (Catmull-Rom → cubic Bézier). */
function ringPath(r: number, amp: number, seed: number, n = 40) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + amp * noise(a, seed));
    pts.push([300 + rr * Math.cos(a), 300 + rr * Math.sin(a)]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

function Contour({ spec }: { spec: ContourSpec }) {
  const rings = Array.from({ length: spec.rings }, (_, i) => {
    const r = 34 + i * (250 / spec.rings);
    const amp = 0.1 + i * 0.012;
    const seed = spec.seed + i * 0.22;
    return { d: ringPath(r, amp, seed), r, amp, seed, i };
  });

  return (
    <svg
      className={`${s.contour} ${spec.hideOnMobile ? s.hideMobile : ""}`}
      style={{ left: `${spec.x}%`, top: `${spec.y}%`, width: spec.size, height: spec.size }}
      viewBox="0 0 600 600"
      focusable="false"
      data-contour
    >
      {rings.map((ring) => (
        <path
          key={ring.i}
          d={ring.d}
          pathLength={1}
          className={ring.i % 4 === 3 ? s.index : s.line}
          data-ring
        />
      ))}
      {spec.labels?.map((label, i) => {
        const ring = rings[Math.min(rings.length - 1, Math.round(((i + 1) / (spec.labels!.length + 1)) * rings.length))];
        const a = -0.55;
        const rr = ring.r * (1 + ring.amp * noise(a, ring.seed));
        return (
          <text key={label} x={300 + rr * Math.cos(a)} y={300 + rr * Math.sin(a)} className={s.label} data-ring-label>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function DepthField({
  crystals = [],
  contours = [],
}: {
  crystals?: CrystalSpec[];
  contours?: ContourSpec[];
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Contours draw ring by ring (inner first) as each map scrolls in.
        gsap.utils.toArray<SVGSVGElement>("[data-contour]", el).forEach((svg) => {
          const rings = svg.querySelectorAll("[data-ring]");
          const labels = svg.querySelectorAll("[data-ring-label]");
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: svg, start: "top 95%", end: "center 35%", scrub: 0.6 },
          });
          tl.fromTo(rings, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.12 }, 0)
            .fromTo(labels, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.2 }, 0.6)
            .fromTo(svg, { rotation: -6 }, { rotation: 4, duration: 1.6 }, 0);
        });

        // Crystals turn in 3D and drift by depth across the whole field.
        const crystalsEls = gsap.utils.toArray<HTMLElement>("[data-crystal]", el);
        if (crystalsEls.length) {
          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.9 },
          });
          crystalsEls.forEach((c) => {
            const depth = Number(c.dataset.depth ?? 0.5);
            const dir = Number(c.dataset.dir ?? 1);
            const body = c.querySelector("[data-crystal-body]");
            tl.fromTo(c, { yPercent: 120 * depth + 40 }, { yPercent: -(120 * depth + 40) }, 0);
            if (body) {
              tl.fromTo(
                body,
                { rotationY: -40 * dir, rotationX: 16, rotationZ: -8 * dir },
                { rotationY: 320 * dir, rotationX: -14, rotationZ: 8 * dir },
                0,
              );
            }
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={s.field} aria-hidden="true">
      {contours.map((c, i) => (
        <Contour key={`c${i}`} spec={c} />
      ))}
      {crystals.map((c, i) => (
        <Crystal key={`k${i}`} spec={c} index={i} />
      ))}
    </div>
  );
}
