import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

/** Shared link-preview card (Open Graph and Twitter): paper, ink, one teal accent. */
export const ogSize = { width: 1200, height: 630 };

export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f5f2eb",
          color: "#171717",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 600 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#0e93a6" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#4a4744" }}>
          <span>{footer}</span>
          <span>{profile.meta.siteUrl.replace("https://", "")}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
