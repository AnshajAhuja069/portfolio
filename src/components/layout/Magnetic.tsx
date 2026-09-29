"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, MQ } from "@/lib/gsap";

/**
 * Subtle "magnetic" pull on elements marked [data-magnetic] (fine pointers,
 * motion allowed). Writes --mx/--my, which CSS applies through the separate
 * `translate` property — so it never fights GSAP transforms on the same
 * element. Re-scans after every route change.
 */
export function Magnetic() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia(`${MQ.finePointer} and (prefers-reduced-motion: no-preference)`);
    if (!mq.matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = els.map((el) => {
      const p = { x: 0, y: 0 };
      const apply = () => {
        el.style.setProperty("--mx", `${p.x.toFixed(2)}px`);
        el.style.setProperty("--my", `${p.y.toFixed(2)}px`);
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(p, {
          x: gsap.utils.clamp(-10, 10, dx * 0.3),
          y: gsap.utils.clamp(-8, 8, dy * 0.35),
          duration: 0.35,
          ease: "power3.out",
          overwrite: true,
          onUpdate: apply,
        });
      };
      const onLeave = () => {
        gsap.to(p, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: true, onUpdate: apply });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(p);
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
