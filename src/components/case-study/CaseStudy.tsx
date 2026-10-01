import Link from "next/link";
import type { ReactNode } from "react";
import { getProject, statusLabel, type ItemStatus, type Media, type Project } from "@/content/projects";
import { profile } from "@/content/profile";
import { Cover } from "@/components/work/Cover";
import { ArrowRight } from "@/components/ArrowRight";
import { IcebergStory } from "@/components/brand/IcebergStory";
import { CaseStudyMotion } from "./CaseStudyMotion";
import { DecisionStory } from "./DecisionStory";
import { DeviceShot } from "./DeviceShot";
import { LiveLink } from "./LiveLink";
import { LiveDock } from "./LiveDock";
import { ReplyComposerDemo } from "./demos/ReplyComposerDemo";
import m from "./CaseMedia.module.css";
import s from "./CaseStudy.module.css";

type ShotMedia = Extract<Media, { kind: "shot" }>;

export function CaseStudy({ project, index }: { project: Project; index: number }) {
  const cs = project.caseStudy;
  const next = project.next ? getProject(project.next) : undefined;
  const num = String(index + 1).padStart(2, "0");
  const labels = cs.decisionLabels ?? (["Interface", "Behaviour"] as [string, string]);
  const story = cs.media.find((x) => x.kind === "story");
  const showcase = cs.media.find((x): x is ShotMedia => x.kind === "shot" && x.placement === "showcase");
  const gallery = cs.media.filter(
    (x) => (x.kind === "shot" && x.placement !== "showcase") || x.kind === "demo",
  );

  return (
    <CaseStudyMotion>
      <article className={s.case} aria-labelledby="case-title" data-surface="paper">
        {/* Header */}
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
          <ul className={s.chips} role="list" aria-label="At a glance">
            <li>{cs.role.status}</li>
            {project.platforms.map((p) => (
              <li key={p}>{p}</li>
            ))}
            {project.disciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {project.live && <LiveLink href={project.live.href} label={project.live.label} />}
        </header>

        {/* Large preview */}
        <div className={`container ${s.preview}`}>
          <div data-preview className={s.previewInner}>
            <Cover cover={project.cover} priority />
          </div>
        </div>

        {/* Impact at scale */}
        {project.impact && project.impact.length > 0 && (
          <section className={`container ${s.impact}`} aria-labelledby="impact-title">
            <div className={s.impactHead}>
              <h2 id="impact-title" className={`eyebrow ${s.impactLabel}`}>
                Impact at scale
              </h2>
              <p className={s.impactScope}>Gamersberg, during my tenure</p>
            </div>
            <ul className={s.impactRow} role="list" data-reveal>
              {project.impact.map((st) => (
                <li key={st.label} className={s.stat}>
                  <span className={`display ${s.statValue}`}>
                    {st.value}
                    {st.unit && <span className={s.statUnit}>{st.unit}</span>}
                  </span>
                  <span className={`eyebrow ${s.statLabel}`}>{st.label}</span>
                  <span className={s.statNote}>{st.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Overview + role at a glance */}
        <Section id="overview" label="Overview">
          <p className={s.lede}>{cs.overview}</p>
          <dl className={s.roleGrid}>
            <div>
              <dt>My contribution</dt>
              <dd>{cs.role.contribution}</dd>
            </div>
            <div>
              <dt>Worked with</dt>
              <dd>{cs.role.collaborators}</dd>
            </div>
          </dl>
        </Section>
      </article>

      {/* Scroll-driven explainer (brand) */}
      {story && story.kind === "story" && story.story === "iceberg" && <IcebergStory caption={story.caption} />}

      {/* The product: one large, framed screen */}
      {showcase && (
        <section className={m.band} aria-labelledby="showcase-title" data-surface="auto">
          <div className={`container ${m.bandInner}`}>
            <div className={m.bandHead}>
              <div>
                <p className={`eyebrow ${m.bandLabel}`}>The product</p>
                <h2 id="showcase-title" className={`display ${m.bandTitle}`} data-split>
                  See it in context
                </h2>
              </div>
              <p className={m.bandCaption}>{showcase.caption}</p>
            </div>
            <div className={m.showcase} data-showcase>
              <DeviceShot shot={showcase.shot} sizes="(max-width: 1760px) 94vw, 1650px" />
            </div>
            {project.live && <LiveLink href={project.live.href} label={project.live.label} tone="dark" />}
          </div>
        </section>
      )}

      <div className={s.case} data-surface="paper">
        {/* Problem */}
        <Section id="problem" label="The problem">
          <p className={s.lede}>{cs.problem}</p>
          <ul className={s.constraints} role="list">
            {cs.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>

        {/* Decisions, each paired with its screen */}
        <section className={s.decisionsSection} aria-labelledby="decisions-title">
          <div className="container">
            <h2 id="decisions-title" className={`eyebrow ${s.label} ${s.labelInline}`}>
              Key decisions
            </h2>
            <DecisionStory decisions={cs.decisions} labels={labels} />
          </div>
        </section>
      </div>

      {/* More from the product */}
      {gallery.length > 0 && (
        <section className={m.band} aria-labelledby="gallery-title" data-surface="auto">
          <div className={`container ${m.bandInner}`}>
            <div className={m.bandHead}>
              <div>
                <p className={`eyebrow ${m.bandLabel}`}>{cs.decisionLabels ? "The character" : "More from the product"}</p>
                <h2 id="gallery-title" className={`display ${m.bandTitle}`} data-split>
                  {cs.decisionLabels ? "Meet Peak, in full" : "Beyond the chat"}
                </h2>
              </div>
            </div>
            <div className={m.gallery} data-reveal>
              {gallery.map((g, i) =>
                g.kind === "shot" ? (
                  <figure
                    key={i}
                    className={`${m.galleryItem} ${
                      g.compact ? m.galleryCompact : g.shot.frame !== "phone" ? m.galleryWide : ""
                    }`}
                  >
                    <DeviceShot
                      shot={g.shot}
                      sizes={
                        g.shot.frame === "phone"
                          ? "300px"
                          : g.compact
                            ? "(max-width: 600px) 94vw, 460px"
                            : "(max-width: 1760px) 94vw, 1650px"
                      }
                    />
                    <figcaption className={m.galleryCaption}>{g.caption}</figcaption>
                  </figure>
                ) : g.kind === "demo" ? (
                  <figure key={i} className={m.galleryItem}>
                    <div className={m.demoCard} data-surface="paper">
                      <ReplyComposerDemo />
                    </div>
                    <figcaption className={m.galleryCaption}>{g.caption}</figcaption>
                  </figure>
                ) : null,
              )}
            </div>
          </div>
        </section>
      )}

      <div className={s.case} data-surface="paper">
        {/* Scope and ownership */}
        <Section id="ownership" label="Scope & ownership">
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

        {/* Outcome + next iteration */}
        <Section id="outcome" label="What changed">
          <ul className={s.outcome} role="list">
            {cs.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <div className={s.reflection}>
            <h3 className={s.splitTitle}>Next iteration</h3>
            <p className={s.lede}>{cs.reflection}</p>
          </div>
        </Section>
      </div>

      {/* Next project + contact */}
      <aside className={s.next} aria-labelledby="next-label" data-live-stop>
        <div className={`container ${s.nextInner}`}>
          {next && (
            <>
              <h2 id="next-label" className={`eyebrow ${s.nextLabel}`}>
                Next case study
              </h2>
              <Link href={`/work/${next.slug}`} className={s.nextLink} aria-label={`Next case study: ${next.title}`}>
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

      {project.live && <LiveDock href={project.live.href} label={project.live.label} />}
    </CaseStudyMotion>
  );
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const headingId = `${id}-title`;
  return (
    <section className={s.section} aria-labelledby={headingId}>
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
