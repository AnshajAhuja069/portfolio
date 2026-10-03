"use client";

import { useSyncExternalStore } from "react";
import { guide } from "@/content/guide";
import { GUIDE_CHANGE, isGuideHidden, setGuideHidden } from "./store";

const subscribe = (cb: () => void) => {
  window.addEventListener(GUIDE_CHANGE, cb);
  return () => window.removeEventListener(GUIDE_CHANGE, cb);
};

/** Footer link that brings the guide back after "Hide me". */
export function GuideRestore({ className }: { className?: string }) {
  const hidden = useSyncExternalStore(subscribe, isGuideHidden, () => false);
  if (!hidden) return null;
  return (
    <button type="button" className={className} onClick={() => setGuideHidden(false)}>
      {guide.footerBringBack}
    </button>
  );
}
