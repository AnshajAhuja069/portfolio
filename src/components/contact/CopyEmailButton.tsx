"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Contact.module.css";

type State = "idle" | "copied" | "failed";

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), 4000);
  };

  return (
    <span className={s.copyWrap}>
      <button type="button" className={s.copy} onClick={copy} data-state={state} data-magnetic>
        {state === "copied" ? "Copied" : "Copy email"}
      </button>
      <span className={s.copyStatus} role="status" aria-live="polite">
        {state === "copied" && "Email address copied to clipboard."}
        {state === "failed" && "Couldn’t copy. Select the address to copy it instead."}
      </span>
    </span>
  );
}
