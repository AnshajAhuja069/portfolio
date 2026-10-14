import { profile } from "@/content/profile";
import { ogCard, ogSize } from "@/lib/ogCard";

export const alt = `${profile.name}, ${profile.positioning}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: profile.name,
    title: profile.positioning,
    footer: profile.currentRole,
  });
}
