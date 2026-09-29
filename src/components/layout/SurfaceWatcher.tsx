"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Finds what's under the wordmark (nearest [data-surface] ancestor of the
 * element at its centre) and writes it to <html data-nav-surface>. The CSS
 * uses "accent" to swap the negative blend for a solid pill over teal.
 * Sections can announce changes with a "surfacechange" window event (the
 * hero does, as its colour field grows).
 */
export function SurfaceWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const mark = document.getElementById("nav-wordmark");
    if (!mark) return;

    let raf = 0;
    const check = () => {
      raf = 0;
      const r = mark.getBoundingClientRect();
      const hit = document
        .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .find((el) => !mark.contains(el));
      const surface = hit?.closest<HTMLElement>("[data-surface]")?.dataset.surface ?? "auto";
      if (root.dataset.navSurface !== surface) root.dataset.navSurface = surface;
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("surfacechange", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("surfacechange", queue);
    };
  }, [pathname]);

  return null;
}
