"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { guide } from "@/content/guide";
import { profile } from "@/content/profile";
import { getProject, publishedProjects } from "@/content/projects";
import { ArrowRight } from "@/components/ArrowRight";
import s from "./Guide.module.css";

type Props = {
  pathname: string;
  onClose: () => void;
  onTour: () => void;
  onHide: () => void;
  /** Scroll to an in-page target, honouring reduced motion. */
  onJump: (selector: string) => void;
};

/** Quick actions that change with the page the visitor is on. */
export function GuideCard({ pathname, onClose, onTour, onHide, onJump }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const c = guide.card;
  const slug = pathname.startsWith("/work/") ? pathname.split("/")[2] : null;
  const project = slug ? getProject(slug) : undefined;
  const next = project?.next ? getProject(project.next) : undefined;
  const stat = project?.impact?.[0];

  // Non-modal dialog: focus moves in so keyboard users land on the actions.
  useEffect(() => {
    ref.current?.focus();
  }, []);

  let title: string = c.homeTitle;
  let body: React.ReactNode;

  if (project) {
    title = c.caseTitle;
    body = (
      <>
        <p className={s.cardIntro}>{project.summary}</p>
        {stat && (
          <p className={s.cardStat}>
            <span className="display">
              {stat.value}
              {stat.unit}
            </span>{" "}
            {stat.label.toLowerCase()}
          </p>
        )}
        <ul className={s.cardList} role="list">
          <li>
            <button type="button" onClick={() => onJump("#decisions-title")}>
              {c.decisions}
              <ArrowRight />
            </button>
          </li>
          {project.live && (
            <li>
              <a href={project.live.href} target="_blank" rel="noopener noreferrer" onClick={onClose}>
                {c.live}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )}
          {next && (
            <li>
              <Link href={`/work/${next.slug}`} onClick={onClose}>
                {c.next}: {next.short}
                <ArrowRight />
              </Link>
            </li>
          )}
          <li>
            <Link href="/#work" onClick={onClose}>
              {c.allWork}
              <ArrowRight />
            </Link>
          </li>
        </ul>
      </>
    );
  } else if (pathname.startsWith("/resume")) {
    title = c.resumeTitle;
    body = (
      <>
        <p className={s.cardIntro}>{c.resumeIntro}</p>
        <ul className={s.cardList} role="list">
          {profile.resume && (
            <li>
              <a href={profile.resume.href} download onClick={onClose}>
                {c.download}
                <span aria-hidden="true">↓</span>
              </a>
            </li>
          )}
          <li>
            <Link href="/#work" onClick={onClose}>
              {c.seeWork}
              <ArrowRight />
            </Link>
          </li>
        </ul>
      </>
    );
  } else {
    body = (
      <>
        <p className={s.cardIntro}>{c.homeIntro}</p>
        <ul className={s.cardChips} role="list" aria-label="Case studies">
          {publishedProjects.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} onClick={onClose}>
                <span className={s.chipNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.short}
              </Link>
            </li>
          ))}
        </ul>
        <ul className={s.cardList} role="list">
          {pathname === "/" && (
            <li>
              <button type="button" onClick={onTour}>
                {c.tour}
                <ArrowRight />
              </button>
            </li>
          )}
          {profile.resume && (
            <li>
              <Link href="/resume" onClick={onClose}>
                {c.resume}
                <ArrowRight />
              </Link>
            </li>
          )}
          <li>
            {pathname === "/" ? (
              <button type="button" onClick={() => onJump("#contact")}>
                {c.sayHi}
                <ArrowRight />
              </button>
            ) : (
              <Link href="/#contact" onClick={onClose}>
                {c.sayHi}
                <ArrowRight />
              </Link>
            )}
          </li>
        </ul>
      </>
    );
  }

  return (
    <div
      ref={ref}
      id="guide-card"
      className={s.card}
      role="dialog"
      aria-modal="false"
      aria-labelledby="guide-card-title"
      tabIndex={-1}
    >
      <div className={s.cardHead}>
        <h2 id="guide-card-title" className={`display ${s.cardTitle}`}>
          {title}
        </h2>
        <button type="button" className={s.cardClose} onClick={onClose} aria-label="Close guide">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {body}
      <button type="button" className={s.cardHide} onClick={onHide}>
        {c.hide}
      </button>
    </div>
  );
}
