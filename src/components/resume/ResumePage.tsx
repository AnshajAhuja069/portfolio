import Link from "next/link";
import { profile } from "@/content/profile";
import { resume, type JourneyStop } from "@/content/resume";
import { Mascot } from "@/components/mascot/Mascot";
import { DepthField, type ContourSpec, type CrystalSpec } from "@/components/decor/DepthField";
import { ArrowRight } from "@/components/ArrowRight";
import { ResumeMotion } from "./ResumeMotion";
import s from "./Resume.module.css";

/** Background: a topographic map for the journey, plus a few crystals. */
const JOURNEY_CRYSTALS: CrystalSpec[] = [
  { x: 2, y: 12, size: 80, depth: 0.8 },
  { x: 98, y: 46, size: 108, depth: 0.9, hideOnMobile: true },
  { x: 2, y: 80, size: 58, depth: 0.4 },
];
const JOURNEY_CONTOURS: ContourSpec[] = [
  { x: 96, y: 16, size: 640, rings: 11, seed: 2.2, labels: ["2021", "2024", "2025"] },
  { x: 4, y: 66, size: 540, rings: 9, seed: 5.4, hideOnMobile: true },
];

export function ResumePage() {
  const pdf = profile.resume?.href;

  return (
    <ResumeMotion>
      {/* ---------- Header ---------- */}
      <header className={`container ${s.head}`}>
        <div className={s.headText}>
          <p className={`eyebrow ${s.eyebrow}`}>Resume · {profile.positioning}</p>
          <h1 className={`display ${s.title}`} data-split>
            {resume.heading}
          </h1>
          <p className={s.summary}>{resume.summary}</p>
          {pdf && <PdfActions pdf={pdf} />}
        </div>
        <div className={s.headMascot}>
          <Mascot />
        </div>
      </header>

      {/* ---------- Journey map ---------- */}
      <section className={s.journey} aria-labelledby="journey-title">
        <DepthField crystals={JOURNEY_CRYSTALS} contours={JOURNEY_CONTOURS} />
        <div className={`container ${s.journeyInner}`}>
          <div className={s.journeyHead}>
            <h2 id="journey-title" className={`display ${s.journeyTitle}`} data-split>
              Journey map
            </h2>
            <p className={s.journeyLead}>
              Scroll the route — from studying computer applications to leading visual and UX direction at Gamersberg.
            </p>
          </div>

          <div className={s.map} data-map>
            <div className={s.spine} aria-hidden="true">
              <span className={s.spineFill} data-spine-fill />
              <span className={s.traveler} data-traveler>
                <Mascot track={false} />
              </span>
            </div>

            <ol className={s.stops} role="list">
              {resume.journey.map((stop, i) => (
                <Stop key={stop.id} stop={stop} side={i % 2 === 0 ? "left" : "right"} />
              ))}
            </ol>
          </div>

          {/* End of the line — the spine stops at this node. */}
          <div className={s.now} data-stop>
            <span className={s.node} aria-hidden="true" />
            <p className={`eyebrow ${s.nowKicker}`}>Now</p>
            <p className={`display ${s.nowTitle}`}>Designing the experience. Building the interface.</p>
            <p className={s.nowLinks}>
              <Link href="/#work" className={s.pill} data-magnetic>
                See the work
                <ArrowRight />
              </Link>
              <Link href="/#contact" className={`${s.pill} ${s.pillGhost}`} data-magnetic>
                Let’s connect
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Toolkit ---------- */}
      <section className={`container ${s.toolkit}`} aria-labelledby="toolkit-title">
        <h2 id="toolkit-title" className={`display ${s.toolkitTitle}`} data-split>
          Toolkit
        </h2>
        <div className={s.groups} data-reveal>
          {resume.skills.map((g) => (
            <div key={g.group} className={s.group}>
              <h3 className={s.groupTitle}>{g.group}</h3>
              <ul className={s.chips} role="list">
                {g.items.map((item) => (
                  <li key={item} className={s.chip} data-chip>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Take the PDF ---------- */}
      {pdf && (
        <section className={s.end} data-surface="accent" aria-labelledby="pdf-title">
          <div className={`container ${s.endInner}`}>
            <h2 id="pdf-title" className={`display ${s.endTitle}`}>
              Take the one-pager with you.
            </h2>
            <PdfActions pdf={pdf} dark />
          </div>
        </section>
      )}
    </ResumeMotion>
  );
}

function PdfActions({ pdf, dark = false }: { pdf: string; dark?: boolean }) {
  return (
    <p className={`${s.actions} ${dark ? s.actionsDark : ""}`}>
      <a href={pdf} target="_blank" rel="noopener" className={s.pill} data-magnetic>
        View resume PDF
        <span className="sr-only"> (opens in a new tab)</span>
        <span aria-hidden="true">↗</span>
      </a>
      <a href={pdf} download="Anshaj-Ahuja-Resume.pdf" className={`${s.pill} ${s.pillGhost}`} data-magnetic>
        Download
        <span className="sr-only"> resume PDF</span>
        <span aria-hidden="true">↓</span>
      </a>
    </p>
  );
}

function Stop({ stop, side }: { stop: JourneyStop; side: "left" | "right" }) {
  return (
    <li className={`${s.stop} ${side === "right" ? s.right : ""}`} data-stop data-side={side}>
      <span className={s.node} aria-hidden="true" />
      <span className={s.year} aria-hidden="true" data-year>
        {stop.year}
      </span>
      <article className={s.card} data-card aria-labelledby={`stop-${stop.id}`}>
        <p className={s.period}>
          {stop.period}
          {stop.current && <span className={s.current}>Current</span>}
        </p>
        <h3 id={`stop-${stop.id}`} className={s.role}>
          {stop.title}
        </h3>
        <p className={s.org}>
          {stop.org}
          {stop.place && <span className={s.place}> · {stop.place}</span>}
        </p>
        {stop.highlights.length > 0 && (
          <ul className={s.highlights}>
            {stop.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <ul className={s.tags} role="list" aria-label="Focus">
          {stop.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {stop.links && (
          <p className={s.stopLinks}>
            {stop.links.map((l) => (
              <Link key={l.href} href={l.href} className={s.stopLink}>
                {l.label} case study
                <ArrowRight />
              </Link>
            ))}
          </p>
        )}
      </article>
    </li>
  );
}
