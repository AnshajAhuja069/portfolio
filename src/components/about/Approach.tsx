"use client";

import { useRef } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { resume } from "@/content/resume";
import { gsap, useGSAP } from "@/lib/gsap";
import { lineReveal } from "@/lib/lineReveal";
import { ArrowRight } from "@/components/ArrowRight";
import s from "./Approach.module.css";

/** Most recent roles first; the full journey lives on /resume. */
const roles = resume.journey
  .filter((stop) => stop.kind === "work")
  .reverse()
  .slice(0, 3);

/**
 * "How I work": product, design and engineering as one loop, a line on data
 * and cloud stated as working knowledge, and the latest roles. Content is
 * static and fully visible; motion only adds a reveal.
 */
export function Approach() {
  const root = useRef<HTMLElement>(null);
  const { approach } = profile;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const undo = lineReveal(gsap.utils.toArray<HTMLElement>("[data-split]", el));
        // One trigger per card: on phones they stack, so each reveals as it arrives.
        gsap.utils.toArray<HTMLElement>("[data-pillar]", el).forEach((pillar) =>
          gsap.from(pillar, {
            y: 32,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: pillar, start: "top 88%", once: true },
          }),
        );
        return undo;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="approach" className={s.approach} aria-labelledby="approach-title" data-surface="paper">
      <div className={`container ${s.inner}`}>
        <header className={s.head}>
          <p className="eyebrow">{approach.eyebrow}</p>
          <h2 id="approach-title" className={`display ${s.title}`} data-split>
            {approach.title}
          </h2>
        </header>

        <ol className={s.pillars} role="list" data-pillars>
          {approach.pillars.map((p, i) => (
            <li key={p.title} className={s.pillar} data-pillar>
              <span className={s.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={s.pillarTitle}>{p.title}</h3>
              <p className={s.body}>{p.body}</p>
            </li>
          ))}
        </ol>

        <p className={s.data}>{approach.data}</p>

        <div className={s.roles}>
          <h3 className={s.rolesTitle}>Experience</h3>
          <ul className={s.roleList} role="list">
            {roles.map((r) => (
              <li key={r.id} className={s.role}>
                <span className={s.roleTitle}>{r.title}</span>
                <span className={s.roleOrg}>
                  {r.org} · {r.period}
                </span>
              </li>
            ))}
          </ul>
          <Link href="/resume" className={s.more} data-magnetic>
            Full journey and resume
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
