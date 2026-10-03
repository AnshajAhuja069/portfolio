/**
 * Tiny storage helpers for the guide. Every access is wrapped: storage can be
 * blocked (private mode, previews), and the guide must still work without it.
 */
import { useSyncExternalStore } from "react";

type Area = "local" | "session";

const area = (a: Area): Storage | null => {
  try {
    return a === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const store = {
  get(key: string, a: Area = "local"): string | null {
    try {
      return area(a)?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string, a: Area = "local") {
    try {
      area(a)?.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  remove(key: string, a: Area = "local") {
    try {
      area(a)?.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  /** Section bubbles already shown this visit. */
  seen(): Set<string> {
    try {
      return new Set(JSON.parse(this.get("guide:seen", "session") ?? "[]") as string[]);
    } catch {
      return new Set();
    }
  },
  markSeen(key: string) {
    const s = this.seen();
    s.add(key);
    this.set("guide:seen", JSON.stringify([...s]), "session");
  },
};

/** Fired whenever the guide is hidden or brought back (footer link listens). */
export const GUIDE_CHANGE = "guide:change";
export const isGuideHidden = () => store.get("guide:hidden") === "1";
export function setGuideHidden(hidden: boolean) {
  if (hidden) store.set("guide:hidden", "1");
  else {
    store.remove("guide:hidden");
    // Tell the guide to say hello when it comes back.
    store.set("guide:woken", "1", "session");
  }
  window.dispatchEvent(new Event(GUIDE_CHANGE));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(GUIDE_CHANGE, cb);
  return () => window.removeEventListener(GUIDE_CHANGE, cb);
};

/** Live "is the guide hidden?" (server render assumes `serverValue`). */
export function useGuideHidden(serverValue: boolean) {
  return useSyncExternalStore(subscribe, isGuideHidden, () => serverValue);
}
