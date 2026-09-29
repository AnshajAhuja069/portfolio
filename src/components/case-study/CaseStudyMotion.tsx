"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { lineReveal } from "@/lib/lineReveal";
import s from "./CaseStudy.module.css";

/**
 * Motion for case-study pages (docs/motion-spec.md §9):
 * reading-progress bar, preview settle, title line reveal, section reveals.
 * Content is visible by default; everything animates *from* offsets.
 */
export function CaseStudyMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const bar = el.querySelector<HTMLElement>("[data-progress]");

      // Reading progress is informative, so it runs even with reduced motion.
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.3 },
          },
        );
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const undoLines = lineReveal(gsap.utils.toArray<HTMLElement>("[data-split]", el));

        gsap.utils.toArray<HTMLElement>("[data-reveal]", el).forEach((block) => {
          gsap.from(block.children, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: { trigger: block, start: "top 85%", once: true },
          });
        });

        return undoLines;
      });

      mm.add(MQ.desktop, () => {
        const preview = el.querySelector<HTMLElement>("[data-preview]");
        if (preview) {
          gsap.fromTo(
            preview,
            { scale: 0.92, y: 40 },
            {
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: preview, start: "top bottom", end: "top 25%", scrub: 0.5 },
            },
          );
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <span className={s.progress} data-progress aria-hidden="true" />
      {children}
    </div>
  );
}
