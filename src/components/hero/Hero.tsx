"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { TalkingMascot } from "@/components/guide/TalkingMascot";
import { guide } from "@/content/guide";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import styles from "./Hero.module.css";

/**
 * Hero with the colour-field transition.
 *
 * Two layers render the same content:
 *  - base: paper background, ink text. The real, accessible content.
 *  - overlay: accent background, paper headline, ink small text. A visual
 *    duplicate (aria-hidden + inert) clipped by a circle that starts as the
 *    mascot disc and grows on scroll — text inverts exactly at its edge.
 * See docs/motion-spec.md §1.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const [track] = q("[data-hero-track]");
      const [stage] = q("[data-hero-stage]");
      const [frame] = q("[data-hero-frame]");
      const [overlay] = q("[data-hero-overlay]");
      const [disc] = q("[data-hero-disc]");

      /** Circle geometry in the overlay's coordinate space. */
      const geom = () => {
        const o = overlay.getBoundingClientRect();
        const d = disc.getBoundingClientRect();
        const cx = d.left - o.left + d.width / 2;
        const cy = d.top - o.top + d.height / 2;
        const r0 = d.width / 2;
        const far = Math.max(
          Math.hypot(cx, cy),
          Math.hypot(o.width - cx, cy),
          Math.hypot(cx, o.height - cy),
          Math.hypot(o.width - cx, o.height - cy),
        );
        return { cx, cy, r0, R: far * 1.02 };
      };
      const circle = (which: "start" | "end") => () => {
        const g = geom();
        const r = which === "start" ? g.r0 : g.R;
        return `circle(${r.toFixed(1)}px at ${g.cx.toFixed(1)}px ${g.cy.toFixed(1)}px)`;
      };

      // Tell the nav whether the teal field is under the wordmark, so its
      // negative pill can switch to the readable solid state (SurfaceWatcher).
      const [base] = q("[data-hero-base]");
      const CIRCLE = /circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px\)/;
      // Batched to one layout read per frame (GSAP may render several times
      // during a refresh; reading layout each time would thrash).
      let queued = false;
      const updateSurface = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          measureSurface();
        });
      };
      const measureSurface = () => {
        const mark = document.getElementById("nav-wordmark");
        const m = CIRCLE.exec(overlay.style.clipPath);
        if (!mark || !m || !base) return;
        const [r, cx, cy] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const o = overlay.getBoundingClientRect();
        const w = mark.getBoundingClientRect();
        const inside = Math.hypot(w.left + w.width / 2 - o.left - cx, w.top + w.height / 2 - o.top - cy) < r;
        const next = inside ? "accent" : "paper";
        if (base.dataset.surface !== next) {
          base.dataset.surface = next;
          window.dispatchEvent(new Event("surfacechange"));
        }
      };

      const mm = gsap.matchMedia();

      // Desktop and tall phones: the stage is sticky (CSS), so the field fills
      // while the hero is held in view.
      mm.add({ desktop: MQ.desktop, phone: MQ.mobileTall }, (ctx) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: updateSurface,
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            // Lighter smoothing on touch: iOS momentum scrolling already
            // smooths, and a long catch-up reads as a lag after the flick.
            scrub: ctx.conditions?.phone ? 0.3 : 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(
          overlay,
          { clipPath: circle("start") },
          { clipPath: circle("end"), duration: 0.72 },
        ).to(frame, { y: () => -0.06 * window.innerHeight, duration: 0.28 }, 0.72);
      });

      // Short screens: no sticky stage; the field grows as the hero scrolls away.
      mm.add(MQ.mobileShort, () => {
        gsap.fromTo(
          overlay,
          { clipPath: circle("start") },
          {
            clipPath: circle("end"),
            ease: "none",
            onUpdate: updateSurface,
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "bottom 40%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Web fonts change glyph widths → recompute the disc position.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.track} data-hero-track>
        <div className={styles.stage} data-hero-stage data-surface="accent">
          <div className={styles.frame} data-hero-frame>
            <HeroLayer variant="base" />
            <HeroLayer variant="overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroLayer({ variant }: { variant: "base" | "overlay" }) {
  const isBase = variant === "base";
  const { hero, positioning, location, name } = profile;
  const Heading = isBase ? "h1" : "p";

  return (
    <div
      className={`${styles.layer} ${isBase ? styles.base : styles.overlay}`}
      data-hero-overlay={isBase ? undefined : ""}
      data-hero-base={isBase ? "" : undefined}
      data-surface={isBase ? "paper" : undefined}
      aria-hidden={isBase ? undefined : true}
      inert={!isBase}
    >
      <div className={`container ${styles.content}`}>
        <p className={`eyebrow ${styles.eyebrow}`}>
          <span>{name}</span>
          <span className={styles.sep} aria-hidden="true">
            /
          </span>
          <span>{positioning}</span>
          <span className={styles.sep} aria-hidden="true">
            /
          </span>
          <span>{location}</span>
        </p>

        <Heading id={isBase ? "hero-title" : undefined} className={`display ${styles.headline}`}>
          {hero.lines.map((line, i) => {
            const last = i === hero.lines.length - 1;
            return (
              <span key={line} className={styles.line}>
                {line}
                {last && (
                  <span className={styles.discSlot} aria-hidden="true">
                    {isBase && (
                      <span className={styles.disc} data-hero-disc data-guide-away>
                        <TalkingMascot
                          id="hero"
                          variant="hero"
                          onView={guide.hero.onView}
                          clicks={guide.hero.clicks}
                          quietAfter={40}
                        />
                      </span>
                    )}
                  </span>
                )}
                {!last && " "}
              </span>
            );
          })}
        </Heading>

        <div className={styles.foot}>
          <p className={styles.intro}>{hero.intro}</p>
          {isBase ? (
            <a href="#work" className={styles.cue} data-magnetic>
              {hero.cue}
              <Arrow />
            </a>
          ) : (
            <span className={styles.cue}>
              {hero.cue}
              <Arrow />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M8 2v11M3 8.5l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
