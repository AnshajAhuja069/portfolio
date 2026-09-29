"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * After a client-side route change, move keyboard/screen-reader focus to the
 * start of <main> so people don't stay stranded on the link they clicked.
 * Skips the first render and doesn't scroll (Next handles scroll).
 */
export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // A hash target (e.g. /#work) manages its own position.
    if (window.location.hash) return;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
