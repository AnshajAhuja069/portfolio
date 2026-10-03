"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mascot, type MascotAction, type MascotHandle } from "@/components/mascot/Mascot";
import { guide } from "@/content/guide";
import { getProject, publishedProjects } from "@/content/projects";
import { ScrollTrigger } from "@/lib/gsap";
import { GuideCard } from "./GuideCard";
import { GUIDE_CHANGE, isGuideHidden, setGuideHidden, store } from "./store";
import s from "./Guide.module.css";

type ActionId = "tour" | "dismiss" | "next" | "skip" | "done";

type Bubble = {
  text: string;
  /** Unprompted section comments: not announced (the card has the same info). */
  ambient?: boolean;
  /** Auto-dismiss after this many ms. */
  ttl?: number;
  step?: string;
  link?: { href: string; label: string };
  actions?: { label: string; id: ActionId; primary?: boolean }[];
};

const AMBIENT_GAP = 8000;
const AMBIENT_TTL = 4500;
const CLICK_QUIET = 3000;
const IDLE_MS = 25000;
const AWAY_RATIO = 0.35;
const RING = 2 * Math.PI * 34;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const phone = () => window.matchMedia("(max-width: 899.98px)").matches;
const subscribeHidden = (cb: () => void) => {
  window.addEventListener(GUIDE_CHANGE, cb);
  return () => window.removeEventListener(GUIDE_CHANGE, cb);
};

/**
 * Mini Anshaj: the mascot as a guide. He takes over from the hero disc once it
 * scrolls away, ducks out whenever another mascot is on screen, comments on
 * sections (rate limited), reacts to every click and can run a short tour.
 * See docs/motion-spec.md "Guide".
 */
