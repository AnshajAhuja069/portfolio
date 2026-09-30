import { ArrowRight } from "@/components/ArrowRight";
import { LockIcon } from "./DeviceShot";
import m from "./CaseMedia.module.css";

/**
 * "See it live" styled as a browser address bar: a pulsing live dot, the real
 * URL, and a clear call to action. Opens the product in a new tab.
 */
export function LiveLink({ href, label, tone = "light" }: { href: string; label: string; tone?: "light" | "dark" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${m.live} ${tone === "dark" ? m.liveDark : ""}`}
      data-magnetic
      data-live-link
    >
      <span className={m.liveBadge}>
        <span className={m.pulse} aria-hidden="true" />
        Live
      </span>
      <span className={m.liveUrl}>
        <LockIcon />
        <span className={m.liveUrlText}>{label}</span>
      </span>
      <span className={m.liveCta}>
        See it live
        <span className="sr-only"> (opens in a new tab)</span>
        <ArrowRight className={m.liveArrow} />
      </span>
    </a>
  );
}
