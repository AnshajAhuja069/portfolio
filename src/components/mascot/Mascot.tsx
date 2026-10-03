"use client";

import { useId, useImperativeHandle, useRef, type Ref } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import styles from "./Mascot.module.css";

/** One-shot reactions the guide (or anything else) can trigger. */
export type MascotAction =
  | "wave"
  | "wink"
  | "nod"
  | "blush"
  | "lookAround"
  | "surprised"
  | "think"
  | "yawn"
  | "whoa"
  | "dizzy";

export type MascotHandle = {
  /** Play a reaction; a new one finishes the previous one instantly. */
  react: (action: MascotAction) => void;
  /** Glance in a direction, each axis from -1 to 1. */
  look: (dx: number, dy: number) => void;
};

const NOOP: MascotHandle = { react: () => {}, look: () => {} };

export type MascotProps = {
  /** Imperative handle for reactions (React 19 ref prop). */
  ref?: Ref<MascotHandle>;
  /** Built-in hover blush and tap nod. Off when a parent owns the clicks. */
  interactive?: boolean;
  /** Final resting expression. */
  expression?: "neutral" | "smile";
  /** Follow the pointer with eyes/head (fine pointers only). */
  track?: boolean;
  /** Smile + nod once the first time it scrolls into view. */
  greetOnView?: boolean;
  className?: string;
};

/**
 * Provisional mascot of Anshaj — an SVG drawn for this site from the concept
 * sheet, with soft gradient shading. Decorative: hidden from assistive tech.
 *
 * Layers are separate groups (data-part) so they animate independently:
 * blink, pointer-follow, tap nod, hover blush + smile, greeting.
 * To replace the art, keep the data-part names (docs/asset-manifest.md) or
 * swap this component for a GLB-based one with the same props.
 */
