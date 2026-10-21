import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { allCaseStudies } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.meta.siteUrl;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/resume`, changeFrequency: "monthly", priority: 0.8 },
    ...allCaseStudies.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
