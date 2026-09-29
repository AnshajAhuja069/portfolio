"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { lineReveal } from "@/lib/lineReveal";
import { ArrowRight } from "@/components/ArrowRight";
import s from "./SelectedWork.module.css";

/**
 * Motion for the server-rendered work section (docs/motion-spec.md §2–3, §8):
 * - intro title drift + crossing tapes that move with scroll
 * - masked line reveals for titles and index numbers
 * - cover clip reveal, layered parallax (back / mid / front)
 * - hover tilt and a "View case study" cursor pill (fine pointers)
 */
export function WorkMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const features = gsap.utils.toArray<HTMLElement>("[data-feature]", el);
      const mm = gsap.matchMedia();

      /** Reveal the label column; titles get their own line reveal. */
      const revealMeta = (feature: HTMLElement, duration: number) => {
        const meta = feature.querySelector<HTMLElement>("[data-meta]");
        if (!meta) return;
        const items = Array.from(meta.children).filter((c) => !c.hasAttribute("data-split"));
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: meta, start: "top 82%", once: true },
        });
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Masked line reveals (aria: "auto" keeps each heading's full text).
        const undoLines = lineReveal(gsap.utils.toArray<HTMLElement>("[data-split]", el));

        // Crossing tapes drift in opposite directions while in view
        // (one timeline, one trigger).
        const tapes = gsap.utils.toArray<HTMLElement>("[data-tape]", el);
        if (tapes.length) {
          const tapeTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: tapes[0], start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
          tapes.forEach((track) => {
            const left = track.dataset.tape === "left";
            tapeTl.fromTo(track, { xPercent: left ? 0 : -33.33 }, { xPercent: left ? -33.33 : 0, duration: 1 }, 0);
          });
        }

        return undoLines;
      });

      mm.add(MQ.desktop, () => {
        const title = el.querySelector("[data-drift]");
        if (title) {
          gsap.fromTo(
            title,
            { xPercent: 3 },
            {
              xPercent: -5,
              ease: "none",
              scrollTrigger: { trigger: title, start: "top bottom", end: "bottom top", scrub: 0.6 },
            },
          );
        }

        features.forEach((feature) => {
          const tilt = feature.querySelector<HTMLElement>("[data-tilt]");
          const back = feature.querySelector<HTMLElement>("[data-layer=back]");
          const mid = feature.querySelector<HTMLElement>("[data-layer=mid]");
          const front = feature.querySelector<HTMLElement>("[data-layer=front]");

          if (tilt) {
            gsap.fromTo(
              tilt,
              { clipPath: "inset(8% 6% 8% 6% round 28px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                ease: "none",
                scrollTrigger: { trigger: tilt, start: "top 92%", end: "top 38%", scrub: 0.5 },
              },
            );
          }
          // Layered parallax: one timeline per cover drives every layer.
          const depth = gsap.timeline({
            defaults: { ease: "none", duration: 1 },
            scrollTrigger: { trigger: tilt, start: "top bottom", end: "bottom top", scrub: true },
          });
          if (back) depth.fromTo(back, { yPercent: 6 }, { yPercent: -6 }, 0);
          if (mid) depth.fromTo(mid, { yPercent: 5 }, { yPercent: -4 }, 0);
          if (front) depth.fromTo(front, { yPercent: 14 }, { yPercent: -10 }, 0);

          revealMeta(feature, 0.6);
        });
      });

      mm.add(MQ.mobile, () => {
        features.forEach((feature, i) => {
          // Covers settle in (scale + a small tilt, alternating) and the
          // front layer drifts — transform-only, cheap on phones.
          const tilt = feature.querySelector<HTMLElement>("[data-tilt]");
          const front = feature.querySelector<HTMLElement>("[data-layer=front]");
          if (tilt) {
            gsap.fromTo(
              tilt,
              { scale: 0.88, rotation: i % 2 ? 2.5 : -2.5, transformOrigin: "50% 100%" },
              {
                scale: 1,
                rotation: 0,
                ease: "none",
                scrollTrigger: { trigger: tilt, start: "top bottom", end: "top 45%", scrub: 0.4 },
              },
            );
          }
          if (front) {
            gsap.fromTo(
              front,
              { yPercent: 8 },
              {
                yPercent: -6,
                ease: "none",
                scrollTrigger: { trigger: tilt, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
          revealMeta(feature, 0.5);
        });
      });

      // Hover tilt + cursor pill — fine pointers only.
      mm.add(`${MQ.desktop} and ${MQ.finePointer}`, () => {
        const cursor = el.querySelector<HTMLElement>("[data-cursor]");
        if (!cursor) return;
        gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
        const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
        const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });

        const cleanups = features.map((feature) => {
          const host = feature.querySelector<HTMLElement>("[data-tilt-host]");
          const tilt = feature.querySelector<HTMLElement>("[data-tilt]");
          if (!host || !tilt) return () => {};
          gsap.set(tilt, { transformPerspective: 1400 });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.25, ease: "power3.out" });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.25, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = host.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            ry(nx * 5); // ±2.5°
            rx(-ny * 5);
            cx(e.clientX);
            cy(e.clientY);
          };
          const onEnter = (e: PointerEvent) => {
            gsap.set(cursor, { x: e.clientX, y: e.clientY });
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });
          };
          const onLeave = () => {
            rx(0);
            ry(0);
            gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2, ease: "power2.in", overwrite: "auto" });
          };
          host.addEventListener("pointerenter", onEnter);
          host.addEventListener("pointermove", onMove);
          host.addEventListener("pointerleave", onLeave);
          return () => {
            host.removeEventListener("pointerenter", onEnter);
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {children}
      <div className={s.cursor} data-cursor aria-hidden="true">
        View case study
        <ArrowRight />
      </div>
    </div>
  );
}
