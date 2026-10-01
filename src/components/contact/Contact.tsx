"use client";

import { useRef } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { Mascot } from "@/components/mascot/Mascot";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { CopyEmailButton } from "./CopyEmailButton";
import s from "./Contact.module.css";

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const heading = root.current?.querySelector<HTMLElement>("[data-split]");
      if (!heading) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isMobile = window.matchMedia("(max-width: 899.98px)").matches;
        // aria: "auto" keeps the full sentence as the heading's accessible
        // name and hides the split fragments from assistive tech.
        const split = SplitText.create(heading, {
          type: "lines,words",
          mask: "lines",
          linesClass: "split-line",
          aria: "auto",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.words, {
              yPercent: 135,
              duration: isMobile ? 0.6 : 0.8,
              ease: "power4.out",
              stagger: 0.06,
              scrollTrigger: { trigger: heading, start: "top 78%", once: true },
            });
          },
        });
        // The mascot pops back in as the page closes.
        const mascot = root.current?.querySelector("[data-contact-mascot]");
        if (mascot) {
          gsap.from(mascot, {
            scale: 0.4,
            rotation: -16,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(1.9)",
            scrollTrigger: { trigger: mascot, start: "top 88%", once: true },
          });
        }

        return () => split.revert();
      });
    },
    { scope: root },
  );

  const { email, phone, links, resume, contact } = profile;

  return (
    <section ref={root} id="contact" className={s.contact} aria-labelledby="contact-title" data-surface="paper">
      <div className={`container ${s.inner}`}>
        <div className={s.headRow}>
          <h2 id="contact-title" className={`display ${s.heading}`} data-split>
            {contact.heading}
          </h2>
          <div className={s.mascot} data-contact-mascot>
            <Mascot greetOnView />
          </div>
        </div>

        <div className={s.body}>
          <p className={s.lead}>{contact.lead}</p>

          <div className={s.emailRow}>
            <a className={s.email} href={`mailto:${email}`}>
              {email}
            </a>
            <CopyEmailButton email={email} />
          </div>

          <a className={s.phone} href={phone.href}>
            <span className={`eyebrow ${s.phoneLabel}`}>Call</span>
            {phone.display}
          </a>

          <ul className={s.links} role="list">
            <li>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" data-magnetic>
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
            <li>
              <a href={links.github} target="_blank" rel="noopener noreferrer" data-magnetic>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
            {resume && (
              <li>
                <Link href="/resume" data-magnetic>
                  {resume.label}
                  <span aria-hidden="true"> →</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