export function Guide() {
  const pathname = usePathname();
  const router = useRouter();
  const mascot = useRef<MascotHandle>(null);
  const button = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  // Hidden flag lives in localStorage; the server snapshot says "hidden" so
  // nothing renders until the client knows.
  const hidden = useSyncExternalStore(subscribeHidden, isGuideHidden, () => true);
  const [away, setAway] = useState(true);
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [tour, setTour] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);

  // New page: start fresh (reset during render, not in an effect).
  const [route, setRoute] = useState(pathname);
  if (route !== pathname) {
    setRoute(pathname);
    setOpen(false);
    setBubble(null);
    setAway(true);
  }

  const visible = !hidden && (!away || tour !== null);
  const slug = pathname.startsWith("/work/") ? pathname.split("/")[2] : null;
  const isCase = !!(slug && getProject(slug));

  // Live values for observers and timers (they outlive a render).
  const live = useRef({ visible, open, tour, pathname });
  useEffect(() => {
    live.current = { visible, open, tour, pathname };
  });
  const meta = useRef({
    lastAmbient: 0,
    lastClick: 0,
    autoCount: 0,
    clicks: 0,
    clickTimer: 0 as ReturnType<typeof setTimeout> | 0,
    lastReaction: "" as MascotAction | "",
    greeted: false,
  });

  const react = (a: MascotAction) => mascot.current?.react(a);

  /** Unprompted bubble: once per section per visit, spaced out, quiet on phones. */
  const sayAmbient = useCallback((key: string, text: string | undefined) => {
    if (!text) return false;
    const m = meta.current;
    const { visible, open, tour, pathname } = live.current;
    const now = Date.now();
    if (!visible || open || tour !== null) return false;
    if (now - m.lastAmbient < AMBIENT_GAP || now - m.lastClick < CLICK_QUIET) return false;
    if (phone() && m.autoCount >= 2) return false;
    const k = `${pathname}#${key}`;
    if (store.seen().has(k)) return false;
    store.markSeen(k);
    m.lastAmbient = now;
    m.autoCount += 1;
    setBubble({ text, ambient: true, ttl: AMBIENT_TTL });
    return true;
  }, []);

  // ---- Tell the rest of the page (LiveDock offset) whether he is in the corner.
  useEffect(() => {
    document.documentElement.dataset.guide = visible ? (open ? "open" : "on") : "off";
  }, [visible, open]);

  // ---- Per page: remember the last case study, observe other mascots.
  useEffect(() => {
    meta.current.autoCount = 0;
    if (isCase && slug) store.set("guide:last", slug);

    const others = [...document.querySelectorAll("[data-guide-away]")];
    if (!others.length) {
      const raf = requestAnimationFrame(() => setAway(false));
      return () => cancelAnimationFrame(raf);
    }
    const state = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => state.set(e.target, e.isIntersecting && e.intersectionRatio >= AWAY_RATIO));
        const isAway = [...state.values()].some(Boolean);
        setAway(isAway);
        // Ducking out closes everything (the tour pins him in place).
        if (isAway && live.current.tour === null) {
          setOpen(false);
          setBubble(null);
        }
      },
      { threshold: [0, AWAY_RATIO, 1] },
    );
    others.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, isCase, slug]);

  // ---- Bubble auto-dismiss.
  useEffect(() => {
    if (!bubble?.ttl) return;
    const t = setTimeout(() => setBubble((b) => (b === bubble ? null : b)), bubble.ttl);
    return () => clearTimeout(t);
  }, [bubble]);

  // ---- Tour (driven from event handlers, one step at a time).
  const endTour = useCallback((done: boolean) => {
    setTour(null);
    setBubble({ text: done ? "That's the tour. Tap me anytime." : "No problem. Tap me if you need me.", ttl: 3200 });
    mascot.current?.react("wave");
  }, []);

  const goStep = useCallback((i: number) => {
    setTour(i);
    setBubble(null);
    document
      .querySelector(guide.tour[i].target)
      ?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
    mascot.current?.react(i === 0 ? "wave" : i % 2 ? "lookAround" : "nod");
  }, []);

  const startTour = useCallback(() => {
    setOpen(false);
    setBubble(null);
    if (live.current.pathname !== "/") {
      store.set("guide:tour", "1", "session");
      router.push("/");
      return;
    }
    goStep(0);
  }, [router, goStep]);

  // Arriving on the homepage from "Show me around" elsewhere.
  useEffect(() => {
    if (pathname !== "/" || store.get("guide:tour", "session") !== "1") return;
    store.remove("guide:tour", "session");
    const t = setTimeout(() => goStep(0), 700);
    return () => clearTimeout(t);
  }, [pathname, goStep]);

  // ---- Welcome: the first time ever he peeks and offers the tour; later
  // visits get a short "welcome back" once per session.
  useEffect(() => {
    if (!visible || meta.current.greeted) return;
    meta.current.greeted = true;
    if (store.get("guide:greeted", "session")) return;
    store.set("guide:greeted", "1", "session");
    // The greeting counts as a bubble, so section comments wait their turn.
    meta.current.lastAmbient = Date.now();

    const w = guide.welcome;
    const calm = reduced();
    const later = (fn: () => void, ms: number) => setTimeout(fn, ms);

    if (!store.get("guide:welcomed")) {
      store.set("guide:welcomed", "1");
      later(() => {
        if (!calm) setPeek(true);
        setBubble({
          text: w.first,
          ttl: 16000,
          actions: [
            { label: w.tour, id: "tour", primary: true },
            { label: w.explore, id: "dismiss" },
          ],
        });
      }, 250);
      later(() => setPeek(false), calm ? 250 : 1650);
      later(() => mascot.current?.react("wave"), calm ? 300 : 1750);
    } else {
      const last = store.get("guide:last");
      const p = last ? getProject(last) : undefined;
      later(() => {
        mascot.current?.react("wave");
        setBubble(
          p && p.slug !== slug
            ? { text: w.back, link: { href: `/work/${p.slug}`, label: p.short }, ttl: 7000 }
            : { text: w.backPlain, ttl: 5000 },
        );
      }, 400);
    }
  }, [visible, slug, startTour]);

  // ---- Brought back from "Hide me": wake up with a hello.
  useEffect(() => {
    if (!visible || store.get("guide:woken", "session") !== "1") return;
    store.remove("guide:woken", "session");
    const t = setTimeout(() => {
      mascot.current?.react("surprised");
      setBubble({ text: guide.woken, ttl: 3600 });
    }, 450);
    return () => clearTimeout(t);
  }, [visible]);

  // ---- Section bubbles.
  useEffect(() => {
    if (hidden) return;
    const sec = guide.sections;
    const targets: [string, string, string | undefined][] = [];
    if (pathname === "/") {
      targets.push(["#work-title", "work", sec.work]);
      publishedProjects.forEach((p) => targets.push([`#project-${p.slug}`, `project-${p.slug}`, sec.project[p.slug]]));
    } else if (isCase && slug) {
      targets.push(["#impact-title", "impact", sec.impact]);
      targets.push(["#decisions-title", "decisions", sec.decisions]);
      targets.push(["#gallery-title", "gallery", sec.gallery[slug] ?? sec.gallery.default]);
      targets.push(["#outcome-title", "outcome", sec.outcome]);
    }
    const byEl = new Map<Element, [string, string | undefined]>();
    targets.forEach(([sel, key, text]) => {
      const el = document.querySelector(sel);
      if (el) byEl.set(el, [key, text]);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const t = byEl.get(e.target);
          if (e.isIntersecting && t) sayAmbient(t[0], t[1]);
        }),
      { rootMargin: "0px 0px -40% 0px" },
    );
    byEl.forEach((_, el) => io.observe(el));

    // Contact: say goodbye as it comes into view, before he ducks out.
    const contact = pathname === "/" ? document.querySelector("#contact") : null;
    const io2 = new IntersectionObserver(
      ([e]) => e.isIntersecting && sayAmbient("contact", sec.contact),
      { rootMargin: "0px 0px -8% 0px" },
    );
    if (contact) io2.observe(contact);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, [hidden, pathname, isCase, slug, sayAmbient]);

  // ---- Ambient life: glance with the scroll, "whoa" on fast flicks, wave at
  // the end, the reading ring on case studies, and an idle yawn.
  useEffect(() => {
    if (!visible) return;
    const calm = reduced();
    let cooldown = 0;
    let waved = false;
    let lookReset: ReturnType<typeof setTimeout> | undefined;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - self.progress));
        if (calm) return;
        const now = Date.now();
        mascot.current?.look(0, self.direction > 0 ? 0.9 : -0.9);
        clearTimeout(lookReset);
        lookReset = setTimeout(() => mascot.current?.look(0, 0), 700);
        if (Math.abs(self.getVelocity()) > 4200 && now > cooldown) {
          cooldown = now + 5000;
          mascot.current?.react("whoa");
        }
        if (!waved && self.progress > 0.985) {
          waved = true;
          mascot.current?.react("wave");
          sayAmbient("end", guide.pageEnd);
        }
      },
    });
    if (ring.current) ring.current.style.strokeDashoffset = String(RING * (1 - st.progress));

    let idle: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (!calm) mascot.current?.react("yawn");
        setTimeout(() => sayAmbient("idle", guide.idle), calm ? 0 : 1800);
      }, IDLE_MS);
    };
    const events = ["scroll", "pointerdown", "keydown"] as const;
    events.forEach((ev) => window.addEventListener(ev, arm, { passive: true }));
    arm();

    return () => {
      st.kill();
      clearTimeout(lookReset);
      clearTimeout(idle);
      events.forEach((ev) => window.removeEventListener(ev, arm));
    };
  }, [visible, pathname, sayAmbient]);

  // ---- Esc closes the card or ends the tour; clicks outside close the card.
  useEffect(() => {
    if (!open && tour === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (live.current.tour !== null) endTour(false);
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (open && root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, tour, endTour]);

  // ---- Clicks: always a fresh reaction; repeated clicks escalate.
  const onAvatar = (e: React.MouseEvent) => {
    const m = meta.current;
    m.lastClick = Date.now();
    clearTimeout(m.clickTimer);
    m.clicks += 1;
    m.clickTimer = setTimeout(() => (m.clicks = 0), 2500);

    if (m.clicks >= 10) {
      m.clicks = 0;
      react("dizzy");
      setBubble({ text: guide.clicks[10], ttl: 2600 });
    } else {
      const pool = guide.reactions.filter((r) => r !== m.lastReaction);
      const r = pool[Math.floor(Math.random() * pool.length)];
      m.lastReaction = r;
      react(r);
      const line = guide.clicks[m.clicks];
      if (line) setBubble({ text: line, ttl: 2200 });
      // Opening the card replaces any bubble (it offers the same actions).
      else if (!open || bubble?.ambient) setBubble(null);
    }

    if (tour !== null) return;
    // Mouse spam keeps the card open; a keyboard press toggles it.
    if (!open) setOpen(true);
    else if (e.detail === 0) setOpen(false);
  };

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  const hide = () => {
    setOpen(false);
    setBubble(null);
    setGuideHidden(true);
  };
  const jump = (selector: string) => {
    setOpen(false);
    document.querySelector(selector)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  };

  const runAction = (id: ActionId) => {
    if (id === "tour") startTour();
    else if (id === "dismiss") setBubble(null);
    else if (id === "next" && tour !== null) goStep(tour + 1);
    else if (id === "skip") endTour(false);
    else if (id === "done") endTour(true);
  };

  // Hidden: a small sleeping tab in the corner brings him back.
  if (hidden) {
    if (away) return null;
    return (
      <button type="button" className={s.sleep} onClick={() => setGuideHidden(false)} aria-label={guide.sleeping}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="" width={40} height={40} />
        <span className={s.zzz} aria-hidden="true">
          z<span>z</span>
        </span>
      </button>
    );
  }

  // During the tour the bubble is the current step.
  const steps = guide.tour;
  const shown: Bubble | null =
    tour !== null
      ? {
          text: steps[tour].line,
          step: `${tour + 1} / ${steps.length}`,
          actions:
            tour === steps.length - 1
              ? [{ label: "Done", id: "done", primary: true }]
              : [
                  { label: "Next", id: "next", primary: true },
                  { label: "Skip", id: "skip" },
                ],
        }
      : bubble;
  const announced = shown && !shown.ambient ? shown.text : "";

  return (
    <div ref={root} className={s.root} data-visible={visible} data-peek={peek} data-open={open}>
      <p className="sr-only" role="status" aria-live="polite">
        {announced}
      </p>

      {open && visible && (
        <GuideCard pathname={pathname} onClose={close} onTour={startTour} onHide={hide} onJump={jump} />
      )}

      {shown && visible && (
        <div className={s.bubble} aria-hidden={shown.ambient || undefined} key={shown.text}>
          {shown.step && <span className={s.step}>{shown.step}</span>}
          <p>
            {shown.text}
            {shown.link && (
              <>
                {" "}
                <Link href={shown.link.href} onClick={() => setBubble(null)}>
                  {shown.link.label}
                </Link>
              </>
            )}
          </p>
          {shown.actions && (
            <div className={s.actions}>
              {shown.actions.map((a) => (
                <button key={a.label} type="button" className={a.primary ? s.primary : undefined} onClick={() => runAction(a.id)}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        ref={button}
        type="button"
        className={s.avatar}
        aria-label="Open guide"
        aria-expanded={open}
        aria-controls={open ? "guide-card" : undefined}
        aria-hidden={!visible || undefined}
        tabIndex={visible ? 0 : -1}
        onClick={onAvatar}
      >
        {isCase && (
          <svg className={s.ring} viewBox="0 0 76 76" aria-hidden="true" focusable="false">
            <circle cx="38" cy="38" r="34" className={s.ringTrack} />
            <circle
              ref={ring}
              cx="38"
              cy="38"
              r="34"
              className={s.ringFill}
              style={{ strokeDasharray: RING, strokeDashoffset: RING }}
            />
          </svg>
        )}
        <Mascot ref={mascot} interactive={false} />
      </button>
    </div>
  );
}
