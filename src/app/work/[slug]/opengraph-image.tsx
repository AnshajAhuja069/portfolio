import { profile } from "@/content/profile";
import { getProject, publishedProjects } from "@/content/projects";
import { ogCard, ogSize } from "@/lib/ogCard";

// Pre-render one card per published case study at build time.
export function generateStaticParams() {
  return publishedProjects.map((p) => ({ slug: p.slug }));
}

export const alt = "Case study by Anshaj Ahuja";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogCard({
    eyebrow: `Case study · ${project?.company ?? "Gamersberg"}`,
    title: project?.title ?? profile.positioning,
    footer: `${profile.name} · ${profile.positioning}`,
  });
}
