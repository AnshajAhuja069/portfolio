"use client";

import { useSyncExternalStore } from "react";
import styles from "./RoleCycler.module.css";

/**
 * Cycles the hero eyebrow through the roles. Both hero layers (base and the
 * clipped overlay) subscribe to one shared clock, so they always show the same
 * role and the text inverts cleanly at the circle's edge.
 *
 * Every role sits in the same grid cell, so the slot is as wide as the longest
 * one and nothing after it shifts. Screen readers get all roles once, as text.
 * Reduced motion: no cycling; the lead role stays.
 */

const INTERVAL = 2600;

/** Ever-increasing tick; each cycler takes it modulo its own role count. */
let tick = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (!timer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    timer = setInterval(() => {
      if (document.hidden) return;
      tick += 1;
      listeners.forEach((l) => l());
    }, INTERVAL);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

export function RoleCycler({ roles, announce }: { roles: string[]; announce: boolean }) {
  const active =
    useSyncExternalStore(
      subscribe,
      () => tick,
      () => 0,
    ) % roles.length;
  const prev = (active - 1 + roles.length) % roles.length;

  return (
    <span className={styles.root}>
      {announce && <span className="sr-only">{roles.join(", ")}</span>}
      <span className={styles.slot} aria-hidden="true" data-role-cycler>
        {roles.map((r, i) => (
          <span
            key={r}
            className={styles.role}
            data-state={i === active ? "active" : i === prev ? "prev" : "next"}
          >
            {r}
          </span>
        ))}
      </span>
    </span>
  );
}
