"use client";

import { useEffect, useState } from "react";
import m from "./CaseMedia.module.css";

/**
 * Floating "See it live" pill. Appears once the header's live link has
 * scrolled away and hides again near the end of the page, so it never
 * covers the next-project link or the footer.
 */
export function LiveDock({ href, label }: { href: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const top = document.querySelector("[data-live-link]");
    const end = document.querySelector("[data-live-stop]");
    let pastTop = false;
    let atEnd = false;
    const update = () => setShow(pastTop && !atEnd);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === top) pastTop = !e.isIntersecting && e.boundingClientRect.top < 0;
        if (e.target === end) atEnd = e.isIntersecting;
      });
      update();
    });
    if (top) io.observe(top);
    if (end) io.observe(end);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${m.dock} ${show ? m.dockShow : ""}`}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <span className={m.pulse} aria-hidden="true" />
      <span className={m.dockText}>
        <span className={m.dockKicker}>See it live</span>
        <span className={m.dockUrl}>{label}</span>
      </span>
      <span className={m.dockCta} aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
