"use client";

import { useRef } from "react";
import type { Decision } from "@/content/projects";
import { statusLabel } from "@/content/projects";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { DeviceShot } from "./DeviceShot";
import m from "./CaseMedia.module.css";
import s from "./CaseStudy.module.css";

/**
 * Key decisions, each paired with the screen that shows it.
 * Desktop (layout in CSS, so no jump at hydration): decisions scroll on the
 * left while a sticky stage on the right swaps to the matching screen
 * (instantly with reduced motion). Mobile: each screen sits inline under its
 * decision.
 */
export function DecisionStory({ decisions, labels }: { decisions: Decision[]; labels: [string, string] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 900px)", reduce: MQ.reduce }, (ctx) => {
        const { wide, reduce } = ctx.conditions as { wide: boolean; reduce: boolean };
        if (!wide) return;
        const k = reduce ? 0 : 1;
        const items = gsap.utils.toArray<HTMLElement>("[data-decision]", el);
        const shots = gsap.utils.toArray<HTMLElement>("[data-stage-shot]", el);
        const dots = gsap.utils.toArray<HTMLElement>("[data-stage-dot]", el);
        const counter = el.querySelector<HTMLElement>("[data-stage-count]");
        let active = -1;

        gsap.set(shots, { autoAlpha: 0, yPercent: 6, scale: 0.96 });
        const show = (i: number) => {
          if (i === active) return;
          const prev = active;
          active = i;
          if (prev >= 0) gsap.to(shots[prev], { autoAlpha: 0, yPercent: -5 * k, scale: 1 - 0.03 * k, duration: 0.45 * k, ease: "power2.in", overwrite: true });
          gsap.fromTo(
            shots[i],
            { autoAlpha: 0, yPercent: (prev < i ? 7 : -7) * k, scale: 1 - 0.04 * k },
            { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.7 * k, ease: "power3.out", overwrite: true, delay: prev >= 0 ? 0.12 * k : 0 },
          );
          items.forEach((it, j) => it.classList.toggle(m.decisionActive, j === i));
          dots.forEach((d, j) => d.classList.toggle(m.dotActive, j === i));
          if (counter) counter.textContent = String(i + 1).padStart(2, "0");
        };

        items.forEach((item, i) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => self.isActive && show(i),
          }),
        );
        show(0);

        return () => items.forEach((it) => it.classList.remove(m.decisionActive));
      });
    },
    { scope: root },
  );

  const total = String(decisions.length).padStart(2, "0");

  return (
    <div ref={root} className={m.story}>
      <ol className={m.storyList} role="list">
        {decisions.map((d, i) => (
          <li key={d.title} className={m.storyItem} data-decision>
            <span className={m.storyNum} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={m.storyTitle}>
              {d.title}
              {d.status && (
                <span className={s.badge} data-status={d.status}>
                  {statusLabel[d.status]}
                </span>
              )}
            </h3>
            <dl className={m.storyDl}>
              <div>
                <dt>{labels[0]}</dt>
                <dd>{d.interface}</dd>
              </div>
              <div>
                <dt>{labels[1]}</dt>
                <dd>{d.behaviour}</dd>
              </div>
            </dl>
            {d.shot && (
              <>
                {/* One description per screen for assistive tech, whatever the layout. */}
                <p className="sr-only">Screen: {d.shot.alt}</p>
                <div className={m.inlineShot}>
                  <DeviceShot shot={{ ...d.shot, alt: "" }} sizes="(max-width: 899px) 90vw, 40vw" />
                </div>
              </>
            )}
          </li>
        ))}
      </ol>

      <div className={m.stageCol} aria-hidden="true">
        <div className={m.stage}>
          <div className={m.stageShots}>
            {decisions.map((d) =>
              d.shot ? (
                <div key={d.title} className={m.stageShot} data-stage-shot>
                  <DeviceShot shot={{ ...d.shot, alt: "" }} sizes="(max-width: 899px) 1px, 46vw" />
                </div>
              ) : (
                <div key={d.title} className={m.stageShot} data-stage-shot />
              ),
            )}
          </div>
          <div className={m.stageMeta}>
            <span>
              <span data-stage-count>01</span> / {total}
            </span>
            <span className={m.dots}>
              {decisions.map((d) => (
                <i key={d.title} data-stage-dot />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
