"use client";

/**
 * Single place where GSAP plugins are registered. Import gsap, ScrollTrigger,
 * SplitText and useGSAP from here so registration happens exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Shared media queries (keep in sync with docs/motion-spec.md). */
export const MQ = {
  desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)",
  /** Phones in portrait: tall enough to hold the hero in a sticky stage. */
  mobileTall: "(max-width: 899.98px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)",
  /** Short screens (landscape phones): no sticky stage. */
  mobileShort: "(max-width: 899.98px) and (max-height: 559.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