export function Mascot({
  ref,
  interactive = true,
  expression = "neutral",
  track = true,
  greetOnView = false,
  className,
}: MascotProps) {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `m${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  // Reactions live inside the GSAP context below (motion or reduced); the
  // handle forwards to whichever implementation is current.
  const api = useRef<MascotHandle>(NOOP);
  useImperativeHandle(
    ref,
    () => ({
      react: (a) => api.current.react(a),
      look: (dx, dy) => api.current.look(dx, dy),
    }),
    [],
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const [follow] = q("[data-part=follow]");
      const [nod] = q("[data-part=nod]");
      const [eyes] = q("[data-part=eyes]");
      const pupils = q("[data-part=pupil]");
      const [brows] = q("[data-part=brows]");
      const [mouth] = q("[data-part=mouth]");
      const [smile] = q("[data-part=smile]");
      const [mouthO] = q("[data-part=mouth-o]");
      const [eyeL] = q("[data-part=eye-l]");
      const [hand] = q("[data-part=hand]");
      const [orbit] = q("[data-part=orbit]");
      const blush = q("[data-part=blush]");

      // Expression state shared by hover, tap, the greeting and reactions.
      let resting = expression === "smile" && !greetOnView;
      const setFace = (smiling: boolean, blushing: boolean, duration: number) => {
        gsap.to(mouth, { opacity: smiling ? 0 : 1, duration, overwrite: "auto" });
        gsap.to(smile, { opacity: smiling ? 1 : 0, duration, overwrite: "auto" });
        gsap.to(mouthO, { opacity: 0, scale: 1, duration, overwrite: "auto" });
        gsap.to(blush, { opacity: blushing ? 0.6 : 0, duration: duration * 1.4, overwrite: "auto" });
      };
      /** Round "o" mouth for surprise and yawns. */
      const setO = (scale: number, duration: number) => {
        gsap.to([mouth, smile], { opacity: 0, duration, overwrite: "auto" });
        gsap.to(mouthO, { opacity: 1, scale, duration, overwrite: "auto" });
      };

      const mm = gsap.matchMedia();

      mm.add(MQ.reduce, () => {
        // Static; still show the intended expression and allow a hover blush.
        resting = expression === "smile" || greetOnView;
        setFace(resting, false, 0);
        // Reactions become instant face changes that settle back.
        let reset: gsap.core.Tween | null = null;
        api.current = {
          react: (a) => {
            reset?.kill();
            if (a === "surprised" || a === "whoa" || a === "yawn") setO(1, 0);
            else setFace(true, a === "blush" || a === "dizzy", 0);
            reset = gsap.delayedCall(1.2, () => setFace(resting, false, 0));
          },
          look: () => {},
        };
        const enter = () => setFace(true, true, 0);
        const leave = () => setFace(resting, false, 0);
        if (interactive) {
          el.addEventListener("pointerenter", enter);
          el.addEventListener("pointerleave", leave);
        }
        return () => {
          reset?.kill();
          api.current = NOOP;
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
        };
      });

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          fine: MQ.finePointer,
        },
        (ctx) => {
          const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
          if (!motion) return;

          gsap.set(follow, { svgOrigin: "100 150" });
          gsap.set(nod, { svgOrigin: "100 150" });
          gsap.set(eyes, { svgOrigin: "100 102" });
          gsap.set(eyeL, { svgOrigin: "84 102" });
          gsap.set(mouthO, { svgOrigin: "100 129" });
          gsap.set(hand, { svgOrigin: "162 172" });
          gsap.set(orbit, { svgOrigin: "100 96" });
          setFace(resting, false, 0);

          // --- Blink on a random timer (one reusable timeline + call).
          const blinkTl = gsap
            .timeline({ paused: true })
            .to(eyes, { scaleY: 0.1, duration: 0.07, ease: "power2.in" })
            .to(eyes, { scaleY: 1, duration: 0.1, ease: "power2.out" });
          const blinkCall = gsap.delayedCall(3, () => {
            blinkTl.restart();
            blinkCall.delay(gsap.utils.random(2.8, 6)).restart(true);
          });
          blinkCall.pause();

          // --- Tap: brow lift + small nod (+ a quick blush on touch).
          const tapTl = gsap
            .timeline({ paused: true })
            .to(brows, { y: -3, duration: 0.16, ease: "power2.out" })
            .to(nod, { rotation: 4, y: 2, duration: 0.18, ease: "power2.out" }, 0)
            .to(brows, { y: 0, duration: 0.35, ease: "power2.inOut" }, 0.22)
            .to(nod, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" }, 0.18);

          // --- Greeting: smile + one nod.
          const greetTl = gsap
            .timeline({ paused: true })
            .to(nod, { rotation: 5, y: 3, duration: 0.25, ease: "power2.out" }, 0.15)
            .to(nod, { rotation: 0, y: 0, duration: 0.5, ease: "power2.inOut" }, 0.42);
          let greeted = false;

          // --- Pointer follow (quickTo: no React state per frame).
          const rotTo = gsap.quickTo(follow, "rotation", { duration: 0.5, ease: "power3.out" });
          const xTo = gsap.quickTo(follow, "x", { duration: 0.5, ease: "power3.out" });
          const pxTo = pupils.map((p) => gsap.quickTo(p, "x", { duration: 0.35, ease: "power3.out" }));
          const pyTo = pupils.map((p) => gsap.quickTo(p, "y", { duration: 0.35, ease: "power3.out" }));

          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const nx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / (window.innerWidth * 0.5));
            const ny = gsap.utils.clamp(-1, 1, (e.clientY - cy) / (window.innerHeight * 0.5));
            rotTo(nx * 2.5);
            xTo(nx * 3);
            pxTo.forEach((f) => f(nx * 2.6));
            pyTo.forEach((f) => f(ny * 1.8));
          };

          // --- Reactions: each is a short timeline that ends back at rest,
          // so finishing one early (progress 1) always leaves a clean face.
          let current: gsap.core.Timeline | null = null;
          const settle = (tl: gsap.core.Timeline, at?: number | string) =>
            tl.add(() => setFace(resting, false, 0.35), at);
          const glance = (x: number, y: number, d = 0.3) =>
            gsap.to(pupils, { x: x * 2.6, y: y * 1.8, duration: d, ease: "power3.out", overwrite: "auto" });

          const build: Record<MascotAction, () => gsap.core.Timeline> = {
            wave: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(true, false, 0.2))
                .to(hand, { y: 0, duration: 0.38, ease: "back.out(1.7)" }, 0)
                .to(hand, { rotation: -16, duration: 0.15, repeat: 5, yoyo: true, ease: "sine.inOut" })
                .to(hand, { rotation: 0, duration: 0.12 })
                .to(hand, { y: 80, duration: 0.4, ease: "power2.in" }, "+=0.15");
              return settle(tl);
            },
            wink: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(true, false, 0.15))
                .to(eyeL, { scaleY: 0.1, duration: 0.08, ease: "power2.in" }, 0)
                .to(eyeL, { scaleY: 1, duration: 0.14, ease: "power2.out" }, "+=0.38");
              return settle(tl, "+=0.4");
            },
            nod: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(true, false, 0.2))
                .to(nod, { rotation: 5, y: 3, duration: 0.22, ease: "power2.out" }, 0)
                .to(nod, { rotation: 0, y: 0, duration: 0.45, ease: "power2.inOut" })
                .to(nod, { rotation: 4, y: 2, duration: 0.2, ease: "power2.out" })
                .to(nod, { rotation: 0, y: 0, duration: 0.45, ease: "power2.inOut" });
              return settle(tl, "+=0.3");
            },
            blush: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(true, true, 0.25))
                .to(nod, { rotation: -4, duration: 0.3, ease: "power2.out" }, 0)
                .to(nod, { rotation: 0, duration: 0.5, ease: "power2.inOut" }, 1.1);
              return settle(tl, 1.4);
            },
            lookAround: () => {
              const tl = gsap.timeline();
              tl.add(() => glance(-1, 0, 0.25))
                .to(follow, { rotation: -3, duration: 0.3, ease: "power2.out" }, 0)
                .add(() => glance(1, 0, 0.3), 0.6)
                .to(follow, { rotation: 3, duration: 0.35, ease: "power2.inOut" }, 0.6)
                .add(() => glance(0, 0, 0.3), 1.25)
                .to(follow, { rotation: 0, duration: 0.3, ease: "power2.inOut" }, 1.25);
              return settle(tl, 1.6);
            },
            surprised: () => {
              const tl = gsap.timeline();
              tl.add(() => setO(1, 0.12))
                .to(brows, { y: -4, duration: 0.15, ease: "back.out(2)" }, 0)
                .to(eyes, { scaleY: 1.18, duration: 0.15, ease: "back.out(2)" }, 0)
                .to(brows, { y: 0, duration: 0.35, ease: "power2.inOut" }, 0.9)
                .to(eyes, { scaleY: 1, duration: 0.3, ease: "power2.inOut" }, 0.9);
              return settle(tl, 1);
            },
            think: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(false, false, 0.2))
                .add(() => glance(0.8, -1, 0.35), 0)
                .to(nod, { rotation: -5, duration: 0.4, ease: "power2.out" }, 0)
                .to(brows, { y: -2, rotation: -3, svgOrigin: "100 92", duration: 0.35 }, 0)
                .to(nod, { rotation: 0, duration: 0.45, ease: "power2.inOut" }, 1.3)
                .to(brows, { y: 0, rotation: 0, duration: 0.35 }, 1.3)
                .add(() => glance(0, 0, 0.3), 1.3);
              return settle(tl, 1.6);
            },
            yawn: () => {
              const tl = gsap.timeline();
              tl.add(() => setO(1.5, 0.4))
                .to(eyes, { scaleY: 0.3, duration: 0.4, ease: "power2.inOut" }, 0)
                .to(nod, { rotation: -3, y: -2, duration: 0.5, ease: "power2.out" }, 0)
                .to(eyes, { scaleY: 1, duration: 0.3, ease: "power2.out" }, 1.4)
                .to(nod, { rotation: 0, y: 0, duration: 0.4, ease: "power2.inOut" }, 1.4);
              return settle(tl, 1.4);
            },
            whoa: () => {
              const tl = gsap.timeline();
              tl.add(() => setO(1.1, 0.1))
                .to(nod, { rotation: -6, y: -3, duration: 0.14, ease: "power2.out" }, 0)
                .to(brows, { y: -4, duration: 0.14 }, 0)
                .to(nod, { rotation: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 0.4)
                .to(brows, { y: 0, duration: 0.3 }, 0.45);
              return settle(tl, 0.75);
            },
            dizzy: () => {
              const tl = gsap.timeline();
              tl.add(() => setFace(false, true, 0.2))
                .to(orbit, { opacity: 1, duration: 0.2 }, 0)
                .to(orbit, { rotation: 720, duration: 1.8, ease: "power1.inOut" }, 0)
                .to(nod, { rotation: 8, duration: 0.22, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0)
                .to(eyes, { scaleY: 0.45, duration: 0.2 }, 0)
                .to(eyes, { scaleY: 1, duration: 0.3 }, 1.6)
                .to(nod, { rotation: 0, duration: 0.3 }, 1.5)
                .to(orbit, { opacity: 0, duration: 0.3 }, 1.6)
                .set(orbit, { rotation: 0 });
              return settle(tl, 1.8);
            },
          };

          api.current = {
            react: (a) => {
              current?.progress(1).kill();
              current = build[a]();
            },
            look: (dx, dy) => {
              pxTo.forEach((f) => f(gsap.utils.clamp(-1, 1, dx) * 2.6));
              pyTo.forEach((f) => f(gsap.utils.clamp(-1, 1, dy) * 1.8));
            },
          };

          let visible = false;
          let listening = false;
          const start = () => {
            if (!visible || document.hidden) return;
            if (blinkCall.paused()) blinkCall.delay(gsap.utils.random(1.5, 4)).restart(true);
            if (fine && track && !listening) {
              window.addEventListener("pointermove", onMove, { passive: true });
              listening = true;
            }
          };
          const stop = () => {
            blinkCall.pause();
            if (listening) {
              window.removeEventListener("pointermove", onMove);
              listening = false;
            }
          };

          const io = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting;
              if (visible) {
                start();
                if (greetOnView && !greeted && entry.intersectionRatio > 0.5) {
                  greeted = true;
                  resting = true;
                  setFace(true, false, 0.25);
                  greetTl.play();
                }
              } else {
                stop();
              }
            },
            { threshold: [0, 0.6] },
          );
          io.observe(el);

          const onVisibility = () => (document.hidden ? stop() : start());
          document.addEventListener("visibilitychange", onVisibility);

          // Hover (mouse/pen): blush + smile. Touch: tap blushes briefly.
          let blushTimer: gsap.core.Tween | null = null;
          const onEnter = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            setFace(true, true, 0.3);
          };
          const onLeave = (e: PointerEvent) => {
            if (e.pointerType === "touch") return;
            setFace(resting, false, 0.4);
          };
          const onTap = (e: PointerEvent) => {
            if (!tapTl.isActive()) tapTl.restart();
            if (e.pointerType === "touch") {
              setFace(true, true, 0.25);
              blushTimer?.kill();
              blushTimer = gsap.delayedCall(1.4, () => setFace(resting, false, 0.4));
            }
          };
          if (interactive) {
            el.addEventListener("pointerenter", onEnter);
            el.addEventListener("pointerleave", onLeave);
            el.addEventListener("pointerdown", onTap);
          }

          return () => {
            stop();
            blushTimer?.kill();
            current?.kill();
            api.current = NOOP;
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            el.removeEventListener("pointerenter", onEnter);
            el.removeEventListener("pointerleave", onLeave);
            el.removeEventListener("pointerdown", onTap);
          };
        },
      );
    },
    { scope: root, dependencies: [expression, track, greetOnView, interactive] },
  );

  const smiling = expression === "smile" && !greetOnView;

  return (
    <div ref={root} className={`${styles.mascot} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.svg} focusable="false">
        <defs>
          <radialGradient id={id("face")} cx="0.42" cy="0.36" r="0.72">
            <stop offset="0" stopColor="#f0c6a2" />
            <stop offset="0.55" stopColor="#e2ad85" />
            <stop offset="1" stopColor="#c98f69" />
          </radialGradient>
          <linearGradient id={id("hair")} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0" stopColor="#3d3129" />
            <stop offset="0.45" stopColor="#231b16" />
            <stop offset="1" stopColor="#120d0b" />
          </linearGradient>
          <linearGradient id={id("neck")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9d6645" />
            <stop offset="0.45" stopColor="#c08560" />
            <stop offset="1" stopColor="#c98f69" />
          </linearGradient>
          <linearGradient id={id("sweater")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c2a28" />
            <stop offset="1" stopColor="#111010" />
          </linearGradient>
          <radialGradient id={id("ear")} cx="0.4" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#e7b48d" />
            <stop offset="1" stopColor="#c68a63" />
          </radialGradient>
        </defs>

        <g data-part="follow">
          {/* Shoulders + crew-neck sweater */}
          <g data-part="shoulders">
            <path
              d="M14 206 C18 176 46 160 76 156 L124 156 C154 160 182 176 186 206 Z"
              fill={url("sweater")}
            />
            <ellipse cx="54" cy="174" rx="24" ry="5" fill="#fff" opacity="0.03" transform="rotate(-20 54 174)" />
            <path
              d="M80 157 C87 167 113 167 120 157"
              fill="none"
              stroke="#34312e"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
          {/* Neck, darker under the jaw */}
          <path data-part="neck" d="M88 130 L88 157 C94 163 106 163 112 157 L112 130 Z" fill={url("neck")} />

          <g data-part="nod">
            {/* Hair, back volume — loose, tousled silhouette */}
            <path
              data-part="hair-back"
              d="M56 108 C47 98 44 84 48 72 C42 60 48 44 60 40 C62 28 76 20 90 22 C98 12 116 12 124 20 C138 18 152 28 152 42 C162 50 162 66 154 76 C158 88 152 100 144 108 C140 104 136 98 134 92 L66 92 C64 98 60 104 56 108 Z"
              fill={url("hair")}
            />
            {/* Ears */}
            <ellipse cx="65" cy="106" rx="6.5" ry="10" fill={url("ear")} />
            <ellipse cx="135" cy="106" rx="6.5" ry="10" fill={url("ear")} />
            <path d="M63.5 101 C61.5 104 61.8 109 64 112" fill="none" stroke="#b67a55" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M136.5 101 C138.5 104 138.2 109 136 112" fill="none" stroke="#b67a55" strokeWidth="1.4" strokeLinecap="round" />

            {/* Face — long, with a defined jaw and slightly squared chin */}
            <path
              data-part="head"
              d="M66 88 C66 63 81 52 100 52 C119 52 134 63 134 88 L134 107 C134 117 132.6 124.5 128.5 130.5 C124 137 116 143 108.5 146.6 C103.6 148.7 96.4 148.7 91.5 146.6 C84 143 76 137 71.5 130.5 C67.4 124.5 66 117 66 107 Z"
              fill={url("face")}
            />
            {/* Side planes of the face (cheekbone → jaw) */}
            <path d="M66 96 C66 112 67.5 122 71.5 130.5 C70 119 70 108 71 98 Z" fill="#c1865f" opacity="0.45" />
            <path d="M134 96 C134 112 132.5 122 128.5 130.5 C130 119 130 108 129 98 Z" fill="#c1865f" opacity="0.45" />
            {/* Jaw shadow */}
            <path
              d="M70.5 127 C75.5 135.5 84 142 91.5 145.6 C96.4 147.7 103.6 147.7 108.5 145.6 C116 142 124.5 135.5 129.5 127 C126.5 134 120 140 112 143.6 C106 146 94 146 88 143.6 C80 140 73.5 134 70.5 127 Z"
              fill="#b57a55"
              opacity="0.55"
            />
            {/* Blush (hover / tap) */}
            <ellipse data-part="blush" cx="78" cy="118.5" rx="7.5" ry="4" fill="#f2877e" opacity="0" />
            <ellipse data-part="blush" cx="122" cy="118.5" rx="7.5" ry="4" fill="#f2877e" opacity="0" />

            {/* Soft shadow cast by the fringe on the forehead */}
            <path
              d="M58 89 C55 65 72 46 96 44 C121 42 143 56 145 81 Q139 75 136 77 Q134 84 131 89 Q127 82 121 81 Q114 89 102 96 Q101 87 95 83 Q90 86 84 89 Q81 83 76 83 Q71 86 66 89 Q61 85 58 89 Z"
              fill="#a86c4b"
              opacity="0.35"
            />
            {/* Hair, front fringe — pointed locks, one falling between the brows */}
            <path
              data-part="hair-front"
              d="M58 86 C55 62 72 43 96 41 C121 39 143 53 145 78 Q139 72 136 74 Q134 81 131 86 Q127 79 121 78 Q114 86 102 93 Q101 84 95 80 Q90 83 84 86 Q81 80 76 80 Q71 83 66 86 Q61 82 58 86 Z"
              fill={url("hair")}
            />
            <g data-part="hair-texture" fill="none" stroke="#4d4037" strokeWidth="2" strokeLinecap="round">
              <path d="M78 50 C90 44 104 46 112 54" />
              <path d="M118 46 C128 48 136 56 138 64" />
              <path d="M66 62 C72 54 80 51 88 52" />
              <path d="M96 26 C104 22 114 24 118 30" />
            </g>
            {/* Brows */}
            <g data-part="brows" fill="none" stroke="#1a1411" strokeWidth="5.4" strokeLinecap="round">
              <path d="M73 93 C79 89.4 87 88.8 93 91.3" />
              <path d="M107 91.3 C113 88.8 121 89.4 127 93" />
            </g>
            {/* Eyes (group scales on blink; the left eye alone winks) */}
            <g data-part="eyes">
              <g data-part="eye-l">
                <ellipse cx="84" cy="102" rx="6.4" ry="3.7" fill="#f6eee4" />
                <g data-part="pupil">
                  <circle cx="84" cy="102" r="3" fill="#2a1b14" />
                  <circle cx="85" cy="101" r="0.85" fill="#fff" />
                </g>
                <path d="M77.4 100.6 C81 97.4 87 97.4 90.6 100.6" fill="none" stroke="#3a2518" strokeWidth="1.7" strokeLinecap="round" />
              </g>
              <g data-part="eye-r">
                <ellipse cx="116" cy="102" rx="6.4" ry="3.7" fill="#f6eee4" />
                <g data-part="pupil">
                  <circle cx="116" cy="102" r="3" fill="#2a1b14" />
                  <circle cx="117" cy="101" r="0.85" fill="#fff" />
                </g>
                <path d="M109.4 100.6 C113 97.4 119 97.4 122.6 100.6" fill="none" stroke="#3a2518" strokeWidth="1.7" strokeLinecap="round" />
              </g>
            </g>
            {/* Nose: bridge shadow + tip */}
            <path d="M97.6 105 C96.8 110.5 95.6 114 96.6 116.6" fill="none" stroke="#c48a64" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
            <path
              d="M100.5 104 C99.6 111 97.8 115 99.3 117 C100.8 118.2 103.2 117.6 104.2 116.4"
              fill="none"
              stroke="#b0724f"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Mouth: neutral + smile (cross-faded), lower-lip light */}
            <path
              data-part="mouth"
              d="M92.5 128 C96.5 129.4 103.5 129.4 107.5 128"
              fill="none"
              stroke="#9a5645"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={smiling ? 0 : 1}
            />
            <path
              data-part="smile"
              d="M90.5 126 C95 132.5 105 132.5 109.5 126"
              fill="none"
              stroke="#9a5645"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity={smiling ? 1 : 0}
            />
            {/* Round mouth for surprise and yawns (hidden at rest) */}
            <ellipse data-part="mouth-o" cx="100" cy="129" rx="3.4" ry="4.2" fill="#7a3b30" opacity="0" />
            <path d="M95.5 133.2 C98.5 134.3 101.5 134.3 104.5 133.2" fill="none" stroke="#e8b491" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* Waving hand: parked below the disc until a wave */}
          <g data-part="hand" transform="translate(0 80)">
            <path d="M151 214 L155 168 C156 160 168 160 169 168 L173 214 Z" fill={url("sweater")} />
            <ellipse cx="152" cy="150" rx="2.8" ry="5.6" fill={url("face")} transform="rotate(-38 152 150)" />
            <ellipse cx="156" cy="139" rx="2.6" ry="6.4" fill={url("face")} />
            <ellipse cx="161" cy="137" rx="2.6" ry="6.8" fill={url("face")} />
            <ellipse cx="166" cy="138" rx="2.6" ry="6.4" fill={url("face")} />
            <ellipse cx="170.5" cy="141.5" rx="2.4" ry="5.4" fill={url("face")} />
            <ellipse cx="162" cy="153" rx="9.4" ry="10" fill={url("face")} />
          </g>

          {/* Tiny icebergs that orbit when he gets dizzy */}
          <g data-part="orbit" opacity="0" fill="#e6f7fb" stroke="#0b6f80" strokeWidth="1.2" strokeLinejoin="round">
            <path d="M95 44 L100 33 L106 44 Z" />
            <path d="M146 132 L151 121 L157 132 Z" />
            <path d="M44 132 L49 121 L55 132 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
