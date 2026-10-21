"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import s from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

/** localStorage key; the no-flash script in layout.tsx reads the same one. */
export const THEME_KEY = "theme";
const THEME_COLOR: Record<Theme, string> = { light: "#f5f2eb", dark: "#11151d" };
const CONFETTI = ["#3fd0d6", "#f2677f", "#ffd166", "#f5f2eb", "#0e93a6"];

const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const isDark = () => document.documentElement.dataset.theme === "dark";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
  // Mascots listen for this to react (and put on, or take off, the hat).
  window.dispatchEvent(new CustomEvent<Theme>("themechange", { detail: theme }));
}

/** A small burst of confetti from the button when the lights go off. */
function confetti(x: number, y: number) {
  const layer = document.createElement("div");
  layer.className = s.confetti;
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);
  const pieces = Array.from({ length: 22 }, (_, i) => {
    const bit = document.createElement("i");
    bit.style.background = CONFETTI[i % CONFETTI.length];
    if (i % 3 === 0) bit.style.borderRadius = "50%";
    layer.append(bit);
    // Mostly downward and outward, since the button sits at the top edge.
    const angle = Math.PI * (0.05 + Math.random() * 0.9);
    const dist = 70 + Math.random() * 110;
    const dx = Math.cos(angle) * dist * (Math.random() < 0.5 ? -1 : 1);
    const dy = Math.sin(angle) * dist;
    return bit.animate(
      [
        { transform: `translate(${x}px, ${y}px) rotate(0deg) scale(1)`, opacity: 1 },
        {
          transform: `translate(${x + dx}px, ${y + dy + 40}px) rotate(${Math.random() * 720 - 360}deg) scale(0.6)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    ).finished;
  });
  Promise.all(pieces).finally(() => layer.remove());
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = dark ? "light" : "dark";
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as ViewTransitionDoc;

    if (reduce || !doc.startViewTransition) {
      apply(next);
      if (!reduce && next === "dark") confetti(x, y);
      return;
    }

    // The new theme spreads out from the button, like the hero's colour field.
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = doc.startViewTransition(() => apply(next));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
        if (next === "dark") confetti(x, y);
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      className={s.toggle}
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark theme"
      title={dark ? "Lights on" : "Lights off, party on"}
      data-magnetic
    >
      <svg viewBox="0 0 24 24" className={s.icon} aria-hidden="true" focusable="false">
        <mask id="theme-toggle-moon">
          <rect width="24" height="24" fill="#fff" />
          <circle className={s.bite} cx="17" cy="7.5" r="6" fill="#000" />
        </mask>
        <circle className={s.core} cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#theme-toggle-moon)" />
        <g className={s.rays} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
        </g>
      </svg>
    </button>
  );
}
