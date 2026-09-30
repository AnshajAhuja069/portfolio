import Image from "next/image";
import type { CSSProperties } from "react";
import type { Shot } from "@/content/projects";
import m from "./CaseMedia.module.css";

/**
 * A real screen in a frame that matches where it came from: a phone, a
 * browser window (with the page URL) or an artwork plate. Served at quality
 * 90 because these are dense interfaces with small text.
 */
export function DeviceShot({
  shot,
  sizes,
  priority = false,
  className,
}: {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const img = (
    <Image
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      sizes={sizes}
      quality={90}
      priority={priority}
      className={m.shotImg}
    />
  );
  const ratio = { "--ar": shot.width / shot.height } as CSSProperties;

  if (shot.frame === "phone") {
    return (
      <div className={`${m.phone} ${className ?? ""}`} style={ratio} data-surface="auto">
        <div className={m.phoneScreen}>{img}</div>
      </div>
    );
  }

  if (shot.frame === "browser") {
    return (
      <div className={`${m.browser} ${className ?? ""}`} style={ratio} data-surface="auto">
        <div className={m.chrome} aria-hidden="true">
          <span className={m.lights}>
            <i />
            <i />
            <i />
          </span>
          {shot.url && (
            <span className={m.address}>
              <LockIcon />
              {shot.url}
            </span>
          )}
        </div>
        <div className={m.browserScreen}>{img}</div>
      </div>
    );
  }

  return (
    <div
      className={`${m.art} ${className ?? ""}`}
      style={{ ...ratio, background: shot.plate ?? "var(--ink-3)" }}
      data-surface="auto"
    >
      {img}
    </div>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
      <rect x="2" y="5.2" width="8" height="5.6" rx="1.3" fill="currentColor" />
      <path d="M3.9 5.2V3.9a2.1 2.1 0 0 1 4.2 0v1.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
