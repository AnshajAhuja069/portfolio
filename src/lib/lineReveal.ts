"use client";

import { gsap, ScrollTrigger, SplitText } from "./gsap";

/**
 * Masked line reveal for headings, split lazily: SplitText only runs when a
 * heading reaches the viewport (splitting forces layout, so doing it for
 * every heading at hydration costs main-thread time on slow phones).
 * `aria: "auto"` keeps each heading's full text for assistive tech.
 * Returns a cleanup function — call it from the owning GSAP context.
 */
export function lineReveal(nodes: HTMLElement[]) {
  const splits: SplitText[] = [];
  const triggers = nodes.map((node) =>
    ScrollTrigger.create({
      trigger: node,
      start: "top bottom",
      once: true,
      onEnter: () => {
        splits.push(
          SplitText.create(node, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            aria: "auto",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 135,
                duration: 0.9,
                ease: "power4.out",
                stagger: 0.08,
              });
            },
          }),
        );
      },
    }),
  );

  return () => {
    triggers.forEach((t) => t.kill());
    splits.forEach((sp) => sp.revert());
  };
}
