"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { DepthFacets, INFINITY_PATH, MASK_PATH, TipFacets } from "./IcebergArt";
import s from "./IcebergStory.module.css";

const STEPS = [
  {
    kicker: "01 — The surface",
    title: "What you see",
    body: "Gamersberg is an iceberg. What players meet is the surface: clean, simple and easy to love.",
  },
  {
    kicker: "02 — The depth",
    title: "What goes underneath",
    body: "Most of an iceberg — about 90% — sits below the waterline. That’s the deep research and care behind every screen.",
  },
  {
    kicker: "03 — The mask",
    title: "Infinity, worn as a mask",
    body: "Gamers build identities online. The infinity sign becomes a mask for that identity — and says there’s no ceiling.",
  },
  {
    kicker: "04 — Meet Peak",
    title: "The logo, brought to life",
    body: "Iceberg plus mask is the Gamersberg mark. Give it a body and you get Peak — the mascot who plays, launches and peeks into the product.",
  },
];

/**
 * Scroll-driven explainer for the Gamersberg identity.
 * Desktop: text steps scroll on the left while a sticky scene is scrubbed.
 * Mobile: the scene sticks under the nav and the steps scroll beneath it.
 * Reduced motion / no JS: the scene rests on its final state (logo + Peak).
 */
export function IcebergStory({ caption }: { caption: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const [steps] = q("[data-steps]");
      const [camera] = q("[data-camera]");
      const [tip] = q("[data-tip]");
      const [inf] = q("[data-inf]") as unknown as SVGPathElement[];
      const [mask] = q("[data-mask]");
      const [logo] = q("[data-logo]");
      const [peak] = q("[data-peak]");
      const [count] = q("[data-count]");
      const [gauge] = q("[data-gauge]");
      const stepEls = q("[data-step]");

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const len = inf.getTotalLength();
        const depth = { v: 0 };
        const writeDepth = () => {
          count.textContent = depth.v < 1 ? "Surface" : `${Math.round(depth.v)}% below`;
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: steps,
            start: "top 55%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        });

        // Initial state, applied immediately (the markup rests on the final
        // state: logo left, Peak right, drawing hidden). Reverted with the
        // matchMedia context. xPercent 45 centres the logo.
        gsap.set(logo, { opacity: 0, scale: 0.94, xPercent: 45 });
        gsap.set(peak, { opacity: 0, yPercent: 18, rotation: 4 });
        gsap.set(tip, { opacity: 1 });
        gsap.set(mask, { opacity: 0, scale: 0.9, svgOrigin: "300 214" });
        gsap.set(inf, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        writeDepth();

        // 1. The tip surfaces.
        tl.fromTo(tip, { y: 46 }, { y: 0, duration: 0.8, ease: "power2.out" }, 0.05);

        // 2. Dive: the camera pans down to the underwater mass.
        tl.to(camera, { y: -300, duration: 0.9, ease: "power1.inOut" }, 1.05).to(
          depth,
          { v: 90, duration: 0.9, onUpdate: writeDepth },
          1.05,
        );

        // 3. Surface again; the infinity sign draws and becomes the mask.
        tl.to(camera, { y: 0, duration: 0.5, ease: "power1.inOut" }, 2.0)
          .to(depth, { v: 0, duration: 0.5, onUpdate: writeDepth }, 2.0)
          .to(inf, { strokeDashoffset: 0, duration: 0.45 }, 2.35)
          .to(mask, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, 2.72)
          .to(inf, { opacity: 0, duration: 0.2 }, 2.85);

        // 4. The drawing becomes the real logo; Peak arrives.
        tl.to([tip, mask], { opacity: 0, duration: 0.3 }, 3.05)
          .to(logo, { opacity: 1, scale: 1, duration: 0.3 }, 3.05)
          .to(logo, { xPercent: 0, duration: 0.35, ease: "power2.inOut" }, 3.25)
          .to(gauge, { opacity: 0, duration: 0.2 }, 3.25)
          .to(peak, { opacity: 1, yPercent: 0, rotation: 0, duration: 0.45, ease: "power3.out" }, 3.4);

        // Highlight the active step (dimming only applies while JS runs).
        el.classList.add(s.live);
        stepEls.forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            toggleClass: { targets: step, className: s.active },
          });
        });
        return () => el.classList.remove(s.live);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.story} aria-labelledby="story-title">
      <div className={`container ${s.grid}`}>
        <header className={s.head}>
          <p className={`eyebrow ${s.eyebrow}`}>The idea</p>
          <h2 id="story-title" className={`display ${s.title}`}>
            Surface, depth and a&nbsp;mask
          </h2>
          <p className={s.caption}>{caption}</p>
        </header>
        <ol className={s.steps} data-steps role="list">
          {STEPS.map((step) => (
            <li key={step.kicker} className={s.step} data-step>
              <p className={s.kicker}>{step.kicker}</p>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.body}>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className={s.stageCol}>
          <div className={s.stage} aria-hidden="true">
            <svg className={s.scene} viewBox="0 0 600 520" focusable="false">
              <defs>
                <linearGradient id="story-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#081a47" />
                  <stop offset="1" stopColor="#1a4a9c" />
                </linearGradient>
                <linearGradient id="story-water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0c2f68" />
                  <stop offset="0.5" stopColor="#061a42" />
                  <stop offset="1" stopColor="#020816" />
                </linearGradient>
                <linearGradient id="story-tint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#020816" stopOpacity="0" />
                  <stop offset="1" stopColor="#020816" stopOpacity="0.85" />
                </linearGradient>
                <radialGradient id="story-glow" cx="0.5" cy="0.9" r="0.6">
                  <stop offset="0" stopColor="#6fb3ff" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#6fb3ff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g data-camera>
                <rect x="0" y="-400" width="600" height="660" fill="url(#story-sky)" />
                <rect x="0" y="-60" width="600" height="320" fill="url(#story-glow)" />
                <g fill="#fff">
                  <circle cx="60" cy="40" r="1.6" opacity="0.8" />
                  <circle cx="140" cy="110" r="1.1" opacity="0.6" />
                  <circle cx="470" cy="50" r="1.6" opacity="0.7" />
                  <circle cx="540" cy="140" r="1.1" opacity="0.6" />
                  <circle cx="380" cy="24" r="1.2" opacity="0.5" />
                  <circle cx="230" cy="30" r="1" opacity="0.5" />
                </g>
                <rect x="0" y="260" width="600" height="800" fill="url(#story-water)" />
                <DepthFacets dy={260} />
                <rect x="0" y="260" width="600" height="520" fill="url(#story-tint)" />
                <g data-tip opacity="0">
                  <TipFacets />
                </g>
                <path
                  d="M0 260 C60 254 120 266 180 260 C240 254 300 266 360 260 C420 254 480 266 540 260 C570 257 590 262 600 260"
                  fill="none"
                  stroke="#bfe3ff"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                />
                <g data-mask opacity="0">
                  <path d={MASK_PATH} fill="#9cc8ff" fillRule="evenodd" transform="translate(0 6)" />
                  <path d={MASK_PATH} fill="#ffffff" fillRule="evenodd" />
                </g>
                <path
                  data-inf
                  d={INFINITY_PATH}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0"
                />
                {/* Depth gauge */}
                <g stroke="#bfe3ff" strokeOpacity="0.5">
                  <line x1="566" y1="262" x2="566" y2="720" strokeDasharray="3 5" />
                  {[300, 360, 420, 480, 540, 600, 660].map((y) => (
                    <line key={y} x1="560" y1={y} x2="572" y2={y} />
                  ))}
                </g>
              </g>
            </svg>

            <span className={s.gauge} data-gauge>
              <span className={s.gaugeDot} />
              <span data-count>Surface</span>
            </span>

            <div className={s.logo} data-logo>
              <Image
                src="/images/work/brand-identity/gamersberg-logo.png"
                width={457}
                height={408}
                alt=""
                sizes="(max-width: 899px) 50vw, 26vw"
              />
            </div>
            <div className={s.peak} data-peak>
              <Image
                src="/images/work/brand-identity/peak-rocket.png"
                width={408}
                height={605}
                alt=""
                sizes="(max-width: 899px) 34vw, 18vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
