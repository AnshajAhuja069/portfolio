import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjectIndex, publishedProjects } from "@/content/projects";
import { CaseStudy } from "@/components/case-study/CaseStudy";

// Only the published case studies exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudy project={project} index={getProjectIndex(slug)} />;
}
