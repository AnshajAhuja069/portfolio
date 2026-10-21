import Link from "next/link";
import { profile } from "@/content/profile";
import { exploreProjects, publishedProjects, type Project } from "@/content/projects";
import { Cover } from "./Cover";
import { DepthField, type ContourSpec, type CrystalSpec } from "@/components/decor/DepthField";
import { WorkMotion } from "./WorkMotion";
import { ArrowRight } from "@/components/ArrowRight";
import s from "./SelectedWork.module.css";

/** Background depth layer: iceberg crystals + a bathymetric depth map. */
const GALLERY_CRYSTALS: CrystalSpec[] = [
  { x: 1.5, y: 9, size: 88, depth: 0.8 },
  { x: 98.5, y: 30, size: 58, depth: 0.35 },
  { x: 1.5, y: 58, size: 68, depth: 0.5, hideOnMobile: true },
  { x: 98.5, y: 84, size: 104, depth: 0.9 },
];
const GALLERY_CONTOURS: ContourSpec[] = [
  { x: 100, y: 40, size: 760, rings: 12, seed: 1.3, labels: ["−10 m", "−40 m", "−90 m"] },
  { x: 0, y: 62, size: 560, rings: 10, seed: 4.1, labels: ["−20 m", "−60 m"], hideOnMobile: true },
];

const TAPE_A = ["Product engineering", "UX engineering", "Requirements & specs", "Interaction design", "Design systems"];
const TAPE_B = ["React", "Next.js", "React Native", "TypeScript", "Figma", "API integration", "Release readiness"];

export function SelectedWork() {
  const count = publishedProjects.length;
  return (
    <section id="work" className={s.work} aria-labelledby="work-title" data-palette="fixed">
      <WorkMotion>
        <header className={s.intro} data-surface="accent">
          <div className={`container ${s.introInner}`}>
            <p className={`eyebrow ${s.count}`}>
              ({String(count).padStart(2, "0")}) Case studies
            </p>
            <h2 id="work-title" className={`display ${s.title}`} data-drift data-split>
              {profile.work.title}
            </h2>
            <p className={s.lead}>{profile.work.intro}</p>
            <ul className={s.jump} role="list" aria-label="Jump to a case study">
              {publishedProjects.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className={s.jumpLink} data-magnetic>
                    <span className={s.jumpNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {p.short}
                    <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Decorative crossing tapes; they move with scroll. */}
        <div className={s.tapes} aria-hidden="true" data-surface="accent">
          <Tape words={TAPE_A} className={s.tapeA} dir="left" />
          <Tape words={TAPE_B} className={s.tapeB} dir="right" />
        </div>

        <div className={s.gallery}>
          <DepthField crystals={GALLERY_CRYSTALS} contours={GALLERY_CONTOURS} />
          <ol className={`container ${s.list}`} role="list">
            {publishedProjects.map((project, i) => (
              <li key={project.slug}>
                <WorkFeature project={project} index={i} />
              </li>
            ))}
          </ol>
          {exploreProjects.length > 0 && <Explore projects={exploreProjects} />}
        </div>
      </WorkMotion>
    </section>
  );
}

/** Side work, kept below the main gallery and visibly secondary to it. */
function Explore({ projects }: { projects: Project[] }) {
  return (
    <section id="explore" className={`container ${s.explore}`} aria-labelledby="explore-title">
      <div className={s.exploreHead}>
        <p className={`eyebrow ${s.exploreKicker}`}>
          <span className={s.exploreDot} aria-hidden="true" />
          Explore more
        </p>
        <h2 id="explore-title" className={`display ${s.exploreTitle}`} data-split>
          Beyond product work
        </h2>
        <p className={s.exploreLead}>
          Side projects in other worlds, from retail and spatial storytelling to whatever comes next.
        </p>
      </div>
      <ul className={s.exploreList} role="list">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <ExploreCard project={project} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExploreCard({ project, index }: { project: Project; index: number }) {
  const href = `/work/${project.slug}`;
  const titleId = `explore-${project.slug}`;
  return (
    <article className={s.exploreCard} aria-labelledby={titleId} data-feature>
      <Link href={href} className={s.exploreCover} tabIndex={-1} aria-hidden="true" data-tilt-host>
        <div className={s.tilt} data-tilt>
          <Cover cover={project.cover} />
        </div>
      </Link>
      <div className={s.exploreMeta} data-meta>
        <p className={`eyebrow ${s.exploreCategory}`}>
          <span aria-hidden="true">E{String(index + 1).padStart(2, "0")}</span>
          {project.category ?? project.band}
        </p>
        <h3 id={titleId} className={`display ${s.exploreCardTitle}`}>
          {project.title}
        </h3>
        <p className={s.summary}>{project.summary}</p>
        <ul className={s.exploreTags} role="list" aria-label="Disciplines">
          {project.disciplines.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <Link href={href} className={s.cta} aria-label={`Explore: ${project.title}`} data-magnetic>
          Explore the project
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

function Tape({ words, className, dir }: { words: string[]; className: string; dir: "left" | "right" }) {
  const run = [...words, ...words, ...words];
  return (
    <div className={`${s.tape} ${className}`}>
      <div className={s.tapeTrack} data-tape={dir}>
        {run.map((w, i) => (
          <span key={i} className={s.tapeItem}>
            {w}
            <span className={s.tapeStar}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function WorkFeature({ project, index }: { project: Project; index: number }) {
  const href = `/work/${project.slug}`;
  const titleId = `project-${project.slug}`;
  const flip = index % 2 === 1;

  return (
    <article
      className={`${s.feature} ${flip ? s.flip : ""}`}
      aria-labelledby={titleId}
      data-feature
    >
      {/* The visible CTA below is the accessible link; the cover is a
          pointer shortcut to the same page, hidden from AT and tab order. */}
      <Link
        href={href}
        className={s.coverLink}
        tabIndex={-1}
        aria-hidden="true"
        data-tilt-host
      >
        <div className={s.tilt} data-tilt>
          <Cover cover={project.cover} priority={index === 0} />
          <span className={s.band}>{project.band}</span>
        </div>
      </Link>

      <div className={s.meta} data-meta>
        <span className={s.index} aria-hidden="true" data-split>
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className={`eyebrow ${s.company}`}>
          <span className="sr-only">Project {index + 1}: </span>
          {project.company} · {project.workstream}
        </p>
        <h3 id={titleId} className={`display ${s.projectTitle}`} data-split>
          {project.title}
        </h3>
        <p className={s.summary}>{project.summary}</p>
        <dl className={s.facts}>
          <div>
            <dt>My contribution</dt>
            <dd>{project.contribution}</dd>
          </div>
          <div>
            <dt>Platform</dt>
            <dd>{project.platforms.join(" · ")}</dd>
          </div>
          <div>
            <dt>Discipline</dt>
            <dd>{project.disciplines.join(" · ")}</dd>
          </div>
        </dl>
        <Link
          href={href}
          className={s.cta}
          aria-label={`Read case study: ${project.title}`}
          data-magnetic
        >
          Read case study
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}
