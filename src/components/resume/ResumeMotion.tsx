"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { lineReveal } from "@/lib/lineReveal";
import s from "./Resume.module.css";

/**
 * Journey-map motion (docs/motion-spec.md §13): the spine fills as you
 * scroll, a mini mascot rides it, stops light up as they're reached, cards
 * slide in from their side, big years drift for depth, chips stagger in.
 * Reduced motion: everything static and lit.
 */
export function ResumeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", el);
      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        stops.forEach((st) => st.classList.add(s.active));
        return () => stops.forEach((st) => st.classList.remove(s.active));
      });

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px)" },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
          if (!motion) return;

          const undoLines = lineReveal(gsap.utils.toArray<HTMLElement>("[data-split]", el));

          const map = el.querySelector<HTMLElement>("[data-map]");
          const fill = el.querySelector<HTMLElement>("[data-spine-fill]");
          const traveler = el.querySelector<HTMLElement>("[data-traveler]");
          if (map && fill && traveler) {
            const range = { trigger: map, start: "top 55%", end: "bottom 55%", scrub: 0.5 };
            gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: range });
            gsap.fromTo(
              traveler,
              { y: 0 },
              {
                y: () => map.offsetHeight - traveler.offsetHeight,
                ease: "none",
                scrollTrigger: { ...range, invalidateOnRefresh: true },
              },
            );
          }

          stops.forEach((stop) => {
            ScrollTrigger.create({
              trigger: stop,
              start: "top 55%",
              onEnter: () => stop.classList.add(s.active),
              onLeaveBack: () => stop.classList.remove(s.active),
            });

            const card = stop.querySelector("[data-card]");
            if (card) {
              const fromLeft = stop.dataset.side !== "right";
              gsap.from(card, {
                x: desktop ? (fromLeft ? -56 : 56) : 0,
                y: desktop ? 0 : 36,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 86%", once: true },
              });
            }

            const year = stop.querySelector("[data-year]");
            if (year) {
              gsap.fromTo(
                year,
                { yPercent: 35 },
                {
                  yPercent: -35,
                  ease: "none",
                  scrollTrigger: { trigger: stop, start: "top bottom", end: "bottom top", scrub: true },
                },
              );
            }
          });

          const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el);
          if (chips.length) {
            gsap.from(chips, {
              y: 18,
              opacity: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.025,
              scrollTrigger: { trigger: chips[0], start: "top 88%", once: true },
            });
          }

          return undoLines;
        },
      );
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
