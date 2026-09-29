import Link from "next/link";
import type { ReactNode } from "react";
import { getProject, statusLabel, type ItemStatus, type Project } from "@/content/projects";
import { profile } from "@/content/profile";
import { Cover } from "@/components/work/Cover";
import { ArrowRight } from "@/components/ArrowRight";
import { MediaFigure } from "./MediaFigure";
import { IcebergStory } from "@/components/brand/IcebergStory";
import { CaseStudyMotion } from "./CaseStudyMotion";
import s from "./CaseStudy.module.css";

export function CaseStudy({ project, index }: { project: Project; index: number }) {
  const cs = project.caseStudy;
  const next = project.next ? getProject(project.next) : undefined;
  const num = String(index + 1).padStart(2, "0");
  const [labelA, labelB] = cs.decisionLabels ?? ["Interface", "Behaviour"];
  const stories = cs.media.filter((m) => m.kind === "story");
  const figures = cs.media.filter((m) => m.kind !== "story");

  return (
    <CaseStudyMotion>
      <article className={s.case} aria-labelledby="case-title">
        <header className={`container ${s.head}`}>
          <Link href="/#work" className={s.back}>
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className={`eyebrow ${s.kicker}`}>
            Case study {num} · {project.company} · {project.workstream}
          </p>
          <h1 id="case-title" className={`display ${s.title}`} data-split>
            {project.title}
          </h1>
          <p className={s.summary}>{project.summary}</p>
        </header>

        {/* 1. Large product preview */}
        <div className={`container ${s.preview}`}>
          <div data-preview className={s.previewInner}>
            <Cover cover={project.cover} priority />
          </div>
        </div>

        {/* 2. Overview */}
        <Section id="overview" label="Overview">
          <p className={s.lede}>{cs.overview}</p>
        </Section>

        {/* Scroll-driven explainer, when a project has one */}
        {stories.map((m) =>
          m.kind === "story" && m.story === "iceberg" ? (
            <IcebergStory key={m.story} caption={m.caption} />
          ) : null,
        )}

        {/* 3. Role, scope, collaborators, status */}
        <Section id="role" label="Role & scope">
          <dl className={s.roleGrid}>
            <div>
              <dt>My contribution</dt>
              <dd>{cs.role.contribution}</dd>
            </div>
            <div>
              <dt>Collaborators</dt>
              <dd>{cs.role.collaborators}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{project.platforms.join(" · ")}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{cs.role.status}</dd>
            </div>
          </dl>
          <ul className={s.scope} role="list" aria-label="Scope and status of each part">
            {cs.scope.map((item) => (
              <li key={item.label}>
                <span className={s.scopeLabel}>
                  {item.label}
                  {item.note && <span className={s.note}>{item.note}</span>}
                </span>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Problem and constraints */}
        <Section id="problem" label="Problem & constraints">
          <p className={s.lede}>{cs.problem}</p>
          <ul className={s.constraints} role="list">
            {cs.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>

        {/* 5. Key decisions */}
        <Section id="decisions" label="Key decisions">
          <ol className={s.decisions} role="list">
            {cs.decisions.map((d, i) => (
              <li key={d.title} className={s.decision}>
                <span className={s.decisionNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={s.decisionBody}>
                  <h3 className={s.decisionTitle}>
                    {d.title}
                    {d.status && <StatusBadge status={d.status} />}
                  </h3>
                  <dl className={s.decisionDl}>
                    <div>
                      <dt>{labelA}</dt>
                      <dd>{d.interface}</dd>
                    </div>
                    <div>
                      <dt>{labelB}</dt>
                      <dd>{d.behaviour}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* 6. Visuals and interaction demonstrations */}
        {figures.length > 0 && (
          <Section id="interface" label={cs.decisionLabels ? "The work" : "In the interface"} wide>
            <div className={s.media}>
              {figures.map((m, i) => (
                <MediaFigure key={i} media={m} />
              ))}
            </div>
          </Section>
        )}

        {/* 7. What I implemented vs the team */}
        <Section id="ownership" label="Who built what">
          <div className={s.split}>
            <div>
              <h3 className={s.splitTitle}>My part</h3>
              <ul className={s.bullets}>
                {cs.implemented.mine.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.splitTitle}>The wider team</h3>
              <ul className={s.bullets}>
                {cs.implemented.team.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 8. Delivered behaviour */}
        <Section id="outcome" label="Delivered behaviour">
          <ul className={s.outcome} role="list">
            {cs.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Section>

        {/* 9. Reflection */}
        <Section id="reflection" label="Next iteration">
          <p className={s.lede}>{cs.reflection}</p>
        </Section>
      </article>

      {/* 10. Next project + contact */}
      <aside className={s.next} aria-labelledby="next-label">
        <div className={`container ${s.nextInner}`}>
          {next && (
            <>
              <h2 id="next-label" className={`eyebrow ${s.nextLabel}`}>
                Next case study
              </h2>
              <Link
                href={`/work/${next.slug}`}
                className={s.nextLink}
                aria-label={`Next case study: ${next.title}`}
              >
                <span className="display" data-split>
                  {next.title}
                </span>
                <ArrowRight className={s.nextArrow} />
              </Link>
            </>
          )}
          <div className={s.nextContact}>
            <p>{profile.contact.lead}</p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </div>
      </aside>
    </CaseStudyMotion>
  );
}

function Section({
  id,
  label,
  wide,
  children,
}: {
  id: string;
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section className={`${s.section} ${wide ? s.wide : ""}`} aria-labelledby={headingId}>
      <div className={`container ${s.sectionInner}`}>
        <h2 id={headingId} className={`eyebrow ${s.label}`}>
          {label}
        </h2>
        <div className={s.sectionBody} data-reveal>
          {children}
        </div>
      </div>
    </section>
  );
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={s.badge} data-status={status}>
      {statusLabel[status]}
    </span>
  );
}
